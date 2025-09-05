import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/ui/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Users,
  Award,
  Star,
  Calendar,
  Play,
  CheckCircle,
  User,
  MessageCircle,
  Download,
  Video,
  Heart,
  Share2,
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { fetchCourseById, fetchCourses } from "@/lib/api";
import WishlistButton from "@/components/WishlistButton";
import ConsultationModal from "@/components/ConsultationModal";
import EnrollmentFormModal from '@/components/EnrollmentFormModal';
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from '@/context/LanguageContext';

// Simple share helper
function shareCourse(title: string, url: string, fallback: () => void) {
  if (navigator.share) {
    navigator.share({ title, url: window.location.origin + url }).catch(() => fallback());
  } else fallback();
}

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "premium">("standard");
  const [showEnroll, setShowEnroll] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        const courseData = await fetchCourseById(courseId);
        setCourse(courseData);
        
        if (courseData) {
          const allCourses = await fetchCourses();
          const relatedCourses = allCourses
            .filter(c => c.id !== courseData.id && c.category === courseData.category)
            .slice(0, 3);
          setRelated(relatedCourses);
        }
      } catch (error) {
        console.error('Error loading course data:', error);
        toast({
          title: "Error",
          description: "Failed to load course information",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseId, toast]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background" dir={dir}>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-4xl font-bold mb-4">Loading Course Details</h1>
          <p className="text-muted-foreground">Please wait while we load the course information...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // If course not found show simple 404 state
  if (!course) {
    return (
      <div className="min-h-screen bg-background" dir={dir}>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('course.notFound.title')}</h1>
          <p className="text-muted-foreground mb-6">{t('course.notFound.desc')}</p>
          <Button asChild className="btn-hero">
            <Link to="/courses">{t('nav.courses')}</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Placeholder pricing tiers if price exists; premium = 1.7x
  const pricing = {
    standard: {
      price: course.price ?? 0,
      currency: course.price === null ? "" : course.currency,
      features: [
        "Access to live/recorded sessions",
        "Downloadable resources",
        "Community access",
        "Completion certificate"
      ]
    },
    premium: {
      price: course.price ? Math.round(course.price * 1.7) : 0,
      currency: course.price === null ? "" : course.currency,
      features: [
        "Everything in Standard",
        "1:1 coaching (monthly)",
        "Priority support",
        "Bonus masterclass recordings"
      ]
    }
  } as const;

  // Related courses are now loaded via useEffect

  const handleEnroll = () => {
    setShowEnroll(true);
  };

  const handleBrochure = () => {
    toast({ title: t('toast.brochure.title'), description: t('toast.brochure.desc') });
  };

  const handleShare = () => {
    shareCourse(course.title, `/courses/${course.id}`, () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({ title: t('toast.share.copied'), description: t('toast.share.desc') });
      });
    });
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button asChild variant="ghost" className="mb-4" onClick={(e) => { e.preventDefault(); navigate(-1); }}>
          <Link to="/courses">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('course.back')}
          </Link>
        </Button>
      </div>

      <section className="py-12 bg-gradient-to-br from-primary via-primary-light to-accent-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Badge className="bg-accent/20 text-accent border-accent/30 mb-4">
                {course.category}
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-primary-foreground mb-4">{course.title}</h1>
              {course.subtitle && <p className="text-xl text-accent mb-6">{course.subtitle}</p>}
              <p className="text-lg text-primary-foreground/90 mb-8 leading-relaxed">{course.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center"><div className="text-2xl font-bold text-primary-foreground">{course.students}</div><div className="text-primary-foreground/80 text-sm">{t('course.students')}</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-primary-foreground">{course.rating}</div><div className="text-primary-foreground/80 text-sm">{t('course.rating')}</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-primary-foreground">{course.duration}</div><div className="text-primary-foreground/80 text-sm">{t('course.duration.label')}</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-primary-foreground">{course.format}</div><div className="text-primary-foreground/80 text-sm">{t('course.format.label')}</div></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-primary-foreground/90">
                <div className="flex items-center space-x-2"><Clock className="w-5 h-5 text-accent" /><span>{course.schedule}</span></div>
                <div className="flex items-center space-x-2"><Video className="w-5 h-5 text-accent" /><span>{course.format}</span></div>
                <div className="flex items-center space-x-2"><User className="w-5 h-5 text-accent" /><span>{course.instructor}</span></div>
                <div className="flex items-center space-x-2"><Star className="w-5 h-5 text-accent" /><span>{course.rating} {t('course.rating')}</span></div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <Card className="card-elevated sticky top-20">
                <CardHeader>
                  <div className="text-center">
                    {course.price !== null ? (
                      <div className="text-3xl font-bold text-primary mb-2">{course.currency}{pricing[selectedPlan].price.toLocaleString()}</div>
                    ) : (
                      <div className="text-2xl font-bold text-primary mb-2">{t('course.plan.customPricing')}</div>
                    )}
                    {course.price !== null && <p className="text-muted-foreground">{t('course.plan.perPerson')}</p>}
                  </div>
                  {course.price !== null && (
                    <Tabs value={selectedPlan} onValueChange={(v) => setSelectedPlan(v as any)} className="w-full mt-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="standard">{t('course.plan.standard')}</TabsTrigger>
                        <TabsTrigger value="premium">{t('course.plan.premium')}</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {pricing[selectedPlan].features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-success" /><span className="text-sm">{feature}</span></div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <Button className="w-full btn-hero" onClick={handleEnroll} disabled={isEnrolling}>
                      {isEnrolling && <ButtonSpinner />}
                      {isEnrolling ? t('course.processing') : t('course.enrollNow')}
                    </Button>
                    <div className="flex space-x-2">
                      <WishlistButton item={{ id: course.id, title: course.title, price: course.price ?? course.currency }} variant="outline" size="sm" className="flex-1" />
                      <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-1" /> {t('course.share')}
                      </Button>
                    </div>
                    <div className="text-center pt-4">
                      <Button asChild variant="ghost" size="sm" className="text-primary">
                        <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="w-4 h-4 mr-1" /> {t('course.chatCustomPlans')}
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
                  <TabsTrigger value="overview">{t('nav.about')}</TabsTrigger>
                  <TabsTrigger value="curriculum">{t('course.curriculum.title')}</TabsTrigger>
                  <TabsTrigger value="instructor">{t('course.instructor.title')}</TabsTrigger>
                  <TabsTrigger value="reviews">{t('course.reviews.title')}</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-8">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-playfair font-bold mb-4">{t('course.highlights.title')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.highlights.map((h,i)=>(
                          <div key={i} className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-success" /><span>{h}</span></div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-playfair font-bold mb-4">{t('course.features.title')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {course.features.slice(0,3).map((f,i)=>(
                          <div key={i} className="card-feature text-center p-4">
                            <Heart className="w-8 h-8 text-accent mx-auto mb-3" />
                            <p className="text-sm font-medium leading-relaxed">{f}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="curriculum" className="mt-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-playfair font-bold">{t('course.curriculum.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('course.curriculum.soon')}</p>
                  </div>
                </TabsContent>
                <TabsContent value="instructor" className="mt-8">
                  <Card className="card-elevated">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-semibold mb-4">{t('course.instructor.title')}</h4>
                      <p className="text-muted-foreground mb-2">{course.instructor}</p>
                      <p className="text-sm text-muted-foreground">{t('course.instructor.moreSoon')}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="reviews" className="mt-8">
                  <p className="text-sm text-muted-foreground">{t('course.reviews.soon')}</p>
                </TabsContent>
              </Tabs>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <Card className="card-elevated">
                <CardHeader><CardTitle>{t('course.quickActions')}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full">
                    <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer"><MessageCircle className="w-4 h-4 mr-2" /> {t('course.whatsappSupport')}</a>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleBrochure}>
                    <Download className="w-4 h-4 mr-2" /> {t('course.downloadBrochure')}
                  </Button>
                  <ConsultationModal trigger={
                    <Button variant="outline" className="w-full"><Calendar className="w-4 h-4 mr-2" /> {t('cta.getFreeConsultation')}</Button>
                  } />
                </CardContent>
              </Card>
              <Card className="card-elevated">
                <CardHeader><CardTitle>{t('course.related')}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {related.map(r => (
                    <div key={r.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{r.title}</p>
                        <p className="text-primary text-xs">{r.price === null ? r.currency : r.currency + r.price.toLocaleString()}</p>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <Link to={`/courses/${r.id}`}>{t('actions.viewDetails')}</Link>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <EnrollmentFormModal open={showEnroll} onOpenChange={setShowEnroll} courseId={course.id} courseTitle={course.title} />
      <Footer />
    </div>
  );
};

export default CourseDetail;