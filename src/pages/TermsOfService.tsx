import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";

const TermsOfService = () => (
  <div className="min-h-screen flex flex-col">
    <Navigation />
    <PageHero eyebrow="Legal" title="Terms of Service" subtitle="The terms that govern your use of our website and brokerage services." />
    <main className="flex-1">
      <LegalContent>
        <p>
          By accessing our website, requesting a quotation, or engaging LF Insurance Brokers Ltd as
          your broker, you agree to these Terms of Service.
        </p>

        <h2>1. Our role</h2>
        <p>
          LF Insurance Brokers is a licensed insurance broker regulated by the Tanzania Insurance
          Regulatory Authority (TIRA). We act on your behalf to arrange insurance with reputable
          underwriters. We do not underwrite risks ourselves.
        </p>

        <h2>2. Quotations and cover</h2>
        <ul>
          <li>Quotations are indicative until an underwriter has accepted the risk and premium is paid.</li>
          <li>Cover only commences from the date and time confirmed in writing by us or the underwriter.</li>
          <li>You must disclose all material facts truthfully. Non-disclosure may void your policy.</li>
        </ul>

        <h2>3. Premiums and payments</h2>
        <p>
          Premiums are payable in full before cover incepts unless a written instalment arrangement is
          agreed. Failure to pay on time may result in cancellation of the policy.
        </p>

        <h2>4. Website use</h2>
        <p>
          Content on this website is provided for general information only and does not constitute
          insurance advice. You must not misuse the site, attempt unauthorised access, or copy our
          content for commercial purposes without permission.
        </p>

        <h2>5. Limitation of liability</h2>
        <p>
          We will exercise reasonable care and skill in providing our services. To the maximum extent
          permitted by law, we are not liable for indirect or consequential losses arising from your
          use of this website or the actions of underwriters.
        </p>

        <h2>6. Governing law</h2>
        <p>
          These terms are governed by the laws of the United Republic of Tanzania and the courts of
          Tanzania have exclusive jurisdiction over any disputes.
        </p>

        <h2>7. Contact</h2>
        <p>
          For questions about these terms, contact us on <a href="tel:+255713464894">+255 713 464 894</a> or
          <a href="mailto:info@lfinsurance.co.tz"> info@lfinsurance.co.tz</a>.
        </p>
      </LegalContent>
    </main>
    <Footer />
    <Chatbot />
  </div>
);

export default TermsOfService;
