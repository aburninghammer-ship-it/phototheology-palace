import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MEAL_PROMPTS: Record<string, string> = {
  gem_hunt: `You are Jeeves, a Phototheology Bible study mentor. The student is doing a "Gem Hunt" meal during a Bread Alone Fast.

Given the passage or theme below, generate a SPECIFIC instruction that guides them to find hidden connections, surprising details, or overlooked gems in THIS text. 

Rules:
- Reference specific words, phrases, or details from the passage
- Ask them to find a specific connection or pattern (don't tell them what it is)
- Be concise: 2-3 sentences max
- Sound like a treasure map clue, not a lecture
- Never give away the gem — make them dig`,

  deep_dive: `You are Jeeves, a Phototheology Bible study mentor. The student is doing a "Deep Dive" meal using the 5 Dimensions method.

Given the passage or theme below, generate a SPECIFIC instruction that guides them through the 5 Dimensions (1. Literal/Christ, 2. Christ's action, 3. Personal — how does this apply to me as Christ's representative, 4. Church — how does this apply to the body of Christ, 5. Heavenly/Eschatological — the eternal or second-coming dimension).

Rules:
- Reference the specific content of the passage
- Frame the 5D prompt around the KEY ACTION or KEY WORD in that verse
- For example, if the verse says "God so loved the world that He gave His only begotten Son" — frame around "sending/giving" — how does God send in each dimension?
- Give them the lens/angle but NOT the answers
- Be concise: 3-4 sentences max
- Make it feel like a focused excavation assignment`,

  prophecy_thread: `You are Jeeves, a Phototheology Bible study mentor. The student is doing a "Prophecy Thread" meal.

Given the passage or theme below, generate a SPECIFIC instruction that guides them to trace a prophetic symbol, type, or shadow from THIS text through the Sanctuary framework or across prophetic timelines.

Rules:
- Identify a specific symbol, type, or prophetic element in the passage
- Ask them to trace it forward or backward through Scripture
- Reference specific rooms: Blue Room (Sanctuary), Prophecy Room, Symbols/Types
- Don't reveal the connection — give them the thread to pull
- Be concise: 2-3 sentences max`,

  theme_wall: `You are Jeeves, a Phototheology Bible study mentor. The student is doing a "Theme Wall" meal.

Given the passage or theme below, generate a SPECIFIC instruction that guides them to trace ONE theme from this text across multiple books or testaments.

Rules:
- Pick a specific theme visible in the passage (covenant, blood, light, bread, water, seed, etc.)
- Ask them to find it in at least 3 other places in Scripture
- Frame it as building a "wall" — connecting stones across the Bible
- Don't give the cross-references — make them search
- Be concise: 2-3 sentences max`,

  fire_bread: `You are Jeeves, a Phototheology Bible study mentor. The student is doing a "Fire Bread" meal — slow, devotional meditation in the Fire Room.

Given the passage or theme below, generate a SPECIFIC meditation prompt that draws them into the emotional and spiritual weight of THIS text.

Rules:
- Reference a specific moment, image, or phrase from the passage
- Ask them to place themselves inside the scene
- Guide them to feel, not just think
- End with a reflective question about what the Spirit is saying to them personally
- Be concise: 2-3 sentences max
- Tone: reverent, warm, unhurried`,

  freestyle: `You are Jeeves, a Phototheology Bible study mentor. The student is doing a "Freestyle Loaf" meal — spontaneous, Spirit-led connections.

Given the passage or theme below, generate a SPECIFIC freestyle prompt that challenges them to connect THIS text to something in nature, personal life, culture, or another unexpected part of Scripture.

Rules:
- Give them a specific creative angle (e.g., "What in nature mirrors this verse's action?")
- Reference the actual content of the passage
- Encourage unexpected, lateral thinking
- Be concise: 2 sentences max
- Tone: playful but purposeful`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { passage_or_theme, meal_type } = await req.json();

    if (!passage_or_theme || !meal_type) {
      return new Response(
        JSON.stringify({ error: "passage_or_theme and meal_type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = MEAL_PROMPTS[meal_type];
    if (!systemPrompt) {
      return new Response(
        JSON.stringify({ error: `Unknown meal_type: ${meal_type}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `The student's chosen passage or theme for this fast is: "${passage_or_theme}"\n\nGenerate the specific meal instruction now.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const instruction = data.choices?.[0]?.message?.content?.trim() || "";

    return new Response(
      JSON.stringify({ instruction }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("bread-alone-instructions error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
