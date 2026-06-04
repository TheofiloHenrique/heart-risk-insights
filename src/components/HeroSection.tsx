import EcgLine from "./EcgLine";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const HeroSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 flex items-center opacity-20 pointer-events-none">
        <EcgLine />
      </div>

      <div
        ref={ref}
        className={`container mx-auto px-4 text-center relative z-10 transition-all duration-700 ${
          isVisible ? "animate-fade-up" : "opacity-0 translate-y-8"
        }`}
      >
        <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          AI & Machine Learning · Academic Project
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-foreground">
          Heart Attack Risk
          <br />
          <span className="text-primary">Assessment</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          A browser-based AI tool that estimates your heart attack risk from 18 clinical and
          lifestyle indicators. Private, instant, and powered by a model trained on{" "}
          <span className="font-semibold text-foreground">8,763 patients</span>.
        </p>

        <button
          onClick={() => document.getElementById("assessment")?.scrollIntoView({ behavior: "smooth" })}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Start Assessment
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <EcgLine />
      </div>
    </section>
  );
};

export default HeroSection;
