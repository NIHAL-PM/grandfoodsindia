import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ButtonSpinner } from "@/components/ui/loading-spinner";
import { CertificateDisplay } from "@/components/ui/certificate-display";
import { 
  Shield,
  Award,
  AlertCircle,
  Search,
  Globe,
  QrCode,
  CheckCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { verifyCertificate } from '@/lib/api';
import { useSearchParams } from 'react-router-dom';

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);
  const [error, setError] = useState("");
  const [params] = useSearchParams();

  useEffect(() => {
    const certParam = params.get('cert');
    if (certParam) {
      setCertificateId(certParam);
      handleVerify(certParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async (inputId?: string) => {
    const target = (inputId ?? certificateId).trim();
    if (!target) {
      setError("Please enter a certificate ID");
      return;
    }

    setIsVerifying(true);
    setError("");
    setCertificate(null);

    try {
      const data = await verifyCertificate(target);
      if (!data) {
        setError("Certificate not found. Please check the ID and try again.");
      } else {
        setCertificate(data);
      }
    } catch (e: any) {
      setError(e?.message || 'Verification failed');
    }

    setIsVerifying(false);
  };

  const handleSampleVerification = () => {
  // Provide a hint to try a known code if available
  setError('Enter your certificate code and press Verify.');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-accent-light py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-accent/20 text-accent border-accent/30 mb-6">
            Certificate Verification
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-primary-foreground mb-6">
            Verify Your
            <span className="block text-accent">Achievement</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Enter the certificate code to check its validity and details from our records.
          </p>
        </div>
      </section>

      {/* Verification Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Verification Input */}
            <div>
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-primary" />
                    <span>Certificate Verification</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="certificateId">Certificate ID</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        id="certificateId"
                        type="text"
                        placeholder="e.g., KA-2024-PRP-001234"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={() => handleVerify()}
                        disabled={isVerifying}
                        className="btn-hero"
                      >
                        {isVerifying && <ButtonSpinner />}
                        {isVerifying ? "Verifying..." : "Verify"}
                        {!isVerifying && <Search className="w-4 h-4 ml-2" />}
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-muted-foreground text-sm mb-4">
                      Don't have a certificate ID? Try our sample:
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleSampleVerification}
                      className="btn-outline-primary"
                    >
                      Try Sample Certificate
                    </Button>
                  </div>

                  {error && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                      <span className="text-destructive text-sm">{error}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* How to Find Certificate ID */}
              <Card className="card-elevated mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">How to Find Your Certificate ID</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Check Your Email</p>
                      <p className="text-muted-foreground text-sm">Look for the certificate email from Kaisan Associates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Certificate Document</p>
                      <p className="text-muted-foreground text-sm">The ID is printed on your certificate (top-right corner)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">QR Code</p>
                      <p className="text-muted-foreground text-sm">Scan the QR code on your certificate for instant verification</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Verification Result */}
            <div>
              {certificate ? (
                <CertificateDisplay certificate={certificate} />
              ) : (
                <Card className="card-elevated">
                  <CardContent className="p-12 text-center">
                    <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Certificate Selected</h3>
                    <p className="text-muted-foreground">
                      Enter a certificate ID to verify its authenticity and view details.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4">Secure & Reliable Verification</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our advanced verification system ensures the highest level of security and authenticity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-feature text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Blockchain Security</h3>
              <p className="text-muted-foreground text-sm">Tamper-proof verification using blockchain technology</p>
            </div>

            <div className="card-feature text-center">
              <QrCode className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold mb-2">QR Code Verification</h3>
              <p className="text-muted-foreground text-sm">Instant verification through QR code scanning</p>
            </div>

            <div className="card-feature text-center">
              <Globe className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Global Recognition</h3>
              <p className="text-muted-foreground text-sm">Internationally recognized and accepted certificates</p>
            </div>

            <div className="card-feature text-center">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Instant Verification</h3>
              <p className="text-muted-foreground text-sm">Real-time verification in seconds</p>
            </div>
          </div>
        </div>
      </section>

  {/* Spacer */}
  <section className="py-10" />

      <Footer />
    </div>
  );
};

export default VerifyCertificate;