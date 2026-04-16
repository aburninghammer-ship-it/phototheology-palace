-- Multiplayer match table for 1v1 scripture memory battles
CREATE TABLE public.multiplayer_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_type TEXT NOT NULL DEFAULT 'memory_battle',
  status TEXT NOT NULL DEFAULT 'waiting',
  player1_id UUID NOT NULL,
  player2_id UUID,
  player1_score INTEGER DEFAULT 0,
  player2_score INTEGER DEFAULT 0,
  verse_references TEXT[] DEFAULT '{}',
  total_rounds INTEGER DEFAULT 5,
  current_round INTEGER DEFAULT 0,
  winner_id UUID,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.multiplayer_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view matches" ON public.multiplayer_matches
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create matches" ON public.multiplayer_matches
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = player1_id);

CREATE POLICY "Players can update their matches" ON public.multiplayer_matches
  FOR UPDATE TO authenticated USING (auth.uid() = player1_id OR auth.uid() = player2_id);

-- Trivia rooms for multiplayer trivia
CREATE TABLE public.trivia_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT NOT NULL UNIQUE,
  host_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'lobby',
  max_players INTEGER DEFAULT 8,
  question_count INTEGER DEFAULT 10,
  difficulty TEXT DEFAULT 'mixed',
  current_question_index INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.trivia_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view rooms" ON public.trivia_rooms
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create rooms" ON public.trivia_rooms
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Host can update room" ON public.trivia_rooms
  FOR UPDATE TO authenticated USING (auth.uid() = host_id);

-- Trivia room players
CREATE TABLE public.trivia_room_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.trivia_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  score INTEGER DEFAULT 0,
  is_ready BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

ALTER TABLE public.trivia_room_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view players" ON public.trivia_room_players
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can join rooms" ON public.trivia_room_players
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own score" ON public.trivia_room_players
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" ON public.trivia_room_players
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Enable realtime for multiplayer
ALTER PUBLICATION supabase_realtime ADD TABLE public.multiplayer_matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trivia_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trivia_room_players;