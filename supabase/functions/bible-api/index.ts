import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Normalize book names for API compatibility
function normalizeBookName(book: string): string {
  const bookMap: Record<string, string> = {
    'genesis': 'Genesis', 'exodus': 'Exodus', 'leviticus': 'Leviticus', 'numbers': 'Numbers',
    'deuteronomy': 'Deuteronomy', 'joshua': 'Joshua', 'judges': 'Judges', 'ruth': 'Ruth',
    '1 samuel': '1 Samuel', '2 samuel': '2 Samuel', '1 kings': '1 Kings', '2 kings': '2 Kings',
    '1 chronicles': '1 Chronicles', '2 chronicles': '2 Chronicles', 'ezra': 'Ezra', 'nehemiah': 'Nehemiah',
    'esther': 'Esther', 'job': 'Job', 'psalms': 'Psalms', 'psalm': 'Psalms', 'proverbs': 'Proverbs',
    'ecclesiastes': 'Ecclesiastes', 'song of solomon': 'Song of Solomon', 'songs': 'Song of Solomon',
    'isaiah': 'Isaiah', 'jeremiah': 'Jeremiah', 'lamentations': 'Lamentations', 'ezekiel': 'Ezekiel',
    'daniel': 'Daniel', 'hosea': 'Hosea', 'joel': 'Joel', 'amos': 'Amos', 'obadiah': 'Obadiah',
    'jonah': 'Jonah', 'micah': 'Micah', 'nahum': 'Nahum', 'habakkuk': 'Habakkuk', 'zephaniah': 'Zephaniah',
    'haggai': 'Haggai', 'zechariah': 'Zechariah', 'malachi': 'Malachi',
    'matthew': 'Matthew', 'mark': 'Mark', 'luke': 'Luke', 'john': 'John', 'acts': 'Acts',
    'romans': 'Romans', '1 corinthians': '1 Corinthians', '2 corinthians': '2 Corinthians',
    'galatians': 'Galatians', 'ephesians': 'Ephesians', 'philippians': 'Philippians',
    'colossians': 'Colossians', '1 thessalonians': '1 Thessalonians', '2 thessalonians': '2 Thessalonians',
    '1 timothy': '1 Timothy', '2 timothy': '2 Timothy', 'titus': 'Titus', 'philemon': 'Philemon',
    'hebrews': 'Hebrews', 'james': 'James', '1 peter': '1 Peter', '2 peter': '2 Peter',
    '1 john': '1 John', '2 john': '2 John', '3 john': '3 John', 'jude': 'Jude', 'revelation': 'Revelation',
    'revelations': 'Revelation'
  };
  
  const normalized = book.toLowerCase().trim();
  return bookMap[normalized] || book;
}

// Single-chapter books in the Bible (need special handling for bible-api.com)
const SINGLE_CHAPTER_BOOKS: Record<string, number> = {
  'obadiah': 21,
  'philemon': 25,
  '2 john': 13,
  '3 john': 14,
  'jude': 25,
};

// Translations supported by bible-api.com
const BIBLE_API_SUPPORTED = ['kjv', 'web', 'bbe', 'asv', 'ylt', 'darby', 'clementine', 'almeida'];

// Map unsupported translations to closest supported alternative
const TRANSLATION_FALLBACK: Record<string, string> = {
  'niv': 'web',      // NIV -> WEB (modern English)
  'esv': 'asv',      // ESV -> ASV (literal translation)
  'nkjv': 'kjv',     // NKJV -> KJV (same family)
  'nasb': 'asv',     // NASB -> ASV (literal translation)
  'nlt': 'web',      // NLT -> WEB (dynamic equivalence)
};

