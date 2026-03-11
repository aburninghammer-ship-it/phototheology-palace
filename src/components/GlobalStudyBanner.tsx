import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Flame, Zap, Crown, BookOpen, Swords,
  ChevronRight, Sparkles, Trophy, Lightbulb, Target,
  Eye, Heart, RefreshCw, Brain, Share2, HelpCircle,
  Star, Rocket, Gift, Users, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface DailyPrompt {
  category: "motivation" | "action" | "spiritual" | "try_this" | "share" | "did_you_know" | "encouragement";
  icon: React.ReactNode;
  label: string;
  text: string;
  actionLabel?: string;
  actionLink?: string;
}

// All prompt pools
const ALL_PROMPTS: DailyPrompt[] = [
  // Motivation
  { category: "motivation", icon: <Flame className="h-3.5 w-3.5" />, label: "Daily Fire",
    text: "Every chapter hides Christ. Don't close the Book until you've found Him.", actionLabel: "Palace", actionLink: "/palace" },
  { category: "motivation", icon: <Crown className="h-3.5 w-3.5" />, label: "Rise Up",
    text: "You're building a palace in your mind — brick by brick, verse by verse. Keep climbing.", actionLabel: "Palace", actionLink: "/palace" },
  { category: "motivation", icon: <Rocket className="h-3.5 w-3.5" />, label: "Keep Going",
    text: "The 8th Floor is reflexive mastery — where the palace lives inside you. Every study gets you closer." },
  { category: "motivation", icon: <Zap className="h-3.5 w-3.5" />, label: "Ignite",
    text: "A gem you discover today could be the weapon you need tomorrow. Mine the Word relentlessly.", actionLabel: "Gems", actionLink: "/palace" },

  // Action
  { category: "action", icon: <Eye className="h-3.5 w-3.5" />, label: "Detective Drill",
    text: "Pick any passage — write 20 observations without commentary. Train your eye like a detective.", actionLabel: "Start", actionLink: "/palace" },
  { category: "action", icon: <Target className="h-3.5 w-3.5" />, label: "Speed Drill",
    text: "Flip through a Gospel — list 5 Christ connections in 3 minutes. Train your reflex.", actionLabel: "Go", actionLink: "/palace" },
  { category: "action", icon: <Brain className="h-3.5 w-3.5" />, label: "Freestyle",
    text: "Connect your last verse to something you saw in nature today. Floor 3 trains spontaneous thought.", actionLabel: "Try", actionLink: "/palace" },
  { category: "action", icon: <BookOpen className="h-3.5 w-3.5" />, label: "Christ Hunt",
    text: "Open any OT chapter. Don't close it until you've named how Christ appears there.", actionLabel: "Begin", actionLink: "/bible" },

  // Spiritual
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Fire Room",
    text: "Read Isaiah 53 slowly. Pause after every verse. Pray until it pierces.", actionLabel: "Read", actionLink: "/bible?book=Isaiah&chapter=53" },
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Meditate",
    text: "\"The LORD is my shepherd.\" Don't rush. Picture it. Pray it. Rest in it.", actionLabel: "Psalm 23", actionLink: "/bible?book=Psalms&chapter=23" },
  { category: "spiritual", icon: <Sparkles className="h-3.5 w-3.5" />, label: "Abide",
    text: "\"I am the vine, ye are the branches.\" No branch thrives severed from the Vine.", actionLabel: "John 15", actionLink: "/bible?book=John&chapter=15" },
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Surrender",
    text: "The system trains the mind, but the Spirit gives life. Pause — ask the Spirit to open your eyes." },

  // Try This
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

  // Share
  { category: "share", icon: <Share2 className="h-3.5 w-3.5" />, label: "Share",
    text: "Know someone who'd love to study Scripture deeper? Share Phototheology with them!", actionLabel: "Share App", actionLink: "/pricing" },
  { category: "share", icon: <Gift className="h-3.5 w-3.5" />, label: "Gift",
    text: "Gift a friend access to the Suite — help them build their own palace of the Word.", actionLabel: "Gift", actionLink: "/pricing" },
  { category: "share", icon: <Users className="h-3.5 w-3.5" />, label: "Community",
    text: "Join the conversation in Community — share your gems and learn from fellow scholars.", actionLabel: "Community", actionLink: "/community" },

  // Did You Know
  { category: "did_you_know", icon: <HelpCircle className="h-3.5 w-3.5" />, label: "Did You Know?",
    text: "David picked 5 stones because Goliath had 4 brothers (2 Sam 21:22). The Gems Room catches details like this." },
  { category: "did_you_know", icon: <HelpCircle className="h-3.5 w-3.5" />, label: "Did You Know?",
    text: "Jesus fed 5,000 with 12 baskets left (one per tribe) and 4,000 with 7 baskets left (completion for the nations)." },
  { category: "did_you_know", icon: <HelpCircle className="h-3.5 w-3.5" />, label: "Did You Know?",
    text: "The Bible has 8 major covenant cycles — each following the same pattern: Fall → Covenant → Sanctuary → Enemy → Restoration." },
  { category: "did_you_know", icon: <HelpCircle className="h-3.5 w-3.5" />, label: "Did You Know?",
    text: "In John 21, Jesus uses 'agapao' twice but Peter answers with 'phileo.' The third time, Jesus drops to 'phileo.' Nuance matters." },
  { category: "did_you_know", icon: <HelpCircle className="h-3.5 w-3.5" />, label: "Did You Know?",
    text: "The 24FPS Room lets you memorize the entire Bible as 51 images — one per 24-chapter block. Like a movie trailer of Scripture." },

  // Encouragement
  { category: "encouragement", icon: <Star className="h-3.5 w-3.5" />, label: "You're Doing Great",
    text: "Every verse you study, every gem you collect, every room you enter — it's building something eternal." },
  { category: "encouragement", icon: <Trophy className="h-3.5 w-3.5" />, label: "Proud of You",
    text: "Most people skim. You investigate. That dedication is rare and the Spirit honors it." },
  { category: "encouragement", icon: <Star className="h-3.5 w-3.5" />, label: "Keep It Up",
    text: "The palace isn't built in a day, but every brick matters. You're further than you think." },
  { category: "encouragement", icon: <Flame className="h-3.5 w-3.5" />, label: "Scholar",
    text: "You chose depth over distraction today. That's a victory. Christ sees your dedication." },
  { category: "encouragement", icon: <Crown className="h-3.5 w-3.5" />, label: "Warrior",
    text: "The Word is your sword and your shield. Every session sharpens it. Stay in the fight." },
];

