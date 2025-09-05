import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useQueryClient } from '@tanstack/react-query'
import { 
  CheckCircle, 
  Clock, 
  Image as ImageIcon, 
  Phone, 
  Search, 
  User, 
  Users,
  Award,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Calendar,
  Mail,
  Building,
  GraduationCap,
  Star,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { Storage, Consultation, PaymentProof, CertificateRecord, nextCertificateNumber, computeCertificateHash, TrainerCallRequest } from "@/utils/localStore";
import { usePayments, useConsultations, useUpdatePaymentStatus, useUpdateConsultationStatus } from "@/hooks/useSupabase";
import * as api from '@/lib/supabase-api'
import { provisionUserFromPayment } from "@/lib/supabase-api";
import { supabase } from "@/integrations/supabase/client";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import CertificatePreview from '@/components/CertificatePreview';
import { uploadBlob, getFileUrl } from '@/lib/supabase-api'

// Mock data structures for enhanced admin features
interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrolledCourses: string[];
  completedCourses: string[];
  certificatesEarned: number;
  joinDate: string;
  status: "active" | "inactive" | "suspended";
  totalPayments: number;
}

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specializations: string[];
  experience: number;
  status: "active" | "inactive" | "pending";
  joinDate: string;
  coursesAssigned: string[];
  rating: number;
  bio: string;
}

interface TrainerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  specializations: string[];
  cv: string;
  coverLetter: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

// Legacy local interface removed in favour of CertificateRecord

