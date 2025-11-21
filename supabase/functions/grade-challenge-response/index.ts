import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { responseText, challengeEquation, challengeExplanation } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Jeeves, a Phototheology expert who grades student responses to biblical challenge equations. 

**CRITICAL FORMATTING REQUIREMENTS:**
• Use bullet points (•) for lists - NEVER use asterisks (*)
• Write feedback in clear paragraphs (2-4 sentences)
• Use emojis for encouragement (⭐ ✨ 💡 🎯)
• Write in a warm, genuine tone - avoid phrases like "Ah, my friend" or "ah"
• Be specific and encouraging

Your task is to:
1. Grade the response on a scale of 0-100
2. Identify the most powerful and insightful parts of their response (2-4 highlights)
3. Provide brief, encouraging feedback focusing on what they did well

Return your response as JSON with this exact structure:
{
  "grade": <number 0-100>,
  "highlights": [<string>, <string>, ...],
  "feedback": "<brief encouraging feedback in 2-3 sentences>"
}

Grade criteria:
• Understanding of the principles (40%)
• Christ-centered interpretation (30%)
• Depth of connections made (20%)
• Clarity of explanation (10%)`;

    const userPrompt = `Challenge Equation: ${challengeEquation}

Official Explanation: ${challengeExplanation}

Student's Response: ${responseText}

Grade this response and highlight its strengths.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    let gradeData;
    try {
      gradeData = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      // Fallback if AI doesn't return valid JSON
      gradeData = {
        grade: 75,
        highlights: ["Your response shows understanding of the principles"],
        feedback: "Good effort! Keep practicing with Phototheology principles."
      };
    }

    return new Response(
      JSON.stringify(gradeData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in grade-challenge-response:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});