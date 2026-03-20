import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// OpenAI TTS voice options
const OPENAI_VOICES = ['alloy', 'ash', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer'];

// Backward-compatible aliases (deprecated voice names and legacy provider voice mappings)
const VOICE_ALIASES: Record<string, string> = {
  ballad: 'sage',
  verse: 'fable',
  // Map old ElevenLabs voice names to OpenAI equivalents
  'george': 'onyx',
  'roger': 'onyx',
  'daniel': 'echo',
  'brian': 'echo',
  'sarah': 'nova',
  'alice': 'shimmer',
  'aria': 'nova',
  'charlie': 'echo',
  'callum': 'onyx',
  'river': 'shimmer',
  'liam': 'echo',
  'charlotte': 'nova',
  'matilda': 'shimmer',
  'will': 'onyx',
  'jessica': 'nova',
  'eric': 'echo',
  'chris': 'onyx',
  'lily': 'nova',
  'bill': 'onyx',
  // Speechify voice mappings
  'henry': 'onyx',
  'mrbeast': 'echo',
  'cliff': 'onyx',
  'cody': 'echo',
  'kristy': 'nova',
  'natasha': 'shimmer',
  'cindy': 'nova',
};

const MAX_CHARS = 4096;
const DEFAULT_VOICE = 'onyx';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function normalizeBookName(book: string): string {
  return book.toLowerCase().replace(/\s+/g, '-');
}

function getStoragePath(book: string, chapter: number, verse: number, voiceId: string): string {
  return `openai/${voiceId}/${normalizeBookName(book)}/${chapter}/${verse}.mp3`;
}

async function checkCache(
  supabase: any,
  book: string,
  chapter: number,
  verse: number,
  voiceId: string
): Promise<{ found: boolean; url?: string }> {
  try {
    const { data, error } = await supabase
      .from('bible_audio_cache')
      .select('storage_path')
      .eq('book', book)
      .eq('chapter', chapter)
      .eq('verse', verse)
      .eq('voice_id', `openai:${voiceId}`)
      .single();

    if (error || !data) {
      return { found: false };
    }

    const { data: urlData } = supabase.storage
      .from('bible-audio')
      .getPublicUrl(data.storage_path);

    return { found: true, url: urlData.publicUrl };
  } catch {
    return { found: false };
  }
}

async function storeInCache(
  supabase: any,
  book: string,
  chapter: number,
  verse: number,
  voiceId: string,
  audioBuffer: ArrayBuffer
): Promise<string | null> {
  try {
    const storagePath = getStoragePath(book, chapter, verse, voiceId);

    const { error: uploadError } = await supabase.storage
      .from('bible-audio')
      .upload(storagePath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('[Cache] Storage upload error:', uploadError);
      return null;
    }

    const { error: dbError } = await supabase
      .from('bible_audio_cache')
      .upsert({
        book,
        chapter,
        verse,
        voice_id: `openai:${voiceId}`,
        storage_path: storagePath,
        file_size_bytes: audioBuffer.byteLength,
      }, {
        onConflict: 'book,chapter,verse,voice_id'
      });

    if (dbError) {
      console.error('[Cache] DB error:', dbError);
    }

    const { data: urlData } = supabase.storage
      .from('bible-audio')
      .getPublicUrl(storagePath);

    console.log(`[Cache] Stored: ${storagePath}`);
    return urlData.publicUrl;
  } catch (err) {
    console.error('[Cache] Store error:', err);
    return null;
  }
}

function splitTextIntoChunks(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) {
    return [text];
  }

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      chunks.push(remaining);
      break;
    }

    let breakPoint = maxChars;
    const searchText = remaining.substring(0, maxChars);
    const sentenceEndings = ['. ', '! ', '? ', '.\n', '!\n', '?\n'];
    let lastSentenceEnd = -1;

    for (const ending of sentenceEndings) {
      const idx = searchText.lastIndexOf(ending);
      if (idx > lastSentenceEnd) {
        lastSentenceEnd = idx + 1;
      }
    }

    if (lastSentenceEnd > maxChars * 0.5) {
      breakPoint = lastSentenceEnd;
    } else {
      const paragraphBreak = searchText.lastIndexOf('\n\n');
      if (paragraphBreak > maxChars * 0.3) {
        breakPoint = paragraphBreak + 1;
      } else {
        const newlineBreak = searchText.lastIndexOf('\n');
        if (newlineBreak > maxChars * 0.3) {
          breakPoint = newlineBreak + 1;
        }
      }
    }

    chunks.push(remaining.substring(0, breakPoint).trim());
    remaining = remaining.substring(breakPoint).trim();
  }

  return chunks.filter(chunk => chunk.length > 0);
}

