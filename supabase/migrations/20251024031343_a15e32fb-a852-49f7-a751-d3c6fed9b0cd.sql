-- Create drill_results table to track user performance on practice drills
CREATE TABLE public.drill_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  floor_number INTEGER NOT NULL,
  room_id TEXT NOT NULL,
  drill_type TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL,
  time_seconds INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  drill_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.drill_results ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own drill results"
  ON public.drill_results
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drill results"
  ON public.drill_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_drill_results_user_room ON public.drill_results(user_id, floor_number, room_id);
CREATE INDEX idx_drill_results_type ON public.drill_results(drill_type);