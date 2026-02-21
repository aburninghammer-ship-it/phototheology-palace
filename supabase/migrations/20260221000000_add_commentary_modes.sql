-- Add commentary mode column to epic_commentaries
-- Supports: epic (existing), urban, ancient, preacher, scholar

-- 1. Add mode column with default 'epic' for existing rows
ALTER TABLE epic_commentaries ADD COLUMN IF NOT EXISTS mode TEXT NOT NULL DEFAULT 'epic';

-- 2. Backfill any NULLs (safety net)
UPDATE epic_commentaries SET mode = 'epic' WHERE mode IS NULL;

-- 3. Add CHECK constraint for valid modes
ALTER TABLE epic_commentaries ADD CONSTRAINT epic_commentaries_mode_check
  CHECK (mode IN ('epic', 'urban', 'ancient', 'preacher', 'scholar'));

-- 4. Drop old unique constraint on (book, chapter, version)
--    and add new one on (book, chapter, mode, version)
ALTER TABLE epic_commentaries DROP CONSTRAINT IF EXISTS epic_commentaries_book_chapter_key;
ALTER TABLE epic_commentaries DROP CONSTRAINT IF EXISTS epic_commentaries_book_chapter_version_key;

ALTER TABLE epic_commentaries ADD CONSTRAINT epic_commentaries_book_chapter_mode_key
  UNIQUE (book, chapter, mode);

-- 5. Drop old index and create new one that includes mode
DROP INDEX IF EXISTS idx_epic_commentaries_book_chapter_status;

CREATE INDEX idx_epic_commentaries_book_chapter_mode_status
  ON epic_commentaries (book, chapter, mode, status);
