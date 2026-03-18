import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface DailyAudioDevotional {
  id: string;
  day_number: number;
  title: string;
  scripture_reference: string;
  scripture_text: string | null;
  devotional_text: string;
  prayer: string | null;
  audio_url: string | null;
  audio_duration_seconds: number | null;
  status: string;
}

export interface DevotionalSmsSubscription {
  id: string;
  user_id: string;
  phone_number: string;
  phone_country_code: string;
  timezone: string;
  preferred_send_hour: number;
  is_active: boolean;
  current_day: number;
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function useTodayDevotional() {
  const dayOfYear = getDayOfYear();

  return useQuery({
    queryKey: ["daily-audio-devotional", dayOfYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_audio_devotionals")
        .select("*")
        .eq("day_number", dayOfYear)
        .eq("status", "ready")
        .single();

      if (error) {
        // Fallback: get any ready devotional
        const { data: fallback } = await supabase
          .from("daily_audio_devotionals")
          .select("*")
          .eq("status", "ready")
          .order("day_number", { ascending: true })
          .limit(1)
          .single();
        return (fallback as unknown as DailyAudioDevotional) || null;
      }
      return data as unknown as DailyAudioDevotional;
    },
  });
}

export function useDevotionalSmsSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["devotional-sms-subscription", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_devotional_sms_subscribers")
        .select("*")
        .eq("user_id", user!.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return (data as unknown as DevotionalSmsSubscription) || null;
    },
    enabled: !!user,
  });

  const subscribe = useMutation({
    mutationFn: async (params: {
      phoneNumber: string;
      phoneCountryCode?: string;
      timezone?: string;
      preferredSendHour?: number;
    }) => {
      const { data, error } = await supabase
        .from("daily_devotional_sms_subscribers")
        .upsert({
          user_id: user!.id,
          phone_number: params.phoneNumber,
          phone_country_code: params.phoneCountryCode || "+1",
          timezone: params.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          preferred_send_hour: params.preferredSendHour ?? 7,
          is_active: true,
          current_day: getDayOfYear(),
        }, { onConflict: "user_id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotional-sms-subscription"] });
      toast.success("You're subscribed! Daily devotionals will be sent to your phone.");
    },
    onError: (error) => {
      toast.error("Failed to subscribe");
      console.error(error);
    },
  });

  const unsubscribe = useMutation({
    mutationFn: async () => {
      if (!subscription) return;
      const { error } = await supabase
        .from("daily_devotional_sms_subscribers")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotional-sms-subscription"] });
      toast.success("SMS devotionals paused");
    },
  });

  return { subscription, isLoading, subscribe, unsubscribe };
}
