
CREATE TABLE public.debate_turn_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID NOT NULL,
  turn_index INTEGER NOT NULL,
  turn_role TEXT NOT NULL CHECK (turn_role IN ('opponent', 'defender')),
  analysis_text TEXT,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(session_id, turn_index)
);

ALTER TABLE public.debate_turn_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own turn analyses"
  ON public.debate_turn_analyses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage turn analyses"
  ON public.debate_turn_analyses
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_debate_turn_analyses_session ON public.debate_turn_analyses(session_id);
CREATE INDEX idx_debate_turn_analyses_user ON public.debate_turn_analyses(user_id);
