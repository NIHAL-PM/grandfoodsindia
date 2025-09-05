import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ClassCreationModal from "@/components/ClassCreationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  Award, 
  BookOpen, 
  Clock, 
  CheckCircle,
  MessageCircle,
  Phone,
  Mail,
  Download,
  Plus,
  Eye,
  Edit,
  Filter,
  Search,
  Trash2,
  FileText,
  BarChart3,
  TrendingUp,
  Star,
  Video,
  Upload,
  MapPin
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock interfaces for trainer dashboard
interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  status: "active" | "completed" | "dropped";
  progress: number;
  lastActivity: string;
  courseId: string;
  courseName: string;
  attendance: number;
  assignments: {
    submitted: number;
    total: number;
  };
}

interface Class {
  id: string;
  title: string;
  courseId: string;
  courseName: string; // Added missing property
  date: string;
  time: string;
  duration: number;
  type: "online" | "offline" | "hybrid" | "workshop" | "seminar";
  mode: "google-meet" | "zoom" | "teams" | "in-person" | "hybrid";
  meetingLink?: string; // Google Meet link for online classes
  location?: string; // Physical location for offline classes
  description?: string; // Added missing property
  students: string[];
  attendance: {
    studentId: string;
    present: boolean;
    joinTime?: string;
    leaveTime?: string;
  }[];
  materials: string[];
  notes: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  dueDate: string;
  submissions: {
    studentId: string;
    submittedAt: string;
    grade?: number;
    feedback?: string;
    file?: string;
  }[];
  totalMarks: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  totalStudents: number;
  completedStudents: number;
  totalClasses: number;
  completedClasses: number;
  averageRating: number;
  revenue: number;
}

