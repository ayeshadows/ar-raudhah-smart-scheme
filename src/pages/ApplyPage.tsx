import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

// Simulated Singpass / MyInfo data
const MOCK_MYINFO = {
  full_name: "Ahmad bin Abdullah",
  nric: "S9012345A",
  date_of_birth: "1990-03-15",
  address: "Blk 123 Bishan Street 12, #08-456, Singapore 570123",
  phone: "91234567",
  email: "ahmad.abdullah@email.com",
};

const ApplyPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"start" | "singpass" | "form">("start");
  const [plan, setPlan] = useState<"pintar" | "pintar_plus">("pintar");
  const [formData, setFormData] = useState({
    full_name: "",
    nric: "",
    date_of_birth: "",
    address: "",
    phone: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
    });
  }, [navigate]);

  const handleSingpass = () => {
    setStep("singpass");
    // Simulate Singpass loading
    setTimeout(() => {
      setFormData(MOCK_MYINFO);
      setStep("form");
      toast.success("MyInfo data retrieved successfully");
    }, 2000);
  };

  const handleManualEntry = () => {
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const application = {
        id: crypto.randomUUID(),
        ...formData,
        plan,
        status: "pending",
        created_at: new Date().toISOString(),
        user_id: session.user.id,
      };

      // Store in localStorage (simulated persistence)
      const key = `skim_pintar_apps_${session.user.id}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push(application);
      localStorage.setItem(key, JSON.stringify(existing));

      toast.success("Application submitted successfully!");
      navigate("/status");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container max-w-3xl mx-auto flex items-center gap-4 py-4 px-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-heading font-semibold text-foreground">New Application</h1>
            <p className="text-xs text-muted-foreground">Skim Pintar Registration</p>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-6 py-10">
        {/* Step: Start */}
        {step === "start" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Plan Selection */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Choose Your Plan</h2>
              <RadioGroup value={plan} onValueChange={(v) => setPlan(v as "pintar" | "pintar_plus")} className="grid md:grid-cols-2 gap-4">
                <label
                  className={`cursor-pointer bg-card rounded-xl border-2 p-6 shadow-card transition-all ${
                    plan === "pintar" ? "border-primary" : "border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground font-body text-lg">Pintar</h3>
                      <p className="text-2xl font-heading font-bold text-primary">$5<span className="text-sm text-muted-foreground font-body font-normal">/month</span></p>
                    </div>
                    <RadioGroupItem value="pintar" />
                  </div>
                  <p className="text-sm text-muted-foreground">Free funeral services for the donor</p>
                </label>
                <label
                  className={`cursor-pointer bg-card rounded-xl border-2 p-6 shadow-card transition-all ${
                    plan === "pintar_plus" ? "border-primary" : "border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground font-body text-lg">Pintar Plus</h3>
                      <p className="text-2xl font-heading font-bold text-primary">$20<span className="text-sm text-muted-foreground font-body font-normal">/month</span></p>
                    </div>
                    <RadioGroupItem value="pintar_plus" />
                  </div>
                  <p className="text-sm text-muted-foreground">Complimentary funeral services for donor & immediate family</p>
                  <div className="mt-3 px-3 py-1.5 bg-accent/20 rounded-md inline-block">
                    <span className="text-xs font-semibold text-accent-foreground">Recommended</span>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {/* Registration Method */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">How would you like to register?</h2>
              <p className="text-muted-foreground mb-6 text-sm">Use Singpass for faster registration with auto-filled details.</p>
              
              <div className="space-y-3">
                <button
                  onClick={handleSingpass}
                  className="w-full bg-[#F4333D] hover:bg-[#D42A33] text-[#FFFFFF] rounded-xl p-5 flex items-center gap-4 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#FFFFFF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-base">Login with Singpass</p>
                    <p className="text-sm opacity-80">Auto-fill your details with MyInfo</p>
                  </div>
                </button>

                <button
                  onClick={handleManualEntry}
                  className="w-full bg-card border rounded-xl p-5 flex items-center gap-4 hover:shadow-elevated transition-all text-left"
                >
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-foreground text-lg">✏️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Manual Entry</p>
                    <p className="text-sm text-muted-foreground">Fill in your details manually</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step: Singpass Loading */}
        {step === "singpass" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F4333D] flex items-center justify-center mb-6 animate-pulse">
              <Shield className="w-8 h-8 text-[#FFFFFF]" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">Connecting to Singpass</h3>
            <p className="text-muted-foreground text-sm">Retrieving your MyInfo data...</p>
          </motion.div>
        )}

        {/* Step: Form */}
        {step === "form" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground">
                {formData.nric ? "MyInfo data loaded. Please verify your details." : "Please fill in your details below."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Full Name (as in NRIC)</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    className="h-12 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">NRIC Number</Label>
                  <Input
                    value={formData.nric}
                    onChange={(e) => setFormData({ ...formData, nric: e.target.value })}
                    required
                    placeholder="S1234567A"
                    className="h-12 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    required
                    className="h-12 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Phone Number</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="91234567"
                    className="h-12 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="h-12 rounded-lg"
                />
              </div>

              <div className="bg-secondary rounded-xl p-4">
                <p className="text-sm font-semibold text-foreground mb-1 font-body">Selected Plan</p>
                <p className="text-sm text-muted-foreground">
                  {plan === "pintar" ? "Pintar — $5/month" : "Pintar Plus — $20/month"}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep("start")} className="h-12 rounded-lg">
                  Back
                </Button>
                <Button type="submit" disabled={submitting} className="flex-1 h-12 rounded-lg text-base font-semibold">
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ApplyPage;
