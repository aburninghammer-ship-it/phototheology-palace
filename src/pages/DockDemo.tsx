import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2, BookOpen, Brain, StickyNote, Sword, Zap, Gem, Gamepad2,
  Search, Clock, MapPin, Languages, BookMarked, Crown, Layers,
  ChevronRight, ChevronLeft, Sparkles, GraduationCap, Music, Eye,
  MessageSquare, Users, Trophy, Target, Church, LayoutGrid, ArrowLeft,
  Headphones, Image, Network
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Dock Data ──────────────────────────────────────────────
interface DockItem {
  id: string;
  label: string;
  icon: typeof Building2;
  path: string;
  glow: string; // HSL accent for active state
}

interface DockGroup {
  id: string;
  label: string;
  icon: typeof Layers;
  items: DockItem[];
}

const PINNED_ITEMS: DockItem[] = [
  { id: "palace", label: "Palace", icon: Building2, path: "/palace", glow: "32 95% 53%" },
  { id: "bible", label: "Study Bible", icon: BookOpen, path: "/bible", glow: "210 100% 56%" },
  { id: "study-buddy", label: "Study Buddy", icon: Brain, path: "/study-buddy", glow: "270 70% 60%" },
  { id: "notes", label: "Notes", icon: StickyNote, path: "/notes", glow: "45 100% 51%" },
];

const TRAIN_ITEMS: DockItem[] = [
  { id: "defense", label: "Defense Mode", icon: Sword, path: "/spiritual-training", glow: "0 84% 60%" },
  { id: "challenges", label: "Challenges", icon: Zap, path: "/daily-challenges", glow: "25 95% 53%" },
  { id: "games", label: "Games", icon: Gamepad2, path: "/games", glow: "280 70% 60%" },
];

const CREATE_ITEMS: DockItem[] = [
  { id: "gems", label: "Gems", icon: Gem, path: "/give-me-a-gem", glow: "160 70% 45%" },
  { id: "music", label: "Music", icon: Headphones, path: "/music", glow: "190 70% 50%" },
  { id: "sermon", label: "Sermons", icon: MessageSquare, path: "/sermon-builder", glow: "270 60% 55%" },
];

const FLYOUT_GROUPS: DockGroup[] = [
  {
    id: "research",
    label: "Research Tools",
    icon: Search,
    items: [
      { id: "interlinear", label: "Interlinear", icon: Languages, path: "/interlinear", glow: "180 70% 50%" },
      { id: "lexicon", label: "Lexicon", icon: BookOpen, path: "/bible-lexicon", glow: "210 85% 50%" },
      { id: "timeline", label: "Timeline", icon: Clock, path: "/bible-timeline", glow: "45 90% 50%" },
      { id: "atlas", label: "Atlas", icon: MapPin, path: "/bible-atlas", glow: "142 76% 36%" },
      { id: "concordance", label: "Concordance", icon: Search, path: "/concordance", glow: "210 60% 50%" },
    ],
  },
  {
    id: "programs",
    label: "Study Programs",
    icon: GraduationCap,
    items: [
      { id: "courses", label: "Courses", icon: GraduationCap, path: "/courses", glow: "142 70% 45%" },
      { id: "cota", label: "COTA Series", icon: Crown, path: "/cota-series", glow: "32 95% 53%" },
      { id: "series", label: "Study Series", icon: BookMarked, path: "/bible-study-series", glow: "210 85% 50%" },
      { id: "image-bible", label: "Image Bible", icon: Image, path: "/image-bible", glow: "25 90% 55%" },
      { id: "mind-map", label: "Mind Map", icon: Network, path: "/mind-map", glow: "250 60% 55%" },
    ],
  },
  {
    id: "community",
    label: "Community",
    icon: Users,
    items: [
      { id: "church", label: "Church Space", icon: Church, path: "/living-manna", glow: "142 70% 40%" },
      { id: "prophecy", label: "Prophecy Watch", icon: Eye, path: "/prophecy-watch", glow: "250 60% 55%" },
      { id: "leaderboard", label: "Leaderboard", icon: Trophy, path: "/leaderboard", glow: "45 100% 51%" },
      { id: "workspace", label: "Workspace", icon: LayoutGrid, path: "/workspace", glow: "210 60% 50%" },
    ],
  },
];

