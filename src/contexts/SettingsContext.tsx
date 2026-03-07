import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "ms" | "ta" | "zh";
export type FontSize = "small" | "medium" | "large";

interface Settings {
  language: Language;
  fontSize: FontSize;
  darkMode: boolean;
  notifications: boolean;
  highContrast: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  t: (key: string) => string;
}

const DEFAULT_SETTINGS: Settings = {
  language: "en",
  fontSize: "medium",
  darkMode: false,
  notifications: true,
  highContrast: false,
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "nav.newApplication": "New Application",
    "nav.paymentSetup": "Payment Setup",
    "nav.trackStatus": "Track Status",
    "dashboard.welcome": "Assalamualaikum",
    "dashboard.subtitle": "Manage your Skim Pintar membership and applications.",
    "dashboard.yourApplications": "Your Applications",
    "dashboard.noApplications": "No applications yet",
    "dashboard.applyNow": "Apply Now",
    "dashboard.aboutSkimPintar": "About Skim Pintar",
    "dashboard.applyViaSingpass": "Apply via Singpass",
    "dashboard.setUpCard": "Set up card deductions",
    "dashboard.viewStatus": "View application status",
    "settings.title": "Settings",
    "settings.subtitle": "Customise your experience",
    "settings.appearance": "Appearance",
    "settings.darkMode": "Dark Mode",
    "settings.darkModeDesc": "Switch between light and dark themes",
    "settings.fontSize": "Font Size",
    "settings.fontSizeDesc": "Adjust text size for readability",
    "settings.highContrast": "High Contrast",
    "settings.highContrastDesc": "Increase contrast for better visibility",
    "settings.language": "Language",
    "settings.languageLabel": "Display Language",
    "settings.languageDesc": "Choose your preferred language",
    "settings.notifications": "Notifications",
    "settings.notificationsLabel": "Email Notifications",
    "settings.notificationsDesc": "Receive updates on your application status",
    "settings.saved": "Settings saved",
    "font.small": "Small",
    "font.medium": "Medium",
    "font.large": "Large",
  },
  ms: {
    "nav.dashboard": "Papan Pemuka",
    "nav.settings": "Tetapan",
    "nav.logout": "Log Keluar",
    "nav.newApplication": "Permohonan Baru",
    "nav.paymentSetup": "Tetapan Bayaran",
    "nav.trackStatus": "Jejak Status",
    "dashboard.welcome": "Assalamualaikum",
    "dashboard.subtitle": "Urus keahlian dan permohonan Skim Pintar anda.",
    "dashboard.yourApplications": "Permohonan Anda",
    "dashboard.noApplications": "Tiada permohonan lagi",
    "dashboard.applyNow": "Mohon Sekarang",
    "dashboard.aboutSkimPintar": "Tentang Skim Pintar",
    "dashboard.applyViaSingpass": "Mohon melalui Singpass",
    "dashboard.setUpCard": "Tetapkan potongan kad",
    "dashboard.viewStatus": "Lihat status permohonan",
    "settings.title": "Tetapan",
    "settings.subtitle": "Sesuaikan pengalaman anda",
    "settings.appearance": "Penampilan",
    "settings.darkMode": "Mod Gelap",
    "settings.darkModeDesc": "Tukar antara tema cerah dan gelap",
    "settings.fontSize": "Saiz Font",
    "settings.fontSizeDesc": "Laras saiz teks untuk kebolehbacaan",
    "settings.highContrast": "Kontras Tinggi",
    "settings.highContrastDesc": "Tingkatkan kontras untuk keterlihatan lebih baik",
    "settings.language": "Bahasa",
    "settings.languageLabel": "Bahasa Paparan",
    "settings.languageDesc": "Pilih bahasa pilihan anda",
    "settings.notifications": "Pemberitahuan",
    "settings.notificationsLabel": "Pemberitahuan E-mel",
    "settings.notificationsDesc": "Terima kemas kini tentang status permohonan anda",
    "settings.saved": "Tetapan disimpan",
    "font.small": "Kecil",
    "font.medium": "Sederhana",
    "font.large": "Besar",
  },
  ta: {
    "nav.dashboard": "டாஷ்போர்டு",
    "nav.settings": "அமைப்புகள்",
    "nav.logout": "வெளியேறு",
    "nav.newApplication": "புதிய விண்ணப்பம்",
    "nav.paymentSetup": "கட்டண அமைப்பு",
    "nav.trackStatus": "நிலை கண்காணிப்பு",
    "dashboard.welcome": "அஸ்ஸலாமுஅலைக்கும்",
    "dashboard.subtitle": "உங்கள் ஸ்கிம் பிண்டார் உறுப்பினர் மற்றும் விண்ணப்பங்களை நிர்வகிக்கவும்.",
    "dashboard.yourApplications": "உங்கள் விண்ணப்பங்கள்",
    "dashboard.noApplications": "இன்னும் விண்ணப்பங்கள் இல்லை",
    "dashboard.applyNow": "இப்போது விண்ணப்பிக்கவும்",
    "dashboard.aboutSkimPintar": "ஸ்கிம் பிண்டார் பற்றி",
    "dashboard.applyViaSingpass": "Singpass மூலம் விண்ணப்பிக்கவும்",
    "dashboard.setUpCard": "அட்டை கழிப்புகளை அமைக்கவும்",
    "dashboard.viewStatus": "விண்ணப்ப நிலையைக் காணவும்",
    "settings.title": "அமைப்புகள்",
    "settings.subtitle": "உங்கள் அனுபவத்தைத் தனிப்பயனாக்கவும்",
    "settings.appearance": "தோற்றம்",
    "settings.darkMode": "இருண்ட பயன்முறை",
    "settings.darkModeDesc": "ஒளி மற்றும் இருண்ட தீம்களுக்கு இடையே மாறவும்",
    "settings.fontSize": "எழுத்துரு அளவு",
    "settings.fontSizeDesc": "வாசிப்புத்திறனுக்காக உரை அளவை சரிசெய்யவும்",
    "settings.highContrast": "அதிக மாறுபாடு",
    "settings.highContrastDesc": "சிறந்த தெரிவுநிலைக்கு மாறுபாட்டை அதிகரிக்கவும்",
    "settings.language": "மொழி",
    "settings.languageLabel": "காட்சி மொழி",
    "settings.languageDesc": "உங்கள் விருப்பமான மொழியை தேர்ந்தெடுக்கவும்",
    "settings.notifications": "அறிவிப்புகள்",
    "settings.notificationsLabel": "மின்னஞ்சல் அறிவிப்புகள்",
    "settings.notificationsDesc": "உங்கள் விண்ணப்ப நிலை குறித்த புதுப்பிப்புகளைப் பெறவும்",
    "settings.saved": "அமைப்புகள் சேமிக்கப்பட்டன",
    "font.small": "சிறிய",
    "font.medium": "நடுத்தர",
    "font.large": "பெரிய",
  },
  zh: {
    "nav.dashboard": "仪表板",
    "nav.settings": "设置",
    "nav.logout": "退出",
    "nav.newApplication": "新申请",
    "nav.paymentSetup": "付款设置",
    "nav.trackStatus": "跟踪状态",
    "dashboard.welcome": "Assalamualaikum",
    "dashboard.subtitle": "管理您的 Skim Pintar 会员资格和申请。",
    "dashboard.yourApplications": "您的申请",
    "dashboard.noApplications": "暂无申请",
    "dashboard.applyNow": "立即申请",
    "dashboard.aboutSkimPintar": "关于 Skim Pintar",
    "dashboard.applyViaSingpass": "通过 Singpass 申请",
    "dashboard.setUpCard": "设置卡扣款",
    "dashboard.viewStatus": "查看申请状态",
    "settings.title": "设置",
    "settings.subtitle": "自定义您的体验",
    "settings.appearance": "外观",
    "settings.darkMode": "深色模式",
    "settings.darkModeDesc": "在浅色和深色主题之间切换",
    "settings.fontSize": "字体大小",
    "settings.fontSizeDesc": "调整文字大小以提高可读性",
    "settings.highContrast": "高对比度",
    "settings.highContrastDesc": "增加对比度以提高可见性",
    "settings.language": "语言",
    "settings.languageLabel": "显示语言",
    "settings.languageDesc": "选择您的首选语言",
    "settings.notifications": "通知",
    "settings.notificationsLabel": "电子邮件通知",
    "settings.notificationsDesc": "接收有关申请状态的更新",
    "settings.saved": "设置已保存",
    "font.small": "小",
    "font.medium": "中",
    "font.large": "大",
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem("skim_pintar_settings");
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem("skim_pintar_settings", JSON.stringify(settings));

    // Apply dark mode
    document.documentElement.classList.toggle("dark", settings.darkMode);

    // Apply font size
    const sizeMap: Record<FontSize, string> = {
      small: "14px",
      medium: "16px",
      large: "18px",
    };
    document.documentElement.style.fontSize = sizeMap[settings.fontSize];

    // Apply high contrast
    document.documentElement.classList.toggle("high-contrast", settings.highContrast);
  }, [settings]);

  const updateSettings = (partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const t = (key: string): string => {
    return translations[settings.language]?.[key] || translations.en[key] || key;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
