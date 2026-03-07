import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Receipt, ArrowUpRight, ArrowDownLeft } from "lucide-react";

type Transaction = {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  status: string;
  created_at: string;
};

const TransactionsPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate("/auth"); return; }
      const { data } = await supabase
        .from("transactions")
        .select("id, type, amount, description, status, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      if (data) setTransactions(data);
      setLoading(false);
    });
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-primary/10 text-primary";
      case "failed": return "bg-destructive/10 text-destructive";
      case "refunded": return "bg-accent/20 text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-card">
        <div className="container max-w-3xl mx-auto flex items-center gap-4 py-4 px-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-heading font-semibold text-foreground">Transaction History</h1>
            <p className="text-xs text-muted-foreground">View your past payments and records</p>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-6 py-10">
        {transactions.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-heading font-semibold text-foreground mb-2">No Transactions</h2>
            <p className="text-muted-foreground mb-6 text-sm">You don't have any transaction records yet.</p>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {transactions.map((txn, index) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl border p-5 shadow-card flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    txn.type === "refund" ? "bg-accent/20" : "bg-primary/10"
                  }`}>
                    {txn.type === "refund" ? (
                      <ArrowDownLeft className="w-5 h-5 text-accent-foreground" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground font-body text-sm">
                      {txn.description || (txn.type === "payment" ? "Monthly Payment" : "Refund")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(txn.created_at).toLocaleDateString()} · {new Date(txn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${txn.type === "refund" ? "text-accent-foreground" : "text-foreground"}`}>
                    {txn.type === "refund" ? "+" : "-"}${txn.amount.toFixed(2)}
                  </p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${getStatusColor(txn.status)}`}>
                    {txn.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TransactionsPage;
