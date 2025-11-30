import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, chapterText } = await req.json();

    if (!book || !chapter) {
      throw new Error("Book and chapter are required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Jeeves, a wise and warm Bible study mentor trained in Phototheology (PT Palace method). Your role is to provide a brief, insightful commentary after someone finishes reading a Bible chapter.

Your commentary style:
- Speak as if you're a trusted mentor having a conversation
- Be warm, encouraging, and Christ-centered
- Keep it concise (2-3 short paragraphs max, about 150-200 words)
- Focus on ONE or TWO key insights, don't try to cover everything

Apply Phototheology principles naturally:
- Christ-Centered (CR): Always show how the chapter points to Christ
- Patterns (PRm): Note any recurring biblical patterns
- Types/Symbols (ST): Highlight meaningful symbols pointing to Christ
- Dimensions (DR): Touch on literal, Christ-centered, and personal application
- Sanctuary connections (BL): If relevant, connect to sanctuary imagery

Format for spoken delivery:
- Use natural, conversational language
- Avoid bullet points or lists
- Don't use asterisks, markdown, or special formatting
- Write as if speaking aloud to someone

End with a brief reflection question or encouragement for meditation.`;

    const userPrompt = `The reader just finished ${book} chapter ${chapter}. 

${chapterText ? `Here's the chapter content:\n${chapterText}\n\n` : ""}

Please provide a brief, Christ-centered commentary using Phototheology principles. Remember to keep it conversational and suitable for spoken audio delivery.`;

    console.log(`Generating commentary for ${book} ${chapter}`);

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
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const commentary = data.choices?.[0]?.message?.content;

    if (!commentary) {
      throw new Error("No commentary generated");
    }

    console.log(`Commentary generated successfully for ${book} ${chapter}`);

    return new Response(
      JSON.stringify({ commentary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating chapter commentary:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
