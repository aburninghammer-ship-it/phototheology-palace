import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Starting STEPBible verses import...');

    // Fetch KJV verses with Strong's numbers from STEPBible GitHub
    const response = await fetch(
      'https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Translators%20Amalgamated%20OT%2BNT%20-%20STEPBible.org%20CC%20BY.txt'
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch from STEPBible: ${response.statusText}`);
    }

    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('#'));

    console.log(`Processing ${lines.length} lines...`);

    // Parse and transform data
    const verses: any[] = [];
    const bookMap: Record<string, string> = {
      'Gen': 'Genesis', 'Exo': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers', 'Deu': 'Deuteronomy',
      'Jos': 'Joshua', 'Jdg': 'Judges', 'Rut': 'Ruth', '1Sa': '1 Samuel', '2Sa': '2 Samuel',
      '1Ki': '1 Kings', '2Ki': '2 Kings', '1Ch': '1 Chronicles', '2Ch': '2 Chronicles',
      'Ezr': 'Ezra', 'Neh': 'Nehemiah', 'Est': 'Esther', 'Job': 'Job', 'Psa': 'Psalms',
      'Pro': 'Proverbs', 'Ecc': 'Ecclesiastes', 'Sol': 'Song of Solomon', 'Isa': 'Isaiah',
      'Jer': 'Jeremiah', 'Lam': 'Lamentations', 'Eze': 'Ezekiel', 'Dan': 'Daniel',
      'Hos': 'Hosea', 'Joe': 'Joel', 'Amo': 'Amos', 'Oba': 'Obadiah', 'Jon': 'Jonah',
      'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk', 'Zep': 'Zephaniah', 'Hag': 'Haggai',
      'Zec': 'Zechariah', 'Mal': 'Malachi', 'Mat': 'Matthew', 'Mar': 'Mark', 'Luk': 'Luke',
      'Joh': 'John', 'Act': 'Acts', 'Rom': 'Romans', '1Co': '1 Corinthians', '2Co': '2 Corinthians',
      'Gal': 'Galatians', 'Eph': 'Ephesians', 'Php': 'Philippians', 'Col': 'Colossians',
      '1Th': '1 Thessalonians', '2Th': '2 Thessalonians', '1Ti': '1 Timothy', '2Ti': '2 Timothy',
      'Tit': 'Titus', 'Phm': 'Philemon', 'Heb': 'Hebrews', 'Jas': 'James', '1Pe': '1 Peter',
      '2Pe': '2 Peter', '1Jo': '1 John', '2Jo': '2 John', '3Jo': '3 John', 'Jud': 'Jude',
      'Rev': 'Revelation'
    };

    for (const line of lines.slice(0, 1000)) { // Import first 1000 verses as sample
      const parts = line.split('\t');
      if (parts.length < 2) continue;

      const ref = parts[0]; // Format: Book.Chapter.Verse
      const text = parts[1];

      const refParts = ref.split('.');
      if (refParts.length < 3) continue;

      const bookCode = refParts[0];
      const book = bookMap[bookCode];
      if (!book) continue;

      const chapter = parseInt(refParts[1]);
      const verse = parseInt(refParts[2]);

      // Parse tokens with Strong's numbers
      const tokens: any[] = [];
      const words = text.split(/\s+/);
      
      for (const word of words) {
        const match = word.match(/^(.+?)(?:\{([GH]\d+)\})?$/);
        if (match) {
          tokens.push({
            t: match[1].replace(/[^\w\s'-]/g, ''),
            s: match[2] || null
          });
        }
      }

      verses.push({
        book,
        chapter,
        verse_num: verse,
        tokens,
        text_kjv: tokens.map(t => t.t).join(' ')
      });
    }

    console.log(`Importing ${verses.length} verses...`);

    // Insert in batches
    const batchSize = 100;
    let imported = 0;

    for (let i = 0; i < verses.length; i += batchSize) {
      const batch = verses.slice(i, i + batchSize);
      
      const { error } = await supabaseClient
        .from('bible_verses_tokenized')
        .upsert(batch, {
          onConflict: 'book,chapter,verse_num',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Batch insert error:', error);
        throw error;
      }

      imported += batch.length;
      console.log(`Imported ${imported}/${verses.length} verses`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported,
        message: `Successfully imported ${imported} verses from STEPBible`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Import error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
