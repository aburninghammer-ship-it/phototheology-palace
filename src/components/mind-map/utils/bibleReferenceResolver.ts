/**
 * Bible Reference Resolver
 * Detects if input is just a Bible reference and fetches the full verse text
 */

// Common book abbreviations mapped to full names
const BOOK_ABBREVIATIONS: Record<string, string> = {
  'gen': 'Genesis', 'ge': 'Genesis', 'gn': 'Genesis',
  'ex': 'Exodus', 'exod': 'Exodus', 'exo': 'Exodus',
  'lev': 'Leviticus', 'le': 'Leviticus', 'lv': 'Leviticus',
  'num': 'Numbers', 'nu': 'Numbers', 'nm': 'Numbers', 'nb': 'Numbers',
  'deut': 'Deuteronomy', 'de': 'Deuteronomy', 'dt': 'Deuteronomy',
  'josh': 'Joshua', 'jos': 'Joshua', 'jsh': 'Joshua',
  'judg': 'Judges', 'jdg': 'Judges', 'jg': 'Judges', 'jdgs': 'Judges',
  'ruth': 'Ruth', 'rth': 'Ruth', 'ru': 'Ruth',
  '1sam': '1 Samuel', '1sa': '1 Samuel', '1 sam': '1 Samuel', '1 sa': '1 Samuel',
  '2sam': '2 Samuel', '2sa': '2 Samuel', '2 sam': '2 Samuel', '2 sa': '2 Samuel',
  '1kgs': '1 Kings', '1ki': '1 Kings', '1 kings': '1 Kings', '1 ki': '1 Kings',
  '2kgs': '2 Kings', '2ki': '2 Kings', '2 kings': '2 Kings', '2 ki': '2 Kings',
  '1chr': '1 Chronicles', '1ch': '1 Chronicles', '1 chronicles': '1 Chronicles',
  '2chr': '2 Chronicles', '2ch': '2 Chronicles', '2 chronicles': '2 Chronicles',
  'ezra': 'Ezra', 'ezr': 'Ezra',
  'neh': 'Nehemiah', 'ne': 'Nehemiah',
  'esth': 'Esther', 'est': 'Esther', 'es': 'Esther',
  'job': 'Job', 'jb': 'Job',
  'ps': 'Psalms', 'psa': 'Psalms', 'psm': 'Psalms', 'pss': 'Psalms', 'psalm': 'Psalms',
  'prov': 'Proverbs', 'pr': 'Proverbs', 'prv': 'Proverbs',
  'eccl': 'Ecclesiastes', 'ec': 'Ecclesiastes', 'ecc': 'Ecclesiastes',
  'song': 'Song of Solomon', 'sos': 'Song of Solomon', 'so': 'Song of Solomon', 'canticles': 'Song of Solomon',
  'isa': 'Isaiah', 'is': 'Isaiah',
  'jer': 'Jeremiah', 'je': 'Jeremiah', 'jr': 'Jeremiah',
  'lam': 'Lamentations', 'la': 'Lamentations',
  'ezek': 'Ezekiel', 'eze': 'Ezekiel', 'ezk': 'Ezekiel',
  'dan': 'Daniel', 'da': 'Daniel', 'dn': 'Daniel',
  'hos': 'Hosea', 'ho': 'Hosea',
  'joel': 'Joel', 'jl': 'Joel', 'joe': 'Joel',
  'amos': 'Amos', 'am': 'Amos',
  'obad': 'Obadiah', 'ob': 'Obadiah',
  'jonah': 'Jonah', 'jnh': 'Jonah', 'jon': 'Jonah',
  'mic': 'Micah', 'mi': 'Micah',
  'nah': 'Nahum', 'na': 'Nahum',
  'hab': 'Habakkuk', 'hb': 'Habakkuk',
  'zeph': 'Zephaniah', 'zep': 'Zephaniah', 'zp': 'Zephaniah',
  'hag': 'Haggai', 'hg': 'Haggai',
  'zech': 'Zechariah', 'zec': 'Zechariah', 'zc': 'Zechariah',
  'mal': 'Malachi', 'ml': 'Malachi',
  // New Testament
  'mt': 'Matthew', 'matt': 'Matthew', 'mat': 'Matthew',
  'mk': 'Mark', 'mar': 'Mark', 'mrk': 'Mark',
  'lk': 'Luke', 'luk': 'Luke', 'lu': 'Luke',
  'jn': 'John', 'jhn': 'John', 'joh': 'John',
  'acts': 'Acts', 'ac': 'Acts', 'act': 'Acts',
  'rom': 'Romans', 'ro': 'Romans', 'rm': 'Romans',
  '1cor': '1 Corinthians', '1co': '1 Corinthians', '1 cor': '1 Corinthians',
  '2cor': '2 Corinthians', '2co': '2 Corinthians', '2 cor': '2 Corinthians',
  'gal': 'Galatians', 'ga': 'Galatians',
  'eph': 'Ephesians', 'ep': 'Ephesians',
  'phil': 'Philippians', 'php': 'Philippians', 'pp': 'Philippians',
  'col': 'Colossians', 'co': 'Colossians',
  '1thess': '1 Thessalonians', '1th': '1 Thessalonians', '1 thess': '1 Thessalonians',
  '2thess': '2 Thessalonians', '2th': '2 Thessalonians', '2 thess': '2 Thessalonians',
  '1tim': '1 Timothy', '1ti': '1 Timothy', '1 tim': '1 Timothy',
  '2tim': '2 Timothy', '2ti': '2 Timothy', '2 tim': '2 Timothy',
  'tit': 'Titus', 'ti': 'Titus',
  'phlm': 'Philemon', 'phm': 'Philemon', 'pm': 'Philemon',
  'heb': 'Hebrews', 'he': 'Hebrews',
  'jas': 'James', 'jm': 'James', 'jam': 'James',
  '1pet': '1 Peter', '1pe': '1 Peter', '1pt': '1 Peter', '1 pet': '1 Peter', '1 peter': '1 Peter',
  '2pet': '2 Peter', '2pe': '2 Peter', '2pt': '2 Peter', '2 pet': '2 Peter', '2 peter': '2 Peter',
  '1jn': '1 John', '1jo': '1 John', '1jhn': '1 John', '1 john': '1 John',
  '2jn': '2 John', '2jo': '2 John', '2jhn': '2 John', '2 john': '2 John',
  '3jn': '3 John', '3jo': '3 John', '3jhn': '3 John', '3 john': '3 John',
  'jude': 'Jude', 'jud': 'Jude', 'jd': 'Jude',
  'rev': 'Revelation', 're': 'Revelation', 'rv': 'Revelation', 'apocalypse': 'Revelation',
};

