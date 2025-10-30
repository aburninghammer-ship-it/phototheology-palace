export interface BibleChapterMetadata {
  book: string;
  chapter: number;
  position: number;
  verses: number;
}

export const BIBLE_CHAPTER_METADATA: BibleChapterMetadata[] = [
  // Genesis
  { book: "GEN", chapter: 1, position: 1, verses: 31 },
  { book: "GEN", chapter: 2, position: 2, verses: 25 },
  { book: "GEN", chapter: 3, position: 3, verses: 24 },
  { book: "GEN", chapter: 4, position: 4, verses: 26 },
  { book: "GEN", chapter: 5, position: 5, verses: 32 },
  { book: "GEN", chapter: 6, position: 6, verses: 22 },
  { book: "GEN", chapter: 7, position: 7, verses: 24 },
  { book: "GEN", chapter: 8, position: 8, verses: 20 },
  { book: "GEN", chapter: 9, position: 9, verses: 27 },
  { book: "GEN", chapter: 10, position: 10, verses: 32 },
  { book: "GEN", chapter: 11, position: 11, verses: 32 },
  { book: "GEN", chapter: 12, position: 12, verses: 19 },
  { book: "GEN", chapter: 13, position: 13, verses: 18 },
  { book: "GEN", chapter: 14, position: 14, verses: 24 },
  { book: "GEN", chapter: 15, position: 15, verses: 21 },
  { book: "GEN", chapter: 16, position: 16, verses: 16 },
  { book: "GEN", chapter: 17, position: 17, verses: 26 },
  { book: "GEN", chapter: 18, position: 18, verses: 33 },
  { book: "GEN", chapter: 19, position: 19, verses: 36 },
  { book: "GEN", chapter: 20, position: 20, verses: 18 },
  { book: "GEN", chapter: 21, position: 21, verses: 33 },
  { book: "GEN", chapter: 22, position: 22, verses: 22 },
  { book: "GEN", chapter: 23, position: 23, verses: 16 },
  { book: "GEN", chapter: 24, position: 24, verses: 60 },
  { book: "GEN", chapter: 25, position: 25, verses: 33 },
  { book: "GEN", chapter: 26, position: 26, verses: 35 },
  { book: "GEN", chapter: 27, position: 27, verses: 44 },
  { book: "GEN", chapter: 28, position: 28, verses: 22 },
  { book: "GEN", chapter: 29, position: 29, verses: 32 },
  { book: "GEN", chapter: 30, position: 30, verses: 41 },
  { book: "GEN", chapter: 31, position: 31, verses: 49 },
  { book: "GEN", chapter: 32, position: 32, verses: 30 },
  { book: "GEN", chapter: 33, position: 33, verses: 19 },
  { book: "GEN", chapter: 34, position: 34, verses: 30 },
  { book: "GEN", chapter: 35, position: 35, verses: 29 },
  { book: "GEN", chapter: 36, position: 36, verses: 43 },
  { book: "GEN", chapter: 37, position: 37, verses: 36 },
  { book: "GEN", chapter: 38, position: 38, verses: 30 },
  { book: "GEN", chapter: 39, position: 39, verses: 23 },
  { book: "GEN", chapter: 40, position: 40, verses: 22 },
  { book: "GEN", chapter: 41, position: 41, verses: 55 },
  { book: "GEN", chapter: 42, position: 42, verses: 35 },
  { book: "GEN", chapter: 43, position: 43, verses: 32 },
  { book: "GEN", chapter: 44, position: 44, verses: 29 },
  { book: "GEN", chapter: 45, position: 45, verses: 28 },
  { book: "GEN", chapter: 46, position: 46, verses: 34 },
  { book: "GEN", chapter: 47, position: 47, verses: 31 },
  { book: "GEN", chapter: 48, position: 48, verses: 21 },
  { book: "GEN", chapter: 49, position: 49, verses: 32 },
  { book: "GEN", chapter: 50, position: 50, verses: 24 },
];

/**
 * Get verse count for a specific chapter
 */
export function getVerseCount(bookCode: string, chapter: number): number | undefined {
  const chapterMeta = BIBLE_CHAPTER_METADATA.find(
    c => c.book === bookCode && c.chapter === chapter
  );
  return chapterMeta?.verses;
}

/**
 * Validate if a verse reference is valid
 */
export function isValidVerse(bookCode: string, chapter: number, verse: number): boolean {
  const verseCount = getVerseCount(bookCode, chapter);
  if (!verseCount) return false;
  return verse >= 1 && verse <= verseCount;
}

/**
 * Get the next chapter in the Bible
 */
export function getNextChapter(bookCode: string, chapter: number): BibleChapterMetadata | undefined {
  const currentChapter = BIBLE_CHAPTER_METADATA.find(
    c => c.book === bookCode && c.chapter === chapter
  );
  if (!currentChapter) return undefined;
  
  return BIBLE_CHAPTER_METADATA.find(c => c.position === currentChapter.position + 1);
}

/**
 * Get the previous chapter in the Bible
 */
export function getPreviousChapter(bookCode: string, chapter: number): BibleChapterMetadata | undefined {
  const currentChapter = BIBLE_CHAPTER_METADATA.find(
    c => c.book === bookCode && c.chapter === chapter
  );
  if (!currentChapter || currentChapter.position === 1) return undefined;
  
  return BIBLE_CHAPTER_METADATA.find(c => c.position === currentChapter.position - 1);
}

/**
 * Get all chapters for a specific book
 */
export function getBookChapters(bookCode: string): BibleChapterMetadata[] {
  return BIBLE_CHAPTER_METADATA.filter(c => c.book === bookCode);
}

/**
 * Get total verse count for a book
 */
export function getBookVerseCount(bookCode: string): number {
  return BIBLE_CHAPTER_METADATA
    .filter(c => c.book === bookCode)
    .reduce((sum, c) => sum + c.verses, 0);
}
