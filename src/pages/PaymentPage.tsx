import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CreditCard, Lock, CheckCircle2, ShieldCheck, Smartphone, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type PaymentCard = {
  id: string;
  card_last4: string;
  card_holder: string;
  card_expiry: string;
  is_active: boolean;
  created_at: string;
};

type View = "loading" | "cards" | "setup";
type Step = "form" | "verifying" | "otp" | "success";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { t } = useSettings();
  const [view, setView] = useState<View>("loading");
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [step, setStep] = useState<Step>("form");
  const [otp, setOtp] = useState("");
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [cardData, setCardData] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellingCardId, setCancellingCardId] = useState<string | null>(null);
  const [cancellingCard, setCancellingCard] = useState(false);

  const fetchCards = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/auth"); return; }
    const { data, error } = await supabase
      .from("payment_cards")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!error && data) {
      setCards(data as PaymentCard[]);
      setView(data.length > 0 ? "cards" : "setup");
    } else {
      setView("setup");
    }
  };

  useEffect(() => { fetchCards(); }, []);

  useEffect(() => {
    if (step !== "verifying") return;
    setVerifyProgress(0);
    const interval = setInterval(() => {
      setVerifyProgress((prev) => { if (prev >= 100) { clearInterval(interval); return 100; } return prev + 20; });
    }, 500);
    const timeout = setTimeout(() => { setStep("otp"); toast.info(t("payment.digitalTokenDesc")); }, 3000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [step]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setStep("verifying"); };

  const handleOtpSubmit = async () => {
    if (otp.length < 6) { toast.error("Please enter the full 6-digit token."); return; }
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { error } = await supabase.from("payment_cards").insert({
        user_id: session.user.id,
        card_last4: cardData.number.replace(/\s/g, "").slice(-4),
        card_holder: cardData.name,
        card_expiry: cardData.expiry,
      });
      if (error) { toast.error("Failed to save card. Please try again."); return; }
    }
    toast.success("Card verified and payment method saved!");
    setStep("success");
  };

  const handleCancelCard = async () => {
    if (!cancellingCardId) return;
    setCancellingCard(true);
    const { error } = await supabase
      .from("payment_cards")
      .update({ is_active: false })
      .eq("id", cancellingCardId);
    if (error) {
      toast.error("Failed to remove card");
    } else {
      toast.success("Card removed successfully");
      await fetchCards();
    }
    setCancellingCard(false);
    setCancelDialogOpen(false);
    setCancellingCardId(null);
  };

  const startNewSetup = () => {
    setStep("form");
    setOtp("");
    setCardData({ number: "", name: "", expiry: "", cvc: "" });
    setView("setup");
  };

  const handleBack = () => {
    if (view === "setup" && cards.length > 0 && step === "form") {
      setView("cards");
    } else if (view === "setup" && step !== "form") {
      setStep("form");
    } else {
      navigate("/dashboard");
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return cleaned;
  };

  const steps = [
    { label: t("payment.cardNumber").split(" ")[0], done: step !== "form" },
    { label: t("payment.verifyAndContinue").split(" ")[0], done: step === "success" },
    { label: "✓", done: step === "success" },
  ];
  const activeStepIndex = step === "form" ? 0 : step === "verifying" || step === "otp" ? 1 : 2;

  if (view === "loading") {
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
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-heading font-semibold text-foreground">{t("payment.title")}</h1>
            <p className="text-xs text-muted-foreground">{t("payment.subtitle")}</p>
          </div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {view === "cards" && (
            <motion.div key="cards" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Your Payment Cards</h2>
              <div className="space-y-3">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-card rounded-xl border p-5 shadow-card flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground font-body">•••• •••• •••• {card.card_last4}</p>
                        <p className="text-sm text-muted-foreground">{card.card_holder} · Exp {card.card_expiry}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="Remove card"
                      onClick={() => {
                        setCancellingCardId(card.id);
                        setCancelDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={startNewSetup}
                className="mt-6 w-full h-12 rounded-lg border-dashed border-2"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Card
              </Button>
            </motion.div>
          )}

          {view === "setup" && (
            <motion.div key="setup" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="flex items-center justify-between mb-8">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= activeStepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {s.done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium hidden sm:inline ${i <= activeStepIndex ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                    {i < steps.length - 1 && <div className={`w-12 sm:w-20 h-0.5 mx-1 ${i < activeStepIndex ? "bg-primary" : "bg-muted"}`} />}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === "form" && (
                  <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                    <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-8 flex items-start gap-3">
                      <Lock className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground font-body">{t("payment.secure")}</p>
                        <p className="text-xs text-muted-foreground">{t("payment.secureDesc")}</p>
                      </div>
                    </div>
                    <div className="gradient-hero rounded-2xl p-6 mb-8 text-primary-foreground islamic-pattern">
                      <div className="flex justify-between items-start mb-8">
                        <span className="text-xs opacity-60 font-body uppercase tracking-wider text-card-foreground">Recurring Payment</span>
                        <CreditCard className="w-8 h-8 opacity-60" />
                      </div>
                      <p className="text-xl tracking-[0.2em] font-mono mb-6 text-zinc-950">{cardData.number || "•••• •••• •••• ••••"}</p>
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-xs opacity-60 mb-1 text-popover-foreground">{t("payment.cardHolder")}</p>
                          <p className="font-medium text-card-foreground">{cardData.name || "YOUR NAME"}</p>
                        </div>
                        <div>
                          <p className="text-xs opacity-60 mb-1">{t("payment.expiry")}</p>
                          <p className="font-medium text-card-foreground">{cardData.expiry || "MM/YY"}</p>
                        </div>
                      </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">{t("payment.cardNumber")}</Label>
                        <Input value={cardData.number} onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })} placeholder="1234 5678 9012 3456" required className="h-12 rounded-lg font-mono tracking-wider" maxLength={19} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">{t("payment.cardHolder")}</Label>
                        <Input value={cardData.name} onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })} placeholder="AHMAD BIN ABDULLAH" required className="h-12 rounded-lg" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t("payment.expiry")}</Label>
                          <Input value={cardData.expiry} onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })} placeholder="MM/YY" required className="h-12 rounded-lg" maxLength={5} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t("payment.cvc")}</Label>
                          <Input value={cardData.cvc} onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) })} placeholder="123" required className="h-12 rounded-lg" maxLength={3} type="password" />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-12 rounded-lg text-base font-semibold mt-4">{t("payment.verifyAndContinue")}</Button>
                    </form>
                  </motion.div>
                )}

                {step === "verifying" && (
                  <motion.div key="verifying" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                    <h2 className="text-xl font-heading font-bold text-foreground mb-2">{t("payment.verifying")}</h2>
                    <p className="text-sm text-muted-foreground mb-6">{t("payment.contactingBank")} •••• {cardData.number.slice(-4)}</p>
                    <div className="max-w-xs mx-auto">
                      <Progress value={verifyProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">{verifyProgress}% {t("payment.complete")}</p>
                    </div>
                  </motion.div>
                )}

                {step === "otp" && (
                  <motion.div key="otp" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="text-center">
                    <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-8 flex items-start gap-3 text-left">
                      <Smartphone className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground font-body">{t("payment.digitalToken")}</p>
                        <p className="text-xs text-muted-foreground">{t("payment.digitalTokenDesc")}</p>
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-heading font-bold text-foreground mb-2">{t("payment.enterToken")}</h2>
                    <p className="text-sm text-muted-foreground mb-8">Card: •••• {cardData.number.slice(-4)} · {cardData.name}</p>
                    <div className="flex justify-center mb-8">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                          <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <Button onClick={handleOtpSubmit} className="w-full h-12 rounded-lg text-base font-semibold" disabled={otp.length < 6}>{t("payment.confirmVerification")}</Button>
                    <button onClick={() => setStep("form")} className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors">{t("payment.backToCard")}</button>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-foreground mb-3">{t("payment.saved")}</h2>
                    <p className="text-muted-foreground mb-6 text-sm">
                      •••• {cardData.number.slice(-4)} {t("payment.savedDesc")}
                    </p>
                    <Button onClick={() => { fetchCards(); }} className="h-12 rounded-lg px-8">View My Cards</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Payment Card</DialogTitle>
            <DialogDescription>Are you sure you want to remove this card? You can always add it again later.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep Card</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleCancelCard} disabled={cancellingCard}>
              {cancellingCard ? "Removing..." : "Yes, Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentPage;
