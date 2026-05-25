import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import PageHero from "@/components/PageHero";
import SocialProof from "@/components/SocialProof";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { services } from "@/data/services";

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <PageHero
        eyebrow="Our Insurance Solutions"
        title="One Company. Many Solutions."
        subtitle="Comprehensive cover for every aspect of your life — from motor and marine to health, life and engineering."
      />

      <main className="flex-1">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 space-y-20">
            {services.map((s, i) => (
              <div
                key={s.slug}
                id={s.slug}
                className={`grid lg:grid-cols-2 gap-10 items-center scroll-mt-24 animate-fade-up ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <div className="relative">
                  <div className="absolute -inset-4 gradient-gold opacity-20 blur-2xl rounded-3xl" />
                  <img
                    src={s.image}
                    alt={s.title}
                    className="relative rounded-2xl shadow-large w-full h-80 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-5 left-5 h-16 w-16 rounded-2xl bg-background shadow-large flex items-center justify-center">
                    <s.icon className={`h-8 w-8 ${s.accent}`} />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold tracking-widest text-accent uppercase">0{i + 1} · Insurance</span>
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">{s.title}</h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{s.description}</p>

                  <div className="grid sm:grid-cols-2 gap-3 mb-8">
                    {s.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span className="text-foreground text-sm">{f}</span>
                      </div>
                    ))}
                  </div>

                  <Button asChild className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold">
                    <a href="https://wa.me/message/KVLRH3PCPJBGI1" target="_blank" rel="noopener noreferrer">Request a Quote <ArrowRight className="ml-2 h-4 w-4" /></a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SocialProof index={1} />
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default ServicesPage;
