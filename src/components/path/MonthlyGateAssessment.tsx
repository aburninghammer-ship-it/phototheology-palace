import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePath, PATH_INFO, PathType } from "@/hooks/usePath";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Trophy, Clock, Brain, Sparkles } from "lucide-react";

interface AssessmentQuestion {
  id: string;
  type: "multiple_choice" | "reflection" | "application";
  question: string;
  options?: string[];
  correctAnswer?: number;
  pathSpecific: boolean;
}

// Generate assessment questions based on path type and month
const getAssessmentQuestions = (pathType: PathType, month: number): AssessmentQuestion[] => {
  const baseQuestions: AssessmentQuestion[] = [
    {
      id: "q1",
      type: "multiple_choice",
      question: "What is the primary purpose of the Phototheology Palace method?",
      options: [
        "To memorize Bible verses quickly",
        "To see Christ in all Scripture through systematic study",
        "To learn Greek and Hebrew",
        "To become a Bible scholar"
      ],
      correctAnswer: 1,
      pathSpecific: false,
    },
    {
      id: "q2",
      type: "multiple_choice",
      question: "The Concentration Room (CR) focuses primarily on:",
      options: [
        "Memorizing verse locations",
        "Finding historical context",
        "Seeing Christ in every text",
        "Learning Bible geography"
      ],
      correctAnswer: 2,
      pathSpecific: false,
    },
  ];

  // Path-specific questions
  const pathQuestions: Record<PathType, AssessmentQuestion[]> = {
    visual: [
      {
        id: "v1",
        type: "reflection",
        question: "Describe a mental image you've created this month to remember a Bible story. How does visualization help you retain Scripture?",
        pathSpecific: true,
      },
      {
        id: "v2",
        type: "multiple_choice",
        question: "The 24FPS Room technique involves:",
        options: [
          "Reading 24 verses per session",
          "Creating one symbolic image per chapter",
          "Watching Bible videos",
          "Memorizing 24 chapters at once"
        ],
        correctAnswer: 1,
        pathSpecific: true,
      },
    ],
    analytical: [
      {
        id: "a1",
        type: "reflection",
        question: "What pattern or connection have you discovered this month between two seemingly unrelated Bible passages? Explain your analytical process.",
        pathSpecific: true,
      },
      {
        id: "a2",
        type: "multiple_choice",
        question: "The Patterns Room (PRm) helps identify:",
        options: [
          "Grammatical structures in Hebrew",
          "Recurring themes like 40 days, 3 days across Scripture",
          "Mathematical equations in prophecy",
          "Literary genres only"
        ],
        correctAnswer: 1,
        pathSpecific: true,
      },
    ],
    devotional: [
      {
        id: "d1",
        type: "reflection",
        question: "Share a moment this month where a Scripture passage personally convicted or comforted you. How did you respond in prayer?",
        pathSpecific: true,
      },
      {
        id: "d2",
        type: "multiple_choice",
        question: "The Fruit Room tests interpretations by:",
        options: [
          "Checking if they produce Christlike character",
          "Counting how many verses support them",
          "Verifying with commentaries only",
          "Using original language analysis"
        ],
        correctAnswer: 0,
        pathSpecific: true,
      },
    ],
    warrior: [
      {
        id: "w1",
        type: "application",
        question: "In 60 seconds, list as many types (OT shadows of Christ) as you can recall from your study this month.",
        pathSpecific: true,
      },
      {
        id: "w2",
        type: "multiple_choice",
        question: "The Speed Room develops:",
        options: [
          "Slow, meditative reading",
          "Rapid application and quick recall reflexes",
          "Writing speed for journaling",
          "Fast typing for note-taking"
        ],
        correctAnswer: 1,
        pathSpecific: true,
      },
    ],
  };

  return [...baseQuestions, ...pathQuestions[pathType]];
};

interface MonthlyGateAssessmentProps {
  onComplete: (passed: boolean) => void;
  onCancel: () => void;
}

