import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Shield, HelpCircle, Mail, Settings, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

const Index = () => {
  const navigate = useNavigate();
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
              <span className="font-heading font-semibold text-primary-foreground block leading-tight">
                Masjid Ar-Raudhah
              </span>
              <span className="text-xs text-primary-foreground/70">
                Skim Pintar Portal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/faq")}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              
              <HelpCircle className="w-4 h-4 mr-1" />
              FAQ
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/contact")}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              
              <Mail className="w-4 h-4 mr-1" />
              Contact Us
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
            Welcome to Skim Pintar
          </h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
            Sign in with Singpass to apply for or manage your Skim Pintar
            membership with Masjid Ar-Raudhah.
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
            Log in with Singpass
          </Button>

          <p className="text-xs text-muted-foreground mb-8">
            This is a simulated Singpass login for demonstration purposes.
          </p>

          {/* Plan Cards */}
          <div className="space-y-3 text-left">
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <p className="font-semibold text-foreground font-body text-sm">Pintar — $5-$15/month

              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Free funeral services for yourself
              </p>
            </div>
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <p className="font-semibold text-foreground font-body text-sm">Pintar Plus — $20+/month

              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complimentary funeral services for your household
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} Masjid Ar-Raudhah. All rights reserved.
        </p>
      </footer>
    </div>);

};

export default Index;