import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ElevenLabs "William" voice — deep, engaging storyteller
const EPIC_ELEVENLABS_VOICE_ID = "fjnwTZkKtQOJaYzGLa6n";

const THEOLOGICAL_GUARDRAILS = `
MANDATORY THEOLOGICAL GUARDRAILS — violations will be treated as critical errors:

A. DAY OF ATONEMENT: The Day of Atonement is NOT fulfilled in the death of Christ. Christ's death fulfills Passover. The Day of Atonement points prophetically to 1844 and the beginning of the investigative judgment in the heavenly sanctuary. Never conflate the cross with Day of Atonement fulfillment.

B. HEBREWS 8-10 SANCTUARY: Christ entered the FIRST apartment (Holy Place) of the heavenly sanctuary at His ascension, NOT the Most Holy Place. The transition to the Most Holy Place occurs in 1844 per Daniel 8:14. Hebrews references to Christ's ministry must reflect the two-phase sanctuary pattern: Holy Place intercession (ascension to 1844), then Most Holy Place judgment ministry (1844 onward). Never state Christ entered the Most Holy Place at His ascension.

C. DANIEL 7-8: The "little horn" in Daniel 7 and 8 represents the papal system. The 2300-day prophecy (Daniel 8:14) points to 1844 and the cleansing of the heavenly sanctuary (investigative judgment). The four beasts of Daniel 7 are Babylon, Medo-Persia, Greece, and Rome. The "Ancient of Days" scene in Daniel 7:9-14 depicts the pre-advent judgment beginning in 1844, not the Second Coming.

D. DANIEL 11:40-45: The "king of the north" in the final verses represents the papacy in its end-time role. The "whirlwind" attack (v.40) involves Satan working through spiritualism and apostate forces. This is an end-time prophecy, not ancient history. The "glorious holy mountain" (v.45) represents God's true people and His law.

E. REVELATION 13 & APOSTATE PROTESTANTISM: The second beast (earth beast) of Revelation 13 represents the United States. The "image to the beast" is formed when apostate Protestantism unites with civil power to enforce religious legislation. The mark of the beast involves enforced false worship in contrast to God's Sabbath seal. Never soften this identification.

F. REVELATION 9 (SIXTH TRUMPET): The Sixth Trumpet spans 1449 to August 11, 1840, representing the Ottoman Empire period. This historical fulfillment validated the day-for-a-year prophetic principle and directed attention to Daniel 8:14 and 1844.

G. NO DENOMINATIONAL LABELS: Never use "Adventist," "SDA," or any denominational label. Present all theology as "sound biblical teaching" grounded in Scripture.

H. PRE-FLOOD GEOGRAPHY: Before the Flood (Genesis 1-6), Earth's geography was fundamentally different. There were no islands, no separated continents, no oceans as we know them. The world was one connected landmass watered by rivers and mist. Never project post-flood geography (islands, separated continents, ocean barriers) onto pre-flood narratives.

I. GENESIS 6 — SONS OF GOD AND DAUGHTERS OF MEN: The "sons of God" in Genesis 6 are the descendants of Seth — the faithful covenant lineage. The "daughters of men" are the descendants of Cain — the worldly, rebellious lineage. This is NOT an angel-human hybrid narrative. The crisis of Genesis 6 is the mingling of the faithful line with the unfaithful line through intermarriage, which corrupted the earth and precipitated the Flood. Never present the "sons of God" as fallen angels or celestial beings.

J. HISTORICAL-THEOLOGICAL CONSISTENCY: Always ensure descriptions of geography, culture, technology, and society are consistent with the biblical timeline of the passage being narrated. Do not anachronistically import later realities (post-flood, post-Babel, post-exile) into earlier narratives. Consult the weight of conservative biblical scholarship and the spirit of prophecy tradition (without naming sources) for interpretive guidance on contested passages.

K. SPIRIT OF PROPHECY INTERPRETIVE TRADITION: Draw deeply from the following interpretive streams (without ever naming or citing them explicitly) — the great cosmic conflict between Christ and Satan as the metanarrative of history; the lives of patriarchs and prophets as object lessons of faith, failure, and divine patience; the life of Christ as the supreme revelation of the Father's character; the parables of Christ as kingdom-of-grace blueprints; practical godliness as the fruit of justification by faith; and the story of redemption as a single unbroken thread from Eden lost to Eden restored. These sources shape tone, detail, and theological emphasis across all chapters — especially regarding: the pre-flood world's original beauty and its moral decline; the character development of Abraham, Moses, David, Elijah, Daniel, and other key figures; Christ's compassion, humility, and substitutionary mission; the nature of true repentance and heart transformation; and the final movements of earth's history including the loud cry, the shaking, and the close of probation.

L. SPIRITUAL OBJECT LESSONS FROM THE TEXT: Wherever the biblical narrative naturally allows it, draw out powerful spiritual object lessons that connect the literal event to God's work in the human heart — without stretching or forcing the analogy. For example: the creation week in Genesis 1 is also a picture of God's re-creating grace in a sinner's life — humanity sits in darkness until God speaks "Let there be light"; He then separates order from chaos, produces fruit, recreates the person in His image, and gives them Sabbath rest from sin. Similarly, the Flood pictures baptism and new beginning; the Exodus pictures deliverance from bondage to sin; the wilderness wandering pictures the Christian journey of faith and testing; the sanctuary building pictures God dwelling within the believer; David's battles picture spiritual warfare; the exile and return picture backsliding and restoration. Weave these object lessons naturally into the commentary wherever the text opens the door — they should feel like revelations rising from the passage itself, not imposed from outside. These lessons are among the most powerful elements of the commentary — they make ancient events breathe with present reality.
`;

