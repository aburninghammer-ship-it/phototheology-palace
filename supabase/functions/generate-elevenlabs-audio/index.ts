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
    
    if (!text || !book || chapter === undefined || chapter === null || verse === undefined || verse === null) {
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

    // Generate audio with ElevenLabs using higher quality model
    // Handle ElevenLabs 10k character limit by splitting long text into chunks
    const MAX_CHARS = 9500;
    const textStr = String(text);
    const chunks: string[] = [];

    if (textStr.length <= MAX_CHARS) {
      chunks.push(textStr);
    } else {
      let remaining = textStr;
      while (remaining.length > 0) {
        if (remaining.length <= MAX_CHARS) {
          chunks.push(remaining);
          break;
        }

        // Try to split on a sentence boundary or space near the limit
        let splitIndex = remaining.lastIndexOf('.', MAX_CHARS);
        if (splitIndex === -1) {
          splitIndex = remaining.lastIndexOf('!', MAX_CHARS);
        }
        if (splitIndex === -1) {
          splitIndex = remaining.lastIndexOf('?', MAX_CHARS);
        }
        if (splitIndex === -1) {
          splitIndex = remaining.lastIndexOf(' ', MAX_CHARS);
        }
        if (splitIndex === -1 || splitIndex < MAX_CHARS * 0.6) {
          splitIndex = MAX_CHARS;
        }

        const chunk = remaining.slice(0, splitIndex + 1).trim();
        if (chunk.length > 0) {
          chunks.push(chunk);
        }
        remaining = remaining.slice(splitIndex + 1).trim();
      }

      console.log(
        `Text length ${textStr.length} split into ${chunks.length} ElevenLabs chunks`
      );
    }

    const audioChunks: Uint8Array[] = [];

    for (const [index, chunk] of chunks.entries()) {
      console.log(`Requesting ElevenLabs audio chunk ${index + 1}/${chunks.length}`);
      const response = await fetch(
        'https://api.elevenlabs.io/v1/text-to-speech/onwK4e9ZLuTAKqWW03F9',
        {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: chunk,
            model_id: 'eleven_multilingual_v2', // Higher quality model for natural voice
            voice_settings: {
              stability: 0.71,
              similarity_boost: 0.85,
              style: 0.35,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', response.status, errorText);
        
        // Handle quota exceeded specifically
        if (response.status === 401) {
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.detail?.status === 'quota_exceeded') {
              throw new Error('ELEVENLABS_QUOTA_EXCEEDED');
            }
          } catch (e) {
            // If parsing fails, continue with generic error
          }
        }
        
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      audioChunks.push(new Uint8Array(audioBuffer));
    }

    // Concatenate all audio chunks into a single Uint8Array
    const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const audioData = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of audioChunks) {
      audioData.set(chunk, offset);
      offset += chunk.length;
    }

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
