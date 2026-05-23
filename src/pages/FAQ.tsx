import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import PageHero from "@/components/PageHero";
import FAQ from "@/components/FAQ";
import SocialProof from "@/components/SocialProof";

const FAQPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navigation />
    <PageHero eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Quick answers to the most common questions about our insurance services." />
    <main className="flex-1">
      <FAQ />
      <SocialProof index={5} />
    </main>
    <Footer />
    <Chatbot />
  </div>
);

export default FAQPage;
