import { Lock, ArrowUpRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MODE_LABELS, type ExperienceMode } from "@/config/featureRegistry";
import { cn } from "@/lib/utils";

interface LockedFeatureOverlayProps {
  minMode: ExperienceMode;
  children: React.ReactNode;
}

/** Wraps a feature item with a grayed-out lock overlay and tooltip. */
export function LockedFeatureOverlay({ minMode, children }: LockedFeatureOverlayProps) {
  const modeColor = minMode === "immersion" 
    ? "from-amber-500/30 to-orange-500/30 border-amber-500/40" 
    : "from-teal-500/30 to-cyan-500/30 border-teal-500/40";
  const lockBg = minMode === "immersion" ? "bg-amber-900/80" : "bg-teal-900/80";
  const labelColor = minMode === "immersion" ? "text-amber-300" : "text-teal-300";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative cursor-not-allowed group">
            <div className="opacity-30 pointer-events-none select-none blur-[0.5px]">
              {children}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={cn(
                "backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 border",
                "bg-gradient-to-r", modeColor
              )}>
                <Lock className="w-3 h-3 text-white/80" />
                <span className={cn("text-[10px] font-semibold", labelColor)}>
                  {MODE_LABELS[minMode]}
                </span>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="text-xs px-3 py-2 rounded-lg max-w-[200px]"
        >
          <p>Upgrade to <span className="font-semibold">{MODE_LABELS[minMode]}</span> to unlock this feature</p>
          <p className="flex items-center gap-1 mt-1 text-primary text-[10px] font-medium">
            Change in Settings <ArrowUpRight className="w-2.5 h-2.5" />
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
