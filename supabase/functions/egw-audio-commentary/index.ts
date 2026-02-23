import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookId, bookTitle, chapterNumber, chapterTitle, paragraphs, mode } = await req.json();

    if (!bookId || !chapterNumber || !chapterTitle || !bookTitle) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache
    const cacheKey = `${bookId}_ch${chapterNumber}_${mode || 'chapter'}`;
    const { data: cached } = await supabase
      .from("egw_chapter_cache")
      .select("paragraphs")
      .eq("book_id", cacheKey)
      .eq("chapter_number", 0) // use 0 for commentary entries
      .maybeSingle();

    if (cached?.paragraphs && Array.isArray(cached.paragraphs) && cached.paragraphs.length > 0) {
      return new Response(
        JSON.stringify({ commentary: cached.paragraphs, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Build chapter context from paragraphs if available
    const chapterContext = paragraphs && paragraphs.length > 0
      ? paragraphs.map((p: string, i: number) => `[¶${i + 1}] ${p}`).join("\n\n")
      : `Chapter ${chapterNumber}: "${chapterTitle}" from ${bookTitle}`;

    const isChapterMode = mode !== 'paragraph';

    const systemPrompt = `You are a Phototheology Bible commentator. Your task is to create an audio-ready biblical commentary that buttresses and illuminates Ellen White's writings using ONLY the King James Bible and Phototheology Palace principles.

VOICE & STYLE:
- Write as if narrating to a listener — warm, reverent, clear, conversational
- Use present tense for theological truths ("Christ stands as...", "The sanctuary reveals...")
- Address the listener directly ("Notice how...", "Consider this...")
- No bullet points, no headers — pure flowing prose suitable for text-to-speech
- Each section should be 150-300 words

THEOLOGICAL FRAMEWORK (Phototheology Palace):
- Concentration Room (CR): Every passage must reveal Christ
- Dimensions Room (DR): Literal → Christ → Me → Church → Heaven
- Blue Room (BL): Sanctuary connections and typology
- Patterns Room (PRm): Recurring divine motifs across Scripture
- Three Heavens: Place in DoL¹/NE¹, DoL²/NE², or DoL³/NE³ framework
- Cycles: Map to @Ad → @Re cycle where applicable
- Fruit Room (FRt): Practical Christlike application

RULES:
1. ONLY use KJV Bible texts — quote them directly with references
2. Each commentary section must cite at least 3-5 KJV verses
3. Connect EGW insights to their Biblical roots
4. Apply at least 3 different Palace rooms per section
5. Maintain SDA doctrinal guardrails
6. Keep Christ as the absolute center
7. Return ONLY a valid JSON array of commentary strings — each string is one section ready for TTS`;

    const userPrompt = isChapterMode
      ? `Create a comprehensive audio commentary for this entire EGW chapter. Divide your commentary into 6-10 flowing sections that walk through the chapter sequentially, buttressing each major theme with KJV Scripture and Palace principles.

**Book:** ${bookTitle}
**Chapter ${chapterNumber}:** "${chapterTitle}"

**Chapter Content:**
${chapterContext}

Return a JSON array of 6-10 commentary strings. Each string is one complete section of the audio commentary (150-300 words each). Walk through the chapter paragraph by paragraph, weaving in KJV texts and Palace analysis as you go.`
      : `Create a focused audio commentary for the following EGW paragraph. Buttress every key claim with KJV Scripture and analyze through Palace rooms.

**Book:** ${bookTitle}
**Chapter ${chapterNumber}:** "${chapterTitle}"

**Paragraph:**
${chapterContext}

Return a JSON array of 2-4 commentary strings (150-250 words each).`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 8000,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("Failed to generate commentary");
    }

    const data = await response.json();
    const rawText = data?.choices?.[0]?.message?.content;

    if (!rawText) throw new Error("No content returned from AI");

    let commentary: string[];
    try {
      let cleanText = rawText.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
      }
      commentary = JSON.parse(cleanText);
      if (!Array.isArray(commentary)) throw new Error("Not an array");
      commentary = commentary.filter((p: string) => typeof p === "string" && p.trim().length > 0);
    } catch {
      commentary = rawText
        .split(/\n\n+/)
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 50);
    }

    if (commentary.length === 0) throw new Error("No commentary generated");

    // Cache for chapter mode only
    if (isChapterMode) {
      await supabase
        .from("egw_chapter_cache")
        .upsert({
          book_id: cacheKey,
          chapter_number: 0,
          chapter_title: `Commentary: ${chapterTitle}`,
          paragraphs: commentary,
        }, { onConflict: "book_id,chapter_number" });
    }

    return new Response(
      JSON.stringify({ commentary, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("egw-audio-commentary error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate commentary" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
