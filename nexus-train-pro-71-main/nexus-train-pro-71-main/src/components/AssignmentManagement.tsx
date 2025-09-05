import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Edit, 
  Eye, 
  Download, 
  Upload,
  FileText,
  Calendar,
  Clock,
  Users,
  Star,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Filter,
  Search,
  Save,
  Send,
  Trash2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  totalMarks: number;
  type: "essay" | "project" | "quiz" | "presentation" | "practical";
  attachments: string[];
  submissions: Submission[];
  status: "draft" | "published" | "closed";
  createdAt: string;
  instructions?: string;
}

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  attachments: string[];
  grade?: number;
  feedback?: string;
  status: "submitted" | "graded" | "late";
}

interface Course {
  id: string;
  title: string;
  studentsCount: number;
}

interface AssignmentManagementProps {
  courses: Course[];
  assignments: Assignment[];
  onCreateAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onUpdateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  onGradeSubmission: (assignmentId: string, submissionId: string, grade: number, feedback: string) => void;
}

const AssignmentManagement = ({ 
  courses, 
  assignments, 
  onCreateAssignment, 
  onUpdateAssignment, 
  onGradeSubmission 
}: AssignmentManagementProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");

  // Form states for creating assignment
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    courseId: "",
    dueDate: "",
    totalMarks: 100,
    type: "essay" as "essay" | "project" | "quiz" | "presentation" | "practical",
    instructions: "",
    status: "draft" as "draft" | "published" | "closed",
    attachments: [] as File[]
  });

  // Grading states
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState("");

  const resetNewAssignment = () => {
    setNewAssignment({
      title: "",
      description: "",
      courseId: "",
      dueDate: "",
      totalMarks: 100,
      type: "essay",
      instructions: "",
      status: "draft",
      attachments: []
    });
  };

  const handleCreateAssignment = () => {
    if (!newAssignment.title || !newAssignment.courseId || !newAssignment.dueDate) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const courseName = courses.find(c => c.id === newAssignment.courseId)?.title || "";
    
    onCreateAssignment({
      ...newAssignment,
      courseName,
      attachments: [],
      submissions: []
    });

    resetNewAssignment();
    setCreateModalOpen(false);
    toast({ title: "Assignment created successfully!" });
  };

  const handleGradeSubmission = () => {
    if (!selectedAssignment || !selectedSubmission) return;

    onGradeSubmission(selectedAssignment.id, selectedSubmission.id, grade, feedback);
    setGradeModalOpen(false);
    setGrade(0);
    setFeedback("");
    toast({ title: "Grade submitted successfully!" });
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || assignment.status === filterStatus;
    const matchesCourse = filterCourse === "all" || assignment.courseId === filterCourse;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const getAssignmentStats = (assignment: Assignment) => {
    const totalSubmissions = assignment.submissions.length;
    const gradedSubmissions = assignment.submissions.filter(s => s.grade !== undefined).length;
    const averageGrade = gradedSubmissions > 0 
      ? assignment.submissions.reduce((acc, s) => acc + (s.grade || 0), 0) / gradedSubmissions
      : 0;
    
    return { totalSubmissions, gradedSubmissions, averageGrade };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-muted text-muted-foreground";
      case "published": return "bg-primary text-primary-foreground";
      case "closed": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "essay": return <FileText className="w-4 h-4" />;
      case "project": return <Upload className="w-4 h-4" />;
      case "quiz": return <CheckCircle className="w-4 h-4" />;
      case "presentation": return <MessageCircle className="w-4 h-4" />;
      case "practical": return <Star className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Assignment Management</h2>
          <p className="text-muted-foreground">Create, manage, and grade assignments</p>
        </div>
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>
                Set up a new assignment for your students
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Assignment Title *</Label>
                  <Input
                    placeholder="e.g., Personal SWOT Analysis"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Course *</Label>
                  <Select 
                    value={newAssignment.courseId} 
                    onValueChange={(value) => setNewAssignment(prev => ({ ...prev, courseId: value }))}
                  >
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Assignment Type</Label>
                  <Select 
                    value={newAssignment.type} 
                    onValueChange={(value: any) => setNewAssignment(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                      <SelectItem value="practical">Practical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Due Date *</Label>
                  <Input
                    type="datetime-local"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Total Marks</Label>
                  <Input
                    type="number"
                    value={newAssignment.totalMarks}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, totalMarks: parseInt(e.target.value) || 100 }))}
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description of the assignment..."
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label>Detailed Instructions</Label>
                <Textarea
                  placeholder="Provide detailed instructions for students..."
                  value={newAssignment.instructions}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, instructions: e.target.value }))}
                  rows={5}
                />
              </div>

              <div>
                <Label>Attachment</Label>
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    setNewAssignment(prev => ({ ...prev, attachments: files }));
                    toast({ title: `${files.length} file(s) added` });
                  }}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag files here or click to browse
                  </p>
                  <Input 
                    type="file" 
                    multiple 
                    className="mt-2" 
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setNewAssignment(prev => ({ ...prev, attachments: files }));
                      toast({ title: `${files.length} file(s) selected` });
                    }}
                  />
                  {newAssignment.attachments && newAssignment.attachments.length > 0 && (
                    <div className="mt-2 text-sm text-green-600">
                      {newAssignment.attachments.length} file(s) ready to upload
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetNewAssignment}>Cancel</Button>
                <Button variant="outline" onClick={() => setNewAssignment(prev => ({ ...prev, status: "draft" }))}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={handleCreateAssignment}>
                  <Send className="w-4 h-4 mr-2" />
                  Create & Publish
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCourse} onValueChange={setFilterCourse}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const stats = getAssignmentStats(assignment);
          const isOverdue = new Date(assignment.dueDate) < new Date();
          
          return (
            <Card key={assignment.id} className="card-elevated">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      {getTypeIcon(assignment.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{assignment.courseName}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(assignment.createdAt || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status}
                    </Badge>
                    <Badge variant={isOverdue ? "destructive" : "outline"}>
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{assignment.description}</p>
                
                {/* Assignment Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-semibold text-primary">{stats.totalSubmissions}</p>
                    <p className="text-xs text-muted-foreground">Submissions</p>
                  </div>
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <p className="text-lg font-semibold text-success">{stats.gradedSubmissions}</p>
                    <p className="text-xs text-muted-foreground">Graded</p>
                  </div>
                  <div className="text-center p-3 bg-warning/10 rounded-lg">
                    <p className="text-lg font-semibold text-warning">{stats.totalSubmissions - stats.gradedSubmissions}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                  <div className="text-center p-3 bg-accent/10 rounded-lg">
                    <p className="text-lg font-semibold text-accent">{Math.round(stats.averageGrade)}%</p>
                    <p className="text-xs text-muted-foreground">Avg Grade</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedAssignment(assignment)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Open assignment editing modal with existing data
                      setNewAssignment({
                        title: assignment.title,
                        description: assignment.description,
                        courseId: assignment.courseId,
                        dueDate: assignment.dueDate,
                        totalMarks: assignment.totalMarks,
                        type: assignment.type,
                        instructions: assignment.instructions || "",
                        status: assignment.status,
                        attachments: []
                      });
                      setSelectedAssignment(assignment);
                      setCreateModalOpen(true);
                      toast({ title: "Edit Assignment", description: `Opening editor for ${assignment.title}` });
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Create and download ZIP file with all submissions
                      const submissionData = assignment.submissions.map(submission => ({
                        studentName: submission.studentName,
                        submittedAt: submission.submittedAt,
                        content: submission.content,
                        attachments: submission.attachments
                      }));
                      
                      const dataStr = JSON.stringify(submissionData, null, 2);
                      const blob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${assignment.title}-submissions.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      
                      toast({ title: "Download Started", description: `Downloaded ${assignment.submissions.length} submissions for ${assignment.title}` });
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Submissions
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Generate analytics report
                      const totalSubmissions = assignment.submissions.length;
                      const gradedSubmissions = assignment.submissions.filter(s => s.grade !== undefined).length;
                      const averageGrade = assignment.submissions
                        .filter(s => s.grade !== undefined)
                        .reduce((sum, s) => sum + (s.grade || 0), 0) / (gradedSubmissions || 1);
                      const lateSubmissions = assignment.submissions.filter(s => s.status === 'late').length;
                      
                      const analyticsData = {
                        assignmentTitle: assignment.title,
                        totalSubmissions,
                        gradedSubmissions,
                        pendingGrading: totalSubmissions - gradedSubmissions,
                        averageGrade: averageGrade.toFixed(2),
                        lateSubmissions,
                        onTimeSubmissions: totalSubmissions - lateSubmissions,
                        submissionRate: `${((totalSubmissions / (assignment.courseId ? 25 : 20)) * 100).toFixed(1)}%`
                      };
                      
                      // In real app: Open analytics modal or navigate to analytics page
                      toast({ 
                        title: "Analytics Generated", 
                        description: `${totalSubmissions} submissions, ${gradedSubmissions} graded, avg: ${averageGrade.toFixed(1)}. View console for detailed data.` 
                      });
                      
                      // Store analytics data for future use
                      sessionStorage.setItem(`analytics_${assignment.id}`, JSON.stringify(analyticsData));
                    }}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                  {assignment.status === "published" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Close Assignment
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Close Assignment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to close this assignment? Students will no longer be able to submit.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onUpdateAssignment(assignment.id, { status: "closed" })}>
                            Close Assignment
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>

                {/* Recent Submissions Preview */}
                {assignment.submissions.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-3">Recent Submissions</h4>
                    <div className="space-y-2">
                      {assignment.submissions.slice(0, 3).map((submission) => (
                        <div key={submission.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{submission.studentName}</p>
                            <p className="text-xs text-muted-foreground">
                              Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                            </p>
                            {submission.grade !== undefined && (
                              <Badge variant="outline" className="mt-1">
                                {submission.grade}/{assignment.totalMarks}
                              </Badge>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {submission.grade === undefined && (
                              <Dialog open={gradeModalOpen} onOpenChange={setGradeModalOpen}>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    onClick={() => {
                                      setSelectedSubmission(submission);
                                      setSelectedAssignment(assignment);
                                      setGrade(0);
                                      setFeedback("");
                                    }}
                                  >
                                    Grade
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Grade Submission</DialogTitle>
                                    <DialogDescription>
                                      Grade submission from {submission.studentName}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Student Submission</Label>
                                      <div className="p-3 bg-muted/30 rounded-lg max-h-40 overflow-y-auto">
                                        <p className="text-sm">{submission.content}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Grade (out of {assignment.totalMarks})</Label>
                                      <Input
                                        type="number"
                                        max={assignment.totalMarks}
                                        value={grade}
                                        onChange={(e) => setGrade(parseInt(e.target.value) || 0)}
                                        placeholder="Enter grade"
                                      />
                                    </div>
                                    <div>
                                      <Label>Feedback</Label>
                                      <Textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Provide feedback..."
                                        rows={4}
                                      />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                      <Button variant="outline" onClick={() => setGradeModalOpen(false)}>
                                        Cancel
                                      </Button>
                                      <Button onClick={handleGradeSubmission}>
                                        Submit Grade
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // Open submission details in a modal or navigate to detailed view
                                setSelectedSubmission(submission);
                                // In real app: Could open a detailed submission modal
                                toast({ 
                                  title: "Submission Details", 
                                  description: `Viewing ${submission.studentName}'s submission from ${new Date(submission.submittedAt).toLocaleDateString()}` 
                                });
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {assignment.submissions.length > 3 && (
                        <div className="text-center pt-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              // Switch to detailed submissions view
                              setActiveTab("submissions");
                              setSelectedAssignment(assignment);
                              toast({ 
                                title: "All Submissions", 
                                description: `Switching to detailed view of all ${assignment.submissions.length} submissions` 
                              });
                            }}
                          >
                            View All {assignment.submissions.length} Submissions
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <Card className="card-elevated">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No assignments found</p>
              <Button className="mt-4" onClick={() => setCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Assignment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssignmentManagement;
