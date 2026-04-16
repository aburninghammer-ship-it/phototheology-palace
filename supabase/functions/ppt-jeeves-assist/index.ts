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
    const { userMessage, studyTitle, studyContext, conversationHistory } = await req.json();

    if (!userMessage) {
      throw new Error("User message is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Determine the type of request based on the message
    const messageType = determineMessageType(userMessage);

    const systemPrompt = `You are Jeeves, a knowledgeable and helpful Bible study assistant. You help users create study content for presentations.

Your capabilities:
1. **Finding Scripture**: When asked for Bible verses, provide relevant passages with references. Include the actual verse text when possible.
2. **Research**: Provide historical, cultural, and theological context for topics.
3. **Insights**: Offer deep observations and applications from Scripture.
4. **General Help**: Answer questions about Bible study methodology and content creation.

Guidelines:
- Be concise but thorough
- Always cite Scripture references when mentioning verses
- Use markdown formatting for clarity
- When providing verses, format as: **Book Chapter:Verse** - "Text"
- Focus on Christ-centered interpretation
- Be encouraging and supportive

${studyTitle ? `The user is working on a study titled: "${studyTitle}"` : ''}
${studyContext ? `\nStudy content so far:\n${studyContext}` : ''}`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []).map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: userMessage },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        max_tokens: 1500,
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
    const aiResponse = data.choices?.[0]?.message?.content || "I couldn't generate a response.";

    // Extract scripture references from the response
    const scriptureRefs = extractScriptureRefs(aiResponse);

    return new Response(
      JSON.stringify({
        response: aiResponse,
        type: messageType,
        scriptureRefs,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("ppt-jeeves-assist error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function determineMessageType(message: string): 'verse' | 'research' | 'insight' | 'general' {
  const lowerMessage = message.toLowerCase();
  
  if (
    lowerMessage.includes('find verse') ||
    lowerMessage.includes('bible verse') ||
    lowerMessage.includes('scripture') ||
    lowerMessage.includes('what does the bible say') ||
    lowerMessage.includes('verses about') ||
    lowerMessage.includes('passages about')
  ) {
    return 'verse';
  }
  
  if (
    lowerMessage.includes('research') ||
    lowerMessage.includes('explain') ||
    lowerMessage.includes('context') ||
    lowerMessage.includes('background') ||
    lowerMessage.includes('history') ||
    lowerMessage.includes('meaning of')
  ) {
    return 'research';
  }
  
  if (
    lowerMessage.includes('insight') ||
    lowerMessage.includes('application') ||
    lowerMessage.includes('how can') ||
    lowerMessage.includes('what can we learn')
  ) {
    return 'insight';
  }
  
  return 'general';
}

function extractScriptureRefs(text: string): string[] {
  // Match common Bible reference patterns
  const pattern = /\b(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1\s*Samuel|2\s*Samuel|1\s*Kings|2\s*Kings|1\s*Chronicles|2\s*Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song\s*of\s*Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1\s*Corinthians|2\s*Corinthians|Galatians|Ephesians|Philippians|Colossians|1\s*Thessalonians|2\s*Thessalonians|1\s*Timothy|2\s*Timothy|Titus|Philemon|Hebrews|James|1\s*Peter|2\s*Peter|1\s*John|2\s*John|3\s*John|Jude|Revelation)\s+\d+(?::\d+(?:-\d+)?)?/gi;
  
  const matches = text.match(pattern) || [];
  return [...new Set(matches)]; // Remove duplicates
}
