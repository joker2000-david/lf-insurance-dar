import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import PageHero from "@/components/PageHero";
import CalculatorSection from "@/components/CalculatorSection";

const CalculatorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PageHero
        eyebrow="Instant Estimate"
        title="Insurance Calculator"
        subtitle="Get an instant indicative premium for motor or family medical cover — based on Strategis 2025/2026 rates and TIRA-aligned motor tariffs."
      />
      <CalculatorSection />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default CalculatorPage;
