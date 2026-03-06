
ALTER TABLE public.master_exam_attempts 
  ADD COLUMN IF NOT EXISTS total_correct INTEGER,
  ADD COLUMN IF NOT EXISTS category_scores JSONB,
  ADD COLUMN IF NOT EXISTS time_used_seconds INTEGER;
