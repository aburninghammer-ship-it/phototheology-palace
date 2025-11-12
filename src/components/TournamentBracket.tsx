import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Crown } from "lucide-react";

interface Match {
  id: string;
  round_number: number;
  match_number: number;
  player1_id: string | null;
  player2_id: string | null;
  winner_id: string | null;
  player1_score: number;
  player2_score: number;
  status: string;
  player1?: { display_name: string; avatar_url: string };
  player2?: { display_name: string; avatar_url: string };
}

interface TournamentBracketProps {
  matches: Match[];
  totalRounds: number;
}

export function TournamentBracket({ matches, totalRounds }: TournamentBracketProps) {
  const getRoundMatches = (roundNumber: number) => {
    return matches.filter((m) => m.round_number === roundNumber);
  };

  const getRoundName = (round: number, total: number) => {
    if (round === total) return "Finals";
    if (round === total - 1) return "Semi-Finals";
    if (round === total - 2) return "Quarter-Finals";
    return `Round ${round}`;
  };

  const renderPlayer = (match: Match, isPlayer1: boolean) => {
    const player = isPlayer1 ? match.player1 : match.player2;
    const playerId = isPlayer1 ? match.player1_id : match.player2_id;
    const score = isPlayer1 ? match.player1_score : match.player2_score;
    const isWinner = match.winner_id === playerId;

    if (!playerId) {
      return (
        <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
          <div className="text-sm text-muted-foreground">TBD</div>
        </div>
      );
    }

    return (
      <div
        className={`flex items-center justify-between gap-2 p-2 rounded transition-colors ${
          isWinner
            ? "bg-primary/10 border-2 border-primary"
            : "bg-background border border-border"
        }`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Avatar className="w-6 h-6">
            <AvatarImage src={player?.avatar_url} />
            <AvatarFallback>
              {player?.display_name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium truncate">
            {player?.display_name || "Player"}
          </span>
          {isWinner && <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
        </div>
        <div className="text-sm font-bold">{score}</div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => {
        const roundMatches = getRoundMatches(round);
        return (
          <div key={round} className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold">{getRoundName(round, totalRounds)}</h3>
              <Badge variant="secondary">{roundMatches.length} matches</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roundMatches.map((match) => (
                <Card key={match.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">
                      Match {match.match_number}
                    </span>
                    <Badge
                      variant={
                        match.status === "completed"
                          ? "default"
                          : match.status === "in_progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {match.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {renderPlayer(match, true)}
                    <div className="text-center text-xs text-muted-foreground">vs</div>
                    {renderPlayer(match, false)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
