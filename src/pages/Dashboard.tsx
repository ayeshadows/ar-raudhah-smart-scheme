import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogOut, FileText, CreditCard, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";

type Application = {
  id: string;
  plan: string;
  status: string;
  created_at: string;
  full_name: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      // Load applications from localStorage (simulated)
      const stored = localStorage.getItem(`skim_pintar_apps_${session.user.id}`);
      if (stored) setApplications(JSON.parse(stored));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-primary/10 text-primary";
      case "pending": return "bg-accent/20 text-accent-foreground";
      case "rejected": return "bg-destructive/10 text-destructive";
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
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container max-w-5xl mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
              <span className="text-sm font-heading font-bold text-primary">AR</span>
            </div>
            <div>
              <h1 className="text-lg font-heading font-semibold text-foreground">Skim Pintar</h1>
              <p className="text-xs text-muted-foreground">Masjid Ar-Raudhah</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-6 py-10">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
            Assalamualaikum, {user?.user_metadata?.full_name || "Member"}
          </h2>
          <p className="text-muted-foreground">
            Manage your Skim Pintar membership and applications.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        >
          <button
            onClick={() => navigate("/apply")}
            className="group bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all text-left border"
          >
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 font-body">New Application</h3>
            <p className="text-sm text-muted-foreground">Apply via Singpass</p>
            <ChevronRight className="w-4 h-4 text-muted-foreground mt-3 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate("/payment")}
            className="group bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all text-left border"
          >
            <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 font-body">Payment Setup</h3>
            <p className="text-sm text-muted-foreground">Set up card deductions</p>
            <ChevronRight className="w-4 h-4 text-muted-foreground mt-3 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate("/status")}
            className="group bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all text-left border"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 font-body">Track Status</h3>
            <p className="text-sm text-muted-foreground">View application status</p>
            <ChevronRight className="w-4 h-4 text-muted-foreground mt-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Applications */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-heading font-semibold text-foreground mb-4">Your Applications</h3>
          {applications.length === 0 ? (
            <div className="bg-card rounded-xl border p-10 text-center shadow-card">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No applications yet</p>
              <Button onClick={() => navigate("/apply")}>
                Apply Now
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="bg-card rounded-xl border p-5 shadow-card flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground font-body">{app.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {app.plan === "pintar" ? "Pintar ($5/month)" : "Pintar Plus ($20/month)"}
                      {" · "}
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 bg-card rounded-xl border p-6 shadow-card"
        >
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">About Skim Pintar</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2 font-body">Pintar — $5/month</h4>
              <p>Free funeral services for the donor in the event of death.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2 font-body">Pintar Plus — $20/month</h4>
              <p>Complimentary funeral services for the donor and immediate family living under one address.</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold text-foreground mb-2 text-sm font-body">Benefits include:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Bathing, shrouding, prayer, burial</li>
              <li>Undertaker (Jurumandi)</li>
              <li>Bathing and shrouding kits</li>
              <li>Nisan, name plate, carpet grass</li>
              <li>40-seater bus to cemetery (2 way)</li>
              <li>20% off courses at Ar-Raudhah Mosque</li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
