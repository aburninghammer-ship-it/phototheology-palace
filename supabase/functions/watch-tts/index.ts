import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// George – warm British male ElevenLabs voice (Epic)
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const MODEL_ID = "eleven_multilingual_v2";
const MAX_CHUNK = 4500;
// Bump this version to invalidate ALL cached watch TTS audio
// v12 = 2026-04-07 Longer inter-sentence pauses (2-4 sec between sentences)
const WATCH_CACHE_VERSION = "v12";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function splitAtSentences(text: string, max: number): string[] {
  if (text.length <= max) return [text];
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= max) { chunks.push(remaining); break; }
    const search = remaining.substring(0, max);
    let bp = max;
    for (const end of [". ", "! ", "? ", ".\n", "!\n", "?\n"]) {
      const idx = search.lastIndexOf(end);
      if (idx > max * 0.4 && idx + 1 > bp - max + max * 0.4) bp = Math.max(bp === max ? 0 : bp, idx + 1);
    }
    if (bp === max) {
      const nl = search.lastIndexOf("\n");
      if (nl > max * 0.3) bp = nl + 1;
    }
    chunks.push(remaining.substring(0, bp).trim());
    remaining = remaining.substring(bp).trim();
  }
  return chunks.filter(Boolean);
}

/**
 * Insert [pause] and [long pause] markers as SSML-style silence.
 * ElevenLabs doesn't support SSML, but we can replace markers with
 * ellipsis + newlines to create natural pauses, and also split
 * the text around [long pause] to let us insert actual silence gaps.
 */
function preprocessPauses(text: string): string {
  // Replace [extended silence] with very long pause (used in VR sessions)
  let processed = text.replace(/\[extended silence\]/gi, "\n\n...\n\n...\n\n...\n\n...\n\n...\n\n...\n\n...\n\n");
  // Replace [long pause] with ~6-8 seconds of silence (5x ellipsis blocks)
  processed = processed.replace(/\[long pause\]/gi, "\n\n...\n\n...\n\n...\n\n...\n\n...\n\n");
  // Replace [pause] with ~2-4 seconds of silence (3x ellipsis blocks)
  processed = processed.replace(/\[pause\]/gi, "\n\n...\n\n...\n\n...\n\n");
  return processed;
}

async function generateElevenLabs(
  text: string,
  apiKey: string,
  previousText?: string,
  nextText?: string,
): Promise<ArrayBuffer> {
  const body: Record<string, unknown> = {
    text,
    model_id: MODEL_ID,
    voice_settings: {
      stability: 0.80,
      similarity_boost: 0.75,
      style: 0.10,
      use_speaker_boost: true,
      speed: 0.92, // slightly slower for unhurried meditational pacing
    },
  };
  if (previousText) body.previous_text = previousText;
  if (nextText) body.next_text = nextText;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${errText}`);
  }
  return response.arrayBuffer();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, watchType = "night" } = await req.json();
    if (!text) throw new Error("text is required");

    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) throw new Error("ELEVENLABS_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check hash-based cache
    const cacheKey = await sha256Hex(
      JSON.stringify({ voice: VOICE_ID, text: text.trim(), type: watchType, v: WATCH_CACHE_VERSION }),
    );
    const storagePath = `watch-tts/${WATCH_CACHE_VERSION}/${watchType}/${cacheKey}.mp3`;

    const { data: existing } = await supabase.storage
      .from("bible-audio")
      .list(`watch-tts/${WATCH_CACHE_VERSION}/${watchType}`, { search: `${cacheKey}.mp3`, limit: 1 });

    if (existing && existing.length > 0) {
      const { data: urlData } = supabase.storage
        .from("bible-audio")
        .getPublicUrl(storagePath);
      console.log(`[WatchTTS] CACHE HIT`);
      return new Response(
        JSON.stringify({ audioUrl: urlData.publicUrl, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Preprocess pause markers
    const processed = preprocessPauses(text);

    // Split and generate with request stitching
    const chunks = splitAtSentences(processed, MAX_CHUNK);
    console.log(`[WatchTTS] ${chunks.length} chunks, generating with ElevenLabs (Lily)`);

    const audioBuffers: ArrayBuffer[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const prev = i > 0 ? chunks[i - 1].slice(-300) : undefined;
      const next = i < chunks.length - 1 ? chunks[i + 1].slice(0, 300) : undefined;
      const buf = await generateElevenLabs(chunks[i], apiKey, prev, next);
      audioBuffers.push(buf);
    }

    // Combine
    const totalLen = audioBuffers.reduce((s, b) => s + b.byteLength, 0);
    const combined = new Uint8Array(totalLen);
    let offset = 0;
    for (const buf of audioBuffers) {
      combined.set(new Uint8Array(buf), offset);
      offset += buf.byteLength;
    }

    // Upload to storage
    const { error: uploadErr } = await supabase.storage
      .from("bible-audio")
      .upload(storagePath, combined.buffer, { contentType: "audio/mpeg", upsert: true });

    if (uploadErr) {
      console.error("[WatchTTS] Upload error:", uploadErr);
      // Fallback to base64
      const b64 = base64Encode(combined.buffer);
      return new Response(
        JSON.stringify({ audioContent: b64, cached: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: urlData } = supabase.storage
      .from("bible-audio")
      .getPublicUrl(storagePath);

    console.log(`[WatchTTS] Cached: ${storagePath} (${totalLen} bytes)`);
    return new Response(
      JSON.stringify({ audioUrl: urlData.publicUrl, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    console.error("[WatchTTS] Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
