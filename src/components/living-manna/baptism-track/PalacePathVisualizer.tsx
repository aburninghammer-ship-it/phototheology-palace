import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PalaceRoom {
  floor: string;
  rooms: string[];
  principle: string;
}

interface PalacePathVisualizerProps {
  path?: PalaceRoom;
  active?: boolean;
}

export function PalacePathVisualizer({ path, active = true }: PalacePathVisualizerProps) {
  if (!path) return null;

  return (
    <div className={cn(
      "relative p-6 rounded-xl border overflow-hidden",
      active ? "bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 border-violet-500/20" : "bg-muted/30 border-muted"
    )}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
          <MapPin className="w-5 h-5" />
          <span className="font-bold text-sm tracking-wide uppercase">Phototheology Path</span>
        </div>

        {/* Path Flow */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
          {/* Floor Node */}
          <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm p-3 rounded-lg border shadow-sm min-w-[140px]">
            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 font-bold text-xs">
              {path.floor.split(' ')[0]}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Floor</span>
              <span className="font-medium text-foreground">{path.floor.replace(/^\d+st |^\d+nd |^\d+rd |^\d+th /, '').split('-')[0]}</span>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90 sm:rotate-0 mx-auto sm:mx-0" />

          {/* Rooms Node */}
          <div className="flex flex-wrap gap-2 flex-1 justify-center sm:justify-start">
            {path.rooms.map((room, idx) => (
              <span 
                key={idx}
                className="px-3 py-1.5 rounded-md bg-violet-500 text-white text-xs font-medium shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 opacity-70" />
                {room}
              </span>
            ))}
          </div>
        </div>

        {/* Principle */}
        {path.principle && (
          <div className="mt-4 pt-4 border-t border-violet-500/10">
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              <span className="text-violet-500 font-semibold not-italic mr-2">Key Principle:</span>
              "{path.principle}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
