import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated — no real payment processing
    setSubmitted(true);
    toast.success("Payment method saved successfully!");
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md">
          
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-3">Payment Method Saved</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Your card ending in {cardData.number.slice(-4)} will be charged monthly for your Skim Pintar subscription.
          </p>
          <Button onClick={() => navigate("/dashboard")} className="h-12 rounded-lg px-8">
            Back to Dashboard
          </Button>
        </motion.div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-card">
        <div className="container max-w-3xl mx-auto flex items-center gap-4 py-4 px-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-heading font-semibold text-foreground">Payment Setup</h1>
            <p className="text-xs text-muted-foreground">Set up recurring card payment</p>
          </div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Info banner */}
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-8 flex items-start gap-3">
            <Lock className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground font-body">Secure Payment</p>
              <p className="text-xs text-muted-foreground">
                Your card details are encrypted. Monthly deductions replace the old GIRO system for faster, more convenient payments.
              </p>
            </div>
          </div>

          {/* Card Preview */}
          <div className="gradient-hero rounded-2xl p-6 mb-8 text-primary-foreground islamic-pattern">
            <div className="flex justify-between items-start mb-8">
              <span className="text-xs opacity-60 font-body uppercase tracking-wider text-card-foreground">Recurring Payment</span>
              <CreditCard className="w-8 h-8 opacity-60" />
            </div>
            <p className="text-xl tracking-[0.2em] font-mono mb-6 text-zinc-950">
              {cardData.number || "•••• •••• •••• ••••"}
            </p>
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-xs opacity-60 mb-1 text-popover-foreground">Card Holder</p>
                <p className="font-medium">{cardData.name || "YOUR NAME"}</p>
              </div>
              <div>
                <p className="text-xs opacity-60 mb-1">Expires</p>
                <p className="font-medium">{cardData.expiry || "MM/YY"}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Card Number</Label>
              <Input
                value={cardData.number}
                onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                placeholder="1234 5678 9012 3456"
                required
                className="h-12 rounded-lg font-mono tracking-wider"
                maxLength={19} />
              
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Cardholder Name</Label>
              <Input
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                placeholder="AHMAD BIN ABDULLAH"
                required
                className="h-12 rounded-lg" />
              
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Expiry Date</Label>
                <Input
                  value={cardData.expiry}
                  onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                  placeholder="MM/YY"
                  required
                  className="h-12 rounded-lg"
                  maxLength={5} />
                
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">CVC</Label>
                <Input
                  value={cardData.cvc}
                  onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                  placeholder="123"
                  required
                  className="h-12 rounded-lg"
                  maxLength={3}
                  type="password" />
                
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-lg text-base font-semibold mt-4">
              Save Payment Method
            </Button>
          </form>
        </motion.div>
      </main>
    </div>);

};

export default PaymentPage;