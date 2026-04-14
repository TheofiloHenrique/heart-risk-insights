import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DatasetSection from "@/components/DatasetSection";
import ChartsSection from "@/components/ChartsSection";
import ConclusionSection from "@/components/ConclusionSection";
import CodeSection from "@/components/CodeSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <DatasetSection />
    <ChartsSection />
    <ConclusionSection />
    <CodeSection />
    <Footer />
  </div>
);

export default Index;
