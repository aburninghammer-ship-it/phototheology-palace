
-- Generic game rooms table for all multiplayer games
CREATE TABLE public.game_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT NOT NULL UNIQUE,
  game_type TEXT NOT NULL, -- 'tic-tac-toe', 'connect-four', 'checkers', 'chess', 'jeopardy', etc.
  host_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting', 'active', 'completed'
  game_state JSONB NOT NULL DEFAULT '{}',
  max_players INTEGER NOT NULL DEFAULT 2,
  settings JSONB NOT NULL DEFAULT '{}',
  current_turn_user_id UUID,
  winner_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Players in game rooms
CREATE TABLE public.game_room_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.game_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  player_index INTEGER NOT NULL DEFAULT 0,
  player_data JSONB NOT NULL DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_room_players;

-- RLS
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_room_players ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view game rooms
CREATE POLICY "Anyone can view game rooms" ON public.game_rooms
  FOR SELECT TO authenticated USING (true);

-- Authenticated users can create rooms
CREATE POLICY "Users can create game rooms" ON public.game_rooms
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_id);

-- Players in the game can update it
CREATE POLICY "Players can update game rooms" ON public.game_rooms
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.game_room_players WHERE room_id = id AND user_id = auth.uid())
  );

-- Anyone authenticated can view players
CREATE POLICY "Anyone can view game room players" ON public.game_room_players
  FOR SELECT TO authenticated USING (true);

-- Users can join games
CREATE POLICY "Users can join game rooms" ON public.game_room_players
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Players can update own data
CREATE POLICY "Players can update own data" ON public.game_room_players
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Index for room code lookups
CREATE INDEX idx_game_rooms_room_code ON public.game_rooms(room_code);
CREATE INDEX idx_game_rooms_status ON public.game_rooms(status);
CREATE INDEX idx_game_room_players_room_id ON public.game_room_players(room_id);
CREATE INDEX idx_game_room_players_user_id ON public.game_room_players(user_id);
