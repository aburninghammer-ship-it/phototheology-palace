import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { getVerses } from 'npm:biblesdk@0.4.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BibleSDKPhrase {
  book: string;
  text: string;
  usfm: string[];
  position: number;
  verse: number | null;
  verse_position: number | null;
  chapter: number;
  strongs_number: number | null;
  strongs_type: string | null;
  transliteration: string | null;
  definition: string | null;
  hebrew_word: string | null;
  greek_word: string | null;
}

interface BibleSDKResponse {
  phrases: BibleSDKPhrase[];
  prev: any;
}

// All 66 books of the Bible with their codes and chapter counts
const BIBLE_BOOKS = [
  { code: 'GEN', name: 'Genesis', chapters: 50 },
  { code: 'EXO', name: 'Exodus', chapters: 40 },
  { code: 'LEV', name: 'Leviticus', chapters: 27 },
  { code: 'NUM', name: 'Numbers', chapters: 36 },
  { code: 'DEU', name: 'Deuteronomy', chapters: 34 },
  { code: 'JOS', name: 'Joshua', chapters: 24 },
  { code: 'JDG', name: 'Judges', chapters: 21 },
  { code: 'RUT', name: 'Ruth', chapters: 4 },
  { code: '1SA', name: '1 Samuel', chapters: 31 },
  { code: '2SA', name: '2 Samuel', chapters: 24 },
  { code: '1KI', name: '1 Kings', chapters: 22 },
  { code: '2KI', name: '2 Kings', chapters: 25 },
  { code: '1CH', name: '1 Chronicles', chapters: 29 },
  { code: '2CH', name: '2 Chronicles', chapters: 36 },
  { code: 'EZR', name: 'Ezra', chapters: 10 },
  { code: 'NEH', name: 'Nehemiah', chapters: 13 },
  { code: 'EST', name: 'Esther', chapters: 10 },
  { code: 'JOB', name: 'Job', chapters: 42 },
  { code: 'PSA', name: 'Psalms', chapters: 150 },
  { code: 'PRO', name: 'Proverbs', chapters: 31 },
  { code: 'ECC', name: 'Ecclesiastes', chapters: 12 },
  { code: 'SNG', name: 'Song of Solomon', chapters: 8 },
  { code: 'ISA', name: 'Isaiah', chapters: 66 },
  { code: 'JER', name: 'Jeremiah', chapters: 52 },
  { code: 'LAM', name: 'Lamentations', chapters: 5 },
  { code: 'EZK', name: 'Ezekiel', chapters: 48 },
  { code: 'DAN', name: 'Daniel', chapters: 12 },
  { code: 'HOS', name: 'Hosea', chapters: 14 },
  { code: 'JOL', name: 'Joel', chapters: 3 },
  { code: 'AMO', name: 'Amos', chapters: 9 },
  { code: 'OBA', name: 'Obadiah', chapters: 1 },
  { code: 'JON', name: 'Jonah', chapters: 4 },
  { code: 'MIC', name: 'Micah', chapters: 7 },
  { code: 'NAM', name: 'Nahum', chapters: 3 },
  { code: 'HAB', name: 'Habakkuk', chapters: 3 },
  { code: 'ZEP', name: 'Zephaniah', chapters: 3 },
  { code: 'HAG', name: 'Haggai', chapters: 2 },
  { code: 'ZEC', name: 'Zechariah', chapters: 14 },
  { code: 'MAL', name: 'Malachi', chapters: 4 },
  { code: 'MAT', name: 'Matthew', chapters: 28 },
  { code: 'MRK', name: 'Mark', chapters: 16 },
  { code: 'LUK', name: 'Luke', chapters: 24 },
  { code: 'JHN', name: 'John', chapters: 21 },
  { code: 'ACT', name: 'Acts', chapters: 28 },
  { code: 'ROM', name: 'Romans', chapters: 16 },
  { code: '1CO', name: '1 Corinthians', chapters: 16 },
  { code: '2CO', name: '2 Corinthians', chapters: 13 },
  { code: 'GAL', name: 'Galatians', chapters: 6 },
  { code: 'EPH', name: 'Ephesians', chapters: 6 },
  { code: 'PHP', name: 'Philippians', chapters: 4 },
  { code: 'COL', name: 'Colossians', chapters: 4 },
  { code: '1TH', name: '1 Thessalonians', chapters: 5 },
  { code: '2TH', name: '2 Thessalonians', chapters: 3 },
  { code: '1TI', name: '1 Timothy', chapters: 6 },
  { code: '2TI', name: '2 Timothy', chapters: 4 },
  { code: 'TIT', name: 'Titus', chapters: 3 },
  { code: 'PHM', name: 'Philemon', chapters: 1 },
  { code: 'HEB', name: 'Hebrews', chapters: 13 },
  { code: 'JAS', name: 'James', chapters: 5 },
  { code: '1PE', name: '1 Peter', chapters: 5 },
  { code: '2PE', name: '2 Peter', chapters: 3 },
  { code: '1JN', name: '1 John', chapters: 5 },
  { code: '2JN', name: '2 John', chapters: 1 },
  { code: '3JN', name: '3 John', chapters: 1 },
  { code: 'JUD', name: 'Jude', chapters: 1 },
  { code: 'REV', name: 'Revelation', chapters: 22 },
];

