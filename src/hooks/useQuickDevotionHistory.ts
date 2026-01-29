import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface QuickDevotionHistoryItem {
  id: string;
  user_id: string;
  theme: string;
  description: string | null;
  depth_level: string;
  writing_style: string;
  devotion_content: string;
  scripture_reference: string | null;
  created_at: string;
}

export function useQuickDevotionHistory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's quick devotion history
  const { data: history, isLoading } = useQuery({
    queryKey: ["quick-devotion-history", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quick_devotion_history")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as QuickDevotionHistoryItem[];
    },
    enabled: !!user?.id,
  });

  // Save a new quick devotion to history
  const saveToHistory = useMutation({
    mutationFn: async (data: {
      theme: string;
      description?: string;
      depth_level: string;
      writing_style: string;
      devotion_content: string;
      scripture_reference?: string;
    }) => {
      const { data: saved, error } = await supabase
        .from("quick_devotion_history")
        .insert({
          user_id: user?.id,
          theme: data.theme,
          description: data.description || null,
          depth_level: data.depth_level,
          writing_style: data.writing_style,
          devotion_content: data.devotion_content,
          scripture_reference: data.scripture_reference || null,
        })
        .select()
        .single();

      if (error) throw error;
      return saved;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quick-devotion-history"] });
    },
  });

  // Delete a history item
  const deleteFromHistory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("quick_devotion_history")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quick-devotion-history"] });
    },
  });

  return {
    history,
    isLoading,
    saveToHistory,
    deleteFromHistory,
  };
}
