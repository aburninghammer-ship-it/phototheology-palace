import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ElevenLabs voice options
const VOICES: Record<string, string> = {
  aria: '9BWtsMINqrJLrRacOk9x',
  roger: 'CwhRBWXzGAHq8TQ4Fs17',
  sarah: 'EXAVITQu4vr4xnSDxMaL',
  laura: 'FGY2WhTYpPnrIDTdsKH5',
  charlie: 'IKne3meq5aSn9XLyUdCD',
  george: 'JBFqnCBsd6RMkjVDRZzb',
  callum: 'N2lVS1w4EtoT3dr4eOWO',
  river: 'SAz9YHcvj6GT2YYXdXww',
  liam: 'TX3LPaxmHKxFdv7VOQHJ',
  charlotte: 'XB0fDUnXU5powFXDhCwa',
  alice: 'Xb7hH8MSUJpSbSDYk0k2',
  matilda: 'XrExE9yKIg1WjnnlVkGX',
  will: 'bIHbv24MWmeRgasZH58o',
  jessica: 'cgSgspJ2msm6clMCkdW9',
  eric: 'cjVigY5qzO86Huf0OWal',
  chris: 'iP95p4xoKVk53GoZ742B',
  brian: 'nPczCjzI2devNBz1zQrb',
  daniel: 'onwK4e9ZLuTAKqWW03F9',
  lily: 'pFZP5JQG7iQjIQuC4Bku',
  bill: 'pqHfZKP75CvOlQylNhV4',
};

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Call ElevenLabs API with retry logic for rate limiting
async function callElevenLabsWithRetry(
  text: string,
  voiceId: string,
  apiKey: string,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      // Exponential backoff: 2s, 4s, 8s
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`Rate limited. Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
      await delay(waitTime);
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (response.ok) {
      return response;
    }

    // Check if it's a rate limit error (429)
    if (response.status === 429) {
      const errorText = await response.text();
      console.error(`ElevenLabs API error: ${response.status}`, errorText);
      lastError = new Error(`Rate limited: ${response.status}`);
      continue; // Retry
    }

    // For other errors, don't retry
    const errorText = await response.text();
    console.error(`ElevenLabs API error: ${response.status}`, errorText);
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  throw lastError || new Error('Max retries exceeded');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, voice = "daniel" } = await req.json();

    if (!text) {
      throw new Error("Text is required");
    }

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    // Get voice ID from name or use directly if it's already an ID
    const voiceId = VOICES[voice.toLowerCase()] || voice;

    console.log(`Generating TTS for ${text.length} characters with voice: ${voice} (${voiceId})`);

    // Call ElevenLabs API with retry logic
    const response = await callElevenLabsWithRetry(text, voiceId, ELEVENLABS_API_KEY);

    // Convert audio buffer to base64 using chunked approach to avoid stack overflow
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let base64Audio = '';
    const chunkSize = 32768;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
      base64Audio += String.fromCharCode(...chunk);
    }
    base64Audio = btoa(base64Audio);

    console.log("TTS audio generated successfully, size:", arrayBuffer.byteLength);

    return new Response(
      JSON.stringify({ 
        success: true,
        audioContent: base64Audio,
        contentType: 'audio/mpeg',
        textLength: text.length,
        voice: voice
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("text-to-speech error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
