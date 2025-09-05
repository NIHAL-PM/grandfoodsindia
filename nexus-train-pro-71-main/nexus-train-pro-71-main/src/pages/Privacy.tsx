import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Privacy = () => {
  document.title = "Privacy Policy - Kaisan Associates";
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <h1 className="text-4xl font-playfair font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">We respect your privacy. This page outlines how we collect, use, and protect your data.</p>
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <p className="text-muted-foreground">Contact details, course preferences, consultation bookings, and payment confirmations you provide.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">How We Use Your Data</h2>
          <p className="text-muted-foreground">To deliver training services, verify certificates, and provide support.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">For questions, email info@kaisanassociates.com.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
