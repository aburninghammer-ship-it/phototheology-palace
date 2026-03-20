import { GradingResults, ExamResult } from "@/hooks/useMasterExam";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { DiagnosticReport } from "./DiagnosticReport";
import { RoomDiagnosisReport } from "./RoomDiagnosisReport";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, MinusCircle, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ExamResultsProps {
  results: GradingResults;
  onRetake: () => void;
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

function getGradeColor(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

const categoryLabels: Record<string, string> = {
  palace_rooms: "Palace Rooms",
  apologetics: "Apologetics",
  gems_typology: "Gems & Typology",
  prophecy: "Prophecy",
  sanctuary: "Sanctuary",
  christ_types: "Christ Types",
  patterns_themes: "Patterns & Themes",
  memorization_courses: "Memorization",
};

export function ExamResults({ results, onRetake }: ExamResultsProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const toggleQuestion = (id: number) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const grade = getLetterGrade(results.score);
  const gradeColor = getGradeColor(results.score);

  const incorrectQuestions = results.per_question.filter((q) => !q.correct);
  const displayQuestions = showAll ? results.per_question : incorrectQuestions;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Score Card */}
      <Card variant="glass" className="overflow-hidden">
        <CardContent className="p-6 md:p-8 text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-muted-foreground">Exam Results</h2>
          <div className={`text-6xl md:text-7xl font-bold ${gradeColor}`}>
            {grade}
          </div>
          <p className="text-3xl font-bold">
            {results.score}%
          </p>
          <p className="text-muted-foreground">
            {results.total_correct} of {results.total_questions} correct
          </p>
          <Button onClick={onRetake} className="gradient-palace mt-4">
            <RotateCcw className="h-4 w-4 mr-2" />
            Take Another Exam
          </Button>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card variant="glass">
        <CardContent className="p-4 md:p-6">
          <CategoryBreakdown categoryScores={results.category_scores} />
        </CardContent>
      </Card>

      {/* Room Diagnosis Report (for room tests) */}
      {results.diagnostic && results.exam_type?.startsWith("room_test_") && (
        <RoomDiagnosisReport
          diagnostic={results.diagnostic}
          roomName={results.room_name}
        />
      )}

      {/* Diagnostic Report (for non-room diagnostic exams) */}
      {results.diagnostic && !results.exam_type?.startsWith("room_test_") && (
        <DiagnosticReport
          diagnostic={results.diagnostic}
          onGenerateWeeklyPlan={() => {}}
          isGeneratingPlan={false}
        />
      )}

      {/* Per-Question Review */}
      <Card variant="glass">
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Question Review
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Incorrect Only" : `Show All (${results.per_question.length})`}
            </Button>
          </div>

          {displayQuestions.length === 0 && !showAll && (
            <p className="text-center text-muted-foreground py-4">
              All questions answered correctly!
            </p>
          )}

          <div className="space-y-2">
            {displayQuestions.map((q) => (
              <QuestionReviewItem
                key={q.id}
                question={q}
                isExpanded={expandedQuestions.has(q.id)}
                onToggle={() => toggleQuestion(q.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuestionReviewItem({
  question,
  isExpanded,
  onToggle,
}: {
  question: ExamResult;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const icon = question.correct ? (
    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
  ) : question.earned === 0.5 ? (
    <MinusCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
  ) : (
    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
  );

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        {icon}
        <span className="font-mono text-xs text-muted-foreground mr-1">Q{question.id}</span>
        <span className="flex-1 text-sm truncate">{question.question}</span>
        <Badge variant="outline" className="text-[10px] flex-shrink-0">
          {categoryLabels[question.category] || question.category}
        </Badge>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-border/30 pt-3">
          <p className="text-sm">{question.question}</p>

          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium text-muted-foreground">Your answer: </span>
              <span className={question.correct ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                {question.user_answer || "(no answer)"}
              </span>
            </p>
            <p>
              <span className="font-medium text-muted-foreground">Correct answer: </span>
              <span className="text-green-600 dark:text-green-400">{question.correct_answer}</span>
            </p>
          </div>

          {question.feedback && (
            <div className="bg-muted/30 rounded-lg p-3 text-sm">
              <span className="font-medium">Feedback: </span>
              {question.feedback}
            </div>
          )}

          {question.explanation && (
            <div className="bg-primary/5 rounded-lg p-3 text-sm">
              <span className="font-medium">Explanation: </span>
              {question.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
