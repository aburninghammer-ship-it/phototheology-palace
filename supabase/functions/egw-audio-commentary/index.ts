import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";
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
    const {
      bookId,
      bookTitle,
      chapterNumber,
      chapterTitle,
      paragraphs,
      mode,
      commentaryMode = "Epic",
      commentaryLength = "Medium",
      commentaryLevel = "Intermediate"
    } = await req.json();

    if (!bookId || !chapterNumber || !chapterTitle || !bookTitle) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache (include mode, length, and level in cache key)
    const cacheKey = `${bookId}_ch${chapterNumber}_${mode || 'chapter'}_${commentaryMode}_${commentaryLength}_${commentaryLevel}`;
    const { data: cached } = await supabase
      .from("egw_chapter_cache")
      .select("paragraphs")
      .eq("book_id", cacheKey)
      .eq("chapter_number", 0) // use 0 for commentary entries
      .maybeSingle();

    if (cached?.paragraphs && Array.isArray(cached.paragraphs) && cached.paragraphs.length > 0) {
      return new Response(
        JSON.stringify({ commentary: cached.paragraphs, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Build chapter context from paragraphs if available
    const chapterContext = paragraphs && paragraphs.length > 0
      ? paragraphs.map((p: string, i: number) => `[¶${i + 1}] ${p}`).join("\n\n")
      : `Chapter ${chapterNumber}: "${chapterTitle}" from ${bookTitle}`;

    const isChapterMode = mode !== 'paragraph';

    // COTA Audio Commentary Master Prompt (Jeeves)
    let systemPrompt = `ROLE
You are "Jeeves," the Phototheology Suite's audio commentary engine for Ellen G. White's Conflict of the Ages (COTA) series.
Your job is to produce faithful, Scripture-saturated, Adventist-guardrailed audio commentary on an EGW paragraph (or short paragraph cluster).
You do NOT replace Ellen White. You do NOT speculate beyond what the paragraph supports. You do NOT preach at the listener.
You DO: clarify meaning, connect Scripture, apply Phototheology (PT) principles, and (when relevant) provide apologetics-ready framing.

NON-NEGOTIABLE GUARDRAILS
1) SCRIPTURE FIRST. Ellen White is a faithful witness; Scripture is the final authority.
2) SDA HISTORICIST FRAME. Keep Great Controversy / sanctuary / three angels' messages / law & gospel harmony consistent with SDA doctrine.
3) NO FABRICATION. Never invent EGW quotes, historical facts, or verse content. If unsure, speak conditionally and label uncertainty.
4) NO "NEW DOCTRINE." Do not introduce doctrines not supported by Scripture/EGW paragraph context.
5) NO CHEATING SERMONS. Preacher Mode may suggest "preaching angles" and "tensions," but must not generate a full sermon outline or manuscript.
6) RESPECTFUL TONE. No mocking, no partisan politics, no sensationalism.
7) AUDIO FRIENDLY. Short sentences, clear transitions, no dense citations in the spoken flow.

OUTPUT FORMAT
Return a JSON array of commentary strings. Each string is one complete audio section (150-300 words).
Use simple transitions between sections: "Paragraph Focus", "Scripture Frame", "PT Lens", "So What?"
No bullet points, no headers within the text — pure flowing prose suitable for text-to-speech.

CORE WORKFLOW (DO THIS EVERY TIME)
A) PARAPHRASE THE PARAGRAPH - Give a one-sentence "Paragraph Focus" summary in plain language, faithful to EGW.
B) SCRIPTURE FRAME - Choose 1-3 KJV Scripture anchors that match the paragraph theme. Say "Scripture echoes this in…"
C) PT LENS (LIGHTWEIGHT BUT REAL) - Apply 2-4 PT principles/rooms appropriate to the paragraph: Story Room, Dimensions Room, War Room, Sanctuary Room, Time-Zone Room, Character Room, Mirror Room
D) APPLICATION ("SO WHAT?") - Provide 2-3 actionable reflections: belief, habit, decision, or watch-out. Keep it pastoral, not moralistic.

AUTO MODE (SMART MODE SELECTION)
Choose the best commentary approach based on paragraph type:
- Narrative / conflict / persecution / crisis => Epic (Great Controversy Lens)
- Heavy history / dates / institutions / church-state => Scholar (Historical-Theological Lens)
- Motives / fear / compromise / discipleship drift => Counselor (Psychological & Spiritual Formation Lens)
- OT typology / sanctuary / prophets / covenant => Ancient (Biblical-Prophetic Continuity Lens)
- Strong doctrinal claim likely attacked => Defense (Apologetics & Objections Lens)

PT PRINCIPLE MENU (SELECT 2-4 THAT FIT):
- Story Room: What is happening? Who is acting? What is the turning point?
- Dimensions Room: Literal → Christ → Me → Church → Heaven
- War Room: Tactics of deception vs tactics of truth
- Sanctuary Room: altar/laver/bread/lamp/incense/ark/atonement motifs
- Time-Zone Room: past fulfillment / present principle / future implication
- Character Room: virtues/vices formed by choices under pressure
- Mirror Room: self-examination questions

QUALITY CHECK (SILENT)
- Did I stay faithful to EGW paragraph meaning?
- Did I keep SDA guardrails intact?
- Did I avoid invented facts?
- Did I make it audio-friendly?
- Did I apply PT principles concretely?`;

    const userPrompt = isChapterMode
      ? `Create audio commentary for this entire EGW chapter. Divide into 6-10 flowing sections that walk through the chapter sequentially.

INPUTS:
- BOOK: ${bookTitle}
- CHAPTER: ${chapterNumber} - "${chapterTitle}"
- USER_MODE: ${commentaryMode}
- USER_LEVEL: ${commentaryLevel}
- LENGTH_TARGET: ${commentaryLength}

CHAPTER CONTENT:
${chapterContext}

Return a JSON array of 6-10 commentary strings. Each string is one complete section (150-300 words).
Follow the CORE WORKFLOW for each major theme/paragraph cluster:
1. Paragraph Focus (summary)
2. Scripture Frame (KJV verses)
3. PT Lens (2-4 principles)
4. So What? (application)

${commentaryMode === "Auto"
  ? "Walk through the chapter sequentially, using Auto mode to adapt your approach to each paragraph's content."
  : `Apply the ${commentaryMode} mode lens throughout the entire commentary.`
}`
      : `Create focused audio commentary for this EGW paragraph.

INPUTS:
- BOOK: ${bookTitle}
- CHAPTER: ${chapterNumber} - "${chapterTitle}"
- PARAGRAPH: See below
- USER_MODE: ${commentaryMode}
- USER_LEVEL: ${commentaryLevel}
- LENGTH_TARGET: ${commentaryLength}

PARAGRAPH:
${chapterContext}

Return a JSON array of 2-4 commentary strings (150-250 words each).
Follow the CORE WORKFLOW:
1. Paragraph Focus
2. Scripture Frame
3. PT Lens
4. So What?`;

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: `Ellen White ${bookTitle} ${chapterTitle} ${chapterNumber}`.slice(0, 4000),
      matchCount: 3,
      supabaseClient: supabase,
    });
    if (ragResult.chunkCount > 0) {
      systemPrompt += ragResult.corpusContext;
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
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
          max_tokens: 8000,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("Failed to generate commentary");
    }

    const data = await response.json();
    const rawText = data?.choices?.[0]?.message?.content;

    if (!rawText) throw new Error("No content returned from AI");

    let commentary: string[];
    try {
      let cleanText = rawText.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
      }
      commentary = JSON.parse(cleanText);
      if (!Array.isArray(commentary)) throw new Error("Not an array");
      commentary = commentary.filter((p: string) => typeof p === "string" && p.trim().length > 0);
    } catch {
      commentary = rawText
        .split(/\n\n+/)
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 50);
    }

    if (commentary.length === 0) throw new Error("No commentary generated");

    // Cache for chapter mode only
    if (isChapterMode) {
      await supabase
        .from("egw_chapter_cache")
        .upsert({
          book_id: cacheKey,
          chapter_number: 0,
          chapter_title: `Commentary: ${chapterTitle}`,
          paragraphs: commentary,
        }, { onConflict: "book_id,chapter_number" });
    }

    return new Response(
      JSON.stringify({ commentary, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("egw-audio-commentary error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Failed to generate commentary" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
