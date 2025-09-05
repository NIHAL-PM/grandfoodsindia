import { useState, useRef, ChangeEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Storage, Enrollment, EnrollmentParticipant } from '@/utils/localStore';
import { useAuth } from '@/context/AuthContext';
import { uploadFile, getFileUrl, createPayment } from '@/lib/supabase-api';

const genId = () => (typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2));

interface EnrollmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  courseTitle: string;
  plan?: string;
}

export const EnrollmentFormModal = ({ open, onOpenChange, courseId, courseTitle, plan }: EnrollmentFormModalProps) => {
  const { toast } = useToast();
  const [isGroup, setIsGroup] = useState(false);
  const [payer, setPayer] = useState({ name: '', email: '', phone: '', organization: '' });
  const [participants, setParticipants] = useState<EnrollmentParticipant[]>([{ id: genId(), name: '', age: '', occupation: '', email: '', phone: '' }]);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'bank'>('upi');
  const [paymentFiles, setPaymentFiles] = useState<File[]>([]);
  const [paymentFilePreviews, setPaymentFilePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuth();

  const handleParticipantChange = (id: string, field: keyof EnrollmentParticipant, value: string) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addParticipant = () => {
    setParticipants(prev => [...prev, { id: genId(), name: '', age: '', occupation: '', email: '', phone: '' }]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    setPaymentFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setPaymentFilePreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const submit = async () => {
    if (!payer.name || !payer.email) {
      toast({ title: 'Missing payer info', description: 'Name and Email are required for payer.', variant: 'destructive' });
      return;
    }
    if (!isGroup) {
      // For individual, ensure first participant has basic info (fall back to payer if blank)
      const first = participants[0];
      if (!first.name) first.name = payer.name;
      if (!first.email) first.email = payer.email;
    }
    const cleanedParticipants = (isGroup ? participants : [participants[0]]).filter(p => p.name);
    if (cleanedParticipants.length === 0) {
      toast({ title: 'Participant missing', description: 'At least one participant name is required.', variant: 'destructive' });
      return;
    }

    const enrollment: Enrollment = {
      id: genId(),
      courseId,
      courseTitle,
      enrollmentType: isGroup ? 'group' : 'individual',
      participants: cleanedParticipants,
      payer: { ...payer },
      paymentMethod,
      paymentProofDataUrl: paymentFilePreviews[0],
      notes,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };

    // Try Supabase: upload each file and create a payment row per upload (bulk)
    try {
      const uploadedUrls: string[] = [];
      for (const file of paymentFiles) {
        const ext = (file.name.split('.').pop() || 'png').toLowerCase();
        const path = `enrollments/${user?.id || 'anon'}/${enrollment.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        await uploadFile('payment_screens', path, file);
        const url = await getFileUrl('payment_screens', path);
        uploadedUrls.push(url);
        await createPayment({
          user_id: user?.id || null,
          method: paymentMethod,
          amount_cents: 9999, // Default amount in cents, should be computed from course price
          currency: 'INR',
          screenshot_url: url,
          provider: paymentMethod,
          status: 'pending',
          payer_email: payer.email,
          payer_name: payer.name,
          payer_phone: payer.phone,
          notes,
          course_id: courseId,
          course_title: courseTitle,
          plan,
          enrollment_id: enrollment.id,
        } as any);
      }
      Storage.addEnrollment(enrollment);
      toast({ title: 'Enrollment submitted', description: `Uploaded ${uploadedUrls.length} payment file(s). Awaiting admin verification.` });
    } catch (e) {
      // Fallback to local only
      Storage.addEnrollment(enrollment);
      toast({ title: 'Enrollment submitted (offline)', description: 'Saved locally. Log in to sync with admin.' });
    }
    // reset minimal
    setIsGroup(false);
    setPayer({ name: '', email: '', phone: '', organization: '' });
    setParticipants([{ id: genId(), name: '', age: '', occupation: '', email: '', phone: '' }]);
    setNotes('');
    setPaymentMethod('upi');
  setPaymentFiles([]);
  setPaymentFilePreviews([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enroll in {courseTitle}</DialogTitle>
          <DialogDescription>
            {plan ? `Selected plan: ${plan}` : 'Provide enrollment details. Group enrollment allows multiple participants.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-2">
          <div className="flex items-center gap-3">
            <Switch checked={isGroup} onCheckedChange={c => setIsGroup(c)} id="group-switch" />
            <Label htmlFor="group-switch">Group Enrollment</Label>
          </div>
          <section className="space-y-4">
            <h4 className="font-medium text-sm">Payer / Primary Contact</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Name *</Label>
                <Input value={payer.name} onChange={e => setPayer(p => ({ ...p, name: e.target.value }))} placeholder="Full name" />
              </div>
              <div>
                <Label className="text-xs">Email *</Label>
                <Input type="email" value={payer.email} onChange={e => setPayer(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
              </div>
              <div>
                <Label className="text-xs">Phone</Label>
                <Input value={payer.phone} onChange={e => setPayer(p => ({ ...p, phone: e.target.value }))} placeholder="+1..." />
              </div>
              <div>
                <Label className="text-xs">Organization (optional)</Label>
                <Input value={payer.organization} onChange={e => setPayer(p => ({ ...p, organization: e.target.value }))} placeholder="Company / School" />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Participants {isGroup && <span className="text-xs text-muted-foreground">(add each attendee)</span>}</h4>
              {isGroup && (
                <Button size="sm" variant="outline" onClick={addParticipant}>Add Participant</Button>
              )}
            </div>
            <div className="space-y-4">
              {(isGroup ? participants : [participants[0]]).map((p, idx) => (
                <div key={p.id} className="border rounded-md p-3 space-y-3 relative">
                  {isGroup && participants.length > 1 && (
                    <button type="button" onClick={() => removeParticipant(p.id)} className="absolute top-2 right-2 text-xs text-muted-foreground hover:text-destructive">Remove</button>
                  )}
                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Name *</Label>
                      <Input value={p.name} onChange={e => handleParticipantChange(p.id, 'name', e.target.value)} placeholder="Participant name" />
                    </div>
                    <div>
                      <Label className="text-xs">Age</Label>
                      <Input value={p.age || ''} onChange={e => handleParticipantChange(p.id, 'age', e.target.value)} placeholder="Age" />
                    </div>
                    <div>
                      <Label className="text-xs">Occupation</Label>
                      <Input value={p.occupation || ''} onChange={e => handleParticipantChange(p.id, 'occupation', e.target.value)} placeholder="Occupation" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Email</Label>
                      <Input type="email" value={p.email || ''} onChange={e => handleParticipantChange(p.id, 'email', e.target.value)} placeholder="email@example.com" />
                    </div>
                    <div>
                      <Label className="text-xs">Phone</Label>
                      <Input value={p.phone || ''} onChange={e => handleParticipantChange(p.id, 'phone', e.target.value)} placeholder="+1..." />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="font-medium text-sm">Payment</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>Select a payment method. For UPI, use GPay / PhonePe sample button. Upload screenshot of payment confirmation.</p>
            </div>
            <div className="flex gap-3 flex-wrap text-sm">
              {(['upi','card','bank'] as const).map(m => (
                <Button key={m} type="button" variant={paymentMethod === m ? 'default' : 'outline'} size="sm" onClick={() => setPaymentMethod(m)}>
                  {m.toUpperCase()}
                </Button>
              ))}
              {paymentMethod === 'upi' && (
                <Button 
                  type="button" 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => {
                    toast({ 
                      title: 'UPI Payment Gateway', 
                      description: 'Opening UPI payment flow...' 
                    });
                    // In real app: Open actual UPI payment gateway
                    setTimeout(() => {
                      window.open('upi://pay?pa=kaisan@upi&pn=Kaisan%20Associates&cu=INR&am=7000', '_blank');
                    }, 1000);
                  }}
                >
                  Pay with UPI
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Upload Payment Screenshot(s)</Label>
              <Input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFile} />
              {paymentFilePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {paymentFilePreviews.map((src, i) => (
                    <div key={i} className="border rounded-md p-1">
                      <img src={src} alt="payment" className="w-full h-20 object-cover rounded" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="space-y-2">
            <Label className="text-xs">Notes / Additional Info</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any specific requirements or questions" />
          </section>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
            <Button onClick={submit} type="button">Submit Enrollment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentFormModal;
