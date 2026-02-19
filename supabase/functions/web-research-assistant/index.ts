import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, conversationHistory, systemInstructions } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `${systemInstructions || "You are Jeeves, a Bible research assistant in Phototheology Palace."}

WEB SEARCH ENABLED — CRITICAL INSTRUCTIONS:
You have access to real-time Google Search. When the user asks about current events, recent news, external links, or any information that benefits from web search, USE IT.

CITATION FORMAT — MANDATORY:
After your response, always include a "Sources:" section listing all web sources you referenced. Format each source as:
- [Title of source](https://full-url-here) — brief description

For biblical topics, also search for:
- Scholarly articles and commentaries
- Seminary or theological journal pages
- Bible study tools (BibleHub, BlueLetterBible, StudyLight, etc.)

Always provide real, clickable URLs. Never fabricate URLs.`;

    // Build message array with conversation history
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt },
    ];

    // Inject conversation history as real turns
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: { role: string; content: string }) => {
        messages.push({ role: msg.role === "assistant" ? "assistant" : "user", content: msg.content });
      });
    }

    messages.push({ role: "user", content: query });

    // Use Gemini 2.5 Pro with Google Search grounding
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages,
        temperature: 0.3,
        max_tokens: 2048,
        tools: [{ googleSearch: {} }],
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
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fallback: retry without tools if gateway doesn't support it
      const fallbackResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          messages,
          temperature: 0.3,
          max_tokens: 2048,
        }),
      });

      if (!fallbackResponse.ok) {
        const errorText = await fallbackResponse.text();
        console.error("AI gateway error:", fallbackResponse.status, errorText);
        throw new Error(`AI gateway error: ${fallbackResponse.status}`);
      }

      const fallbackData = await fallbackResponse.json();
      const fallbackContent = fallbackData.choices?.[0]?.message?.content || "No response received.";
      const { mainText, citations } = parseResponse(fallbackContent);

      return new Response(
        JSON.stringify({ response: mainText, citations }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "No response received.";

    // Extract any grounding metadata citations if available
    const groundingCitations: string[] = [];
    const groundingMeta = data.choices?.[0]?.grounding_metadata || data.grounding_metadata;
    if (groundingMeta?.grounding_chunks) {
      for (const chunk of groundingMeta.grounding_chunks) {
        if (chunk.web?.uri) groundingCitations.push(chunk.web.uri);
      }
    }

    const { mainText, citations: parsedCitations } = parseResponse(rawContent);
    const allCitations = [...new Set([...groundingCitations, ...parsedCitations])];

    return new Response(
      JSON.stringify({ response: mainText, citations: allCitations }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("web-research-assistant error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Parse response text into main content and a citations list.
 * Extracts markdown links from a "Sources:" section.
 */
function parseResponse(text: string): { mainText: string; citations: Array<{ title: string; url: string }> } {
  const citations: Array<{ title: string; url: string }> = [];

  // Find "Sources:" section (case-insensitive)
  const sourcesMatch = text.match(/\n\n(?:Sources?|References?|Links?|Further Reading):\s*\n([\s\S]+)$/i);
  let mainText = text;

  if (sourcesMatch) {
    mainText = text.slice(0, text.length - sourcesMatch[0].length).trim();
    const sourcesBlock = sourcesMatch[1];

    // Extract markdown links: [Title](URL)
    const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    let match;
    while ((match = linkPattern.exec(sourcesBlock)) !== null) {
      citations.push({ title: match[1], url: match[2] });
    }

    // Also extract bare URLs
    const bareUrlPattern = /https?:\/\/[^\s\)]+/g;
    const usedUrls = new Set(citations.map((c) => c.url));
    let bareMatch;
    while ((bareMatch = bareUrlPattern.exec(sourcesBlock)) !== null) {
      const url = bareMatch[0].replace(/[.,;]+$/, "");
      if (!usedUrls.has(url)) {
        citations.push({ title: url, url });
        usedUrls.add(url);
      }
    }
  }

  return { mainText, citations };
}
