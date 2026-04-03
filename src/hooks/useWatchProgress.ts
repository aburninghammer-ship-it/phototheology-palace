/**
 * useWatchProgress - Time-locked Watch session progression
 *
 * Tracks per-tract progress using localStorage:
 * - Day 1 is always unlocked
 * - Day N unlocks when Day N-1 is completed AND N-1 calendar days have passed since startedAt
 */
import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "pt-watch-progress";

interface TractProgress {
  startedAt: string; // ISO date string
  completedDays: number[];
}

type ProgressMap = Record<string, TractProgress>;

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(map: ProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function daysSince(isoDate: string): number {
  const start = new Date(isoDate);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function useWatchProgress() {
  const [progress, setProgress] = useState<ProgressMap>(loadProgress);

  // Sync to localStorage on change
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const startTract = useCallback((tractId: string) => {
    setProgress((prev) => {
      if (prev[tractId]) return prev; // already started
      return {
        ...prev,
        [tractId]: { startedAt: new Date().toISOString(), completedDays: [] },
      };
    });
  }, []);

  const markDayComplete = useCallback((tractId: string, day: number) => {
    setProgress((prev) => {
      const tract = prev[tractId];
      if (!tract) {
        // Auto-start if not started
        return {
          ...prev,
          [tractId]: {
            startedAt: new Date().toISOString(),
            completedDays: [day],
          },
        };
      }
      if (tract.completedDays.includes(day)) return prev;
      return {
        ...prev,
        [tractId]: {
          ...tract,
          completedDays: [...tract.completedDays, day].sort((a, b) => a - b),
        },
      };
    });
  }, []);

  const getUnlockedDay = useCallback(
    (tractId: string): number => {
      const tract = progress[tractId];
      if (!tract) return 1; // Day 1 always unlocked
      const elapsed = daysSince(tract.startedAt);
      const completed = new Set(tract.completedDays);
      // Walk forward: Day N requires Day N-1 completed AND N-1 days elapsed
      let unlocked = 1;
      for (let d = 2; d <= 400; d++) {
        if (completed.has(d - 1) && elapsed >= d - 1) {
          unlocked = d;
        } else {
          break;
        }
      }
      return unlocked;
    },
    [progress],
  );

  const isDayUnlocked = useCallback(
    (tractId: string, day: number): boolean => {
      if (day <= 1) return true;
      const tract = progress[tractId];
      if (!tract) return day === 1;
      const elapsed = daysSince(tract.startedAt);
      const completed = new Set(tract.completedDays);
      // Day N: need all days 1..N-1 completed AND N-1 days elapsed
      for (let d = 1; d < day; d++) {
        if (!completed.has(d)) return false;
      }
      return elapsed >= day - 1;
    },
    [progress],
  );

  const getProgress = useCallback(
    (tractId: string) => {
      const tract = progress[tractId];
      if (!tract) return { startedAt: null, completedDays: [] as number[], currentDay: 1 };
      return {
        startedAt: tract.startedAt,
        completedDays: tract.completedDays,
        currentDay: getUnlockedDay(tractId),
      };
    },
    [progress, getUnlockedDay],
  );

  return { startTract, markDayComplete, getUnlockedDay, isDayUnlocked, getProgress };
}