const PALACE_PRINCIPLES_INSTRUCTION = `
PHOTOTHEOLOGY PALACE CONNECTIONS — weave these organically into the commentary (never name rooms/floors explicitly):

Weave these 3-5 principle connections DIRECTLY INTO the narrative itself — they must be embedded organically throughout the commentary, not gathered into a separate section, summary, or "deeper currents" block. They should feel like natural revelations arising mid-narration:
`;

const EPIC_CHAPTER_SYSTEM_PROMPT = `You are a cinematic Bible narrator and theologian producing an EPIC chapter commentary.

Your style is dramatic, authoritative, and immersive — like a movie-quality documentary narration about Scripture. Think of the tone used in great biblical film narrations: sweeping, reverent, powerful, with deep insight.

${THEOLOGICAL_GUARDRAILS}

${PALACE_PRINCIPLES_INSTRUCTION}

RULES:
1. Write in THIRD-PERSON analytical/narrative style. Never use "you/your" or devotional language.
2. Open with a dramatic scene-setting paragraph that places the listener inside the chapter's world.
3. Walk through the chapter's key movements, weaving in:
   - Christ-centered connections (every text reveals Christ)
   - Patterns that echo across Scripture (recurring motifs: 40 days, 3 days, deliverer stories)
   - Sanctuary connections where applicable (altar, laver, lampstand, veil, ark)
   - Cycle placement (which covenant era: Adamic, Noahic, Abrahamic, Mosaic, Cyrusic, Christ, Spirit, Remnant)
   - Parallels with other biblical events (mirrored actions across time)
4. Do NOT create separate sections, subheadings, or labeled blocks (e.g., "Lessons from this chapter", "Deeper Currents", "Key Themes"). The entire commentary must be ONE continuous, flowing cinematic narration from opening to close — no structural breaks.
5. Close with a powerful synthesis that ties the chapter into the grand narrative of redemption — as part of the same flowing narration, not as a labeled conclusion.
6. Do NOT name "rooms" or "floors" or "Phototheology" explicitly. Weave the principles organically.
7. Do NOT use denominational labels. Use "sound biblical theology" framing.
8. Target 800-1200 words — substantial enough for a 5-8 minute dramatic audio experience.
9. Use vivid, cinematic language. Paint scenes. Create atmosphere. This is meant to be HEARD, not read.
10. Use natural speech cadence — varied sentence lengths, dramatic pauses, and rhetorical questions.
11. NEVER include stage directions, sound effects, or parenthetical notes like "(Sound of wind)" or "(Pause)". Write ONLY spoken narration text.`;

