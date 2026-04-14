import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const metrics = [
  { value: "8.763", label: "Pacientes", icon: "👥" },
  { value: "20", label: "Países / 6 Continentes", icon: "🌍" },
  { value: "26", label: "Variáveis Analisadas", icon: "📊" },
  { value: "35,8%", label: "Com Risco Positivo", icon: "❤️" },
];

const DatasetSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="dataset" className="py-20 bg-card">
      <div
        ref={ref}
        className={`container mx-auto px-4 transition-all duration-700 ${
          isVisible ? "animate-fade-up" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Sobre o Dataset
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Heart Attack Risk Prediction — Kaggle
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-background rounded-xl p-6 text-center border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <span className="text-3xl mb-3 block">{m.icon}</span>
              <div className="text-2xl md:text-3xl font-extrabold text-primary mb-1">
                {m.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto bg-muted/50 rounded-xl p-6 border border-border">
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            O dataset <span className="font-semibold text-foreground">Heart Attack Risk Prediction</span> (Kaggle) é
            sintético, gerado para fins acadêmicos. Isso significa que as variáveis foram criadas sem um modelo causal
            real entre elas — característica que se refletiu diretamente nos resultados da análise e que será discutida
            ao longo desta apresentação.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DatasetSection;
