import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { ArrowLeft, Moon, Sun, Type, Globe, Bell, Eye, Trash2, Lock, Eye as EyeIcon, EyeOff } from "lucide-react";
import { useSettings, type Language, type FontSize } from "@/contexts/SettingsContext";
import { toast } from "sonner";
import { useState } from "react";

const LANGUAGES: { value: Language; label: string; native: string }[] = [
  { value: "en", label: "English", native: "English" },
  { value: "ms", label: "Bahasa Melayu", native: "Bahasa Melayu" },
  { value: "ta", label: "Tamil", native: "தமிழ்" },
  { value: "zh", label: "Chinese", native: "中文" },
];

const FONT_SIZES: { value: FontSize; label: string }[] = [
  { value: "small", label: "font.small" },
  { value: "medium", label: "font.medium" },
  { value: "large", label: "font.large" },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, t } = useSettings();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleToggle = (key: "darkMode" | "notifications" | "highContrast") => {
    updateSettings({ [key]: !settings[key] });
    toast.success(t("settings.saved"));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error(t("settings.passwordTooShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("settings.passwordMismatch"));
      return;
    }
    setChangingPassword(true);
    try {
      // Verify current password by re-authenticating
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("No user found");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInError) {
        toast.error(t("settings.wrongPassword"));
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast.success(t("settings.passwordChanged"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await supabase.auth.signOut();
      toast.success("Your account has been scheduled for deletion. You have been logged out.");
      navigate("/");
    } catch { toast.error("Failed to process account deletion request."); }
    finally { setDeleting(false); setDeleteDialogOpen(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-card">
        <div className="container max-w-5xl mx-auto flex items-center gap-4 py-4 px-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-heading font-semibold text-foreground">{t("settings.title")}</h1>
            <p className="text-xs text-muted-foreground">{t("settings.subtitle")}</p>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-6 py-10 space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border p-6 shadow-card">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
            {settings.darkMode ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-accent" />}
            {t("settings.appearance")}
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold text-foreground">{t("settings.darkMode")}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{t("settings.darkModeDesc")}</p>
              </div>
              <Switch checked={settings.darkMode} onCheckedChange={() => handleToggle("darkMode")} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Type className="w-4 h-4 text-muted-foreground" /> {t("settings.fontSize")}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">{t("settings.fontSizeDesc")}</p>
              </div>
              <div className="flex gap-1">
                {FONT_SIZES.map((size) => (
                  <button key={size.value} onClick={() => { updateSettings({ fontSize: size.value }); toast.success(t("settings.saved")); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${settings.fontSize === size.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                    {t(size.label)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" /> {t("settings.highContrast")}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">{t("settings.highContrastDesc")}</p>
              </div>
              <Switch checked={settings.highContrast} onCheckedChange={() => handleToggle("highContrast")} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border p-6 shadow-card">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" /> {t("settings.language")}
          </h2>
          <div>
            <Label className="text-sm font-semibold text-foreground">{t("settings.languageLabel")}</Label>
            <p className="text-xs text-muted-foreground mt-0.5 mb-3">{t("settings.languageDesc")}</p>
            <Select value={settings.language} onValueChange={(value: Language) => { updateSettings({ language: value }); toast.success(t("settings.saved")); }}>
              <SelectTrigger className="w-full max-w-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <span className="flex items-center gap-2">
                      {lang.native}
                      {lang.native !== lang.label && <span className="text-muted-foreground text-xs">({lang.label})</span>}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border p-6 shadow-card">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" /> {t("settings.notifications")}
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-semibold text-foreground">{t("settings.notificationsLabel")}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">{t("settings.notificationsDesc")}</p>
            </div>
            <Switch checked={settings.notifications} onCheckedChange={() => handleToggle("notifications")} />
          </div>
        </motion.div>

        {/* Change Password Section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-xl border p-6 shadow-card">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" /> {t("settings.changePassword")}
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-semibold text-foreground">
                {t("settings.currentPassword")}
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPw ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showCurrentPw ? <EyeIcon className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-semibold text-foreground">
                {t("settings.newPassword")}
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showNewPw ? <EyeIcon className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                {t("settings.confirmNewPassword")}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirmPw ? <EyeIcon className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}>
              <Lock className="w-4 h-4 mr-2" />
              {changingPassword ? t("settings.updating") : t("settings.updatePassword")}
            </Button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-destructive/30 p-6 shadow-card">
          <h2 className="text-lg font-heading font-semibold text-destructive mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5" /> {t("settings.dangerZone")}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{t("settings.deleteAccountDesc")}</p>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="w-4 h-4 mr-2" /> {t("settings.deleteAccount")}
          </Button>
        </motion.div>
      </main>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings.deleteAccount")}</DialogTitle>
            <DialogDescription>{t("settings.deleteConfirm")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">{t("settings.cancel")}</Button></DialogClose>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
              {deleting ? t("settings.deleting") : t("settings.yesDelete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
