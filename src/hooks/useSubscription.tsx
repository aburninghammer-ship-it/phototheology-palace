import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface ChurchAccess {
  hasChurchAccess: boolean;
  churchId: string | null;
  churchTier: 'tier1' | 'tier2' | 'tier3' | null;
  churchRole: 'admin' | 'leader' | 'member' | null;
}

interface SubscriptionStatus {
  status: 'none' | 'trial' | 'active' | 'cancelled' | 'expired' | 'pending';
  tier: 'free' | 'essential' | 'premium' | 'student' | 'patron' | null;
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

  const loadSubscription = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // First check profile for lifetime access OR active Patreon subscription
      const { data: profile } = await supabase
        .from('profiles')
        .select('has_lifetime_access, subscription_status, subscription_tier, payment_source')
        .eq('id', user.id)
        .single();

      // If user has lifetime access, they're premium and have full access
      if (profile?.has_lifetime_access) {
        setSubscription({
          status: 'active',
          tier: 'premium',
          isStudent: false,
          trialEndsAt: null,
          studentExpiresAt: null,
          promotionalExpiresAt: null,
          hasAccess: true,
          church: {
            hasChurchAccess: false,
            churchId: null,
            churchTier: null,
            churchRole: null,
          },
        });
        setLoading(false);
        return;
      }

      // Check if user has active Patreon subscription (stored in profiles, not user_subscriptions)
      if (profile?.payment_source === 'patreon' && profile?.subscription_status === 'active') {
        console.log('[useSubscription] Active Patreon subscription found in profile');
        setSubscription({
          status: 'active',
          tier: (profile.subscription_tier as SubscriptionStatus['tier']) || 'premium',
          isStudent: false,
          trialEndsAt: null,
          studentExpiresAt: null,
          promotionalExpiresAt: null,
          hasAccess: true,
          church: {
            hasChurchAccess: false,
            churchId: null,
            churchTier: null,
            churchRole: null,
          },
        });
        setLoading(false);
        return;
      }

      // Use secure function to get subscription summary
      const { data: subData, error: subError } = await supabase
        .rpc('get_subscription_summary', { _user_id: user.id });

      // Check church access
      const { data: churchAccess } = await supabase.rpc('has_church_access', {
        _user_id: user.id
      }).single();

      let hasChurchAccess = churchAccess?.has_access || false;

      // Belt-and-suspenders: if RPC says no church access, check preapproved list by email
      if (!hasChurchAccess && user.email) {
        const { data: preapproved } = await supabase
          .from('church_preapproved_members')
          .select('church_id')
          .eq('email', user.email.toLowerCase())
          .limit(1)
          .maybeSingle();

        if (preapproved) {
          console.log('[useSubscription] Email found in church_preapproved_members — granting access');
          hasChurchAccess = true;
        }
      }

      let hasAccessFromDb = false;
      let tierFromDb: SubscriptionStatus['tier'] = 'free';
      let statusFromDb: SubscriptionStatus['status'] = 'none';
      let trialEndsAtFromDb: string | null = null;

      if (subData && subData.length > 0) {
        const sub = subData[0];
        statusFromDb = sub.status as SubscriptionStatus['status'];
        tierFromDb = sub.tier as SubscriptionStatus['tier'];
        trialEndsAtFromDb = sub.trial_ends_at;
        hasAccessFromDb = sub.has_access || false;
      }

      // If database shows active subscription or church access, use that
      if (hasAccessFromDb || hasChurchAccess) {
        // Church members should ALWAYS show as 'active'/'premium' regardless of
        // ANY stale trial/expired status in user_subscriptions or profiles.
        // Church access is the highest priority override.
        const effectiveStatus = hasChurchAccess ? 'active' : statusFromDb;
        const effectiveTier = hasChurchAccess ? 'premium' : tierFromDb;

        setSubscription({
          status: effectiveStatus,
          tier: effectiveTier,
          isStudent: effectiveTier === 'student',
          trialEndsAt: hasChurchAccess ? null : trialEndsAtFromDb,
          studentExpiresAt: null,
          promotionalExpiresAt: null,
          hasAccess: true,
          church: {
            hasChurchAccess,
            churchId: churchAccess?.church_id || null,
            churchTier: churchAccess?.church_tier as any || null,
            churchRole: churchAccess?.role as any || null,
          },
        });
        setLoading(false);
        return;
      }

