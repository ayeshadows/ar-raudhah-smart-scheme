import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useSettings } from "@/contexts/SettingsContext";

const MOCK_MYINFO = {
  full_name: "Ahmad bin Abdullah",
  nric: "S9012345A",
  date_of_birth: "1990-03-15",
  address: "Blk 123 Bishan Street 12, #08-456, Singapore 570123",
  phone: "91234567",
  email: "ahmad.abdullah@email.com"
};

const ApplyPage = () => {
  const navigate = useNavigate();
  const { t } = useSettings();
  const [step, setStep] = useState<"start" | "singpass" | "form">("start");
  const [plan, setPlan] = useState<"pintar" | "pintar_plus">("pintar");
  const [formData, setFormData] = useState({
    full_name: "", nric: "", date_of_birth: "", address: "", phone: "", email: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
    });
  }, [navigate]);

  const handleSingpass = () => {
    setStep("singpass");
    setTimeout(() => {
      setFormData(MOCK_MYINFO);
      setStep("form");
      toast.success("MyInfo data retrieved successfully");
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const { error } = await supabase.from("applications").insert({
        user_id: session.user.id, full_name: formData.full_name, nric: formData.nric,
        date_of_birth: formData.date_of_birth || null, address: formData.address || null,
        phone: formData.phone || null, email: formData.email || null, plan, status: "pending"
      });
      if (error) throw error;
      toast.success("Application submitted successfully!");
      navigate("/status");
    } catch (error: any) {toast.error(error.message);} finally
    {setSubmitting(false);}
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-card">
        <div className="container max-w-3xl mx-auto flex items-center gap-4 py-4 px-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-heading font-semibold text-foreground">{t("apply.title")}</h1>
            <p className="text-xs text-muted-foreground">{t("apply.subtitle")}</p>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-6 py-10">
        {step === "start" &&
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">{t("apply.choosePlan")}</h2>
              <RadioGroup value={plan} onValueChange={(v) => setPlan(v as "pintar" | "pintar_plus")} className="grid md:grid-cols-2 gap-4">
                <label className={`cursor-pointer bg-card rounded-xl border-2 p-6 shadow-card transition-all ${plan === "pintar" ? "border-primary" : "border-transparent"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground font-body text-lg">{t("plan.pintar")}</h3>
                      <p className="text-2xl font-heading font-bold text-primary">$5-$15/month<span className="text-sm text-muted-foreground font-body font-normal">/month</span></p>
                    </div>
                    <RadioGroupItem value="pintar" />
                  </div>
                  <p className="text-sm text-muted-foreground">{t("plan.pintarDesc")}</p>
                </label>
                <label className={`cursor-pointer bg-card rounded-xl border-2 p-6 shadow-card transition-all ${plan === "pintar_plus" ? "border-primary" : "border-transparent"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground font-body text-lg">{t("plan.pintarPlus")}</h3>
                      <p className="text-2xl font-heading font-bold text-primary">$20+/month
                      <span className="text-sm text-muted-foreground font-body font-normal">/month</span></p>
                    </div>
                    <RadioGroupItem value="pintar_plus" />
                  </div>
                  <p className="text-sm text-muted-foreground">{t("plan.pintarPlusDesc")}</p>
                  <div className="mt-3 px-3 py-1.5 bg-accent/20 rounded-md inline-block">
                    <span className="text-xs font-semibold text-accent-foreground">{t("plan.recommended")}</span>
                  </div>
                </label>
              </RadioGroup>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">{t("apply.howRegister")}</h2>
              <p className="text-muted-foreground mb-6 text-sm">{t("apply.singpassDesc")}</p>
              <div className="space-y-3">
                <button onClick={handleSingpass} className="w-full bg-[#F4333D] hover:bg-[#D42A33] text-[#FFFFFF] rounded-xl p-5 flex items-center gap-4 transition-colors">
                  <div className="w-12 h-12 bg-[#FFFFFF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-base">{t("apply.loginSingpass")}</p>
                    <p className="text-sm opacity-80">{t("apply.autoFill")}</p>
                  </div>
                </button>
                <button onClick={() => setStep("form")} className="w-full bg-card border rounded-xl p-5 flex items-center gap-4 hover:shadow-elevated transition-all text-left">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-foreground text-lg">✏️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t("apply.manualEntry")}</p>
                    <p className="text-sm text-muted-foreground">{t("apply.manualDesc")}</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>}

        {step === "singpass" &&
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[#F4333D] flex items-center justify-center mb-6 animate-pulse">
              <Shield className="w-8 h-8 text-[#FFFFFF]" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">{t("apply.connectingSingpass")}</h3>
            <p className="text-muted-foreground text-sm">{t("apply.retrievingData")}</p>
          </motion.div>
        }

        {step === "form" &&
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground">
                {formData.nric ? t("apply.myInfoLoaded") : t("apply.fillDetails")}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("apply.fullName")}</Label>
                  <Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required className="h-12 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("apply.nric")}</Label>
                  <Input value={formData.nric} onChange={(e) => setFormData({ ...formData, nric: e.target.value })} required placeholder="S1234567A" className="h-12 rounded-lg" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("apply.dob")}</Label>
                  <Input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} required className="h-12 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("apply.phone")}</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required placeholder="91234567" className="h-12 rounded-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t("apply.email")}</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="h-12 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t("apply.address")}</Label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required className="h-12 rounded-lg" />
              </div>
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-sm font-semibold text-foreground mb-1 font-body">{t("apply.selectedPlan")}</p>
                <p className="text-sm text-muted-foreground">
                  {plan === "pintar" ? t("plan.pintarPrice") : t("plan.pintarPlusPrice")}
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep("start")} className="h-12 rounded-lg">{t("apply.back")}</Button>
                <Button type="submit" disabled={submitting} className="flex-1 h-12 rounded-lg text-base font-semibold">
                  {submitting ? t("apply.submitting") : t("apply.submit")}
                </Button>
              </div>
            </form>
          </motion.div>
        }
      </main>
    </div>);

};

export default ApplyPage;