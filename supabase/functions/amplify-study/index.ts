import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studyText } = await req.json();

    if (!studyText || studyText.length < 100) {
      return new Response(JSON.stringify({ error: "Study text must be at least 100 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are Jeeves, the Phototheology Palace AI — a master biblical scholar, theologian, and study enhancer. Your job is to AMPLIFY a study: take what the user wrote and make it substantially deeper, fuller, sharper, and more complete.

YOU DO NOT RESTRUCTURE OR REMIX. You KEEP the original structure and flow. You ENHANCE it.

YOUR MISSION:
1. **Fill Gaps** — Where the study is thin, add depth. Where it makes a claim without support, add 3-5 KJV cross-references with full verse quotes.
2. **Buttress Every Point with Scripture** — THIS IS CRITICAL. For every theological claim, assertion, or insight in the study, add supporting KJV verses that strengthen and prove the point. Don't just reference them — quote them in full and explain how they buttress the argument. Each major point should have a "📖 Supporting Witnesses" block with 3-5 verses that confirm, deepen, or illuminate the claim from different angles across Scripture.
3. **Sharpen Arguments** — Where reasoning is soft, tighten the logic. Add cause-and-effect connections. Remove vagueness.
4. **Deepen Theology** — Apply Phototheology Palace principles to enrich every section:
   - Add Christ-centered connections (Concentration Room lens)
   - Surface types and symbols the author may have missed (Symbols/Types Room)
   - Add prophetic connections where relevant (Prophecy Room)
   - Connect to sanctuary furniture and services where applicable (Blue Room)
   - Show patterns and parallels across Scripture (Patterns & Parallels Rooms)
5. **Scripture Density** — The amplified study should be SATURATED with Scripture. Every paragraph should contain at least one fully quoted KJV verse. Where the original study makes a statement without a verse, find the verse that proves it. Where it quotes one verse, add 2-3 more that corroborate from different books, testaments, or genres.
6. **Enhance Illustrations** — Where the study uses an illustration, expand it. Where it lacks illustration, add one from Scripture, nature, or history.
7. **Strengthen the Opening** — Make the introduction compelling and attention-grabbing.
8. **Strengthen the Conclusion** — Ensure it drives home the main point with conviction and a clear call to action.

RULES:
- Use KJV exclusively for all Scripture quotations
- Keep the original study's structure, headings, and flow — do NOT reorganize
- Mark your additions clearly so the user can see what you enhanced
- Bold key phrases and insights
- Every section should feel substantially richer after amplification
- Do NOT pad with filler — every addition must carry theological weight
- Maintain a warm, pastoral, yet intellectually rigorous tone
- When adding supporting verses, group them as "📖 Supporting Witnesses:" blocks after major points

FORMAT:
Use markdown with ## headings for each major section. Use > blockquotes for Scripture. Use **bold** for key insights. Use bullet points for lists of cross-references.

At the end, include a section called "## 💎 Gems Discovered" listing 3-5 striking insights that emerged during amplification.`;

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
          {
            role: "user",
            content: `AMPLIFY THIS STUDY — keep its structure but make it substantially deeper, fuller, and sharper:\n\n${studyText}`
          }
        ],
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited — please wait a moment and try again" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted — please add funds in Settings" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const report = data.choices?.[0]?.message?.content || "No amplification generated.";

    return new Response(JSON.stringify({ report }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Amplify error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
