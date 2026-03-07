import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, CreditCard, Clock, Star } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="gradient-hero islamic-pattern relative overflow-hidden">
        <div className="container max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                <span className="text-sm font-heading font-bold text-primary">AR</span>
              </div>
              <span className="text-primary-foreground font-heading font-semibold">Masjid Ar-Raudhah</span>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(isLoggedIn ? "/dashboard" : "/auth")}
              className="border-primary-foreground/20 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-primary-foreground"
            >
              {isLoggedIn ? "Dashboard" : "Sign In"}
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl pb-16"
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-1.5 mb-6">
              <Star className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-accent">Now Digital — No More GIRO Forms</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground mb-5 leading-tight">
              Skim Pintar
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
              A monthly donation scheme with complimentary funeral services. Now with Singpass registration and convenient card payments.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate(isLoggedIn ? "/apply" : "/auth")}
                className="h-12 px-8 rounded-lg text-base font-semibold gradient-gold text-primary hover:opacity-90"
              >
                Apply Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-12 px-8 rounded-lg text-base border-primary-foreground/20 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Singpass Registration",
                desc: "Register instantly with MyInfo — no more paper forms.",
                gradient: "gradient-primary",
                iconColor: "text-primary-foreground",
              },
              {
                icon: <CreditCard className="w-6 h-6" />,
                title: "Card Payments",
                desc: "Recurring debit/credit card deductions replace GIRO.",
                gradient: "gradient-gold",
                iconColor: "text-primary",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Track Status",
                desc: "Monitor your application and payment status online.",
                gradient: "bg-secondary",
                iconColor: "text-foreground",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl border p-6 shadow-card"
              >
                <div className={`w-12 h-12 rounded-xl ${item.gradient} flex items-center justify-center mb-4`}>
                  <span className={item.iconColor}>{item.icon}</span>
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2 font-body">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="benefits" className="py-16 px-6 bg-card">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-foreground mb-3">Choose Your Plan</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Monthly donations that give back with complimentary funeral services for you and your loved ones.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Pintar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border-2 border-border p-8 bg-background"
            >
              <h3 className="text-xl font-heading font-bold text-foreground mb-1">Pintar</h3>
              <p className="text-3xl font-heading font-bold text-primary mb-4">
                $5<span className="text-base text-muted-foreground font-body font-normal">/month</span>
              </p>
              <ul className="space-y-2.5 text-sm text-muted-foreground mb-6">
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Free funeral services for donor</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> 20% off mosque courses</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Bathing, shrouding, prayer & burial</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Undertaker & kits included</li>
              </ul>
              <Button
                variant="outline"
                className="w-full h-12 rounded-lg"
                onClick={() => navigate(isLoggedIn ? "/apply" : "/auth")}
              >
                Get Started
              </Button>
            </motion.div>

            {/* Pintar Plus */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border-2 border-primary p-8 bg-background relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-bl-xl">
                Recommended
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-1">Pintar Plus</h3>
              <p className="text-3xl font-heading font-bold text-primary mb-4">
                $20<span className="text-base text-muted-foreground font-body font-normal">/month</span>
              </p>
              <ul className="space-y-2.5 text-sm text-muted-foreground mb-6">
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Everything in Pintar</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Covers immediate family (same address)</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> 50% off for parents not in household</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> 40-seater bus to cemetery (2 way)</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Nisan, name plate & carpet grass</li>
              </ul>
              <Button
                className="w-full h-12 rounded-lg font-semibold"
                onClick={() => navigate(isLoggedIn ? "/apply" : "/auth")}
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t">
        <div className="container max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <span className="text-xs font-heading font-bold text-primary">AR</span>
            </div>
            <span className="font-heading font-semibold text-foreground">Masjid Ar-Raudhah</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Skim Pintar — Monthly Donation Scheme
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Masjid Ar-Raudhah. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
