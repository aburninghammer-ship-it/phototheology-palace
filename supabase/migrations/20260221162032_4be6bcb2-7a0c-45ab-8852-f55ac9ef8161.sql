-- Drop conflicting old unique constraints that prevent multiple modes per book/chapter
ALTER TABLE public.epic_commentaries DROP CONSTRAINT IF EXISTS epic_commentaries_book_chapter_unique;
ALTER TABLE public.epic_commentaries DROP CONSTRAINT IF EXISTS epic_commentaries_book_chapter_version_key;