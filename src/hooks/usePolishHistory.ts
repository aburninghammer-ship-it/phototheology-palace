import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Scene {
  heading: string;
  verseRef: string;
  content: string;
}

export interface SavedPolishStory {
  id: string;
  input_text: string;
  title: string | null;
  tagline: string | null;
  scenes: Scene[] | null;
  narrative: string | null;
  closing_reflection: string | null;
  verses_used: string[] | null;
  created_at: string;
}

export const usePolishHistory = () => {
  const [history, setHistory] = useState<SavedPolishStory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await (supabase as any)
        .from('polish_stories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const typedData = (data || []).map((item: any) => ({
        ...item,
        scenes: item.scenes as Scene[] | null,
      }));

      setHistory(typedData);
    } catch (error) {
      console.error('Error fetching polish history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveStory = async (inputText: string, story: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to save stories");
        return null;
      }

      const { data, error } = await (supabase as any)
        .from('polish_stories')
        .insert({
          user_id: user.id,
          input_text: inputText,
          title: story.title,
          tagline: story.tagline,
          scenes: story.scenes,
          narrative: story.narrative,
          closing_reflection: story.closingReflection,
          verses_used: story.versesUsed,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Story saved!");
      fetchHistory();
      return data;
    } catch (error) {
      console.error('Error saving polish story:', error);
      toast.error("Failed to save story");
      return null;
    }
  };

  const deleteStory = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('polish_stories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(prev => prev.filter(s => s.id !== id));
      toast.success("Story deleted");
    } catch (error) {
      console.error('Error deleting polish story:', error);
      toast.error("Failed to delete story");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    isLoading,
    saveStory,
    deleteStory,
    refetch: fetchHistory,
  };
};
