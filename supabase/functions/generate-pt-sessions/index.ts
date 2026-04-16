import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pathId, count = 3 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch path with track and user profile
    const { data: path, error: pathError } = await supabase
      .from('user_study_paths')
      .select(`
        *,
        track:pt_study_tracks(*),
        profile:user_study_profiles(*)
      `)
      .eq('id', pathId)
      .single();

    if (pathError || !path) {
      throw new Error(`Failed to fetch path: ${pathError?.message}`);
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_study_profiles')
      .select('*')
      .eq('user_id', path.user_id)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
    }

    // Build context for AI
    const track = path.track;
    const userContext = {
      role: profile.user_role,
      level: path.demonstrated_level || 'beginner',
      burdens: profile.primary_burdens,
      painPoints: profile.pain_points,
      learningStyle: profile.learning_preference,
      timeAvailable: profile.available_time_minutes,
      confidences: {
        bibleStoryline: profile.confidence_bible_storyline,
        gospelBasics: profile.confidence_gospel_basics,
        sanctuaryBasics: profile.confidence_sanctuary_basics,
        prophecy: profile.confidence_prophecy,
        parablesSymbols: profile.confidence_parables_symbols,
        crossReferencing: profile.confidence_cross_referencing,
        studyConsistency: profile.confidence_study_consistency,
      },
    };

    const systemPrompt = `You are Jeeves, the AI tutor for PhotoTheology - a structured Bible study system based on the "Palace" metaphor with 8 floors and multiple rooms.

CRITICAL CONSTRAINTS:
- You MUST use ONLY these official Palace rooms and codes:
  Floor 1 (Furnishing): SR (Story Room), IR (Imagination Room), 24 (24FPS), BR (Bible Rendered), TR (Translation), GR (Gems)
  Floor 2 (Investigation): OR (Observation), DC (Def-Com), ST (Symbols/Types), QR (Questions), QA (Q&A Chains)
  Floor 3 (Freestyle): NF (Nature), PF (Personal), BF (Bible/Verse Genetics), HF (History/Social), LR (Listening)
  Floor 4 (Next Level): CR (Concentration), DR (Dimensions), C6 (Connect 6), TRm (Theme), TZ (Time Zone), PRm (Patterns), P‖ (Parallels), FRt (Fruit)
  Floor 5 (Vision): BL (Blue/Sanctuary), PR (Prophecy), 3A (Three Angels)
  Floor 6 (Cycles/Heavens): @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re + 1H, 2H, 3H, JR (Juice)
  Floor 7 (Spiritual): FRm (Fire), MR (Meditation), SRm (Speed)
  Floor 8 (Master): Reflexive thinking (no rooms)

- Never invent new rooms or principles
- Every session MUST be Christ-centered (pass through CR - Concentration Room)
- Content must match the user's level (beginner = guided, intermediate = independent, master = teaching)
- Adapt to learning style: visual = images/diagrams, structured_text = outlines, audio = listening exercises, interactive = activities

SESSION STRUCTURE:
Session 1 (Orientation): Welcome + early win. Introduce ONE room with immediate application.
Session 2 (Skill Focus): Deep dive into ONE principle from the track's focus rooms.
Session 3 (Integration): Combine TWO compatible rooms to see Christ more clearly.

Generate sessions as JSON array with this structure:
[
  {
    "session_number": 1,
    "title": "Engaging title",
    "session_type": "orientation" | "skill_focus" | "integration",
    "primary_room_codes": ["SR"], // Max 2
    "secondary_room_codes": [], // Supporting rooms
    "floor_numbers": [1],
    "skill_focus": "What skill they'll develop",
    "confidence_targets": ["What should improve"],
    "content": {
      "intro": "Opening context (2-3 sentences)",
      "exercises": [
        {
          "type": "observation" | "application" | "reflection" | "quiz" | "creative",
          "instruction": "What to do",
          "content": { "passage": "John 3:16", "questions": ["..."], "activity": "..." }
        }
      ],
      "reflection": "Closing thought",
      "next_steps": ["What to do next"]
    }
  }
]`;

    const userPrompt = `Generate ${count} sessions for this user:

TRACK: ${track.name}
DESCRIPTION: ${track.description}
FOCUS ROOMS: ${track.room_focus.join(', ')}
FOCUS FLOORS: ${track.floor_focus.join(', ')}

USER PROFILE:
- Role: ${userContext.role}
- Level: ${userContext.level}
- Primary burdens: ${userContext.burdens.join(', ')}
- Pain points: ${JSON.stringify(userContext.painPoints)}
- Learning style: ${userContext.learningStyle}
- Time available: ${userContext.timeAvailable} minutes per session
- Confidence levels: ${JSON.stringify(userContext.confidences)}

Generate ${count} sessions following the session structure rules. Make exercises practical and achievable within ${userContext.timeAvailable} minutes.`;

    console.log("Generating sessions for path:", pathId);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    let sessions;
    try {
      const parsed = JSON.parse(content);
      sessions = parsed.sessions || parsed;
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    if (!Array.isArray(sessions)) {
      sessions = [sessions];
    }

    // Insert sessions into database
    const sessionsToInsert = sessions.map((session: any, index: number) => ({
      path_id: pathId,
      session_number: path.current_session_number + index,
      title: session.title,
      session_type: session.session_type,
      primary_room_codes: session.primary_room_codes || [],
      secondary_room_codes: session.secondary_room_codes || [],
      floor_numbers: session.floor_numbers || [],
      content: session.content || {},
      skill_focus: session.skill_focus,
      confidence_targets: session.confidence_targets || [],
    }));

    const { data: insertedSessions, error: insertError } = await supabase
      .from('pt_sessions')
      .insert(sessionsToInsert)
      .select();

    if (insertError) {
      console.error("Failed to insert sessions:", insertError);
      throw new Error(`Failed to save sessions: ${insertError.message}`);
    }

    console.log("Successfully generated", insertedSessions.length, "sessions");

    return new Response(
      JSON.stringify({ sessions: insertedSessions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error("Error generating sessions:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
