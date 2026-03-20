import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronRight, Clock, Shield, CreditCard, Gift } from "lucide-react";
import { EmbeddedCheckoutForm } from "@/components/EmbeddedCheckoutForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CompleteCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
}

export function CompleteCheckoutModal({ open, onOpenChange, userName }: CompleteCheckoutModalProps) {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<"premium_monthly" | "premium_annual">("premium_monthly");
  const [showCheckout, setShowCheckout] = useState(false);
  const [activatingFree, setActivatingFree] = useState(false);

  const plans = {
    premium_monthly: { label: "Monthly", price: "$15/mo", save: null },
    premium_annual: { label: "Annual", price: "$150/yr", save: "Save $30" },
  };

  const billing = selectedPlan.includes("annual") ? "annual" : "monthly";

  const handleNoCardTrial = async () => {
    if (!user) return;
    setActivatingFree(true);
    try {
      // Grant 7-day promotional access directly
      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_tier: "premium",
          subscription_status: "active",
          promotional_access_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          access_code_used: "no_card_7day",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("You're in! Enjoy 7 days of full access — no card needed.", { duration: 6000 });
      onOpenChange(false);
      // Reload to reflect new access
      window.location.reload();
    } catch (err) {
      console.error("Failed to activate no-card trial:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setActivatingFree(false);
    }
  };

  if (showCheckout) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-lg">Complete Your Signup</DialogTitle>
            <DialogDescription>
              {plans[selectedPlan].label} plan — {plans[selectedPlan].price}
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-[400px]">
            <EmbeddedCheckoutForm plan="premium" billing={billing} />
          </div>
          <button
            onClick={() => setShowCheckout(false)}
            className="text-xs text-muted-foreground underline text-center mt-2"
          >
            ← Change plan
          </button>
        </DialogContent>
      </Dialog>
    );
  }

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
              { icon: Clock, text: "14-day free trial — cancel anytime" },
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
            onClick={() => setShowCheckout(true)}
            className="w-full h-12 text-base gap-2"
            size="lg"
          >
            Start Free Trial
            <ChevronRight className="h-4 w-4" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your card won't be charged during the trial period.
          </p>

          {/* No-card safety net */}
          <div className="relative pt-2">
            <div className="absolute inset-x-0 top-0 flex items-center justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">or</span>
            </div>
            <div className="border border-dashed border-primary/30 rounded-lg p-4 mt-3 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm font-medium">
                <Gift className="h-4 w-4 text-primary" />
                Not ready for a card?
              </div>
              <p className="text-xs text-muted-foreground">
                Try 7 days completely free — no credit card, no commitment. We're that confident you'll love it.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNoCardTrial}
                disabled={activatingFree}
                className="w-full border-primary/30 hover:bg-primary/5"
              >
                {activatingFree ? "Activating..." : "Try 7 Days Risk-Free"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
