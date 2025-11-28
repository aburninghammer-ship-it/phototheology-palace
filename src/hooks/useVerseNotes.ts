import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface VerseNote {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export const useVerseNotes = (book: string, chapter: number) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<VerseNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [user, book, chapter]);

  const fetchNotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("verse_notes")
        .select("*")
        .eq("user_id", user.id)
        .eq("book", book)
        .eq("chapter", chapter)
        .order("verse", { ascending: true });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (verse: number, content: string) => {
    if (!user) {
      toast.error("Please sign in to add notes");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("verse_notes")
        .insert({
          user_id: user.id,
          book,
          chapter,
          verse,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => [...prev, data]);
      toast.success("Note added");
      return data;
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
      return null;
    }
  };

  const updateNote = async (noteId: string, content: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("verse_notes")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", noteId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => prev.map(n => n.id === noteId ? data : n));
      toast.success("Note updated");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("verse_notes")
        .delete()
        .eq("id", noteId)
        .eq("user_id", user.id);

      if (error) throw error;
      
      setNotes(prev => prev.filter(n => n.id !== noteId));
      toast.success("Note deleted");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const getNotesForVerse = (verse: number) => {
    return notes.filter(n => n.verse === verse);
  };

  const hasNotes = (verse: number) => {
    return notes.some(n => n.verse === verse);
  };

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    getNotesForVerse,
    hasNotes,
  };
};
