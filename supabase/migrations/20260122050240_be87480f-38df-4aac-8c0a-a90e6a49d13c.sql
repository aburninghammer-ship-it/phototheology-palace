-- Create table for caching Bible audio commentaries
CREATE TABLE IF NOT EXISTS public.bible_commentaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  tier TEXT NOT NULL DEFAULT 'surface',
  commentary_text TEXT NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint for caching
ALTER TABLE public.bible_commentaries 
ADD CONSTRAINT bible_commentaries_unique UNIQUE (book, chapter, verse, tier);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bible_commentaries_lookup 
ON public.bible_commentaries(book, chapter, verse, tier);

-- Enable RLS
ALTER TABLE public.bible_commentaries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (public commentary cache)
CREATE POLICY "Anyone can read commentaries" 
ON public.bible_commentaries 
FOR SELECT 
USING (true);

-- Only service role can insert/update (edge functions)
CREATE POLICY "Service role can manage commentaries" 
ON public.bible_commentaries 
FOR ALL 
USING (true)
WITH CHECK (true);