import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Star,
  Award,
  Users,
  BookOpen,
  MessageCircle,
  Globe,
  Search,
  Filter,
  Heart,
  Share2,
  Calendar,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllTrainers, TrainerProfileData } from '@/lib/trainers';

const Trainers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [trainers, setTrainers] = useState<TrainerProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const domains = ["All", "Personal Development", "Professional Skills", "Relationship Mastery", "Corporate Training", "Leadership"];

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const trainerData = await getAllTrainers();
      setTrainers(trainerData);
      setError(null);
    } catch (err) {
      console.error('Error fetching trainers:', err);
      setError('Failed to load trainers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDomain = selectedDomain === "All" || trainer.specialization === selectedDomain;
    
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-accent-light py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-accent/20 text-accent border-accent/30 mb-6">
            Expert Trainers
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-primary-foreground mb-6">
            Learn from the
            <span className="block text-accent">Best in the World</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Meet our internationally recognized trainers and coaches who bring decades of expertise 
            to transform your personal and professional journey.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search trainers, expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {domains.map((domain) => (
                <Button
                  key={domain}
                  variant={selectedDomain === domain ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDomain(domain)}
                  className={selectedDomain === domain ? "btn-hero" : ""}
                >
                  {domain}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-muted-foreground">
            Showing {filteredTrainers.length} trainer{filteredTrainers.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Trainers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrainers.map((trainer, index) => (
              <Card key={trainer.id} className="card-elevated group hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full">
                    <img 
                      src={trainer.profile_image || "https://preview--nexus-train-pro-71.lovable.app/lovable-uploads/4ae0c283-5621-4539-ae99-05eb151b5ed8.png"}
                      alt={trainer.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://preview--nexus-train-pro-71.lovable.app/lovable-uploads/4ae0c283-5621-4539-ae99-05eb151b5ed8.png";
                      }}
                    />
                  </div>
                  
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {trainer.name}
                  </CardTitle>
                  
                  <p className="text-accent font-medium mb-2">{trainer.title}</p>
                  
                  <Badge className="mb-4">{trainer.specialization}</Badge>

                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-accent fill-current" />
                      <span>{trainer.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{trainer.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{trainer.courses}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {trainer.bio}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Expertise:</h4>
                      <div className="flex flex-wrap gap-1">
                        {trainer.expertise.slice(0, 3).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {trainer.expertise.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{trainer.expertise.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Experience:</span>
                      <span className="font-medium">{trainer.experience}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{trainer.location}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button asChild className="w-full btn-hero">
                      <Link to={`/trainers/${trainer.id}`}>
                        View Profile & Courses
                      </Link>
                    </Button>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          toast({
                            title: "Contact Trainer",
                            description: `Opening contact form for ${trainer.name}...`,
                          });
                          // In real app: Navigate to contact form or open modal
                          window.location.href = `mailto:${trainer.email}`;
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Contact
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          toast({
                            title: "Book Call",
                            description: `Opening booking form for ${trainer.name}...`,
                          });
                          // Navigate to trainer profile with booking modal
                          navigate(`/trainer-profile/${trainer.id}?book=true`);
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Book Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Trainer CTA */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-playfair font-bold mb-6">
            Join Our Expert Training Team
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Are you an experienced trainer or coach? Share your expertise with our global community 
            and make a meaningful impact on professionals worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild className="bg-accent hover:bg-accent-light text-accent-foreground text-lg px-8 py-4">
              <Link to="/become-trainer">
                <Users className="w-5 h-5 mr-2" />
                Become a Trainer
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8 py-4"
            >
              <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Get More Info
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-primary-foreground/80">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Global Reach</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Expert Recognition</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Supportive Community</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Trainers;