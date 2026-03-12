import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Flame, Zap, Crown, BookOpen, Swords, GraduationCap,
  ChevronRight, Sparkles, Trophy, Lightbulb, Target,
  Eye, Compass, Heart, RefreshCw, Brain,
  Gamepad2, Shield, Puzzle, Users, Timer, Map, Star, Gem
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

  // ─── Games ───────────────────────────────────────────────────
  { category: "action", icon: <Gamepad2 className="h-4 w-4" />, label: "Chain Chess",
    text: "Build a chain of connected verses — each link must touch the last. How long can you go?",
    actionLabel: "Start", actionLink: "/chain-chess" },
  { category: "action", icon: <Gamepad2 className="h-4 w-4" />, label: "PT Jeopardy",
    text: "Test your Palace knowledge Jeopardy-style. Pick a category, name your price.",
    actionLabel: "Go", actionLink: "/games/pt-jeopardy" },
  { category: "action", icon: <Puzzle className="h-4 w-4" />, label: "Escape Room",
    text: "Solve biblical puzzles and connect verses to unlock the door. Can you escape?",
    actionLabel: "Start", actionLink: "/escape-room" },
  { category: "action", icon: <Puzzle className="h-4 w-4" />, label: "Symbol Decoder",
    text: "Match biblical symbols to their meanings. Unlock typology patterns hidden in plain sight.",
    actionLabel: "Go", actionLink: "/games/symbol-decoder" },
  { category: "action", icon: <Gamepad2 className="h-4 w-4" />, label: "Sanctuary Run",
    text: "Tell the gospel story using 3 random sanctuary items — in order.",
    actionLabel: "Go", actionLink: "/games/sanctuary-run" },
  { category: "action", icon: <Eye className="h-4 w-4" />, label: "Observation Flux",
    text: "Verb blocks fall as you type observations. See what's actually there — observe, don't interpret.",
    actionLabel: "Go", actionLink: "/games/observation-room" },
  { category: "action", icon: <Gamepad2 className="h-4 w-4" />, label: "PT Scrabble",
    text: "Place Palace room cards on the board. Each card must connect theologically to its neighbor.",
    actionLabel: "Start", actionLink: "/pt-scrabble" },
  { category: "action", icon: <Target className="h-4 w-4" />, label: "Christ Lock",
    text: "Draw a Christ-focus card, get a random verse — explain how it reveals Jesus.",
    actionLabel: "Go", actionLink: "/games/christ-lock" },
  { category: "action", icon: <Sparkles className="h-4 w-4" />, label: "Freestyle Zone",
    text: "Jeeves drops a random prompt from Scripture, nature, or history. Respond with a PT connection.",
    actionLabel: "Go", actionLink: "/games/freestyle-zone" },
  { category: "action", icon: <Timer className="h-4 w-4" />, label: "Speed Verse",
    text: "Memorize a verse, then recall it under time pressure. How fast is your Scripture reflex?",
    actionLabel: "Go", actionLink: "/games/speed-verse-3d" },
  { category: "action", icon: <Gamepad2 className="h-4 w-4" />, label: "Story Room Game",
    text: "Arrange biblical events in sequence — master the narrative flow of Scripture.",
    actionLabel: "Go", actionLink: "/games/story-room" },
  { category: "action", icon: <Gamepad2 className="h-4 w-4" />, label: "Parallels Match",
    text: "Match events that mirror each other across Scripture — Babel ↔ Pentecost and beyond.",
    actionLabel: "Go", actionLink: "/games/palace-cards" },
  { category: "action", icon: <Gem className="h-4 w-4" />, label: "Five Dimensions Game",
    text: "View one verse like a diamond under five lights: Literal, Christ, Me, Church, Heaven.",
    actionLabel: "Go", actionLink: "/games/dimensions-room" },
  { category: "action", icon: <Gamepad2 className="h-4 w-4" />, label: "Blue Room Game",
    text: "Match sanctuary articles to their gospel meanings. Master God's blueprint of salvation.",
    actionLabel: "Go", actionLink: "/games/blue-room" },
  { category: "action", icon: <Gamepad2 className="h-4 w-4" />, label: "Chef Challenge",
    text: "Create a \"biblical recipe\" — a mini-sermon using ONLY Bible verse references.",
    actionLabel: "Go", actionLink: "/games/chef-challenge" },
  { category: "action", icon: <Timer className="h-4 w-4" />, label: "Principle Sprint",
    text: "Identify PT principles at speed. Select all correct ones before time runs out.",
    actionLabel: "Go", actionLink: "/games/principle-sprint" },
  { category: "action", icon: <Map className="h-4 w-4" />, label: "Treasure Hunt",
    text: "Follow biblical clues across Scripture to find hidden treasures.",
    actionLabel: "Start", actionLink: "/treasure-hunt" },
  { category: "action", icon: <Gamepad2 className="h-4 w-4" />, label: "Time Zone Invasion",
    text: "Pick 2 time zones for a verse and defend your prophetic framing.",
    actionLabel: "Go", actionLink: "/games/time-zone-invasion" },

  // ─── Study Activities ────────────────────────────────────────
  { category: "try_this", icon: <Trophy className="h-4 w-4" />, label: "Weekly Challenge",
    text: "Join this week's community study challenge. Compete, share insights, climb the board.",
    actionLabel: "Go", actionLink: "/weekly-challenge" },
  { category: "try_this", icon: <Zap className="h-4 w-4" />, label: "Daily Challenge",
    text: "A new challenge drops every day — 30-day rotation. Today's might surprise you.",
    actionLabel: "Go", actionLink: "/daily-challenges" },
  { category: "try_this", icon: <Target className="h-4 w-4" />, label: "Training Drills",
    text: "Room-specific drills with AI grading. Pick a room, submit your work, get real feedback.",
    actionLabel: "Go", actionLink: "/training-drills" },
  { category: "try_this", icon: <Brain className="h-4 w-4" />, label: "Analyze Thoughts",
    text: "Write your theological thoughts and let Jeeves score them across 6 dimensions.",
    actionLabel: "Go", actionLink: "/analyze-thoughts" },
  { category: "try_this", icon: <BookOpen className="h-4 w-4" />, label: "Flashcards",
    text: "Create or study AI-generated flashcard sets. Drill the Word into memory.",
    actionLabel: "Go", actionLink: "/flashcards" },
  { category: "try_this", icon: <Star className="h-4 w-4" />, label: "Verse Memory Hall",
    text: "Your memorized verses on display. Build the collection — it sharpens the sword.",
    actionLabel: "Go", actionLink: "/verse-memory-hall" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Branch Study",
    text: "Follow an interactive branching Bible study. Every choice opens a new cross-reference.",
    actionLabel: "Go", actionLink: "/branch-study" },
  { category: "try_this", icon: <Map className="h-4 w-4" />, label: "Study Paths",
    text: "Follow a guided study path through the Palace. Structured. Progressive. Powerful.",
    actionLabel: "Go", actionLink: "/paths" },
  { category: "try_this", icon: <Puzzle className="h-4 w-4" />, label: "Equations Challenge",
    text: "Solve biblical equations or create your own — share them with the community.",
    actionLabel: "Go", actionLink: "/equations-challenge" },

  // ─── Room Exploration ────────────────────────────────────────
  { category: "try_this", icon: <Eye className="h-4 w-4" />, label: "Observation Room",
    text: "Sit with a passage and write what you SEE — not what you think. Pure observation first.",
    actionLabel: "Go", actionLink: "/palace?room=OR" },
  { category: "try_this", icon: <Shield className="h-4 w-4" />, label: "Def-Com Room",
    text: "Enter the defense-combat chamber. Identify the enemy's tactic, then counter with truth.",
    actionLabel: "Go", actionLink: "/palace?room=DC" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Symbols Room",
    text: "Every lion, lamb, and serpent means something. Crack the code — decode the types.",
    actionLabel: "Go", actionLink: "/palace?room=ST" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Theme Room",
    text: "Trace a theological theme across all of Scripture. Life of Christ, Sanctuary, Great Controversy.",
    actionLabel: "Go", actionLink: "/palace?room=TRm" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Time Zone Room",
    text: "Past, present, future — every verse echoes across time. Place your passage on the timeline.",
    actionLabel: "Go", actionLink: "/palace?room=TZ" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Prophecy Room",
    text: "Open Daniel or Revelation. Map the prophetic timeline with precision.",
    actionLabel: "Go", actionLink: "/palace?room=PR" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Three Angels",
    text: "How does your passage connect to the Three Angels' Messages? Rev 14:6-12 touches everything.",
    actionLabel: "Go", actionLink: "/palace?room=3A" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Feasts Room",
    text: "Which feast does your passage connect to? Passover, Pentecost, Atonement, Tabernacles?",
    actionLabel: "Go", actionLink: "/palace?room=FE" },
  { category: "try_this", icon: <Flame className="h-4 w-4" />, label: "Fire Room",
    text: "Enter the furnace. Transformation happens under pressure — let the Word refine you.",
    actionLabel: "Go", actionLink: "/palace?room=FRm" },
  { category: "try_this", icon: <Heart className="h-4 w-4" />, label: "Meditation Room",
    text: "Slow down. One verse. No rushing. Sit with it until it speaks back.",
    actionLabel: "Go", actionLink: "/palace?room=MR" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Listening Room",
    text: "Before you speak, listen. Hear what the text is saying on its own terms.",
    actionLabel: "Go", actionLink: "/palace?room=LR" },

  // ─── Defense Mode ────────────────────────────────────────────
  { category: "action", icon: <Swords className="h-4 w-4" />, label: "FORGE Arena",
    text: "Enter the sparring arena. Pick an opponent, pick a doctrine — defend the faith.",
    actionLabel: "Go", actionLink: "/living-manna?tab=defense" },
  { category: "action", icon: <Shield className="h-4 w-4" />, label: "Analyze Attack",
    text: "Paste a critic's argument. Let Jeeves expose the fallacies and arm you with a counter.",
    actionLabel: "Go", actionLink: "/living-manna?tab=defense" },

  // ─── Community ───────────────────────────────────────────────
  { category: "motivation", icon: <Users className="h-4 w-4" />, label: "Palace Lounge",
    text: "Iron sharpens iron. Share what you're studying, ask questions, encourage someone.",
    actionLabel: "Go", actionLink: "/community" },

  // ─── More Try This — Verse Challenges ──────────────────────
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Type Trail",
    text: "Trace 'blood' from Abel → Passover → Day of Atonement → Calvary → Revelation 12:11.", actionLabel: "Start", actionLink: "/bible?book=Genesis&chapter=4" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Hidden Christ",
    text: "Joseph was sold for silver, falsely accused, imprisoned, then exalted to save his family. Sound familiar?", actionLabel: "Genesis 37", actionLink: "/bible?book=Genesis&chapter=37" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Mirror Text",
    text: "Genesis 1 creates. Revelation 21 re-creates. Compare them side by side — the bookends of the Bible.", actionLabel: "Compare", actionLink: "/bible?book=Revelation&chapter=21" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "40-Day Pattern",
    text: "40 days: Flood, Moses on Sinai, spies in Canaan, Goliath's taunt, Elijah's journey, Jesus' fast. One pattern.", actionLabel: "Explore", actionLink: "/palace?room=PRm" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Garden to Garden",
    text: "Eden lost → Gethsemane → Eden restored. Three gardens, one story. What changed between them?", actionLabel: "Genesis 3", actionLink: "/bible?book=Genesis&chapter=3" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Two Mountains",
    text: "Sinai thundered law. Calvary whispered grace. Same God. Same love. Different volume.", actionLabel: "Hebrews 12", actionLink: "/bible?book=Hebrews&chapter=12" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Name Study",
    text: "Look up the meaning of Abraham, Isaac, Jacob, Israel, and Jesus. Their names tell the gospel.", actionLabel: "Start", actionLink: "/palace?room=SR" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "First & Last",
    text: "The first Adam brought death. The last Adam brought life (1 Cor 15:45). Find 5 more contrasts.", actionLabel: "1 Cor 15", actionLink: "/bible?book=1+Corinthians&chapter=15" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Psalm Challenge",
    text: "Read Psalm 22 as if Jesus wrote it from the cross. Count how many prophecies you find.", actionLabel: "Psalm 22", actionLink: "/bible?book=Psalms&chapter=22" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Bread Trail",
    text: "Manna → Showbread → Bread of Life → Lord's Supper → Marriage Supper. One thread.", actionLabel: "John 6", actionLink: "/bible?book=John&chapter=6" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Water to Wine",
    text: "Moses turned water to blood (judgment). Jesus turned water to wine (grace). Same power.", actionLabel: "John 2", actionLink: "/bible?book=John&chapter=2" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "7 Churches",
    text: "Each of the 7 churches in Revelation 2-3 maps to a period of church history. Which era now?", actionLabel: "Revelation 2", actionLink: "/bible?book=Revelation&chapter=2" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Armor Drill",
    text: "Put on each piece of armor from Ephesians 6 and connect it to a sanctuary article.", actionLabel: "Ephesians 6", actionLink: "/bible?book=Ephesians&chapter=6" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "3 Days",
    text: "Jonah: 3 days in a fish. Jesus: 3 days in a tomb. Both emerged to preach repentance.", actionLabel: "Jonah 1", actionLink: "/bible?book=Jonah&chapter=1" },
  { category: "try_this", icon: <Lightbulb className="h-4 w-4" />, label: "Door Study",
    text: "Noah's ark had one door. The tabernacle had one door. Jesus said 'I am the door.' One way.", actionLabel: "John 10", actionLink: "/bible?book=John&chapter=10" },

  // ─── More Motivation ──────────────────────────────────────
  { category: "motivation", icon: <Flame className="h-4 w-4" />, label: "Refiner's Fire",
    text: "Gold is refined by fire, not by comfort. The hard passages are shaping you into something eternal." },
  { category: "motivation", icon: <Crown className="h-4 w-4" />, label: "Royal Priesthood",
    text: "You are a priest of the Most High. Every time you open Scripture, you enter the sanctuary of God." },
  { category: "motivation", icon: <Star className="h-4 w-4" />, label: "Hidden Manna",
    text: "'To him that overcometh will I give to eat of the hidden manna.' Rev 2:17. Treasure in the text." },

  // ─── More Actions ──────────────────────────────────────────
  { category: "action", icon: <Target className="h-4 w-4" />, label: "Cross-Ref Sprint",
    text: "Pick a verse. Find 5 cross-references in 2 minutes. Train your Bible radar.", actionLabel: "Go", actionLink: "/palace?room=C6" },
  { category: "action", icon: <Brain className="h-4 w-4" />, label: "Chiasm Hunt",
    text: "Open any psalm. Look for mirror structure — where the beginning and end reflect each other.", actionLabel: "Psalms", actionLink: "/bible?book=Psalms&chapter=1" },
  { category: "action", icon: <Swords className="h-4 w-4" />, label: "Debate Prep",
    text: "Pick a doctrine. Build a 3-point biblical defense in 5 minutes.", actionLabel: "FORGE", actionLink: "/living-manna?tab=defense" },

  // ─── More Spiritual ────────────────────────────────────────
  { category: "spiritual", icon: <Heart className="h-4 w-4" />, label: "Still Small Voice",
    text: "Elijah heard God not in the earthquake or fire, but in the still small voice. Be still today.", actionLabel: "1 Kings 19", actionLink: "/bible?book=1+Kings&chapter=19" },
  { category: "spiritual", icon: <Heart className="h-4 w-4" />, label: "The Potter",
    text: "\"The vessel that he made of clay was marred... so he made it again.\" God is not done with you.", actionLabel: "Jeremiah 18", actionLink: "/bible?book=Jeremiah&chapter=18" },
  { category: "spiritual", icon: <Sparkles className="h-4 w-4" />, label: "Living Water",
    text: "Jesus told the woman at the well: 'The water I give shall be a well springing up into everlasting life.'", actionLabel: "John 4", actionLink: "/bible?book=John&chapter=4" },
  { category: "spiritual", icon: <Heart className="h-4 w-4" />, label: "Footwashing",
    text: "The King of the universe knelt to wash dirty feet. What does that tell you about His character?", actionLabel: "John 13", actionLink: "/bible?book=John&chapter=13" },
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

