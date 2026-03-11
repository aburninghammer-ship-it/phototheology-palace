import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Flame, Zap, Crown, BookOpen, Swords, GraduationCap,
  ChevronRight, Sparkles, Trophy
} from "lucide-react";

interface StudyStats {
  displayName: string;
  avatarUrl: string | null;
  beltTitle: string;
  streak: number;
  totalXp: number;
  currentFloor: number;
  gemsCount: number;
  roomsMastered: number;
  lastBook: string | null;
  lastChapter: number | null;
}

const BELT_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  white: { bg: "bg-white/20", text: "text-white", glow: "shadow-white/20" },
  blue: { bg: "bg-blue-500/20", text: "text-blue-400", glow: "shadow-blue-500/20" },
  red: { bg: "bg-red-500/20", text: "text-red-400", glow: "shadow-red-500/20" },
  gold: { bg: "bg-amber-500/20", text: "text-amber-400", glow: "shadow-amber-500/20" },
  purple: { bg: "bg-purple-500/20", text: "text-purple-400", glow: "shadow-purple-500/20" },
  black: { bg: "bg-zinc-800/40", text: "text-zinc-200", glow: "shadow-zinc-500/20" },
  black_candidate: { bg: "bg-zinc-700/30", text: "text-zinc-300", glow: "shadow-zinc-500/20" },
  none: { bg: "bg-muted/20", text: "text-muted-foreground", glow: "" },
};

const FLOOR_NAMES = [
  "", "Furnishing", "Investigation", "Freestyle", "Next Level",
  "Vision", "Three Heavens", "Spiritual", "Master"
];

export function PersonalizedStudyBanner() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const load = async () => {
      try {
        const [profileRes, masteryRes, streakRes, gemsRes, roomsRes, readingRes] = await Promise.all([
          supabase.from("profiles").select("display_name, avatar_url, master_title").eq("id", user.id).single(),
          supabase.from("global_master_titles").select("total_xp, current_floor, rooms_mastered").eq("user_id", user.id).maybeSingle(),
          supabase.from("mastery_streaks").select("current_streak").eq("user_id", user.id).maybeSingle(),
          supabase.from("user_gems").select("id", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("room_mastery_levels").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("mastery_level", 5),
          supabase.from("user_reading_progress").select("book, chapter").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
        ]);

        setStats({
          displayName: profileRes.data?.display_name || "Scholar",
          avatarUrl: profileRes.data?.avatar_url || null,
          beltTitle: profileRes.data?.master_title || "none",
          streak: streakRes.data?.current_streak || 0,
          totalXp: masteryRes.data?.total_xp || 0,
          currentFloor: masteryRes.data?.current_floor || 1,
          gemsCount: gemsRes.count || 0,
          roomsMastered: roomsRes.count || 0,
          lastBook: readingRes.data?.book || null,
          lastChapter: readingRes.data?.chapter || null,
        });
      } catch (err) {
        console.error("Error loading study banner:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (!user || loading || !stats) return null;

  const belt = BELT_COLORS[stats.beltTitle] || BELT_COLORS.none;
  const floorName = FLOOR_NAMES[stats.currentFloor] || "Floor " + stats.currentFloor;

  return (
    <div className="rounded-2xl border border-border/50 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-xl p-4 mb-6 shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Identity Cluster */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-primary/30 shadow-lg">
              <AvatarImage src={stats.avatarUrl || undefined} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                {stats.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {stats.streak > 0 && (
              <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-background">
                {stats.streak}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">
              Welcome back, {stats.displayName.split(" ")[0]}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${belt.bg} ${belt.text} text-[10px] capitalize border-0 shadow-sm ${belt.glow}`}>
                <Crown className="h-2.5 w-2.5 mr-1" />
                {stats.beltTitle === "none" ? "White" : stats.beltTitle.replace("_", " ")} Belt
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                Floor {stats.currentFloor}: {floorName}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3 sm:gap-4 sm:ml-auto flex-wrap">
          <div className="flex items-center gap-1.5" title="Study Streak">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-bold text-foreground">{stats.streak}</span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">day{stats.streak !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Total XP">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-bold text-foreground">{stats.totalXp.toLocaleString()}</span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">XP</span>
          </div>
          <div className="flex items-center gap-1.5" title="Gems Collected">
            <Sparkles className="h-4 w-4 text-cyan-500" />
            <span className="text-sm font-bold text-foreground">{stats.gemsCount}</span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">gems</span>
          </div>
          {stats.roomsMastered > 0 && (
            <div className="flex items-center gap-1.5" title="Rooms Mastered">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-bold text-foreground">{stats.roomsMastered}</span>
              <span className="text-[10px] text-muted-foreground hidden sm:inline">mastered</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 sm:ml-2">
          {stats.lastBook && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="text-xs h-8 bg-primary/5 border-primary/20 hover:bg-primary/10"
            >
              <Link to={`/bible?book=${stats.lastBook}&chapter=${stats.lastChapter || 1}`}>
                <BookOpen className="h-3 w-3 mr-1" />
                Continue {stats.lastBook} {stats.lastChapter}
                <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </Button>
          )}
          <Button
            asChild
            size="sm"
            className="text-xs h-8 gradient-palace text-white shadow-md"
          >
            <Link to="/palace">
              <Swords className="h-3 w-3 mr-1" />
              Palace
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
