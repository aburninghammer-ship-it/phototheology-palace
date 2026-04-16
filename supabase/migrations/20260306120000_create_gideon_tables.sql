-- ============================================================
-- Gideon 300 Tournament Tables
-- ============================================================

-- 1. gideon_tournaments — One row per game session
CREATE TABLE IF NOT EXISTS gideon_tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_room_id UUID REFERENCES game_rooms(id) ON DELETE CASCADE,
  host_id UUID REFERENCES auth.users(id),

  -- Config
  theme TEXT DEFAULT 'general',
  difficulty_tier TEXT DEFAULT 'standard' CHECK (difficulty_tier IN ('standard', 'advanced')),
  pt_room_focus TEXT[] DEFAULT '{}',
  max_rounds INTEGER DEFAULT 8 CHECK (max_rounds BETWEEN 6 AND 8),
  timer_mode TEXT DEFAULT 'standard' CHECK (timer_mode IN ('standard', 'advanced')),
  false_prophet_round BOOLEAN DEFAULT false,
  friday_night_mode BOOLEAN DEFAULT false,

  -- Questions
  questions_data JSONB DEFAULT '[]',
  curated_question_ids TEXT[] DEFAULT '{}',
  ai_question_count INTEGER DEFAULT 0,

  -- Live state
  current_round INTEGER DEFAULT 0,
  round_phase TEXT DEFAULT 'lobby' CHECK (round_phase IN ('lobby', 'generating', 'question', 'reveal', 'camp_teaching', 'synthesis', 'complete')),
  current_question_index INTEGER DEFAULT 0,
  round_timer_seconds INTEGER DEFAULT 25,
  round_started_at TIMESTAMPTZ,

  -- Results
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'generating', 'active', 'completed', 'abandoned')),
  final_leaderboard JSONB DEFAULT '[]',
  winner_user_id UUID REFERENCES auth.users(id),

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. gideon_tournament_players — Per-player state within a tournament
CREATE TABLE IF NOT EXISTS gideon_tournament_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES gideon_tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  display_name TEXT DEFAULT 'Player',

  -- Survival
  water_rations INTEGER DEFAULT 2 CHECK (water_rations >= 0),
  is_eliminated BOOLEAN DEFAULT false,
  eliminated_at_round INTEGER,
  in_camp_mode BOOLEAN DEFAULT false,

  -- Answers
  answers JSONB DEFAULT '[]',

  -- Scoring
  accuracy_pct NUMERIC(5,2) DEFAULT 0,
  survival_depth INTEGER DEFAULT 0,
  total_score NUMERIC(10,2) DEFAULT 0,
  early_lock_bonus INTEGER DEFAULT 0,
  high_risk_bonus INTEGER DEFAULT 0,
  synthesis_score NUMERIC(5,2) DEFAULT 0,
  final_rank INTEGER,

  -- Access
  access_tier TEXT DEFAULT 'full_suite' CHECK (access_tier IN ('full_suite', 'friday_pass')),

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(tournament_id, user_id)
);

-- 3. gideon_season_stats — Persistent stats (full members only)
CREATE TABLE IF NOT EXISTS gideon_season_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  season TEXT NOT NULL DEFAULT '2026-Q1',

  tournaments_played INTEGER DEFAULT 0,
  tournaments_won INTEGER DEFAULT 0,
  total_questions_answered INTEGER DEFAULT 0,
  total_questions_correct INTEGER DEFAULT 0,
  avg_accuracy NUMERIC(5,2) DEFAULT 0,
  avg_survival_depth NUMERIC(5,2) DEFAULT 0,
  total_score NUMERIC(12,2) DEFAULT 0,
  best_single_tournament_score NUMERIC(10,2) DEFAULT 0,
  current_win_streak INTEGER DEFAULT 0,
  best_win_streak INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, season)
);

-- ============================================================
-- Enable Realtime
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE gideon_tournaments;
ALTER PUBLICATION supabase_realtime ADD TABLE gideon_tournament_players;

-- ============================================================
-- RLS Policies
-- ============================================================

-- gideon_tournaments
ALTER TABLE gideon_tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gideon tournaments"
  ON gideon_tournaments FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Host can create gideon tournaments"
  ON gideon_tournaments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Host can update gideon tournaments"
  ON gideon_tournaments FOR UPDATE TO authenticated
  USING (auth.uid() = host_id);

-- gideon_tournament_players
ALTER TABLE gideon_tournament_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gideon tournament players"
  ON gideon_tournament_players FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can join gideon tournaments"
  ON gideon_tournament_players FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Players can update own gideon data"
  ON gideon_tournament_players FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- gideon_season_stats
ALTER TABLE gideon_season_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gideon season stats"
  ON gideon_season_stats FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can insert own gideon season stats"
  ON gideon_season_stats FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gideon season stats"
  ON gideon_season_stats FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_gideon_tournaments_room ON gideon_tournaments(game_room_id);
CREATE INDEX idx_gideon_tournaments_host ON gideon_tournaments(host_id);
CREATE INDEX idx_gideon_tournaments_status ON gideon_tournaments(status);
CREATE INDEX idx_gideon_players_tournament ON gideon_tournament_players(tournament_id);
CREATE INDEX idx_gideon_players_user ON gideon_tournament_players(user_id);
CREATE INDEX idx_gideon_season_user ON gideon_season_stats(user_id, season);
