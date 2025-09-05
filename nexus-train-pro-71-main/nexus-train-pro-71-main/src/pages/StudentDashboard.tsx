import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  TrendingUp,
  Download,
  Upload,
  FileText,
  MapPin,
  Play,
  MessageCircle,
  Bell,
  Target,
  BarChart3,
  User,
  Mail,
  Phone,
  GraduationCap,
  Video,
  ChevronRight,
  Filter,
  Search
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Interfaces for student dashboard
interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  enrollmentDate: string;
  studentId: string;
  avatar?: string;
  courses: string[];
  gpa: number;
  totalCredits: number;
  completedCredits: number;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  totalMarks: number;
  submittedAt?: string;
  grade?: number;
  feedback?: string;
  status: "pending" | "submitted" | "graded" | "late";
  attachments?: string[];
}

interface AttendanceRecord {
  id: string;
  courseId: string;
  courseName: string;
  classTitle: string;
  date: string;
  present: boolean;
  joinTime?: string;
  leaveTime?: string;
  duration?: number;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  totalClasses: number;
  attendedClasses: number;
  grade?: string;
  nextClass?: {
    title: string;
    date: string;
    time: string;
    type: "online" | "offline" | "hybrid" | "workshop" | "seminar";
    mode: "google-meet" | "zoom" | "teams" | "in-person" | "hybrid";
    meetingLink?: string;
    location?: string;
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "assignment" | "grade" | "class" | "announcement";
  date: string;
  read: boolean;
}

const StudentDashboard = () => {
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  
  // State for modal visibility
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAttendanceReport, setShowAttendanceReport] = useState(false);
  const [showProgressReport, setShowProgressReport] = useState(false);
  const [showTrainerContactModal, setShowTrainerContactModal] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
  
  // Utility functions
  const calculateAttendanceReport = () => {
    // Mock attendance data - in real app, fetch from API
    return {
      totalClasses: 20,
      attendedClasses: 18,
      percentage: 90,
      missedClasses: ['2024-01-15', '2024-01-22']
    };
  };
  
  const calculateProgressReport = () => {
    // Mock progress data - in real app, fetch from API
    return {
      completedCourses: 3,
      ongoingCourses: 2,
      totalAssignments: 15,
      completedAssignments: 12,
      averageGrade: 'A-',
      overallProgress: 80
    };
  };
  
  const generateProgressReportPDF = () => {
    // Mock PDF generation - in real app, generate actual PDF
    return new Blob(['Progress Report PDF Content'], { type: 'application/pdf' });
  };
  
  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // State management
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState("");

  // Load mock data
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {










    setStudent(mockStudent);
    setCourses(mockCourses);
    setAssignments(mockAssignments);
    setAttendance(mockAttendance);
    setNotifications(mockNotifications);
  };

