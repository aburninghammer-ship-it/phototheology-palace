import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface GameChatMessage {
  id: string;
  room_id?: string;
  user_id: string;
  display_name: string;
  message: string;
  created_at: string;
}

/**
 * Hook for in-game chat. Two modes:
 * 1. roomId provided → DB-backed realtime chat (multiplayer rooms)
 * 2. gameType provided → broadcast-based ephemeral chat (game lobby)
 */
export function useGameChat(roomId?: string | null, gameType?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<GameChatMessage[]>([]);
  const [displayName, setDisplayName] = useState("Player");

  // Fetch display name
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, username")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setDisplayName(data?.display_name || data?.username || "Player");
      });
  }, [user]);

  // Mode 1: DB-backed (multiplayer room)
  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("game_session_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) setMessages(data as GameChatMessage[]);
    };

    fetchMessages();

    const channel = supabase
      .channel(`game-chat-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "game_session_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as GameChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // Mode 2: Broadcast-based (game lobby, ephemeral)
  useEffect(() => {
    if (roomId || !gameType) return;

    const channel = supabase
      .channel(`game-lobby-${gameType}`)
      .on("broadcast", { event: "chat" }, ({ payload }) => {
        setMessages((prev) => [...prev.slice(-99), payload as GameChatMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, gameType]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!user || !text.trim()) return;

      const msg: GameChatMessage = {
        id: crypto.randomUUID(),
        user_id: user.id,
        display_name: displayName,
        message: text.trim(),
        created_at: new Date().toISOString(),
      };

      if (roomId) {
        // DB insert (realtime subscription handles the update)
        await supabase.from("game_session_messages").insert({
          room_id: roomId,
          user_id: user.id,
          display_name: displayName,
          message: text.trim(),
        });
      } else if (gameType) {
        // Broadcast (ephemeral)
        setMessages((prev) => [...prev.slice(-99), msg]);
        await supabase.channel(`game-lobby-${gameType}`).send({
          type: "broadcast",
          event: "chat",
          payload: msg,
        });
      }
    },
    [roomId, gameType, user, displayName]
  );

  return { messages, sendMessage, displayName };
}
