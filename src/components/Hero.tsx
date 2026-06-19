import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, CheckCircle, Star, PhoneCall } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";
import { WHATSAPP_URL } from "@/lib/whatsapp";

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-primary">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 gradient-hero opacity-95" />
      </div>

      {/* Decorative gold shape (echo of flyer's gold arrow) */}
      <div className="absolute top-0 right-0 w-1/3 h-full hidden lg:block">
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div className="text-primary-foreground animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/40 backdrop-blur mb-6">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-accent font-semibold text-xs tracking-widest uppercase">Licensed by TIRA · TIBA Member</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.05] mb-6 text-balance">
              <span className="block text-primary-foreground/80 text-3xl lg:text-4xl font-light tracking-wide mb-2">
                Securing Today
              </span>
              Protecting
              <span className="block text-accent">Tomorrow.</span>
            </h1>

            <p className="text-lg lg:text-xl text-primary-foreground/85 mb-8 max-w-xl leading-relaxed">
              At LF Insurance Brokers Limited, we provide reliable and affordable insurance solutions tailored to your needs — across Dar es Salaam and all Tanzania.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold shadow-gold">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Get Free Quote <ArrowRight className="ml-2 h-5 w-5" /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold">
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>

            {/* Inline social proof */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 max-w-md">
              <div className="flex -space-x-2">
                {[testimonial1, testimonial2, testimonial3].map((img, i) => (
                  <img key={i} src={img} alt="" className="h-10 w-10 rounded-full border-2 border-primary object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />)}
                  <span className="ml-2 text-xs font-semibold">98% Satisfaction</span>
                </div>
                <p className="text-xs text-primary-foreground/70">Trusted by 5,000+ Tanzanians</p>
              </div>
            </div>
          </div>

          {/* RIGHT - Trust card */}
          <div className="animate-slide-in">
            <div className="relative">
              {/* Floating gold badge */}
              <div className="absolute -top-4 -right-4 z-20 h-24 w-24 rounded-full gradient-gold flex items-center justify-center text-accent-foreground font-bold text-center shadow-gold animate-float">
                <div>
                  <div className="text-2xl leading-none">98%</div>
                  <div className="text-[10px]">Satisfaction</div>
                </div>
              </div>

              <div className="bg-background/95 backdrop-blur rounded-2xl p-7 shadow-large">
                <h3 className="text-2xl font-bold text-primary mb-1">Quick Quote Request</h3>
                <p className="text-sm text-muted-foreground mb-6">Get a tailored quote in under 24 hours.</p>

                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer"); }}>
                  <input type="text" placeholder="Full Name" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
                  <input type="tel" placeholder="Phone Number (+255...)" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground" />
                  <select className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground">
                    <option value="">Select Insurance Type</option>
                    <option>Motor Insurance</option>
                    <option>Health Insurance</option>
                    <option>Fire & Perils</option>
                    <option>Marine Insurance</option>
                    <option>Travel Insurance</option>
                    <option>Life Insurance</option>
                    <option>Engineering Insurance</option>
                    <option>Personal Accident</option>
                  </select>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-bold h-12">
                    Get Free Quote on WhatsApp <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="mt-5 pt-5 border-t border-border flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Prefer to talk?</span>
                  <a href="tel:+255713464894" className="flex items-center gap-2 font-bold text-primary hover:text-accent transition-colors">
                    <PhoneCall className="h-4 w-4" /> +255 713 464 894
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar (echoes flyer's 5 pillars) */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6">
          {[
            { t: "TRUSTED", s: "Professional advice you can rely on" },
            { t: "CUSTOMER FOCUSED", s: "Your satisfaction is our priority" },
            { t: "COMPREHENSIVE", s: "Wide range of insurance solutions" },
            { t: "AFFORDABLE", s: "Quality cover at competitive rates" },
            { t: "CLAIMS SUPPORT", s: "Fast, fair and hassle-free" },
          ].map((p) => (
            <div key={p.t} className="text-center p-4 rounded-xl bg-primary-foreground/5 backdrop-blur border border-primary-foreground/10">
              <CheckCircle className="h-6 w-6 mx-auto text-accent mb-2" />
              <div className="text-xs font-bold text-accent tracking-wider">{p.t}</div>
              <div className="text-[11px] text-primary-foreground/70 mt-1 leading-snug">{p.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
