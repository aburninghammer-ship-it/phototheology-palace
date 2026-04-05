import { useState, useEffect, useCallback, useMemo } from "react";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
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
import { InsightDeepDiveModal } from "@/components/banner/InsightDeepDiveModal";
import {
  XpPopover, GemsPopover, RoomsPopover,
  ChaptersPopover, FloorsPopover, StreakPopover
} from "@/components/banner/StatPopovers";
import { StudyHealthRing } from "@/components/banner/StudyHealthRing";
import { MissionDropdown } from "@/components/banner/MissionDropdown";
import { AccountabilityBar } from "@/components/banner/AccountabilityBar";
import { useLockInMonthlyUsage } from "@/hooks/useLockInPass";

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
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Commentary Suite",
    text: "Listen to a COTA chapter analyzed by 7 unique voices — Epic Narrator, Modern Preacher, Ancient Scholar, Fiery Preacher, Academic, Counselor, or Kids.", actionLabel: "COTA Series", actionLink: "/cota-series" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Counselor Mode",
    text: "The Counselor commentary connects Scripture to your personal growth with a warm, therapeutic voice. Try it on your favorite chapter.", actionLabel: "Listen Now", actionLink: "/cota-series" },

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

  // ─── More Try This — Unique Verse Challenges ───────────────
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Type Trail",
    text: "Trace the word 'blood' from Abel → Passover → Day of Atonement → Calvary → Revelation 12:11.", actionLabel: "Start", actionLink: "/bible?book=Genesis&chapter=4" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Hidden Christ",
    text: "Joseph was sold for silver, falsely accused, imprisoned, then exalted to save his family. Sound familiar?", actionLabel: "Genesis 37", actionLink: "/bible?book=Genesis&chapter=37" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Mirror Text",
    text: "Genesis 1 creates. Revelation 21 re-creates. Compare them side by side — the bookends of the Bible.", actionLabel: "Compare", actionLink: "/bible?book=Revelation&chapter=21" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "40-Day Pattern",
    text: "40 days: Flood, Moses on Sinai, spies in Canaan, Goliath's taunt, Elijah's journey, Jesus' fast. One pattern.", actionLabel: "Explore", actionLink: "/palace?room=PRm" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Garden to Garden",
    text: "Eden lost → Gethsemane → Eden restored. Three gardens, one story. What changed between them?", actionLabel: "Genesis 3", actionLink: "/bible?book=Genesis&chapter=3" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Two Mountains",
    text: "Sinai thundered law. Calvary whispered grace. Same God. Same love. Different volume.", actionLabel: "Hebrews 12", actionLink: "/bible?book=Hebrews&chapter=12" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Name Study",
    text: "Look up the meaning of Abraham, Isaac, Jacob, Israel, and Jesus. Their names tell the whole gospel story.", actionLabel: "Start", actionLink: "/palace?room=SR" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "First & Last",
    text: "The first Adam brought death. The last Adam brought life (1 Cor 15:45). Find 5 more first/last contrasts.", actionLabel: "1 Cor 15", actionLink: "/bible?book=1+Corinthians&chapter=15" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Psalm Challenge",
    text: "Read Psalm 22 as if Jesus wrote it from the cross. Count how many prophecies you find.", actionLabel: "Psalm 22", actionLink: "/bible?book=Psalms&chapter=22" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Bread Trail",
    text: "Manna → Showbread → Bread of Life → Lord's Supper → Marriage Supper. One thread through Scripture.", actionLabel: "John 6", actionLink: "/bible?book=John&chapter=6" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Water to Wine",
    text: "Moses turned water to blood (judgment). Jesus turned water to wine (grace). Same power, different mission.", actionLabel: "John 2", actionLink: "/bible?book=John&chapter=2" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "7 Churches",
    text: "Each of the 7 churches in Revelation 2-3 maps to a period of church history. Which era are we in now?", actionLabel: "Revelation 2", actionLink: "/bible?book=Revelation&chapter=2" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Armor Drill",
    text: "Put on each piece of armor from Ephesians 6 and connect it to a sanctuary article. They match.", actionLabel: "Ephesians 6", actionLink: "/bible?book=Ephesians&chapter=6" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "3 Days",
    text: "Jonah: 3 days in a fish. Jesus: 3 days in a tomb. Both emerged to preach repentance. Coincidence?", actionLabel: "Jonah 1", actionLink: "/bible?book=Jonah&chapter=1" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Door Study",
    text: "Noah's ark had one door. The tabernacle had one door. Jesus said 'I am the door.' One way in.", actionLabel: "John 10", actionLink: "/bible?book=John&chapter=10" },

  // ─── More Motivation ──────────────────────────────────────
  { category: "motivation", icon: <TrendingUp className="h-3.5 w-3.5" />, label: "Level Up",
    text: "Every room you master adds a layer to your spiritual armor. Keep training — the battle is real." },
  { category: "motivation", icon: <Flame className="h-3.5 w-3.5" />, label: "Refiner's Fire",
    text: "Gold is refined by fire, not by comfort. The hard passages are shaping you into something eternal." },
  { category: "motivation", icon: <Crown className="h-3.5 w-3.5" />, label: "Royal Priesthood",
    text: "You are a priest of the Most High. Every time you open Scripture, you enter the sanctuary of God." },
  { category: "motivation", icon: <Star className="h-3.5 w-3.5" />, label: "Hidden Manna",
    text: "'To him that overcometh will I give to eat of the hidden manna.' Rev 2:17. There is treasure in the text." },

  // ─── More Actions & Drills ─────────────────────────────────
  { category: "action", icon: <Target className="h-3.5 w-3.5" />, label: "Cross-Ref Sprint",
    text: "Pick a verse. Find 5 cross-references in 2 minutes. Then find 5 more. Train your Bible radar.", actionLabel: "Go", actionLink: "/palace?room=C6" },
  { category: "action", icon: <Brain className="h-3.5 w-3.5" />, label: "Chiasm Hunt",
    text: "Open any psalm. Look for a mirror structure — where the beginning and end reflect each other.", actionLabel: "Psalms", actionLink: "/bible?book=Psalms&chapter=1" },
  { category: "action", icon: <Eye className="h-3.5 w-3.5" />, label: "Word Count",
    text: "Pick a chapter. Circle every time God speaks vs. man speaks. Who dominates the conversation?", actionLabel: "Go", actionLink: "/palace?room=OR" },
  { category: "action", icon: <Swords className="h-3.5 w-3.5" />, label: "Debate Prep",
    text: "Pick a doctrine (Sabbath, state of the dead, sanctuary). Build a 3-point biblical defense in 5 minutes.", actionLabel: "FORGE", actionLink: "/living-manna?tab=defense" },
  { category: "action", icon: <BookOpen className="h-3.5 w-3.5" />, label: "Chapter Race",
    text: "Read an entire chapter and summarize it in one sentence. Then compare with Jeeves' summary.", actionLabel: "Go", actionLink: "/palace?room=SR" },

  // ─── More Spiritual ────────────────────────────────────────
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Still Small Voice",
    text: "Elijah heard God not in the earthquake or fire, but in the still small voice. Be still today.", actionLabel: "1 Kings 19", actionLink: "/bible?book=1+Kings&chapter=19" },
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "The Potter",
    text: "\"The vessel that he made of clay was marred... so he made it again.\" God is not done with you.", actionLabel: "Jeremiah 18", actionLink: "/bible?book=Jeremiah&chapter=18" },
  { category: "spiritual", icon: <Sparkles className="h-3.5 w-3.5" />, label: "Living Water",
    text: "Jesus told the woman at the well: 'The water I give shall be a well springing up into everlasting life.'", actionLabel: "John 4", actionLink: "/bible?book=John&chapter=4" },
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Footwashing",
    text: "The King of the universe knelt to wash dirty feet. What does that tell you about His character?", actionLabel: "John 13", actionLink: "/bible?book=John&chapter=13" },

  // ─── Expanded Diversity Pool ──────────────────────────────
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Veil Study",
    text: "Moses veiled his face. The temple had a veil. Paul says the veil is on hearts today. Trace the pattern.", actionLabel: "2 Cor 3", actionLink: "/bible?book=2+Corinthians&chapter=3" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Stone Trail",
    text: "Stone tablets → stone altar → stone rejected → living stones. Trace how God writes on harder surfaces over time.", actionLabel: "1 Peter 2", actionLink: "/bible?book=1+Peter&chapter=2" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Night Visitors",
    text: "Nicodemus came at night. Jacob wrestled at night. Gethsemane was at night. Why does God meet people in darkness?", actionLabel: "John 3", actionLink: "/bible?book=John&chapter=3" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Shepherd Arc",
    text: "Abel was a shepherd. David was a shepherd. Jesus is the Good Shepherd. The Lamb became the Shepherd.", actionLabel: "Psalm 23", actionLink: "/bible?book=Psalms&chapter=23" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Tree Pattern",
    text: "Tree of life → tree of knowledge → burning bush → cross (the tree) → tree of life restored. Full circle.", actionLabel: "Revelation 22", actionLink: "/bible?book=Revelation&chapter=22" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Angel Meals",
    text: "Abraham served angels a meal. Elijah was fed by an angel. Jesus was ministered to by angels after 40 days.", actionLabel: "Genesis 18", actionLink: "/bible?book=Genesis&chapter=18" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Well Meetings",
    text: "Isaac's bride was found at a well. Jacob met Rachel at a well. Moses met Zipporah at a well. Jesus met the Samaritan woman at a well.", actionLabel: "John 4", actionLink: "/bible?book=John&chapter=4" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Coat Theology",
    text: "God clothed Adam. Joseph got a special coat. Elijah's mantle passed power. Jesus' robe was gambled for. Garments tell a story.", actionLabel: "Genesis 3", actionLink: "/bible?book=Genesis&chapter=3" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Fish & Faith",
    text: "Jonah and the great fish. Peter's coin in a fish. 153 fish in the net. Feeding 5000 with fish. What's the pattern?", actionLabel: "John 21", actionLink: "/bible?book=John&chapter=21" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Left & Right",
    text: "Sheep on the right, goats on the left. The thief on the right was saved. Right hand of God. Direction matters in Scripture.", actionLabel: "Matthew 25", actionLink: "/bible?book=Matthew&chapter=25" },

  { category: "motivation", icon: <Flame className="h-3.5 w-3.5" />, label: "Sharpened",
    text: "Every question you wrestle with sharpens your sword. Don't avoid the hard texts — they forge the strongest faith." },
  { category: "motivation", icon: <Star className="h-3.5 w-3.5" />, label: "Eternal Builder",
    text: "You're not just reading a book. You're building a mansion of truth that will stand when everything else falls." },
  { category: "motivation", icon: <Crown className="h-3.5 w-3.5" />, label: "Overcomer",
    text: "Seven promises to overcomers in Revelation 2-3. You're fighting for a crown that never fades." },
  { category: "motivation", icon: <Rocket className="h-3.5 w-3.5" />, label: "Deep Miner",
    text: "The surface reading is a trail. The PT rooms take you underground — where the diamonds are." },
  { category: "motivation", icon: <Zap className="h-3.5 w-3.5" />, label: "Armed",
    text: "Every verse memorized is a bullet loaded. Every connection mapped is a battle plan drawn. Stay armed." },

  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Anchor",
    text: "\"Which hope we have as an anchor of the soul.\" When life storms, your study holds you steady.", actionLabel: "Hebrews 6", actionLink: "/bible?book=Hebrews&chapter=6" },
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Broken Bread",
    text: "He took bread, broke it, and gave it. He was broken so we could be made whole. Pause and give thanks." },
  { category: "spiritual", icon: <Sparkles className="h-3.5 w-3.5" />, label: "Morning Star",
    text: "\"I am the bright and morning star.\" Before the sun rises, the morning star appears. He comes before the light.", actionLabel: "Revelation 22", actionLink: "/bible?book=Revelation&chapter=22" },
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Tears Bottled",
    text: "\"Thou tellest my wanderings: put thou my tears into thy bottle.\" God keeps track of every struggle.", actionLabel: "Psalm 56", actionLink: "/bible?book=Psalms&chapter=56" },

  { category: "action", icon: <Eye className="h-3.5 w-3.5" />, label: "Verb Scan",
    text: "Read a chapter and underline every verb. What is God doing? What are people doing? The verbs tell the real story.", actionLabel: "Go", actionLink: "/palace?room=OR" },
  { category: "action", icon: <Brain className="h-3.5 w-3.5" />, label: "Question Blitz",
    text: "Read one paragraph. Write 10 questions about it — who, what, when, where, why, how. Then answer them.", actionLabel: "Go", actionLink: "/palace?room=IR" },
  { category: "action", icon: <Target className="h-3.5 w-3.5" />, label: "Number Hunt",
    text: "Pick a number (3, 7, 12, 40). Find 5 places it appears in Scripture. Why does God repeat it?", actionLabel: "Go", actionLink: "/palace?room=PRm" },
  { category: "action", icon: <BookOpen className="h-3.5 w-3.5" />, label: "One-Verse Sermon",
    text: "Pick any single verse. Build a 3-point sermon from it in 5 minutes. This is how preachers train.", actionLabel: "Sermon Builder", actionLink: "/sermon-builder" },
  { category: "action", icon: <Swords className="h-3.5 w-3.5" />, label: "Objection Drill",
    text: "Think of the hardest objection to your faith. Now build a 3-step biblical response. Offense and defense.", actionLabel: "FORGE", actionLink: "/living-manna?tab=defense" },
];

