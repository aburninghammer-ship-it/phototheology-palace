-- Master Exam: comprehensive 50-question assessment across all Phototheology Palace content

CREATE TABLE IF NOT EXISTS public.master_exam_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  questions_data JSONB,
  user_answers JSONB,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  total_correct INTEGER,
  total_questions INTEGER NOT NULL DEFAULT 50,
  category_scores JSONB,
  ai_grading JSONB,
  time_limit_seconds INTEGER NOT NULL DEFAULT 5400,
  time_used_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating','in_progress','submitted','grading','completed','abandoned')),
  attempt_number INTEGER NOT NULL DEFAULT 1,
  started_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  graded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fetching user history
CREATE INDEX idx_master_exam_user_created ON public.master_exam_attempts(user_id, created_at DESC);

-- Auto-increment attempt_number per user
CREATE OR REPLACE FUNCTION public.set_master_exam_attempt_number()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(attempt_number), 0) + 1
  INTO NEW.attempt_number
  FROM public.master_exam_attempts
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_master_exam_attempt_number ON public.master_exam_attempts;
CREATE TRIGGER trg_master_exam_attempt_number
  BEFORE INSERT ON public.master_exam_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_master_exam_attempt_number();

-- RLS
ALTER TABLE public.master_exam_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exam attempts"
  ON public.master_exam_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exam attempts"
  ON public.master_exam_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exam attempts"
  ON public.master_exam_attempts FOR UPDATE
  USING (auth.uid() = user_id);
