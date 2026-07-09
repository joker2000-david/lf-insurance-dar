import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";

const PrivacyPolicy = () => (
  <div className="min-h-screen flex flex-col">
    <Navigation />
    <PageHero eyebrow="Legal" title="Privacy Policy" subtitle="How LF Insurance Brokers collects, uses, and protects your personal information." />
    <main className="flex-1">
      <LegalContent>
        <p>
          This Privacy Policy explains how LF Insurance Brokers Ltd ("we", "us", "our") handles the
          personal information you share with us when you request a quote, buy a policy, make a claim,
          or interact with our website and channels.
        </p>

        <h2>1. Information we collect</h2>
        <ul>
          <li>Identity details: full name, date of birth, national ID / passport number.</li>
          <li>Contact details: phone number, email, postal and physical address.</li>
          <li>Insurance details: vehicle, property, health, travel or business information relevant to your cover.</li>
          <li>Payment details: bank or mobile money references used to pay premiums or receive claim settlements.</li>
          <li>Website data: pages visited, device information and cookies used to improve our services.</li>
        </ul>

        <h2>2. How we use your information</h2>
        <ul>
          <li>To prepare insurance quotations and arrange policies with underwriters.</li>
          <li>To administer your policy, process renewals and manage claims.</li>
          <li>To meet our legal and regulatory obligations under Tanzanian law.</li>
          <li>To communicate service updates, reminders, and offers you may have opted into.</li>
        </ul>

        <h2>3. Sharing your information</h2>
        <p>
          We only share your information with insurance underwriters, reinsurers, loss adjusters, and
          regulators (including TIRA) where necessary to arrange cover or settle a claim. We never sell
          your personal data.
        </p>

        <h2>4. Data security</h2>
        <p>
          We use appropriate technical and organisational measures to protect your data from
          unauthorised access, loss or misuse. Access is limited to staff who need it to serve you.
        </p>

        <h2>5. Your rights</h2>
        <p>
          You may request access to, correction of, or deletion of the personal information we hold
          about you, subject to our legal and regulatory obligations. To exercise these rights,
          contact us at <a href="mailto:info@lfinsurance.co.tz">info@lfinsurance.co.tz</a>.
        </p>

        <h2>6. Retention</h2>
        <p>
          We retain your information for as long as your policy is active and for the period required
          by law after the policy ends, typically no less than seven years.
        </p>

        <h2>7. Contact</h2>
        <p>
          Questions about this policy? Call <a href="tel:+255713464894">+255 713 464 894</a> or email
          <a href="mailto:info@lfinsurance.co.tz"> info@lfinsurance.co.tz</a>.
        </p>
      </LegalContent>
    </main>
    <Footer />
    <Chatbot />
  </div>
);

export default PrivacyPolicy;
