import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowLeft, Moon, Sun, Type, Globe, Bell, Eye } from "lucide-react";
import { useSettings, type Language, type FontSize } from "@/contexts/SettingsContext";
import { toast } from "sonner";

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

  const handleToggle = (key: "darkMode" | "notifications" | "highContrast") => {
    updateSettings({ [key]: !settings[key] });
    toast.success(t("settings.saved"));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container max-w-5xl mx-auto flex items-center gap-4 py-4 px-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-heading font-semibold text-foreground">{t("settings.title")}</h1>
            <p className="text-xs text-muted-foreground">{t("settings.subtitle")}</p>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-6 py-10 space-y-6">
        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border p-6 shadow-card"
        >
          <h2 className="text-lg font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
            {settings.darkMode ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-accent" />}
            {t("settings.appearance")}
          </h2>

          <div className="space-y-6">
            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold text-foreground">{t("settings.darkMode")}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{t("settings.darkModeDesc")}</p>
              </div>
              <Switch checked={settings.darkMode} onCheckedChange={() => handleToggle("darkMode")} />
            </div>

            {/* Font Size */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Type className="w-4 h-4 text-muted-foreground" />
                  {t("settings.fontSize")}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">{t("settings.fontSizeDesc")}</p>
              </div>
              <div className="flex gap-1">
                {FONT_SIZES.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => {
                      updateSettings({ fontSize: size.value });
                      toast.success(t("settings.saved"));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      settings.fontSize === size.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {t(size.label)}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  {t("settings.highContrast")}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">{t("settings.highContrastDesc")}</p>
              </div>
              <Switch checked={settings.highContrast} onCheckedChange={() => handleToggle("highContrast")} />
            </div>
          </div>
        </motion.div>

        {/* Language Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border p-6 shadow-card"
        >
          <h2 className="text-lg font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" />
            {t("settings.language")}
          </h2>

          <div>
            <Label className="text-sm font-semibold text-foreground">{t("settings.languageLabel")}</Label>
            <p className="text-xs text-muted-foreground mt-0.5 mb-3">{t("settings.languageDesc")}</p>
            <Select
              value={settings.language}
              onValueChange={(value: Language) => {
                updateSettings({ language: value });
                toast.success(t("settings.saved"));
              }}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <span className="flex items-center gap-2">
                      {lang.native}
                      {lang.native !== lang.label && (
                        <span className="text-muted-foreground text-xs">({lang.label})</span>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border p-6 shadow-card"
        >
          <h2 className="text-lg font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            {t("settings.notifications")}
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-semibold text-foreground">{t("settings.notificationsLabel")}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">{t("settings.notificationsDesc")}</p>
            </div>
            <Switch checked={settings.notifications} onCheckedChange={() => handleToggle("notifications")} />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage;
