import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, ArrowRight } from "lucide-react";
import logo from "@/assets/lf-logo.jpeg";
import { WHATSAPP_URL } from "@/lib/whatsapp";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const navItems = [
    { name: "Home", to: "/" },
    { name: "Services", to: "/services" },
    { name: "Calculator", to: "/calculator" },
    { name: "About", to: "/about" },
    { name: "Blog", to: "/blog" },
    { name: "FAQ", to: "/faq" },
    { name: "Contact", to: "/contact" },
    { name: "Admin", to: "/admin" },
  ];

  return (
    <>
      {/* Top utility bar */}
      <div className="hidden md:block bg-primary text-primary-foreground text-xs">
        <div className="container mx-auto px-4 h-9 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a href="tel:+255713464894" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone className="h-3.5 w-3.5" /> +255 713 464 894
            </a>
            <a href="mailto:info@lfinsurance.co.tz" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Mail className="h-3.5 w-3.5" /> info@lfinsurance.co.tz
            </a>
          </div>
          <p className="font-semibold tracking-wide text-accent">NEVER WORRY ABOUT LOSSES</p>
        </div>
      </div>

      <nav className="sticky top-0 w-full bg-background/95 backdrop-blur-md border-b border-border z-50 shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src={logo} alt="LF Insurance Brokers" className="h-12 w-12 rounded-full ring-2 ring-primary/20 group-hover:ring-accent transition" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-primary leading-tight">LF Insurance Brokers</h1>
                <p className="text-[10px] tracking-widest text-accent font-semibold">NEVER WORRY ABOUT LOSSES</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors ${active ? "text-primary" : "text-foreground hover:text-primary"}`}
                  >
                    {item.name}
                    {active && <span className="absolute -bottom-1 left-4 right-4 h-0.5 bg-accent rounded-full" />}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <Button asChild className="hidden md:inline-flex bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Get a Quote <ArrowRight className="ml-1 h-4 w-4" /></a>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {isOpen && (
            <div className="lg:hidden pb-4 animate-fade-up">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-md text-foreground hover:bg-secondary hover:text-primary font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
                <Button asChild className="mt-3 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>Get a Quote</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
