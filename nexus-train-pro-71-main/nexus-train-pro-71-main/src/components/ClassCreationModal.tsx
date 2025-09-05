import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar, Clock, MapPin, Video, Users } from 'lucide-react';

interface ClassCreationModalProps {
  onCreateClass: (classData: any) => void;
}

const ClassCreationModal = ({ onCreateClass }: ClassCreationModalProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    type: 'online',
    mode: 'google-meet',
    meetingLink: '',
    location: '',
    courseId: 'prp-mentoring'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time) {
      toast({
        title: "Please fill required fields",
        description: "Title, date, and time are required.",
        variant: "destructive"
      });
      return;
    }

    if (formData.type === 'online' && !formData.meetingLink) {
      toast({
        title: "Meeting link required",
        description: "Please provide a meeting link for online classes.",
        variant: "destructive"
      });
      return;
    }

    if (formData.type === 'offline' && !formData.location) {
      toast({
        title: "Location required",
        description: "Please provide a location for offline classes.",
        variant: "destructive"
      });
      return;
    }

    const newClass = {
      id: Date.now().toString(),
      ...formData,
      duration: parseInt(formData.duration),
      students: [],
      attendance: [],
      materials: [],
      notes: '',
      status: 'scheduled'
    };

    onCreateClass(newClass);
    setOpen(false);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '60',
      type: 'online',
      mode: 'google-meet',
      meetingLink: '',
      location: '',
      courseId: 'prp-mentoring'
    });
    
    toast({
      title: "Class created successfully!",
      description: `${formData.type === 'online' ? 'Online' : 'Offline'} class "${formData.title}" has been scheduled.`
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-hero">
          <Plus className="w-4 h-4 mr-2" />
          New Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="title">Class Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to Leadership"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Class Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="seminar">Seminar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.type === 'online' && (
            <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-600" />
                <Label className="text-blue-900 font-medium">Online Meeting Details</Label>
              </div>
              
              <div>
                <Label htmlFor="mode">Platform</Label>
                <Select value={formData.mode} onValueChange={(value) => handleInputChange('mode', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google-meet">Google Meet</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="teams">Microsoft Teams</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="meetingLink">Meeting Link *</Label>
                <Input
                  id="meetingLink"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={formData.meetingLink}
                  onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                  required={formData.type === 'online'}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Students will use this link to join the class
                </p>
              </div>
            </div>
          )}

          {(formData.type === 'offline' || formData.type === 'hybrid') && (
            <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <Label className="text-green-900 font-medium">Physical Location</Label>
              </div>
              
              <div>
                <Label htmlFor="location">Address/Venue *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Conference Room A, Dubai Business Center"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required={formData.type === 'offline'}
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what will be covered in this class..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Class
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassCreationModal;
