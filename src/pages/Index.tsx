import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Shield, HelpCircle, Mail, Settings, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useSettings } from "@/contexts/SettingsContext";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useSettings();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Full-page gradient background */}
      <div className="absolute inset-0 gradient-hero islamic-pattern" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/30" />

      {/* Header */}
      <header className="relative z-10 px-6 py-5">
        <div className="container max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/araudhah_logo.jpg"
              alt="Masjid Ar-Raudhah Logo"
              className="w-10 h-10 rounded-lg object-contain" />
            
            <div>
             <span className="font-heading font-semibold text-foreground block leading-tight">
                Masjid Ar-Raudhah
              </span>
              <span className="text-xs text-muted-foreground">
                Skim Pintar Portal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAboutOpen(true)}
              className="text-foreground/80 hover:text-foreground hover:bg-foreground/10">
              <Info className="w-4 h-4 mr-1" />
              {t("landing.aboutUs")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/faq")}
              className="text-foreground/80 hover:text-foreground hover:bg-foreground/10">
              <HelpCircle className="w-4 h-4 mr-1" />
              {t("nav.faq")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/contact")}
              className="text-foreground/80 hover:text-foreground hover:bg-foreground/10">
              <Mail className="w-4 h-4 mr-1" />
              {t("nav.contactUs")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/settings")}
              className="text-foreground/80 hover:text-foreground hover:bg-foreground/10">
              <Settings className="w-4 h-4 mr-1" />
              {t("nav.settings")}
            </Button>
          </div>
        </div>
      </header>

      {/* Center Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-card rounded-2xl shadow-elevated p-8 text-center">
          
          {/* Shield icon */}
          <div className="w-16 h-16 rounded-2xl border-2 border-border flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            {t("landing.welcome")}
          </h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
            {t("landing.subtitle")}
          </p>

          {/* Singpass Button */}
          <Button
            onClick={() => navigate(isLoggedIn ? "/dashboard" : "/auth")}
            className="w-full h-12 rounded-xl text-base font-semibold bg-[hsl(0,72%,51%)] hover:bg-[hsl(0,72%,45%)] text-white mb-3">
            
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="15" r="1.5" fill="currentColor" />
            </svg>
            {t("landing.login")}
          </Button>


          {/* Plan Cards */}
          <div className="space-y-3 text-left">
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <p className="font-semibold text-foreground font-body text-sm">Pintar — $5-$15/month

              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("landing.pintarDesc")}
              </p>
            </div>
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <p className="font-semibold text-foreground font-body text-sm">Pintar Plus — $20+/month

              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("landing.pintarPlusDesc")}
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-xs text-foreground/60">
          © {new Date().getFullYear()} Masjid Ar-Raudhah. All rights reserved.
        </p>
      </footer>

      {/* About Us Dialog */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">What is Skim Pintar?</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground pt-3 leading-relaxed">
              It is a scheme to facilitate our jemaah to make monthly donation to the mosque through GIRO. Donors who donate $5.00/month (Pintar) will get free funeral services for himself in the event of his death while donors who donate more than $20.00/month (Pintar Plus) will get <strong>complimentary funeral services for the immediate family living under one address</strong> in the event of any death in the family.
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button variant="outline" className="mt-2">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>);

};

export default Index;