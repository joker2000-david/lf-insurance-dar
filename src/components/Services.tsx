import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { services } from "@/data/services";

const Services = () => {
  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      {/* decorative blob */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-4">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-primary font-semibold text-sm tracking-wide uppercase">Our Insurance Solutions</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Comprehensive cover for <span className="text-primary">every aspect of your life</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One company. Many solutions. Total peace of mind — explore the policies trusted by thousands of Tanzanians.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {services.map((s, i) => (
            <Card
              key={s.slug}
              className="group overflow-hidden border-0 shadow-soft hover:shadow-large hover:-translate-y-1 transition-all duration-500 animate-fade-up bg-card"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute top-4 left-4 h-12 w-12 rounded-xl bg-background/95 backdrop-blur flex items-center justify-center shadow-medium">
                  <s.icon className={`h-6 w-6 ${s.accent}`} />
                </div>
                <h3 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-primary-foreground">
                  {s.title}
                </h3>
              </div>

              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed min-h-[3rem]">{s.short}</p>
                <ul className="grid grid-cols-2 gap-2">
                  {s.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="ghost" className="w-full justify-between hover:bg-primary hover:text-primary-foreground group/btn">
                  <Link to={`/services#${s.slug}`}>
                    Learn More
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-14 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl gradient-primary text-primary-foreground shadow-large">
            <div className="text-left">
              <p className="font-bold text-lg">One Company. Many Solutions. Total Peace of Mind.</p>
              <p className="text-sm text-primary-foreground/80">Talk to a broker today — free, no obligation.</p>
            </div>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
              <a href="https://wa.me/message/KVLRH3PCPJBGI1" target="_blank" rel="noopener noreferrer">Get Personalized Quote <ArrowRight className="ml-2 h-5 w-5" /></a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
