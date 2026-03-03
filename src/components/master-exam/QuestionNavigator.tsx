interface QuestionNavigatorProps {
  total: number;
  currentIndex: number;
  answers: Record<number, string>;
  flagged: Set<number>;
  onSelect: (index: number) => void;
}

export function QuestionNavigator({
  total,
  currentIndex,
  answers,
  flagged,
  onSelect,
}: QuestionNavigatorProps) {
  return (
    <div className="grid grid-cols-10 gap-1.5 md:gap-2">
      {Array.from({ length: total }, (_, i) => {
        const qId = i + 1;
        const isAnswered = !!answers[qId]?.trim();
        const isFlagged = flagged.has(qId);
        const isCurrent = i === currentIndex;

        let bg = "bg-muted/50 text-muted-foreground"; // unanswered
        if (isAnswered) bg = "bg-green-500/20 text-green-700 dark:text-green-400";
        if (isFlagged) bg = "bg-amber-500/20 text-amber-700 dark:text-amber-400";
        if (isCurrent) bg += " ring-2 ring-primary";

        return (
          <button
            key={qId}
            className={`h-8 w-full rounded text-xs font-mono font-bold transition-all hover:scale-105 ${bg}`}
            onClick={() => onSelect(i)}
          >
            {qId}
          </button>
        );
      })}
    </div>
  );
}
