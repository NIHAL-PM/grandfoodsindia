import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ButtonSpinner } from "@/components/ui/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";

interface ConsultationModalProps {
  trigger?: React.ReactNode;
  triggerText?: string;
}

const ConsultationModal = ({ trigger, triggerText }: ConsultationModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone.trim()) {
      toast({ title: 'Phone required', description: 'Please provide a phone number so we can reach you.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);

    setIsSubmitting(true);
    try {
      // Saving via Supabase happens here if component is used via useCreateConsultation
      // This modal only collects data; parent should wire the mutation. For now, just close.
      toast({ title: "Submitted", description: "We'll contact you within 24 hours." })
      setFormData({ name: "", email: "", phone: "", message: "" });
      setIsOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to submit.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  };

  const defaultTrigger = (
    <Button variant="outline" className="bg-success/10 border-success text-success hover:bg-success hover:text-success-foreground">
      <Calendar className="w-4 h-4 mr-2" />
      {triggerText || t("cta.getFreeConsultation")}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span>Book Free Consultation</span>
          </DialogTitle>
          <DialogDescription>
            Get personalized guidance from our experts. We'll contact you within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+971 50 123 4567"
            />
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your goals or specific questions..."
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-hero"
            >
              {isSubmitting && <ButtonSpinner />}
              {isSubmitting ? "Submitting..." : "Book Consultation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationModal;