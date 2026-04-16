-- Add commentary_mode column to epic_commentaries
ALTER TABLE public.epic_commentaries 
ADD COLUMN IF NOT EXISTS commentary_mode text NOT NULL DEFAULT 'epic';

-- Update existing records
UPDATE public.epic_commentaries SET commentary_mode = 'epic' WHERE commentary_mode = 'epic';

-- Drop old unique constraint if exists and create new one including mode
DO $$
BEGIN
  -- Try dropping various possible constraint names
  BEGIN
    ALTER TABLE public.epic_commentaries DROP CONSTRAINT IF EXISTS epic_commentaries_book_chapter_key;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER TABLE public.epic_commentaries DROP CONSTRAINT IF EXISTS epic_commentaries_book_chapter_mode_key;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;

-- Create unique constraint on (book, chapter, commentary_mode)
ALTER TABLE public.epic_commentaries 
ADD CONSTRAINT epic_commentaries_book_chapter_mode_key UNIQUE (book, chapter, commentary_mode);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_epic_commentaries_mode 
ON public.epic_commentaries(book, chapter, commentary_mode, status);