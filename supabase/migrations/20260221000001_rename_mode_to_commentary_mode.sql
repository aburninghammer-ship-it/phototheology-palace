-- Rename 'mode' column to 'commentary_mode' to avoid conflict with
-- PostgreSQL's mode() aggregate function.

ALTER TABLE public.epic_commentaries RENAME COLUMN mode TO commentary_mode;

-- Recreate constraints with new column name
ALTER TABLE public.epic_commentaries DROP CONSTRAINT IF EXISTS epic_commentaries_mode_check;
ALTER TABLE public.epic_commentaries ADD CONSTRAINT epic_commentaries_commentary_mode_check
  CHECK (commentary_mode IN ('epic', 'urban', 'ancient', 'preacher', 'scholar'));

ALTER TABLE public.epic_commentaries DROP CONSTRAINT IF EXISTS epic_commentaries_book_chapter_mode_key;
ALTER TABLE public.epic_commentaries ADD CONSTRAINT epic_commentaries_book_chapter_commentary_mode_key
  UNIQUE (book, chapter, commentary_mode);

DROP INDEX IF EXISTS idx_epic_commentaries_mode;
CREATE INDEX IF NOT EXISTS idx_epic_commentaries_commentary_mode
  ON public.epic_commentaries (book, chapter, commentary_mode, status);
