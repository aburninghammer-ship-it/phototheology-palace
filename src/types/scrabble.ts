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

export type Direction = 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right';

export interface Connection {
  targetCardId: string;
  targetPosition: BoardPosition;
  direction: Direction;
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
  jeevesAmplification?: string; // Jeeves' commentary amplifying the player's answer
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
  seedVerse?: { reference: string; text: string }; // Synced verse for all players
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
  TIMER_SECONDS: 120, // 2 minutes
  // Time bonus: faster = more points (percentage of time remaining)
  TIME_BONUS_MAX: 5, // Max bonus points for speed
} as const;

// Helper to calculate score (without time bonus)
export function calculateScore(connectionCount: number, isChristConnection: boolean): number {
  const baseScore = SCRABBLE_SCORING.CONNECTIONS[connectionCount] ??
    (10 + (connectionCount - 4) * 5); // Extra connections beyond 4

  return isChristConnection
    ? baseScore * SCRABBLE_SCORING.CHRIST_MULTIPLIER
    : baseScore;
}

// Helper to calculate score with time bonus
// timeRemaining: seconds left on the timer when submitted
export function calculateScoreWithTimeBonus(
  connectionCount: number,
  isChristConnection: boolean,
  timeRemaining: number
): { baseScore: number; timeBonus: number; total: number } {
  const baseScore = calculateScore(connectionCount, isChristConnection);

  // Time bonus: percentage of time remaining * max bonus
  // e.g., 60 seconds left out of 120 = 50% = 2.5 bonus points (rounded)
  const timePercentage = Math.max(0, timeRemaining / SCRABBLE_SCORING.TIMER_SECONDS);
  const timeBonus = Math.round(timePercentage * SCRABBLE_SCORING.TIME_BONUS_MAX);

  return {
    baseScore,
    timeBonus,
    total: baseScore + timeBonus,
  };
}

// Helper to get adjacent positions (8 directions including diagonals)
export function getAdjacentPositions(pos: BoardPosition): BoardPosition[] {
  return [
    { x: pos.x, y: pos.y - 1 },       // up
    { x: pos.x, y: pos.y + 1 },       // down
    { x: pos.x - 1, y: pos.y },       // left
    { x: pos.x + 1, y: pos.y },       // right
    { x: pos.x - 1, y: pos.y - 1 },   // up-left
    { x: pos.x + 1, y: pos.y - 1 },   // up-right
    { x: pos.x - 1, y: pos.y + 1 },   // down-left
    { x: pos.x + 1, y: pos.y + 1 },   // down-right
  ];
}

// Helper to get direction from one position to another (8 directions)
export function getDirection(from: BoardPosition, to: BoardPosition): Direction | null {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (dx === 0 && dy === -1) return 'up';
  if (dx === 0 && dy === 1) return 'down';
  if (dx === -1 && dy === 0) return 'left';
  if (dx === 1 && dy === 0) return 'right';
  if (dx === -1 && dy === -1) return 'up-left';
  if (dx === 1 && dy === -1) return 'up-right';
  if (dx === -1 && dy === 1) return 'down-left';
  if (dx === 1 && dy === 1) return 'down-right';
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

  // Empty board: first card can go at center (0,0)
  if (Object.keys(boardState).length === 0) {
    return { valid: position.x === 0 && position.y === 0, adjacentCards: [] };
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
  // Empty board: first card goes at center
  if (Object.keys(boardState).length === 0) {
    return [{ x: 0, y: 0 }];
  }

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

// Get direction label for a position relative to the board center/reference
export function getDirectionFromPosition(position: BoardPosition, referencePositions: BoardPosition[]): Direction {
  // Find the closest reference position and determine direction from it
  let closestDir: Direction = 'up';
  let minDist = Infinity;

  for (const ref of referencePositions) {
    const dx = position.x - ref.x;
    const dy = position.y - ref.y;
    const dist = Math.abs(dx) + Math.abs(dy);

    if (dist < minDist && dist === 1) {
      minDist = dist;
      const dir = getDirection(ref, position);
      if (dir) closestDir = dir;
    } else if (dist < minDist && dist === 2 && Math.abs(dx) === 1 && Math.abs(dy) === 1) {
      // Diagonal
      minDist = dist;
      const dir = getDirection(ref, position);
      if (dir) closestDir = dir;
    }
  }

  return closestDir;
}

// Assign cards to valid positions, returning cards with their assigned positions
export interface CardWithAssignedPosition {
  card: ScrabbleCard;
  position: BoardPosition;
  direction: Direction;
}

export function assignCardsToPositions(
  cards: ScrabbleCard[],
  boardState: Record<string, PlacedCard>
): CardWithAssignedPosition[] {
  const placedPositions = Object.keys(boardState).map(parsePositionKey);

  // EMPTY BOARD: All cards target center (0,0)
  if (Object.keys(boardState).length === 0) {
    return cards.map((card) => ({
      card,
      position: { x: 0, y: 0 },
      direction: 'up' as Direction,
    }));
  }

  const validPositions = getValidPlacements(boardState);

  // Sort valid positions in a consistent order (clockwise from top-left)
  const sortedPositions = [...validPositions].sort((a, b) => {
    // Priority: top-left, top, top-right, left, right, bottom-left, bottom, bottom-right
    const getScore = (pos: BoardPosition) => {
      // Find direction from nearest placed card
      for (const placed of placedPositions) {
        const dir = getDirection(placed, pos);
        if (dir) {
          const order: Record<Direction, number> = {
            'up-left': 0, 'up': 1, 'up-right': 2,
            'left': 3, 'right': 4,
            'down-left': 5, 'down': 6, 'down-right': 7,
          };
          return order[dir];
        }
      }
      return 8;
    };
    return getScore(a) - getScore(b);
  });

  // Assign cards to positions - cards without a valid position still appear in hand
  const result: CardWithAssignedPosition[] = [];

  for (let i = 0; i < cards.length; i++) {
    if (i < sortedPositions.length) {
      const position = sortedPositions[i];
      const direction = getDirectionFromPosition(position, placedPositions);
      result.push({ card: cards[i], position, direction });
    } else {
      // No valid position yet — assign to center as fallback so card still shows in hand
      result.push({ card: cards[i], position: { x: 0, y: 0 }, direction: 'up' as Direction });
    }
  }

  return result;
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
