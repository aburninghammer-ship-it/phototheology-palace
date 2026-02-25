
-- 40-Day Daily Debate Challenge tables

-- Enrollment table - tracks each user's challenge attempt
CREATE TABLE public.debate_challenge_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_day INTEGER NOT NULL DEFAULT 1,
  completed_days INTEGER NOT NULL DEFAULT 0,
  missed_days INTEGER NOT NULL DEFAULT 0,
  grace_days_used INTEGER NOT NULL DEFAULT 0,
  max_grace_days INTEGER NOT NULL DEFAULT 2,
  streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  completed_at TIMESTAMPTZ,
  last_activity_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Daily session table - one per day per enrollment
CREATE TABLE public.debate_challenge_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID NOT NULL REFERENCES public.debate_challenge_enrollments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  day_number INTEGER NOT NULL,
  opponent_id TEXT NOT NULL,
  opponent_name TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  rounds_completed INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  outcome TEXT CHECK (outcome IN ('win', 'loss', 'draw', NULL)),
  ai_verdict TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(enrollment_id, day_number)
);

-- Badges earned during the challenge
CREATE TABLE public.debate_challenge_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  enrollment_id UUID NOT NULL REFERENCES public.debate_challenge_enrollments(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.debate_challenge_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_challenge_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_challenge_badges ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users manage own enrollments" ON public.debate_challenge_enrollments
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own sessions" ON public.debate_challenge_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own badges" ON public.debate_challenge_badges
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_debate_enrollments_updated_at
  BEFORE UPDATE ON public.debate_challenge_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_living_manna_updated_at();

-- Enable realtime for sessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.debate_challenge_sessions;
