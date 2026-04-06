import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type VoiceQualityTier = 'standard' | 'hd' | 'premium';

export interface VoiceQualityConfig {
  tier: VoiceQualityTier;
  label: string;
  description: string;
  provider: 'browser' | 'openai' | 'elevenlabs';
  creditCost: number;
  icon: string;
}

export const VOICE_QUALITY_TIERS: VoiceQualityConfig[] = [
  {
    tier: 'standard',
    label: 'Standard',
    description: 'Browser voice — free',
    provider: 'browser',
    creditCost: 0,
    icon: '🔊',
  },
  {
    tier: 'hd',
    label: 'HD',
    description: 'OpenAI voices — 1 credit',
    provider: 'openai',
    creditCost: 1,
    icon: '🎧',
  },
  {
    tier: 'premium',
    label: 'Premium HD',
    description: 'ElevenLabs studio — 5 credits',
    provider: 'elevenlabs',
    creditCost: 5,
    icon: '👑',
  },
];

const STORAGE_KEY = 'pt-voice-quality-tier';

function getStoredTier(): VoiceQualityTier {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'standard' || stored === 'hd' || stored === 'premium') return stored;
  } catch {}
  return 'standard';
}

export function useVoiceQuality() {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState<VoiceQualityTier>(getStoredTier);

  const setTier = useCallback((tier: VoiceQualityTier) => {
    setSelectedTier(tier);
    try { localStorage.setItem(STORAGE_KEY, tier); } catch {}
  }, []);

  const getConfig = useCallback((): VoiceQualityConfig => {
    return VOICE_QUALITY_TIERS.find(t => t.tier === selectedTier) || VOICE_QUALITY_TIERS[0];
  }, [selectedTier]);

  /**
   * Check if user can use the selected tier (has credits or is premium).
   * Returns true if allowed, false if should fall back.
   */
  const canUseTier = useCallback(async (tier: VoiceQualityTier): Promise<boolean> => {
    if (tier === 'standard') return true;
    if (!user) return false;

    try {
      // Check subscription status
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

      const isPremium = profile?.subscription_status === 'active' || profile?.subscription_status === 'trial';

      if (isPremium) {
        // Premium users: HD is included, Premium HD check credit balance
        if (tier === 'hd') return true;
        // For premium HD, check if they have unlimited or enough credits
        const { data: balance } = await supabase
          .from('ai_credit_balances')
          .select('credits_balance, has_unlimited')
          .eq('user_id', user.id)
          .single();

        if (balance?.has_unlimited) return true;
        const config = VOICE_QUALITY_TIERS.find(t => t.tier === tier);
        return (balance?.credits_balance || 0) >= (config?.creditCost || 0);
      }

      // Free users: check credit balance for any paid tier
      const { data: balance } = await supabase
        .from('ai_credit_balances')
        .select('credits_balance, has_unlimited')
        .eq('user_id', user.id)
        .single();

      if (balance?.has_unlimited) return true;
      const config = VOICE_QUALITY_TIERS.find(t => t.tier === tier);
      return (balance?.credits_balance || 0) >= (config?.creditCost || 0);
    } catch {
      return false;
    }
  }, [user]);

  return {
    selectedTier,
    setTier,
    getConfig,
    canUseTier,
    isLoggedIn: !!user,
  };
}
