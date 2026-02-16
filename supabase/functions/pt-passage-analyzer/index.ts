// PT Passage Analyzer - Standalone edge function for Palace lens detection
// Detects primary + secondary rooms for a given passage using AI scoring

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { CANONICAL_ROOMS, ROOM_CODES, isValidRoomCode } from '../jeeves/canonical-rooms.ts';

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
            { role: "system", content: systemPrompt },
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
      JSON.stringify({ error: error.message || "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