// Primary API: bible-api.com (with timeout)
async function fetchFromBibleApi(book: string, chapter: number, version: string): Promise<Response> {
  const normalizedBook = normalizeBookName(book);
  const normalizedLower = book.toLowerCase().trim();

  // For single-chapter books, bible-api.com interprets "Book 1" as "Book 1:1" (just verse 1)
  // We need to specify a verse range to get all verses: "Book 1:1-25"
  let reference: string;
  if (SINGLE_CHAPTER_BOOKS[normalizedLower] && chapter === 1) {
    const verseCount = SINGLE_CHAPTER_BOOKS[normalizedLower];
    reference = `${normalizedBook} 1:1-${verseCount}`;
    console.log(`[Primary API] Single-chapter book detected, using range: ${reference}`);
  } else {
    reference = `${normalizedBook} ${chapter}`;
  }

  const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${version}`;
  console.log(`[Primary API] Fetching: ${url}`);
  
  // Add timeout controller (8 second timeout for reliability)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  
  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Primary API timeout');
    }
    throw err;
  }
}

// Fallback API 1: labs.bible.org (NET Bible)
async function fetchFromBibleOrg(book: string, chapter: number): Promise<any> {
  const bookMap: Record<string, string> = {
    'genesis': 'Gen', 'exodus': 'Exod', 'leviticus': 'Lev', 'numbers': 'Num',
    'deuteronomy': 'Deut', 'joshua': 'Josh', 'judges': 'Judg', 'ruth': 'Ruth',
    '1 samuel': '1Sam', '2 samuel': '2Sam', '1 kings': '1Kgs', '2 kings': '2Kgs',
    '1 chronicles': '1Chr', '2 chronicles': '2Chr', 'ezra': 'Ezra', 'nehemiah': 'Neh',
    'esther': 'Esth', 'job': 'Job', 'psalms': 'Ps', 'psalm': 'Ps', 'proverbs': 'Prov',
    'ecclesiastes': 'Eccl', 'song of solomon': 'Song', 'isaiah': 'Isa', 'jeremiah': 'Jer',
    'lamentations': 'Lam', 'ezekiel': 'Ezek', 'daniel': 'Dan', 'hosea': 'Hos',
    'joel': 'Joel', 'amos': 'Amos', 'obadiah': 'Obad', 'jonah': 'Jonah', 'micah': 'Mic',
    'nahum': 'Nah', 'habakkuk': 'Hab', 'zephaniah': 'Zeph', 'haggai': 'Hag',
    'zechariah': 'Zech', 'malachi': 'Mal', 'matthew': 'Matt', 'mark': 'Mark',
    'luke': 'Luke', 'john': 'John', 'acts': 'Acts', 'romans': 'Rom',
    '1 corinthians': '1Cor', '2 corinthians': '2Cor', 'galatians': 'Gal',
    'ephesians': 'Eph', 'philippians': 'Phil', 'colossians': 'Col',
    '1 thessalonians': '1Thess', '2 thessalonians': '2Thess', '1 timothy': '1Tim',
    '2 timothy': '2Tim', 'titus': 'Titus', 'philemon': 'Phlm', 'hebrews': 'Heb',
    'james': 'Jas', '1 peter': '1Pet', '2 peter': '2Pet', '1 john': '1John',
    '2 john': '2John', '3 john': '3John', 'jude': 'Jude', 'revelation': 'Rev'
  };
  
  const normalizedBook = book.toLowerCase().trim();
  const bibleOrgBook = bookMap[normalizedBook] || book;
  
  const url = `https://labs.bible.org/api/?passage=${encodeURIComponent(bibleOrgBook)}+${chapter}&type=json`;
  console.log(`[Fallback API 1] Fetching: ${url}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Fallback API returned ${response.status}`);
    }
    
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No verses from fallback API');
    }
    return {
      verses: data.map((v: any) => ({
        book: v.bookname || book,
        chapter: v.chapter || chapter,
        verse: parseInt(v.verse),
        text: v.text?.replace(/<[^>]*>/g, '') || ''
      }))
    };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Fallback API 2: getbible.net
async function fetchFromGetBible(book: string, chapter: number): Promise<any> {
  const normalizedBook = normalizeBookName(book);
  const url = `https://getbible.net/v2/kjv/${encodeURIComponent(normalizedBook.toLowerCase())}/${chapter}.json`;
  console.log(`[Fallback API 2] Fetching: ${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GetBible API returned ${response.status}`);
  }

  const data = await response.json();
  if (!data.verses || data.verses.length === 0) {
    throw new Error('No verses from GetBible API');
  }

  return {
    verses: data.verses.map((v: any) => ({
      book: normalizedBook,
      chapter: chapter,
      verse: v.verse,
      text: v.text
    }))
  };
}

