import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, type } = await req.json();

    if (!content || !type) {
      return new Response(
        JSON.stringify({ error: "Content and type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use Lovable AI for content moderation
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const moderationPrompt = type === "image" 
      ? `Analyze this image generation prompt for inappropriate content. Check for:
- Violence, gore, or graphic content
- Sexual or explicit content
- Hate speech or discriminatory language
- Profanity or offensive language
- Harmful or dangerous content

Prompt: "${content}"

Respond with ONLY a JSON object with this exact format:
{
  "safe": true/false,
  "reason": "brief explanation if unsafe, empty string if safe"
}`
      : `Analyze this text for inappropriate content. Check for:
- Violence, gore, or graphic content
- Sexual or explicit content
- Hate speech or discriminatory language
- Profanity or offensive language
- Harmful or dangerous content

Text: "${content}"

Respond with ONLY a JSON object with this exact format:
{
  "safe": true/false,
  "reason": "brief explanation if unsafe, empty string if safe"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: moderationPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Moderation API error: ${response.statusText}`);
    }

    const data = await response.json();
    const moderationResponse = data.choices?.[0]?.message?.content;

    if (!moderationResponse) {
      throw new Error("Invalid moderation response");
    }

    // Parse the JSON response
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = moderationResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = JSON.parse(moderationResponse);
      }
    } catch (parseError) {
      console.error("Failed to parse moderation response:", moderationResponse);
      // Default to safe if parsing fails
      result = { safe: true, reason: "" };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Content moderation error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        safe: true // Default to safe on error to avoid blocking legitimate content
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
