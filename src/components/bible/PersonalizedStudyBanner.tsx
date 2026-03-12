import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Flame, Zap, Crown, BookOpen, Swords, GraduationCap,
  ChevronRight, Sparkles, Trophy, Lightbulb, Target,
  Eye, Compass, Heart, RefreshCw, Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface DailyPrompt {
  category: "motivation" | "action" | "spiritual" | "try_this";
  icon: React.ReactNode;
  label: string;
  text: string;
  actionLabel?: string;
  actionLink?: string;
  accent: string;
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

// PT Room-based daily prompts — rotates based on day of year
const PT_PROMPTS: Omit<DailyPrompt, "accent">[] = [
  // Motivation
  { category: "motivation", icon: <Flame className="h-4 w-4" />, label: "Daily Fire",
    text: "Every chapter hides Christ. Today, refuse to close the Book until you've found Him.",
    actionLabel: "Concentration Room", actionLink: "/palace?room=CR" },
  { category: "motivation", icon: <Crown className="h-4 w-4" />, label: "Rise Up",
    text: "You're building a palace in your mind — brick by brick, verse by verse. Don't stop climbing.",
    actionLabel: "Palace", actionLink: "/palace" },
  { category: "motivation", icon: <Trophy className="h-4 w-4" />, label: "Keep Going",
    text: "The 8th Floor is reflexive mastery — where the palace lives inside you. Every study gets you closer.",
    actionLabel: "Infinity Room", actionLink: "/palace?room=∞" },
  { category: "motivation", icon: <Zap className="h-4 w-4" />, label: "Ignite",
    text: "A gem you discover today could be the weapon you need tomorrow. Mine the Word relentlessly.",
    actionLabel: "Gem Room", actionLink: "/palace?room=GR" },

  // Action
  { category: "action", icon: <Eye className="h-4 w-4" />, label: "Detective Drill",
    text: "Pick any passage and write 20 observations without commentary. Train your eye like a detective.",
    actionLabel: "Investigation Room", actionLink: "/palace?room=IR" },
  { category: "action", icon: <Target className="h-4 w-4" />, label: "Speed Drill",
    text: "Flip through a Gospel — list 5 Christ connections in 3 minutes. Train your reflex.",
    actionLabel: "Concentration Room", actionLink: "/palace?room=CR" },
  { category: "action", icon: <Brain className="h-4 w-4" />, label: "Freestyle Challenge",
    text: "Connect your last verse to something you saw in nature today. The 3rd Floor trains spontaneous thought.",
    actionLabel: "Freestyle Room", actionLink: "/palace?room=NF" },
  { category: "action", icon: <Compass className="h-4 w-4" />, label: "Christ Hunt",
    text: "Open any Old Testament chapter. Don't close it until you've named how Christ appears there.",
    actionLabel: "Concentration Room", actionLink: "/palace?room=CR" },

  // Spiritual
  { category: "spiritual", icon: <Heart className="h-4 w-4" />, label: "Fire Room",
    text: "Read Isaiah 53 slowly. Pause after every verse. Pray until it pierces. Let the Word examine you.",
    actionLabel: "Read Now", actionLink: "/bible?book=Isaiah&chapter=53" },
  { category: "spiritual", icon: <Heart className="h-4 w-4" />, label: "Meditation",
    text: "\"The LORD is my shepherd.\" Don't rush past it. Picture it. Pray it. Rest in it. Slow cooking beats microwaving.",
    actionLabel: "Psalm 23", actionLink: "/bible?book=Psalms&chapter=23" },
  { category: "spiritual", icon: <Sparkles className="h-4 w-4" />, label: "Abide",
    text: "\"I am the vine, ye are the branches.\" Picture yourself plugged in. No branch thrives severed from the Vine.",
    actionLabel: "John 15", actionLink: "/bible?book=John&chapter=15" },
  { category: "spiritual", icon: <Heart className="h-4 w-4" />, label: "Surrender",
    text: "The system trains the mind, but the Spirit gives life. Pause now. Ask the Spirit to open your eyes today.",
    actionLabel: "Open Bible", actionLink: "/bible" },

  // Try This
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Try This",
    text: "Map Daniel 2 → Daniel 7 → Daniel 8. Show how each prophecy 'enlarges' the last — like constellations aligning.",
    actionLabel: "Daniel 2", actionLink: "/bible?book=Daniel&chapter=2" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Try This",
    text: "Trace 'Lamb' from Genesis 22 → Exodus 12 → Isaiah 53 → John 1:29 → Revelation 5. One family tree.",
    actionLabel: "Start Trace", actionLink: "/bible?book=Genesis&chapter=22" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Try This",
    text: "Take Exodus 12 and stretch it across 5 dimensions: Literal, Christ, Me, Church, Heaven. See the diamond sparkle.",
    actionLabel: "Exodus 12", actionLink: "/bible?book=Exodus&chapter=12" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Try This",
    text: "Babel scattered languages. Pentecost united them. Find 3 more parallel actions that mirror across time.",
    actionLabel: "Parallels Room", actionLink: "/palace?room=P‖" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Try This",
    text: "Pick one verse and run it through all Five Ascensions: Text → Chapter → Book → Cycle → Heaven.",
    actionLabel: "Five Ascensions", actionLink: "/palace?room=FE" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Try This",
    text: "Which sanctuary furniture does your current passage connect to? Altar, Laver, Lampstand, Table, Incense, or Ark?",
    actionLabel: "Blue Room", actionLink: "/palace?room=BL" },
];

