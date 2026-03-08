
ALTER TABLE public.debate_challenge_sessions 
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS share_token text UNIQUE DEFAULT NULL;

-- RLS policy for public viewing
CREATE POLICY "Anyone can view public debates"
ON public.debate_challenge_sessions
FOR SELECT
TO anon, authenticated
USING (is_public = true);
