
-- Add exam_type column to master_exam_attempts
ALTER TABLE public.master_exam_attempts 
ADD COLUMN IF NOT EXISTS exam_type text NOT NULL DEFAULT 'master';

-- Add error_patterns column for diagnostic analysis
ALTER TABLE public.master_exam_attempts 
ADD COLUMN IF NOT EXISTS error_patterns jsonb;

-- Add diagnostic_report column for Jeeves analysis
ALTER TABLE public.master_exam_attempts 
ADD COLUMN IF NOT EXISTS diagnostic_report jsonb;

-- Add weekly_plan_id to link exam results to generated plans
ALTER TABLE public.master_exam_attempts 
ADD COLUMN IF NOT EXISTS weekly_plan_id uuid;

-- Create index for filtering by exam_type
CREATE INDEX IF NOT EXISTS idx_master_exam_attempts_exam_type 
ON public.master_exam_attempts (user_id, exam_type, status);
