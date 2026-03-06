import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { AATS_AVATAR_IDS, type AATSAvatarId } from "@/data/aatsTrainingData";

interface AATSProgressRecord {
  id: string;
  course_name: string;
  completed_lessons: string[];
  current_lesson: string | null;
  progress_percentage: number;
  started_at: string;
  completed_at: string | null;
}

/** Each avatar stores progress as course_name = "aats-{avatarId}" */
function courseKey(avatarId: string): string {
  return `aats-${avatarId}`;
}

export function useAATSProgress() {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState<Record<string, AATSProgressRecord>>({});
  const [loading, setLoading] = useState(true);

  // Load all AATS progress rows in one query
  const loadAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const keys = AATS_AVATAR_IDS.map((id) => courseKey(id));
      const { data, error } = await supabase
        .from("course_progress")
        .select("*")
        .eq("user_id", user.id)
        .in("course_name", keys);

      if (error) throw error;

      const map: Record<string, AATSProgressRecord> = {};
      for (const row of data ?? []) {
        const avatarId = row.course_name.replace("aats-", "");
        map[avatarId] = {
          ...row,
          completed_lessons: (row.completed_lessons as string[]) ?? [],
        };
      }
      setProgressMap(map);
    } catch (err) {
      console.error("AATS progress load error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadAll();
  }, [user, loadAll]);

  // Polling fallback for mobile devices that may miss realtime updates
  useEffect(() => {
    if (!user) return;
    let isActive = true;
    const POLL_INTERVAL = 15000; // 15 seconds

    const interval = setInterval(() => {
      if (isActive && !document.hidden) {
        loadAll();
      }
    }, POLL_INTERVAL);

    // Also reload when app regains focus (common mobile pattern)
    const handleVisibility = () => {
      if (!document.hidden && isActive) {
        loadAll();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isActive = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [user, loadAll]);

  /** Ensure an enrollment record exists for the avatar (creates started_at for calendar gating) */
  const ensureEnrolled = useCallback(
    async (avatarId: string) => {
      if (!user) return;
      if (progressMap[avatarId]) return; // already enrolled
      const key = courseKey(avatarId);
      try {
        // IMPORTANT: avoid overwriting existing progress if local state hasn't loaded yet
        await supabase.from("course_progress").upsert(
          {
            user_id: user.id,
            course_name: key,
            completed_lessons: [],
            progress_percentage: 0,
          },
          { onConflict: "user_id,course_name", ignoreDuplicates: true },
        );
        await loadAll();
      } catch (err) {
        console.error("AATS ensureEnrolled error:", err);
      }
    },
    [user, progressMap, loadAll],
  );

  /** Mark a single item complete for an avatar */
  const completeItem = useCallback(
    async (avatarId: string, itemId: string, totalItems: number) => {
      if (!user) return;
      const key = courseKey(avatarId);
      const existing = progressMap[avatarId];

      try {
        if (!existing) {
          // Local state may be stale; merge against server state to avoid wiping prior completions
          const { data: serverRow, error: serverError } = await supabase
            .from("course_progress")
            .select("completed_lessons")
            .eq("user_id", user.id)
            .eq("course_name", key)
            .maybeSingle();

          if (serverError) throw serverError;

          const completed = [
            ...(((serverRow?.completed_lessons as string[]) ?? []).filter(Boolean)),
          ];
          if (!completed.includes(itemId)) completed.push(itemId);
          const pct = Math.round((completed.length / totalItems) * 100);
          const done = pct >= 100;

          await supabase.from("course_progress").upsert(
            {
              user_id: user.id,
              course_name: key,
              completed_lessons: completed,
              progress_percentage: Math.min(pct, 100),
              current_lesson: itemId,
              completed_at: done ? new Date().toISOString() : null,
              last_accessed_at: new Date().toISOString(),
            },
            { onConflict: "user_id,course_name" },
          );
        } else {
          const completed = [...(existing.completed_lessons || [])];
          if (!completed.includes(itemId)) completed.push(itemId);
          const pct = Math.round((completed.length / totalItems) * 100);
          const done = pct >= 100;

          await supabase
            .from("course_progress")
            .update({
              completed_lessons: completed,
              progress_percentage: Math.min(pct, 100),
              current_lesson: itemId,
              completed_at: done ? new Date().toISOString() : null,
              last_accessed_at: new Date().toISOString(),
            })
            .eq("user_id", user.id)
            .eq("course_name", key);
        }
        await loadAll();
      } catch (err) {
        console.error("AATS completeItem error:", err);
      }
    },
    [user, progressMap, loadAll],
  );

  /** Check if a specific item is completed */
  const isItemCompleted = useCallback(
    (avatarId: string, itemId: string): boolean => {
      return progressMap[avatarId]?.completed_lessons?.includes(itemId) ?? false;
    },
    [progressMap],
  );

  /** Get phase progress for an avatar (0-100) based on item ID prefix convention */
  const getPhaseProgress = useCallback(
    (avatarId: string, phaseNumber: number): number => {
      const rec = progressMap[avatarId];
      if (!rec) return 0;
      const prefix = `p${phaseNumber}-`;
      const completed = rec.completed_lessons.filter((id) => id.startsWith(prefix)).length;
      // Estimate ~5 items per phase; adjust later with real count
      if (completed === 0) return 0;
      return Math.min(Math.round((completed / 5) * 100), 100);
    },
    [progressMap],
  );

  /** Get overall AATS progress across all avatars (0-100) */
  const getOverallProgress = useCallback((): number => {
    const vals = Object.values(progressMap);
    if (vals.length === 0) return 0;
    const total = vals.reduce((sum, r) => sum + (r.progress_percentage ?? 0), 0);
    return Math.round(total / AATS_AVATAR_IDS.length);
  }, [progressMap]);

  /** Get progress percentage for a specific avatar (0-100) */
  const getAvatarProgress = useCallback(
    (avatarId: string): number => {
      return progressMap[avatarId]?.progress_percentage ?? 0;
    },
    [progressMap],
  );

  /** Get the max unlocked day: requires BOTH calendar date AND previous-day completion.
   *  Day 1: unlocked immediately on enrollment.
   *  Day N (2-56): unlocked only if Day N-1 is completed AND calendar date >= start + (N-1) days.
   */
  const getMaxUnlockedDay = useCallback(
    (avatarId: string): number => {
      const rec = progressMap[avatarId];
      if (!rec) return 1; // not enrolled yet — Day 1 only

      // Calendar cap: how many days have elapsed since start
      const startedAt = new Date(rec.started_at);
      const now = new Date();
      const startDay = new Date(startedAt.getFullYear(), startedAt.getMonth(), startedAt.getDate());
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const elapsed = Math.floor((today.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24));
      const calendarCap = Math.min(elapsed + 1, 56);

      // Sequential completion cap: can only unlock Day N if Day N-1 is completed
      const completed = new Set(rec.completed_lessons ?? []);
      let completionCap = 1; // Day 1 always accessible
      for (let d = 1; d < 56; d++) {
        if (completed.has(`wc-day-${d}`)) {
          completionCap = d + 1; // Day d done → Day d+1 potentially unlockable
        } else {
          break; // previous day not done, can't go further
        }
      }

      return Math.min(calendarCap, completionCap);
    },
    [progressMap],
  );

  return {
    progressMap,
    loading,
    ensureEnrolled,
    completeItem,
    isItemCompleted,
    getPhaseProgress,
    getOverallProgress,
    getAvatarProgress,
    getMaxUnlockedDay,
    reload: loadAll,
  };
}
