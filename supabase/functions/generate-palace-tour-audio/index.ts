import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const VOICE_CONFIGS = {
  jeeves: {
    id: "nPczCjzI2devNBz1zQrb",
    settings: {
      stability: 0.82,
      similarity_boost: 0.78,
      style: 0.08,
      use_speaker_boost: true,
      speed: 0.92,
    },
  },
  reginald: {
    id: "onwK4e9ZLuTAKqWW03F9",
    settings: {
      stability: 0.7,
      similarity_boost: 0.75,
      style: 0.18,
      use_speaker_boost: true,
      speed: 0.95,
    },
  },
} as const;

const BUCKET = "audio-cache";
const MAX_CHUNK_CHARS = 4500;
const VOICE_CACHE_VERSION = "v7-guided-phil2-suite-upgrade";

function chunkScript(text: string): string[] {
  if (text.length <= MAX_CHUNK_CHARS) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= MAX_CHUNK_CHARS) {
      chunks.push(remaining);
      break;
    }

    let splitAt = MAX_CHUNK_CHARS;
    const searchWindow = remaining.substring(Math.floor(MAX_CHUNK_CHARS * 0.7), MAX_CHUNK_CHARS);
    const lastPeriod = searchWindow.lastIndexOf(". ");
    const lastQuestion = searchWindow.lastIndexOf("? ");
    const lastExclaim = searchWindow.lastIndexOf("! ");
    const bestSplit = Math.max(lastPeriod, lastQuestion, lastExclaim);

    if (bestSplit > 0) {
      splitAt = Math.floor(MAX_CHUNK_CHARS * 0.7) + bestSplit + 2;
    }

    chunks.push(remaining.substring(0, splitAt).trim());
    remaining = remaining.substring(splitAt).trim();
  }

  return chunks;
}

async function generateChunkAudio(
  text: string,
  voiceConfig: { id: string; settings: Record<string, unknown> },
  previousText?: string,
  nextText?: string
): Promise<ArrayBuffer> {
  const body: Record<string, unknown> = {
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: voiceConfig.settings,
  };

  if (previousText) body.previous_text = previousText.slice(-300);
  if (nextText) body.next_text = nextText.slice(0, 300);

  const resp = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.id}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`TTS error [${resp.status}]: ${errText}`);
  }

  return resp.arrayBuffer();
}

function concatBuffers(buffers: ArrayBuffer[]): Uint8Array {
  const totalLength = buffers.reduce((sum, b) => sum + b.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const buf of buffers) {
    result.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }

  return result;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { segmentId, guide, script, tourId, regenerate } = await req.json();

    if (!segmentId || !guide || !script) {
      return new Response(
        JSON.stringify({ error: "segmentId, guide, and script are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!ELEVENLABS_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ElevenLabs API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const voiceConfig = VOICE_CONFIGS[guide as keyof typeof VOICE_CONFIGS] || VOICE_CONFIGS.jeeves;
    const storagePath = `palace-tours/${tourId || "psalm23"}/${VOICE_CACHE_VERSION}/${guide}-${voiceConfig.id}/${segmentId}.mp3`;

    if (!regenerate) {
      const { data: existing } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(storagePath, 3600);

      if (existing?.signedUrl) {
        const checkResp = await fetch(existing.signedUrl, { method: "HEAD" });
        if (checkResp.ok) {
          return new Response(
            JSON.stringify({ audioUrl: existing.signedUrl, cached: true }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    const chunks = chunkScript(script);
    console.log(`Generating ${chunks.length} chunk(s) for segment "${segmentId}" (${script.length} chars)`);

    const audioBuffers: ArrayBuffer[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const previousText = i > 0 ? chunks[i - 1] : undefined;
      const nextText = i < chunks.length - 1 ? chunks[i + 1] : undefined;
      const buffer = await generateChunkAudio(chunks[i], voiceConfig, previousText, nextText);
      audioBuffers.push(buffer);
    }

    const finalAudio = chunks.length === 1
      ? new Uint8Array(audioBuffers[0])
      : concatBuffers(audioBuffers);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, finalAudio, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
    }

    const { data: signedData } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, 3600);

    if (signedData?.signedUrl) {
      return new Response(
        JSON.stringify({ audioUrl: signedData.signedUrl, cached: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { encode: base64Encode } = await import("https://deno.land/std@0.168.0/encoding/base64.ts");
    const base64Audio = base64Encode(finalAudio);
    const dataUri = `data:audio/mpeg;base64,${base64Audio}`;

    return new Response(
      JSON.stringify({ audioUrl: dataUri, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Palace tour audio error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});