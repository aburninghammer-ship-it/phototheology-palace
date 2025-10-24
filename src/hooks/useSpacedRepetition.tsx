import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface RepetitionItem {
  id: string;
  item_type: string;
  item_id: string;
  content: any;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_date: string;
}

export const useSpacedRepetition = () => {
  const { user } = useAuth();
  const [dueItems, setDueItems] = useState<RepetitionItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadDueItems();
    }
  }, [user]);

  const loadDueItems = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("spaced_repetition_items")
        .select("*")
        .eq("user_id", user.id)
        .lte("next_review_date", new Date().toISOString())
        .order("next_review_date", { ascending: true });

      if (error) throw error;
      setDueItems(data || []);
    } catch (error) {
      console.error("Error loading due items:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (itemType: string, itemId: string, content: any) => {
    if (!user) {
      toast.error("Please sign in to add review items");
      return;
    }

    try {
      // Check if already exists
      const { data: existing } = await supabase
        .from("spaced_repetition_items")
        .select("id")
        .eq("user_id", user.id)
        .eq("item_id", itemId)
        .maybeSingle();

      if (existing) {
        toast.info("Already in your review queue");
        return;
      }

      const { error } = await supabase.from("spaced_repetition_items").insert({
        user_id: user.id,
        item_type: itemType,
        item_id: itemId,
        content,
        next_review_date: new Date().toISOString(),
      });

      if (error) throw error;
      toast.success("Added to review queue! 📚");
      loadDueItems();
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
    }
  };

  const reviewItem = async (
    itemId: string,
    quality: number // 0-5, where 3+ is pass
  ) => {
    if (!user) return;

    try {
      const item = dueItems.find((i) => i.id === itemId);
      if (!item) return;

      // SM-2 Algorithm
      let easeFactor = item.ease_factor;
      let interval = item.interval_days;
      let repetitions = item.repetitions;

      if (quality >= 3) {
        // Correct response
        if (repetitions === 0) {
          interval = 1;
        } else if (repetitions === 1) {
          interval = 6;
        } else {
          interval = Math.round(interval * easeFactor);
        }
        repetitions += 1;
      } else {
        // Incorrect response - reset
        repetitions = 0;
        interval = 1;
      }

      // Update ease factor
      easeFactor =
        easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      if (easeFactor < 1.3) easeFactor = 1.3;

      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + interval);

      const { error } = await supabase
        .from("spaced_repetition_items")
        .update({
          ease_factor: easeFactor,
          interval_days: interval,
          repetitions,
          next_review_date: nextReviewDate.toISOString(),
          last_reviewed_at: new Date().toISOString(),
        })
        .eq("id", itemId);

      if (error) throw error;
      
      const messages = ["Again", "Try again", "Keep trying", "Good", "Great!", "Perfect! 🌟"];
      toast.success(messages[quality]);
      
      loadDueItems();
    } catch (error) {
      console.error("Error reviewing item:", error);
      toast.error("Failed to save review");
    }
  };

  const getDueCount = async (): Promise<number> => {
    if (!user) return 0;

    try {
      const { count } = await supabase
        .from("spaced_repetition_items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .lte("next_review_date", new Date().toISOString());

      return count || 0;
    } catch (error) {
      console.error("Error getting due count:", error);
      return 0;
    }
  };

  return { dueItems, loading, addItem, reviewItem, loadDueItems, getDueCount };
};
