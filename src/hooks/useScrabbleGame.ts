// PT Scrabble Game Hook - Multiplayer Version
// Real-time multiplayer with Supabase

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';
import type {
  ScrabbleGame,
  ScrabblePlayer,
  ScrabbleMove,
  ScrabbleCard,
  PlacedCard,
  BoardPosition,
  Connection,
} from '@/types/scrabble';
import {
  positionKey,
  isValidPlacement,
  getValidPlacements,
  calculateScore,
} from '@/types/scrabble';
import { getCardById, dealCards, getAllScrabbleCards } from '@/data/scrabbleCards';

interface UseScrabbleGameReturn {
  game: ScrabbleGame | null;
  players: ScrabblePlayer[];
  myPlayer: ScrabblePlayer | null;
  myHand: ScrabbleCard[];
  pendingMoves: ScrabbleMove[];
  myVotes: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;

  // Actions
  createGame: (gameMode: 'ffa' | 'team', maxPlayers?: number) => Promise<string | null>;
  joinGame: (roomCode: string) => Promise<boolean>;
  startGame: () => Promise<boolean>;
  placeCard: (
    card: ScrabbleCard,
    position: BoardPosition,
    connections: Connection[],
    explanation: string,
    isChristConnection: boolean
  ) => Promise<boolean>;
  vote: (moveId: string, approve: boolean) => Promise<boolean>;
  leaveGame: () => Promise<void>;

  // Helpers
  getValidPositions: () => BoardPosition[];
  getAdjacentCards: (position: BoardPosition) => PlacedCard[];
  canPlaceAt: (position: BoardPosition) => boolean;
  isPositionPending: (position: BoardPosition) => boolean;
}

