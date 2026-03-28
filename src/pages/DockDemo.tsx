import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2, BookOpen, Brain, StickyNote, Sword, Zap, Gem, Gamepad2,
  Search, Clock, MapPin, Languages, BookMarked, Crown, Layers,
  ChevronRight, ChevronLeft, ChevronDown, Sparkles, GraduationCap, Music, Eye,
  MessageSquare, Users, Trophy, Target, Church, LayoutGrid, ArrowLeft,
  Headphones, Image, Network, Calendar, Film, PersonStanding, Shield,
  Lightbulb, Video, Library, CreditCard, Scale, Megaphone, Heart,
  BookCheck, Flame, Dumbbell, FileText, PenTool, Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────
interface DockSubItem {
  id: string;
  label: string;
  path: string;
  icon?: typeof Building2;
}

interface DockItem {
  id: string;
  label: string;
  icon: typeof Building2;
  path: string;
  glow: string;
  children?: DockSubItem[];
}

interface DockSection {
  id: string;
  label: string;
  items: DockItem[];
}

// ── All Tabs Organized ─────────────────────────────────────
const DOCK_SECTIONS: DockSection[] = [
  {
    id: "core",
    label: "Core",
    items: [
      {
        id: "palace", label: "Palace", icon: Building2, path: "/palace", glow: "32 95% 53%",
        children: [
          { id: "palace-tour", label: "Tour the Palace", path: "/palace/tour", icon: Headphones },
          { id: "freestyle", label: "Freestyle", path: "/palace/freestyle", icon: Zap },
          { id: "mind-map", label: "Mind Map", path: "/mind-map", icon: Network },
          { id: "mastery", label: "Mastery", path: "/mastery", icon: Crown },
          { id: "card-deck", label: "Study Deck", path: "/card-deck", icon: Sparkles },
          { id: "ascensions", label: "Ascensions", path: "/ascensions-expansions", icon: Layers },
        ],
      },
      {
        id: "bible", label: "Study Bible", icon: BookOpen, path: "/bible", glow: "210 100% 56%",
        children: [
          { id: "reading-plans", label: "Reading Plans", path: "/reading-plans", icon: Calendar },
          { id: "daily-reading", label: "Daily Reading", path: "/daily-reading", icon: BookOpen },
          { id: "daily-verse", label: "Daily Verse", path: "/daily-verse", icon: Heart },
          { id: "devotionals", label: "Devotionals", path: "/devotionals", icon: Flame },
          { id: "my-studies", label: "My Studies", path: "/my-studies", icon: BookMarked },
          { id: "study-ideas", label: "Study Ideas", path: "/study-ideas", icon: Lightbulb },
        ],
      },
      {
        id: "study-buddy", label: "Study Buddy", icon: Brain, path: "/study-buddy", glow: "270 70% 60%",
        children: [
          { id: "pt-gpt", label: "Phototheology GPT", path: "/phototheologygpt", icon: Sparkles },
          { id: "branch-study", label: "BranchStudy", path: "/branch-study", icon: Network },
          { id: "kid-gpt", label: "Kid GPT", path: "/kidgpt", icon: Users },
          { id: "dr-gpt", label: "Daniel & Rev GPT", path: "/daniel-revelation-gpt", icon: Eye },
          { id: "apol-gpt", label: "Apologetics GPT", path: "/apologetics-gpt", icon: Shield },
          { id: "research-asst", label: "Research Assistant", path: "/research-assistant", icon: GraduationCap },
        ],
      },
      {
        id: "notes", label: "Notes", icon: StickyNote, path: "/notes", glow: "45 100% 51%",
        children: [
          { id: "analyze", label: "Analyze Thoughts", path: "/analyze-thoughts", icon: Lightbulb },
          { id: "growth-journal", label: "Growth Journal", path: "/growth-journal", icon: PenTool },
        ],
      },
    ],
  },
  {
    id: "train",
    label: "Train",
    items: [
      {
        id: "defense", label: "Defense Mode", icon: Sword, path: "/spiritual-training", glow: "0 84% 60%",
        children: [
          { id: "test-me", label: "Test Me", path: "/test-me", icon: GraduationCap },
          { id: "drill-drill", label: "Gather Fragments", path: "/drill-drill", icon: Target },
          { id: "training-drills", label: "Training Drills", path: "/training-drills", icon: Dumbbell },
          { id: "flashcards", label: "Flashcards", path: "/flashcards", icon: Layers },
          { id: "memory", label: "Memory Palace", path: "/memory", icon: Brain },
          { id: "culture", label: "Christ & Culture", path: "/culture-controversy", icon: Scale },
        ],
      },
      {
        id: "challenges", label: "Challenges", icon: Zap, path: "/daily-challenges", glow: "25 95% 53%",
        children: [
          { id: "challenge-board", label: "Challenge Board", path: "/challenge-board", icon: Trophy },
          { id: "genesis-challenge", label: "Genesis High Rise", path: "/genesis-challenge", icon: Building2 },
          { id: "weekly", label: "Weekly Challenge", path: "/weekly-challenge", icon: Calendar },
        ],
      },
      {
        id: "games", label: "Games", icon: Gamepad2, path: "/games", glow: "280 70% 60%",
        children: [
          { id: "schedule", label: "Scheduled Games", path: "/schedule", icon: Calendar },
          { id: "multiplayer", label: "PT Multiplayer", path: "/pt-multiplayer", icon: Users },
          { id: "leaderboard", label: "Leaderboard", path: "/leaderboard", icon: Trophy },
          { id: "achievements", label: "Achievements", path: "/achievements", icon: Trophy },
        ],
      },
    ],
  },
  {
    id: "study",
    label: "Study",
    items: [
      {
        id: "research", label: "Research Tools", icon: Search, path: "/interlinear", glow: "180 70% 50%",
        children: [
          { id: "interlinear", label: "Interlinear Bible", path: "/interlinear", icon: Languages },
          { id: "lexicon", label: "Greek/Hebrew Lexicon", path: "/bible-lexicon", icon: BookOpen },
          { id: "timeline", label: "Bible Timeline", path: "/bible-timeline", icon: Clock },
          { id: "atlas", label: "Bible Atlas", path: "/bible-atlas", icon: MapPin },
          { id: "encyclopedia", label: "Encyclopedia", path: "/encyclopedia", icon: Search },
          { id: "characters", label: "Character Profiles", path: "/character-profiles", icon: PersonStanding },
        ],
      },
      {
        id: "programs", label: "Programs", icon: GraduationCap, path: "/courses", glow: "142 70% 45%",
        children: [
          { id: "courses", label: "Courses", path: "/courses", icon: GraduationCap },
          { id: "cota", label: "COTA Series", path: "/cota-series", icon: Crown },
          { id: "quarterly", label: "Quarterly Study", path: "/quarterly-study", icon: Calendar },
          { id: "series", label: "Study Series", path: "/bible-study-series", icon: BookMarked },
          { id: "image-bible", label: "Image Bible", path: "/image-bible", icon: Image },
          { id: "video-training", label: "Video Training", path: "/video-training", icon: Video },
          { id: "sources", label: "Source Library", path: "/sources", icon: Library },
        ],
      },
    ],
  },
  {
    id: "devotion",
    label: "Devotion",
    items: [
      {
        id: "gems", label: "Gems", icon: Gem, path: "/give-me-a-gem", glow: "160 70% 45%",
        children: [
          { id: "polish", label: "Polish", path: "/polish", icon: Film },
          { id: "amplify", label: "Amplify", path: "/amplify", icon: Zap },
          { id: "remix", label: "Remix", path: "/remix", icon: Megaphone },
        ],
      },
      {
        id: "music", label: "Music", icon: Headphones, path: "/music", glow: "190 70% 50%",
      },
      {
        id: "sermons", label: "Sermons", icon: MessageSquare, path: "/sermon-builder", glow: "270 60% 55%",
        children: [
          { id: "sermon-ideas", label: "Sermon Ideas", path: "/sermon-ideas", icon: Lightbulb },
          { id: "sermon-archive", label: "Sermon Archive", path: "/sermon-archive", icon: FileText },
        ],
      },
    ],
  },
  {
    id: "community",
    label: "Community",
    items: [
      {
        id: "church", label: "Church Space", icon: Church, path: "/living-manna", glow: "142 70% 40%",
      },
      {
        id: "prophecy", label: "Prophecy Watch", icon: Eye, path: "/prophecy-watch", glow: "250 60% 55%",
      },
      {
        id: "community-feed", label: "Community", icon: Users, path: "/community", glow: "180 60% 50%",
        children: [
          { id: "discover", label: "Discover People", path: "/discover", icon: Search },
          { id: "guilds", label: "Guilds", path: "/guilds", icon: Shield },
          { id: "study-partners", label: "Study Partners", path: "/study-partners", icon: Users },
        ],
      },
      {
        id: "workspace", label: "Workspace", icon: LayoutGrid, path: "/workspace", glow: "210 60% 50%",
      },
    ],
  },
];

