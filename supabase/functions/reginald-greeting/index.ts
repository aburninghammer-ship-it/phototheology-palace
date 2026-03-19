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

// Daniel voice — authoritative, measured, perfect for a butler
const REGINALD_VOICE_ID = "onwK4e9ZLuTAKqWW03F9";

const GREETING_TEXTS = {
  first_time: `Ah, welcome to Phototheology! I'm Reginald, your personal concierge through the Palace. Here, you can study Scripture with the PT Study Bible, explore the 8-floor Memory Palace, ask Jeeves your deepest Bible questions, take guided courses, and even connect with your church community. Think of this as your Bible study command center. Wherever you'd like to begin, I'm right here to help. Shall we?`,
  returning: `Welcome back to the Palace! Reginald here. Wonderful to see you again — let's pick up right where you left off, shall we?`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type } = await req.json();
    const greetingType = type === "returning" ? "returning" : "first_time";
    const storagePath = `reginald-greetings/${greetingType}.mp3`;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if cached audio exists in storage
    const { data: existingFile } = await supabase.storage
      .from("audio-cache")
      .createSignedUrl(storagePath, 3600);

    if (existingFile?.signedUrl) {
      console.log(`[ReginaldGreeting] Serving cached ${greetingType} greeting`);
      return new Response(
        JSON.stringify({ audioUrl: existingFile.signedUrl, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate with ElevenLabs
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    const text = GREETING_TEXTS[greetingType];
    console.log(`[ReginaldGreeting] Generating ${greetingType} greeting (${text.length} chars)`);

    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${REGINALD_VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.8,
            style: 0.4,
            use_speaker_boost: true,
            speed: 0.95,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const err = await ttsResponse.text();
      throw new Error(`ElevenLabs TTS error: ${ttsResponse.status} - ${err}`);
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const audioBytes = new Uint8Array(audioBuffer);

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find((b: any) => b.name === "audio-cache")) {
      await supabase.storage.createBucket("audio-cache", { public: false });
    }

    // Cache to storage
    const { error: uploadError } = await supabase.storage
      .from("audio-cache")
      .upload(storagePath, audioBytes, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      console.warn(`[ReginaldGreeting] Cache upload failed: ${uploadError.message}`);
    }

    // Return the audio directly
    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "X-Greeting-Type": greetingType,
        "X-Cached": "false",
      },
    });
  } catch (error) {
    console.error("[ReginaldGreeting] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
