import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { AATSAvatarId } from "@/data/aatsTrainingData";
import { getRank, getNextRank, type WarCollegeRank } from "@/data/warCollegeTypes";

// ── Types ──────────────────────────────────────────────────────────────────

export interface WCEnrollment {
  id: string;
  avatar_id: string;
  current_day: number;
  completed_days: number;
  streak: number;
  longest_streak: number;
  total_xp: number;
  status: string;
  last_activity_date: string | null;
  started_at: string;
  completed_at: string | null;
}

export interface WCDayCompletion {
  id: string;
  enrollment_id: string;
  day_number: number;
  xp_earned: number;
  mastery_score: number | null;
  drill_completed: boolean;
  weapon_forged: boolean;
  jeeves_debrief_used: boolean;
  completed_at: string;
}

// ── Utility ────────────────────────────────────────────────────────────────

function isConsecutiveDay(prev: string, current: string): boolean {
  const p = new Date(prev);
  const c = new Date(current);
  const diff = c.getTime() - p.getTime();
  return diff > 0 && diff <= 86400000 * 2; // within 48h for timezone safety
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useWarCollege() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Record<string, WCEnrollment>>({});
  const [dayCompletions, setDayCompletions] = useState<Record<string, WCDayCompletion[]>>({});
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: enrs, error: enrErr } = await (supabase as any)
        .from("war_college_enrollments")
        .select("*")
        .eq("user_id", user.id);

      if (enrErr) throw enrErr;

      const enrollMap: Record<string, WCEnrollment> = {};
      const enrollIds: string[] = [];
      for (const e of enrs ?? []) {
        enrollMap[e.avatar_id] = e;
        enrollIds.push(e.id);
      }
      setEnrollments(enrollMap);

      if (enrollIds.length > 0) {
        const { data: completions, error: compErr } = await (supabase as any)
          .from("war_college_day_completions")
          .select("*")
          .in("enrollment_id", enrollIds);

        if (compErr) throw compErr;

        const compMap: Record<string, WCDayCompletion[]> = {};
        for (const c of completions ?? []) {
          const avatarId = Object.entries(enrollMap).find(
            ([_, e]) => e.id === c.enrollment_id
          )?.[0];
          if (avatarId) {
            if (!compMap[avatarId]) compMap[avatarId] = [];
            compMap[avatarId].push(c);
          }
        }
        setDayCompletions(compMap);
      } else {
        setDayCompletions({});
      }
    } catch (err) {
      console.error("War College load error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadAll();
  }, [user, loadAll]);

  // ── Enrollment ─────────────────────────────────────────────────────────

  const enroll = useCallback(
    async (avatarId: AATSAvatarId) => {
      if (!user) return;
      const { error } = await (supabase as any)
        .from("war_college_enrollments")
        .insert({
          user_id: user.id,
          avatar_id: avatarId,
          current_day: 1,
          last_activity_date: new Date().toISOString().split("T")[0],
        });
      if (error) throw error;
      await loadAll();
    },
    [user, loadAll],
  );

  // ── Day Completion ─────────────────────────────────────────────────────

  const completeDay = useCallback(
    async (
      avatarId: AATSAvatarId,
      dayNumber: number,
      opts: {
        masteryScore: number;
        drillCompleted: boolean;
        weaponForged: boolean;
        jeevesDebriefUsed: boolean;
        xpEarned: number;
      },
    ) => {
      if (!user) return;
      const enrollment = enrollments[avatarId];
      if (!enrollment) throw new Error("Not enrolled in this track");

      const { error: dayErr } = await (supabase as any)
        .from("war_college_day_completions")
        .insert({
          enrollment_id: enrollment.id,
          user_id: user.id,
          day_number: dayNumber,
          xp_earned: opts.xpEarned,
          mastery_score: opts.masteryScore,
          drill_completed: opts.drillCompleted,
          weapon_forged: opts.weaponForged,
          jeeves_debrief_used: opts.jeevesDebriefUsed,
        });
      if (dayErr) throw dayErr;

      const today = new Date().toISOString().split("T")[0];
      const consecutive =
        enrollment.last_activity_date != null &&
        isConsecutiveDay(enrollment.last_activity_date, today);
      const newStreak = consecutive ? enrollment.streak + 1 : 1;
      const newLongest = Math.max(newStreak, enrollment.longest_streak);
      const newXP = enrollment.total_xp + opts.xpEarned;
      const newCompletedDays = enrollment.completed_days + 1;
      const isComplete = newCompletedDays >= 56;

      const { error: updErr } = await (supabase as any)
        .from("war_college_enrollments")
        .update({
          current_day: Math.min(dayNumber + 1, 56),
          completed_days: newCompletedDays,
          streak: newStreak,
          longest_streak: newLongest,
          total_xp: newXP,
          last_activity_date: today,
          status: isComplete ? "completed" : "active",
          completed_at: isComplete ? new Date().toISOString() : null,
        })
        .eq("id", enrollment.id);
      if (updErr) throw updErr;

      await loadAll();
    },
    [user, enrollments, loadAll],
  );

  // ── Save Weapon ────────────────────────────────────────────────────────

  const saveWeapon = useCallback(
    async (
      avatarId: AATSAvatarId,
      dayNumber: number,
      weaponName: string,
      weaponText: string,
      topic?: string,
    ) => {
      if (!user) return;
      const enrollment = enrollments[avatarId];
      if (!enrollment) return;

      const { error } = await (supabase as any)
        .from("war_college_weapons")
        .insert({
          user_id: user.id,
          enrollment_id: enrollment.id,
          avatar_id: avatarId,
          day_number: dayNumber,
          weapon_name: weaponName,
          weapon_text: weaponText,
          topic: topic ?? null,
        });
      if (error) throw error;
    },
    [user, enrollments],
  );

  // ── Query Helpers ──────────────────────────────────────────────────────

  const isEnrolled = useCallback(
    (avatarId: string): boolean => !!enrollments[avatarId],
    [enrollments],
  );

  const getEnrollment = useCallback(
    (avatarId: string): WCEnrollment | null => enrollments[avatarId] ?? null,
    [enrollments],
  );

  const isDayCompleted = useCallback(
    (avatarId: string, day: number): boolean =>
      dayCompletions[avatarId]?.some((c) => c.day_number === day) ?? false,
    [dayCompletions],
  );

  const isDayUnlocked = useCallback(
    (avatarId: string, day: number): boolean => {
      if (day === 1) return true;
      return isDayCompleted(avatarId, day - 1);
    },
    [isDayCompleted],
  );

  const getTrackProgress = useCallback(
    (avatarId: string): number => {
      const e = enrollments[avatarId];
      if (!e) return 0;
      return Math.round((e.completed_days / 56) * 100);
    },
    [enrollments],
  );

  const getTrackXP = useCallback(
    (avatarId: string): number => enrollments[avatarId]?.total_xp ?? 0,
    [enrollments],
  );

  const getTrackRank = useCallback(
    (avatarId: string): WarCollegeRank => getRank(getTrackXP(avatarId)),
    [getTrackXP],
  );

  const globalXP = useMemo(
    () => Object.values(enrollments).reduce((sum, e) => sum + e.total_xp, 0),
    [enrollments],
  );

  const globalRank = useMemo(() => getRank(globalXP), [globalXP]);
  const nextGlobalRank = useMemo(() => getNextRank(globalXP), [globalXP]);

  const totalTracksEnrolled = useMemo(
    () => Object.keys(enrollments).length,
    [enrollments],
  );

  const totalTracksCompleted = useMemo(
    () => Object.values(enrollments).filter((e) => e.status === "completed").length,
    [enrollments],
  );

  const totalDaysCompleted = useMemo(
    () => Object.values(enrollments).reduce((sum, e) => sum + e.completed_days, 0),
    [enrollments],
  );

  return {
    loading,
    enrollments,
    dayCompletions,
    enroll,
    completeDay,
    saveWeapon,
    isEnrolled,
    getEnrollment,
    isDayCompleted,
    isDayUnlocked,
    getTrackProgress,
    getTrackXP,
    getTrackRank,
    globalXP,
    globalRank,
    nextGlobalRank,
    totalTracksEnrolled,
    totalTracksCompleted,
    totalDaysCompleted,
    reload: loadAll,
  };
}
