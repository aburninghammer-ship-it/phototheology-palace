import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StrongsWord {
  strongs_number: string;
  word: string;
  position: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No Authorization header provided');
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Checking user authentication...');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError) {
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized: ' + userError.message }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!user) {
      console.error('No user found');
      return new Response(JSON.stringify({ error: 'Unauthorized: No user found' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Checking admin role for user:', user.id);
    const { data: roles, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (roleError) {
      console.error('Role check error:', roleError);
      return new Response(JSON.stringify({ error: 'Error checking role: ' + roleError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!roles || roles.length === 0) {
      console.error('No roles found for user:', user.id);
      return new Response(JSON.stringify({ error: 'Admin access required: No role assigned' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const hasAdminRole = roles.some(r => r.role === 'admin');
    if (!hasAdminRole) {
      console.error('User does not have admin role. Roles:', roles.map(r => r.role));
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Admin access verified for user:', user.id);

    console.log('Starting STEPBible import...');

    // Download Greek NT (TAGNT)
    console.log('Downloading Greek NT...');
    const tagntUrl = 'https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/TAGNT%20-%20Translators%20Amalgamated%20Greek%20NT%20-%20STEPBible.org%20CC%20BY.txt';
    const tagntResponse = await fetch(tagntUrl);
    const tagntText = await tagntResponse.text();

    // Download Hebrew OT (TAHOT)
    console.log('Downloading Hebrew OT...');
    const tahotUrl = 'https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/TAHOT%20-%20Translators%20Amalgamated%20Hebrew%20OT%20-%20STEPBible.org%20CC%20BY.txt';
    const tahotResponse = await fetch(tahotUrl);
    const tahotText = await tahotResponse.text();

    console.log('Parsing data...');
    const verses: any[] = [];
    let processedVerses = 0;
    let skippedLines = 0;

    // Parse function for TSV data
    const parseData = (text: string, testament: 'OT' | 'NT') => {
      const lines = text.split('\n');
      
      for (const line of lines) {
        if (!line.trim() || line.startsWith('#') || line.startsWith('$')) {
          continue;
        }

        const fields = line.split('\t');
        if (fields.length < 8) {
          skippedLines++;
          continue;
        }

        const ref = fields[0]; // e.g., "Gen.1.1" or "Mat.1.1"
        const orig = fields[1]; // Original language text
        const strongs = fields[5]; // Strong's numbers (space-separated)
        const gloss = fields[6]; // English gloss
        const morph = fields[7]; // Morphology

        if (!ref || !strongs || strongs === '–') {
          skippedLines++;
          continue;
        }

        // Parse reference: Book.Chapter.Verse
        const refParts = ref.split('.');
        if (refParts.length !== 3) {
          skippedLines++;
          continue;
        }

        const [book, chapter, verse] = refParts;
        
        // Parse Strong's numbers (can be multiple per word)
        const strongsNumbers = strongs.split(/\s+/).filter(s => s && s !== '–');
        
        if (strongsNumbers.length === 0) {
          skippedLines++;
          continue;
        }

        // Create words array
        const words: StrongsWord[] = strongsNumbers.map((strongsNum, idx) => ({
          strongs_number: strongsNum.replace(/[^\d]/g, ''), // Remove letters, keep numbers
          word: orig || '',
          position: idx + 1
        }));

        verses.push({
          book,
          chapter: parseInt(chapter),
          verse: parseInt(verse),
          testament,
          words
        });

        processedVerses++;
      }
    };

    parseData(tahotText, 'OT');
    parseData(tagntText, 'NT');

    console.log(`Parsed ${processedVerses} verses (skipped ${skippedLines} lines)`);

    // Import in batches
    console.log('Importing to database...');
    let imported = 0;
    let errors = 0;
    const batchSize = 100;

    for (let i = 0; i < verses.length; i += batchSize) {
      const batch = verses.slice(i, i + batchSize);
      
      for (const verseData of batch) {
        try {
          // Delete existing words for this verse
          await supabase
            .from('verses_strongs')
            .delete()
            .eq('book', verseData.book)
            .eq('chapter', verseData.chapter)
            .eq('verse', verseData.verse);

          // Insert new words
          if (verseData.words.length > 0) {
            const { error: insertError } = await supabase
              .from('verses_strongs')
              .insert(
                verseData.words.map((word: StrongsWord) => ({
                  book: verseData.book,
                  chapter: verseData.chapter,
                  verse: verseData.verse,
                  strongs_number: word.strongs_number,
                  word: word.word,
                  position: word.position,
                  testament: verseData.testament
                }))
              );

            if (insertError) {
              console.error(`Error inserting verse ${verseData.book}.${verseData.chapter}.${verseData.verse}:`, insertError);
              errors++;
            } else {
              imported++;
            }
          }
        } catch (err) {
          console.error(`Error processing verse:`, err);
          errors++;
        }
      }

      console.log(`Progress: ${Math.min(i + batchSize, verses.length)}/${verses.length} verses`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          total_verses: processedVerses,
          imported,
          errors,
          skipped_lines: skippedLines
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Import error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
