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

    const baseUrl = 'https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Translators%20Amalgamated%20OT%2BNT/';
    
    // Process files one at a time to avoid memory issues
    const allParts: Array<{ url: string; testament: 'NT' | 'OT' }> = [
      { url: 'TAGNT%20Mat-Jhn%20-%20Translators%20Amalgamated%20Greek%20NT%20-%20STEPBible.org%20CC-BY.txt', testament: 'NT' },
      { url: 'TAGNT%20Act-Rev%20-%20Translators%20Amalgamated%20Greek%20NT%20-%20STEPBible.org%20CC-BY.txt', testament: 'NT' },
      { url: 'TAHOT%20Gen-Deu%20-%20Translators%20Amalgamated%20Hebrew%20OT%20-%20STEPBible.org%20CC%20BY.txt', testament: 'OT' },
      { url: 'TAHOT%20Jos-Est%20-%20Translators%20Amalgamated%20Hebrew%20OT%20-%20STEPBible.org%20CC%20BY.txt', testament: 'OT' },
      { url: 'TAHOT%20Job-Sng%20-%20Translators%20Amalgamated%20Hebrew%20OT%20-%20STEPBible.org%20CC%20BY.txt', testament: 'OT' },
      { url: 'TAHOT%20Isa-Mal%20-%20Translators%20Amalgamated%20Hebrew%20OT%20-%20STEPBible.org%20CC%20BY.txt', testament: 'OT' }
    ];

    let totalImported = 0;
    let totalErrors = 0;
    let totalProcessed = 0;
    let totalSkipped = 0;

    // Parse function for TSV data - processes and imports immediately
    const parseAndImportFile = async (text: string, testament: 'OT' | 'NT', fileName: string) => {
      const lines = text.split('\n');
      console.log(`Processing ${lines.length} lines from ${fileName}`);
      
      let fileProcessed = 0;
      let fileSkipped = 0;
      let batchVerses: any[] = [];
      const batchSize = 50;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (!line.trim() || line.startsWith('#') || line.startsWith('$')) {
          continue;
        }

        const fields = line.split('\t');
        if (fields.length < 2) {
          fileSkipped++;
          continue;
        }

        const ref = fields[0];
        let strongs = '';
        let orig = fields[1] || '';
        
        for (let fieldIdx = 4; fieldIdx <= Math.min(6, fields.length - 1); fieldIdx++) {
          if (fields[fieldIdx] && fields[fieldIdx].match(/[HG]\d+/)) {
            strongs = fields[fieldIdx];
            break;
          }
        }

        if (!ref || !strongs || strongs === '–' || strongs === '-') {
          fileSkipped++;
          continue;
        }

        const refParts = ref.split('.');
        if (refParts.length < 3) {
          fileSkipped++;
          continue;
        }

        const book = refParts[0];
        const chapter = refParts[1];
        const verse = refParts[2];
        
        const strongsNumbers = strongs
          .split(/[\s,]+/)
          .map(s => s.trim())
          .filter(s => s && s !== '–' && s !== '-' && s.match(/[HG]\d+/));
        
        if (strongsNumbers.length === 0) {
          fileSkipped++;
          continue;
        }

        const words: StrongsWord[] = strongsNumbers.map((strongsNum, idx) => ({
          strongs_number: strongsNum,
          word: orig || '',
          position: idx + 1
        }));

        batchVerses.push({
          book,
          chapter: parseInt(chapter),
          verse: parseInt(verse),
          testament,
          words
        });

        fileProcessed++;
        
        // Import batch when it reaches batch size
        if (batchVerses.length >= batchSize) {
          const { imported, errors } = await importBatch(batchVerses, supabase);
          totalImported += imported;
          totalErrors += errors;
          batchVerses = []; // Clear batch
        }
        
        if (fileProcessed % 500 === 0) {
          console.log(`Processed ${fileProcessed} verses from ${fileName}...`);
        }
      }
      
      // Import remaining verses
      if (batchVerses.length > 0) {
        const { imported, errors } = await importBatch(batchVerses, supabase);
        totalImported += imported;
        totalErrors += errors;
      }
      
      console.log(`Completed ${fileName}: ${fileProcessed} verses`);
      totalProcessed += fileProcessed;
      totalSkipped += fileSkipped;
    };

    // Import batch helper
    const importBatch = async (verses: any[], supabase: any) => {
      let imported = 0;
      let errors = 0;
      
      for (const verseData of verses) {
        try {
          await supabase
            .from('verses_strongs')
            .delete()
            .eq('book', verseData.book)
            .eq('chapter', verseData.chapter)
            .eq('verse', verseData.verse);

          if (verseData.words.length > 0) {
            const { error: insertError } = await supabase
              .from('verses_strongs')
              .insert(
                verseData.words.map((word: StrongsWord) => ({
                  book: verseData.book,
                  chapter: verseData.chapter,
                  verse: verseData.verse,
                  strongs_number: word.strongs_number,
                  word_text: word.word,
                  word_position: word.position,
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
          console.error('Error processing verse:', err);
          errors++;
        }
      }
      
      return { imported, errors };
    };

    // Process each file one at a time
    for (const part of allParts) {
      console.log(`Downloading and processing ${part.url}...`);
      
      try {
        const response = await fetch(baseUrl + part.url);
        if (!response.ok) {
          console.error(`Failed to download ${part.url}:`, response.status);
          continue;
        }
        
        const text = await response.text();
        console.log(`Downloaded ${part.url}: ${text.length} chars`);
        
        await parseAndImportFile(text, part.testament, part.url);
      } catch (err) {
        console.error(`Error processing ${part.url}:`, err);
      }
    }


    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          total_verses: totalProcessed,
          imported: totalImported,
          errors: totalErrors,
          skipped_lines: totalSkipped
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
