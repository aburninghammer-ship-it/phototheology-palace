-- Create bible_verses_tokenized table
CREATE TABLE IF NOT EXISTS public.bible_verses_tokenized (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_num INTEGER NOT NULL,
  text_kjv TEXT NOT NULL,
  tokens JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(book, chapter, verse_num)
);

-- Enable RLS
ALTER TABLE public.bible_verses_tokenized ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read
CREATE POLICY "Anyone can read bible verses"
  ON public.bible_verses_tokenized
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert/update
CREATE POLICY "Authenticated users can insert bible verses"
  ON public.bible_verses_tokenized
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update bible verses"
  ON public.bible_verses_tokenized
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bible_verses_book_chapter ON public.bible_verses_tokenized(book, chapter);
CREATE INDEX IF NOT EXISTS idx_bible_verses_lookup ON public.bible_verses_tokenized(book, chapter, verse_num);