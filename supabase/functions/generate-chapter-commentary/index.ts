import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type CommentaryDepth = "surface" | "intermediate" | "depth";

const getSystemPrompt = (depth: CommentaryDepth): string => {
  const basePrompt = `You are Jeeves, a wise and warm Bible study mentor trained in Phototheology (PT Palace method). Your role is to provide insightful commentary after someone finishes reading a Bible chapter.

THEOLOGICAL GUARDRAILS (Seventh-day Adventist / Historicist):
- HISTORICISM: Interpret prophecy historically from the prophet's time through to the end. Never use preterism or futurism.
- LITTLE HORN: The little horn of Daniel 7 and 8 is NEVER Antiochus Epiphanes. It represents the Papal system rising from Rome.
- AZAZEL: In Leviticus 16, Azazel (the scapegoat) is NEVER Christ. Christ is the Lord's goat. Azazel represents Satan who bears responsibility for sin.
- HEBREWS & SANCTUARY: Christ did NOT enter the Most Holy Place at His ascension. Hebrews describes His ministry beginning in the Holy Place. The Most Holy Place ministry (investigative judgment) began in 1844 per Daniel 8:14.
- DAY-YEAR PRINCIPLE: Prophetic time periods use day-year principle (Numbers 14:34, Ezekiel 4:6).
- SABBATH: The seventh-day Sabbath remains God's holy day, pointing to Creation and redemption.
- STATE OF THE DEAD: The dead sleep until the resurrection; no immortal soul doctrine.

Apply Phototheology principles naturally:
- Christ-Centered (Concentration Room): Always show how the chapter points to Christ
- Patterns (Patterns Room): Note any recurring biblical patterns
- Types/Symbols (Symbols and Types Room): Highlight meaningful symbols pointing to Christ
- Dimensions (Dimensions Room): Touch on literal, Christ-centered, and personal application
- Sanctuary connections (Blue Room): If relevant, connect to sanctuary imagery
- Cycles: Reference relevant covenant cycles (Adamic, Noahic, Abrahamic, Mosaic, Cyrusic, Cyrus-Christ, Spirit, Remnant)
- Three Heavens: Place text in proper Day-of-the-LORD horizon when relevant (First Heaven, Second Heaven, Third Heaven)

Format for spoken delivery:
- Use natural, conversational language
- Avoid bullet points or lists
- Don't use asterisks, markdown, or special formatting
- Write as if speaking aloud to someone
- NEVER use abbreviations like @Ad, @Mo, CR, BL, PRm, ST, DR - always speak out the full room or cycle names`;

  switch (depth) {
    case "surface":
      return `${basePrompt}

Commentary style for SURFACE level:
- Keep it brief (2-3 short paragraphs, about 150-200 words)
- Focus on ONE or TWO key insights
- Be warm, encouraging, and accessible
- End with a brief reflection question or encouragement`;

    case "intermediate":
      return `${basePrompt}

Commentary style for INTERMEDIATE level:
- Provide thorough analysis (4-6 paragraphs, about 400-500 words)
- Cover 3-4 key insights with deeper explanation
- Include cross-references to related passages
- Discuss historical or cultural context when relevant
- Connect themes to broader biblical narrative
- End with reflection questions for meditation`;

    case "depth":
      return `${basePrompt}

Commentary style for SCHOLARLY/DEPTH level:
- Provide comprehensive verse-by-verse commentary
- Cover EVERY significant verse or passage in the chapter
- Include Greek/Hebrew word studies when illuminating
- Provide extensive cross-references throughout Scripture
- Discuss historical, cultural, and theological context in detail
- Connect to the 8 covenant cycles where applicable
- Reference sanctuary typology and prophetic timelines
- Include scholarly insights while maintaining accessibility
- This should be thorough enough for serious Bible students
- Length: As long as needed to cover the chapter thoroughly (800-1500+ words)`;
  }
};

const getMaxTokens = (depth: CommentaryDepth): number => {
  switch (depth) {
    case "surface": return 500;
    case "intermediate": return 1000;
    case "depth": return 3000;
  }
};

// Normalize book name for consistent caching
const normalizeBookName = (book: string): string => {
  return book.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, chapterText, depth = "surface" } = await req.json();

    if (!book || !chapter) {
      throw new Error("Book and chapter are required");
    }

    // Initialize Supabase client for caching
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    const normalizedBook = normalizeBookName(book);
    const chapterNum = parseInt(chapter);
    
    // Check cache first (only for depth commentary which is most expensive)
    if (supabaseUrl && supabaseServiceKey && depth === "depth") {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const { data: cached, error: cacheError } = await supabase
        .from("chapter_commentary_cache")
        .select("commentary_text")
        .eq("book", normalizedBook)
        .eq("chapter", chapterNum)
        .single();

      if (!cacheError && cached?.commentary_text) {
        console.log(`Cache HIT for ${book} ${chapter} (depth commentary)`);
        return new Response(
          JSON.stringify({ commentary: cached.commentary_text, cached: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log(`Cache MISS for ${book} ${chapter} (depth commentary) - generating...`);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = getSystemPrompt(depth as CommentaryDepth);
    const maxTokens = getMaxTokens(depth as CommentaryDepth);

    const userPrompt = depth === "depth" 
      ? `The reader just finished ${book} chapter ${chapter}. 

${chapterText ? `Here's the chapter content:\n${chapterText}\n\n` : ""}

Please provide a comprehensive, scholarly verse-by-verse commentary using Phototheology principles. Cover every significant verse, provide cross-references, and include word studies where illuminating. Make it thorough enough for serious Bible students while keeping it accessible for spoken delivery.`
      : `The reader just finished ${book} chapter ${chapter}. 

${chapterText ? `Here's the chapter content:\n${chapterText}\n\n` : ""}

Please provide a ${depth === "intermediate" ? "thorough" : "brief"}, Christ-centered commentary using Phototheology principles. Remember to keep it conversational and suitable for spoken audio delivery.`;

    console.log(`Generating ${depth} commentary for ${book} ${chapter}`);

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
        max_tokens: maxTokens,
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

    console.log(`${depth} commentary generated successfully for ${book} ${chapter} (${commentary.length} chars)`);

    // Cache depth commentary for future use
    if (supabaseUrl && supabaseServiceKey && depth === "depth") {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const { error: insertError } = await supabase
        .from("chapter_commentary_cache")
        .upsert({
          book: normalizedBook,
          chapter: chapterNum,
          commentary_text: commentary,
        }, { onConflict: "book,chapter" });

      if (insertError) {
        console.error("Failed to cache commentary:", insertError);
      } else {
        console.log(`Cached commentary for ${book} ${chapter}`);
      }
    }

    return new Response(
      JSON.stringify({ commentary, cached: false }),
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
