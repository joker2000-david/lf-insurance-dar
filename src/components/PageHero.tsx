import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

const PageHero = ({ title, subtitle, eyebrow }: PageHeroProps) => (
  <section className="relative gradient-hero text-primary-foreground py-20 lg:py-28 overflow-hidden">
    <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" />

    <div className="container mx-auto px-4 relative z-10 text-center animate-fade-up">
      {eyebrow && (
        <span className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
          {eyebrow}
        </span>
      )}
      <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-balance">{title}</h1>
      {subtitle && <p className="text-lg lg:text-xl text-primary-foreground/85 max-w-2xl mx-auto">{subtitle}</p>}

      <nav className="mt-8 flex items-center justify-center gap-2 text-sm text-primary-foreground/80">
        <Link to="/" className="flex items-center gap-1 hover:text-accent transition-colors">
          <Home className="h-4 w-4" /> Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-accent font-medium">{title}</span>
      </nav>
    </div>
  </section>
);

export default PageHero;