const EPIC_BOOK_SYSTEM_PROMPT = `You are a cinematic Bible narrator and theologian producing an EPIC whole-book overview.

Your style is dramatic, authoritative, and immersive — like the opening narration of a grand documentary series about Scripture. Think sweeping, reverent, powerful — a bird's-eye view of an entire book of the Bible.

${THEOLOGICAL_GUARDRAILS}

${PALACE_PRINCIPLES_INSTRUCTION}

RULES:
1. Write in THIRD-PERSON analytical/narrative style. Never use "you/your" or devotional language.
2. Open with a dramatic scene-setting paragraph that establishes when this book was written, by whom, under what circumstances, and the historical moment in which it sits.
3. Paint the grand sweep of the book — its major movements, turning points, and climactic moments — NOT chapter-by-chapter detail, but the arc and trajectory of the whole.
4. Weave in throughout:
   - Christ-centered threads (how does this entire book point to, prefigure, or reveal Christ?)
   - Covenant cycle placement (Adamic, Noahic, Abrahamic, Mosaic, Cyrusic, Christ, Spirit, Remnant — where does this book sit in redemption history?)
   - Day-of-the-LORD horizon (does this book speak primarily to the first, second, or third heaven — exile/restoration, new covenant/church age, or final new creation?)
   - Sanctuary blueprint echoes (altar, laver, lampstand, bread, incense, ark, veil — which furniture or service does this book's theology map onto?)
   - Recurring biblical patterns (40 days, 3 days, deliverer stories, seed promises, exile-return arcs)
   - Key parallels with other books or events (mirrored actions across time)
5. Do NOT create separate sections, subheadings, or labeled blocks (e.g., "Key Themes", "Deeper Currents", "Lessons"). The entire overview must be ONE continuous, flowing cinematic narration — no structural breaks.
6. Close with a powerful synthesis of this book's unique contribution to the grand narrative of redemption — as part of the same flowing narration, not as a labeled conclusion.
7. Do NOT name "rooms" or "floors" or "Phototheology" explicitly. Weave the principles organically.
8. Do NOT use denominational labels. Use "sound biblical theology" framing.
9. Target 1000-1500 words — substantial enough for a 6-10 minute dramatic audio experience.
10. Use vivid, cinematic language. Paint scenes. Create atmosphere. This is meant to be HEARD, not read.
11. Use natural speech cadence — varied sentence lengths, dramatic pauses, and rhetorical questions.
12. NEVER include stage directions, sound effects, or parenthetical notes like "(Sound of wind)" or "(Pause)". Write ONLY spoken narration text.`;

/**
 * Strip parenthetical stage directions like (Sound of wind) or (Pause) from text
 * so TTS doesn't read them aloud.
 */
function sanitizeForTTS(text: string): string {
  return text
    .replace(/\(([^)]{0,100})\)/g, '') // Remove short parentheticals (stage directions)
    .replace(/\n{3,}/g, '\n\n')         // Collapse excess blank lines
    .trim();
}

