import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useChurchCare(churchId?: string) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [myResponses, setMyResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getRequests = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!id) return [];
    try {
      const { data, error } = await (supabase as any)
        .from("church_care_requests")
        .select("*")
        .eq("church_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRequests(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching care requests:", err);
      return [];
    }
  }, [churchId]);

  const createRequest = useCallback(async (cId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_care_requests")
        .insert({
          church_id: cId,
          requested_by: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Care request submitted");
      await getRequests(cId);
      return result;
    } catch (err: any) {
      console.error("Error creating care request:", err);
      toast.error(err.message || "Failed to submit care request");
      return null;
    }
  }, [user, getRequests]);

  const respondToRequest = useCallback(async (requestId: string, data: any) => {
    if (!user) { toast.error("You must be logged in"); return null; }
    try {
      const { data: result, error } = await (supabase as any)
        .from("church_care_responses")
        .insert({
          request_id: requestId,
          responder_id: user.id,
          ...data,
        })
        .select()
        .single();
      if (error) throw error;
      toast.success("Response submitted");
      return result;
    } catch (err: any) {
      console.error("Error responding to request:", err);
      toast.error(err.message || "Failed to submit response");
      return null;
    }
  }, [user]);

  const getMyResponses = useCallback(async (cId?: string) => {
    const id = cId || churchId;
    if (!user || !id) return [];
    try {
      const { data, error } = await (supabase as any)
        .from("church_care_responses")
        .select("*, church_care_requests(*)")
        .eq("responder_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setMyResponses(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching my responses:", err);
      return [];
    }
  }, [user, churchId]);

  const updateRequestStatus = useCallback(async (id: string, status: string) => {
    if (!user) { toast.error("You must be logged in"); return false; }
    try {
      const { error } = await (supabase as any)
        .from("church_care_requests")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      toast.success(`Request marked as ${status}`);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      return true;
    } catch (err: any) {
      console.error("Error updating request status:", err);
      toast.error(err.message || "Failed to update status");
      return false;
    }
  }, [user]);

  useEffect(() => {
    if (!churchId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([getRequests(), getMyResponses()])
      .finally(() => setLoading(false));
  }, [user, churchId]);

  return {
    requests,
    myResponses,
    loading,
    getRequests,
    createRequest,
    respondToRequest,
    getMyResponses,
    updateRequestStatus,
  };
}
