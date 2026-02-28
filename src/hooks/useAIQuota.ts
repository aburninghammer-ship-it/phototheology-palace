import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface QuotaResult {
  allowed: boolean;
  is_premium: boolean;
  current_usage?: number;
  daily_limit?: number;
  remaining?: number;
  message?: string;
}

interface QuotaState {
  jeeves: QuotaResult | null;
  image: QuotaResult | null;
  tts: QuotaResult | null;
}

// Daily limits for free users — generous defaults
const FREE_TIER_LIMITS = {
  jeeves: 100,  // 100 Jeeves calls per day (text AI is cheap)
  image: 10,    // 10 image generations per day
  tts: 30,      // 30 TTS requests per day
};

export function useAIQuota() {
  const { user } = useAuth();
  const [quotaState, setQuotaState] = useState<QuotaState>({
    jeeves: null,
    image: null,
    tts: null,
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkAndIncrementQuota = useCallback(async (
    quotaType: 'jeeves' | 'image' | 'tts'
  ): Promise<QuotaResult> => {
    if (!user) {
      // Not logged in - allow but don't track
      return { allowed: true, is_premium: false, remaining: -1 };
    }

    setIsChecking(true);
    try {
      const { data, error } = await (supabase as any).rpc('check_and_increment_ai_quota', {
        p_user_id: user.id,
        p_quota_type: quotaType,
        p_daily_limit: FREE_TIER_LIMITS[quotaType],
      });

      if (error) {
        console.error('Quota check error:', error);
        // On error, allow the request (fail open)
        return { allowed: true, is_premium: false, remaining: -1 };
      }

      const result = data as QuotaResult;
      setQuotaState(prev => ({ ...prev, [quotaType]: result }));
      return result;
    } catch (err) {
      console.error('Quota check failed:', err);
      return { allowed: true, is_premium: false, remaining: -1 };
    } finally {
      setIsChecking(false);
    }
  }, [user]);

  const getQuotaStatus = useCallback(async (): Promise<QuotaState> => {
    if (!user) {
      return { jeeves: null, image: null, tts: null };
    }

    // Fetch current usage without incrementing
    try {
      const { data, error } = await (supabase as any)
        .from('ai_usage_quotas')
        .select('jeeves_calls, image_generations, tts_requests')
        .eq('user_id', user.id)
        .eq('usage_date', new Date().toISOString().split('T')[0])
        .maybeSingle();
      
      const usageData = data as { jeeves_calls: number; image_generations: number; tts_requests: number } | null;

      if (error || !usageData) {
        return {
          jeeves: { allowed: true, is_premium: false, current_usage: 0, daily_limit: FREE_TIER_LIMITS.jeeves, remaining: FREE_TIER_LIMITS.jeeves },
          image: { allowed: true, is_premium: false, current_usage: 0, daily_limit: FREE_TIER_LIMITS.image, remaining: FREE_TIER_LIMITS.image },
          tts: { allowed: true, is_premium: false, current_usage: 0, daily_limit: FREE_TIER_LIMITS.tts, remaining: FREE_TIER_LIMITS.tts },
        };
      }

      // Check if premium
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

      const isPremium = profile?.subscription_status === 'active' || profile?.subscription_status === 'trial';

      const state: QuotaState = {
        jeeves: {
          allowed: isPremium || usageData.jeeves_calls < FREE_TIER_LIMITS.jeeves,
          is_premium: isPremium,
          current_usage: usageData.jeeves_calls,
          daily_limit: FREE_TIER_LIMITS.jeeves,
          remaining: isPremium ? -1 : FREE_TIER_LIMITS.jeeves - usageData.jeeves_calls,
        },
        image: {
          allowed: isPremium || usageData.image_generations < FREE_TIER_LIMITS.image,
          is_premium: isPremium,
          current_usage: usageData.image_generations,
          daily_limit: FREE_TIER_LIMITS.image,
          remaining: isPremium ? -1 : FREE_TIER_LIMITS.image - usageData.image_generations,
        },
        tts: {
          allowed: isPremium || usageData.tts_requests < FREE_TIER_LIMITS.tts,
          is_premium: isPremium,
          current_usage: usageData.tts_requests,
          daily_limit: FREE_TIER_LIMITS.tts,
          remaining: isPremium ? -1 : FREE_TIER_LIMITS.tts - usageData.tts_requests,
        },
      };

      setQuotaState(state);
      return state;
    } catch (err) {
      console.error('Failed to get quota status:', err);
      return { jeeves: null, image: null, tts: null };
    }
  }, [user]);

  return {
    quotaState,
    isChecking,
    checkAndIncrementQuota,
    getQuotaStatus,
    limits: FREE_TIER_LIMITS,
  };
}