Deno.serve(async (req) => {
  // Log request details for debugging
  console.log('=== Import Bible Verses Function Called ===');
  console.log('Method:', req.method);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Creating Supabase client...');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    console.log('Parsing request body...');
    const { bookCode } = await req.json().catch(() => ({}));
    console.log('Book code received:', bookCode);
    
    // If bookCode is provided, import just that book, otherwise import all books
    // Make comparison case-insensitive
    const booksToImport = bookCode 
      ? BIBLE_BOOKS.filter(b => b.code.toLowerCase() === bookCode.toLowerCase())
      : BIBLE_BOOKS;

    if (bookCode && booksToImport.length === 0) {
      console.error(`Book code "${bookCode}" not found in BIBLE_BOOKS array`);
      console.log('Available codes:', BIBLE_BOOKS.map(b => b.code).join(', '));
      throw new Error(`Book code "${bookCode}" not recognized`);
    }

    console.log(`Will import ${booksToImport.length} book(s):`, booksToImport.map(b => b.name).join(', '));
    let totalVersesImported = 0;
    const results: any[] = [];

    for (const book of booksToImport) {
      console.log(`Starting import of ${book.name} (${book.code})`);
      
      for (let chapter = 1; chapter <= book.chapters; chapter++) {
        console.log(`Fetching ${book.code} chapter ${chapter}...`);

        try {
          console.log(`Calling BibleSDK getVerses with code: ${book.code}`);
          
          // Try different verse ranges (most chapters have < 50 verses, Psalm 119 has 176)
          let response: BibleSDKResponse | null = null;
          const rangesToTry = [176, 100, 75, 50, 40, 30, 20, 10];
          let lastError: Error | null = null;
          
          for (const maxVerse of rangesToTry) {
            try {
              console.log(`Trying ${book.code} ${chapter} with range [1, ${maxVerse}]`);
              response = await getVerses(book.code, chapter, [1, maxVerse]) as unknown as BibleSDKResponse;
              console.log(`✓ Successfully fetched ${book.code} ${chapter} with range [1, ${maxVerse}]`);
              break;
            } catch (rangeError: any) {
              console.log(`Failed range [1, ${maxVerse}]: ${rangeError.message}`);
              lastError = rangeError;
              if (rangeError.message?.includes('out of range') || rangeError.message?.includes('Invalid verse range')) {
                continue; // Try next smaller range
              }
              throw rangeError; // Different error, rethrow
            }
          }
          
          if (!response) {
            throw lastError || new Error('Failed to fetch verses with any range');
          }
          
          console.log(`BibleSDK response for ${book.code} ${chapter}:`, response ? 'received' : 'null', response?.phrases?.length || 0, 'phrases');
          
          if (!response || !response.phrases || response.phrases.length === 0) {
            console.warn(`No verses found for ${book.code} chapter ${chapter}`);
            continue;
          }

          // Group phrases by verse number
          const verseGroups = new Map<number, BibleSDKPhrase[]>();
          response.phrases.forEach((phrase) => {
            if (phrase.verse !== null) {
              if (!verseGroups.has(phrase.verse)) {
                verseGroups.set(phrase.verse, []);
              }
              verseGroups.get(phrase.verse)!.push(phrase);
            }
          });

          // Process each verse
          const versesToInsert = Array.from(verseGroups.entries()).map(([verseNum, phrases]) => {
            // Build KJV text by using English words when available, fallback to text
            const verseText = phrases.map(p => {
              // For KJV text, we want the actual English word
              // BibleSDK may have the English in the text field for KJV
              return p.text;
            }).join('').trim();
            
            // For tokens, store each word with its Strong's number
            const tokens = phrases.map((p, idx) => ({
              position: idx,
              t: p.text.trim(), // Store the English KJV word
              s: p.strongs_number ? `${p.strongs_type}${p.strongs_number}` : null,
              transliteration: p.transliteration || null,
              definition: p.definition || null,
              hebrew_word: p.hebrew_word || null,
              greek_word: p.greek_word || null,
            }));

            return {
              book: book.code,
              chapter: chapter,
              verse_num: verseNum,
              text_kjv: verseText,
              tokens: tokens,
            };
          });

          // Insert verses in batches
          const batchSize = 50;
          for (let i = 0; i < versesToInsert.length; i += batchSize) {
            const batch = versesToInsert.slice(i, i + batchSize);
            
            const { error } = await supabaseClient
              .from('bible_verses_tokenized')
              .upsert(batch, {
                onConflict: 'book,chapter,verse_num',
              });

            if (error) {
              console.error('Error inserting batch:', error);
              throw error;
            }

            totalVersesImported += batch.length;
          }

          console.log(`✓ Imported ${book.code} chapter ${chapter} (${versesToInsert.length} verses)`);
        } catch (chapterError: any) {
          console.error(`Error importing ${book.code} chapter ${chapter}:`, chapterError);
          results.push({
            book: book.name,
            chapter,
            error: chapterError.message,
          });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`✓ Completed ${book.name}: imported verses`);
    }

    const response = {
      success: true,
      message: `Successfully imported ${totalVersesImported} verses from ${booksToImport.map(b => b.name).join(', ')}`,
      totalVerses: totalVersesImported,
      booksImported: booksToImport.length,
      bookNames: booksToImport.map(b => b.name),
      errors: results.filter(r => r.error),
    };
    
    console.log('Import complete:', response);
    
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});