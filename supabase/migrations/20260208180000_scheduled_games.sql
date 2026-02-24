-- Scheduled Games Feature
-- Allows users to schedule future games and get RSVPs

-- Table for scheduled games
CREATE TABLE IF NOT EXISTS public.scheduled_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  host_name TEXT NOT NULL,
  game_type TEXT NOT NULL DEFAULT 'scrabble-pt', -- Could support other games later
  title TEXT, -- Optional custom title
  description TEXT, -- Optional description
  scheduled_at TIMESTAMPTZ NOT NULL, -- When the game is scheduled to start
  verse_reference TEXT, -- Optional pre-selected verse
  game_mode TEXT DEFAULT 'ffa', -- ffa or team
  max_players INTEGER DEFAULT 10,
  status TEXT DEFAULT 'scheduled', -- scheduled, started, cancelled, completed
  room_code TEXT, -- Generated when game actually starts
  actual_game_id TEXT, -- Link to actual game when started
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSVPs for scheduled games
CREATE TABLE IF NOT EXISTS public.scheduled_game_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_game_id UUID NOT NULL REFERENCES public.scheduled_games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  status TEXT DEFAULT 'going', -- going, maybe, not_going
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(scheduled_game_id, user_id)
);

-- Enable RLS
ALTER TABLE public.scheduled_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_game_rsvps ENABLE ROW LEVEL SECURITY;

-- Policies for scheduled_games
CREATE POLICY "Anyone authenticated can view scheduled games"
  ON public.scheduled_games FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create scheduled games"
  ON public.scheduled_games FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Hosts can update their own scheduled games"
  ON public.scheduled_games FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_user_id);

CREATE POLICY "Hosts can delete their own scheduled games"
  ON public.scheduled_games FOR DELETE
  TO authenticated
  USING (auth.uid() = host_user_id);

-- Policies for scheduled_game_rsvps
CREATE POLICY "Anyone authenticated can view RSVPs"
  ON public.scheduled_game_rsvps FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can RSVP"
  ON public.scheduled_game_rsvps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own RSVP"
  ON public.scheduled_game_rsvps FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own RSVP"
  ON public.scheduled_game_rsvps FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_scheduled_games_host ON public.scheduled_games(host_user_id);
CREATE INDEX idx_scheduled_games_scheduled_at ON public.scheduled_games(scheduled_at);
CREATE INDEX idx_scheduled_games_status ON public.scheduled_games(status);
CREATE INDEX idx_scheduled_game_rsvps_game ON public.scheduled_game_rsvps(scheduled_game_id);
CREATE INDEX idx_scheduled_game_rsvps_user ON public.scheduled_game_rsvps(user_id);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.scheduled_games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scheduled_game_rsvps;

-- Comments
COMMENT ON TABLE public.scheduled_games IS 'Scheduled future game sessions that users can RSVP to';
COMMENT ON TABLE public.scheduled_game_rsvps IS 'RSVPs for scheduled games';
