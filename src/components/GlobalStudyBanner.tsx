import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Flame, Zap, Crown, BookOpen,
  ChevronRight, Sparkles, Lightbulb, Target,
  Eye, Heart, RefreshCw, Brain,
  Star, Rocket, X, TrendingUp, Gem,
  Gamepad2, Swords, Shield, Trophy, Puzzle, Users, Timer, Map
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  XpPopover, GemsPopover, RoomsPopover,
  ChaptersPopover, FloorsPopover, StreakPopover
} from "@/components/banner/StatPopovers";
import { StudyHealthRing } from "@/components/banner/StudyHealthRing";
import { MissionDropdown } from "@/components/banner/MissionDropdown";
import { AccountabilityBar } from "@/components/banner/AccountabilityBar";

interface DailyPrompt {
  category: "motivation" | "action" | "spiritual" | "try_this";
  icon: React.ReactNode;
  label: string;
  text: string;
  actionLabel?: string;
  actionLink?: string;
}

const ALL_PROMPTS: DailyPrompt[] = [
  { category: "motivation", icon: <Flame className="h-3.5 w-3.5" />, label: "Daily Fire",
    text: "Every chapter hides Christ. Don't close the Book until you've found Him.", actionLabel: "Concentration Room", actionLink: "/palace?room=CR" },
  { category: "motivation", icon: <Crown className="h-3.5 w-3.5" />, label: "Rise Up",
    text: "You're building a palace in your mind — brick by brick, verse by verse. Keep climbing.", actionLabel: "Palace", actionLink: "/palace" },
  { category: "motivation", icon: <Rocket className="h-3.5 w-3.5" />, label: "Keep Going",
    text: "The 8th Floor is reflexive mastery — where the palace lives inside you. Every study gets you closer.", actionLabel: "Infinity Room", actionLink: "/palace?room=∞" },
  { category: "motivation", icon: <Zap className="h-3.5 w-3.5" />, label: "Ignite",
    text: "A gem you discover today could be the weapon you need tomorrow. Mine the Word relentlessly.", actionLabel: "Gem Room", actionLink: "/palace?room=GR" },
  { category: "motivation", icon: <Star className="h-3.5 w-3.5" />, label: "You're Doing Great",
    text: "Every verse you study, every gem you collect — it's building something eternal. Christ sees your dedication." },
  { category: "motivation", icon: <Crown className="h-3.5 w-3.5" />, label: "Warrior",
    text: "The Word is your sword and your shield. Every session sharpens it. Stay in the fight." },

  { category: "action", icon: <Eye className="h-3.5 w-3.5" />, label: "Detective Drill",
    text: "Pick any passage — write 20 observations without commentary. Train your eye like a detective.", actionLabel: "Investigation Room", actionLink: "/palace?room=IR" },
  { category: "action", icon: <Target className="h-3.5 w-3.5" />, label: "Speed Drill",
    text: "Flip through a Gospel — list 5 Christ connections in 3 minutes. Train your reflex.", actionLabel: "Concentration Room", actionLink: "/palace?room=CR" },
  { category: "action", icon: <Brain className="h-3.5 w-3.5" />, label: "Freestyle",
    text: "Connect your last verse to something you saw in nature today. Floor 3 trains spontaneous thought.", actionLabel: "Freestyle Room", actionLink: "/palace?room=NF" },
  { category: "action", icon: <BookOpen className="h-3.5 w-3.5" />, label: "Christ Hunt",
    text: "Open any OT chapter. Don't close it until you've named how Christ appears there.", actionLabel: "Concentration Room", actionLink: "/palace?room=CR" },
  { category: "action", icon: <Target className="h-3.5 w-3.5" />, label: "Juice Drill",
    text: "Take one book — run it through every PT room: story, observation, concentration, prophecy, cycle. Squeeze it dry.", actionLabel: "Story Room", actionLink: "/palace?room=SR" },

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

  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Try This",
    text: "Map Daniel 2 → 7 → 8. See how each prophecy 'enlarges' the last — like constellations aligning.", actionLabel: "Daniel 2", actionLink: "/bible?book=Daniel&chapter=2" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Try This",
    text: "Trace 'Lamb' from Genesis 22 → Exodus 12 → Isaiah 53 → John 1:29 → Revelation 5.", actionLabel: "Start", actionLink: "/bible?book=Genesis&chapter=22" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Try This",
    text: "Take Exodus 12 across 5 dimensions: Literal, Christ, Me, Church, Heaven.", actionLabel: "Exodus 12", actionLink: "/bible?book=Exodus&chapter=12" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Try This",
    text: "Babel scattered languages. Pentecost united them. Find 3 more mirrored parallels.", actionLabel: "Parallels Room", actionLink: "/palace?room=P‖" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Try This",
    text: "Which sanctuary furniture does your current passage connect to? Altar, Laver, Lampstand, Ark?", actionLabel: "Blue Room", actionLink: "/palace?room=BL" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Five Ascensions",
    text: "Run any verse through Text → Chapter → Book → Cycle → Heaven. Watch it expand at every level.", actionLabel: "Five Ascensions", actionLink: "/palace?room=FE" },

  // ─── Games ───────────────────────────────────────────────────
  { category: "action", icon: <Gamepad2 className="h-3.5 w-3.5" />, label: "Chain Chess",
    text: "Build a chain of connected verses — each link must touch the last. How long can you go?", actionLabel: "Start", actionLink: "/chain-chess" },
  { category: "action", icon: <Gamepad2 className="h-3.5 w-3.5" />, label: "PT Jeopardy",
    text: "Test your Palace knowledge Jeopardy-style. Pick a category, name your price.", actionLabel: "Go", actionLink: "/games/pt-jeopardy" },
  { category: "action", icon: <Puzzle className="h-3.5 w-3.5" />, label: "Escape Room",
    text: "Solve biblical puzzles and connect verses to unlock the door. Can you escape?", actionLabel: "Start", actionLink: "/escape-room" },
  { category: "action", icon: <Puzzle className="h-3.5 w-3.5" />, label: "Symbol Decoder",
    text: "Match biblical symbols to their meanings. Unlock typology patterns hidden in plain sight.", actionLabel: "Go", actionLink: "/games/symbol-decoder" },
  { category: "action", icon: <Gamepad2 className="h-3.5 w-3.5" />, label: "Sanctuary Run",
    text: "Tell the gospel story using 3 random sanctuary items — in order.", actionLabel: "Go", actionLink: "/games/sanctuary-run" },
  { category: "action", icon: <Eye className="h-3.5 w-3.5" />, label: "Observation Flux",
    text: "Verb blocks fall as you type observations. See what's actually there — observe, don't interpret.", actionLabel: "Go", actionLink: "/games/observation-room" },
  { category: "action", icon: <Gamepad2 className="h-3.5 w-3.5" />, label: "PT Scrabble",
    text: "Place Palace room cards on the board. Each card must connect theologically to its neighbor.", actionLabel: "Start", actionLink: "/pt-scrabble" },
  { category: "action", icon: <Target className="h-3.5 w-3.5" />, label: "Christ Lock",
    text: "Draw a Christ-focus card, get a random verse — explain how it reveals Jesus.", actionLabel: "Go", actionLink: "/games/christ-lock" },
  { category: "action", icon: <Sparkles className="h-3.5 w-3.5" />, label: "Freestyle Zone",
    text: "Jeeves drops a random prompt from Scripture, nature, or history. Respond with a PT connection.", actionLabel: "Go", actionLink: "/games/freestyle-zone" },
  { category: "action", icon: <Timer className="h-3.5 w-3.5" />, label: "Speed Verse",
    text: "Memorize a verse, then recall it under time pressure. How fast is your Scripture reflex?", actionLabel: "Go", actionLink: "/games/speed-verse-3d" },
  { category: "action", icon: <Gamepad2 className="h-3.5 w-3.5" />, label: "Story Room Game",
    text: "Arrange biblical events in sequence — master the narrative flow of Scripture.", actionLabel: "Go", actionLink: "/games/story-room" },
  { category: "action", icon: <Gamepad2 className="h-3.5 w-3.5" />, label: "Parallels Match",
    text: "Match events that mirror each other across Scripture — Babel ↔ Pentecost and beyond.", actionLabel: "Go", actionLink: "/games/palace-cards" },
  { category: "action", icon: <Gem className="h-3.5 w-3.5" />, label: "Five Dimensions Game",
    text: "View one verse like a diamond under five lights: Literal, Christ, Me, Church, Heaven.", actionLabel: "Go", actionLink: "/games/dimensions-room" },
  { category: "action", icon: <Gamepad2 className="h-3.5 w-3.5" />, label: "Blue Room Game",
    text: "Match sanctuary articles to their gospel meanings. Master God's blueprint of salvation.", actionLabel: "Go", actionLink: "/games/blue-room" },
  { category: "action", icon: <Gamepad2 className="h-3.5 w-3.5" />, label: "Chef Challenge",
    text: "Create a \"biblical recipe\" — a mini-sermon using ONLY Bible verse references.", actionLabel: "Go", actionLink: "/games/chef-challenge" },
  { category: "action", icon: <Timer className="h-3.5 w-3.5" />, label: "Principle Sprint",
    text: "Identify PT principles at speed. Select all correct ones before time runs out.", actionLabel: "Go", actionLink: "/games/principle-sprint" },
  { category: "action", icon: <Map className="h-3.5 w-3.5" />, label: "Treasure Hunt",
    text: "Follow biblical clues across Scripture to find hidden treasures.", actionLabel: "Start", actionLink: "/treasure-hunt" },
  { category: "action", icon: <Gamepad2 className="h-3.5 w-3.5" />, label: "Time Zone Invasion",
    text: "Pick 2 time zones for a verse and defend your prophetic framing.", actionLabel: "Go", actionLink: "/games/time-zone-invasion" },

  // ─── Study Activities ────────────────────────────────────────
  { category: "try_this", icon: <Trophy className="h-3.5 w-3.5" />, label: "Weekly Challenge",
    text: "Join this week's community study challenge. Compete, share insights, climb the board.", actionLabel: "Go", actionLink: "/weekly-challenge" },
  { category: "try_this", icon: <Zap className="h-3.5 w-3.5" />, label: "Daily Challenge",
    text: "A new challenge drops every day — 30-day rotation. Today's might surprise you.", actionLabel: "Go", actionLink: "/daily-challenges" },
  { category: "try_this", icon: <Target className="h-3.5 w-3.5" />, label: "Training Drills",
    text: "Room-specific drills with AI grading. Pick a room, submit your work, get real feedback.", actionLabel: "Go", actionLink: "/training-drills" },
  { category: "try_this", icon: <Brain className="h-3.5 w-3.5" />, label: "Analyze Thoughts",
    text: "Write your theological thoughts and let Jeeves score them across 6 dimensions.", actionLabel: "Go", actionLink: "/analyze-thoughts" },
  { category: "try_this", icon: <BookOpen className="h-3.5 w-3.5" />, label: "Flashcards",
    text: "Create or study AI-generated flashcard sets. Drill the Word into memory.", actionLabel: "Go", actionLink: "/flashcards" },
  { category: "try_this", icon: <Star className="h-3.5 w-3.5" />, label: "Verse Memory Hall",
    text: "Your memorized verses on display. Build the collection — it sharpens the sword.", actionLabel: "Go", actionLink: "/verse-memory-hall" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Branch Study",
    text: "Follow an interactive branching Bible study. Every choice opens a new cross-reference.", actionLabel: "Go", actionLink: "/branch-study" },
  { category: "try_this", icon: <Map className="h-3.5 w-3.5" />, label: "Study Paths",
    text: "Follow a guided study path through the Palace. Structured. Progressive. Powerful.", actionLabel: "Go", actionLink: "/paths" },
  { category: "try_this", icon: <Puzzle className="h-3.5 w-3.5" />, label: "Equations Challenge",
    text: "Solve biblical equations or create your own — share them with the community.", actionLabel: "Go", actionLink: "/equations-challenge" },

  // ─── Room Exploration ────────────────────────────────────────
  { category: "try_this", icon: <Eye className="h-3.5 w-3.5" />, label: "Observation Room",
    text: "Sit with a passage and write what you SEE — not what you think. Pure observation first.", actionLabel: "Go", actionLink: "/palace?room=OR" },
  { category: "try_this", icon: <Shield className="h-3.5 w-3.5" />, label: "Def-Com Room",
    text: "Enter the defense-combat chamber. Identify the enemy's tactic, then counter with truth.", actionLabel: "Go", actionLink: "/palace?room=DC" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Symbols Room",
    text: "Every lion, lamb, and serpent means something. Crack the code — decode the types.", actionLabel: "Go", actionLink: "/palace?room=ST" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Theme Room",
    text: "Trace a theological theme across all of Scripture. Life of Christ, Sanctuary, Great Controversy.", actionLabel: "Go", actionLink: "/palace?room=TRm" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Time Zone Room",
    text: "Past, present, future — every verse echoes across time. Place your passage on the timeline.", actionLabel: "Go", actionLink: "/palace?room=TZ" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Prophecy Room",
    text: "Open Daniel or Revelation. Map the prophetic timeline with precision.", actionLabel: "Go", actionLink: "/palace?room=PR" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Three Angels",
    text: "How does your passage connect to the Three Angels' Messages? Rev 14:6-12 touches everything.", actionLabel: "Go", actionLink: "/palace?room=3A" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Feasts Room",
    text: "Which feast does your passage connect to? Passover, Pentecost, Atonement, Tabernacles?", actionLabel: "Go", actionLink: "/palace?room=FE" },
  { category: "try_this", icon: <Flame className="h-3.5 w-3.5" />, label: "Fire Room",
    text: "Enter the furnace. Transformation happens under pressure — let the Word refine you.", actionLabel: "Go", actionLink: "/palace?room=FRm" },
  { category: "try_this", icon: <Heart className="h-3.5 w-3.5" />, label: "Meditation Room",
    text: "Slow down. One verse. No rushing. Sit with it until it speaks back.", actionLabel: "Go", actionLink: "/palace?room=MR" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Listening Room",
    text: "Before you speak, listen. Hear what the text is saying on its own terms.", actionLabel: "Go", actionLink: "/palace?room=LR" },

  // ─── Defense Mode ────────────────────────────────────────────
  { category: "action", icon: <Swords className="h-3.5 w-3.5" />, label: "FORGE Arena",
    text: "Enter the sparring arena. Pick an opponent, pick a doctrine — defend the faith.", actionLabel: "Go", actionLink: "/living-manna?tab=defense" },
  { category: "action", icon: <Shield className="h-3.5 w-3.5" />, label: "Analyze Attack",
    text: "Paste a critic's argument. Let Jeeves expose the fallacies and arm you with a counter.", actionLabel: "Go", actionLink: "/living-manna?tab=defense" },

  // ─── Community ───────────────────────────────────────────────
  { category: "motivation", icon: <Users className="h-3.5 w-3.5" />, label: "Palace Lounge",
    text: "Iron sharpens iron. Share what you're studying, ask questions, encourage someone.", actionLabel: "Go", actionLink: "/community" },
];

