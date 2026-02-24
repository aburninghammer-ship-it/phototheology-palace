import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useWeeklyVerse(churchId?: string) {
  const { user } = useAuth();
  const [currentVerse, setCurrentVerse] = useState<any>(null);
  const [myProgress, setMyProgress] = useState<any>(null);
  const [congregationProgress, setCongregationProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getCurrentVerse = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!id) return null;
    try {
      const now = new Date().toISOString();
      const { data, error } = await (supabase as any)
        .from("church_weekly_verses")
        .select("*")
        .eq("church_id", id)
        .lte("week_start", now)
        .gte("week_end", now)
        .order("week_start", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      setCurrentVerse(data);
      if (data && user) {
        const { data: progress } = await (supabase as any)
          .from("church_weekly_verse_progress")
          .select("*")
          .eq("weekly_verse_id", data.id)
          .eq("user_id", user.id)
          .maybeSingle();
        setMyProgress(progress);
      }
      return data;
    } catch (err) {
      console.error("Error fetching current verse:", err);
      return null;
    }
  }, [user, churchId]);

  const updateProgress = useCallback(async (weeklyVerseId: string, status: string) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data, error } = await (supabase as any)
        .from("church_weekly_verse_progress")
        .upsert(
          {
            weekly_verse_id: weeklyVerseId,
            user_id: user.id,
            status,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "weekly_verse_id,user_id" }
        )
        .select()
        .single();
      if (error) throw error;
      toast.success("Progress updated!");
      setMyProgress(data);
      return data;
    } catch (err: any) {
      console.error("Error updating progress:", err);
      toast.error(err.message || "Failed to update progress");
      return null;
    }
  }, [user]);

  const getCongregationProgress = useCallback(async (weeklyVerseId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("church_weekly_verse_progress")
        .select("*")
        .eq("weekly_verse_id", weeklyVerseId);
      if (error) throw error;
      setCongregationProgress(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching congregation progress:", err);
      return [];
    }
  }, []);

  const createWeeklyVerse = useCallback(async (cId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_weekly_verses")
        .insert({
          church_id: cId,
          created_by: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Weekly verse created!");
      await getCurrentVerse(cId);
      return result;
    } catch (err: any) {
      console.error("Error creating weekly verse:", err);
      toast.error(err.message || "Failed to create weekly verse");
      return null;
    }
  }, [user, getCurrentVerse]);

  useEffect(() => {
    if (!churchId) { setLoading(false); return; }
    setLoading(true);
    getCurrentVerse().finally(() => setLoading(false));
  }, [user, churchId]);

  return {
    currentVerse,
    myProgress,
    congregationProgress,
    loading,
    getCurrentVerse,
    updateProgress,
    getCongregationProgress,
    createWeeklyVerse,
  };
}
