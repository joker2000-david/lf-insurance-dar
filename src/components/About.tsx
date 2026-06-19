import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Award, 
  Clock, 
  MapPin,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const About = () => {
  const stats = [
    {
      icon: Users,
      number: "5,000+",
      label: "Happy Clients",
      color: "text-blue-600"
    },
    {
      icon: Award,
      number: "15+",
      label: "Years Experience",
      color: "text-green-600"
    },
    {
      icon: Clock,
      number: "24/7",
      label: "Customer Support",
      color: "text-orange-600"
    },
    {
      icon: MapPin,
      number: "10+",
      label: "Branch Locations",
      color: "text-purple-600"
    }
  ];

  const values = [
    "Licensed by Tanzania Insurance Regulatory Authority (TIRA)",
    "Member of Tanzania Insurance Brokers Association (TIBA)",
    "ISO 9001:2015 Quality Management System Certified",
    "Professional Indemnity Insurance Cover"
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <div className="animate-fade-up">
            <div className="flex items-center space-x-2 mb-6">
              <Badge variant="secondary" className="text-primary font-semibold px-4 py-2">
                About LF Insurance Brokers
              </Badge>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Your Trusted Insurance Partner in 
              <span className="text-primary"> Dar es Salaam</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Established with a vision to provide comprehensive insurance solutions, LF Insurance Brokers 
              has been serving individuals and businesses across Tanzania for over 15 years. We pride ourselves 
              on our commitment to excellence and personalized service.
            </p>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Located in the heart of Dar es Salaam, we understand the unique risks and challenges faced by 
              our clients. Our team of experienced professionals works tirelessly to ensure you get the best 
              coverage at competitive rates.
            </p>

            <div className="space-y-3 mb-8">
              {values.map((value, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="gradient-primary text-white font-semibold">
                <a href="https://wa.me/message/KVLRH3PCPJBGI1" target="_blank" rel="noopener noreferrer">
                  Contact Us Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-semibold">
                <a href="https://wa.me/message/KVLRH3PCPJBGI1" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="animate-slide-in">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 shadow-medium">
              <h3 className="text-2xl font-bold text-center mb-8 text-foreground">Why Choose Us?</h3>
              
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="mb-4 flex justify-center">
                      <div className="p-4 rounded-full bg-white shadow-soft group-hover:shadow-medium transition-all duration-300">
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-foreground">{stat.number}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-white rounded-xl shadow-soft">
                <h4 className="font-bold text-foreground mb-3">Our Mission</h4>
                <p className="text-muted-foreground leading-relaxed">
                  To provide our clients with comprehensive insurance solutions that offer peace of mind 
                  and financial security, ensuring they never have to worry about losses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;