/**
 * Extract scripture references from sermon text
 */

const BOOK_ALIASES: Record<string, string> = {
  'gen': 'Genesis', 'genesis': 'Genesis',
  'ex': 'Exodus', 'exod': 'Exodus', 'exodus': 'Exodus',
  'lev': 'Leviticus', 'leviticus': 'Leviticus',
  'num': 'Numbers', 'numbers': 'Numbers',
  'deut': 'Deuteronomy', 'deuteronomy': 'Deuteronomy',
  'josh': 'Joshua', 'joshua': 'Joshua',
  'judg': 'Judges', 'judges': 'Judges',
  'ruth': 'Ruth',
  '1sam': '1 Samuel', '1 sam': '1 Samuel', '1 samuel': '1 Samuel',
  '2sam': '2 Samuel', '2 sam': '2 Samuel', '2 samuel': '2 Samuel',
  '1kgs': '1 Kings', '1 kgs': '1 Kings', '1 kings': '1 Kings',
  '2kgs': '2 Kings', '2 kgs': '2 Kings', '2 kings': '2 Kings',
  '1chr': '1 Chronicles', '1 chr': '1 Chronicles', '1 chronicles': '1 Chronicles',
  '2chr': '2 Chronicles', '2 chr': '2 Chronicles', '2 chronicles': '2 Chronicles',
  'ezra': 'Ezra',
  'neh': 'Nehemiah', 'nehemiah': 'Nehemiah',
  'esth': 'Esther', 'esther': 'Esther',
  'job': 'Job',
  'ps': 'Psalms', 'psa': 'Psalms', 'psalm': 'Psalms', 'psalms': 'Psalms',
  'prov': 'Proverbs', 'proverbs': 'Proverbs',
  'eccl': 'Ecclesiastes', 'ecclesiastes': 'Ecclesiastes',
  'song': 'Song of Solomon', 'song of solomon': 'Song of Solomon', 'sos': 'Song of Solomon',
  'isa': 'Isaiah', 'isaiah': 'Isaiah',
  'jer': 'Jeremiah', 'jeremiah': 'Jeremiah',
  'lam': 'Lamentations', 'lamentations': 'Lamentations',
  'ezek': 'Ezekiel', 'ezekiel': 'Ezekiel',
  'dan': 'Daniel', 'daniel': 'Daniel',
  'hos': 'Hosea', 'hosea': 'Hosea',
  'joel': 'Joel',
  'amos': 'Amos',
  'obad': 'Obadiah', 'obadiah': 'Obadiah',
  'jonah': 'Jonah',
  'mic': 'Micah', 'micah': 'Micah',
  'nah': 'Nahum', 'nahum': 'Nahum',
  'hab': 'Habakkuk', 'habakkuk': 'Habakkuk',
  'zeph': 'Zephaniah', 'zephaniah': 'Zephaniah',
  'hag': 'Haggai', 'haggai': 'Haggai',
  'zech': 'Zechariah', 'zechariah': 'Zechariah',
  'mal': 'Malachi', 'malachi': 'Malachi',
  'matt': 'Matthew', 'matthew': 'Matthew', 'mt': 'Matthew',
  'mark': 'Mark', 'mk': 'Mark',
  'luke': 'Luke', 'lk': 'Luke',
  'john': 'John', 'jn': 'John',
  'acts': 'Acts',
  'rom': 'Romans', 'romans': 'Romans',
  '1cor': '1 Corinthians', '1 cor': '1 Corinthians', '1 corinthians': '1 Corinthians',
  '2cor': '2 Corinthians', '2 cor': '2 Corinthians', '2 corinthians': '2 Corinthians',
  'gal': 'Galatians', 'galatians': 'Galatians',
  'eph': 'Ephesians', 'ephesians': 'Ephesians',
  'phil': 'Philippians', 'philippians': 'Philippians',
  'col': 'Colossians', 'colossians': 'Colossians',
  '1thess': '1 Thessalonians', '1 thess': '1 Thessalonians', '1 thessalonians': '1 Thessalonians',
  '2thess': '2 Thessalonians', '2 thess': '2 Thessalonians', '2 thessalonians': '2 Thessalonians',
  '1tim': '1 Timothy', '1 tim': '1 Timothy', '1 timothy': '1 Timothy',
  '2tim': '2 Timothy', '2 tim': '2 Timothy', '2 timothy': '2 Timothy',
  'titus': 'Titus',
  'philem': 'Philemon', 'philemon': 'Philemon',
  'heb': 'Hebrews', 'hebrews': 'Hebrews',
  'jas': 'James', 'james': 'James',
  '1pet': '1 Peter', '1 pet': '1 Peter', '1 peter': '1 Peter',
  '2pet': '2 Peter', '2 pet': '2 Peter', '2 peter': '2 Peter',
  '1john': '1 John', '1 john': '1 John', '1 jn': '1 John',
  '2john': '2 John', '2 john': '2 John', '2 jn': '2 John',
  '3john': '3 John', '3 john': '3 John', '3 jn': '3 John',
  'jude': 'Jude',
  'rev': 'Revelation', 'revelation': 'Revelation'
};

// Pattern to match scripture references (supports "Rev 6", "Rev.6", "Rev. 6", etc.)
const SCRIPTURE_PATTERN = /\b((?:\d\s*)?(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song\s*(?:of\s*Solomon)?|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation|Gen|Exod?|Lev|Num|Deut|Josh|Judg|Sam|Kgs|Chr|Neh|Esth?|Psa?|Prov|Eccl|Song|Isa|Jer|Lam|Ezek|Dan|Hos|Amos|Obad|Mic|Nah|Hab|Zeph|Hag|Zech|Mal|Matt?|Mt|Mk|Lk|Jn|Rom|Cor|Gal|Eph|Phil|Col|Thess|Tim|Philem|Heb|Jas|Pet|Rev))[\s.]*(\d{1,3})(?:[\s.:]*(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?)?/gi;

export function extractScriptureReferencesFromSermon(text: string): string[] {
  if (!text) return [];
  
  const references: string[] = [];
  const seen = new Set<string>();
  
  // Strip HTML tags
  const plainText = text.replace(/<[^>]*>/g, ' ');
  
  let match;
  while ((match = SCRIPTURE_PATTERN.exec(plainText)) !== null) {
    const [, book, chapter, verse, endVerse] = match;
    
    // Normalize book name
    const normalizedBook = BOOK_ALIASES[book.toLowerCase().trim()] || book;
    
    let ref = `${normalizedBook} ${chapter}`;
    if (verse) {
      ref += `:${verse}`;
      if (endVerse) {
        ref += `-${endVerse}`;
      }
    }
    
    // Avoid duplicates
    const key = ref.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      references.push(ref);
    }
  }
  
  return references;
}

export function stripHtmlToText(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
