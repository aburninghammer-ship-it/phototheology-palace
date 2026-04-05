/**
 * ModeBadge — Small inline badge for feature cards showing their mode level
 * 
 * Explorer features: 🧭 Guided teal badge
 * Immersion features: ⚡ Full Access gold badge
 * Locked features: 🔒 Lock badge with level name
 */
import { Compass, Flame, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import type { ExperienceMode } from "@/config/featureRegistry";

interface ModeBadgeProps {
  requiredMode: ExperienceMode;
  className?: string;
  variant?: "default" | "minimal";
}

export function ModeBadge({ requiredMode, className, variant = "default" }: ModeBadgeProps) {
  const { mode } = useExperienceMode();
  const modeLevel = { basic: 1, explorer: 2, immersion: 3 };
  const isLocked = modeLevel[mode] < modeLevel[requiredMode];

  if (requiredMode === "basic") return null; // No badge needed for basic features

  if (isLocked) {
    return (
      <span className={cn(
        "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full",
        "bg-muted/50 text-muted-foreground border border-border/50",
        className
      )}>
        <Lock className="w-2.5 h-2.5" />
        {requiredMode === "immersion" ? "Immersion" : "Explorer"}
      </span>
    );
  }

  if (requiredMode === "explorer") {
    return (
      <span className={cn(
        "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full",
        "bg-teal-500/15 text-teal-400 border border-teal-500/20",
        variant === "minimal" && "px-1.5 py-0",
        className
      )}>
        <Compass className="w-2.5 h-2.5" />
        {variant !== "minimal" && "Guided"}
      </span>
    );
  }

  // Immersion
  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full",
      "bg-amber-500/15 text-amber-400 border border-amber-500/20",
      variant === "minimal" && "px-1.5 py-0",
      className
    )}>
      <Flame className="w-2.5 h-2.5" />
      {variant !== "minimal" && "Full Access"}
    </span>
  );
}
