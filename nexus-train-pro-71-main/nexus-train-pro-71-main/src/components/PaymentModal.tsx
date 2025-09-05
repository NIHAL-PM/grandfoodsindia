import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, CreditCard, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { uploadFile, getFileUrl, createPayment } from "@/lib/supabase-api";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentModalProps {
  courseTitle: string;
  courseId: string;
  plan: string;
  price: number;
  currency: string;
  trigger?: React.ReactNode;
}

const PaymentModal = ({ 
  courseTitle, 
  courseId, 
  plan, 
  price, 
  currency,
  trigger 
}: PaymentModalProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "Payment proof required",
        description: "Please upload a screenshot of your payment",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload payment screenshot to Supabase Storage (bucket: payment_screens)
      const ext = (selectedFile.name.split('.').pop() || 'png').toLowerCase();
      const filePath = `payments/${user?.id || 'anon'}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      await uploadFile('payment_screens', filePath, selectedFile);
      const screenshot_url = await getFileUrl('payment_screens', filePath);

      // Create payments row (RLS requires auth; falls back to local if it fails)
      await createPayment({
        user_id: user?.id || null,
        method: 'upi',
        amount_cents: Math.round(price * 100),
        currency,
        screenshot_url,
        provider: 'bank',
        status: 'pending',
        payer_email: formData.email,
        payer_name: formData.name,
        payer_phone: formData.phone,
        notes: formData.notes,
        course_id: courseId,
        course_title: courseTitle,
        plan
      });

      toast({
        title: "Payment Submitted",
        description: "We'll verify your payment within 24 hours and email you once approved."
      });

      // Reset form and close modal
      setFormData({ name: "", email: "", phone: "", notes: "" });
      setSelectedFile(null);
      setPreviewUrl("");
      setIsOpen(false);
  } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button className="w-full btn-hero">
      <CreditCard className="w-4 h-4 mr-2" />
      Submit Payment Proof
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span>Submit Payment Proof</span>
          </DialogTitle>
          <DialogDescription>
            Upload screenshot of your payment for {courseTitle} ({plan} plan - {currency}{price.toLocaleString()})
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please make payment to: UPI ID: <strong>kaisan@upi</strong> or Account: <strong>123456789</strong>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="payment-file">Payment Screenshot *</Label>
            <div className="mt-1">
              <Input
                id="payment-file"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                required
                className="mb-2"
              />
              {previewUrl && (
                <div className="mt-2 rounded-lg border overflow-hidden">
                  <img 
                    src={previewUrl} 
                    alt="Payment proof preview" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="payer-name">Full Name *</Label>
            <Input
              id="payer-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Name used for payment"
            />
          </div>

          <div>
            <Label htmlFor="payer-email">Email Address *</Label>
            <Input
              id="payer-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="payer-phone">Phone Number</Label>
            <Input
              id="payer-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <Label htmlFor="payment-notes">Additional Notes</Label>
            <Textarea
              id="payment-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional information about the payment..."
              rows={2}
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
              {isSubmitting ? "Submitting..." : "Submit Proof"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;