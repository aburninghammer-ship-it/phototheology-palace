
-- Uno multiplayer games table
CREATE TABLE public.uno_games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT NOT NULL UNIQUE,
  host_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed')),
  game_mode TEXT NOT NULL DEFAULT 'easy' CHECK (game_mode IN ('easy', 'classic')),
  max_players INTEGER NOT NULL DEFAULT 4 CHECK (max_players BETWEEN 2 AND 8),
  game_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  current_player_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Uno multiplayer players table
CREATE TABLE public.uno_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.uno_games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'Player',
  hand JSONB NOT NULL DEFAULT '[]'::jsonb,
  score INTEGER NOT NULL DEFAULT 0,
  player_index INTEGER NOT NULL DEFAULT 0,
  is_host BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(game_id, user_id)
);

-- Enable RLS
ALTER TABLE public.uno_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uno_players ENABLE ROW LEVEL SECURITY;

-- RLS: anyone authenticated can read games (for joining)
CREATE POLICY "Authenticated users can read uno games" ON public.uno_games
  FOR SELECT TO authenticated USING (true);

-- RLS: authenticated users can create games
CREATE POLICY "Authenticated users can create uno games" ON public.uno_games
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_id);

-- RLS: host or players can update games
CREATE POLICY "Game participants can update uno games" ON public.uno_games
  FOR UPDATE TO authenticated USING (
    host_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.uno_players WHERE game_id = uno_games.id AND user_id = auth.uid()
    )
  );

-- RLS: anyone authenticated can read players
CREATE POLICY "Authenticated users can read uno players" ON public.uno_players
  FOR SELECT TO authenticated USING (true);

-- RLS: authenticated users can join games
CREATE POLICY "Authenticated users can join uno games" ON public.uno_players
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS: players can update their own records, or host can update all
CREATE POLICY "Players can update own records" ON public.uno_players
  FOR UPDATE TO authenticated USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.uno_games WHERE id = uno_players.game_id AND host_id = auth.uid()
    )
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.uno_games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.uno_players;

-- Updated_at trigger
CREATE TRIGGER update_uno_games_updated_at
  BEFORE UPDATE ON public.uno_games
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mastery_updated_at();