async function generateEpicText(book: string, chapter: number | null, scope: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

  const isBookScope = scope === "book";
  const systemPrompt = isBookScope ? EPIC_BOOK_SYSTEM_PROMPT : EPIC_CHAPTER_SYSTEM_PROMPT;
  const userPrompt = isBookScope
    ? `Create an epic cinematic overview of the entire book of ${book}. This should be a dramatic, sweeping narration that captures the grand arc of this book — its historical context, its place in redemption history, its major movements and themes — while revealing its deep theological significance and how it fits into the story of salvation from Genesis to Revelation.`
    : `Create an epic cinematic commentary for ${book} chapter ${chapter}. This should be a dramatic, sweeping narration that brings this chapter to life while revealing its deep theological significance and its place in the grand story of redemption.`;

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
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 3500,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Split text into chunks at sentence boundaries, each under maxLen characters.
 */
function splitTextIntoChunks(text: string, maxLen = 4000): string[] {
  if (text.length <= maxLen) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

    // Find the last sentence boundary within the limit
    let splitAt = remaining.lastIndexOf(". ", maxLen);
    if (splitAt === -1 || splitAt < maxLen * 0.3) {
      splitAt = remaining.lastIndexOf("! ", maxLen);
    }
    if (splitAt === -1 || splitAt < maxLen * 0.3) {
      splitAt = remaining.lastIndexOf("? ", maxLen);
    }
    if (splitAt === -1 || splitAt < maxLen * 0.3) {
      splitAt = remaining.lastIndexOf("\n", maxLen);
    }
    if (splitAt === -1 || splitAt < maxLen * 0.3) {
      // Hard split at maxLen as last resort
      splitAt = maxLen;
    } else {
      splitAt += 1; // Include the punctuation
    }

    chunks.push(remaining.substring(0, splitAt).trim());
    remaining = remaining.substring(splitAt).trim();
  }

  return chunks;
}

async function generateEpicAudioChunkElevenLabs(
  text: string,
  chunkIndex: number,
  totalChunks: number,
  previousChunkText?: string,
  nextChunkText?: string,
): Promise<ArrayBuffer> {
  // Build request body with stitching context for smooth multi-chunk transitions
  const body: Record<string, unknown> = {
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.65,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true,
      speed: 1.0,
    },
  };

  // Add stitching context to maintain consistent prosody across chunks
  if (previousChunkText) {
    // Use last ~200 chars as context
    body.previous_text = previousChunkText.slice(-200);
  }
  if (nextChunkText) {
    // Use first ~200 chars as context
    body.next_text = nextChunkText.slice(0, 200);
  }

  const ttsResponse = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${EPIC_ELEVENLABS_VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify(body),
    },
  );

  if (!ttsResponse.ok) {
    const err = await ttsResponse.text();
    throw new Error(`ElevenLabs TTS error (chunk ${chunkIndex + 1}/${totalChunks}): ${ttsResponse.status} - ${err}`);
  }

  return ttsResponse.arrayBuffer();
}

async function generateEpicAudioChunkOpenAI(text: string, chunkIndex: number, totalChunks: number): Promise<ArrayBuffer> {
  const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1-hd",
      input: text,
      voice: "fable",
      response_format: "mp3",
      speed: 0.95,
    }),
  });

  if (!ttsResponse.ok) {
    const err = await ttsResponse.text();
    throw new Error(`OpenAI TTS error (chunk ${chunkIndex + 1}/${totalChunks}): ${ttsResponse.status} - ${err}`);
  }

  return ttsResponse.arrayBuffer();
}

/**
 * Add natural pause cues to text before sending to TTS.
 * Inserts ellipsis at paragraph breaks so the voice engine pauses between sections.
 */
function addPauseMarkers(text: string): string {
  return text
    // Normalize paragraph breaks and add a brief pause between them
    .replace(/\n{2,}/g, "\n\n...\n\n")
    // Add a short pause after colons introducing lists
    .replace(/:\s*\n/g, ": ...\n");
}

