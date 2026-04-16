import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useChurchMentorship(churchId?: string) {
  const { user } = useAuth();
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getMyMentorships = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!user || !id) return [];
    try {
      const { data, error } = await (supabase as any)
        .from("church_mentorships")
        .select("*")
        .eq("church_id", id)
        .or(`mentor_id.eq.${user.id},mentee_id.eq.${user.id}`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setMentorships(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching mentorships:", err);
      return [];
    }
  }, [user, churchId]);

  const createMentorship = useCallback(async (cId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_mentorships")
        .insert({
          church_id: cId,
          created_by: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Mentorship created!");
      await getMyMentorships(cId);
      return result;
    } catch (err: any) {
      console.error("Error creating mentorship:", err);
      toast.error(err.message || "Failed to create mentorship");
      return null;
    }
  }, [user, getMyMentorships]);

  const getSessions = useCallback(async (mentorshipId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("church_mentorship_sessions")
        .select("*")
        .eq("mentorship_id", mentorshipId)
        .order("session_date", { ascending: false });
      if (error) throw error;
      setSessions(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching sessions:", err);
      return [];
    }
  }, []);

  const updateSession = useCallback(async (sessionId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_mentorship_sessions")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", sessionId)
        .select()
        .single();
      if (error) throw error;
      toast.success("Session updated!");
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? result : s))
      );
      return result;
    } catch (err: any) {
      console.error("Error updating session:", err);
      toast.error(err.message || "Failed to update session");
      return null;
    }
  }, [user]);

  const completeMilestone = useCallback(async (mentorshipId: string) => {
    if (!user) { toast.error("You must be logged in"); return false; }
    try {
      // Fetch current mentorship to increment milestone count
      const { data: current, error: fetchErr } = await (supabase as any)
        .from("church_mentorships")
        .select("milestones_completed")
        .eq("id", mentorshipId)
        .single();
      if (fetchErr) throw fetchErr;

      const newCount = (current?.milestones_completed || 0) + 1;
      const { error } = await (supabase as any)
        .from("church_mentorships")
        .update({
          milestones_completed: newCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", mentorshipId);
      if (error) throw error;
      toast.success("Milestone completed!");
      setMentorships((prev) =>
        prev.map((m) =>
          m.id === mentorshipId ? { ...m, milestones_completed: newCount } : m
        )
      );
      return true;
    } catch (err: any) {
      console.error("Error completing milestone:", err);
      toast.error(err.message || "Failed to complete milestone");
      return false;
    }
  }, [user]);

  useEffect(() => {
    if (!user || !churchId) { setLoading(false); return; }
    setLoading(true);
    getMyMentorships().finally(() => setLoading(false));
  }, [user, churchId]);

  return {
    mentorships,
    sessions,
    loading,
    getMyMentorships,
    createMentorship,
    getSessions,
    updateSession,
    completeMilestone,
  };
}
