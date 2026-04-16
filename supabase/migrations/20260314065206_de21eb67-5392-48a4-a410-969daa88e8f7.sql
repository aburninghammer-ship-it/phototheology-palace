
CREATE TABLE public.character_deep_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id TEXT NOT NULL UNIQUE,
  analysis_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Public read access (no auth required to view cached analyses)
ALTER TABLE public.character_deep_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read character analyses"
  ON public.character_deep_analyses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert/update"
  ON public.character_deep_analyses
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
