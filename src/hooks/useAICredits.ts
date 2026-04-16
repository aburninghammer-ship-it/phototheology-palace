import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface AICreditsInfo {
  credits_balance: number;
  lifetime_used: number;
  usage_this_month: number;
  has_unlimited: boolean;
  top_features: Array<{ feature: string; count: number }>;
}

export interface CreditCheck {
  has_credits: boolean;
  credits_needed: number;
  credits_available: number;
  is_premium_only: boolean;
  user_has_unlimited: boolean;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price_cents: number;
  stripe_price_id: string | null;
}

// Feature credit costs — FREE features cost 0 (text-based AI)
// OpenAI HD Audio costs 1 credit, ElevenLabs Premium HD costs 5 credits
// Long-form generation costs credits proportional to compute
export const FEATURE_COSTS: Record<string, number> = {
  // FREE — text-based AI (no credits consumed)
  'jeeves-response': 0,
  'mind-map-analyze': 0,
  'gem-mining': 0,
  'verse-commentary': 0,
  'bible-freestyle': 0,
  'study-buddy': 0,
  'defense-mode': 0,
  'drill': 0,
  'spark': 0,
  'palace-ai': 0,
  'web-research': 0,
  'chapter-commentary-text': 0,

  // STANDARD HD — OpenAI TTS (1 credit each)
  'tts-verse': 1,
  'tts-chapter': 1,
  'tts-commentary-audio': 1,

  // PREMIUM HD — ElevenLabs 8-voice suite (5 credits each)
  'tts-verse-elevenlabs': 5,
  'tts-chapter-elevenlabs': 5,
  'tts-epic-elevenlabs': 5,
  'tts-commentary-audio-elevenlabs': 5,
  'tts-epic': 5,

  // PAID — long-form AI generation
  'infographic': 5,
  'study-guide-ai': 3,
  'study-series-lesson': 15,
  'study-series-outline': 8,
  'sermon-full-generation': 10,
};