const CATEGORY_STYLES: Record<string, { accent: string; iconColor: string; badgeBg: string }> = {
  motivation:    { accent: "from-amber-500/15 to-orange-500/5 border-amber-500/25", iconColor: "text-amber-500", badgeBg: "bg-amber-500/20 text-amber-400" },
  action:        { accent: "from-blue-500/15 to-cyan-500/5 border-blue-500/25", iconColor: "text-blue-500", badgeBg: "bg-blue-500/20 text-blue-400" },
  spiritual:     { accent: "from-purple-500/15 to-pink-500/5 border-purple-500/25", iconColor: "text-purple-500", badgeBg: "bg-purple-500/20 text-purple-400" },
  try_this:      { accent: "from-emerald-500/15 to-teal-500/5 border-emerald-500/25", iconColor: "text-emerald-500", badgeBg: "bg-emerald-500/20 text-emerald-400" },
  share:         { accent: "from-pink-500/15 to-rose-500/5 border-pink-500/25", iconColor: "text-pink-500", badgeBg: "bg-pink-500/20 text-pink-400" },
  did_you_know:  { accent: "from-indigo-500/15 to-violet-500/5 border-indigo-500/25", iconColor: "text-indigo-500", badgeBg: "bg-indigo-500/20 text-indigo-400" },
  encouragement: { accent: "from-yellow-500/15 to-amber-500/5 border-yellow-500/25", iconColor: "text-yellow-500", badgeBg: "bg-yellow-500/20 text-yellow-400" },
};

const ROTATE_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

export function GlobalStudyBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [promptIdx, setPromptIdx] = useState(() => {
    // Seed from current time so it's deterministic within a 10-min window
    return Math.floor(Date.now() / ROTATE_INTERVAL_MS) % ALL_PROMPTS.length;
  });

  // Auto-rotate every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIdx(prev => (prev + 1) % ALL_PROMPTS.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const shuffle = useCallback(() => {
    setPromptIdx(prev => (prev + 1) % ALL_PROMPTS.length);
  }, []);

  if (!user || dismissed) return null;

  const prompt = ALL_PROMPTS[promptIdx];
  const style = CATEGORY_STYLES[prompt.category];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={promptIdx}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "mx-auto max-w-7xl px-3 sm:px-4 md:px-6 mt-2"
        )}
      >
        <div className={cn(
          "rounded-xl border bg-gradient-to-r backdrop-blur-sm px-3 py-2 flex items-center gap-2.5 transition-all",
          style.accent
        )}>
          {/* Icon */}
          <div className={cn("flex-shrink-0", style.iconColor)}>
            {prompt.icon}
          </div>

          {/* Badge */}
          <Badge className={cn("text-[10px] border-0 font-semibold flex-shrink-0 hidden sm:inline-flex", style.badgeBg)}>
            {prompt.label}
          </Badge>

          {/* Text */}
          <p className="text-xs text-foreground/85 leading-snug flex-1 min-w-0 truncate sm:whitespace-normal sm:line-clamp-1">
            {prompt.text}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {prompt.actionLink && (
              <Button asChild size="sm" variant="ghost" className="text-[11px] h-6 px-2 hover:bg-background/50">
                <Link to={prompt.actionLink}>
                  {prompt.actionLabel}
                  <ChevronRight className="h-3 w-3 ml-0.5" />
                </Link>
              </Button>
            )}
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={shuffle} title="Next">
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={() => setDismissed(true)} title="Dismiss">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
