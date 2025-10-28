-- Create research_notes table for interactive research canvas
CREATE TABLE IF NOT EXISTS public.research_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_research TEXT NOT NULL,
  sub_topic TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.research_notes ENABLE ROW LEVEL SECURITY;

-- Users can manage their own research notes
CREATE POLICY "Users can view their own research notes"
  ON public.research_notes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own research notes"
  ON public.research_notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own research notes"
  ON public.research_notes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own research notes"
  ON public.research_notes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for research queries
CREATE INDEX idx_research_notes_user_id ON public.research_notes(user_id);
CREATE INDEX idx_research_notes_parent ON public.research_notes(parent_research);

-- Update game_scores RLS to allow viewing all scores for leaderboards
CREATE POLICY "Anyone can view game scores" 
  ON public.game_scores 
  FOR SELECT 
  USING (true);