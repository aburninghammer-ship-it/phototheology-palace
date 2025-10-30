export interface BibleBookMetadata {
  code: string;
  name: string;
  chapters: number;
  position: number;
}

export const BIBLE_BOOK_METADATA: BibleBookMetadata[] = [
  { code: "GEN", name: "Genesis", chapters: 50, position: 1 },
  { code: "EXO", name: "Exodus", chapters: 40, position: 2 },
  { code: "LEV", name: "Leviticus", chapters: 27, position: 3 },
  { code: "NUM", name: "Numbers", chapters: 36, position: 4 },
  { code: "DEU", name: "Deuteronomy", chapters: 34, position: 5 },
  { code: "JOS", name: "Joshua", chapters: 24, position: 6 },
  { code: "JDG", name: "Judges", chapters: 21, position: 7 },
  { code: "RUT", name: "Ruth", chapters: 4, position: 8 },
  { code: "1SA", name: "1 Samuel", chapters: 31, position: 9 },
  { code: "2SA", name: "2 Samuel", chapters: 24, position: 10 },
  { code: "1KI", name: "1 Kings", chapters: 22, position: 11 },
  { code: "2KI", name: "2 Kings", chapters: 25, position: 12 },
  { code: "1CH", name: "1 Chronicles", chapters: 29, position: 13 },
  { code: "2CH", name: "2 Chronicles", chapters: 36, position: 14 },
  { code: "EZR", name: "Ezra", chapters: 10, position: 15 },
  { code: "NEH", name: "Nehemiah", chapters: 13, position: 16 },
  { code: "EST", name: "Esther", chapters: 10, position: 17 },
  { code: "JOB", name: "Job", chapters: 42, position: 18 },
  { code: "PSA", name: "Psalms", chapters: 150, position: 19 },
  { code: "PRO", name: "Proverbs", chapters: 31, position: 20 },
  { code: "ECC", name: "Ecclesiastes", chapters: 12, position: 21 },
  { code: "SNG", name: "Song of Solomon", chapters: 8, position: 22 },
  { code: "ISA", name: "Isaiah", chapters: 66, position: 23 },
  { code: "JER", name: "Jeremiah", chapters: 52, position: 24 },
  { code: "LAM", name: "Lamentations", chapters: 5, position: 25 },
  { code: "EZK", name: "Ezekiel", chapters: 48, position: 26 },
  { code: "DAN", name: "Daniel", chapters: 12, position: 27 },
  { code: "HOS", name: "Hosea", chapters: 14, position: 28 },
  { code: "JOL", name: "Joel", chapters: 3, position: 29 },
  { code: "AMO", name: "Amos", chapters: 9, position: 30 },
  { code: "OBA", name: "Obadiah", chapters: 1, position: 31 },
  { code: "JON", name: "Jonah", chapters: 4, position: 32 },
  { code: "MIC", name: "Micah", chapters: 7, position: 33 },
  { code: "NAM", name: "Nahum", chapters: 3, position: 34 },
  { code: "HAB", name: "Habakkuk", chapters: 3, position: 35 },
  { code: "ZEP", name: "Zephaniah", chapters: 3, position: 36 },
  { code: "HAG", name: "Haggai", chapters: 2, position: 37 },
  { code: "ZEC", name: "Zechariah", chapters: 14, position: 38 },
  { code: "MAL", name: "Malachi", chapters: 4, position: 39 },
  { code: "MAT", name: "Matthew", chapters: 28, position: 40 },
  { code: "MRK", name: "Mark", chapters: 16, position: 41 },
  { code: "LUK", name: "Luke", chapters: 24, position: 42 },
  { code: "JHN", name: "John", chapters: 21, position: 43 },
  { code: "ACT", name: "Acts", chapters: 28, position: 44 },
  { code: "ROM", name: "Romans", chapters: 16, position: 45 },
  { code: "1CO", name: "1 Corinthians", chapters: 16, position: 46 },
  { code: "2CO", name: "2 Corinthians", chapters: 13, position: 47 },
  { code: "GAL", name: "Galatians", chapters: 6, position: 48 },
  { code: "EPH", name: "Ephesians", chapters: 6, position: 49 },
  { code: "PHP", name: "Philippians", chapters: 4, position: 50 },
  { code: "COL", name: "Colossians", chapters: 4, position: 51 },
  { code: "1TH", name: "1 Thessalonians", chapters: 5, position: 52 },
  { code: "2TH", name: "2 Thessalonians", chapters: 3, position: 53 },
  { code: "1TI", name: "1 Timothy", chapters: 6, position: 54 },
  { code: "2TI", name: "2 Timothy", chapters: 4, position: 55 },
  { code: "TIT", name: "Titus", chapters: 3, position: 56 },
  { code: "PHM", name: "Philemon", chapters: 1, position: 57 },
  { code: "HEB", name: "Hebrews", chapters: 13, position: 58 },
  { code: "JAS", name: "James", chapters: 5, position: 59 },
  { code: "1PE", name: "1 Peter", chapters: 5, position: 60 },
  { code: "2PE", name: "2 Peter", chapters: 3, position: 61 },
  { code: "1JN", name: "1 John", chapters: 5, position: 62 },
  { code: "2JN", name: "2 John", chapters: 1, position: 63 },
  { code: "3JN", name: "3 John", chapters: 1, position: 64 },
  { code: "JUD", name: "Jude", chapters: 1, position: 65 },
  { code: "REV", name: "Revelation", chapters: 22, position: 66 }
];

