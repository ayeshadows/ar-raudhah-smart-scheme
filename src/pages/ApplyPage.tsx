import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, CheckCircle2, Plus, X, CreditCard, AlertTriangle, Save } from "lucide-react";
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

type PaymentCard = {
  id: string;
  card_last4: string;
  card_holder: string;
  card_expiry: string;
};

const ApplyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draft");
  const { t } = useSettings();
  const [step, setStep] = useState<"start" | "singpass" | "form">(draftId ? "form" : "start");
  const [plan, setPlan] = useState<"pintar" | "pintar_plus">("pintar");
  const [donationAmount, setDonationAmount] = useState("");
  const [donationError, setDonationError] = useState("");
  const [formData, setFormData] = useState({
    full_name: "", nric: "", date_of_birth: "", address: "", phone: "", email: ""
  });
  const [familySame, setFamilySame] = useState<string[]>([""]);
  const [familyDiff, setFamilyDiff] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [loadingCards, setLoadingCards] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/auth"); return; }
      fetchCards(session.user.id);
      if (draftId) loadDraft(draftId);
    });
  }, [navigate]);

  const loadDraft = async (id: string) => {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) {
      setFormData({
        full_name: data.full_name || "",
        nric: data.nric || "",
        date_of_birth: data.date_of_birth || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
      });
      setPlan(data.plan as "pintar" | "pintar_plus");
      if (data.payment_card_id) setSelectedCardId(data.payment_card_id);
    }
  };

  const fetchCards = async (userId: string) => {
    const { data, error } = await supabase
      .from("payment_cards")
      .select("id, card_last4, card_holder, card_expiry")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!error && data) {
      setCards(data as PaymentCard[]);
      if (data.length === 1) setSelectedCardId(data[0].id);
    }
    setLoadingCards(false);
  };

  const handleSingpass = () => {
    setStep("singpass");
    setTimeout(() => {
      setFormData(MOCK_MYINFO);
      setStep("form");
      toast.success("MyInfo data retrieved successfully");
    }, 2000);
  };

  const validateDonation = (value: string, selectedPlan: string) => {
    const amount = Number(value);
    if (!value || isNaN(amount)) return t("apply.donationHint." + selectedPlan);
    if (selectedPlan === "pintar" && (amount < 5 || amount > 15)) return t("apply.donationHint.pintar");
    if (selectedPlan === "pintar_plus" && amount < 20) return t("apply.donationHint.pintar_plus");
    return "";
  };

  const handleDonationChange = (value: string) => {
    setDonationAmount(value);
    if (value) setDonationError(validateDonation(value, plan));
    else setDonationError("");
  };

  const handleSaveDraft = async () => {
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const { error } = await supabase.from("applications").insert({
        user_id: session.user.id, full_name: formData.full_name || "Draft", nric: formData.nric || "DRAFT",
        date_of_birth: formData.date_of_birth || null, address: formData.address || null,
        phone: formData.phone || null, email: formData.email || null, plan, status: "draft",
        payment_card_id: selectedCardId || null
      });
      if (error) throw error;
      toast.success("Application saved as draft. You can continue later from your dashboard.");
      navigate("/dashboard");
    } catch (error: any) { toast.error(error.message); } finally { setSubmitting(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateDonation(donationAmount, plan);
    if (error) {
      setDonationError(error);
      toast.error(error);
      return;
    }
    if (!selectedCardId) {
      toast.error("Please select a payment card");
      return;
    }
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const { error } = await supabase.from("applications").insert({
        user_id: session.user.id, full_name: formData.full_name, nric: formData.nric,
        date_of_birth: formData.date_of_birth || null, address: formData.address || null,
        phone: formData.phone || null, email: formData.email || null, plan, status: "pending",
        payment_card_id: selectedCardId
      });
      if (error) throw error;
      toast.success("Application submitted successfully!");
      navigate("/status");
    } catch (error: any) { toast.error(error.message); } finally { setSubmitting(false); }
  };

  const hasCards = cards.length > 0;

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
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Available Plans</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card rounded-xl border-2 border-transparent p-6 shadow-card">
                  <div className="mb-3">
                    <h3 className="font-semibold text-foreground font-body text-lg">{t("plan.pintar")}</h3>
                    <p className="text-2xl font-heading font-bold text-primary">$5-$15<span className="text-sm text-muted-foreground font-body font-normal">/month</span></p>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("plan.pintarDesc")}</p>
                </div>
                <div className="bg-card rounded-xl border-2 border-transparent p-6 shadow-card">
                  <div className="mb-3">
                    <h3 className="font-semibold text-foreground font-body text-lg">{t("plan.pintarPlus")}</h3>
                    <p className="text-2xl font-heading font-bold text-primary">$20+<span className="text-sm text-muted-foreground font-body font-normal">/month</span></p>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("plan.pintarPlusDesc")}</p>
                  <div className="mt-3 px-3 py-1.5 bg-accent/20 rounded-md inline-block">
                    <span className="text-xs font-semibold text-accent-foreground">{t("plan.recommended")}</span>
                  </div>
                </div>
              </div>
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
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t("apply.familySameHousehold")}</Label>
                {familySame.map((name, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={name}
                      onChange={(e) => { const arr = [...familySame]; arr[i] = e.target.value; setFamilySame(arr); }}
                      placeholder={t("apply.familySameHouseholdHint")}
                      className="h-12 rounded-lg"
                    />
                    {familySame.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => setFamilySame(familySame.filter((_, j) => j !== i))} className="h-12 w-12 shrink-0 text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setFamilySame([...familySame, ""])} className="gap-1.5">
                  <Plus className="w-4 h-4" /> {t("apply.addMember")}
                </Button>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t("apply.familyDiffHousehold")}</Label>
                {familyDiff.map((name, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={name}
                      onChange={(e) => { const arr = [...familyDiff]; arr[i] = e.target.value; setFamilyDiff(arr); }}
                      placeholder={t("apply.familyDiffHouseholdHint")}
                      className="h-12 rounded-lg"
                    />
                    {familyDiff.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => setFamilyDiff(familyDiff.filter((_, j) => j !== i))} className="h-12 w-12 shrink-0 text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setFamilyDiff([...familyDiff, ""])} className="gap-1.5">
                  <Plus className="w-4 h-4" /> {t("apply.addMember")}
                </Button>
              </div>
              {/* Plan selector in form */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Selected Plan</Label>
                <RadioGroup value={plan} onValueChange={(v) => { setPlan(v as "pintar" | "pintar_plus"); if (donationAmount) setDonationError(validateDonation(donationAmount, v)); }} className="grid grid-cols-2 gap-3">
                  <label className={`cursor-pointer bg-card rounded-xl border-2 p-4 shadow-card transition-all ${plan === "pintar" ? "border-primary" : "border-transparent"}`}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="pintar" />
                      <div>
                        <p className="font-semibold text-foreground text-sm">{t("plan.pintar")}</p>
                        <p className="text-xs text-muted-foreground">$5-$15/month</p>
                      </div>
                    </div>
                  </label>
                  <label className={`cursor-pointer bg-card rounded-xl border-2 p-4 shadow-card transition-all ${plan === "pintar_plus" ? "border-primary" : "border-transparent"}`}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="pintar_plus" />
                      <div>
                        <p className="font-semibold text-foreground text-sm">{t("plan.pintarPlus")}</p>
                        <p className="text-xs text-muted-foreground">$20+/month</p>
                      </div>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t("apply.donationAmount")}</Label>
                <Input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => handleDonationChange(e.target.value)}
                  required
                  step="1"
                  placeholder={plan === "pintar" ? "$5 - $15" : "$20+"}
                  className={`h-12 rounded-lg ${donationError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {donationError ? (
                  <p className="text-xs text-destructive font-medium">{donationError}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {plan === "pintar" ? t("apply.donationHint.pintar") : t("apply.donationHint.pintar_plus")}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Payment Card</Label>
                {loadingCards ? (
                  <div className="text-sm text-muted-foreground animate-pulse">Loading cards...</div>
                ) : hasCards ? (
                  <RadioGroup value={selectedCardId} onValueChange={setSelectedCardId} className="space-y-2">
                    {cards.map((card) => (
                      <label
                        key={card.id}
                        className={`cursor-pointer flex items-center gap-4 bg-card rounded-xl border-2 p-4 shadow-card transition-all ${selectedCardId === card.id ? "border-primary" : "border-transparent"}`}
                      >
                        <RadioGroupItem value={card.id} />
                        <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground font-body text-sm">•••• •••• •••• {card.card_last4}</p>
                          <p className="text-xs text-muted-foreground">{card.card_holder} · Exp {card.card_expiry}</p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">No payment card registered</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You need to set up a payment card before submitting. You can save your application as a draft and set up a card first.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep("start")} className="h-12 rounded-lg">{t("apply.back")}</Button>
                <Button type="button" variant="secondary" onClick={handleSaveDraft} disabled={submitting} className="h-12 rounded-lg gap-2">
                  <Save className="w-4 h-4" /> Save Draft
                </Button>
                {hasCards ? (
                  <Button type="submit" disabled={submitting || !selectedCardId} className="flex-1 h-12 rounded-lg text-base font-semibold">
                    {submitting ? t("apply.submitting") : t("apply.submit")}
                  </Button>
                ) : (
                  <Button type="button" onClick={() => { handleSaveDraft(); }} disabled={submitting} className="flex-1 h-12 rounded-lg text-base font-semibold">
                    {submitting ? "Saving..." : "Save & Set Up Card"}
                  </Button>
                )}
              </div>
            </form>
          </motion.div>
        }
      </main>
    </div>);

};

export default ApplyPage;
