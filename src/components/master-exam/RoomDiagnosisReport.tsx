import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Brain, Target, AlertTriangle, TrendingUp, Calendar,
  Zap, Shield, ArrowRight, Star, Trophy,
} from "lucide-react";

interface WeaknessMapEntry {
  score: number;
  verdict: string;
}

interface ErrorPattern {
  pattern: string;
  frequency: number;
  examples: string[];
  recommendation: string;
}

interface WeeklyPlanDay {
  day: string;
  focus: string;
  activities: string[];
  time_minutes: number;
}

interface MasteryUpdate {
  room_code: string;
  floor_number: number;
  new_level: number;
  xp_earned: number;
  is_perfect: boolean;
}

export interface RoomDiagnosticData {
  competency_level: string;
  competency_label: string;
  mastery_level?: number;
  mastery_title?: string;
  room_score_summary?: string;
  strength_analysis: string;
  weakness_analysis: string;
  error_patterns: ErrorPattern[];
  weakness_map?: Record<string, WeaknessMapEntry>;
  weekly_plan: WeeklyPlanDay[];
  focus_areas: string[];
  next_room_recommendation?: string;
  mastery_update?: MasteryUpdate;
}

const MASTERY_TITLES: Record<number, { label: string; color: string; icon: typeof Star }> = {
  1: { label: "Novice", color: "text-zinc-400", icon: Star },
  2: { label: "Student", color: "text-blue-400", icon: Star },
  3: { label: "Builder", color: "text-green-400", icon: Star },
  4: { label: "Teacher", color: "text-amber-400", icon: Trophy },
  5: { label: "Master", color: "text-primary", icon: Trophy },
};

const CATEGORY_LABELS: Record<string, string> = {
  room_application: "Application",
  room_distinction: "Distinction",
  room_depth: "Depth",
  room_integration: "Integration",
};

export function RoomDiagnosisReport({ diagnostic, roomName }: { diagnostic: RoomDiagnosticData; roomName?: string }) {
  const masteryLevel = diagnostic.mastery_level || diagnostic.mastery_update?.new_level || 1;
  const masteryConfig = MASTERY_TITLES[masteryLevel] || MASTERY_TITLES[1];
  const MasteryIcon = masteryConfig.icon;

  return (
    <div className="space-y-4">
      {/* Mastery Level Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card variant="glass" className="overflow-hidden">
          <CardContent className="p-5 text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <MasteryIcon
                  key={i}
                  className={`h-5 w-5 transition-colors ${
                    i < masteryLevel ? masteryConfig.color : "text-muted-foreground/20"
                  }`}
                  fill={i < masteryLevel ? "currentColor" : "none"}
                />
              ))}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {roomName || "Room"} Mastery
              </p>
              <h3 className={`text-2xl font-bold ${masteryConfig.color}`}>
                Level {masteryLevel}: {diagnostic.mastery_title || masteryConfig.label}
              </h3>
            </div>
            {diagnostic.mastery_update && (
              <Badge variant="outline" className="gap-1 text-xs">
                <Zap className="h-3 w-3" />
                +{diagnostic.mastery_update.xp_earned} XP earned
                {diagnostic.mastery_update.is_perfect && " • Perfect Score! 🔥"}
              </Badge>
            )}
            {diagnostic.room_score_summary && (
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {diagnostic.room_score_summary}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Weakness Map */}
      {diagnostic.weakness_map && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card variant="glass">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Skill Breakdown
                </h4>
              </div>
              <div className="space-y-3">
                {Object.entries(diagnostic.weakness_map).map(([key, entry]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{CATEGORY_LABELS[key] || key}</span>
                      <span className={
                        entry.score >= 70 ? "text-green-500" :
                        entry.score >= 50 ? "text-yellow-500" : "text-red-500"
                      }>
                        {entry.score}%
                      </span>
                    </div>
                    <Progress value={entry.score} className="h-2" />
                    <p className="text-xs text-muted-foreground">{entry.verdict}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <Card variant="glass" className="h-full">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Strengths</h4>
              </div>
              <p className="text-sm leading-relaxed">{diagnostic.strength_analysis}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card variant="glass" className="h-full">
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Growth Areas</h4>
              </div>
              <p className="text-sm leading-relaxed">{diagnostic.weakness_analysis}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Error Patterns */}
      {diagnostic.error_patterns?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card variant="glass">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Error Patterns ({diagnostic.error_patterns.length})
                </h4>
              </div>
              <div className="space-y-3">
                {diagnostic.error_patterns.map((ep, i) => (
                  <div key={i} className="rounded-lg bg-muted/30 p-3 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{ep.pattern}</p>
                      <Badge variant="outline" className="text-xs shrink-0">×{ep.frequency}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground italic">"{ep.examples[0]}"</p>
                    <div className="flex items-start gap-1.5 mt-1">
                      <ArrowRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                      <p className="text-xs text-primary">{ep.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 7-Day Study Plan */}
      {diagnostic.weekly_plan?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card variant="glass">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  7-Day Mastery Plan
                </h4>
              </div>
              <div className="space-y-2">
                {diagnostic.weekly_plan.map((day, i) => (
                  <div key={i} className="flex gap-3 rounded-lg bg-muted/20 p-3">
                    <div className="shrink-0 w-16 text-center">
                      <p className="text-xs font-bold uppercase text-primary">{day.day}</p>
                      <p className="text-[10px] text-muted-foreground">{day.time_minutes}min</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{day.focus}</p>
                      <ul className="mt-1 space-y-0.5">
                        {day.activities.map((act, j) => (
                          <li key={j} className="text-xs text-muted-foreground flex items-start gap-1">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Next Room Recommendation */}
      {diagnostic.next_room_recommendation && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card variant="glass" className="border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Brain className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Jeeves Recommends Next</p>
                <p className="text-sm font-medium">{diagnostic.next_room_recommendation}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}