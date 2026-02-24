-- Create quick_devotion_history table for storing user's quick devotion generations
CREATE TABLE public.quick_devotion_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  theme TEXT NOT NULL,
  description TEXT,
  depth_level TEXT NOT NULL,
  writing_style TEXT NOT NULL,
  devotion_content TEXT NOT NULL,
  scripture_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quick_devotion_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own devotion history
CREATE POLICY "Users can view their own devotion history"
ON public.quick_devotion_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own devotion history
CREATE POLICY "Users can insert their own devotion history"
ON public.quick_devotion_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own devotion history
CREATE POLICY "Users can delete their own devotion history"
ON public.quick_devotion_history
FOR DELETE
USING (auth.uid() = user_id);

-- Add index for faster queries by user
CREATE INDEX idx_quick_devotion_history_user_id ON public.quick_devotion_history(user_id);
CREATE INDEX idx_quick_devotion_history_created_at ON public.quick_devotion_history(created_at DESC);