-- Create table for devotional text highlights
CREATE TABLE public.devotional_text_highlights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  devotional_day_id UUID NOT NULL,
  start_offset INTEGER NOT NULL,
  end_offset INTEGER NOT NULL,
  color TEXT NOT NULL DEFAULT 'yellow',
  text_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_devotional_highlights_user_day ON public.devotional_text_highlights(user_id, devotional_day_id);

-- Enable Row Level Security
ALTER TABLE public.devotional_text_highlights ENABLE ROW LEVEL SECURITY;

-- Users can only see their own highlights
CREATE POLICY "Users can view their own devotional highlights"
  ON public.devotional_text_highlights FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own highlights
CREATE POLICY "Users can create their own devotional highlights"
  ON public.devotional_text_highlights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own highlights
CREATE POLICY "Users can delete their own devotional highlights"
  ON public.devotional_text_highlights FOR DELETE
  USING (auth.uid() = user_id);