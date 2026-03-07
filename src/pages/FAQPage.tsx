import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";
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
