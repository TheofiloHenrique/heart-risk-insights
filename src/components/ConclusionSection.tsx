import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const highlights = [
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" strokeLinecap="round" />
      </svg>
    ),
    title: "Correlação nula",
    text: "Nenhuma variável supera r = 0,02 com o target",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Dataset sintético",
    text: "Gerado sem estrutura causal real entre variáveis",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Aprendizado central",
    text: "Qualidade dos dados > complexidade do modelo",
  },
];

const ConclusionSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="conclusao" className="py-20 bg-card">
      <div
        ref={ref}
        className={`container mx-auto px-4 transition-all duration-700 ${
          isVisible ? "animate-fade-up" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          O que os dados nos ensinaram?
        </h2>
        <div className="max-w-3xl mx-auto mb-14">
          <p className="text-muted-foreground leading-relaxed text-center text-sm md:text-base">
            A principal lição desta análise exploratória não é sobre o coração — é sobre{" "}
            <span className="font-semibold text-foreground">dados</span>. Um modelo de Machine Learning treinado neste
            dataset pode até atingir acurácia razoável, mas estará aprendendo{" "}
            <span className="font-semibold text-health-red">ruído</span>, não padrões reais. Datasets sintéticos são
            ferramentas valiosas para aprender técnicas de análise e modelagem, mas nunca devem ser utilizados para
            embasar decisões clínicas reais. A qualidade e a representatividade dos dados determinam o teto de qualquer
            modelo de IA.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="bg-background rounded-xl p-6 border border-border text-center hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                {h.icon}
              </div>
              <h3 className="font-bold text-foreground mb-2">{h.title}</h3>
              <p className="text-sm text-muted-foreground">{h.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConclusionSection;
