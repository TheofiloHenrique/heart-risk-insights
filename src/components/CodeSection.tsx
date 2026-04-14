import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const pythonCode = `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

# Carregar dataset
df = pd.read_csv("heart_attack_prediction_dataset.csv")

# Informações gerais
print(f"Shape: {df.shape}")
print(f"Colunas: {df.columns.tolist()}")
print(df.describe())

# Separar pressão arterial em Systolic e Diastolic
df[['Systolic', 'Diastolic']] = df['Blood Pressure'].str.split('/', expand=True).astype(float)

# Mapear variáveis categóricas
diet_map = {'Unhealthy': 0, 'Average': 1, 'Healthy': 2}
df['Diet_num'] = df['Diet'].map(diet_map)

# =============================
# GRÁFICO 1 — Matriz de Correlação
# =============================
numeric_cols = df.select_dtypes(include=[np.number]).columns
corr_matrix = df[numeric_cols].corr()

fig, axes = plt.subplots(1, 2, figsize=(20, 10))

sns.heatmap(corr_matrix, annot=False, cmap='coolwarm', center=0,
            vmin=-1, vmax=1, ax=axes[0])
axes[0].set_title("Matriz de Correlação Geral", fontsize=14)

target_corr = corr_matrix['Heart Attack Risk'].drop('Heart Attack Risk').sort_values()
colors = ['#c0392b' if x > 0 else '#2980b9' for x in target_corr]
axes[1].barh(target_corr.index, target_corr.values, color=colors)
axes[1].set_title("Correlação de Cada Variável com\\nHeart Attack Risk", fontsize=14)
axes[1].axvline(x=0.1, color='gray', linestyle='--', alpha=0.5)
axes[1].axvline(x=-0.1, color='gray', linestyle='--', alpha=0.5)

plt.tight_layout()
plt.savefig("Matriz.png", dpi=150, bbox_inches='tight')
plt.show()

# =============================
# GRÁFICO 2 — IMC vs Pressão Sistólica
# =============================
fig, axes = plt.subplots(1, 2, figsize=(18, 7))

axes[0].scatter(df['BMI'], df['Systolic'], alpha=0.3, s=20, color='steelblue')
slope, intercept, r, p, se = stats.linregress(df['BMI'], df['Systolic'])
x_line = np.linspace(df['BMI'].min(), df['BMI'].max(), 100)
axes[0].plot(x_line, slope * x_line + intercept, 'r-', linewidth=2)
axes[0].set_title("IMC vs Pressão Sistólica", fontsize=14)
axes[0].set_xlabel("BMI")
axes[0].set_ylabel("Systolic")
axes[0].text(0.02, 0.95, f'r = {r:.4f}  (correlação quase nula)',
             transform=axes[0].transAxes, fontsize=10, color='red',
             bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.8))

bins_bmi = pd.cut(df['BMI'], bins=[0, 18.5, 25, 30, 100],
                  labels=['Abaixo do Peso', 'Normal', 'Sobrepeso', 'Obeso'])
df['BMI_cat'] = bins_bmi
sns.boxplot(data=df, x='BMI_cat', y='Systolic', ax=axes[1],
            palette='viridis', order=['Abaixo do Peso', 'Normal', 'Sobrepeso', 'Obeso'])
axes[1].set_title("Pressão Sistólica por Categoria de IMC", fontsize=14)

plt.tight_layout()
plt.savefig("Peso_x_Pressao_arterial.png", dpi=150, bbox_inches='tight')
plt.show()

# =============================
# GRÁFICO 3 — Idade por Grupo de Risco
# =============================
fig, axes = plt.subplots(1, 2, figsize=(18, 7))

for risk, color, label in [(1, 'red', 'Com Risco'), (0, 'blue', 'Sem Risco')]:
    subset = df[df['Heart Attack Risk'] == risk]
    subset['Age'].plot(kind='kde', ax=axes[0], color=color, alpha=0.5, label=label)
    axes[0].fill_between(
        np.linspace(subset['Age'].min(), subset['Age'].max(), 200),
        0,
        stats.gaussian_kde(subset['Age'])(np.linspace(subset['Age'].min(), subset['Age'].max(), 200)),
        alpha=0.2, color=color
    )
    median_age = subset['Age'].median()
    axes[0].axvline(median_age, color=color, linestyle='--', alpha=0.7,
                    label=f'Mediana {label}: {median_age:.0f} anos')

axes[0].set_title("Distribuição de Idade por Grupo de Risco (KDE)", fontsize=14)
axes[0].set_xlabel("Idade")
axes[0].legend()

bins_age = pd.cut(df['Age'], bins=[0, 25, 35, 50, 65, 100],
                  labels=['Jovem', 'Adulto Jovem', 'Adulto', 'Sênior', 'Idoso'])
df['Age_group'] = bins_age
prop = df.groupby('Age_group')['Heart Attack Risk'].mean()
prop.plot(kind='bar', ax=axes[1], color=plt.cm.Blues(np.linspace(0.3, 0.9, len(prop))))
axes[1].axhline(y=df['Heart Attack Risk'].mean(), color='red', linestyle='--',
                label=f'Média geral ({df["Heart Attack Risk"].mean()*100:.1f}%)')
axes[1].set_title("Proporção de Risco por Faixa Etária", fontsize=14)
axes[1].legend()
axes[1].tick_params(axis='x', rotation=0)

plt.tight_layout()
plt.savefig("Idade_Risco.png", dpi=150, bbox_inches='tight')
plt.show()

# =============================
# GRÁFICO 4 — Hábitos de Vida
# =============================
fig, axes = plt.subplots(1, 2, figsize=(18, 7))

diet_risk = df.groupby('Diet')['Heart Attack Risk'].mean()
diet_risk.plot(kind='bar', ax=axes[0], color=['#2c003e', '#8e3a7d', '#e8825e'])
axes[0].axhline(y=df['Heart Attack Risk'].mean(), color='red', linestyle='--',
                label=f'Média geral ({df["Heart Attack Risk"].mean()*100:.1f}%)')
axes[0].set_title("Proporção de Risco de Infarto por Tipo de Dieta", fontsize=14)
axes[0].set_ylabel("Proporção com Risco")
axes[0].legend()
axes[0].tick_params(axis='x', rotation=0)

risk_labels = df['Heart Attack Risk'].map({0: 'Sem Risco', 1: 'Com Risco'})
sns.boxplot(data=df, x=risk_labels, y='Stress Level', ax=axes[1],
            palette=['steelblue', '#b5533e'])
axes[1].set_title("Nível de Estresse vs Risco de Infarto", fontsize=14)

plt.tight_layout()
plt.savefig("habitos.png", dpi=150, bbox_inches='tight')
plt.show()

# =============================
# GRÁFICO 5 — Colesterol vs Triglicerídeos
# =============================
fig, axes = plt.subplots(1, 2, figsize=(20, 8))

for risk, color, label in [(0, 'steelblue', 'Sem Risco'), (1, 'indianred', 'Com Risco')]:
    subset = df[df['Heart Attack Risk'] == risk]
    axes[0].scatter(subset['Cholesterol'], subset['Triglycerides'],
                    alpha=0.3, s=15, color=color, label=label)

axes[0].set_title("Colesterol vs Triglicerídeos\\n(pontos coloridos por risco)", fontsize=14)
axes[0].set_xlabel("Cholesterol")
axes[0].set_ylabel("Triglycerides")
axes[0].legend(title='Risco')

for risk, color, label in [(0, 'blue', 'Sem Risco'), (1, 'red', 'Com Risco')]:
    subset = df[df['Heart Attack Risk'] == risk]
    sns.kdeplot(x=subset['Cholesterol'], y=subset['Triglycerides'],
                ax=axes[1], color=color, levels=5, linewidths=1.5, label=label)

axes[1].set_title("Densidade 2D: Colesterol vs Triglicerídeos\\n(sobreposição das classes)", fontsize=14)
axes[1].legend(title='Risco')

plt.tight_layout()
plt.savefig("Fatores_Bioquimicos.png", dpi=150, bbox_inches='tight')
plt.show()

# =============================
# GRÁFICO 6 — Risco por Gênero
# =============================
fig, axes = plt.subplots(1, 2, figsize=(18, 7))

sex_map = {0: 'Masculino', 1: 'Feminino'}
df['Sex_label'] = df['Sex'].map(sex_map)

gender_risk = df.groupby('Sex_label')['Heart Attack Risk'].mean()
gender_risk.plot(kind='bar', ax=axes[0], color=['steelblue', '#b5533e'], width=0.5)
axes[0].axhline(y=df['Heart Attack Risk'].mean(), color='black', linestyle='--',
                label=f'Média geral ({df["Heart Attack Risk"].mean()*100:.1f}%)')
axes[0].set_title("Proporção de Risco de Infarto por Gênero", fontsize=14)
axes[0].set_ylabel("Proporção com Risco")
axes[0].legend()
axes[0].tick_params(axis='x', rotation=0)

gender_counts = df.groupby(['Sex_label', 'Heart Attack Risk']).size().unstack()
gender_counts.columns = ['Sem Risco', 'Com Risco']
gender_counts.plot(kind='bar', ax=axes[1], color=['steelblue', '#b5533e'])
axes[1].set_title("Contagem Absoluta por Gênero\\n(⚠ Dataset desbalanceado: mais homens)", fontsize=14)
axes[1].tick_params(axis='x', rotation=0)

plt.tight_layout()
plt.savefig("Risco_infarto_por_genero.png", dpi=150, bbox_inches='tight')
plt.show()

print("\\n✅ Todos os gráficos gerados com sucesso!")`;

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
