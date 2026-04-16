import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useFamilyDevotionals(churchId?: string) {
  const { user } = useAuth();
  const [devotionals, setDevotionals] = useState<any[]>([]);
  const [currentWeek, setCurrentWeek] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getDevotionals = useCallback(async (cId?: string, ageGroup?: string) => {
    const id = cId || churchId;
    if (!id) return [];
    try {
      let query = (supabase as any)
        .from("church_family_devotionals")
        .select("*")
        .eq("church_id", id)
        .order("week_start", { ascending: false });
      if (ageGroup) {
        query = query.eq("age_group", ageGroup);
      }
      const { data, error } = await query;
      if (error) throw error;
      setDevotionals(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching family devotionals:", err);
      return [];
    }
  }, [churchId]);

  const getCurrentWeek = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!id) return null;
    try {
      const now = new Date().toISOString();
      const { data, error } = await (supabase as any)
        .from("church_family_devotionals")
        .select("*")
        .eq("church_id", id)
        .lte("week_start", now)
        .gte("week_end", now)
        .order("week_start", { ascending: false });
      if (error) throw error;
      setCurrentWeek(data && data.length > 0 ? data : null);
      return data;
    } catch (err) {
      console.error("Error fetching current week devotionals:", err);
      return null;
    }
  }, [churchId]);

  const createDevotional = useCallback(async (cId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_family_devotionals")
        .insert({
          church_id: cId,
          created_by: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Family devotional created!");
      await getDevotionals(cId);
      return result;
    } catch (err: any) {
      console.error("Error creating family devotional:", err);
      toast.error(err.message || "Failed to create family devotional");
      return null;
    }
  }, [user, getDevotionals]);

  useEffect(() => {
    if (!churchId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([getDevotionals(), getCurrentWeek()])
      .finally(() => setLoading(false));
  }, [churchId]);

  return {
    devotionals,
    currentWeek,
    loading,
    getDevotionals,
    createDevotional,
    getCurrentWeek,
  };
}
