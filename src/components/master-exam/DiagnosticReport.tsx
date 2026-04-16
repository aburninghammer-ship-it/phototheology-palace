import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Target, AlertTriangle, TrendingUp, Calendar, Zap } from "lucide-react";
import { motion } from "framer-motion";

export interface ErrorPattern {
  pattern: string;
  frequency: number;
  examples: string[];
  recommendation: string;
}

export interface DiagnosticData {
  competency_level: string;
  competency_label: string;
  strength_analysis: string;
  weakness_analysis: string;
  error_patterns: ErrorPattern[];
  weekly_plan: WeeklyPlanDay[];
  focus_areas: string[];
}

export interface WeeklyPlanDay {
  day: string;
  focus: string;
  activities: string[];
  time_minutes: number;
}

interface DiagnosticReportProps {
  diagnostic: DiagnosticData;
  onGenerateWeeklyPlan: () => void;
  isGeneratingPlan: boolean;
}

const levelColors: Record<string, string> = {
  "Beginner Explorer": "text-blue-500",
  "Developing Builder": "text-cyan-500",
  "Strong Connector": "text-green-500",
  "Advanced Interpreter": "text-yellow-500",
  "PT Guide": "text-orange-500",
  "PT Strategist": "text-primary",
};

export function DiagnosticReport({
  diagnostic,
  onGenerateWeeklyPlan,
  isGeneratingPlan,
}: DiagnosticReportProps) {
  return (
    <div className="space-y-4">
      {/* Competency Level */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card variant="glass">
          <CardContent className="p-5 text-center space-y-2">
            <Brain className="h-8 w-8 mx-auto text-primary" />
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              Competency Level
            </p>
            <h3
              className={`text-2xl font-bold ${
                levelColors[diagnostic.competency_label] || "text-primary"
              }`}
            >
              {diagnostic.competency_label}
            </h3>
          </CardContent>
        </Card>
      </motion.div>

      {/* Strengths */}
      <Card variant="glass">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Strength Analysis
            </h4>
          </div>
          <p className="text-sm">{diagnostic.strength_analysis}</p>
        </CardContent>
      </Card>

      {/* Weaknesses */}
      <Card variant="glass">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-500" />
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Weakness Analysis
            </h4>
          </div>
          <p className="text-sm">{diagnostic.weakness_analysis}</p>
        </CardContent>
      </Card>

      {/* Error Patterns */}
      {diagnostic.error_patterns?.length > 0 && (
        <Card variant="glass">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Error Patterns Detected
              </h4>
            </div>
            <div className="space-y-3">
              {diagnostic.error_patterns.map((ep, i) => (
                <div key={i} className="border border-border/50 rounded-lg p-3 space-y-1">
                  <p className="text-sm font-medium">{ep.pattern}</p>
                  <p className="text-xs text-muted-foreground">
                    {ep.recommendation}
                  </p>
                  <Badge variant="outline" className="text-[10px]">
                    Frequency: {ep.frequency}x
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Plan */}
      {diagnostic.weekly_plan?.length > 0 ? (
        <Card variant="glass">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                7-Day Growth Plan
              </h4>
            </div>
            <div className="space-y-2">
              {diagnostic.weekly_plan.map((day, i) => (
                <div key={i} className="border border-border/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{day.day}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {day.time_minutes} min
                    </Badge>
                  </div>
                  <p className="text-sm text-primary/80 font-medium mb-1">
                    {day.focus}
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {day.activities.map((act, j) => (
                      <li key={j}>• {act}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card variant="glass">
          <CardContent className="p-5 text-center space-y-3">
            <Zap className="h-8 w-8 mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">
              Generate a personalized 7-day study plan based on your results
            </p>
            <Button
              onClick={onGenerateWeeklyPlan}
              disabled={isGeneratingPlan}
              className="gradient-palace"
            >
              {isGeneratingPlan ? "Generating..." : "Generate Weekly Plan"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
