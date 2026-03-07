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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const moderationPrompt = type === "image" 
      ? `You are a content moderator for a Bible study platform called Phototheology Palace. This platform is strictly for Bible study, theological reflection, devotional content, and Phototheology method discussions.

Analyze this image generation prompt and determine:
1. Is it safe (no violence, sexual content, hate speech, profanity)?
2. Is it relevant to Bible study, theology, Scripture, devotional life, or the Phototheology method?

Reject anything political, controversial (abortion, partisan politics, culture war topics), or unrelated to Bible study.

Prompt: "${content}"

Respond with ONLY a JSON object:
{
  "safe": true/false,
  "reason": "brief explanation if rejected, empty string if safe"
}`
      : `You are a content moderator for a Bible study platform called Phototheology Palace. This platform is strictly for Bible study, theological reflection, devotional content, prayer, and Phototheology method discussions.

Analyze this text and determine:
1. Is it safe (no violence, sexual content, hate speech, profanity, harmful content)?
2. Is it relevant to Bible study, theology, Scripture, Christian devotional life, prayer, spiritual growth, or the Phototheology method?

REJECT content that is:
- Political (partisan politics, political candidates, government policy debates)
- Controversial social topics not directly addressed by Scripture study
- Secular entertainment, sports, or pop culture unrelated to Bible study
- Promotional or spam content
- Personal attacks or gossip

ALLOW content that is:
- Bible verse analysis, commentary, or reflection
- Phototheology room/floor exercises and findings
- Prayer requests and spiritual encouragement
- Theological questions and discussions
- Devotional insights and personal spiritual growth stories
- Sanctuary, prophecy, or typology discussions
- Christian fellowship and testimony related to faith

Text: "${content}"

Respond with ONLY a JSON object:
{
  "safe": true/false,
  "reason": "brief explanation if rejected, empty string if safe"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "user",
            content: moderationPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later.", safe: true, reason: "" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`Moderation API error: ${response.statusText}`);
    }

    const data = await response.json();
    const moderationResponse = data.choices?.[0]?.message?.content;

    if (!moderationResponse) {
      throw new Error("Invalid moderation response");
    }

    let result;
    try {
      const jsonMatch = moderationResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = JSON.parse(moderationResponse);
      }
    } catch (parseError) {
      console.error("Failed to parse moderation response:", moderationResponse);
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
        safe: true,
        reason: ""
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
