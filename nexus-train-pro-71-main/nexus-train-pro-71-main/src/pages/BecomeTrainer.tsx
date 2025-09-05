import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ButtonSpinner } from "@/components/ui/loading-spinner";
import { 
  Users,
  Award,
  Globe,
  DollarSign,
  BookOpen,
  Star,
  Upload,
  CheckCircle,
  MessageCircle,
  Calendar,
  TrendingUp,
  Heart,
  Target
} from "lucide-react";
import { useState } from "react";

const BecomeTrainer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    expertise: "",
    experience: "",
    education: "",
    certifications: "",
    languages: "",
    trainingFormat: "",
    proposedFee: "",
    motivation: "",
    sampleContent: ""
  });

  const benefits = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access to students worldwide through our established platform"
    },
    {
      icon: DollarSign,
      title: "Competitive Compensation",
      description: "Attractive revenue sharing model with performance bonuses"
    },
    {
      icon: Users,
      title: "Marketing Support",
      description: "Full marketing and promotional support for your courses"
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Join our prestigious network of internationally recognized trainers"
    },
    {
      icon: BookOpen,
      title: "Course Development",
      description: "Professional support in creating and structuring your content"
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description: "Continuous professional development and networking opportunities"
    }
  ];

  const requirements = [
    "Minimum 5 years of professional experience in your domain",
    "Proven track record of training or coaching",
    "Relevant qualifications and certifications",
    "Excellent communication skills",
    "Passion for teaching and mentoring",
    "Ability to create engaging learning experiences"
  ];

  const process = [
    {
      step: 1,
      title: "Application Submission",
      description: "Complete the application form with your details and expertise"
    },
    {
      step: 2,
      title: "Initial Review",
      description: "Our team reviews your application and qualifications"
    },
    {
      step: 3,
      title: "Interview & Assessment",
      description: "Virtual interview and demonstration of teaching skills"
    },
    {
      step: 4,
      title: "Course Development",
      description: "Collaborate with our team to develop your course content"
    },
    {
      step: 5,
      title: "Platform Onboarding",
      description: "Training on our platform and launch preparation"
    },
    {
      step: 6,
      title: "Go Live",
      description: "Launch your courses and start training students globally"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsSubmitting(false);
    // Show success message
    console.log("Application submitted successfully");
    
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      expertise: "",
      experience: "",
      education: "",
      certifications: "",
      languages: "",
      trainingFormat: "",
      proposedFee: "",
      motivation: "",
      sampleContent: ""
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
            Join Our Expert Team
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-primary-foreground mb-6">
            Become a
            <span className="block text-accent">Kaisan Trainer</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Share your expertise with thousands of professionals worldwide. Join our prestigious 
            network of international trainers and make a meaningful impact on global learning.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-6">Why Train with Kaisan Associates?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join a platform that values your expertise and supports your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={benefit.title} className="card-feature group hover:scale-105 transition-transform">
                <benefit.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-6">Application Process</h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to join our expert trainer network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <Card key={step.step} className="card-elevated relative">
                <div className="absolute -top-4 left-6 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {step.step}
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4">Trainer Requirements</h2>
            <p className="text-muted-foreground">
              What we look for in our expert trainers
            </p>
          </div>

          <Card className="card-elevated">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                    <span className="text-foreground">{requirement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4">Submit Your Application</h2>
            <p className="text-muted-foreground">
              Tell us about your expertise and how you'd like to contribute to our learning community
            </p>
          </div>

          <Card className="card-elevated">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Your last name"
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
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+971 50 123 4567"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        name="location"
                        type="text"
                        required
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Background */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-primary" />
                    Professional Background
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="expertise">Area of Expertise *</Label>
                      <Input
                        id="expertise"
                        name="expertise"
                        type="text"
                        required
                        value={formData.expertise}
                        onChange={handleInputChange}
                        placeholder="e.g., Leadership Development, Personal Growth, Communication Skills"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Years of Experience *</Label>
                      <select
                        id="experience"
                        name="experience"
                        required
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select experience level</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10-15">10-15 years</option>
                        <option value="15-20">15-20 years</option>
                        <option value="20+">20+ years</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="education">Education Background *</Label>
                      <Textarea
                        id="education"
                        name="education"
                        required
                        rows={3}
                        value={formData.education}
                        onChange={handleInputChange}
                        placeholder="Describe your educational qualifications, degrees, universities..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="certifications">Certifications & Credentials</Label>
                      <Textarea
                        id="certifications"
                        name="certifications"
                        rows={3}
                        value={formData.certifications}
                        onChange={handleInputChange}
                        placeholder="List your professional certifications, licenses, or credentials..."
                      />
                    </div>
                  </div>
                </div>

                {/* Training Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-primary" />
                    Training Preferences
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="languages">Languages You Can Teach In *</Label>
                      <Input
                        id="languages"
                        name="languages"
                        type="text"
                        required
                        value={formData.languages}
                        onChange={handleInputChange}
                        placeholder="e.g., English, Arabic, Malayalam"
                      />
                    </div>
                    <div>
                      <Label htmlFor="trainingFormat">Preferred Training Format *</Label>
                      <select
                        id="trainingFormat"
                        name="trainingFormat"
                        required
                        value={formData.trainingFormat}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select format</option>
                        <option value="online">Online Only</option>
                        <option value="offline">Offline Only</option>
                        <option value="hybrid">Both Online & Offline</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="proposedFee">Proposed Training Fee (per hour in USD)</Label>
                      <Input
                        id="proposedFee"
                        name="proposedFee"
                        type="number"
                        value={formData.proposedFee}
                        onChange={handleInputChange}
                        placeholder="e.g., 150"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-primary" />
                    Tell Us More
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="motivation">Why do you want to join Kaisan Associates? *</Label>
                      <Textarea
                        id="motivation"
                        name="motivation"
                        required
                        rows={4}
                        value={formData.motivation}
                        onChange={handleInputChange}
                        placeholder="Share your motivation, goals, and what you hope to achieve by joining our team..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="sampleContent">Describe a Sample Training Session</Label>
                      <Textarea
                        id="sampleContent"
                        name="sampleContent"
                        rows={4}
                        value={formData.sampleContent}
                        onChange={handleInputChange}
                        placeholder="Outline a sample training session you would conduct, including objectives, methodology, and expected outcomes..."
                      />
                    </div>
                  </div>
                </div>

                {/* File Uploads */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-primary" />
                    Supporting Documents
                  </h3>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm mb-2">Upload your CV/Resume</p>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm mb-2">Upload Certificates (Optional)</p>
                      <Button variant="outline" size="sm">
                        Choose Files
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button type="submit" className="btn-hero text-lg px-12 py-4" disabled={isSubmitting}>
                    {isSubmitting && <ButtonSpinner />}
                    {isSubmitting ? "Submitting Application..." : "Submit Application"}
                  </Button>
                  <p className="text-muted-foreground text-sm mt-4">
                    We typically respond to applications within 5-7 business days
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact for Questions */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-playfair font-bold mb-6">
            Have Questions About Joining Us?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our team is here to help you understand the opportunities and process
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-hero text-lg px-8 py-4">
              <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Support
              </a>
            </Button>
            
            <Button asChild variant="outline" className="btn-outline-primary text-lg px-8 py-4">
              <a href="mailto:trainers@kaisanassociates.com">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule a Call
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BecomeTrainer;