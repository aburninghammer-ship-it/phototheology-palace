import { QuestionGradeResult } from "@/hooks/useMasterExam";

interface QuestionNavigatorProps {
  total: number;
  currentIndex: number;
  answers: Record<number, string>;
  flagged: Set<number>;
  questionGrades?: Record<number, QuestionGradeResult>;
  onSelect: (index: number) => void;
}

export function QuestionNavigator({
  total,
  currentIndex,
  answers,
  flagged,
  questionGrades = {},
  onSelect,
}: QuestionNavigatorProps) {
  return (
    <div className="grid grid-cols-10 gap-1.5 md:gap-2">
      {Array.from({ length: total }, (_, i) => {
        const qId = i + 1;
        const isAnswered = !!answers[qId]?.trim();
        const isFlagged = flagged.has(qId);
        const isCurrent = i === currentIndex;
        const grade = questionGrades[qId];

        let bg = "bg-muted/50 text-muted-foreground"; // unanswered
        let ring = "";

        if (grade) {
          if (grade.correct || grade.earned >= 1) {
            // Graded correct
            bg = "bg-green-500/30 text-green-700 dark:text-green-400";
          } else {
            // Graded wrong
            bg = "bg-red-500/30 text-red-700 dark:text-red-400";
          }
          if (grade.challengeAccepted) {
            // Challenge accepted - gold ring
            bg = "bg-green-500/20 text-green-700 dark:text-green-400";
            ring = "ring-2 ring-amber-400";
          }
        } else if (isAnswered) {
          // Answered but ungraded - light outline
          bg = "bg-primary/15 text-primary";
        }

        if (isFlagged && !grade) {
          bg = "bg-amber-500/20 text-amber-700 dark:text-amber-400";
        }

        if (isCurrent) ring += " ring-2 ring-primary";

        return (
          <button
            key={qId}
            className={`h-8 w-full rounded text-xs font-mono font-bold transition-all hover:scale-105 ${bg} ${ring}`}
            onClick={() => onSelect(i)}
          >
            {qId}
          </button>
        );
      })}
    </div>
  );
}
