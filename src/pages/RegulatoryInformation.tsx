import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";

const RegulatoryInformation = () => (
  <div className="min-h-screen flex flex-col">
    <Navigation />
    <PageHero eyebrow="Legal" title="Regulatory Information" subtitle="Our licences, memberships, and the regulatory framework we operate under." />
    <main className="flex-1">
      <LegalContent>
        <h2>Company details</h2>
        <ul>
          <li><strong>Registered name:</strong> LF Insurance Brokers Ltd</li>
          <li><strong>Head office:</strong> Dar es Salaam, Tanzania</li>
          <li><strong>Phone:</strong> <a href="tel:+255713464894">+255 713 464 894</a></li>
          <li><strong>Email:</strong> <a href="mailto:info@lfinsurance.co.tz">info@lfinsurance.co.tz</a></li>
        </ul>

        <h2>Licensing</h2>
        <p>
          LF Insurance Brokers Ltd is licensed and regulated by the <strong>Tanzania Insurance
          Regulatory Authority (TIRA)</strong> to transact insurance brokerage business in the United
          Republic of Tanzania.
        </p>

        <h2>Professional memberships</h2>
        <ul>
          <li>Member of the <strong>Tanzania Insurance Brokers Association (TIBA)</strong>.</li>
          <li>ISO 9001:2015 Quality Management System aligned processes.</li>
        </ul>

        <h2>Professional indemnity</h2>
        <p>
          We maintain a Professional Indemnity Insurance policy that meets or exceeds the minimum
          statutory requirements set by TIRA.
        </p>

        <h2>How we're paid</h2>
        <p>
          As your broker, our remuneration is normally in the form of commission paid by the
          underwriter as a percentage of the premium. Where a fee arrangement is used instead, it will
          be agreed with you in writing before cover incepts.
        </p>

        <h2>Conflicts of interest</h2>
        <p>
          We place your interests first when recommending cover and underwriters. Any potential
          conflict of interest is disclosed to you in advance and managed in line with TIRA
          requirements.
        </p>

        <h2>Regulator contact</h2>
        <p>
          Tanzania Insurance Regulatory Authority (TIRA) — the statutory body responsible for the
          supervision and regulation of the insurance industry in Tanzania.
        </p>
      </LegalContent>
    </main>
    <Footer />
    <Chatbot />
  </div>
);

export default RegulatoryInformation;
