-- Clear all cached EGW audio commentary entries to purge hallucinated room names
-- (e.g., "War Room", "Character Room", "Sanctuary Room", "Mirror Room")
-- Commentary entries use chapter_number = 0 with composite book_id keys
DELETE FROM egw_chapter_cache WHERE chapter_number = 0;
