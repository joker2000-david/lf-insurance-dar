import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import PageHero from "@/components/PageHero";
import About from "@/components/About";
import SocialProof from "@/components/SocialProof";
import { Card, CardContent } from "@/components/ui/card";
import { Handshake, ShieldCheck, FileText, Clock, ShieldHalf } from "lucide-react";

const AboutPage = () => {
  const reasons = [
    { icon: ShieldCheck, title: "Experienced Team", desc: "Qualified professionals with in-depth industry knowledge." },
    { icon: Handshake, title: "Independent Advice", desc: "We work for you, not the insurance companies." },
    { icon: FileText, title: "Tailored Solutions", desc: "Customized insurance plans to suit your unique needs." },
    { icon: Clock, title: "Fast & Efficient", desc: "Quick turnaround time for quotes and claims." },
    { icon: ShieldHalf, title: "Financial Strength", desc: "Partnered with top-rated insurance companies." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <PageHero
        eyebrow="About Us"
        title="Why Choose LF Insurance Brokers?"
        subtitle="Your trust. Our promise. Your security. Our priority."
      />

      <main className="flex-1">
        <About />

        <section className="py-20 bg-secondary/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">Why Choose LF Insurance Brokers Ltd?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Five reasons clients across Tanzania choose us as their insurance partner.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reasons.map((r, i) => (
                <Card key={r.title} className="border-0 shadow-soft hover:shadow-medium transition-all animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <CardContent className="p-6 flex gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                      <r.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{r.title}</h3>
                      <p className="text-sm text-muted-foreground">{r.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <SocialProof variant="dark" index={2} />
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default AboutPage;
