import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";

const ClaimsPolicy = () => (
  <div className="min-h-screen flex flex-col">
    <Navigation />
    <PageHero eyebrow="Legal" title="Claims Policy" subtitle="How to notify a claim and what to expect from LF Insurance Brokers." />
    <main className="flex-1">
      <LegalContent>
        <p>
          We treat every claim with urgency and transparency. This policy explains the steps to follow
          when you need to claim, the information we need, and our service commitments.
        </p>

        <h2>1. Notify us immediately</h2>
        <p>
          Report a claim as soon as possible — ideally within 24 hours of the incident, and no later
          than 7 days. Late notification may prejudice your claim.
        </p>
        <ul>
          <li>Call our 24/7 claims line: <a href="tel:+255713464894">+255 713 464 894</a></li>
          <li>WhatsApp us with photos and details of the incident.</li>
          <li>Email <a href="mailto:claims@lfinsurance.co.tz">claims@lfinsurance.co.tz</a>.</li>
        </ul>

        <h2>2. Information we need</h2>
        <ul>
          <li>Policy number and insured name.</li>
          <li>Date, time and location of the incident.</li>
          <li>Description of what happened and estimated loss.</li>
          <li>Photos or supporting documents (police abstract, medical reports, invoices).</li>
        </ul>

        <h2>3. Our service commitment</h2>
        <ul>
          <li>Acknowledge your claim within 24 hours.</li>
          <li>Appoint a loss adjuster (where needed) within 3 working days.</li>
          <li>Provide status updates at least every 7 days until settlement.</li>
          <li>Push underwriters to settle valid claims within the timelines set by TIRA.</li>
        </ul>

        <h2>4. Repudiated or partial claims</h2>
        <p>
          If a claim is declined or reduced, we will explain the reason in writing and help you
          understand your options, including escalation to the underwriter or to TIRA.
        </p>

        <div className="not-prose mt-10 flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="gradient-primary text-white font-semibold">
            <a href="https://wa.me/message/KVLRH3PCPJBGI1" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 mr-2" /> Report a claim on WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-semibold">
            <a href="tel:+255713464894"><Phone className="h-5 w-5 mr-2" /> Call +255 713 464 894</a>
          </Button>
        </div>
      </LegalContent>
    </main>
    <Footer />
    <Chatbot />
  </div>
);

export default ClaimsPolicy;
