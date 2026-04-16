import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Lock, CheckCircle2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const FLOOR_NAMES = [
  "Furnishing",
  "Investigation",
  "Freestyle",
  "Next Level",
  "Vision",
  "Three Heavens",
  "Spiritual",
  "Master",
];

const FLOOR_COLORS = [
  "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  "from-red-500/20 to-red-600/10 border-red-500/30",
  "from-amber-500/20 to-amber-600/10 border-amber-500/30",
  "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
  "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30",
  "from-pink-500/20 to-pink-600/10 border-pink-500/30",
  "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
];

interface MemberPalaceProgressProps {
  floorProgress: any[];
  currentFloor: number;
}

export function MemberPalaceProgress({ floorProgress, currentFloor }: MemberPalaceProgressProps) {
  return (
    <Card variant="glass">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          Palace Journey — Floor {currentFloor}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {FLOOR_NAMES.map((name, i) => {
            const floor = floorProgress.find((f: any) => f.floor_number === i + 1);
            const isCompleted = !!floor?.floor_completed_at;
            const isUnlocked = !!floor?.is_unlocked;
            const isCurrent = i + 1 === currentFloor;
            const progress = floor ? Math.round((floor.rooms_completed / Math.max(floor.rooms_required, 1)) * 100) : 0;

            return (
              <div
                key={i}
                className={cn(
                  "relative flex flex-col items-center p-2 rounded-lg border text-center transition-all",
                  isCompleted
                    ? `bg-gradient-to-b ${FLOOR_COLORS[i]} ring-1 ring-primary/20`
                    : isUnlocked
                    ? `bg-gradient-to-b ${FLOOR_COLORS[i]} opacity-80`
                    : "bg-muted/30 border-border/30 opacity-40"
                )}
              >
                {isCurrent && (
                  <Star className="h-3 w-3 text-amber-500 absolute -top-1 -right-1 fill-amber-500" />
                )}
                <div className="text-lg font-bold">{i + 1}</div>
                <div className="text-[9px] leading-tight text-muted-foreground mt-0.5">{name}</div>
                {isCompleted ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-1" />
                ) : isUnlocked ? (
                  <div className="w-full bg-muted/50 rounded-full h-1 mt-1.5">
                    <div
                      className="bg-primary h-1 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ) : (
                  <Lock className="h-3 w-3 text-muted-foreground mt-1" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
