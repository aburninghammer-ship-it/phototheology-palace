import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useChurchMinistries(churchId?: string) {
  const { user } = useAuth();
  const [ministries, setMinistries] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [mySignups, setMySignups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getMinistries = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!id) return [];
    try {
      const { data, error } = await (supabase as any)
        .from("church_ministries")
        .select("*")
        .eq("church_id", id)
        .order("name", { ascending: true });
      if (error) throw error;
      setMinistries(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching ministries:", err);
      return [];
    }
  }, [churchId]);

  const getSlots = useCallback(async (ministryId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("church_ministry_slots")
        .select("*")
        .eq("ministry_id", ministryId)
        .order("slot_date", { ascending: true });
      if (error) throw error;
      setSlots(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching slots:", err);
      return [];
    }
  }, []);

  const getMySignups = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!user || !id) return [];
    try {
      const { data, error } = await (supabase as any)
        .from("church_ministry_signups")
        .select("*, church_ministry_slots(*), church_ministries(*)")
        .eq("user_id", user.id);
      if (error) throw error;
      setMySignups(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching my signups:", err);
      return [];
    }
  }, [user, churchId]);

  const signUp = useCallback(async (slotId: string, ministryId: string) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data, error } = await (supabase as any)
        .from("church_ministry_signups")
        .insert({
          slot_id: slotId,
          ministry_id: ministryId,
          user_id: user.id,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Signed up for ministry slot!");
      await getMySignups();
      return data;
    } catch (err: any) {
      console.error("Error signing up:", err);
      toast.error(err.message || "Failed to sign up");
      return null;
    }
  }, [user, getMySignups]);

  const cancelSignup = useCallback(async (signupId: string) => {
    if (!user) { toast.error("You must be logged in"); return false; }
    try {
      const { error } = await (supabase as any)
        .from("church_ministry_signups")
        .delete()
        .eq("id", signupId)
        .eq("user_id", user.id);
      if (error) throw error;
      toast.success("Signup cancelled");
      setMySignups((prev) => prev.filter((s) => s.id !== signupId));
      return true;
    } catch (err: any) {
      console.error("Error cancelling signup:", err);
      toast.error(err.message || "Failed to cancel signup");
      return false;
    }
  }, [user]);

  const createMinistry = useCallback(async (cId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_ministries")
        .insert({
          church_id: cId,
          created_by: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Ministry created!");
      await getMinistries(cId);
      return result;
    } catch (err: any) {
      console.error("Error creating ministry:", err);
      toast.error(err.message || "Failed to create ministry");
      return null;
    }
  }, [user, getMinistries]);

  const createSlot = useCallback(async (ministryId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_ministry_slots")
        .insert({
          ministry_id: ministryId,
          created_by: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Slot created!");
      await getSlots(ministryId);
      return result;
    } catch (err: any) {
      console.error("Error creating slot:", err);
      toast.error(err.message || "Failed to create slot");
      return null;
    }
  }, [user, getSlots]);

  useEffect(() => {
    if (!churchId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([getMinistries(), getMySignups()])
      .finally(() => setLoading(false));
  }, [user, churchId]);

  return {
    ministries,
    slots,
    mySignups,
    loading,
    getMinistries,
    getSlots,
    signUp,
    cancelSignup,
    getMySignups,
    createMinistry,
    createSlot,
  };
}
