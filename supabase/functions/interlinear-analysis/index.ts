import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { book, chapter, verse, verseText } = await req.json();

    if (!book || !chapter || !verse) {
      return new Response(
        JSON.stringify({ error: "book, chapter, and verse are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isOT = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"].includes(book);

    const language = isOT ? "Hebrew" : "Greek";

    const prompt = `You are a biblical languages scholar. Provide an interlinear analysis of ${book} ${chapter}:${verse}.

KJV Text: "${verseText}"

For EACH word/phrase in the original ${language} text (in the order it appears in the original language), provide:
1. The original ${language} word (in ${isOT ? "Hebrew" : "Greek"} script)
2. Transliteration (romanized)  
3. Strong's number (e.g., H1234 or G5678)
4. Part of speech (noun, verb, etc.)
5. The English translation/gloss as it appears in KJV
6. Brief definition (1 sentence max)

Return ONLY valid JSON in this exact format — no markdown, no explanation:
{
  "language": "${language}",
  "direction": "${isOT ? "rtl" : "ltr"}",
  "words": [
    {
      "original": "בְּרֵאשִׁית",
      "transliteration": "bereshith",
      "strongs": "H7225",
      "pos": "noun",
      "english": "In the beginning",
      "definition": "The first, beginning, chief"
    }
  ]
}

Be thorough — include every word from the original text. Include particles, conjunctions, and prefixes that are separate morphemes in ${language}.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "{}";

    // Extract JSON from response
    let parsed;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseErr) {
      console.error("Parse error:", parseErr, "Raw:", rawContent.substring(0, 500));
      throw new Error("Failed to parse interlinear data");
    }

    return new Response(
      JSON.stringify({
        book,
        chapter,
        verse,
        language: parsed.language || language,
        direction: parsed.direction || (isOT ? "rtl" : "ltr"),
        words: parsed.words || [],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("interlinear-analysis error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message, words: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
