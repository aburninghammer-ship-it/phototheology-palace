import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MODE_LABELS, type ExperienceMode } from "@/config/featureRegistry";

interface LockedFeatureOverlayProps {
  minMode: ExperienceMode;
  children: React.ReactNode;
}

/** Wraps a feature item with a grayed-out lock overlay and tooltip. */
export function LockedFeatureOverlay({ minMode, children }: LockedFeatureOverlayProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative cursor-not-allowed">
            <div className="opacity-40 pointer-events-none select-none">
              {children}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-1.5">
                <Lock className="w-3.5 h-3.5 text-white/80" />
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="text-xs px-3 py-2 rounded-lg"
        >
          Upgrade to <span className="font-semibold">{MODE_LABELS[minMode]}</span> to unlock
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