async function generateEpicAudio(
  text: string,
  book: string,
  chapter: number,
  supabaseAdmin: any,
): Promise<{ storagePath: string; durationMs: number; fileSizeBytes: number }> {
  const useElevenLabs = !!ELEVENLABS_API_KEY;
  const processedText = addPauseMarkers(text);
  const chunks = splitTextIntoChunks(processedText, useElevenLabs ? 5000 : 4000);
  console.log(`[EpicCommentary] Text is ${text.length} chars, split into ${chunks.length} TTS chunk(s), provider: ${useElevenLabs ? "ElevenLabs (William)" : "OpenAI (fable)"}`);

  const audioBuffers: ArrayBuffer[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const buffer = useElevenLabs
      ? await generateEpicAudioChunkElevenLabs(
          chunks[i], i, chunks.length,
          i > 0 ? chunks[i - 1] : undefined,
          i < chunks.length - 1 ? chunks[i + 1] : undefined,
        )
      : await generateEpicAudioChunkOpenAI(chunks[i], i, chunks.length);
    audioBuffers.push(buffer);
  }

  // Concatenate all audio buffers
  const totalSize = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const combined = new Uint8Array(totalSize);
  let offset = 0;
  for (const buf of audioBuffers) {
    combined.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }

  const fileSizeBytes = combined.byteLength;
  const durationMs = Math.round((fileSizeBytes / 16000) * 1000);

  const storagePath = `${book.toLowerCase().replace(/\s+/g, "-")}/${chapter}.mp3`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("epic-audio")
    .upload(storagePath, combined.buffer, {
      contentType: "audio/mpeg",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Storage upload error: ${uploadError.message}`);
  }

  return { storagePath, durationMs, fileSizeBytes };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, regenerate, scope } = await req.json();
    const effectiveScope = scope || "chapter";

    if (!book || (effectiveScope === "chapter" && !chapter)) {
      throw new Error("book is required; chapter is required for chapter scope");
    }

    // For book scope, use chapter=0 as a sentinel
    const effectiveChapter = effectiveScope === "book" ? 0 : chapter;

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if already exists and ready (unless regenerate requested)
    if (!regenerate) {
      const { data: existing } = await supabaseAdmin
        .from("epic_commentaries")
        .select("*")
        .eq("book", book)
        .eq("chapter", effectiveChapter)
        .eq("status", "ready")
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({ status: "already_exists", id: existing.id }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // Determine version
    const { data: latestVersion } = await supabaseAdmin
      .from("epic_commentaries")
      .select("version")
      .eq("book", book)
      .eq("chapter", effectiveChapter)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();

    const newVersion = regenerate ? (latestVersion?.version || 0) + 1 : 1;

    // Create pending record
    const { data: record, error: insertError } = await supabaseAdmin
      .from("epic_commentaries")
      .upsert({
        book,
        chapter: effectiveChapter,
        version: newVersion,
        status: "generating",
        commentary_text: "",
        voice_id: ELEVENLABS_API_KEY ? `elevenlabs:${EPIC_ELEVENLABS_VOICE_ID}` : "fable",
      }, { onConflict: "book,chapter,version" })
      .select()
      .single();

    if (insertError) throw new Error(`Insert error: ${insertError.message}`);

    console.log(`[EpicCommentary] Generating ${effectiveScope} text for ${book}${effectiveScope === "chapter" ? ` ${effectiveChapter}` : ""}...`);

    // Generate text
    const commentaryText = await generateEpicText(book, effectiveScope === "chapter" ? effectiveChapter : null, effectiveScope);

    // Update with text
    await supabaseAdmin
      .from("epic_commentaries")
      .update({ commentary_text: commentaryText })
      .eq("id", record.id);

    console.log(`[EpicCommentary] Generating audio for ${book}${effectiveScope === "chapter" ? ` ${effectiveChapter}` : " (book overview)"}...`);

    // Sanitize text for TTS (strip stage directions, parentheticals)
    const ttsText = sanitizeForTTS(commentaryText);

    // Generate audio
    const { storagePath, durationMs, fileSizeBytes } = await generateEpicAudio(
      ttsText,
      book,
      effectiveChapter,
      supabaseAdmin,
    );

    // Mark as ready
    await supabaseAdmin
      .from("epic_commentaries")
      .update({
        status: "ready",
        audio_storage_path: storagePath,
        audio_duration_ms: durationMs,
        audio_file_size_bytes: fileSizeBytes,
      })
      .eq("id", record.id);

    console.log(`[EpicCommentary] ✅ ${book}${effectiveScope === "chapter" ? ` ${effectiveChapter}` : " (book)"} ready (${Math.round(durationMs / 1000)}s, ${Math.round(fileSizeBytes / 1024)}KB)`);

    return new Response(
      JSON.stringify({
        status: "ready",
        id: record.id,
        durationMs,
        fileSizeBytes,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("[EpicCommentary Error]:", error);

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