const CATEGORY_STYLES: Record<string, { accent: string; iconColor: string; badgeBg: string }> = {
  motivation: { accent: "from-amber-500/15 to-orange-500/5 border-amber-500/25", iconColor: "text-amber-500", badgeBg: "bg-amber-500/20 text-amber-400" },
  action:     { accent: "from-blue-500/15 to-cyan-500/5 border-blue-500/25", iconColor: "text-blue-500", badgeBg: "bg-blue-500/20 text-blue-400" },
  spiritual:  { accent: "from-purple-500/15 to-pink-500/5 border-purple-500/25", iconColor: "text-purple-500", badgeBg: "bg-purple-500/20 text-purple-400" },
  try_this:   { accent: "from-emerald-500/15 to-teal-500/5 border-emerald-500/25", iconColor: "text-emerald-500", badgeBg: "bg-emerald-500/20 text-emerald-400" },
};

const ROTATE_INTERVAL_MS = 10 * 60 * 1000;

// ─── Behavioral Nudge Messages ──────────────────────────────
const NUDGE_MESSAGES: Record<string, string> = {
  inactive_3d: "Your Palace misses you. Come back and build.",
  streak_14: "Consistency is becoming identity.",
  streak_30: "You're not just studying — you're being transformed.",
  first_visit: "Welcome to the Palace. Your journey begins now.",
};

