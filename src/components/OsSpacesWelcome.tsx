import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PinToDockButton } from "@/components/os/PinToDockButton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  BookOpenCheck, Dumbbell, Mic2, Gamepad2, Church, Wrench,
  GraduationCap, Shield,
  BookOpen, Brain, Zap, Gem, BookMarked, Lightbulb, Target,
  Search, PersonStanding, Network, Headphones,
  Building2, Image, Sparkles, Film, Eye,
  CalendarDays, Trophy,
  Flame, Calendar, StickyNote, Scale, Heart, HeartHandshake,
  MessageSquare, Megaphone, Video, Crown, Users, User,
  Library, Clock, Map, Languages, BookText, Glasses,
  CreditCard, LayoutGrid, ImageIcon, Scroll, Moon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SpaceItem {
  label: string;
  path: string;
  icon: LucideIcon;
  description?: string;
  tooltip?: string;
  hue?: number;
}

interface OsSpace {
  id: string;
  label: string;
  simpleLabel: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  items: SpaceItem[];
}

const OS_SPACES: OsSpace[] = [
  {
    id: "study",
    label: "Phototheology Study",
    simpleLabel: "Study",
    subtitle: "Read, Research & Explore Scripture",
    icon: BookOpenCheck,
    color: "210 100% 56%",
    items: [
      { label: "Study Bible", path: "/bible", icon: BookOpen, description: "Read & study Scripture", tooltip: "Open the full KJV Bible with chapter navigation, verse highlighting, and integrated commentary. Your primary workspace for reading and marking up Scripture." },
      { label: "My Studies", path: "/my-studies", icon: BookMarked, description: "Your saved studies", tooltip: "Access all your saved Phototheology studies, notes, and insights in one organized library. Pick up right where you left off." },
      { label: "Study Ideas", path: "/study-ideas", icon: Lightbulb, description: "AI-generated prompts", tooltip: "Get AI-generated study prompts based on PT principles. Each idea comes with a suggested passage, room sequence, and guiding questions to jumpstart your study." },
      { label: "Study Buddy", path: "/study-buddy", icon: Brain, description: "AI companion", tooltip: "Your personal AI study partner trained in Phototheology. Ask questions, get verse connections, and explore passages together in real time." },
      { label: "Research Assistant", path: "/research-assistant", icon: GraduationCap, description: "Advanced research", tooltip: "Deep-dive research tool for cross-referencing themes, tracing word origins, and building comprehensive studies." },
      { label: "Give Me A Gem", path: "/give-me-a-gem", icon: Gem, description: "Quick insights", tooltip: "Tap for an instant biblical insight — a surprising connection, hidden detail, or Christ-centered gem you may have never noticed." },
      { label: "Analyze Thoughts", path: "/analyze-thoughts", icon: Lightbulb, description: "AI thought analysis", tooltip: "Paste any theological idea, quote, or sermon excerpt and let AI analyze it through the Phototheology framework." },
      { label: "Gather Fragments", path: "/drill-drill", icon: Target, description: "Collect fragments", tooltip: "Collect scattered observations, verses, and insights into organized fragment clusters." },
      { label: "Study Series", path: "/bible-study-series", icon: BookOpen, description: "Multi-lesson series", tooltip: "Create or follow multi-lesson Bible study series with structured progression." },
      { label: "Notes", path: "/notes", icon: StickyNote, description: "Personal notes", tooltip: "Your personal notepad for capturing thoughts, reflections, and discoveries during study." },
      { label: "Interlinear Bible", path: "/bible/John/1?strongs=true", icon: BookText, description: "Greek/Hebrew", tooltip: "View Scripture with original Greek and Hebrew words displayed alongside English." },
      { label: "Lexicon", path: "/bible-lexicon", icon: Languages, description: "Word study", tooltip: "Search Greek and Hebrew words by Strong's number or English meaning." },
      { label: "Encyclopedia", path: "/encyclopedia", icon: Search, description: "Biblical encyclopedia", tooltip: "Browse a comprehensive encyclopedia of biblical people, places, objects, and concepts." },
      { label: "Characters", path: "/character-profiles", icon: PersonStanding, description: "Bible characters", tooltip: "Explore detailed profiles of biblical characters — their stories, roles, types, and Christ-connections." },
      { label: "Genealogy", path: "/research-assistant?tab=genealogy", icon: Network, description: "Trace lineages", tooltip: "Trace family trees from Adam to Christ and beyond." },
      { label: "Timeline", path: "/bible-timeline", icon: Clock, description: "Chronological map", tooltip: "View biblical history on an interactive chronological timeline." },
      { label: "Bible Atlas", path: "/bible-atlas", icon: Map, description: "Geographic explorer", tooltip: "Explore the lands of Scripture on interactive maps." },
      { label: "Source Library", path: "/libraries", icon: Library, description: "Reference materials", tooltip: "Access a curated library of Spirit of Prophecy writings, historical commentaries, and reference documents." },
      { label: "Audio Library", path: "/audio-library", icon: Headphones, description: "Audio studies", tooltip: "Listen to narrated Bible studies, devotionals, and PT teachings." },
    ],
  },
  {
    id: "train",
    label: "Phototheology Train",
    simpleLabel: "Practice",
    subtitle: "Palace, Memory & PT Principles",
    icon: Dumbbell,
    color: "32 95% 53%",
    items: [
      { label: "Photo31", path: "/photo31", icon: Flame, description: "31-day book study", tooltip: "Deep 31-day book study with Jeeves as your personal teacher, trainer, and theological sparring partner. Scales from beginner to master." },
      { label: "Memory Palace", path: "/palace", icon: Building2, description: "8 Floors of PT", tooltip: "Enter the Phototheology Palace — all 8 floors with their rooms, principles, and exercises. The heart of the entire PT system." },
      { label: "Tour the Palace", path: "/palace/tour", icon: Headphones, description: "Audio walkthrough", tooltip: "Take a guided audio tour through the Palace floors. Listen as each room is explained with examples." },
      { label: "Freestyle Arena", path: "/palace/freestyle", icon: Zap, description: "Spontaneous connections", tooltip: "Practice spontaneous Scripture connections like a freestyle artist. Get random prompts and weave verses, nature, and life into real-time Bible application." },
      { label: "Mind Map", path: "/mind-map", icon: Network, description: "Visual mapping", tooltip: "Build visual mind maps of biblical themes, connecting verses, stories, and doctrines in a branching web." },
      { label: "Memory Training", path: "/memory", icon: Brain, description: "Drills & exercises", tooltip: "Sharpen your Scripture recall with targeted memory drills — story sequences, verse locations, chapter frames, and rapid-fire identification." },
      { label: "Image Bible", path: "/image-bible", icon: Image, description: "Visual Scripture", tooltip: "Experience Scripture through AI-generated imagery. Each passage is rendered as a vivid visual scene." },
      { label: "Study Deck", path: "/card-deck", icon: Sparkles, description: "Flashcards", tooltip: "Draw PT study cards with room-specific questions for any passage." },
      { label: "Infographics", path: "/image-bible", icon: ImageIcon, description: "Visual summaries", tooltip: "Browse beautifully designed infographics that summarize key PT concepts, sanctuary furniture, and prophetic timelines." },
      { label: "VR Experience", path: "/vr", icon: Glasses, description: "Immersive 3D palace", tooltip: "Step into a 3D virtual reality version of the Phototheology Palace." },
      { label: "Training Drills", path: "/test-me", icon: Target, description: "Speed drills", tooltip: "Rapid-fire drills designed to build reflexive PT thinking. Timed exercises force quick identification of rooms, cycles, and Christ-connections." },
      { label: "Dojo", path: "/spiritual-training", icon: Dumbbell, description: "Combat training", tooltip: "Structured spiritual combat training — systematic exercises that combine multiple floors and rooms into intensive study sessions." },
      { label: "Floor Mastery", path: "/mastery", icon: GraduationCap, description: "Track progression", tooltip: "Track your mastery across all 8 Palace floors. See which rooms you've completed and chart your path to reflexive Phototheology." },
    ],
  },
  {
    id: "teach",
    label: "Phototheology Teach",
    simpleLabel: "Teach",
    subtitle: "Sermon Prep & Teaching Output",
    icon: Mic2,
    color: "270 56% 65%",
    items: [
      { label: "Sermon Builder", path: "/sermon-builder", icon: MessageSquare, description: "Craft sermons", tooltip: "Build complete sermons using the Phototheology framework. Structure your message with Christ-centered depth and sanctuary connections." },
      { label: "Sermon Ideas", path: "/sermon-ideas", icon: Lightbulb, description: "Saved concepts", tooltip: "Browse and save sermon concepts organized by theme, passage, and PT floor." },
      { label: "Amplify", path: "/amplify", icon: Megaphone, description: "Enhance with cross-refs", tooltip: "Take any sermon or study and amplify it with cross-references, parallel passages, and deeper connections." },
      { label: "Remix", path: "/remix", icon: Zap, description: "Remix frameworks", tooltip: "Remix existing content through different PT lenses. Reframe it for a new audience or context." },
      { label: "Polish", path: "/polish", icon: Film, description: "Sermon manuscripts", tooltip: "Generate polished sermon manuscripts from your outlines and notes." },
      { label: "Video Training", path: "/video-training", icon: Video, description: "Teaching videos", tooltip: "Access a library of teaching videos covering PT principles, room walkthroughs, and live study demonstrations." },
    ],
  },
  {
    id: "game",
    label: "Phototheology Game",
    simpleLabel: "Games",
    subtitle: "Games, Challenges & Competition",
    icon: Gamepad2,
    color: "0 84% 60%",
    items: [
      { label: "Games", path: "/games", icon: Gamepad2, description: "Multiplayer games", tooltip: "Play Bible-based games — from trivia to room challenges to multiplayer competitions." },
      { label: "Scheduled Games", path: "/schedule", icon: CalendarDays, description: "Game nights", tooltip: "Join scheduled game nights and live competitions with other Phototheologists." },
      { label: "Daily Challenges", path: "/daily-challenges", icon: Zap, description: "Today's challenge", tooltip: "A fresh challenge every day — apply a specific PT room or principle to a new passage." },
      { label: "Challenge Board", path: "/challenge-board", icon: Trophy, description: "Public board", tooltip: "View all available challenges across difficulty levels." },
      { label: "Leaderboard", path: "/leaderboard", icon: Trophy, description: "Top Phototheologists", tooltip: "See who's leading the pack — rankings based on study completion, challenge scores, and game wins." },
      { label: "Achievements", path: "/achievements", icon: Trophy, description: "Earned badges", tooltip: "View your earned badges, certificates, and milestones." },
      { label: "Test Me", path: "/test-me", icon: GraduationCap, description: "Assessments", tooltip: "Take assessments to test your PT knowledge with AI feedback." },
    ],
  },
  {
    id: "chapel",
    label: "Phototheology Chapel",
    simpleLabel: "Devotional",
    subtitle: "Devotional, Church & Community",
    icon: Church,
    color: "142 71% 45%",
    items: [
      { label: "Night Watches", path: "/night-watches", icon: Moon, description: "Evening meditation", tooltip: "A 15-minute evening Master Mind meditation — cinematic, scriptural, sanctuary-mapped reflection before sleep." },
      { label: "Morning Watches", path: "/morning-watches", icon: Flame, description: "Morning activation", tooltip: "5-8 minute morning activation session — remember, declare, align, and commit using last night's meditation." },
      { label: "Devotionals", path: "/devotionals", icon: Flame, description: "Daily devotions", tooltip: "Start your day with a devotional built on PT principles. Includes Scripture, meditation prompts, and a Christ-connection." },
      { label: "Daily Audio", path: "/daily-audio-devotional", icon: Headphones, description: "Audio devotions", tooltip: "Listen to today's Phototheology-based audio devotional — deep, Christ-centered, sanctuary-mapped reflections delivered daily." },
      { label: "Daily Reading", path: "/daily-reading", icon: Calendar, description: "Reading plan", tooltip: "Follow a structured daily Bible reading plan that covers the entire Bible." },
      { label: "Reading Plans", path: "/reading-plans", icon: Calendar, description: "Structured paths", tooltip: "Choose from multiple reading plans — chronological, thematic, prophetic, or book-by-book." },
      { label: "Prophecy Watch", path: "/prophecy-watch", icon: Eye, description: "Events & prophecy", tooltip: "Track current events through the lens of biblical prophecy." },
      { label: "My Church", path: "/living-manna", icon: Church, description: "Church community", tooltip: "Your church's digital hub — access Sabbath School lessons, announcements, prayer requests, and connect with your local congregation." },
      { label: "Marriage", path: "/blueprint-marriage", icon: Heart, description: "Dating & marriage", tooltip: "A biblical guide to dating and marriage built on Scripture." },
      { label: "Grief Support", path: "/blueprint-grief", icon: HeartHandshake, description: "Grief guide", tooltip: "Walk through grief with biblical comfort and hope." },
      { label: "Strongholds", path: "/blueprint-stronghold", icon: Shield, description: "Breaking free", tooltip: "Identify and break spiritual strongholds using Scripture." },
      { label: "Weight & Health", path: "/blueprint-weight-loss", icon: Dumbbell, description: "Wellness", tooltip: "A faith-based approach to physical wellness rooted in biblical health principles." },
      { label: "Mental Health", path: "/blueprint-mental-health", icon: Brain, description: "Mental wellness", tooltip: "Biblical resources for mental wellness — addressing anxiety, depression, and emotional health through Scripture." },
    ],
  },
  {
    id: "workshop",
    label: "Phototheology Workshop",
    simpleLabel: "AI Tools",
    subtitle: "AI Tools, GPTs & Settings",
    icon: Wrench,
    color: "215 14% 53%",
    items: [
      { label: "Phototheology GPT", path: "/phototheologygpt", icon: Sparkles, description: "Master AI assistant", tooltip: "The flagship AI assistant trained on the full Phototheology system. Ask any biblical question and receive answers using all 8 floors, cycles, and heavens." },
      { label: "BranchStudy", path: "/branch-study", icon: Network, description: "Branching paths", tooltip: "Explore branching study paths where each answer leads to deeper questions." },
      { label: "Kid GPT", path: "/kidgpt", icon: Users, description: "Kid-friendly AI", tooltip: "A child-friendly AI Bible teacher that explains Scripture using simple language and age-appropriate illustrations." },
      { label: "Daniel & Rev GPT", path: "/daniel-revelation-gpt", icon: Eye, description: "Prophecy AI", tooltip: "An AI specialized in the books of Daniel and Revelation." },
      { label: "Study Partners", path: "/community", icon: Users, description: "Find buddies", tooltip: "Browse available study partners and connect for collaborative Bible study." },
      { label: "Workspace", path: "/workspace", icon: LayoutGrid, description: "Your workspace", tooltip: "Your personal workspace dashboard — organize your active studies, recent tools, and bookmarks." },
      { label: "Pricing", path: "/pricing", icon: CreditCard, description: "Plans", tooltip: "View available subscription plans and features." },
    ],
  },
  {
    id: "university",
    label: "Phototheology University",
    simpleLabel: "Courses",
    subtitle: "Courses & Certificates",
    icon: GraduationCap,
    color: "45 90% 50%",
    items: [
      { label: "PT Course", path: "/phototheology-course", icon: BookText, description: "90-day flagship course", tooltip: "The 90-day flagship Phototheology course covering all 8 floors, 40+ rooms, and the full system." },
      { label: "Blueprint Course", path: "/blueprint-course", icon: BookOpen, description: "Prophecy foundations", tooltip: "A foundational course on prophecy, sanctuary symbolism, and end-time events." },
      { label: "Daniel Course", path: "/daniel-course", icon: Scroll, description: "Book of Daniel deep dive", tooltip: "A comprehensive deep dive into the book of Daniel — its prophecies, types, and sanctuary connections." },
      { label: "Revelation Course", path: "/revelation-course", icon: Crown, description: "Unveiling Revelation", tooltip: "Unlock the book of Revelation chapter by chapter through the PT lens." },
      { label: "Certificates", path: "/achievements", icon: Trophy, description: "Earned certificates", tooltip: "View and share your earned certificates of completion." },
    ],
  },
  {
    id: "equip",
    label: "Phototheology Equip",
    subtitle: "Apologetics & Doctrinal Defense",
    icon: Shield,
    color: "20 80% 50%",
    items: [
      { label: "COTA Series", path: "/cota-series", icon: Crown, description: "Christ in OT", tooltip: "Explore the Christ in the Old Testament Archives — studies revealing how every OT book points to Jesus Christ." },
      { label: "Defense Mode", path: "/cota-series?tab=defense", icon: Shield, description: "Doctrinal defense", tooltip: "Train in doctrinal defense using Scripture. Practice answering objections and building biblical arguments." },
      { label: "AATS War College", path: "/cota-series?tab=aats", icon: Target, description: "Advanced training", tooltip: "Advanced Apologetics Training System — intensive combat-level theological training." },
      { label: "Apologetics GPT", path: "/apologetics-gpt", icon: Shield, description: "Defend the faith", tooltip: "An AI trained specifically for apologetics. Present any objection and receive Scripture-grounded defensive arguments." },
      { label: "Christ & Culture", path: "/culture-controversy", icon: Scale, description: "Cultural topics", tooltip: "Explore how Scripture speaks to modern cultural issues with balanced, Christ-centered perspectives." },
    ],
  },
];

