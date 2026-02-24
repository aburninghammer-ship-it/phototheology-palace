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
    const { sermonText, sermonTitle, weekStart, weekEnd } = await req.json();

    if (!sermonText) {
      return new Response(
        JSON.stringify({ error: "Sermon text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a biblical scholar and Phototheology expert. Given a sermon transcript or outline, generate a structured weekly Central Study Packet for small groups.

ALL Scripture quotes MUST be KJV (King James Version).

Respond ONLY with valid JSON in this exact format:
{
  "title": "string (study title derived from the sermon)",
  "description": "string (2-3 sentence overview)",
  "key_passages": ["string array of scripture references"],
  "guided_questions": ["string array of 3-5 discussion questions progressing from observation to interpretation to application"],
  "christ_synthesis": "string (how this sermon points to Christ - Concentration Room focus)",
  "action_challenge": "string (practical weekly challenge for members)",
  "prayer_focus": "string (guided prayer theme for the week)",
  "seeker_friendly_framing": "string (how to present this to guests/seekers in an accessible way)"
}`;

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: `${sermonTitle || ''} ${sermonText.substring(0, 3000)}`.slice(0, 4000),
      matchCount: 2,
    });

    let userPrompt = `Generate a Central Study Packet from this sermon:

SERMON TITLE: ${sermonTitle || "Untitled Sermon"}
WEEK: ${weekStart || "TBD"} to ${weekEnd || "TBD"}

SERMON CONTENT:
${sermonText.substring(0, 12000)}

Create a Christ-centered, Phototheology-informed weekly study that captures the core message and makes it actionable for small groups.`;

    if (ragResult.chunkCount > 0) {
      userPrompt += ragResult.corpusContext;
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
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    let studyData;
    try {
      let jsonStr = content.trim();
      // Remove code block wrappers
      const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1].trim();
      }
      // Extract outermost JSON object
      const firstBrace = jsonStr.indexOf('{');
      const lastBrace = jsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      }
      // Fix common JSON issues
      jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1'); // trailing commas
      jsonStr = jsonStr.replace(/[\x00-\x1F\x7F]/g, (ch: string) => {
        if (ch === '\n' || ch === '\r' || ch === '\t') return ch;
        return ' ';
      }); // control chars
      jsonStr = jsonStr.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
      
      // Try parsing; if it fails, try a more aggressive cleanup
      try {
        studyData = JSON.parse(jsonStr);
      } catch {
        // Re-extract: rebuild valid JSON from known fields
        jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
        jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
        // Replace unescaped newlines inside string values
        jsonStr = jsonStr.replace(/"([^"]*(?:\\.[^"]*)*)"/g, (match: string) => {
          return match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
        });
        studyData = JSON.parse(jsonStr);
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw content preview:", content.substring(0, 500));
      // Return a fallback study based on what we can extract
      studyData = {
        title: "Weekly Study",
        description: "AI-generated study (formatting issue - please review and edit)",
        key_passages: [],
        guided_questions: ["What stood out to you in this week's sermon?", "How does this message point to Christ?", "What practical step can you take this week?"],
        christ_synthesis: "Review the sermon for Christ-centered themes.",
        action_challenge: "Reflect on the sermon's key message this week.",
        prayer_focus: "Pray for deeper understanding of God's Word.",
        seeker_friendly_framing: "This study explores key biblical themes from this week's message."
      };
    }

    return new Response(
      JSON.stringify({ success: true, study: studyData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Generate weekly study error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