interface UserStats {
  displayName: string;
  avatarUrl: string | null;
  currentStreak: number;
  totalXp: number;
  gemsCount: number;
  masterTitle: string | null;
  roomsExplored: number;
  chaptersRead: number;
  floorsUnlocked: number;
  lastActivityDaysAgo: number;
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
    roomsExplored: 0,
    chaptersRead: 0,
    floorsUnlocked: 1,
    lastActivityDaysAgo: 0,
  });

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      const [profileRes, streakRes, progressRes, gemsRes, roomsRes, readingRes, floorsRes, masteryStreakRes] = await Promise.all([
        supabase.from("profiles").select("display_name, avatar_url, master_title, level, points").eq("id", userId).maybeSingle(),
        (supabase as any).from("mastery_streaks").select("current_streak, last_activity_date").eq("user_id", userId).maybeSingle(),
        (supabase as any).from("palace_progress").select("total_xp, master_title").eq("user_id", userId).maybeSingle(),
        (supabase as any).from("user_gems").select("id", { count: "exact", head: true }).eq("user_id", userId),
        (supabase as any).from("room_mastery_levels").select("room_id", { count: "exact", head: true }).eq("user_id", userId),
        (supabase as any).from("reading_streaks").select("total_chapters_read").eq("user_id", userId).maybeSingle(),
        (supabase as any).from("user_floor_progress").select("floor_number", { count: "exact", head: true }).eq("user_id", userId).eq("is_unlocked", true),
        (supabase as any).from("mastery_streaks").select("last_activity_date").eq("user_id", userId).maybeSingle(),
      ]);

      const profileTitle = profileRes.data?.master_title;
      const palaceTitle = progressRes.data?.master_title;
      const totalXp = progressRes.data?.total_xp || profileRes.data?.points || 0;

      // Calculate days since last activity
      let lastActivityDaysAgo = 0;
      const lastDate = masteryStreakRes.data?.last_activity_date;
      if (lastDate) {
        const diff = Date.now() - new Date(lastDate).getTime();
        lastActivityDaysAgo = Math.floor(diff / (1000 * 60 * 60 * 24));
      }

      setStats({
        displayName: profileRes.data?.display_name || fallbackDisplayName,
        avatarUrl: profileRes.data?.avatar_url || null,
        currentStreak: streakRes.data?.current_streak || 0,
        totalXp,
        gemsCount: gemsRes.count || 0,
        masterTitle: palaceTitle || profileTitle || null,
        roomsExplored: roomsRes.count || 0,
        chaptersRead: readingRes.data?.total_chapters_read || 0,
        floorsUnlocked: floorsRes.count || 1,
        lastActivityDaysAgo,
      });
    };

    load().catch(() => {});
  }, [userId, fallbackDisplayName]);

  return stats;
}

