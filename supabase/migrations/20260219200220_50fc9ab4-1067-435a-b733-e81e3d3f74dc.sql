-- Add unique constraint on book+chapter so upserts work correctly and no duplicates can accumulate
-- First ensure any remaining duplicates are gone (keep highest version)
DELETE FROM epic_commentaries 
WHERE id NOT IN (
  SELECT DISTINCT ON (book, chapter) id 
  FROM epic_commentaries 
  ORDER BY book, chapter, version DESC, updated_at DESC
);

-- Add unique constraint
ALTER TABLE epic_commentaries ADD CONSTRAINT epic_commentaries_book_chapter_unique UNIQUE (book, chapter);