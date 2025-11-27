-- Create verse_palace_mappings table for storing verse-to-room mappings
CREATE TABLE IF NOT EXISTS public.verse_palace_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verse_reference TEXT NOT NULL, -- e.g. "John 3:16"
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  floor_number INTEGER NOT NULL CHECK (floor_number >= 1 AND floor_number <= 8),
  room_id TEXT NOT NULL, -- matches room ID from palaceData
  room_tag TEXT NOT NULL, -- e.g. "SR", "IR", "OR" for quick reference
  principle_codes TEXT[], -- array of PT codes applied
  personal_insight TEXT, -- user's note about why this mapping
  imagery_note TEXT, -- how they visualize this verse
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_verse_room UNIQUE(user_id, verse_reference, room_id)
);

-- Enable RLS
ALTER TABLE public.verse_palace_mappings ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only see and manage their own mappings
CREATE POLICY "Users can view their own verse mappings"
  ON public.verse_palace_mappings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verse mappings"
  ON public.verse_palace_mappings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verse mappings"
  ON public.verse_palace_mappings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own verse mappings"
  ON public.verse_palace_mappings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_verse_mappings_user_id ON public.verse_palace_mappings(user_id);
CREATE INDEX idx_verse_mappings_verse_ref ON public.verse_palace_mappings(user_id, verse_reference);
CREATE INDEX idx_verse_mappings_room ON public.verse_palace_mappings(user_id, floor_number, room_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_verse_mapping_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_verse_mappings_timestamp
  BEFORE UPDATE ON public.verse_palace_mappings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_verse_mapping_timestamp();