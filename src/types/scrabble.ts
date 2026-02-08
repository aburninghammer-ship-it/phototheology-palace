// PT Scrabble Game Types

export interface ScrabbleCard {
  id: string;
  code: string;           // e.g., "SR", "IR", "BL"
  name: string;           // e.g., "Story Room"
  floor: number;
  category: string;       // Floor name
  icon: string;           // Lucide icon name
  tags: string[];         // Connection hint tags
  imageUrl?: string;
  description?: string;
}

export interface BoardPosition {
  x: number;
  y: number;
}

export interface Connection {
  targetCardId: string;
  targetPosition: BoardPosition;
  direction: 'up' | 'down' | 'left' | 'right';
  explanation: string;
  isChristConnection: boolean;
}

export interface PlacedCard {
  card: ScrabbleCard;
  position: BoardPosition;
  playerId: string;
  playerName: string;
  connections: Connection[];
  timestamp: string;
  moveId: string;
}

export type GameStatus = 'waiting' | 'playing' | 'completed';
export type GameMode = 'ffa' | 'team';
export type ValidationStatus = 'pending' | 'voting' | 'approved' | 'rejected';

export interface ScrabbleTeam {
  id: string;
  gameId: string;
  teamNumber: number;
  teamName: string;
  totalScore: number;
}

export interface ScrabblePlayer {
  id: string;
  gameId: string;
  userId: string;
  teamId?: string;
  displayName: string;
  avatarUrl?: string;
  hand: ScrabbleCard[];
  score: number;
  cardsPlayed: number;
  isConnected: boolean;
  joinedAt: string;
  lastSeenAt: string;
}

export interface ScrabbleMove {
  id: string;
  gameId: string;
  playerId: string;
  playerName?: string;
  cardId: string;
  cardCode: string;
  cardName: string;
  positionX: number;
  positionY: number;
  connections: Connection[];
  explanation?: string;
  isChristConnection: boolean;
  pointsBase: number;
  pointsAwarded: number;
  validationStatus: ValidationStatus;
  votesApprove: number;
  votesReject: number;
  votingEndsAt?: string;
  createdAt: string;
}

export interface ScrabbleVote {
  id: string;
  moveId: string;
  playerId: string;
  vote: boolean; // true = approve, false = reject
  createdAt: string;
}

export interface ScrabbleGame {
  id: string;
  roomCode: string;
  hostUserId: string;
  status: GameStatus;
  gameMode: GameMode;
  maxPlayers: number;
  seedCardId: string;
  boardState: Record<string, PlacedCard>; // "{x},{y}" -> PlacedCard
  deckRemaining: string[]; // Card IDs remaining in deck
  currentMoveId?: string;
  voteTimeoutSeconds: number;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  players?: ScrabblePlayer[];
  teams?: ScrabbleTeam[];
}

// Scoring constants
export const SCRABBLE_SCORING = {
  CONNECTIONS: {
    1: 1,   // 1 connection = 1 point
    2: 3,   // 2 connections = 3 points (bonus)
    3: 6,   // 3 connections = 6 points (bonus)
    4: 10,  // 4 connections = 10 points (bonus)
  } as Record<number, number>,
  CHRIST_MULTIPLIER: 2,
  VOTE_THRESHOLD: 2/3, // 2/3 majority required
  TIMER_SECONDS: 15,
} as const;

// Helper to calculate score
export function calculateScore(connectionCount: number, isChristConnection: boolean): number {
  const baseScore = SCRABBLE_SCORING.CONNECTIONS[connectionCount] ??
    (10 + (connectionCount - 4) * 5); // Extra connections beyond 4

  return isChristConnection
    ? baseScore * SCRABBLE_SCORING.CHRIST_MULTIPLIER
    : baseScore;
}

