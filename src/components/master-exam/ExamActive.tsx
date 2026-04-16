import { ExamQuestion, QuestionGradeResult } from "@/hooks/useMasterExam";
import { QuestionCard } from "./QuestionCard";
import { QuestionNavigator } from "./QuestionNavigator";
import { ExamTimer } from "./ExamTimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Send, AlertTriangle } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExamActiveProps {
  questions: ExamQuestion[];
  answers: Record<number, string>;
  currentIndex: number;
  flagged: Set<number>;
  timeRemaining: number;
  answeredCount: number;
  gradedCount: number;
  questionGrades: Record<number, QuestionGradeResult>;
  gradingQuestionId: number | null;
  challengingQuestionId: number | null;
  onSetCurrentIndex: (index: number) => void;
  onSetAnswer: (questionId: number, answer: string) => void;
  onToggleFlag: (questionId: number) => void;
  onSubmit: () => void;
  onAbandon: () => void;
  onGradeQuestion: (questionId: number, answer: string) => void;
  onChallengeQuestion: (questionId: number, reasoning: string) => void;
}

export function ExamActive({
  questions,
  answers,
  currentIndex,
  flagged,
  timeRemaining,
  answeredCount,
  gradedCount,
  questionGrades,
  gradingQuestionId,
  challengingQuestionId,
  onSetCurrentIndex,
  onSetAnswer,
  onToggleFlag,
  onSubmit,
  onAbandon,
  onGradeQuestion,
  onChallengeQuestion,
}: ExamActiveProps) {
  const [showNavigator, setShowNavigator] = useState(false);
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top bar: Timer + Progress + Submit */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <ExamTimer timeRemaining={timeRemaining} />

        <div className="text-sm text-muted-foreground">
          {gradedCount > 0
            ? `${gradedCount} graded · ${answeredCount} / ${questions.length} answered`
            : `${answeredCount} / ${questions.length} answered`
          }
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNavigator(!showNavigator)}
          >
            {showNavigator ? "Hide Grid" : "Show Grid"}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" className="gradient-palace">
                <Send className="h-4 w-4 mr-1.5" />
                Submit
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have answered {answeredCount} of {questions.length} questions
                  ({gradedCount} already graded).
                  {answeredCount < questions.length && (
                    <span className="block mt-2 text-amber-600 dark:text-amber-400">
                      {questions.length - answeredCount} questions are still unanswered.
                    </span>
                  )}
                  This cannot be undone. Any ungraded questions will be graded now.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Working</AlertDialogCancel>
                <AlertDialogAction onClick={onSubmit}>Submit for Grading</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Navigator grid */}
      {showNavigator && (
        <Card variant="glass">
          <CardContent className="p-3 md:p-4">
            <QuestionNavigator
              total={questions.length}
              currentIndex={currentIndex}
              answers={answers}
              flagged={flagged}
              questionGrades={questionGrades}
              onSelect={onSetCurrentIndex}
            />
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-green-500/30 inline-block" /> Correct
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-red-500/30 inline-block" /> Incorrect
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-green-500/20 ring-2 ring-amber-400 inline-block" /> Challenged
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-primary/15 inline-block" /> Answered
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-muted/50 inline-block" /> Unanswered
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question */}
      <QuestionCard
        question={currentQuestion}
        answer={answers[currentQuestion.id] || ""}
        onAnswer={(val) => onSetAnswer(currentQuestion.id, val)}
        isFlagged={flagged.has(currentQuestion.id)}
        onToggleFlag={() => onToggleFlag(currentQuestion.id)}
        questionNumber={currentQuestion.id}
        grade={questionGrades[currentQuestion.id]}
        isGrading={gradingQuestionId === currentQuestion.id}
        isChallenging={challengingQuestionId === currentQuestion.id}
        onLockIn={() => onGradeQuestion(currentQuestion.id, answers[currentQuestion.id] || "")}
        onChallenge={(reasoning) => onChallengeQuestion(currentQuestion.id, reasoning)}
        onChangeAnswer={() => onSetAnswer(currentQuestion.id, answers[currentQuestion.id] || "")}
      />

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={!canGoPrev}
          onClick={() => onSetCurrentIndex(currentIndex - 1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <span className="text-sm text-muted-foreground font-mono">
          {currentIndex + 1} / {questions.length}
        </span>

        <Button
          variant="outline"
          disabled={!canGoNext}
          onClick={() => onSetCurrentIndex(currentIndex + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Abandon */}
      <div className="text-center pt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
              Abandon Exam
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Abandon Exam?</AlertDialogTitle>
              <AlertDialogDescription>
                Your progress will be saved but the exam will not be graded. You can start a new exam later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Exam</AlertDialogCancel>
              <AlertDialogAction onClick={onAbandon} className="bg-destructive hover:bg-destructive/90">
                Abandon
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
