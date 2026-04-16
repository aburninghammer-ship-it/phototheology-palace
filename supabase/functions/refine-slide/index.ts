import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a presentation design expert. The user wants to refine a specific slide. Analyze their request and return an updated slide object.

## RULES
1. Return ONLY valid JSON for the updated slide
2. Preserve the slide "type" unless explicitly asked to change it
3. Keep text SHORT - body max 20 words, bullets max 4 items
4. Include a "designNotes" field explaining your changes
5. If adding images, include an "imagePrompt" field describing what image to generate

## SLIDE SCHEMA
{
  "type": "TITLE|BIG_IDEA|SCRIPTURE|MAIN_POINT|ILLUSTRATION|APPLICATION|APPEAL|TRANSITION|QUOTE|QUESTION|NUMBERED_POINT",
  "layout": "centered|left-aligned|right-aligned|split-50|minimal|dramatic",
  "visualStyle": {
    "emphasis": "bold|subtle|dramatic|elegant",
    "mood": "light|dark|warm|cool|neutral",
    "invertColors": false
  },
  "title": "string",
  "subtitle": "string",
  "body": "string",
  "bullets": ["array"],
  "scripture": { "reference": "", "text": "", "highlightWords": [] },
  "speakerNotes": "string",
  "designNotes": "string",
  "imagePrompt": "string (optional - what image to generate)"
}

## COMMON REFINEMENTS
- "Make it more impactful" → increase emphasis, add drama, shorten text
- "Add an image" → generate imagePrompt based on content theme
- "Too much text" → condense, split into multiple slides
- "More visual" → suggest layout change, add imagePrompt
- "Different style" → change mood/emphasis
- "Highlight key words" → for scripture, add highlightWords array`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slide, instruction, context } = await req.json();

    console.log("[refine-slide] Refining slide:", { type: slide.type, instruction });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const userPrompt = `## CURRENT SLIDE
${JSON.stringify(slide, null, 2)}

## SERMON CONTEXT
Title: ${context?.sermonTitle || "Not provided"}
Theme: ${context?.themePassage || "Not provided"}

## USER INSTRUCTION
"${instruction}"

Return the updated slide JSON only. No explanation outside the JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI request failed: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      content = jsonMatch[1].trim();
    }

    let updatedSlide;
    try {
      updatedSlide = JSON.parse(content);
    } catch {
      console.error("[refine-slide] Parse error, raw:", content.substring(0, 300));
      throw new Error("Failed to parse AI response");
    }

    console.log("[refine-slide] Slide refined:", { 
      type: updatedSlide.type, 
      hasImagePrompt: !!updatedSlide.imagePrompt 
    });

    return new Response(JSON.stringify(updatedSlide), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[refine-slide] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
