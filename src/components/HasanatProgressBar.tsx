import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const LEVELS = [
  { points: 50, label: "Community Helper" },
  { points: 150, label: "Mosque Guardian" },
  { points: 300, label: "Pillar of the Ummah" },
  { points: 500, label: "Legacy Contributor" },
];

const HasanatProgressBar = ({ userId }: { userId: string }) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHasanat = async () => {
      const { data } = await supabase
        .from("hasanat")
        .select("total_points, total_amount")
        .eq("user_id", userId)
        .maybeSingle();
      if (data) {
        setTotalPoints(data.total_points);
        setTotalAmount(Number(data.total_amount));
      }
      setLoading(false);
    };
    fetchHasanat();
  }, [userId]);

  const maxPoints = LEVELS[LEVELS.length - 1].points;
  const progressPercent = Math.min((totalPoints / maxPoints) * 100, 100);

  const currentLevel = [...LEVELS].reverse().find((l) => totalPoints >= l.points);
  const nextLevel = LEVELS.find((l) => totalPoints < l.points);

  if (loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border p-6 shadow-card mb-10"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary fill-primary" />
          <h3 className="font-heading font-semibold text-foreground text-lg">Hasanat Points</h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">{totalPoints}</span>
          <span className="text-sm text-muted-foreground ml-1">pts</span>
        </div>
      </div>

      {currentLevel && (
        <p className="text-sm text-primary font-semibold mb-1">
          🏅 {currentLevel.label}
        </p>
      )}
      {nextLevel && (
        <p className="text-xs text-muted-foreground mb-4">
          {nextLevel.points - totalPoints} points to <span className="font-medium">{nextLevel.label}</span>
        </p>
      )}
      {!nextLevel && (
        <p className="text-xs text-muted-foreground mb-4">Maximum level reached! 🎉</p>
      )}

      {/* Progress bar */}
      <div className="relative">
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Level markers */}
        <div className="relative mt-1">
          {LEVELS.map((level) => {
            const position = (level.points / maxPoints) * 100;
            const reached = totalPoints >= level.points;
            return (
              <div
                key={level.points}
                className="absolute -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${position}%` }}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 -mt-[11px] ${
                    reached
                      ? "bg-primary border-primary"
                      : "bg-card border-muted-foreground/40"
                  }`}
                />
                <span className={`text-[10px] mt-1 whitespace-nowrap ${reached ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                  {level.points}
                </span>
                <span className={`text-[9px] whitespace-nowrap ${reached ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {level.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-10 text-xs text-muted-foreground">
        <div>
          <p className="mb-1">Your contribution helps the mosque with:</p>
          <ul className="list-disc ml-4 space-y-0.5">
            <li>Utility and water bills</li>
            <li>Islamic outreach / Dakwah</li>
            <li>Everyday operations</li>
          </ul>
        </div>
        <div className="text-right">
          Total contributed: <span className="font-semibold text-foreground">${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default HasanatProgressBar;
