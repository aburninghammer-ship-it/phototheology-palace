/**
 * ExplorerSpaceTab — Renders a space's tool grid for Level 2 (Explorer)
 * Each card has its own unique color identity with glassified glow
 */
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen, BookText, Languages, Search, PersonStanding,
  Clock, Map, Library, Headphones,
  Gamepad2, Zap, Trophy, CalendarDays,
  Eye, Scroll, Crown, GraduationCap,
} from "lucide-react";

interface SpaceItem {
  label: string;
  path: string;
  icon: LucideIcon;
  description: string;
  color: string; // tailwind color key e.g. "red", "sky", "amber"
}

const COLOR_STYLES: Record<string, { iconBg: string; iconBgHover: string; iconColor: string; borderHover: string; glow: string; hoverBg: string }> = {
  red:     { iconBg: "bg-red-500/10",     iconBgHover: "group-hover:bg-red-500/25",     iconColor: "text-red-400",     borderHover: "hover:border-red-400/40",     glow: "hover:shadow-[0_0_18px_rgba(248,113,113,0.2)]",  hoverBg: "hover:bg-red-500/5" },
  orange:  { iconBg: "bg-orange-500/10",  iconBgHover: "group-hover:bg-orange-500/25",  iconColor: "text-orange-400",  borderHover: "hover:border-orange-400/40",  glow: "hover:shadow-[0_0_18px_rgba(251,146,60,0.2)]",   hoverBg: "hover:bg-orange-500/5" },
  amber:   { iconBg: "bg-amber-500/10",   iconBgHover: "group-hover:bg-amber-500/25",   iconColor: "text-amber-400",   borderHover: "hover:border-amber-400/40",   glow: "hover:shadow-[0_0_18px_rgba(251,191,36,0.2)]",   hoverBg: "hover:bg-amber-500/5" },
  yellow:  { iconBg: "bg-yellow-500/10",  iconBgHover: "group-hover:bg-yellow-500/25",  iconColor: "text-yellow-400",  borderHover: "hover:border-yellow-400/40",  glow: "hover:shadow-[0_0_18px_rgba(250,204,21,0.2)]",   hoverBg: "hover:bg-yellow-500/5" },
  emerald: { iconBg: "bg-emerald-500/10", iconBgHover: "group-hover:bg-emerald-500/25", iconColor: "text-emerald-400", borderHover: "hover:border-emerald-400/40", glow: "hover:shadow-[0_0_18px_rgba(52,211,153,0.2)]",   hoverBg: "hover:bg-emerald-500/5" },
  teal:    { iconBg: "bg-teal-500/10",    iconBgHover: "group-hover:bg-teal-500/25",    iconColor: "text-teal-400",    borderHover: "hover:border-teal-400/40",    glow: "hover:shadow-[0_0_18px_rgba(45,212,191,0.2)]",   hoverBg: "hover:bg-teal-500/5" },
  sky:     { iconBg: "bg-sky-500/10",     iconBgHover: "group-hover:bg-sky-500/25",     iconColor: "text-sky-400",     borderHover: "hover:border-sky-400/40",     glow: "hover:shadow-[0_0_18px_rgba(56,189,248,0.2)]",   hoverBg: "hover:bg-sky-500/5" },
  blue:    { iconBg: "bg-blue-500/10",    iconBgHover: "group-hover:bg-blue-500/25",    iconColor: "text-blue-400",    borderHover: "hover:border-blue-400/40",    glow: "hover:shadow-[0_0_18px_rgba(96,165,250,0.2)]",   hoverBg: "hover:bg-blue-500/5" },
  violet:  { iconBg: "bg-violet-500/10",  iconBgHover: "group-hover:bg-violet-500/25",  iconColor: "text-violet-400",  borderHover: "hover:border-violet-400/40",  glow: "hover:shadow-[0_0_18px_rgba(167,139,250,0.2)]",  hoverBg: "hover:bg-violet-500/5" },
  purple:  { iconBg: "bg-purple-500/10",  iconBgHover: "group-hover:bg-purple-500/25",  iconColor: "text-purple-400",  borderHover: "hover:border-purple-400/40",  glow: "hover:shadow-[0_0_18px_rgba(192,132,252,0.2)]",  hoverBg: "hover:bg-purple-500/5" },
  pink:    { iconBg: "bg-pink-500/10",    iconBgHover: "group-hover:bg-pink-500/25",    iconColor: "text-pink-400",    borderHover: "hover:border-pink-400/40",    glow: "hover:shadow-[0_0_18px_rgba(244,114,182,0.2)]",  hoverBg: "hover:bg-pink-500/5" },
  rose:    { iconBg: "bg-rose-500/10",    iconBgHover: "group-hover:bg-rose-500/25",    iconColor: "text-rose-400",    borderHover: "hover:border-rose-400/40",    glow: "hover:shadow-[0_0_18px_rgba(251,113,133,0.2)]",  hoverBg: "hover:bg-rose-500/5" },
  cyan:    { iconBg: "bg-cyan-500/10",    iconBgHover: "group-hover:bg-cyan-500/25",    iconColor: "text-cyan-400",    borderHover: "hover:border-cyan-400/40",    glow: "hover:shadow-[0_0_18px_rgba(34,211,238,0.2)]",   hoverBg: "hover:bg-cyan-500/5" },
};

