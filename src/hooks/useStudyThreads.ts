import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useStudyThreads() {
  const { user } = useAuth();
  const [myThreads, setMyThreads] = useState<any[]>([]);
  const [publicThreads, setPublicThreads] = useState<any[]>([]);
  const [followedFeed, setFollowedFeed] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getMyThreads = useCallback(async () => {
    if (!user) return [];
    try {
      const { data, error } = await (supabase as any)
        .from("user_study_threads")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setMyThreads(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching my threads:", err);
      return [];
    }
  }, [user]);

  const getPublicThreads = useCallback(async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("user_study_threads")
        .select("*")
        .eq("is_public", true)
        .order("updated_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      setPublicThreads(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching public threads:", err);
      return [];
    }
  }, []);

  const getFollowedFeed = useCallback(async () => {
    if (!user) return [];
    try {
      // Get threads from users the current user follows
      const { data, error } = await (supabase as any)
        .from("user_study_threads")
        .select("*")
        .eq("is_public", true)
        .neq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      setFollowedFeed(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching followed feed:", err);
      return [];
    }
  }, [user]);

  const createThread = useCallback(async (data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("user_study_threads")
        .insert({
          user_id: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Study thread created!");
      await getMyThreads();
      return result;
    } catch (err: any) {
      console.error("Error creating thread:", err);
      toast.error(err.message || "Failed to create thread");
      return null;
    }
  }, [user, getMyThreads]);

  const getThreadEntries = useCallback(async (threadId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("user_study_entries")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setEntries(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching entries:", err);
      return [];
    }
  }, []);

  const createEntry = useCallback(async (threadId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("user_study_entries")
        .insert({
          thread_id: threadId,
          user_id: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Entry added!");
      await getThreadEntries(threadId);
      return result;
    } catch (err: any) {
      console.error("Error creating entry:", err);
      toast.error(err.message || "Failed to create entry");
      return null;
    }
  }, [user, getThreadEntries]);

  const toggleLike = useCallback(async (entryId: string) => {
    if (!user) { toast.error("You must be logged in"); return false; }
    try {
      // Check if already liked
      const { data: existing } = await (supabase as any)
        .from("user_study_entry_likes")
        .select("id")
        .eq("entry_id", entryId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await (supabase as any)
          .from("user_study_entry_likes")
          .delete()
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from("user_study_entry_likes")
          .insert({ entry_id: entryId, user_id: user.id });
        if (error) throw error;
      }
      return true;
    } catch (err: any) {
      console.error("Error toggling like:", err);
      toast.error(err.message || "Failed to toggle like");
      return false;
    }
  }, [user]);

  const getComments = useCallback(async (entryId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("user_study_entry_comments")
        .select("*")
        .eq("entry_id", entryId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setComments(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching comments:", err);
      return [];
    }
  }, []);

  const addComment = useCallback(async (entryId: string, content: string, replyToId?: string) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("user_study_entry_comments")
        .insert({
          entry_id: entryId,
          user_id: user.id,
          content,
          reply_to_id: replyToId || null,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Comment added!");
      await getComments(entryId);
      return result;
    } catch (err: any) {
      console.error("Error adding comment:", err);
      toast.error(err.message || "Failed to add comment");
      return null;
    }
  }, [user, getComments]);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    Promise.all([getMyThreads(), getPublicThreads(), getFollowedFeed()])
      .finally(() => setLoading(false));
  }, [user]);

  return {
    myThreads,
    publicThreads,
    followedFeed,
    entries,
    comments,
    loading,
    getMyThreads,
    getFollowedFeed,
    getPublicThreads,
    createThread,
    getThreadEntries,
    createEntry,
    toggleLike,
    getComments,
    addComment,
  };
}