// Fisher-Yates shuffle with a daily seed so prompts appear in a fresh order each day
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getDailyShuffledPrompts() {
  const today = new Date();
  const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return seededShuffle(PT_PROMPTS, daySeed);
}

export function PersonalizedStudyBanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [studyPath, setStudyPath] = useState<{ title: string; description: string } | null>(null);
  const [dailyPrompts] = useState(() => getDailyShuffledPrompts());
  const [promptIndex, setPromptIndex] = useState(() =>
    Math.floor(Date.now() / (10 * 60 * 1000)) % dailyPrompts.length
  );

  // Select daily prompt from shuffled array
  const dailyPrompt = useMemo<DailyPrompt>(() => {
    const prompt = dailyPrompts[promptIndex % dailyPrompts.length];
    return {
      ...prompt,
      accent: CATEGORY_ACCENTS[prompt.category],
    };
  }, [promptIndex, dailyPrompts]);

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

  const shufflePrompt = () => setPromptIndex(prev => {
    let next: number;
    do { next = Math.floor(Math.random() * dailyPrompts.length); } while (next === prev && dailyPrompts.length > 1);
    return next;
  });

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
      <div
        className={cn(
          "relative rounded-xl border bg-gradient-to-r p-3 transition-all duration-500",
          dailyPrompt.accent,
          dailyPrompt.actionLink && "cursor-pointer active:opacity-80"
        )}
        onClick={() => { if (dailyPrompt.actionLink) navigate(dailyPrompt.actionLink); }}
      >
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
                <Button asChild size="sm" variant="ghost" className="h-5 px-2 text-[10px]" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  <Link to="/study-ideas">Explore →</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {dailyPrompt.actionLink && (
              <Button asChild size="sm" variant="outline" className="text-xs h-7 bg-background/50 hover:bg-background/80 border-border/50">
                <Link to={dailyPrompt.actionLink} onClick={(e) => e.stopPropagation()}>
                  {dailyPrompt.actionLabel}
                  <ChevronRight className="h-3 w-3 ml-0.5" />
                </Link>
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={(e) => { e.stopPropagation(); shufflePrompt(); }}
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