const GAMES_ITEMS: SpaceItem[] = [
  { label: "Games Hub",        path: "/games",            icon: Gamepad2,      description: "All games",           color: "red" },
  { label: "Daily Challenges", path: "/daily-challenges",  icon: Zap,           description: "Today's challenge",   color: "orange" },
  { label: "Challenge Board",  path: "/challenge-board",   icon: Trophy,        description: "Public board",        color: "amber" },
  { label: "Leaderboard",      path: "/leaderboard",       icon: Trophy,        description: "Top Phototheologists", color: "emerald" },
  { label: "Achievements",     path: "/achievements",      icon: Trophy,        description: "Earned badges",       color: "sky" },
  { label: "Test Me",          path: "/test-me",           icon: GraduationCap, description: "Assessments",         color: "violet" },
  { label: "Scheduled Games",  path: "/schedule",          icon: CalendarDays,  description: "Game nights",         color: "pink" },
];

const UNIVERSITY_ITEMS: SpaceItem[] = [
  { label: "Master Class",        path: "/master-class",          icon: Headphones, description: "Podcast-style training",    color: "orange" },
  { label: "Bible 101",          path: "/bible-101",             icon: Eye,      description: "30-day visual journey",     color: "amber" },
  { label: "PT Course",          path: "/phototheology-course",  icon: BookText, description: "90-day flagship course",    color: "blue" },
  { label: "Blueprint Course",   path: "/blueprint-course",      icon: BookOpen, description: "Prophecy foundations",      color: "teal" },
  { label: "Daniel Course",      path: "/daniel-course",         icon: Scroll,   description: "Book of Daniel deep dive",  color: "purple" },
  { label: "Revelation Course",  path: "/revelation-course",     icon: Crown,    description: "Unveiling Revelation",      color: "rose" },
  { label: "Certificates",       path: "/achievements",          icon: Trophy,   description: "Earned certificates",       color: "emerald" },
];

const SPACE_META: Record<string, { title: string; subtitle: string; items: SpaceItem[]; titleGradient: string }> = {
  "games-space":      { title: "🎮 Games Space", subtitle: "Games, Challenges & Competition", items: GAMES_ITEMS, titleGradient: "from-red-400 to-orange-400" },
  "university-space": { title: "🎓 University",  subtitle: "Courses & Certificates",          items: UNIVERSITY_ITEMS, titleGradient: "from-amber-400 to-yellow-300" },
};

interface ExplorerSpaceTabProps {
  spaceId: string;
}

export default function ExplorerSpaceTab({ spaceId }: ExplorerSpaceTabProps) {
  const navigate = useNavigate();
  const space = SPACE_META[spaceId];
  if (!space) return null;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className={cn("text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent", space.titleGradient)}>
            {space.title}
          </h2>
          <p className="text-sm text-muted-foreground">{space.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {space.items.map((item) => {
            const Icon = item.icon;
            const c = COLOR_STYLES[item.color] ?? COLOR_STYLES.blue;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300",
                  "bg-card/40 backdrop-blur-xl border border-border/30",
                  c.borderHover, c.hoverBg, c.glow,
                  "hover:scale-[1.03]",
                  "text-center group"
                )}
              >
                <div className={cn("p-2.5 rounded-lg transition-all duration-300", c.iconBg, c.iconBgHover)}>
                  <Icon className={cn("h-5 w-5 transition-all duration-300", c.iconColor, "group-hover:drop-shadow-[0_0_6px_currentColor]")} />
                </div>
                <span className="text-xs font-medium text-foreground leading-tight">{item.label}</span>
                <span className="text-[10px] text-muted-foreground leading-tight line-clamp-2">{item.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