// ── Dock Component ─────────────────────────────────────────
function OSDock({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openFlyout, setOpenFlyout] = useState<string | null>(null);
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const renderItem = (item: DockItem) => {
    const active = isActive(item.path);
    const Icon = item.icon;

    const button = (
      <button
        key={item.id}
        onClick={() => navigate(item.path)}
        className={cn(
          "relative flex items-center gap-3 rounded-xl transition-all duration-200 group",
          expanded ? "px-3 py-2.5 w-full" : "p-2.5 justify-center",
          active
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {/* Active glow dot */}
        {active && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
            style={{ backgroundColor: `hsl(${item.glow})` }}
          />
        )}
        <Icon className={cn("shrink-0", expanded ? "h-5 w-5" : "h-5 w-5")} />
        {expanded && (
          <span className="text-sm font-medium truncate">{item.label}</span>
        )}
        {/* Active glow background */}
        {active && (
          <div
            className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
            style={{ background: `radial-gradient(circle at center, hsl(${item.glow} / 0.4), transparent)` }}
          />
        )}
      </button>
    );

    if (!expanded) {
      return (
        <Tooltip key={item.id} delayDuration={0}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }
    return button;
  };

  const renderGroupTrigger = (group: DockGroup) => {
    const Icon = group.icon;
    const isOpen = openFlyout === group.id;

    const button = (
      <button
        key={group.id}
        onClick={() => setOpenFlyout(isOpen ? null : group.id)}
        className={cn(
          "relative flex items-center gap-3 rounded-xl transition-all duration-200",
          expanded ? "px-3 py-2.5 w-full" : "p-2.5 justify-center",
          isOpen
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {expanded && (
          <>
            <span className="text-sm font-medium truncate flex-1 text-left">{group.label}</span>
            <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-90")} />
          </>
        )}
      </button>
    );

    if (!expanded) {
      return (
        <Tooltip key={group.id} delayDuration={0}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {group.label}
          </TooltipContent>
        </Tooltip>
      );
    }
    return button;
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: expanded ? 220 : 64 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-full flex flex-col bg-sidebar border-r border-sidebar-border relative z-50"
    >
      {/* Logo / Brand */}
      <div className={cn(
        "flex items-center shrink-0 border-b border-sidebar-border",
        expanded ? "h-14 px-4 gap-3" : "h-14 justify-center"
      )}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        {expanded && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-foreground truncate">PhototheologyOS</span>
            <span className="text-[10px] text-muted-foreground">Biblical Intelligence</span>
          </div>
        )}
      </div>

      {/* Scrollable Navigation */}
      <ScrollArea className="flex-1 py-2">
        <div className={cn("flex flex-col gap-1", expanded ? "px-3" : "px-2")}>
          {/* Core */}
          {expanded && (
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider px-3 pt-2 pb-1">
              Core
            </span>
          )}
          {PINNED_ITEMS.map(renderItem)}

          {/* Separator */}
          <div className={cn("border-t border-sidebar-border my-2", expanded ? "mx-2" : "mx-1")} />

          {/* Train */}
          {expanded && (
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider px-3 pt-1 pb-1">
              Train
            </span>
          )}
          {TRAIN_ITEMS.map(renderItem)}

          {/* Separator */}
          <div className={cn("border-t border-sidebar-border my-2", expanded ? "mx-2" : "mx-1")} />

          {/* Create */}
          {expanded && (
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider px-3 pt-1 pb-1">
              Create
            </span>
          )}
          {CREATE_ITEMS.map(renderItem)}

          {/* Separator */}
          <div className={cn("border-t border-sidebar-border my-2", expanded ? "mx-2" : "mx-1")} />

          {/* Flyout Groups */}
          {expanded && (
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider px-3 pt-1 pb-1">
              More
            </span>
          )}
          {FLYOUT_GROUPS.map((group) => (
            <div key={group.id}>
              {renderGroupTrigger(group)}
              <AnimatePresence>
                {openFlyout === group.id && expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 py-1 flex flex-col gap-0.5">
                      {group.items.map(renderItem)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Collapsed: flyout panel on hover */}
              {openFlyout === group.id && !expanded && (
                <div className="absolute left-full top-0 ml-2 bg-popover border border-border rounded-xl shadow-lg p-2 min-w-[180px] z-[60]"
                  style={{ top: "auto", position: "absolute" }}
                >
                  <p className="text-xs font-semibold text-muted-foreground px-2 py-1">{group.label}</p>
                  {group.items.map(renderItem)}
                </div>
              )}
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
      {/* The Dock */}
      <OSDock expanded={expanded} onToggle={() => setExpanded(!expanded)} />

      {/* Main Content Area (demo) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
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

        {/* Content mockup */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Persistent OS Dock</h2>
              <p className="text-muted-foreground leading-relaxed">
                This is a concept preview of the PhototheologyOS dock. The sidebar stays visible on every page, 
                giving you instant access to core tools without tab-hunting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Always Accessible", desc: "Core tools (Palace, Bible, Buddy, Notes) are always one click away — no scrolling through tabs." },
                { title: "Collapsible", desc: "Click the toggle to shrink to icon-only mode. Hover for tooltips. Your content gets full width." },
                { title: "Grouped Flyouts", desc: "Research Tools, Study Programs, and Community are organized into expandable groups — clean but comprehensive." },
                { title: "Active Glow", desc: "A colored indicator shows exactly where you are in the system. Each tool has its own accent color." },
                { title: "OS Feel", desc: "The dock persists across page navigation — it's not a menu you open, it's part of your environment." },
                { title: "Mobile Adaptive", desc: "On mobile, the bottom nav stays. The dock is desktop-only (lg+), replacing the scrolling tab bar." },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-border bg-card p-5 space-y-2"
                >
                  <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-3">
              <h3 className="text-sm font-bold text-primary">💡 What changes from current app</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Desktop:</strong> Top scrolling tab bar → replaced by this persistent dock</li>
                <li>• <strong>Mobile:</strong> Bottom nav stays unchanged — dock is hidden on small screens</li>
                <li>• <strong>Navigation feels like an OS</strong> — tools are "always there," not discovered via menus</li>
                <li>• <strong>Content gets more space</strong> — no more horizontal tab overflow</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
