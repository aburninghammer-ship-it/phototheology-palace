import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface LockInPassStatus {
  hasPass: boolean;
  passId: string | null;
  expiresAt: string | null;
  daysLeft: number;
  personalMessage: string | null;
  passToken: string | null;
  commentaryBook: string | null;
  commentaryChapter: number | null;
  commentaryMode: string | null;
}

interface LockInMission {
  id: string;
  day_number: number;
  mission_title: string;
  mission_description: string;
  is_completed: boolean;
  completed_at: string | null;
}

export function useLockInPass() {
  const { user } = useAuth();
  const [status, setStatus] = useState<LockInPassStatus>({
    hasPass: false,
    passId: null,
    expiresAt: null,
    daysLeft: 0,
    personalMessage: null,
    passToken: null,
    commentaryBook: null,
    commentaryChapter: null,
    commentaryMode: null,
  });
  const [missions, setMissions] = useState<LockInMission[]>([]);
  const [loading, setLoading] = useState(true);

  // Also check sessionStorage for non-authenticated pass holders
  const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem("lock_in_pass_token") : null;

  useEffect(() => {
    const checkPass = async () => {
      try {
        const { data, error } = await supabase.rpc("get_active_lock_in_pass", {
          _user_id_or_fingerprint: sessionToken,
        });

        if (error) throw error;

        const result = data as any;
        if (result?.has_pass) {
          // Fetch commentary selection from pass record
          let commentaryData = { commentary_book: null, commentary_chapter: null, commentary_mode: null };
          if (result.pass_id) {
            const { data: passData } = await (supabase as any)
              .from("lock_in_passes")
              .select("commentary_book, commentary_chapter, commentary_mode")
              .eq("id", result.pass_id)
              .single();
            if (passData) commentaryData = passData;
          }

          setStatus({
            hasPass: true,
            passId: result.pass_id,
            expiresAt: result.expires_at,
            daysLeft: result.days_left || 0,
            personalMessage: result.personal_message,
            passToken: sessionToken,
            commentaryBook: commentaryData.commentary_book,
            commentaryChapter: commentaryData.commentary_chapter,
            commentaryMode: commentaryData.commentary_mode,
          });

          // Fetch missions
          if (result.pass_id) {
            const { data: missionData } = await supabase
              .from("lock_in_missions")
              .select("*")
              .eq("pass_id", result.pass_id)
              .order("day_number");

            if (missionData) {
              setMissions(missionData as any[]);
            }
          }
        }
      } catch (e) {
        console.debug("[useLockInPass] Check failed:", e);
      } finally {
        setLoading(false);
      }
    };

    checkPass();
  }, [user, sessionToken]);

  const completeMission = async (missionId: string) => {
    const { error } = await supabase
      .from("lock_in_missions")
      .update({ is_completed: true, completed_at: new Date().toISOString() })
      .eq("id", missionId);

    if (!error) {
      setMissions((prev) =>
        prev.map((m) =>
          m.id === missionId
            ? { ...m, is_completed: true, completed_at: new Date().toISOString() }
            : m
        )
      );
    }
    return !error;
  };

  const currentDay = useMemo(() => {
    if (!status.expiresAt) return 1;
    const activated = new Date(status.expiresAt);
    activated.setDate(activated.getDate() - 5); // pass is 5 days, so subtract to get activation date
    const daysSinceActivation = Math.floor(
      (Date.now() - activated.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.min(Math.max(daysSinceActivation + 1, 1), 5);
  }, [status.expiresAt]);

  const completedCount = missions.filter((m) => m.is_completed).length;

  return {
    ...status,
    missions,
    currentDay,
    completedCount,
    completeMission,
    loading,
  };
}

export function useLockInMonthlyUsage() {
  const { user } = useAuth();
  const [passesUsed, setPassesUsed] = useState(0);
  const [passesRemaining, setPassesRemaining] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Count only passes that have been ACTIVATED by a guest this month
    // Shared-but-unused passes do NOT count against the limit
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

    (supabase as any)
      .from("lock_in_passes")
      .select("id", { count: "exact", head: true })
      .eq("created_by", user.id)
      .not("activated_at", "is", null)
      .gte("created_at", monthStart)
      .lt("created_at", monthEnd)
      .then(({ count }: { count: number | null }) => {
        const used = count || 0;
        setPassesUsed(used);
        setPassesRemaining(Math.max(0, 5 - used));
        setLoading(false);
      });
  }, [user]);

  return { passesUsed, passesRemaining, loading };
}
