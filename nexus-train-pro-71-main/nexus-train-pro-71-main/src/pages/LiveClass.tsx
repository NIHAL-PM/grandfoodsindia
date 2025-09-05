import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone,
  MessageCircle,
  Users,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Share2,
  Settings,
  FileText,
  Download,
  Upload,
  Hand,
  MoreVertical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LiveClassData {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  instructor: string;
  date: string;
  time: string;
  duration: number;
  type: "online" | "offline" | "hybrid";
  mode: "google-meet" | "zoom" | "teams" | "in-person";
  meetingLink?: string;
  location?: string;
  description: string;
  students: string[];
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  materials: string[];
  recordingUrl?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  type: "message" | "question" | "announcement";
}

const LiveClass = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const { user, isTrainer, isStudent } = useAuth();
  
  const [classData, setClassData] = useState<LiveClassData | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [handRaised, setHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClassData();
  }, [classId]);

  const loadClassData = () => {
    // Mock class data - in real app, fetch from API
    const mockClassData: LiveClassData = {
      id: classId || "1",
      title: "Building Self Awareness",
      courseId: "prp-mentoring",
      courseName: "PRP Mentoring Program",
      instructor: "Dr. Rashid Gazzali",
      date: "2024-01-25",
      time: "14:00",
      duration: 120,
      type: "online",
      mode: "google-meet",
      meetingLink: "https://meet.google.com/xyz-uvwx-stu",
      description: "Deep dive into self-awareness techniques and reflection exercises.",
      students: ["1", "2", "3"],
      status: "ongoing",
      materials: ["self-awareness-guide.pdf", "reflection-worksheet.pdf"],
      recordingUrl: "https://example.com/recording"
    };

    // Mock chat messages
    const mockMessages: ChatMessage[] = [
      {
        id: "1",
        userId: "instructor",
        userName: "Dr. Rashid Gazzali",
        message: "Welcome everyone! Today we'll explore self-awareness techniques.",
        timestamp: new Date().toISOString(),
        type: "announcement"
      },
      {
        id: "2",
        userId: "2",
        userName: "Priya Nair",
        message: "Thank you for the session! Very insightful.",
        timestamp: new Date().toISOString(),
        type: "message"
      }
    ];

    setClassData(mockClassData);
    setChatMessages(mockMessages);
    setLoading(false);
  };

  const joinClass = () => {
    if (classData?.meetingLink && classData.type === "online") {
      // Open the meeting link in a new tab
      window.open(classData.meetingLink, '_blank');
      setIsJoined(true);
      toast({ 
        title: "Joining class...", 
        description: "Opening meeting in a new window" 
      });
    } else if (classData?.type === "offline") {
      toast({ 
        title: "Offline Class", 
        description: `Please attend at: ${classData.location}`,
        variant: "destructive"
      });
    } else {
      toast({ 
        title: "Unable to join", 
        description: "Meeting link not available",
        variant: "destructive"
      });
    }
  };

  const leaveClass = () => {
    setIsJoined(false);
    setVideoEnabled(false);
    setAudioEnabled(false);
    toast({ title: "Left the class" });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user?.id || "anonymous",
      userName: user?.email?.split('@')[0] || "Anonymous",
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: "message"
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage("");
    toast({ title: "Message sent" });
  };

  const toggleHand = () => {
    setHandRaised(!handRaised);
    toast({ 
      title: handRaised ? "Hand lowered" : "Hand raised",
      description: handRaised ? "You lowered your hand" : "You raised your hand to speak"
    });
  };

  const downloadMaterial = (materialName: string) => {
    toast({ 
      title: "Downloading material", 
      description: `Downloading ${materialName}...` 
    });
    // In real app, implement actual file download
  };

  const shareScreen = () => {
    toast({ 
      title: "Screen sharing", 
      description: "Screen sharing feature would be implemented here" 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background" dir={dir}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading class...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-background" dir={dir}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Class Not Found</h1>
            <p className="text-muted-foreground mb-6">The requested class could not be found.</p>
            <Button onClick={() => navigate('/courses')}>
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Navigation />
      
      {/* Class Header */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">{classData.title}</h1>
              <p className="text-primary-foreground/90 mb-4">{classData.courseName}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <Badge className="bg-primary-foreground/20 text-primary-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(classData.date).toLocaleDateString()}
                </Badge>
                <Badge className="bg-primary-foreground/20 text-primary-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  {classData.time} ({classData.duration} min)
                </Badge>
                <Badge className="bg-primary-foreground/20 text-primary-foreground">
                  <Users className="w-3 h-3 mr-1" />
                  {classData.students.length} students
                </Badge>
                {classData.location && (
                  <Badge className="bg-primary-foreground/20 text-primary-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    {classData.location}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {!isJoined ? (
                <Button 
                  onClick={joinClass}
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Join Class
                </Button>
              ) : (
                <Button 
                  onClick={leaveClass}
                  variant="destructive"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Leave Class
                </Button>
              )}
              <Button 
                variant="outline" 
                className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => navigate(`/courses/${classData.courseId}`)}
              >
                Course Details
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Video Area */}
            <Card className="card-elevated">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center relative">
                  {isJoined ? (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-16 h-16 mx-auto mb-4 text-primary" />
                        <p className="text-lg font-semibold">Live Class in Progress</p>
                        <p className="text-muted-foreground">Meeting opened in new window</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <VideoOff className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-semibold text-muted-foreground">Class Preview</p>
                      <p className="text-muted-foreground">Join the class to participate</p>
                    </div>
                  )}
                  
                  {/* Video Controls */}
                  {isJoined && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center space-x-2 bg-black/50 rounded-full px-4 py-2">
                        <Button
                          size="sm"
                          variant={videoEnabled ? "default" : "outline"}
                          onClick={() => setVideoEnabled(!videoEnabled)}
                          className="rounded-full"
                        >
                          {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant={audioEnabled ? "default" : "outline"}
                          onClick={() => setAudioEnabled(!audioEnabled)}
                          className="rounded-full"
                        >
                          {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant={handRaised ? "default" : "outline"}
                          onClick={toggleHand}
                          className="rounded-full"
                        >
                          <Hand className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={shareScreen}
                          className="rounded-full"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Class Materials */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Class Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classData.materials.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {classData.materials.map((material, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium">{material}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => downloadMaterial(material)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No materials available for this class
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Class Description */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>About This Class</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {classData.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Chat */}
            <Card className="card-elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Class Chat
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowChat(!showChat)}
                  >
                    {showChat ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              {showChat && (
                <CardContent className="space-y-4">
                  <div className="h-64 overflow-y-auto space-y-3 border rounded-lg p-3 bg-muted/20">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{message.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                          {message.type === "announcement" && (
                            <Badge variant="outline" className="text-xs">
                              Announcement
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="sm">
                      Send
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Participants */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Participants ({classData.students.length + 1})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Instructor */}
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-primary/5">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {classData.instructor.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{classData.instructor}</p>
                    <p className="text-xs text-muted-foreground">Instructor</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Host</Badge>
                </div>

                {/* Students */}
                {classData.students.map((studentId, index) => (
                  <div key={studentId} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>S{index + 1}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Student {index + 1}</p>
                      <p className="text-xs text-muted-foreground">Participant</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LiveClass;