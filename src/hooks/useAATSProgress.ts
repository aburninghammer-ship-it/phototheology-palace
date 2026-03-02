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

  /** Mark a single item complete for an avatar */
  const completeItem = useCallback(
    async (avatarId: string, itemId: string, totalItems: number) => {
      if (!user) return;
      const key = courseKey(avatarId);
      const existing = progressMap[avatarId];

      try {
        if (!existing) {
          // Create new record
          const completed = [itemId];
          const pct = Math.round((1 / totalItems) * 100);
          await supabase.from("course_progress").insert({
            user_id: user.id,
            course_name: key,
            completed_lessons: completed,
            progress_percentage: pct,
            current_lesson: itemId,
          });
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

  /** Get the max unlocked day based on calendar days since the user started the track */
  const getMaxUnlockedDay = useCallback(
    (avatarId: string): number => {
      const rec = progressMap[avatarId];
      if (!rec) return 1; // no record yet — only Day 1 available
      const startedAt = new Date(rec.started_at);
      const now = new Date();
      // Use calendar-day difference (midnight-to-midnight)
      const startDay = new Date(startedAt.getFullYear(), startedAt.getMonth(), startedAt.getDate());
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const elapsed = Math.floor((today.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24));
      return Math.min(elapsed + 1, 56);
    },
    [progressMap],
  );

  return {
    progressMap,
    loading,
    completeItem,
    isItemCompleted,
    getPhaseProgress,
    getOverallProgress,
    getAvatarProgress,
    getMaxUnlockedDay,
    reload: loadAll,
  };
}
