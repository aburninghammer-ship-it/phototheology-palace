-- Create table to store generated floor exercises for each day
CREATE TABLE IF NOT EXISTS public.reading_plan_daily_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_progress_id UUID NOT NULL REFERENCES public.user_reading_progress(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  passages JSONB NOT NULL,
  floor_exercises JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_progress_id, day_number)
);

-- Enable RLS
ALTER TABLE public.reading_plan_daily_exercises ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own exercises
CREATE POLICY "Users can view their own exercises"
ON public.reading_plan_daily_exercises
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_reading_progress
    WHERE user_reading_progress.id = reading_plan_daily_exercises.user_progress_id
    AND user_reading_progress.user_id = auth.uid()
  )
);

-- Policy: Users can insert their own exercises
CREATE POLICY "Users can insert their own exercises"
ON public.reading_plan_daily_exercises
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_reading_progress
    WHERE user_reading_progress.id = reading_plan_daily_exercises.user_progress_id
    AND user_reading_progress.user_id = auth.uid()
  )
);

-- Policy: Users can update their own exercises
CREATE POLICY "Users can update their own exercises"
ON public.reading_plan_daily_exercises
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_reading_progress
    WHERE user_reading_progress.id = reading_plan_daily_exercises.user_progress_id
    AND user_reading_progress.user_id = auth.uid()
  )
);

-- Policy: Users can delete their own exercises
CREATE POLICY "Users can delete their own exercises"
ON public.reading_plan_daily_exercises
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_reading_progress
    WHERE user_reading_progress.id = reading_plan_daily_exercises.user_progress_id
    AND user_reading_progress.user_id = auth.uid()
  )
);

-- Create index for faster lookups
CREATE INDEX idx_reading_plan_daily_exercises_user_progress 
ON public.reading_plan_daily_exercises(user_progress_id, day_number);