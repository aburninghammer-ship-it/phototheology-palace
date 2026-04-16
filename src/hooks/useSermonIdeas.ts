import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface SermonIdea {
  id: string;
  title: string;
  scripture: string;
  keyPoints: string;
  notes: string;
  created_at: string;
  updated_at: string;
  jeevesResearch?: string;
}

export const useSermonIdeas = () => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<SermonIdea[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIdeas = useCallback(async () => {
    if (!user) {
      setIdeas([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("sermon_ideas")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load sermon ideas:", error);
    } else if (data) {
      setIdeas(
        data.map((row) => ({
          id: row.id,
          title: row.title || "",
          scripture: (row as any).scripture || "",
          keyPoints: (row as any).key_points || "",
          notes: (row as any).notes || "",
          created_at: row.created_at,
          updated_at: row.updated_at,
          jeevesResearch: (row as any).jeeves_research || undefined,
        }))
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  const addIdea = useCallback(
    async (idea: Omit<SermonIdea, "id" | "created_at" | "updated_at">) => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("sermon_ideas")
        .insert([
          {
            user_id: user.id,
            title: idea.title || null,
            scripture: idea.scripture || null,
            key_points: idea.keyPoints || null,
            notes: idea.notes || null,
          } as any,
        ])
        .select()
        .single();

      if (error) {
        console.error("Failed to add sermon idea:", error);
        return null;
      }

      await loadIdeas();
      return data;
    },
    [user, loadIdeas]
  );

  const updateIdea = useCallback(
    async (
      id: string,
      fields: Partial<Omit<SermonIdea, "id" | "created_at" | "updated_at">>
    ) => {
      if (!user) return;

      const updatePayload: any = {};
      if (fields.title !== undefined) updatePayload.title = fields.title || null;
      if (fields.scripture !== undefined) updatePayload.scripture = fields.scripture || null;
      if (fields.keyPoints !== undefined) updatePayload.key_points = fields.keyPoints || null;
      if (fields.notes !== undefined) updatePayload.notes = fields.notes || null;

      const { error } = await supabase
        .from("sermon_ideas")
        .update(updatePayload)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to update sermon idea:", error);
        return;
      }

      await loadIdeas();
    },
    [user, loadIdeas]
  );

  const deleteIdea = useCallback(
    async (id: string) => {
      if (!user) return;

      const { error } = await supabase
        .from("sermon_ideas")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to delete sermon idea:", error);
        return;
      }

      await loadIdeas();
    },
    [user, loadIdeas]
  );

  const saveResearch = useCallback(
    async (id: string, research: string) => {
      if (!user) return;

      const { error } = await supabase
        .from("sermon_ideas")
        .update({ jeeves_research: research } as any)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to save research:", error);
        return;
      }

      await loadIdeas();
    },
    [user, loadIdeas]
  );

  return {
    ideas,
    addIdea,
    updateIdea,
    deleteIdea,
    saveResearch,
    loading,
    isOnline: true,
  };
};
