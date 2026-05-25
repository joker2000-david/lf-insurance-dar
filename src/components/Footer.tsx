import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowUp
} from "lucide-react";
import logo from "@/assets/lf-logo.jpeg";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks: Record<string, { label: string; href: string }[]> = {
    "Insurance Services": [
      { label: "Motor Insurance", href: "/services#motor-insurance" },
      { label: "Health Insurance", href: "/services#health-insurance" },
      { label: "Fire & Perils", href: "/services#fire-perils-insurance" },
      { label: "Marine Insurance", href: "/services#marine-insurance" },
      { label: "Travel Insurance", href: "/services#travel-insurance" },
      { label: "Family Insurance", href: "/services#family-insurance" },
    ],
    "Quick Links": [
      { label: "About Us", href: "/about" },
      { label: "Get Quote", href: "https://wa.me/message/KVLRH3PCPJBGI1" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Blog", href: "/blog" },
    ],
    "Legal": [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Claims Policy", href: "#" },
      { label: "Complaints Procedure", href: "#" },
      { label: "Regulatory Information", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute top-20 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-white rounded-full translate-y-12"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <img src={logo} alt="LF Insurance Brokers" className="h-12 w-12 rounded-full" />
                <div>
                  <h3 className="text-xl font-bold">LF Insurance Brokers</h3>
                  <p className="text-sm opacity-90">Never Worry About Losses</p>
                </div>
              </div>
              
              <p className="text-primary-foreground/90 mb-6 leading-relaxed">
                Your trusted insurance partner in Dar es Salaam. We provide comprehensive 
                insurance solutions to protect what matters most to you and your business.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span className="text-sm">Dar es Salaam, Tanzania</span>
                </div>
                <a href="tel:+255713464894" className="flex items-center space-x-3 hover:text-accent transition-colors">
                  <Phone className="h-5 w-5 text-accent" />
                  <span className="text-sm">+255 713 464 894</span>
                </a>
                <a href="mailto:info@lfinsurance.co.tz" className="flex items-center space-x-3 hover:text-accent transition-colors">
                  <Mail className="h-5 w-5 text-accent" />
                  <span className="text-sm">info@lfinsurance.co.tz</span>
                </a>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-accent" />
                  <span className="text-sm">Mon-Fri: 8AM-6PM</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-lg font-bold mb-6">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-primary-foreground/80 hover:text-accent transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-primary-foreground/20 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
              <p className="text-primary-foreground/90">
                Subscribe to our newsletter for the latest insurance news, tips, and exclusive offers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-primary-foreground placeholder-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-foreground/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            <div className="text-center md:text-left">
              <p className="text-primary-foreground/80 text-sm">
                © 2025 LF Insurance Brokers Ltd. All rights reserved.
              </p>
              <p className="text-primary-foreground/60 text-xs mt-1">
                Licensed by TIRA • Member of ATIB • Professional Indemnity Insured
              </p>
            </div>

            <div className="flex items-center space-x-6">
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 group"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-primary-foreground/80 group-hover:text-accent transition-colors" />
                  </a>
                ))}
              </div>

              {/* Back to Top */}
              <Button
                onClick={scrollToTop}
                variant="outline"
                size="sm"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-white hover:text-primary"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Back to Top
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;