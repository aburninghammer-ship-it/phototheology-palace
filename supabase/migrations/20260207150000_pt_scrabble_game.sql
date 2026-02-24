-- PT Scrabble Game Tables
-- A Scrabble-style multiplayer grid game for Phototheology principles

-- Main game sessions
CREATE TABLE pt_scrabble_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT UNIQUE NOT NULL,
  host_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'completed')),
  game_mode TEXT DEFAULT 'ffa' CHECK (game_mode IN ('ffa', 'team')),
  max_players INTEGER DEFAULT 10,
  seed_card_id TEXT NOT NULL,
  board_state JSONB DEFAULT '{}',
  deck_remaining JSONB DEFAULT '[]',
  current_move_id UUID,
  vote_timeout_seconds INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

-- Team definitions (for team mode)
CREATE TABLE pt_scrabble_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES pt_scrabble_games(id) ON DELETE CASCADE,
  team_number INTEGER NOT NULL,
  team_name TEXT,
  total_score INTEGER DEFAULT 0,
  UNIQUE(game_id, team_number)
);

-- Players in game
CREATE TABLE pt_scrabble_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES pt_scrabble_games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  team_id UUID REFERENCES pt_scrabble_teams(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  hand JSONB DEFAULT '[]',
  score INTEGER DEFAULT 0,
  cards_played INTEGER DEFAULT 0,
  is_connected BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(game_id, user_id)
);

-- Individual card placements (move history)
CREATE TABLE pt_scrabble_moves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES pt_scrabble_games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES pt_scrabble_players(id) ON DELETE SET NULL,
  card_id TEXT NOT NULL,
  card_code TEXT NOT NULL,
  card_name TEXT NOT NULL,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  connections JSONB DEFAULT '[]',
  explanation TEXT,
  is_christ_connection BOOLEAN DEFAULT false,
  points_base INTEGER DEFAULT 0,
  points_awarded INTEGER DEFAULT 0,
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'voting', 'approved', 'rejected')),
  votes_approve INTEGER DEFAULT 0,
  votes_reject INTEGER DEFAULT 0,
  voting_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Individual votes on moves
CREATE TABLE pt_scrabble_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  move_id UUID REFERENCES pt_scrabble_moves(id) ON DELETE CASCADE,
  player_id UUID REFERENCES pt_scrabble_players(id) ON DELETE SET NULL,
  vote BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(move_id, player_id)
);

-- Add foreign key for current_move_id after moves table exists
ALTER TABLE pt_scrabble_games
  ADD CONSTRAINT fk_current_move
  FOREIGN KEY (current_move_id)
  REFERENCES pt_scrabble_moves(id)
  ON DELETE SET NULL;

-- Indexes for performance
CREATE INDEX idx_scrabble_games_room_code ON pt_scrabble_games(room_code);
CREATE INDEX idx_scrabble_games_status ON pt_scrabble_games(status);
CREATE INDEX idx_scrabble_players_game ON pt_scrabble_players(game_id);
CREATE INDEX idx_scrabble_players_user ON pt_scrabble_players(user_id);
CREATE INDEX idx_scrabble_moves_game ON pt_scrabble_moves(game_id);
CREATE INDEX idx_scrabble_moves_status ON pt_scrabble_moves(validation_status);
CREATE INDEX idx_scrabble_votes_move ON pt_scrabble_votes(move_id);

-- Enable Row Level Security
ALTER TABLE pt_scrabble_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE pt_scrabble_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE pt_scrabble_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE pt_scrabble_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE pt_scrabble_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pt_scrabble_games
CREATE POLICY "Anyone can view games" ON pt_scrabble_games
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create games" ON pt_scrabble_games
  FOR INSERT WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Host can update own games" ON pt_scrabble_games
  FOR UPDATE USING (auth.uid() = host_user_id);

CREATE POLICY "Players can update game board" ON pt_scrabble_games
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pt_scrabble_players
      WHERE game_id = pt_scrabble_games.id
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for pt_scrabble_teams
CREATE POLICY "Anyone can view teams" ON pt_scrabble_teams
  FOR SELECT USING (true);

CREATE POLICY "Host can create teams" ON pt_scrabble_teams
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM pt_scrabble_games
      WHERE id = game_id
      AND host_user_id = auth.uid()
    )
  );

CREATE POLICY "Players can update team score" ON pt_scrabble_teams
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pt_scrabble_players
      WHERE team_id = pt_scrabble_teams.id
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for pt_scrabble_players
CREATE POLICY "Anyone can view players" ON pt_scrabble_players
  FOR SELECT USING (true);

CREATE POLICY "Users can join games" ON pt_scrabble_players
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own player" ON pt_scrabble_players
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Host can update players" ON pt_scrabble_players
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pt_scrabble_games
      WHERE id = game_id
      AND host_user_id = auth.uid()
    )
  );

-- RLS Policies for pt_scrabble_moves
CREATE POLICY "Anyone can view moves" ON pt_scrabble_moves
  FOR SELECT USING (true);

CREATE POLICY "Players can create moves" ON pt_scrabble_moves
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM pt_scrabble_players
      WHERE id = player_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Players can update move votes" ON pt_scrabble_moves
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pt_scrabble_players p
      JOIN pt_scrabble_games g ON p.game_id = g.id
      WHERE g.id = pt_scrabble_moves.game_id
      AND p.user_id = auth.uid()
    )
  );

-- RLS Policies for pt_scrabble_votes
CREATE POLICY "Anyone can view votes" ON pt_scrabble_votes
  FOR SELECT USING (true);

CREATE POLICY "Players can vote" ON pt_scrabble_votes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM pt_scrabble_players
      WHERE id = player_id
      AND user_id = auth.uid()
    )
  );

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE pt_scrabble_games;
ALTER PUBLICATION supabase_realtime ADD TABLE pt_scrabble_players;
ALTER PUBLICATION supabase_realtime ADD TABLE pt_scrabble_moves;
ALTER PUBLICATION supabase_realtime ADD TABLE pt_scrabble_votes;

-- Function to generate unique room codes
CREATE OR REPLACE FUNCTION generate_scrabble_room_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate score based on connections
CREATE OR REPLACE FUNCTION calculate_scrabble_score(
  connection_count INTEGER,
  is_christ_connection BOOLEAN DEFAULT false
)
RETURNS INTEGER AS $$
DECLARE
  base_score INTEGER;
  multiplier INTEGER := 1;
BEGIN
  -- Scoring tiers: 1->1, 2->3, 3->6, 4->10
  CASE connection_count
    WHEN 1 THEN base_score := 1;
    WHEN 2 THEN base_score := 3;
    WHEN 3 THEN base_score := 6;
    WHEN 4 THEN base_score := 10;
    ELSE base_score := 10 + (connection_count - 4) * 5; -- Extra connections
  END CASE;

  -- Christ Connection doubles the score
  IF is_christ_connection THEN
    multiplier := 2;
  END IF;

  RETURN base_score * multiplier;
END;
$$ LANGUAGE plpgsql;
