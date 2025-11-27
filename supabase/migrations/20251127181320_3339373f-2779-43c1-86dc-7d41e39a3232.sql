-- Add deeper_insights column to thought_analyses table
ALTER TABLE public.thought_analyses 
ADD COLUMN IF NOT EXISTS deeper_insights JSONB DEFAULT '[]';