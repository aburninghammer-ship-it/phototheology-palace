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
    const { action, messages, opponentWorldview, opponentStyle, opponentName, topicName, topicDescription, difficulty, userMessage } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (action === "open") {
      // Generate the AI's opening salvo
      const systemPrompt = buildSystemPrompt(opponentWorldview, opponentStyle, opponentName, topicName, topicDescription, difficulty);
      const openingPrompt = `Begin the debate. You are attacking the Seventh-day Adventist position on "${topicName}". ${topicDescription}. Open with a strong, provocative argument. Do NOT reveal your full identity or worldview immediately — let the user figure out who they're dealing with through your arguments. Start with your STRONGEST challenge.`;

      const response = await callAI(LOVABLE_API_KEY, [
        { role: "system", content: systemPrompt },
        { role: "user", content: openingPrompt },
      ]);

      return new Response(JSON.stringify({ response }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "reply") {
      const systemPrompt = buildSystemPrompt(opponentWorldview, opponentStyle, opponentName, topicName, topicDescription, difficulty);
      const chatMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role === "opponent" ? "assistant" : "user",
          content: m.content,
        })),
        { role: "user", content: userMessage },
      ];

      const response = await callAI(LOVABLE_API_KEY, chatMessages);
      return new Response(JSON.stringify({ response }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "verdict") {
      const verdictPrompt = `You are a theological debate judge. Review this debate between a Seventh-day Adventist defender and "${opponentName}" on "${topicName}".

Conversation:
${messages.map((m: any) => `[${m.role === 'opponent' ? opponentName : 'Defender'}]: ${m.content}`).join('\n\n')}

Evaluate the Defender's performance. Return JSON:
{
  "outcome": "win" | "loss" | "draw",
  "xp": <number 50-200>,
  "verdict": "<2-3 sentence analysis of performance>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<area 1>", "<area 2>"],
  "badge": null | { "type": "<badge_type>", "name": "<badge_name>", "icon": "<emoji>", "description": "<why earned>" }
}

Badge criteria:
- "first_blood": First debate completed
- "scripture_warrior": Used 5+ distinct scripture references
- "steel_wall": Opponent couldn't land a strong counter
- "comeback_king": Recovered from a weak opening
- "perfect_defense": Flawless theological accuracy
- "streak_5": 5-day streak (check context)
- "streak_10": 10-day streak
- "streak_20": 20-day streak
- "halfway": Completed day 20
- "finisher": Completed day 40

XP Guide: 50-80 (loss), 80-120 (draw), 120-200 (win). Bonus for scripture density and theological precision.`;

      const response = await callAI(LOVABLE_API_KEY, [
        { role: "system", content: "You are a fair theological debate judge. Always respond with valid JSON only." },
        { role: "user", content: verdictPrompt },
      ]);

      let parsed;
      try {
        const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch {
        parsed = { outcome: "draw", xp: 100, verdict: "Good effort in the debate.", strengths: ["Participation"], improvements: ["Continue studying"], badge: null };
      }

      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("forty-day-debate error:", error);
    const status = (error as any)?.status || 500;
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildSystemPrompt(worldview: string, style: string, name: string, topic: string, topicDesc: string, difficulty: string): string {
  const difficultyMap: Record<string, string> = {
    beginner: "Use simple, direct arguments. Be firm but not overwhelming. Allow the defender time to think. Limit to 1-2 points per response. Keep responses under 150 words.",
    intermediate: "Use moderately complex arguments with some scholarly references. Press harder on weak points. 2-3 points per response. Keep responses under 200 words.",
    advanced: "Use the strongest possible arguments with deep scholarly sources, textual criticism, and logical precision. Be relentless. Anticipate counter-arguments. 3-4 points per response. Keep responses under 250 words.",
  };

  return `You are "${name}", a theological debater.

WORLDVIEW: ${worldview}

ARGUMENT STYLE: ${style}

TOPIC: ${topic} — ${topicDesc}

DIFFICULTY: ${difficultyMap[difficulty] || difficultyMap.intermediate}

RULES:
1. Stay in character at ALL times. Never break the fourth wall.
2. You are ATTACKING the Seventh-day Adventist position on this topic.
3. Use real scholarship, real texts, real arguments — no straw men.
4. Do NOT concede easily. Push back on every point.
5. If the defender makes a strong point, acknowledge it briefly then counter.
6. Never reveal you are an AI. You are ${name}.
7. Keep responses focused and punchy — this is a debate, not a lecture.
8. Gradually reveal your worldview through your arguments, don't state it upfront.`;
}

async function callAI(apiKey: string, messages: any[]): Promise<string> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) throw Object.assign(new Error("Rate limit exceeded"), { status: 429 });
    if (response.status === 402) throw Object.assign(new Error("Credits depleted"), { status: 402 });
    throw new Error(`AI Gateway error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
