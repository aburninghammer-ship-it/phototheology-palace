CREATE TABLE IF NOT EXISTS public.war_college_manuscripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  avatar_id text NOT NULL,
  day_number integer NOT NULL,
  rank text NOT NULL,
  manuscript_data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (avatar_id, day_number)
);

-- Enable RLS
ALTER TABLE public.war_college_manuscripts ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read cached manuscripts
CREATE POLICY "Authenticated users can read manuscripts"
  ON public.war_college_manuscripts FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Service role inserts (edge function)
CREATE POLICY "Service role can insert manuscripts"
  ON public.war_college_manuscripts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update manuscripts"
  ON public.war_college_manuscripts FOR UPDATE
  USING (true);