import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── ElevenLabs voice IDs (primary provider) ──────────────────────────
const ELEVENLABS_VOICES: Record<string, string> = {
  epic:      "fjnwTZkKtQOJaYzGLa6n", // William
  urban:     "cgSgspJ2msm6clMCkdW9", // Jessica
  ancient:   "onwK4e9ZLuTAKqWW03F9", // Daniel
  preacher:  "iP95p4xoKVk53GoZ742B", // Chris
  scholar:   "ErXwobaYiN019PkySvjV", // Antoni
  counselor: "XrExE9yKIg1WjnnlVkGX", // Matilda (warm, female)
  kids:      "pFZP5JQG7iQjIQuC4Bku", // Lily
  mirror:    "SAz9YHcvj6GT2YYXdXww", // River
  // Legacy name mappings to ElevenLabs IDs
  george:    "JBFqnCBsd6RMkjVDRZzb",
  roger:     "CwhRBWXzGAHq8TQ4Fs17",
  daniel:    "onwK4e9ZLuTAKqWW03F9",
  brian:     "nPczCjzI2devNBz1zQrb",
  sarah:     "EXAVITQu4vr4xnSDxMaL",
  alice:     "Xb7hH8MSUJpSbSDYk0k2",
  charlie:   "IKne3meq5aSn9XLyUdCD",
  callum:    "N2lVS1w4EtoT3dr4eOWO",
  river:     "SAz9YHcvj6GT2YYXdXww",
  liam:      "TX3LPaxmHKxFdv7VOQHJ",
  matilda:   "XrExE9yKIg1WjnnlVkGX",
  will:      "bIHbv24MWmeRgasZH58o",
  jessica:   "cgSgspJ2msm6clMCkdW9",
  eric:      "cjVigY5qzO86Huf0OWal",
  chris:     "iP95p4xoKVk53GoZ742B",
  lily:      "pFZP5JQG7iQjIQuC4Bku",
  bill:      "pqHfZKP75CvOlQylNhV4",
};

// ── OpenAI fallback voices (diverse, per persona) ────────────────────
const OPENAI_FALLBACK_VOICES: Record<string, string> = {
  epic:      "onyx",    // Deep, authoritative
  urban:     "nova",    // Warm, expressive
  ancient:   "fable",   // Measured, narrative
  preacher:  "echo",    // Clear, bold
  scholar:   "ash",     // Calm, analytical
  counselor: "shimmer", // Warm, gentle
  kids:      "coral",   // Bright, friendly
  mirror:    "shimmer", // Warm, reflective
  // Legacy name mappings
  george:    "onyx",
  roger:     "onyx",
  daniel:    "echo",
  brian:     "echo",
  sarah:     "nova",
  alice:     "shimmer",
  charlie:   "echo",
  callum:    "ash",
  river:     "shimmer",
  liam:      "echo",
  matilda:   "shimmer",
  will:      "fable",
  jessica:   "nova",
  eric:      "echo",
  chris:     "onyx",
  lily:      "coral",
  bill:      "ash",
  henry:     "onyx",
  mrbeast:   "echo",
  cliff:     "fable",
  cody:      "echo",
  kristy:    "nova",
  natasha:   "shimmer",
  cindy:     "coral",
  ballad:    "sage",
  verse:     "fable",
};

