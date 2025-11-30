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

const MAX_CHARS = 9500; // Stay under ElevenLabs 10,000 limit

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Split text into chunks at sentence boundaries
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

    // Find a good break point (sentence end) within the limit
    let breakPoint = maxChars;
    
    // Look for sentence endings (.!?) followed by space or end
    const searchText = remaining.substring(0, maxChars);
    const sentenceEndings = ['. ', '! ', '? ', '.\n', '!\n', '?\n'];
    let lastSentenceEnd = -1;
    
    for (const ending of sentenceEndings) {
      const idx = searchText.lastIndexOf(ending);
      if (idx > lastSentenceEnd) {
        lastSentenceEnd = idx + 1; // Include the punctuation
      }
    }

    // If we found a sentence break, use it; otherwise try paragraph break
    if (lastSentenceEnd > maxChars * 0.5) {
      breakPoint = lastSentenceEnd;
    } else {
      // Try paragraph break
      const paragraphBreak = searchText.lastIndexOf('\n\n');
      if (paragraphBreak > maxChars * 0.3) {
        breakPoint = paragraphBreak + 1;
      } else {
        // Fall back to any newline
        const newlineBreak = searchText.lastIndexOf('\n');
        if (newlineBreak > maxChars * 0.3) {
          breakPoint = newlineBreak + 1;
        }
        // Otherwise just cut at maxChars
      }
    }

    chunks.push(remaining.substring(0, breakPoint).trim());
    remaining = remaining.substring(breakPoint).trim();
  }

  return chunks.filter(chunk => chunk.length > 0);
}

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

// Convert array buffer to base64 in chunks to avoid stack overflow
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let base64 = '';
  const chunkSize = 32768;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    base64 += String.fromCharCode(...chunk);
  }
  return btoa(base64);
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

    // Split text into chunks if needed
    const chunks = splitTextIntoChunks(text, MAX_CHARS);
    console.log(`Split into ${chunks.length} chunks`);

    // Generate TTS for each chunk and collect audio buffers
    const audioBuffers: ArrayBuffer[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Processing chunk ${i + 1}/${chunks.length} (${chunk.length} chars)`);
      
      const response = await callElevenLabsWithRetry(chunk, voiceId, ELEVENLABS_API_KEY);
      const buffer = await response.arrayBuffer();
      audioBuffers.push(buffer);
      
      // Small delay between chunks to avoid rate limiting
      if (i < chunks.length - 1) {
        await delay(100);
      }
    }

    // Concatenate all audio buffers
    const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const buffer of audioBuffers) {
      combined.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    }

    // Convert to base64
    const base64Audio = arrayBufferToBase64(combined.buffer);

    console.log(`TTS audio generated successfully, total size: ${totalLength} bytes from ${chunks.length} chunks`);

    return new Response(
      JSON.stringify({ 
        success: true,
        audioContent: base64Audio,
        contentType: 'audio/mpeg',
        textLength: text.length,
        voice: voice,
        chunks: chunks.length
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
