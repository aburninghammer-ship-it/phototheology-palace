// PT Scrabble Multiplayer Game Hook
// Manages real-time multiplayer game state with Supabase
// Supports simultaneous plays (no turn order)

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type {
  ScrabbleGame,
  ScrabblePlayer,
  ScrabbleMove,
  ScrabbleCard,
  PlacedCard,
  BoardPosition,
  Connection,
  GameStatus,
} from '@/types/scrabble';
import {
  positionKey,
  parsePositionKey,
  getAdjacentPositions,
  getDirection,
  isValidPlacement,
  getValidPlacements,
  calculateScore,
  SCRABBLE_SCORING,
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

export function useScrabbleGame(gameId?: string): UseScrabbleGameReturn {
  const { user } = useAuth();
  const [game, setGame] = useState<ScrabbleGame | null>(null);
  const [players, setPlayers] = useState<ScrabblePlayer[]>([]);
  const [pendingMoves, setPendingMoves] = useState<ScrabbleMove[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Find current user's player record
  const myPlayer = players.find(p => p.userId === user?.id) || null;

  // Get cards in hand from IDs
  const myHand: ScrabbleCard[] = myPlayer?.hand?.map(id =>
    typeof id === 'string' ? getCardById(id) : id
  ).filter(Boolean) as ScrabbleCard[] || [];

  // Fetch game data
  const fetchGameData = useCallback(async () => {
    if (!gameId) return;

    try {
      // Fetch game
      const { data: gameData, error: gameError } = await supabase
        .from('pt_scrabble_games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (gameError) throw gameError;

      // Fetch players with profiles
      const { data: playersData, error: playersError } = await supabase
        .from('pt_scrabble_players')
        .select(`
          *,
          profiles:user_id (display_name, avatar_url)
        `)
        .eq('game_id', gameId)
        .order('score', { ascending: false });

      if (playersError) throw playersError;

      // Fetch ALL pending moves (multiple can be pending simultaneously)
      const { data: pendingMovesData } = await supabase
        .from('pt_scrabble_moves')
        .select('*')
        .eq('game_id', gameId)
        .eq('validation_status', 'voting')
        .order('created_at', { ascending: true });

      // Transform data
      const transformedGame: ScrabbleGame = {
        id: gameData.id,
        roomCode: gameData.room_code,
        hostUserId: gameData.host_user_id,
        status: gameData.status as GameStatus,
        gameMode: gameData.game_mode as 'ffa' | 'team',
        maxPlayers: gameData.max_players,
        seedCardId: gameData.seed_card_id,
        boardState: gameData.board_state as Record<string, PlacedCard> || {},
        deckRemaining: gameData.deck_remaining as string[] || [],
        currentMoveId: gameData.current_move_id,
        voteTimeoutSeconds: gameData.vote_timeout_seconds,
        createdAt: gameData.created_at,
        startedAt: gameData.started_at,
        endedAt: gameData.ended_at,
      };

      const transformedPlayers: ScrabblePlayer[] = playersData.map((p: any) => ({
        id: p.id,
        gameId: p.game_id,
        userId: p.user_id,
        teamId: p.team_id,
        displayName: p.display_name || p.profiles?.display_name || 'Player',
        avatarUrl: p.profiles?.avatar_url,
        hand: p.hand as ScrabbleCard[] || [],
        score: p.score,
        cardsPlayed: p.cards_played,
        isConnected: p.is_connected,
        joinedAt: p.joined_at,
        lastSeenAt: p.last_seen_at,
      }));

      const transformedMoves: ScrabbleMove[] = (pendingMovesData || []).map((m: any) => ({
        id: m.id,
        gameId: m.game_id,
        playerId: m.player_id,
        playerName: transformedPlayers.find(p => p.id === m.player_id)?.displayName,
        cardId: m.card_id,
        cardCode: m.card_code,
        cardName: m.card_name,
        positionX: m.position_x,
        positionY: m.position_y,
        connections: m.connections as Connection[],
        explanation: m.explanation,
        isChristConnection: m.is_christ_connection,
        pointsBase: m.points_base,
        pointsAwarded: m.points_awarded,
        validationStatus: m.validation_status,
        votesApprove: m.votes_approve,
        votesReject: m.votes_reject,
        votingEndsAt: m.voting_ends_at,
        createdAt: m.created_at,
      }));

      setGame(transformedGame);
      setPlayers(transformedPlayers);
      setPendingMoves(transformedMoves);

      // Fetch my votes on pending moves
      if (transformedMoves.length > 0 && myPlayer) {
        const { data: votesData } = await supabase
          .from('pt_scrabble_votes')
          .select('move_id, vote')
          .eq('player_id', myPlayer.id)
          .in('move_id', transformedMoves.map(m => m.id));

        const votesMap: Record<string, boolean> = {};
        votesData?.forEach(v => {
          votesMap[v.move_id] = v.vote;
        });
        setMyVotes(votesMap);
      }

      // Check for game end conditions
      checkGameEnd(transformedGame, transformedPlayers);
    } catch (err: any) {
      console.error('Error fetching game data:', err);
      setError(err.message);
    }
  }, [gameId, myPlayer?.id]);

  // Check if game should end
  const checkGameEnd = useCallback(async (gameState: ScrabbleGame, playerList: ScrabblePlayer[]) => {
    if (gameState.status !== 'playing') return;

    // Check 1: Someone emptied their hand and deck is empty
    const deckEmpty = gameState.deckRemaining.length === 0;
    const someoneEmptyHand = playerList.some(p => (p.hand?.length || 0) === 0);

    // Check 2: Board stalls - no valid placements possible
    const validPositions = getValidPlacements(gameState.boardState);
    const boardStalled = validPositions.length === 0;

    if ((deckEmpty && someoneEmptyHand) || boardStalled) {
      const { error } = await supabase
        .from('pt_scrabble_games')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString(),
        })
        .eq('id', gameState.id);

      if (!error) {
        toast.success('Game Over!');
      }
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    if (!gameId) return;

    fetchGameData();

    const channel = supabase
      .channel(`scrabble-${gameId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pt_scrabble_games',
        filter: `id=eq.${gameId}`,
      }, () => fetchGameData())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pt_scrabble_players',
        filter: `game_id=eq.${gameId}`,
      }, () => fetchGameData())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pt_scrabble_moves',
        filter: `game_id=eq.${gameId}`,
      }, () => fetchGameData())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pt_scrabble_votes',
      }, () => fetchGameData())
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, fetchGameData]);

  // Create a new game
  const createGame = useCallback(async (
    gameMode: 'ffa' | 'team',
    maxPlayers: number = 10
  ): Promise<string | null> => {
    if (!user) {
      toast.error('You must be logged in to create a game');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const roomCode = generateRoomCode();
      const allCards = getAllScrabbleCards();
      const midFloorCards = allCards.filter(c => c.floor >= 2 && c.floor <= 5);
      const seedCard = midFloorCards[Math.floor(Math.random() * midFloorCards.length)];

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

      const { error: playerError } = await supabase
        .from('pt_scrabble_players')
        .insert({
          game_id: gameData.id,
          user_id: user.id,
          display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Host',
          hand: [],
          score: 0,
        });

      if (playerError) throw playerError;

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
      toast.error('You must be logged in to join a game');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: gameData, error: gameError } = await supabase
        .from('pt_scrabble_games')
        .select('*')
        .eq('room_code', roomCode.toUpperCase())
        .eq('status', 'waiting')
        .single();

      if (gameError || !gameData) {
        toast.error('Game not found or already started');
        return false;
      }

      const { data: existingPlayer } = await supabase
        .from('pt_scrabble_players')
        .select('id')
        .eq('game_id', gameData.id)
        .eq('user_id', user.id)
        .single();

      if (existingPlayer) {
        toast.info('You are already in this game');
        return true;
      }

      const { count } = await supabase
        .from('pt_scrabble_players')
        .select('*', { count: 'exact', head: true })
        .eq('game_id', gameData.id);

      if (count && count >= gameData.max_players) {
        toast.error('Game is full');
        return false;
      }

      const { error: joinError } = await supabase
        .from('pt_scrabble_players')
        .insert({
          game_id: gameData.id,
          user_id: user.id,
          display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Player',
          hand: [],
          score: 0,
        });

      if (joinError) throw joinError;

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
    if (!game || !user || game.hostUserId !== user.id) {
      toast.error('Only the host can start the game');
      return false;
    }

    if (players.length < 2) {
      toast.error('Need at least 2 players to start');
      return false;
    }

    setIsLoading(true);

    try {
      const cardsPerPlayer = 10;
      const { hands, deck, seedCard } = dealCards(players.length, cardsPerPlayer);

      for (let i = 0; i < players.length; i++) {
        const handIds = hands[i].map(c => c.id);
        await supabase
          .from('pt_scrabble_players')
          .update({ hand: handIds })
          .eq('id', players[i].id);
      }

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

      const { error: updateError } = await supabase
        .from('pt_scrabble_games')
        .update({
          status: 'playing',
          board_state: initialBoard,
          deck_remaining: deck.map(c => c.id),
          started_at: new Date().toISOString(),
        })
        .eq('id', game.id);

      if (updateError) throw updateError;

      toast.success('Game started! Anyone can play - no turns!');
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

  // Place a card (NO BLOCKING - simultaneous allowed)
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

    // Check if position has a pending move
    const posKey = positionKey(position);
    const existingPending = pendingMoves.find(m =>
      positionKey({ x: m.positionX, y: m.positionY }) === posKey
    );
    if (existingPending) {
      toast.error('Someone is already trying to place there!');
      return false;
    }

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
      const pointsBase = calculateScore(connections.length, isChristConnection);

      const { error: moveError } = await supabase
        .from('pt_scrabble_moves')
        .insert({
          game_id: game.id,
          player_id: myPlayer.id,
          card_id: card.id,
          card_code: card.code,
          card_name: card.name,
          position_x: position.x,
          position_y: position.y,
          connections: connections,
          explanation: explanation,
          is_christ_connection: isChristConnection,
          points_base: pointsBase,
          points_awarded: 0,
          validation_status: 'voting',
          votes_approve: 0,
          votes_reject: 0,
          voting_ends_at: new Date(Date.now() + SCRABBLE_SCORING.TIMER_SECONDS * 1000).toISOString(),
        });

      if (moveError) throw moveError;

      // Remove card from hand optimistically
      const newHand = myPlayer.hand.filter((c: any) =>
        (typeof c === 'string' ? c : c.id) !== card.id
      );
      await supabase
        .from('pt_scrabble_players')
        .update({
          hand: newHand,
          cards_played: myPlayer.cardsPlayed + 1,
        })
        .eq('id', myPlayer.id);

      toast.success('Card placed! Others are voting...');
      return true;
    } catch (err: any) {
      console.error('Error placing card:', err);
      setError(err.message);
      toast.error('Failed to place card');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [game, myPlayer, pendingMoves]);

  // Vote on a move
  const vote = useCallback(async (moveId: string, approve: boolean): Promise<boolean> => {
    if (!myPlayer || !game) {
      toast.error('Not in a game');
      return false;
    }

    const move = pendingMoves.find(m => m.id === moveId);
    if (move && move.playerId === myPlayer.id) {
      toast.info("You can't vote on your own move");
      return false;
    }

    try {
      const { data: existingVote } = await supabase
        .from('pt_scrabble_votes')
        .select('id')
        .eq('move_id', moveId)
        .eq('player_id', myPlayer.id)
        .single();

      if (existingVote) {
        toast.info('You already voted on this');
        return false;
      }

      const { error: voteError } = await supabase
        .from('pt_scrabble_votes')
        .insert({
          move_id: moveId,
          player_id: myPlayer.id,
          vote: approve,
        });

      if (voteError) throw voteError;

      setMyVotes(prev => ({ ...prev, [moveId]: approve }));

      // Update vote counts
      const { data: allVotes } = await supabase
        .from('pt_scrabble_votes')
        .select('vote')
        .eq('move_id', moveId);

      const approveCount = allVotes?.filter(v => v.vote).length || 0;
      const rejectCount = allVotes?.filter(v => !v.vote).length || 0;

      await supabase
        .from('pt_scrabble_moves')
        .update({
          votes_approve: approveCount,
          votes_reject: rejectCount,
        })
        .eq('id', moveId);

      // Check if voting complete
      const totalVoters = players.length - 1;
      const totalVotes = approveCount + rejectCount;

      if (totalVotes >= totalVoters) {
        const approvalRatio = approveCount / totalVotes;
        const isApproved = approvalRatio >= SCRABBLE_SCORING.VOTE_THRESHOLD;
        await finalizeMove(moveId, isApproved);
      }

      return true;
    } catch (err: any) {
      console.error('Error voting:', err);
      toast.error('Failed to vote');
      return false;
    }
  }, [myPlayer, players, pendingMoves, game]);

  // Finalize a move
  const finalizeMove = useCallback(async (moveId: string, approved: boolean) => {
    if (!game) return;

    try {
      const { data: move } = await supabase
        .from('pt_scrabble_moves')
        .select('*')
        .eq('id', moveId)
        .single();

      if (!move) return;

      const player = players.find(p => p.id === move.player_id);

      if (approved) {
        const newBoard = { ...game.boardState };
        const card = getCardById(move.card_id);
        if (card) {
          newBoard[positionKey({ x: move.position_x, y: move.position_y })] = {
            card,
            position: { x: move.position_x, y: move.position_y },
            playerId: move.player_id,
            playerName: player?.displayName || 'Unknown',
            connections: move.connections as Connection[],
            timestamp: move.created_at,
            moveId: move.id,
          };
        }

        // Draw new card from deck
        let newDeck = [...game.deckRemaining];
        let drawnCardId: string | null = null;
        if (newDeck.length > 0) {
          drawnCardId = newDeck.shift()!;
        }

        await supabase
          .from('pt_scrabble_games')
          .update({
            board_state: newBoard,
            deck_remaining: newDeck,
          })
          .eq('id', game.id);

        const currentHand = player?.hand || [];
        const updatedHand = drawnCardId ? [...currentHand, drawnCardId] : currentHand;

        await supabase
          .from('pt_scrabble_players')
          .update({
            score: (player?.score || 0) + move.points_base,
            hand: updatedHand,
          })
          .eq('id', move.player_id);

        await supabase
          .from('pt_scrabble_moves')
          .update({
            validation_status: 'approved',
            points_awarded: move.points_base,
          })
          .eq('id', moveId);

        toast.success(`+${move.points_base} points!`);
      } else {
        // Return card to hand
        if (player) {
          const newHand = [...(player.hand || []), move.card_id];
          await supabase
            .from('pt_scrabble_players')
            .update({
              hand: newHand,
              cards_played: Math.max(0, player.cardsPlayed - 1),
            })
            .eq('id', player.id);
        }

        await supabase
          .from('pt_scrabble_moves')
          .update({ validation_status: 'rejected' })
          .eq('id', moveId);

        toast.info('Connection rejected. Card returned.');
      }
    } catch (err) {
      console.error('Error finalizing move:', err);
    }
  }, [game, players]);

  // Leave game
  const leaveGame = useCallback(async () => {
    if (!game || !myPlayer) return;

    try {
      await supabase
        .from('pt_scrabble_players')
        .update({ is_connected: false })
        .eq('id', myPlayer.id);

      toast.info('Left the game');
    } catch (err) {
      console.error('Error leaving game:', err);
    }
  }, [game, myPlayer]);

  // Get valid positions
  const getValidPositions = useCallback((): BoardPosition[] => {
    if (!game) return [];
    const allValid = getValidPlacements(game.boardState);
    const pendingPositions = new Set(
      pendingMoves.map(m => positionKey({ x: m.positionX, y: m.positionY }))
    );
    return allValid.filter(pos => !pendingPositions.has(positionKey(pos)));
  }, [game, pendingMoves]);

  // Get adjacent cards
  const getAdjacentCards = useCallback((position: BoardPosition): PlacedCard[] => {
    if (!game) return [];
    const adjacent = getAdjacentPositions(position);
    return adjacent
      .map(pos => game.boardState[positionKey(pos)])
      .filter(Boolean);
  }, [game]);

  // Check if can place at position
  const canPlaceAt = useCallback((position: BoardPosition): boolean => {
    if (!game) return false;
    const { valid } = isValidPlacement(position, game.boardState);
    if (!valid) return false;
    const pendingPositions = new Set(
      pendingMoves.map(m => positionKey({ x: m.positionX, y: m.positionY }))
    );
    return !pendingPositions.has(positionKey(position));
  }, [game, pendingMoves]);

  // Check if position has pending move
  const isPositionPending = useCallback((position: BoardPosition): boolean => {
    return pendingMoves.some(m =>
      positionKey({ x: m.positionX, y: m.positionY }) === positionKey(position)
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

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
