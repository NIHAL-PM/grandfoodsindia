import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const CookiePolicy = () => {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Navigation />
      
      <section className="py-12 bg-gradient-to-br from-primary via-primary-light to-accent-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-primary-foreground mb-4">
              Cookie Policy
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
            <h2 className="text-2xl font-playfair font-bold mb-6">What Are Cookies?</h2>
            <p className="mb-6">
              Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience and allow certain features to function properly.
            </p>

            <h2 className="text-2xl font-playfair font-bold mb-6">How We Use Cookies</h2>
            <p className="mb-4">
              Kaisan Associates uses cookies for the following purposes:
            </p>
            <ul className="mb-6 space-y-2">
              <li>• <strong>Essential Cookies:</strong> Required for basic website functionality</li>
              <li>• <strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
              <li>• <strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
              <li>• <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>

            <h2 className="text-2xl font-playfair font-bold mb-6">Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold mb-4">1. Strictly Necessary Cookies</h3>
            <p className="mb-4">
              These cookies are essential for the website to function properly. They include:
            </p>
            <ul className="mb-6 space-y-2">
              <li>• Session management cookies</li>
              <li>• Security cookies</li>
              <li>• Language preference cookies</li>
              <li>• Wishlist functionality cookies</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4">2. Analytics Cookies</h3>
            <p className="mb-4">
              We use analytics cookies to understand how our website is used:
            </p>
            <ul className="mb-6 space-y-2">
              <li>• Google Analytics (anonymized data)</li>
              <li>• Page view tracking</li>
              <li>• User journey analysis</li>
              <li>• Performance monitoring</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4">3. Functionality Cookies</h3>
            <p className="mb-4">
              These cookies enhance your user experience:
            </p>
            <ul className="mb-6 space-y-2">
              <li>• Language preferences</li>
              <li>• Wishlist items</li>
              <li>• Form auto-fill</li>
              <li>• Chat preferences</li>
            </ul>

            <h2 className="text-2xl font-playfair font-bold mb-6">Managing Your Cookies</h2>
            <p className="mb-4">
              You can control cookies through your browser settings:
            </p>
            <ul className="mb-6 space-y-2">
              <li>• <strong>Accept All:</strong> Allow all cookies for the best experience</li>
              <li>• <strong>Reject Non-Essential:</strong> Only essential cookies will be used</li>
              <li>• <strong>Customize:</strong> Choose which types of cookies to accept</li>
            </ul>

            <h2 className="text-2xl font-playfair font-bold mb-6">Third-Party Cookies</h2>
            <p className="mb-4">
              We may use third-party services that set cookies on our website:
            </p>
            <ul className="mb-6 space-y-2">
              <li>• Google Analytics for website analytics</li>
              <li>• WhatsApp for customer support</li>
              <li>• Payment processors for secure transactions</li>
              <li>• Social media platforms for sharing functionality</li>
            </ul>

            <h2 className="text-2xl font-playfair font-bold mb-6">Cookie Retention</h2>
            <p className="mb-6">
              Cookies are retained for different periods depending on their purpose:
            </p>
            <ul className="mb-6 space-y-2">
              <li>• Session cookies: Deleted when you close your browser</li>
              <li>• Persistent cookies: Stored for up to 2 years</li>
              <li>• Analytics cookies: Stored for up to 26 months</li>
            </ul>

            <h2 className="text-2xl font-playfair font-bold mb-6">Your Rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="mb-6 space-y-2">
              <li>• Be informed about our use of cookies</li>
              <li>• Give or withdraw consent for non-essential cookies</li>
              <li>• Access information about cookies we use</li>
              <li>• Request deletion of your cookie data</li>
            </ul>

            <h2 className="text-2xl font-playfair font-bold mb-6">Updates to This Policy</h2>
            <p className="mb-6">
              We may update this Cookie Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date.
            </p>

            <h2 className="text-2xl font-playfair font-bold mb-6">Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Cookie Policy, please contact us:
            </p>
            <ul className="mb-6 space-y-2">
              <li>• Email: privacy@kaisanassociates.com</li>
              <li>• Phone: +971 50 123 4567</li>
              <li>• Address: Dubai, UAE & Kochi, Kerala, India</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CookiePolicy;