// ─── Level 1 (Basic) prompts — simple Bible questions that route to Ask Jeeves ───
const BASIC_PROMPTS: DailyPrompt[] = [
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Ask Jeeves",
    text: "What does it mean that Jesus is the Lamb of God?", actionLabel: "Ask", actionLink: "/jeeves?q=What+does+it+mean+that+Jesus+is+the+Lamb+of+God" },
  { category: "try_this", icon: <BookOpen className="h-3.5 w-3.5" />, label: "Ask Jeeves",
    text: "Break down Psalm 23 for me — what is David really saying?", actionLabel: "Ask", actionLink: "/jeeves?q=Break+down+Psalm+23" },
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Devotional",
    text: "\"Be still and know that I am God.\" Let that wash over you today.", actionLabel: "Psalm 46", actionLink: "/bible?book=Psalms&chapter=46" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Ask Jeeves",
    text: "Why did Jesus have to die on the cross? What was the purpose?", actionLabel: "Ask", actionLink: "/jeeves?q=Why+did+Jesus+have+to+die+on+the+cross" },
  { category: "motivation", icon: <Star className="h-3.5 w-3.5" />, label: "Encouragement",
    text: "Every time you open the Bible, you're stepping into a conversation with the Creator of the universe." },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Ask Jeeves",
    text: "What are the Ten Commandments and why do they still matter?", actionLabel: "Ask", actionLink: "/jeeves?q=What+are+the+Ten+Commandments+and+why+do+they+matter" },
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Devotional",
    text: "\"For God so loved the world...\" — the most powerful sentence ever written. Sit with it.", actionLabel: "John 3", actionLink: "/bible?book=John&chapter=3" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Ask Jeeves",
    text: "Who is the Holy Spirit and what does He do?", actionLabel: "Ask", actionLink: "/jeeves?q=Who+is+the+Holy+Spirit+and+what+does+He+do" },
  { category: "motivation", icon: <Flame className="h-3.5 w-3.5" />, label: "Keep Going",
    text: "You don't have to understand everything at once. Just keep showing up. The Word will do the rest." },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Ask Jeeves",
    text: "What is grace and how does it work in my life?", actionLabel: "Ask", actionLink: "/jeeves?q=What+is+grace+and+how+does+it+work" },
  { category: "spiritual", icon: <Sparkles className="h-3.5 w-3.5" />, label: "Devotional",
    text: "\"I can do all things through Christ which strengtheneth me.\" You are not alone.", actionLabel: "Philippians 4", actionLink: "/bible?book=Philippians&chapter=4" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Ask Jeeves",
    text: "What does the Bible say about prayer? How should I pray?", actionLabel: "Ask", actionLink: "/jeeves?q=What+does+the+Bible+say+about+prayer" },
  { category: "try_this", icon: <BookOpen className="h-3.5 w-3.5" />, label: "Ask Jeeves",
    text: "Explain the story of creation in Genesis 1.", actionLabel: "Ask", actionLink: "/jeeves?q=Explain+the+story+of+creation+in+Genesis+1" },
  { category: "spiritual", icon: <Heart className="h-3.5 w-3.5" />, label: "Devotional",
    text: "\"The Lord is my shepherd; I shall not want.\" He's guiding you even now — trust the path.", actionLabel: "Psalm 23", actionLink: "/bible?book=Psalms&chapter=23" },
  { category: "motivation", icon: <Crown className="h-3.5 w-3.5" />, label: "You Matter",
    text: "God wrote 66 books across thousands of years — and He wants a personal conversation with you." },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Ask Jeeves",
    text: "What does it mean to be 'born again'?", actionLabel: "Ask", actionLink: "/jeeves?q=What+does+it+mean+to+be+born+again" },
  { category: "try_this", icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Ask Jeeves",
    text: "What is heaven like according to the Bible?", actionLabel: "Ask", actionLink: "/jeeves?q=What+is+heaven+like+according+to+the+Bible" },
  { category: "try_this", icon: <BookOpen className="h-3.5 w-3.5" />, label: "Ask Jeeves",
    text: "Tell me about the life of Jesus — who was He really?", actionLabel: "Ask", actionLink: "/jeeves?q=Tell+me+about+the+life+of+Jesus" },
];

