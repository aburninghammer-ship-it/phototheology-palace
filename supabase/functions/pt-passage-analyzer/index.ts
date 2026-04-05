// PT Passage Analyzer - Standalone edge function for Palace lens detection
import { getContentBehavioralEngine } from "../_shared/content-behavioral-engine.ts";
// Detects primary + secondary rooms for a given passage using AI scoring

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
// Inline canonical rooms data (edge functions cannot import across function directories)
interface CanonicalRoom {
  code: string;
  name: string;
  floor: number;
  floorName: string;
  method: string;
  signalKeywords: string[];
  genreAffinity: string[];
  promptTemplate: string;
}

const CANONICAL_ROOMS: Record<string, CanonicalRoom> = {
  "sr": { code: "sr", name: "Story Room", floor: 1, floorName: "Furnishing", method: "Recall the narrative sequence as a vivid mental movie", signalKeywords: ["story","narrative","journey","traveled","went","came to","said to"], genreAffinity: ["narrative","gospel"], promptTemplate: "How does the narrative sequence in this passage reveal a deeper theological movement?" },
  "ir": { code: "ir", name: "Imagination Room", floor: 1, floorName: "Furnishing", method: "Step inside the scene - feel, hear, smell, experience", signalKeywords: ["saw","heard","felt","touched","voice","appeared","vision"], genreAffinity: ["narrative","gospel","prophecy"], promptTemplate: "What sensory details in this text invite you to step inside the scene?" },
  "24fps": { code: "24fps", name: "24FPS Room", floor: 1, floorName: "Furnishing", method: "Create one symbolic image for this chapter", signalKeywords: ["image","picture","scene","symbol","sign"], genreAffinity: ["narrative","prophecy","apocalyptic"], promptTemplate: "What single image would capture the theological essence of this passage?" },
  "br": { code: "br", name: "Bible Rendered", floor: 1, floorName: "Furnishing", method: "Map into the 24-chapter block pattern", signalKeywords: ["chapter","structure","pattern","block","section"], genreAffinity: ["narrative","epistle","prophecy"], promptTemplate: "Where does this passage sit within the broader structural pattern of its book?" },
  "tr": { code: "tr", name: "Translation Room", floor: 1, floorName: "Furnishing", method: "Convert abstract words into concrete images", signalKeywords: ["meaning","word","translate","term","language","definition"], genreAffinity: ["epistle","wisdom","doctrinal"], promptTemplate: "What abstract theological concepts here need concrete, memorable imagery?" },
  "gr": { code: "gr", name: "Gems Room", floor: 1, floorName: "Furnishing", method: "Extract striking insights that shine with clarity", signalKeywords: ["insight","gem","striking","remarkable","key"], genreAffinity: ["narrative","epistle","poetry","wisdom"], promptTemplate: "What unexpected gem of insight is hidden in this verse?" },
  "or": { code: "or", name: "Observation Room", floor: 2, floorName: "Investigation", method: "Log 30-50 details without interpretation", signalKeywords: ["detail","observe","notice","see","count","list","describe"], genreAffinity: ["narrative","gospel","law"], promptTemplate: "What details in this passage often go unnoticed on first reading?" },
  "dc": { code: "dc", name: "Def-Com Room", floor: 2, floorName: "Investigation", method: "Analyze Greek/Hebrew definitions and cultural context", signalKeywords: ["hebrew","greek","definition","original","word study","culture","context"], genreAffinity: ["epistle","doctrinal","law","wisdom"], promptTemplate: "Which key word in the original language reshapes how we understand this verse?" },
  "st": { code: "st", name: "Symbols/Types Room", floor: 2, floorName: "Investigation", method: "Identify typological patterns pointing to Christ", signalKeywords: ["type","symbol","shadow","antitype","foreshadow","figure","represent"], genreAffinity: ["narrative","prophecy","apocalyptic","law"], promptTemplate: "What typological pattern in this passage points forward to Christ's work?" },
  "qr": { code: "qr", name: "Questions Room", floor: 2, floorName: "Investigation", method: "Ask intratextual, intertextual, and PT questions", signalKeywords: ["question","why","how","what","when","who","where"], genreAffinity: ["narrative","epistle","gospel","wisdom"], promptTemplate: "What question does this passage raise that only the broader canon can answer?" },
  "qa": { code: "qa", name: "Q&A Chains Room", floor: 2, floorName: "Investigation", method: "Cross-reference Scripture to answer Scripture", signalKeywords: ["answer","cross-reference","compare","parallel","echo"], genreAffinity: ["epistle","doctrinal","prophecy"], promptTemplate: "Where else in Scripture is this question asked — and answered differently?" },
  "nf": { code: "nf", name: "Nature Freestyle", floor: 3, floorName: "Freestyle", method: "Connect to creation illustrations", signalKeywords: ["nature","creation","earth","sky","water","tree","seed","harvest"], genreAffinity: ["poetry","wisdom","gospel"], promptTemplate: "What natural phenomenon illustrates the spiritual principle in this passage?" },
  "pf": { code: "pf", name: "Personal Freestyle", floor: 3, floorName: "Freestyle", method: "Apply to personal life experiences", signalKeywords: ["personal","life","experience","heart","soul","daily","walk"], genreAffinity: ["epistle","wisdom","poetry","gospel"], promptTemplate: "How does this passage intersect with the lived experience of believers today?" },
  "bf": { code: "bf", name: "Bible Freestyle", floor: 3, floorName: "Freestyle", method: "Trace verse genetics - siblings, cousins, relatives", signalKeywords: ["genetics","related","sibling","cousin","family","lineage"], genreAffinity: ["narrative","epistle","gospel","doctrinal"], promptTemplate: "What are this verse's closest 'relatives' — passages that share its DNA?" },
  "hf": { code: "hf", name: "History/Social Freestyle", floor: 3, floorName: "Freestyle", method: "Find historical parallels and lessons", signalKeywords: ["history","empire","king","nation","social","culture","period"], genreAffinity: ["narrative","prophecy","apocalyptic"], promptTemplate: "What historical event mirrors the dynamics in this passage?" },
  "lr": { code: "lr", name: "Listening Room", floor: 3, floorName: "Freestyle", method: "Actively listen for connections", signalKeywords: ["listen","hear","voice","still","quiet","speak","word"], genreAffinity: ["poetry","wisdom","prophecy"], promptTemplate: "What is the Holy Spirit emphasizing when you sit quietly with this text?" },
  "cr": { code: "cr", name: "Concentration Room", floor: 4, floorName: "Next Level", method: "Locate Christ in this text", signalKeywords: ["christ","jesus","messiah","lord","savior","lamb","son of god"], genreAffinity: ["narrative","epistle","gospel","prophecy","doctrinal"], promptTemplate: "Where is Christ hidden or revealed in this passage?" },
  "dr": { code: "dr", name: "Dimensions Room", floor: 4, floorName: "Next Level", method: "Apply 5D: Literal, Christ, Me, Church, Heaven", signalKeywords: ["dimension","layer","level","literal","spiritual","application"], genreAffinity: ["narrative","epistle","gospel","prophecy"], promptTemplate: "How does this passage read differently through each of the 5 dimensions?" },
  "c6": { code: "c6", name: "Connect-6", floor: 4, floorName: "Next Level", method: "Classify by genre and apply its rules", signalKeywords: ["genre","classify","type","form","literary","style"], genreAffinity: ["narrative","epistle","poetry","prophecy","wisdom","law"], promptTemplate: "What genre-specific interpretive rules apply to this passage?" },
  "trm": { code: "trm", name: "Theme Room", floor: 4, floorName: "Next Level", method: "Place on Sanctuary/Great Controversy/Gospel walls", signalKeywords: ["theme","wall","sanctuary","controversy","gospel","great"], genreAffinity: ["narrative","prophecy","doctrinal","apocalyptic"], promptTemplate: "Which theological wall does this passage belong on — and what does it add to that wall?" },
  "tz": { code: "tz", name: "Time Zone", floor: 4, floorName: "Next Level", method: "Assign past/present/future + heaven/earth", signalKeywords: ["time","past","present","future","heaven","earth","eternal"], genreAffinity: ["prophecy","apocalyptic","narrative"], promptTemplate: "Where does this passage sit on the heaven/earth and past/present/future grid?" },
  "prm": { code: "prm", name: "Patterns Room", floor: 4, floorName: "Next Level", method: "Identify recurring motifs (40 days, 3 days, etc.)", signalKeywords: ["pattern","motif","recurring","cycle","number","forty","seven","three"], genreAffinity: ["narrative","prophecy","apocalyptic"], promptTemplate: "What recurring biblical pattern does this passage participate in?" },
  "p||": { code: "p||", name: "Parallels Room", floor: 4, floorName: "Next Level", method: "Find mirrored actions across time", signalKeywords: ["parallel","mirror","echo","repeat","correspond","match"], genreAffinity: ["narrative","prophecy","gospel"], promptTemplate: "What event in another era mirrors what happens in this passage?" },
  "frt": { code: "frt", name: "Fruit Room", floor: 4, floorName: "Next Level", method: "Test: Does it produce Gal 5:22-23 fruit?", signalKeywords: ["fruit","spirit","love","joy","peace","patience","kindness"], genreAffinity: ["epistle","gospel","wisdom"], promptTemplate: "What spiritual fruit does this passage cultivate in the life of the reader?" },
  "cec": { code: "cec", name: "Christ in Every Chapter", floor: 4, floorName: "Next Level", method: "Find Christ's title/role and what He does in this text", signalKeywords: ["christ","title","role","every chapter","throughout"], genreAffinity: ["narrative","epistle","gospel","prophecy","law"], promptTemplate: "What title or role does Christ hold in this chapter, and how does He act?" },
  "r66": { code: "r66", name: "Room 66", floor: 4, floorName: "Next Level", method: "Trace how this theme develops Genesis to Revelation", signalKeywords: ["genesis","revelation","trace","develop","canon","bible-wide"], genreAffinity: ["narrative","prophecy","doctrinal","apocalyptic"], promptTemplate: "How does this theme develop from its first mention in Genesis to its climax in Revelation?" },
  "bl": { code: "bl", name: "Blue Room (Sanctuary)", floor: 5, floorName: "Vision", method: "Map to sanctuary furniture and services", signalKeywords: ["sanctuary","temple","tabernacle","priest","sacrifice","altar","holy","veil","ark","lampstand","incense","atonement"], genreAffinity: ["law","prophecy","doctrinal","narrative"], promptTemplate: "Which sanctuary article or service does this passage illuminate?" },
  "pr": { code: "pr", name: "Prophecy Room", floor: 5, floorName: "Vision", method: "Connect to prophetic timeline and symbols", signalKeywords: ["prophecy","prophetic","vision","dream","beast","horn","seal","trumpet","time","days","weeks","years"], genreAffinity: ["prophecy","apocalyptic"], promptTemplate: "Where does this passage sit on the prophetic timeline and what does it reveal?" },
  "3a": { code: "3a", name: "Three Angels", floor: 5, floorName: "Vision", method: "Apply to the final gospel messages", signalKeywords: ["angel","message","judgment","babylon","beast","mark","worship","commandment","endtime"], genreAffinity: ["prophecy","apocalyptic","doctrinal"], promptTemplate: "How does this passage connect to the Three Angels' Messages of Revelation 14?" },
  "fe": { code: "fe", name: "Feasts Room", floor: 5, floorName: "Vision", method: "Connect to Israel's feast calendar", signalKeywords: ["feast","passover","pentecost","tabernacle","atonement","firstfruit","trumpet","unleavened"], genreAffinity: ["law","narrative","prophecy"], promptTemplate: "Which feast of Israel does this passage typologically fulfill or illuminate?" },
  "1h": { code: "1h", name: "First Heaven (DoL1/NE1)", floor: 6, floorName: "Three Heavens", method: "Babylon destroys Jerusalem (586 BC) → Post-exilic restoration under Cyrus", signalKeywords: ["exile","babylon","captivity","cyrus","restoration","rebuild","return"], genreAffinity: ["narrative","prophecy"], promptTemplate: "How does the Babylonian exile-restoration cycle illuminate this passage?" },
  "2h": { code: "2h", name: "Second Heaven (DoL2/NE2)", floor: 6, floorName: "Three Heavens", method: "Rome destroys Jerusalem (70 AD) → New-Covenant/heavenly sanctuary order", signalKeywords: ["rome","destroy","temple","new covenant","heavenly","church"], genreAffinity: ["gospel","epistle","prophecy"], promptTemplate: "How does the destruction of Jerusalem in 70 AD and the new covenant reality reshape this text?" },
  "3h": { code: "3h", name: "Third Heaven (DoL3/NE3)", floor: 6, floorName: "Three Heavens", method: "Final cosmic judgment (Rev 20) → Literal New Creation (Rev 21-22)", signalKeywords: ["new earth","new creation","judgment","second coming","eternal","paradise"], genreAffinity: ["prophecy","apocalyptic"], promptTemplate: "How does the final judgment and new creation lens transform this passage's meaning?" },
  "frm": { code: "frm", name: "Fire Room", floor: 7, floorName: "Transformation", method: "Feel the emotional weight - let it convict", signalKeywords: ["fire","conviction","emotion","weight","burden","passion","zeal"], genreAffinity: ["prophecy","poetry","gospel"], promptTemplate: "What emotional weight does this passage carry, and what conviction does it press on the heart?" },
  "mr": { code: "mr", name: "Meditation Room", floor: 7, floorName: "Transformation", method: "Slow marination - repeat until saturated", signalKeywords: ["meditate","ponder","dwell","slow","deep","saturate","abide"], genreAffinity: ["poetry","wisdom","gospel"], promptTemplate: "What phrase in this passage rewards slow, repeated meditation?" },
  "srm": { code: "srm", name: "Speed Room", floor: 7, floorName: "Transformation", method: "Rapid-fire connections in 60 seconds", signalKeywords: ["quick","rapid","connection","link","fast","flash"], genreAffinity: ["narrative","gospel","epistle"], promptTemplate: "What rapid-fire associations does this verse trigger across the canon?" },
};