const EnhancedAdminPanel = () => {
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const queryClient = useQueryClient()
  // Supabase-backed data
  const { data: payments = [] } = usePayments();
  const { data: consultations = [] } = useConsultations();
  const updatePaymentStatus = useUpdatePaymentStatus();
  const updateConsultationStatus = useUpdateConsultationStatus();

  // Legacy/local UI data
  const [students, setStudents] = useState<Student[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [trainerApplications, setTrainerApplications] = useState<TrainerApplication[]>([]);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [previewCert, setPreviewCert] = useState<CertificateRecord | null>(null);
  const [query, setQuery] = useState("");
  const [trainerCalls, setTrainerCalls] = useState<TrainerCallRequest[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [pdfAttach, setPdfAttach] = useState<Record<string, File | null>>({})

  // Load data on component mount
  useEffect(() => {
    setTrainerCalls(Storage.getTrainerCalls());
    loadAdminData();
  }, []);

  // Realtime updates for payments and consultations
  useEffect(() => {
    const channel = (supabase as any)
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => {
        queryClient.invalidateQueries({ queryKey: ['payments'] })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'consultations' }, () => {
        queryClient.invalidateQueries({ queryKey: ['consultations'] })
      })
      .subscribe()
    return () => {
      try { (supabase as any).removeChannel(channel) } catch {}
    }
  }, [queryClient])

  const loadAdminData = async () => {
    try {
      const [s, t, a, certs] = await Promise.all([
        api.getAdminStudents().catch(() => []),
        api.getAdminTrainers().catch(() => []),
        api.getTrainerApplications().catch(() => []),
        api.getAllCertificatesAdmin().catch(() => [])
      ])
      setStudents(s as any)
      setTrainers(t as any)
      setTrainerApplications(a as any)
      if ((certs as any[])?.length) {
        // Map to local CertificateRecord shape minimally
        setCertificates((certs as any[]).map((c: any) => ({
          id: c.id,
          studentName: c.studentName,
          studentEmail: c.studentEmail,
          courseId: c.course_id || 'course',
          courseTitle: c.courseTitle,
          courseSubtitle: undefined,
          instructor: '—',
          issueDate: c.issued_at,
          certificateNumber: c.certificate_id,
          hours: undefined,
          grade: undefined,
          sequence: 0,
          year: new Date(c.issued_at).getFullYear(),
          verificationUrl: `${window.location.origin}/verify-certificate?cert=${encodeURIComponent(c.certificate_id)}`,
          hash: c.certificate_id
        })))
      } else {
        // Fallback to locally stored certificates
        setCertificates(Storage.getCertificates())
      }
    } catch {
      // Full local fallback
      setCertificates(Storage.getCertificates())
    }
  }

  const updateConsultation = async (id: string, status: Consultation["status"]) => {
    try {
      await updateConsultationStatus.mutateAsync({ consultationId: id, status });
      toast({ title: t("admin.consultations") + " updated" });
    } catch (e) {
      // Fallback to local storage (legacy)
      Storage.updateConsultation(id, { status });
      toast({ title: t("admin.consultations") + " updated (local)" });
    }
  };

  const updatePayment = async (id: string, status: PaymentProof["status"]) => {
    setActionLoadingId(id)
    try {
      await updatePaymentStatus.mutateAsync({ paymentId: id, status });
      toast({ title: `${t("admin.payments")} ${status}` });
      if (status === 'approved') {
        try {
          // Load the approved payment with metadata for provisioning
          const { data: payment, error } = await (supabase as any)
            .from('payments')
            .select('*')
            .eq('id', id)
            .single()
          if (error) throw error
          const result = await provisionUserFromPayment(payment)
          const generatedId = (result as any)?.id || (result as any)?.student_id
          toast({ title: 'User provisioned', description: generatedId ? `Credentials sent. ID: ${generatedId}` : 'Welcome email sent.' });
        } catch (e) {
          toast({ title: 'Provisioning failed', description: 'Check Edge Function logs.', variant: 'destructive' });
        }
      }
    } catch (e) {
      // Fallback to local storage if Supabase update fails
      Storage.updatePayment(id, { status });
      toast({ title: `${t("admin.payments")} ${status}` });
    }
    setActionLoadingId(null)
  };

  const provisionOnly = async (paymentId: string) => {
    setActionLoadingId(paymentId)
    try {
      const { data: payment, error } = await (supabase as any)
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single()
      if (error) throw error
      const result = await provisionUserFromPayment(payment)
      const generatedId = (result as any)?.id || (result as any)?.student_id
      toast({ title: 'Provisioned', description: generatedId ? `ID: ${generatedId}` : 'Welcome email sent.' })
    } catch (e) {
      toast({ title: 'Provisioning failed', variant: 'destructive' })
    }
    setActionLoadingId(null)
  }

  const resendWelcome = async (paymentId: string) => {
    setActionLoadingId(paymentId)
    try {
      const { data: payment, error } = await (supabase as any)
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single()
      if (error) throw error
      const email = payment?.payer_email
      const name = payment?.payer_name || 'Student'
      await (supabase as any).functions.invoke('send-welcome-email', { body: { email, name, role: 'student', userId: payment?.user_id || null, uniqueId: null } })
      toast({ title: 'Welcome email resent' })
    } catch (e) {
      toast({ title: 'Resend failed', variant: 'destructive' })
    }
    setActionLoadingId(null)
  }

  const generateCertificate = async (student: Student, courseTitle: string) => {
    // Try issuing via Supabase to get a globally unique, durable ID first
    const courseCode = courseTitle
      ? courseTitle.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 8)
      : 'GEN'
    try {
      const { data, error } = await (supabase as any).rpc('issue_certificate', {
        p_user_id: student.id,
        p_course_id: null,
        p_course_code: courseCode,
        p_issued_by: null
      })
      if (error) throw error
      if (data) {
        const dbCert = data as any
        const mapped: CertificateRecord = {
          id: dbCert.id,
          studentName: student.name,
          studentEmail: student.email,
          courseId: dbCert.course_id || 'course',
          courseTitle,
          courseSubtitle: undefined,
          instructor: trainers[0]?.name,
          issueDate: dbCert.issued_at,
          certificateNumber: dbCert.certificate_id,
          hours: undefined,
          grade: undefined,
          sequence: 0,
          year: new Date(dbCert.issued_at).getFullYear(),
          verificationUrl: `${window.location.origin}/verify-certificate?cert=${encodeURIComponent(dbCert.certificate_id)}`,
          hash: dbCert.certificate_id
        }
        setCertificates(prev => [mapped, ...prev])
        setPreviewCert(mapped)
        toast({ title: 'Certificate issued', description: mapped.certificateNumber })
        return
      }
    } catch {}

    // Fallback to legacy local generation if RPC not available
    const courseId = courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { certificateNumber, sequence, year } = nextCertificateNumber(courseId);
    const base: Omit<CertificateRecord, 'hash'> = {
      id: crypto.randomUUID(),
      studentName: student.name,
      studentEmail: student.email,
      courseId,
      courseTitle,
      courseSubtitle: undefined,
      instructor: trainers[0]?.name,
      issueDate: new Date().toISOString(),
      certificateNumber,
      hours: undefined,
      grade: undefined,
      sequence,
      year,
      verificationUrl: `${window.location.origin}/verify-certificate?cert=${encodeURIComponent(certificateNumber)}`
    };
    const record: CertificateRecord = { ...base, hash: computeCertificateHash(base) };
    Storage.addCertificate(record);
    setCertificates(Storage.getCertificates());
    setPreviewCert(record);
    toast({ title: 'Certificate generated (local)', description: certificateNumber });
  };

  const bulkGenerateCertificates = () => {
    const batch: CertificateRecord[] = [];
    students.forEach(student => {
      student.completedCourses.forEach(courseTitle => {
        const courseId = courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const { certificateNumber, sequence, year } = nextCertificateNumber(courseId);
        const base: Omit<CertificateRecord, 'hash'> = {
          id: crypto.randomUUID(),
          studentName: student.name,
          studentEmail: student.email,
          courseId,
          courseTitle,
          courseSubtitle: undefined,
          instructor: trainers[0]?.name,
          issueDate: new Date().toISOString(),
          certificateNumber,
          hours: undefined,
          grade: undefined,
          sequence,
          year,
          verificationUrl: `${window.location.origin}/verify-certificate?cert=${encodeURIComponent(certificateNumber)}`
        };
        batch.push({ ...base, hash: computeCertificateHash(base) });
      });
    });
    Storage.bulkAddCertificates(batch);
    setCertificates(Storage.getCertificates());
    toast({ title: `Generated ${batch.length} certificates` });
  };

  const filteredConsultations = (consultations as any[]).filter((c: any) => {
    const key = (c.profiles?.full_name || c.name || "") + (c.profiles?.email || c.email || "") + (c.profiles?.phone || c.phone || "");
    return key.toLowerCase().includes(query.toLowerCase());
  });
  
  const filteredPayments = (payments as any[]).filter((p: any) => {
    const key = (p.profiles?.full_name || "") + (p.profiles?.email || "") + (p.courseTitle || "");
    return key.toLowerCase().includes(query.toLowerCase());
  });

  const filteredStudents = students.filter((s) =>
    (s.name + s.email + s.phone).toLowerCase().includes(query.toLowerCase())
  );

  const filteredTrainers = trainers.filter((t) =>
    (t.name + t.email + t.specializations.join(" ")).toLowerCase().includes(query.toLowerCase())
  );

  const downloadCertificate = (cert: CertificateRecord, format: 'png' | 'pdf' = 'png') => {
    // Render a hidden certificate preview to canvas via html2canvas (defer heavy lib import)
    import('html2canvas').then(({ default: html2canvas }) => {
      const temp = document.createElement('div');
      temp.style.position = 'fixed';
      temp.style.left = '-10000px';
      document.body.appendChild(temp);
      const element = (
        <div className="p-6 bg-white">
          <CertificatePreview certificate={cert} />
        </div>
      );
      // Need to use ReactDOM to render
      import('react-dom').then(ReactDOM => {
        // @ts-ignore
        ReactDOM.render(element, temp);
        setTimeout(() => {
          html2canvas(temp.firstElementChild as HTMLElement, { scale: 2 }).then(canvas => {
            if (format === 'png') {
              const link = document.createElement('a');
              link.download = cert.certificateNumber + '.png';
              link.href = canvas.toDataURL('image/png');
              link.click();
              document.body.removeChild(temp);
            } else {
              import('jspdf').then(({ jsPDF }) => {
                const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
                const imgData = canvas.toDataURL('image/png');
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                // fit image inside page
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
                const renderWidth = imgWidth * ratio;
                const renderHeight = imgHeight * ratio;
                const x = (pageWidth - renderWidth) / 2;
                const y = (pageHeight - renderHeight) / 2;
                pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight);
                pdf.save(cert.certificateNumber + '.pdf');
                document.body.removeChild(temp);
              });
            }
          });
        }, 50);
      });
    }).catch(() => {
      toast({ title: 'Download failed' });
    });
  };

  const backfillLocalCertificates = async () => {
    const locals = Storage.getCertificates()
    if (!locals.length) {
      toast({ title: 'No local certificates to backfill' })
      return
    }
    let ok = 0, fail = 0
    for (const c of locals) {
      try {
        const { data, error } = await (supabase as any).rpc('issue_certificate', {
          p_user_id: null,
          p_course_id: null,
          p_course_code: c.certificateNumber.split('-')[2] || 'GEN',
          p_issued_by: null
        })
        if (error) throw error
        const issued = data as any
        // Optional PDF attach if provided via state
        const maybePdf = pdfAttach[c.id]
        if (maybePdf) {
          const path = `certificates/${issued.id}.pdf`
          await uploadBlob('certificates', path, maybePdf, { contentType: 'application/pdf' })
          const url = await getFileUrl('certificates', path)
          await (supabase as any).from('certificates').update({ pdf_url: url }).eq('id', issued.id)
        }
        ok++
      } catch {
        fail++
      }
    }
    toast({ title: 'Backfill complete', description: `${ok} issued, ${fail} failed` })
  }

  const issueCustomCertificate = async (student: Student, code: string, pdf?: File) => {
    try {
      const { data, error } = await (supabase as any).rpc('issue_certificate', {
        p_user_id: student.id,
        p_course_id: null,
        p_course_code: code,
        p_issued_by: null
      })
      if (error) throw error
      const issued = data as any
      if (pdf) {
        const path = `certificates/${issued.id}.pdf`
        await uploadBlob('certificates', path, pdf, { contentType: 'application/pdf' })
        const url = await getFileUrl('certificates', path)
        await (supabase as any).from('certificates').update({ pdf_url: url }).eq('id', issued.id)
      }
      toast({ title: 'Certificate issued', description: issued.certificate_id })
    } catch (e: any) {
      toast({ title: 'Issue failed', description: e?.message, variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Navigation />

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-playfair font-bold">{t("page.admin")}</h1>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder={t("common.search")} 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                className="pl-9" 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="dashboard">
            <TabsList className="grid grid-cols-4 sm:grid-cols-8 w-full overflow-x-auto">
              <TabsTrigger value="dashboard" className="text-xs sm:text-sm">{t("admin.dashboard")}</TabsTrigger>
              <TabsTrigger value="payments" className="text-xs sm:text-sm">{t("admin.payments")}</TabsTrigger>
              <TabsTrigger value="consultations" className="text-xs sm:text-sm">{t("admin.consultations")}</TabsTrigger>
              <TabsTrigger value="students" className="text-xs sm:text-sm">{t("admin.students")}</TabsTrigger>
              <TabsTrigger value="trainers" className="text-xs sm:text-sm">{t("admin.trainers")}</TabsTrigger>
              <TabsTrigger value="certificates" className="text-xs sm:text-sm">{t("admin.certificates")}</TabsTrigger>
              <TabsTrigger value="applications" className="text-xs sm:text-sm">{t("admin.applications")}</TabsTrigger>
              <TabsTrigger value="trainer-calls" className="text-xs sm:text-sm">Calls</TabsTrigger>
            </TabsList>
            {/* Trainer Call Requests */}
            <TabsContent value="trainer-calls" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Trainer Call Requests</h3>
                <Button variant="outline" size="sm" onClick={() => setTrainerCalls(Storage.getTrainerCalls())}>Refresh</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainerCalls.map(call => (
                  <Card key={call.id} className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-sm font-medium">{call.trainerName}</span>
                        <Badge>{call.status}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <Label className="text-xs font-medium">Requester</Label>
                        <p>{call.userName}</p>
                        <p className="text-muted-foreground text-xs">{call.userEmail} • {call.userPhone}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{new Date(call.date).toLocaleDateString()}</span>
                        <Badge variant="outline" className="text-xs">{call.slot}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{call.callType}</Badge>
                        <span className="text-xs text-muted-foreground">{call.timezone}</span>
                      </div>
                      {call.message && <p className="text-xs line-clamp-3">{call.message}</p>}
                      <div className="flex gap-2 pt-1">
                        <Button variant="outline" size="sm" onClick={() => { Storage.updateTrainerCall(call.id, { status: 'confirmed' }); setTrainerCalls(Storage.getTrainerCalls()); }}>Confirm</Button>
                        <Button variant="outline" size="sm" onClick={() => { Storage.updateTrainerCall(call.id, { status: 'completed' }); setTrainerCalls(Storage.getTrainerCalls()); }}>Complete</Button>
                        <Button variant="ghost" size="sm" onClick={() => { Storage.updateTrainerCall(call.id, { status: 'cancelled' }); setTrainerCalls(Storage.getTrainerCalls()); }}>Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {trainerCalls.length === 0 && <div className="text-center py-12 text-muted-foreground">No trainer calls yet.</div>}
            </TabsContent>

            {/* Dashboard Overview */}
            <TabsContent value="dashboard" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="card-elevated">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                        <p className="text-2xl font-bold">{students.length}</p>
                      </div>
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-elevated">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Trainers</p>
                        <p className="text-2xl font-bold">{trainers.filter(t => t.status === 'active').length}</p>
                      </div>
                      <GraduationCap className="w-8 h-8 text-success" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-elevated">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Certificates Issued</p>
                        <p className="text-2xl font-bold">{certificates.length}</p>
                      </div>
                      <Award className="w-8 h-8 text-accent" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-elevated">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Applications</p>
                        <p className="text-2xl font-bold">{trainerApplications.filter(a => a.status === 'pending').length}</p>
                      </div>
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {consultations.slice(0, 5).map((c) => (
                        <div key={c.id} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{c.name}</p>
                            <p className="text-xs text-muted-foreground">New consultation request</p>
                          </div>
                          <Badge variant="outline">{c.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={bulkGenerateCertificates} className="w-full btn-hero">
                      <Award className="w-4 h-4 mr-2" />
                      {t("admin.bulk")} {t("admin.generate")} {t("admin.certificates")}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export Student Data
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Newsletter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Rest of the existing tabs for payments and consultations */}
            <TabsContent value="payments" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(filteredPayments as any[]).map((p: any) => (
                  <Card key={p.id} className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Payment</span>
                        <Badge>{p.method || 'upi'}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4" />{p.profiles?.full_name || '—'}
                        </div>
                        <div className="text-xs">{new Date(p.created_at).toLocaleString()}</div>
                      </div>
                      <div className="text-sm break-all">{p.profiles?.email}{p.profiles?.phone ? ` • ${p.profiles.phone}` : ""}</div>
                      <div className="text-lg font-semibold">
                        {(p.currency || 'INR').toUpperCase()} {(p.amount_cents ? (p.amount_cents/100).toLocaleString() : '—')}
                      </div>
                      {p.screenshot_url && (
                        <div className="rounded-lg overflow-hidden border">
                          <img src={p.screenshot_url} alt="Payment proof" className="w-full h-48 object-cover" />
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Badge className={p.status === "verified" ? "bg-success text-success-foreground" : p.status === "failed" ? "bg-destructive text-destructive-foreground" : ""}>{p.status}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => updatePayment(p.id, "approved")} disabled={actionLoadingId===p.id}>{t("admin.approve")}</Button>
                        <Button variant="outline" onClick={() => updatePayment(p.id, "rejected")} disabled={actionLoadingId===p.id}>{t("admin.reject")}</Button>
                        <Button variant="ghost" onClick={() => updatePayment(p.id, "pending")} disabled={actionLoadingId===p.id}>
                          Mark Pending
                        </Button>
                        <Button variant="ghost" onClick={() => provisionOnly(p.id)} disabled={actionLoadingId===p.id}>Provision Only</Button>
                        <Button variant="ghost" onClick={() => resendWelcome(p.id)} disabled={actionLoadingId===p.id}>Resend Email</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredPayments.length === 0 && (
                <div className="text-center text-muted-foreground py-12">No payments yet.</div>
              )}
            </TabsContent>

            <TabsContent value="consultations" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(filteredConsultations as any[]).map((c: any) => (
                  <Card key={c.id} className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{c.profiles?.full_name || c.name}</span>
                        <Badge>{c.status}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm break-all">{c.profiles?.email || c.email}{(c.profiles?.phone || c.phone) ? ` • ${(c.profiles?.phone || c.phone)}` : ""}</div>
                      {c.message && <div className="text-sm text-muted-foreground">{c.message}</div>}
                      <div className="text-sm">{c.requested_date && (<><strong>Date:</strong> {new Date(c.requested_date).toLocaleDateString()}</>)}</div>
                      <div className="text-sm">{c.preferred_time && (<><strong>Time:</strong> {c.preferred_time}</>)}</div>
                      <div className="text-xs text-muted-foreground">{new Date(c.created_at || c.createdAt).toLocaleString()}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => updateConsultation(c.id, "contacted")}>
                          <Phone className="w-4 h-4 mr-1" /> Mark Contacted
                        </Button>
                        <Button variant="outline" onClick={() => updateConsultation(c.id, "completed")}>
                          <CheckCircle className="w-4 h-4 mr-1" /> {t("admin.completed")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredConsultations.length === 0 && (
                <div className="text-center text-muted-foreground py-12">No consultations yet.</div>
              )}
            </TabsContent>

            {/* Students Management */}
            <TabsContent value="students" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">{t("admin.students")} Management</h3>
                <Button className="btn-hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{student.name}</span>
                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                          {student.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{student.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Joined: {new Date(student.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">{student.completedCourses.length}</p>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-success">{student.certificatesEarned}</p>
                          <p className="text-xs text-muted-foreground">Certificates</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Enrolled Courses:</Label>
                        <div className="flex flex-wrap gap-1">
                          {student.enrolledCourses.map((course) => (
                            <Badge key={course} variant="outline" className="text-xs">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        {student.completedCourses.length > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => generateCertificate(student, student.completedCourses[0])}
                          >
                            <Award className="w-4 h-4 mr-1" />
                            Certificate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Trainers Management */}
            <TabsContent value="trainers" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">{t("admin.trainers")} Management</h3>
                <Button className="btn-hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trainer
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrainers.map((trainer) => (
                  <Card key={trainer.id} className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{trainer.name}</span>
                        <Badge variant={trainer.status === 'active' ? 'default' : 'secondary'}>
                          {trainer.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{trainer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{trainer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-accent" />
                          <span>{trainer.rating}/5 rating</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">{trainer.experience}</p>
                          <p className="text-xs text-muted-foreground">Years Exp.</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-success">{trainer.coursesAssigned.length}</p>
                          <p className="text-xs text-muted-foreground">Courses</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Specializations:</Label>
                        <div className="flex flex-wrap gap-1">
                          {trainer.specializations.map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {trainer.bio}
                      </p>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Assign Course</DropdownMenuItem>
                            <DropdownMenuItem>View Performance</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Certificates Management */}
            <TabsContent value="certificates" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">{t("admin.certificates")} Management</h3>
                <div className="space-x-2">
                  <Button onClick={bulkGenerateCertificates} className="btn-hero">
                    <Award className="w-4 h-4 mr-2" />
                    {t("admin.bulk")} {t("admin.generate")}
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                  </Button>
                  <Button variant="outline" onClick={backfillLocalCertificates}>
                    Backfill Local → Supabase
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                  <Card key={cert.id} className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-sm font-mono">{cert.certificateNumber}</span>
                        <Badge>generated</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs font-medium">Student:</Label>
                          <p className="text-sm">{cert.studentName}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Course:</Label>
                          <p className="text-sm">{cert.courseTitle}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Issue Date:</Label>
                          <p className="text-sm">{new Date(cert.issueDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => setPreviewCert(cert)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => downloadCertificate(cert, 'png')}>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => downloadCertificate(cert, 'pdf')}>
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 mr-1" />
                          Send
                        </Button>
                        <input type="file" accept="application/pdf" className="hidden" id={`pdf-${cert.id}`} onChange={(e) => setPdfAttach(prev => ({ ...prev, [cert.id]: e.target.files?.[0] || null }))} />
                        <Label htmlFor={`pdf-${cert.id}`} className="text-xs underline cursor-pointer">Attach PDF</Label>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Trainer Applications */}
            <TabsContent value="applications" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Trainer {t("admin.applications")}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainerApplications.map((app) => (
                  <Card key={app.id} className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{app.name}</span>
                        <Badge variant={app.status === 'pending' ? 'default' : app.status === 'approved' ? 'default' : 'destructive'}>
                          {app.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{app.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{app.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-muted-foreground" />
                          <span>{app.experience} years experience</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Specializations:</Label>
                        <div className="flex flex-wrap gap-1">
                          {app.specializations.map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Cover Letter:</Label>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {app.coverLetter}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-1" />
                          View CV
                        </Button>
                        <Button variant="outline" size="sm" className="text-success">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {t("admin.approve")}
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-1" />
                          {t("admin.reject")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />

      {/* Certificate Preview Dialog */}
      <Dialog open={!!previewCert} onOpenChange={(open) => !open && setPreviewCert(null)}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
            <DialogDescription>{previewCert?.certificateNumber}</DialogDescription>
          </DialogHeader>
          {previewCert && (
            <div className="bg-neutral-100 p-4">
              <CertificatePreview certificate={previewCert} />
              <div className="flex gap-2 mt-4">
                <Button onClick={() => downloadCertificate(previewCert)} size="sm">
                  <Download className="w-4 h-4 mr-2" /> Download PNG
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPreviewCert(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedAdminPanel;