export function useAICredits() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [pendingFeature, setPendingFeature] = useState<string | null>(null);

  // Fetch user's credit info
  const {
    data: creditsInfo,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ai-credits", user?.id],
    queryFn: async (): Promise<AICreditsInfo> => {
      if (!user) {
        return {
          credits_balance: 0,
          lifetime_used: 0,
          usage_this_month: 0,
          has_unlimited: false,
          top_features: [],
        };
      }

      // Get usage stats (using type cast since table may not exist in schema yet)
      const { data: stats, error: statsError } = await (supabase as any).rpc(
        "get_ai_usage_stats",
        { user_id_param: user.id }
      );

      if (statsError) {
        console.error("Error fetching AI credits:", statsError);
        // Return defaults if function doesn't exist yet
        return {
          credits_balance: 100,
          lifetime_used: 0,
          usage_this_month: 0,
          has_unlimited: false,
          top_features: [],
        };
      }

      // Check if user has unlimited tier
      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("subscription_tier")
        .eq("user_id", user.id)
        .single();

      const hasUnlimited =
        subscription?.subscription_tier === "unlimited" ||
        subscription?.subscription_tier === "master";

      const statsData = stats?.[0] || stats;

      return {
        credits_balance: statsData?.credits_balance || 100,
        lifetime_used: statsData?.lifetime_used || 0,
        usage_this_month: statsData?.usage_this_month || 0,
        has_unlimited: hasUnlimited,
        top_features: statsData?.top_features || [],
      };
    },
    enabled: !!user,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Fetch available credit packages
  const { data: packages = [] } = useQuery({
    queryKey: ["credit-packages"],
    queryFn: async (): Promise<CreditPackage[]> => {
      // Using type cast since table may not exist in schema yet
      const { data, error } = await (supabase as any)
        .from("ai_credit_packages")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) {
        console.error("Error fetching packages:", error);
        return [];
      }

      return data as CreditPackage[];
    },
    staleTime: 300000, // Cache for 5 minutes
  });

  // Check if user has enough credits for a feature
  const checkCredits = useCallback(
    async (feature: string): Promise<CreditCheck> => {
      if (!user) {
        return {
          has_credits: false,
          credits_needed: FEATURE_COSTS[feature] || 1,
          credits_available: 0,
          is_premium_only: false,
          user_has_unlimited: false,
        };
      }

      // Using type cast since function may not exist in schema yet
      const { data, error } = await (supabase as any).rpc("check_ai_credits", {
        user_id_param: user.id,
        feature_param: feature,
      });

      if (error) {
        console.error("Error checking credits:", error);
        // Fallback to local check
        const needed = FEATURE_COSTS[feature] || 1;
        const available = creditsInfo?.credits_balance || 0;
        return {
          has_credits: creditsInfo?.has_unlimited || available >= needed,
          credits_needed: needed,
          credits_available: available,
          is_premium_only: feature.includes("series"),
          user_has_unlimited: creditsInfo?.has_unlimited || false,
        };
      }

      const result = data?.[0] || data;
      return {
        has_credits: result?.has_credits || false,
        credits_needed: result?.credits_needed || 1,
        credits_available: result?.credits_available || 0,
        is_premium_only: result?.is_premium_only || false,
        user_has_unlimited: result?.user_has_unlimited || false,
      };
    },
    [user, creditsInfo]
  );

  // Deduct credits after AI usage (called by edge functions, but also available client-side)
  const deductCredits = useMutation({
    mutationFn: async ({
      feature,
      inputTokens,
      outputTokens,
      model,
    }: {
      feature: string;
      inputTokens?: number;
      outputTokens?: number;
      model?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Using type cast since function may not exist in schema yet
      const { data, error } = await (supabase as any).rpc("deduct_ai_credits", {
        user_id_param: user.id,
        feature_param: feature,
        input_tokens_param: inputTokens,
        output_tokens_param: outputTokens,
        model_param: model,
      });

      if (error) throw error;

      const result = data?.[0] || data;
      if (!result?.success) {
        throw new Error("Insufficient credits");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-credits"] });
    },
    onError: (error: Error) => {
      if (error.message === "Insufficient credits") {
        setShowPurchaseModal(true);
      }
    },
  });

  // Wrapper to check credits before running an AI feature
  const withCredits = useCallback(
    async <T>(
      feature: string,
      operation: () => Promise<T>,
      options?: { skipDeduction?: boolean }
    ): Promise<T | null> => {
      const cost = FEATURE_COSTS[feature] ?? 1;

      // FREE features — skip credit checks entirely
      if (cost === 0) {
        return await operation();
      }

      const check = await checkCredits(feature);

      if (!check.has_credits) {
        setPendingFeature(feature);
        setShowPurchaseModal(true);
        toast({
          title: "Insufficient Credits",
          description: `You need ${check.credits_needed} credits for this feature. You have ${check.credits_available}.`,
          variant: "destructive",
        });
        return null;
      }

      if (check.is_premium_only && !check.user_has_unlimited) {
        toast({
          title: "Premium Feature",
          description: "This feature requires a premium subscription.",
          variant: "destructive",
        });
        return null;
      }

      try {
        const result = await operation();

        // Deduct credits after successful operation (unless skipped)
        if (!options?.skipDeduction && !check.user_has_unlimited) {
          await deductCredits.mutateAsync({ feature });
        }

        return result;
      } catch (error) {
        console.error("Operation failed:", error);
        throw error;
      }
    },
    [checkCredits, deductCredits, toast]
  );

  // Get cost for a feature
  const getFeatureCost = useCallback((feature: string): number => {
    return FEATURE_COSTS[feature] || 1;
  }, []);

  return {
    creditsInfo,
    isLoading,
    packages,
    checkCredits,
    deductCredits: deductCredits.mutateAsync,
    withCredits,
    getFeatureCost,
    showPurchaseModal,
    setShowPurchaseModal,
    pendingFeature,
    refetch,
  };
}
