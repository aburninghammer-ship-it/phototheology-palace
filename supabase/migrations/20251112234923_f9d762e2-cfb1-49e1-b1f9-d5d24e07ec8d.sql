-- Create tournaments table
CREATE TABLE IF NOT EXISTS principle_tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  host_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'registration', -- registration, in_progress, completed
  max_participants integer NOT NULL DEFAULT 16,
  current_round integer NOT NULL DEFAULT 1,
  total_rounds integer NOT NULL,
  prize_pool jsonb NOT NULL DEFAULT '[]'::jsonb,
  registration_ends_at timestamptz NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create tournament participants table
CREATE TABLE IF NOT EXISTS principle_tournament_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES principle_tournaments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seed_number integer,
  total_score integer NOT NULL DEFAULT 0,
  matches_won integer NOT NULL DEFAULT 0,
  matches_lost integer NOT NULL DEFAULT 0,
  is_eliminated boolean NOT NULL DEFAULT false,
  final_placement integer,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

-- Create tournament matches table (bracket system)
CREATE TABLE IF NOT EXISTS principle_tournament_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES principle_tournaments(id) ON DELETE CASCADE,
  round_number integer NOT NULL,
  match_number integer NOT NULL,
  player1_id uuid REFERENCES auth.users(id),
  player2_id uuid REFERENCES auth.users(id),
  winner_id uuid REFERENCES auth.users(id),
  player1_score integer DEFAULT 0,
  player2_score integer DEFAULT 0,
  game_id uuid REFERENCES principle_card_games(id),
  status text NOT NULL DEFAULT 'pending', -- pending, in_progress, completed
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  next_match_id uuid REFERENCES principle_tournament_matches(id),
  UNIQUE(tournament_id, round_number, match_number)
);

-- Enable RLS
ALTER TABLE principle_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE principle_tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE principle_tournament_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tournaments
CREATE POLICY "Tournaments viewable by everyone"
  ON principle_tournaments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tournaments"
  ON principle_tournaments FOR INSERT
  WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Hosts can update their tournaments"
  ON principle_tournaments FOR UPDATE
  USING (auth.uid() = host_user_id);

-- RLS Policies for participants
CREATE POLICY "Tournament participants viewable by everyone"
  ON principle_tournament_participants FOR SELECT
  USING (true);

CREATE POLICY "Users can join tournaments"
  ON principle_tournament_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for matches
CREATE POLICY "Tournament matches viewable by everyone"
  ON principle_tournament_matches FOR SELECT
  USING (true);

CREATE POLICY "Tournament hosts can create matches"
  ON principle_tournament_matches FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM principle_tournaments
      WHERE id = tournament_id AND host_user_id = auth.uid()
    )
  );

CREATE POLICY "Match participants can update their matches"
  ON principle_tournament_matches FOR UPDATE
  USING (auth.uid() = player1_id OR auth.uid() = player2_id OR 
    EXISTS (
      SELECT 1 FROM principle_tournaments
      WHERE id = tournament_id AND host_user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_tournaments_status ON principle_tournaments(status);
CREATE INDEX idx_tournament_participants_tournament ON principle_tournament_participants(tournament_id);
CREATE INDEX idx_tournament_matches_tournament ON principle_tournament_matches(tournament_id);
CREATE INDEX idx_tournament_matches_round ON principle_tournament_matches(tournament_id, round_number);