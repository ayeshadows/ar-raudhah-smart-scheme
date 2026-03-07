import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Settings, ArrowLeft } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Account created! Please check your email to verify.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero islamic-pattern items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md"
        >
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center mb-6">
              <span className="text-2xl font-heading font-bold text-primary">AR</span>
            </div>
            <h1 className="text-4xl font-heading font-bold text-primary-foreground mb-4">Skim Pintar</h1>
            <p className="text-lg text-primary-foreground/80 font-body">
              Masjid Ar-Raudhah's monthly donation scheme — now fully digital with easy card payments and real-time
              tracking.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { title: "Singpass Verified", desc: "Quick registration with MyInfo" },
              { title: "Card Payments", desc: "Recurring debit/credit card deductions" },
              { title: "Track Status", desc: "Monitor your application in real-time" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-primary-foreground/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary-foreground text-sm">{item.title}</p>
                  <p className="text-primary-foreground/60 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel - form */}
      <div className="relative flex-1 flex items-center justify-center p-8">
        <div className="absolute left-6 top-6 z-10">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
            aria-label="Go back"
            title="Back"
            className="h-10 w-10 rounded-full border-border bg-card/90 text-foreground shadow-card hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => navigate("/settings")}
          aria-label="Open settings"
          title="Settings"
          className="absolute right-6 top-6 z-10 h-10 w-10 rounded-full border-border bg-card/90 text-foreground shadow-card hover:bg-secondary"
        >
          <Settings className="h-5 w-5" />
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4">
              <img
                src="/araudhah_logo.jpg"
                alt="Masjid Ar-Raudhah Logo"
                className="w-10 h-10 rounded-lg object-contain"
              />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Skim Pintar</h1>
          </div>

          <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
            {isLogin ? t("auth.welcomeBack") : t("auth.createAccount")}
          </h2>
          <p className="text-muted-foreground mb-8 font-body text-sm">
            {isLogin ? t("auth.signInSubtitle") : t("auth.signUpSubtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  {t("auth.fullName")}
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ahmad bin Abdullah"
                  required={!isLogin}
                  className="h-12 rounded-lg"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {t("auth.email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                {t("auth.password")}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="h-12 rounded-lg"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-lg text-base font-semibold">
              {loading ? t("auth.pleaseWait") : isLogin ? t("auth.signIn") : t("auth.signUp")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-semibold hover:underline">
              {isLogin ? t("auth.switchSignUp") : t("auth.switchSignIn")}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
