import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import PageHero from "@/components/PageHero";
import Blog from "@/components/Blog";
import SocialProof from "@/components/SocialProof";

const BlogPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navigation />
    <PageHero eyebrow="Insurance Insights" title="Blog & News" subtitle="Tips, guides and expert insights to help you make smarter insurance decisions." />
    <main className="flex-1">
      <Blog />
      <SocialProof index={3} />
    </main>
    <Footer />
    <Chatbot />
  </div>
);

export default BlogPage;