// OpenAI TTS - the only provider now
async function generateOpenAI(
  text: string,
  voice: string,
  speed: number,
  apiKey: string
): Promise<ArrayBuffer> {
  const voiceKey = (voice || '').toLowerCase();
  const aliased = VOICE_ALIASES[voiceKey] ?? voiceKey;
  const selectedVoice = OPENAI_VOICES.includes(aliased) ? aliased : DEFAULT_VOICE;

  console.log(`[TTS] Using OpenAI voice: ${selectedVoice} (requested: ${voice})`);

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: selectedVoice,
      speed: Math.max(0.25, Math.min(4.0, speed)),
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[TTS] OpenAI API error: ${response.status} - ${errorText}`);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  return response.arrayBuffer();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      text,
      voice = DEFAULT_VOICE,
      speed = 1.0,
      book,
      chapter,
      verse,
      useCache = true,
      provider, // Ignored - always use OpenAI now
      returnType = 'url' as 'base64' | 'url'
    } = await req.json();

    if (!text) {
      throw new Error("Text is required");
    }

    // Normalize voice (handles deprecated voices and legacy provider voice names)
    const voiceKey = (voice || '').toLowerCase();
    const aliased = VOICE_ALIASES[voiceKey] ?? voiceKey;
    const finalVoice = OPENAI_VOICES.includes(aliased) ? aliased : DEFAULT_VOICE;

    console.log(`[TTS] Voice: ${voice} -> ${finalVoice}, Text length: ${text.length}`);

    // Get OpenAI API key
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    // Initialize Supabase client for caching
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check cache if verse info provided
    if (useCache && book && chapter !== undefined && verse !== undefined) {
      console.log(`[TTS] Checking cache: ${book} ${chapter}:${verse} (openai:${finalVoice})`);

      const cacheResult = await checkCache(supabase, book, chapter, verse, finalVoice);

      if (cacheResult.found && cacheResult.url) {
        console.log(`[TTS] CACHE HIT - ${book} ${chapter}:${verse}`);
        return new Response(
          JSON.stringify({
            audioUrl: cacheResult.url,
            cached: true,
            contentType: 'audio/mpeg'
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`[TTS] CACHE MISS - generating audio with OpenAI`);
    }

    // For non-verse requests with URL return type, check hash-based cache first
    if (returnType === 'url' && (!book || chapter === undefined || verse === undefined)) {
      const stableKey = await sha256Hex(JSON.stringify({
        voice: finalVoice,
        speed: Math.round(speed * 100) / 100,
        text: text.trim(),
      }));
      const storagePath = `tts/openai/${finalVoice}/${stableKey}.mp3`;

      // Check if this audio already exists in storage
      const { data: existsData } = await supabase.storage
        .from('bible-audio')
        .list(`tts/openai/${finalVoice}`, {
          search: `${stableKey}.mp3`,
          limit: 1
        });

      if (existsData && existsData.length > 0) {
        const { data: urlData } = supabase.storage
          .from('bible-audio')
          .getPublicUrl(storagePath);

        console.log(`[TTS] HASH CACHE HIT - returning cached audio`);
        return new Response(
          JSON.stringify({
            audioUrl: urlData.publicUrl,
            cached: true,
            contentType: 'audio/mpeg'
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log(`[TTS] HASH CACHE MISS - generating audio`);
    }

    // Split text and generate
    const chunks = splitTextIntoChunks(text, MAX_CHARS);
    console.log(`[TTS] Split into ${chunks.length} chunks`);

    const audioBuffers: ArrayBuffer[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`[TTS] Processing chunk ${i + 1}/${chunks.length} (${chunk.length} chars)`);

      const buffer = await generateOpenAI(chunk, finalVoice, speed, apiKey);
      audioBuffers.push(buffer);

      if (i < chunks.length - 1) {
        await delay(50);
      }
    }

    // Combine audio buffers
    const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const buffer of audioBuffers) {
      combined.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    }

    console.log(`[TTS] Generated ${totalLength} bytes with OpenAI`);

    // For cache-enabled requests, return audio immediately and cache in background
    if (useCache && book && chapter !== undefined && verse !== undefined) {
      const storagePath = getStoragePath(book, chapter, verse, finalVoice);

      // Start caching in background (fire and forget)
      const cachePromise = storeInCache(supabase, book, chapter, verse, finalVoice, combined.buffer);
      cachePromise.catch(e => console.error('[TTS] Background cache failed:', e));

      // Return URL immediately
      const { data: urlData } = supabase.storage
        .from('bible-audio')
        .getPublicUrl(storagePath);

      // Also return base64 for immediate playback while cache uploads
      const base64Audio = base64Encode(combined.buffer);

      return new Response(
        JSON.stringify({
          audioUrl: urlData.publicUrl,
          audioContent: base64Audio,
          cached: false,
          justCached: true,
          contentType: 'audio/mpeg'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For URL response type, upload to storage and return URL
    if (returnType === 'url') {
      try {
        const stableKey = await sha256Hex(JSON.stringify({
          voice: finalVoice,
          speed: Math.round(speed * 100) / 100,
          text: text.trim(),
        }));

        const storagePath = `tts/openai/${finalVoice}/${stableKey}.mp3`;

        const { error: uploadError } = await supabase.storage
          .from('bible-audio')
          .upload(storagePath, combined.buffer, {
            contentType: 'audio/mpeg',
            upsert: true
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('bible-audio')
            .getPublicUrl(storagePath);

          return new Response(
            JSON.stringify({
              audioUrl: urlData.publicUrl,
              cached: false,
              contentType: 'audio/mpeg'
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch (urlErr) {
        console.error('[TTS] URL return type failed, falling back to base64:', urlErr);
      }
    }

    // Return base64 (fallback)
    const base64Audio = base64Encode(combined.buffer);

    return new Response(
      JSON.stringify({
        audioContent: base64Audio,
        cached: false,
        contentType: 'audio/mpeg'
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("[TTS] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
