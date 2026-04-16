-- Create polish_stories table for saving cinematic scripture stories
CREATE TABLE public.polish_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  input_text TEXT NOT NULL,
  title TEXT,
  tagline TEXT,
  scenes JSONB,
  narrative TEXT,
  closing_reflection TEXT,
  verses_used TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.polish_stories ENABLE ROW LEVEL SECURITY;

-- Users can view their own stories
CREATE POLICY "Users can view own polish stories" ON public.polish_stories
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own stories
CREATE POLICY "Users can insert own polish stories" ON public.polish_stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own stories
CREATE POLICY "Users can delete own polish stories" ON public.polish_stories
  FOR DELETE USING (auth.uid() = user_id);

-- Index for fast queries
CREATE INDEX idx_polish_stories_user_created ON public.polish_stories(user_id, created_at DESC);
