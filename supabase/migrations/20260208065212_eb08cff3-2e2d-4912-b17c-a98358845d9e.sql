-- PT Scrabble Multiplayer Tables

-- Games table
CREATE TABLE public.pt_scrabble_games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT NOT NULL UNIQUE,
  host_user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'completed')),
  game_mode TEXT NOT NULL DEFAULT 'ffa' CHECK (game_mode IN ('ffa', 'team')),
  max_players INTEGER NOT NULL DEFAULT 10,
  seed_card_id TEXT NOT NULL,
  seed_verse TEXT,
  board_state JSONB NOT NULL DEFAULT '{}',
  deck_remaining TEXT[] NOT NULL DEFAULT '{}',
  current_move_id UUID,
  vote_timeout_seconds INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Players table
CREATE TABLE public.pt_scrabble_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.pt_scrabble_games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  team_id UUID,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  hand JSONB NOT NULL DEFAULT '[]',
  score INTEGER NOT NULL DEFAULT 0,
  cards_played INTEGER NOT NULL DEFAULT 0,
  is_connected BOOLEAN NOT NULL DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(game_id, user_id)
);

-- Teams table (for team mode)
CREATE TABLE public.pt_scrabble_teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.pt_scrabble_games(id) ON DELETE CASCADE,
  team_number INTEGER NOT NULL,
  team_name TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0
);

-- Moves table
CREATE TABLE public.pt_scrabble_moves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.pt_scrabble_games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.pt_scrabble_players(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  card_code TEXT NOT NULL,
  card_name TEXT NOT NULL,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  connections JSONB NOT NULL DEFAULT '[]',
  explanation TEXT,
  is_christ_connection BOOLEAN NOT NULL DEFAULT false,
  points_base INTEGER NOT NULL DEFAULT 0,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  validation_status TEXT NOT NULL DEFAULT 'approved' CHECK (validation_status IN ('pending', 'voting', 'approved', 'rejected')),
  votes_approve INTEGER NOT NULL DEFAULT 0,
  votes_reject INTEGER NOT NULL DEFAULT 0,
  voting_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Votes table
CREATE TABLE public.pt_scrabble_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  move_id UUID NOT NULL REFERENCES public.pt_scrabble_moves(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.pt_scrabble_players(id) ON DELETE CASCADE,
  vote BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(move_id, player_id)
);

-- Enable Row Level Security
ALTER TABLE public.pt_scrabble_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_scrabble_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_scrabble_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_scrabble_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_scrabble_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for games (anyone authenticated can view/join, host can manage)
CREATE POLICY "Anyone can view games" ON public.pt_scrabble_games
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create games" ON public.pt_scrabble_games
  FOR INSERT WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Host can update game" ON public.pt_scrabble_games
  FOR UPDATE USING (auth.uid() = host_user_id);

-- Players policies
CREATE POLICY "Anyone can view players" ON public.pt_scrabble_players
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can join games" ON public.pt_scrabble_players
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Players can update their own record" ON public.pt_scrabble_players
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Players can leave games" ON public.pt_scrabble_players
  FOR DELETE USING (auth.uid() = user_id);

-- Teams policies
CREATE POLICY "Anyone can view teams" ON public.pt_scrabble_teams
  FOR SELECT USING (true);

CREATE POLICY "Host can manage teams" ON public.pt_scrabble_teams
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pt_scrabble_games g
      WHERE g.id = game_id AND g.host_user_id = auth.uid()
    )
  );

-- Moves policies
CREATE POLICY "Anyone can view moves" ON public.pt_scrabble_moves
  FOR SELECT USING (true);

CREATE POLICY "Players can create moves" ON public.pt_scrabble_moves
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pt_scrabble_players p
      WHERE p.id = player_id AND p.user_id = auth.uid()
    )
  );

-- Votes policies
CREATE POLICY "Anyone can view votes" ON public.pt_scrabble_votes
  FOR SELECT USING (true);

CREATE POLICY "Players can vote" ON public.pt_scrabble_votes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pt_scrabble_players p
      WHERE p.id = player_id AND p.user_id = auth.uid()
    )
  );

-- Enable realtime for multiplayer
ALTER PUBLICATION supabase_realtime ADD TABLE public.pt_scrabble_games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pt_scrabble_players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pt_scrabble_moves;

-- Indexes for performance
CREATE INDEX idx_scrabble_games_room_code ON public.pt_scrabble_games(room_code);
CREATE INDEX idx_scrabble_games_status ON public.pt_scrabble_games(status);
CREATE INDEX idx_scrabble_players_game_id ON public.pt_scrabble_players(game_id);
CREATE INDEX idx_scrabble_players_user_id ON public.pt_scrabble_players(user_id);
CREATE INDEX idx_scrabble_moves_game_id ON public.pt_scrabble_moves(game_id);