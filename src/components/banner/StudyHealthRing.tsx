import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StudyHealthRingProps {
  roomsExplored: number;
  chaptersRead: number;
  currentStreak: number;
  totalXp: number;
  gemsCount: number;
  children: React.ReactNode;
}

type HealthLevel = "green" | "yellow" | "red";

function getHealthLevel(roomsExplored: number, chaptersRead: number, currentStreak: number, totalXp: number, gemsCount: number): { level: HealthLevel; label: string } {
  // Score based on balance across activities
  let activityCount = 0;
  if (roomsExplored > 0) activityCount++;
  if (chaptersRead > 0) activityCount++;
  if (currentStreak > 0) activityCount++;
  if (gemsCount > 0) activityCount++;

  if (currentStreak === 0 && totalXp < 10) {
    return { level: "red", label: "Inactive — your Palace misses you" };
  }
  if (activityCount >= 3 && currentStreak >= 3) {
    return { level: "green", label: "Balanced study across rooms" };
  }
  if (activityCount >= 2 || currentStreak >= 1) {
    return { level: "yellow", label: "Study skewed — explore more rooms" };
  }
  return { level: "red", label: "Inactive — start studying to light up" };
}

const RING_COLORS: Record<HealthLevel, string> = {
  green: "ring-emerald-400/70 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
  yellow: "ring-amber-400/70 shadow-[0_0_10px_rgba(245,158,11,0.4)]",
  red: "ring-red-400/50 shadow-[0_0_8px_rgba(239,68,68,0.3)]",
};

export function StudyHealthRing({ roomsExplored, chaptersRead, currentStreak, totalXp, gemsCount, children }: StudyHealthRingProps) {
  const { level, label } = getHealthLevel(roomsExplored, chaptersRead, currentStreak, totalXp, gemsCount);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("rounded-full ring-2 transition-all duration-500", RING_COLORS[level])}>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs max-w-[200px]">
          <div className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full", {
              "bg-emerald-400": level === "green",
              "bg-amber-400": level === "yellow",
              "bg-red-400": level === "red",
            })} />
            {label}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
