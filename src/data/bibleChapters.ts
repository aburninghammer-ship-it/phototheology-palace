import { BIBLE_BOOK_METADATA } from './bibleBooks';
import { BIBLE_VERSE_COUNTS, getVerseCountForChapter } from './bibleVerseCounts';

export interface BibleChapterMetadata {
  book: string;
  chapter: number;
  position: number;
  verses: number;
}

// Generate all 1,189 chapters across all 66 books with accurate verse counts
const generateAllChapters = (): BibleChapterMetadata[] => {
  const chapters: BibleChapterMetadata[] = [];
  let position = 1;

  for (const book of BIBLE_BOOK_METADATA) {
    for (let chapter = 1; chapter <= book.chapters; chapter++) {
      chapters.push({
        book: book.code,
        chapter,
        position,
        verses: getVerseCountForChapter(book.code, chapter)
      });
      position++;
    }
  }

  return chapters;
};

export const BIBLE_CHAPTER_METADATA: BibleChapterMetadata[] = generateAllChapters();

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
