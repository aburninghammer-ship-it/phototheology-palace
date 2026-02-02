import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface ProfileDevotion {
  id: string;
  profile_id: string;
  user_id: string;
  title: string;
  scripture_reference: string;
  scripture_text: string;
  devotional_body: string;
  strike_line: string | null;
  prayer: string | null;
  memory_hook: string | null;
  sanctuary_connection: string | null;
  cycle_placement: string | null;
  types_and_symbols: string[] | null;
  cross_references: string[] | null;
  christ_name: string | null;
  christ_action: string | null;
  application: string | null;
  theme_used: string | null;
  generated_at: string;
  created_at: string;
  is_shared: boolean;
  shared_at: string | null;
}

export function useProfileDevotions(profileId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all devotions for a profile
  const { data: devotions, isLoading } = useQuery({
    queryKey: ["profile-devotions", profileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_devotions")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProfileDevotion[];
    },
    enabled: !!profileId && !!user?.id,
  });

  // Save a new devotion
  const saveDevotion = useMutation({
    mutationFn: async (devotion: {
      title: string;
      scripture_reference: string;
      scripture_text: string;
      devotional_body: string;
      strike_line?: string;
      prayer?: string;
      memory_hook?: string;
      sanctuary_connection?: string;
      cycle_placement?: string;
      types_and_symbols?: string[];
      cross_references?: string[];
      christ_name?: string;
      christ_action?: string;
      application?: string;
      theme_used?: string;
      generated_at?: string;
    }) => {
      const { data, error } = await supabase
        .from("profile_devotions")
        .insert({
          profile_id: profileId,
          user_id: user?.id,
          ...devotion,
        })
        .select()
        .single();

      if (error) throw error;
      return data as ProfileDevotion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-devotions", profileId] });
      toast.success("Devotion saved!");
    },
    onError: (error) => {
      console.error("Error saving devotion:", error);
      toast.error("Failed to save devotion");
    },
  });

  // Delete a devotion
  const deleteDevotion = useMutation({
    mutationFn: async (devotionId: string) => {
      const { error } = await supabase
        .from("profile_devotions")
        .delete()
        .eq("id", devotionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-devotions", profileId] });
      toast.success("Devotion deleted");
    },
  });

  // Mark a devotion as shared
  const markAsShared = useMutation({
    mutationFn: async (devotionId: string) => {
      const { error } = await supabase
        .from("profile_devotions")
        .update({
          is_shared: true,
          shared_at: new Date().toISOString(),
        })
        .eq("id", devotionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-devotions", profileId] });
    },
  });

  return {
    devotions,
    isLoading,
    saveDevotion,
    deleteDevotion,
    markAsShared,
    isSaving: saveDevotion.isPending,
  };
}
