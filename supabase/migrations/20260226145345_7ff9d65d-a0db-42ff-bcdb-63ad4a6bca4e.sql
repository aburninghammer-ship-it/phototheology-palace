
CREATE TABLE public.ai_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  function_name TEXT NOT NULL,
  model TEXT,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  estimated_cost_cents NUMERIC(10,4) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_usage_log_user_id ON public.ai_usage_log(user_id);
CREATE INDEX idx_ai_usage_log_function ON public.ai_usage_log(function_name);
CREATE INDEX idx_ai_usage_log_created ON public.ai_usage_log(created_at);

ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;

-- Users can read their own usage
CREATE POLICY "Users read own AI usage" ON public.ai_usage_log
  FOR SELECT USING (auth.uid() = user_id);

-- Edge functions insert via service role (no user-facing insert policy needed)
-- Admin can read all
CREATE POLICY "Admins read all AI usage" ON public.ai_usage_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );
