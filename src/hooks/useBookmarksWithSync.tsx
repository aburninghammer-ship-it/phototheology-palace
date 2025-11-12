import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { syncQueue } from "@/services/syncQueue";

interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse?: number;
  note?: string;
  color: string;
  created_at: string;
}

/**
 * Enhanced bookmarks hook with background sync support
 * Automatically queues actions when offline and syncs when online
 */
export const useBookmarksWithSync = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadBookmarks();
    }
  }, [user]);

  const loadBookmarks = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (
    book: string,
    chapter: number,
    verse?: number,
    note?: string,
    color: string = "yellow"
  ) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark verses",
        variant: "destructive",
      });
      return;
    }

    const payload = { book, chapter, verse, note, color };

    if (!navigator.onLine) {
      // Queue for later sync when offline
      await syncQueue.queueAction('bookmark_add', payload);
      
      toast({
        title: "Bookmark queued",
        description: "Will sync when you're back online",
      });
      return;
    }

    try {
      const { error } = await supabase.from("bookmarks").insert({
        user_id: user.id,
        ...payload
      });

      if (error) throw error;

      toast({
        title: "Bookmark added",
        description: `${book} ${chapter}${verse ? `:${verse}` : ""} bookmarked`,
      });

      loadBookmarks();
    } catch (error) {
      console.error("Error adding bookmark:", error);
      
      // Queue for retry if network fails
      await syncQueue.queueAction('bookmark_add', payload);
      
      toast({
        title: "Bookmark queued",
        description: "Network error - will retry automatically",
        variant: "destructive",
      });
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    if (!navigator.onLine) {
      await syncQueue.queueAction('bookmark_remove', { bookmarkId });
      
      toast({
        title: "Removal queued",
        description: "Will sync when you're back online",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmarkId);

      if (error) throw error;

      toast({
        title: "Bookmark removed",
      });

      loadBookmarks();
    } catch (error) {
      console.error("Error removing bookmark:", error);
      await syncQueue.queueAction('bookmark_remove', { bookmarkId });
    }
  };

  const isBookmarked = (book: string, chapter: number, verse?: number) => {
    return bookmarks.some(
      (b) =>
        b.book === book &&
        b.chapter === chapter &&
        (verse === undefined || b.verse === verse)
    );
  };

  return { bookmarks, loading, addBookmark, removeBookmark, isBookmarked };
};
