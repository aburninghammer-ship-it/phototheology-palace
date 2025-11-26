-- Create PT Multiplayer Game Tables

-- Main games table
CREATE TABLE IF NOT EXISTS public.pt_multiplayer_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  host_id UUID NOT NULL,
  game_mode TEXT NOT NULL CHECK (game_mode IN ('free-for-all', 'team', 'council', 'boss', 'battle-royale')),
  study_topic TEXT NOT NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed', 'cancelled')),
  current_turn_player_id UUID,
  max_players INTEGER DEFAULT 8 CHECK (max_players >= 2 AND max_players <= 8),
  settings JSONB DEFAULT '{}'::jsonb,
  generated_study JSONB,
  winner_id UUID,
  completed_at TIMESTAMPTZ
);

-- Players in games
CREATE TABLE IF NOT EXISTS public.pt_multiplayer_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES public.pt_multiplayer_games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT now(),
  hand JSONB DEFAULT '[]'::jsonb,
  score INTEGER DEFAULT 0,
  team TEXT,
  cards_remaining INTEGER DEFAULT 7,
  consecutive_rejections INTEGER DEFAULT 0,
  skip_next_turn BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(game_id, user_id)
);

-- Game moves and Jeeves judgments
CREATE TABLE IF NOT EXISTS public.pt_multiplayer_moves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES public.pt_multiplayer_games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.pt_multiplayer_players(id) ON DELETE CASCADE,
  move_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  card_type TEXT NOT NULL,
  card_data JSONB NOT NULL,
  explanation TEXT NOT NULL,
  jeeves_verdict TEXT CHECK (jeeves_verdict IN ('approved', 'partial', 'rejected')),
  jeeves_feedback TEXT,
  points_awarded INTEGER DEFAULT 0,
  is_combo BOOLEAN DEFAULT false,
  combo_cards JSONB,
  clarification_text TEXT,
  clarification_attempt_at TIMESTAMPTZ
);

-- Active card deck for each game
CREATE TABLE IF NOT EXISTS public.pt_multiplayer_deck (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES public.pt_multiplayer_games(id) ON DELETE CASCADE,
  card_type TEXT NOT NULL,
  card_data JSONB NOT NULL,
  is_drawn BOOLEAN DEFAULT false,
  drawn_by UUID REFERENCES public.pt_multiplayer_players(id),
  drawn_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE public.pt_multiplayer_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_multiplayer_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_multiplayer_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_multiplayer_deck ENABLE ROW LEVEL SECURITY;

-- RLS Policies for games
CREATE POLICY "Users can view games they're in"
  ON public.pt_multiplayer_games FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pt_multiplayer_players
      WHERE pt_multiplayer_players.game_id = pt_multiplayer_games.id
      AND pt_multiplayer_players.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create games"
  ON public.pt_multiplayer_games FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Host can update their games"
  ON public.pt_multiplayer_games FOR UPDATE
  USING (auth.uid() = host_id);

-- RLS Policies for players
CREATE POLICY "Users can view players in their games"
  ON public.pt_multiplayer_players FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pt_multiplayer_players AS my_player
      WHERE my_player.game_id = pt_multiplayer_players.game_id
      AND my_player.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join games"
  ON public.pt_multiplayer_players FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own player data"
  ON public.pt_multiplayer_players FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for moves
CREATE POLICY "Users can view moves in their games"
  ON public.pt_multiplayer_moves FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pt_multiplayer_players
      WHERE pt_multiplayer_players.game_id = pt_multiplayer_moves.game_id
      AND pt_multiplayer_players.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own moves"
  ON public.pt_multiplayer_moves FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pt_multiplayer_players
      WHERE pt_multiplayer_players.id = player_id
      AND pt_multiplayer_players.user_id = auth.uid()
    )
  );

-- RLS Policies for deck
CREATE POLICY "Users can view deck in their games"
  ON public.pt_multiplayer_deck FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pt_multiplayer_players
      WHERE pt_multiplayer_players.game_id = pt_multiplayer_deck.game_id
      AND pt_multiplayer_players.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_pt_multiplayer_games_status ON public.pt_multiplayer_games(status);
CREATE INDEX idx_pt_multiplayer_players_game_id ON public.pt_multiplayer_players(game_id);
CREATE INDEX idx_pt_multiplayer_players_user_id ON public.pt_multiplayer_players(user_id);
CREATE INDEX idx_pt_multiplayer_moves_game_id ON public.pt_multiplayer_moves(game_id);
CREATE INDEX idx_pt_multiplayer_deck_game_id ON public.pt_multiplayer_deck(game_id);

-- Enable realtime for multiplayer
ALTER PUBLICATION supabase_realtime ADD TABLE public.pt_multiplayer_games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pt_multiplayer_players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pt_multiplayer_moves;