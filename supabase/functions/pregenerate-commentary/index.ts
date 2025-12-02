import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { verses, depth = 'intermediate' } = await req.json();
    
    if (!verses || !Array.isArray(verses)) {
      throw new Error('verses array is required');
    }

    console.log(`Pre-generating commentary for ${verses.length} verses at depth: ${depth}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results = [];

    for (const verse of verses) {
      const { book, chapter, verse: verseNum, text } = verse;
      
      // Check if already cached
      const { data: existing } = await supabase
        .from('verse_commentary_cache')
        .select('id')
        .eq('book', book)
        .eq('chapter', chapter)
        .eq('verse', verseNum)
        .eq('depth', depth)
        .maybeSingle();

      if (existing) {
        console.log(`Already cached: ${book} ${chapter}:${verseNum}`);
        results.push({ verse: `${book} ${chapter}:${verseNum}`, status: 'already_cached' });
        continue;
      }

      // Generate commentary
      try {
        const commentaryResponse = await fetch(`${supabaseUrl}/functions/v1/generate-verse-commentary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            book,
            chapter,
            verse: verseNum,
            verseText: text,
            depth,
          }),
        });

        if (!commentaryResponse.ok) {
          throw new Error(`Commentary generation failed: ${commentaryResponse.statusText}`);
        }

        const { commentary } = await commentaryResponse.json();

        // Cache the commentary
        const { error: insertError } = await supabase
          .from('verse_commentary_cache')
          .insert({
            book,
            chapter,
            verse: verseNum,
            commentary_text: commentary,
            depth,
          });

        if (insertError) throw insertError;

        console.log(`Generated and cached commentary: ${book} ${chapter}:${verseNum}`);

        // Generate ElevenLabs audio in background (don't await, don't block)
        fetch(`${supabaseUrl}/functions/v1/generate-elevenlabs-audio`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            text: commentary,
            book,
            chapter,
            verse: verseNum,
          }),
        }).catch(err => console.error(`Background audio generation error for ${book} ${chapter}:${verseNum}:`, err));

        results.push({ verse: `${book} ${chapter}:${verseNum}`, status: 'generated' });
      } catch (error) {
        console.error(`Error generating commentary for ${book} ${chapter}:${verseNum}:`, error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        results.push({ verse: `${book} ${chapter}:${verseNum}`, status: 'error', error: errorMsg });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: results.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in pregenerate-commentary:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMsg }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});