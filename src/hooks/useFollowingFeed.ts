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
  shared_content?: any;
  profile?: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  reposted_by?: {
    id: string;
    display_name: string | null;
  } | null;
}

export function useFollowingFeed() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [likedEntries, setLikedEntries] = useState<Set<string>>(new Set());
  const [repostedEntries, setRepostedEntries] = useState<Set<string>>(new Set());

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
        .select("id, user_id, title, content, category, created_at, likes, shared_content")
        .in("user_id", followedIds)
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      // 4. Fetch reposts from followed users
      const { data: repostData } = await (supabase as any)
        .from("feed_reposts")
        .select("id, user_id, original_entry_id, original_type, created_at")
        .in("user_id", followedIds)
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      // 5. Merge & sort
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
        shared_content: p.shared_content,
      }));

      // For reposts, we need to fetch the original content
      let repostEntries: FeedEntry[] = [];
      if (repostData && repostData.length > 0) {
        const studyRepostIds = repostData.filter((r: any) => r.original_type === "study_entry").map((r: any) => r.original_entry_id);
        const communityRepostIds = repostData.filter((r: any) => r.original_type === "community_post").map((r: any) => r.original_entry_id);

        let repostStudyMap = new Map();
        let repostCommunityMap = new Map();

        if (studyRepostIds.length > 0) {
          const { data: rStudy } = await (supabase as any)
            .from("user_study_entries")
            .select("id, user_id, title, content, entry_type, verse_reference, created_at, likes_count")
            .in("id", studyRepostIds);
          (rStudy || []).forEach((e: any) => repostStudyMap.set(e.id, e));
        }
        if (communityRepostIds.length > 0) {
          const { data: rComm } = await supabase
            .from("community_posts")
            .select("id, user_id, title, content, category, created_at, likes")
            .in("id", communityRepostIds);
          (rComm || []).forEach((p: any) => repostCommunityMap.set(p.id, p));
        }

        // Get reposter profiles
        const reposterIds = [...new Set(repostData.map((r: any) => r.user_id))] as string[];
        let reposterMap = new Map();
        if (reposterIds.length > 0) {
          const { data: rProfiles } = await supabase.from("profiles").select("id, display_name").in("id", reposterIds as string[]);
          reposterMap = new Map((rProfiles || []).map((p) => [p.id, p]));
        }

        repostEntries = repostData.map((r: any) => {
          const orig = r.original_type === "study_entry" ? repostStudyMap.get(r.original_entry_id) : repostCommunityMap.get(r.original_entry_id);
          if (!orig) return null;
          const reposter = reposterMap.get(r.user_id);
          return {
            id: orig.id,
            type: r.original_type as "study_entry" | "community_post",
            user_id: orig.user_id,
            title: orig.title,
            content: orig.content,
            entry_type: orig.entry_type,
            verse_reference: orig.verse_reference,
            category: orig.category,
            created_at: r.created_at, // Use repost time for sorting
            likes_count: orig.likes_count || orig.likes || 0,
            reposted_by: reposter ? { id: reposter.id, display_name: reposter.display_name } : null,
          } as FeedEntry;
        }).filter(Boolean) as FeedEntry[];
      }

      const merged = [...studyEntries, ...communityEntries, ...repostEntries]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, PAGE_SIZE);

      // 6. Enrich with profiles
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

      // 7. Check liked study entries
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

      // 8. Check which entries the user has already reposted
      const allIds = enriched.map((e) => e.id) as string[];
      if (allIds.length > 0) {
        const { data: myReposts } = await (supabase as any)
          .from("feed_reposts")
          .select("original_entry_id")
          .eq("user_id", user.id)
          .in("original_entry_id", allIds);
        if (myReposts) {
          setRepostedEntries((prev) => {
            const next = new Set(prev);
            myReposts.forEach((r: any) => next.add(r.original_entry_id));
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

  const toggleRepost = useCallback(async (entryId: string, entryType: string): Promise<boolean> => {
    if (!user) return false;
    try {
      if (repostedEntries.has(entryId)) {
        await (supabase as any).from("feed_reposts").delete()
          .eq("user_id", user.id)
          .eq("original_entry_id", entryId)
          .eq("original_type", entryType);
        setRepostedEntries((prev) => { const next = new Set(prev); next.delete(entryId); return next; });
      } else {
        await (supabase as any).from("feed_reposts").insert({
          user_id: user.id,
          original_entry_id: entryId,
          original_type: entryType,
        });
        setRepostedEntries((prev) => new Set([...prev, entryId]));
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [user, repostedEntries]);

  return { entries, loading, hasMore, likedEntries, repostedEntries, loadFeed, toggleLike, toggleRepost };
}
