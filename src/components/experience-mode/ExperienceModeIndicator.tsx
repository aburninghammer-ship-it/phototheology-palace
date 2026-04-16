/**
 * ExperienceModeIndicator — Floating badge that shows current experience level
 * Only shown for Study (immersion) mode. Hidden for Learn (basic).
 */
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { Flame } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ExperienceModeIndicatorProps {
  className?: string;
  showUpgradeHint?: boolean;
}

export function ExperienceModeIndicator({ className, showUpgradeHint = true }: ExperienceModeIndicatorProps) {
  const { isBasic } = useExperienceMode();

  if (isBasic) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
              "backdrop-blur-xl border transition-all cursor-default",
              "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30",
              "shadow-lg shadow-amber-500/20",
              className
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-amber-400" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-amber-400">Study Mode</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[280px] p-3">
          <p className="text-xs leading-relaxed">Full Palace access — all 8 Floors, 38 Rooms, Codes, Cycles, and architectural tools unlocked. Built for teachers and advanced students.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
