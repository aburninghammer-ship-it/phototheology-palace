import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { JudgeScore, ChefTeam } from "@/hooks/useChefMultiplayer";

interface Props {
  scores: Record<string, JudgeScore>;
  teams: ChefTeam[];
  eliminatedTeamId?: string;
}

const JUDGES = [
  { name: "Judge Solomon", emoji: "👑", criterion: "accuracy", label: "Biblical Accuracy", color: "text-blue-600" },
  { name: "Judge Miriam", emoji: "🎨", criterion: "creativity", label: "Creativity & Connections", color: "text-purple-600" },
  { name: "Judge Paul", emoji: "✝️", criterion: "christCenter", label: "Christ-Centeredness", color: "text-red-600" },
];

export function ChefJudgingPanel({ scores, teams, eliminatedTeamId }: Props) {
  // Sort teams by total score descending
  const sortedTeams = [...teams]
    .filter(t => scores[t.id])
    .sort((a, b) => (scores[b.id]?.total ?? 0) - (scores[a.id]?.total ?? 0));

  return (
    <div className="space-y-6">
      {/* Judges Header */}
      <div className="flex justify-center gap-6">
        {JUDGES.map(j => (
          <div key={j.name} className="text-center">
            <div className="text-3xl mb-1">{j.emoji}</div>
            <p className="text-xs font-bold">{j.name}</p>
            <p className="text-[10px] text-muted-foreground">{j.label}</p>
          </div>
        ))}
      </div>

      {/* Team Scores */}
      <div className="space-y-4">
        {sortedTeams.map((team, rank) => {
          const score = scores[team.id];
          if (!score) return null;
          const isEliminated = team.id === eliminatedTeamId;

          return (
            <Card
              key={team.id}
              className={`transition-all ${
                isEliminated 
                  ? "border-red-400 bg-red-50/50 dark:bg-red-950/20 opacity-75" 
                  : rank === 0 
                    ? "border-yellow-400 bg-yellow-50/30 dark:bg-yellow-950/10" 
                    : ""
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>{team.emoji}</span>
                    <span>{team.name}</span>
                    {rank === 0 && !isEliminated && <Badge className="bg-yellow-500">🏆 Safe</Badge>}
                    {isEliminated && <Badge variant="destructive">❌ Eliminated</Badge>}
                  </CardTitle>
                  <span className="text-2xl font-bold">{score.total}/40</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Individual judge scores */}
                <div className="grid grid-cols-3 gap-3">
                  {JUDGES.map(j => {
                    const val = score[j.criterion as keyof JudgeScore] as number;
                    return (
                      <div key={j.criterion} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className={j.color}>{j.emoji}</span>
                          <span className="font-bold">{val}/10</span>
                        </div>
                        <Progress value={val * 10} className="h-2" />
                      </div>
                    );
                  })}
                </div>
                {/* Completeness */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>📋 Completeness</span>
                    <span className="font-bold">{score.completeness}/10</span>
                  </div>
                  <Progress value={score.completeness * 10} className="h-2" />
                </div>
                {/* Feedback */}
                {score.feedback && (
                  <p className="text-sm text-muted-foreground italic border-l-2 border-orange-300 pl-3 mt-2">
                    {score.feedback}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
