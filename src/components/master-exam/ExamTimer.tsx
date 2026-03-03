import { Clock } from "lucide-react";

interface ExamTimerProps {
  timeRemaining: number;
}

export function ExamTimer({ timeRemaining }: ExamTimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLow = timeRemaining < 300; // Under 5 minutes

  return (
    <div
      className={`flex items-center gap-2 font-mono text-lg md:text-xl font-bold px-3 py-1.5 rounded-lg ${
        isLow
          ? "bg-red-500/20 text-red-600 dark:text-red-400 animate-pulse"
          : "bg-muted/50 text-foreground"
      }`}
    >
      <Clock className="h-5 w-5" />
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
