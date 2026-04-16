import { Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface GideonWaterRationsProps {
  rations: number;
  maxRations?: number;
  size?: "sm" | "md" | "lg";
}

export function GideonWaterRations({ rations, maxRations = 2, size = "md" }: GideonWaterRationsProps) {
  const sizeClass = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6";

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRations }).map((_, i) => (
        <Droplets
          key={i}
          className={cn(
            sizeClass,
            "transition-all duration-500",
            i < rations
              ? "text-blue-400 fill-blue-400/30"
              : "text-gray-500/30"
          )}
        />
      ))}
    </div>
  );
}
