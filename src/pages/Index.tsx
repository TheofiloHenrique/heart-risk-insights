import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DatasetSection from "@/components/DatasetSection";
import Footer from "@/components/Footer";
import RiskAssessment from "@/pages/RiskAssessment";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const AssessmentSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section id="assessment" className="py-20 bg-background">
      <div
        ref={ref}
        className={`container mx-auto px-4 transition-all duration-700 ${
          isVisible ? "animate-fade-up" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Heart Attack Risk Assessment
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Answer a few quick questions to get an AI-powered estimate of your heart attack risk. Runs entirely
          in your browser — no data is sent anywhere.
        </p>
        <RiskAssessment />
      </div>
    </section>
  );
};

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <AssessmentSection />
    <DatasetSection />
    <Footer />
  </div>
);

export default Index;
