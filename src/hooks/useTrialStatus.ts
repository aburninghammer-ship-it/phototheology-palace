import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays, differenceInHours } from "date-fns";

interface TrialStatus {
  isOnTrial: boolean;
  daysLeft: number;
  hoursLeft: number;
  isExpired: boolean;
  isExpiringSoon: boolean; // 3 days or less
  trialEndsAt: Date | null;
}

export function useTrialStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<TrialStatus>({
    isOnTrial: false,
    daysLeft: 0,
    hoursLeft: 0,
    isExpired: false,
    isExpiringSoon: false,
    trialEndsAt: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkTrial = async () => {
      // First do a direct Stripe check to see if they have an active subscription
      try {
        const { data: stripeCheck } = await supabase.functions.invoke('check-stripe-subscription');
        if (stripeCheck?.subscribed) {
          // User has active Stripe subscription - NOT on trial
          setStatus({
            isOnTrial: false,
            daysLeft: 0,
            hoursLeft: 0,
            isExpired: false,
            isExpiringSoon: false,
            trialEndsAt: null,
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        // Continue with database check if Stripe check fails
        console.debug('[useTrialStatus] Stripe check failed, using DB', e);
      }

      // Fallback: check profile for lifetime or active paid subscription
      const { data: profile } = await supabase
        .from('profiles')
        .select('has_lifetime_access, subscription_status, subscription_tier')
        .eq('id', user.id)
        .single();

      // Users with lifetime access or active paid subscriptions are NOT on trial
      if (profile?.has_lifetime_access || 
          (profile?.subscription_status === 'active' && profile?.subscription_tier)) {
        setStatus({
          isOnTrial: false,
          daysLeft: 0,
          hoursLeft: 0,
          isExpired: false,
          isExpiringSoon: false,
          trialEndsAt: null,
        });
        setLoading(false);
        return;
      }

      // Check church membership — church members are NOT on trial
      const { data: churchAccess } = await supabase
        .rpc('has_church_access', { _user_id: user.id });

      if (churchAccess && churchAccess.length > 0 && churchAccess[0].has_access) {
        setStatus({
          isOnTrial: false,
          daysLeft: 0,
          hoursLeft: 0,
          isExpired: false,
          isExpiringSoon: false,
          trialEndsAt: null,
        });
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('user_subscriptions')
        .select('subscription_status, trial_ends_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data?.subscription_status === 'trial' && data.trial_ends_at) {
        const endDate = new Date(data.trial_ends_at);
        const now = new Date();
        const daysLeft = Math.max(0, differenceInDays(endDate, now));
        const hoursLeft = Math.max(0, differenceInHours(endDate, now));
        const isExpired = endDate < now;

        setStatus({
          isOnTrial: true,
          daysLeft,
          hoursLeft,
          isExpired,
          isExpiringSoon: daysLeft <= 3 && !isExpired,
          trialEndsAt: endDate,
        });
      } else {
        setStatus({
          isOnTrial: false,
          daysLeft: 0,
          hoursLeft: 0,
          isExpired: false,
          isExpiringSoon: false,
          trialEndsAt: null,
        });
      }
      setLoading(false);
    };

    checkTrial();
  }, [user]);

  return { ...status, loading };
}
