/**
 * ExplorerPalaceTab — Palace Floors overview for Level 2 (Explorer)
 * Displays all 8 floors with their rooms in glassified, color-coded cards.
 */
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { palaceFloors } from "@/data/palaceData";
import {
  Building2, BookOpen, Eye, Search, Zap, Telescope,
  Globe, Flame, Crown, Lock,
} from "lucide-react";

const FLOOR_COLORS: Record<number, {
  gradient: string;
  border: string;
  glow: string;
  iconBg: string;
  iconColor: string;
  text: string;
  roomBg: string;
  roomBorder: string;
}> = {
  1: {
    gradient: "from-amber-500/15 via-amber-400/5 to-transparent",
    border: "border-amber-400/30",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.15)]",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    text: "text-amber-300",
    roomBg: "bg-amber-500/8",
    roomBorder: "border-amber-500/20",
  },
  2: {
    gradient: "from-sky-500/15 via-sky-400/5 to-transparent",
    border: "border-sky-400/30",
    glow: "shadow-[0_0_20px_rgba(56,189,248,0.15)]",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-400",
    text: "text-sky-300",
    roomBg: "bg-sky-500/8",
    roomBorder: "border-sky-500/20",
  },
  3: {
    gradient: "from-emerald-500/15 via-emerald-400/5 to-transparent",
    border: "border-emerald-400/30",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.15)]",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    text: "text-emerald-300",
    roomBg: "bg-emerald-500/8",
    roomBorder: "border-emerald-500/20",
  },
  4: {
    gradient: "from-violet-500/15 via-violet-400/5 to-transparent",
    border: "border-violet-400/30",
    glow: "shadow-[0_0_20px_rgba(167,139,250,0.15)]",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    text: "text-violet-300",
    roomBg: "bg-violet-500/8",
    roomBorder: "border-violet-500/20",
  },
  5: {
    gradient: "from-blue-500/15 via-blue-400/5 to-transparent",
    border: "border-blue-400/30",
    glow: "shadow-[0_0_20px_rgba(96,165,250,0.15)]",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    text: "text-blue-300",
    roomBg: "bg-blue-500/8",
    roomBorder: "border-blue-500/20",
  },
  6: {
    gradient: "from-teal-500/15 via-teal-400/5 to-transparent",
    border: "border-teal-400/30",
    glow: "shadow-[0_0_20px_rgba(45,212,191,0.15)]",
    iconBg: "bg-teal-500/15",
    iconColor: "text-teal-400",
    text: "text-teal-300",
    roomBg: "bg-teal-500/8",
    roomBorder: "border-teal-500/20",
  },
  7: {
    gradient: "from-rose-500/15 via-rose-400/5 to-transparent",
    border: "border-rose-400/30",
    glow: "shadow-[0_0_20px_rgba(251,113,133,0.15)]",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-400",
    text: "text-rose-300",
    roomBg: "bg-rose-500/8",
    roomBorder: "border-rose-500/20",
  },
  8: {
    gradient: "from-yellow-500/15 via-yellow-400/5 to-transparent",
    border: "border-yellow-400/30",
    glow: "shadow-[0_0_20px_rgba(250,204,21,0.15)]",
    iconBg: "bg-yellow-500/15",
    iconColor: "text-yellow-400",
    text: "text-yellow-300",
    roomBg: "bg-yellow-500/8",
    roomBorder: "border-yellow-500/20",
  },
};

const FLOOR_ICONS = [
  BookOpen,   // 1 - Furnishing
  Search,     // 2 - Investigation
  Zap,        // 3 - Freestyle
  Eye,        // 4 - Next Level
  Telescope,  // 5 - Vision
  Globe,      // 6 - Three Heavens
  Flame,      // 7 - Spiritual
  Crown,      // 8 - Master
];

export default function ExplorerPalaceTab() {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <Building2 className="h-6 w-6 text-primary drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-300 bg-clip-text text-transparent">
              The Palace
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            8 floors of progressive Bible study mastery — from memory to reflexive thinking.
          </p>
        </div>

        {/* Floors Grid */}
        <div className="space-y-3">
          {palaceFloors.map((floor) => {
            const colors = FLOOR_COLORS[floor.number] || FLOOR_COLORS[1];
            const FloorIcon = FLOOR_ICONS[floor.number - 1] || Building2;

            return (
              <button
                key={floor.number}
                onClick={() => navigate(`/palace?floor=${floor.number}`)}
                className={cn(
                  "w-full text-left rounded-xl p-4 transition-all duration-300 group",
                  "bg-gradient-to-r backdrop-blur-xl",
                  "border hover:scale-[1.01]",
                  colors.gradient,
                  colors.border,
                  "hover:" + colors.glow.replace("shadow-", "shadow-"),
                )}
              >
                <div className="flex items-start gap-3.5">
                  {/* Floor icon */}
                  <div className={cn(
                    "shrink-0 p-2.5 rounded-lg transition-all duration-300",
                    colors.iconBg,
                    "group-hover:scale-110"
                  )}>
                    <FloorIcon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      colors.iconColor,
                      "group-hover:drop-shadow-[0_0_8px_currentColor]"
                    )} />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Floor title */}
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className={cn("text-xs font-bold uppercase tracking-wider", colors.text)}>
                        Floor {floor.number}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {floor.name}
                      </span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        — {floor.subtitle}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                      {floor.description}
                    </p>

                    {/* Rooms pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {floor.rooms.map((room) => (
                        <span
                          key={room.id}
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full border",
                            "text-muted-foreground/80",
                            colors.roomBg,
                            colors.roomBorder,
                          )}
                        >
                          {room.tag} — {room.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
