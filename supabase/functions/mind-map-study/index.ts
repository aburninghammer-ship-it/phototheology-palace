import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STUDY_SYSTEM_PROMPT = `
You are Jeeves, a sophisticated Bible study assistant. Generate a comprehensive devotional study based on the provided seed text using the Phototheology Palace framework.

THE PHOTOTHEOLOGY PALACE FRAMEWORK:
- 8 Floors: Furnishing, Investigation, Freestyle, Next Level, Vision, Three Heavens, Spiritual, Master
- Key Rooms: Story Room (SR), Observation Room (OR), Christ Every Chapter (CEC), Prophecy Room (PR), Sanctuary Room (SRm)
- Sanctuary: Altar, Laver, Lampstand, Showbread, Incense, Ark, Mercy Seat

STUDY REQUIREMENTS:

1. TITLE: Create an engaging, descriptive title that captures the essence of the passage.

2. INTRODUCTION: Write a compelling 2-3 sentence introduction that:
   - Sets the context
   - Hooks the reader
   - Previews what they'll discover

3. SECTIONS (3-5 sections): Each section should include:
   - A clear, descriptive title
   - Rich content (2-4 paragraphs) exploring the text
   - Palace connections (which rooms/floors apply)
   - Supporting scriptures (KJV preferred, include verse text when helpful)

   Suggested section flow:
   - Historical/Contextual Background
   - Key Observations & Patterns
   - Christ-Centered Insights (how does this point to Jesus?)
   - Sanctuary Connections (typological significance)
   - Prophetic/Spiritual Implications

4. APPLICATION POINTS (3-5 points):
   - Practical, actionable takeaways
   - Personal reflection prompts
   - Ways to apply the truth today

5. CLOSING PRAYER:
   - A heartfelt prayer that incorporates themes from the study
   - Appropriate for personal or group use

6. RELATED PASSAGES:
   - 3-5 cross-references for further study

MODE ADJUSTMENTS:
- BEGINNER: Simple language, fewer sections, clear explanations
- SCHOLAR: Deep analysis, more cross-references, scholarly connections
- PREACHER: Focus on teaching hooks, illustrations, sermon-ready content
- RESEARCH: Academic rigor, exhaustive connections, detailed evidence

MANDATORY RULES:
- Return ONLY valid JSON
- Be specific and substantive, not generic
- Ground everything in the actual text provided
- Include actual scripture quotes when relevant
- Make Palace connections specific (not just "Floor 2" but "Observation Room")

RESPONSE FORMAT (JSON only, no markdown):
{
  "title": "Engaging study title",
  "introduction": "2-3 compelling sentences...",
  "sections": [
    {
      "title": "Section Title",
      "content": "Rich, substantive content with multiple paragraphs...",
      "palaceConnections": ["Floor 2: Investigation", "Observation Room"],
      "scriptures": ["John 3:16", "Romans 8:28"]
    }
  ],
  "applicationPoints": [
    "First practical application...",
    "Second practical application..."
  ],
  "closingPrayer": "A heartfelt prayer incorporating study themes...",
  "relatedPassages": ["Genesis 22:8", "Isaiah 53:7", "Hebrews 10:1"]
}
`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, mode = "scholar" } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Truncate very long texts
    const truncatedText = text.length > 10000 ? text.substring(0, 10000) + "..." : text;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const modeInstruction = {
      beginner: "MODE: BEGINNER - Keep the study accessible with simple language and clear explanations.",
      scholar: "MODE: SCHOLAR - Provide deep analysis with scholarly connections and comprehensive cross-references.",
      preacher: "MODE: PREACHER - Focus on teaching hooks, vivid illustrations, and sermon-ready content.",
      research: "MODE: RESEARCH - Exhaustive academic analysis with detailed evidence and extensive connections.",
    }[mode] || "MODE: SCHOLAR";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: STUDY_SYSTEM_PROMPT + "\n\n" + modeInstruction,
          },
          {
            role: "user",
            content: `Generate a comprehensive Phototheology study based on this seed text:\n\n${truncatedText}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "";

    // Parse JSON from response (handle potential markdown wrapping)
    let study;
    try {
      // Remove markdown code blocks if present
      let jsonStr = content;
      if (jsonStr.includes("```json")) {
        jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (jsonStr.includes("```")) {
        jsonStr = jsonStr.replace(/```\n?/g, "");
      }
      study = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      // Return a basic fallback structure
      study = {
        title: "Study of the Provided Text",
        introduction: "This study explores the rich truths contained in your seed text through the lens of the Phototheology Palace framework.",
        sections: [
          {
            title: "Initial Observations",
            content: "The text presents foundational truths that deserve careful examination. As we observe the details, patterns begin to emerge that connect to the broader narrative of Scripture.",
            palaceConnections: ["Floor 2: Investigation", "Observation Room"],
            scriptures: ["Psalm 119:18"],
          },
          {
            title: "Christ-Centered Insights",
            content: "Every passage of Scripture ultimately points to Christ. Even in this text, we can see shadows and types that find their fulfillment in Jesus.",
            palaceConnections: ["Floor 4: Next Level", "Christ Every Chapter"],
            scriptures: ["Luke 24:27", "John 5:39"],
          },
        ],
        applicationPoints: [
          "Take time to meditate on the key truths discovered in this study",
          "Consider how these insights change your understanding of God's character",
          "Apply one specific truth to your life this week",
        ],
        closingPrayer: "Heavenly Father, thank You for Your Word that illuminates our path. Help us to see Christ in every passage and to apply these truths to our daily lives. In Jesus' name, Amen.",
        relatedPassages: ["John 5:39", "2 Timothy 3:16-17", "Hebrews 4:12"],
      };
    }

    return new Response(
      JSON.stringify(study),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Mind map study error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Study generation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
