import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import SocialProof from "@/components/SocialProof";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <SocialProof index={0} />
      <Services />
      <SocialProof variant="dark" index={1} />
      <About />
      <SocialProof index={2} />
      <Testimonials />
      <FAQ />
      <SocialProof variant="dark" index={3} />
      <Blog />
      <SocialProof index={4} />
      <Contact />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
