
-- Table for challenge submissions shared to the community leaderboard
CREATE TABLE public.challenge_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('chef', 'equation', 'daily')),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  difficulty TEXT,
  jeeves_score INTEGER DEFAULT 0,
  jeeves_feedback TEXT,
  jeeves_highlights TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for leaderboard queries
CREATE INDEX idx_challenge_leaderboard_type_score ON public.challenge_leaderboard(challenge_type, jeeves_score DESC);
CREATE INDEX idx_challenge_leaderboard_user ON public.challenge_leaderboard(user_id);

-- Enable RLS
ALTER TABLE public.challenge_leaderboard ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read leaderboard entries
CREATE POLICY "Anyone can view leaderboard" ON public.challenge_leaderboard
  FOR SELECT TO authenticated USING (true);

-- Users can insert their own entries
CREATE POLICY "Users can insert own entries" ON public.challenge_leaderboard
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_leaderboard;
