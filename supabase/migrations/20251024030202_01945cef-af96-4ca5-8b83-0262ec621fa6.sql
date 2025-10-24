-- Create room_progress table to track user progress through Memory Palace rooms
CREATE TABLE public.room_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  floor_number INTEGER NOT NULL,
  room_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  exercises_completed JSONB NOT NULL DEFAULT '[]'::jsonb,
  drill_attempts INTEGER NOT NULL DEFAULT 0,
  best_drill_score INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, floor_number, room_id)
);

-- Enable RLS
ALTER TABLE public.room_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own room progress"
  ON public.room_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own room progress"
  ON public.room_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own room progress"
  ON public.room_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_room_progress_updated_at
  BEFORE UPDATE ON public.room_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster queries
CREATE INDEX idx_room_progress_user_id ON public.room_progress(user_id);
CREATE INDEX idx_room_progress_floor ON public.room_progress(floor_number);