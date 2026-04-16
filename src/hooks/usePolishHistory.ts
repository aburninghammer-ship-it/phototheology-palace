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

      const { data, error } = await supabase
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

      console.log('[Polish] Saving story for user:', user.id, 'title:', story.title);

      const insertPayload = {
        user_id: user.id,
        input_text: inputText,
        title: story.title || null,
        tagline: story.tagline || null,
        scenes: story.scenes ? JSON.parse(JSON.stringify(story.scenes)) : null,
        narrative: story.narrative || null,
        closing_reflection: story.closingReflection || null,
        verses_used: Array.isArray(story.versesUsed) ? story.versesUsed : null,
      };

      console.log('[Polish] Insert payload:', JSON.stringify(insertPayload, null, 2));

      const { data, error } = await supabase
        .from('polish_stories')
        .insert(insertPayload)
        .select()
        .single();

      if (error) {
        console.error('[Polish] Supabase insert error:', error);
        throw error;
      }

      console.log('[Polish] Story saved successfully:', data?.id);
      toast.success("Story saved!");
      fetchHistory();
      return data;
    } catch (error: any) {
      console.error('[Polish] Error saving polish story:', error?.message || error);
      toast.error("Failed to save story: " + (error?.message || "Unknown error"));
      return null;
    }
  };

  const deleteStory = async (id: string) => {
    try {
      const { error } = await supabase
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
