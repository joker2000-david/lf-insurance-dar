import {
  Car, Flame, Ship, Plane, HeartPulse, ShieldCheck, Settings, UserCheck, Users, Home,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  image: string;
  accent: string; // tailwind class for icon tint
};

export const services: Service[] = [
  {
    slug: "motor-insurance",
    title: "Motor Insurance",
    short: "Comprehensive cover for private & commercial vehicles.",
    description:
      "Protect your private car, commercial fleet or motorcycle against accident, theft, fire and third-party liability with policies tailored to Tanzanian roads.",
    features: ["Third Party Cover", "Comprehensive Cover", "Commercial Fleet", "Motorcycle Insurance"],
    icon: Car,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=600&fit=crop",
    accent: "text-primary",
  },
  {
    slug: "fire-perils-insurance",
    title: "Fire & Perils Insurance",
    short: "Protection for your property, assets and business.",
    description:
      "Safeguard buildings, stock and equipment against fire, lightning, explosion, floods, earthquake and allied perils.",
    features: ["Buildings & Contents", "Stock & Inventory", "Loss of Profit", "Allied Perils"],
    icon: Flame,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=900&h=600&fit=crop",
    accent: "text-accent",
  },
  {
    slug: "marine-insurance",
    title: "Marine Insurance",
    short: "Coverage for goods, vessels and marine operations.",
    description:
      "Cover imports, exports, hull, freight and inland transit. We help importers and exporters in Dar es Salaam port move cargo with confidence.",
    features: ["Marine Cargo", "Hull & Machinery", "Freight Cover", "Inland Transit"],
    icon: Ship,
    image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=900&h=600&fit=crop",
    accent: "text-primary",
  },
  {
    slug: "travel-insurance",
    title: "Travel Insurance",
    short: "Travel with peace of mind anywhere in the world.",
    description:
      "From business trips to family holidays — get medical, trip cancellation, baggage and emergency evacuation cover for every journey.",
    features: ["Medical Expenses", "Trip Cancellation", "Lost Luggage", "Emergency Evacuation"],
    icon: Plane,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&h=600&fit=crop",
    accent: "text-accent",
  },
  {
    slug: "health-insurance",
    title: "Health Insurance",
    short: "Quality healthcare for you and your loved ones.",
    description:
      "Access top hospitals across Tanzania with individual, family and corporate medical schemes including outpatient, inpatient and maternity.",
    features: ["Individual Plans", "Family Cover", "Corporate Schemes", "Maternity Benefits"],
    icon: HeartPulse,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&h=600&fit=crop",
    accent: "text-primary",
  },
  {
    slug: "liability-insurance",
    title: "Liability Insurance",
    short: "Protect your business against legal & third-party claims.",
    description:
      "Cover legal costs and damages arising from public liability, professional indemnity, product liability and employers' liability.",
    features: ["Public Liability", "Professional Indemnity", "Product Liability", "Employers' Liability"],
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&h=600&fit=crop",
    accent: "text-accent",
  },
  {
    slug: "engineering-insurance",
    title: "Engineering Insurance",
    short: "Cover for construction, machinery and engineering projects.",
    description:
      "Comprehensive cover for contractors' all-risk, erection all-risk, machinery breakdown and electronic equipment.",
    features: ["Contractors All Risk", "Erection All Risk", "Machinery Breakdown", "Electronic Equipment"],
    icon: Settings,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&h=600&fit=crop",
    accent: "text-primary",
  },
  {
    slug: "personal-accident",
    title: "Personal Accident Insurance",
    short: "Financial protection in the event of accident or injury.",
    description:
      "Lump-sum compensation for accidental death, permanent disability, medical expenses and weekly income benefits.",
    features: ["Accidental Death", "Permanent Disability", "Medical Expenses", "Weekly Benefits"],
    icon: UserCheck,
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=900&h=600&fit=crop",
    accent: "text-accent",
  },
  {
    slug: "personal-life",
    title: "Personal Life Insurance",
    short: "Secure your personal financial goals and obligations.",
    description:
      "Term life, whole life and endowment plans that protect your dependants and grow your savings over time.",
    features: ["Term Life", "Whole Life", "Endowment Plans", "Accidental Death Cover"],
    icon: Users,
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&h=600&fit=crop",
    accent: "text-primary",
  },
  {
    slug: "family-insurance",
    title: "Family Insurance",
    short: "Comprehensive protection for every member of your family.",
    description:
      "Flexible family plans covering life, education, spouse protection and continuous family income.",
    features: ["Family Life Cover", "Child Education", "Spouse Protection", "Family Income Benefit"],
    icon: Home,
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=900&h=600&fit=crop",
    accent: "text-accent",
  },
];
