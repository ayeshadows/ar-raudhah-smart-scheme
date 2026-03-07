import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogOut, FileText, CreditCard, Clock, ChevronRight, Settings, HelpCircle, Mail, Receipt, XCircle } from "lucide-react";
import CoursesSection from "@/components/CoursesSection";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useSettings } from "@/contexts/SettingsContext";

type Application = {
  id: string;
  plan: string;
  status: string;
  created_at: string;
  full_name: string;
  cancelled_at: string | null;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useSettings();
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellingAppId, setCancellingAppId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchApplications = async (userId: string) => {
    const { data, error } = await supabase
      .from("applications")
      .select("id, plan, status, created_at, full_name, cancelled_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && data) setApplications(data);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) { navigate("/auth"); return; }
      setUser(session.user);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/auth"); return; }
      setUser(session.user);
      fetchApplications(session.user.id).finally(() => setLoading(false));
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const handleCancelApplication = async () => {
    if (!cancellingAppId) return;
    setCancelling(true);
    const { error } = await supabase
      .from("applications")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", cancellingAppId);

    if (error) {
      toast.error("Failed to cancel application");
    } else {
      toast.success("Application cancelled successfully");
      if (user) await fetchApplications(user.id);
    }
    setCancelling(false);
    setCancelDialogOpen(false);
    setCancellingAppId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-primary/10 text-primary";
      case "pending": return "bg-accent/20 text-accent-foreground";
      case "rejected": return "bg-destructive/10 text-destructive";
      case "cancelled": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-card">
        <div className="container max-w-5xl mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
              <img src="/araudhah_logo.jpg" alt="Masjid Ar-Raudhah Logo" className="w-10 h-10 rounded-lg object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-semibold text-foreground">Skim Pintar</h1>
              <p className="text-xs text-muted-foreground">Masjid Ar-Raudhah</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/faq")} className="text-muted-foreground">
              <HelpCircle className="w-4 h-4 mr-1" /> {t("nav.faq")}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/contact")} className="text-muted-foreground">
              <Mail className="w-4 h-4 mr-1" /> {t("nav.contactUs")}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate("/settings")} aria-label={t("nav.settings")} title={t("nav.settings")} className="h-10 w-10 rounded-full border-border bg-card text-foreground shadow-card hover:bg-secondary">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-2" /> {t("nav.logout")}
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
            {t("dashboard.welcome")}, {user?.user_metadata?.full_name || "Member"}
          </h2>
          <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <button onClick={() => navigate("/apply")} className="group bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all text-left border">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 font-body">{t("nav.newApplication")}</h3>
            <p className="text-sm text-muted-foreground">{t("dashboard.applyViaSingpass")}</p>
            <ChevronRight className="w-4 h-4 text-muted-foreground mt-3 group-hover:translate-x-1 transition-transform" />
          </button>

          <button onClick={() => navigate("/payment")} className="group bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all text-left border">
            <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 font-body">{t("nav.paymentSetup")}</h3>
            <p className="text-sm text-muted-foreground">{t("dashboard.setUpCard")}</p>
            <ChevronRight className="w-4 h-4 text-muted-foreground mt-3 group-hover:translate-x-1 transition-transform" />
          </button>

          <button onClick={() => navigate("/status")} className="group bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all text-left border">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 font-body">{t("nav.trackStatus")}</h3>
            <p className="text-sm text-muted-foreground">{t("dashboard.viewStatus")}</p>
            <ChevronRight className="w-4 h-4 text-muted-foreground mt-3 group-hover:translate-x-1 transition-transform" />
          </button>

          <button onClick={() => navigate("/transactions")} className="group bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all text-left border">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
              <Receipt className="w-5 h-5 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 font-body">{t("nav.transactions")}</h3>
            <p className="text-sm text-muted-foreground">{t("dashboard.viewPayments")}</p>
            <ChevronRight className="w-4 h-4 text-muted-foreground mt-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-xl font-heading font-semibold text-foreground mb-4">{t("dashboard.yourApplications")}</h3>
          {applications.length === 0 ? (
            <div className="bg-card rounded-xl border p-10 text-center shadow-card">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">{t("dashboard.noApplications")}</p>
              <Button onClick={() => navigate("/apply")}>{t("dashboard.applyNow")}</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="bg-card rounded-xl border p-5 shadow-card flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground font-body">{app.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {app.plan === "pintar" ? t("plan.pintarPrice") : t("plan.pintarPlusPrice")}
                      {" · "}
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                    {app.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        title={t("dashboard.cancelApplication")}
                        onClick={() => { setCancellingAppId(app.id); setCancelDialogOpen(true); }}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10 bg-card rounded-xl border p-6 shadow-card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">{t("dashboard.aboutSkimPintar")}</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2 font-body">{t("plan.pintar")} — $5-$15/{t("font.medium") === "Medium" ? "month" : t("font.medium") === "Sederhana" ? "bulan" : "月"}</h4>
              <p>{t("plan.pintarDesc")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2 font-body">{t("plan.pintarPlus")} — $20+/{t("font.medium") === "Medium" ? "month" : t("font.medium") === "Sederhana" ? "bulan" : "月"}</h4>
              <p>{t("plan.pintarPlusDesc")}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground mt-4 pt-4 border-t">
            <div>
              <h4 className="font-semibold text-foreground mb-2 font-body">{t("plan.pintar")} — {t("plan.benefits")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Bathing, shrouding, prayer, burial</li>
                <li>Undertaker (Jurumandi)</li>
                <li>Bathing and shrouding kits</li>
                <li>Nisan, name plate, carpet grass</li>
                <li>40-seater bus to cemetery (2 way)</li>
                <li>20% off courses at Ar-Raudhah Mosque</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2 font-body">{t("plan.pintarPlus")} — {t("plan.benefits")}</h4>
              <p className="text-sm text-muted-foreground">123</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold text-foreground mb-2 text-sm font-body">Additional Charges</h4>
            <p className="text-sm text-muted-foreground">123</p>
          </div>
        </motion.div>

        <CoursesSection applications={applications} />
      </main>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dashboard.cancelApplication")}</DialogTitle>
            <DialogDescription>{t("dashboard.cancelConfirm")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("dashboard.keepApplication")}</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleCancelApplication} disabled={cancelling}>
              {cancelling ? t("dashboard.cancelling") : t("dashboard.yesCancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
