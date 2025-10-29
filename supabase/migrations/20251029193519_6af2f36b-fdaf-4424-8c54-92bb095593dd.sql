-- Create table for custom equation challenges
CREATE TABLE IF NOT EXISTS public.equation_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  verse TEXT NOT NULL,
  equation TEXT NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'intermediate', 'advanced', 'pro')),
  symbols TEXT[] NOT NULL,
  share_code TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT true,
  solve_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.equation_challenges ENABLE ROW LEVEL SECURITY;

-- Anyone can view public challenges
CREATE POLICY "Public challenges are viewable by everyone"
  ON public.equation_challenges
  FOR SELECT
  USING (is_public = true);

-- Users can view their own challenges
CREATE POLICY "Users can view own challenges"
  ON public.equation_challenges
  FOR SELECT
  USING (auth.uid() = created_by);

-- Users can create their own challenges
CREATE POLICY "Users can create own challenges"
  ON public.equation_challenges
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own challenges
CREATE POLICY "Users can update own challenges"
  ON public.equation_challenges
  FOR UPDATE
  USING (auth.uid() = created_by);

-- Users can delete their own challenges
CREATE POLICY "Users can delete own challenges"
  ON public.equation_challenges
  FOR DELETE
  USING (auth.uid() = created_by);

-- Index for faster lookups
CREATE INDEX idx_equation_challenges_share_code ON public.equation_challenges(share_code);
CREATE INDEX idx_equation_challenges_created_by ON public.equation_challenges(created_by);

-- Function to generate unique share code
CREATE OR REPLACE FUNCTION generate_challenge_share_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  attempts INT := 0;
BEGIN
  LOOP
    code := 'EQ' || UPPER(SUBSTRING(MD5(random()::TEXT || NOW()::TEXT) FROM 1 FOR 8));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.equation_challenges WHERE share_code = code);
    attempts := attempts + 1;
    IF attempts > 100 THEN
      RAISE EXCEPTION 'Failed to generate unique share code';
    END IF;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;