const CATEGORY_ACCENTS: Record<string, string> = {
  motivation: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
  action: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
  spiritual: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
  try_this: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
};

const CATEGORY_ICON_COLORS: Record<string, string> = {
  motivation: "text-amber-500",
  action: "text-blue-500",
  spiritual: "text-purple-500",
  try_this: "text-emerald-500",
};

const CATEGORY_BADGE_STYLES: Record<string, string> = {
  motivation: "bg-amber-500/20 text-amber-400",
  action: "bg-blue-500/20 text-blue-400",
  spiritual: "bg-purple-500/20 text-purple-400",
  try_this: "bg-emerald-500/20 text-emerald-400",
};

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function PersonalizedStudyBanner() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [studyPath, setStudyPath] = useState<{ title: string; description: string } | null>(null);
  const [promptIndex, setPromptIndex] = useState(0);

  // Select daily prompt based on day of year
  const dailyPrompt = useMemo<DailyPrompt>(() => {
    const day = getDayOfYear() + promptIndex;
    const prompt = PT_PROMPTS[day % PT_PROMPTS.length];
    return {
      ...prompt,
      accent: CATEGORY_ACCENTS[prompt.category],
    };
  }, [promptIndex]);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const load = async () => {
      try {
        const [profileRes, masteryRes, streakRes, gemsRes, roomsRes] = await Promise.all([
          supabase.from("profiles").select("display_name, avatar_url, master_title").eq("id", user.id).single(),
          supabase.from("global_master_titles").select("total_xp, current_floor").eq("user_id", user.id).maybeSingle(),
          supabase.from("mastery_streaks").select("current_streak").eq("user_id", user.id).maybeSingle(),
          supabase.from("user_gems").select("id", { count: "exact", head: true }).eq("user_id", user.id),
          supabase.from("room_mastery_levels").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("mastery_level", 5),
        ]);

        // Get last study from bookmarks
        const { data: lastBookmark } = await supabase
          .from("bookmarks")
          .select("book, chapter")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        // Get a random active study path for "Try This" enrichment
        const today = new Date().toISOString().split("T")[0];
        const { data: paths } = await (supabase as any)
          .from("generated_study_paths")
          .select("title, description")
          .eq("is_active", true)
          .eq("generation_date", today)
          .limit(3);

        if (paths && paths.length > 0) {
          const pick = paths[getDayOfYear() % paths.length];
          setStudyPath(pick);
        }

        setStats({
          displayName: profileRes.data?.display_name || "Scholar",
          avatarUrl: profileRes.data?.avatar_url || null,
          beltTitle: profileRes.data?.master_title || "none",
          streak: streakRes.data?.current_streak || 0,
          totalXp: masteryRes.data?.total_xp || 0,
          currentFloor: masteryRes.data?.current_floor || 1,
          gemsCount: gemsRes.count || 0,
          roomsMastered: roomsRes.count || 0,
          lastBook: lastBookmark?.book || null,
          lastChapter: lastBookmark?.chapter || null,
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

  // Dynamic streak message
  const streakMessage = stats.streak === 0
    ? "Start your streak today!"
    : stats.streak === 1
    ? "1 day — the journey begins!"
    : stats.streak < 7
    ? `${stats.streak}-day streak — building momentum!`
    : stats.streak < 30
    ? `🔥 ${stats.streak}-day streak — you're on fire!`
    : `🏆 ${stats.streak}-day streak — legendary!`;

  const shufflePrompt = () => setPromptIndex(prev => prev + 1);

  return (
    <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card/90 via-card/70 to-card/80 backdrop-blur-xl p-4 mb-6 shadow-lg space-y-3">
      {/* Row 1: Identity + Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Identity Cluster */}
        <div className="flex items-center gap-3 min-w-0">
          <Link to={`/user/${user.id}`} className="relative block">
            <Avatar className="h-11 w-11 ring-2 ring-primary/30 shadow-lg cursor-pointer hover:ring-primary/60 transition-all">
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
          </Link>
          <div className="min-w-0">
            <Link
              to={`/user/${user.id}`}
              className="font-semibold text-sm text-foreground truncate hover:text-primary transition-colors cursor-pointer block"
            >
              {stats.displayName.split(" ")[0]}
            </Link>
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
          <div className="flex items-center gap-1.5" title={streakMessage}>
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-bold text-foreground">{stats.streak}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Total XP">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-bold text-foreground">{stats.totalXp.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Gems Collected">
            <Sparkles className="h-4 w-4 text-cyan-500" />
            <span className="text-sm font-bold text-foreground">{stats.gemsCount}</span>
          </div>
          {stats.roomsMastered > 0 && (
            <div className="flex items-center gap-1.5" title="Rooms Mastered">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-bold text-foreground">{stats.roomsMastered}</span>
            </div>
          )}
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {stats.lastBook && (
              <Button asChild size="sm" variant="outline" className="text-xs h-7 bg-primary/5 border-primary/20 hover:bg-primary/10">
                <Link to={`/bible?book=${stats.lastBook}&chapter=${stats.lastChapter || 1}`}>
                  <BookOpen className="h-3 w-3 mr-1" />
                  {stats.lastBook} {stats.lastChapter}
                </Link>
              </Button>
            )}
            <Button asChild size="sm" className="text-xs h-7 gradient-palace text-white shadow-md">
              <Link to="/palace">
                <Swords className="h-3 w-3 mr-1" />
                Palace
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Row 2: Daily Prompt Card */}
      <div className={cn(
        "relative rounded-xl border bg-gradient-to-r p-3 transition-all duration-500",
        dailyPrompt.accent
      )}>
        <div className="flex items-start gap-3">
          {/* Category Icon */}
          <div className={cn(
            "flex-shrink-0 mt-0.5 rounded-lg bg-background/50 p-1.5",
            CATEGORY_ICON_COLORS[dailyPrompt.category]
          )}>
            {dailyPrompt.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className={cn("text-[10px] border-0 font-semibold", CATEGORY_BADGE_STYLES[dailyPrompt.category])}>
                {dailyPrompt.label}
              </Badge>
              <span className="text-[10px] text-muted-foreground italic">{streakMessage}</span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {dailyPrompt.text}
            </p>

            {/* Study Path enrichment */}
            {studyPath && dailyPrompt.category === "try_this" && (
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <Compass className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                <span>Today's Path: <span className="font-medium text-foreground/70">{studyPath.title}</span></span>
                <Button asChild size="sm" variant="ghost" className="h-5 px-2 text-[10px]">
                  <Link to="/study-ideas">Explore →</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {dailyPrompt.actionLink && (
              <Button asChild size="sm" variant="outline" className="text-xs h-7 bg-background/50 hover:bg-background/80 border-border/50">
                <Link to={dailyPrompt.actionLink}>
                  {dailyPrompt.actionLabel}
                  <ChevronRight className="h-3 w-3 ml-0.5" />
                </Link>
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={shufflePrompt}
              title="Show another prompt"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
