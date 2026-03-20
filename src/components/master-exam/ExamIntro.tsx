import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExamAttempt } from "@/hooks/useMasterExam";
import { Trophy, Clock, Play, RotateCcw, GraduationCap, Compass, Brain, Target, TrendingUp, Fingerprint, Zap, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

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

const purposeCards = [
  {
    icon: Brain,
    title: "Diagnose Your Understanding",
    description: "Every exam reveals what you truly understand, what you only recognize, and where your blind spots are. It's not about a grade — it's about growth.",
  },
  {
    icon: Fingerprint,
    title: "Never the Same Twice",
    description: "Each exam is AI-generated fresh. Different questions, different angles, different scenarios. You can never memorize answers — you must internalize the principles.",
  },
  {
    icon: Target,
    title: "Pinpoint Weak Rooms",
    description: "After grading, Jeeves analyzes your error patterns — not just what you got wrong, but why. Confusing symbolism with freestyle? Skipping Christ-centered reading? You'll know.",
  },
  {
    icon: TrendingUp,
    title: "Get a Weekly Growth Plan",
    description: "Your results feed a personalized 7-day study prescription. Targeted drills, corrective exercises, and a mini-retest — all designed around your specific weaknesses.",
  },
];

export function ExamIntro({
  history,
  bestScore,
  inProgressExam,
  loading,
  onStart,
  onResume,
  onShowTypeSelector,
}: ExamIntroProps) {
  const completedAttempts = history.filter((h) => h.status === "completed");

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Hero */}
      <Card variant="glass" className="overflow-hidden">
        <CardContent className="p-6 md:p-10 text-center space-y-5">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            PT Assessment System
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            This isn't a quiz. It's a <span className="text-foreground font-medium">diagnostic engine</span> that
            tests how you think across the entire Phototheology Palace — every floor, every room,
            every principle. Then it tells you exactly where to sharpen your sword.
          </p>
          <p className="text-xs md:text-sm text-muted-foreground/80 max-w-lg mx-auto italic">
            Teach → Test → Diagnose → Prescribe → Retest. That's how formation works.
          </p>
        </CardContent>
      </Card>

      {/* How It Works */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
          How It Strengthens You
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {purposeCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card variant="glass" className="h-full">
                <CardContent className="p-4 md:p-5 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <card.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="font-semibold text-sm">{card.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Exam Types Overview */}
      <Card variant="glass">
        <CardContent className="p-5 md:p-6 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Available Assessments
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
              <Zap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Master Exam</p>
                <p className="text-xs text-muted-foreground">
                  50 questions spanning all 8 floors. Rooms, principles, connections, prophecy, sanctuary, Christ types, patterns — everything. The full stress test.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
              <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Foundation Diagnostic</p>
                <p className="text-xs text-muted-foreground">
                  Tests your framework knowledge — floors, room names, room purposes, PT codes, and the flow of the system. "Do you understand the map?"
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
              <Target className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Prophecy & Sanctuary</p>
                <p className="text-xs text-muted-foreground">
                  Tests prophetic structure, sanctuary mapping, the Three Heavens framework, the 8 Cycles, Daniel/Revelation patterns, and the Blue Room.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card variant="glass">
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
              {inProgressExam ? "Start New Master Exam" : "Begin Master Exam"}
            </Button>
            {onShowTypeSelector && (
              <Button
                size="lg"
                variant="outline"
                className="h-12 text-base"
                onClick={onShowTypeSelector}
              >
                <Compass className="h-5 w-5 mr-2" />
                Diagnostic Exams
              </Button>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-sm mt-4">
            <Badge variant="outline" className="px-3 py-1">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              90 Minutes
            </Badge>
            <Badge variant="outline" className="px-3 py-1">50 Questions</Badge>
            <Badge variant="outline" className="px-3 py-1">AI Graded</Badge>
            <Badge variant="outline" className="px-3 py-1">Never the Same Twice</Badge>
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
