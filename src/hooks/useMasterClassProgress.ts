import { useState, useCallback, useMemo } from "react";
import { MASTER_CLASSES } from "@/data/masterClassData";

const STORAGE_KEY = "master-class-progress";
const MAX_CLASSES_PER_DAY = 3;

interface ProgressData {
  completedIds: string[];
  dailyLog: Record<string, number>; // { "2026-04-09": 2 }
}

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        completedIds: parsed.completedIds || [],
        dailyLog: parsed.dailyLog || {},
      };
    }
  } catch {
    // corrupted data, reset
  }
  return { completedIds: [], dailyLog: {} };
}

function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useMasterClassProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  const completedIds = progress.completedIds;
  const todayKey = getTodayKey();
  const completionsToday = progress.dailyLog[todayKey] || 0;
  const canStartNew = completionsToday < MAX_CLASSES_PER_DAY;
  const remainingToday = MAX_CLASSES_PER_DAY - completionsToday;

  const isCompleted = useCallback(
    (classId: string) => completedIds.includes(classId),
    [completedIds]
  );

  // A class is unlocked if:
  // 1. It's the first class (class 1), OR
  // 2. The previous class (by classNumber order) is completed
  const isUnlocked = useCallback(
    (classId: string) => {
      const sorted = [...MASTER_CLASSES].sort((a, b) => a.classNumber - b.classNumber);
      const idx = sorted.findIndex((c) => c.id === classId);
      if (idx <= 0) return true; // first class always unlocked
      const prevClass = sorted[idx - 1];
      return completedIds.includes(prevClass.id);
    },
    [completedIds]
  );

  const markComplete = useCallback(
    (classId: string) => {
      setProgress((prev) => {
        if (prev.completedIds.includes(classId)) return prev;
        const today = getTodayKey();
        const updated: ProgressData = {
          completedIds: [...prev.completedIds, classId],
          dailyLog: {
            ...prev.dailyLog,
            [today]: (prev.dailyLog[today] || 0) + 1,
          },
        };
        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  // For dev/testing: reset all progress
  const resetProgress = useCallback(() => {
    const empty: ProgressData = { completedIds: [], dailyLog: {} };
    saveProgress(empty);
    setProgress(empty);
  }, []);

  const totalCompleted = completedIds.length;
  const totalClasses = MASTER_CLASSES.length;

  // Next unlocked but not-yet-completed class
  const nextClass = useMemo(() => {
    const sorted = [...MASTER_CLASSES].sort((a, b) => a.classNumber - b.classNumber);
    return sorted.find((c) => !completedIds.includes(c.id) && (sorted.indexOf(c) === 0 || completedIds.includes(sorted[sorted.indexOf(c) - 1].id)));
  }, [completedIds]);

  return {
    completedIds,
    completionsToday,
    canStartNew,
    remainingToday,
    isCompleted,
    isUnlocked,
    markComplete,
    resetProgress,
    totalCompleted,
    totalClasses,
    nextClass,
  };
}
