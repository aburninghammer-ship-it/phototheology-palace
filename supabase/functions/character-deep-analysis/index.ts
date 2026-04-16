import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { characterData } = await req.json();
    if (!characterData?.id || !characterData?.name) {
      return new Response(JSON.stringify({ error: "Missing character data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check cache first
    const { data: cached } = await supabase
      .from("character_deep_analyses")
      .select("analysis_text")
      .eq("character_id", characterData.id)
      .single();

    if (cached?.analysis_text) {
      return new Response(JSON.stringify({ analysis: cached.analysis_text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const char = characterData;
    const prompt = `You are a biblical psychologist and spiritual counselor writing a comprehensive character analysis. Write a detailed 1,500-2,000 word therapeutic psychological profile of the biblical character "${char.name}" (${char.meaning}).

CHARACTER DATA:
- Role: ${char.role}
- Era: ${char.era}
- Key Scriptures: ${char.keyScriptures?.join(", ")}
- Archetypes: ${char.archetypes?.join(", ")}
- Story Arc: ${char.storyArc}
- Strengths: ${char.strengths?.join(", ")}
- Weaknesses: ${char.weaknesses?.join(", ")}
- Driving Fears: ${char.therapyView?.drivingFears?.join(", ")}
- Core Motivations: ${char.therapyView?.coreMotivations?.join(", ")}
- Relational Style: ${char.therapyView?.relationalStyle}
- Blind Spots: ${char.therapyView?.blindSpots?.join(", ")}
- Healing Moments: ${char.therapyView?.healingMoments?.join(", ")}
- Journey Phases: ${char.journey?.map((j: any) => `${j.phase}: ${j.description}`).join("; ")}
- Key Verse: "${char.quickCard?.keyVerse}" (${char.quickCard?.keyVerseRef})

Write the analysis using these sections (use markdown ## headers):

## Psychological Profile
Analyze their core personality structure, attachment style, and emotional patterns. What drove them at the deepest level? What unconscious patterns shaped their decisions?

## Wounds & Defense Mechanisms
What were their core wounds (abandonment, rejection, shame, powerlessness, etc.)? How did they protect themselves? What defense mechanisms did they employ (denial, projection, displacement, sublimation)?

## Relational Dynamics
How did they relate to authority figures, peers, and those under their care? What patterns repeated in their relationships? Were they avoidant, anxious, or secure in attachment?

## The Turning Point
What was the pivotal moment of transformation or crisis? How did God meet them in their brokenness? What shifted internally?

## Growth Arc & Redemption
How did they grow or fail to grow? What does their journey teach us about the process of sanctification and character development?

## Mirror for the Modern Believer
What does this character's story reveal about our own struggles? How might someone today see themselves in this character's patterns? Include 3-4 penetrating self-reflection questions.

STYLE GUIDELINES:
- Write in a warm but incisive therapeutic voice — like a wise counselor unpacking a case study
- Ground every insight in specific biblical events and texts (cite chapter/verse)
- Use psychological language accessibly (explain terms when used)
- Make it deeply personal and applicable, not academic
- Use KJV for any direct Scripture quotes
- Do NOT use the word "Adventist" or any denominational labels
- Write with empathy and depth — this should feel like sitting with a counselor who truly understands the human soul`;

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
            {
              role: "system",
              content:
                "You are a biblical psychologist and spiritual counselor with deep expertise in Scripture and human psychology. You write with warmth, depth, and clinical precision. You never use denominational labels.",
            },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI error:", response.status, errText);
      throw new Error("AI generation failed");
    }

    const aiResult = await response.json();
    const analysisText =
      aiResult.choices?.[0]?.message?.content || "Analysis generation failed.";

    // Cache the result
    await supabase.from("character_deep_analyses").upsert(
      {
        character_id: characterData.id,
        analysis_text: analysisText,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "character_id" }
    );

    return new Response(JSON.stringify({ analysis: analysisText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
