import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query } = await req.json();
    if (!query) throw new Error("No query provided");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a biblical Hebrew and Greek lexicon. Given a query (Strong's number, English word, Hebrew word, or Greek word), return a comprehensive lexicon entry.

Return a JSON object with this exact structure:
{
  "word": "the original Hebrew/Greek word",
  "transliteration": "transliteration in Latin characters",
  "strongsNumber": "H#### or G####",
  "language": "hebrew" or "greek",
  "partOfSpeech": "verb/noun/adjective/etc",
  "definition": "concise one-line definition",
  "extendedDefinition": "detailed 2-3 sentence definition with theological nuance",
  "usageCount": approximate number of occurrences in the Bible,
  "semanticRange": [
    { "meaning": "primary meaning/translation", "percentage": 40, "examples": ["Psalm 139:1", "Job 28:27"] },
    { "meaning": "secondary meaning", "percentage": 25, "examples": ["Proverbs 25:2"] }
  ],
  "relatedWords": [
    { "word": "related word", "strongs": "H####", "relation": "synonym/antonym/root/derivative" }
  ],
  "keyVerses": ["Genesis 1:1", "John 3:16"]
}

The semanticRange percentages should sum to approximately 100 and represent how often the word is translated with each meaning. Include 3-6 semantic range entries.
Include 3-5 related words and 4-8 key verses.
Return ONLY valid JSON, no markdown or explanation.`;

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
          { role: "user", content: `Look up: ${query}` },
        ],
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON in AI response");

    const entry = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(entry), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Lexicon error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
