import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award,
  Users,
  Globe,
  Target,
  Heart,
  Star,
  TrendingUp,
  BookOpen,
  MessageCircle,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in every training program and mentorship session"
    },
    {
      icon: Heart,
      title: "Empathy",
      description: "Understanding and connecting with each learner's unique journey"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Bringing world-class training to learners across continents"
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description: "Committed to continuous improvement and innovation in training"
    }
  ];

  const achievements = [
    "15+ Years of Training Excellence",
    "10,000+ Professionals Trained",
    "25+ Countries Reached",
    "ISO Certified Training Programs",
    "96% Student Satisfaction Rate",
    "Expert Faculty from Multiple Domains"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-accent-light py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-accent/20 text-accent border-accent/30 mb-6">
            About Kaisan Associates
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-primary-foreground mb-6">
            Empowering Excellence
            <span className="block text-accent">Since 2008</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Transforming lives through world-class training programs across personal development, 
            professional excellence, and relationship mastery.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card-elevated">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-playfair font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To empower individuals and organizations worldwide through transformative training 
                programs that foster personal growth, professional excellence, and meaningful relationships. 
                We believe in unlocking human potential through expert guidance and comprehensive learning experiences.
              </p>
            </div>

            <div className="card-elevated">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-playfair font-bold mb-6">Our Vision</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To be the leading global platform for holistic development training, recognized for 
                our innovative approaches, expert faculty, and transformative impact on learners' 
                personal and professional lives across all continents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-6">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide everything we do at Kaisan Associates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={value.title} className="card-feature text-center group hover:scale-105 transition-transform">
                <value.icon className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-playfair font-bold mb-6">Our Story</h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Founded in 2008, Kaisan Associates began as a vision to bridge the gap between 
                  traditional education and real-world application. Starting in the UAE and Kerala, 
                  we recognized the need for comprehensive training that addresses the whole person.
                </p>
                <p>
                  Our founder, Dr. Rashid Gazzali, brought together a unique approach combining 
                  personal development, professional skills, and relationship mastery. This holistic 
                  methodology became the foundation of our signature PRP (Personal, Professional, 
                  Relationship) training programs.
                </p>
                <p>
                  Today, we've expanded globally, serving over 10,000 professionals across 25+ countries, 
                  while maintaining our commitment to personalized, transformative learning experiences.
                </p>
              </div>
            </div>

            <div className="card-elevated">
              <h3 className="text-2xl font-playfair font-bold mb-6">Key Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-6">Global Presence</h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Serving learners across multiple continents with localized expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-feature bg-background/25 backdrop-blur-sm border border-primary-foreground/30 shadow-sm rounded-xl p-6">
              <Globe className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-primary-foreground">UAE Headquarters</h3>
              <p className="text-sm leading-relaxed text-primary-foreground/90">
                Dubai Business Bay serves as our primary hub for Middle East operations
              </p>
            </div>

            <div className="card-feature bg-background/25 backdrop-blur-sm border border-primary-foreground/30 shadow-sm rounded-xl p-6">
              <Users className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-primary-foreground">Kerala Operations</h3>
              <p className="text-sm leading-relaxed text-primary-foreground/90">
                Deep roots in Kerala, India, serving the South Asian market
              </p>
            </div>

            <div className="card-feature bg-background/25 backdrop-blur-sm border border-primary-foreground/30 shadow-sm rounded-xl p-6">
              <BookOpen className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-primary-foreground">Global Online</h3>
              <p className="text-sm leading-relaxed text-primary-foreground/90">
                Reaching learners worldwide through our digital training platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-playfair font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals who have transformed their lives with Kaisan Associates
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-hero text-lg px-8 py-4">
              <Link to="/courses">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Courses
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="btn-outline-primary text-lg px-8 py-4">
              <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Get in Touch
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;