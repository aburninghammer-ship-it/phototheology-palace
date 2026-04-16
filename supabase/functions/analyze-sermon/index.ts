import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getContentBehavioralEngine } from "../_shared/content-behavioral-engine.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// SDA Doctrinal Framework for AI analysis
const SDA_DOCTRINAL_FRAMEWORK = `
You are analyzing a sermon from Pastor Ivor Myers for the Phototheology/Living Manna church community.

DOCTRINAL CONTEXT (Seventh-day Adventist):
- Sabbath: Saturday observance as the seventh-day Sabbath
- Sanctuary: Christ's ministry in the heavenly sanctuary
- Second Coming: Literal, visible, imminent return of Christ
- State of the Dead: Death as unconscious sleep until resurrection
- Three Angels' Messages: Revelation 14:6-12 as end-time proclamation
- Investigative Judgment: Pre-advent judgment beginning 1844
- Remnant: God's end-time church keeping commandments and having testimony of Jesus
- Great Controversy: Cosmic conflict between Christ and Satan
- Health Message: Body as temple, health principles
- Spirit of Prophecy: Prophetic gift through Ellen White

PALACE ROOM MAPPING (Phototheology System):
- Story Room: Storage through visualization — narrative collection, vivid scene storage, story furnishing
- Detective Room: Close reading, word studies, textual analysis
- Freestyle Room: Personal connections, creative applications
- Christ-Centered Room: Christological focus, typology of Christ
- Prophecy Room: Prophetic interpretation, eschatology
- Cosmos Room: Cosmological themes, great controversy
- Sanctuary Room: Sanctuary doctrine, priestly ministry
- Mathematics Room: Numbers, patterns, biblical numerology
- Typology Room: Types and antitypes, shadows and fulfillments

ANALYSIS GUIDELINES:
1. Scripture references must be explicit vs. inferred - mark confidence levels
2. Doctrinal alignment should note if teaching is core SDA, distinctive SDA, or general Christian
3. Flag any claims that may need pastoral review (mark as "review_needed")
4. Connect insights to Palace rooms where applicable
5. Generate questions that promote deeper study, not just recall
`;

// Clean transcript by removing filler words and normalizing
function cleanTranscript(rawText: string): string {
  return rawText
    // Remove common filler words (optional, keep if meaning changes)
    .replace(/\b(um|uh|you know|like|basically|actually|literally|so|well)\b,?\s*/gi, "")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    // Fix common transcription errors
    .replace(/\bi\b/g, "I")
    // Normalize punctuation
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
}