function getXpRank(xp: number): { label: string; color: string } {
  if (xp >= 10000) return { label: "Master", color: "bg-yellow-500/20 text-yellow-400" };
  if (xp >= 5000) return { label: "Scholar", color: "bg-purple-500/20 text-purple-400" };
  if (xp >= 2000) return { label: "Apprentice", color: "bg-blue-500/20 text-blue-400" };
  if (xp >= 500) return { label: "Student", color: "bg-emerald-500/20 text-emerald-400" };
  return { label: "Explorer", color: "bg-sky-500/20 text-sky-400" };
}

function getTitleBadgeStyle(title: string | null): string {
  if (!title) return "bg-sky-500/20 text-sky-400";
  const t = title.toLowerCase();
  if (t.includes("master") || t.includes("gold")) return "bg-yellow-500/20 text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.3)]";
  if (t.includes("black")) return "bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.35)]";
  if (t.includes("red")) return "bg-red-500/20 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]";
  if (t.includes("purple")) return "bg-purple-500/20 text-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.3)]";
  if (t.includes("blue")) return "bg-blue-500/20 text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.3)]";
  if (t.includes("green")) return "bg-emerald-500/20 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]";
  if (t.includes("brown") || t.includes("orange")) return "bg-orange-500/20 text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.3)]";
  if (t.includes("white")) return "bg-slate-200/20 text-slate-300 shadow-[0_0_8px_rgba(148,163,184,0.3)]";
  if (t.includes("yellow")) return "bg-yellow-500/20 text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.3)]";
  return "bg-primary/20 text-primary shadow-[0_0_8px_hsl(var(--primary)/0.3)]";
}

