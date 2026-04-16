import { Badge } from "@/components/ui/badge";
import { GideonWaterRations } from "./GideonWaterRations";
import { Check, X, Skull, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GideonTournamentPlayer } from "@/types/gideon";

interface GideonPlayerStripProps {
  players: GideonTournamentPlayer[];
  currentQuestionIndex: number;
  myUserId?: string;
}

export function GideonPlayerStrip({ players, currentQuestionIndex, myUserId }: GideonPlayerStripProps) {
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.is_eliminated !== b.is_eliminated) return a.is_eliminated ? 1 : -1;
    return (b.total_score || 0) - (a.total_score || 0);
  });

  return (
    <div className="flex flex-wrap gap-2">
      {sortedPlayers.map((player) => {
        const hasAnsweredCurrent = player.answers?.some(
          (a: any) => a.question_index === currentQuestionIndex
        );
        const lastAnswer = player.answers?.find(
          (a: any) => a.question_index === currentQuestionIndex
        );

        return (
          <div
            key={player.id}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-all",
              player.user_id === myUserId && "ring-2 ring-amber-500/50",
              player.is_eliminated
                ? "bg-red-500/10 border-red-500/20 text-muted-foreground"
                : hasAnsweredCurrent
                  ? "bg-green-500/10 border-green-500/20"
                  : "bg-muted/50 border-muted"
            )}
          >
            {player.is_eliminated ? (
              <Eye className="w-3 h-3 text-muted-foreground" />
            ) : hasAnsweredCurrent ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : null}
            <span className={cn(
              "font-medium truncate max-w-[80px]",
              player.is_eliminated && "line-through"
            )}>
              {player.display_name}
            </span>
            {!player.is_eliminated && (
              <GideonWaterRations rations={player.water_rations} size="sm" />
            )}
            {player.is_eliminated && (
              <Badge variant="outline" className="text-xs text-red-400 border-red-400/30">
                Camp
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}
