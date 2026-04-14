import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const pythonCode = `import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import LabelEncoder

df = pd.read_csv('/content/heart_attack_prediction_dataset.csv')

# --- ETAPA 1: Remoção de Colunas Irrelevantes ---
if 'Patient ID' in df.columns:
    df = df.drop(columns=['Patient ID'])
    print("- Coluna 'Patient ID' removida.")

# --- ETAPA 2: Tratamento da Pressão Arterial (Split) ---
# Transforma "130/80" em duas colunas numéricas
df[['Systolic', 'Diastolic']] = df['Blood Pressure'].str.split('/', expand=True).astype(int)
df = df.drop(columns=['Blood Pressure'])
print("- Coluna 'Blood Pressure' decomposta em 'Systolic' e 'Diastolic'.")

# --- ETAPA 3: Tratamento de Dados Faltantes e Duplicados ---
n_before = len(df)
df = df.drop_duplicates()
n_after = len(df)
print(f"- Duplicatas removidas: {n_before - n_after} linhas.")

for col in df.select_dtypes(include='number').columns:
    if df[col].isnull().any():
        df[col] = df[col].fillna(df[col].median())
 
for col in df.select_dtypes(include='object').columns:
    if df[col].isnull().any():
        df[col] = df[col].fillna(df[col].mode()[0])
 
print("- Nulos tratados: numéricos → mediana | categóricos → moda.")

# --- ETAPA 4: Transformação de Variáveis Categóricas (Encoding) ---

# A. Sexo (Binário: Male/Female)
df['Sex'] = df['Sex'].map({'Male': 0, 'Female': 1})

# B. Dieta (Ordinal: Unhealthy < Average < Healthy)
diet_map = {'Unhealthy': 0, 'Average': 1, 'Healthy': 2}
df['Diet'] = df['Diet'].map(diet_map)

le_encoders = {}
for col in ['Country', 'Continent', 'Hemisphere']:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    le_encoders[col] = le
 
print("- Encoders salvos em 'le_encoders' para possível uso futuro.")
print("- Colunas de texto convertidas em números.")

# --- ETAPA 5: Engenharia de Recursos (Criação de Faixas) ---

bmi_bins   = [0, 18.5, 25, 30, 100]
bmi_labels = ['Abaixo do Peso', 'Normal', 'Sobrepeso', 'Obeso']
df['BMI_Category']       = pd.cut(df['BMI'], bins=bmi_bins, labels=range(4)).astype(int)
df['BMI_Category_Label'] = pd.cut(df['BMI'], bins=bmi_bins, labels=bmi_labels)

age_bins   = [0, 18, 35, 50, 65, 100]
age_labels = ['Jovem', 'Adulto Jovem', 'Adulto', 'Sênior', 'Idoso']
df['Age_Group']       = pd.cut(df['Age'], bins=age_bins, labels=range(5)).astype(int)
df['Age_Group_Label'] = pd.cut(df['Age'], bins=age_bins, labels=age_labels)

df['Risk_Label'] = df['Heart Attack Risk'].map({0: 'Sem Risco', 1: 'Com Risco'})
 
print("- Colunas de label (_Label) criadas para visualização.")

# --- ETAPA 6: Verificação Final ---
print("\\n--- PRÉ-PROCESSAMENTO CONCLUÍDO ---")
print(f"Formato final: {df.shape}")
print(f"\\nDistribuição da variável-alvo:")
print(df['Heart Attack Risk'].value_counts().to_string())
print(f"\\nPorcentagem com risco: {df['Heart Attack Risk'].mean()*100:.1f}%")
print(f"\\nTipos de dados:")
print(df.dtypes.value_counts())

# Configuração de estilo dos gráficos
sns.set_theme(style=\"whitegrid\")
PALETTE_RISK = {0: '#5B8DB8', 1: '#C0392B'} 

# --- 1. MATRIZ DE CORRELAÇÃO ---
# Mostra quais variáveis têm mais impacto umas nas outras
cols_para_corr = [c for c in df.select_dtypes('number').columns
                  if c not in ['BMI_Category', 'Age_Group', 'Systolic', 'Diastolic']]
 
corr = df[cols_para_corr].corr()

corr_target = (corr['Heart Attack Risk']
               .drop('Heart Attack Risk')
               .sort_values())
 
fig, axes = plt.subplots(1, 2, figsize=(20, 8))

sns.heatmap(corr, annot=False, cmap='coolwarm', linewidths=0.3,
            vmin=-1, vmax=1, ax=axes[0])
axes[0].set_title(\"Matriz de Correlação Geral\", fontsize=14, fontweight='bold')

# Bar chart de correlação com the target
colors = ['#C0392B' if v > 0 else '#5B8DB8' for v in corr_target]
axes[1].barh(corr_target.index, corr_target.values, color=colors)
axes[1].axvline(0, color='black', linewidth=0.8)
axes[1].set_title(\"Correlação de Cada Variável com\\nHeart Attack Risk\", fontsize=14, fontweight='bold')
axes[1].set_xlabel(\"Coeficiente de Correlação de Pearson\")
# Linha de referência visual para |r| > 0.1 (fraca mas relevante)
axes[1].axvline(0.1,  color='gray', linestyle='--', linewidth=0.7, label='|r|=0.1')
axes[1].axvline(-0.1, color='gray', linestyle='--', linewidth=0.7)
axes[1].legend(fontsize=9)
 
plt.tight_layout()
plt.savefig('grafico1_correlacao.png', dpi=150, bbox_inches='tight')
plt.show()
print(\"✔ Gráfico 1 salvo.\")

# --- 2. RELAÇÃO PESO (BMI) VS PRESSÃO ARTERIAL ---
r_bmi_sys = df['BMI'].corr(df['Systolic'])
 
fig, axes = plt.subplots(1, 2, figsize=(18, 6))
 
sns.regplot(data=df, x='BMI', y='Systolic', ax=axes[0],
            scatter_kws={'alpha': 0.2, 'color': '#5B8DB8'},
            line_kws={'color': 'red', 'linewidth': 2})
axes[0].set_title(\"IMC vs Pressão Sistólica\", fontsize=13, fontweight='bold')
axes[0].annotate(f\"r = {r_bmi_sys:.4f}  (correlação quase nula)\",
                 xy=(0.05, 0.93), xycoords='axes fraction',
                 fontsize=11, color='red',
                 bbox=dict(boxstyle='round,pad=0.3', fc='lightyellow', ec='gray'))
 
sns.boxplot(data=df, x='BMI_Category_Label', y='Systolic',
            ax=axes[1], palette='viridis',
            order=['Abaixo do Peso', 'Normal', 'Sobrepeso', 'Obeso'])
axes[1].set_title(\"Pressão Sistólica por Categoria de IMC\", fontsize=13, fontweight='bold')
axes[1].set_xlabel(\"Categoria de IMC\")
 
plt.tight_layout()
plt.savefig('grafico2_bmi_pressao.png', dpi=150, bbox_inches='tight')
plt.show()

# --- 3. IMPACTO DA IDADE NO RISCO DE INFARTO ---
fig, axes = plt.subplots(1, 2, figsize=(18, 6))
 
# KDE (mantido, mas com mediana marcada)
for risk_val, label, color in [(1, 'Com Risco', '#C0392B'), (0, 'Sem Risco', '#5B8DB8')]:
    subset = df[df['Heart Attack Risk'] == risk_val]['Age']
    sns.kdeplot(subset, label=label, fill=True, color=color, alpha=0.5, ax=axes[0])
    axes[0].axvline(subset.median(), color=color, linestyle='--', linewidth=1.5,
                    label=f'Mediana {label}: {subset.median():.0f} anos')
 
axes[0].set_title(\"Distribuição de Idade por Grupo de Risco (KDE)\", fontsize=13, fontweight='bold')
axes[0].legend(fontsize=9)
axes[0].set_xlabel(\"Idade\")
 
# Proporção de risco por faixa etária
prop_risco = (df.groupby('Age_Group_Label', observed=True)['Heart Attack Risk']
              .mean()
              .reset_index())
prop_risco.columns = ['Faixa Etária', 'Proporção com Risco']
order_age = ['Jovem', 'Adulto Jovem', 'Adulto', 'Sênior', 'Idoso']
 
sns.barplot(data=prop_risco, x='Faixa Etária', y='Proporção com Risco',
            order=order_age, palette='Blues_d', ax=axes[1])
axes[1].set_title(\"Proporção de Risco por Faixa Etária\", fontsize=13, fontweight='bold')
axes[1].set_ylim(0, 0.5)
axes[1].axhline(df['Heart Attack Risk'].mean(), color='red', linestyle='--',
                linewidth=1.5, label=f\"Média geral ({df['Heart Attack Risk'].mean()*100:.1f}%)\")
axes[1].legend()
axes[1].set_xlabel(\"Faixa Etária\")
axes[1].set_ylabel(\"Proporção com Risco\")
 
plt.tight_layout()
plt.savefig('grafico3_idade.png', dpi=150, bbox_inches='tight')
plt.show()
print(\"✔ Gráfico 3 salvo.\")

# --- 4. HÁBITOS DE VIDA E RISCO CARDÍACO ---
diet_order  = ['Unhealthy', 'Average', 'Healthy']
diet_labels = ['Não Saudável', 'Média', 'Saudável']
prop_diet = (df.groupby('Diet')['Heart Attack Risk'].mean().reset_index())
prop_diet['Diet_Label'] = prop_diet['Diet'].map({0: 'Não Saudável', 1: 'Média', 2: 'Saudável'})
 
fig, axes = plt.subplots(1, 2, figsize=(18, 6))
 
sns.barplot(data=prop_diet, x='Diet_Label', y='Heart Attack Risk',
            order=diet_labels, palette='magma', ax=axes[0])
axes[0].axhline(df['Heart Attack Risk'].mean(), color='red', linestyle='--',
                linewidth=1.5, label=f\"Média geral ({df['Heart Attack Risk'].mean()*100:.1f}%)\")
axes[0].set_title(\"Proporção de Risco de Infarto por Tipo de Dieta\", fontsize=13, fontweight='bold')
axes[0].set_ylim(0, 0.5)
axes[0].legend()
axes[0].set_xlabel(\"Tipo de Dieta\")
axes[0].set_ylabel(\"Proporção com Risco\")
 
# Usando Risk_Label no boxplot de estresse (eixo X legível sem set_xticklabels)
sns.boxplot(data=df, x='Risk_Label', y='Stress Level',
            order=['Sem Risco', 'Com Risco'],
            palette={'Sem Risco': '#5B8DB8', 'Com Risco': '#C0392B'},
            ax=axes[1])
axes[1].set_title(\"Nível de Estresse vs Risco de Infarto\", fontsize=13, fontweight='bold')
axes[1].set_xlabel(\"Grupo de Risco\")
axes[1].set_ylabel(\"Nível de Estresse\")
 
plt.tight_layout()
plt.savefig('grafico4_habitos.png', dpi=150, bbox_inches='tight')
plt.show()
print(\"✔ Gráfico 4 salvo.\")

# --- 5. FATORES BIOQUÍMICOS (COLESTEROL E TRIGLICERÍDEOS) ---
fig, axes = plt.subplots(1, 2, figsize=(18, 6))

sns.scatterplot(data=df, x='Cholesterol', y='Triglycerides',
                hue='Risk_Label', alpha=0.4,
                palette={'Sem Risco': '#5B8DB8', 'Com Risco': '#C0392B'},
                ax=axes[0])
axes[0].set_title(\"Colesterol vs Triglicerídeos\\n(pontos coloridos por risco)\", fontsize=13, fontweight='bold')
axes[0].legend(title='Risco')
 
for risk_val, label, color in [(0, 'Sem Risco', '#5B8DB8'), (1, 'Com Risco', '#C0392B')]:
    subset = df[df['Heart Attack Risk'] == risk_val]
    sns.kdeplot(data=subset, x='Cholesterol', y='Triglycerides',
                levels=5, color=color, linewidths=1.5, label=label, ax=axes[1])
 
axes[1].set_title(\"Densidade 2D: Colesterol vs Triglicerídeos\\n(sobreposição das classes)\", fontsize=13, fontweight='bold')
axes[1].legend(title='Risco')
 
plt.tight_layout()
plt.savefig('grafico5_bioquimica.png', dpi=150, bbox_inches='tight')
plt.show()
print(\"✔ Gráfico 5 salvo.\")
 
# --- 6. ANÁLISE POR GÊNERO ---
prop_sexo = (df.groupby('Sex')['Heart Attack Risk']
             .mean()
             .reset_index())
prop_sexo['Gênero'] = prop_sexo['Sex'].map({0: 'Masculino', 1: 'Feminino'})
 
fig, axes = plt.subplots(1, 2, figsize=(16, 6))
 
# Gráfico de proporção (NOVO principal)
sns.barplot(data=prop_sexo, x='Gênero', y='Heart Attack Risk',
            palette={'Masculino': '#5B8DB8', 'Feminino': '#C0392B'},
            ax=axes[0])
axes[0].axhline(df['Heart Attack Risk'].mean(), color='black', linestyle='--',
                linewidth=1.5, label=f\"Média geral ({df['Heart Attack Risk'].mean()*100:.1f}%)\")
axes[0].set_title(\"Proporção de Risco de Infarto por Gênero\", fontsize=13, fontweight='bold')
axes[0].set_ylim(0, 0.5)
axes[0].legend()
axes[0].set_ylabel(\"Proporção com Risco\")
 
df_plot = df.copy()
df_plot['Gênero'] = df_plot['Sex'].map({0: 'Masculino', 1: 'Feminino'})
df_plot['Risco'] = df_plot['Heart Attack Risk'].map({0: 'Sem Risco', 1: 'Com Risco'})
 
sns.countplot(data=df_plot, x='Gênero', hue='Risco',
              palette={'Sem Risco': '#5B8DB8', 'Com Risco': '#C0392B'},
              ax=axes[1])
axes[1].set_title(\"Contagem Absoluta por Gênero\\n(⚠ Dataset desbalanceado: mais homens)\", fontsize=13, fontweight='bold')
axes[1].legend(title='Risco')
 
plt.tight_layout()
plt.savefig('grafico6_genero.png', dpi=150, bbox_inches='tight')
plt.show()
print(\"✔ Gráfico 6 salvo.\")
 
print(\"\n✅ Todos os gráficos gerados e salvos com sucesso!\")`;

const CodeSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="codigo" className="py-20">
      <div
        ref={ref}
        className={`container mx-auto px-4 transition-all duration-700 ${
          isVisible ? "animate-fade-up" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Acesse o Código
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          Todo o pré-processamento e geração dos gráficos foi realizado em Python, utilizando pandas, seaborn e
          scikit-learn. O código está disponível abaixo para visualização.
        </p>

        <div className="max-w-4xl mx-auto relative">
          <div className="flex items-center justify-between bg-foreground rounded-t-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-health-red" />
              <div className="w-3 h-3 rounded-full bg-accent" />
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <span className="text-xs text-muted font-mono">analysis.py</span>
            <button
              onClick={handleCopy}
              className="text-xs bg-primary/20 hover:bg-primary/30 text-primary-foreground px-3 py-1 rounded transition-colors font-medium"
            >
              {copied ? "✓ Copiado!" : "Copiar código"}
            </button>
          </div>
          <div className="bg-foreground rounded-b-xl overflow-x-auto max-h-[500px] overflow-y-auto">
            <pre className="p-4 text-xs md:text-sm leading-relaxed">
              <code className="text-primary-foreground font-mono whitespace-pre">{pythonCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeSection;
