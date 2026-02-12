import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useChurchGiving(churchId?: string) {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [yearSummary, setYearSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const recordGiving = useCallback(async (cId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_giving_records")
        .insert({
          church_id: cId,
          user_id: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Giving recorded!");
      await getMyHistory(cId);
      return result;
    } catch (err: any) {
      console.error("Error recording giving:", err);
      toast.error(err.message || "Failed to record giving");
      return null;
    }
  }, [user]);

  const getMyHistory = useCallback(async (cId?: string, year?: number) => {
    const id = cId || churchId;
    if (!user || !id) return [];
    try {
      let query = (supabase as any)
        .from("church_giving_records")
        .select("*")
        .eq("user_id", user.id)
        .eq("church_id", id)
        .order("giving_date", { ascending: false });
      if (year) {
        query = query
          .gte("giving_date", `${year}-01-01`)
          .lte("giving_date", `${year}-12-31`);
      }
      const { data, error } = await query;
      if (error) throw error;
      setHistory(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching giving history:", err);
      return [];
    }
  }, [user, churchId]);

  const getGoals = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!id) return [];
    try {
      const { data, error } = await (supabase as any)
        .from("church_giving_goals")
        .select("*")
        .eq("church_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setGoals(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching giving goals:", err);
      return [];
    }
  }, [churchId]);

  const createGoal = useCallback(async (cId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_giving_goals")
        .insert({
          church_id: cId,
          created_by: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Giving goal created!");
      await getGoals(cId);
      return result;
    } catch (err: any) {
      console.error("Error creating giving goal:", err);
      toast.error(err.message || "Failed to create giving goal");
      return null;
    }
  }, [user, getGoals]);

  const getYearSummary = useCallback(async (cId?: string, year?: number) => {
    const id = cId || churchId;
    const y = year || new Date().getFullYear();
    if (!user || !id) return null;
    try {
      const { data, error } = await (supabase as any)
        .from("church_giving_records")
        .select("amount, giving_type, giving_date")
        .eq("user_id", user.id)
        .eq("church_id", id)
        .gte("giving_date", `${y}-01-01`)
        .lte("giving_date", `${y}-12-31`);
      if (error) throw error;
      const records = data || [];
      const total = records.reduce((sum: number, r: any) => sum + (parseFloat(r.amount) || 0), 0);
      const byType: Record<string, number> = {};
      for (const r of records) {
        const type = r.giving_type || "general";
        byType[type] = (byType[type] || 0) + (parseFloat(r.amount) || 0);
      }
      const summary = { year: y, total, count: records.length, byType };
      setYearSummary(summary);
      return summary;
    } catch (err) {
      console.error("Error computing year summary:", err);
      return null;
    }
  }, [user, churchId]);

  useEffect(() => {
    if (!user || !churchId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([getMyHistory(), getGoals(), getYearSummary()])
      .finally(() => setLoading(false));
  }, [user, churchId]);

  return {
    history,
    goals,
    yearSummary,
    loading,
    recordGiving,
    getMyHistory,
    getGoals,
    createGoal,
    getYearSummary,
  };
}
