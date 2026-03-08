import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-8 relative">
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
  );
};

export default AuthPage;
