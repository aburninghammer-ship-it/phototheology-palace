CREATE TABLE public.debate_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  analysis_text text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX idx_debate_analyses_session ON public.debate_analyses(session_id);
CREATE INDEX idx_debate_analyses_user_status ON public.debate_analyses(user_id, status);

ALTER TABLE public.debate_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own analyses"
  ON public.debate_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage analyses"
  ON public.debate_analyses FOR ALL
  USING (true);