import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Shield, Clock, Sparkles, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface CompleteCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
}

export function CompleteCheckoutModal({ open, onOpenChange, userName }: CompleteCheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"premium_monthly" | "premium_annual">("premium_monthly");

  const plans = {
    premium_monthly: { label: "Monthly", price: "$15/mo", save: null },
    premium_annual: { label: "Annual", price: "$150/yr", save: "Save $30" },
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const plan = selectedPlan.includes("annual") ? "premium" : "premium";
      const billing = selectedPlan.includes("annual") ? "annual" : "monthly";

      const { data, error } = await supabase.functions.invoke("create-trial-checkout", {
        body: { plan, billing },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {userName ? `Welcome back, ${userName}!` : "Complete Your Signup"}
          </DialogTitle>
          <DialogDescription className="text-base">
            You're one step away from unlocking the full Phototheology Palace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Plan selection */}
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(plans) as [keyof typeof plans, typeof plans[keyof typeof plans]][]).map(([key, plan]) => (
              <button
                key={key}
                onClick={() => setSelectedPlan(key)}
                className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                  selectedPlan === key
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {plan.save && (
                  <Badge className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] px-1.5">
                    {plan.save}
                  </Badge>
                )}
                <div className="font-semibold text-sm">{plan.label}</div>
                <div className="text-lg font-bold text-primary">{plan.price}</div>
              </button>
            ))}
          </div>

          {/* Benefits */}
          <div className="space-y-2 py-2">
            {[
              { icon: Clock, text: "7-day free trial — cancel anytime" },
              { icon: Shield, text: "No charge until trial ends" },
              { icon: CreditCard, text: "Secure payment via Stripe" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full h-12 text-base gap-2"
            size="lg"
          >
            {loading ? "Redirecting…" : "Start Free Trial"}
            {!loading && <ChevronRight className="h-4 w-4" />}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your card won't be charged during the 7-day trial period.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
