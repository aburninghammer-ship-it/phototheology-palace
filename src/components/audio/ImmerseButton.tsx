/**
 * ImmerseButton - Reusable trigger for Immersive Audio Mode
 * Drop this into any audio feature to enable fullscreen cinematic playback
 */
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImmerseButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "outline" | "ghost" | "default";
  label?: string;
}

export function ImmerseButton({
  onClick,
  disabled = false,
  className,
  size = "default",
  variant = "outline",
  label = "Immerse",
}: ImmerseButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "border-amber-500/30 hover:bg-amber-500/10 text-amber-400 gap-2",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Maximize2 className="h-4 w-4" />
      {label}
    </Button>
  );
}
