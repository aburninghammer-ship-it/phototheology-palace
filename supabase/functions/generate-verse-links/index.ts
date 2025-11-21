import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Palace principles that rotate
const PALACE_PRINCIPLES = [
  { type: "dimension", values: ["1D (Literal)", "2D (Christ)", "3D (Me)", "4D (Church)", "5D (Heaven)"] },
  { type: "horizon", values: ["1H (Babylon/Restoration)", "2H (70 AD/New Covenant)", "3H (Final New Creation)"] },
  { type: "cycle", values: ["@Ad (Adamic)", "@No (Noahic)", "@Ab (Abrahamic)", "@Mo (Mosaic)", "@Cy (Cyrusic)", "@CyC (Cyrus-Christ)", "@Sp (Holy Spirit)", "@Re (Remnant)"] },
  { type: "wall", values: ["Sanctuary Wall", "Life of Christ Wall", "Great Controversy Wall", "Time-Prophecy Wall"] },
  { type: "sanctuary", values: ["Gate", "Altar", "Laver", "Lampstand", "Table", "Incense", "Veil", "Ark"] },
  { type: "feast", values: ["Passover", "Unleavened Bread", "Firstfruits", "Pentecost", "Trumpets", "Atonement", "Tabernacles"] }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, verse, verseText } = await req.json();

    if (!book || !chapter || !verse || !verseText) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Select 2-3 random principles for this request
    const shuffled = [...PALACE_PRINCIPLES].sort(() => Math.random() - 0.5);
    const selectedPrinciples = shuffled.slice(0, 2 + Math.floor(Math.random() * 2)); // 2-3 principles
    
    const principlesText = selectedPrinciples.map(p => 
      `${p.type}: ${p.values.join(", ")}`
    ).join("\n");

    const systemPrompt = `You are a Phototheology Bible study assistant. Your task is to find 4-8 verses that connect to the given verse through specific palace principles.

PALACE PRINCIPLES TO USE FOR THIS REQUEST:
${principlesText}

For each linked verse you provide:
1. Choose ONE of the above principles as the connection type
2. Provide the verse reference (Book Chapter:Verse)
3. Give a 1-2 sentence explanation of HOW this verse connects through that specific principle
4. Be specific and clear about the principle being applied

Example format:
{
  "links": [
    {
      "reference": "John 1:29",
      "principle": "Sanctuary Wall - Altar",
      "explanation": "Just as the altar was where the lamb was sacrificed for sin, John identifies Jesus as 'the Lamb of God who takes away the sin of the world,' connecting the sanctuary's sacrificial system to Christ's ultimate sacrifice."
    }
  ]
}`;

    const userPrompt = `Find 4-8 verses that connect to this verse through the palace principles provided:

Reference: ${book} ${chapter}:${verse}
Text: "${verseText}"

Return ONLY valid JSON with this structure (no markdown, no code blocks):
{
  "links": [
    {
      "reference": "Book Chapter:Verse",
      "principle": "principle name from the list",
      "explanation": "clear explanation of the connection"
    }
  ]
}`;

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
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error("AI Gateway request failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    let parsedLinks;
    try {
      // Remove markdown code blocks if present
      let cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Sanitize by removing/escaping control characters
      cleanContent = cleanContent.replace(/[\u0000-\u001F\u007F-\u009F]/g, (char: string) => {
        const replacements: Record<string, string> = {
          '\n': '\\n',
          '\r': '\\r',
          '\t': '\\t',
          '\b': '\\b',
          '\f': '\\f'
        };
        return replacements[char] || '';
      });
      
      parsedLinks = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content.substring(0, 500));
      throw new Error(`Invalid JSON response from AI: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    // Validate and limit to 4-8 links
    const links = parsedLinks.links || [];
    const validatedLinks = links.slice(0, 8).map((link: any) => ({
      reference: link.reference || "Unknown",
      principle: link.principle || "General Connection",
      explanation: link.explanation || "Connection found through palace principles."
    }));

    return new Response(
      JSON.stringify({ links: validatedLinks }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in generate-verse-links:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
