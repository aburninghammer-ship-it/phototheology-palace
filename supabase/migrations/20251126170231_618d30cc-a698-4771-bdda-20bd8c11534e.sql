-- PT Card Battle Game Tables
-- This supports user vs user, user vs AI, team vs team, and AI vs AI game modes

CREATE TABLE pt_card_battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  game_mode TEXT NOT NULL CHECK (game_mode IN ('user_vs_jeeves', 'user_vs_user', 'team_vs_team', 'jeeves_vs_jeeves')),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed', 'abandoned')),
  story_text TEXT NOT NULL,
  story_reference TEXT,
  current_turn_player TEXT NOT NULL,
  winner TEXT,
  host_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  saved_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_saved BOOLEAN DEFAULT false,
  game_settings JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE pt_battle_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id UUID NOT NULL REFERENCES pt_card_battles(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL, -- 'user_{uuid}', 'jeeves_1', 'team_a', 'team_b'
  player_type TEXT NOT NULL CHECK (player_type IN ('human', 'ai', 'team')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  cards_in_hand JSONB NOT NULL DEFAULT '[]'::jsonb,
  cards_played JSONB NOT NULL DEFAULT '[]'::jsonb,
  score INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  team_name TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(battle_id, player_id)
);

CREATE TABLE pt_battle_moves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id UUID NOT NULL REFERENCES pt_card_battles(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL,
  move_number INTEGER NOT NULL,
  card_used TEXT NOT NULL,
  response_text TEXT NOT NULL,
  judge_verdict TEXT NOT NULL CHECK (judge_verdict IN ('approved', 'rejected')),
  judge_feedback TEXT NOT NULL,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  bonuses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(battle_id, move_number)
);

-- Indexes for performance
CREATE INDEX idx_pt_card_battles_status ON pt_card_battles(status);
CREATE INDEX idx_pt_card_battles_host ON pt_card_battles(host_user_id);
CREATE INDEX idx_pt_card_battles_saved ON pt_card_battles(saved_by_user_id) WHERE is_saved = true;
CREATE INDEX idx_pt_battle_players_battle ON pt_battle_players(battle_id);
CREATE INDEX idx_pt_battle_players_user ON pt_battle_players(user_id);
CREATE INDEX idx_pt_battle_moves_battle ON pt_battle_moves(battle_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE pt_card_battles;
ALTER PUBLICATION supabase_realtime ADD TABLE pt_battle_players;
ALTER PUBLICATION supabase_realtime ADD TABLE pt_battle_moves;

-- RLS Policies
ALTER TABLE pt_card_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pt_battle_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE pt_battle_moves ENABLE ROW LEVEL SECURITY;

-- Anyone can view active games
CREATE POLICY "Anyone can view games" ON pt_card_battles FOR SELECT USING (true);

-- Users can create games
CREATE POLICY "Users can create games" ON pt_card_battles FOR INSERT 
  WITH CHECK (auth.uid() = host_user_id);

-- Players can update their games
CREATE POLICY "Players can update games" ON pt_card_battles FOR UPDATE
  USING (
    auth.uid() = host_user_id OR
    auth.uid() IN (SELECT user_id FROM pt_battle_players WHERE battle_id = id)
  );

-- Players policies
CREATE POLICY "Anyone can view players" ON pt_battle_players FOR SELECT USING (true);

CREATE POLICY "Users can join as players" ON pt_battle_players FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Players can update themselves" ON pt_battle_players FOR UPDATE
  USING (auth.uid() = user_id);

-- Moves policies
CREATE POLICY "Anyone can view moves" ON pt_battle_moves FOR SELECT USING (true);

CREATE POLICY "Players can insert moves" ON pt_battle_moves FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pt_battle_players
      WHERE battle_id = pt_battle_moves.battle_id
      AND player_id = pt_battle_moves.player_id
      AND user_id = auth.uid()
    )
  );

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_pt_card_battles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pt_card_battles_updated_at
  BEFORE UPDATE ON pt_card_battles
  FOR EACH ROW
  EXECUTE FUNCTION update_pt_card_battles_updated_at();