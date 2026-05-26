import { Home, Car, Users, HeartPulse, Plane, Shield, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/lf-logo.jpeg";

const pillars = [
  { icon: Home, t: "PROPERTY", s: "Home, business & assets" },
  { icon: Car, t: "MOTOR", s: "Comprehensive vehicle cover" },
  { icon: Users, t: "BUSINESS", s: "Safeguard your growth" },
  { icon: HeartPulse, t: "LIFE & HEALTH", s: "Secure loved ones" },
  { icon: Plane, t: "TRAVEL", s: "Wherever life takes you" },
];

const FlyerHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-foreground overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-32 w-[28rem] h-[28rem] rounded-full bg-primary-foreground/5 blur-3xl" />

      <div className="container mx-auto px-4 py-10 lg:py-14 relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 mb-4">
              <Shield className="h-3.5 w-3.5 text-accent" />
              <span className="text-accent font-semibold text-[11px] tracking-widest uppercase">Licensed by TIRA</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-[1.05] mb-3">
              NEVER WORRY <span className="text-accent">ABOUT LOSSES</span>
            </h1>
            <p className="text-base lg:text-lg text-primary-foreground/80 max-w-xl">
              Reliable cover. Trusted advice. Total peace of mind — tailored insurance solutions across Tanzania.
            </p>
          </div>

          <img src={logo} alt="LF Insurance Brokers" className="h-28 w-28 lg:h-36 lg:w-36 rounded-full ring-4 ring-accent/40 shadow-gold object-cover" />
        </div>

        {/* Pillar icons row — mimics flyer left column */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {pillars.map((p) => (
            <div key={p.t} className="flex items-center gap-3 p-3 rounded-xl bg-primary-foreground/10 backdrop-blur border border-primary-foreground/15 hover:bg-primary-foreground/15 transition">
              <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                <p.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-accent tracking-wider">{p.t}</div>
                <div className="text-[11px] text-primary-foreground/70 truncate">{p.s}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact strip — mimics flyer "Get In Touch" */}
        <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
          <a href="tel:+255713464894" className="flex items-center gap-2 p-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 hover:border-accent/50 transition">
            <Phone className="h-4 w-4 text-accent" /> +255 713 464 894
          </a>
          <a href="mailto:Fredy.msangi@lfinsurance.co.tz" className="flex items-center gap-2 p-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 hover:border-accent/50 transition">
            <Mail className="h-4 w-4 text-accent" /> Fredy.msangi@lfinsurance.co.tz
          </a>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10">
            <MapPin className="h-4 w-4 text-accent" /> Tiger Tower, Kinondoni Rd · Dar es Salaam
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlyerHero;
