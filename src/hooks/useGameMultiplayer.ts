import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface GameRoom {
  id: string;
  room_code: string;
  game_type: string;
  host_id: string;
  status: "waiting" | "active" | "completed";
  game_state: any;
  max_players: number;
  settings: any;
  current_turn_user_id: string | null;
  winner_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GameRoomPlayer {
  id: string;
  room_id: string;
  user_id: string;
  display_name: string;
  player_index: number;
  player_data: any;
  score: number;
  is_active: boolean;
  joined_at: string;
}

const generateRoomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

export function useGameMultiplayer(gameType: string) {
  const { user } = useAuth();
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<GameRoomPlayer[]>([]);
  const [loading, setLoading] = useState(false);

  const getDisplayName = useCallback(async () => {
    if (!user) return "Player";
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, username")
      .eq("id", user.id)
      .maybeSingle();
    return profile?.display_name || profile?.username || user.email?.split("@")[0] || "Player";
  }, [user]);

  const createRoom = useCallback(async (maxPlayers = 2, settings: any = {}) => {
    if (!user) return null;
    setLoading(true);
    try {
      const displayName = await getDisplayName();
      const roomCode = generateRoomCode();

      const { data: roomData, error: roomError } = await supabase
        .from("game_rooms")
        .insert({
          room_code: roomCode,
          game_type: gameType,
          host_id: user.id,
          max_players: maxPlayers,
          status: "waiting",
          game_state: {},
          settings,
        })
        .select()
        .single();

      if (roomError) throw roomError;

      const { error: playerError } = await supabase
        .from("game_room_players")
        .insert({
          room_id: roomData.id,
          user_id: user.id,
          display_name: displayName,
          player_index: 0,
        });

      if (playerError) throw playerError;

      setRoom(roomData as GameRoom);
      toast.success(`Room created! Code: ${roomCode}`);
      return roomData as GameRoom;
    } catch (err: any) {
      toast.error(err.message || "Failed to create room");
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, gameType, getDisplayName]);

  const joinRoom = useCallback(async (roomCode: string) => {
    if (!user) return null;
    setLoading(true);
    try {
      const { data: roomData, error: findError } = await supabase
        .from("game_rooms")
        .select("*")
        .eq("room_code", roomCode.toUpperCase().trim())
        .eq("game_type", gameType)
        .eq("status", "waiting")
        .single();

      if (findError || !roomData) {
        toast.error("Room not found or already started");
        return null;
      }

      const { count } = await supabase
        .from("game_room_players")
        .select("*", { count: "exact", head: true })
        .eq("room_id", roomData.id);

      if ((count || 0) >= roomData.max_players) {
        toast.error("Room is full");
        return null;
      }

      const { data: existing } = await supabase
        .from("game_room_players")
        .select("id")
        .eq("room_id", roomData.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        setRoom(roomData as GameRoom);
        toast.info("You're already in this room");
        return roomData as GameRoom;
      }

      const displayName = await getDisplayName();

      const { error: joinError } = await supabase
        .from("game_room_players")
        .insert({
          room_id: roomData.id,
          user_id: user.id,
          display_name: displayName,
          player_index: count || 0,
        });

      if (joinError) throw joinError;

      setRoom(roomData as GameRoom);
      toast.success("Joined the room!");
      return roomData as GameRoom;
    } catch (err: any) {
      toast.error(err.message || "Failed to join room");
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, gameType, getDisplayName]);

  const fetchPlayers = useCallback(async (roomId: string) => {
    const { data, error } = await supabase
      .from("game_room_players")
      .select("*")
      .eq("room_id", roomId)
      .order("player_index");

    if (error) {
      console.error("[useGameMultiplayer] Failed to fetch players:", error);
      return;
    }

    if (data) setPlayers(data as GameRoomPlayer[]);
  }, []);

  const fetchRoom = useCallback(async (roomId: string) => {
    const { data, error } = await supabase
      .from("game_rooms")
      .select("*")
      .eq("id", roomId)
      .maybeSingle();

    if (error) {
      console.error("[useGameMultiplayer] Failed to fetch room:", error);
      return null;
    }

    if (data) setRoom(data as GameRoom);
    return (data as GameRoom) ?? null;
  }, []);

  const updateGameState = useCallback(async (
    newState: any,
    currentTurnUserId?: string | null,
    status?: string,
    winnerUserId?: string | null
  ) => {
    if (!room) return;

    const update: any = { game_state: newState, updated_at: new Date().toISOString() };
    if (currentTurnUserId !== undefined) update.current_turn_user_id = currentTurnUserId;
    if (status) update.status = status;
    if (winnerUserId !== undefined) update.winner_user_id = winnerUserId;

    const { data, error } = await supabase
      .from("game_rooms")
      .update(update)
      .eq("id", room.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (data) setRoom(data as GameRoom);
  }, [room]);

  const updatePlayerData = useCallback(async (playerId: string, playerData: any, score?: number) => {
    const update: any = { player_data: playerData };
    if (score !== undefined) update.score = score;
    await supabase.from("game_room_players").update(update).eq("id", playerId);
  }, []);

  const startGame = useCallback(async (initialState: any, firstPlayerUserId: string) => {
    if (!room) return;

    const { data, error } = await supabase
      .from("game_rooms")
      .update({
        status: "active",
        game_state: initialState,
        current_turn_user_id: firstPlayerUserId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", room.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (data) setRoom(data as GameRoom);
  }, [room]);

  const leaveRoom = useCallback(async () => {
    if (!room || !user) return;
    await supabase.from("game_room_players").delete().eq("room_id", room.id).eq("user_id", user.id);
    setRoom(null);
    setPlayers([]);
  }, [room, user]);

  // Realtime subscriptions + polling fallback for missed events
  useEffect(() => {
    if (!room?.id) return;

    const roomId = room.id;

    const syncRoomSnapshot = async () => {
      await Promise.all([fetchRoom(roomId), fetchPlayers(roomId)]);
    };

    void syncRoomSnapshot();

    const channel = supabase
      .channel(`game-room-${roomId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "game_rooms",
        filter: `id=eq.${roomId}`,
      }, (payload) => {
        if (payload.new) setRoom(payload.new as GameRoom);
      })
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "game_room_players",
        filter: `room_id=eq.${roomId}`,
      }, () => {
        void syncRoomSnapshot();
      })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          console.error("[useGameMultiplayer] Realtime status issue for room", roomId, status);
          void syncRoomSnapshot();
        }
      });

    const pollInterval = setInterval(() => {
      void syncRoomSnapshot();
    }, 2500);

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [room?.id, fetchPlayers, fetchRoom]);

  const isHost = user?.id === room?.host_id;
  const isMyTurn = user?.id === room?.current_turn_user_id;
  const myPlayer = players.find(p => p.user_id === user?.id);

  return {
    room,
    players,
    loading,
    isHost,
    isMyTurn,
    myPlayer,
    createRoom,
    joinRoom,
    startGame,
    leaveRoom,
    updateGameState,
    updatePlayerData,
    setRoom,
  };
}
