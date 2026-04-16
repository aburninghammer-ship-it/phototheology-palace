import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getContentBehavioralEngine } from '../_shared/content-behavioral-engine.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brief_text } = await req.json();

    if (!brief_text || typeof brief_text !== "string" || brief_text.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: "Missing or too-short brief_text" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an audio script writer. Convert the following research brief into a cohesive audio commentary that a listener can follow naturally.

RULES:
1. Remove ALL markdown formatting — no headers, bullet points, asterisks, hashtags, or confidence labels.
2. Produce 3-5 sections of flowing narrative prose. Each section should be 150-250 words.
3. Maintain ALL factual content, Scripture references, and scholarly details from the original brief.
4. Use natural spoken-English transitions between topics (e.g., "Moving on to…", "Another key insight is…", "This connects to…").
5. Write as if narrating to an engaged listener — warm, clear, and authoritative.
6. Scripture references should be spoken naturally (e.g., "In Romans chapter eight, verse twenty-eight, Paul writes…").
7. Do NOT add information that is not in the original brief.
8. Do NOT include any meta-commentary like "In this section we will discuss…" — just present the content directly.

Return a JSON array of strings, where each string is one complete audio section. Example: ["Section one text...", "Section two text...", "Section three text..."]`;

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
            { role: "user", content: brief_text.slice(0, 12000) },
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
      throw new Error("Failed to generate audio commentary");
    }

    const data = await response.json();
    const rawText = data?.choices?.[0]?.message?.content;

    if (!rawText) throw new Error("No content returned from AI");

    let sections: string[];
    try {
      let cleanText = rawText.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
      }
      sections = JSON.parse(cleanText);
      if (!Array.isArray(sections)) throw new Error("Not an array");
      sections = sections.filter((s: string) => typeof s === "string" && s.trim().length > 0);
    } catch {
      // Fallback: split on double newlines
      sections = rawText
        .split(/\n\n+/)
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 50);
    }

    if (sections.length === 0) throw new Error("No sections generated");

    return new Response(
      JSON.stringify({ sections }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-research-audio error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Failed to generate audio commentary" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
