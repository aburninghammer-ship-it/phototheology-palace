// PT Scrabble 20-minute game timer
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Timer, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameTimerProps {
  durationMinutes?: number;
  onTimeUp?: () => void;
  isPaused?: boolean;
  className?: string;
}

export function GameTimer({
  durationMinutes = 20,
  onTimeUp,
  isPaused = false,
  className,
}: GameTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (isPaused || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isLow = secondsLeft <= 120; // 2 minutes warning
  const isCritical = secondsLeft <= 60; // 1 minute critical

  return (
    <motion.div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-mono font-bold transition-colors",
        isCritical
          ? "bg-destructive/20 text-destructive animate-pulse"
          : isLow
            ? "bg-amber-500/20 text-amber-500"
            : "bg-muted text-foreground",
        className
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      {isCritical ? (
        <AlertTriangle className="h-3.5 w-3.5" />
      ) : (
        <Timer className="h-3.5 w-3.5" />
      )}
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </motion.div>
  );
}
