-- Add per-question grading and challenge data columns to master_exam_attempts
ALTER TABLE public.master_exam_attempts
  ADD COLUMN IF NOT EXISTS per_question_grades JSONB DEFAULT '{}';

ALTER TABLE public.master_exam_attempts
  ADD COLUMN IF NOT EXISTS challenge_data JSONB DEFAULT '{}';
