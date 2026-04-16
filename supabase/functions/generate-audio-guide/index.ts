import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getContentBehavioralEngine } from '../_shared/content-behavioral-engine.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, contextId, contextName, contextPurpose, contextMethod, floorName } = await req.json();

    if (!type || !contextId || !contextName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let systemPrompt: string;
    let userPrompt: string;

    if (type === "room_demo") {
      systemPrompt = `You are Jeeves, the calm, scholarly Phototheology AI guide. You speak in a composed, warm, authoritative tone. You use KJV exclusively.

Your task: Create a 2-3 minute audio script that DEMONSTRATES how to use a specific Palace room on a real passage of Scripture. This is a "Watch Me Use It" demo — not an explanation of what the room is, but a live walkthrough of APPLYING the room's method to Scripture.

Rules:
- Start with ONE sentence about what this room does
- Then immediately demonstrate it on a specific Bible passage
- Think out loud as you apply the method step by step
- Show the "aha!" moment that emerges from using this room
- End with: "Now it's your turn. Pick any passage and try this yourself."
- Keep it 250-400 words (about 2-3 minutes when read aloud)
- Be specific — use actual verses, actual observations, actual connections
- Do NOT list room features or give a lecture — DEMONSTRATE`;

      userPrompt = `Room: ${contextName} (${contextId})
Floor: ${floorName}
Purpose: ${contextPurpose}
Method: ${contextMethod}

Create a live "Watch Me Use It" demo script for this room. Pick a compelling passage and walk through applying this room's method step by step.`;
    } else if (type === "tab_activation") {
      systemPrompt = `You are Jeeves, the calm, scholarly Phototheology AI guide. You speak in a composed, warm, authoritative tone.

Your task: Create a 60-90 second "activation" script for a navigation tab. This is NOT an explanation of features — it's an EMOTIONAL and PRACTICAL hook that makes the user feel: "I NEED to use this."

Rules:
- Start with a compelling question or scenario
- Show what this area UNLOCKS for their spiritual life
- Give one specific "first move" they can take right now
- Keep it 100-150 words (about 60-90 seconds when read aloud)
- Be inspiring, not informational
- End with an actionable invitation`;

      userPrompt = `Tab: ${contextName}
Purpose: ${contextPurpose || "Navigate to this feature area"}

Create an activation script that makes users excited to explore this tab.`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid type. Use 'room_demo' or 'tab_activation'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate script via Lovable AI
    const aiResponse = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1000,
        temperature: 0.8,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("[generate-audio-guide] AI error:", errText);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const script = aiData.choices?.[0]?.message?.content || "";

    if (!script) {
      return new Response(JSON.stringify({ error: "Empty script generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate TTS via ElevenLabs
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      // Return script only without audio
      return new Response(JSON.stringify({ script, audioAvailable: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const voiceId = "nPczCjzI2devNBz1zQrb"; // Brian - Calm American (Jeeves persona)
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
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.82,
            similarity_boost: 0.75,
            speed: 0.92,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      console.error("[generate-audio-guide] TTS error:", await ttsResponse.text());
      // Return script only
      return new Response(JSON.stringify({ script, audioAvailable: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const audioBuffer = await ttsResponse.arrayBuffer();

    // Encode as base64 for JSON response
    const { encode: base64Encode } = await import("https://deno.land/std@0.168.0/encoding/base64.ts");
    const audioBase64 = base64Encode(audioBuffer);

    return new Response(
      JSON.stringify({ script, audioBase64, audioAvailable: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[generate-audio-guide] Error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
