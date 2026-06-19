import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "What types of insurance does LF Insurance Brokers offer?",
      answer: "We offer comprehensive insurance solutions including Auto Insurance, Health Insurance, Property Insurance, Business Insurance, Travel Insurance, and Life Insurance. Each category has multiple coverage options to meet your specific needs."
    },
    {
      question: "How do I file a claim with my insurance policy?",
      answer: "Filing a claim is simple with LF Insurance Brokers. You can contact our 24/7 claims hotline, visit our office in Dar es Salaam, or submit your claim online through our customer portal. Our claims team will guide you through the entire process to ensure quick settlement."
    },
    {
      question: "Are you licensed to operate in Tanzania?",
      answer: "Yes, LF Insurance Brokers is fully licensed by the Tanzania Insurance Regulatory Authority (TIRA) and is a registered member of the Tanzania Insurance Brokers Association (TIBA). We maintain all required certifications and professional indemnity coverage."
    },
    {
      question: "How quickly can I get an insurance quote?",
      answer: "We provide instant quotes for most insurance products. For standard auto and health insurance, you can receive a quote within minutes. For complex business insurance, we typically provide detailed quotes within 24 hours after assessing your needs."
    },
    {
      question: "Do you offer group insurance for businesses?",
      answer: "Absolutely! We specialize in group insurance solutions for businesses of all sizes. This includes group health insurance, group life insurance, workers' compensation, and comprehensive business insurance packages tailored to your industry."
    },
    {
      question: "What is the claims settlement ratio of your partner insurance companies?",
      answer: "We work only with reputable insurance companies that maintain high claims settlement ratios (typically above 95%). We carefully select our insurance partners based on their financial stability, claims settlement record, and customer service quality."
    },
    {
      question: "Can I modify my insurance policy after purchase?",
      answer: "Yes, most insurance policies can be modified to meet changing needs. You can increase or decrease coverage, add beneficiaries, or change policy terms. Our team will help you make these changes and explain any impact on premiums or coverage."
    },
    {
      question: "Do you provide insurance for imported vehicles?",
      answer: "Yes, we provide comprehensive insurance coverage for imported vehicles. We can arrange coverage even before the vehicle arrives in Tanzania and help with all documentation required by customs and SUMATRA for vehicle registration."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16 animate-fade-up">
          <Badge variant="secondary" className="text-primary font-semibold px-4 py-2 mb-4">
            <HelpCircle className="h-4 w-4 mr-2" />
            Frequently Asked Questions
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Got Questions? We Have Answers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to the most commonly asked questions about our insurance services, 
            claims process, and coverage options.
          </p>
        </div>

        <div className="animate-fade-up">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-lg shadow-soft border-0 px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12 animate-fade-up">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 shadow-medium">
            <h3 className="text-2xl font-bold text-foreground mb-4">Still Have Questions?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our friendly customer service team is here to help. 
              Get in touch and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-primary text-white font-semibold">
                <a href="https://wa.me/message/KVLRH3PCPJBGI1" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Chat on WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-semibold">
                <a href="tel:+255713464894">Call +255 713 464 894</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;