// Scheduled Games Hook
// Manage scheduled games and RSVPs

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

// Type cast for tables not yet in generated types
const db = supabase as any;

export interface ScheduledGame {
  id: string;
  host_user_id: string;
  host_name: string;
  game_type: string;
  title: string | null;
  description: string | null;
  scheduled_at: string;
  verse_reference: string | null;
  game_mode: string;
  max_players: number;
  status: 'scheduled' | 'started' | 'cancelled' | 'completed';
  room_code: string | null;
  actual_game_id: string | null;
  created_at: string;
  rsvp_count?: number;
  my_rsvp?: 'going' | 'maybe' | 'not_going' | null;
  game_options?: {
    features?: {
      liveAudio?: boolean;
      textFeed?: boolean;
      sparks?: boolean;
      ptCards?: boolean;
      voting?: boolean;
    };
    ptFocus?: string;
    topic?: string;
  } | null;
}

export interface GameRSVP {
  id: string;
  scheduled_game_id: string;
  user_id: string;
  user_name: string;
  status: 'going' | 'maybe' | 'not_going';
  created_at: string;
}

interface UseScheduledGamesReturn {
  scheduledGames: ScheduledGame[];
  isLoading: boolean;
  error: string | null;
  createScheduledGame: (data: CreateScheduledGameData) => Promise<string | null>;
  updateRSVP: (gameId: string, status: 'going' | 'maybe' | 'not_going') => Promise<boolean>;
  removeRSVP: (gameId: string) => Promise<boolean>;
  cancelScheduledGame: (gameId: string) => Promise<boolean>;
  startScheduledGame: (gameId: string, roomCode: string, actualGameId: string) => Promise<boolean>;
  getGameRSVPs: (gameId: string) => Promise<GameRSVP[]>;
  refreshGames: () => void;
}

export type ScheduledEventType =
  | 'scrabble-pt'
  | 'chain-chess'
  | 'principle-cards'
  | 'phototheology-uno'
  | 'escape-dragon'
  | 'escape-room'
  | 'treasure-hunt'
  | 'group-study'
  | 'live-study-room'
  | 'branch-study';

// Game options for studies (features, PT focus, topic)
interface GameOptions {
  features?: {
    liveAudio?: boolean;
    textFeed?: boolean;
    sparks?: boolean;
    ptCards?: boolean;
    voting?: boolean;
  };
  ptFocus?: string;
  topic?: string;
}

interface CreateScheduledGameData {
  title?: string;
  description?: string;
  scheduled_at: Date;
  verse_reference?: string;
  game_mode?: 'ffa' | 'team';
  max_players?: number;
  game_type?: ScheduledEventType;
  game_options?: GameOptions;
}

