import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Clock, Sparkles, Crown } from "lucide-react";
import { differenceInDays, differenceInHours } from "date-fns";

interface TrialUpgradePromptProps {
  variant?: 'banner' | 'modal' | 'inline';
  onDismiss?: () => void;
}

export function TrialUpgradePrompt({ variant = 'banner', onDismiss }: TrialUpgradePromptProps) {
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { isMember: isChurchMember } = useChurchMembership();
  const navigate = useNavigate();
  const [trialInfo, setTrialInfo] = useState<{ daysLeft: number; hoursLeft: number; isExpired: boolean } | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || subscriptionLoading) {
      return;
    }

    // If user has any form of paid access, don't show trial prompts
    // This respects the Stripe fallback check in useSubscription
    if (subscription.hasAccess) {
      setTrialInfo(null);
      setLoading(false);
      return;
    }

    // CRITICAL: Double-check subscription status is actually 'trial' 
    // If status is 'active', 'patron', or user has church access, skip trial prompts
    if (subscription.status === 'active' || subscription.tier === 'patron' || subscription.church.hasChurchAccess) {
      setTrialInfo(null);
      setLoading(false);
      return;
    }

    const checkTrial = async () => {
      // First, check the profile for any indicators of paid access
      const { data: profileData } = await supabase
        .from('profiles')
        .select('has_lifetime_access, subscription_status, subscription_tier, payment_source, stripe_subscription_id')
        .eq('id', user.id)
        .maybeSingle();

      // CRITICAL: Check ALL indicators of paid access from the profile
      if (profileData?.has_lifetime_access) {
        console.log('[TrialUpgradePrompt] User has lifetime access, hiding trial prompt');
        setTrialInfo(null);
        setLoading(false);
        return;
      }

      if (profileData?.subscription_status === 'active' && profileData?.subscription_tier && profileData.subscription_tier !== 'free') {
        console.log('[TrialUpgradePrompt] User has active subscription in profile, hiding trial prompt');
        setTrialInfo(null);
        setLoading(false);
        return;
      }

      if (profileData?.stripe_subscription_id) {
        console.log('[TrialUpgradePrompt] User has Stripe subscription ID, hiding trial prompt');
        setTrialInfo(null);
        setLoading(false);
        return;
      }

      if (profileData?.payment_source && !['trial', 'none', ''].includes(profileData.payment_source)) {
        console.log('[TrialUpgradePrompt] User has paid payment_source:', profileData.payment_source);
        setTrialInfo(null);
        setLoading(false);
        return;
      }

      // Now check for trial end date
      const { data } = await supabase
        .from('user_subscriptions')
        .select('subscription_status, trial_ends_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data?.subscription_status === 'trial' && data.trial_ends_at) {
        const endDate = new Date(data.trial_ends_at);
        const now = new Date();
        const daysLeft = differenceInDays(endDate, now);
        const hoursLeft = differenceInHours(endDate, now);
        const isExpired = endDate < now;

        setTrialInfo({ daysLeft, hoursLeft, isExpired });
      } else {
        setTrialInfo(null);
      }
      setLoading(false);
    };

    checkTrial();
  }, [user, subscription, subscriptionLoading]);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
    // Store dismissal for this session
    sessionStorage.setItem('trial_prompt_dismissed', 'true');
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  // Don't show if loading, no trial, dismissed, church member, or already dismissed this session
  if (loading || !trialInfo || dismissed || isChurchMember || sessionStorage.getItem('trial_prompt_dismissed')) {
    return null;
  }

  // Don't show for users with more than 10 days left (only show urgency)
  if (trialInfo.daysLeft > 10 && variant === 'banner') {
    return null;
  }

  const getUrgencyColor = () => {
    if (trialInfo.isExpired) return 'bg-red-500/10 border-red-500/30 text-red-400';
    if (trialInfo.daysLeft <= 1) return 'bg-red-500/10 border-red-500/30 text-red-400';
    if (trialInfo.daysLeft <= 3) return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
    return 'bg-primary/10 border-primary/30 text-primary';
  };

  const getMessage = () => {
    if (trialInfo.isExpired) {
      return "Your trial has expired. Upgrade now to restore access to all features.";
    }
    if (trialInfo.daysLeft === 0) {
      return `Only ${trialInfo.hoursLeft} hours left! Don't lose your progress.`;
    }
    if (trialInfo.daysLeft === 1) {
      return "Your trial ends tomorrow! Upgrade now to keep your access.";
    }
    if (trialInfo.daysLeft <= 3) {
      return `${trialInfo.daysLeft} days left in your trial. Upgrade to unlock everything.`;
    }
    return `${trialInfo.daysLeft} days left in your trial. Enjoying the Palace?`;
  };

  if (variant === 'inline') {
    return (
      <div className={`rounded-lg border p-3 ${getUrgencyColor()}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{getMessage()}</span>
          </div>
          <Button size="sm" onClick={handleUpgrade} className="shrink-0">
            <Crown className="h-3 w-3 mr-1" />
            Upgrade
          </Button>
        </div>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 ">
        <Card className="max-w-md mx-4 border-primary/30">
          <CardContent className="pt-6">
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              
              <div>
                <Badge variant={trialInfo.daysLeft <= 3 ? "destructive" : "secondary"} className="mb-2">
                  {trialInfo.isExpired ? 'Trial Expired' : `${trialInfo.daysLeft} days left`}
                </Badge>
                <h3 className="text-xl font-bold">Unlock Your Full Potential</h3>
                <p className="text-muted-foreground mt-2">{getMessage()}</p>
              </div>

              <div className="space-y-2 text-left bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium">Premium includes:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ All 8 Palace Floors</li>
                  <li>✓ Unlimited Jeeves AI conversations</li>
                  <li>✓ Daily challenges & drills</li>
                  <li>✓ Bible study generator</li>
                  <li>✓ Community features</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={handleDismiss} className="flex-1">
                  Maybe Later
                </Button>
                <Button onClick={handleUpgrade} className="flex-1">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Banner variant (default)
  return (
    <div className={`w-full py-2 px-4 ${getUrgencyColor()} border-b`}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">{getMessage()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={handleUpgrade}>
            <Crown className="h-3 w-3 mr-1" />
            Upgrade
          </Button>
          <button 
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
