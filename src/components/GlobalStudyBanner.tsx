import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Flame, Zap, Crown, BookOpen,
  ChevronRight, Sparkles, Lightbulb, Target,
  Eye, Heart, RefreshCw, Brain,
  Star, Rocket, X, TrendingUp, Gem
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface DailyPrompt {
  category: "motivation" | "action" | "spiritual" | "try_this";
  icon: React.ReactNode;
  label: string;
  text: string;
  actionLabel?: string;
  actionLink?: string;
}

const ALL_PROMPTS: DailyPrompt[] = [
  // 🔥 Motivation — amber accent
  { category: "motivation", icon: <Flame className="h-3.5 w-3.5" />, label: "Daily Fire",
    text: "Every chapter hides Christ. Don't close the Book until you've found Him.", actionLabel: "Palace", actionLink: "/palace" },
  { category: "motivation", icon: <Crown className="h-3.5 w-3.5" />, label: "Rise Up",
    text: "You're building a palace in your mind — brick by brick, verse by verse. Keep climbing.", actionLabel: "Palace", actionLink: "/palace" },
  { category: "motivation", icon: <Rocket className="h-3.5 w-3.5" />, label: "Keep Going",
    text: "The 8th Floor is reflexive mastery — where the palace lives inside you. Every study gets you closer." },
  { category: "motivation", icon: <Zap className="h-3.5 w-3.5" />, label: "Ignite",
    text: "A gem you discover today could be the weapon you need tomorrow. Mine the Word relentlessly.", actionLabel: "Gems", actionLink: "/palace" },
  { category: "motivation", icon: <Star className="h-3.5 w-3.5" />, label: "You're Doing Great",
    text: "Every verse you study, every gem you collect — it's building something eternal. Christ sees your dedication." },
  { category: "motivation", icon: <Crown className="h-3.5 w-3.5" />, label: "Warrior",
    text: "The Word is your sword and your shield. Every session sharpens it. Stay in the fight." },

  // 🎯 Action — blue accent
  { category: "action", icon: <Eye className="h-3.5 w-3.5" />, label: "Detective Drill",
    text: "Pick any passage — write 20 observations without commentary. Train your eye like a detective.", actionLabel: "Start", actionLink: "/palace" },
  { category: "action", icon: <Target className="h-3.5 w-3.5" />, label: "Speed Drill",
    text: "Flip through a Gospel — list 5 Christ connections in 3 minutes. Train your reflex.", actionLabel: "Go", actionLink: "/palace" },
  { category: "action", icon: <Brain className="h-3.5 w-3.5" />, label: "Freestyle",
    text: "Connect your last verse to something you saw in nature today. Floor 3 trains spontaneous thought.", actionLabel: "Try", actionLink: "/palace" },
  { category: "action", icon: <BookOpen className="h-3.5 w-3.5" />, label: "Christ Hunt",
    text: "Open any OT chapter. Don't close it until you've named how Christ appears there.", actionLabel: "Begin", actionLink: "/bible" },
  { category: "action", icon: <Target className="h-3.5 w-3.5" />, label: "Juice Drill",
    text: "Take one book — run it through every PT room: story, observation, concentration, prophecy, cycle. Squeeze it dry.", actionLabel: "Palace", actionLink: "/palace" },

  // 💜 Spiritual — purple accent
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Fire Room",
    text: "Read Isaiah 53 slowly. Pause after every verse. Pray until it pierces.", actionLabel: "Read", actionLink: "/bible?book=Isaiah&chapter=53" },
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Meditate",
    text: "\"The LORD is my shepherd.\" Don't rush. Picture it. Pray it. Rest in it.", actionLabel: "Psalm 23", actionLink: "/bible?book=Psalms&chapter=23" },
  { category: "spiritual", icon: <Sparkles className="h-3.5 w-3.5" />, label: "Abide",
    text: "\"I am the vine, ye are the branches.\" No branch thrives severed from the Vine.", actionLabel: "John 15", actionLink: "/bible?book=John&chapter=15" },
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Surrender",
    text: "The system trains the mind, but the Spirit gives life. Pause — ask the Spirit to open your eyes." },
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Calvary",
    text: "Stand beneath the cross. Hear the mocking crowd. See the sky darken. Feel the ground tremble. He did this for you.", actionLabel: "John 19", actionLink: "/bible?book=John&chapter=19" },

  // 💡 Try This — green accent
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Try This",
    text: "Map Daniel 2 → 7 → 8. See how each prophecy 'enlarges' the last — like constellations aligning.", actionLabel: "Daniel 2", actionLink: "/bible?book=Daniel&chapter=2" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Try This",
    text: "Trace 'Lamb' from Genesis 22 → Exodus 12 → Isaiah 53 → John 1:29 → Revelation 5.", actionLabel: "Start", actionLink: "/bible?book=Genesis&chapter=22" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Try This",
    text: "Take Exodus 12 across 5 dimensions: Literal, Christ, Me, Church, Heaven.", actionLabel: "Exodus 12", actionLink: "/bible?book=Exodus&chapter=12" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Try This",
    text: "Babel scattered languages. Pentecost united them. Find 3 more mirrored parallels.", actionLabel: "Explore", actionLink: "/palace" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Try This",
    text: "Which sanctuary furniture does your current passage connect to? Altar, Laver, Lampstand, Ark?", actionLabel: "Blue Room", actionLink: "/palace" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Five Ascensions",
    text: "Run any verse through Text → Chapter → Book → Cycle → Heaven. Watch it expand at every level.", actionLabel: "Palace", actionLink: "/palace" },
];

