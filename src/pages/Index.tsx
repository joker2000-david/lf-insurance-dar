import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import SocialProof from "@/components/SocialProof";
import CalculatorSection from "@/components/CalculatorSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <SocialProof index={0} />
      <Services />
      <SocialProof variant="dark" index={1} />
      <CalculatorSection />
      <SocialProof index={2} />
      <Testimonials />
      <SocialProof variant="dark" index={3} />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
