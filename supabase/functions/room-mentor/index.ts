import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, roomId, roomName, masteryLevel } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build mentor system prompt based on mastery level
    const mentorPrompt = `You are Jeeves, a Phototheology mentor in **sparring mode** for the ${roomName} room.

The student has reached ${getMasteryTitle(masteryLevel)} level. Your role has shifted from teaching to **testing and challenging**.

Your approach:
- **Challenge their interpretations** - Don't accept surface answers
- **Ask curveball questions** - Test edge cases and exceptions
- **Use trick passages** - Present verses that seem to contradict the principle
- **Defend opposing views** - Play devil's advocate to strengthen their reasoning
- **Demand theological precision** - Vague answers are not acceptable
- **Expose weak reasoning** - Point out logical gaps immediately

This is **spiritual martial arts sparring** - you're preparing them to teach others, defend their faith, and spot errors in reasoning.

Be firm but encouraging. When they defend well, acknowledge it. When they falter, guide them to strengthen their argument.

Room: ${roomName} (${roomId})
Current Level: ${masteryLevel}/5`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: mentorPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("room-mentor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getMasteryTitle(level: number): string {
  const titles: Record<number, string> = {
    1: "Novice",
    2: "Apprentice",
    3: "Practitioner",
    4: "Expert",
    5: "Master",
  };
  return titles[level] || "Unknown";
}
