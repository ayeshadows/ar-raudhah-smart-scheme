import { motion } from "framer-motion";
import { GraduationCap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type Application = {
  plan: string;
  status: string;
};

interface CoursesSectionProps {
  applications: Application[];
}

const COURSES = [
  {
    level: "Pre-Nursery (N1)",
    category: "Singaporean",
    monthlyFee: 220,
    materialFee: 453,
    adminFee: 35,
    schedule: "Mon-Thu 8am-11am / 12.15pm-3.15pm, Fri 8am-10am / 10.15am-12.15pm",
  },
  {
    level: "Pre-Nursery (N1)",
    category: "PR",
    monthlyFee: 250,
    materialFee: 453,
    adminFee: 35,
    schedule: "Mon-Thu 8am-11am / 12.15pm-3.15pm, Fri 8am-10am / 10.15am-12.15pm",
  },
  {
    level: "Pre-Nursery (N1)",
    category: "Foreigner",
    monthlyFee: 420,
    materialFee: 453,
    adminFee: 35,
    schedule: "Mon-Thu 8am-11am / 12.15pm-3.15pm, Fri 8am-10am / 10.15am-12.15pm",
  },
  {
    level: "N2, K1 & K2",
    category: "Singaporean",
    monthlyFee: 200,
    materialFee: 597,
    adminFee: 35,
    schedule: "Mon-Thu 8am-12pm / 12.15pm-4.15pm, Fri 8am-10am / 10.15am-12.15pm",
  },
  {
    level: "N2, K1 & K2",
    category: "PR",
    monthlyFee: 230,
    materialFee: 597,
    adminFee: 35,
    schedule: "Mon-Thu 8am-12pm / 12.15pm-4.15pm, Fri 8am-10am / 10.15am-12.15pm",
  },
  {
    level: "N2, K1 & K2",
    category: "Foreigner",
    monthlyFee: 400,
    materialFee: 597,
    adminFee: 35,
    schedule: "Mon-Thu 8am-12pm / 12.15pm-4.15pm, Fri 8am-10am / 10.15am-12.15pm",
  },
];

const getDiscount = (applications: Application[]) => {
  const activeApp = applications.find(
    (a) => a.status === "approved" || a.status === "pending"
  );
  if (!activeApp) return { percent: 0, label: "No active plan" };
  if (activeApp.plan === "pintar_plus") return { percent: 20, label: "Pintar Plus (20% off)" };
  return { percent: 20, label: "Pintar (20% off)" };
};

const CoursesSection = ({ applications }: CoursesSectionProps) => {
  const discount = getDiscount(applications);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-10 bg-card rounded-xl border p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Ar-Raudhah Kindergarten
            </h3>
            <p className="text-xs text-muted-foreground">Courses offered by Masjid Ar-Raudhah</p>
          </div>
        </div>
        {discount.percent > 0 && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
            {discount.label}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-3 pr-4 font-medium">Level</th>
              <th className="pb-3 pr-4 font-medium">Category</th>
              <th className="pb-3 pr-4 font-medium text-right">Monthly Fee</th>
              {discount.percent > 0 && (
                <th className="pb-3 pr-4 font-medium text-right">After Discount</th>
              )}
              <th className="pb-3 pr-4 font-medium text-right">Material Fee/yr</th>
              <th className="pb-3 font-medium text-right">Admin Fee/yr</th>
            </tr>
          </thead>
          <tbody>
            {COURSES.map((course, i) => {
              const discountedMonthly =
                discount.percent > 0
                  ? course.monthlyFee * (1 - discount.percent / 100)
                  : course.monthlyFee;

              return (
                <tr key={i} className="border-b last:border-b-0 hover:bg-secondary/50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-foreground">{course.level}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{course.category}</td>
                  <td className={`py-3 pr-4 text-right ${discount.percent > 0 ? "line-through text-muted-foreground" : "text-foreground font-medium"}`}>
                    ${course.monthlyFee}
                  </td>
                  {discount.percent > 0 && (
                    <td className="py-3 pr-4 text-right font-semibold text-primary">
                      ${discountedMonthly.toFixed(0)}
                    </td>
                  )}
                  <td className="py-3 pr-4 text-right text-muted-foreground">${course.materialFee}</td>
                  <td className="py-3 text-right text-muted-foreground">${course.adminFee}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-3">*All fees are subjected to changes</p>

      <div className="mt-5 pt-4 border-t flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Interested? Register directly on the mosque website.
        </p>
        <Button
          asChild
          className="gap-2"
        >
          <a
            href="https://arraudhahmosque.com/kindergarten/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Register <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </motion.div>
  );
};

export default CoursesSection;
