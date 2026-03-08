import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const PAGE_SIZE = 20;

export function usePersonalPageFeed(targetUserId: string) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [likedEntries, setLikedEntries] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, any[]>>({});

  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  const loadFeed = useCallback(async (reset = true) => {
    if (!targetUserId) return;
    setLoading(true);
    try {
      // Load pinned post IDs
      const { data: pins } = await (supabase as any)
        .from("pinned_posts")
        .select("entry_id")
        .eq("user_id", targetUserId);
      const pinSet = new Set<string>((pins || []).map((p: any) => p.entry_id));
      setPinnedIds(pinSet);

      const offset = reset ? 0 : entries.length;
      const { data, error } = await (supabase as any)
        .from("user_study_entries")
        .select("*, user_study_threads!inner(id, title, visibility, user_id)")
        .eq("user_study_threads.user_id", targetUserId)
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;

      // Fetch profile-shared community posts
      const { data: sharedPosts } = await supabase
        .from("community_posts")
        .select("id, user_id, title, content, category, created_at, likes, shared_content")
        .eq("user_id", targetUserId)
        .eq("category", "profile_share")
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      const studyEntries = (data || []).map((e: any) => ({ ...e, type: "study_entry" }));
      const profileShares = (sharedPosts || []).map((p: any) => ({
        ...p,
        type: "profile_share",
        likes_count: p.likes || 0,
      }));

      const merged = [...studyEntries, ...profileShares]
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const newEntries = merged;
      setHasMore(newEntries.length >= PAGE_SIZE);

      // Enrich with profiles
      const userIds = [...new Set(newEntries.map((e: any) => e.user_id))];
      let profileMap = new Map();
      if (userIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", userIds as string[]);
        profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      }
      const enriched = newEntries.map((e: any) => ({ ...e, profile: profileMap.get(e.user_id) }));

      if (reset) {
        setEntries(enriched);
      } else {
        setEntries((prev) => [...prev, ...enriched]);
      }

      // Check which entries the current user has liked
      if (user && newEntries.length > 0) {
        const entryIds = newEntries.map((e: any) => e.id);
        const { data: likes } = await (supabase as any)
          .from("user_study_entry_likes")
          .select("entry_id")
          .eq("user_id", user.id)
          .in("entry_id", entryIds);
        if (likes) {
          setLikedEntries((prev) => {
            const next = new Set(prev);
            likes.forEach((l: any) => next.add(l.entry_id));
            return next;
          });
        }
      }
    } catch (err) {
      console.error("Error loading personal page feed:", err);
    } finally {
      setLoading(false);
    }
  }, [targetUserId, user, entries.length]);

  const toggleLike = useCallback(async (entryId: string) => {
    if (!user) return;
    try {
      if (likedEntries.has(entryId)) {
        await (supabase as any).from("user_study_entry_likes").delete().eq("entry_id", entryId).eq("user_id", user.id);
        setLikedEntries((prev) => { const next = new Set(prev); next.delete(entryId); return next; });
        setEntries((prev) => prev.map((e) => e.id === entryId ? { ...e, likes_count: Math.max(0, (e.likes_count || 0) - 1) } : e));
      } else {
        await (supabase as any).from("user_study_entry_likes").insert({ entry_id: entryId, user_id: user.id });
        setLikedEntries((prev) => new Set([...prev, entryId]));
        setEntries((prev) => prev.map((e) => e.id === entryId ? { ...e, likes_count: (e.likes_count || 0) + 1 } : e));
      }
    } catch (err) { console.error(err); }
  }, [user, likedEntries]);

  const loadComments = useCallback(async (entryId: string) => {
    const { data } = await (supabase as any).from("user_study_entry_comments")
      .select("*").eq("entry_id", entryId).order("created_at");
    if (data) {
      const userIds = [...new Set(data.map((c: any) => c.user_id))];
      let profileMap = new Map();
      if (userIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", userIds as string[]);
        profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      }
      setComments((prev) => ({ ...prev, [entryId]: data.map((c: any) => ({ ...c, profile: profileMap.get(c.user_id) })) }));
    }
    return comments[entryId] || [];
  }, [comments]);

  const addComment = useCallback(async (entryId: string, content: string) => {
    if (!user || !content.trim()) return;
    await (supabase as any).from("user_study_entry_comments").insert({ entry_id: entryId, user_id: user.id, content });
    await loadComments(entryId);
  }, [user, loadComments]);

  const togglePin = useCallback(async (entryId: string, entryType: string = "study_entry") => {
    if (!user || user.id !== targetUserId) return;
    try {
      const { data: existing } = await (supabase as any)
        .from("pinned_posts")
        .select("id")
        .eq("user_id", user.id)
        .eq("entry_id", entryId)
        .eq("entry_type", entryType)
        .maybeSingle();

      if (existing) {
        await (supabase as any).from("pinned_posts").delete().eq("id", existing.id);
      } else {
        // Limit to 3 pins
        const { count } = await (supabase as any)
          .from("pinned_posts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);
        if ((count || 0) >= 3) {
          console.warn("Max 3 pinned posts allowed");
          return;
        }
        await (supabase as any).from("pinned_posts").insert({ user_id: user.id, entry_id: entryId, entry_type: entryType, pin_order: 0 });
      }
      await loadFeed(true);
    } catch (err) { console.error(err); }
  }, [user, targetUserId, loadFeed]);

  return { entries, loading, hasMore, likedEntries, comments, pinnedIds, loadFeed, toggleLike, loadComments, addComment, togglePin };
}
