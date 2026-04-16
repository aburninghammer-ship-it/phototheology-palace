
-- Cache table for EGW chapter text content
CREATE TABLE public.egw_chapter_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  chapter_title TEXT NOT NULL,
  paragraphs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(book_id, chapter_number)
);

-- Enable RLS
ALTER TABLE public.egw_chapter_cache ENABLE ROW LEVEL SECURITY;

-- Public read access (EGW books are public domain)
CREATE POLICY "Anyone can read EGW chapter cache"
ON public.egw_chapter_cache
FOR SELECT
USING (true);

-- Only service role can insert/update (via edge function)
CREATE POLICY "Service role can manage EGW cache"
ON public.egw_chapter_cache
FOR ALL
USING (true)
WITH CHECK (true);

-- Timestamp trigger
CREATE TRIGGER update_egw_chapter_cache_updated_at
BEFORE UPDATE ON public.egw_chapter_cache
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
