-- Add position column to verses_strongs table to track word order
ALTER TABLE public.verses_strongs 
ADD COLUMN IF NOT EXISTS position INTEGER NOT NULL DEFAULT 1;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_verses_strongs_position 
ON public.verses_strongs(book, chapter, verse, position);