const CATEGORY_STYLES: Record<string, { accent: string; iconColor: string; badgeBg: string }> = {
  motivation: { accent: "from-amber-500/15 to-orange-500/5 border-amber-500/25", iconColor: "text-amber-500", badgeBg: "bg-amber-500/20 text-amber-400" },
  action:     { accent: "from-blue-500/15 to-cyan-500/5 border-blue-500/25", iconColor: "text-blue-500", badgeBg: "bg-blue-500/20 text-blue-400" },
  spiritual:  { accent: "from-purple-500/15 to-pink-500/5 border-purple-500/25", iconColor: "text-purple-500", badgeBg: "bg-purple-500/20 text-purple-400" },
  try_this:   { accent: "from-emerald-500/15 to-teal-500/5 border-emerald-500/25", iconColor: "text-emerald-500", badgeBg: "bg-emerald-500/20 text-emerald-400" },
};

const ROTATE_INTERVAL_MS = 10 * 60 * 1000;

interface UserStats {
  displayName: string;
  avatarUrl: string | null;
  currentStreak: number;
  totalXp: number;
  gemsCount: number;
  masterTitle: string | null;
}

interface GlobalStudyBannerProps {
  userId?: string | null;
  userEmail?: string | null;
}

function useUserBannerStats(userId: string | null, fallbackDisplayName: string) {
  const [stats, setStats] = useState<UserStats>({
    displayName: fallbackDisplayName,
    avatarUrl: null,
    currentStreak: 0,
    totalXp: 0,
    gemsCount: 0,
    masterTitle: null,
  });

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      const [profileRes, streakRes, progressRes, gemsRes] = await Promise.all([
        supabase.from("profiles").select("display_name, avatar_url, master_title, level, points").eq("id", userId).maybeSingle(),
        (supabase as any).from("mastery_streaks").select("current_streak").eq("user_id", userId).maybeSingle(),
        (supabase as any).from("palace_progress").select("total_xp, master_title").eq("user_id", userId).maybeSingle(),
        (supabase as any).from("user_gems").select("id", { count: "exact", head: true }).eq("user_id", userId),
      ]);

      const profileTitle = profileRes.data?.master_title;
      const palaceTitle = progressRes.data?.master_title;
      const totalXp = progressRes.data?.total_xp || profileRes.data?.points || 0;

      setStats({
        displayName: profileRes.data?.display_name || fallbackDisplayName,
        avatarUrl: profileRes.data?.avatar_url || null,
        currentStreak: streakRes.data?.current_streak || 0,
        totalXp,
        gemsCount: gemsRes.count || 0,
        masterTitle: palaceTitle || profileTitle || null,
      });
    };

    load().catch(() => {});
  }, [userId, fallbackDisplayName]);

  return stats;
}

function getStreakMessage(streak: number): string | null {
  if (streak >= 30) return `🔥 ${streak}-day streak — you're on fire!`;
  if (streak >= 14) return `⚡ ${streak}-day streak — unstoppable momentum!`;
  if (streak >= 7) return `✨ ${streak}-day streak — building momentum!`;
  if (streak >= 3) return `🌱 ${streak}-day streak — keep it growing!`;
  if (streak === 1) return `👣 Day 1 — every palace starts with one brick.`;
  return null;
}

