-- Add unique constraint for upsert on verses table
CREATE UNIQUE INDEX IF NOT EXISTS bible_verses_tokenized_book_chapter_verse_idx
ON bible_verses_tokenized(book, chapter, verse_num);

-- Also ensure strongs_dictionary has unique index on strongs_number (should exist but let's be sure)
CREATE UNIQUE INDEX IF NOT EXISTS strongs_dictionary_number_idx
ON strongs_dictionary(strongs_number);