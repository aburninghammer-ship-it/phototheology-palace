import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const PAGE_SIZE = 20;

export interface FeedEntry {
  id: string;
  type: "study_entry" | "community_post";
  user_id: string;
  title: string | null;
  content: string;
  entry_type?: string;
  verse_reference?: string | null;
  category?: string | null;
  created_at: string;
  likes_count: number;
  thread_title?: string | null;
  profile?: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function useFollowingFeed() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [likedEntries, setLikedEntries] = useState<Set<string>>(new Set());

  const loadFeed = useCallback(async (reset = true) => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Get followed user IDs
      const { data: follows, error: fErr } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", user.id);

      if (fErr) throw fErr;
      const followedIds = (follows || []).map((f) => f.following_id);
      if (followedIds.length === 0) {
        if (reset) setEntries([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      const offset = reset ? 0 : entries.length;

      // 2. Fetch study entries from followed users (public threads only)
      const { data: studyData } = await (supabase as any)
        .from("user_study_entries")
        .select("id, user_id, title, content, entry_type, verse_reference, created_at, likes_count, user_study_threads!inner(title, visibility)")
        .in("user_id", followedIds)
        .eq("user_study_threads.visibility", "public")
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      // 3. Fetch community posts from followed users
      const { data: communityData } = await supabase
        .from("community_posts")
        .select("id, user_id, title, content, category, created_at, likes")
        .in("user_id", followedIds)
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      // 4. Merge & sort
      const studyEntries: FeedEntry[] = (studyData || []).map((e: any) => ({
        id: e.id,
        type: "study_entry" as const,
        user_id: e.user_id,
        title: e.title,
        content: e.content,
        entry_type: e.entry_type,
        verse_reference: e.verse_reference,
        created_at: e.created_at,
        likes_count: e.likes_count || 0,
        thread_title: e.user_study_threads?.title,
      }));

      const communityEntries: FeedEntry[] = (communityData || []).map((p: any) => ({
        id: p.id,
        type: "community_post" as const,
        user_id: p.user_id,
        title: p.title,
        content: p.content,
        category: p.category,
        created_at: p.created_at,
        likes_count: p.likes || 0,
      }));

      const merged = [...studyEntries, ...communityEntries]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, PAGE_SIZE);

      // 5. Enrich with profiles
      const userIds = [...new Set(merged.map((e) => e.user_id))];
      let profileMap = new Map();
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .in("id", userIds);
        profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      }
      const enriched = merged.map((e) => ({ ...e, profile: profileMap.get(e.user_id) }));

      setHasMore(merged.length === PAGE_SIZE);

      if (reset) {
        setEntries(enriched);
      } else {
        setEntries((prev) => [...prev, ...enriched]);
      }

      // 6. Check liked study entries
      const studyIds = enriched.filter((e) => e.type === "study_entry").map((e) => e.id);
      if (studyIds.length > 0) {
        const { data: likes } = await (supabase as any)
          .from("user_study_entry_likes")
          .select("entry_id")
          .eq("user_id", user.id)
          .in("entry_id", studyIds);
        if (likes) {
          setLikedEntries((prev) => {
            const next = new Set(prev);
            likes.forEach((l: any) => next.add(l.entry_id));
            return next;
          });
        }
      }
    } catch (err) {
      console.error("Error loading following feed:", err);
    } finally {
      setLoading(false);
    }
  }, [user, entries.length]);

  const toggleLike = useCallback(async (entryId: string) => {
    if (!user) return;
    try {
      if (likedEntries.has(entryId)) {
        await (supabase as any).from("user_study_entry_likes").delete().eq("entry_id", entryId).eq("user_id", user.id);
        setLikedEntries((prev) => { const next = new Set(prev); next.delete(entryId); return next; });
        setEntries((prev) => prev.map((e) => e.id === entryId ? { ...e, likes_count: Math.max(0, e.likes_count - 1) } : e));
      } else {
        await (supabase as any).from("user_study_entry_likes").insert({ entry_id: entryId, user_id: user.id });
        setLikedEntries((prev) => new Set([...prev, entryId]));
        setEntries((prev) => prev.map((e) => e.id === entryId ? { ...e, likes_count: e.likes_count + 1 } : e));
      }
    } catch (err) { console.error(err); }
  }, [user, likedEntries]);

  return { entries, loading, hasMore, likedEntries, loadFeed, toggleLike };
}
