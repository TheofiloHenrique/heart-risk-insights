import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const metrics = [
  { value: "8,763", label: "Patients", icon: "👥" },
  { value: "20", label: "Countries / 6 Continents", icon: "🌍" },
  { value: "26", label: "Variables Analyzed", icon: "📊" },
  { value: "35.8%", label: "Positive Risk Cases", icon: "❤️" },
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
          About the Dataset
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
            The <span className="font-semibold text-foreground">Heart Attack Risk Prediction</span> dataset
            (Kaggle) is synthetic, generated for academic purposes. The AI model powering this assessment
            was trained on these 8,763 patient records spanning 20 countries across 6 continents, using 18
            clinical and lifestyle features to estimate heart attack risk.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DatasetSection;