// Fallback API 3: bolls.life (supports many translations including NIV, ESV, NASB)
async function fetchFromBollsLife(book: string, chapter: number, version: string): Promise<any> {
  // Map our translation codes to bolls.life short_name or numeric IDs
  // bolls.life accepts short_name strings directly (e.g., "RV1960", "NVI", "LSG")
  const translationMap: Record<string, string> = {
    'kjv': 'KJV',
    'niv': 'NIV',
    'esv': 'ESV',
    'nkjv': 'NKJV',
    'nasb': 'NASB',
    'nlt': 'NLT',
    'web': 'WEB',
    'asv': 'ASV',
    // Spanish
    'rves': 'RV1960',
    'rvr': 'RV1960',
    'rv1960': 'RV1960',
    'rvr1960': 'RV1960',
    'nvi': 'NVI',
    // French
    'lsg': 'LSG',
    // German
    'luther': 'LUTH1545',
    'lut': 'LUTH1545',
    // Portuguese
    'almeida': 'ARC',
    'arc': 'ARC',
    'nvi-pt': 'NVI-PT',
  };

  const bookMap: Record<string, number> = {
    'genesis': 1, 'exodus': 2, 'leviticus': 3, 'numbers': 4, 'deuteronomy': 5,
    'joshua': 6, 'judges': 7, 'ruth': 8, '1 samuel': 9, '2 samuel': 10,
    '1 kings': 11, '2 kings': 12, '1 chronicles': 13, '2 chronicles': 14,
    'ezra': 15, 'nehemiah': 16, 'esther': 17, 'job': 18, 'psalms': 19, 'psalm': 19,
    'proverbs': 20, 'ecclesiastes': 21, 'song of solomon': 22, 'isaiah': 23,
    'jeremiah': 24, 'lamentations': 25, 'ezekiel': 26, 'daniel': 27, 'hosea': 28,
    'joel': 29, 'amos': 30, 'obadiah': 31, 'jonah': 32, 'micah': 33, 'nahum': 34,
    'habakkuk': 35, 'zephaniah': 36, 'haggai': 37, 'zechariah': 38, 'malachi': 39,
    'matthew': 40, 'mark': 41, 'luke': 42, 'john': 43, 'acts': 44, 'romans': 45,
    '1 corinthians': 46, '2 corinthians': 47, 'galatians': 48, 'ephesians': 49,
    'philippians': 50, 'colossians': 51, '1 thessalonians': 52, '2 thessalonians': 53,
    '1 timothy': 54, '2 timothy': 55, 'titus': 56, 'philemon': 57, 'hebrews': 58,
    'james': 59, '1 peter': 60, '2 peter': 61, '1 john': 62, '2 john': 63,
    '3 john': 64, 'jude': 65, 'revelation': 66
  };

  const translationId = translationMap[version.toLowerCase()] || 'KJV';
  const bookId = bookMap[book.toLowerCase().trim()];

  if (!bookId) {
    throw new Error(`Unknown book: ${book}`);
  }

  const url = `https://bolls.life/get-chapter/${translationId}/${bookId}/${chapter}/`;
  console.log(`[Fallback API 3 - Bolls.life] Fetching: ${url}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Bolls.life API returned ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No verses from Bolls.life API');
    }

    const normalizedBook = normalizeBookName(book);
    return {
      verses: data.map((v: any) => ({
        book: normalizedBook,
        chapter: chapter,
        verse: v.verse,
        text: v.text
      }))
    };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Translations that should use bolls.life API (modern translations and non-English not in bible-api.com)
const BOLLS_LIFE_PREFERRED = ['niv', 'esv', 'nkjv', 'nasb', 'nlt', 'rves', 'rvr', 'rv1960', 'rvr1960', 'nvi', 'lsg', 'luther', 'lut', 'almeida', 'arc', 'nvi-pt'];

// Fetch with retry logic and multiple fallbacks - reduced retries for faster response
async function fetchWithRetry(book: string, chapter: number, version: string, maxRetries = 2): Promise<any> {
  let lastError: Error | null = null;
  const versionLower = version.toLowerCase();

  // For modern translations (NIV, ESV, NKJV, NASB, NLT), try bolls.life first
  if (BOLLS_LIFE_PREFERRED.includes(versionLower)) {
    console.log(`[Bolls.life] Trying first for modern translation: ${version}`);
    try {
      const bollsData = await fetchFromBollsLife(book, chapter, version);
      if (bollsData.verses && bollsData.verses.length > 0) {
        console.log(`[Bolls.life] Success! Got ${bollsData.verses.length} verses`);
        return bollsData;
      }
    } catch (bollsErr) {
      console.error(`[Bolls.life] Failed:`, bollsErr);
      lastError = bollsErr instanceof Error ? bollsErr : new Error(String(bollsErr));
    }
  }

  // Try primary API (bible-api.com) with retries
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      // Exponential backoff: 500ms, 1s, 2s, 4s
      const waitTime = Math.pow(2, attempt) * 250;
      console.log(`[Primary API] Retry ${attempt + 1}/${maxRetries} after ${waitTime}ms`);
      await delay(waitTime);
    }

    try {
      const response = await fetchFromBibleApi(book, chapter, version);

      if (response.ok) {
        const data = await response.json();
        if (data.verses && data.verses.length > 0) {
          console.log(`[Primary API] Success! Got ${data.verses.length} verses`);
          return data;
        }
      }

      // Check if it's a rate limit error (429)
      if (response.status === 429) {
        console.warn(`[Primary API] Rate limited (429), attempt ${attempt + 1}`);
        lastError = new Error(`Rate limited: ${response.status}`);
        continue; // Retry
      }

      // For 404 or other client errors, try fallback immediately
      if (response.status >= 400 && response.status < 500) {
        console.warn(`[Primary API] Client error ${response.status}, trying fallbacks`);
        break;
      }

      lastError = new Error(`Bible API returned ${response.status}`);
    } catch (err) {
      console.error(`[Primary API] Fetch error:`, err);
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  // Try bolls.life as fallback (if we didn't already try it)
  if (!BOLLS_LIFE_PREFERRED.includes(versionLower)) {
    console.log(`[Fallback - Bolls.life] Trying for ${book} ${chapter}`);
    try {
      const bollsData = await fetchFromBollsLife(book, chapter, version);
      if (bollsData.verses && bollsData.verses.length > 0) {
        console.log(`[Fallback - Bolls.life] Success! Got ${bollsData.verses.length} verses`);
        return bollsData;
      }
    } catch (bollsErr) {
      console.error(`[Fallback - Bolls.life] Failed:`, bollsErr);
    }
  }

  // Try fallback API 1: labs.bible.org
  console.log(`[Fallback 1] Trying labs.bible.org for ${book} ${chapter}`);
  try {
    const fallbackData = await fetchFromBibleOrg(book, chapter);
    if (fallbackData.verses && fallbackData.verses.length > 0) {
      console.log(`[Fallback 1] Success! Got ${fallbackData.verses.length} verses`);
      return fallbackData;
    }
  } catch (fallbackErr) {
    console.error(`[Fallback 1] Failed:`, fallbackErr);
  }

  // Try fallback API 2: getbible.net
  console.log(`[Fallback 2] Trying getbible.net for ${book} ${chapter}`);
  try {
    const fallbackData = await fetchFromGetBible(book, chapter);
    if (fallbackData.verses && fallbackData.verses.length > 0) {
      console.log(`[Fallback 2] Success! Got ${fallbackData.verses.length} verses`);
      return fallbackData;
    }
  } catch (fallbackErr) {
    console.error(`[Fallback 2] Failed:`, fallbackErr);
  }

  throw lastError || new Error('All Bible API sources failed. Please try again in a moment.');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, version = 'kjv' } = await req.json();

    if (!book || !chapter) {
      throw new Error('Book and chapter are required');
    }

    // Check if translation is supported, use fallback if not
    let actualVersion = version.toLowerCase();
    let usedFallback = false;

    // Bolls.life-preferred translations bypass the bible-api.com fallback logic
    if (BOLLS_LIFE_PREFERRED.includes(actualVersion)) {
      console.log(`[Bible API] Translation '${version}' will be routed to bolls.life`);
    } else if (!BIBLE_API_SUPPORTED.includes(actualVersion)) {
      const fallback = TRANSLATION_FALLBACK[actualVersion];
      if (fallback) {
        console.log(`[Bible API] Translation '${version}' not supported, using fallback '${fallback}'`);
        actualVersion = fallback;
        usedFallback = true;
      } else {
        console.log(`[Bible API] Translation '${version}' not supported, defaulting to 'kjv'`);
        actualVersion = 'kjv';
        usedFallback = true;
      }
    }

    console.log(`[Bible API] Fetching ${book} ${chapter} (${actualVersion})`);

    // Fetch with retry and fallback
    const data = await fetchWithRetry(book, chapter, actualVersion);
    
    if (!data.verses || data.verses.length === 0) {
      throw new Error('No verses found for this chapter');
    }

    // Format verses consistently (handle both primary and fallback API formats)
    const normalizedBook = normalizeBookName(book);
    const verses = data.verses.map((v: any) => ({
      book: v.book || normalizedBook,
      chapter: v.chapter || chapter,
      verse: v.verse,
      text: v.text
    }));

    console.log(`[Bible API] Returning ${verses.length} verses`);

    return new Response(
      JSON.stringify({
        verses,
        translation: actualVersion,
        requestedTranslation: version,
        usedFallback
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in bible-api function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Bible text';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        suggestion: 'Please try refreshing the page or selecting a different chapter.'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});