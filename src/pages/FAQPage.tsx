import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Skim Pintar?",
    answer:
      "It is a scheme to facilitate our jemaah to make monthly donation to the mosque through GIRO. Donors who donate $5.00/month (Pintar) will get free funeral services for himself in the event of his death while donors who donate more than $20.00/month (Pintar Plus) will get complimentary funeral services for the immediate family living under one address in the event of any death in the family.",
  },
  {
    question: "How do I register?",
    answer:
      "Donors with a bank account will have to fill in the Giro form. You can also apply through this app via the Apply page using Singpass.",
  },
  {
    question: "What are the benefits of Skim Pintar?",
    answer:
      "• Concession or complimentary funeral service for donors\n• Concession or complimentary funeral service for donors and family of Pintar Plus in the same household (Spouse, Children, Parents, Siblings)\n• 50% coverage for funeral services for parents / parents-in-law not living in the same household\n• 20% off courses organised by Ar-Raudhah Mosque",
  },
  {
    question: "What does the complimentary funeral service include?",
    answer:
      "• Bathing, shrouding, prayer, burial\n• Undertaker (Jurumandi)\n• Bathing and shrouding kits (Soap, camphor, perfume, kain kafan)\n• Nisan, name plate, carpet grass\n• 40-seater bus to cemetery (2 way)",
  },
  {
    question: "Are there any additional fees not covered?",
    answer:
      "Yes, the following incur additional fees:\n1. Transport from Hospice, Hospital etc.\n2. Transport to Mosque (Bathing / Prayer)\n3. NEA burial plot\n4. 24hr doctor's fee for death verification",
  },
  {
    question: "How can the donation be channelled to the mosque?",
    answer:
      "Our bank will channel your monthly donations to the mosque's bank account, after your application has been approved.",
  },
  {
    question: "What happens if GIRO deduction fails?",
    answer:
      "If GIRO deduction fails for 3 consecutive months, the donor's membership will be ceased automatically unless the membership is renewed.",
  },
];

const FAQPage = () => {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending
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
            <h1 className="text-lg font-heading font-semibold text-foreground">
              FAQs
            </h1>
            <p className="text-xs text-muted-foreground">Skim Pintar</p>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mb-8">
            Everything you need to know about Skim Pintar at Masjid Ar-Raudhah.
          </p>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card border rounded-xl px-5 shadow-card"
              >
                <AccordionTrigger className="text-left font-body font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground whitespace-pre-line">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10"
          >
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
              Contact Us
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
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

          <div className="mt-10 bg-card border rounded-xl p-6 shadow-card text-center">
            <p className="text-sm text-muted-foreground italic font-heading">
              "Aisyah (RA) narrated that the Prophet (PBUH) was asked, 'What
              deeds are loved most by Allah?' He said, 'The most regular
              constant deeds even though they may be few.'"
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              — Narrated by Bukhari, no. 6465
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default FAQPage;
