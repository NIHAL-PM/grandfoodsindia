import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Phone, Video, MessageCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Storage } from "@/utils/localStore";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as DayCalendar } from '@/components/ui/calendar';
import { useAuth } from "@/context/AuthContext";
import { useCreateConsultation } from "@/hooks/useSupabase";

interface ScheduleCallModalProps {
  trigger: React.ReactNode;
  trainerId?: string;
  trainerName?: string;
}

type CallType = "phone" | "video" | "whatsapp";

const ScheduleCallModal = ({ trigger, trainerId = 'general', trainerName = 'Training Expert' }: ScheduleCallModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"select" | "form" | "success">("select");
  const [selectedType, setSelectedType] = useState<CallType>("video");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    requirements: "",
    timezone: "UTC+4 (UAE)",
  });
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const createConsultation = useCreateConsultation();

  const callTypes = [
    {
      type: "video" as CallType,
      icon: Video,
      title: "Video Call",
      description: "Face-to-face consultation via Zoom/Teams",
      duration: "30 minutes",
      color: "text-primary"
    },
    {
      type: "phone" as CallType,
      icon: Phone,
      title: "Phone Call",
      description: "Direct phone consultation",
      duration: "20 minutes",
      color: "text-success"
    },
    {
      type: "whatsapp" as CallType,
      icon: MessageCircle,
      title: "WhatsApp Call",
      description: "Convenient WhatsApp video/voice call",
      duration: "25 minutes",
      color: "text-accent"
    }
  ];

  const timeSlots = [
    "09:00 AM - 09:30 AM",
    "10:00 AM - 10:30 AM",
    "11:00 AM - 11:30 AM",
    "02:00 PM - 02:30 PM",
    "03:00 PM - 03:30 PM",
    "04:00 PM - 04:30 PM",
    "05:00 PM - 05:30 PM",
    "06:00 PM - 06:30 PM",
  ];

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone || !selectedSlot) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    // Try Supabase first, then fallback to local storage
    try {
      await createConsultation.mutateAsync({
        user_id: user?.id || null,
        trainer_id: trainerId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        call_type: selectedType,
        requested_date: selectedDate?.toISOString() || new Date().toISOString(),
        preferred_time: selectedSlot,
        timezone: formData.timezone,
        message: `Company: ${formData.company}. Requirements: ${formData.requirements}`,
        status: 'pending'
      } as any);

      setStep("success");
      toast({
        title: "Call Scheduled Successfully!",
        description: `We'll contact you within 24 hours to confirm your ${selectedType} call.`
      });
    } catch (e) {
      const callRequest = {
        id: Date.now().toString(),
        trainerId,
        trainerName,
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        callType: selectedType,
        date: selectedDate?.toISOString() || new Date().toISOString(),
        slot: selectedSlot,
        timezone: formData.timezone,
        message: `Company: ${formData.company}. Requirements: ${formData.requirements}`,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };

      Storage.addTrainerCall(callRequest);
      setStep("success");
      toast({
        title: "Call Scheduled (offline)",
        description: "Saved locally. Log in to sync with admin dashboard."
      });
    }
  };

  const resetModal = () => {
    setStep("select");
    setSelectedType("video");
    setSelectedSlot("");
    setSelectedDate(undefined);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      requirements: "",
      timezone: "UTC+4 (UAE)",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetModal();
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>{t("cta.scheduleCall")}</span>
          </DialogTitle>
          <DialogDescription>
            Book a free consultation call with our training experts
          </DialogDescription>
        </DialogHeader>

        {step === "select" && (
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-4 border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Select Date</h3>
              <DayCalendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="mx-auto"
                classNames={{
                  months: 'flex flex-col',
                  month: 'space-y-2',
                  caption: 'flex justify-between items-center px-2',
                  table: 'w-full border-separate border-spacing-1',
                  head_cell: 'text-[10px] font-medium text-muted-foreground',
                  day: 'h-9 w-9 text-sm rounded-md hover:bg-primary/10 focus:bg-primary/20 aria-selected:bg-primary aria-selected:text-primary-foreground transition-colors',
                  nav_button: 'h-7 w-7 rounded-md hover:bg-primary/10'
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Time Slot (UAE Time)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedSlot === slot ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSlot(slot)}
                    className="text-xs"
                    disabled={!selectedDate}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {slot}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => setStep("form")} 
              disabled={!selectedSlot || !selectedDate}
              className="w-full btn-hero"
            >
              Continue to Details
            </Button>
          </div>
        )}

        {step === "form" && (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {callTypes.find(t => t.type === selectedType)?.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedDate?.toLocaleDateString()} • {selectedSlot}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep("select")}>
                  Change
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+971 50 123 4567"
                />
              </div>
              <div>
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Your company name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="requirements">Training Requirements</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="Tell us about your training needs, goals, and any specific areas of focus..."
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep("select")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} className="btn-hero flex-1">
                Schedule Call
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Call Scheduled Successfully!</h3>
                <p className="text-muted-foreground">Your request with {trainerName} for a {callTypes.find(t => t.type === selectedType)?.title.toLowerCase()} at {selectedSlot} has been received. We'll confirm shortly.</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg text-left">
              <h4 className="font-semibold mb-2">What's Next?</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• You'll receive a confirmation email shortly</li>
                <li>• Our team will call you to confirm the appointment</li>
                <li>• You'll get meeting details 1 hour before the call</li>
                <li>• Prepare any questions about our training programs</li>
              </ul>
            </div>
            <Button onClick={() => setIsOpen(false)} className="btn-hero">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleCallModal;