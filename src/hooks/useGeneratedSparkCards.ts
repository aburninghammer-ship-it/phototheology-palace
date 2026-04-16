import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GeneratedSparkCard {
  id: string;
  title: string;
  verse_anchors: string[];
  palace_rooms: Array<{ id: string; name: string; icon: string }>;
  prompts: {
    observe: string;
    connect: string;
    discover: string;
  };
  category: "sanctuary" | "types" | "cycles" | "patterns" | "prophecy" | "elements";
  tags: string[];
  created_at: string;
  generation_date: string;
  view_count: number;
}

export const useGeneratedSparkCards = (daysBack: number = 30) => {
  const [cards, setCards] = useState<GeneratedSparkCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const autoGenerateAttempted = useRef(false);

  const loadCards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);

      const { data, error: fetchError } = await (supabase as any)
        .from("generated_spark_cards")
        .select("*")
        .eq("is_active", true)
        .gte("generation_date", cutoffDate.toISOString().split('T')[0])
        .order("generation_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const loadedCards = (data || []) as GeneratedSparkCard[];
      setCards(loadedCards);

      // If no cards exist for today and we haven't tried generating yet,
      // trigger the edge function as a fallback (cron may have failed)
      const today = new Date().toISOString().split('T')[0];
      const todaysCards = loadedCards.filter(c => c.generation_date === today);

      if (todaysCards.length === 0 && !autoGenerateAttempted.current) {
        autoGenerateAttempted.current = true;
        console.log("[SparkCards] No cards for today — triggering generation");
        try {
          const { data: genData, error: genError } = await supabase.functions.invoke(
            "generate-daily-cards",
            { body: { count: 12 } }
          );
          if (genError) {
            console.error("[SparkCards] Auto-generation failed:", genError);
          } else if (genData?.success && genData.generated_count > 0) {
            console.log(`[SparkCards] Auto-generated ${genData.generated_count} cards — reloading`);
            // Reload to pick up the new cards
            const { data: refreshed } = await (supabase as any)
              .from("generated_spark_cards")
              .select("*")
              .eq("is_active", true)
              .gte("generation_date", cutoffDate.toISOString().split('T')[0])
              .order("generation_date", { ascending: false })
              .order("created_at", { ascending: false });
            if (refreshed) setCards(refreshed as GeneratedSparkCard[]);
          }
        } catch (genErr) {
          console.error("[SparkCards] Auto-generation error:", genErr);
        }
      }
    } catch (err: any) {
      console.error("Error loading generated spark cards:", err);
      setError(err.message || "Failed to load cards");
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [daysBack]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  // Increment view count when a card is viewed
  const incrementViewCount = async (cardId: string) => {
    try {
      await (supabase as any).rpc("increment_spark_card_view", { card_id: cardId });
    } catch (err) {
      console.error("Error incrementing view count:", err);
    }
  };

  // Get cards by category
  const getCardsByCategory = (category: string): GeneratedSparkCard[] => {
    if (category === "all") return cards;
    return cards.filter(card => card.category === category);
  };

  // Get today's cards
  const getTodaysCards = (): GeneratedSparkCard[] => {
    const today = new Date().toISOString().split('T')[0];
    return cards.filter(card => card.generation_date === today);
  };

  // Search cards
  const searchCards = (query: string): GeneratedSparkCard[] => {
    const lowerQuery = query.toLowerCase();
    return cards.filter(card =>
      card.title.toLowerCase().includes(lowerQuery) ||
      card.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      card.verse_anchors.some(v => v.toLowerCase().includes(lowerQuery))
    );
  };

  return {
    cards,
    loading,
    error,
    refresh: loadCards,
    incrementViewCount,
    getCardsByCategory,
    getTodaysCards,
    searchCards,
  };
};
