-- Weekly Study Challenges table
CREATE TABLE IF NOT EXISTS public.weekly_study_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  theme TEXT,
  anchor_passage TEXT NOT NULL,
  difficulty TEXT DEFAULT 'intermediate',
  status TEXT DEFAULT 'draft',
  week_number INTEGER,
  year INTEGER,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  judged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Weekly Study Submissions table
CREATE TABLE IF NOT EXISTS public.weekly_study_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES public.weekly_study_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  main_insight TEXT NOT NULL,
  scripture_connections TEXT[],
  principles_applied TEXT[],
  practical_application TEXT,
  supporting_evidence TEXT,
  word_count INTEGER,
  ai_score INTEGER,
  ai_feedback TEXT,
  rank INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Weekly Study Winners table
CREATE TABLE IF NOT EXISTS public.weekly_study_winners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES public.weekly_study_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  submission_id UUID REFERENCES public.weekly_study_submissions(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  xp_awarded INTEGER DEFAULT 0,
  badge_awarded TEXT,
  standout_insight TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Weekly Challenge Shares table
CREATE TABLE IF NOT EXISTS public.weekly_challenge_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES public.weekly_study_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  share_code TEXT NOT NULL UNIQUE,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Weekly Challenge Guest Contributions table  
CREATE TABLE IF NOT EXISTS public.weekly_challenge_guest_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES public.weekly_study_challenges(id) ON DELETE CASCADE,
  share_id UUID REFERENCES public.weekly_challenge_shares(id),
  name TEXT NOT NULL,
  email TEXT,
  contribution TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.weekly_study_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_study_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_study_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_challenge_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_challenge_guest_contributions ENABLE ROW LEVEL SECURITY;

-- Policies for weekly_study_challenges (public read for active)
CREATE POLICY "Anyone can view active challenges" ON public.weekly_study_challenges
  FOR SELECT USING (status = 'active' OR status = 'judged');

-- Policies for weekly_study_submissions
CREATE POLICY "Users can view all submissions for judged challenges" ON public.weekly_study_submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.weekly_study_challenges WHERE id = challenge_id AND status = 'judged')
    OR auth.uid() = user_id
  );

CREATE POLICY "Users can create their own submissions" ON public.weekly_study_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" ON public.weekly_study_submissions
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for weekly_study_winners
CREATE POLICY "Anyone can view winners" ON public.weekly_study_winners
  FOR SELECT USING (true);

-- Policies for weekly_challenge_shares
CREATE POLICY "Users can view their own shares" ON public.weekly_challenge_shares
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create shares" ON public.weekly_challenge_shares
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can update share clicks" ON public.weekly_challenge_shares
  FOR UPDATE USING (true);

-- Policies for weekly_challenge_guest_contributions
CREATE POLICY "Anyone can create guest contributions" ON public.weekly_challenge_guest_contributions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view guest contributions" ON public.weekly_challenge_guest_contributions
  FOR SELECT USING (true);

-- Create RPC functions
CREATE OR REPLACE FUNCTION public.create_challenge_share(p_challenge_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_share_code TEXT;
  v_result JSON;
BEGIN
  v_share_code := encode(gen_random_bytes(6), 'hex');
  
  INSERT INTO public.weekly_challenge_shares (challenge_id, user_id, share_code)
  VALUES (p_challenge_id, auth.uid(), v_share_code)
  ON CONFLICT DO NOTHING;
  
  SELECT json_build_object('share_code', share_code)
  INTO v_result
  FROM public.weekly_challenge_shares
  WHERE challenge_id = p_challenge_id AND user_id = auth.uid();
  
  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.track_share_click(p_share_code TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.weekly_challenge_shares
  SET clicks = clicks + 1
  WHERE share_code = p_share_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.award_xp(p_user_id UUID, p_amount INTEGER, p_reason TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET xp = COALESCE(xp, 0) + p_amount
  WHERE id = p_user_id;
END;
$$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_status ON public.weekly_study_challenges(status);
CREATE INDEX IF NOT EXISTS idx_weekly_submissions_challenge ON public.weekly_study_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_weekly_submissions_user ON public.weekly_study_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_winners_challenge ON public.weekly_study_winners(challenge_id);
CREATE INDEX IF NOT EXISTS idx_weekly_shares_code ON public.weekly_challenge_shares(share_code);