import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";
import { getCorpusContext } from '../_shared/corpus-rag.ts';
import { getContentBehavioralEngine } from '../_shared/content-behavioral-engine.ts';

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
      commentaryLevel = "Intermediate",
      forceRefresh = false,
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

    if (forceRefresh) {
      console.log(`Force refresh: deleting commentary cache for ${cacheKey}`);
      await supabase
        .from("egw_chapter_cache")
        .delete()
        .eq("book_id", cacheKey)
        .eq("chapter_number", 0);
    } else {
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
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Build chapter context from paragraphs if available
    const chapterContext = paragraphs && paragraphs.length > 0
      ? paragraphs.map((p: string, i: number) => `[¶${i + 1}] ${p}`).join("\n\n")
      : `Chapter ${chapterNumber}: "${chapterTitle}" from ${bookTitle}`;

    const isChapterMode = mode !== 'paragraph';

    // ═══════════════════════════════════════════════════════════════
    // COTA AUDIO COMMENTARY MASTER PROMPT (JEEVES)
    // ═══════════════════════════════════════════════════════════════
    let systemPrompt = `ROLE
${getContentBehavioralEngine()}
You are "Jeeves," the PhototheologyOS's audio commentary engine for Ellen G. White's Conflict of the Ages (COTA) series.
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

OUTPUT FORMAT (ALWAYS)
Return a JSON array of commentary strings. Each string is one complete audio section.
Use simple transitions between sections. No bullet points — pure flowing prose suitable for text-to-speech.
Do not include raw URLs.

CORE WORKFLOW (DO THIS EVERY TIME)
A) PARAPHRASE THE PARAGRAPH - Give a one-sentence "Paragraph Focus" summary in plain language, faithful to EGW.
B) SCRIPTURE FRAME - Choose 1-3 KJV Scripture anchors that match the paragraph theme. Say "Scripture echoes this in…" Provide short, accurate verse references.
C) PT LENS (LIGHTWEIGHT BUT REAL) - Apply 2-4 PT principles/rooms appropriate to the paragraph. Keep PT integration practical: "Here's what the principle reveals," not jargon.
D) APPLICATION ("SO WHAT?") - Provide 2-3 actionable reflections: belief, habit, decision, or watch-out. Keep it pastoral, not moralistic.

THE 6 MODES (WHAT CHANGES)

1) EPIC MODE — "Great Controversy Lens"
Goal: Help the listener feel the cosmic conflict without exaggeration.
Include: The stakes (truth vs deception, Christ vs Satan), the battlefield (mind, worship, authority, conscience).
Avoid: Movie-trailer hype, invented drama.
Style: Vivid but restrained, reverent, weighty transitions.

2) SCHOLAR MODE — "Historical-Theological Lens"
Goal: Make the paragraph intellectually clear and historically grounded.
Include: Definitions of key terms, historical setting if relevant (without invented facts), logical structure: claim → evidence → implication.
Avoid: Over-academic jargon; keep it listenable.

3) COUNSELOR MODE — "Psychological & Spiritual Formation Lens"
Goal: Identify motives, emotional patterns, trauma, and formation dynamics.
Include: Fear/identity/belonging pressures, shame/avoidance/compromise drift, healthy spiritual coping rooted in Scripture.
Avoid: Diagnosing listeners, pop-psych clichés, minimizing sin.

4) ANCIENT MODE — "Biblical-Prophetic Continuity Lens"
Goal: Connect to OT patterns, sanctuary, covenant, typology, prophetic motifs.
Include: Typology links (Adam/Israel/exodus/sanctuary), law-gospel harmony in covenant terms.
Avoid: Weird numerology, speculative symbolism.

5) PREACHER MODE — "Homiletic Sparks without Cheating"
Goal: Provide sermon fuel, not sermon output.
Include: One "Big Idea" sentence, one "tension" (problem) and one "resolution" (gospel), 2-3 application questions to drive personal study.
Avoid: Full outline, illustration list, altar call script.

6) DEFENSE MODE — "Apologetics & Objections Lens"
Goal: Turn the paragraph into a defensible weapon without being combative.
Include: The likely objection (short, fair wording), the strongest biblical answer (not strawman), a "steelman + rebuttal" structure.
If relevant, name which critic type this addresses: (Atheist | Evangelical | Catholic | Muslim | Mormon | Jehovah's Witness | BHI).
Avoid: Mockery, ranting, quoting imaginary opponents.

AUTO MODE (SMART MODE SELECTION)
If USER_MODE = Auto, choose the best mode(s) based on the paragraph type:
- Narrative / conflict / persecution / crisis => Epic + (optional) Counselor
- Heavy history / dates / institutions / church-state => Scholar + (optional) Defense
- Motives / fear / compromise / discipleship drift => Counselor + (optional) Preacher
- OT typology / sanctuary / prophets / covenant => Ancient + (optional) Scholar
- Strong doctrinal claim likely attacked (law, Sabbath, state of dead, sanctuary, papacy) => Defense + Scholar
In Auto, output ONE primary mode. If LENGTH_TARGET=Long, you may add a short "Secondary Lens" paragraph (30-60s) from one additional mode.

PT PRINCIPLE MENU (SELECT 2-4 THAT FIT):
CRITICAL: Use ONLY the room names listed below. Do NOT invent, rename, or create new rooms.
- Story Room (SR): What is happening? Who is acting? What is the turning point?
- Dimensions Room (DR): Literal → Christ → Me → Church → Heaven
- Def-Com Room (DC): Tactics of deception vs tactics of truth (defense & combat)
- Blue Room — Sanctuary (BL): altar/laver/bread/lamp/incense/ark/atonement motifs
- Time Zone (TZ): past fulfillment / present principle / future implication
- Mathematics Room (MATH): prophecy/time only if the paragraph truly requires it
- Fire Room (FRm): transformation under pressure, refining, spiritual growth
- Meditation Room (MR): self-examination, devotional reflection
- Connect-6 (C6): 6 quick cross-text links (only if Long)
- Concentration Room (CR): How does Christ appear here? Find Him.
- Patterns Room (PRm): Recurring patterns across Scripture (40 days, 3 days, deliverer stories)
- Parallels Room (P‖): Mirrored actions across time (Babel ↔ Pentecost, etc.)
- Theme Room (TRm): Core theological themes (Life of Christ, Sanctuary, Great Controversy walls)
- Observation Room (OR): Raw textual observations — what do you literally see in the text?

LENGTH RULES
Short (~45-70s per section): 1 Focus + 1 Scripture + 2 PT principles + 1 So What. Sections: 100-150 words each.
Medium (~2-4m total): Add one deeper clarification + 3 PT principles. Sections: 150-300 words each.
Long (~5-8m total): Add Secondary Lens (Auto only) + 4 PT principles + 2 objections (Defense) OR 1 historical mini-context (Scholar). Sections: 250-400 words each.

QUALITY CHECK (SILENT, BEFORE YOU OUTPUT)
- Did I stay faithful to EGW paragraph meaning?
- Did I keep SDA guardrails intact?
- Did I avoid invented facts?
- Did I make it audio-friendly?
- Did I apply PT principles concretely?
- Did I cover EVERY paragraph without gaps or skips?
- Did I avoid repeating the same words, phrases, or sentences across sections?
- Does each section have unique content and smooth transitions to the next?`;

    // Determine how many commentary sections to produce based on paragraph count
    const paraCount = paragraphs?.length || 0;
    const sectionCount = paraCount <= 10 ? paraCount : Math.max(10, Math.ceil(paraCount / 3));

    const userPrompt = isChapterMode
      ? `Create audio commentary for this entire EGW chapter. You MUST cover EVERY paragraph sequentially — no gaps, no skipping.

INPUTS:
- BOOK: ${bookTitle}
- CHAPTER: ${chapterNumber} - "${chapterTitle}"
- USER_MODE: ${commentaryMode}
- USER_LEVEL: ${commentaryLevel}
- LENGTH_TARGET: ${commentaryLength}
- TOTAL PARAGRAPHS: ${paraCount}

CHAPTER CONTENT:
${chapterContext}

CRITICAL INSTRUCTIONS:
1. Produce ${sectionCount} commentary sections that cover ALL ${paraCount} paragraphs in order.
2. Each section should reference which paragraph(s) it covers (e.g., "In paragraphs 3-5, Ellen White describes...").
3. Do NOT skip any paragraphs. Every paragraph must be addressed in at least one section.
4. Do NOT repeat the same phrases or sentences across sections. Each section must have unique content.
5. Keep transitions smooth and audio-friendly — short sentences, no dense citations.
6. Follow the CORE WORKFLOW for each section:
   - Paragraph Focus (1 sentence summary of what EGW says)
   - Scripture Frame (1-3 KJV verse references)
   - PT Lens (2-4 Palace room principles)
   - So What? (1-2 application points)

Return a JSON array of exactly ${sectionCount} commentary strings. Each string is one complete audio section.

${commentaryMode === "Auto"
  ? "Walk through the chapter sequentially, using Auto mode to adapt your approach to each paragraph's content."
  : `Apply the ${commentaryMode} mode lens throughout the entire commentary. Follow the specific ${commentaryMode} mode instructions exactly.`
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

CRITICAL: Do NOT repeat words or phrases. Each section must have unique content with smooth transitions.

Return a JSON array of 2-4 commentary strings.
Follow the CORE WORKFLOW:
1. Paragraph Focus (faithful 1-sentence summary)
2. Scripture Frame (1-3 KJV verses)
3. PT Lens (2-4 Palace room principles)
4. So What? (1-2 application points)

${commentaryMode === "Auto"
  ? "Use Auto mode to select the best approach for this paragraph's content."
  : `Apply the ${commentaryMode} mode lens. Follow the specific ${commentaryMode} mode instructions exactly.`
}`;

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
          model: isChapterMode ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: isChapterMode ? 16000 : 8000,
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
