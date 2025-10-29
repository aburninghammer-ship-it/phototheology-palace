-- Add Phototheology columns to strongs_entries if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'strongs_entries' 
                 AND column_name = 'sanctuary_link') THEN
    ALTER TABLE public.strongs_entries ADD COLUMN sanctuary_link TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'strongs_entries' 
                 AND column_name = 'time_zone_code') THEN
    ALTER TABLE public.strongs_entries ADD COLUMN time_zone_code TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'strongs_entries' 
                 AND column_name = 'dimension_code') THEN
    ALTER TABLE public.strongs_entries ADD COLUMN dimension_code TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'strongs_entries' 
                 AND column_name = 'cycle_association') THEN
    ALTER TABLE public.strongs_entries ADD COLUMN cycle_association TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'strongs_entries' 
                 AND column_name = 'floor_rooms') THEN
    ALTER TABLE public.strongs_entries ADD COLUMN floor_rooms TEXT[];
  END IF;
END $$;

-- Ensure bible_verses_tokenized has proper indexes
CREATE INDEX IF NOT EXISTS bible_verses_lookup_idx 
  ON public.bible_verses_tokenized (book, chapter, verse_num);

CREATE INDEX IF NOT EXISTS bible_verses_tokens_idx 
  ON public.bible_verses_tokenized USING GIN (tokens);

-- Add RLS policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bible_verses_tokenized' 
    AND policyname = 'Bible verses are viewable by everyone'
  ) THEN
    CREATE POLICY "Bible verses are viewable by everyone"
      ON public.bible_verses_tokenized
      FOR SELECT
      USING (true);
  END IF;
END $$;