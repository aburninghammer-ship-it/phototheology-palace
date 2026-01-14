-- Add narrative_analysis column to store the full rich analysis text
ALTER TABLE public.thought_analyses
ADD COLUMN IF NOT EXISTS narrative_analysis TEXT;