// ── Dock Component ─────────────────────────────────────────
function OSDock({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isParentActive = (item: DockItem) =>
    isActive(item.path) || item.children?.some((c) => isActive(c.path));

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderSubItem = (sub: DockSubItem) => {
    const active = isActive(sub.path);
    const Icon = sub.icon || ChevronRight;
    return (
      <button
        key={sub.id}
        onClick={() => navigate(sub.path)}
        className={cn(
          "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs transition-all w-full",
          active
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{sub.label}</span>
      </button>
    );
  };

  const renderItem = (item: DockItem) => {
    const active = isActive(item.path);
    const parentActive = isParentActive(item);
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = expandedItems.has(item.id);
    const Icon = item.icon;

    const itemColor = `hsl(${item.glow})`;
    const itemColorFaint = `hsl(${item.glow} / 0.15)`;
    const itemColorMed = `hsl(${item.glow} / 0.25)`;

    const mainButton = (
      <button
        key={item.id}
        onClick={() => {
          if (hasChildren && expanded) {
            toggleExpand(item.id);
          } else {
            navigate(item.path);
          }
        }}
        className={cn(
          "relative flex items-center gap-3 rounded-xl transition-all duration-200 group w-full",
          expanded ? "px-3 py-2.5" : "p-2.5 justify-center",
        )}
        style={{
          backgroundColor: active ? itemColorFaint : undefined,
          color: active ? itemColor : parentActive ? itemColor : undefined,
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = itemColorFaint;
            e.currentTarget.style.color = itemColor;
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "";
          }
        }}
      >
        {/* Active glow bar */}
        {(active || parentActive) && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full"
            style={{
              backgroundColor: itemColor,
              height: active ? "24px" : "16px",
              opacity: active ? 1 : 0.5,
            }}
          />
        )}

        <Icon className="h-5 w-5 shrink-0" style={{ color: itemColor }} />

        {expanded && (
          <>
            <span className="text-sm font-medium truncate flex-1 text-left">{item.label}</span>
            {hasChildren && (
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 shrink-0 transition-transform",
                  isOpen && "rotate-180"
                )}
                style={{ color: `hsl(${item.glow} / 0.5)` }}
              />
            )}
          </>
        )}

        {/* Active glow bg */}
        {active && (
          <div
            className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
            style={{ background: `radial-gradient(circle at center, hsl(${item.glow} / 0.4), transparent)` }}
          />
        )}
      </button>
    );

    // Collapsed mode: tooltip + click navigates directly
    if (!expanded) {
      return (
        <div key={item.id}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate(item.path)}
                className="relative flex items-center p-2.5 justify-center rounded-xl transition-all duration-200 w-full"
                style={{
                  backgroundColor: active ? itemColorFaint : undefined,
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = itemColorFaint; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                {(active || parentActive) && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full"
                    style={{ backgroundColor: itemColor, height: active ? "24px" : "16px", opacity: active ? 1 : 0.5 }}
                  />
                )}
                <Icon className="h-5 w-5 shrink-0" style={{ color: itemColor }} />
                {hasChildren && (
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `hsl(${item.glow} / 0.5)` }} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              <p className="font-semibold">{item.label}</p>
              {hasChildren && (
                <div className="mt-1.5 space-y-0.5 border-t border-border pt-1.5">
                  {item.children!.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => navigate(sub.path)}
                      className={cn(
                        "block text-xs w-full text-left px-1 py-0.5 rounded hover:bg-muted",
                        isActive(sub.path) && "text-primary font-medium"
                      )}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </div>
      );
    }

    // Expanded mode: show children inline
    return (
      <div key={item.id}>
        {mainButton}
        <AnimatePresence>
          {hasChildren && isOpen && expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-4 pl-3 py-1 flex flex-col gap-0.5" style={{ borderLeft: `2px solid hsl(${item.glow} / 0.25)` }}>
                {/* Direct link to parent page */}
                <button
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs transition-all w-full hover:bg-muted"
                  style={{ color: active ? itemColor : undefined }}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: itemColor }} />
                  <span className="truncate">{item.label} Home</span>
                </button>
                {item.children!.map((sub) => {
                  const subActive = isActive(sub.path);
                  const SubIcon = sub.icon || ChevronRight;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => navigate(sub.path)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs transition-all w-full"
                      style={{
                        color: subActive ? itemColor : `hsl(${item.glow} / 0.75)`,
                        backgroundColor: subActive ? `hsl(${item.glow} / 0.15)` : undefined,
                        fontWeight: subActive ? 600 : 400,
                      }}
                      onMouseEnter={(e) => {
                        if (!subActive) {
                          e.currentTarget.style.backgroundColor = `hsl(${item.glow} / 0.08)`;
                          e.currentTarget.style.color = itemColor;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!subActive) {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = `hsl(${item.glow} / 0.75)`;
                        }
                      }}
                    >
                      <SubIcon className="h-3.5 w-3.5 shrink-0" style={{ color: itemColor }} />
                      <span className="truncate">{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: expanded ? 240 : 64 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-full flex flex-col bg-sidebar border-r border-sidebar-border relative z-50"
    >
      {/* Logo / Brand */}
      <div className={cn(
        "flex items-center shrink-0 border-b border-sidebar-border",
        expanded ? "h-14 px-4 gap-3" : "h-14 justify-center"
      )}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, hsl(32 95% 53%), hsl(210 85% 50%))" }}>
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        {expanded && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold truncate" style={{ background: "linear-gradient(135deg, hsl(32 95% 53%), hsl(210 85% 50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PhototheologyOS</span>
            <span className="text-[10px] text-muted-foreground">Biblical Intelligence</span>
          </div>
        )}
      </div>

      {/* Scrollable Navigation */}
      <ScrollArea className="flex-1">
        <div className={cn("flex flex-col gap-0.5 py-2", expanded ? "px-3" : "px-2")}>
          {DOCK_SECTIONS.map((section, sIdx) => (
            <div key={section.id}>
              {sIdx > 0 && (
                <div className={cn("border-t border-sidebar-border my-2", expanded ? "mx-1" : "mx-1")} />
              )}
              {expanded && (
                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider px-3 pt-2 pb-1 block">
                  {section.label}
                </span>
              )}
              {section.items.map(renderItem)}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Toggle button */}
      <div className={cn(
        "shrink-0 border-t border-sidebar-border p-2",
        !expanded && "flex justify-center"
      )}>
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
        >
          {expanded ? (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ── Demo Page ──────────────────────────────────────────────
export default function DockDemo() {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background -mt-16 pt-0 relative z-50">
      <OSDock expanded={expanded} onToggle={() => setExpanded(!expanded)} />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-foreground">PhototheologyOS — Dock Preview</h1>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Concept</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Persistent OS Dock with Sub-Tabs</h2>
              <p className="text-muted-foreground leading-relaxed">
                Every main item expands to reveal its sub-tabs. All 40+ features are organized 
                under logical parent items — nothing is lost, everything is findable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Expandable Parents", desc: "Click any item with a ▼ arrow to reveal its sub-tabs. Palace → Tour, Freestyle, Mind Map, Mastery, etc." },
                { title: "All 40+ Tabs Preserved", desc: "Every current tab is mapped under a logical parent. Nothing removed — just organized into a clear hierarchy." },
                { title: "Collapsed Mode", desc: "In icon-only mode, hover shows a tooltip with the sub-items listed. Click any to navigate directly." },
                { title: "Visual Hierarchy", desc: "Sections (Core, Train, Study, Devotion, Community) keep the dock scannable. Active items glow with their accent color." },
                { title: "Parent Home Link", desc: "When expanded, a '[Tool] Home' link at the top of sub-items takes you to the main page of that tool." },
                { title: "Tree Lines", desc: "Sub-items connect to their parent via a visual tree line, making the hierarchy clear at a glance." },
              ].map((card) => (
                <div key={card.title} className="rounded-xl border border-border bg-card p-5 space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-3">
              <h3 className="text-sm font-bold text-primary">📋 Tab Mapping Summary</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground">
                <div><strong className="text-foreground">Palace</strong> → Tour, Freestyle, Mind Map, Mastery, Study Deck, Ascensions</div>
                <div><strong className="text-foreground">Study Bible</strong> → Reading Plans, Daily Reading, Daily Verse, Devotionals, My Studies, Study Ideas</div>
                <div><strong className="text-foreground">Study Buddy</strong> → PT GPT, BranchStudy, Kid GPT, D&R GPT, Apologetics GPT, Research Asst</div>
                <div><strong className="text-foreground">Defense Mode</strong> → Test Me, Fragments, Drills, Flashcards, Memory Palace, Christ & Culture</div>
                <div><strong className="text-foreground">Challenges</strong> → Challenge Board, Genesis High Rise, Weekly Challenge</div>
                <div><strong className="text-foreground">Games</strong> → Scheduled Games, Multiplayer, Leaderboard, Achievements</div>
                <div><strong className="text-foreground">Research</strong> → Interlinear, Lexicon, Timeline, Atlas, Encyclopedia, Characters</div>
                <div><strong className="text-foreground">Programs</strong> → Courses, COTA, Quarterly, Series, Image Bible, Videos, Source Library</div>
                <div><strong className="text-foreground">Gems</strong> → Polish, Amplify, Remix</div>
                <div><strong className="text-foreground">Sermons</strong> → Sermon Ideas, Sermon Archive</div>
                <div><strong className="text-foreground">Community</strong> → Discover People, Guilds, Study Partners</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
