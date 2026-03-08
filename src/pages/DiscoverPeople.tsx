import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { FollowButton } from "@/components/social/FollowButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Users, Flame, Star, UserPlus } from "lucide-react";

const PAGE_SIZE = 20;

const BELT_COLORS: Record<string, string> = {
  white: "bg-gray-200 text-gray-800",
  blue: "bg-blue-500 text-white",
  red: "bg-red-500 text-white",
  gold: "bg-amber-500 text-white",
  purple: "bg-purple-500 text-white",
  black: "bg-gray-900 text-white",
  black_candidate: "bg-gray-800 text-white",
};

type SortField = "points" | "created_at" | "daily_study_streak";

interface FilterOption {
  label: string;
  sortField: SortField;
  icon: React.ReactNode;
}

const FILTERS: FilterOption[] = [
  { label: "Most Active", sortField: "points", icon: <Star className="h-3.5 w-3.5" /> },
  { label: "New Members", sortField: "created_at", icon: <UserPlus className="h-3.5 w-3.5" /> },
  { label: "Streak Leaders", sortField: "daily_study_streak", icon: <Flame className="h-3.5 w-3.5" /> },
];

interface ProfileRow {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  points: number | null;
  level: number | null;
  daily_study_streak: number | null;
  master_title: string | null;
  ministry_tags: string[] | null;
  is_profile_public: boolean | null;
  created_at: string | null;
}

export default function DiscoverPeople() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState<SortField>("points");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set());
  const [togglingFollow, setTogglingFollow] = useState<Set<string>>(new Set());

  const fetchProfiles = useCallback(async (reset = false) => {
    if (!user) return;
    const currentOffset = reset ? 0 : offset;
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let query = supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url, bio, points, level, daily_study_streak, master_title, ministry_tags, is_profile_public, created_at")
        .neq("id", user.id)
        .or("is_profile_public.eq.true,is_profile_public.is.null")
        .order(activeSort, { ascending: false })
        .range(currentOffset, currentOffset + PAGE_SIZE - 1);

      if (searchQuery.trim()) {
        const q = `%${searchQuery.trim()}%`;
        query = query.or(`username.ilike.${q},display_name.ilike.${q}`);
      }

      const { data, error } = await query;
      if (error) throw error;

      const rows = (data || []) as ProfileRow[];
      if (reset) {
        setProfiles(rows);
        setOffset(rows.length);
      } else {
        setProfiles((prev) => [...prev, ...rows]);
        setOffset(currentOffset + rows.length);
      }
      setHasMore(rows.length === PAGE_SIZE);
    } catch (err: any) {
      console.error("Error fetching profiles:", err);
      toast({ title: "Error loading profiles", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user, activeSort, searchQuery, offset, toast]);

  // Fetch follow statuses in batch
  const fetchFollowStatuses = useCallback(async (userIds: string[]) => {
    if (!user || userIds.length === 0) return;
    try {
      const { data, error } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", user.id)
        .in("following_id", userIds);

      if (error) throw error;
      setFollowingSet((prev) => {
        const next = new Set(prev);
        (data || []).forEach((row: any) => next.add(row.following_id));
        return next;
      });
    } catch (err) {
      console.error("Error fetching follow statuses:", err);
    }
  }, [user]);

  // Initial load + when sort/search changes
  useEffect(() => {
    if (user) {
      setOffset(0);
      setHasMore(true);
      fetchProfiles(true);
    }
  }, [user, activeSort, searchQuery]);

  // Batch-check follow status when profiles change
  useEffect(() => {
    if (profiles.length > 0) {
      fetchFollowStatuses(profiles.map((p) => p.id));
    }
  }, [profiles, fetchFollowStatuses]);

  const handleToggleFollow = async (targetUserId: string) => {
    if (!user) return;
    setTogglingFollow((prev) => new Set(prev).add(targetUserId));

    const wasFollowing = followingSet.has(targetUserId);
    try {
      if (wasFollowing) {
        const { error } = await supabase
          .from("user_follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", targetUserId);
        if (error) throw error;
        setFollowingSet((prev) => {
          const next = new Set(prev);
          next.delete(targetUserId);
          return next;
        });
        toast({ title: "Unfollowed" });
      } else {
        const { error } = await supabase
          .from("user_follows")
          .insert({ follower_id: user.id, following_id: targetUserId });
        if (error) throw error;
        setFollowingSet((prev) => new Set(prev).add(targetUserId));
        toast({ title: "Following!" });
      }
    } catch (err: any) {
      console.error("Error toggling follow:", err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setTogglingFollow((prev) => {
        const next = new Set(prev);
        next.delete(targetUserId);
        return next;
      });
    }
  };

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 pb-32 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Discover People
          </h1>
          <p className="text-muted-foreground mt-1">Find and connect with fellow students</p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or username..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.sortField}
              onClick={() => setActiveSort(f.sortField)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeSort === f.sortField
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No users found</p>
            {searchQuery && <p className="text-sm mt-1">Try a different search term</p>}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map((profile) => (
                <Link
                  key={profile.id}
                  to={`/user/${profile.id}`}
                  className="group block rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback>
                        {(profile.display_name || profile.username || "?")[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate">
                          {profile.display_name || profile.username || "Anonymous"}
                        </span>
                        {profile.master_title && (
                          <Badge
                            variant="secondary"
                            className={`text-[10px] px-1.5 py-0 ${BELT_COLORS[profile.master_title] || BELT_COLORS.white}`}
                          >
                            {profile.master_title}
                          </Badge>
                        )}
                      </div>
                      {profile.username && (
                        <p className="text-xs text-muted-foreground">@{profile.username}</p>
                      )}
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{profile.bio}</p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        {profile.points?.toLocaleString() || 0} XP
                      </span>
                      {(profile.level ?? 0) > 0 && (
                        <span>Lv. {profile.level}</span>
                      )}
                      {(profile.daily_study_streak ?? 0) > 0 && (
                        <span className="flex items-center gap-1">
                          <Flame className="h-3.5 w-3.5 text-orange-500" />
                          {profile.daily_study_streak}
                        </span>
                      )}
                    </div>
                    <FollowButton
                      userId={profile.id}
                      isFollowing={followingSet.has(profile.id)}
                      loading={togglingFollow.has(profile.id)}
                      onToggle={handleToggleFollow}
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => fetchProfiles(false)}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
