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

    console.log('Starting Bible verses import...');

    // Use the 2024 branch (legacy version) which has the old CSV structure
    const response = await fetch(
      'https://raw.githubusercontent.com/scrollmapper/bible_databases/2024/csv/t_kjv.csv'
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Bible data: ${response.statusText}`);
    }

    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());

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

    // Skip header line
    for (const line of lines.slice(1, 1001)) { // Import first 1000 verses as sample
      const parts = line.split(',');
      if (parts.length < 5) continue;

      // CSV format: id,book_id,chapter,verse,text
      const bookId = parseInt(parts[1]);
      const chapter = parseInt(parts[2]);
      const verseNum = parseInt(parts[3]);
      const text = parts.slice(4).join(',').replace(/^"|"$/g, ''); // Handle quoted text with commas

      // Map book_id to book name (1-66 for Bible books)
      const bookNames = Object.values(bookMap);
      const book = bookNames[bookId - 1];
      if (!book) continue;

      // Create simple tokens from words (without Strong's for now)
      const words = text.split(/\s+/);
      const tokens: any[] = words.map(word => ({
        t: word.replace(/[^\w\s'-]/g, ''),
        s: null // No Strong's numbers in this format
      }));

      verses.push({
        book,
        chapter,
        verse_num: verseNum,
        tokens,
        text_kjv: text
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
        message: `Successfully imported ${imported} KJV verses`
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
