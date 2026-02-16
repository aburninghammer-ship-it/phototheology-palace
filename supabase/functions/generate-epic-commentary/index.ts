import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Daniel voice — deep, cinematic
const EPIC_VOICE_ID = "onwK4e9ZLuTAKqWW03F9";

const EPIC_SYSTEM_PROMPT = `You are a cinematic Bible narrator and theologian producing an EPIC chapter commentary.

Your style is dramatic, authoritative, and immersive — like a movie-quality documentary narration about Scripture. Think of the tone used in great biblical film narrations: sweeping, reverent, powerful, with deep insight.

RULES:
1. Write in THIRD-PERSON analytical/narrative style. Never use "you/your" or devotional language.
2. Open with a dramatic scene-setting paragraph that places the listener inside the chapter's world.
3. Walk through the chapter's key movements, weaving in:
   - Christ-centered connections (Concentration Room principle: every text reveals Christ)
   - Patterns that echo across Scripture (recurring motifs: 40 days, 3 days, deliverer stories)
   - Sanctuary connections where applicable (altar, laver, lampstand, veil, ark)
   - Cycle placement (which covenant era: Adamic, Noahic, Abrahamic, Mosaic, Cyrusic, Christ, Spirit, Remnant)
   - Parallels with other biblical events (mirrored actions across time)
4. Close with a powerful synthesis that ties the chapter into the grand narrative of redemption.
5. Do NOT name "rooms" or "floors" or "Phototheology" explicitly. Weave the principles organically.
6. Do NOT use denominational labels. Use "sound biblical theology" framing.
7. Target 800-1200 words — substantial enough for a 5-8 minute dramatic audio experience.
8. Use vivid, cinematic language. Paint scenes. Create atmosphere. This is meant to be HEARD, not read.
9. Use natural speech cadence — varied sentence lengths, dramatic pauses (indicated by "..."), and rhetorical questions.`;

async function generateEpicText(book: string, chapter: number): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: EPIC_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Create an epic cinematic commentary for ${book} chapter ${chapter}. This should be a dramatic, sweeping narration that brings this chapter to life while revealing its deep theological significance and its place in the grand story of redemption.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function generateEpicAudio(
  text: string,
  book: string,
  chapter: number,
  supabaseAdmin: ReturnType<typeof createClient>,
): Promise<{ storagePath: string; durationMs: number; fileSizeBytes: number }> {
  // Generate audio via ElevenLabs
  const ttsResponse = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${EPIC_VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.4,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!ttsResponse.ok) {
    const err = await ttsResponse.text();
    throw new Error(`ElevenLabs error: ${ttsResponse.status} - ${err}`);
  }

  const audioBuffer = await ttsResponse.arrayBuffer();
  const fileSizeBytes = audioBuffer.byteLength;

  // Estimate duration (128kbps = 16000 bytes/sec)
  const durationMs = Math.round((fileSizeBytes / 16000) * 1000);

  // Upload to storage
  const storagePath = `${book.toLowerCase().replace(/\s+/g, "-")}/${chapter}.mp3`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("epic-audio")
    .upload(storagePath, audioBuffer, {
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
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { book, chapter, regenerate } = await req.json();

    if (!book || !chapter) {
      throw new Error("book and chapter are required");
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if already exists and ready (unless regenerate requested)
    if (!regenerate) {
      const { data: existing } = await supabaseAdmin
        .from("epic_commentaries")
        .select("*")
        .eq("book", book)
        .eq("chapter", chapter)
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
      .eq("chapter", chapter)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();

    const newVersion = regenerate ? (latestVersion?.version || 0) + 1 : 1;

    // Create pending record
    const { data: record, error: insertError } = await supabaseAdmin
      .from("epic_commentaries")
      .upsert({
        book,
        chapter,
        version: newVersion,
        status: "generating",
        commentary_text: "",
        voice_id: EPIC_VOICE_ID,
      }, { onConflict: "book,chapter,version" })
      .select()
      .single();

    if (insertError) throw new Error(`Insert error: ${insertError.message}`);

    console.log(`[EpicCommentary] Generating text for ${book} ${chapter}...`);

    // Generate text
    const commentaryText = await generateEpicText(book, chapter);

    // Update with text
    await supabaseAdmin
      .from("epic_commentaries")
      .update({ commentary_text: commentaryText })
      .eq("id", record.id);

    console.log(`[EpicCommentary] Generating audio for ${book} ${chapter}...`);

    // Generate audio
    const { storagePath, durationMs, fileSizeBytes } = await generateEpicAudio(
      commentaryText,
      book,
      chapter,
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

    console.log(`[EpicCommentary] ✅ ${book} ${chapter} ready (${Math.round(durationMs / 1000)}s, ${Math.round(fileSizeBytes / 1024)}KB)`);

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
