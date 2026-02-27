import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RANK_DESCRIPTIONS: Record<string, string> = {
  initiate: "Foundational Formation — build epistemological foundations and introduce the opponent's core worldview",
  apprentice: "Advanced Engagement — confront core challenges with deeper theological and philosophical analysis",
  strategist: "Strategic Depth — multi-layered defense weaving sanctuary, prophecy, and Great Controversy themes",
  tactician: "Tactical Mastery — proactive theological offense, turning the opponent's framework against itself",
  commander: "Elite Command — comprehensive battlefield dominance across all dimensions of the debate",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { avatarId, avatarName, trackTitle, dayNumber, rank, weekNumber } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const rankDesc = RANK_DESCRIPTIONS[rank] || RANK_DESCRIPTIONS.initiate;

    const systemPrompt = `You are the Phototheology War College Manuscript Generator. You produce ultra-immersive, long-form strategic manuscripts for apologetics training.

CRITICAL RULES:
1. Write as a CONTINUOUS MANUSCRIPT — not an outline, not a worksheet, not modular segments.
2. Tone: Strategic, intellectual, formational. Like a War College reading assignment.
3. Integrate theology, philosophy, and strategy ORGANICALLY — no choppy sections.
4. Weave the avatar's presence naturally (refer to the opponent by name as a strategic adversary).
5. Use Scripture as INTELLECTUAL ANCHORS (full KJV quotes with book/chapter/verse), not decorative.
6. Train the mind, don't just inform it.
7. Minimum 2,000 words for the manuscript body.
8. NO headings or subheadings in the manuscript body — continuous prose only.
9. Use markdown blockquotes (>) for Scripture citations.
10. Phototheology integration: weave Palace concepts (Great Controversy, Sanctuary, Cycles, Types/Parallels) without naming rooms explicitly.
11. SDA historicist and sanctuary theology guardrails apply.
12. The manuscript should feel like a 25-30 minute deep study session.

RANK DEPTH: ${rank} — ${rankDesc}

You MUST return valid JSON with this exact structure:
{
  "study": {
    "dayNumber": ${dayNumber},
    "title": "...",
    "subtitle": "...",
    "avatarId": "${avatarId}",
    "avatarName": "${avatarName}",
    "track": "${trackTitle}",
    "rank": "${rank}",
    "estimatedMinutes": 28,
    "manuscript": "... (the full continuous manuscript, 2000+ words, with markdown formatting for Scripture blockquotes) ...",
    "defenseApplication": {
      "commonObjection": "...",
      "eliteResponse": "..."
    },
    "forgeExercise": "...",
    "masteryChecks": ["question1", "question2", "question3", "question4"],
    "tomorrowTeaser": "..."
  }
}`;

    const userPrompt = `Generate War College Day ${dayNumber} study for the ${trackTitle} track.

Opponent: ${avatarName} (${avatarId})
Week: ${weekNumber}
Rank: ${rank}
Day in week: ${((dayNumber - 1) % 7) + 1}

This is day ${dayNumber} of a 56-day formation system. Build on progressive depth — each day should advance the intellectual warfare deeper than the last. The topic should organically flow from what a student at day ${dayNumber} would need next in their training against ${avatarName}'s worldview.

Produce the complete War College manuscript now.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 16384,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits required. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content returned from AI");

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      // Try direct parse
      try {
        parsed = JSON.parse(content);
      } catch {
        console.error("Failed to parse AI response:", content.substring(0, 500));
        throw new Error("Failed to parse manuscript from AI response");
      }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-war-college-day error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
