
-- Equation Battle Games
CREATE TABLE public.equation_battle_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL,
  room_code TEXT NOT NULL UNIQUE DEFAULT 'EB' || UPPER(SUBSTRING(MD5(random()::TEXT || NOW()::TEXT) FROM 1 FOR 6)),
  verse TEXT NOT NULL,
  equation TEXT NOT NULL,
  symbols TEXT[] NOT NULL DEFAULT '{}',
  explanation TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'easy',
  game_mode TEXT NOT NULL DEFAULT 'individuals', -- 'individuals' or 'teams'
  max_players INTEGER NOT NULL DEFAULT 4,
  status TEXT NOT NULL DEFAULT 'waiting', -- waiting, active, grading, completed
  time_limit_seconds INTEGER DEFAULT 300,
  combined_result TEXT,
  combined_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Equation Battle Players
CREATE TABLE public.equation_battle_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES public.equation_battle_games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'Player',
  team_name TEXT, -- NULL for individuals mode
  assigned_symbols TEXT[] NOT NULL DEFAULT '{}',
  assigned_portion TEXT, -- the part of the equation they must decode
  answer TEXT,
  score INTEGER,
  feedback TEXT,
  is_done BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(game_id, user_id)
);

-- Enable RLS
ALTER TABLE public.equation_battle_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equation_battle_players ENABLE ROW LEVEL SECURITY;

-- RLS policies for games
CREATE POLICY "Users can view games they are in" ON public.equation_battle_games
  FOR SELECT TO authenticated
  USING (
    host_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.equation_battle_players WHERE game_id = id AND user_id = auth.uid())
  );

CREATE POLICY "Authenticated users can create games" ON public.equation_battle_games
  FOR INSERT TO authenticated
  WITH CHECK (host_id = auth.uid());

CREATE POLICY "Host can update games" ON public.equation_battle_games
  FOR UPDATE TO authenticated
  USING (host_id = auth.uid());

-- RLS policies for players
CREATE POLICY "Players can view game participants" ON public.equation_battle_players
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.equation_battle_players p2 WHERE p2.game_id = game_id AND p2.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.equation_battle_games g WHERE g.id = game_id AND g.host_id = auth.uid())
  );

CREATE POLICY "Authenticated users can join games" ON public.equation_battle_players
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Players can update their own record" ON public.equation_battle_players
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Host can also update players (for assigning portions)
CREATE POLICY "Host can update players" ON public.equation_battle_players
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.equation_battle_games g WHERE g.id = game_id AND g.host_id = auth.uid())
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.equation_battle_games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.equation_battle_players;
