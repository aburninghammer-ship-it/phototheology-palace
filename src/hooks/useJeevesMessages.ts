import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Json } from "@/integrations/supabase/types";

export interface JeevesMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

interface UseJeevesMessagesOptions {
  sessionId?: string;
  autoLoad?: boolean;
}

export function useJeevesMessages(options: UseJeevesMessagesOptions = {}) {
  const { sessionId, autoLoad = true } = options;
  const { user } = useAuth();
  const [messages, setMessages] = useState<JeevesMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load messages for a session
  const loadMessages = useCallback(async (targetSessionId?: string) => {
    const sid = targetSessionId || sessionId;
    if (!user || !sid) return [];

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("jeeves_messages")
        .select("*")
        .eq("user_id", user.id)
        .eq("session_id", sid)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const loadedMessages: JeevesMessage[] = (data || []).map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
        metadata: m.metadata as Record<string, unknown>,
        created_at: m.created_at,
      }));

      setMessages(loadedMessages);
      return loadedMessages;
    } catch (err) {
      console.error("Error loading Jeeves messages:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, sessionId]);

  // Save a single message
  const saveMessage = useCallback(async (
    message: JeevesMessage,
    targetSessionId?: string
  ) => {
    const sid = targetSessionId || sessionId;
    if (!user || !sid) return null;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("jeeves_messages")
        .insert({
          user_id: user.id,
          session_id: sid,
          role: message.role,
          content: message.content,
          metadata: (message.metadata || {}) as Json,
        })
        .select()
        .single();

      if (error) throw error;

      // Update study session to mark it has Jeeves history
      await supabase
        .from("study_sessions")
        .update({ has_jeeves_history: true })
        .eq("id", sid);

      const savedMessage: JeevesMessage = {
        id: data.id,
        role: data.role as "user" | "assistant" | "system",
        content: data.content,
        metadata: data.metadata as Record<string, unknown>,
        created_at: data.created_at,
      };

      setMessages((prev) => [...prev, savedMessage]);
      return savedMessage;
    } catch (err) {
      console.error("Error saving Jeeves message:", err);
      return null;
    } finally {
      setSaving(false);
    }
  }, [user, sessionId]);

  // Save multiple messages at once (for bulk sync)
  const saveMessages = useCallback(async (
    messagesToSave: JeevesMessage[],
    targetSessionId?: string
  ) => {
    const sid = targetSessionId || sessionId;
    if (!user || !sid || messagesToSave.length === 0) return false;

    setSaving(true);
    try {
      const records = messagesToSave.map((m) => ({
        user_id: user.id,
        session_id: sid,
        role: m.role,
        content: m.content,
        metadata: (m.metadata || {}) as Json,
      }));

      const { error } = await supabase
        .from("jeeves_messages")
        .insert(records);

      if (error) throw error;

      // Update study session to mark it has Jeeves history
      await supabase
        .from("study_sessions")
        .update({ has_jeeves_history: true })
        .eq("id", sid);

      return true;
    } catch (err) {
      console.error("Error saving Jeeves messages:", err);
      return false;
    } finally {
      setSaving(false);
    }
  }, [user, sessionId]);

  // Clear all messages for a session
  const clearMessages = useCallback(async (targetSessionId?: string) => {
    const sid = targetSessionId || sessionId;
    if (!user || !sid) return false;

    try {
      const { error } = await supabase
        .from("jeeves_messages")
        .delete()
        .eq("user_id", user.id)
        .eq("session_id", sid);

      if (error) throw error;

      setMessages([]);

      // Update study session
      await supabase
        .from("study_sessions")
        .update({ has_jeeves_history: false })
        .eq("id", sid);

      return true;
    } catch (err) {
      console.error("Error clearing Jeeves messages:", err);
      return false;
    }
  }, [user, sessionId]);

  // Add message locally (for optimistic updates)
  const addMessageLocally = useCallback((message: JeevesMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  // Load all user's Jeeves sessions (for history view)
  const loadAllSessions = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from("study_sessions")
        .select("id, title, has_jeeves_history, created_at, updated_at")
        .eq("user_id", user.id)
        .eq("has_jeeves_history", true)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error loading Jeeves sessions:", err);
      return [];
    }
  }, [user]);

  // Auto-load messages when sessionId changes
  useEffect(() => {
    if (autoLoad && sessionId && user) {
      loadMessages();
    }
  }, [sessionId, user, autoLoad, loadMessages]);

  return {
    messages,
    setMessages,
    loading,
    saving,
    loadMessages,
    saveMessage,
    saveMessages,
    clearMessages,
    addMessageLocally,
    loadAllSessions,
  };
}
