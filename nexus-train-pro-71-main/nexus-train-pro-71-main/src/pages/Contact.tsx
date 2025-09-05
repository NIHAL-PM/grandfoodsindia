import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ButtonSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import ScheduleCallModal from "@/components/ScheduleCallModal";
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Globe,
  Users,
  Award,
  Calendar,
  Building
} from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general"
  });

  const contactInfo = [
    {
      location: "UAE Headquarters",
      address: "Dubai Business Bay, Dubai, UAE",
      phone: "+971 50 123 4567",
      email: "info@kaisanassociates.com",
      hours: "Sun-Thu: 9:00 AM - 6:00 PM",
      timezone: "GST (Gulf Standard Time)"
    },
    {
      location: "Kerala Office",
      address: "Marine Drive, Kochi, Kerala, India",
      phone: "+91 98765 43210",
      email: "kerala@kaisanassociates.com",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM",
      timezone: "IST (Indian Standard Time)"
    }
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "course", label: "Course Information" },
    { value: "corporate", label: "Corporate Training" },
    { value: "trainer", label: "Become a Trainer" },
    { value: "partnership", label: "Partnership" },
    { value: "support", label: "Technical Support" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    // Reset form and show success message
    toast({
      title: "Message Sent Successfully!",
      description: "Thank you for your message! We'll get back to you within 24 hours.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      inquiryType: "general"
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-accent-light py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-accent/20 text-accent border-accent/30 mb-6">
            Get in Touch
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-primary-foreground mb-6">
            Let's Start Your
            <span className="block text-accent">Transformation Journey</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Ready to unlock your potential? Contact our expert team for personalized guidance, 
            course information, or to discuss your training needs.
          </p>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-elevated text-center">
              <CardContent className="p-6">
                <MessageCircle className="w-12 h-12 text-success mx-auto mb-4" />
                <h3 className="font-semibold mb-2">WhatsApp Support</h3>
                <p className="text-muted-foreground text-sm mb-4">Get instant responses</p>
                <Button asChild className="bg-success hover:bg-success/90 text-success-foreground">
                  <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer">
                    Chat Now
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-elevated text-center">
              <CardContent className="p-6">
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-muted-foreground text-sm mb-4">Speak with our experts</p>
                <Button asChild variant="outline" className="btn-outline-primary">
                  <a href="tel:+971501234567">
                    Call Now
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-elevated text-center">
              <CardContent className="p-6">
                <Calendar className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Free Consultation</h3>
                <p className="text-muted-foreground text-sm mb-4">Book a discovery call</p>
                <Button variant="outline" className="btn-outline-accent">
                  Schedule Call
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-playfair font-bold mb-6">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+971 50 123 4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquiryType">Inquiry Type</Label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What would you like to discuss?"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your needs, goals, or questions..."
                  />
                </div>

                <Button type="submit" className="btn-hero" disabled={isSubmitting}>
                  {isSubmitting && <ButtonSpinner />}
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-playfair font-bold mb-6">Contact Information</h2>
                <p className="text-muted-foreground mb-8">
                  Reach out to us through any of our offices or digital channels. 
                  We're here to support your learning journey.
                </p>
              </div>

              {/* Office Locations */}
              <div className="space-y-6">
                {contactInfo.map((office, index) => (
                  <Card key={index} className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Building className="w-5 h-5 text-primary" />
                        <span>{office.location}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <span className="text-sm">{office.address}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a 
                          href={`tel:${office.phone}`}
                          className="text-sm hover:text-primary transition-colors"
                        >
                          {office.phone}
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a 
                          href={`mailto:${office.email}`}
                          className="text-sm hover:text-primary transition-colors"
                        >
                          {office.email}
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="text-sm">
                          <div>{office.hours}</div>
                          <div className="text-muted-foreground text-xs">{office.timezone}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Additional Contact Methods */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Other Ways to Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-3 text-success" />
                      WhatsApp: +971 50 123 4567
                    </a>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href="mailto:info@kaisanassociates.com">
                      <Mail className="w-4 h-4 mr-3 text-primary" />
                      Email: info@kaisanassociates.com
                    </a>
                  </Button>
                  
                  <ScheduleCallModal
                    trainerId="dr-rashid-gazzali"
                    trainerName="Dr. Rashid Gazzali"
                    trigger={
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          toast({
                            title: "Schedule Consultation",
                            description: "Opening booking form...",
                          });
                          // Open consultation booking modal
                          setShowScheduleModal(true);
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-3 text-accent" />
                        Schedule Free Consultation
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers to common questions</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How quickly will I receive a response?",
                answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please contact us via WhatsApp for faster response."
              },
              {
                question: "Do you offer free consultations?",
                answer: "Yes! We offer free 30-minute consultation calls to discuss your training needs and help you choose the right program."
              },
              {
                question: "Can I get training in my local language?",
                answer: "We offer training in English, Arabic, and Malayalam. Additional language support may be available for corporate programs."
              },
              {
                question: "What are your payment options?",
                answer: "We accept various payment methods including bank transfers, credit cards, and digital payments. Installment plans are available for most courses."
              }
            ].map((faq, index) => (
              <Card key={index} className="card-elevated">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;