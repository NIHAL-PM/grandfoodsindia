import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTrainerById } from '@/lib/trainers';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowLeft, Star, Users, BookOpen, Award, Globe, MessageCircle, Share2, Mail, Phone, MapPin, Clock, Calendar, GraduationCap } from 'lucide-react';
import { fetchCourses } from '@/lib/api';
import { useState, useEffect } from 'react';
import ScheduleCallModal from '@/components/ScheduleCallModal';
import { useToast } from '@/hooks/use-toast';

const TrainerProfile = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trainer, setTrainer] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadTrainerData = async () => {
      if (!trainerId) return;
      
      try {
        setLoading(true);
        const trainerData = await getTrainerById(trainerId);
        setTrainer(trainerData);
        
        if (trainerData) {
          const allCourses = await fetchCourses();
          const trainerCourses = allCourses.filter(course => 
            course.trainer_id === trainerData.id || 
            course.instructor?.toLowerCase().includes(trainerData.name.toLowerCase())
          );
          setCourses(trainerCourses);
        }
      } catch (error) {
        console.error('Error loading trainer data:', error);
        toast({
          title: "Error",
          description: "Failed to load trainer information",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadTrainerData();
  }, [trainerId, toast]);

  const shareProfile = async () => {
    if (!trainer) return;
    const url = window.location.href;
    const text = `Check out ${trainer.name}'s profile on Kaisan Associates`;
    if (navigator.share) {
      try { await navigator.share({ title: trainer.name, text, url }); } catch { /* ignore */ }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {/* ignore */}
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold mb-4">Loading Trainer Profile</h1>
            <p className="text-muted-foreground">Please wait while we load the trainer information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Trainer Not Found</h1>
            <p className="text-muted-foreground mb-4">The trainer you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/trainers">Browse All Trainers</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trainers
          </Button>
        </div>
      </div>

      <section className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-6">
          {trainer && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
              {/* Main Profile Section */}
              <div className="xl:col-span-3 space-y-12">
                {/* Hero Profile Card */}
                <Card className="overflow-hidden shadow-xl">
                  <div className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 p-12">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
                      {/* Profile Images */}
                      <div className="relative">
                        <div className="w-48 h-48 lg:w-56 lg:h-56 mx-auto lg:mx-0">
                          {trainer.images && trainer.images.length > 1 ? (
                            <Carousel className="w-full h-full">
                              <CarouselContent>
                                {trainer.images.map((img, index) => (
                                  <CarouselItem key={index}>
                                    <div className="relative w-full h-full">
                                      {img.startsWith('/') || img.startsWith('http') ? (
                                        <img 
                                          src={img} 
                                          alt={`${trainer.name} - Image ${index + 1}`}
                                          className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white/20"
                                        />
                                      ) : (
                                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-6xl text-white shadow-2xl border-4 border-white/20">
                                          {img}
                                        </div>
                                      )}
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              <CarouselPrevious className="left-2 bg-white/90 border-0 shadow-lg hover:bg-white" />
                              <CarouselNext className="right-2 bg-white/90 border-0 shadow-lg hover:bg-white" />
                            </Carousel>
                          ) : (
                            <div className="relative w-full h-full">
                              {trainer.image.startsWith('/') || trainer.image.startsWith('http') ? (
                                <img 
                                  src={trainer.image} 
                                  alt={trainer.name}
                                  className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white/20"
                                />
                              ) : (
                                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-6xl text-white shadow-2xl border-4 border-white/20">
                                  {trainer.image}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {/* Rating Badge */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0">
                          <div className="bg-white rounded-full px-6 py-3 shadow-lg border-2 border-primary/10">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                              <Star className="w-5 h-5 text-yellow-500 fill-current"/>
                              <span className="text-gray-900">{trainer.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1 text-center lg:text-left space-y-6">
                        <div>
                          <h1 className="text-5xl lg:text-6xl font-playfair font-bold text-gray-900 mb-4">
                            {trainer.name}
                          </h1>
                          <p className="text-2xl lg:text-3xl text-accent font-semibold mb-6">
                            {trainer.title}
                          </p>
                          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-3 mb-6">
                            <Badge variant="default" className="text-lg font-medium">
                              {trainer.specialization}
                            </Badge>
                          </div>
                        </div>

                        {/* Key Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-primary mb-2">
                              <Users className="w-6 h-6"/>
                              <span className="text-3xl font-bold">{trainer.students.toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Learners</p>
                          </div>
                          <div className="text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-accent mb-2">
                              <BookOpen className="w-6 h-6"/>
                              <span className="text-3xl font-bold">{trainer.courses}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Courses</p>
                          </div>
                          <div className="text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-success mb-2">
                              <Globe className="w-6 h-6"/>
                              <span className="text-lg font-semibold">17</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Countries</p>
                          </div>
                          <div className="text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-warning mb-2">
                              <Award className="w-6 h-6"/>
                              <span className="text-lg font-semibold">Top 10</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Life Coach</p>
                          </div>
                        </div>

                        {/* Languages */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                          {trainer.languages.map(lang => (
                            <Badge key={lang} variant="outline" className="text-sm">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* About Section */}
                <Card className="shadow-xl">
                  <CardHeader className="pb-8">
                    <CardTitle className="text-3xl font-playfair">About Dr. Rashid</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-10">
                    <p className="text-xl leading-relaxed text-muted-foreground">
                      {trainer.bio}
                    </p>

                    {/* Expertise */}
                    <div>
                      <h3 className="text-2xl font-semibold mb-6 text-gray-900">Key Expertise</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {trainer.expertise.map(skill => (
                          <div key={skill} className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/10">
                            <span className="text-base font-medium text-gray-800">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Credentials & Achievements */}
                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                          <GraduationCap className="w-6 h-6 text-primary"/>
                          Education & Credentials
                        </h3>
                        <div className="space-y-4">
                          {trainer.credentials.map(credential => (
                            <div key={credential} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                              <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-base text-gray-700">{credential}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                          <Award className="w-6 h-6 text-accent"/>
                          Recognition & Achievements
                        </h3>
                        <div className="space-y-4">
                          {trainer.achievements.map(achievement => (
                            <div key={achievement} className="flex items-start gap-4 p-4 bg-accent/5 rounded-xl">
                              <div className="w-3 h-3 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-base text-gray-700">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Courses Section */}
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-3xl font-playfair">Courses by {trainer.name.split(' ')[0]}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {courses.length === 0 && <p className="text-lg text-muted-foreground">No courses mapped yet.</p>}
                    {courses.map(c => (
                      <Link key={c.id} to={`/courses/${c.id}`} className="block p-6 border rounded-xl hover:bg-muted transition text-base">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{c.title}</span>
                          <Badge variant="secondary" className="ml-2 text-sm">{c.duration}</Badge>
                        </div>
                        {c.subtitle && <p className="text-sm text-muted-foreground mt-2">{c.subtitle}</p>}
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              {/* Sidebar */}
              <div className="xl:col-span-1 space-y-8">
                {/* Contact & Action Card */}
                <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10 shadow-xl">
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-semibold text-gray-900">
                      Ready to Learn?
                    </CardTitle>
                    <p className="text-base text-muted-foreground">
                      Book a consultation or enroll in a course
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ScheduleCallModal
                      trainerId={trainer?.id || "dr-rashid-gazzali"}
                      trainerName={trainer?.name || "Dr. Rashid Gazzali"}
                      trigger={
                        <Button 
                          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-4 text-base shadow-lg"
                        >
                          <Calendar className="w-5 h-5 mr-3" />
                          Schedule Consultation
                        </Button>
                      }
                    />
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 py-4"
                      onClick={() => {
                        navigate('/courses');
                        toast({
                          title: "Browse Courses",
                          description: "Exploring available courses...",
                        });
                      }}
                    >
                      <BookOpen className="w-5 h-5 mr-3"/>
                      Browse Courses
                    </Button>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-base text-muted-foreground mb-3">
                        <span>Response time</span>
                        <span className="text-success font-medium">Within 2 hours</span>
                      </div>
                      <div className="flex items-center justify-between text-base text-muted-foreground">
                        <span>Consultation fee</span>
                        <span className="text-primary font-medium">Free 15 min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location & Contact Info */}
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-primary"/>
                      Location & Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Globe className="w-5 h-5 text-muted-foreground mt-1"/>
                        <div>
                          <p className="font-medium text-base">{trainer.location}</p>
                          <p className="text-sm text-muted-foreground">Primary location</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <Clock className="w-5 h-5 text-muted-foreground mt-1"/>
                        <div>
                          <p className="font-medium text-base">GMT+5:30 (IST)</p>
                          <p className="text-sm text-muted-foreground">Timezone</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Users className="w-5 h-5 text-muted-foreground mt-1"/>
                        <div>
                          <p className="font-medium text-base">Online & In-person</p>
                          <p className="text-sm text-muted-foreground">Session formats</p>
                        </div>
                      </div>
                    </div>

                    {trainer.social && (
                      <div className="pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-base mb-4 text-gray-900">Connect Online</h4>
                        <div className="flex gap-3">
                          {trainer.social.linkedin && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => {
                                window.open(trainer.social.linkedin, '_blank');
                                toast({
                                  title: "Opening LinkedIn",
                                  description: "Redirecting to professional profile...",
                                });
                              }}
                            >
                              <Globe className="w-4 h-4 mr-2"/>
                              LinkedIn
                            </Button>
                          )}
                          {trainer.social.website && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => {
                                window.open(trainer.social.website, '_blank');
                                toast({
                                  title: "Opening Website",
                                  description: "Visiting personal website...",
                                });
                              }}
                            >
                              <Globe className="w-4 h-4 mr-2"/>
                              Website
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contact buttons */}
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-base mb-4 text-gray-900">Direct Contact</h4>
                      <div className="flex flex-col gap-3">
                        {trainer.email && (
                          <Button 
                            asChild 
                            variant="outline" 
                            size="sm"
                          >
                            <a href={`mailto:${trainer.email}`}>
                              <Mail className="w-4 h-4 mr-2"/>
                              Email
                            </a>
                          </Button>
                        )}
                        {trainer.whatsapp && (
                          <Button 
                            asChild 
                            variant="outline" 
                            size="sm"
                          >
                            <a target="_blank" rel="noopener noreferrer" href={`https://wa.me/${trainer.whatsapp}`}>
                              <MessageCircle className="w-4 h-4 mr-2"/>
                              WhatsApp
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trainer.achievements.slice(0,4).map(achievement => (
                        <div key={achievement} className="flex items-start gap-4 p-3 rounded-xl bg-gray-50">
                          <Award className="w-5 h-5 text-accent mt-1 flex-shrink-0"/>
                          <span className="text-base text-gray-700">{achievement}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Button 
                        size="sm" 
                        onClick={shareProfile} 
                        variant="outline" 
                        className="w-full"
                      >
                        <Share2 className="w-4 h-4 mr-2"/>
                        {copied ? 'Link Copied!' : 'Share Profile'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TrainerProfile;