// Create lookup maps for efficient access
export const BOOK_CODE_TO_NAME = new Map(
  BIBLE_BOOK_METADATA.map(book => [book.code, book.name])
);

export const BOOK_NAME_TO_CODE = new Map(
  BIBLE_BOOK_METADATA.map(book => [book.name, book.code])
);

export const BOOK_CODE_TO_CHAPTERS = new Map(
  BIBLE_BOOK_METADATA.map(book => [book.code, book.chapters])
);

export const BOOK_NAME_TO_CHAPTERS = new Map(
  BIBLE_BOOK_METADATA.map(book => [book.name, book.chapters])
);

/**
 * Get book name from code
 */
export function getBookName(code: string): string | undefined {
  return BOOK_CODE_TO_NAME.get(code);
}

/**
 * Get book code from name
 */
export function getBookCode(name: string): string | undefined {
  return BOOK_NAME_TO_CODE.get(name);
}

/**
 * Get chapter count for a book by code
 */
export function getChapterCountByCode(code: string): number | undefined {
  return BOOK_CODE_TO_CHAPTERS.get(code);
}

/**
 * Get chapter count for a book by name
 */
export function getChapterCount(bookName: string): number | undefined {
  return BOOK_NAME_TO_CHAPTERS.get(bookName);
}

/**
 * Validate if a chapter number is valid for a given book
 */
export function isValidChapter(bookName: string, chapter: number): boolean {
  const maxChapters = getChapterCount(bookName);
  if (!maxChapters) return false;
  return chapter >= 1 && chapter <= maxChapters;
}

/**
 * Get the next book in sequence
 */
export function getNextBook(bookName: string): BibleBookMetadata | undefined {
  const currentBook = BIBLE_BOOK_METADATA.find(b => b.name === bookName);
  if (!currentBook || currentBook.position === 66) return undefined;
  return BIBLE_BOOK_METADATA.find(b => b.position === currentBook.position + 1);
}

/**
 * Get the previous book in sequence
 */
export function getPreviousBook(bookName: string): BibleBookMetadata | undefined {
  const currentBook = BIBLE_BOOK_METADATA.find(b => b.name === bookName);
  if (!currentBook || currentBook.position === 1) return undefined;
  return BIBLE_BOOK_METADATA.find(b => b.position === currentBook.position - 1);
}
