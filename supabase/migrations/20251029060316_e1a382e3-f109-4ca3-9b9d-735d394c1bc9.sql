-- Add Phototheology columns to existing strongs_entries table
ALTER TABLE strongs_entries
ADD COLUMN IF NOT EXISTS sanctuary_link TEXT,
ADD COLUMN IF NOT EXISTS time_zone_code TEXT,
ADD COLUMN IF NOT EXISTS dimension_code TEXT,
ADD COLUMN IF NOT EXISTS cycle_association TEXT,
ADD COLUMN IF NOT EXISTS floor_rooms TEXT[];

-- Create optimized tokenized verses table for better performance
CREATE TABLE IF NOT EXISTS bible_verses_tokenized (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_num INTEGER NOT NULL,
  text_kjv TEXT NOT NULL,
  tokens JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(book, chapter, verse_num)
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS bible_verses_lookup_idx 
ON bible_verses_tokenized (book, chapter, verse_num);

CREATE INDEX IF NOT EXISTS bible_verses_tokens_idx 
ON bible_verses_tokenized USING GIN (tokens);

-- Enable RLS for the new table
ALTER TABLE bible_verses_tokenized ENABLE ROW LEVEL SECURITY;

-- Allow public read access to Bible verses
CREATE POLICY "Bible verses are viewable by everyone"
ON bible_verses_tokenized
FOR SELECT
TO public
USING (true);