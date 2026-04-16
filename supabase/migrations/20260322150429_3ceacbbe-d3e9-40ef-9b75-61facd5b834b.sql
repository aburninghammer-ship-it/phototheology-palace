
-- Create public challenge responses table
CREATE TABLE public.public_challenge_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.equation_challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_name TEXT,
  response_text TEXT NOT NULL,
  grade_score INTEGER,
  jeeves_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.public_challenge_responses ENABLE ROW LEVEL SECURITY;

-- Anyone can view responses on public challenges
CREATE POLICY "Anyone can view public challenge responses" ON public.public_challenge_responses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.equation_challenges ec WHERE ec.id = challenge_id AND ec.is_public = true)
  );

-- Authenticated users can insert responses
CREATE POLICY "Auth users can insert responses" ON public.public_challenge_responses
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow anonymous read of public equation challenges
CREATE POLICY "Anyone can view public equation challenges" ON public.equation_challenges
  FOR SELECT USING (is_public = true);

-- Enable realtime for responses
ALTER PUBLICATION supabase_realtime ADD TABLE public.public_challenge_responses;