const ROOM_CODES: string[] = Object.keys(CANONICAL_ROOMS);

function isValidRoomCode(code: string): boolean {
  return code.toLowerCase() in CANONICAL_ROOMS;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RATE_LIMIT_WINDOW_HOURS = 1;
const RATE_LIMIT_MAX_REQUESTS = 200;

async function checkRateLimit(supabase: any, userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const { data: existingLimit, error: fetchError } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('endpoint', 'pt-passage-analyzer')
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS };
  }

  const now = new Date();

  if (!existingLimit) {
    await supabase.from('rate_limits').insert({
      user_id: userId,
      endpoint: 'pt-passage-analyzer',
      request_count: 1,
      window_start: now.toISOString(),
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  const limitWindowStart = new Date(existingLimit.window_start);
  const hoursSinceWindowStart = (now.getTime() - limitWindowStart.getTime()) / (1000 * 60 * 60);

  if (hoursSinceWindowStart >= RATE_LIMIT_WINDOW_HOURS) {
    await supabase.from('rate_limits').update({
      request_count: 1,
      window_start: now.toISOString(),
      updated_at: now.toISOString(),
    }).eq('user_id', userId).eq('endpoint', 'pt-passage-analyzer');
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (existingLimit.request_count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  await supabase.from('rate_limits').update({
    request_count: existingLimit.request_count + 1,
    updated_at: now.toISOString(),
  }).eq('user_id', userId).eq('endpoint', 'pt-passage-analyzer');

  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - existingLimit.request_count - 1 };
}

// Build the room list for the AI prompt
function buildRoomListForPrompt(): string {
  return ROOM_CODES.map(code => {
    const room = CANONICAL_ROOMS[code];
    return `- ${code}: ${room.name} — ${room.method} [Keywords: ${room.signalKeywords.join(', ')}]`;
  }).join('\n');
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Auth check
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;

        const { allowed, remaining } = await checkRateLimit(supabase, userId);
        if (!allowed) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
            {
              status: 429,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
                'X-RateLimit-Remaining': '0',
                'Retry-After': (RATE_LIMIT_WINDOW_HOURS * 3600).toString(),
              },
            }
          );
        }
      }
    }

    const { book, chapter, verse, verseText } = await req.json();
    const passageRef = `${book} ${chapter}:${verse}`;

    console.log("PT Passage Analyzer request:", { passageRef });

    // Check cache first
    const { data: cached } = await supabase
      .from('passage_analysis_cache')
      .select('*')
      .eq('passage_ref', passageRef)
      .eq('model_version', 'v1')
      .single();

    if (cached) {
      console.log("Cache hit for:", passageRef);
      return new Response(
        JSON.stringify({
          passage_ref: cached.passage_ref,
          primary_room: cached.primary_room,
          secondary_rooms: cached.secondary_rooms,
          genre: cached.genre,
          doctrinal_sensitivity: cached.doctrinal_sensitivity,
          rationale: cached.rationale,
          signal_scores: cached.signal_scores,
          model_version: cached.model_version,
          cached: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // AI scoring prompt
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const roomList = buildRoomListForPrompt();

    const systemPrompt = `You are a Phototheology Palace lens detection engine. Your ONLY job is to analyze a Bible passage and score how relevant each Palace room is.

CANONICAL ROOMS (these are the ONLY valid room codes — never invent new ones):
${roomList}

GENRE OPTIONS: narrative, epistle, prophecy, poetry, wisdom, law, gospel, apocalyptic, doctrinal

You must respond with ONLY valid JSON, no markdown, no explanation. The JSON schema:
{
  "scores": { "<room_code>": <0-10 integer>, ... },
  "genre": "<genre>",
  "doctrinal_sensitivity": <0-10 integer>,
  "primary_reason": "<1-2 sentence explanation of why the top room fits>",
  "signal_keywords": ["<keyword1>", "<keyword2>", ...],
  "genre_reasoning": "<1 sentence explaining genre classification>"
}

SCORING RULES:
- Score each room 0-10 based on how strongly the passage's content, language, themes, and structure align with that room's method and signal keywords
- A score of 0 means no relevance; 10 means perfect fit
- Be discriminating: most rooms should score 0-3 for any given verse
- The highest-scoring room becomes the primary lens
- Rooms scoring 5+ become secondary lenses (up to 4)
- Doctrinal sensitivity: 0 = safe/clear, 10 = highly debated/controversial passage`;

    const userPrompt = `Analyze this passage and score each Palace room:

Passage: ${passageRef}
Text: "${verseText}"

Return ONLY the JSON object with scores for each room code, genre, doctrinal_sensitivity, primary_reason, signal_keywords, and genre_reasoning.`;

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt + "\n\n" + getContentBehavioralEngine() },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let rawContent = aiData.choices?.[0]?.message?.content || "{}";

    // Strip markdown code fences if present
    rawContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (e) {
      console.error("Failed to parse AI response:", rawContent);
      throw new Error("AI returned invalid JSON");
    }

    const scores: Record<string, number> = {};
    const rawScores = parsed.scores || {};

    // Hard validation: strip any non-canonical room codes
    for (const [code, score] of Object.entries(rawScores)) {
      if (isValidRoomCode(code) && typeof score === 'number') {
        scores[code.toLowerCase()] = Math.min(10, Math.max(0, Math.round(score as number)));
      }
    }

    // Pick highest valid as primary, next 2-4 as secondary
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const primaryRoom = sorted[0]?.[0] || "sr";
    const secondaryRooms = sorted
      .slice(1)
      .filter(([_, score]) => score >= 5)
      .slice(0, 4)
      .map(([code]) => code);

    const genre = parsed.genre || "narrative";
    const doctrinalSensitivity = Math.min(10, Math.max(0, parsed.doctrinal_sensitivity || 0));

    const rationale = {
      primary_reason: parsed.primary_reason || "",
      signal_keywords: parsed.signal_keywords || [],
      genre_reasoning: parsed.genre_reasoning || "",
    };

    // Cache the result
    await supabase.from('passage_analysis_cache').upsert({
      passage_ref: passageRef,
      primary_room: primaryRoom,
      secondary_rooms: secondaryRooms,
      genre,
      doctrinal_sensitivity: doctrinalSensitivity,
      rationale,
      signal_scores: scores,
      model_version: 'v1',
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'passage_ref,model_version',
    });

    const result = {
      passage_ref: passageRef,
      primary_room: primaryRoom,
      secondary_rooms: secondaryRooms,
      genre,
      doctrinal_sensitivity: doctrinalSensitivity,
      rationale,
      signal_scores: scores,
      model_version: 'v1',
      cached: false,
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("PT Passage Analyzer error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