const TrainerDashboard = () => {
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  
  // State management
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Edit modal states
  const [editClassModalOpen, setEditClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [manageStudentsModalOpen, setManageStudentsModalOpen] = useState(false);
  const [managingClassStudents, setManagingClassStudents] = useState<Class | null>(null);

  // Load mock data
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {


    // Mock students






    // Initialize with empty arrays, data will be fetched from Supabase
    setCourses([]);
    setStudents([]);
    setClasses([]);
    setAssignments([]);
  };

  const markAttendance = (classId: string, studentId: string, present: boolean) => {
    setClasses(prev => prev.map(cls => {
      if (cls.id === classId) {
        const attendance = cls.attendance.filter(a => a.studentId !== studentId);
        attendance.push({ studentId, present });
        return { ...cls, attendance };
      }
      return cls;
    }));
    toast({ title: "Attendance updated" });
  };

  const markAllPresent = (classId: string) => {
    const selectedClass = classes.find(c => c.id === classId);
    if (selectedClass) {
      const updatedAttendance = selectedClass.students.map(studentId => ({
        studentId,
        present: true,
        joinTime: new Date().toTimeString().slice(0, 5),
        leaveTime: ""
      }));
      
      setClasses(prev => prev.map(cls => 
        cls.id === classId ? { ...cls, attendance: updatedAttendance } : cls
      ));
      toast({ title: `Marked all ${selectedClass.students.length} students as present` });
    }
  };

  const saveAttendance = (classId: string) => {
    // In a real app, this would save to backend
    toast({ title: "Attendance saved successfully!" });
  };

  const exportAttendance = (classId: string) => {
    const selectedClass = classes.find(c => c.id === classId);
    if (!selectedClass) return;

    const csvContent = [
      ['Student Name', 'Email', 'Status', 'Join Time', 'Leave Time'].join(','),
      ...selectedClass.students.map(studentId => {
        const student = students.find(s => s.id === studentId);
        const attendance = selectedClass.attendance.find(a => a.studentId === studentId);
        return [
          student?.name || '',
          student?.email || '',
          attendance?.present ? 'Present' : 'Absent',
          attendance?.joinTime || '',
          attendance?.leaveTime || ''
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedClass.title}-${selectedClass.date}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: "Attendance exported successfully!" });
  };

  const createNewClass = (classData: any) => {
    setClasses(prev => [...prev, classData]);
    toast({ 
      title: "Class created successfully!", 
      description: `${classData.type === 'online' ? 'Online' : 'Offline'} class "${classData.title}" has been scheduled.`
    });
  };

  const editClass = (classId: string) => {
    const classToEdit = classes.find(c => c.id === classId);
    if (classToEdit) {
      setEditingClass(classToEdit);
      setEditClassModalOpen(true);
    }
  };

  const manageClassStudents = (classId: string) => {
    const selectedClass = classes.find(c => c.id === classId);
    if (selectedClass) {
      setManagingClassStudents(selectedClass);
      setManageStudentsModalOpen(true);
    }
  };

  const updateClass = (updatedClass: Class) => {
    const updatedClasses = classes.map(cls => 
      cls.id === updatedClass.id 
        ? updatedClass
        : cls
    );
    setClasses(updatedClasses);
    setEditClassModalOpen(false);
    setEditingClass(null);
    toast({ 
      title: "Class Updated", 
      description: "Class details have been successfully updated." 
    });
  };

  const saveClassEdits = (updatedClass: Partial<Class>) => {
    if (editingClass) {
      const updatedClasses = classes.map(cls => 
        cls.id === editingClass.id 
          ? { ...cls, ...updatedClass }
          : cls
      );
      setClasses(updatedClasses);
      setEditClassModalOpen(false);
      setEditingClass(null);
      toast({ 
        title: "Class Updated", 
        description: "Class details have been successfully updated." 
      });
    }
  };

  const updateClassStudents = (classId: string, studentIds: string[]) => {
    const updatedClasses = classes.map(cls => 
      cls.id === classId 
        ? { ...cls, students: studentIds }
        : cls
    );
    setClasses(updatedClasses);
    setManageStudentsModalOpen(false);
    setManagingClassStudents(null);
    toast({ 
      title: "Students Updated", 
      description: "Class enrollment has been successfully updated." 
    });
  };

  const viewClass = (classId: string) => {
    const selectedClass = classes.find(c => c.id === classId);
    if (selectedClass) {
      toast({
        title: "Class Details",
        description: (
          <div className="space-y-2">
            <p><strong>Title:</strong> {selectedClass.title}</p>
            <p><strong>Course:</strong> {selectedClass.courseName}</p>
            <p><strong>Date:</strong> {new Date(selectedClass.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {selectedClass.time}</p>
            <p><strong>Duration:</strong> {selectedClass.duration} minutes</p>
            <p><strong>Type:</strong> {selectedClass.type}</p>
            <p><strong>Students:</strong> {selectedClass.students.length} enrolled</p>
            {selectedClass.type === 'online' && selectedClass.meetingLink && (
              <p><strong>Meeting:</strong> <a href={selectedClass.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Join Meeting</a></p>
            )}
            {selectedClass.type === 'offline' && selectedClass.location && (
              <p><strong>Location:</strong> {selectedClass.location}</p>
            )}
            {selectedClass.notes && (
              <p><strong>Notes:</strong> {selectedClass.notes}</p>
            )}
          </div>
        ),
      });
    }
  };

  const viewClassStudents = (classId: string) => {
    const selectedClass = classes.find(c => c.id === classId);
    if (selectedClass) {
      const enrolledStudents = students.filter(student => 
        selectedClass.students.includes(student.id)
      );
      
      toast({
        title: `Students in ${selectedClass.title}`,
        description: (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {enrolledStudents.length > 0 ? (
              enrolledStudents.map((student, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No students enrolled yet</p>
            )}
          </div>
        ),
      });
    }
  };

  const viewClassMaterials = (classId: string) => {
    const selectedClass = classes.find(c => c.id === classId);
    if (selectedClass) {
      toast({ 
        title: "Class Materials", 
        description: `Opening materials for ${selectedClass.title}` 
      });
      // Navigate to the course materials page
      navigate(`/course/${selectedClass.courseId}/materials`);
    }
  };

  const startClass = (classId: string) => {
    const selectedClass = classes.find(c => c.id === classId);
    if (!selectedClass) return;

    if (selectedClass.type === "offline" || selectedClass.mode === "in-person") {
      const location = selectedClass.location || "Physical venue";
      
      // Open Google Maps with the location
      if (selectedClass.location) {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedClass.location)}`;
        toast({ 
          title: "Opening Location", 
          description: `Opening map for: ${location}`,
        });
        window.open(mapsUrl, '_blank');
      } else {
        toast({ 
          title: "Offline Class", 
          description: `Class location: ${location}`,
        });
      }
      return;
    }

    if (selectedClass.meetingLink) {
      toast({ title: "Opening class meeting..." });
      window.open(selectedClass.meetingLink, '_blank');
    } else {
      toast({ 
        title: "No meeting link available", 
        description: "Please add a meeting link for this online class.",
        variant: "destructive"
      });
    }
  };

  const messageStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      const phone = (student.phone || '').replace(/[^0-9]/g, '');
      const url = phone ? `https://wa.me/${phone}` : '';
      if (url) {
        window.open(url, '_blank');
      } else {
        toast({ title: 'No WhatsApp number', description: 'This student has no valid phone number.' });
      }
    }
  };

  const viewStudentDetails = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      toast({ 
        title: "Student Details", 
        description: `Opening profile for ${student.name}` 
      });
      // Open student profile page
      window.open(`/student-profile/${studentId}`, '_blank');
    }
  };

  const createAssignment = (assignmentData: any) => {
    const newAssignment = {
      id: Date.now().toString(),
      ...assignmentData,
      submissions: []
    };
    setAssignments(prev => [...prev, newAssignment]);
    toast({ title: "Assignment created successfully!" });
  };

  const editAssignment = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      toast({ 
        title: "Edit Assignment", 
        description: `Editing ${assignment.title}` 
      });
      // In a real app, this would open assignment editor
    }
  };

  const viewAssignmentDetails = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      toast({ 
        title: "Assignment Details", 
        description: `Viewing details for ${assignment.title}` 
      });
      // In a real app, this would open detailed view
    }
  };

  const downloadSubmissions = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment && assignment.submissions.length > 0) {
      toast({ 
        title: "Download Submissions", 
        description: `Downloading ${assignment.submissions.length} submissions for ${assignment.title}` 
      });
      
      // Create a mock CSV download
      const csvContent = [
        ['Student', 'Submission Date', 'Grade', 'File'].join(','),
        ...assignment.submissions.map(sub => {
          const student = students.find(s => s.id === sub.studentId);
          return [
            student?.name || '',
            new Date(sub.submittedAt).toLocaleDateString(),
            sub.grade || 'Not Graded',
            sub.file || 'No file'
          ].join(',');
        })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions-${assignment.title.replace(/\s+/g, '-')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      toast({ 
        title: "No Submissions", 
        description: "No submissions available to download.",
        variant: "destructive"
      });
    }
  };

  const viewAssignmentAnalytics = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      const gradedSubmissions = assignment.submissions.filter(s => s.grade);
      const averageGrade = gradedSubmissions.length > 0 
        ? Math.round(gradedSubmissions.reduce((acc, s) => acc + (s.grade || 0), 0) / gradedSubmissions.length)
        : 0;
      
      toast({ 
        title: "Assignment Analytics", 
        description: `${assignment.title}: ${assignment.submissions.length} submissions, ${gradedSubmissions.length} graded, ${averageGrade}% average` 
      });
      // In a real app, this would open analytics dashboard
    }
  };

  const viewReport = (reportType: string) => {
    const reportData = {
      attendance: {
        title: "Attendance Report",
        description: `Total students: ${students.length}, Average attendance: 85%`
      },
      grades: {
        title: "Grades Report", 
        description: `Total assignments: ${assignments.length}, Average grade: 87%`
      },
      progress: {
        title: "Progress Report",
        description: `Course completion: 68%, On-track students: ${Math.floor(students.length * 0.8)}`
      }
    };

    const report = reportData[reportType as keyof typeof reportData];
    if (report) {
      toast({
        title: report.title,
        description: report.description
      });
      
      // Generate mock report download
      const reportContent = `${report.title}\n${'='.repeat(30)}\n\nGenerated: ${new Date().toLocaleString()}\n\n${report.description}\n\nDetailed data would be shown here in a real application.`;
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const gradeAssignment = (assignmentId: string, studentId: string, grade: number, feedback: string) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        const submissions = assignment.submissions.map(sub => 
          sub.studentId === studentId ? { ...sub, grade, feedback } : sub
        );
        return { ...assignment, submissions };
      }
      return assignment;
    }));
    toast({ title: "Assignment graded" });
  };

  const filteredStudents = students.filter(student => {
    const matchesQuery = (student.name + student.email).toLowerCase().includes(query.toLowerCase());
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;
    return matchesQuery && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "completed": return "bg-primary text-primary-foreground";
      case "dropped": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Navigation />

      <section className="py-8 sm:py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-playfair font-bold">Trainer Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your classes, students, and assignments</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search students..." 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  className="pl-9 w-full sm:w-64" 
                />
              </div>
              <ClassCreationModal onCreateClass={createNewClass} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <Card className="card-elevated">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                    <p className="text-xl sm:text-2xl font-bold">{students.length}</p>
                  </div>
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-elevated">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Classes This Week</p>
                    <p className="text-xl sm:text-2xl font-bold">
                      {classes.filter(c => new Date(c.date) >= new Date() && new Date(c.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                    </p>
                  </div>
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-elevated">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
                    <p className="text-xl sm:text-2xl font-bold">4.8</p>
                  </div>
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-elevated">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Assignments</p>
                    <p className="text-xl sm:text-2xl font-bold">
                      {assignments.reduce((acc, assignment) => acc + assignment.submissions.filter(s => !s.grade).length, 0)}
                    </p>
                  </div>
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="students" className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full sm:w-auto">
              <TabsTrigger value="students" className="text-xs sm:text-sm">Students</TabsTrigger>
              <TabsTrigger value="classes" className="text-xs sm:text-sm">Classes</TabsTrigger>
              <TabsTrigger value="attendance" className="text-xs sm:text-sm">Attendance</TabsTrigger>
              <TabsTrigger value="assignments" className="text-xs sm:text-sm">Assignments</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
            </TabsList>

            {/* Students Management */}
            <TabsContent value="students" className="mt-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="dropped">Dropped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="card-elevated">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span className="truncate">{student.name}</span>
                        <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="truncate">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{student.phone}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{student.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all" 
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Attendance</span>
                          <p className="font-medium">{student.attendance}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Assignments</span>
                          <p className="font-medium">{student.assignments.submitted}/{student.assignments.total}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => messageStudent(student.id)}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewStudentDetails(student.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Classes Management */}
            <TabsContent value="classes" className="mt-6">
              <div className="space-y-4 sm:space-y-6">
                {classes.map((cls) => (
                  <Card key={cls.id} className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span>{cls.title}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={cls.type === 'online' ? 'default' : 'secondary'}>
                            {cls.type} {cls.mode && `(${cls.mode})`}
                          </Badge>
                          <Badge className={cls.status === 'completed' ? 'bg-success text-success-foreground' : cls.status === 'ongoing' ? 'bg-warning text-warning-foreground' : ''}>{cls.status}</Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Date & Time</span>
                          <p className="font-medium">{new Date(cls.date).toLocaleDateString()} at {cls.time}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration</span>
                          <p className="font-medium">{cls.duration} minutes</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Students</span>
                          <p className="font-medium">{cls.students.length} enrolled</p>
                        </div>
                      </div>
                      
                      {cls.type === "online" && cls.meetingLink && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">Meeting Link</p>
                          <p className="text-sm text-blue-700 break-all">{cls.meetingLink}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => navigator.clipboard.writeText(cls.meetingLink || '')}
                          >
                            Copy Link
                          </Button>
                        </div>
                      )}
                      
                      {cls.type === "offline" && cls.location && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm font-medium text-green-900">Location</p>
                          <p className="text-sm text-green-700">{cls.location}</p>
                        </div>
                      )}
                      
                      {cls.notes && (
                        <div>
                          <span className="text-muted-foreground text-sm">Notes</span>
                          <p className="text-sm mt-1">{cls.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewClass(cls.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewClassStudents(cls.id)}
                        >
                          <Users className="w-4 h-4 mr-1" />
                          View Students
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => editClass(cls.id)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => manageClassStudents(cls.id)}
                        >
                          <Users className="w-4 h-4 mr-1" />
                          Manage Students
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewClassMaterials(cls.id)}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Materials
                        </Button>
                        {cls.status === 'scheduled' && (
                          <Button variant="outline" size="sm" onClick={() => startClass(cls.id)}>
                            {cls.type === "online" ? (
                              <>
                                <Video className="w-4 h-4 mr-1" />
                                Open Meeting
                              </>
                            ) : (
                              <>
                                <MapPin className="w-4 h-4 mr-1" />
                                View Location
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Enhanced Attendance Tracking */}
            <TabsContent value="attendance" className="mt-6">
              <div className="space-y-6">
                {/* Quick Mark Today's Attendance */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Quick Mark - Today's Classes</span>
                      <Badge variant="outline">{new Date().toLocaleDateString()}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {classes.filter(cls => new Date(cls.date).toDateString() === new Date().toDateString()).map((todayClass) => (
                        <div key={todayClass.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h4 className="font-semibold">{todayClass.title}</h4>
                              <p className="text-sm text-muted-foreground">{todayClass.time} - {todayClass.duration} mins</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // Mark all students present for this class
                                  const allStudentIds = students.map(s => s.id);
                                  allStudentIds.forEach(studentId => {
                                    markAttendance(todayClass.id, studentId, true);
                                  });
                                  toast({
                                    title: "Attendance Updated",
                                    description: `Marked all ${allStudentIds.length} students present for ${todayClass.title}`
                                  });
                                }}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Mark All Present
                              </Button>
                              <Button 
                                variant={todayClass.status === 'ongoing' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => startClass(todayClass.id)}
                              >
                                {todayClass.status === 'ongoing' ? 'Live Now' : 'Start Class'}
                              </Button>
                            </div>
                          </div>
                          
                          {/* Mobile-friendly attendance grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {todayClass.students.map((studentId) => {
                              const student = students.find(s => s.id === studentId);
                              const attendance = todayClass.attendance.find(a => a.studentId === studentId);
                              
                              return (
                                <div key={studentId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                      <span className="text-sm font-medium text-primary">
                                        {student?.name.charAt(0)}
                                      </span>
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium truncate">{student?.name}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant={attendance?.present ? 'default' : 'outline'}
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => markAttendance(todayClass.id, studentId, !attendance?.present)}
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Attendance Management */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Detailed Attendance Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Select onValueChange={(value) => setSelectedClass(classes.find(c => c.id === value) || null)}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.title} - {new Date(cls.date).toLocaleDateString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="outline" 
                          className="sm:w-auto w-full"
                          onClick={() => {
                            if (selectedClass) {
                              viewReport('attendance');
                            } else {
                              toast({
                                title: "Select Class",
                                description: "Please select a class to export attendance data",
                                variant: "destructive"
                              });
                            }
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>

                      {selectedClass && (
                        <div className="space-y-4">
                          {/* Desktop Table View */}
                          <div className="hidden md:block overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Student</TableHead>
                                  <TableHead className="text-center">Status</TableHead>
                                  <TableHead>Join Time</TableHead>
                                  <TableHead>Leave Time</TableHead>
                                  <TableHead>Duration</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedClass.students.map((studentId) => {
                                  const student = students.find(s => s.id === studentId);
                                  const attendance = selectedClass.attendance.find(a => a.studentId === studentId);
                                  
                                  return (
                                    <TableRow key={studentId}>
                                      <TableCell>
                                        <div className="flex items-center space-x-3">
                                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-primary">
                                              {student?.name.charAt(0)}
                                            </span>
                                          </div>
                                          <div>
                                            <p className="font-medium">{student?.name}</p>
                                            <p className="text-sm text-muted-foreground">{student?.email}</p>
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                          <Button
                                            variant={attendance?.present ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => markAttendance(selectedClass.id, studentId, true)}
                                          >
                                            Present
                                          </Button>
                                          <Button
                                            variant={attendance?.present === false ? 'destructive' : 'outline'}
                                            size="sm"
                                            onClick={() => markAttendance(selectedClass.id, studentId, false)}
                                          >
                                            Absent
                                          </Button>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          type="time"
                                          defaultValue={attendance?.joinTime || ""}
                                          className="w-32"
                                          disabled={!attendance?.present}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          type="time"
                                          defaultValue={attendance?.leaveTime || ""}
                                          className="w-32"
                                          disabled={!attendance?.present}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        {attendance?.present && attendance?.joinTime && attendance?.leaveTime ? (
                                          <span className="text-sm">
                                            {Math.round((new Date(`2000-01-01 ${attendance.leaveTime}`).getTime() - 
                                                        new Date(`2000-01-01 ${attendance.joinTime}`).getTime()) / 60000)} mins
                                          </span>
                                        ) : (
                                          <span className="text-sm text-muted-foreground">-</span>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => messageStudent(student.id)}
                                        >
                                          <MessageCircle className="w-4 h-4" />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>

                          {/* Mobile Card View */}
                          <div className="md:hidden space-y-3">
                            {selectedClass.students.map((studentId) => {
                              const student = students.find(s => s.id === studentId);
                              const attendance = selectedClass.attendance.find(a => a.studentId === studentId);
                              
                              return (
                                <Card key={studentId} className="p-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                          <span className="font-medium text-primary">
                                            {student?.name.charAt(0)}
                                          </span>
                                        </div>
                                        <div>
                                          <p className="font-medium">{student?.name}</p>
                                          <p className="text-sm text-muted-foreground">{student?.email}</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                      <Button
                                        variant={attendance?.present ? 'default' : 'outline'}
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => markAttendance(selectedClass.id, studentId, true)}
                                      >
                                        Present
                                      </Button>
                                      <Button
                                        variant={attendance?.present === false ? 'destructive' : 'outline'}
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => markAttendance(selectedClass.id, studentId, false)}
                                      >
                                        Absent
                                      </Button>
                                    </div>
                                    
                                    {attendance?.present && (
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <Label className="text-xs">Join Time</Label>
                                          <Input
                                            type="time"
                                            defaultValue={attendance?.joinTime || ""}
                                            className="mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-xs">Leave Time</Label>
                                          <Input
                                            type="time"
                                            defaultValue={attendance?.leaveTime || ""}
                                            className="mt-1"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              );
                            })}
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline"
                              onClick={() => {
                                toast({ title: "Attendance draft saved", description: "Your attendance records have been saved as draft" });
                              }}
                            >
                              Save as Draft
                            </Button>
                            <Button 
                              onClick={() => {
                                toast({ title: "Attendance saved", description: "Attendance records have been saved successfully" });
                              }}
                            >
                              Save Attendance
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Enhanced Assignments Management */}
            <TabsContent value="assignments" className="mt-6">
              <div className="space-y-6">
                {/* Create New Assignment */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Create New Assignment</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({ 
                            title: "Assignment Templates", 
                            description: "Opening template library..." 
                          });
                          // Open template selection interface
                          const templates = [
                            "SWOT Analysis Assignment",
                            "Leadership Assessment",
                            "Project Management Case Study",
                            "Communication Skills Evaluation",
                            "Team Building Exercise"
                          ];
                          
                          const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
                          const useTemplate = confirm(`Use template: "${selectedTemplate}"?`);
                          
                          if (useTemplate) {
                            toast({ 
                              title: "Template Applied",
                              description: `Assignment template "${selectedTemplate}" has been loaded`
                            });
                          }
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Templates
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Assignment Title</Label>
                          <Input placeholder="e.g., Personal SWOT Analysis" />
                        </div>
                        <div>
                          <Label>Course</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id}>
                                  {course.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Due Date</Label>
                            <Input type="date" />
                          </div>
                          <div>
                            <Label>Total Marks</Label>
                            <Input type="number" placeholder="100" />
                          </div>
                        </div>
                        <div>
                          <Label>Assignment Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="essay">Essay</SelectItem>
                              <SelectItem value="project">Project</SelectItem>
                              <SelectItem value="presentation">Presentation</SelectItem>
                              <SelectItem value="quiz">Quiz</SelectItem>
                              <SelectItem value="practical">Practical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Description</Label>
                          <Textarea 
                            placeholder="Detailed assignment instructions..."
                            rows={8}
                          />
                        </div>
                        <div>
                          <Label>Attachments</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Drag files here or click to browse
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => {
                                // Create a file input and trigger it
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.multiple = true;
                                input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
                                input.onchange = (e) => {
                                  const files = (e.target as HTMLInputElement).files;
                                  if (files) {
                                    toast({ 
                                      title: "Files Selected", 
                                      description: `${files.length} file(s) ready to attach` 
                                    });
                                  }
                                };
                                input.click();
                              }}
                            >
                              Choose Files
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          toast({ title: "Assignment draft saved", description: "Your assignment has been saved as draft" });
                          // Save assignment as draft
                          const draftData = {
                            id: `draft_${Date.now()}`,
                            title: "Draft Assignment",
                            description: "Assignment saved as draft",
                            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            type: "homework",
                            points: 100,
                            status: 'draft',
                            createdAt: new Date().toISOString()
                          };
                          
                          // Store in localStorage for persistence
                          const drafts = JSON.parse(localStorage.getItem('assignment_drafts') || '[]');
                          drafts.push(draftData);
                          localStorage.setItem('assignment_drafts', JSON.stringify(drafts));
                        }}
                      >
                        Save as Draft
                      </Button>
                      <Button 
                        onClick={() => {
                          toast({ title: "Assignment created", description: "New assignment has been published to students" });
                          // Create and publish assignment
                          const assignmentData = {
                            id: `assignment_${Date.now()}`,
                            title: "New Assignment",
                            description: "Assignment created and published to students",
                            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            type: "homework",
                            points: 100,
                            status: 'published',
                            createdAt: new Date().toISOString(),
                            submissions: []
                          };
                          
                          // Store assignment
                          const assignments = JSON.parse(localStorage.getItem('published_assignments') || '[]');
                          assignments.push(assignmentData);
                          localStorage.setItem('published_assignments', JSON.stringify(assignments));
                        }}
                      >
                        Create Assignment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Assignment List with Enhanced Features */}
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <Card key={assignment.id} className="card-elevated">
                      <CardHeader>
                        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <span className="text-lg">{assignment.title}</span>
                              <p className="text-sm text-muted-foreground font-normal">
                                Created: {new Date().toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={new Date(assignment.dueDate) > new Date() ? 'default' : 'destructive'}>
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => editAssignment(assignment.id)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{assignment.description}</p>
                        
                        {/* Assignment Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <p className="text-lg font-semibold text-primary">{assignment.submissions.length}</p>
                            <p className="text-xs text-muted-foreground">Submissions</p>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <p className="text-lg font-semibold text-success">{assignment.submissions.filter(s => s.grade).length}</p>
                            <p className="text-xs text-muted-foreground">Graded</p>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <p className="text-lg font-semibold text-warning">{assignment.submissions.filter(s => !s.grade).length}</p>
                            <p className="text-xs text-muted-foreground">Pending</p>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <p className="text-lg font-semibold text-accent">
                              {assignment.submissions.length > 0 ? 
                                Math.round(assignment.submissions.filter(s => s.grade).reduce((acc, s) => acc + (s.grade || 0), 0) / 
                                assignment.submissions.filter(s => s.grade).length) : 0}%
                              </p>
                            <p className="text-xs text-muted-foreground">Avg Score</p>
                          </div>
                        </div>
                        
                        {/* Quick Grade Section */}
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-sm">Quick Grade Submissions</h4>
                            <Button variant="outline" size="sm" onClick={() => downloadSubmissions(assignment.id)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download All
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            {assignment.submissions.slice(0, 3).map((submission) => {
                              const student = students.find(s => s.id === submission.studentId);
                              return (
                                <div key={submission.studentId} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/20 rounded-lg gap-3">
                                  <div className="flex items-center space-x-3 flex-1">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                      <span className="text-sm font-medium text-primary">
                                        {student?.name.charAt(0)}
                                      </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-medium text-sm truncate">{student?.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                                      </p>
                                      {submission.grade && (
                                        <div className="flex items-center space-x-2 mt-1">
                                          <Badge variant="outline" className="text-xs">
                                            {submission.grade}/{assignment.totalMarks}
                                          </Badge>
                                          <span className="text-xs text-success">Graded</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    {!submission.grade && (
                                      <div className="flex items-center space-x-2">
                                        <Input
                                          type="number"
                                          placeholder="Grade"
                                          className="w-20 h-8"
                                          max={assignment.totalMarks}
                                        />
                                        <Button 
                                          size="sm" 
                                          className="h-8"
                                          onClick={(e) => {
                                            const gradeInput = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                                            const grade = parseInt(gradeInput?.value || '0');
                                            if (grade >= 0 && grade <= assignment.totalMarks) {
                                              gradeAssignment(assignment.id, submission.studentId, grade, 'Quick grade submission');
                                              gradeInput.value = '';
                                            } else {
                                              toast({
                                                title: "Invalid Grade",
                                                description: `Grade must be between 0 and ${assignment.totalMarks}`,
                                                variant: "destructive"
                                              });
                                            }
                                          }}
                                        >
                                          Grade
                                        </Button>
                                      </div>
                                    )}
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="h-8"
                                      onClick={() => {
                                        const student = students.find(s => s.id === submission.studentId);
                                        toast({
                                          title: "View Submission",
                                          description: `Viewing ${student?.name}'s submission for ${assignment.title}`
                                        });
                                        // In a real app, this would open submission details
                                      }}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="h-8"
                                      onClick={() => {
                                        const student = students.find(s => s.id === submission.studentId);
                                        if (submission.file) {
                                          toast({
                                            title: "Download Started",
                                            description: `Downloading ${student?.name}'s submission file`
                                          });
                                          // Mock file download
                                          const link = document.createElement('a');
                                          link.href = '#';
                                          link.download = `${student?.name}-${assignment.title}.pdf`;
                                          link.click();
                                        } else {
                                          toast({
                                            title: "No File",
                                            description: "No file submitted by this student",
                                            variant: "destructive"
                                          });
                                        }
                                      }}
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                            
                            {assignment.submissions.length > 3 && (
                              <div className="text-center pt-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => viewAssignmentDetails(assignment.id)}
                                >
                                  View All {assignment.submissions.length} Submissions
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Analytics Dashboard */}
            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Student Progress Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {courses.map((course) => (
                        <div key={course.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{course.title}</span>
                            <span>{Math.round((course.completedStudents / course.totalStudents) * 100)}% completion</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-success h-2 rounded-full transition-all" 
                              style={{ width: `${(course.completedStudents / course.totalStudents) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{course.completedStudents} completed</span>
                            <span>{course.totalStudents} total</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-primary">4.8</p>
                        <p className="text-sm text-muted-foreground">Avg Rating</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-success">89%</p>
                        <p className="text-sm text-muted-foreground">Completion Rate</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-accent">92%</p>
                        <p className="text-sm text-muted-foreground">Attendance Rate</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-warning">24</p>
                        <p className="text-sm text-muted-foreground">Total Classes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />

      {/* Edit Class Modal */}
      <Dialog open={editClassModalOpen} onOpenChange={setEditClassModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Update class details and schedule
            </DialogDescription>
          </DialogHeader>
          {editingClass && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Class Title</Label>
                  <Input 
                    value={editingClass.title} 
                    onChange={(e) => setEditingClass({...editingClass, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Course</Label>
                  <Input 
                    value={editingClass.courseName} 
                    onChange={(e) => setEditingClass({...editingClass, courseName: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input 
                    type="date"
                    value={editingClass.date} 
                    onChange={(e) => setEditingClass({...editingClass, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input 
                    type="time"
                    value={editingClass.time} 
                    onChange={(e) => setEditingClass({...editingClass, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editingClass.type} 
                    onChange={(e) => setEditingClass({...editingClass, type: e.target.value as "online" | "offline"})}
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input 
                    type="number"
                    value={editingClass.duration} 
                    onChange={(e) => setEditingClass({...editingClass, duration: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              {editingClass.type === "online" ? (
                <div>
                  <Label>Meeting Link</Label>
                  <Input 
                    placeholder="https://meet.google.com/..."
                    value={editingClass.meetingLink || ""} 
                    onChange={(e) => setEditingClass({...editingClass, meetingLink: e.target.value})}
                  />
                </div>
              ) : (
                <div>
                  <Label>Location</Label>
                  <Input 
                    placeholder="Enter physical address"
                    value={editingClass.location || ""} 
                    onChange={(e) => setEditingClass({...editingClass, location: e.target.value})}
                  />
                </div>
              )}
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={editingClass.description || ""} 
                  onChange={(e) => setEditingClass({...editingClass, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditClassModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => updateClass(editingClass)}>
                  Update Class
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Students Modal */}
      <Dialog open={manageStudentsModalOpen} onOpenChange={setManageStudentsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manage Class Students</DialogTitle>
            <DialogDescription>
              Add or remove students from {managingClassStudents?.title}
            </DialogDescription>
          </DialogHeader>
          {managingClassStudents && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Available Students */}
                <div>
                  <h4 className="font-medium mb-3">Available Students</h4>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {students
                      .filter(student => !managingClassStudents.students.includes(student.id))
                      .map(student => (
                        <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              const updatedStudents = [...managingClassStudents.students, student.id];
                              setManagingClassStudents({...managingClassStudents, students: updatedStudents});
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Enrolled Students */}
                <div>
                  <h4 className="font-medium mb-3">Enrolled Students ({managingClassStudents.students.length})</h4>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {managingClassStudents.students.map(studentId => {
                      const student = students.find(s => s.id === studentId);
                      if (!student) return null;
                      return (
                        <div key={studentId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => {
                              const updatedStudents = managingClassStudents.students.filter(id => id !== studentId);
                              setManagingClassStudents({...managingClassStudents, students: updatedStudents});
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setManageStudentsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => updateClassStudents(managingClassStudents.id, managingClassStudents.students)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerDashboard;