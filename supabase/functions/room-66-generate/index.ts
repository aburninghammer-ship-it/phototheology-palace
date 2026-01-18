import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
  '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, verse, inputMode } = await req.json();

    // Handle verse input - extract theme from verse
    let effectiveTheme = theme?.trim();
    let verseContext = "";

    if (inputMode === "verse" && verse?.trim()) {
      verseContext = `Based on the verse "${verse}", identify the central theological theme and trace it through Scripture. `;
      effectiveTheme = verse.trim(); // Will be used in the prompt differently
    } else if (!effectiveTheme) {
      return new Response(
        JSON.stringify({ error: "Theme or verse is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const themeOrVerseInstruction = inputMode === "verse"
      ? `First, read and understand the verse "${effectiveTheme}". Identify the CENTRAL theological theme of this verse (e.g., God's love, redemption, faith, covenant, etc.). Then trace that theme through ALL 66 books of the Bible.`
      : `Your task is to trace the theme "${effectiveTheme}" through ALL 66 books of the Bible.`;

    const systemPrompt = `You are an expert Bible scholar specializing in Phototheology. ${themeOrVerseInstruction}

For each book, provide:
1. A claim (max 14 words) stating how the theme appears in that book
2. A proof text (specific verse reference)
3. PT tags (Phototheology room codes like CR, ST, BL, DR, PR, TZ, etc.)

Also provide:
- A description (1 sentence explaining the theme)
- A constellation (100-120 words synthesizing how the theme develops from OT to NT)

Return ONLY valid JSON in this exact format:
{
  "id": "theme-slug",
  "theme": "The identified theme name",
  "sourceVerse": "${inputMode === "verse" ? effectiveTheme : ""}",
  "description": "One sentence description",
  "difficulty": "intermediate",
  "constellation": "100-120 word synthesis...",
  "books": [
    {"book": "Genesis", "claim": "max 14 words claim", "proofText": "Genesis 1:1", "ptTags": ["CR", "ST"]},
    ... (all 66 books)
  ]
}`;

    const userMessage = inputMode === "verse"
      ? `Read the verse "${effectiveTheme}" and identify its central theme. Then trace that theme through all 66 books of the Bible. Be thorough and scholarly. Return ONLY the JSON, no markdown.`
      : `Trace the theme "${effectiveTheme}" through all 66 books of the Bible. Be thorough and scholarly. Return ONLY the JSON, no markdown.`;

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
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
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
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from response (handle potential markdown wrapping)
    let themeData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        themeData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      throw new Error("Failed to parse AI response");
    }

    // Validate the response has all 66 books
    if (!themeData.books || themeData.books.length !== 66) {
      console.warn("Expected 66 books, got:", themeData.books?.length);
      // Fill in missing books if needed
      if (themeData.books && themeData.books.length < 66) {
        const existingBooks = new Set(themeData.books.map((b: any) => b.book));
        const themeLabel = themeData.theme || effectiveTheme;
        for (const book of BIBLE_BOOKS) {
          if (!existingBooks.has(book)) {
            themeData.books.push({
              book,
              claim: `The theme of ${themeLabel} echoes throughout ${book}`,
              proofText: `${book} 1:1`,
              ptTags: ["CR"]
            });
          }
        }
        // Sort by canonical order
        themeData.books.sort((a: any, b: any) => 
          BIBLE_BOOKS.indexOf(a.book) - BIBLE_BOOKS.indexOf(b.book)
        );
      }
    }

    return new Response(
      JSON.stringify({ theme: themeData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Room 66 generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Generation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