// Helper to get adjacent positions
export function getAdjacentPositions(pos: BoardPosition): BoardPosition[] {
  return [
    { x: pos.x, y: pos.y - 1 },     // up
    { x: pos.x, y: pos.y + 1 },     // down
    { x: pos.x - 1, y: pos.y },     // left
    { x: pos.x + 1, y: pos.y },     // right
  ];
}

// Helper to get direction from one position to another
export function getDirection(from: BoardPosition, to: BoardPosition): Connection['direction'] | null {
  if (to.x === from.x && to.y === from.y - 1) return 'up';
  if (to.x === from.x && to.y === from.y + 1) return 'down';
  if (to.x === from.x - 1 && to.y === from.y) return 'left';
  if (to.x === from.x + 1 && to.y === from.y) return 'right';
  return null;
}

// Helper to create position key for board state
export function positionKey(pos: BoardPosition): string {
  return `${pos.x},${pos.y}`;
}

// Helper to parse position key
export function parsePositionKey(key: string): BoardPosition {
  const [x, y] = key.split(',').map(Number);
  return { x, y };
}

// Helper to check if position is valid for placement
export function isValidPlacement(
  position: BoardPosition,
  boardState: Record<string, PlacedCard>
): { valid: boolean; adjacentCards: PlacedCard[] } {
  const key = positionKey(position);

  // Can't place on occupied position
  if (boardState[key]) {
    return { valid: false, adjacentCards: [] };
  }

  // Must be adjacent to at least one existing card
  const adjacent = getAdjacentPositions(position);
  const adjacentCards = adjacent
    .map(pos => boardState[positionKey(pos)])
    .filter(Boolean);

  return {
    valid: adjacentCards.length > 0,
    adjacentCards,
  };
}

// Helper to get all valid placement positions on the board
export function getValidPlacements(
  boardState: Record<string, PlacedCard>
): BoardPosition[] {
  const validPositions: BoardPosition[] = [];
  const checked = new Set<string>();

  // For each placed card, check all adjacent positions
  Object.keys(boardState).forEach(key => {
    const pos = parsePositionKey(key);
    const adjacent = getAdjacentPositions(pos);

    adjacent.forEach(adjPos => {
      const adjKey = positionKey(adjPos);
      if (!checked.has(adjKey) && !boardState[adjKey]) {
        checked.add(adjKey);
        validPositions.push(adjPos);
      }
    });
  });

  return validPositions;
}

// Floor color gradients for cards
export const FLOOR_GRADIENTS: Record<number, {
  from: string;
  to: string;
  border: string;
  glow: string;
  text: string;
}> = {
  1: {
    from: 'from-green-500/20',
    to: 'to-emerald-600/20',
    border: 'border-green-400/50',
    glow: 'rgba(34, 197, 94, 0.5)',
    text: 'from-green-300 to-emerald-400',
  },
  2: {
    from: 'from-yellow-500/20',
    to: 'to-amber-600/20',
    border: 'border-yellow-400/50',
    glow: 'rgba(234, 179, 8, 0.5)',
    text: 'from-yellow-300 to-amber-400',
  },
  3: {
    from: 'from-orange-500/20',
    to: 'to-red-600/20',
    border: 'border-orange-400/50',
    glow: 'rgba(249, 115, 22, 0.5)',
    text: 'from-orange-300 to-red-400',
  },
  4: {
    from: 'from-red-500/20',
    to: 'to-rose-600/20',
    border: 'border-red-400/50',
    glow: 'rgba(239, 68, 68, 0.5)',
    text: 'from-red-300 to-rose-400',
  },
  5: {
    from: 'from-blue-500/20',
    to: 'to-indigo-600/20',
    border: 'border-blue-400/50',
    glow: 'rgba(59, 130, 246, 0.5)',
    text: 'from-blue-300 to-indigo-400',
  },
  6: {
    from: 'from-purple-500/20',
    to: 'to-violet-600/20',
    border: 'border-purple-400/50',
    glow: 'rgba(168, 85, 247, 0.5)',
    text: 'from-purple-300 to-violet-400',
  },
};
