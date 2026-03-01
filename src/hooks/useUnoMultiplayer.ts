import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface UnoGame {
  id: string;
  room_code: string;
  host_id: string;
  status: "waiting" | "active" | "completed";
  game_mode: string;
  max_players: number;
  game_state: any;
  current_player_index: number;
}

interface UnoPlayer {
  id: string;
  game_id: string;
  user_id: string;
  display_name: string;
  hand: any[];
  score: number;
  player_index: number;
  is_host: boolean;
}

export function useUnoMultiplayer() {
  const { user } = useAuth();
  const [game, setGame] = useState<UnoGame | null>(null);
  const [players, setPlayers] = useState<UnoPlayer[]>([]);
  const [loading, setLoading] = useState(false);

  const generateRoomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  const createGame = useCallback(async (mode: "easy" | "classic", maxPlayers: number) => {
    if (!user) return null;
    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", user.id)
        .maybeSingle();

      const displayName = profile?.display_name || profile?.username || user.email?.split("@")[0] || "Host";
      const roomCode = generateRoomCode();

      const { data: gameData, error: gameError } = await supabase
        .from("uno_games")
        .insert({
          room_code: roomCode,
          host_id: user.id,
          game_mode: mode,
          max_players: maxPlayers,
          status: "waiting",
          game_state: {},
        })
        .select()
        .single();

      if (gameError) throw gameError;

      const { error: playerError } = await supabase
        .from("uno_players")
        .insert({
          game_id: gameData.id,
          user_id: user.id,
          display_name: displayName,
          player_index: 0,
          is_host: true,
        });

      if (playerError) throw playerError;

      setGame(gameData as UnoGame);
      toast.success(`Game created! Room code: ${roomCode}`);
      return gameData as UnoGame;
    } catch (err: any) {
      toast.error(err.message || "Failed to create game");
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const joinGame = useCallback(async (roomCode: string) => {
    if (!user) return null;
    setLoading(true);
    try {
      const { data: gameData, error: findError } = await supabase
        .from("uno_games")
        .select("*")
        .eq("room_code", roomCode.toUpperCase().trim())
        .eq("status", "waiting")
        .single();

      if (findError || !gameData) {
        toast.error("Game not found or already started");
        return null;
      }

      // Check player count
      const { count } = await supabase
        .from("uno_players")
        .select("*", { count: "exact", head: true })
        .eq("game_id", gameData.id);

      if ((count || 0) >= gameData.max_players) {
        toast.error("Game is full");
        return null;
      }

      // Check if already joined
      const { data: existing } = await supabase
        .from("uno_players")
        .select("id")
        .eq("game_id", gameData.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        setGame(gameData as UnoGame);
        toast.info("You're already in this game");
        return gameData as UnoGame;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", user.id)
        .maybeSingle();

      const displayName = profile?.display_name || profile?.username || user.email?.split("@")[0] || "Player";

      const { error: joinError } = await supabase
        .from("uno_players")
        .insert({
          game_id: gameData.id,
          user_id: user.id,
          display_name: displayName,
          player_index: count || 0,
          is_host: false,
        });

      if (joinError) throw joinError;

      setGame(gameData as UnoGame);
      toast.success("Joined the game!");
      return gameData as UnoGame;
    } catch (err: any) {
      toast.error(err.message || "Failed to join game");
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchPlayers = useCallback(async (gameId: string) => {
    const { data } = await supabase
      .from("uno_players")
      .select("*")
      .eq("game_id", gameId)
      .order("player_index");
    if (data) setPlayers(data as UnoPlayer[]);
  }, []);

  const updateGameState = useCallback(async (gameId: string, state: any, status?: string, playerIndex?: number) => {
    const update: any = { game_state: state };
    if (status) update.status = status;
    if (playerIndex !== undefined) update.current_player_index = playerIndex;
    await supabase.from("uno_games").update(update).eq("id", gameId);
  }, []);

  const updatePlayerHand = useCallback(async (playerId: string, hand: any[], score?: number) => {
    const update: any = { hand };
    if (score !== undefined) update.score = score;
    await supabase.from("uno_players").update(update).eq("id", playerId);
  }, []);

  // Realtime subscriptions
  useEffect(() => {
    if (!game?.id) return;

    fetchPlayers(game.id);

    const gameId = game.id;
    const channel = supabase
      .channel(`uno-game-${gameId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "uno_games",
        filter: `id=eq.${gameId}`,
      }, (payload) => {
        if (payload.new) setGame(payload.new as UnoGame);
      })
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "uno_players",
        filter: `game_id=eq.${gameId}`,
      }, () => {
        fetchPlayers(gameId);
      })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("[useUnoMultiplayer] Realtime subscription error for game", gameId);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [game?.id, fetchPlayers]);

  const isHost = user?.id === game?.host_id;

  return {
    game,
    players,
    loading,
    isHost,
    createGame,
    joinGame,
    fetchPlayers,
    updateGameState,
    updatePlayerHand,
    setGame,
  };
}
