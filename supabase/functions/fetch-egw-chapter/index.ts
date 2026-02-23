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
      .single();

    if (cached?.paragraphs && Array.isArray(cached.paragraphs) && cached.paragraphs.length > 0) {
      return new Response(
        JSON.stringify({ paragraphs: cached.paragraphs, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate chapter text using AI
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const prompt = `You are a faithful reproducer of Ellen G. White's writings. Reproduce the FULL text of the chapter below as accurately as possible from your training data. These works are in the public domain.

**Book:** ${bookTitle}
**Chapter ${chapterNumber}:** "${chapterTitle}"

INSTRUCTIONS:
1. Reproduce the COMPLETE chapter text as faithfully as possible
2. Break the text into natural paragraphs
3. Return ONLY a JSON array of paragraph strings, each paragraph being the full text of that paragraph
4. Do NOT add commentary, headers, or footnotes — just the raw EGW text
5. Include ALL paragraphs from beginning to end of the chapter
6. Maintain the original sentence structure and vocabulary
7. If you are uncertain about exact wording, reproduce the closest faithful version

Return ONLY a valid JSON array like: ["First paragraph text...", "Second paragraph text...", ...]`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 65536,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini error:", errText);
      throw new Error("Failed to generate chapter text");
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("No content returned from AI");
    }

    let paragraphs: string[];
    try {
      paragraphs = JSON.parse(rawText);
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
      JSON.stringify({ error: error.message || "Failed to fetch chapter" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
