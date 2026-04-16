import { Headphones, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAudioExploration } from "@/hooks/useAudioExploration";

export function AudioExplorerBadge() {
  const { totalRoomsListened, totalRooms, getBadge, totalTabsListened } = useAudioExploration();
  const badge = getBadge();
  const percentage = Math.round((totalRoomsListened / totalRooms) * 100);

  if (totalRoomsListened === 0 && totalTabsListened === 0) return null;

  const tierColors: Record<string, string> = {
    starter: "bg-muted text-muted-foreground",
    bronze: "bg-amber-900/20 text-amber-700 border-amber-700/30",
    silver: "bg-slate-400/20 text-slate-300 border-slate-400/30",
    gold: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Headphones className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Audio Explorer</span>
        </div>
        {badge && (
          <Badge variant="outline" className={`text-[10px] ${tierColors[badge.tier] || ""}`}>
            {badge.icon} {badge.label}
          </Badge>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Room Demos</span>
          <span>{totalRoomsListened}/{totalRooms}</span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>

      {totalTabsListened > 0 && (
        <p className="text-[10px] text-muted-foreground">
          {totalTabsListened} tab activation{totalTabsListened !== 1 ? "s" : ""} heard
        </p>
      )}

      {!badge && (
        <p className="text-[10px] text-muted-foreground">
          Listen to 3 room demos to earn your first badge!
        </p>
      )}
    </div>
  );
}
