import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  GraduationCap, 
  Users, 
  Award, 
  Globe, 
  Clock, 
  Star,
  CheckCircle,
  TrendingUp,
  Heart,
  Target,
  MessageCircle,
  Calendar,
  MapPin,
  Play,
  ArrowRight,
  BookOpen,
  UserCheck,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import heroImage from "@/assets/hero-training.jpg";
import rashidImage from "@/assets/rashid-gazzali.jpg";
import ConsultationModal from "@/components/ConsultationModal";
import ShareButton from "@/components/ShareButton";
import ScheduleCallModal from "@/components/ScheduleCallModal";

const Index = () => {
  const { t, dir } = useLanguage();
  const { toast } = useToast();
  const stats = [
    { icon: Users, label: t("stats.studentsTrained"), value: "10,000+", color: "text-primary" },
    { icon: Award, label: t("stats.certificatesIssued"), value: "8,500+", color: "text-success" },
    { icon: Globe, label: t("stats.countriesReached"), value: "25+", color: "text-accent" },
    { icon: Star, label: t("stats.averageRating"), value: "4.9/5", color: "text-primary" },
  ];

  const features = [
    {
      icon: BookOpen,
      title: t('index.features.multiDomain.title'),
      description: t('index.features.multiDomain.desc'),
      color: 'text-primary'
    },
    {
      icon: Globe,
      title: t('index.features.globalAccessibility.title'),
      description: t('index.features.globalAccessibility.desc'),
      color: 'text-accent'
    },
    {
      icon: Award,
      title: t('index.features.verifiedCertificates.title'),
      description: t('index.features.verifiedCertificates.desc'),
      color: 'text-success'
    },
    {
      icon: Users,
      title: t('index.features.expertTrainers.title'),
      description: t('index.features.expertTrainers.desc'),
      color: 'text-primary'
    },
    {
      icon: Target,
      title: t('index.features.personalizedLearning.title'),
      description: t('index.features.personalizedLearning.desc'),
      color: 'text-accent'
    },
    {
      icon: Zap,
      title: t('index.features.instantSupport.title'),
      description: t('index.features.instantSupport.desc'),
      color: 'text-success'
    }
  ];

  const testimonials = [
    {
      name: t('index.testimonials.name1'),
      role: t('index.testimonials.role1'),
      content: t('index.testimonials.content1'),
      rating: 5,
      image: '🇦🇪'
    },
    {
      name: t('index.testimonials.name2'),
      role: t('index.testimonials.role2'),
      content: t('index.testimonials.content2'),
      rating: 5,
      image: '🇮🇳'
    },
    {
      name: t('index.testimonials.name3'),
      role: t('index.testimonials.role3'),
      content: t('index.testimonials.content3'),
      rating: 5,
      image: '🇬🇧'
    }
  ];

  const prpHighlights = [
    t('index.highlights.item1'),
    t('index.highlights.item2'),
    t('index.highlights.item3'),
    t('index.highlights.item4'),
    t('index.highlights.item5'),
    t('index.highlights.item6'),
  ];

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-accent-light overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left animate-fade-in-up">
              <Badge className="bg-accent/20 text-accent border-accent/30 mb-6">
                🌟 {t("hero.badge")}
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-primary-foreground mb-6 leading-tight">
                {t("hero.title")}
                <span className="block text-gradient-accent">
                  {t("hero.titleAccent")}
                </span>
                {t("hero.subtitle")}
              </h1>
              
              <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
                {t("hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button asChild className="btn-hero text-lg px-8 py-4">
                  <Link to="/courses/prp-mentoring">
                    <Calendar className="w-5 h-5 mr-2" />
                    {t("hero.joinPrpProgram")}
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8 py-4"
                >
                  <Link to="/courses">
                    <BookOpen className="w-5 h-5 mr-2" />
                    {t("cta.explore")}
                  </Link>
                </Button>
              </div>

              {/* Quick Contact */}
              <div className="flex flex-wrap gap-4 text-primary-foreground/80">
                <a 
                  href="https://wa.me/971501234567" 
                  className="flex items-center space-x-2 hover:text-accent transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>+971 50 123 4567</span>
                </a>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{t('index.contact.locations')}</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative animate-fade-in-up animation-delay-300">
              <div className="relative rounded-2xl overflow-hidden shadow-elegant">
                <img 
                  src={heroImage} 
                  alt="Professional training session" 
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                
                {/* Floating Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    className="w-16 h-16 rounded-full bg-primary-foreground/90 hover:bg-primary-foreground text-primary shadow-lg animate-pulse-glow"
                    onClick={() => {
                      toast({ 
                        title: "Introduction Video", 
                        description: "Opening training overview video..." 
                      });
                      // Open video modal or navigate to video page
                      setTimeout(() => {
                        const videoWindow = window.open(
                          'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
                          '_blank',
                          'width=800,height=600'
                        );
                        if (!videoWindow) {
                          toast({ 
                            title: "Video Unavailable", 
                            description: "Please enable popups to view the introduction video" 
                          });
                        }
                      }, 1000);
                    }}
                  >
                    <Play className="w-6 h-6 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-elegant border border-border/50 animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">10,000+</p>
                    <p className="text-muted-foreground text-sm">{t("stats.happyStudents")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center`}>
                  <stat.icon className={`w-8 h-8 text-primary-foreground`} />
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Course - PRP Program */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-accent/20 text-accent border-accent/30 mb-4">
              {t("common.featuredProgram")}
            </Badge>
            <h2 className="text-4xl font-playfair font-bold text-foreground mb-6">
              {t("prp.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("prp.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="card-elevated">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-playfair font-bold">{t("prp.programDetails")}</h3>
                  <Badge className="bg-success/20 text-success border-success/30">
                    ₹7,000
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <img 
                      src="https://preview--nexus-train-pro-71.lovable.app/lovable-uploads/4ae0c283-5621-4539-ae99-05eb151b5ed8.png" 
                      alt="Dr. Rashid Gazzali" 
                      className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Dr. Rashid Gazzali</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("prp.ledBy")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {prpHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="btn-hero flex-1">
                    <Link to="/courses/prp-mentoring">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      {t("cta.enroll")}
                    </Link>
                  </Button>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="btn-outline-primary flex-1">
                      <Link to="/courses/prp-mentoring">
                        {t("actions.learnMore")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <ShareButton 
                      title={t("prp.title")}
                      description={t("prp.description")}
                      url="/courses/prp-mentoring"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card-feature">
                <Heart className="w-8 h-8 text-accent mb-4" />
                <h4 className="text-xl font-semibold mb-3">{t('index.cards.personalGrowth.title')}</h4>
                <p className="text-muted-foreground">
                  {t('index.cards.personalGrowth.desc')}
                </p>
              </div>

              <div className="card-feature">
                <TrendingUp className="w-8 h-8 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-3">{t('index.cards.professionalEmpowerment.title')}</h4>
                <p className="text-muted-foreground">
                  {t('index.cards.professionalEmpowerment.desc')}
                </p>
              </div>

              <div className="card-feature">
                <Users className="w-8 h-8 text-success mb-4" />
                <h4 className="text-xl font-semibold mb-3">{t('index.cards.relationshipEnrichment.title')}</h4>
                <p className="text-muted-foreground">
                  {t('index.cards.relationshipEnrichment.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-foreground mb-6">
              {t("features.whyChoose")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("features.experienceDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="card-feature group hover:scale-105 transition-transform duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                <feature.icon className={`w-12 h-12 ${feature.color} mb-6 group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-foreground mb-6">
              {t("testimonials.title")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t("testimonials.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.name} className="card-elevated group hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-current" />
                  ))}
                </div>
                
                <p className="text-muted-foreground italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-playfair font-bold mb-6">
            {t("footerCta.title")}
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            {t("footerCta.description")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild className="bg-accent hover:bg-accent-light text-accent-foreground text-lg px-8 py-4">
              <Link to="/courses">
                <BookOpen className="w-5 h-5 mr-2" />
                {t("cta.browseAllCourses")}
              </Link>
            </Button>
            
            <ScheduleCallModal 
              trigger={
                <Button 
                  variant="outline" 
                  className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8 py-4"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t("cta.scheduleCall")}
                </Button>
              }
            />
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-primary-foreground/80">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span>{t("footerCta.freeConsultation")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>{t("footerCta.certifiedPrograms")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>{t("footerCta.globalAccess")}</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
