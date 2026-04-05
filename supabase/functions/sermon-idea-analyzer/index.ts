import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getContentBehavioralEngine } from "../_shared/content-behavioral-engine.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea, context } = await req.json();

    if (!idea) {
      throw new Error("Sermon idea is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Jeeves, an expert homiletics advisor grounded in Phototheology principles. When given a sermon idea or title, you analyze it and provide 3 distinct sermon options.

For each option, provide:
1. A refined title (can keep original if strong)
2. A "Big Idea" - the one sentence takeaway
3. 2-4 key Scripture passages
4. Target audience description
5. 3-4 main points for the sermon
6. Palace Anchors (Phototheology rooms that connect: e.g., "Concentration Room (CR)", "Patterns Room (PRm)", "Types Room (@T)")

Guidelines:
- Each option should take a DIFFERENT angle on the same idea
- One option could be more evangelistic, one more devotional, one more doctrinal
- Include both Old and New Testament connections when possible
- Make suggestions practical and Christ-centered
- Use palace room codes correctly: SR (Story), OR (Observation), CR (Concentration), DR (Dimensions), PRm (Patterns), P‖ (Parallels), @T (Types), BL (Sanctuary/Blue), etc.

Respond in this exact JSON format:
{
  "insights": "Brief observation about the sermon idea's potential (1-2 sentences)",
  "options": [
    {
      "title": "Sermon Title",
      "bigIdea": "One sentence central truth",
      "keyPassages": ["John 3:16", "Romans 5:8"],
      "targetAudience": "Who this angle best serves",
      "mainPoints": ["Point 1", "Point 2", "Point 3"],
      "palaceAnchors": ["CR - Christ as center", "PRm - Repeated patterns"]
    }
  ]
}`;
    const behavioralEngine = getContentBehavioralEngine();

    const userPrompt = `Analyze this sermon idea and provide 3 distinct sermon options:

Sermon Idea/Title: "${idea}"
${context ? `Additional Context: ${context}` : ""}

Provide your analysis as JSON.`;

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
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                        aiResponse.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiResponse;
      parsed = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      // Fallback response
      parsed = {
        insights: "Jeeves analyzed your idea but had trouble formatting the response. Here's a simplified suggestion.",
        options: [
          {
            title: idea,
            bigIdea: "Explore this theme through Scripture",
            keyPassages: ["Selected passages to be determined"],
            targetAudience: "General congregation",
            mainPoints: ["Introduction and context", "Biblical foundations", "Practical application"],
            palaceAnchors: ["CR - Keep Christ central"],
          },
        ],
      };
    }

    return new Response(
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("sermon-idea-analyzer error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
