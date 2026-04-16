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
  | 'story-room'
  | 'parallels-match'
  | 'speed-verse'
  | 'observation-flux'
  | 'symbol-decoder'
  | 'chef-challenge'
  | 'concentration-room'
  | 'five-dimensions'
  | 'sanctuary-blueprint'
  | 'quick-play'
  | 'biblical-parallels'
  | 'sanctuary-run'
  | 'prophecy-timeline'
  | 'time-zone-invasion'
  | 'christ-lock'
  | 'principle-sprint'
  | 'pt-jeopardy'
  | 'pt-family-feud'
  | 'group-study'
  | 'live-study-room'
  | 'branch-study'
  | 'live-demo';

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
  churchId?: string;
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

export function useScheduledGames(churchId?: string): UseScheduledGamesReturn {
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

      // Get scheduled games: future ones + recently past (within 24h) + started ones
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: games, error: gamesError } = await db
        .from('scheduled_games')
        .select('*')
        .gte('scheduled_at', oneDayAgo)
        .in('status', ['scheduled', 'started'])
        .order('scheduled_at', { ascending: true });

      if (gamesError) throw gamesError;

      // Filter by churchId if provided (client-side, since churchId lives in game_options JSONB)
      const filteredGames = churchId
        ? (games || []).filter((g: any) => g.game_options?.churchId === churchId)
        : (games || []);

      // Get RSVP counts and user's RSVP status
      const enrichedGames: ScheduledGame[] = await Promise.all(
        filteredGames.map(async (game: any) => {
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
  }, [user, churchId]);

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

      // Merge churchId into game_options if provided
      const gameOptions = churchId
        ? { ...data.game_options, churchId }
        : data.game_options || null;

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
          game_options: gameOptions,
        })
        .select()
        .single();

      if (error) throw error;

      // --- Secondary operations: don't block game creation if these fail ---
      try {
        // Auto-RSVP the host as going
        await db
          .from('scheduled_game_rsvps')
          .insert({
            scheduled_game_id: game.id,
            user_id: user.id,
            user_name: hostName,
            status: 'going',
          });
      } catch (rsvpErr) {
        console.warn('Auto-RSVP failed (non-critical):', rsvpErr);
      }

      // Build notification details
      const when = new Date(data.scheduled_at);
      const timeStr = when.toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
      });
      const eventTitle = data.title || game.game_type;

      // Fire-and-forget: notifications, community post, broadcast
      Promise.allSettled([
        supabase.from('notifications').insert({
          user_id: user.id,
          type: 'event_scheduled',
          title: '📅 Event Scheduled!',
          message: `"${eventTitle}" scheduled for ${timeStr}`,
          link: '/schedule',
          is_read: false,
        }),
        supabase.from('community_posts').insert({
          user_id: user.id,
          title: `📅 New Event: ${eventTitle}`,
          content: `I just scheduled "${eventTitle}" for ${timeStr}. Head to the Schedule page to RSVP!`,
          category: 'general',
        }),
      ]).catch(err => console.warn('Post-schedule notifications failed:', err));

      // Broadcast to online users (fire-and-forget)
      try {
        const globalChannel = supabase.channel('global-notifications');
        await globalChannel.send({
          type: 'broadcast',
          event: 'event-scheduled',
          payload: {
            title: eventTitle,
            hostName: hostName,
            scheduledAt: data.scheduled_at.toISOString(),
            gameType: game.game_type,
          },
        });
        supabase.removeChannel(globalChannel);
      } catch (broadcastErr) {
        console.warn('Broadcast failed (non-critical):', broadcastErr);
      }

      toast.success('Game scheduled!');
      return game.id;
    } catch (err: any) {
      console.error('Error creating scheduled game:', err);
      toast.error('Failed to schedule game');
      return null;
    }
  }, [user, churchId]);

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

      // Notify the host about the RSVP
      const { data: game } = await db
        .from('scheduled_games')
        .select('host_user_id, title')
        .eq('id', gameId)
        .single();

      if (game && game.host_user_id !== user.id) {
        const rsvpLabel = status === 'going' ? 'is going to' : status === 'maybe' ? 'might attend' : "can't make";
        await db.from('notifications').insert({
          user_id: game.host_user_id,
          type: 'event_rsvp',
          title: '🙋 New RSVP',
          message: `${userName} ${rsvpLabel} "${game.title}"`,
          link: '/schedule',
        });
      }
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
