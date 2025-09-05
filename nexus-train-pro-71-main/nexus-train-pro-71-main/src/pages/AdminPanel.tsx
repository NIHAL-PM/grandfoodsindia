import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CertificateGenerator from "@/components/CertificateGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, Image as ImageIcon, Phone, Search, User, Award, Users, BarChart3 } from "lucide-react";
import { usePayments, useUpdatePaymentStatus, useConsultations } from "@/hooks/useSupabase";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const AdminPanel = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const [query, setQuery] = useState("");

  // Supabase hooks
  const { data: payments = [], refetch: refetchPayments } = usePayments();
  const { data: consultations = [], refetch: refetchConsultations } = useConsultations();
  const updatePaymentStatus = useUpdatePaymentStatus();

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive"
      });
    }
  }, [user, isAdmin, toast]);

  const handleUpdatePayment = async (id: string, status: string) => {
    try {
      await updatePaymentStatus.mutateAsync({ paymentId: id, status });
      refetchPayments();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const filteredConsultations = consultations.filter((c: any) =>
    (c.profiles?.full_name + c.profiles?.email + (c.profiles?.phone || "")).toLowerCase().includes(query.toLowerCase())
  );
  
  const filteredPayments = payments.filter((p: any) =>
    (p.profiles?.full_name + p.profiles?.email).toLowerCase().includes(query.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You don't have permission to access this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-8 sm:py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-playfair font-bold">Admin Panel</h1>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="payments">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="payments" className="text-sm sm:text-base">Payments</TabsTrigger>
              <TabsTrigger value="consultations" className="text-sm sm:text-base">Consultations</TabsTrigger>
              <TabsTrigger value="certificates" className="text-sm sm:text-base">Certificates</TabsTrigger>
              <TabsTrigger value="analytics" className="text-sm sm:text-base">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="payments" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredPayments.map((p: any) => (
                  <Card key={p.id} className="card-elevated">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-base sm:text-lg truncate">Payment Record</span>
                        <Badge className="self-start sm:self-center">{p.method}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{p.profiles?.full_name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</div>
                      </div>
                      <div className="text-sm break-all">{p.profiles?.email}{p.profiles?.phone ? ` • ${p.profiles.phone}` : ""}</div>
                      <div className="text-lg font-semibold">
                        ₹{(p.amount_cents / 100).toLocaleString()} {p.currency}
                      </div>
                      {p.screenshot_url && (
                        <div className="rounded-lg overflow-hidden border">
                          <img src={p.screenshot_url} alt="Payment proof" className="w-full h-32 sm:h-48 object-cover" />
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Badge className={
                          p.status === "verified" ? "bg-success text-success-foreground" : 
                          p.status === "failed" ? "bg-destructive text-destructive-foreground" : 
                          ""
                        }>{p.status}</Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleUpdatePayment(p.id, "verified")} className="w-full sm:w-auto">Approve</Button>
                        <Button variant="outline" size="sm" onClick={() => handleUpdatePayment(p.id, "failed")} className="w-full sm:w-auto">Reject</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleUpdatePayment(p.id, "pending")} className="w-full sm:w-auto">Pending</Button>
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
                {filteredConsultations.map((c: any) => (
                  <Card key={c.id} className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{c.profiles?.full_name}</span>
                        <Badge>{c.status}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">{c.profiles?.email}{c.profiles?.phone ? ` • ${c.profiles.phone}` : ""}</div>
                      {c.message && <div className="text-sm text-muted-foreground">{c.message}</div>}
                      <div className="text-sm"><strong>Date:</strong> {new Date(c.requested_date).toLocaleDateString()}</div>
                      <div className="text-sm"><strong>Time:</strong> {c.preferred_time}</div>
                      {c.topic && <div className="text-sm"><strong>Topic:</strong> {c.topic}</div>}
                      <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-1" /> Contact
                        </Button>
                        <Button variant="outline" size="sm">
                          <CheckCircle className="w-4 h-4 mr-1" /> Complete
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

            <TabsContent value="certificates" className="mt-6">
              <CertificateGenerator />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Payments</p>
                        <p className="text-2xl font-bold">{payments.length}</p>
                      </div>
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
                        <p className="text-2xl font-bold">{payments.filter((p: any) => p.status === 'pending').length}</p>
                      </div>
                      <div className="h-8 w-8 bg-warning/10 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-warning" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Consultations</p>
                        <p className="text-2xl font-bold">{consultations.length}</p>
                      </div>
                      <div className="h-8 w-8 bg-success/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-success" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                        <p className="text-2xl font-bold">
                          ₹{payments.filter((p: any) => p.status === 'verified')
                            .reduce((sum: number, p: any) => sum + (p.amount_cents / 100), 0)
                            .toLocaleString()}
                        </p>
                      </div>
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-primary" />
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
    </div>
  );
};

export default AdminPanel;
