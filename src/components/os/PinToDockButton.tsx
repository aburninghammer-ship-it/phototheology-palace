import { Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePinnedDock } from "@/hooks/usePinnedDock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PinToDockButtonProps {
  path: string;
  label?: string;
  variant?: "icon" | "full";
  className?: string;
}

export function PinToDockButton({ path, label, variant = "icon", className }: PinToDockButtonProps) {
  const { isPinned, togglePin, isFull } = usePinnedDock();
  const pinned = isPinned(path);

  const handleClick = () => {
    if (!pinned && isFull) {
      toast.error("Dock is full! Unpin something first.", { duration: 2000 });
      return;
    }
    togglePin(path);
    toast.success(pinned ? "Removed from dock" : "Pinned to dock", { duration: 1500 });
  };

  if (variant === "full") {
    return (
      <Button
        variant={pinned ? "secondary" : "outline"}
        size="sm"
        onClick={handleClick}
        className={cn("gap-2 text-xs", className)}
      >
        {pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
        {pinned ? "Unpin from Dock" : "Pin to Dock"}
      </Button>
    );
  }

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
          className={cn(
            "p-1.5 rounded-lg transition-all",
            pinned
              ? "text-primary bg-primary/10 hover:bg-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            className
          )}
        >
          {pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="text-xs z-50">
        {pinned ? "Unpin from dock" : `Pin${label ? ` "${label}"` : ""} to dock`}
      </TooltipContent>
    </Tooltip>
  );
}
