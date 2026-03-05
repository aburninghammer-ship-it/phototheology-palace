import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { bookId, chapterNumber, chapterTitle, bookTitle } = await req.json();

    if (!bookId || !chapterNumber || !chapterTitle || !bookTitle) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache first
    const { data: cached } = await supabase
      .from("egw_chapter_cache")
      .select("paragraphs")
      .eq("book_id", bookId)
      .eq("chapter_number", chapterNumber)
      .maybeSingle();

    // Serve from cache only if we have a reasonably complete chapter (15+ paragraphs)
    if (cached?.paragraphs && Array.isArray(cached.paragraphs) && cached.paragraphs.length >= 15) {
      return new Response(
        JSON.stringify({ paragraphs: cached.paragraphs, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If cache exists but is too short (partial chapter), delete it so we regenerate
    if (cached?.paragraphs && Array.isArray(cached.paragraphs) && cached.paragraphs.length > 0 && cached.paragraphs.length < 15) {
      console.log(`Cache hit but only ${cached.paragraphs.length} paragraphs (likely truncated) — regenerating`);
      await supabase
        .from("egw_chapter_cache")
        .delete()
        .eq("book_id", bookId)
        .eq("chapter_number", chapterNumber);
    }

    // Generate chapter text using Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = `You are a faithful reproducer of Ellen G. White's writings. Reproduce the ENTIRE, COMPLETE, UNABRIDGED text of the chapter below as accurately as possible from your training data. These works are in the public domain.

**Book:** ${bookTitle}
**Chapter ${chapterNumber}:** "${chapterTitle}"

CRITICAL INSTRUCTIONS:
1. Reproduce the COMPLETE chapter text — EVERY paragraph from the FIRST sentence to the LAST sentence of the chapter
2. Do NOT summarize, abbreviate, or skip ANY paragraphs — the user needs the FULL chapter
3. Ellen White chapters are typically 20-60 paragraphs long. If your output has fewer than 15 paragraphs, you are almost certainly truncating — keep going
4. Break the text into natural paragraphs as they appear in the original
5. Return ONLY a JSON array of paragraph strings, each being the full text of that paragraph
6. Do NOT add commentary, headers, chapter titles, or footnotes — just the raw EGW text
7. Maintain the original sentence structure and vocabulary
8. If you are uncertain about exact wording, reproduce the closest faithful version
9. Do NOT stop early. The chapter is not complete until you reach the final paragraph
10. Most EGW chapters end with a powerful concluding statement or Scripture reference — make sure you include it

Return ONLY a valid JSON array like: ["First paragraph text...", "Second paragraph text...", ..., "Final paragraph text..."]`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          messages: [
            { role: "system", content: "You are a faithful reproducer of Ellen G. White's public domain writings. You MUST reproduce COMPLETE, UNABRIDGED chapters — every paragraph from first to last. Never truncate or summarize. Return only valid JSON arrays of paragraph strings." },
            { role: "user", content: prompt },
          ],
          max_tokens: 32768,
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
      
      throw new Error("Failed to generate chapter text");
    }

    const data = await response.json();
    const rawText = data?.choices?.[0]?.message?.content;

    if (!rawText) {
      throw new Error("No content returned from AI");
    }

    let paragraphs: string[];
    try {
      // Clean markdown code blocks if present
      let cleanText = rawText.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
      }
      paragraphs = JSON.parse(cleanText);
      if (!Array.isArray(paragraphs)) throw new Error("Not an array");
      // Filter out empty strings
      paragraphs = paragraphs.filter((p: string) => typeof p === "string" && p.trim().length > 0);
    } catch {
      // If JSON parsing fails, split by double newline
      paragraphs = rawText
        .split(/\n\n+/)
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0);
    }

    if (paragraphs.length === 0) {
      throw new Error("No paragraphs generated");
    }

    // Cache the result
    await supabase
      .from("egw_chapter_cache")
      .upsert({
        book_id: bookId,
        chapter_number: chapterNumber,
        chapter_title: chapterTitle,
        paragraphs,
      }, { onConflict: "book_id,chapter_number" });

    return new Response(
      JSON.stringify({ paragraphs, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("fetch-egw-chapter error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Failed to fetch chapter" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
