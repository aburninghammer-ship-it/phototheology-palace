-- Create verse commentary cache table
CREATE TABLE IF NOT EXISTS verse_commentary_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book text NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL,
  commentary_text text NOT NULL,
  audio_storage_path text,
  voice_id text DEFAULT 'alloy',
  depth text DEFAULT 'intermediate',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(book, chapter, verse, depth)
);

-- Enable RLS
ALTER TABLE verse_commentary_cache ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read cached commentary (saves costs)
CREATE POLICY "Anyone can view cached commentary"
  ON verse_commentary_cache
  FOR SELECT
  USING (true);

-- Create index for fast lookups
CREATE INDEX idx_verse_commentary_lookup 
  ON verse_commentary_cache(book, chapter, verse, depth);