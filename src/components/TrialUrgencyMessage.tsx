import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Clock, Sparkles, ArrowRight, Zap, Star, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { supabase } from "@/integrations/supabase/client";
import { useEventTracking } from "@/hooks/useEventTracking";

interface TrialInfo {
  daysLeft: number;
  trialAge: number; // days since trial started
  isExpired: boolean;
}

type MessageConfig = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  cta: string;
  urgency: "low" | "medium" | "high" | "critical";
};

function getMessageForTrialAge(info: TrialInfo): MessageConfig | null {
  const { daysLeft, trialAge, isExpired } = info;

  // Day 1: Welcome & first win path
  if (trialAge <= 1) {
    return {
      icon: <Star className="h-5 w-5" />,
      title: "Welcome to your 7-day trial! 🎉",
      subtitle: "Complete your first win: explore the 24FPS Room and match 7 Genesis images.",
      cta: "Start First Win",
      urgency: "low",
    };
  }

  // Day 5: Feature discovery
  if (trialAge >= 4 && trialAge <= 6 && !sessionStorage.getItem("trial_msg_day5")) {
    sessionStorage.setItem("trial_msg_day5", "shown");
    return {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Have you tried Jeeves AI? 🤖",
      subtitle: "Most users discover deeper insights with our AI study companion.",
      cta: "Try Jeeves",
      urgency: "low",
    };
  }

  // Day 10-12: Urgency building
  if (daysLeft <= 4 && daysLeft > 2) {
    return {
      icon: <Clock className="h-5 w-5" />,
      title: `${daysLeft} days left in your trial`,
      subtitle: "Save your progress and unlock unlimited access before it ends.",
      cta: "Upgrade Now",
      urgency: "medium",
    };
  }

  // Day 13-14: High urgency
  if (daysLeft <= 2 && daysLeft > 0) {
    return {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: daysLeft === 1 ? "Trial ends tomorrow!" : "Only 2 days left!",
      subtitle: "Don't lose your studies and progress. Upgrade to keep everything.",
      cta: "Keep My Access",
      urgency: "high",
    };
  }

  // Expiry day
  if (daysLeft === 0 && !isExpired) {
    return {
      icon: <Zap className="h-5 w-5" />,
      title: "Your trial ends today!",
      subtitle: "This is your last chance to upgrade and keep full access.",
      cta: "Upgrade Before Midnight",
      urgency: "critical",
    };
  }

  return null;
}

export function TrialUrgencyMessage() {
  const [trialInfo, setTrialInfo] = useState<TrialInfo | null>(null);
  const [message, setMessage] = useState<MessageConfig | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { isMember: isChurchMember } = useChurchMembership();
  const { trackPaywallHit, trackUpgradeClick } = useEventTracking();

  useEffect(() => {
    async function fetchTrialInfo() {
      if (!user || subscriptionLoading) {
        return;
      }

      // If user has any form of paid access, don't show trial messages
      // This respects the Stripe fallback check in useSubscription
      if (subscription.hasAccess) {
        setLoading(false);
        return;
      }

      // CRITICAL: Double-check subscription status is actually 'trial' 
      // If status is 'active', 'patron', or user has church access, skip trial messages
      if (subscription.status === 'active' || subscription.tier === 'patron' || subscription.church.hasChurchAccess) {
        setLoading(false);
        return;
      }

      try {
        // Check profile for trial info AND paid status
        const { data } = await supabase
          .from("profiles")
          .select("trial_ends_at, created_at, has_lifetime_access, subscription_status, subscription_tier, payment_source, stripe_subscription_id")
          .eq("id", user.id)
          .maybeSingle();

        // CRITICAL: Check ALL indicators of paid access from the profile
        if (data?.has_lifetime_access) {
          console.log('[TrialUrgencyMessage] User has lifetime access, hiding trial message');
          setLoading(false);
          return;
        }

        // Check if user has active subscription status in profile
        if (data?.subscription_status === 'active' && data?.subscription_tier && data.subscription_tier !== 'free') {
          console.log('[TrialUrgencyMessage] User has active subscription in profile, hiding trial message');
          setLoading(false);
          return;
        }

        // Check if user has Stripe subscription ID (they've paid)
        if (data?.stripe_subscription_id) {
          console.log('[TrialUrgencyMessage] User has Stripe subscription ID, hiding trial message');
          setLoading(false);
          return;
        }

        // Check if user has payment_source that isn't trial/none
        if (data?.payment_source && !['trial', 'none', ''].includes(data.payment_source)) {
          console.log('[TrialUrgencyMessage] User has paid payment_source:', data.payment_source);
          setLoading(false);
          return;
        }

        if (!data?.trial_ends_at) {
          setLoading(false);
          return;
        }

        const now = new Date();
        const trialEnd = new Date(data.trial_ends_at);
        const trialStart = new Date(data.created_at || now);
        
        const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        const trialAge = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
        const isExpired = now > trialEnd;

        const info = { daysLeft, trialAge, isExpired };
        setTrialInfo(info);
        
        const msg = getMessageForTrialAge(info);
        setMessage(msg);
        
        if (msg) {
          trackPaywallHit("trial_urgency", `day_${trialAge}`, { days_left: daysLeft });
        }
      } catch (error) {
        console.debug("Trial info fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    // Check if already dismissed this session
    const dismissedToday = sessionStorage.getItem("trial_urgency_dismissed");
    if (dismissedToday) {
      setDismissed(true);
      setLoading(false);
      return;
    }

    fetchTrialInfo();
  }, [user, subscription, subscriptionLoading, trackPaywallHit]);

  const handleAction = () => {
    if (!trialInfo || !message) return;
    
    trackUpgradeClick("trial_urgency", `day_${trialInfo.trialAge}`);
    
    // Route based on message type
    if (message.cta === "Start First Win") {
      navigate("/palace/floor/1/room/24fps");
    } else if (message.cta === "Try Jeeves") {
      navigate("/jeeves");
    } else {
      navigate("/pricing");
    }
    
    handleDismiss();
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("trial_urgency_dismissed", "true");
  };

  if (loading || !message || dismissed || isChurchMember) return null;

  const urgencyColors = {
    low: "border-primary/30 bg-primary/5",
    medium: "border-amber-500/30 bg-amber-500/5",
    high: "border-orange-500/30 bg-orange-500/5",
    critical: "border-red-500/30 bg-red-500/5 animate-pulse",
  };

  const urgencyIconColors = {
    low: "text-primary bg-primary/20",
    medium: "text-amber-500 bg-amber-500/20",
    high: "text-orange-500 bg-orange-500/20",
    critical: "text-red-500 bg-red-500/20",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed left-4 right-4 md:left-auto md:right-4 md:w-[420px] z-40"
        style={{ top: "calc(var(--app-header-height, 64px) + 0.75rem)" }}
      >
        <div className={`relative rounded-xl p-4 shadow-lg border  ${urgencyColors[message.urgency]}`}>
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="flex gap-3 items-start">
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${urgencyIconColors[message.urgency]}`}>
              {message.icon}
            </div>
            
            <div className="flex-1 min-w-0 pr-6">
              <h3 className="font-semibold text-foreground text-sm mb-0.5">
                {message.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {message.subtitle}
              </p>

              <Button
                onClick={handleAction}
                size="sm"
                className="h-7 text-xs gap-1"
                variant={message.urgency === "critical" ? "destructive" : "default"}
              >
                {message.cta}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}