import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useChurchCelebrations(churchId?: string) {
  const { user } = useAuth();
  const [myCelebration, setMyCelebration] = useState<any>(null);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<any[]>([]);
  const [upcomingAnniversaries, setUpcomingAnniversaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getMyCelebration = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!user || !id) return null;
    try {
      const { data, error } = await (supabase as any)
        .from("church_member_celebrations")
        .select("*")
        .eq("user_id", user.id)
        .eq("church_id", id)
        .maybeSingle();
      if (error) throw error;
      setMyCelebration(data);
      return data;
    } catch (err) {
      console.error("Error fetching my celebration:", err);
      return null;
    }
  }, [user, churchId]);

  const getUpcomingBirthdays = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!id) return [];
    try {
      const { data, error } = await (supabase as any)
        .from("church_member_celebrations")
        .select("*")
        .eq("church_id", id)
        .not("birthday", "is", null)
        .order("birthday", { ascending: true });
      if (error) throw error;
      // Filter to upcoming birthdays within the next 30 days
      const now = new Date();
      const upcoming = (data || []).filter((c: any) => {
        if (!c.birthday) return false;
        const bday = new Date(c.birthday);
        const thisYear = new Date(now.getFullYear(), bday.getMonth(), bday.getDate());
        if (thisYear < now) thisYear.setFullYear(thisYear.getFullYear() + 1);
        const diff = (thisYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 30;
      });
      setUpcomingBirthdays(upcoming);
      return upcoming;
    } catch (err) {
      console.error("Error fetching birthdays:", err);
      return [];
    }
  }, [churchId]);

  const getUpcomingAnniversaries = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!id) return [];
    try {
      const { data, error } = await (supabase as any)
        .from("church_member_celebrations")
        .select("*")
        .eq("church_id", id)
        .not("anniversary", "is", null)
        .order("anniversary", { ascending: true });
      if (error) throw error;
      const now = new Date();
      const upcoming = (data || []).filter((c: any) => {
        if (!c.anniversary) return false;
        const ann = new Date(c.anniversary);
        const thisYear = new Date(now.getFullYear(), ann.getMonth(), ann.getDate());
        if (thisYear < now) thisYear.setFullYear(thisYear.getFullYear() + 1);
        const diff = (thisYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 30;
      });
      setUpcomingAnniversaries(upcoming);
      return upcoming;
    } catch (err) {
      console.error("Error fetching anniversaries:", err);
      return [];
    }
  }, [churchId]);

  const saveCelebration = useCallback(async (cId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_member_celebrations")
        .upsert(
          { user_id: user.id, church_id: cId, ...data },
          { onConflict: "user_id,church_id" }
        )
        .select()
        .single();
      if (error) throw error;
      toast.success("Celebration info saved!");
      setMyCelebration(result);
      return result;
    } catch (err: any) {
      console.error("Error saving celebration:", err);
      toast.error(err.message || "Failed to save celebration");
      return null;
    }
  }, [user]);

  useEffect(() => {
    if (!user || !churchId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([getMyCelebration(), getUpcomingBirthdays(), getUpcomingAnniversaries()])
      .finally(() => setLoading(false));
  }, [user, churchId]);

  return {
    myCelebration,
    upcomingBirthdays,
    upcomingAnniversaries,
    loading,
    saveCelebration,
    getMyCelebration,
    getUpcomingBirthdays,
    getUpcomingAnniversaries,
  };
}
