/**
 * ExperienceModeIndicator — Floating badge that shows current experience level
 * 
 * Explorer: Teal "Workshop" badge with compass icon + coaching tooltip
 * Immersion: Gold "Full Palace" badge with flame icon
 * Basic: Hidden (no indicator needed — it's the default)
 */
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { Compass, Flame, ArrowUpRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ExperienceModeIndicatorProps {
  className?: string;
  showUpgradeHint?: boolean;
}

export function ExperienceModeIndicator({ className, showUpgradeHint = true }: ExperienceModeIndicatorProps) {
  const { mode, isBasic } = useExperienceMode();
  const navigate = useNavigate();

  // Don't show for basic mode
  if (isBasic) return null;

  const config = mode === "explorer"
    ? {
        label: "Workshop Mode",
        sublabel: "Guided Phototheology",
        icon: Compass,
        gradient: "from-teal-500/20 to-cyan-500/20",
        border: "border-teal-500/30",
        glow: "shadow-teal-500/20",
        textColor: "text-teal-400",
        dotColor: "bg-teal-400",
        tooltip: "You're in Workshop mode — Phototheology principles are introduced gently as you study. Room codes appear as learning badges you can hover to explore.",
        upgradeText: "Ready for full access? Try Immersion →",
      }
    : {
        label: "Full Palace",
        sublabel: "Immersion Mode",
        icon: Flame,
        gradient: "from-amber-500/20 to-orange-500/20",
        border: "border-amber-500/30",
        glow: "shadow-amber-500/20",
        textColor: "text-amber-400",
        dotColor: "bg-amber-400",
        tooltip: "Full Palace access — all 8 Floors, 38 Rooms, Codes, Cycles, and architectural tools unlocked. Built for teachers and advanced students.",
        upgradeText: null,
      };

  const Icon = config.icon;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
              "backdrop-blur-xl border transition-all cursor-default",
              "bg-gradient-to-r", config.gradient, config.border,
              "shadow-lg", config.glow,
              className
            )}
          >
            <span className={cn("relative flex h-2 w-2")}>
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", config.dotColor)} />
              <span className={cn("relative inline-flex rounded-full h-2 w-2", config.dotColor)} />
            </span>
            <Icon className={cn("w-3.5 h-3.5", config.textColor)} />
            <span className={cn("font-semibold", config.textColor)}>{config.label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[280px] p-3 space-y-2">
          <p className="text-xs leading-relaxed">{config.tooltip}</p>
          {showUpgradeHint && config.upgradeText && (
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
            >
              {config.upgradeText}
              <ArrowUpRight className="w-2.5 h-2.5" />
            </button>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
