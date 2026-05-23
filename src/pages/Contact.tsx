import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import PageHero from "@/components/PageHero";
import Contact from "@/components/Contact";
import SocialProof from "@/components/SocialProof";

const ContactPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navigation />
    <PageHero eyebrow="Get In Touch" title="Contact LF Insurance Brokers" subtitle="Call us today on +255 713 464 894 or send us a message — we'll respond within 24 hours." />
    <main className="flex-1">
      <Contact />
      <SocialProof variant="dark" index={4} />
    </main>
    <Footer />
    <Chatbot />
  </div>
);

export default ContactPage;
