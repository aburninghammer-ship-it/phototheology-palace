import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface GeneratedIdea {
  title: string;
  verses: string[];
  rooms: Array<{ id: string; name: string }>;
  observePrompt: string;
  connectPrompt: string;
  discoverPrompt: string;
}

export interface ShelfItem {
  id: string;
  user_id: string;
  card_type: "static" | "generated";
  static_card_id: string | null;
  generated_idea: GeneratedIdea | null;
  saved_at: string;
  notes: string | null;
  completed_at: string | null;
}

export const useUserShelf = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shelfItems, setShelfItems] = useState<ShelfItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadShelf = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("user_spark_card_shelf")
        .select("*")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false });

      if (error) throw error;
      setShelfItems((data as ShelfItem[]) || []);
    } catch (error) {
      console.error("Error loading shelf:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadShelf();
    }
  }, [user, loadShelf]);

  const saveStaticCard = async (cardId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save cards to your shelf",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await (supabase as any).from("user_spark_card_shelf").insert({
        user_id: user.id,
        card_type: "static",
        static_card_id: cardId,
      });

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation - already saved
          toast({
            title: "Already saved",
            description: "This card is already in your shelf",
          });
          return false;
        }
        throw error;
      }

      toast({
        title: "Saved to shelf",
        description: "Card added to your study shelf",
      });

      loadShelf();
      return true;
    } catch (error) {
      console.error("Error saving card:", error);
      toast({
        title: "Error",
        description: "Failed to save card to shelf",
        variant: "destructive",
      });
      return false;
    }
  };

  const saveGeneratedIdea = async (idea: GeneratedIdea) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save ideas to your shelf",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await (supabase as any).from("user_spark_card_shelf").insert({
        user_id: user.id,
        card_type: "generated",
        generated_idea: idea as unknown as Record<string, unknown>,
      });

      if (error) throw error;

      toast({
        title: "Saved to shelf",
        description: "Generated idea added to your shelf",
      });

      loadShelf();
      return true;
    } catch (error) {
      console.error("Error saving idea:", error);
      toast({
        title: "Error",
        description: "Failed to save idea to shelf",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeFromShelf = async (itemId: string) => {
    try {
      const { error } = await (supabase as any)
        .from("user_spark_card_shelf")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Removed from shelf",
      });

      loadShelf();
      return true;
    } catch (error) {
      console.error("Error removing from shelf:", error);
      toast({
        title: "Error",
        description: "Failed to remove from shelf",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateNotes = async (itemId: string, notes: string) => {
    try {
      const { error } = await (supabase as any)
        .from("user_spark_card_shelf")
        .update({ notes })
        .eq("id", itemId);

      if (error) throw error;
      loadShelf();
      return true;
    } catch (error) {
      console.error("Error updating notes:", error);
      return false;
    }
  };

  const markCompleted = async (itemId: string) => {
    try {
      const { error } = await (supabase as any)
        .from("user_spark_card_shelf")
        .update({ completed_at: new Date().toISOString() })
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Marked as completed",
      });

      loadShelf();
      return true;
    } catch (error) {
      console.error("Error marking completed:", error);
      return false;
    }
  };

  const isCardSaved = (cardId: string): boolean => {
    return shelfItems.some(
      (item) => item.card_type === "static" && item.static_card_id === cardId
    );
  };

  const getStaticCards = (): ShelfItem[] => {
    return shelfItems.filter((item) => item.card_type === "static");
  };

  const getGeneratedIdeas = (): ShelfItem[] => {
    return shelfItems.filter((item) => item.card_type === "generated");
  };

  return {
    shelfItems,
    loading,
    saveStaticCard,
    saveGeneratedIdea,
    removeFromShelf,
    updateNotes,
    markCompleted,
    isCardSaved,
    getStaticCards,
    getGeneratedIdeas,
    refresh: loadShelf,
  };
};
