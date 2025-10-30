import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify admin access
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is admin
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { tahotContent } = await req.json();

    if (!tahotContent) {
      throw new Error('No TAHOT content provided');
    }

    console.log('Parsing TAHOT file...');
    const lines = tahotContent.split('\n');
    
    let versesImported = 0;
    let errors: string[] = [];
    const batchSize = 50;
    let batch: any[] = [];

    // Book name mapping
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

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('$') || trimmedLine.startsWith('#')) {
        continue;
      }

      try {
        const parts = trimmedLine.split('\t');
        if (parts.length < 6) continue;

        // Parse TAHOT format: Ref, English, Hebrew, Transliteration, Strongs, Morph
        const ref = parts[0]; // e.g., "Gen.1.1"
        const [bookCode, chapterStr, verseStr] = ref.split('.');
        const book = bookMap[bookCode];
        if (!book) continue;

        const chapter = parseInt(chapterStr);
        const verse_num = parseInt(verseStr);
        const englishText = parts[1];
        const hebrewText = parts[2];
        const transliteration = parts[3];
        const strongsRaw = parts[4];
        
        // Parse tokens with Strong's numbers
        const words = englishText.split(/\s+/);
        const hebrewWords = hebrewText.split(/\s+/);
        const translitWords = transliteration.split(/\s+/);
        const strongsNums = strongsRaw.split(/\s+/);

        const tokens: any[] = [];
        for (let i = 0; i < words.length; i++) {
          const word = words[i].replace(/[^\w\s'-]/g, '');
          const strongsNum = strongsNums[i] && strongsNums[i] !== '0' ? strongsNums[i] : null;
          const hebrew = hebrewWords[i] || null;
          const translit = translitWords[i] || null;

          tokens.push({
            t: word,
            s: strongsNum,
            h: hebrew,
            tr: translit
          });
        }

        batch.push({
          book,
          chapter,
          verse_num,
          text_kjv: englishText,
          tokens
        });

        // Insert batch when full
        if (batch.length >= batchSize) {
          const { error } = await supabaseClient
            .from('bible_verses_tokenized')
            .upsert(batch, {
              onConflict: 'book,chapter,verse_num',
              ignoreDuplicates: false
            });

          if (error) {
            errors.push(`Batch error: ${error.message}`);
          } else {
            versesImported += batch.length;
          }

          batch = [];
          
          if (versesImported % 500 === 0) {
            console.log(`Imported ${versesImported} verses...`);
          }
        }
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        errors.push(`Line parse error: ${errorMsg}`);
      }
    }

    // Insert remaining batch
    if (batch.length > 0) {
      const { error } = await supabaseClient
        .from('bible_verses_tokenized')
        .upsert(batch, {
          onConflict: 'book,chapter,verse_num',
          ignoreDuplicates: false
        });

      if (error) {
        errors.push(`Final batch error: ${error.message}`);
      } else {
        versesImported += batch.length;
      }
    }

    const result = {
      success: true,
      statistics: {
        versesImported,
        errors: errors.slice(0, 50),
        errorCount: errors.length
      }
    };

    console.log('TAHOT import complete:', result.statistics);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in import-tahot-file:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMsg
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});