-- Create table to cache chapter commentaries
CREATE TABLE public.chapter_commentary_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  commentary_text TEXT NOT NULL,
  audio_storage_path TEXT,
  voice_id TEXT DEFAULT 'daniel',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(book, chapter)
);

-- Enable RLS
ALTER TABLE public.chapter_commentary_cache ENABLE ROW LEVEL SECURITY;

-- Public read access (commentary is the same for everyone)
CREATE POLICY "Anyone can read cached commentary"
ON public.chapter_commentary_cache
FOR SELECT
USING (true);

-- Only service role can insert/update (via edge functions)
CREATE POLICY "Service role can manage cache"
ON public.chapter_commentary_cache
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for fast lookups
CREATE INDEX idx_chapter_commentary_cache_book_chapter 
ON public.chapter_commentary_cache(book, chapter);

-- Add updated_at trigger
CREATE TRIGGER update_chapter_commentary_cache_updated_at
BEFORE UPDATE ON public.chapter_commentary_cache
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();