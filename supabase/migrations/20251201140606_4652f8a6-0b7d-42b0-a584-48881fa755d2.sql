-- Create drill_sessions table for The Drill Drill feature
CREATE TABLE public.drill_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verse_reference TEXT NOT NULL,
  verse_text TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('guided', 'self', 'auto')),
  name TEXT,
  drill_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.drill_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own drills
CREATE POLICY "Users can view their own drills"
ON public.drill_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own drills"
ON public.drill_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drills"
ON public.drill_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drills"
ON public.drill_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_drill_sessions_user_id ON public.drill_sessions(user_id);
CREATE INDEX idx_drill_sessions_created_at ON public.drill_sessions(created_at DESC);