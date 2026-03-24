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

// Voice assignments
const VOICE_IDS = {
  jeeves: "ErXwobaYiN019PkySvjV",   // Antoni — calm, analytical scholar
  reginald: "onwK4e9ZLuTAKqWW03F9", // Daniel — authoritative, measured butler
};

const BUCKET = "audio-cache";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { segmentId, guide, script, tourId } = await req.json();

    if (!segmentId || !guide || !script) {
      return new Response(
        JSON.stringify({ error: "segmentId, guide, and script are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const storagePath = `palace-tours/${tourId || "psalm23"}/${segmentId}.mp3`;

    // Check cache first
    const { data: existing } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, 3600);

    if (existing?.signedUrl) {
      // Verify the file exists by checking if the URL is valid
      const checkResp = await fetch(existing.signedUrl, { method: "HEAD" });
      if (checkResp.ok) {
        return new Response(
          JSON.stringify({ audioUrl: existing.signedUrl, cached: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Generate TTS via ElevenLabs
    if (!ELEVENLABS_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ElevenLabs API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const voiceId = VOICE_IDS[guide as keyof typeof VOICE_IDS] || VOICE_IDS.jeeves;

    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: script,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
            speed: 0.95,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const errText = await ttsResponse.text();
      console.error(`ElevenLabs TTS error [${ttsResponse.status}]:`, errText);
      return new Response(
        JSON.stringify({ error: `TTS generation failed: ${ttsResponse.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const audioBuffer = await ttsResponse.arrayBuffer();

    // Cache to storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, audioBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
    }

    // Return signed URL
    const { data: signedData } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, 3600);

    if (signedData?.signedUrl) {
      return new Response(
        JSON.stringify({ audioUrl: signedData.signedUrl, cached: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback: encode as base64 data URI so client can still play it
    const { encode: base64Encode } = await import("https://deno.land/std@0.168.0/encoding/base64.ts");
    const base64Audio = base64Encode(audioBuffer);
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
