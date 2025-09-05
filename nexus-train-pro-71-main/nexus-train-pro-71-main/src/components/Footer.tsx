import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  Award,
  Users,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t, dir, lang } = useLanguage();

  const quickLinks = [
    { title: t('nav.about'), path: '/about' },
    { title: t('nav.trainers'), path: '/trainers' },
    { title: t('cta.explore'), path: '/courses' },
    { title: t('nav.verify'), path: '/verify-certificate' },
    { title: t('nav.becomeTrainer'), path: '/become-trainer' },
  ];

  const courses = [
    { title: t('prp.title'), path: '/courses/prp-mentoring' },
    { title: 'Leadership Development', path: '/courses/leadership' },
    { title: 'Professional Skills', path: '/courses/professional-skills' },
    { title: 'Personal Growth', path: '/courses/personal-growth' },
    { title: 'Relationship Mastery', path: '/courses/relationships' },
    { title: 'Corporate Training', path: '/courses/corporate' },
  ];

  const locations = [
    {
      region: "UAE Office",
      address: "Dubai Business Bay, UAE",
      phone: "+971 50 123 4567",
    },
    {
      region: "Kerala Office", 
      address: "Kochi, Kerala, India",
      phone: "+91 98765 43210",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-primary-foreground" dir={dir}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-playfair font-bold">Kaisan Associates</h3>
                <p className="text-primary-foreground/80 text-sm">{t('footer.companyTagline')}</p>
              </div>
            </div>
            
            <p className="text-primary-foreground/90 mb-6 leading-relaxed">
              {t('footer.companyDescription')}
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 hover:bg-primary-foreground/10"
                onClick={() => window.open('https://facebook.com/kaisanassociates', '_blank')}
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 hover:bg-primary-foreground/10"
                onClick={() => window.open('https://instagram.com/kaisanassociates', '_blank')}
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 hover:bg-primary-foreground/10"
                onClick={() => window.open('https://linkedin.com/company/kaisanassociates', '_blank')}
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 hover:bg-primary-foreground/10"
                onClick={() => window.open('https://twitter.com/kaisanassociates', '_blank')}
              >
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-playfair font-semibold mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-accent" />
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-primary-foreground/80 hover:text-accent transition-colors hover:underline"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Courses */}
          <div>
            <h4 className="text-lg font-playfair font-semibold mb-6 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-accent" />
              {t('footer.popularCourses')}
            </h4>
            <ul className="space-y-3">
              {courses.map((course) => (
                <li key={course.path}>
                  <Link 
                    to={course.path}
                    className="text-primary-foreground/80 hover:text-accent transition-colors hover:underline"
                  >
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-playfair font-semibold mb-6 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-accent" />
              {t('footer.contactUs')}
            </h4>
            
            <div className="space-y-6">
              {locations.map((location) => (
                <div key={location.region} className="space-y-2">
                  <h5 className="font-medium text-accent">{location.region}</h5>
                  <div className="flex items-start space-x-2 text-primary-foreground/80">
                    <MapPin className="w-4 h-4 mt-1 text-accent flex-shrink-0" />
                    <span className="text-sm">{location.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-primary-foreground/80">
                    <Phone className="w-4 h-4 text-accent" />
                    <a 
                      href={`tel:${location.phone}`}
                      className="text-sm hover:text-accent transition-colors"
                    >
                      {location.phone}
                    </a>
                  </div>
                </div>
              ))}
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-primary-foreground/80">
                  <Mail className="w-4 h-4 text-accent" />
                  <a 
                    href="mailto:info@kaisanassociates.com"
                    className="text-sm hover:text-accent transition-colors"
                  >
                    info@kaisanassociates.com
                  </a>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <Button 
                asChild
                className="bg-success hover:bg-success/90 text-success-foreground w-full mt-4"
              >
                <a 
                  href="https://wa.me/971501234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-primary-foreground/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h4 className="text-xl font-playfair font-semibold mb-4">
              {t('footer.newsletter.heading')}
            </h4>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              {t('footer.newsletter.text')}
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto space-y-3 sm:space-y-0 sm:space-x-3">
              <input 
                type="email" 
                placeholder={t('footer.newsletter.placeholder')}
                className="flex-1 px-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button className="bg-accent hover:bg-accent-light text-accent-foreground">
                {t('footer.newsletter.subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-primary-foreground/80 text-sm">
                © {currentYear} Kaisan Associates. {t('footer.rights')}
              </p>
              <p className="text-primary-foreground/60 text-xs mt-1">
                Transforming lives through excellence in training and mentorship
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link 
                to="/privacy" 
                className="text-primary-foreground/80 hover:text-accent transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-primary-foreground/80 hover:text-accent transition-colors"
              >
                Terms of Service
              </Link>
              <div className="flex items-center space-x-2 text-primary-foreground/60">
                <Award className="w-4 h-4 text-accent" />
                <span>{t('footer.iso')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;