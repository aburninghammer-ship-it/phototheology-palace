
ALTER TABLE public.sermon_ideas 
  ADD COLUMN IF NOT EXISTS scripture text,
  ADD COLUMN IF NOT EXISTS key_points text,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS jeeves_research text;