// Full book names for direct matching
const FULL_BOOK_NAMES = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah',
  'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai',
  'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John',
  'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
  'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
];

export interface ParsedReference {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  originalInput: string;
}

/**
 * Check if input looks like a Bible reference
 */
export function isBibleReference(input: string): boolean {
  const trimmed = input.trim();
  
  // Must be relatively short (just a reference, not a paragraph)
  if (trimmed.length > 50) return false;
  
  // Must contain a number (chapter/verse)
  if (!/\d/.test(trimmed)) return false;
  
  // Pattern: Book Chapter:Verse or Book Chapter:Verse-Verse
  // Examples: Mt.28:6, Matthew 28:6, 1 John 3:16, Gen 1:1-5
  const refPattern = /^(\d?\s*[a-zA-Z]+\.?\s*)(\d+)[:\.](\d+)(?:-(\d+))?$/i;
  
  return refPattern.test(trimmed);
}

/**
 * Parse a Bible reference string into components
 */
export function parseBibleReference(input: string): ParsedReference | null {
  const trimmed = input.trim();
  
  // Pattern: Book Chapter:Verse or Book Chapter:Verse-Verse
  const refPattern = /^(\d?\s*[a-zA-Z]+\.?\s*)(\d+)[:\.](\d+)(?:-(\d+))?$/i;
  const match = trimmed.match(refPattern);
  
  if (!match) return null;
  
  let bookPart = match[1].trim().replace(/\.$/, '').toLowerCase();
  const chapter = parseInt(match[2], 10);
  const verseStart = parseInt(match[3], 10);
  const verseEnd = match[4] ? parseInt(match[4], 10) : undefined;
  
  // Normalize book name
  let book = BOOK_ABBREVIATIONS[bookPart] || BOOK_ABBREVIATIONS[bookPart.replace(/\s/g, '')];
  
  // Try full name match
  if (!book) {
    const normalizedInput = bookPart.replace(/\s+/g, ' ');
    book = FULL_BOOK_NAMES.find(name => 
      name.toLowerCase() === normalizedInput ||
      name.toLowerCase().startsWith(normalizedInput)
    ) || null;
  }
  
  if (!book) return null;
  
  return {
    book,
    chapter,
    verseStart,
    verseEnd,
    originalInput: trimmed,
  };
}

/**
 * Fetch verse text from the Bible API or database
 */
export async function fetchVerseText(reference: ParsedReference): Promise<string | null> {
  try {
    // Try using the biblesdk or web API
    const { book, chapter, verseStart, verseEnd } = reference;
    
    // Format the reference for display
    const refString = verseEnd 
      ? `${book} ${chapter}:${verseStart}-${verseEnd}`
      : `${book} ${chapter}:${verseStart}`;
    
    // Try fetching from a free Bible API
    const apiBook = encodeURIComponent(book);
    const verses = verseEnd 
      ? `${verseStart}-${verseEnd}`
      : `${verseStart}`;
    
    // Use Bible API (api.bible, labs.bible.org, etc.)
    const response = await fetch(
      `https://bible-api.com/${apiBook}+${chapter}:${verses}?translation=kjv`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.text) {
        // Clean up the text
        const cleanText = data.text.replace(/\n/g, ' ').trim();
        return `${refString} — "${cleanText}"`;
      }
    }
    
    // Fallback: return just the formatted reference
    return refString;
  } catch (error) {
    console.warn('Failed to fetch verse text:', error);
    return null;
  }
}

/**
 * Main function: resolve a Bible reference to its full text
 */
export async function resolveBibleReference(input: string): Promise<{
  isReference: boolean;
  resolvedText: string;
  reference?: ParsedReference;
}> {
  const trimmed = input.trim();
  
  if (!isBibleReference(trimmed)) {
    return { isReference: false, resolvedText: trimmed };
  }
  
  const reference = parseBibleReference(trimmed);
  if (!reference) {
    return { isReference: false, resolvedText: trimmed };
  }
  
  const verseText = await fetchVerseText(reference);
  
  if (verseText) {
    return {
      isReference: true,
      resolvedText: verseText,
      reference,
    };
  }
  
  // Fallback to formatted reference
  const formattedRef = reference.verseEnd
    ? `${reference.book} ${reference.chapter}:${reference.verseStart}-${reference.verseEnd}`
    : `${reference.book} ${reference.chapter}:${reference.verseStart}`;
  
  return {
    isReference: true,
    resolvedText: formattedRef,
    reference,
  };
}
