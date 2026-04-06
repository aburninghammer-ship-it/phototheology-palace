import { useNavigate } from "react-router-dom";
import { useExperienceMode, type ExperienceMode } from "@/contexts/ExperienceModeContext";
import { cn } from "@/lib/utils";
import { Zap, Compass, Flame } from "lucide-react";

interface LevelInfo {
  mode: ExperienceMode;
  level: number;
  label: string;
  icon: typeof Zap;
  chipColor: string;
}

const LEVELS: LevelInfo[] = [
  {
    mode: "basic",
    level: 1,
    label: "Seeker",
    icon: Zap,
    chipColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    mode: "explorer",
    level: 2,
    label: "Builder",
    icon: Compass,
    chipColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  {
    mode: "immersion",
    level: 3,
    label: "Architect",
    icon: Flame,
    chipColor: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  },
];

export function LevelToggleChip() {
  const navigate = useNavigate();
  const { mode } = useExperienceMode();

  const current = LEVELS.find((level) => level.mode === mode) || LEVELS[0];
  const CurrentIcon = current.icon;

  return (
    <button
      type="button"
      onClick={() => navigate("/level-select")}
      aria-label="Open level selector"
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:brightness-125",
        current.chipColor,
      )}
    >
      <CurrentIcon className="h-3 w-3" />
      Level {current.level}: {current.label}
    </button>
  );
}
