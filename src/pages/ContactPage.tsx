import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ContactPage = () => {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setContactForm({ name: "", email: "", message: "" });
      setSending(false);
    }, 1000);
  };

  const handleWhatsApp = () => {
    const phone = "6568995840";
    const message = encodeURIComponent("Assalamualaikum, I have a question about Skim Pintar.");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-card">
        <div className="container max-w-3xl mx-auto flex items-center gap-3 py-4 px-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-heading font-semibold text-foreground">Contact Us</h1>
            <p className="text-xs text-muted-foreground">Masjid Ar-Raudhah</p>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Get in Touch</h2>
          <p className="text-muted-foreground mb-8">
            Have a question? Send us a message or reach out via WhatsApp.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Form */}
            <div className="bg-card border rounded-xl p-6 shadow-card">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Name</Label>
                  <Input
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    placeholder="Your full name"
                    className="h-11 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    placeholder="your@email.com"
                    className="h-11 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Message</Label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    placeholder="How can we help you?"
                    className="min-h-[100px] rounded-lg"
                  />
                </div>
                <Button type="submit" disabled={sending} className="w-full h-11 rounded-lg font-semibold">
                  <Send className="w-4 h-4 mr-2" />
                  {sending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-card border rounded-xl p-6 shadow-card flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-[hsl(142,70%,45%)]/10 flex items-center justify-center mb-4">
                  <MessageCircle className="w-7 h-7 text-[hsl(142,70%,45%)]" />
                </div>
                <h4 className="font-semibold text-foreground font-body text-lg mb-2">Chat on WhatsApp</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Prefer to chat? Reach us directly on WhatsApp for quick responses.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  <span className="font-medium text-foreground">+65 6899 5840</span>
                </p>
              </div>
              <Button
                onClick={handleWhatsApp}
                className="w-full h-11 rounded-lg font-semibold bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,38%)] text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ContactPage;
