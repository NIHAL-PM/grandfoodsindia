import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const TermsOfService = () => {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Navigation />
      
      <section className="py-12 bg-gradient-to-br from-primary via-primary-light to-accent-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-primary-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-playfair font-bold mb-6">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using Kaisan Associates training platform, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-playfair font-bold mb-6">2. Training Services</h2>
            <p className="mb-4">
              Kaisan Associates provides professional training services including but not limited to:
            </p>
            <ul className="mb-6 space-y-2">
              <li>• Personal development training</li>
              <li>• Professional skills enhancement</li>
              <li>• Relationship management programs</li>
              <li>• Corporate training solutions</li>
              <li>• Certification programs</li>
            </ul>

            <h2 className="text-2xl font-playfair font-bold mb-6">3. Registration and Account</h2>
            <p className="mb-6">
              To access certain features of our platform, you may be required to register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-playfair font-bold mb-6">4. Payment Terms</h2>
            <p className="mb-4">
              Payment for our training services is due as specified in the course enrollment terms. We accept various payment methods including:
            </p>
            <ul className="mb-6 space-y-2">
              <li>• Bank transfers</li>
              <li>• Credit/Debit cards</li>
              <li>• Digital payment platforms</li>
            </ul>

            <h2 className="text-2xl font-playfair font-bold mb-6">5. Refund Policy</h2>
            <p className="mb-6">
              Refund requests must be submitted within 7 days of enrollment. Refunds are processed within 10-15 business days after approval. Partial refunds may apply if training has commenced.
            </p>

            <h2 className="text-2xl font-playfair font-bold mb-6">6. Intellectual Property</h2>
            <p className="mb-6">
              All training materials, content, and resources provided by Kaisan Associates are protected by copyright and other intellectual property laws. Unauthorized reproduction or distribution is prohibited.
            </p>

            <h2 className="text-2xl font-playfair font-bold mb-6">7. Code of Conduct</h2>
            <p className="mb-4">
              Participants are expected to maintain professional behavior during all training sessions and interactions. This includes:
            </p>
            <ul className="mb-6 space-y-2">
              <li>• Respectful communication</li>
              <li>• Punctuality and attendance</li>
              <li>• Active participation</li>
              <li>• Confidentiality of sensitive information</li>
            </ul>

            <h2 className="text-2xl font-playfair font-bold mb-6">8. Limitation of Liability</h2>
            <p className="mb-6">
              Kaisan Associates shall not be liable for any indirect, incidental, or consequential damages arising from the use of our training services. Our liability is limited to the amount paid for the specific training program.
            </p>

            <h2 className="text-2xl font-playfair font-bold mb-6">9. Privacy Policy</h2>
            <p className="mb-6">
              We are committed to protecting your privacy. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
            </p>

            <h2 className="text-2xl font-playfair font-bold mb-6">10. Modifications</h2>
            <p className="mb-6">
              Kaisan Associates reserves the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of our services constitutes acceptance of the modified terms.
            </p>

            <h2 className="text-2xl font-playfair font-bold mb-6">11. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <ul className="mb-6 space-y-2">
              <li>• Email: info@kaisanassociates.com</li>
              <li>• Phone: +971 50 123 4567</li>
              <li>• WhatsApp: +971 50 123 4567</li>
              <li>• Address: Dubai, UAE & Kochi, Kerala, India</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;