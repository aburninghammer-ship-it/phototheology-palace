import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorpusContext } from '../_shared/corpus-rag.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paragraph, bookTitle, chapterTitle } = await req.json();

    if (!paragraph) {
      return new Response(
        JSON.stringify({ error: "Missing paragraph text" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    let systemPrompt = `You are a Bible scholar specializing in connecting Ellen G. White's writings to Scripture. Given a passage from her writings, identify the most relevant Bible verses (KJV) that directly relate to, support, or are referenced by the passage.

Return a JSON array of 3-8 cross-references. Each should have:
- reference: The Bible reference (e.g., "John 3:16")
- text: The KJV verse text
- connection: A brief one-sentence explanation of how this verse connects to the EGW passage

Focus on:
1. Verses directly quoted or paraphrased by EGW
2. Verses that provide the scriptural basis for the statement
3. Related prophetic or thematic passages
4. Sanctuary/typological connections where relevant

Return ONLY a valid JSON array. No markdown, no explanation.`;

    const userPrompt = `Find Bible cross-references (KJV) for this passage from "${bookTitle}", "${chapterTitle}":

"${paragraph}"

Return JSON array like: [{"reference": "John 3:16", "text": "For God so loved...", "connection": "EGW echoes this theme of..."}]`;

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: `Ellen White ${bookTitle || ''} ${chapterTitle || ''} ${paragraph.slice(0, 500)}`.slice(0, 4000),
      matchCount: 2,
    });
    if (ragResult.chunkCount > 0) {
      systemPrompt += ragResult.corpusContext;
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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

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

      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    let results = [];
    try {
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
      }
      results = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      results = [];
    }

    return new Response(
      JSON.stringify({ references: results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Cross-reference error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
