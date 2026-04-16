/**
 * ModeBadge — Small inline badge for feature cards showing their mode level
 * Study features: ⚡ Full Access badge
 * Locked features: 🔒 Lock badge
 */
import { Flame, Lock } from "lucide-react";
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
  const modeLevel: Record<string, number> = { basic: 1, immersion: 2 };
  const isLocked = (modeLevel[mode] || 1) < (modeLevel[requiredMode] || 1);

  if (requiredMode === "basic") return null;

  if (isLocked) {
    return (
      <span className={cn(
        "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full",
        "bg-muted/50 text-muted-foreground border border-border/50",
        className
      )}>
        <Lock className="w-2.5 h-2.5" />
        Study
      </span>
    );
  }

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
