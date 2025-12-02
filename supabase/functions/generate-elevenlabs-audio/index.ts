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
    const { text, book, chapter, verse } = await req.json();
    
    if (!text || !book || !chapter || !verse) {
      throw new Error('text, book, chapter, and verse are required');
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if audio already exists in cache
    const cacheKey = `${book}_${chapter}_${verse}`;
    const { data: existing } = await supabase
      .from('bible_audio_cache')
      .select('storage_path')
      .eq('book', book)
      .eq('chapter', chapter)
      .eq('verse', verse)
      .eq('voice_id', 'daniel')
      .maybeSingle();

    if (existing?.storage_path) {
      console.log(`Audio already cached: ${cacheKey}`);
      return new Response(
        JSON.stringify({ storage_path: existing.storage_path, cached: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating ElevenLabs audio for: ${cacheKey}`);

    // Generate audio with ElevenLabs Turbo (cost-efficient)
    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/onwK4e9ZLuTAKqWW03F9',
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2', // Cost-efficient model
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const audioData = new Uint8Array(audioBuffer);

    // Upload to Supabase storage
    const fileName = `commentary/${book}/${chapter}/${verse}_daniel.mp3`;
    const { error: uploadError } = await supabase.storage
      .from('bible-audio')
      .upload(fileName, audioData, {
        contentType: 'audio/mpeg',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Cache metadata
    const { error: cacheError } = await supabase
      .from('bible_audio_cache')
      .insert({
        book,
        chapter,
        verse,
        storage_path: fileName,
        voice_id: 'daniel',
        duration_ms: null,
        file_size_bytes: audioData.length,
      });

    if (cacheError) {
      console.error('Cache insert error:', cacheError);
    }

    console.log(`Audio generated and cached: ${cacheKey}`);

    return new Response(
      JSON.stringify({ storage_path: fileName, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-elevenlabs-audio:', error);
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
