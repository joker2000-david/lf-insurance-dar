import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Heart, 
  Home, 
  Building, 
  Plane, 
  Users, 
  Shield, 
  ArrowRight 
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Car,
      title: "Auto Insurance",
      description: "Comprehensive vehicle coverage including third-party, comprehensive, and commercial vehicle insurance.",
      features: ["Third Party Coverage", "Comprehensive Coverage", "Commercial Vehicles", "Motorcycle Insurance"],
      color: "text-blue-600"
    },
    {
      icon: Heart,
      title: "Health Insurance",
      description: "Medical coverage for individuals and families with extensive hospital networks across Tanzania.",
      features: ["Individual Plans", "Family Coverage", "Corporate Health", "Maternity Benefits"],
      color: "text-red-600"
    },
    {
      icon: Home,
      title: "Property Insurance",
      description: "Protect your home and belongings against fire, theft, natural disasters, and other risks.",
      features: ["Home Insurance", "Contents Cover", "Fire & Perils", "Burglary Protection"],
      color: "text-green-600"
    },
    {
      icon: Building,
      title: "Business Insurance",
      description: "Comprehensive business protection including property, liability, and business interruption coverage.",
      features: ["Public Liability", "Professional Indemnity", "Business Interruption", "Equipment Cover"],
      color: "text-purple-600"
    },
    {
      icon: Plane,
      title: "Travel Insurance",
      description: "Stay protected while traveling with coverage for medical emergencies, trip cancellation, and more.",
      features: ["Medical Expenses", "Trip Cancellation", "Lost Luggage", "Emergency Evacuation"],
      color: "text-orange-600"
    },
    {
      icon: Users,
      title: "Life Insurance",
      description: "Secure your family's financial future with term life, whole life, and group life insurance options.",
      features: ["Term Life", "Whole Life", "Group Life", "Investment Plans"],
      color: "text-indigo-600"
    }
  ];

  return (
    <section id="services" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-primary font-semibold text-lg">Our Services</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Comprehensive Insurance Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We offer a wide range of insurance products to protect what matters most to you. 
            From personal to business insurance, we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-medium transition-all duration-300 animate-fade-up border-0 shadow-soft" style={{animationDelay: `${index * 100}ms`}}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <service.icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="gradient-primary text-white font-semibold">
            Get Personalized Quote
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;