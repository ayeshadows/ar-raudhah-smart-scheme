import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Send, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ContactQuery {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

const ContactPage = () => {
  const navigate = useNavigate();
  const { t } = useSettings();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [loadingQueries, setLoadingQueries] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
      if (user) fetchQueries();
      else setLoadingQueries(false);
    };
    getUser();
  }, []);

  const fetchQueries = async () => {
    setLoadingQueries(true);
    const { data, error } = await supabase
      .from("contact_queries")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setQueries(data);
    setLoadingQueries(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    if (!userId) {
      toast.error("Please log in to submit a query.");
      setSending(false);
      return;
    }

    const { error } = await supabase.from("contact_queries").insert({
      user_id: userId,
      name: contactForm.name,
      email: contactForm.email,
      message: contactForm.message,
    });

    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setContactForm({ name: "", email: "", message: "" });
      fetchQueries();
    }
    setSending(false);
  };

  const handleWhatsApp = () => {
    const phone = "6568995840";
    const message = encodeURIComponent("Assalamualaikum, I have a question about Skim Pintar.");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/10">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Resolved
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/10">
            <Clock className="w-3 h-3 mr-1" /> In Progress
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground border-border hover:bg-muted">
            <AlertCircle className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-card">
        <div className="container max-w-3xl mx-auto flex items-center gap-3 py-4 px-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-heading font-semibold text-foreground">{t("contact.title")}</h1>
            <p className="text-xs text-muted-foreground">{t("contact.subtitle")}</p>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-6 py-10 space-y-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">{t("contact.getInTouch")}</h2>
          <p className="text-muted-foreground mb-8">{t("contact.getInTouchDesc")}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-xl p-6 shadow-card">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("contact.name")}</Label>
                  <Input value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required placeholder={t("contact.namePlaceholder")} className="h-11 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("contact.email")}</Label>
                  <Input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required placeholder={t("contact.emailPlaceholder")} className="h-11 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("contact.message")}</Label>
                  <Textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required placeholder={t("contact.messagePlaceholder")} className="min-h-[100px] rounded-lg" />
                </div>
                <Button type="submit" disabled={sending} className="w-full h-11 rounded-lg font-semibold">
                  <Send className="w-4 h-4 mr-2" />
                  {sending ? t("contact.sending") : t("contact.send")}
                </Button>
              </form>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-card flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-[hsl(142,70%,45%)]/10 flex items-center justify-center mb-4">
                  <MessageCircle className="w-7 h-7 text-[hsl(142,70%,45%)]" />
                </div>
                <h4 className="font-semibold text-foreground font-body text-lg mb-2">{t("contact.whatsapp")}</h4>
                <p className="text-sm text-muted-foreground mb-2">{t("contact.whatsappDesc")}</p>
                <p className="text-sm text-muted-foreground mb-6">
                  <span className="font-medium text-foreground">+65 6899 5840</span>
                </p>
              </div>
              <Button onClick={handleWhatsApp} className="w-full h-11 rounded-lg font-semibold bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,38%)] text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                {t("contact.whatsapp")}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Query History */}
        {userId && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3 className="text-xl font-heading font-bold text-foreground mb-4">Your Queries</h3>
            {loadingQueries ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : queries.length === 0 ? (
              <div className="bg-card border rounded-xl p-6 text-center text-muted-foreground text-sm">
                No queries yet. Use the form above to get in touch!
              </div>
            ) : (
              <div className="space-y-3">
                {queries.map((q) => (
                  <div key={q.id} className="bg-card border rounded-xl p-5 shadow-card">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm font-medium text-foreground line-clamp-2 flex-1">{q.message}</p>
                      {getStatusBadge(q.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(q.created_at), "dd MMM yyyy, hh:mm a")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ContactPage;
