// ============================================================
// Gideon 300 Tournament Types
// ============================================================

export interface GideonQuestion {
  id: number;
  prompt: string;
  options: [string, string, string, string];
  correct_answer: string;
  explanation: string;
  cross_references: string[];
  pt_room_tag: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimated_miss_rate: number;
  strike_impact: "standard" | "high";
  round_assignment: number;
  source: "curated" | "ai" | "false_prophet";
}

export interface GideonQuestionClient {
  id: number;
  prompt: string;
  options: [string, string, string, string];
  pt_room_tag: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  strike_impact: "standard" | "high";
  round_assignment: number;
  source: "curated" | "ai" | "false_prophet";
}

export interface GideonSettings {
  theme: string;
  difficulty_tier: "standard" | "advanced";
  pt_room_focus: string[];
  max_rounds: number;
  timer_mode: "standard" | "advanced";
  false_prophet_round: boolean;
  max_players: number;
}

export interface GideonTournament {
  id: string;
  game_room_id: string;
  host_id: string;
  theme: string;
  difficulty_tier: "standard" | "advanced";
  pt_room_focus: string[];
  max_rounds: number;
  timer_mode: "standard" | "advanced";
  false_prophet_round: boolean;
  friday_night_mode: boolean;
  questions_data: GideonQuestion[];
  curated_question_ids: string[];
  ai_question_count: number;
  current_round: number;
  round_phase: RoundPhase;
  current_question_index: number;
  round_timer_seconds: number;
  round_started_at: string | null;
  status: TournamentStatus;
  final_leaderboard: LeaderboardEntry[];
  winner_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export type RoundPhase = "lobby" | "generating" | "question" | "reveal" | "camp_teaching" | "synthesis" | "complete";
export type TournamentStatus = "waiting" | "generating" | "active" | "completed" | "abandoned";

export interface GideonTournamentPlayer {
  id: string;
  tournament_id: string;
  user_id: string;
  display_name: string;
  water_rations: number;
  is_eliminated: boolean;
  eliminated_at_round: number | null;
  in_camp_mode: boolean;
  answers: PlayerAnswer[];
  accuracy_pct: number;
  survival_depth: number;
  total_score: number;
  early_lock_bonus: number;
  high_risk_bonus: number;
  synthesis_score: number;
  final_rank: number | null;
  access_tier: "full_suite" | "friday_pass";
  created_at: string;
  updated_at: string;
}

export interface PlayerAnswer {
  question_index: number;
  answer: string;
  correct: boolean;
  time_ms: number;
  round: number;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  rank: number;
  total_score: number;
  accuracy_pct: number;
  survival_depth: number;
  early_lock_bonus: number;
  high_risk_bonus: number;
  synthesis_score: number;
  water_rations_remaining: number;
  is_eliminated: boolean;
}

export interface CampTeaching {
  question_prompt: string;
  correct_answer: string;
  explanation: string;
  cross_references: string[];
  recovery_drill?: {
    prompt: string;
    options: string[];
    correct_answer: string;
  };
}

export interface GideonSeasonStats {
  id: string;
  user_id: string;
  season: string;
  tournaments_played: number;
  tournaments_won: number;
  total_questions_answered: number;
  total_questions_correct: number;
  avg_accuracy: number;
  avg_survival_depth: number;
  total_score: number;
  best_single_tournament_score: number;
  current_win_streak: number;
  best_win_streak: number;
}

// Timer configs per round index (0-indexed)
export const TIMER_CONFIGS = {
  standard: [25, 25, 20, 20, 15, 15, 15, 15],
  advanced: [20, 20, 15, 15, 12, 12, 12, 12],
} as const;

export const SYNTHESIS_TIMER_SECONDS = 150; // 2.5 minutes

export const MIN_PLAYERS = 4;
export const MAX_PLAYERS_DEFAULT = 20;
export const SURVIVOR_MIN = 3;
export const SURVIVOR_MAX = 6;
