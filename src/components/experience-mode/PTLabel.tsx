/**
 * PTLabel — Mode-aware label component
 * 
 * Renders different text based on the current experience mode:
 * - Basic: shows only the plain language label
 * - Explorer: shows plain label + subtle PT tag on hover/after
 * - Immersion: shows full PT terminology
 */
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PTLabelProps {
  /** Plain language label shown in Basic & Explorer modes */
  simple: string;
  /** Full PT terminology shown in Immersion mode */
  master: string;
  /** Optional PT code (e.g., "CR", "DR") shown as badge in Explorer/Immersion */
  code?: string;
  /** Optional explanation of the PT concept */
  description?: string;
  /** Additional className */
  className?: string;
}

export function PTLabel({ simple, master, code, description, className = "" }: PTLabelProps) {
  const { isBasic, isExplorer } = useExperienceMode();

  if (isBasic) {
    return <span className={className}>{simple}</span>;
  }

  if (isExplorer) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`inline-flex items-center gap-1.5 ${className}`}>
              {simple}
              {code && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-mono bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-teal-500/20 transition-colors">
                  {code}
                </Badge>
              )}
            </span>
          </TooltipTrigger>
          {description && (
            <TooltipContent side="bottom" className="max-w-[260px] border-teal-500/20">
              <p className="font-medium text-xs text-teal-400">{master}</p>
              <p className="text-xs opacity-80 mt-1">{description}</p>
              <p className="text-[10px] text-muted-foreground mt-1.5 italic">🧭 Learning this principle in Workshop mode</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Immersion mode
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {master}
      {code && (
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-mono bg-amber-500/15 text-amber-400 border border-amber-500/25">
          {code}
        </Badge>
      )}
    </span>
  );
}
