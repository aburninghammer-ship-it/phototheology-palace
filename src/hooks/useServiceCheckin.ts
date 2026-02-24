import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useServiceCheckin(churchId?: string) {
  const { user } = useAuth();
  const [checkins, setCheckins] = useState<any[]>([]);
  const [todayCheckins, setTodayCheckins] = useState<any[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const getMyCheckins = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!user || !id) return;
    try {
      const { data, error } = await (supabase as any)
        .from("church_service_checkins")
        .select("*")
        .eq("user_id", user.id)
        .eq("church_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCheckins(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching checkins:", err);
      return [];
    }
  }, [user, churchId]);

  const getTodayCheckins = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!id) return;
    const today = new Date().toISOString().split("T")[0];
    try {
      const { data, error } = await (supabase as any)
        .from("church_service_checkins")
        .select("*")
        .eq("church_id", id)
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setTodayCheckins(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching today checkins:", err);
      return [];
    }
  }, [churchId]);

  const getMyStreak = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!user || !id) return 0;
    try {
      const { data, error } = await (supabase as any)
        .from("church_service_checkins")
        .select("created_at")
        .eq("user_id", user.id)
        .eq("church_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) { setStreak(0); return 0; }

      let count = 0;
      const seen = new Set<string>();
      for (const row of data) {
        const day = new Date(row.created_at).toISOString().split("T")[0];
        if (!seen.has(day)) {
          seen.add(day);
        }
      }
      const days = Array.from(seen).sort().reverse();
      const today = new Date();
      for (let i = 0; i < days.length; i++) {
        const expected = new Date(today);
        expected.setDate(expected.getDate() - i * 7);
        const expStr = expected.toISOString().split("T")[0];
        const diff = Math.abs(new Date(days[i]).getTime() - new Date(expStr).getTime());
        if (diff <= 86400000 * 3) count++;
        else break;
      }
      setStreak(count);
      return count;
    } catch (err) {
      console.error("Error computing streak:", err);
      return 0;
    }
  }, [user, churchId]);

  const checkIn = useCallback(async (cId: string, serviceType: string, message?: string) => {
    if (!user) { toast.error("You must be logged in to check in"); return null; }
    try {
      const { data, error } = await (supabase as any)
        .from("church_service_checkins")
        .insert({
          user_id: user.id,
          church_id: cId,
          service_type: serviceType,
          message: message || null,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Checked in successfully!");
      await getMyCheckins(cId);
      await getTodayCheckins(cId);
      return data;
    } catch (err: any) {
      console.error("Error checking in:", err);
      toast.error(err.message || "Failed to check in");
      return null;
    }
  }, [user, getMyCheckins, getTodayCheckins]);

  useEffect(() => {
    if (!user || !churchId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([getMyCheckins(), getTodayCheckins(), getMyStreak()])
      .finally(() => setLoading(false));
  }, [user, churchId]);

  return {
    checkins,
    todayCheckins,
    streak,
    loading,
    checkIn,
    getMyCheckins,
    getTodayCheckins,
    getMyStreak,
  };
}
