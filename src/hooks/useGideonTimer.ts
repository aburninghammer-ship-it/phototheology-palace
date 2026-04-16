import { useState, useEffect, useRef } from "react";

interface UseGideonTimerProps {
  roundStartedAt: string | null;
  durationSeconds: number;
  isActive: boolean;
}

export function useGideonTimer({ roundStartedAt, durationSeconds, isActive }: UseGideonTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isActive || !roundStartedAt) {
      setTimeRemaining(durationSeconds);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const startTime = new Date(roundStartedAt).getTime();

    const tick = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, durationSeconds - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    tick();
    intervalRef.current = setInterval(tick, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [roundStartedAt, durationSeconds, isActive]);

  const isExpired = timeRemaining <= 0;
  const progress = durationSeconds > 0 ? timeRemaining / durationSeconds : 0;

  const timerColor = progress > 0.5 ? "text-green-500" : progress > 0.2 ? "text-yellow-500" : "text-red-500";
  const barColor = progress > 0.5 ? "bg-green-500" : progress > 0.2 ? "bg-yellow-500" : "bg-red-500";

  return {
    timeRemaining: Math.ceil(timeRemaining),
    isExpired,
    progress,
    timerColor,
    barColor,
  };
}
