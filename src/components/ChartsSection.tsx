import { useScrollAnimation } from "@/hooks/useScrollAnimation";

import matrizImg from "@/assets/matriz-correlacao.png";
import imcImg from "@/assets/imc-pressao.png";
import idadeImg from "@/assets/idade-risco.png";
import habitosImg from "@/assets/habitos.png";
import colesterolImg from "@/assets/colesterol-triglicerideos.png";
import generoImg from "@/assets/genero-risco.png";

const charts = [
  {
    title: "Matriz de Correlação Geral",
    image: matrizImg,
    description:
      'O heatmap revela que praticamente nenhuma variável apresenta correlação superior a 0,02 com o risco de infarto — valores próximos de zero em todo o mapa. O gráfico de barras auxiliar torna essa ausência de correlação ainda mais evidente. Clinicamente, esperaríamos correlações de 0,2 a 0,4 para fatores como colesterol e pressão arterial. Esse é o primeiro indicativo de que o dataset foi gerado de forma sintética, sem uma estrutura causal real.',
  },
  {
    title: "IMC vs Pressão Sistólica",
    image: imcImg,
    description:
      "A linha de regressão quase horizontal (r = 0,004) confirma: neste dataset, o índice de massa corporal não prediz a pressão arterial. Os boxplots por categoria de IMC (Abaixo do Peso → Obeso) mostram medianas praticamente idênticas em torno de 135 mmHg. Na literatura médica, pacientes obesos frequentemente apresentam pressão sistólica elevada — a ausência desse padrão aqui reforça a natureza artificial dos dados.",
  },
  {
    title: "Distribuição de Idade por Risco",
    image: idadeImg,
    description:
      "As curvas KDE dos grupos 'Com Risco' e 'Sem Risco' são virtualmente idênticas ao longo de toda a faixa etária (18–90 anos). O gráfico de proporção por faixa etária confirma: Jovens, Adultos e Idosos têm praticamente a mesma taxa de risco (~35%). Em dados reais, o risco cardíaco aumenta significativamente após os 55–60 anos. Essa uniformidade entre faixas etárias é uma assinatura característica de dados gerados aleatoriamente.",
  },
  {
    title: "Hábitos de Vida e Risco",
    image: habitosImg,
    description:
      "Dois achados contra-intuitivos: a dieta 'Saudável' apresenta proporção de risco ligeiramente maior que a 'Não Saudável' (36,5% vs 35,8%), e os níveis de estresse são idênticos entre pacientes com e sem risco. Ambos os resultados são estatisticamente irrelevantes e contradizem ampla evidência científica. A linha vermelha tracejada marca a média geral de 35,8% — nenhuma categoria se afasta dela de forma significativa.",
  },
  {
    title: "Colesterol vs Triglicerídeos",
    image: colesterolImg,
    description:
      "O scatterplot mostra pontos das duas classes completamente misturados, sem nenhuma região de separação visível. O gráfico de densidade 2D (KDE contour) confirma: os contornos de 'Com Risco' e 'Sem Risco' se sobrepõem quase perfeitamente. Em dados reais, altos valores de colesterol LDL e triglicerídeos estão associados ao aumento do risco cardiovascular — padrão inexistente aqui.",
  },
  {
    title: "Análise por Gênero",
    image: generoImg,
    description:
      "O gráfico de proporção revela que Masculino (35,9%) e Feminino (35,6%) apresentam risco estatisticamente igual. O segundo gráfico exibe a contagem absoluta, evidenciando o desbalanceamento do dataset (6.111 homens vs 2.652 mulheres) — detalhe importante: se analisarmos apenas a contagem bruta, podemos erroneamente concluir que homens têm mais risco, quando na verdade as proporções são idênticas.",
  },
];

const ChartCard = ({
  title,
  image,
  description,
  index,
}: {
  title: string;
  image: string;
  description: string;
  index: number;
}) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const reversed = index % 2 !== 0;

  return (
    <div
      ref={ref}
      className={`flex flex-col ${
        reversed ? "lg:flex-row-reverse" : "lg:flex-row"
      } gap-8 items-center transition-all duration-700 ${
        isVisible ? "animate-fade-up" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="lg:w-3/5 w-full">
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <img
            src={image}
            alt={title}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      </div>
      <div className="lg:w-2/5 w-full">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
          Gráfico {index + 1}
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
          {description}
        </p>
      </div>
    </div>
  );
};

const ChartsSection = () => (
  <section id="graficos" className="py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
        Os Gráficos
      </h2>
      <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
        Análise visual detalhada dos principais fatores de risco
      </p>

      <div className="space-y-20">
        {charts.map((chart, i) => (
          <ChartCard key={i} {...chart} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default ChartsSection;
