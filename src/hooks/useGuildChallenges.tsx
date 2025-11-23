import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface GuildChallenge {
  id: string;
  guild_id: string;
  room_id: string;
  challenge_title: string;
  challenge_description: string | null;
  target_completions: number;
  current_completions: number;
  starts_at: string;
  ends_at: string;
  reward_xp: number;
  created_at: string;
  is_completed: boolean;
  has_completed?: boolean;
}

export const useGuildChallenges = (guildId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: challenges, isLoading } = useQuery({
    queryKey: ["guild-challenges", guildId],
    queryFn: async () => {
      if (!guildId) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: challengesData, error } = await supabase
        .from("guild_challenges")
        .select("*")
        .eq("guild_id", guildId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Check which challenges the user has completed
      const { data: participations } = await supabase
        .from("guild_challenge_participation")
        .select("challenge_id")
        .eq("user_id", user.id);

      const completedIds = new Set(participations?.map(p => p.challenge_id) || []);

      return challengesData.map(challenge => ({
        ...challenge,
        has_completed: completedIds.has(challenge.id),
      })) as GuildChallenge[];
    },
    enabled: !!guildId,
  });

  const createChallenge = useMutation({
    mutationFn: async (challengeData: {
      guild_id: string;
      room_id: string;
      challenge_title: string;
      challenge_description: string;
      target_completions: number;
      starts_at: string;
      ends_at: string;
      reward_xp: number;
    }) => {
      const { data, error } = await supabase
        .from("guild_challenges")
        .insert(challengeData)
        .select()
        .single();

      if (error) throw error;

      // Create activity
      await supabase.from("guild_activities").insert({
        guild_id: challengeData.guild_id,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        activity_type: "challenge_created",
        activity_data: {
          challenge_id: data.id,
          challenge_title: challengeData.challenge_title,
        },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guild-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["guild-activities"] });
      toast({
        title: "🎯 Challenge Created!",
        description: "Guild members can now start working on this challenge.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create challenge",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const completeChallenge = useMutation({
    mutationFn: async ({ challengeId, xpEarned }: { challengeId: string; xpEarned: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("guild_challenge_participation")
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
          xp_earned: xpEarned,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guild-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["guild-activities"] });
      queryClient.invalidateQueries({ queryKey: ["guild-leaderboard"] });
      toast({
        title: "✅ Challenge Completed!",
        description: "You've earned XP for your guild.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to complete challenge",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    challenges,
    isLoading,
    createChallenge: createChallenge.mutate,
    completeChallenge: completeChallenge.mutate,
    isCreating: createChallenge.isPending,
    isCompleting: completeChallenge.isPending,
  };
};
