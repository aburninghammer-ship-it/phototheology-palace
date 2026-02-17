import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const EPIC_CHAPTER_SYSTEM_PROMPT = `You are a cinematic Bible narrator and theologian producing an EPIC chapter commentary.

Your style is dramatic, authoritative, and immersive — like a movie-quality documentary narration about Scripture. Think of the tone used in great biblical film narrations: sweeping, reverent, powerful, with deep insight.

RULES:
1. Write in THIRD-PERSON analytical/narrative style. Never use "you/your" or devotional language.
2. Open with a dramatic scene-setting paragraph that places the listener inside the chapter's world.
3. Walk through the chapter's key movements, weaving in:
   - Christ-centered connections (every text reveals Christ)
   - Patterns that echo across Scripture (recurring motifs: 40 days, 3 days, deliverer stories)
   - Sanctuary connections where applicable (altar, laver, lampstand, veil, ark)
   - Cycle placement (which covenant era: Adamic, Noahic, Abrahamic, Mosaic, Cyrusic, Christ, Spirit, Remnant)
   - Parallels with other biblical events (mirrored actions across time)
4. Close with a powerful synthesis that ties the chapter into the grand narrative of redemption.
5. Do NOT name "rooms" or "floors" or "Phototheology" explicitly. Weave the principles organically.
6. Do NOT use denominational labels. Use "sound biblical theology" framing.
7. Target 600-900 words — substantial enough for a 4-6 minute dramatic audio experience.
8. Use vivid, cinematic language. Paint scenes. Create atmosphere. This is meant to be HEARD, not read.
9. Use natural speech cadence — varied sentence lengths, dramatic pauses, and rhetorical questions.`;

const EPIC_BOOK_SYSTEM_PROMPT = `You are a cinematic Bible narrator and theologian producing an EPIC whole-book overview.

Your style is dramatic, authoritative, and immersive — like the opening narration of a grand documentary series about Scripture. Think sweeping, reverent, powerful — a bird's-eye view of an entire book of the Bible.

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
5. Close with a powerful synthesis: what is this book's unique contribution to the grand narrative of redemption? What does it reveal that no other book reveals?
6. Do NOT name "rooms" or "floors" or "Phototheology" explicitly. Weave the principles organically.
7. Do NOT use denominational labels. Use "sound biblical theology" framing.
8. Target 800-1200 words — substantial enough for a 5-8 minute dramatic audio experience.
9. Use vivid, cinematic language. Paint scenes. Create atmosphere. This is meant to be HEARD, not read.
10. Use natural speech cadence — varied sentence lengths, dramatic pauses, and rhetorical questions.`;

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
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function splitTextIntoChunks(text: string, maxLen = 4000): string[] {
  if (text.length <= maxLen) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

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
      splitAt = maxLen;
    } else {
      splitAt += 1;
    }

    chunks.push(remaining.substring(0, splitAt).trim());
    remaining = remaining.substring(splitAt).trim();
  }

  return chunks;
}

async function generateEpicAudio(
  text: string,
  book: string,
  chapter: number,
  supabaseAdmin: ReturnType<typeof createClient>,
): Promise<{ storagePath: string; durationMs: number; fileSizeBytes: number }> {
  const chunks = splitTextIntoChunks(text, 4000);
  console.log(`[EpicCommentary] Text is ${text.length} chars, split into ${chunks.length} TTS chunk(s)`);

  const audioBuffers: ArrayBuffer[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const voiceId = "NFG5qt843uXKj4pFvR7C"; // User-selected voice
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: chunks[i],
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
            speed: 1.0,
          },
        }),
      },
    );

    if (!ttsResponse.ok) {
      const err = await ttsResponse.text();
      throw new Error(`ElevenLabs TTS error (chunk ${i + 1}/${chunks.length}): ${ttsResponse.status} - ${err}`);
    }

    audioBuffers.push(await ttsResponse.arrayBuffer());
  }

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

    const effectiveChapter = effectiveScope === "book" ? 0 : chapter;

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

    const { data: latestVersion } = await supabaseAdmin
      .from("epic_commentaries")
      .select("version")
      .eq("book", book)
      .eq("chapter", effectiveChapter)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();

    const newVersion = regenerate ? (latestVersion?.version || 0) + 1 : 1;

    const { data: record, error: insertError } = await supabaseAdmin
      .from("epic_commentaries")
      .upsert({
        book,
        chapter: effectiveChapter,
        version: newVersion,
        status: "generating",
        commentary_text: "",
        voice_id: "NFG5qt843uXKj4pFvR7C",
      }, { onConflict: "book,chapter,version" })
      .select()
      .single();

    if (insertError) throw new Error(`Insert error: ${insertError.message}`);

    console.log(`[EpicCommentary] Generating ${effectiveScope} text for ${book}${effectiveScope === "chapter" ? ` ${effectiveChapter}` : ""}...`);

    const commentaryText = await generateEpicText(book, effectiveScope === "chapter" ? effectiveChapter : null, effectiveScope);

    await supabaseAdmin
      .from("epic_commentaries")
      .update({ commentary_text: commentaryText })
      .eq("id", record.id);

    console.log(`[EpicCommentary] Generating audio for ${book}${effectiveScope === "chapter" ? ` ${effectiveChapter}` : " (book overview)"}...`);

    const { storagePath, durationMs, fileSizeBytes } = await generateEpicAudio(
      commentaryText,
      book,
      effectiveChapter,
      supabaseAdmin,
    );

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