function getXpRank(xp: number): { label: string; color: string } {
  if (xp >= 10000) return { label: "Master", color: "bg-yellow-500/20 text-yellow-400" };
  if (xp >= 5000) return { label: "Scholar", color: "bg-purple-500/20 text-purple-400" };
  if (xp >= 2000) return { label: "Apprentice", color: "bg-blue-500/20 text-blue-400" };
  if (xp >= 500) return { label: "Student", color: "bg-emerald-500/20 text-emerald-400" };
  return { label: "Explorer", color: "bg-sky-500/20 text-sky-400" };
}

export function GlobalStudyBanner({ userId, userEmail }: GlobalStudyBannerProps = {}) {
  const { user: authUser } = useAuth();
  const resolvedUserId = userId ?? authUser?.id ?? null;
  const fallbackDisplayName = (userEmail ?? authUser?.email)?.split("@")[0] || "Scholar";

  const [dismissed, setDismissed] = useState(false);
  const [promptIdx, setPromptIdx] = useState(() =>
    Math.floor(Date.now() / ROTATE_INTERVAL_MS) % ALL_PROMPTS.length
  );
  const stats = useUserBannerStats(resolvedUserId, fallbackDisplayName);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIdx(prev => (prev + 1) % ALL_PROMPTS.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const shuffle = useCallback(() => {
    setPromptIdx(prev => (prev + 1) % ALL_PROMPTS.length);
  }, []);

  if (!resolvedUserId) return null;

  const prompt = ALL_PROMPTS[promptIdx];
  const style = CATEGORY_STYLES[prompt.category];
  const rank = getXpRank(stats.totalXp);
  const streakMsg = getStreakMessage(stats.currentStreak);
  const initials = (stats.displayName || fallbackDisplayName).slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 mt-2 space-y-1.5">
      {/* Row 1: Identity + Stats */}
      <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm px-3 py-2 flex items-center gap-3">
        {/* Avatar */}
        <Link to="/profile" className="flex-shrink-0">
          <Avatar className="h-8 w-8 ring-2 ring-primary/30">
            <AvatarImage src={stats.avatarUrl || undefined} alt={stats.displayName} />
            <AvatarFallback className="text-xs bg-primary/20 text-primary font-bold">{initials}</AvatarFallback>
          </Avatar>
        </Link>

        {/* Name + rank */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-foreground truncate max-w-[120px] sm:max-w-none">
              {stats.displayName}
            </span>
            <Badge className={cn("text-[10px] border-0 font-semibold", rank.color)}>
              {stats.masterTitle || rank.label}
            </Badge>
          </div>
          {streakMsg && (
            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <TrendingUp className="h-2.5 w-2.5" />
              {streakMsg}
            </p>
          )}
        </div>

        {/* Stats chips */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-1 text-xs text-muted-foreground" title="XP">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-medium text-foreground">{stats.totalXp.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Gems">
            <Gem className="h-3.5 w-3.5 text-cyan-500" />
            <span className="font-medium text-foreground">{stats.gemsCount}</span>
          </div>
          {stats.currentStreak > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Streak">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span className="font-medium text-foreground">{stats.currentStreak}d</span>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Rotating Prompt Card */}
      {!dismissed && (
        <AnimatePresence mode="wait">
          <motion.div
            key={promptIdx}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.3 }}
          >
            <div className={cn(
              "rounded-xl border bg-gradient-to-r backdrop-blur-sm px-3 py-2 flex items-center gap-2.5 transition-all",
              style.accent
            )}>
              <div className={cn("flex-shrink-0", style.iconColor)}>
                {prompt.icon}
              </div>

              <Badge className={cn("text-[10px] border-0 font-semibold flex-shrink-0 hidden sm:inline-flex", style.badgeBg)}>
                {prompt.label}
              </Badge>

              <p className="text-xs text-foreground/85 leading-snug flex-1 min-w-0 truncate sm:whitespace-normal sm:line-clamp-1">
                {prompt.text}
              </p>

              <div className="flex items-center gap-1 flex-shrink-0">
                {prompt.actionLink && (
                  <Button asChild size="sm" variant="ghost" className="text-[11px] h-6 px-2 hover:bg-background/50">
                    <Link to={prompt.actionLink}>
                      {prompt.actionLabel}
                      <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Link>
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={shuffle} title="Shuffle">
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={() => setDismissed(true)} title="Dismiss">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
