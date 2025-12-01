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

// Primary API: bible-api.com
async function fetchFromBibleApi(book: string, chapter: number, version: string): Promise<Response> {
  const normalizedBook = normalizeBookName(book);
  const url = `https://bible-api.com/${encodeURIComponent(normalizedBook)}+${chapter}?translation=${version}`;
  console.log(`[Primary API] Fetching: ${url}`);
  return fetch(url, {
    headers: { 'Accept': 'application/json' }
  });
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
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fallback API returned ${response.status}`);
  }
  
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No verses from fallback API');
  }
  
  // Transform to standard format
  return {
    verses: data.map((v: any) => ({
      book: v.bookname || book,
      chapter: v.chapter || chapter,
      verse: parseInt(v.verse),
      text: v.text?.replace(/<[^>]*>/g, '') || '' // Strip HTML tags
    }))
  };
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

// Fetch with retry logic and multiple fallbacks
async function fetchWithRetry(book: string, chapter: number, version: string, maxRetries = 4): Promise<any> {
  let lastError: Error | null = null;
  
  // Try primary API with retries
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

  // Try fallback API 1: labs.bible.org
  console.log(`[Fallback 1] Primary API failed, trying labs.bible.org for ${book} ${chapter}`);
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

    console.log(`[Bible API] Fetching ${book} ${chapter} (${version})`);

    // Fetch with retry and fallback
    const data = await fetchWithRetry(book, chapter, version);
    
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
      JSON.stringify({ verses }),
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