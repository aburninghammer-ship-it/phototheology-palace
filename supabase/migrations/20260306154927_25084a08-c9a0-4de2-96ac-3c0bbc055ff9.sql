
CREATE TABLE public.master_exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'generating',
  attempt_number INTEGER NOT NULL DEFAULT 1,
  questions_data JSONB,
  answers_data JSONB,
  total_questions INTEGER DEFAULT 0,
  score NUMERIC,
  results JSONB,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.master_exam_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exam attempts"
  ON public.master_exam_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exam attempts"
  ON public.master_exam_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exam attempts"
  ON public.master_exam_attempts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-increment attempt_number per user
CREATE OR REPLACE FUNCTION public.set_exam_attempt_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.attempt_number := COALESCE(
    (SELECT MAX(attempt_number) FROM public.master_exam_attempts WHERE user_id = NEW.user_id),
    0
  ) + 1;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_exam_attempt_number
  BEFORE INSERT ON public.master_exam_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_exam_attempt_number();
