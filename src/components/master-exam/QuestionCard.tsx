import { ExamQuestion, QuestionGradeResult } from "@/hooks/useMasterExam";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flag, Check, X, Loader2, Lock, MessageSquare, Award } from "lucide-react";
import { useState } from "react";

interface QuestionCardProps {
  question: ExamQuestion;
  answer: string;
  onAnswer: (answer: string) => void;
  isFlagged: boolean;
  onToggleFlag: () => void;
  questionNumber: number;
  grade?: QuestionGradeResult;
  isGrading?: boolean;
  isChallenging?: boolean;
  onLockIn?: () => void;
  onChallenge?: (reasoning: string) => void;
  onChangeAnswer?: () => void;
}

const categoryLabels: Record<string, string> = {
  palace_rooms: "Palace Rooms",
  apologetics: "Apologetics",
  gems_typology: "Gems & Typology",
  prophecy: "Prophecy",
  sanctuary: "Sanctuary",
  christ_types: "Christ Types",
  patterns_themes: "Patterns & Themes",
  memorization_courses: "Memorization & Courses",
};

const difficultyColors: Record<string, string> = {
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  master: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function QuestionCard({
  question,
  answer,
  onAnswer,
  isFlagged,
  onToggleFlag,
  questionNumber,
  grade,
  isGrading,
  isChallenging,
  onLockIn,
  onChallenge,
  onChangeAnswer,
}: QuestionCardProps) {
  const [challengeText, setChallengeText] = useState("");
  const [showChallenge, setShowChallenge] = useState(false);

  const isLocked = !!grade;
  const hasAnswer = !!answer?.trim();
  const canChallenge = grade && !grade.correct && grade.earned < 1 && !grade.challengeAccepted && !grade.challengeDenied;

  return (
    <Card variant="glass" className="w-full">
      <CardContent className="p-4 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-mono">
              Q{questionNumber}
            </Badge>
            <Badge variant="outline">
              {categoryLabels[question.category] || question.category}
            </Badge>
            <Badge className={difficultyColors[question.difficulty] || ""}>
              {question.difficulty}
            </Badge>
            <Badge variant="secondary" className="uppercase text-[10px]">
              {question.type === "mc" ? "Multiple Choice" : question.type === "tf" ? "True/False" : "Written"}
            </Badge>
            {isLocked && (
              <Badge variant="outline" className="text-[10px] gap-1">
                <Lock className="h-3 w-3" /> Locked In
              </Badge>
            )}
          </div>
          <Button
            variant={isFlagged ? "default" : "ghost"}
            size="icon"
            className={isFlagged ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
            onClick={onToggleFlag}
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>

        {/* Question text */}
        <p className="text-base md:text-lg font-medium leading-relaxed">
          {question.question}
        </p>

        {question.scripture_ref && (
          <p className="text-sm text-muted-foreground italic">
            Reference: {question.scripture_ref}
          </p>
        )}

        {/* Answer input */}
        {question.type === "mc" && question.options && (
          <div className="space-y-2">
            {question.options.map((option, i) => {
              const letter = String.fromCharCode(65 + i); // A, B, C, D
              const isSelected = answer === option;
              return (
                <button
                  key={i}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  } ${isLocked ? "pointer-events-none opacity-75" : ""}`}
                  onClick={() => !isLocked && onAnswer(option)}
                  disabled={isLocked}
                >
                  <span className="font-mono font-bold mr-3 text-primary">{letter}.</span>
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {question.type === "tf" && (
          <div className="flex gap-3">
            {["True", "False"].map((val) => (
              <Button
                key={val}
                variant={answer === val ? "default" : "outline"}
                className={`flex-1 h-12 text-base ${
                  answer === val ? "gradient-palace" : ""
                }`}
                onClick={() => !isLocked && onAnswer(val)}
                disabled={isLocked}
              >
                {val}
              </Button>
            ))}
          </div>
        )}

        {question.type === "sa" && (
          <Textarea
            placeholder="Type your answer here (1-3 sentences)..."
            value={answer}
            onChange={(e) => !isLocked && onAnswer(e.target.value)}
            rows={4}
            className="resize-none text-base"
            disabled={isLocked}
          />
        )}

        {/* Lock In / Grading / Change Answer */}
        {!isLocked && !isGrading && hasAnswer && onLockIn && (
          <Button
            onClick={onLockIn}
            className="w-full gradient-palace"
            size="lg"
          >
            <Lock className="h-4 w-4 mr-2" />
            Lock In Answer
          </Button>
        )}

        {isGrading && (
          <div className="flex items-center justify-center gap-2 py-3 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Jeeves is grading...</span>
          </div>
        )}

        {/* Grade feedback banner */}
        {grade && (
          <div
            className={`rounded-lg p-3 flex items-start gap-3 ${
              grade.correct || grade.earned >= 1
                ? "bg-green-500/10 border border-green-500/30"
                : grade.earned === 0.5
                  ? "bg-amber-500/10 border border-amber-500/30"
                  : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            {grade.correct || grade.earned >= 1 ? (
              <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
            ) : (
              <X className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            )}
            <div className="space-y-1 flex-1">
              <p className={`text-sm font-medium ${
                grade.correct || grade.earned >= 1
                  ? "text-green-700 dark:text-green-400"
                  : grade.earned === 0.5
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-red-700 dark:text-red-400"
              }`}>
                {grade.correct || grade.earned >= 1
                  ? "Correct!"
                  : grade.earned === 0.5
                    ? "Partial Credit (0.5/1)"
                    : "Incorrect"}
              </p>
              <p className="text-sm text-muted-foreground">{grade.feedback}</p>
            </div>
          </div>
        )}

        {/* Change answer link */}
        {isLocked && onChangeAnswer && (
          <button
            className="text-sm text-primary hover:underline"
            onClick={() => {
              onChangeAnswer();
              setShowChallenge(false);
              setChallengeText("");
            }}
          >
            Change Answer
          </button>
        )}

        {/* Challenge section */}
        {canChallenge && onChallenge && !isChallenging && (
          <div className="space-y-3 pt-2">
            {!showChallenge ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChallenge(true)}
                className="gap-1.5"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Challenge This Grade
              </Button>
            ) : (
              <>
                <label className="text-sm font-medium text-muted-foreground">
                  Explain why you believe your answer is correct...
                </label>
                <Textarea
                  placeholder="Provide a clear theological or factual explanation..."
                  value={challengeText}
                  onChange={(e) => setChallengeText(e.target.value)}
                  rows={3}
                  className="resize-none text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={!challengeText.trim()}
                    onClick={() => {
                      onChallenge(challengeText);
                      setChallengeText("");
                      setShowChallenge(false);
                    }}
                  >
                    Submit Challenge
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowChallenge(false);
                      setChallengeText("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {isChallenging && (
          <div className="flex items-center justify-center gap-2 py-3 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Jeeves is reviewing your challenge...</span>
          </div>
        )}

        {/* Challenge result banner */}
        {grade?.challengeAccepted && (
          <div className="rounded-lg p-3 flex items-start gap-3 bg-green-500/10 border border-green-500/30">
            <Award className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Challenge Accepted!
              </p>
              {grade.challengeFeedback && (
                <p className="text-sm text-muted-foreground">{grade.challengeFeedback}</p>
              )}
            </div>
          </div>
        )}

        {grade?.challengeDenied && (
          <div className="rounded-lg p-3 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30">
            <MessageSquare className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Challenge Denied
              </p>
              {grade.challengeFeedback && (
                <p className="text-sm text-muted-foreground">{grade.challengeFeedback}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
