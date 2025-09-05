import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Calendar,
  MapPin,
  Save,
  Download,
  Filter,
  Search,
  UserCheck,
  UserX,
  Timer
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rollNumber: string;
}

interface AttendanceRecord {
  studentId: string;
  present: boolean;
  joinTime?: string;
  leaveTime?: string;
  lateEntry?: boolean;
  earlyLeave?: boolean;
  notes?: string;
}

interface Class {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  students: Student[];
  attendance: AttendanceRecord[];
}

interface AttendanceMarkingProps {
  selectedClass?: Class;
  onSave: (attendance: AttendanceRecord[]) => void;
}

const AttendanceMarking = ({ selectedClass, onSave }: AttendanceMarkingProps) => {
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (selectedClass) {
      // Initialize attendance with existing data or default values
      const initialAttendance = selectedClass.students.map(student => {
        const existing = selectedClass.attendance.find(a => a.studentId === student.id);
        return existing || {
          studentId: student.id,
          present: false,
          joinTime: "",
          leaveTime: "",
          lateEntry: false,
          earlyLeave: false,
          notes: ""
        };
      });
      setAttendance(initialAttendance);
    }
  }, [selectedClass]);

  const markAttendance = (studentId: string, present: boolean) => {
    setAttendance(prev => prev.map(record => 
      record.studentId === studentId 
        ? { 
            ...record, 
            present,
            joinTime: present ? record.joinTime || getCurrentTime() : "",
            leaveTime: present ? record.leaveTime : ""
          }
        : record
    ));
  };

  const updateTimeAndNotes = (studentId: string, field: string, value: string) => {
    setAttendance(prev => prev.map(record => 
      record.studentId === studentId 
        ? { ...record, [field]: value }
        : record
    ));
  };

  const markBulkAttendance = (present: boolean) => {
    if (selectedStudents.size === 0) {
      toast({ title: "No students selected", variant: "destructive" });
      return;
    }

    setAttendance(prev => prev.map(record => 
      selectedStudents.has(record.studentId)
        ? { 
            ...record, 
            present,
            joinTime: present ? record.joinTime || getCurrentTime() : "",
            leaveTime: present ? record.leaveTime : ""
          }
        : record
    ));
    
    setSelectedStudents(new Set());
    toast({ 
      title: `Marked ${selectedStudents.size} students as ${present ? 'present' : 'absent'}` 
    });
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    onSave(attendance);
    toast({ title: "Attendance saved successfully!" });
  };

  const exportAttendance = () => {
    if (!selectedClass) return;
    
    const csvContent = [
      ['Student Name', 'Roll Number', 'Status', 'Join Time', 'Leave Time', 'Duration', 'Notes'].join(','),
      ...attendance.map(record => {
        const student = selectedClass.students.find(s => s.id === record.studentId);
        const duration = record.present && record.joinTime && record.leaveTime 
          ? calculateDuration(record.joinTime, record.leaveTime)
          : '';
        
        return [
          student?.name || '',
          student?.rollNumber || '',
          record.present ? 'Present' : 'Absent',
          record.joinTime || '',
          record.leaveTime || '',
          duration,
          record.notes || ''
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
  };

  const calculateDuration = (joinTime: string, leaveTime: string) => {
    if (!joinTime || !leaveTime) return '';
    
    const join = new Date(`2000-01-01 ${joinTime}`);
    const leave = new Date(`2000-01-01 ${leaveTime}`);
    const diff = leave.getTime() - join.getTime();
    const minutes = Math.round(diff / 60000);
    
    return minutes > 0 ? `${minutes} min` : '';
  };

  const filteredStudents = selectedClass?.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    
    const studentAttendance = attendance.find(a => a.studentId === student.id);
    const statusMatch = filterStatus === "present" ? studentAttendance?.present : 
                       filterStatus === "absent" ? !studentAttendance?.present :
                       true;
    
    return matchesSearch && statusMatch;
  }) || [];

  const presentCount = attendance.filter(a => a.present).length;
  const totalCount = attendance.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  if (!selectedClass) {
    return (
      <Card className="card-elevated">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Select a class to mark attendance</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Class Information */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">{selectedClass.title}</CardTitle>
              <p className="text-muted-foreground">{selectedClass.courseName}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(selectedClass.date).toLocaleDateString()}
              </Badge>
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                {selectedClass.time}
              </Badge>
              <Badge variant="outline">
                <MapPin className="w-3 h-3 mr-1" />
                {selectedClass.location}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-primary">{totalCount}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <p className="text-2xl font-bold text-success">{presentCount}</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
            <div className="text-center p-3 bg-destructive/10 rounded-lg">
              <p className="text-2xl font-bold text-destructive">{totalCount - presentCount}</p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
            <div className="text-center p-3 bg-accent/10 rounded-lg">
              <p className="text-2xl font-bold text-accent">{attendanceRate}%</p>
              <p className="text-sm text-muted-foreground">Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search and Filter */}
            <div className="flex flex-1 flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="bulk-mode"
                  checked={bulkMode}
                  onCheckedChange={setBulkMode}
                />
                <Label htmlFor="bulk-mode" className="text-sm">Bulk Mode</Label>
              </div>
              
              {bulkMode && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markBulkAttendance(true)}
                    disabled={selectedStudents.size === 0}
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    Mark Present
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markBulkAttendance(false)}
                    disabled={selectedStudents.size === 0}
                  >
                    <UserX className="w-4 h-4 mr-1" />
                    Mark Absent
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance List */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mark Attendance</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={exportAttendance}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Desktop View */}
          <div className="hidden lg:block">
            <div className="space-y-3">
              {filteredStudents.map((student) => {
                const studentAttendance = attendance.find(a => a.studentId === student.id);
                const isSelected = selectedStudents.has(student.id);
                
                return (
                  <div 
                    key={student.id} 
                    className={`p-4 border rounded-lg transition-all ${
                      isSelected ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {bulkMode && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const newSelected = new Set(selectedStudents);
                            if (e.target.checked) {
                              newSelected.add(student.id);
                            } else {
                              newSelected.delete(student.id);
                            }
                            setSelectedStudents(newSelected);
                          }}
                          className="w-4 h-4"
                        />
                      )}
                      
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-medium text-primary">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                        <div className="lg:col-span-2">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant={studentAttendance?.present ? 'default' : 'outline'}
                            onClick={() => markAttendance(student.id, true)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={studentAttendance?.present === false ? 'destructive' : 'outline'}
                            onClick={() => markAttendance(student.id, false)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Absent
                          </Button>
                        </div>
                        
                        <div>
                          <Label className="text-xs">Join Time</Label>
                          <Input
                            type="time"
                            value={studentAttendance?.joinTime || ""}
                            onChange={(e) => updateTimeAndNotes(student.id, 'joinTime', e.target.value)}
                            className="mt-1"
                            disabled={!studentAttendance?.present}
                          />
                        </div>
                        
                        <div>
                          <Label className="text-xs">Leave Time</Label>
                          <Input
                            type="time"
                            value={studentAttendance?.leaveTime || ""}
                            onChange={(e) => updateTimeAndNotes(student.id, 'leaveTime', e.target.value)}
                            className="mt-1"
                            disabled={!studentAttendance?.present}
                          />
                        </div>
                        
                        <div>
                          <Label className="text-xs">Duration</Label>
                          <p className="text-sm mt-1 font-medium">
                            {studentAttendance?.present && studentAttendance.joinTime && studentAttendance.leaveTime
                              ? calculateDuration(studentAttendance.joinTime, studentAttendance.leaveTime)
                              : '-'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {studentAttendance?.present && (
                      <div className="mt-3 pt-3 border-t">
                        <Label className="text-xs">Notes</Label>
                        <Input
                          placeholder="Add notes..."
                          value={studentAttendance?.notes || ""}
                          onChange={(e) => updateTimeAndNotes(student.id, 'notes', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden space-y-3">
            {filteredStudents.map((student) => {
              const studentAttendance = attendance.find(a => a.studentId === student.id);
              const isSelected = selectedStudents.has(student.id);
              
              return (
                <div 
                  key={student.id} 
                  className={`p-4 border rounded-lg transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {bulkMode && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const newSelected = new Set(selectedStudents);
                              if (e.target.checked) {
                                newSelected.add(student.id);
                              } else {
                                newSelected.delete(student.id);
                              }
                              setSelectedStudents(newSelected);
                            }}
                            className="w-4 h-4"
                          />
                        )}
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-medium text-primary">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={studentAttendance?.present ? 'default' : 'secondary'}
                        className={studentAttendance?.present ? 'bg-success' : 'bg-destructive'}
                      >
                        {studentAttendance?.present ? 'Present' : 'Absent'}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant={studentAttendance?.present ? 'default' : 'outline'}
                        onClick={() => markAttendance(student.id, true)}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={studentAttendance?.present === false ? 'destructive' : 'outline'}
                        onClick={() => markAttendance(student.id, false)}
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Absent
                      </Button>
                    </div>
                    
                    {studentAttendance?.present && (
                      <div className="space-y-3 pt-3 border-t">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Join Time</Label>
                            <Input
                              type="time"
                              value={studentAttendance?.joinTime || ""}
                              onChange={(e) => updateTimeAndNotes(student.id, 'joinTime', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Leave Time</Label>
                            <Input
                              type="time"
                              value={studentAttendance?.leaveTime || ""}
                              onChange={(e) => updateTimeAndNotes(student.id, 'leaveTime', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        {studentAttendance.joinTime && studentAttendance.leaveTime && (
                          <div className="text-center">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-muted rounded-full">
                              <Timer className="w-3 h-3" />
                              <span className="text-sm font-medium">
                                Duration: {calculateDuration(studentAttendance.joinTime, studentAttendance.leaveTime)}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <Label className="text-xs">Notes</Label>
                          <Input
                            placeholder="Add notes..."
                            value={studentAttendance?.notes || ""}
                            onChange={(e) => updateTimeAndNotes(student.id, 'notes', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No students found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceMarking;