export function MonthlyGateAssessment({ onComplete, onCancel }: MonthlyGateAssessmentProps) {
  const { activePath } = usePath();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());

  if (!activePath) return null;

  const pathType = activePath.path_type as PathType;
  const pathData = PATH_INFO[pathType];
  const questions = getAssessmentQuestions(pathType, activePath.current_month);

  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    let correct = 0;
    let total = 0;

    questions.forEach(q => {
      if (q.type === "multiple_choice" && q.correctAnswer !== undefined) {
        total++;
        if (answers[q.id] === q.correctAnswer) {
          correct++;
        }
      }
    });

    // Reflections count as partial credit if answered
    questions.forEach(q => {
      if ((q.type === "reflection" || q.type === "application") && answers[q.id]) {
        const answerText = answers[q.id] as string;
        if (answerText.length > 50) {
          correct += 0.5;
          total += 1;
        }
      }
    });

    return total > 0 ? (correct / total) * 100 : 0;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const finalScore = calculateScore();
    setScore(finalScore);
    const passed = finalScore >= 70;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const timeSpent = Math.round((Date.now() - startTime) / 1000);

      // Update or create gate record
      const { data: existingGate } = await supabase
        .from("monthly_gates")
        .select("*")
        .eq("user_id", user.id)
        .eq("path_type", activePath.path_type)
        .eq("year", activePath.current_year)
        .eq("month", activePath.current_month)
        .maybeSingle();

      if (existingGate) {
        await supabase
          .from("monthly_gates")
          .update({
            attempts: existingGate.attempts + 1,
            passed,
            score: finalScore,
            time_spent_seconds: timeSpent,
            passed_at: passed ? new Date().toISOString() : null,
          })
          .eq("id", existingGate.id);
      } else {
        await supabase
          .from("monthly_gates")
          .insert({
            user_id: user.id,
            path_type: activePath.path_type,
            year: activePath.current_year,
            month: activePath.current_month,
            attempts: 1,
            passed,
            score: finalScore,
            time_spent_seconds: timeSpent,
            passed_at: passed ? new Date().toISOString() : null,
          });
      }

      // If passed, advance to next month
      if (passed) {
        let newMonth = activePath.current_month + 1;
        let newQuarter = activePath.current_quarter;
        let newYear = activePath.current_year;

        if (newMonth > 3) {
          newMonth = 1;
          newQuarter++;
        }
        if (newQuarter > 4) {
          newQuarter = 1;
          newYear++;
        }

        // Check if path is complete (2 years = 24 months)
        const monthsCompleted = (newYear - 1) * 12 + (newQuarter - 1) * 3 + newMonth;
        
        if (monthsCompleted > 24) {
          // Path complete!
          await supabase
            .from("user_paths")
            .update({
              completed_at: new Date().toISOString(),
              is_active: false,
            })
            .eq("id", activePath.id);

          // Create path completion record
          await supabase
            .from("path_completions")
            .insert({
              user_id: user.id,
              path_type: activePath.path_type,
              started_at: activePath.started_at,
              completed_at: new Date().toISOString(),
              master_level: 1,
            });

          // Update profile master level
          const { data: profile } = await supabase
            .from("profiles")
            .select("path_master_level")
            .eq("id", user.id)
            .single();

          await supabase
            .from("profiles")
            .update({
              path_master_level: (profile?.path_master_level || 0) + 1,
            })
            .eq("id", user.id);

          toast({
            title: "🎉 Path Mastered!",
            description: `Congratulations! You've completed the ${pathData.name}!`,
          });
        } else {
          // Advance to next month
          await supabase
            .from("user_paths")
            .update({
              current_month: newMonth,
              current_quarter: newQuarter,
              current_year: newYear,
            })
            .eq("id", activePath.id);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["user-path"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-gate"] });
      queryClient.invalidateQueries({ queryKey: ["path-completions"] });

      setShowResults(true);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  if (showResults) {
    const passed = score >= 70;
    return (
      <Card className={`${pathData.bgColor} border ${pathData.borderColor}`}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {passed ? (
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <Trophy className="h-10 w-10 text-green-500" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-amber-500" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {passed ? "Gate Passed!" : "Keep Practicing"}
          </CardTitle>
          <CardDescription>
            {passed 
              ? `Excellent work! You scored ${score.toFixed(0)}% and can advance to the next month.`
              : `You scored ${score.toFixed(0)}%. You need 70% to pass. Review the material and try again.`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Badge variant={passed ? "default" : "secondary"} className="text-lg px-4 py-2">
              {score.toFixed(0)}%
            </Badge>
          </div>
          <Button 
            className="w-full" 
            onClick={() => onComplete(passed)}
          >
            {passed ? "Continue Your Journey" : "Return to Study"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${pathData.bgColor} border ${pathData.borderColor} max-w-2xl mx-auto`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Month {activePath.current_month} Gate
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <CardTitle className="mt-4 flex items-center gap-2">
          {currentQ.pathSpecific ? (
            <Sparkles className="h-5 w-5 text-primary" />
          ) : (
            <Brain className="h-5 w-5 text-muted-foreground" />
          )}
          {currentQ.pathSpecific && (
            <Badge variant="outline" className={pathData.borderColor}>
              {pathData.name} Question
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-medium">{currentQ.question}</p>

        {currentQ.type === "multiple_choice" && currentQ.options && (
          <RadioGroup
            value={answers[currentQ.id]?.toString()}
            onValueChange={(value) => handleAnswer(currentQ.id, parseInt(value))}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background/50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {(currentQ.type === "reflection" || currentQ.type === "application") && (
          <Textarea
            placeholder="Write your response here... (minimum 50 characters for credit)"
            value={(answers[currentQ.id] as string) || ""}
            onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
            rows={4}
            className="resize-none"
          />
        )}

        <div className="flex gap-3 pt-4">
          {currentQuestion > 0 && (
            <Button variant="outline" onClick={() => setCurrentQuestion(prev => prev - 1)}>
              Previous
            </Button>
          )}
          
          {currentQuestion < questions.length - 1 ? (
            <Button 
              className="flex-1"
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              disabled={answers[currentQ.id] === undefined}
            >
              Next
            </Button>
          ) : (
            <Button 
              className="flex-1"
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Assessment"}
            </Button>
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={onCancel} className="w-full">
          Cancel Assessment
        </Button>
      </CardContent>
    </Card>
  );
}
