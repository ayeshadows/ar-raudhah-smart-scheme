import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle2, XCircle, FileText } from "lucide-react";

type Application = {
  id: string;
  plan: string;
  status: string;
  created_at: string;
  full_name: string;
  nric: string;
};

const StatusPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      const stored = localStorage.getItem(`skim_pintar_apps_${session.user.id}`);
      if (stored) setApplications(JSON.parse(stored));
      setLoading(false);
    });
  }, [navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case "rejected": return <XCircle className="w-5 h-5 text-destructive" />;
      default: return <Clock className="w-5 h-5 text-accent" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved": return "border-primary/30 bg-primary/5";
      case "rejected": return "border-destructive/30 bg-destructive/5";
      default: return "border-accent/30 bg-accent/5";
    }
  };

  const steps = [
    { label: "Application Submitted", done: true },
    { label: "Under Review", done: false },
    { label: "Payment Verified", done: false },
    { label: "Approved", done: false },
  ];

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
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-heading font-semibold text-foreground mb-2">No Applications</h2>
            <p className="text-muted-foreground mb-6 text-sm">You haven't submitted any applications yet.</p>
            <Button onClick={() => navigate("/apply")}>Apply Now</Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {applications.map((app, index) => (
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
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                            s.done
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {s.done ? "✓" : i + 1}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1.5 text-center max-w-[80px] leading-tight">
                          {s.label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 mt-[-16px] ${s.done ? "bg-primary" : "bg-muted"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StatusPage;
