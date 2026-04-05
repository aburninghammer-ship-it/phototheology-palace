/**
 * ExplorerSpaceTab — Renders a space's tool grid for Level 2 (Explorer)
 * Each space has its own color identity with glassified, glowing cards
 */
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen, BookMarked, Lightbulb, Brain, GraduationCap, Gem, Target,
  StickyNote, BookText, Languages, Search, PersonStanding, Network,
  Clock, Map, Library, Headphones,
  Gamepad2, Zap, Trophy, CalendarDays,
  Eye, BookOpenCheck, Scroll, Crown,
  Moon, Flame, Calendar, Heart, HeartHandshake, Shield, Dumbbell,
  Globe,
} from "lucide-react";

interface SpaceItem {
  label: string;
  path: string;
  icon: LucideIcon;
  description: string;
}

const GAMES_ITEMS: SpaceItem[] = [
  { label: "Games Hub", path: "/games", icon: Gamepad2, description: "All games" },
  { label: "Daily Challenges", path: "/daily-challenges", icon: Zap, description: "Today's challenge" },
  { label: "Challenge Board", path: "/challenge-board", icon: Trophy, description: "Public board" },
  { label: "Leaderboard", path: "/leaderboard", icon: Trophy, description: "Top Phototheologists" },
  { label: "Achievements", path: "/achievements", icon: Trophy, description: "Earned badges" },
  { label: "Test Me", path: "/test-me", icon: GraduationCap, description: "Assessments" },
  { label: "Scheduled Games", path: "/schedule", icon: CalendarDays, description: "Game nights" },
];

const UNIVERSITY_ITEMS: SpaceItem[] = [
  { label: "Bible 101", path: "/bible-101", icon: Eye, description: "30-day visual journey" },
  { label: "PT Course", path: "/phototheology-course", icon: BookText, description: "90-day flagship course" },
  { label: "Blueprint Course", path: "/blueprint-course", icon: BookOpen, description: "Prophecy foundations" },
  { label: "Daniel Course", path: "/daniel-course", icon: Scroll, description: "Book of Daniel deep dive" },
  { label: "Revelation Course", path: "/revelation-course", icon: Crown, description: "Unveiling Revelation" },
  { label: "Certificates", path: "/achievements", icon: Trophy, description: "Earned certificates" },
];

interface SpaceTheme {
  title: string;
  subtitle: string;
  items: SpaceItem[];
  // Tailwind classes for theming
  iconBg: string;
  iconBgHover: string;
  iconColor: string;
  borderHover: string;
  cardHoverBg: string;
  cardGlow: string;
  titleGradient: string;
}

const SPACE_DATA: Record<string, SpaceTheme> = {
  "games-space": {
    title: "🎮 Games Space",
    subtitle: "Games, Challenges & Competition",
    items: GAMES_ITEMS,
    iconBg: "bg-red-500/10",
    iconBgHover: "group-hover:bg-red-500/20",
    iconColor: "text-red-400",
    borderHover: "hover:border-red-400/30",
    cardHoverBg: "hover:bg-red-500/5",
    cardGlow: "hover:shadow-[0_0_20px_rgba(248,113,113,0.15)]",
    titleGradient: "from-red-400 to-orange-400",
  },
  "university-space": {
    title: "🎓 University",
    subtitle: "Courses & Certificates",
    items: UNIVERSITY_ITEMS,
    iconBg: "bg-yellow-500/10",
    iconBgHover: "group-hover:bg-yellow-500/20",
    iconColor: "text-yellow-400",
    borderHover: "hover:border-yellow-400/30",
    cardHoverBg: "hover:bg-yellow-500/5",
    cardGlow: "hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]",
    titleGradient: "from-yellow-400 to-amber-400",
  },
};

interface ExplorerSpaceTabProps {
  spaceId: string;
}

export default function ExplorerSpaceTab({ spaceId }: ExplorerSpaceTabProps) {
  const navigate = useNavigate();
  const space = SPACE_DATA[spaceId];

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
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300",
                  "bg-card/40 backdrop-blur-xl border border-border/30",
                  space.borderHover, space.cardHoverBg, space.cardGlow,
                  "hover:scale-[1.03]",
                  "text-center group"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all duration-300",
                  space.iconBg, space.iconBgHover
                )}>
                  <Icon className={cn("h-5 w-5 transition-all duration-300", space.iconColor, "group-hover:drop-shadow-[0_0_6px_currentColor]")} />
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
