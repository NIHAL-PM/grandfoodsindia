import React, { useEffect, useState } from 'react';
import { ArrowLeft, Edit3, User, Mail, Phone, MapPin, Calendar, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { useNavigate, useParams } from 'react-router-dom';
import { getProfile } from '@/lib/supabase-api';

const StudentProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const p = await getProfile(id);
        if (p) {
          setProfile({
            id: p.id,
            name: p.full_name || 'Student',
            email: p.email || '',
            phone: p.phone || '',
            address: '',
            enrollmentDate: p.created_at,
            studentId: p.student_id || '',
            bio: '',
            courses: [],
            totalCourses: 0,
            completedCourses: 0,
            currentGPA: 0
          });
        }
      } catch (e) {
        // leave as null; UI will show defaults below
      }
      if (!profile) {
        setProfile({
          id: id || "ST001",
          name: "Student",
          email: "student@example.com",
          phone: "+971501234567",
          address: "",
          enrollmentDate: new Date().toISOString(),
          studentId: "",
          bio: "",
          courses: [],
          totalCourses: 0,
          completedCourses: 0,
          currentGPA: 0
        });
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
    toast({ title: "Profile updated successfully!" });
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (!profile) return null;
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Student Profile</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Picture & Basic Info */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Profile</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </div>
                {isEditing ? (
                  <Input
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-center font-semibold"
                  />
                ) : (
                  <h2 className="text-xl font-semibold text-center">{profile.name}</h2>
                )}
                <div className="text-sm text-muted-foreground">
                  Student ID: {profile.studentId}
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      type="email"
                    />
                  ) : (
                    <span className="text-sm">{profile.email}</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      type="tel"
                    />
                  ) : (
                    <span className="text-sm">{profile.phone}</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={profile.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm">{profile.address}</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Enrolled: {new Date(profile.enrollmentDate).toLocaleDateString()}</span>
                </div>
              </div>

              {isEditing && (
                <div className="pt-4 space-y-2">
                  <Button onClick={handleSave} className="w-full">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full">
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Academic Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Academic Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{profile.totalCourses}</div>
                    <div className="text-sm text-muted-foreground">Total Courses</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{profile.completedCourses}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{profile.currentGPA}</div>
                    <div className="text-sm text-muted-foreground">Current GPA</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enrolled Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.courses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium">{course}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({ title: "Course Details", description: "Opening course details and progress" });
                          // Navigate to course details page
                          navigate(`/courses/${course.toLowerCase().replace(/\s+/g, '-')}`);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
