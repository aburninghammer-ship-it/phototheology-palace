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
    const { messages, roomId, roomName, masteryLevel, userName } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build greeting based on user's name
    const greeting = userName ? userName : "friend";

    // Build mentor system prompt based on mastery level
    const mentorPrompt = `You are Jeeves, ${greeting}'s training partner in **sparring mode** for the ${roomName} room.

Hey ${greeting}! You've reached ${getMasteryTitle(masteryLevel)} level, which means we're moving from teaching to **real sparring**. I'm here to challenge you, sharpen your skills, and prepare you to teach others confidently.

**My Approach with You:**
- **Challenge your interpretations** - I won't accept surface answers, ${greeting}
- **Throw curveball questions** - Testing edge cases and exceptions
- **Use trick passages** - Verses that seem to contradict the principle
- **Play devil's advocate** - Strengthening your reasoning by defending opposing views
- **Demand precision** - Vague answers won't cut it at your level
- **Expose weak spots** - Pointing out logical gaps immediately so you can fix them

**The Vibe:**
This is **spiritual martial arts sparring**, ${greeting}. I'm your training partner preparing you to teach others, defend your faith, and spot errors in reasoning like a pro.

I'll be firm but always encouraging. When you defend well, I'll celebrate it. When you stumble, I'll guide you to strengthen your argument.

Use ${greeting}'s name naturally 2-3 times per response to maintain connection.
Keep it conversational and motivating—like "Nice move, ${greeting}!", "${greeting}, let's test that logic", "I see what you're doing there, ${greeting}"
NEVER use overly formal phrases like "My dear student", "My dear Sir", "Ah sir", or similar formal salutations.

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
