import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  Palette, Landmark, Mic, Swords, Church, Wrench,
  BookOpen, Brain, Zap, Gem, BookMarked, Lightbulb, Target,
  Search, PersonStanding, GraduationCap, Network, Headphones,
  Building2, Image, Sparkles, Film, Eye,
  Gamepad2, CalendarDays, Trophy, Dumbbell, Shield,
  Flame, Calendar, StickyNote, Scale, Heart, HeartHandshake,
  MessageSquare, Megaphone, Video, Crown, Users, User,
  Library, Clock, Map, Languages, BookText, Glasses,
  CreditCard, LayoutGrid, ImageIcon, Scroll,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SpaceItem {
  label: string;
  path: string;
  icon: LucideIcon;
  description?: string;
  hue?: number;
}

interface OsSpace {
  id: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  items: SpaceItem[];
}

const OS_SPACES: OsSpace[] = [
  {
    id: "studio",
    label: "The Studio",
    subtitle: "Study, Write & Research",
    icon: Palette,
    color: "210 100% 56%",
    items: [
      { label: "Study Bible", path: "/bible", icon: BookOpen, description: "Read & study Scripture" },
      { label: "My Studies", path: "/my-studies", icon: BookMarked, description: "Your saved studies" },
      { label: "Study Ideas", path: "/study-ideas", icon: Lightbulb, description: "AI-generated prompts" },
      { label: "Study Buddy", path: "/study-buddy", icon: Brain, description: "AI companion" },
      { label: "Research Assistant", path: "/research-assistant", icon: GraduationCap, description: "Advanced research" },
      { label: "Give Me A Gem", path: "/give-me-a-gem", icon: Gem, description: "Quick insights" },
      { label: "Analyze Thoughts", path: "/analyze-thoughts", icon: Lightbulb, description: "AI thought analysis" },
      { label: "Gather Fragments", path: "/drill-drill", icon: Target, description: "Collect fragments" },
      { label: "Study Series", path: "/bible-study-series", icon: BookOpen, description: "Multi-lesson series" },
      { label: "Notes", path: "/notes", icon: StickyNote, description: "Personal notes" },
      { label: "Interlinear Bible", path: "/bible/John/1?strongs=true", icon: BookText, description: "Greek/Hebrew" },
      { label: "Lexicon", path: "/bible-lexicon", icon: Languages, description: "Word study" },
      { label: "Encyclopedia", path: "/encyclopedia", icon: Search, description: "Biblical encyclopedia" },
      { label: "Characters", path: "/character-profiles", icon: PersonStanding, description: "Bible characters" },
      { label: "Genealogy", path: "/research-assistant?tab=genealogy", icon: Network, description: "Trace lineages" },
      { label: "Timeline", path: "/bible-timeline", icon: Clock, description: "Chronological map" },
      { label: "Bible Atlas", path: "/bible-atlas", icon: Map, description: "Geographic explorer" },
      { label: "Source Library", path: "/libraries", icon: Library, description: "Reference materials" },
    ],
  },
  {
    id: "gallery",
    label: "The Gallery",
    subtitle: "Palace, Visuals & Memory",
    icon: Landmark,
    color: "32 95% 53%",
    items: [
      { label: "Memory Palace", path: "/palace", icon: Building2, description: "8 Floors of PT" },
      { label: "Tour the Palace", path: "/palace/tour", icon: Headphones, description: "Audio walkthrough" },
      { label: "Freestyle Arena", path: "/palace/freestyle", icon: Zap, description: "Spontaneous connections" },
      { label: "Mind Map", path: "/mind-map", icon: Network, description: "Visual mapping" },
      { label: "Memory Training", path: "/memory", icon: Brain, description: "Drills & exercises" },
      { label: "Image Bible", path: "/image-bible", icon: Image, description: "Visual Scripture" },
      { label: "Study Deck", path: "/card-deck", icon: Sparkles, description: "Flashcards" },
      { label: "Infographics", path: "/image-bible", icon: ImageIcon, description: "Visual summaries" },
      { label: "VR Experience", path: "/vr", icon: Glasses, description: "Immersive 3D palace" },
    ],
  },
  {
    id: "stage",
    label: "The Stage",
    subtitle: "Sermons, Teaching & Output",
    icon: Mic,
    color: "270 56% 65%",
    items: [
      { label: "Sermon Builder", path: "/sermon-builder", icon: MessageSquare, description: "Craft sermons" },
      { label: "Sermon Ideas", path: "/sermon-ideas", icon: Lightbulb, description: "Saved concepts" },
      { label: "Amplify", path: "/amplify", icon: Megaphone, description: "Enhance with cross-refs" },
      { label: "Remix", path: "/remix", icon: Zap, description: "Remix frameworks" },
      { label: "Polish", path: "/polish", icon: Film, description: "Sermon manuscripts" },
      { label: "Video Training", path: "/video-training", icon: Video, description: "Teaching videos" },
    ],
  },
  {
    id: "arena",
    label: "The Arena",
    subtitle: "Games, Challenges & Combat",
    icon: Swords,
    color: "0 84% 60%",
    items: [
      { label: "COTA Series", path: "/cota-series", icon: Crown, description: "Christ in OT" },
      { label: "Defense Mode", path: "/cota-series?tab=defense", icon: Shield, description: "Doctrinal defense" },
      { label: "AATS War College", path: "/cota-series?tab=aats", icon: Swords, description: "Advanced training" },
      { label: "Games", path: "/games", icon: Gamepad2, description: "Multiplayer games" },
      { label: "Scheduled Games", path: "/schedule", icon: CalendarDays, description: "Game nights" },
      { label: "Daily Challenges", path: "/daily-challenges", icon: Zap, description: "Today's challenge" },
      { label: "Challenge Board", path: "/challenge-board", icon: Trophy, description: "Public board" },
      { label: "Leaderboard", path: "/leaderboard", icon: Trophy, description: "Top Phototheologists" },
      { label: "Achievements", path: "/achievements", icon: Trophy, description: "Earned badges" },
      { label: "Test Me", path: "/test-me", icon: GraduationCap, description: "Assessments" },
      { label: "Training Drills", path: "/test-me", icon: Target, description: "Speed drills" },
      { label: "Dojo", path: "/spiritual-training", icon: Swords, description: "Combat training" },
      { label: "Apologetics GPT", path: "/apologetics-gpt", icon: Shield, description: "Defend the faith" },
      { label: "Christ & Culture", path: "/culture-controversy", icon: Scale, description: "Cultural topics" },
    ],
  },
  {
    id: "chapel",
    label: "The Chapel",
    subtitle: "Devotional, Church & Community",
    icon: Church,
    color: "142 71% 45%",
    items: [
      { label: "Devotionals", path: "/devotionals", icon: Flame, description: "Daily devotions" },
      { label: "Daily Reading", path: "/daily-reading", icon: Calendar, description: "Reading plan" },
      { label: "Reading Plans", path: "/reading-plans", icon: Calendar, description: "Structured paths" },
      { label: "Audio Library", path: "/audio-library", icon: Headphones, description: "Audio studies" },
      { label: "Prophecy Watch", path: "/prophecy-watch", icon: Eye, description: "Events & prophecy" },
      { label: "My Church", path: "/living-manna", icon: Church, description: "Church community" },
      { label: "Community", path: "/community", icon: Users, description: "Study partners" },
      { label: "My Profile", path: "/my-profile", icon: User, description: "Your profile" },
      { label: "Marriage", path: "/blueprint-marriage", icon: Heart, description: "Dating & marriage" },
      { label: "Grief Support", path: "/blueprint-grief", icon: HeartHandshake, description: "Grief guide" },
      { label: "Strongholds", path: "/blueprint-stronghold", icon: Shield, description: "Breaking free" },
      { label: "Weight & Health", path: "/blueprint-weight-loss", icon: Dumbbell, description: "Wellness" },
      { label: "Mental Health", path: "/blueprint-mental-health", icon: Brain, description: "Mental wellness" },
    ],
  },
  {
    id: "workshop",
    label: "The Workshop",
    subtitle: "AI Tools, GPTs & Settings",
    icon: Wrench,
    color: "215 14% 53%",
    items: [
      { label: "Phototheology GPT", path: "/phototheologygpt", icon: Sparkles, description: "Master AI assistant" },
      { label: "BranchStudy", path: "/branch-study", icon: Network, description: "Branching paths" },
      { label: "Kid GPT", path: "/kidgpt", icon: Users, description: "Kid-friendly AI" },
      { label: "Daniel & Rev GPT", path: "/daniel-revelation-gpt", icon: Eye, description: "Prophecy AI" },
      { label: "Study Partners", path: "/community", icon: Users, description: "Find buddies" },
      { label: "Workspace", path: "/workspace", icon: LayoutGrid, description: "Your workspace" },
      { label: "Pricing", path: "/pricing", icon: CreditCard, description: "Plans" },
    ],
  },
  {
    id: "academy",
    label: "The Academy",
    subtitle: "Courses & Progression",
    icon: GraduationCap,
    color: "45 90% 50%",
    items: [
      { label: "PT Course", path: "/phototheology-course", icon: BookText, description: "90-day flagship course" },
      { label: "Blueprint Course", path: "/blueprint-course", icon: BookOpen, description: "Prophecy foundations" },
      { label: "Daniel Course", path: "/daniel-course", icon: Scroll, description: "Book of Daniel deep dive" },
      { label: "Revelation Course", path: "/revelation-course", icon: Crown, description: "Unveiling Revelation" },
      { label: "Floor Mastery", path: "/mastery", icon: GraduationCap, description: "Track progression" },
      { label: "Certificates", path: "/achievements", icon: Trophy, description: "Earned certificates" },
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

      {/* 6 OS Space Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 max-w-4xl mx-auto">
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
                "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200",
                isActive
                  ? "border-primary/60 bg-primary/10 scale-105 shadow-lg"
                  : "border-border/40 bg-card/80 hover:border-primary/40 hover:bg-primary/5"
              )}
            >
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: `linear-gradient(135deg, hsl(${space.color}), hsl(${space.color} / 0.7))`,
                  boxShadow: isActive
                    ? `0 0 20px hsl(${space.color} / 0.5)`
                    : `0 3px 8px hsl(${space.color} / 0.25)`,
                }}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold leading-tight text-center">{space.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Expanded Space — Desktop-style app grid */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
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
                    <button
                      key={item.path + item.label}
                      onClick={() => navigate(item.path)}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl backdrop-blur-md border border-white/10 hover:border-white/30 transition-all group hover:scale-[1.04]"
                      style={{
                        background: `linear-gradient(135deg, hsl(${itemColor} / 0.14), hsl(${itemColor} / 0.05))`,
                        boxShadow: `0 0 12px hsl(${itemColor} / 0.1)`,
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, hsl(${itemColor} / 0.5), hsl(${itemColor} / 0.2))`,
                          boxShadow: `0 0 16px hsl(${itemColor} / 0.35), 0 2px 8px hsl(${itemColor} / 0.2)`,
                        }}
                      >
                        <ItemIcon className="w-4 h-4 text-white/90 group-hover:text-white transition-colors drop-shadow-sm" />
                      </div>
                      <span className="text-[10px] font-medium leading-tight text-center line-clamp-2">{item.label}</span>
                    </button>
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
              <span className="font-semibold" style={{ color: "#d4a017" }}>BI</span> · Biblical Intelligence Engine · 70+ tools across 7 spaces
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
