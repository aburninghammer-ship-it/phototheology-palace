import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Unauthorized');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Starting TAHOT file import...');

    // Get the file content from request body
    const { fileContent } = await req.json();
    
    if (!fileContent) {
      throw new Error('No file content provided');
    }

    const lines = fileContent.split('\n').filter((line: string) => line.trim());
    console.log(`Processing ${lines.length} lines...`);

    // Book name mapping - both OT and NT
    const bookMap: Record<string, string> = {
      // Old Testament
      'Gen': 'Genesis', 'Exo': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers', 'Deu': 'Deuteronomy',
      'Jos': 'Joshua', 'Jdg': 'Judges', 'Rut': 'Ruth', '1Sa': '1 Samuel', '2Sa': '2 Samuel',
      '1Ki': '1 Kings', '2Ki': '2 Kings', '1Ch': '1 Chronicles', '2Ch': '2 Chronicles',
      'Ezr': 'Ezra', 'Neh': 'Nehemiah', 'Est': 'Esther', 'Job': 'Job', 'Psa': 'Psalms',
      'Pro': 'Proverbs', 'Ecc': 'Ecclesiastes', 'Sng': 'Song of Solomon',
      'Isa': 'Isaiah', 'Jer': 'Jeremiah', 'Lam': 'Lamentations', 'Ezk': 'Ezekiel',
      'Dan': 'Daniel', 'Hos': 'Hosea', 'Joe': 'Joel', 'Amo': 'Amos', 'Oba': 'Obadiah',
      'Jon': 'Jonah', 'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk', 'Zep': 'Zephaniah',
      'Hag': 'Haggai', 'Zec': 'Zechariah', 'Mal': 'Malachi',
      // New Testament
      'Mat': 'Matthew', 'Mrk': 'Mark', 'Luk': 'Luke', 'Jhn': 'John',
      'Act': 'Acts', 'Rom': 'Romans', '1Co': '1 Corinthians', '2Co': '2 Corinthians',
      'Gal': 'Galatians', 'Eph': 'Ephesians', 'Php': 'Philippians', 'Col': 'Colossians',
      '1Th': '1 Thessalonians', '2Th': '2 Thessalonians', '1Ti': '1 Timothy', '2Ti': '2 Timothy',
      'Tit': 'Titus', 'Phm': 'Philemon', 'Heb': 'Hebrews', 'Jas': 'James',
      '1Pe': '1 Peter', '2Pe': '2 Peter', '1Jn': '1 John', '2Jn': '2 John', '3Jn': '3 John',
      'Jud': 'Jude', 'Rev': 'Revelation'
    };

    const verses: any[] = [];
    const verseMap = new Map<string, any>();

    for (const line of lines) {
      // Skip header lines and comment lines
      if (line.startsWith('#') || line.startsWith('Eng (Heb)') || line.length < 10) {
        continue;
      }

      const parts = line.split('\t');
      if (parts.length < 5) continue;

      // Parse the reference: e.g., "Gen.1.1#01=L"
      const refPart = parts[0];
      const refMatch = refPart.match(/^([A-Za-z0-9]+)\.(\d+)\.(\d+)#(\d+)/);
      
      if (!refMatch) continue;

      const bookCode = refMatch[1];
      const book = bookMap[bookCode];
      if (!book) continue;

      const chapter = parseInt(refMatch[2]);
      const verseNum = parseInt(refMatch[3]);
      const wordNum = parseInt(refMatch[4]);

      const hebrew = parts[1] || '';
      const transliteration = parts[2] || '';
      const translation = parts[3] || '';
      const dStrongs = parts[4] || '';

      // Create verse key
      const verseKey = `${book}:${chapter}:${verseNum}`;

      // Get or create verse entry
      if (!verseMap.has(verseKey)) {
        verseMap.set(verseKey, {
          book,
          chapter,
          verse_num: verseNum,
          tokens: [],
          text_kjv: ''
        });
      }

      const verse = verseMap.get(verseKey);

      // Parse Strong's numbers from dStrongs
      // Format: H9003/{H7225G} or {H1254A} for Hebrew, G0976 for Greek
      const strongsMatches = dStrongs.match(/[HG]\d+[A-Z]?/g);
      const strongsNum = strongsMatches ? strongsMatches.find((s: string) => /[HG]\d{4}/.test(s)) : null;

      // Add token
      verse.tokens.push({
        t: translation.replace(/[<>\[\]]/g, '').trim(), // Remove angle/square brackets
        s: strongsNum,
        h: hebrew.replace(/[\/\\]/g, ''), // Remove separators
        tr: transliteration
      });
    }

    // Convert map to array and build text_kjv
    for (const [key, verse] of verseMap) {
      // Build text from tokens
      verse.text_kjv = verse.tokens
        .map((t: any) => t.t)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      verses.push(verse);
    }

    console.log(`Parsed ${verses.length} verses`);

    // Insert in batches of 1000
    const batchSize = 1000;
    let imported = 0;

    for (let i = 0; i < verses.length; i += batchSize) {
      const batch = verses.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('bible_verses_tokenized')
        .upsert(batch, {
          onConflict: 'book,chapter,verse_num',
          ignoreDuplicates: false
        });

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        throw error;
      }

      imported += batch.length;
      console.log(`Imported ${imported} of ${verses.length} verses`);
    }

    console.log(`Successfully imported ${imported} verses`);

    return new Response(
      JSON.stringify({
        success: true,
        imported,
        message: `Successfully imported ${imported} verses from TAHOT file`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});