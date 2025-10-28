import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StrongsWord {
  word_text: string;
  strongs_number?: string;
  word_position: number;
}

interface VerseData {
  book: string;
  chapter: number;
  verse: number;
  words: StrongsWord[];
}

interface StrongsEntry {
  strongs_number: string;
  word: string;
  transliteration?: string;
  pronunciation?: string;
  language: 'Hebrew' | 'Greek';
  definition: string;
  usage?: string;
  occurrences?: number;
  derivation?: string;
}

interface BulkImportPayload {
  verses: VerseData[];
  strongsEntries?: StrongsEntry[];
}

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

    const payload: BulkImportPayload = await req.json();
    
    let versesInserted = 0;
    let versesUpdated = 0;
    let versesSkipped = 0;
    let strongsEntriesInserted = 0;
    let errors: string[] = [];

    // Import Strong's entries first if provided
    if (payload.strongsEntries && payload.strongsEntries.length > 0) {
      console.log(`Importing ${payload.strongsEntries.length} Strong's entries...`);
      
      for (const entry of payload.strongsEntries) {
        try {
          const { error } = await supabaseClient
            .from('strongs_entries')
            .upsert({
              strongs_number: entry.strongs_number,
              word: entry.word,
              transliteration: entry.transliteration,
              pronunciation: entry.pronunciation,
              language: entry.language,
              definition: entry.definition,
              usage: entry.usage,
              occurrences: entry.occurrences,
              derivation: entry.derivation,
            }, {
              onConflict: 'strongs_number',
              ignoreDuplicates: false
            });

          if (error) {
            errors.push(`Strong's ${entry.strongs_number}: ${error.message}`);
          } else {
            strongsEntriesInserted++;
          }
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          errors.push(`Strong's ${entry.strongs_number}: ${errorMsg}`);
        }
      }
    }

    // Import verses in batches
    console.log(`Importing ${payload.verses.length} verses...`);
    const BATCH_SIZE = 100;
    
    for (let i = 0; i < payload.verses.length; i += BATCH_SIZE) {
      const batch = payload.verses.slice(i, i + BATCH_SIZE);
      
      for (const verseData of batch) {
        try {
          // Check if verse already exists
          const { data: existing } = await supabaseClient
            .from('verses_strongs')
            .select('id')
            .eq('book', verseData.book)
            .eq('chapter', verseData.chapter)
            .eq('verse', verseData.verse)
            .limit(1);

          if (existing && existing.length > 0) {
            // Delete existing words for this verse
            await supabaseClient
              .from('verses_strongs')
              .delete()
              .eq('book', verseData.book)
              .eq('chapter', verseData.chapter)
              .eq('verse', verseData.verse);
            
            versesUpdated++;
          } else {
            versesInserted++;
          }

          // Insert all words for this verse
          const wordsToInsert = verseData.words.map(word => ({
            book: verseData.book,
            chapter: verseData.chapter,
            verse: verseData.verse,
            word_text: word.word_text,
            word_position: word.word_position,
            strongs_number: word.strongs_number || null,
          }));

          const { error: insertError } = await supabaseClient
            .from('verses_strongs')
            .insert(wordsToInsert);

          if (insertError) {
            errors.push(`${verseData.book} ${verseData.chapter}:${verseData.verse}: ${insertError.message}`);
            versesSkipped++;
          }
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          errors.push(`${verseData.book} ${verseData.chapter}:${verseData.verse}: ${errorMsg}`);
          versesSkipped++;
        }
      }

      // Log progress
      console.log(`Processed ${Math.min(i + BATCH_SIZE, payload.verses.length)} of ${payload.verses.length} verses`);
    }

    const result = {
      success: true,
      statistics: {
        versesInserted,
        versesUpdated,
        versesSkipped,
        strongsEntriesInserted,
        totalVerses: payload.verses.length,
        totalStrongsEntries: payload.strongsEntries?.length || 0,
        errors: errors.slice(0, 50), // Limit error list
        errorCount: errors.length
      }
    };

    console.log('Import complete:', result.statistics);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in bulk-import-strongs:', error);
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