export function useScheduledGames(): UseScheduledGamesReturn {
  const { user } = useAuth();
  const [scheduledGames, setScheduledGames] = useState<ScheduledGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all upcoming scheduled games
  const fetchGames = useCallback(async () => {
    if (!user) {
      setScheduledGames([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Get scheduled games that haven't passed
      const { data: games, error: gamesError } = await db
        .from('scheduled_games')
        .select('*')
        .gte('scheduled_at', new Date().toISOString())
        .in('status', ['scheduled'])
        .order('scheduled_at', { ascending: true });

      if (gamesError) throw gamesError;

      // Get RSVP counts and user's RSVP status
      const enrichedGames: ScheduledGame[] = await Promise.all(
        (games || []).map(async (game) => {
          // Get RSVP count
          const { count } = await db
            .from('scheduled_game_rsvps')
            .select('*', { count: 'exact', head: true })
            .eq('scheduled_game_id', game.id)
            .eq('status', 'going');

          // Get user's RSVP
          const { data: myRsvp } = await db
            .from('scheduled_game_rsvps')
            .select('status')
            .eq('scheduled_game_id', game.id)
            .eq('user_id', user.id)
            .single();

          return {
            ...game,
            rsvp_count: count || 0,
            my_rsvp: myRsvp?.status || null,
          } as ScheduledGame;
        })
      );

      setScheduledGames(enrichedGames);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching scheduled games:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('scheduled-games-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scheduled_games' },
        () => fetchGames()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scheduled_game_rsvps' },
        () => fetchGames()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchGames]);

  // Create a scheduled game
  const createScheduledGame = useCallback(async (data: CreateScheduledGameData): Promise<string | null> => {
    if (!user) {
      toast.error('Please sign in to schedule a game');
      return null;
    }

    try {
      const hostName = user.email?.split('@')[0] || 'Player';

      const { data: game, error } = await db
        .from('scheduled_games')
        .insert({
          host_user_id: user.id,
          host_name: hostName,
          game_type: data.game_type || 'scrabble-pt',
          title: data.title || null,
          description: data.description || null,
          scheduled_at: data.scheduled_at.toISOString(),
          verse_reference: data.verse_reference || null,
          game_mode: data.game_mode || 'ffa',
          max_players: data.max_players || 10,
          game_options: data.game_options || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-RSVP the host as going
      await db
        .from('scheduled_game_rsvps')
        .insert({
          scheduled_game_id: game.id,
          user_id: user.id,
          user_name: hostName,
          status: 'going',
        });

      // Broadcast notification to all users
      const globalChannel = supabase.channel('global-notifications');
      await globalChannel.send({
        type: 'broadcast',
        event: 'event-scheduled',
        payload: {
          title: data.title || game.game_type,
          hostName: hostName,
          scheduledAt: data.scheduled_at.toISOString(),
          gameType: game.game_type,
        },
      });
      supabase.removeChannel(globalChannel);

      toast.success('Game scheduled!');
      return game.id;
    } catch (err: any) {
      console.error('Error creating scheduled game:', err);
      toast.error('Failed to schedule game');
      return null;
    }
  }, [user]);

  // Update RSVP status
  const updateRSVP = useCallback(async (gameId: string, status: 'going' | 'maybe' | 'not_going'): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to RSVP');
      return false;
    }

    try {
      const userName = user.email?.split('@')[0] || 'Player';

      const { error } = await db
        .from('scheduled_game_rsvps')
        .upsert({
          scheduled_game_id: gameId,
          user_id: user.id,
          user_name: userName,
          status,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'scheduled_game_id,user_id',
        });

      if (error) throw error;

      const statusText = status === 'going' ? "You're going!" : status === 'maybe' ? 'Marked as maybe' : 'Marked as not going';
      toast.success(statusText);
      return true;
    } catch (err: any) {
      console.error('Error updating RSVP:', err);
      toast.error('Failed to update RSVP');
      return false;
    }
  }, [user]);

  // Remove RSVP
  const removeRSVP = useCallback(async (gameId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await db
        .from('scheduled_game_rsvps')
        .delete()
        .eq('scheduled_game_id', gameId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('RSVP removed');
      return true;
    } catch (err: any) {
      console.error('Error removing RSVP:', err);
      toast.error('Failed to remove RSVP');
      return false;
    }
  }, [user]);

  // Cancel a scheduled game (host only)
  const cancelScheduledGame = useCallback(async (gameId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await db
        .from('scheduled_games')
        .update({ status: 'cancelled' })
        .eq('id', gameId)
        .eq('host_user_id', user.id);

      if (error) throw error;
      toast.success('Game cancelled');
      return true;
    } catch (err: any) {
      console.error('Error cancelling game:', err);
      toast.error('Failed to cancel game');
      return false;
    }
  }, [user]);

  // Start a scheduled game (host only)
  const startScheduledGame = useCallback(async (
    gameId: string,
    roomCode: string,
    actualGameId: string
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await db
        .from('scheduled_games')
        .update({
          status: 'started',
          room_code: roomCode,
          actual_game_id: actualGameId,
        })
        .eq('id', gameId)
        .eq('host_user_id', user.id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error starting scheduled game:', err);
      toast.error('Failed to start game');
      return false;
    }
  }, [user]);

  // Get RSVPs for a specific game
  const getGameRSVPs = useCallback(async (gameId: string): Promise<GameRSVP[]> => {
    try {
      const { data, error } = await db
        .from('scheduled_game_rsvps')
        .select('*')
        .eq('scheduled_game_id', gameId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data as GameRSVP[]) || [];
    } catch (err: any) {
      console.error('Error fetching RSVPs:', err);
      return [];
    }
  }, []);

  return {
    scheduledGames,
    isLoading,
    error,
    createScheduledGame,
    updateRSVP,
    removeRSVP,
    cancelScheduledGame,
    startScheduledGame,
    getGameRSVPs,
    refreshGames: fetchGames,
  };
}
