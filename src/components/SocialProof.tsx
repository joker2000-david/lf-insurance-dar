import { Star } from "lucide-react";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";
import testimonial4 from "@/assets/testimonial-4.jpg";
import testimonial5 from "@/assets/testimonial-5.jpg";
import testimonial6 from "@/assets/testimonial-6.jpg";

const proofs = [
  { img: testimonial1, name: "Amina H.", role: "Business Owner", quote: "Claim settled in 5 days. Truly the best brokers in Dar." },
  { img: testimonial2, name: "John M.", role: "Marketing Director", quote: "Saved us 30% on our fleet cover with better protection." },
  { img: testimonial3, name: "Grace M.", role: "HR Manager", quote: "Group health plan our staff actually love." },
  { img: testimonial4, name: "Fatuma S.", role: "Restaurant Owner", quote: "They stood by me when fire hit my business." },
  { img: testimonial5, name: "David M.", role: "Fleet Manager", quote: "24/7 claims support that genuinely answers." },
  { img: testimonial6, name: "Hassan K.", role: "Developer", quote: "Project risk handled with real expertise." },
];

interface SocialProofProps {
  variant?: "default" | "dark";
  index?: number;
}

const SocialProof = ({ variant = "default", index = 0 }: SocialProofProps) => {
  const proof = proofs[index % proofs.length];
  const isDark = variant === "dark";

  return (
    <section className={`py-10 ${isDark ? "bg-primary text-primary-foreground" : "bg-secondary/50"}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10 animate-fade-up">
          {/* Avatar stack */}
          <div className="flex -space-x-3 shrink-0">
            {[testimonial1, testimonial2, testimonial3, testimonial4, testimonial5].map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Happy client"
                className={`h-12 w-12 rounded-full object-cover border-2 ${isDark ? "border-primary" : "border-background"}`}
              />
            ))}
            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isDark ? "bg-accent text-accent-foreground border-primary" : "bg-accent text-accent-foreground border-background"}`}>
              5k+
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
              <span className={`ml-2 text-sm font-semibold ${isDark ? "text-primary-foreground/90" : "text-foreground"}`}>
                4.9/5 from 5,000+ clients
              </span>
            </div>
            <p className={`text-sm md:text-base italic ${isDark ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
              "{proof.quote}"
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <img src={proof.img} alt={proof.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-accent" />
            <div>
              <div className={`font-bold ${isDark ? "" : "text-foreground"}`}>{proof.name}</div>
              <div className={`text-xs ${isDark ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{proof.role}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
