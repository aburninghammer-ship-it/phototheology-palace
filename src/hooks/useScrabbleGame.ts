// PT Scrabble Game Hook - Local State Version
// Solo practice mode with local state management
// (Database multiplayer tables not yet created)

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
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

/**
 * useScrabbleGame - Local state version for solo practice
 * Note: Multiplayer database tables not yet created
 */
export function useScrabbleGame(_gameId?: string): UseScrabbleGameReturn {
  const { user } = useAuth();
  const [game, setGame] = useState<ScrabbleGame | null>(null);
  const [players, setPlayers] = useState<ScrabblePlayer[]>([]);
  const [pendingMoves, setPendingMoves] = useState<ScrabbleMove[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For solo mode, the current player
  const myPlayer = players[0] || null;
  const myHand: ScrabbleCard[] = myPlayer?.hand || [];

  // Create a new local game (solo practice)
  const createGame = useCallback(async (
    gameMode: 'ffa' | 'team',
    maxPlayers: number = 10
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const roomCode = generateRoomCode();
      const allCards = getAllScrabbleCards();
      const midFloorCards = allCards.filter(c => c.floor >= 2 && c.floor <= 5);
      const seedCard = midFloorCards[Math.floor(Math.random() * midFloorCards.length)];

      const gameId = `local-${Date.now()}`;

      const newGame: ScrabbleGame = {
        id: gameId,
        roomCode,
        hostUserId: user?.id || 'local-user',
        status: 'waiting',
        gameMode,
        maxPlayers,
        seedCardId: seedCard.id,
        boardState: {},
        deckRemaining: [],
        currentMoveId: null,
        voteTimeoutSeconds: 30,
        createdAt: new Date().toISOString(),
        startedAt: null,
        endedAt: null,
      };

      const localPlayer: ScrabblePlayer = {
        id: `player-${user?.id || 'local'}`,
        gameId,
        userId: user?.id || 'local-user',
        teamId: null,
        displayName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You',
        avatarUrl: null,
        hand: [],
        score: 0,
        cardsPlayed: 0,
        isConnected: true,
        joinedAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
      };

      setGame(newGame);
      setPlayers([localPlayer]);
      
      toast.success(`Game created! Room code: ${roomCode}`);
      return gameId;
    } catch (err: any) {
      console.error('Error creating game:', err);
      setError(err.message);
      toast.error('Failed to create game');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Join game - not implemented for local mode
  const joinGame = useCallback(async (_roomCode: string): Promise<boolean> => {
    toast.info('Multiplayer not yet available - use Solo mode');
    return false;
  }, []);

  // Start the local game
  const startGame = useCallback(async (): Promise<boolean> => {
    if (!game) {
      toast.error('No game to start');
      return false;
    }

    setIsLoading(true);

    try {
      const cardsPerPlayer = 10;
      const { hands, deck, seedCard } = dealCards(1, cardsPerPlayer);

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
  }, [game]);

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

      // Update board state
      setGame(prev => {
        if (!prev) return null;
        return {
          ...prev,
          boardState: {
            ...prev.boardState,
            [posKey]: placedCard,
          },
        };
      });

      // Remove card from hand and add score
      setPlayers(prev => prev.map(p => {
        if (p.id !== myPlayer.id) return p;
        return {
          ...p,
          hand: p.hand.filter(c => c.id !== card.id),
          score: p.score + pointsAwarded,
          cardsPlayed: p.cardsPlayed + 1,
        };
      }));

      // Draw a new card if deck has cards
      if (game.deckRemaining.length > 0) {
        const newCardId = game.deckRemaining[0];
        const newCard = getCardById(newCardId);
        
        setGame(prev => prev ? {
          ...prev,
          deckRemaining: prev.deckRemaining.slice(1),
        } : null);

        if (newCard) {
          setPlayers(prev => prev.map(p => {
            if (p.id !== myPlayer.id) return p;
            return {
              ...p,
              hand: [...p.hand, newCard],
            };
          }));
        }
      }

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

  // Vote - not used in solo mode
  const vote = useCallback(async (_moveId: string, _approve: boolean): Promise<boolean> => {
    return true;
  }, []);

  // Leave game
  const leaveGame = useCallback(async (): Promise<void> => {
    setGame(null);
    setPlayers([]);
    setPendingMoves([]);
    setMyVotes({});
  }, []);

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
