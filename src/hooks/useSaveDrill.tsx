import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface DrillSessionData {
  verse_reference: string;
  verse_text?: string;
  mode: string;
  drill_type: string;
  difficulty?: string;
  drill_data?: Record<string, any>;
  floor_number?: number;
  room_id?: string;
}

export interface SavedDrillSession {
  id: string;
  user_id: string;
  verse_reference: string;
  verse_text?: string;
  mode: string;
  name?: string;
  drill_data: Record<string, any>;
  created_at: string;
  completed_at?: string;
}

export const useSaveDrill = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const saveDrillSession = async (
    data: DrillSessionData,
    name?: string,
    isCompleted: boolean = false
  ): Promise<string | null> => {
    if (!user) {
      toast.error("Please sign in to save drills");
      return null;
    }

    setSaving(true);
    try {
      const { data: result, error } = await supabase
        .from("drill_sessions" as any)
        .insert({
          user_id: user.id,
          verse_reference: data.verse_reference,
          verse_text: data.verse_text,
          mode: data.mode,
          name: name || `${data.mode} - ${data.verse_reference}`,
          drill_data: {
            drill_type: data.drill_type,
            difficulty: data.difficulty,
            floor_number: data.floor_number,
            room_id: data.room_id,
            ...data.drill_data,
          },
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .select("id")
        .single();

      if (error) throw error;

      toast.success("Drill saved successfully!");
      return (result as any)?.id || null;
    } catch (error) {
      console.error("Error saving drill:", error);
      toast.error("Failed to save drill");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateDrillSession = async (
    sessionId: string,
    updates: Partial<DrillSessionData & { name?: string; completed_at?: string }>
  ): Promise<boolean> => {
    if (!user) {
      toast.error("Please sign in to update drills");
      return false;
    }

    setSaving(true);
    try {
      const updateData: Record<string, any> = {};
      
      if (updates.verse_reference) updateData.verse_reference = updates.verse_reference;
      if (updates.verse_text !== undefined) updateData.verse_text = updates.verse_text;
      if (updates.mode) updateData.mode = updates.mode;
      if (updates.name) updateData.name = updates.name;
      if (updates.completed_at) updateData.completed_at = updates.completed_at;
      if (updates.drill_data) {
        updateData.drill_data = updates.drill_data;
      }

      const { error } = await supabase
        .from("drill_sessions" as any)
        .update(updateData)
        .eq("id", sessionId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Drill updated!");
      return true;
    } catch (error) {
      console.error("Error updating drill:", error);
      toast.error("Failed to update drill");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const getSavedDrills = async (
    filters?: { room_id?: string; mode?: string; limit?: number }
  ): Promise<SavedDrillSession[]> => {
    if (!user) return [];

    try {
      let query = supabase
        .from("drill_sessions" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter in JS since drill_data is JSONB
      let results = (data || []) as unknown as SavedDrillSession[];
      
      if (filters?.room_id) {
        results = results.filter(
          (d) => d.drill_data?.room_id === filters.room_id
        );
      }
      
      if (filters?.mode) {
        results = results.filter((d) => d.mode === filters.mode);
      }

      return results;
    } catch (error) {
      console.error("Error fetching saved drills:", error);
      return [];
    }
  };

  const deleteDrillSession = async (sessionId: string): Promise<boolean> => {
    if (!user) {
      toast.error("Please sign in to delete drills");
      return false;
    }

    try {
      const { error } = await supabase
        .from("drill_sessions" as any)
        .delete()
        .eq("id", sessionId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Drill deleted");
      return true;
    } catch (error) {
      console.error("Error deleting drill:", error);
      toast.error("Failed to delete drill");
      return false;
    }
  };

  return {
    saving,
    saveDrillSession,
    updateDrillSession,
    getSavedDrills,
    deleteDrillSession,
  };
};
