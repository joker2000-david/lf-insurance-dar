import Navigation from "@/components/Navigation";
import FlyerHero from "@/components/FlyerHero";
import CalculatorSection from "@/components/CalculatorSection";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <FlyerHero />
      <CalculatorSection />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
