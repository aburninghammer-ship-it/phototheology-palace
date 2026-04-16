/**
 * ImmersiveSleepTimer - Configurable auto-stop with gradual volume fade
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Timer, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImmersiveSleepTimerProps {
  isOpen: boolean;
  onSleepTrigger: () => void;
  /** Called every tick with the fade multiplier (1 → 0) for volume */
  onVolumeFade: (multiplier: number) => void;
}

const TIMER_OPTIONS = [
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
  { label: "60 min", minutes: 60 },
  { label: "90 min", minutes: 90 },
];

const FADE_DURATION_MS = 120_000; // 2 minutes fade

export function ImmersiveSleepTimer({ isOpen, onSleepTrigger, onVolumeFade }: ImmersiveSleepTimerProps) {
  const [activeMinutes, setActiveMinutes] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const startTimer = useCallback((minutes: number) => {
    setActiveMinutes(minutes);
    setRemainingMs(minutes * 60 * 1000);
    setShowPicker(false);
  }, []);

  const cancelTimer = useCallback(() => {
    setActiveMinutes(null);
    setRemainingMs(0);
    onVolumeFade(1); // restore volume
  }, [onVolumeFade]);

  // Countdown + fade logic
  useEffect(() => {
    if (!isOpen || activeMinutes === null) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingMs(prev => {
        const next = prev - 1000;
        if (next <= 0) {
          onSleepTrigger();
          setActiveMinutes(null);
          return 0;
        }
        // Fade volume in last FADE_DURATION_MS
        if (next < FADE_DURATION_MS) {
          onVolumeFade(next / FADE_DURATION_MS);
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, activeMinutes, onSleepTrigger, onVolumeFade]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setActiveMinutes(null);
      setRemainingMs(0);
    }
  }, [isOpen]);

  const remainMin = Math.floor(remainingMs / 60000);
  const remainSec = Math.floor((remainingMs % 60000) / 1000);

  if (!isOpen) return null;

  return (
    <div className="flex items-center gap-2">
      {activeMinutes !== null ? (
        <Badge
          variant="secondary"
          className="text-xs gap-1.5 cursor-pointer hover:bg-destructive/20 transition-colors"
          onClick={cancelTimer}
        >
          <Moon className="h-3 w-3" />
          {remainMin}:{remainSec.toString().padStart(2, "0")}
          <X className="h-3 w-3 ml-0.5" />
        </Badge>
      ) : (
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowPicker(!showPicker)}
            title="Sleep timer"
          >
            <Moon className="h-4 w-4" />
          </Button>
          {showPicker && (
            <div className="absolute bottom-full right-0 mb-2 bg-popover border border-border rounded-lg shadow-xl p-2 min-w-[120px] z-50">
              <p className="text-[10px] text-muted-foreground px-2 pb-1.5 font-medium uppercase tracking-wider">
                Sleep Timer
              </p>
              {TIMER_OPTIONS.map(opt => (
                <button
                  key={opt.minutes}
                  className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-accent transition-colors"
                  onClick={() => startTimer(opt.minutes)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
