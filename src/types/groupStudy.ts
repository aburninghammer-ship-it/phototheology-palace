// Group Study Types
// Gamified group Bible study with insights, voting, and scoring

export interface StudyGroup {
  id: string;
  name: string;
  description?: string;
  leaderId: string;
  theologyFrame?: string;
  isPublic: boolean;
  inviteCode?: string;
  maxMembers: number;
  memberCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudyGroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: 'leader' | 'co-leader' | 'member';
  joinedAt: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface ScheduledStudy {
  id: string;
  groupId?: string;
  hostUserId: string;
  hostName: string;
  title: string;
  description?: string;
  scheduledAt: string;
  // Content
  contentType: 'passage' | 'devotional' | 'pt_principle';
  contentReference: string; // e.g., "John 3:16-21"
  contentText?: string;
  // Settings
  maxParticipants: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  roomCode?: string;
  // Enriched data
  rsvpCount?: number;
  myRsvp?: 'going' | 'maybe' | 'not_going' | null;
  // Timestamps
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
}

export interface StudyRSVP {
  id: string;
  scheduledStudyId: string;
  userId: string;
  userName: string;
  status: 'going' | 'maybe' | 'not_going';
  prayerRequest?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  scheduledStudyId?: string;
  roomCode: string;
  hostId: string;
  // Content
  contentType: 'passage' | 'devotional' | 'pt_principle';
  contentReference: string;
  contentText?: string;
  // State
  currentPhase: StudyPhase;
  phaseEndsAt?: string;
  // Stats
  totalInsights: number;
  totalVotes: number;
  // Timestamps
  startedAt: string;
  endedAt?: string;
}

export type StudyPhase = 'gathering' | 'reading' | 'sharing' | 'recap';

export interface StudyParticipant {
  id: string;
  sessionId: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  score: number;
  insightsShared: number;
  votesCast: number;
  isConnected: boolean;
  joinedAt: string;
  lastSeenAt: string;
}

export interface StudyInsight {
  id: string;
  sessionId: string;
  participantId: string;
  userId: string;
  // Enriched
  participantName?: string;
  participantAvatar?: string;
  // Content
  insightText: string;
  verseReference?: string; // Specific verse within the passage
  ptPrinciple?: string; // PT principle code (e.g., "SR", "IR", "24")
  crossReferences?: string[]; // Related verses mentioned
  // Gamification
  isChristConnection: boolean;
  basePoints: number;
  bonusPoints: number;
  totalPoints: number;
  // Voting
  votesUp: number;
  votesDown: number;
  voteScore: number; // up - down
  myVote?: 1 | -1 | null;
  // Status
  status: 'active' | 'hidden';
  createdAt: string;
}

export interface InsightVote {
  id: string;
  insightId: string;
  userId: string;
  vote: 1 | -1;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  messageType: 'chat' | 'prayer' | 'announcement';
  replyToId?: string;
  replyTo?: ChatMessage; // Populated for display
  createdAt: string;
}

// Scoring constants
export const STUDY_SCORING = {
  BASE_INSIGHT: 1,
  CHRIST_CONNECTION_BONUS: 2,
  CROSS_REFERENCE_BONUS: 1, // Per reference (max 3)
  PT_PRINCIPLE_BONUS: 1, // For connecting a PT principle
  VOTE_CAST_POINTS: 0.25, // Encourage voting
  UPVOTE_RECEIVED: 0.5,
  DOWNVOTE_RECEIVED: -0.25,
  MAX_CROSS_REF_BONUS: 3,
} as const;

// Calculate points for an insight
export function calculateInsightPoints(
  isChristConnection: boolean,
  hasPtPrinciple: boolean,
  crossReferencesCount: number
): { basePoints: number; bonusPoints: number; totalPoints: number } {
  let basePoints = STUDY_SCORING.BASE_INSIGHT;
  let bonusPoints = 0;

  if (isChristConnection) {
    bonusPoints += STUDY_SCORING.CHRIST_CONNECTION_BONUS;
  }

  if (hasPtPrinciple) {
    bonusPoints += STUDY_SCORING.PT_PRINCIPLE_BONUS;
  }

  const crossRefBonus = Math.min(crossReferencesCount, STUDY_SCORING.MAX_CROSS_REF_BONUS) * STUDY_SCORING.CROSS_REFERENCE_BONUS;
  bonusPoints += crossRefBonus;

  return {
    basePoints,
    bonusPoints,
    totalPoints: basePoints + bonusPoints,
  };
}

// Phase configuration
export interface PhaseConfig {
  name: StudyPhase;
  label: string;
  description: string;
  defaultDuration: number; // seconds, 0 = no limit
  canSubmitInsights: boolean;
  canVote: boolean;
  canChat: boolean;
}

export const STUDY_PHASES: PhaseConfig[] = [
  {
    name: 'gathering',
    label: 'Gathering',
    description: 'Participants join and prepare',
    defaultDuration: 180, // 3 min
    canSubmitInsights: false,
    canVote: false,
    canChat: true,
  },
  {
    name: 'reading',
    label: 'Reading',
    description: 'Read the passage together',
    defaultDuration: 300, // 5 min
    canSubmitInsights: false,
    canVote: false,
    canChat: false,
  },
  {
    name: 'sharing',
    label: 'Sharing',
    description: 'Share insights and vote',
    defaultDuration: 900, // 15 min
    canSubmitInsights: true,
    canVote: true,
    canChat: true,
  },
  {
    name: 'recap',
    label: 'Recap',
    description: 'Review top insights',
    defaultDuration: 0, // No limit
    canSubmitInsights: false,
    canVote: false,
    canChat: true,
  },
];

export function getPhaseConfig(phase: StudyPhase): PhaseConfig {
  return STUDY_PHASES.find(p => p.name === phase) || STUDY_PHASES[0];
}

export function getNextPhase(currentPhase: StudyPhase): StudyPhase | null {
  const currentIndex = STUDY_PHASES.findIndex(p => p.name === currentPhase);
  if (currentIndex === -1 || currentIndex === STUDY_PHASES.length - 1) {
    return null;
  }
  return STUDY_PHASES[currentIndex + 1].name;
}

// Create scheduled study input
export interface CreateScheduledStudyInput {
  groupId?: string;
  title: string;
  description?: string;
  scheduledAt: Date;
  contentType: 'passage' | 'devotional' | 'pt_principle';
  contentReference: string;
  contentText?: string;
  maxParticipants?: number;
}

// Create insight input
export interface CreateInsightInput {
  insightText: string;
  verseReference?: string;
  ptPrinciple?: string;
  crossReferences?: string[];
  isChristConnection?: boolean;
}

// Room code generator (same pattern as Scrabble)
export function generateStudyRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
