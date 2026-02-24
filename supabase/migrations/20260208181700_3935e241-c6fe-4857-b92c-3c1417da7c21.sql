-- Create scheduled_games table for game scheduling feature
CREATE TABLE IF NOT EXISTS public.scheduled_games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  host_name TEXT NOT NULL,
  game_type TEXT NOT NULL DEFAULT 'scrabble-pt',
  title TEXT,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  verse_reference TEXT,
  game_mode TEXT NOT NULL DEFAULT 'ffa',
  max_players INTEGER NOT NULL DEFAULT 10,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'started', 'cancelled', 'completed')),
  room_code TEXT,
  actual_game_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create scheduled_game_rsvps table for RSVPs
CREATE TABLE IF NOT EXISTS public.scheduled_game_rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheduled_game_id UUID NOT NULL REFERENCES public.scheduled_games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'not_going')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(scheduled_game_id, user_id)
);

-- Enable RLS
ALTER TABLE public.scheduled_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_game_rsvps ENABLE ROW LEVEL SECURITY;

-- Policies for scheduled_games
CREATE POLICY "Anyone can view scheduled games"
  ON public.scheduled_games FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create games"
  ON public.scheduled_games FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Hosts can update their games"
  ON public.scheduled_games FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_user_id);

CREATE POLICY "Hosts can delete their games"
  ON public.scheduled_games FOR DELETE
  TO authenticated
  USING (auth.uid() = host_user_id);

-- Policies for RSVPs
CREATE POLICY "Anyone can view RSVPs"
  ON public.scheduled_game_rsvps FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can RSVP"
  ON public.scheduled_game_rsvps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their RSVPs"
  ON public.scheduled_game_rsvps FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their RSVPs"
  ON public.scheduled_game_rsvps FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_scheduled_games_scheduled_at ON public.scheduled_games(scheduled_at);
CREATE INDEX idx_scheduled_games_status ON public.scheduled_games(status);
CREATE INDEX idx_scheduled_game_rsvps_game_id ON public.scheduled_game_rsvps(scheduled_game_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.scheduled_games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scheduled_game_rsvps;