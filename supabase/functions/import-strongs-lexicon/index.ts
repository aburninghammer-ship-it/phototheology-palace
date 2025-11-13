import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StrongsEntry {
  strongs_number: string;
  word: string;
  transliteration: string;
  language: 'Hebrew' | 'Greek';
  definition: string;
  gloss?: string;
  morph?: string;
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

    const { hebrewContent, greekContent } = await req.json();

    let hebrewImported = 0;
    let greekImported = 0;
    let errors: string[] = [];

    // Parse and import Hebrew lexicon
    if (hebrewContent) {
      console.log('Parsing Hebrew lexicon...');
      const hebrewLines = hebrewContent.split('\n');
      
      // Find header line
      let dataStartLine = 0;
      for (let i = 0; i < hebrewLines.length; i++) {
        if (hebrewLines[i].startsWith('eStrong#')) {
          dataStartLine = i + 2; // Skip header and empty line
          break;
        }
      }

      for (let i = dataStartLine; i < hebrewLines.length; i++) {
        const line = hebrewLines[i].trim();
        if (!line || line.startsWith('$=')) continue;

        const parts = line.split('\t');
        if (parts.length < 8) continue;

        const strongsNum = parts[0].trim();
        if (!strongsNum.match(/^H\d+/)) continue;

        try {
          const entry: StrongsEntry = {
            strongs_number: strongsNum,
            word: parts[3].trim(),
            transliteration: parts[4].trim(),
            morph: parts[5].trim(),
            gloss: parts[6].trim(),
            language: 'Hebrew',
            definition: parts[7].trim().replace(/<br>/gi, '\n').replace(/<[^>]*>/g, '')
          };

          const dbEntry = {
            strongs_number: entry.strongs_number,
            word: entry.word,
            transliteration: entry.transliteration,
            language: entry.language,
            definition: entry.definition,
            kjv_translation: entry.gloss || '',
            pt_notes: entry.morph || null
          };

          const { error } = await supabaseClient
            .from('strongs_dictionary')
            .upsert(dbEntry, {
              onConflict: 'strongs_number',
              ignoreDuplicates: false
            });

          if (error) {
            errors.push(`${strongsNum}: ${error.message}`);
          } else {
            hebrewImported++;
          }
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          errors.push(`${strongsNum}: ${errorMsg}`);
        }

        // Log progress every 100 entries
        if (hebrewImported % 100 === 0) {
          console.log(`Hebrew: ${hebrewImported} imported...`);
        }
      }
    }

    // Parse and import Greek lexicon
    if (greekContent) {
      console.log('Parsing Greek lexicon...');
      const greekLines = greekContent.split('\n');
      
      // Find header line
      let dataStartLine = 0;
      for (let i = 0; i < greekLines.length; i++) {
        if (greekLines[i].startsWith('eStrong')) {
          dataStartLine = i + 2; // Skip header and separator
          break;
        }
      }

      for (let i = dataStartLine; i < greekLines.length; i++) {
        const line = greekLines[i].trim();
        if (!line || line.startsWith('$=')) continue;

        const parts = line.split('\t');
        if (parts.length < 8) continue;

        const strongsNum = parts[0].trim();
        if (!strongsNum.match(/^G\d+/)) continue;

        try {
          const entry: StrongsEntry = {
            strongs_number: strongsNum,
            word: parts[3].trim(),
            transliteration: parts[4].trim(),
            morph: parts[5].trim(),
            gloss: parts[6].trim(),
            language: 'Greek',
            definition: parts[7].trim().replace(/<br>/gi, '\n').replace(/<[^>]*>/g, '')
          };

          const dbEntry = {
            strongs_number: entry.strongs_number,
            word: entry.word,
            transliteration: entry.transliteration,
            language: entry.language,
            definition: entry.definition,
            kjv_translation: entry.gloss || '',
            pt_notes: entry.morph || null
          };

          const { error } = await supabaseClient
            .from('strongs_dictionary')
            .upsert(dbEntry, {
              onConflict: 'strongs_number',
              ignoreDuplicates: false
            });

          if (error) {
            errors.push(`${strongsNum}: ${error.message}`);
          } else {
            greekImported++;
          }
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          errors.push(`${strongsNum}: ${errorMsg}`);
        }

        // Log progress every 100 entries
        if (greekImported % 100 === 0) {
          console.log(`Greek: ${greekImported} imported...`);
        }
      }
    }

    const result = {
      success: true,
      statistics: {
        hebrewImported,
        greekImported,
        totalImported: hebrewImported + greekImported,
        errors: errors.slice(0, 50),
        errorCount: errors.length
      }
    };

    console.log('Import complete:', result.statistics);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in import-strongs-lexicon:', error);
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