function getBehavioralNudge(stats: UserStats): string | null {
  if (stats.lastActivityDaysAgo >= 3) return NUDGE_MESSAGES.inactive_3d;
  if (stats.currentStreak >= 30) return NUDGE_MESSAGES.streak_30;
  if (stats.currentStreak >= 14) return NUDGE_MESSAGES.streak_14;
  if (stats.totalXp === 0) return NUDGE_MESSAGES.first_visit;
  return null;
}

export function GlobalStudyBanner({ userId, userEmail }: GlobalStudyBannerProps = {}) {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const resolvedUserId = userId ?? authUser?.id ?? null;
  const fallbackDisplayName = (userEmail ?? authUser?.email)?.split("@")[0] || "Scholar";

  const [dismissed, setDismissed] = useState(false);
  const [promptIdx, setPromptIdx] = useState(() =>
    Math.floor(Date.now() / ROTATE_INTERVAL_MS) % ALL_PROMPTS.length
  );
  const [xpFlash, setXpFlash] = useState(false);
  const stats = useUserBannerStats(resolvedUserId, fallbackDisplayName);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIdx(prev => (prev + 1) % ALL_PROMPTS.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Micro-animation: XP flash when totalXp changes
  const [prevXp, setPrevXp] = useState(0);
  useEffect(() => {
    if (stats.totalXp > prevXp && prevXp > 0) {
      setXpFlash(true);
      setTimeout(() => setXpFlash(false), 1200);
    }
    setPrevXp(stats.totalXp);
  }, [stats.totalXp]);

  const shuffle = useCallback(() => {
    setPromptIdx(prev => (prev + 1) % ALL_PROMPTS.length);
  }, []);

  if (!resolvedUserId) return null;

  const prompt = ALL_PROMPTS[promptIdx];
  const style = CATEGORY_STYLES[prompt.category];
  const rank = getXpRank(stats.totalXp);
  const initials = (stats.displayName || fallbackDisplayName).slice(0, 2).toUpperCase();
  const displayTitle = stats.masterTitle || rank.label;
  const titleBadgeStyle = stats.masterTitle ? getTitleBadgeStyle(stats.masterTitle) : rank.color;
  const nudge = getBehavioralNudge(stats);
  const isInactive = stats.lastActivityDaysAgo >= 3;

  return (
    <div className={cn(
      "mx-auto max-w-7xl px-3 sm:px-4 md:px-6 mt-2 space-y-1.5 transition-opacity duration-700",
      isInactive && "opacity-80"
    )}>
      {/* Nudge bar */}
      <AnimatePresence>
        {nudge && !dismissed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={cn(
              "rounded-lg px-3 py-1.5 text-center text-xs font-medium",
              isInactive
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            )}>
              {nudge}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Row 1: Identity + Clickable Stats + Health Ring + Accountability */}
      <div className={cn(
        "rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-950/80 via-indigo-950/60 to-teal-950/50 backdrop-blur-sm px-4 py-3 flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.08)] transition-all duration-500",
        xpFlash && "shadow-[0_0_30px_rgba(234,179,8,0.25)]"
      )}>
        {/* Avatar with Health Ring */}
        <Link to="/profile" className="flex-shrink-0">
          <StudyHealthRing
            roomsExplored={stats.roomsExplored}
            chaptersRead={stats.chaptersRead}
            currentStreak={stats.currentStreak}
            totalXp={stats.totalXp}
            gemsCount={stats.gemsCount}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={stats.avatarUrl || undefined} alt={stats.displayName} />
              <AvatarFallback className="text-xs bg-blue-500/20 text-blue-300 font-bold">{initials}</AvatarFallback>
            </Avatar>
          </StudyHealthRing>
        </Link>

        {/* Name (clickable → Mission Dropdown) + rank */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <MissionDropdown displayName={stats.displayName}>
              <span className="text-sm font-semibold text-foreground truncate max-w-[140px] sm:max-w-none hover:text-blue-300 transition-colors">
                {stats.displayName}
              </span>
            </MissionDropdown>
            <Badge className={cn("text-[10px] border-0 font-bold uppercase tracking-wider px-2", titleBadgeStyle)}>
              {displayTitle}
            </Badge>
          </div>
          {/* Accountability indicators */}
          <div className="mt-0.5">
            <AccountabilityBar
              currentStreak={stats.currentStreak}
              chaptersRead={stats.chaptersRead}
              roomsExplored={stats.roomsExplored}
            />
          </div>
        </div>

        {/* Clickable Stats chips — each opens mini-dashboard */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 flex-wrap justify-end">
          <motion.div animate={xpFlash ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.4 }}>
            <XpPopover
              totalXp={stats.totalXp}
              roomsExplored={stats.roomsExplored}
              chaptersRead={stats.chaptersRead}
              currentStreak={stats.currentStreak}
              gemsCount={stats.gemsCount}
            />
          </motion.div>

          <GemsPopover gemsCount={stats.gemsCount} />
          <RoomsPopover roomsExplored={stats.roomsExplored} />

          <div className="hidden sm:block">
            <ChaptersPopover chaptersRead={stats.chaptersRead} />
          </div>
          <div className="hidden sm:block">
            <FloorsPopover floorsUnlocked={stats.floorsUnlocked} />
          </div>
          
          <StreakPopover currentStreak={stats.currentStreak} />
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
              style.accent,
              prompt.actionLink && "cursor-pointer active:opacity-80"
            )}
              onClick={() => { if (prompt.actionLink) navigate(prompt.actionLink); }}
            >
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
                    <Link to={prompt.actionLink} onClick={(e) => e.stopPropagation()}>
                      {prompt.actionLabel}
                      <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Link>
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); shuffle(); }} title="Shuffle">
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); setDismissed(true); }} title="Dismiss">
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
