import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StrongsCSVEntry {
  strongs_id: string;
  lemma: string;
  language: string;
  part_of_speech: string;
  short_gloss: string;
  long_definition: string;
  sanctuary_link?: string;
  time_zone_code?: string;
  dimension_code?: string;
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

    const { csvContent } = await req.json();

    if (!csvContent) {
      return new Response(JSON.stringify({ error: 'CSV content is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let imported = 0;
    let errors: string[] = [];

    console.log('Parsing CSV content...');
    const lines = csvContent.split('\n');
    
    // Find the header line
    let dataStartLine = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('strongs_id')) {
        dataStartLine = i + 1;
        break;
      }
    }

    // Parse CSV data
    for (let i = dataStartLine; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;

      try {
        // Split by comma, but handle quoted values
        const values: string[] = [];
        let currentValue = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.trim());

        if (values.length < 6) continue;

        const strongsNumber = values[0].trim();
        if (!strongsNumber || (!strongsNumber.startsWith('H') && !strongsNumber.startsWith('G'))) {
          continue;
        }

        // Map CSV columns to database columns
        const entry = {
          strongs_number: strongsNumber,
          word: values[1]?.trim() || '',
          language: values[2]?.trim() === 'Hebrew' ? 'Hebrew' : 'Greek',
          transliteration: values[3]?.trim() || '',
          gloss: values[4]?.trim() || '',
          definition: values[5]?.trim() || '',
          morph: values[3]?.trim() || '', // part_of_speech goes to morph
        };

        const { error } = await supabaseClient
          .from('strongs_dictionary')
          .upsert(entry, {
            onConflict: 'strongs_number',
            ignoreDuplicates: false
          });

        if (error) {
          errors.push(`${strongsNumber}: ${error.message}`);
        } else {
          imported++;
        }
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        errors.push(`Line ${i + 1}: ${errorMsg}`);
      }

      // Log progress every 100 entries
      if (imported % 100 === 0 && imported > 0) {
        console.log(`Imported ${imported} entries...`);
      }
    }

    const result = {
      success: true,
      statistics: {
        imported,
        errors: errors.slice(0, 50),
        errorCount: errors.length
      }
    };

    console.log('CSV import complete:', result.statistics);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in import-strongs-csv:', error);
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
