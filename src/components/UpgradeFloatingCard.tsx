import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { Crown, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function UpgradeFloatingCard() {
  const { user } = useAuth();
  const { subscription, loading } = useSubscription();

  if (!user || loading) return null;

  // Don't show if user already has access
  if (
    subscription.hasAccess ||
    subscription.status === 'active' ||
    subscription.tier === 'premium' ||
    subscription.tier === 'essential' ||
    subscription.tier === 'patron' ||
    subscription.church.hasChurchAccess
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-5 shadow-lg"
    >
      {/* Pulsing glow */}
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary/20 blur-2xl animate-pulse" />
      
      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
          <Crown className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-base flex items-center gap-1.5">
            Unlock Full Access
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          </h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Get the Complete Study Suite — Palace, VR, AI tools, and all 8 floors.
          </p>
          <Button asChild size="sm" className="mt-3 gap-1.5">
            <Link to="/pricing">
              View Plans <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