const CATEGORY_STYLES: Record<string, { accent: string; iconColor: string; badgeBg: string }> = {
  motivation: { accent: "from-amber-500/15 to-orange-500/5 border-amber-500/25", iconColor: "text-amber-500", badgeBg: "bg-amber-500/20 text-amber-400" },
  action:     { accent: "from-blue-500/15 to-cyan-500/5 border-blue-500/25", iconColor: "text-blue-500", badgeBg: "bg-blue-500/20 text-blue-400" },
  spiritual:  { accent: "from-purple-500/15 to-pink-500/5 border-purple-500/25", iconColor: "text-purple-500", badgeBg: "bg-purple-500/20 text-purple-400" },
  try_this:   { accent: "from-emerald-500/15 to-teal-500/5 border-emerald-500/25", iconColor: "text-emerald-500", badgeBg: "bg-emerald-500/20 text-emerald-400" },
};

const ROTATE_INTERVAL_MS = 12 * 60 * 1000; // 12 minutes between auto-rotations

// Session-aware prompt tracker: ensures user sees every prompt before repeating any
const SEEN_KEY = 'pt_banner_seen_indices';
const SEEN_DATE_KEY = 'pt_banner_seen_date';

function getUnseenIndex(): number {
  const today = new Date().toDateString();
  const storedDate = localStorage.getItem(SEEN_DATE_KEY);

  // Reset seen list each day
  let seen: number[] = [];
  if (storedDate === today) {
    try { seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch { seen = []; }
  } else {
    localStorage.setItem(SEEN_DATE_KEY, today);
    localStorage.setItem(SEEN_KEY, '[]');
  }

  // Build pool of unseen indices
  const total = ALL_PROMPTS.length;
  const unseenPool = Array.from({ length: total }, (_, i) => i).filter(i => !seen.includes(i));

  // If all seen, reset and start fresh
  if (unseenPool.length === 0) {
    localStorage.setItem(SEEN_KEY, '[]');
    return Math.floor(Math.random() * total);
  }

  // Pick a random unseen prompt
  const pick = unseenPool[Math.floor(Math.random() * unseenPool.length)];
  seen.push(pick);
  localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  return pick;
}

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
        (supabase as any).from("global_master_titles").select("total_xp, master_title").eq("user_id", userId).maybeSingle(),
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

function LockInPassChip() {
  const { passesRemaining, loading } = useLockInMonthlyUsage();
  
  if (loading || passesRemaining <= 0) return null;

  return (
    <Link
      to="/gift"
      aria-label={`${passesRemaining} Five Day Guest ${passesRemaining === 1 ? "Pass" : "Passes"}`}
      title="Open Five Day Guest Passes"
    >
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0px hsl(var(--primary) / 0.18)",
            "0 0 14px hsl(var(--primary) / 0.4)",
            "0 0 0px hsl(var(--primary) / 0.18)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-primary/15 cursor-pointer"
      >
        <Flame className="h-3.5 w-3.5 text-primary" />
        <span className="font-semibold">
          {passesRemaining} Five Day Guest {passesRemaining === 1 ? "Pass" : "Passes"}
        </span>
      </motion.div>
    </Link>
  );
}

export function GlobalStudyBanner({ userId, userEmail }: GlobalStudyBannerProps = {}) {
  const { user: authUser } = useAuth();
  const { isBasic } = useExperienceMode();
  const navigate = useNavigate();
  const resolvedUserId = userId ?? authUser?.id ?? null;
  const fallbackDisplayName = (userEmail ?? authUser?.email)?.split("@")[0] || "Scholar";

  const [dismissed, setDismissed] = useState(false);
  const [newFeatureDismissed, setNewFeatureDismissed] = useState(() => {
    const dismissedAt = localStorage.getItem("pt_new_feature_testme_dismissed_v2");
    if (!dismissedAt) return false;
    // Re-show after 7 days
    if (dismissedAt !== "true") {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      return elapsed < 7 * 24 * 60 * 60 * 1000;
    }
    // Migrate old "true" value — treat as just dismissed now
    localStorage.setItem("pt_new_feature_testme_dismissed_v2", Date.now().toString());
    return true;
  });
  const [promptIdx, setPromptIdx] = useState(() => getUnseenIndex());
  const [xpFlash, setXpFlash] = useState(false);
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);
  const [deepDivePrompt, setDeepDivePrompt] = useState<{ label: string; text: string } | null>(null);
  const stats = useUserBannerStats(resolvedUserId, fallbackDisplayName);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIdx(getUnseenIndex());
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
    setPromptIdx(getUnseenIndex());
  }, []);

  if (!resolvedUserId) return null;

  const activePrompts = isBasic ? BASIC_PROMPTS : ALL_PROMPTS;
  const prompt = activePrompts[promptIdx % activePrompts.length];
  const style = CATEGORY_STYLES[prompt.category];
  const rank = getXpRank(stats.totalXp);
  const initials = (stats.displayName || fallbackDisplayName).slice(0, 2).toUpperCase();
  const displayTitle = stats.masterTitle || rank.label;
  const titleBadgeStyle = stats.masterTitle ? getTitleBadgeStyle(stats.masterTitle) : rank.color;
  const nudge = getBehavioralNudge(stats);
  const isInactive = stats.lastActivityDaysAgo >= 3;

  return (
    <div className={cn(
      "mx-auto max-w-7xl px-3 sm:px-4 md:px-6 mt-2 space-y-1.5 transition-opacity duration-700 zen-hideable",
      isInactive && "opacity-80"
    )}>
      {/* Nudge bar — hidden in Basic mode */}
      {!isBasic && (
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
      )}

      {/* New Feature Highlight — hidden in Basic mode */}
      {!isBasic && (
        <AnimatePresence>
          {!newFeatureDismissed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 px-3 py-2 flex items-center gap-3">
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">New</Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">Test Me — PT Diagnostic Assessment</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">Discover your strengths across all 8 floors with AI-powered analysis & personalized growth plans.</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button asChild size="sm" variant="ghost" className="text-[11px] h-6 px-2 text-emerald-400 hover:bg-emerald-500/10">
                    <Link to="/test-me">
                      Try It
                      <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                     onClick={() => {
                      setNewFeatureDismissed(true);
                      localStorage.setItem("pt_new_feature_testme_dismissed_v2", Date.now().toString());
                    }}
                    title="Dismiss"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Stats row — hidden in Basic mode */}
      {!isBasic && (
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
            <LockInPassChip />

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
      )}

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
              "cursor-pointer active:opacity-80"
            )}
              onClick={() => { setDeepDivePrompt({ label: prompt.label, text: prompt.text }); setDeepDiveOpen(true); }}
            >
              <div className={cn("flex-shrink-0", style.iconColor)}>
                {prompt.icon}
              </div>

              <Badge className={cn("text-[10px] border-0 font-semibold flex-shrink-0 hidden sm:inline-flex", style.badgeBg)}>
                {prompt.label}
              </Badge>

              <p className="text-xs text-foreground/85 leading-snug flex-1 min-w-0 line-clamp-2 sm:line-clamp-1">
                {prompt.text}
              </p>

              <div className="flex items-center gap-1 flex-shrink-0">
                {prompt.actionLabel && (
                  <Button size="sm" variant="ghost" className="text-[11px] h-6 px-2 hover:bg-background/50">
                    {prompt.actionLabel}
                    <ChevronRight className="h-3 w-3 ml-0.5" />
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

      {deepDivePrompt && (
        <InsightDeepDiveModal
          open={deepDiveOpen}
          onOpenChange={setDeepDiveOpen}
          label={deepDivePrompt.label}
          text={deepDivePrompt.text}
        />
      )}
    </div>
  );
}
