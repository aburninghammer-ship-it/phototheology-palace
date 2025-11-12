-- Create principle cards game tables
CREATE TABLE IF NOT EXISTS principle_card_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL,
  host_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'waiting',
  max_players integer NOT NULL DEFAULT 4,
  current_round integer NOT NULL DEFAULT 1,
  total_rounds integer NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  ended_at timestamptz,
  winner_id uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS principle_card_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES principle_card_games(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  cards_won integer NOT NULL DEFAULT 0,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(game_id, user_id)
);

CREATE TABLE IF NOT EXISTS principle_card_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES principle_card_games(id) ON DELETE CASCADE,
  round_number integer NOT NULL,
  card_principle text NOT NULL,
  card_description text NOT NULL,
  scenario_text text NOT NULL,
  correct_player_id uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(game_id, round_number)
);

-- Enable RLS
ALTER TABLE principle_card_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE principle_card_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE principle_card_rounds ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view games"
  ON principle_card_games FOR SELECT
  USING (true);

CREATE POLICY "Users can create games"
  ON principle_card_games FOR INSERT
  WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Host can update game"
  ON principle_card_games FOR UPDATE
  USING (auth.uid() = host_user_id);

CREATE POLICY "Players can view their games"
  ON principle_card_players FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM principle_card_games
    WHERE id = principle_card_players.game_id
  ));

CREATE POLICY "Players can join games"
  ON principle_card_players FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Players can update their stats"
  ON principle_card_players FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view rounds"
  ON principle_card_rounds FOR SELECT
  USING (true);

CREATE POLICY "Game host can manage rounds"
  ON principle_card_rounds FOR ALL
  USING (EXISTS (
    SELECT 1 FROM principle_card_games
    WHERE id = principle_card_rounds.game_id
    AND host_user_id = auth.uid()
  ));

-- Indexes
CREATE INDEX idx_card_games_status ON principle_card_games(status);
CREATE INDEX idx_card_players_game ON principle_card_players(game_id);
CREATE INDEX idx_card_rounds_game ON principle_card_rounds(game_id);