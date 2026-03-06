import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Target, Shield, Zap, Clock, Sparkles, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { GideonWaterRations } from "./GideonWaterRations";
import { GideonSeasonLeaderboard } from "./GideonSeasonLeaderboard";
import { cn } from "@/lib/utils";
import type { GideonTournament, GideonTournamentPlayer, LeaderboardEntry, GideonQuestion } from "@/types/gideon";

interface GideonResultsProps {
  tournament: GideonTournament;
  tournamentPlayers: GideonTournamentPlayer[];
  myPlayer: GideonTournamentPlayer | null;
  accessTier: "full_suite" | "friday_pass";
  onPlayAgain: () => void;
}

const podiumIcons = [
  <Trophy className="w-8 h-8 text-yellow-500" />,
  <Medal className="w-7 h-7 text-gray-400" />,
  <Award className="w-6 h-6 text-amber-700" />,
];

const podiumColors = [
  "border-yellow-500/50 bg-yellow-500/5",
  "border-gray-400/50 bg-gray-400/5",
  "border-amber-700/50 bg-amber-700/5",
];

export function GideonResults({
  tournament,
  tournamentPlayers,
  myPlayer,
  accessTier,
  onPlayAgain,
}: GideonResultsProps) {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const leaderboard = (tournament.final_leaderboard || []) as LeaderboardEntry[];
  const questions = tournament.questions_data as GideonQuestion[];

  // Podium (top 3)
  const podium = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const myEntry = leaderboard.find((e) => e.user_id === myPlayer?.user_id);

  return (
    <div className="space-y-6">
      {/* Winner Banner */}
      {podium[0] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-yellow-500/50 bg-gradient-to-b from-yellow-500/10 to-transparent">
            <CardContent className="pt-6 text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-1">{podium[0].display_name}</h2>
              <p className="text-3xl font-mono font-bold text-yellow-500">
                {Math.round(podium[0].total_score)} pts
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Tournament Champion
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Podium */}
      <div className="grid grid-cols-3 gap-2">
        {podium.map((entry, i) => (
          <motion.div
            key={entry.user_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <Card className={cn("text-center", podiumColors[i])}>
              <CardContent className="pt-4 pb-3">
                <div className="mb-2">{podiumIcons[i]}</div>
                <p className="font-bold text-sm truncate">{entry.display_name}</p>
                <p className="text-lg font-mono font-bold">{Math.round(entry.total_score)}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(entry.accuracy_pct)}% accuracy
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* My Result */}
      {myEntry && myEntry.rank > 3 && (
        <Card className="border-amber-500/30">
          <CardContent className="pt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your Result</p>
              <p className="font-bold">#{myEntry.rank} — {Math.round(myEntry.total_score)} pts</p>
            </div>
            <div className="text-right">
              <p className="text-sm">{Math.round(myEntry.accuracy_pct)}% accuracy</p>
              <GideonWaterRations rations={myEntry.water_rations_remaining} size="sm" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Full Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {leaderboard.map((entry) => {
            const isExpanded = expandedPlayer === entry.user_id;
            const isMe = entry.user_id === myPlayer?.user_id;

            return (
              <div key={entry.user_id}>
                <div
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-muted/80 transition-colors",
                    isMe ? "bg-amber-500/10 border border-amber-500/30" : "bg-muted/50",
                    entry.is_eliminated && "opacity-70"
                  )}
                  onClick={() => setExpandedPlayer(isExpanded ? null : entry.user_id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-muted-foreground w-6">
                      #{entry.rank}
                    </span>
                    <span className={cn("font-medium", entry.is_eliminated && "line-through")}>
                      {entry.display_name}
                    </span>
                    {entry.is_eliminated && (
                      <Badge variant="outline" className="text-xs text-red-400">Camp</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold">{Math.round(entry.total_score)}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Score Breakdown */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="ml-9 mt-1 p-3 rounded-lg bg-muted/30 space-y-1 text-sm"
                  >
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Accuracy</span>
                      <span>{Math.round(entry.accuracy_pct)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Survival Depth</span>
                      <span>{entry.survival_depth}/{tournament.max_rounds} (x{(1 + entry.survival_depth / tournament.max_rounds).toFixed(1)})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Early Lock Bonus</span>
                      <span>+{entry.early_lock_bonus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> High Risk Bonus</span>
                      <span>+{entry.high_risk_bonus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Synthesis</span>
                      <span>+{Math.round(entry.synthesis_score)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-1 mt-1">
                      <span>Total</span>
                      <span>{Math.round(entry.total_score)}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Season Leaderboard */}
      {accessTier === "full_suite" && (
        <GideonSeasonLeaderboard />
      )}
      {accessTier === "friday_pass" && (
        <p className="text-sm text-center text-amber-500">
          Upgrade to Full Suite for persistent season stats and rankings.
        </p>
      )}

      {/* Play Again */}
      <Button className="w-full" onClick={onPlayAgain}>
        <RotateCcw className="w-4 h-4 mr-2" />
        Play Again
      </Button>
    </div>
  );
}
