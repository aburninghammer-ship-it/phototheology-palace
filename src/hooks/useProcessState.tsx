import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserProcessState {
  id: string;
  user_id: string;
  last_location: string | null;
  last_timestamp: string | null;
  active_process: string | null;
  process_step: number | null;
  process_total_steps: number | null;
  notes: string | null;
  task_type: string | null;
  last_drill_session_id: string | null;
  last_room_mastered: string | null;
  created_at: string;
  updated_at: string;
}

export const useProcessState = () => {
  const queryClient = useQueryClient();

  const { data: processState, isLoading } = useQuery({
    queryKey: ["user-process-state"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_process_state")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as UserProcessState | null;
    },
  });

  const updateProcessState = useMutation({
    mutationFn: async (updates: Partial<UserProcessState>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_process_state")
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-process-state"] });
    },
  });

  const clearProcessState = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_process_state")
        .update({
          active_process: null,
          process_step: null,
          process_total_steps: null,
          notes: null,
          last_drill_session_id: null,
        })
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-process-state"] });
    },
  });

  return {
    processState,
    isLoading,
    updateProcessState: updateProcessState.mutate,
    clearProcessState: clearProcessState.mutate,
    isUpdating: updateProcessState.isPending,
  };
};
