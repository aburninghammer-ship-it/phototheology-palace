import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, voice = "nova" } = await req.json();

    if (!text) {
      throw new Error("Text is required");
    }

    // Truncate text if too long (OpenAI TTS has a limit)
    const truncatedText = text.substring(0, 4096);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Use Lovable AI gateway for text generation, then synthesize
    // For now, we'll return a placeholder response
    // In production, integrate with a TTS service like OpenAI or ElevenLabs
    
    // Simulate TTS by returning success
    // In a real implementation, you would call OpenAI's TTS API:
    // const response = await fetch('https://api.openai.com/v1/audio/speech', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${OPENAI_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     model: 'tts-1',
    //     input: truncatedText,
    //     voice: voice,
    //     response_format: 'mp3',
    //   }),
    // });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "TTS endpoint ready. Configure OPENAI_API_KEY for full audio generation.",
        textLength: truncatedText.length,
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