      // FALLBACK: Check Stripe directly for users who may have paid but DB isn't synced
      // This catches cases where webhook failed to update database
      try {
        console.log('[useSubscription] DB shows no access, checking Stripe directly...');
        const { data: stripeCheck, error: stripeError } = await supabase.functions.invoke(
          'check-stripe-subscription'
        );

        if (!stripeError && stripeCheck?.subscribed) {
          console.log('[useSubscription] Stripe shows active subscription!', stripeCheck);
          setSubscription({
            status: stripeCheck.status === 'trialing' ? 'trial' : 'active',
            tier: stripeCheck.tier || 'premium',
            isStudent: stripeCheck.tier === 'student',
            trialEndsAt: stripeCheck.subscription_end,
            studentExpiresAt: null,
            promotionalExpiresAt: null,
            hasAccess: true,
            church: {
              hasChurchAccess: false,
              churchId: null,
              churchTier: null,
              churchRole: null,
            },
          });
          setLoading(false);
          return;
        }
      } catch (stripeCheckError) {
        console.error('[useSubscription] Stripe check failed:', stripeCheckError);
        // Continue with database result if Stripe check fails
      }

      // FALLBACK 2: Check Patreon connections directly for users who may have connected but profile wasn't updated
      try {
        console.log('[useSubscription] Checking Patreon connections directly...');
        const { data: patreonConnection, error: patreonError } = await supabase
          .from('patreon_connections')
          .select('is_active_patron, entitled_cents, patreon_name')
          .eq('user_id', user.id)
          .maybeSingle();

        // Minimum pledge: $15/month = 1500 cents
        const MINIMUM_PLEDGE_CENTS = 1500;
        if (!patreonError && patreonConnection?.is_active_patron && patreonConnection.entitled_cents >= MINIMUM_PLEDGE_CENTS) {
          console.log('[useSubscription] Active Patreon found in connections!', patreonConnection);

          // Update user_subscriptions table (where subscription data now lives)
          await supabase
            .from('user_subscriptions')
            .upsert({
              user_id: user.id,
              subscription_tier: 'premium',
              subscription_status: 'active',
              payment_source: 'patreon',
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

          // Also update profiles table for backwards compatibility
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'active',
              subscription_tier: 'premium',
              payment_source: 'patreon',
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

          setSubscription({
            status: 'active',
            tier: 'premium',
            isStudent: false,
            trialEndsAt: null,
            studentExpiresAt: null,
            promotionalExpiresAt: null,
            hasAccess: true,
            church: {
              hasChurchAccess: false,
              churchId: null,
              churchTier: null,
              churchRole: null,
            },
          });
          setLoading(false);
          return;
        }
      } catch (patreonCheckError) {
        console.error('[useSubscription] Patreon check failed:', patreonCheckError);
      }

      // No subscription found anywhere
      setSubscription({
        status: statusFromDb || 'none',
        tier: tierFromDb || 'free',
        isStudent: false,
        trialEndsAt: trialEndsAtFromDb,
        studentExpiresAt: null,
        promotionalExpiresAt: null,
        hasAccess: hasChurchAccess,
        church: {
          hasChurchAccess,
          churchId: churchAccess?.church_id || null,
          churchTier: churchAccess?.church_tier as any || null,
          churchRole: churchAccess?.role as any || null,
        },
      });
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setLoading(false);
    }
  }, [user, loadSubscription]);

  const refreshSubscription = useCallback(() => {
    loadSubscription();
  }, [loadSubscription]);

  return { subscription, loading, refreshSubscription };
}