import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_MODEL = "google/gemini-3-flash-preview";

type InfographicTemplate = "timeline" | "comparison" | "hierarchy" | "process" | "list" | "sanctuary-map";

const TEMPLATE_INSTRUCTIONS: Record<InfographicTemplate, string> = {
  timeline: `Create a TIMELINE infographic with chronological events. Structure:
    - title: The timeline title
    - events: Array of { date/period, title, description, scripture }
    - Order events chronologically
    - Include approximate dates/periods where possible
    - Connect events to show progression`,

  comparison: `Create a COMPARISON infographic showing two concepts side by side. Structure:
    - title: The comparison title
    - concept1: { name, description, keyPoints: [], scriptures: [] }
    - concept2: { name, description, keyPoints: [], scriptures: [] }
    - similarities: Array of shared aspects
    - contrasts: Array of differences
    - conclusion: What the comparison reveals`,

  hierarchy: `Create a HIERARCHY infographic showing nested relationships. Structure:
    - title: The hierarchy title
    - root: { name, description }
    - levels: Array of { levelName, items: [{ name, description, children: [] }] }
    - Show parent-child relationships clearly`,

  process: `Create a PROCESS infographic showing step-by-step flow. Structure:
    - title: The process title
    - steps: Array of { number, title, description, scripture, actionItem }
    - Show clear progression from start to finish
    - Include practical action items for each step`,

  list: `Create a KEY POINTS infographic highlighting main takeaways. Structure:
    - title: The list title
    - points: Array of { number, title, description, scripture, application }
    - Each point should be self-contained but related
    - Include practical applications`,

  "sanctuary-map": `Create a SANCTUARY-themed infographic mapping concepts to sanctuary elements. Structure:
    - title: The sanctuary theme title
    - elements: {
        altar: { truth, scripture, application },
        laver: { truth, scripture, application },
        lampstand: { truth, scripture, application },
        showbread: { truth, scripture, application },
        incense: { truth, scripture, application },
        ark: { truth, scripture, application },
        mercySeat: { truth, scripture, application }
      }
    - Connect each element to the main theme`,
};

const SYSTEM_PROMPT = `You are an expert Bible study content creator specializing in visual infographics.
Your task is to analyze the provided text and generate structured data for an infographic.

RULES:
- Extract key themes, scriptures, and insights from the source text
- Structure the output according to the specified template format
- All scripture references should use KJV
- Keep text concise - suitable for visual display
- Focus on clarity and memorability
- Include practical applications where appropriate
- Return ONLY valid JSON (no markdown)

TEMPLATE-SPECIFIC INSTRUCTIONS:
{templateInstruction}

OUTPUT FORMAT:
Return a JSON object with:
{
  "title": "Infographic title",
  "subtitle": "Optional subtitle",
  "colorScheme": "blue" | "purple" | "green" | "orange" | "amber",
  "data": { /* template-specific structure */ },
  "keyScriptures": ["John 3:16", "Romans 8:28"],
  "summary": "1-2 sentence summary of the infographic content"
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      sourceText,
      template,
      title: userTitle,
      userId
    } = await req.json();

    if (!sourceText || typeof sourceText !== "string") {
      return new Response(
        JSON.stringify({ error: "Source text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!template || !TEMPLATE_INSTRUCTIONS[template as InfographicTemplate]) {
      return new Response(
        JSON.stringify({ error: "Valid template is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Truncate very long texts
    const truncatedText = sourceText.length > 10000
      ? sourceText.substring(0, 10000) + "..."
      : sourceText;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const templateInstruction = TEMPLATE_INSTRUCTIONS[template as InfographicTemplate];
    const systemPrompt = SYSTEM_PROMPT.replace("{templateInstruction}", templateInstruction);

    const userPrompt = `Generate an infographic from this content:

${userTitle ? `REQUESTED TITLE: ${userTitle}\n` : ""}
TEMPLATE: ${template}

SOURCE TEXT:
${truncatedText}

Generate the infographic data now. Return ONLY JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits are paused. Please add more credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    let infographicData;
    let jsonStr = content;
    if (jsonStr.includes("```json")) {
      jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonStr.includes("```")) {
      jsonStr = jsonStr.replace(/```\n?/g, "");
    }

    try {
      infographicData = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Failed to parse AI response");
    }

    // Add metadata
    infographicData.template = template;
    infographicData.generatedAt = new Date().toISOString();

    // Log usage if userId provided
    if (userId) {
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase.rpc("deduct_ai_credits", {
          user_id_param: userId,
          feature_param: "infographic",
          model_param: DEFAULT_MODEL,
        });
      } catch (creditError) {
        console.error("Credit deduction error:", creditError);
        // Don't fail the request if credit deduction fails
      }
    }

    return new Response(
      JSON.stringify(infographicData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Infographic generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Generation failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
