/**
 * Generate Audio Commentary Edge Function
 *
 * Generates Bible commentary with PhotoTheology principles and theological safeguards.
 * Supports three tiers: surface, intermediate, scholarly
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorpusContext } from '../_shared/corpus-rag.ts';
import { getContentBehavioralEngine } from '../_shared/content-behavioral-engine.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Theological safeguards - hardcoded for reliability
const THEOLOGICAL_SAFEGUARDS = `
CRITICAL THEOLOGICAL SAFEGUARDS - You MUST follow these interpretations:

1. SCAPEGOAT (Leviticus 16): The scapegoat (Azazel) represents SATAN, not Jesus.
   The Lord's goat (which is slain) represents Christ. The scapegoat is sent alive
   into the wilderness, symbolizing Satan bearing responsibility for originating sin.

2. HEBREWS & THE SANCTUARY: Hebrews teaches Christ entered the HEAVENLY temple
   (contrasted with earthly), but does NOT specify He entered the Most Holy Place
   at His ascension. The two-apartment ministry is preserved. Christ's Most Holy
   Place ministry began in 1844 per Daniel 8:14.

3. REVELATION 4-5: This depicts the HOLY PLACE, not the Most Holy Place.
   The seven lamps of fire (Rev 4:5) correspond to the seven-branched lampstand
   in the Holy Place. This is Christ's inauguration and intercessory ministry.

4. LITTLE HORN: In Daniel 7 and 8, the little horn ALWAYS represents papal Rome
   (or pagan/papal Rome in Daniel 8). NEVER interpret it as Antiochus Epiphanes.
   The little horn continues until the judgment and persecuted saints for 1260 years.

5. DANIEL 11 PROPHETIC SEQUENCE:
   - Daniel 11:14-22 = PAGAN ROME (NOT Antiochus Epiphanes or Greece)
     * v.14 = Rome rising to fulfill vision; v.16 = Rome conquers Palestine (Pompey 63 BC)
     * v.20 = Caesar Augustus (raiser of taxes, Luke 2:1); v.21 = Tiberius Caesar (vile person)
     * v.22 = Christ ("prince of the covenant") crucified under Roman authority
   - Daniel 11:23-30 = PAPAL ROME (the league = church-state alliance; papal military expansion)
   - Daniel 11:31-39 = Papal spiritual conquests
   - Daniel 11:40-45 = End-time crisis. The king of the north = Satan appearing as Christ.
   - NEVER assign Daniel 11:14-22 to Antiochus or Greece. NEVER say Papal Rome begins at v.36.

6. THREE HEAVENS RULE: For pre-exilic and post-exilic prophecies, recognize
   multiple fulfillments: (1) immediate/historical, (2) Messianic/Christ's first advent,
   (3) eschatological/end-time. Apply all three dimensions when relevant.

7. MATTHEW 24: The close of probation occurs BEFORE Christ's visible return.
   The abomination of desolation has both AD 70 and end-time applications.

8. SABBATH: The seventh-day Sabbath remains God's sign of creation and sanctification,
   unchanged from creation through eternity (Isaiah 66:22-23).

9. FEAST TYPOLOGY - CRITICAL: The feasts MUST be correctly mapped to Christ's ministry:

   SPRING FEASTS (Christ's FIRST ADVENT - already fulfilled):
   - PASSOVER (Nisan 14): Christ's DEATH on the cross - "Christ our Passover" (1 Cor 5:7)
   - UNLEAVENED BREAD (Nisan 15-21): Christ's BURIAL and sinless life - "without leaven of sin"
   - FIRSTFRUITS (Nisan 16): Christ's RESURRECTION - "firstfruits of those who have fallen asleep" (1 Cor 15:20)
   - PENTECOST (50 days later): Outpouring of Holy Spirit on the early church (Acts 2)

   FALL FEASTS (Christ's SECOND ADVENT ministry - end-time):
   - TRUMPETS (Tishri 1): The great awakening/judgment hour message (1840s Advent movement)
   - DAY OF ATONEMENT (Tishri 10): Christ's heavenly MOST HOLY PLACE ministry and
     pre-advent investigative judgment beginning 1844 - NOT His death on the cross!
   - TABERNACLES (Tishri 15-22): God dwelling with His people in the New Earth

   NEVER confuse the Day of Atonement with Christ's death. His death fulfilled PASSOVER.
   The Day of Atonement points to His HIGH PRIESTLY ministry in heaven since 1844.
`;

const PHOTOTHEOLOGY_PRINCIPLES = `
PHOTOTHEOLOGY FRAMEWORK - Weave these naturally into commentary without labeling:

FIVE DIMENSIONS OF BIBLE STUDY:
1. Christ-Centered (1D): Every passage points to Jesus - find Him
2. Sanctuary Framework (2D): Temple/tabernacle typology illuminates meaning
3. Great Controversy (3D): The cosmic battle between good and evil
4. Three Angels' Messages (4D): End-time relevance and urgency
5. Personal Application (5D): Transformation in the reader's life

ROOM INSIGHTS (draw from relevant rooms):
- Story Room (SR): Narrative flow and character development
- Imagination Room (IR): Visualize the scene, engage senses
- Observation Room (OR): Details, patterns, repeated words
- Prophecy Room (PR): Prophetic significance and fulfillment
- Sanctuary Room (BL): Sanctuary connections and typology
- Patterns Room (PRm): Chiastic structures, numerical patterns
- Listening Room (LR): What is God saying personally?

ELLEN WHITE INTEGRATION:
- Her insights should inform interpretation naturally
- Do not attribute quotes directly unless specifically relevant
- Let her understanding shape the theological framework
`;

interface CommentaryRequest {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  tier: "surface" | "intermediate" | "scholarly";
  generateAudio?: boolean;
  voice?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiKey = Deno.env.get("OPENAI_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { book, chapter, verse, verseText, tier = "surface", generateAudio = false, voice = "onyx" }: CommentaryRequest = await req.json();

    if (!book || !chapter || !verse || !verseText) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: book, chapter, verse, verseText" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[Commentary] Generating ${tier} commentary for ${book} ${chapter}:${verse}`);

    // Check cache first
    const { data: cached } = await supabase
      .from("bible_commentaries")
      .select("*")
      .eq("book", book)
      .eq("chapter", chapter)
      .eq("verse", verse)
      .eq("tier", tier)
      .maybeSingle();

    if (cached?.commentary_text) {
      console.log(`[Commentary] Cache hit for ${book} ${chapter}:${verse}`);

      // If we have a cached audio URL, return it immediately (no TTS cost)
      if (cached.audio_url) {
        console.log(`[Commentary] Returning cached audio for ${book} ${chapter}:${verse}`);
        return new Response(
          JSON.stringify({
            commentary: cached.commentary_text,
            audioUrl: cached.audio_url,
            cached: true,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Commentary exists but no audio yet — generate & store audio now so future requests are free
      if (generateAudio) {
        console.log(`[Commentary] Generating missing audio for cached commentary ${book} ${chapter}:${verse}`);
        const audioUrl = await generateTTSAudio(cached.commentary_text, voice, openaiKey, supabase, book, chapter, verse, tier);
        if (audioUrl) {
          await supabase.from("bible_commentaries").update({ audio_url: audioUrl, updated_at: new Date().toISOString() })
            .eq("book", book).eq("chapter", chapter).eq("verse", verse).eq("tier", tier);
        }
        return new Response(
          JSON.stringify({ commentary: cached.commentary_text, audioUrl, cached: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ commentary: cached.commentary_text, audioUrl: null, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build tier-specific prompt
    const tierInstructions = getTierInstructions(tier);

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: `${book} ${chapter}:${verse} ${verseText}`,
      matchCount: 3,
    });

    const systemPrompt = `You are a deeply insightful Bible commentator trained in PhotoTheology principles.
Your commentary should feel like sitting with a wise teacher who simply sees Scripture deeply.

${THEOLOGICAL_SAFEGUARDS}

${PHOTOTHEOLOGY_PRINCIPLES}

${tierInstructions}

${getContentBehavioralEngine()}

STYLE GUIDELINES:
- Never label principles or rooms explicitly (no "this is the Christ-centered dimension")
- Let insights flow naturally as a skilled teacher would share them
- Be warm and conversational, not academic or dry
- Connect to the reader's spiritual journey when appropriate
- For prophetic books (Daniel, Revelation), use the Daniel/Revelation in 7 Days framework${ragResult.chunkCount > 0 ? ragResult.corpusContext : ''}`;

    const userPrompt = `Generate ${tier} level commentary for:

Book: ${book}
Chapter: ${chapter}
Verse: ${verse}
Text: "${verseText}"

Provide insightful commentary following the tier guidelines and PhotoTheology framework.`;

    // Generate commentary with OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: tier === "scholarly" ? 1500 : tier === "intermediate" ? 800 : 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Commentary] OpenAI error:", error);
      throw new Error("Failed to generate commentary");
    }

    const data = await response.json();
    const commentary = data.choices[0]?.message?.content?.trim();

    if (!commentary) {
      throw new Error("No commentary generated");
    }

    console.log(`[Commentary] Generated ${commentary.length} chars for ${book} ${chapter}:${verse}`);

    // Always generate audio when creating new commentary — pay once, play forever for free
    // This ensures every cached commentary entry has an audio URL stored in Storage
    console.log(`[Commentary] Generating audio for new commentary ${book} ${chapter}:${verse}`);
    const audioUrl = await generateTTSAudio(commentary, voice, openaiKey, supabase, book, chapter, verse, tier);

    // Cache the commentary + audio URL together
    await supabase.from("bible_commentaries").upsert({
      book,
      chapter,
      verse,
      tier,
      commentary_text: commentary,
      audio_url: audioUrl,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "book,chapter,verse,tier",
    });

    return new Response(
      JSON.stringify({
        commentary,
        audioUrl,
        cached: false,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("[Commentary] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getTierInstructions(tier: string): string {
  switch (tier) {
    case "surface":
      return `SURFACE LEVEL COMMENTARY:
- One compelling insight (2-3 sentences max)
- Conversational and accessible
- Single powerful observation that makes the reader pause
- Focus on the most spiritually impactful point
- Example tone: "In the beginning Christ was already there—not created, but Creator. Every story that follows flows from this reality."`;

    case "intermediate":
      return `INTERMEDIATE LEVEL COMMENTARY:
- 2-3 paragraphs of exploration
- Connect threads and patterns across Scripture
- Invite reflection without being exhaustive
- Include one practical application
- Show how this verse connects to the larger biblical narrative
- Warm and exploratory, like a conversation with a mentor`;

    case "scholarly":
      return `SCHOLARLY LEVEL COMMENTARY:
- Comprehensive analysis (4-6 paragraphs)
- Include relevant Greek/Hebrew word studies when illuminating
- Analyze literary structure (chiasm, parallelism)
- Connect to sanctuary typology where relevant
- Three Heavens interpretation for prophetic passages
- Great Controversy cosmic perspective
- Multiple cross-references with explanation
- Still readable and devotional in feel, not dry academic prose
- End with transformative application`;

    default:
      return getTierInstructions("surface");
  }
}

async function generateTTSAudio(
  text: string,
  voice: string,
  openaiKey: string,
  supabase: any,
  book: string,
  chapter: number,
  verse: number,
  tier: string
): Promise<string | null> {
  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: voice,
      }),
    });

    if (!response.ok) {
      console.error("[TTS] Error generating audio");
      return null;
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBlob = new Uint8Array(audioBuffer);

    // Upload to Supabase Storage
    const fileName = `commentary/${book.toLowerCase()}/${chapter}/${verse}_${tier}.mp3`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("bible-audio")
      .upload(fileName, audioBlob, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("[TTS] Upload error:", uploadError);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("bible-audio")
      .getPublicUrl(fileName);

    return urlData?.publicUrl || null;

  } catch (error) {
    console.error("[TTS] Error:", error);
    return null;
  }
}