// Generate a random room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function useScrabbleGame(gameId?: string): UseScrabbleGameReturn {
  const { user } = useAuth();
  const [game, setGame] = useState<ScrabbleGame | null>(null);
  const [players, setPlayers] = useState<ScrabblePlayer[]>([]);
  const [pendingMoves, setPendingMoves] = useState<ScrabbleMove[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);

  // Derive myPlayer and myHand
  const myPlayer = players.find(p => p.id === myPlayerId) || null;
  const myHand: ScrabbleCard[] = myPlayer?.hand || [];

  // Load game if gameId provided
  useEffect(() => {
    if (gameId) {
      loadGame(gameId);
    }
  }, [gameId]);

  // Subscribe to realtime updates when game exists
  useEffect(() => {
    if (!game?.id) return;

    const channel = supabase
      .channel(`scrabble-${game.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pt_scrabble_games', filter: `id=eq.${game.id}` },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            const updated = payload.new as any;
            setGame(prev => prev ? {
              ...prev,
              status: updated.status,
              boardState: updated.board_state || {},
              deckRemaining: updated.deck_remaining || [],
              startedAt: updated.started_at,
              endedAt: updated.ended_at,
            } : null);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pt_scrabble_players', filter: `game_id=eq.${game.id}` },
        () => {
          // Reload players on any change
          loadPlayers(game.id);
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'pt_scrabble_moves', filter: `game_id=eq.${game.id}` },
        () => {
          // Reload game state when new move is made
          loadGame(game.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [game?.id]);

  const loadGame = async (id: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('pt_scrabble_games')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Game not found');

      setGame({
        id: data.id,
        roomCode: data.room_code,
        hostUserId: data.host_user_id,
        status: data.status as any,
        gameMode: data.game_mode as any,
        maxPlayers: data.max_players,
        seedCardId: data.seed_card_id,
        boardState: (data.board_state as unknown as Record<string, PlacedCard>) || {},
        deckRemaining: data.deck_remaining || [],
        voteTimeoutSeconds: data.vote_timeout_seconds,
        createdAt: data.created_at,
        startedAt: data.started_at || undefined,
        endedAt: data.ended_at || undefined,
      });

      await loadPlayers(id);
    } catch (err: any) {
      console.error('Error loading game:', err);
      setError(err.message);
    }
  };

  const loadPlayers = async (gameId: string) => {
    try {
      console.log('[loadPlayers] Loading players for game:', gameId);
      const { data, error: fetchError } = await supabase
        .from('pt_scrabble_players')
        .select('*')
        .eq('game_id', gameId)
        .order('joined_at');

      if (fetchError) throw fetchError;
      console.log('[loadPlayers] Found', data?.length || 0, 'players');

      const mappedPlayers: ScrabblePlayer[] = (data || []).map(p => ({
        id: p.id,
        gameId: p.game_id,
        userId: p.user_id,
        teamId: p.team_id || undefined,
        displayName: p.display_name,
        avatarUrl: p.avatar_url || undefined,
        hand: ((p.hand as any[]) || []).map((cardData: any) => {
          // Try to get full card data, fall back to stored data with defaults
          const fullCard = getCardById(cardData.id);
          if (fullCard) return fullCard;
          // Reconstruct card with stored data plus defaults
          return {
            id: cardData.id,
            code: cardData.code || 'UNK',
            name: cardData.name || 'Unknown Card',
            floor: cardData.floor || 1,
            category: cardData.category || 'Unknown',
            icon: cardData.icon || 'HelpCircle',
            tags: cardData.tags || [],
            description: cardData.description || '',
          };
        }).filter(Boolean),
        score: p.score,
        cardsPlayed: p.cards_played,
        isConnected: p.is_connected,
        joinedAt: p.joined_at,
        lastSeenAt: p.last_seen_at,
      }));

      console.log('[loadPlayers] Mapped players:', mappedPlayers.map(p => ({
        name: p.displayName,
        handSize: p.hand.length,
        score: p.score,
      })));

      setPlayers(mappedPlayers);

      // Find my player
      if (user) {
        const me = mappedPlayers.find(p => p.userId === user.id);
        if (me) {
          console.log('[loadPlayers] Found my player:', me.displayName, 'with', me.hand.length, 'cards');
          setMyPlayerId(me.id);
        }
      }
    } catch (err: any) {
      console.error('Error loading players:', err);
    }
  };

  // Create a new game
  const createGame = useCallback(async (
    gameMode: 'ffa' | 'team',
    maxPlayers: number = 10
  ): Promise<string | null> => {
    if (!user) {
      toast.error('Please sign in to create a game');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const roomCode = generateRoomCode();
      const allCards = getAllScrabbleCards();
      const midFloorCards = allCards.filter(c => c.floor >= 2 && c.floor <= 5);
      const seedCard = midFloorCards[Math.floor(Math.random() * midFloorCards.length)];

      // Create game in database
      const { data: gameData, error: gameError } = await supabase
        .from('pt_scrabble_games')
        .insert({
          room_code: roomCode,
          host_user_id: user.id,
          status: 'waiting',
          game_mode: gameMode,
          max_players: maxPlayers,
          seed_card_id: seedCard.id,
          board_state: {},
          deck_remaining: [],
        })
        .select()
        .single();

      if (gameError) throw gameError;

      // Get display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single();

      // Add host as first player
      const { data: playerData, error: playerError } = await supabase
        .from('pt_scrabble_players')
        .insert({
          game_id: gameData.id,
          user_id: user.id,
          display_name: profile?.display_name || user.email?.split('@')[0] || 'Player',
          avatar_url: profile?.avatar_url,
          hand: [],
          score: 0,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      setGame({
        id: gameData.id,
        roomCode: gameData.room_code,
        hostUserId: gameData.host_user_id,
        status: 'waiting',
        gameMode,
        maxPlayers,
        seedCardId: seedCard.id,
        boardState: {},
        deckRemaining: [],
        voteTimeoutSeconds: 30,
        createdAt: gameData.created_at,
      });

      setPlayers([{
        id: playerData.id,
        gameId: gameData.id,
        userId: user.id,
        displayName: profile?.display_name || 'Player',
        avatarUrl: profile?.avatar_url || undefined,
        hand: [],
        score: 0,
        cardsPlayed: 0,
        isConnected: true,
        joinedAt: playerData.joined_at,
        lastSeenAt: playerData.last_seen_at,
      }]);

      setMyPlayerId(playerData.id);
      toast.success(`Game created! Room code: ${roomCode}`);
      return gameData.id;
    } catch (err: any) {
      console.error('Error creating game:', err);
      setError(err.message);
      toast.error('Failed to create game');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Join an existing game
  const joinGame = useCallback(async (roomCode: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to join a game');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Find game by room code
      const { data: gameData, error: gameError } = await supabase
        .from('pt_scrabble_games')
        .select('*')
        .eq('room_code', roomCode.toUpperCase())
        .single();

      if (gameError || !gameData) {
        toast.error('Game not found');
        return false;
      }

      if (gameData.status !== 'waiting') {
        toast.error('Game has already started');
        return false;
      }

      // Check if already in game
      const { data: existingPlayer } = await supabase
        .from('pt_scrabble_players')
        .select('id')
        .eq('game_id', gameData.id)
        .eq('user_id', user.id)
        .single();

      if (existingPlayer) {
        // Already in game, just load it
        await loadGame(gameData.id);
        setMyPlayerId(existingPlayer.id);
        toast.success('Rejoined game!');
        return true;
      }

      // Check player count
      const { count } = await supabase
        .from('pt_scrabble_players')
        .select('*', { count: 'exact', head: true })
        .eq('game_id', gameData.id);

      if ((count || 0) >= gameData.max_players) {
        toast.error('Game is full');
        return false;
      }

      // Get display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single();

      // Join game
      const { data: playerData, error: playerError } = await supabase
        .from('pt_scrabble_players')
        .insert({
          game_id: gameData.id,
          user_id: user.id,
          display_name: profile?.display_name || user.email?.split('@')[0] || 'Player',
          avatar_url: profile?.avatar_url,
          hand: [],
          score: 0,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      setMyPlayerId(playerData.id);
      await loadGame(gameData.id);
      toast.success('Joined game!');
      return true;
    } catch (err: any) {
      console.error('Error joining game:', err);
      setError(err.message);
      toast.error('Failed to join game');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Start the game (host only)
  const startGame = useCallback(async (): Promise<boolean> => {
    if (!game || !user) {
      toast.error('No game to start');
      return false;
    }

    if (game.hostUserId !== user.id) {
      toast.error('Only the host can start the game');
      return false;
    }

    // Ensure players are loaded
    if (players.length === 0) {
      toast.error('No players in game');
      return false;
    }

    setIsLoading(true);

    try {
      console.log('[startGame] Starting game with', players.length, 'players');

      // Deal cards to all players
      const cardsPerPlayer = 10;
      const { hands, deck, seedCard } = dealCards(players.length, cardsPerPlayer);
      console.log('[startGame] Dealt', hands.length, 'hands, deck has', deck.length, 'cards, seed:', seedCard.code);

      // Create initial board with seed card
      const initialBoard: Record<string, PlacedCard> = {
        '0,0': {
          card: seedCard,
          position: { x: 0, y: 0 },
          playerId: 'system',
          playerName: 'Game Start',
          connections: [],
          timestamp: new Date().toISOString(),
          moveId: 'seed',
        },
      };

      // Update each player's hand in database
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const playerHand = hands[i] || [];
        
        await supabase
          .from('pt_scrabble_players')
          .update({
            hand: playerHand.map(c => ({ id: c.id, code: c.code, name: c.name, floor: c.floor })),
          })
          .eq('id', player.id);
      }

      // Update game state
      const { error: updateError } = await supabase
        .from('pt_scrabble_games')
        .update({
          status: 'playing',
          board_state: JSON.parse(JSON.stringify(initialBoard)) as Json,
          deck_remaining: deck.map(c => c.id),
          started_at: new Date().toISOString(),
        })
        .eq('id', game.id);

      if (updateError) throw updateError;

      // Update local state immediately for responsive UI
      setGame(prev => prev ? {
        ...prev,
        status: 'playing',
        boardState: initialBoard,
        deckRemaining: deck.map(c => c.id),
        startedAt: new Date().toISOString(),
      } : null);

      setPlayers(prev => prev.map((p, i) => ({
        ...p,
        hand: hands[i] || [],
      })));

      // Reload from database to ensure we have the correct state
      // This prevents race conditions with realtime subscriptions
      console.log('[startGame] Waiting for DB propagation...');
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('[startGame] Reloading players...');
      await loadPlayers(game.id);
      console.log('[startGame] Players reloaded, game started successfully');

      toast.success('Game started!');
      return true;
    } catch (err: any) {
      console.error('Error starting game:', err);
      setError(err.message);
      toast.error('Failed to start game');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [game, user, players]);

  // Place a card on the board
  const placeCard = useCallback(async (
    card: ScrabbleCard,
    position: BoardPosition,
    connections: Connection[],
    explanation: string,
    isChristConnection: boolean
  ): Promise<boolean> => {
    if (!game || !myPlayer) {
      toast.error('Not in a game');
      return false;
    }

    if (game.status !== 'playing') {
      toast.error('Game is not active');
      return false;
    }

    const posKey = positionKey(position);
    
    const { valid } = isValidPlacement(position, game.boardState);
    if (!valid) {
      toast.error('Invalid placement position');
      return false;
    }

    if (connections.length === 0) {
      toast.error('Must explain at least one connection');
      return false;
    }

    setIsLoading(true);

    try {
      const pointsAwarded = calculateScore(connections.length, isChristConnection);

      const placedCard: PlacedCard = {
        card,
        position,
        playerId: myPlayer.id,
        playerName: myPlayer.displayName,
        connections,
        timestamp: new Date().toISOString(),
        moveId: `move-${Date.now()}`,
      };

      // Create move record
      await supabase
        .from('pt_scrabble_moves')
        .insert([{
          game_id: game.id,
          player_id: myPlayer.id,
          card_id: card.id,
          card_code: card.code,
          card_name: card.name,
          position_x: position.x,
          position_y: position.y,
          connections: JSON.parse(JSON.stringify(connections)) as Json,
          explanation,
          is_christ_connection: isChristConnection,
          points_base: pointsAwarded,
          points_awarded: pointsAwarded,
          validation_status: 'approved',
        }]);

      // Update board state
      const newBoard = {
        ...game.boardState,
        [posKey]: placedCard,
      };

      // Draw new card if deck has cards
      let newHand = myPlayer.hand.filter(c => c.id !== card.id);
      let newDeck = [...game.deckRemaining];
      
      if (newDeck.length > 0) {
        const newCardId = newDeck.shift()!;
        const newCard = getCardById(newCardId);
        if (newCard) {
          newHand = [...newHand, newCard];
        }
      }

      // Update game board
      await supabase
        .from('pt_scrabble_games')
        .update({
          board_state: JSON.parse(JSON.stringify(newBoard)) as Json,
          deck_remaining: newDeck,
        })
        .eq('id', game.id);

      // Update player's hand and score
      await supabase
        .from('pt_scrabble_players')
        .update({
          hand: newHand.map(c => ({ id: c.id, code: c.code, name: c.name, floor: c.floor })),
          score: myPlayer.score + pointsAwarded,
          cards_played: myPlayer.cardsPlayed + 1,
        })
        .eq('id', myPlayer.id);

      // Update local state
      setGame(prev => prev ? {
        ...prev,
        boardState: newBoard,
        deckRemaining: newDeck,
      } : null);

      setPlayers(prev => prev.map(p => {
        if (p.id !== myPlayer.id) return p;
        return {
          ...p,
          hand: newHand,
          score: p.score + pointsAwarded,
          cardsPlayed: p.cardsPlayed + 1,
        };
      }));

      toast.success(`+${pointsAwarded} points!`);
      return true;
    } catch (err: any) {
      console.error('Error placing card:', err);
      setError(err.message);
      toast.error('Failed to place card');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [game, myPlayer]);

  // Vote on a move
  const vote = useCallback(async (moveId: string, approve: boolean): Promise<boolean> => {
    if (!myPlayer) return false;

    try {
      await supabase
        .from('pt_scrabble_votes')
        .insert({
          move_id: moveId,
          player_id: myPlayer.id,
          vote: approve,
        });

      setMyVotes(prev => ({ ...prev, [moveId]: approve }));
      return true;
    } catch (err: any) {
      console.error('Error voting:', err);
      return false;
    }
  }, [myPlayer]);

  // Leave game
  const leaveGame = useCallback(async (): Promise<void> => {
    if (myPlayer && game) {
      try {
        await supabase
          .from('pt_scrabble_players')
          .delete()
          .eq('id', myPlayer.id);
      } catch (err) {
        console.error('Error leaving game:', err);
      }
    }

    setGame(null);
    setPlayers([]);
    setPendingMoves([]);
    setMyVotes({});
    setMyPlayerId(null);
  }, [myPlayer, game]);

  // Helper: Get valid positions
  const getValidPositions = useCallback((): BoardPosition[] => {
    if (!game) return [];
    return getValidPlacements(game.boardState);
  }, [game]);

  // Helper: Get adjacent cards
  const getAdjacentCards = useCallback((position: BoardPosition): PlacedCard[] => {
    if (!game) return [];
    const adjacent: PlacedCard[] = [];
    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    
    for (const dir of directions) {
      const adjPos = { x: position.x + dir.x, y: position.y + dir.y };
      const key = positionKey(adjPos);
      if (game.boardState[key]) {
        adjacent.push(game.boardState[key]);
      }
    }
    return adjacent;
  }, [game]);

  // Helper: Check if can place at position
  const canPlaceAt = useCallback((position: BoardPosition): boolean => {
    if (!game) return false;
    const { valid } = isValidPlacement(position, game.boardState);
    return valid;
  }, [game]);

  // Helper: Check if position has pending move
  const isPositionPending = useCallback((position: BoardPosition): boolean => {
    const posKey = positionKey(position);
    return pendingMoves.some(m =>
      positionKey({ x: m.positionX, y: m.positionY }) === posKey
    );
  }, [pendingMoves]);

  return {
    game,
    players,
    myPlayer,
    myHand,
    pendingMoves,
    myVotes,
    isLoading,
    error,

    createGame,
    joinGame,
    startGame,
    placeCard,
    vote,
    leaveGame,

    getValidPositions,
    getAdjacentCards,
    canPlaceAt,
    isPositionPending,
  };
}