export const OsSpacesWelcome = () => {
  const [activeSpace, setActiveSpace] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const active = OS_SPACES.find(s => s.id === activeSpace);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Hero tagline */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-wide"
          style={{ fontFamily: "'Cinzel', serif", color: "#d4a017" }}
        >
          {user ? "Welcome back, Phototheologist" : "The Art of Phototheology"}
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          The Art of Seeing Christ in All Things — powered by <span className="font-semibold" style={{ color: "#d4a017" }}>Biblical Intelligence (BI)</span>
        </p>
      </motion.div>

      {/* 8 OS Space Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 max-w-5xl mx-auto">
        {OS_SPACES.map((space, i) => {
          const Icon = space.icon;
          const isActive = activeSpace === space.id;
          return (
            <motion.button
              key={space.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveSpace(isActive ? null : space.id)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 group/space overflow-hidden",
                isActive ? "scale-105" : "hover:scale-[1.03]"
              )}
              style={{
                background: `linear-gradient(135deg, hsl(${space.color} / 0.12), hsl(${space.color} / 0.04), rgba(0,0,0,0.6))`,
                border: `1px solid hsl(${space.color} / ${isActive ? '0.6' : '0.25'})`,
                boxShadow: isActive
                  ? `0 0 28px hsl(${space.color} / 0.4), 0 0 8px hsl(${space.color} / 0.2), inset 0 1px 0 hsl(${space.color} / 0.15)`
                  : `0 0 12px hsl(${space.color} / 0.15), inset 0 1px 0 hsl(${space.color} / 0.08)`,
              }}
            >
              {/* Animated border glow — rotating conic gradient */}
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: `conic-gradient(from ${i * 45}deg, transparent 0%, hsl(${space.color} / 0.7) 10%, transparent 20%, transparent 50%, hsl(${space.color} / 0.5) 60%, transparent 70%)`,
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'xor' as any,
                  WebkitMaskComposite: 'xor' as any,
                  padding: '1.5px',
                  animation: `spin ${3 + i * 0.5}s linear infinite`,
                  opacity: isActive ? 1 : 0.6,
                }}
              />

              {/* Pulsing ambient glow */}
              <div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 20px hsl(${space.color} / 0.1), 0 0 20px hsl(${space.color} / 0.08)`,
                  animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  opacity: isActive ? 0.8 : 0.4,
                }}
              />

              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all relative overflow-hidden z-10"
                style={{
                  background: `linear-gradient(160deg, hsl(${space.color} / 0.95), hsl(${space.color}) 50%, hsl(${space.color} / 0.75))`,
                  boxShadow: isActive
                    ? `0 0 24px hsl(${space.color} / 0.55), 0 4px 12px hsl(${space.color} / 0.3), inset 0 1px 1px rgba(255,255,255,0.25)`
                    : `0 4px 12px hsl(${space.color} / 0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.2)`,
                }}
              >
                {/* Inner highlight for gloss effect */}
                <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 45%, transparent 50%)' }} />
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold leading-tight text-center relative z-10" style={{ color: `hsl(${space.color})` }}>{space.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Expanded Space — Desktop-style app grid */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: "auto", overflow: "visible", transitionEnd: { overflow: "visible" } }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="rounded-2xl border p-5 space-y-4 backdrop-blur-xl"
              style={{
                background: `linear-gradient(135deg, hsl(${active.color} / 0.12), hsl(${active.color} / 0.04), hsl(${active.color} / 0.08))`,
                borderColor: `hsl(${active.color} / 0.25)`,
                boxShadow: `0 8px 32px hsl(${active.color} / 0.15), inset 0 1px 0 hsl(${active.color} / 0.1)`,
              }}
            >
              {/* Space header */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, hsl(${active.color}), hsl(${active.color} / 0.7))` }}
                >
                  <active.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{active.label}</h3>
                  <p className="text-xs text-muted-foreground">{active.subtitle} · {active.items.length} tools</p>
                </div>
              </div>

              {/* App icon grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {active.items.map((item, idx) => {
                  const ItemIcon = item.icon;
                  // Deterministic "random" hue per item using golden angle for max spread
                  const goldenAngle = 137.508;
                  const itemHue = Math.round((idx * goldenAngle + active.id.charCodeAt(0) * 47) % 360);
                  const sat = 65 + (idx % 3) * 10; // 65-85%
                  const light = 50 + (idx % 4) * 5; // 50-65%
                  const itemColor = `${itemHue} ${sat}% ${light}%`;
                  return (
                    <TooltipProvider key={item.path + item.label} delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => navigate(item.path)}
                            className="relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl backdrop-blur-md border border-white/10 hover:border-white/30 transition-all group hover:scale-[1.04]"
                            style={{
                              background: `linear-gradient(135deg, hsl(${itemColor} / 0.14), hsl(${itemColor} / 0.05))`,
                              boxShadow: `0 0 12px hsl(${itemColor} / 0.1)`,
                            }}
                          >
                            {/* Pin button — top-right corner */}
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                              <PinToDockButton path={item.path} label={item.label} />
                            </div>
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 relative overflow-hidden"
                              style={{
                                background: `linear-gradient(160deg, hsl(${itemColor} / 0.85), hsl(${itemColor} / 0.55) 50%, hsl(${itemColor} / 0.35))`,
                                boxShadow: `0 4px 14px hsl(${itemColor} / 0.35), 0 1px 4px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.18)`,
                              }}
                            >
                              <div className="absolute inset-0 rounded-xl" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 45%)' }} />
                              <ItemIcon className="w-4 h-4 text-white/95 group-hover:text-white transition-colors relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                            </div>
                            <span className="text-[10px] font-medium leading-tight text-center line-clamp-2">{item.label}</span>
                          </button>
                        </TooltipTrigger>
                        {item.tooltip && (
                          <TooltipContent 
                            side="top" 
                            sideOffset={8}
                            className="max-w-[280px] text-xs leading-relaxed px-4 py-3 rounded-xl border-primary/20 bg-popover/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                          >
                            <p className="font-semibold text-primary mb-1 text-[11px]">{item.label}</p>
                            <p className="text-muted-foreground">{item.tooltip}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BI badge */}
      {!activeSpace && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/40">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#d4a017" }} />
            <span className="text-xs text-muted-foreground">
              <span className="font-semibold" style={{ color: "#d4a017" }}>BI</span> · Biblical Intelligence Engine · 70+ tools across 8 spaces
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
