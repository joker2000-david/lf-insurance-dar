import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";
import testimonial4 from "@/assets/testimonial-4.jpg";
import testimonial5 from "@/assets/testimonial-5.jpg";
import testimonial6 from "@/assets/testimonial-6.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Amina Hassan",
      position: "Business Owner",
      company: "Hassan Trading Co.",
      image: testimonial1,
      rating: 5,
      text: "LF Insurance Brokers provided excellent service when I needed business insurance for my trading company. They explained all options clearly and helped me choose the right coverage. When I had a claim, they handled everything professionally and quickly. Highly recommended!"
    },
    {
      name: "John Mwalimu",
      position: "Marketing Director",
      company: "Kilimanjaro Tours Ltd",
      image: testimonial2,
      rating: 5,
      text: "After working with several insurance brokers, I can confidently say LF Insurance Brokers is the best in Dar es Salaam. Their team is knowledgeable, responsive, and always puts the client first. They saved us money while improving our coverage."
    },
    {
      name: "Grace Moshi",
      position: "HR Manager",
      company: "Temeke Manufacturing",
      image: testimonial3,
      rating: 5,
      text: "The team at LF Insurance helped us design a comprehensive group health insurance plan for our employees. Their attention to detail and commitment to finding the best rates made the process smooth. Our employees are very satisfied with the coverage."
    },
    {
      name: "Fatuma Selemani",
      position: "Restaurant Owner",
      company: "Msimbazi Street Kitchen",
      image: testimonial4,
      rating: 5,
      text: "When fire damaged my restaurant, LF Insurance Brokers handled my claim with such professionalism and speed. They guided me through every step and ensured I received fair compensation quickly. I was back in business within weeks thanks to their excellent service."
    },
    {
      name: "David Mbwambo",
      position: "Fleet Manager",
      company: "Coastal Transport Services",
      image: testimonial5,
      rating: 5,
      text: "Managing insurance for our 50+ vehicle fleet was challenging until we found LF Insurance Brokers. They negotiated excellent rates, streamlined our policy management, and their 24/7 claims support has been invaluable when accidents happen on the road."
    },
    {
      name: "Mzee Hassan Kitwana",
      position: "Property Developer",
      company: "Kitwana Developments",
      image: testimonial6,
      rating: 5,
      text: "After 30 years in business, I can say LF Insurance Brokers provides the most comprehensive and affordable property insurance in Dar es Salaam. Their expertise in construction risks and attention to detail gives me complete peace of mind on all my projects."
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <Badge variant="secondary" className="text-primary font-semibold px-4 py-2 mb-4">
            Client Testimonials
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Our Clients Say About Us
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our valued clients have to say about 
            their experience with LF Insurance Brokers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-large transition-all duration-300 animate-fade-up border-0 shadow-medium relative overflow-hidden"
              style={{animationDelay: `${index * 150}ms`}}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4">
                <Quote className="h-8 w-8 text-primary/20" />
              </div>

              <CardContent className="p-8">
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current text-accent" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground leading-relaxed mb-6 relative z-10">
                  "{testimonial.text}"
                </p>

                {/* Client Info */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover shadow-soft"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-primary font-medium">{testimonial.position}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Join thousands of satisfied customers</p>
          <div className="flex items-center justify-center space-x-4">
            <div className="flex -space-x-2">
              {[testimonial1, testimonial2, testimonial3, testimonial4, testimonial5, testimonial6].slice(0, 5).map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt="Client"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div className="text-sm">
              <div className="font-semibold text-foreground">5,000+ Happy Clients</div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-current text-accent" />
                <span className="text-muted-foreground">4.9/5 Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;