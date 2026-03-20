import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExamAttempt } from "@/hooks/useMasterExam";
import { Trophy, Clock, Play, RotateCcw, GraduationCap, Compass } from "lucide-react";

interface ExamIntroProps {
  history: ExamAttempt[];
  bestScore: number;
  inProgressExam: ExamAttempt | undefined;
  loading: boolean;
  onStart: () => void;
  onResume: (examId: string) => void;
  onShowTypeSelector?: () => void;
}

function getLetterGrade(score: number): string {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 63) return "D";
  if (score >= 60) return "D-";
  return "F";
}

export function ExamIntro({
  history,
  bestScore,
  inProgressExam,
  loading,
  onStart,
  onResume,
}: ExamIntroProps) {
  const completedAttempts = history.filter((h) => h.status === "completed");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Hero */}
      <Card variant="glass" className="overflow-hidden">
        <CardContent className="p-6 md:p-8 text-center space-y-4">
          <div className="text-5xl md:text-6xl">
            <GraduationCap className="h-16 w-16 mx-auto text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Master Exam
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            50 AI-generated questions spanning every domain of the Phototheology Palace.
            Palace rooms, apologetics, gems, prophecy, sanctuary, Christ types, patterns, and more.
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <Badge variant="outline" className="px-3 py-1">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              90 Minutes
            </Badge>
            <Badge variant="outline" className="px-3 py-1">50 Questions</Badge>
            <Badge variant="outline" className="px-3 py-1">AI Graded</Badge>
            <Badge variant="outline" className="px-3 py-1">Never the Same Twice</Badge>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            {inProgressExam && (
              <Button
                size="lg"
                variant="outline"
                className="h-12 text-base"
                onClick={() => onResume(inProgressExam.id)}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Resume Exam
              </Button>
            )}
            <Button
              size="lg"
              className="h-12 text-base gradient-palace"
              onClick={onStart}
              disabled={loading}
            >
              <Play className="h-5 w-5 mr-2" />
              {inProgressExam ? "Start New Exam" : "Begin Exam"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Best Score */}
      {bestScore > 0 && (
        <Card variant="glass">
          <CardContent className="p-4 md:p-6 flex items-center gap-4">
            <div className="bg-primary/20 rounded-full p-3">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Best Score</p>
              <p className="text-2xl font-bold">
                {bestScore}% <span className="text-lg text-muted-foreground">({getLetterGrade(bestScore)})</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {completedAttempts.length > 0 && (
        <Card variant="glass">
          <CardContent className="p-4 md:p-6 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Past Attempts
            </h3>
            <div className="space-y-2">
              {completedAttempts.slice(0, 10).map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-mono">
                      #{attempt.attempt_number}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(attempt.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      {attempt.score}%
                    </span>
                    <Badge
                      className={
                        (attempt.score ?? 0) >= 80
                          ? "bg-green-500/20 text-green-700 dark:text-green-400"
                          : (attempt.score ?? 0) >= 60
                          ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                          : "bg-red-500/20 text-red-700 dark:text-red-400"
                      }
                    >
                      {getLetterGrade(attempt.score ?? 0)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