// Segment transcript into chunks with estimated timestamps
function segmentTranscript(
  text: string,
  targetSegmentWords: number = 150
): Array<{ index: number; text: string; wordCount: number }> {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const segments: Array<{ index: number; text: string; wordCount: number }> = [];

  let currentSegment = "";
  let currentWordCount = 0;
  let segmentIndex = 0;

  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().split(/\s+/).length;

    if (currentWordCount + sentenceWords > targetSegmentWords && currentSegment) {
      segments.push({
        index: segmentIndex++,
        text: currentSegment.trim(),
        wordCount: currentWordCount,
      });
      currentSegment = sentence;
      currentWordCount = sentenceWords;
    } else {
      currentSegment += " " + sentence;
      currentWordCount += sentenceWords;
    }
  }

  // Add final segment
  if (currentSegment.trim()) {
    segments.push({
      index: segmentIndex,
      text: currentSegment.trim(),
      wordCount: currentWordCount,
    });
  }

  return segments;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { sermonId } = await req.json();

    if (!sermonId) {
      return new Response(JSON.stringify({ error: "Sermon ID required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get sermon and transcript
    const { data: sermon, error: sermonError } = await supabase
      .from("lm_sermons")
      .select("*")
      .eq("id", sermonId)
      .single();

    if (sermonError || !sermon) {
      return new Response(JSON.stringify({ error: "Sermon not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: transcript } = await supabase
      .from("lm_sermon_transcripts")
      .select("*")
      .eq("sermon_id", sermonId)
      .order("version", { ascending: false })
      .limit(1)
      .single();

    if (!transcript) {
      return new Response(JSON.stringify({ error: "No transcript found for this sermon" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update status to analyzing
    await supabase
      .from("lm_sermons")
      .update({ status: "analyzing" })
      .eq("id", sermonId);

    // Clean and segment transcript
    const cleanedText = cleanTranscript(transcript.raw_text);
    const segments = segmentTranscript(cleanedText);

    // Update transcript with cleaned version
    await supabase
      .from("lm_sermon_transcripts")
      .update({ cleaned_text: cleanedText })
      .eq("id", transcript.id);

    // Save segments to database
    const segmentInserts = segments.map((seg) => ({
      sermon_id: sermonId,
      segment_index: seg.index,
      segment_text: seg.text,
      word_count: seg.wordCount,
    }));

    await supabase.from("lm_sermon_segments").delete().eq("sermon_id", sermonId);
    await supabase.from("lm_sermon_segments").insert(segmentInserts);

    // Get saved segments with IDs
    const { data: savedSegments } = await supabase
      .from("lm_sermon_segments")
      .select("*")
      .eq("sermon_id", sermonId)
      .order("segment_index");

    // =========================================================================
    // AI ANALYSIS - Sermon Map (Structure)
    // =========================================================================
    const sermonMapPrompt = `${SDA_DOCTRINAL_FRAMEWORK}

Analyze this sermon transcript and create a sermon map with 7-12 key "beats" or movements.

SERMON: "${sermon.title}"
TRANSCRIPT:
${cleanedText.substring(0, 8000)}${cleanedText.length > 8000 ? "... [truncated]" : ""}

For each beat, provide:
1. A concise title (5-10 words)
2. The main claim or point being made
3. Scripture anchor(s) if any (explicit references only)
4. The type of content (introduction, scripture_reading, exegesis, doctrine, illustration, application, appeal, conclusion)
5. Which segment numbers it spans (0-indexed)

Also identify:
- The central thesis of the sermon
- 3-5 major themes (with SDA doctrinal tags if applicable)
- Overall doctrinal alignment assessment

Respond in JSON format:
{
  "thesis": "string",
  "beats": [
    {
      "title": "string",
      "claim": "string",
      "scriptures": ["John 3:16"],
      "type": "exegesis",
      "segment_range": [0, 2],
      "importance": 1-10
    }
  ],
  "themes": [
    {
      "theme": "string",
      "sda_tag": "sabbath|sanctuary|second_coming|etc|null",
      "centrality": 1-100,
      "segments": [0, 3, 5]
    }
  ],
  "doctrinal_assessment": {
    "alignment": "aligned|supported|neutral|caution|review_needed",
    "notes": "string",
    "flags": []
  }
}`;

    const mapResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a theological analyst specializing in SDA doctrine and sermon structure. Always respond with valid JSON." },
          { role: "user", content: sermonMapPrompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    const mapData = await mapResponse.json();
    const sermonMap = JSON.parse(mapData.choices[0].message.content);

    // =========================================================================
    // AI ANALYSIS - Scripture Extraction
    // =========================================================================
    const scripturePrompt = `${SDA_DOCTRINAL_FRAMEWORK}

Extract ALL scripture references from this sermon transcript.

TRANSCRIPT:
${cleanedText.substring(0, 10000)}

For each reference, identify:
1. The exact reference (book, chapter, verse)
2. Whether it was EXPLICITLY quoted/cited or IMPLICITLY alluded to
3. The context in which it was used
4. Confidence level (0.0 to 1.0)
5. Which segment number it appears in (estimate based on position)

IMPORTANT: Be conservative with implicit references. Only mark as implicit if there's strong textual evidence.

Respond in JSON:
{
  "scriptures": [
    {
      "reference": "John 3:16",
      "book": "John",
      "chapter": 3,
      "verse_start": 16,
      "verse_end": 16,
      "type": "explicit_quote|explicit_cite|implicit_allusion",
      "quoted_text": "For God so loved...",
      "context": "Used to illustrate God's love",
      "confidence": 0.95,
      "estimated_segment": 5
    }
  ]
}`;

    const scriptureResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a biblical scholar. Extract scripture references accurately. Always respond with valid JSON." },
          { role: "user", content: scripturePrompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    const scriptureData = await scriptureResponse.json();
    const scriptures = JSON.parse(scriptureData.choices[0].message.content);

    // =========================================================================
    // AI ANALYSIS - Questions Generation
    // =========================================================================
    const questionsPrompt = `${SDA_DOCTRINAL_FRAMEWORK}

Generate study questions for this sermon that promote deep engagement.

SERMON: "${sermon.title}"
THESIS: ${sermonMap.thesis}
KEY THEMES: ${sermonMap.themes.map((t: any) => t.theme).join(", ")}

Generate 12-16 questions across these categories:
1. Personal Reflection (3-4): Questions that help internalize the message
2. Bible Study (4-5): Questions that drive deeper into scripture
3. Group Discussion (3-4): Questions for House Fire/small group discussion
4. Decision/Appeal (2-3): Questions that lead to commitment or action

For each question:
- Make it specific to this sermon's content
- Reference specific claims or scriptures from the sermon
- Avoid simple yes/no or recall questions
- Include at least one question that connects to Palace room study

Respond in JSON:
{
  "questions": [
    {
      "type": "reflection|study|discussion|decision",
      "question": "string",
      "related_beat": 0,
      "scripture_connection": "John 3:16",
      "palace_room": "Sanctuary|null",
      "difficulty": "basic|intermediate|advanced"
    }
  ]
}`;

    const questionsResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an expert Bible study curriculum developer. Create questions that transform understanding into application. Always respond with valid JSON." },
          { role: "user", content: questionsPrompt },
        ],
        temperature: 0.5,
        response_format: { type: "json_object" },
      }),
    });

    const questionsData = await questionsResponse.json();
    const questions = JSON.parse(questionsData.choices[0].message.content);

    // =========================================================================
    // SAVE RESULTS TO DATABASE
    // =========================================================================

    // Clear existing insights for this sermon
    await supabase.from("lm_sermon_insights").delete().eq("sermon_id", sermonId);
    await supabase.from("lm_sermon_scriptures").delete().eq("sermon_id", sermonId);

    // Save sermon beats as insights
    const beatInsights = sermonMap.beats.map((beat: any, idx: number) => ({
      sermon_id: sermonId,
      segment_ids: savedSegments
        ?.filter((s: any) =>
          s.segment_index >= (beat.segment_range?.[0] || 0) &&
          s.segment_index <= (beat.segment_range?.[1] || 0)
        )
        .map((s: any) => s.id) || [],
      insight_type: "sermon_beat",
      title: beat.title,
      content: beat.claim,
      importance_score: beat.importance * 10,
      confidence: 0.8,
      palace_rooms: beat.scriptures?.length > 0 ? ["Scripture", "Christ-Centered"] : [],
    }));

    // Save themes as insights
    const themeInsights = sermonMap.themes.map((theme: any) => ({
      sermon_id: sermonId,
      segment_ids: savedSegments
        ?.filter((s: any) => theme.segments?.includes(s.segment_index))
        .map((s: any) => s.id) || [],
      insight_type: theme.centrality > 50 ? "theme_major" : "theme_minor",
      title: theme.theme,
      content: `Central theme (${theme.centrality}% centrality)${theme.sda_tag ? ` - SDA Doctrine: ${theme.sda_tag}` : ""}`,
      importance_score: theme.centrality,
      confidence: 0.75,
      doctrinal_alignment: theme.sda_tag ? "aligned" : "neutral",
    }));

    // Save questions as insights
    const questionInsights = questions.questions.map((q: any) => ({
      sermon_id: sermonId,
      segment_ids: [],
      insight_type: `question_${q.type}`,
      content: q.question,
      palace_rooms: q.palace_room ? [q.palace_room] : [],
      confidence: 0.9,
    }));

    await supabase.from("lm_sermon_insights").insert([
      ...beatInsights,
      ...themeInsights,
      ...questionInsights,
    ]);

    // Save scripture references
    const scriptureInserts = scriptures.scriptures.map((s: any) => ({
      sermon_id: sermonId,
      segment_id: savedSegments?.find((seg: any) => seg.segment_index === s.estimated_segment)?.id,
      book: s.book,
      chapter: s.chapter,
      verse_start: s.verse_start,
      verse_end: s.verse_end || s.verse_start,
      reference_text: s.reference,
      reference_type: s.type,
      quoted_text: s.quoted_text,
      confidence: s.confidence,
    }));

    await supabase.from("lm_sermon_scriptures").insert(scriptureInserts);

    // Update sermon status based on doctrinal assessment
    // Use "complete" for successful analysis, "review_required" for flagged content
    const finalStatus = sermonMap.doctrinal_assessment?.alignment === "review_needed"
      ? "review_required"
      : "complete";

    await supabase
      .from("lm_sermons")
      .update({
        status: finalStatus,
        doctrinal_flags: sermonMap.doctrinal_assessment?.flags || [],
      })
      .eq("id", sermonId);

    return new Response(JSON.stringify({
      success: true,
      sermon_id: sermonId,
      analysis: {
        thesis: sermonMap.thesis,
        beats_count: sermonMap.beats.length,
        themes_count: sermonMap.themes.length,
        scriptures_count: scriptures.scriptures.length,
        questions_count: questions.questions.length,
        doctrinal_status: finalStatus,
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-sermon:", error);
    return new Response(JSON.stringify({ error: "Analysis failed", details: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
