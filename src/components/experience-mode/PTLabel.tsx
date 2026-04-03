/**
 * PTLabel — Mode-aware label component
 * 
 * Renders different text based on the current experience mode:
 * - Simple: shows only the plain language label
 * - Guided: shows plain label + subtle PT tag on hover/after
 * - Master: shows full PT terminology
 */
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PTLabelProps {
  /** Plain language label shown in Simple & Guided modes */
  simple: string;
  /** Full PT terminology shown in Master mode */
  master: string;
  /** Optional PT code (e.g., "CR", "DR") shown as badge in Guided/Master */
  code?: string;
  /** Optional explanation of the PT concept */
  description?: string;
  /** Additional className */
  className?: string;
}

export function PTLabel({ simple, master, code, description, className = "" }: PTLabelProps) {
  const { mode } = useExperienceMode();

  if (mode === "simple") {
    return <span className={className}>{simple}</span>;
  }

  if (mode === "guided") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`inline-flex items-center gap-1.5 ${className}`}>
              {simple}
              {code && (
                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 font-mono opacity-60">
                  {code}
                </Badge>
              )}
            </span>
          </TooltipTrigger>
          {description && (
            <TooltipContent side="bottom" className="max-w-[250px]">
              <p className="font-medium text-xs">{master}</p>
              <p className="text-xs opacity-80 mt-1">{description}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Master mode
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {master}
      {code && (
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-mono">
          {code}
        </Badge>
      )}
    </span>
  );
}
