-- Create storage bucket for character portrait images
INSERT INTO storage.buckets (id, name, public)
VALUES ('character-images', 'character-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to character images
CREATE POLICY "Public read access for character images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'character-images');

-- Allow service role to upload character images
CREATE POLICY "Service role upload for character images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'character-images');

-- Allow service role to update character images
CREATE POLICY "Service role update for character images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'character-images');

-- Allow service role to delete character images
CREATE POLICY "Service role delete for character images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'character-images');

-- Create cache table for generated character portrait images
CREATE TABLE IF NOT EXISTS character_image_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id TEXT UNIQUE NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  prompt_used TEXT,
  generated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE character_image_cache ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for character image cache"
  ON character_image_cache FOR SELECT
  TO authenticated, anon
  USING (true);

-- Service role write access
CREATE POLICY "Service role write for character image cache"
  ON character_image_cache FOR ALL
  USING (true)
  WITH CHECK (true);
