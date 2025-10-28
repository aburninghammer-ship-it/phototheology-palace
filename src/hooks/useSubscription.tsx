import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface ChurchAccess {
  hasChurchAccess: boolean;
  churchId: string | null;
  churchTier: 'tier1' | 'tier2' | 'tier3' | null;
  churchRole: 'admin' | 'leader' | 'member' | null;
}

interface SubscriptionStatus {
  status: 'none' | 'trial' | 'active' | 'cancelled' | 'expired';
  tier: 'free' | 'essential' | 'premium' | 'student' | null;
  isStudent: boolean;
  trialEndsAt: string | null;
  studentExpiresAt: string | null;
  promotionalExpiresAt: string | null;
  hasAccess: boolean;
  church: ChurchAccess;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    status: 'none',
    tier: null,
    isStudent: false,
    trialEndsAt: null,
    studentExpiresAt: null,
    promotionalExpiresAt: null,
    hasAccess: false,
    church: {
      hasChurchAccess: false,
      churchId: null,
      churchTier: null,
      churchRole: null,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, subscription_tier, trial_ends_at, is_student, student_expires_at, has_lifetime_access, promotional_access_expires_at")
        .eq("id", user!.id)
        .single();

      // Check church access
      const { data: churchAccess } = await supabase.rpc('has_church_access', {
        _user_id: user!.id
      }).single();

      if (profile) {
        const now = new Date();
        const trialValid = profile.trial_ends_at && new Date(profile.trial_ends_at) > now;
        const studentValid = profile.is_student && profile.student_expires_at && new Date(profile.student_expires_at) > now;
        const promotionalValid = profile.promotional_access_expires_at && new Date(profile.promotional_access_expires_at) > now;
        
        // Church access overrides individual subscription
        const hasPersonalAccess = profile.has_lifetime_access || profile.subscription_status === 'active' || trialValid || studentValid || promotionalValid;
        const hasChurchAccess = churchAccess?.has_access || false;
        
        setSubscription({
          status: (profile.subscription_status as any) || 'none',
          tier: (profile.subscription_tier as any) || null,
          isStudent: profile.is_student || false,
          trialEndsAt: profile.trial_ends_at,
          studentExpiresAt: profile.student_expires_at,
          promotionalExpiresAt: profile.promotional_access_expires_at,
          hasAccess: hasPersonalAccess || hasChurchAccess,
          church: {
            hasChurchAccess,
            churchId: churchAccess?.church_id || null,
            churchTier: churchAccess?.church_tier as any || null,
            churchRole: churchAccess?.role as any || null,
          },
        });
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = () => {
    loadSubscription();
  };

  return { subscription, loading, refreshSubscription };
}
