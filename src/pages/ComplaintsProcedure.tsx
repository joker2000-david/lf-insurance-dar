import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";

const ComplaintsProcedure = () => (
  <div className="min-h-screen flex flex-col">
    <Navigation />
    <PageHero eyebrow="Legal" title="Complaints Procedure" subtitle="How to raise a concern and how we will resolve it fairly and quickly." />
    <main className="flex-1">
      <LegalContent>
        <p>
          We are committed to delivering excellent service. If something has gone wrong, we want to
          hear about it and put it right.
        </p>

        <h2>Step 1 — Contact us directly</h2>
        <p>
          Speak to your account handler or contact our Customer Care team. Most concerns are resolved
          on the spot.
        </p>
        <ul>
          <li>Phone: <a href="tel:+255713464894">+255 713 464 894</a></li>
          <li>Email: <a href="mailto:info@lfinsurance.co.tz">info@lfinsurance.co.tz</a></li>
          <li>In person at our Dar es Salaam office.</li>
        </ul>

        <h2>Step 2 — Formal complaint</h2>
        <p>
          If you're not satisfied with the initial response, submit a formal complaint in writing to
          <a href="mailto:complaints@lfinsurance.co.tz"> complaints@lfinsurance.co.tz</a>. Please include:
        </p>
        <ul>
          <li>Your full name, policy number and preferred contact details.</li>
          <li>A clear description of the issue and what outcome you are seeking.</li>
          <li>Copies of any relevant documents or correspondence.</li>
        </ul>

        <h2>Our response times</h2>
        <ul>
          <li>Acknowledgement within 2 working days.</li>
          <li>Full written response within 14 working days.</li>
          <li>If more time is needed, we will explain why and give an expected resolution date.</li>
        </ul>

        <h2>Step 3 — Escalation</h2>
        <p>
          If you remain unhappy after our final response, you can escalate the matter to the Tanzania
          Insurance Regulatory Authority (TIRA), the industry regulator responsible for consumer
          protection in insurance.
        </p>

        <h2>Confidentiality</h2>
        <p>
          All complaints are treated confidentially and will not affect the way we handle your policies
          or future business with us.
        </p>
      </LegalContent>
    </main>
    <Footer />
    <Chatbot />
  </div>
);

export default ComplaintsProcedure;
