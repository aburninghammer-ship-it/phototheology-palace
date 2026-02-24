import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface SMSRecipient {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  phone_country_code: string;
  plan_id: string | null;
  is_active: boolean;
  opted_out_at: string | null;
  opt_out_reason: string | null;
  last_sms_sent_at: string | null;
  total_sms_sent: number;
  last_delivery_status: string | null;
  timezone: string;
  preferred_send_hour: number;
  created_at: string;
  updated_at: string;
}

export interface SMSSendLog {
  id: string;
  user_id: string | null;
  recipient_type: 'profile' | 'standalone';
  recipient_id: string | null;
  phone_number: string;
  plan_id: string | null;
  day_number: number | null;
  message_type: string;
  message_body: string | null;
  twilio_sid: string | null;
  status: string | null;
  error_code: string | null;
  error_message: string | null;
  segments: number;
  price: number | null;
  sent_at: string;
  delivered_at: string | null;
  created_at: string;
}

export function useSMSRecipients(planId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch SMS recipients (optionally filtered by plan)
  const { data: recipients, isLoading } = useQuery({
    queryKey: ["sms-recipients", user?.id, planId],
    queryFn: async () => {
      let query = (supabase as any)
        .from("sms_devotional_recipients")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (planId) {
        query = query.eq("plan_id", planId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SMSRecipient[];
    },
    enabled: !!user?.id,
  });

  // Fetch SMS send history
  const { data: sendHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["sms-send-history", user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("sms_send_log")
        .select("*")
        .eq("user_id", user?.id)
        .order("sent_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as SMSSendLog[];
    },
    enabled: !!user?.id,
  });

  // Fetch today's SMS sends
  const { data: todaysSends, isLoading: todayLoading } = useQuery({
    queryKey: ["sms-today-sends", user?.id],
    queryFn: async () => {
      // Get start of today in UTC
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const { data, error } = await (supabase as any)
        .from("sms_send_log")
        .select("*")
        .eq("user_id", user?.id)
        .eq("message_type", "devotional")
        .gte("sent_at", todayISO)
        .order("sent_at", { ascending: false });

      if (error) throw error;
      return data as SMSSendLog[];
    },
    enabled: !!user?.id,
    refetchInterval: 60000, // Refresh every minute
  });

  // Add a new SMS recipient
  const addRecipient = useMutation({
    mutationFn: async (data: {
      name: string;
      phone_number: string;
      phone_country_code?: string;
      plan_id?: string;
      timezone?: string;
      preferred_send_hour?: number;
    }) => {
      // Clean phone number (remove formatting)
      const cleanPhone = data.phone_number.replace(/\D/g, '');

      const { data: saved, error } = await (supabase as any)
        .from("sms_devotional_recipients")
        .insert({
          user_id: user?.id,
          name: data.name,
          phone_number: cleanPhone,
          phone_country_code: data.phone_country_code || '+1',
          plan_id: data.plan_id || null,
          timezone: data.timezone || 'America/New_York',
          preferred_send_hour: data.preferred_send_hour ?? 8,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error("This phone number is already added");
        }
        throw error;
      }
      return saved;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sms-recipients"] });
      toast.success("SMS recipient added");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add recipient");
    },
  });

  // Update a recipient
  const updateRecipient = useMutation({
    mutationFn: async (data: {
      id: string;
      name?: string;
      phone_number?: string;
      phone_country_code?: string;
      plan_id?: string | null;
      is_active?: boolean;
    }) => {
      const updateData: any = { ...data };
      delete updateData.id;

      // Clean phone number if provided
      if (updateData.phone_number) {
        updateData.phone_number = updateData.phone_number.replace(/\D/g, '');
      }

      const { data: updated, error } = await (supabase as any)
        .from("sms_devotional_recipients")
        .update(updateData)
        .eq("id", data.id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sms-recipients"] });
      toast.success("Recipient updated");
    },
    onError: () => {
      toast.error("Failed to update recipient");
    },
  });

  // Delete a recipient
  const deleteRecipient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("sms_devotional_recipients")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sms-recipients"] });
      toast.success("Recipient removed");
    },
    onError: () => {
      toast.error("Failed to remove recipient");
    },
  });

  // Toggle active status
  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await (supabase as any)
        .from("sms_devotional_recipients")
        .update({
          is_active: isActive,
          opted_out_at: isActive ? null : new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ["sms-recipients"] });
      toast.success(isActive ? "SMS enabled" : "SMS disabled");
    },
  });

  // Get stats
  const activeCount = recipients?.filter(r => r.is_active && !r.opted_out_at).length || 0;
  const totalSent = recipients?.reduce((sum, r) => sum + (r.total_sms_sent || 0), 0) || 0;

  return {
    recipients,
    isLoading,
    sendHistory,
    historyLoading,
    todaysSends,
    todayLoading,
    addRecipient,
    updateRecipient,
    deleteRecipient,
    toggleActive,
    activeCount,
    totalSent,
  };
}
