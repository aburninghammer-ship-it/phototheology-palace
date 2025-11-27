-- Create analysis history table
CREATE TABLE public.thought_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  input_text TEXT NOT NULL,
  summary TEXT,
  overall_score INTEGER,
  categories JSONB,
  strengths TEXT[],
  growth_areas TEXT[],
  palace_rooms JSONB,
  scripture_connections JSONB,
  typology_layers JSONB,
  potential_misinterpretations TEXT[],
  alignment_check JSONB,
  further_study TEXT[],
  encouragement TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.thought_analyses ENABLE ROW LEVEL SECURITY;

-- Users can view their own analyses
CREATE POLICY "Users can view own analyses" ON public.thought_analyses
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own analyses
CREATE POLICY "Users can insert own analyses" ON public.thought_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own analyses
CREATE POLICY "Users can delete own analyses" ON public.thought_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX idx_thought_analyses_user_created ON public.thought_analyses(user_id, created_at DESC);