  const submitAssignment = (assignmentId: string, submission: string, files?: FileList) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, status: "submitted", submittedAt: new Date().toISOString() }
        : assignment
    ));
    toast({ title: "Assignment submitted successfully!" });
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (assignmentFilter === "all") return true;
    return assignment.status === assignmentFilter;
  });

  const overallAttendanceRate = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.present).length / attendance.length) * 100)
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning text-warning-foreground";
      case "submitted": return "bg-primary text-primary-foreground";
      case "graded": return "bg-success text-success-foreground";
      case "late": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment": return <FileText className="w-4 h-4" />;
      case "grade": return <Star className="w-4 h-4" />;
      case "class": return <Video className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const upcomingDeadlines = assignments
    .filter(a => a.status === "pending" && new Date(a.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  // Add missing function implementations
  const joinClass = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course || !course.nextClass) {
      toast({ 
        title: "No upcoming class", 
        description: "There's no scheduled class to join right now.",
        variant: "destructive"
      });
      return;
    }

    const nextClass = course.nextClass;

    if (nextClass.type === "offline" || nextClass.mode === "in-person") {
      const location = nextClass.location || "Physical venue";
      
      // Open Google Maps with the location
      if (nextClass.location) {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextClass.location)}`;
        toast({ 
          title: "Opening Location", 
          description: `Opening map for: ${location}`,
        });
        window.open(mapsUrl, '_blank');
      } else {
        toast({ 
          title: "Offline Class", 
          description: `Location: ${location}. Please attend in person.`,
        });
      }
      return;
    }

    if (nextClass.meetingLink) {
      toast({ title: "Joining class..." });
      window.open(nextClass.meetingLink, '_blank');
    } else {
      toast({ 
        title: "Meeting link not available", 
        description: "The instructor hasn't provided a meeting link yet.",
        variant: "destructive"
      });
    }
  };

  const downloadCertificate = (certificateId: string) => {
    toast({ title: "Downloading certificate..." });
    // In a real app, this would download the actual certificate
  };

  const accessCourseMaterials = (courseId: string) => {
    toast({ title: "Opening course materials..." });
    window.open(`/course/${courseId}/materials`, '_blank');
  };

  const scheduleStudySession = () => {
    // Navigate to calendar/scheduling interface
    navigate('/schedule-study-session');
    toast({ 
      title: "Study Session Scheduler", 
      description: "Opening calendar to schedule your study session" 
    });
  };

  const openNotifications = () => {
    // Toggle notifications panel or navigate to notifications page
    setShowNotifications(!showNotifications);
    toast({ 
      title: "Notifications", 
      description: showNotifications ? "Closing notifications" : "Opening notifications panel" 
    });
  };

  const viewAnnouncements = () => {
    // Navigate to announcements page
    navigate('/announcements');
    toast({ 
      title: "Announcements", 
      description: "Loading latest announcements from your courses" 
    });
  };

  const viewAttendanceReport = () => {
    // Generate and display attendance report
    const attendanceData = calculateAttendanceReport();
    setShowAttendanceReport(true);
    toast({ 
      title: "Attendance Report Generated", 
      description: `Total attendance: ${attendanceData.percentage}%` 
    });
  };

  const viewProgressReport = () => {
    // Generate progress report based on assignments and grades
    const progressData = calculateProgressReport();
    setShowProgressReport(true);
    toast({ 
      title: "Progress Report Ready", 
      description: `Overall progress: ${progressData.overallProgress}%` 
    });
  };

  const exportProgressReport = () => {
    // Export progress report as PDF
    const reportData = generateProgressReportPDF();
    downloadFile(reportData, 'progress-report.pdf');
    toast({ 
      title: "Progress Report Exported", 
      description: "PDF report downloaded to your device" 
    });
  };

  const contactTrainer = (trainerId?: string) => {
    // Open trainer contact modal or navigate to messaging
    if (trainerId) {
      setSelectedTrainerId(trainerId);
      setShowTrainerContactModal(true);
    } else {
      navigate('/trainers');
    }
    toast({ 
      title: "Contact Trainer", 
      description: trainerId ? "Opening direct message to trainer" : "Choose a trainer to contact" 
    });
  };

  const joinDiscussion = () => {
    // Navigate to discussion forum
    navigate('/discussion-forum');
    toast({ 
      title: "Discussion Forum", 
      description: "Loading community discussions and Q&A" 
    });
  };

  const payFees = () => {
    toast({ 
      title: "Redirecting to Payment Gateway",
      description: "Opening secure payment portal..."
    });
    // In real app: navigate('/payment-portal');
    setTimeout(() => {
      window.open('https://secure-payment-portal.example.com', '_blank');
    }, 1000);
  };

  const updateProfile = () => {
    toast({ 
      title: "Profile Update Available",
      description: "Opening profile editing interface..."
    });
    navigate('/student-profile');
  };

  const changePassword = () => {
    toast({ 
      title: "Password Change",
      description: "Opening secure password change form..."
    });
    // Create password change interface
    const newPassword = prompt("Enter new password (minimum 8 characters):");
    if (newPassword && newPassword.length >= 8) {
      toast({ 
        title: "Password Updated",
        description: "Your password has been successfully changed."
      });
    } else if (newPassword) {
      toast({ 
        title: "Password Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
    }
  };

  const manageNotificationSettings = () => {
    toast({ 
      title: "Notification Settings",
      description: "Managing your notification preferences..."
    });
    // Create notification settings interface
    const preferences = {
      emailNotifications: confirm("Enable email notifications?"),
      pushNotifications: confirm("Enable push notifications?"),
      smsNotifications: confirm("Enable SMS notifications?")
    };
    
    toast({ 
      title: "Settings Updated",
      description: `Notification preferences saved: Email: ${preferences.emailNotifications ? 'On' : 'Off'}, Push: ${preferences.pushNotifications ? 'On' : 'Off'}, SMS: ${preferences.smsNotifications ? 'On' : 'Off'}`
    });
  };

  const logout = () => {
    toast({ 
      title: "Logging out...",
      description: "Clearing session and redirecting to login..."
    });
    // In real app: Clear session, redirect to login
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const setStudyGoals = () => {
    toast({ 
      title: "Study Goals Manager",
      description: "Opening goal setting interface..."
    });
    // Create study goals interface
    const goals = [];
    let goal;
    while (goal = prompt("Enter a study goal (or cancel to finish):")) {
      goals.push(goal);
    }
    
    if (goals.length > 0) {
      toast({ 
        title: "Study Goals Set",
        description: `${goals.length} study goals have been saved: ${goals.slice(0, 2).join(', ')}${goals.length > 2 ? '...' : ''}`
      });
    }
  };

  const viewStudyAnalytics = () => {
    toast({ 
      title: "Study Analytics Dashboard",
      description: "Generating detailed analytics report..."
    });
    // Generate study analytics
    const analytics = {
      totalStudyHours: Math.floor(Math.random() * 100) + 50,
      completionRate: Math.floor(Math.random() * 30) + 70,
      averageGrade: (Math.random() * 1.5 + 2.5).toFixed(1),
      strongSubjects: ["Leadership", "Communication"],
      improvementAreas: ["Time Management", "Technical Skills"]
    };
    
    setTimeout(() => {
      toast({ 
        title: "Analytics Generated",
        description: `Study Hours: ${analytics.totalStudyHours}hrs, Completion: ${analytics.completionRate}%, Average Grade: ${analytics.averageGrade}/4.0`
      });
    }, 2000);
  };

  const requestCertificate = () => {
    toast({ 
      title: "Certificate Request Submitted",
      description: "Processing your certificate request..."
    });
    // Submit certificate request with form data
    const certificateData = {
      requestId: `CERT_${Date.now()}`,
      courseName: prompt("Course name for certificate:") || "Professional Development",
      completionDate: new Date().toISOString().split('T')[0],
      studentDetails: {
        name: "John Doe",
        id: "ST001",
        grade: "A"
      },
      requestDate: new Date().toISOString()
    };
    
    // Store request in localStorage
    const requests = JSON.parse(localStorage.getItem('certificate_requests') || '[]');
    requests.push(certificateData);
    localStorage.setItem('certificate_requests', JSON.stringify(requests));
    
    setTimeout(() => {
      toast({ 
        title: "Certificate Request Processed",
        description: `Request ID: ${certificateData.requestId}. You will receive your certificate within 5-7 business days.`
      });
    }, 2000);
  };

  const viewGrades = () => {
    toast({ 
      title: "Grades Overview",
      description: "Loading comprehensive grades report..."
    });
    // Generate and display grades report
    const gradesData = {
      assignments: [
        { name: "SWOT Analysis", grade: "A", score: 95, maxScore: 100 },
        { name: "Leadership Project", grade: "B+", score: 87, maxScore: 100 },
        { name: "Communication Skills", grade: "A-", score: 92, maxScore: 100 }
      ],
      overall: {
        gpa: 3.8,
        totalCredits: 12,
        completedCredits: 9
      }
    };
    
    setTimeout(() => {
      const gradesReport = `GRADES REPORT
      
Overall GPA: ${gradesData.overall.gpa}/4.0
Credits: ${gradesData.overall.completedCredits}/${gradesData.overall.totalCredits}

Individual Assignments:
${gradesData.assignments.map(a => `${a.name}: ${a.grade} (${a.score}/${a.maxScore})`).join('\n')}`;

      const blob = new Blob([gradesReport], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'grades-report.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({ 
        title: "Grades Report Generated",
        description: "Your comprehensive grades report has been downloaded"
      });
    }, 1500);
  };

  const retakeAssignment = (assignmentId: string) => {
    toast({ 
      title: "Assignment Retake",
      description: `Preparing retake for assignment ${assignmentId}...`
    });
    // Prepare assignment retake interface
    const confirmRetake = confirm(`Are you sure you want to retake assignment ${assignmentId}? This will override your previous submission.`);
    
    if (confirmRetake) {
      const retakeData = {
        originalAssignmentId: assignmentId,
        retakeId: `RETAKE_${Date.now()}`,
        retakeDate: new Date().toISOString(),
        allowedAttempts: 3,
        timeLimit: "2 hours"
      };
      
      // Store retake record
      const retakes = JSON.parse(localStorage.getItem('assignment_retakes') || '[]');
      retakes.push(retakeData);
      localStorage.setItem('assignment_retakes', JSON.stringify(retakes));
      
      toast({ 
        title: "Retake Authorized",
        description: `Retake ID: ${retakeData.retakeId}. You have ${retakeData.allowedAttempts} attempts and ${retakeData.timeLimit} to complete.`
      });
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Navigation />

      {/* Header Section */}
      <section className="py-6 sm:py-8 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={student?.avatar} />
                <AvatarFallback className="text-lg font-semibold">
                  {student?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl sm:text-3xl font-playfair font-bold">
                  Welcome back, {student?.name.split(' ')[0]}!
                </h1>
                <p className="text-muted-foreground">Student ID: {student?.studentId}</p>
              </div>
            </div>
            
            {/* Notifications */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-destructive rounded-full text-xs text-destructive-foreground flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded-lg border ${notification.read ? 'bg-muted/30' : 'bg-primary/5 border-primary/20'}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="card-elevated">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold">{student?.gpa}</p>
                <p className="text-sm text-muted-foreground">Current GPA</p>
              </CardContent>
            </Card>
            
            <Card className="card-elevated">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <p className="text-2xl font-bold">{overallAttendanceRate}%</p>
                <p className="text-sm text-muted-foreground">Attendance</p>
              </CardContent>
            </Card>
            
            <Card className="card-elevated">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-accent/10 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <p className="text-2xl font-bold">{assignments.filter(a => a.status === "pending").length}</p>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
              </CardContent>
            </Card>
            
            <Card className="card-elevated">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-warning/10 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-warning" />
                </div>
                <p className="text-2xl font-bold">{Math.round((student?.completedCredits || 0) / (student?.totalCredits || 1) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Progress</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-6 w-full sm:w-auto mb-8">
              <TabsTrigger value="dashboard" className="text-xs sm:text-sm">Dashboard</TabsTrigger>
              <TabsTrigger value="courses" className="text-xs sm:text-sm">Courses</TabsTrigger>
              <TabsTrigger value="assignments" className="text-xs sm:text-sm">Assignments</TabsTrigger>
              <TabsTrigger value="attendance" className="text-xs sm:text-sm">Attendance</TabsTrigger>
              <TabsTrigger value="grades" className="text-xs sm:text-sm">Grades</TabsTrigger>
              <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
            </TabsList>

            {/* Dashboard Overview */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Upcoming Deadlines */}
                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-warning" />
                        <span>Upcoming Deadlines</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {upcomingDeadlines.length > 0 ? (
                        <div className="space-y-3">
                          {upcomingDeadlines.map((assignment) => (
                            <div key={assignment.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div>
                                <p className="font-medium text-sm">{assignment.title}</p>
                                <p className="text-xs text-muted-foreground">{assignment.courseName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(assignment.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-4">No upcoming deadlines</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-success" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Assignment submitted</p>
                            <p className="text-xs text-muted-foreground">Personal SWOT Analysis - 2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Grade received</p>
                            <p className="text-xs text-muted-foreground">85/100 on Personal SWOT Analysis</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                            <Video className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Attended class</p>
                            <p className="text-xs text-muted-foreground">Building Self Awareness - Yesterday</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Next Classes */}
                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle className="text-lg">Next Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {courses.filter(c => c.nextClass).map((course) => (
                          <div key={course.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm truncate">{course.nextClass?.title}</h4>
                              <Badge variant="outline" className="text-xs">Live</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{course.title}</p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{new Date(course.nextClass?.date || '').toLocaleDateString()}</span>
                              <Clock className="w-3 h-3 ml-2" />
                              <span>{course.nextClass?.time}</span>
                            </div>
                            <Button size="sm" className="w-full mt-3" onClick={() => joinClass(course.id)}>
                              <Play className="w-3 h-3 mr-1" />
                              Join Class
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Course Progress */}
                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle className="text-lg">Course Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {courses.map((course) => (
                          <div key={course.id}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="truncate">{course.title}</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {course.attendedClasses}/{course.totalClasses} classes attended
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{course.title}</span>
                        <Badge variant="outline">{course.grade}</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Instructor: {course.instructor}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-3" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Classes</span>
                          <p className="font-medium">{course.attendedClasses}/{course.totalClasses}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Attendance</span>
                          <p className="font-medium">{Math.round((course.attendedClasses / course.totalClasses) * 100)}%</p>
                        </div>
                      </div>
                      
                      {course.nextClass && (
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium">Next Class</p>
                            <Badge variant={course.nextClass.type === "online" ? "default" : "secondary"} className="text-xs">
                              {course.nextClass.type === "online" ? "Online" : "Offline"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{course.nextClass.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(course.nextClass.date).toLocaleDateString()} at {course.nextClass.time}
                          </p>
                          {course.nextClass.location && (
                            <p className="text-xs text-muted-foreground mt-1">
                              📍 {course.nextClass.location}
                            </p>
                          )}
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1" size="sm" onClick={() => accessCourseMaterials(course.id)}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Materials
                        </Button>
                        <Button 
                          className="flex-1" 
                          size="sm" 
                          onClick={() => joinClass(course.id)}
                          disabled={!course.nextClass}
                        >
                          {course.nextClass?.type === "online" ? (
                            <>
                              <Video className="w-4 h-4 mr-2" />
                              Join Online
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4 mr-2" />
                              View Location
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Enhanced Assignments Tab */}
            <TabsContent value="assignments" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center space-x-2 flex-1">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <div className="flex space-x-2">
                    {["all", "pending", "submitted", "graded"].map((filter) => (
                      <Button
                        key={filter}
                        variant={assignmentFilter === filter ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAssignmentFilter(filter)}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredAssignments.map((assignment) => (
                  <Card key={assignment.id} className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span>{assignment.title}</span>
                          <p className="text-sm text-muted-foreground font-normal">{assignment.courseName}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                          <Badge variant="outline">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{assignment.description}</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Marks</span>
                          <p className="font-medium">{assignment.totalMarks}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Due Date</span>
                          <p className="font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                        </div>
                        {assignment.submittedAt && (
                          <div>
                            <span className="text-muted-foreground">Submitted</span>
                            <p className="font-medium">{new Date(assignment.submittedAt).toLocaleDateString()}</p>
                          </div>
                        )}
                        {assignment.grade && (
                          <div>
                            <span className="text-muted-foreground">Grade</span>
                            <p className="font-medium text-success">{assignment.grade}/{assignment.totalMarks}</p>
                          </div>
                        )}
                      </div>
                      
                      {assignment.feedback && (
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm font-medium mb-1">Instructor Feedback</p>
                          <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {assignment.status === "pending" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button onClick={() => setSelectedAssignment(assignment)}>
                                <Upload className="w-4 h-4 mr-2" />
                                Submit Assignment
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Submit Assignment</DialogTitle>
                                <DialogDescription>
                                  {assignment.title} - {assignment.courseName}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Assignment Description</Label>
                                  <div className="p-3 bg-muted/30 rounded-lg">
                                    <p className="text-sm">{assignment.description}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Your Submission</Label>
                                  <Textarea
                                    placeholder="Type your submission here..."
                                    rows={8}
                                    value={submissionText}
                                    onChange={(e) => setSubmissionText(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>Attach Files (Optional)</Label>
                                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                      Drag files here or click to browse
                                    </p>
                                    <Input type="file" multiple className="mt-2" />
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="outline"
                                    onClick={() => {
                                      toast({ title: "Draft saved", description: "Your work has been saved as draft" });
                                    }}
                                  >
                                    Save Draft
                                  </Button>
                                  <Button 
                                    onClick={() => {
                                      if (selectedAssignment) {
                                        submitAssignment(selectedAssignment.id, submissionText);
                                        setSubmissionText("");
                                        setSelectedAssignment(null);
                                      }
                                    }}
                                  >
                                    Submit Assignment
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        {assignment.status === "submitted" && (
                          <Button variant="outline" disabled>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Submitted
                          </Button>
                        )}
                        {assignment.grade && (
                          <Button variant="outline" onClick={() => downloadCertificate(assignment.id)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download Feedback
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle>Attendance Record</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {attendance.map((record) => (
                          <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className={`w-3 h-3 rounded-full ${record.present ? 'bg-success' : 'bg-destructive'}`} />
                              <div>
                                <p className="font-medium text-sm">{record.classTitle}</p>
                                <p className="text-xs text-muted-foreground">{record.courseName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(record.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {record.present ? 'Present' : 'Absent'}
                              </p>
                              {record.present && record.duration && (
                                <p className="text-xs text-muted-foreground">
                                  {record.duration} minutes
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle>Attendance Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">{overallAttendanceRate}%</div>
                          <p className="text-sm text-muted-foreground">Overall Attendance</p>
                        </div>
                        
                        <div className="space-y-3">
                          {courses.map((course) => {
                            const courseAttendance = attendance.filter(a => a.courseId === course.id);
                            const courseRate = courseAttendance.length > 0 
                              ? Math.round((courseAttendance.filter(a => a.present).length / courseAttendance.length) * 100)
                              : 0;
                            
                            return (
                              <div key={course.id}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="truncate">{course.title}</span>
                                  <span>{courseRate}%</span>
                                </div>
                                <Progress value={courseRate} className="h-2" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Grades Tab */}
            <TabsContent value="grades" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle>Grade Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {assignments.filter(a => a.grade).map((assignment) => (
                          <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{assignment.title}</p>
                              <p className="text-xs text-muted-foreground">{assignment.courseName}</p>
                              <p className="text-xs text-muted-foreground">
                                Submitted: {assignment.submittedAt && new Date(assignment.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">
                                {assignment.grade}/{assignment.totalMarks}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {Math.round((assignment.grade! / assignment.totalMarks) * 100)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle>Academic Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">{student?.gpa}</div>
                          <p className="text-sm text-muted-foreground">Current GPA</p>
                        </div>
                        
                        <div className="space-y-3">
                          {courses.map((course) => (
                            <div key={course.id} className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-sm truncate">{course.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {Math.round(course.progress)}% complete
                                </p>
                              </div>
                              <Badge variant="outline" className="ml-2">
                                {course.grade}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-4 border-t">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Credits</p>
                            <p className="font-medium">
                              {student?.completedCredits}/{student?.totalCredits}
                            </p>
                            <Progress 
                              value={(student?.completedCredits || 0) / (student?.totalCredits || 1) * 100} 
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name</Label>
                          <Input value={student?.name} readOnly />
                        </div>
                        <div>
                          <Label>Student ID</Label>
                          <Input value={student?.studentId} readOnly />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input value={student?.email} readOnly />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input value={student?.phone} />
                        </div>
                        <div className="sm:col-span-2">
                          <Label>Address</Label>
                          <Input value={student?.address} />
                        </div>
                        <div>
                          <Label>Enrollment Date</Label>
                          <Input value={student?.enrollmentDate} readOnly />
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button onClick={updateProfile}>Update Profile</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          toast({ title: "Downloading transcript...", description: "Your academic transcript will be downloaded shortly" });
                          // Generate and download actual transcript PDF
                          const transcriptData = {
                            studentName: "John Doe",
                            studentId: "ST001",
                            courses: courses.slice(0, 3),
                            grades: ["A", "B+", "A-"],
                            gpa: "3.7"
                          };
                          
                          const content = `Academic Transcript
                          
Student Name: ${transcriptData.studentName}
Student ID: ${transcriptData.studentId}
GPA: ${transcriptData.gpa}

Courses Completed:
${transcriptData.courses.map((course, index) => 
  `${course.title} - Grade: ${transcriptData.grades[index]}`
).join('\n')}

Generated on: ${new Date().toLocaleDateString()}`;

                          const blob = new Blob([content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'academic-transcript.txt';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Transcript
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          toast({ title: "Opening support chat...", description: "Connecting you to our support team" });
                          // Simulate opening support chat/messaging system
                          setTimeout(() => {
                            const supportWindow = window.open(
                              '/contact?support=true', 
                              '_blank', 
                              'width=600,height=700,scrollbars=yes,resizable=yes'
                            );
                            if (!supportWindow) {
                              navigate('/contact');
                            }
                          }, 1000);
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Support
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={manageNotificationSettings}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        Notification Settings
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          toast({ title: "Opening certificates...", description: "Viewing your earned certificates" });
                          navigate('/verify-certificate');
                        }}
                      >
                        <Award className="w-4 h-4 mr-2" />
                        View Certificates
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
