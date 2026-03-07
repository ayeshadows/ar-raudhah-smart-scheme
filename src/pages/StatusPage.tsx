import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle2, XCircle, FileText, Ban } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";

type Application = {
  id: string;
  plan: string;
  status: string;
  created_at: string;
  full_name: string;
  nric: string;
  cancelled_at: string | null;
};

const StatusPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellingAppId, setCancellingAppId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchApplications = async (uid: string) => {
    const { data, error } = await supabase
      .from("applications")
      .select("id, plan, status, created_at, full_name, nric, cancelled_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (!error && data) setApplications(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/auth"); return; }
      setUserId(session.user.id);
      fetchApplications(session.user.id).finally(() => setLoading(false));
    });
  }, [navigate]);

  const handleCancelApplication = async () => {
    if (!cancellingAppId || !userId) return;
    setCancelling(true);
    const { error } = await supabase
      .from("applications")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", cancellingAppId);
    if (error) {
      toast.error("Failed to cancel application");
    } else {
      toast.success("Application cancelled");
      await fetchApplications(userId);
    }
    setCancelling(false);
    setCancelDialogOpen(false);
    setCancellingAppId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case "rejected": return <XCircle className="w-5 h-5 text-destructive" />;
      case "cancelled": return <Ban className="w-5 h-5 text-muted-foreground" />;
      default: return <Clock className="w-5 h-5 text-accent" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved": return "border-primary/30 bg-primary/5";
      case "rejected": return "border-destructive/30 bg-destructive/5";
      case "cancelled": return "border-muted bg-muted/30";
      default: return "border-accent/30 bg-accent/5";
    }
  };

  const getSteps = (status: string) => {
    switch (status) {
      case "approved":
        return [
          { label: "Submitted", done: true },
          { label: "Under Review", done: true },
          { label: "Payment Verified", done: true },
          { label: "Approved", done: true },
        ];
      case "rejected":
        return [
          { label: "Submitted", done: true },
          { label: "Under Review", done: true },
          { label: "Rejected", done: true },
        ];
      case "cancelled":
        return [
          { label: "Submitted", done: true },
          { label: "Cancelled", done: true },
        ];
      default:
        return [
          { label: "Submitted", done: true },
          { label: "Under Review", done: false },
          { label: "Payment Verified", done: false },
          { label: "Approved", done: false },
        ];
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
        <div className="container max-w-3xl mx-auto flex items-center gap-4 py-4 px-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-heading font-semibold text-foreground">Application Status</h1>
            <p className="text-xs text-muted-foreground">Track your Skim Pintar applications</p>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-6 py-10">
        {applications.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-heading font-semibold text-foreground mb-2">No Applications</h2>
            <p className="text-muted-foreground mb-6 text-sm">You haven't submitted any applications yet.</p>
            <Button onClick={() => navigate("/apply")}>Apply Now</Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {applications.map((app, index) => {
              const steps = getSteps(app.status);
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-card rounded-xl border-2 p-6 shadow-card ${getStatusStyle(app.status)}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg font-body">{app.full_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {app.plan === "pintar" ? "Pintar ($5/month)" : "Pintar Plus ($20/month)"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ref: {app.id.slice(0, 8).toUpperCase()} · {new Date(app.created_at).toLocaleDateString()}
                      </p>
                      {app.cancelled_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Cancelled on {new Date(app.cancelled_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <span className="text-sm font-semibold capitalize text-foreground">{app.status}</span>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex items-center gap-0">
                    {steps.map((s, i) => (
                      <div key={i} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                            s.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}>
                            {s.done ? "✓" : i + 1}
                          </div>
                          <span className="text-[10px] text-muted-foreground mt-1.5 text-center max-w-[80px] leading-tight">{s.label}</span>
                        </div>
                        {i < steps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 mt-[-16px] ${s.done ? "bg-primary" : "bg-muted"}`} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Cancel button for pending apps */}
                  {app.status === "pending" && (
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => { setCancellingAppId(app.id); setCancelDialogOpen(true); }}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Cancel Application
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Application</DialogTitle>
            <DialogDescription>
              Are you sure? This cannot be undone. The cancelled application will remain in your records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep Application</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleCancelApplication} disabled={cancelling}>
              {cancelling ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StatusPage;
