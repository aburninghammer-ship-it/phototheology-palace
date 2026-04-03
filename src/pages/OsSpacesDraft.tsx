import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { cn } from "@/lib/utils";
import {
  Palette, Landmark, Mic, Swords, Church, Wrench,
  BookOpen, Brain, Zap, Gem, BookMarked, Lightbulb, Target,
  Search, PersonStanding, GraduationCap, Network, Headphones,
  Building2, Image, Sparkles, Layers3, Film, Eye,
  Gamepad2, CalendarDays, Trophy, Dumbbell, Shield,
  Flame, Calendar, StickyNote, Scale, Heart, HeartHandshake,
  MessageSquare, Megaphone, Video, Crown, Users, User,
  Library, Clock, Map, Languages, BookText, Glasses,
  CreditCard, LayoutGrid, ImageIcon, Moon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── OS Space Definitions ──
interface SpaceItem {
  label: string;
  path: string;
  icon: LucideIcon;
  description?: string;
}

interface OsSpace {
  id: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  color: string; // HSL for glow
  gradient: string;
  items: SpaceItem[];
}

const OS_SPACES: OsSpace[] = [
  {
    id: "studio",
    label: "Phototheology Studio",
    subtitle: "Study, Write & Research",
    icon: Palette,
    color: "210 100% 56%",
    gradient: "from-blue-600/20 to-indigo-600/20",
    items: [
      { label: "Study Bible", path: "/bible", icon: BookOpen, description: "Read & study Scripture" },
      { label: "My Studies", path: "/my-studies", icon: BookMarked, description: "Your saved studies" },
      { label: "Study Ideas", path: "/study-ideas", icon: Lightbulb, description: "AI-generated study prompts" },
      { label: "Study Buddy", path: "/study-buddy", icon: Brain, description: "AI companion for deep study" },
      { label: "Research Assistant", path: "/research-assistant", icon: GraduationCap, description: "Advanced research tools" },
      { label: "Give Me A Gem", path: "/give-me-a-gem", icon: Gem, description: "Quick insight generator" },
      { label: "Analyze My Thoughts", path: "/analyze-thoughts", icon: Lightbulb, description: "AI thought analysis" },
      { label: "Gather Fragments", path: "/drill-drill", icon: Target, description: "Collect study fragments" },
      { label: "Amplify", path: "/amplify", icon: Megaphone, description: "Enhance studies with cross-refs" },
      { label: "Remix", path: "/remix", icon: Zap, description: "Reorganize into new frameworks" },
      { label: "Study Series", path: "/bible-study-series", icon: BookOpen, description: "Multi-lesson series" },
      { label: "Notes", path: "/notes", icon: StickyNote, description: "Personal study notes" },
      { label: "Interlinear Bible", path: "/bible/John/1?strongs=true", icon: BookText, description: "Greek/Hebrew interlinear" },
      { label: "Greek/Hebrew Lexicon", path: "/bible-lexicon", icon: Languages, description: "Word study tools" },
      { label: "Encyclopedia", path: "/encyclopedia", icon: Search, description: "Biblical encyclopedia" },
      { label: "Character Profiles", path: "/character-profiles", icon: PersonStanding, description: "Bible character deep dives" },
      { label: "Genealogy Decoder", path: "/research-assistant?tab=genealogy", icon: Network, description: "Trace biblical lineages" },
      { label: "Bible Timeline", path: "/bible-timeline", icon: Clock, description: "Chronological Bible map" },
      { label: "Bible Atlas", path: "/bible-atlas", icon: Map, description: "Geographic Bible explorer" },
      { label: "Source Library", path: "/libraries", icon: Library, description: "Reference materials" },
    ],
  },
  {
    id: "gallery",
    label: "Phototheology Gallery",
    subtitle: "Palace, Visuals & Memory",
    icon: Landmark,
    color: "32 95% 53%",
    gradient: "from-amber-600/20 to-yellow-600/20",
    items: [
      { label: "Memory Palace", path: "/palace", icon: Building2, description: "8 Floors of Phototheology" },
      { label: "Tour the Palace", path: "/palace/tour", icon: Headphones, description: "Guided audio walkthrough" },
      { label: "Freestyle Arena", path: "/palace/freestyle", icon: Zap, description: "Spontaneous connections" },
      { label: "Mind Map Palace", path: "/mind-map", icon: Network, description: "Visual palace mapping" },
      { label: "Memory Training", path: "/memory", icon: Brain, description: "Memory drills & exercises" },
      { label: "PT Image Bible", path: "/image-bible", icon: Image, description: "Visual Scripture gallery" },
      { label: "Study Deck", path: "/card-deck", icon: Sparkles, description: "Flashcards & review" },
      { label: "Infographic Generator", path: "/image-bible", icon: ImageIcon, description: "Create visual summaries" },
      { label: "VR Experience", path: "/vr", icon: Glasses, description: "Immersive 3D palace" },
      { label: "PT Course", path: "/phototheology-course", icon: BookText, description: "Learn the PT method" },
      { label: "Floor Mastery", path: "/mastery", icon: Crown, description: "Track floor progression" },
    ],
  },
  {
    id: "stage",
    label: "Phototheology Stage",
    subtitle: "Sermons, Teaching & Output",
    icon: Mic,
    color: "270 56% 65%",
    gradient: "from-purple-600/20 to-fuchsia-600/20",
    items: [
      { label: "Sermon Builder", path: "/sermon-builder", icon: MessageSquare, description: "Craft full sermons" },
      { label: "My Sermon Ideas", path: "/sermon-ideas", icon: Lightbulb, description: "Saved sermon concepts" },
      { label: "Polish", path: "/polish", icon: Film, description: "Generate sermon manuscripts" },
      { label: "Video Training", path: "/video-training", icon: Video, description: "Teaching video library" },
      { label: "Courses", path: "/courses", icon: GraduationCap, description: "Structured learning paths" },
      { label: "COTA Series", path: "/cota-series", icon: Crown, description: "Christ in Old Testament" },
      { label: "Leaderboard", path: "/leaderboard", icon: Trophy, description: "Top Phototheologists" },
      { label: "Achievements", path: "/achievements", icon: Trophy, description: "Your earned badges" },
    ],
  },
  {
    id: "arena",
    label: "Phototheology Arena",
    subtitle: "Games, Challenges & Drills",
    icon: Swords,
    color: "0 84% 60%",
    gradient: "from-red-600/20 to-orange-600/20",
    items: [
      { label: "Games", path: "/games", icon: Gamepad2, description: "Multiplayer Bible games" },
      { label: "Scheduled Games", path: "/schedule", icon: CalendarDays, description: "Upcoming game nights" },
      { label: "Daily Challenges", path: "/daily-challenges", icon: Zap, description: "Today's challenge" },
      { label: "Challenge Board", path: "/challenge-board", icon: Trophy, description: "Public submissions" },
      { label: "Test Me", path: "/test-me", icon: GraduationCap, description: "Knowledge assessments" },
      { label: "Training Drills", path: "/test-me", icon: Target, description: "Speed & mastery drills" },
      { label: "Dojo", path: "/spiritual-training", icon: Swords, description: "Spiritual combat training" },
      { label: "Apologetics GPT", path: "/apologetics-gpt", icon: Shield, description: "Defend the faith" },
      { label: "Christ & Culture", path: "/culture-controversy", icon: Scale, description: "Engage cultural topics" },
    ],
  },
  {
    id: "chapel",
    label: "Phototheology Chapel",
    subtitle: "Devotional, Church & Community",
    icon: Church,
    color: "142 71% 45%",
    gradient: "from-green-600/20 to-emerald-600/20",
    items: [
      { label: "Night Watches", path: "/night-watches", icon: Moon, description: "Evening Master Mind meditation" },
      { label: "Morning Watches", path: "/morning-watches", icon: Flame, description: "Morning activation sessions" },
      { label: "Devotionals", path: "/devotionals", icon: Flame, description: "Daily spiritual food" },
      { label: "Daily Reading", path: "/daily-reading", icon: Calendar, description: "Bible reading plan" },
      { label: "Reading Plans", path: "/reading-plans", icon: Calendar, description: "Structured reading paths" },
      { label: "Audio Library", path: "/audio-library", icon: Headphones, description: "Audio Bible & studies" },
      { label: "Prophecy Watch", path: "/prophecy-watch", icon: Eye, description: "Current events & prophecy" },
      { label: "My Church Space", path: "/living-manna", icon: Church, description: "Your church community" },
      { label: "Community", path: "/community", icon: Users, description: "Study partners & chat" },
      { label: "My Profile", path: "/my-profile", icon: User, description: "Your Phototheologist profile" },
      { label: "Blueprint: Marriage", path: "/blueprint-marriage", icon: Heart, description: "Dating & marriage guide" },
      { label: "Blueprint: Grief", path: "/blueprint-grief", icon: HeartHandshake, description: "Grief support" },
      { label: "Blueprint: Strongholds", path: "/blueprint-stronghold", icon: Shield, description: "Breaking strongholds" },
      { label: "Blueprint: Weight", path: "/blueprint-weight-loss", icon: Dumbbell, description: "Health & wellness" },
      { label: "Blueprint: Mental Health", path: "/blueprint-mental-health", icon: Brain, description: "Mental wellness" },
    ],
  },
  {
    id: "workshop",
    label: "Phototheology Workshop",
    subtitle: "AI Tools, GPTs & Settings",
    icon: Wrench,
    color: "215 14% 53%",
    gradient: "from-slate-600/20 to-zinc-600/20",
    items: [
      { label: "Phototheology GPT", path: "/phototheologygpt", icon: Sparkles, description: "Master PT AI assistant" },
      { label: "BranchStudy", path: "/branch-study", icon: Network, description: "Branching study paths" },
      { label: "Kid GPT", path: "/kidgpt", icon: Users, description: "Kid-friendly Bible AI" },
      { label: "Daniel & Revelation GPT", path: "/daniel-revelation-gpt", icon: Eye, description: "Prophecy-focused AI" },
      { label: "Study Partners", path: "/community", icon: Users, description: "Find study buddies" },
      { label: "Workspace", path: "/workspace", icon: LayoutGrid, description: "Your OS workspace" },
      { label: "Pricing", path: "/pricing", icon: CreditCard, description: "Plans & subscriptions" },
    ],
  },
];

// ── Component ──
export default function OsSpacesDraft() {
  const [activeSpace, setActiveSpace] = useState<string | null>(null);
  const navigate = useNavigate();

  const active = OS_SPACES.find(s => s.id === activeSpace);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Cinzel', serif", color: "#d4a017" }}>
            PhototheologyOS — Dock Restructure Draft
          </h1>
          <p className="text-muted-foreground text-lg">
            6 OS Spaces replacing 18 flat dock items — everything findable in 2 clicks
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Click a space to see its contents. Click any item to navigate there.
          </p>
        </div>

        {/* 6 Space Icons — The Dock */}
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          {OS_SPACES.map((space) => {
            const Icon = space.icon;
            const isActive = activeSpace === space.id;
            return (
              <button
                key={space.id}
                onClick={() => setActiveSpace(isActive ? null : space.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 min-w-[120px]",
                  isActive
                    ? "border-primary bg-primary/10 scale-105 shadow-lg"
                    : "border-border/50 bg-card hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center transition-all",
                    isActive ? "shadow-xl" : "shadow-md"
                  )}
                  style={{
                    background: `linear-gradient(135deg, hsl(${space.color}), hsl(${space.color} / 0.7))`,
                    boxShadow: isActive ? `0 0 24px hsl(${space.color} / 0.5)` : `0 4px 12px hsl(${space.color} / 0.3)`,
                  }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-semibold">{space.label}</span>
                <span className="text-[10px] text-muted-foreground leading-tight text-center">{space.subtitle}</span>
              </button>
            );
          })}
        </div>

        {/* Expanded Space Contents */}
        {active && (
          <div className={cn("rounded-2xl border-2 p-6 mb-8 transition-all", `bg-gradient-to-br ${active.gradient} border-border/50`)}>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, hsl(${active.color}), hsl(${active.color} / 0.7))` }}
              >
                <active.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{active.label}</h2>
                <p className="text-sm text-muted-foreground">{active.subtitle} — {active.items.length} tools</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {active.items.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.path + item.label}
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card/80 border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all group text-center"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted group-hover:bg-primary/10 transition-colors"
                    >
                      <ItemIcon className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-xs font-medium leading-tight">{item.label}</span>
                    {item.description && (
                      <span className="text-[9px] text-muted-foreground leading-tight hidden sm:block">{item.description}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Side-by-side comparison */}
        {!activeSpace && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current */}
            <div className="rounded-xl border p-5 bg-card">
              <h3 className="font-bold text-lg mb-3 text-destructive">❌ Current Dock (18 items)</h3>
              <div className="space-y-1.5 text-sm">
                {[
                  "Palace", "Study Bible", "Study Tools", "PT Course", "Training",
                  "Audio Library", "Devotional", "COTA", "Games", "Challenges",
                  "Sermon Builder", "Blueprint", "GPTs", "Community", "My Church Space",
                  "VR Experience", "Pricing", "Workspace"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded bg-muted/50">
                    <span className="text-muted-foreground text-xs w-5">{i + 1}.</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Proposed */}
            <div className="rounded-xl border-2 border-primary/30 p-5 bg-card">
              <h3 className="font-bold text-lg mb-3 text-primary">✅ Proposed OS Spaces (6 spaces)</h3>
              <div className="space-y-3">
                {OS_SPACES.map((space) => {
                  const Icon = space.icon;
                  return (
                    <div key={space.id} className="flex items-start gap-3 px-3 py-2 rounded-lg bg-muted/30">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `linear-gradient(135deg, hsl(${space.color}), hsl(${space.color} / 0.7))` }}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{space.label}</div>
                        <div className="text-xs text-muted-foreground">{space.subtitle}</div>
                        <div className="text-[10px] text-muted-foreground/70 mt-0.5">{space.items.length} tools</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-card border">
            <div className="text-3xl font-bold text-destructive">18</div>
            <div className="text-xs text-muted-foreground">Current top-level items</div>
          </div>
          <div className="p-4 rounded-xl bg-card border">
            <div className="text-3xl font-bold text-primary">6</div>
            <div className="text-xs text-muted-foreground">Proposed OS Spaces</div>
          </div>
          <div className="p-4 rounded-xl bg-card border">
            <div className="text-3xl font-bold" style={{ color: "#d4a017" }}>
              {OS_SPACES.reduce((acc, s) => acc + s.items.length, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total tools organized</div>
          </div>
        </div>
      </div>
    </div>
  );
}
