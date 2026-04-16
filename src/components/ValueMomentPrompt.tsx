import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Sparkles, Crown, ArrowRight, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEventTracking } from "@/hooks/useEventTracking";
import { useFreeTier } from "@/hooks/useFreeTier";

interface ValueMomentPromptProps {
  trigger: "saved_study" | "completed_challenge" | "earned_achievement" | "generated_content" | "completed_tour";
  actionLabel?: string;
  onDismiss?: () => void;
}

const MESSAGES: Record<string, { title: string; subtitle: string; cta: string }> = {
  saved_study: {
    title: "Nice! You saved your first study 📚",
    subtitle: "Unlock unlimited studies & AI-powered insights with Premium",
    cta: "Upgrade to Save More",
  },
  completed_challenge: {
    title: "Challenge Complete! 🏆",
    subtitle: "Premium members get unlimited challenges & exclusive content",
    cta: "Unlock All Challenges",
  },
  earned_achievement: {
    title: "Achievement Unlocked! 🎉",
    subtitle: "Keep the momentum going with Premium access",
    cta: "Continue Growing",
  },
  generated_content: {
    title: "AI Content Generated! ✨",
    subtitle: "Get unlimited AI generations with Premium",
    cta: "Unlock Unlimited AI",
  },
  completed_tour: {
    title: "Tour Complete! 🎯",
    subtitle: "You've seen what's possible. Ready to unlock everything?",
    cta: "Start Free Trial",
  },
};

export function ValueMomentPrompt({ trigger, actionLabel, onDismiss }: ValueMomentPromptProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();
  const { trackUpgradeClick, trackPaywallHit, trackValueMoment } = useEventTracking();
  const { tier, isLoading, isPremium } = useFreeTier();

  // Only show for free tier / trial users (not for paid users)
  const shouldShow = !isLoading && !isPremium;

  useEffect(() => {
    if (!shouldShow || dismissed) return;

    // Check if this prompt was recently shown (within 24 hours)
    const lastShown = sessionStorage.getItem(`value_prompt_${trigger}`);
    if (lastShown) {
      const elapsed = Date.now() - parseInt(lastShown, 10);
      if (elapsed < 24 * 60 * 60 * 1000) return; // Don't show again within 24h
    }

    // Delay showing the prompt to let the user enjoy their win
    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(`value_prompt_${trigger}`, Date.now().toString());
      trackValueMoment(trigger);
      trackPaywallHit("premium", `value_moment_${trigger}`);
    }, 1500);

    return () => clearTimeout(timer);
  }, [shouldShow, dismissed, trigger, trackValueMoment, trackPaywallHit]);

  const handleUpgrade = () => {
    trackUpgradeClick(`value_moment_${trigger}`, trigger);
    navigate("/pricing");
  };

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    onDismiss?.();
  };

  const message = MESSAGES[trigger] || MESSAGES.completed_tour;

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/30 rounded-xl p-5 shadow-2xl backdrop-blur-sm">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Content */}
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">
                  {message.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {message.subtitle}
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={handleUpgrade}
                    size="sm"
                    className="gradient-palace text-white gap-1"
                  >
                    <Crown className="h-3.5 w-3.5" />
                    {actionLabel || message.cta}
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground"
                  >
                    Maybe later
                  </Button>
                </div>
              </div>
            </div>

            {/* Sparkle decorations */}
            <Sparkles className="absolute top-3 left-3 h-3 w-3 text-primary/40" />
            <Sparkles className="absolute bottom-3 right-12 h-2 w-2 text-accent/40" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}