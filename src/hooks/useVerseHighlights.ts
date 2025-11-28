import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface VerseHighlight {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  color: string;
}

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "yellow", bg: "bg-yellow-200", border: "border-yellow-400" },
  { name: "Green", value: "green", bg: "bg-green-200", border: "border-green-400" },
  { name: "Blue", value: "blue", bg: "bg-blue-200", border: "border-blue-400" },
  { name: "Pink", value: "pink", bg: "bg-pink-200", border: "border-pink-400" },
  { name: "Purple", value: "purple", bg: "bg-purple-200", border: "border-purple-400" },
  { name: "Orange", value: "orange", bg: "bg-orange-200", border: "border-orange-400" },
];

export const useVerseHighlights = (book: string, chapter: number) => {
  const { user } = useAuth();
  const [highlights, setHighlights] = useState<VerseHighlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHighlights();
    } else {
      setHighlights([]);
      setLoading(false);
    }
  }, [user, book, chapter]);

  const fetchHighlights = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("verse_highlights")
        .select("*")
        .eq("user_id", user.id)
        .eq("book", book)
        .eq("chapter", chapter);

      if (error) throw error;
      setHighlights(data || []);
    } catch (error) {
      console.error("Error fetching highlights:", error);
    } finally {
      setLoading(false);
    }
  };

  const addHighlight = async (verse: number, color: string) => {
    if (!user) {
      toast.error("Please sign in to highlight verses");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("verse_highlights")
        .upsert({
          user_id: user.id,
          book,
          chapter,
          verse,
          color,
        }, {
          onConflict: "user_id,book,chapter,verse"
        })
        .select()
        .single();

      if (error) throw error;
      
      setHighlights(prev => {
        const filtered = prev.filter(h => h.verse !== verse);
        return [...filtered, data];
      });
      
      toast.success("Verse highlighted");
    } catch (error) {
      console.error("Error adding highlight:", error);
      toast.error("Failed to highlight verse");
    }
  };

  const removeHighlight = async (verse: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("verse_highlights")
        .delete()
        .eq("user_id", user.id)
        .eq("book", book)
        .eq("chapter", chapter)
        .eq("verse", verse);

      if (error) throw error;
      
      setHighlights(prev => prev.filter(h => h.verse !== verse));
      toast.success("Highlight removed");
    } catch (error) {
      console.error("Error removing highlight:", error);
      toast.error("Failed to remove highlight");
    }
  };

  const getHighlight = (verse: number) => {
    return highlights.find(h => h.verse === verse);
  };

  const getHighlightColor = (verse: number) => {
    const highlight = getHighlight(verse);
    if (!highlight) return null;
    return HIGHLIGHT_COLORS.find(c => c.value === highlight.color);
  };

  return {
    highlights,
    loading,
    addHighlight,
    removeHighlight,
    getHighlight,
    getHighlightColor,
    HIGHLIGHT_COLORS,
  };
};