const OPENAI_VOICES = ['alloy', 'ash', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer'];

const MAX_CHARS = 4096;
const DEFAULT_VOICE = 'echo'; // More neutral default than onyx

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

function getStoragePath(book: string, chapter: number, verse: number, provider: string, voiceId: string): string {
  return `${provider}/${voiceId}/${normalizeBookName(book)}/${chapter}/${verse}.mp3`;
}

async function checkCache(
  supabase: any,
  book: string,
  chapter: number,
  verse: number,
  voiceTag: string
): Promise<{ found: boolean; url?: string }> {
  try {
    const { data, error } = await supabase
      .from('bible_audio_cache')
      .select('storage_path')
      .eq('book', book)
      .eq('chapter', chapter)
      .eq('verse', verse)
      .eq('voice_id', voiceTag)
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
  voiceTag: string,
  storagePath: string,
  audioBuffer: ArrayBuffer
): Promise<string | null> {
  try {
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
        voice_id: voiceTag,
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

// ── ElevenLabs TTS ───────────────────────────────────────────────────
async function generateElevenLabs(
  text: string,
  voiceId: string,
  apiKey: string,
  speed: number = 1.0
): Promise<ArrayBuffer> {
  console.log(`[TTS] ElevenLabs generating with voice ${voiceId}`);
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true,
          speed: Math.max(0.7, Math.min(1.2, speed)),
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs TTS error: ${response.status} - ${err}`);
  }

  return response.arrayBuffer();
}

// ── OpenAI TTS (fallback) ────────────────────────────────────────────
async function generateOpenAI(
  text: string,
  voice: string,
  speed: number,
  apiKey: string
): Promise<ArrayBuffer> {
  console.log(`[TTS] OpenAI fallback using voice "${voice}"`);
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice,
      speed: Math.max(0.25, Math.min(4.0, speed)),
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI TTS error: ${response.status} - ${errorText}`);
  }

  return response.arrayBuffer();
}

// ── Resolve voice to provider + ID ───────────────────────────────────
function resolveVoice(requestedVoice: string, elevenLabsAvailable: boolean): {
  provider: 'elevenlabs' | 'openai';
  voiceId: string;
  voiceTag: string; // for cache key
} {
  const key = (requestedVoice || '').toLowerCase();

  // If it looks like a raw ElevenLabs voice ID (20+ char alphanumeric)
  if (/^[a-zA-Z0-9]{20,}$/.test(requestedVoice) && elevenLabsAvailable) {
    return { provider: 'elevenlabs', voiceId: requestedVoice, voiceTag: `elevenlabs:${requestedVoice}` };
  }

  // Check if it's already an OpenAI voice name
  if (OPENAI_VOICES.includes(key)) {
    // Even if they asked for an OpenAI voice, try ElevenLabs if available
    // Unless they specifically asked for OpenAI-only
    return { provider: 'openai', voiceId: key, voiceTag: `openai:${key}` };
  }

  // Named voice — try ElevenLabs first
  if (elevenLabsAvailable && ELEVENLABS_VOICES[key]) {
    return { provider: 'elevenlabs', voiceId: ELEVENLABS_VOICES[key], voiceTag: `elevenlabs:${ELEVENLABS_VOICES[key]}` };
  }

  // Fallback to OpenAI with diverse voice
  const openaiVoice = OPENAI_FALLBACK_VOICES[key] || DEFAULT_VOICE;
  return { provider: 'openai', voiceId: openaiVoice, voiceTag: `openai:${openaiVoice}` };
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
      provider: _provider, // legacy param, ignored — auto-detected
      returnType = 'url' as 'base64' | 'url'
    } = await req.json();

    if (!text) {
      throw new Error("Text is required");
    }

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!ELEVENLABS_API_KEY && !OPENAI_API_KEY) {
      throw new Error("No TTS API keys configured");
    }

    const resolved = resolveVoice(voice, !!ELEVENLABS_API_KEY);
    console.log(`[TTS] Voice: "${voice}" -> provider=${resolved.provider}, id=${resolved.voiceId}, tag=${resolved.voiceTag}, text=${text.length} chars`);

    // Initialize Supabase client for caching
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check cache if verse info provided
    if (useCache && book && chapter !== undefined && verse !== undefined) {
      console.log(`[TTS] Checking cache: ${book} ${chapter}:${verse} (${resolved.voiceTag})`);
      const cacheResult = await checkCache(supabase, book, chapter, verse, resolved.voiceTag);

      if (cacheResult.found && cacheResult.url) {
        console.log(`[TTS] CACHE HIT - ${book} ${chapter}:${verse}`);
        return new Response(
          JSON.stringify({ audioUrl: cacheResult.url, cached: true, contentType: 'audio/mpeg' }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log(`[TTS] CACHE MISS - generating audio`);
    }

    // For non-verse requests with URL return type, check hash-based cache
    if (returnType === 'url' && (!book || chapter === undefined || verse === undefined)) {
      const stableKey = await sha256Hex(JSON.stringify({
        voiceTag: resolved.voiceTag,
        speed: Math.round(speed * 100) / 100,
        text: text.trim(),
      }));
      const storagePath = `tts/${resolved.provider}/${resolved.voiceId}/${stableKey}.mp3`;

      const { data: existsData } = await supabase.storage
        .from('bible-audio')
        .list(`tts/${resolved.provider}/${resolved.voiceId}`, {
          search: `${stableKey}.mp3`,
          limit: 1
        });

      if (existsData && existsData.length > 0) {
        const { data: urlData } = supabase.storage
          .from('bible-audio')
          .getPublicUrl(storagePath);

        console.log(`[TTS] HASH CACHE HIT - returning cached audio`);
        return new Response(
          JSON.stringify({ audioUrl: urlData.publicUrl, cached: true, contentType: 'audio/mpeg' }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log(`[TTS] HASH CACHE MISS - generating audio`);
    }

    // ── Generate audio ─────────────────────────────────────────────
    const chunks = splitTextIntoChunks(text, MAX_CHARS);
    console.log(`[TTS] Split into ${chunks.length} chunks, provider=${resolved.provider}`);

    const BATCH_SIZE = 4;
    const audioBuffers: ArrayBuffer[] = new Array(chunks.length);

    // Try primary provider, fall back if it fails
    let actualProvider = resolved.provider;

    for (let batchStart = 0; batchStart < chunks.length; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE, chunks.length);
      const batchPromises = [];

      for (let i = batchStart; i < batchEnd; i++) {
        const generateChunk = async () => {
          try {
            if (actualProvider === 'elevenlabs' && ELEVENLABS_API_KEY) {
              audioBuffers[i] = await generateElevenLabs(chunks[i], resolved.voiceId, ELEVENLABS_API_KEY, speed);
            } else if (OPENAI_API_KEY) {
              const openaiVoice = resolved.provider === 'openai'
                ? resolved.voiceId
                : (OPENAI_FALLBACK_VOICES[(voice || '').toLowerCase()] || DEFAULT_VOICE);
              audioBuffers[i] = await generateOpenAI(chunks[i], openaiVoice, speed, OPENAI_API_KEY);
            } else {
              throw new Error("No TTS provider available");
            }
          } catch (err) {
            // If ElevenLabs fails, fall back to OpenAI for this and remaining chunks
            if (actualProvider === 'elevenlabs' && OPENAI_API_KEY) {
              console.warn(`[TTS] ElevenLabs failed, falling back to OpenAI: ${err}`);
              actualProvider = 'openai';
              const openaiVoice = OPENAI_FALLBACK_VOICES[(voice || '').toLowerCase()] || DEFAULT_VOICE;
              audioBuffers[i] = await generateOpenAI(chunks[i], openaiVoice, speed, OPENAI_API_KEY);
            } else {
              throw err;
            }
          }
        };
        batchPromises.push(generateChunk());
      }
      await Promise.all(batchPromises);
    }

    // Combine audio buffers
    const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const buffer of audioBuffers) {
      combined.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    }

    console.log(`[TTS] Generated ${totalLength} bytes via ${actualProvider}`);

    // Update voice tag if we fell back
    const finalVoiceTag = actualProvider === resolved.provider
      ? resolved.voiceTag
      : `openai:${OPENAI_FALLBACK_VOICES[(voice || '').toLowerCase()] || DEFAULT_VOICE}`;

    // For cache-enabled requests, return audio immediately and cache in background
    if (useCache && book && chapter !== undefined && verse !== undefined) {
      const storagePath = getStoragePath(book, chapter, verse, actualProvider, resolved.voiceId);

      const cachePromise = storeInCache(supabase, book, chapter, verse, finalVoiceTag, storagePath, combined.buffer);
      cachePromise.catch(e => console.error('[TTS] Background cache failed:', e));

      const { data: urlData } = supabase.storage
        .from('bible-audio')
        .getPublicUrl(storagePath);

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
          voiceTag: finalVoiceTag,
          speed: Math.round(speed * 100) / 100,
          text: text.trim(),
        }));

        const storagePath = `tts/${actualProvider}/${resolved.voiceId}/${stableKey}.mp3`;

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
            JSON.stringify({ audioUrl: urlData.publicUrl, cached: false, contentType: 'audio/mpeg' }),
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
      JSON.stringify({ audioContent: base64Audio, cached: false, contentType: 'audio/mpeg' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("[TTS] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
