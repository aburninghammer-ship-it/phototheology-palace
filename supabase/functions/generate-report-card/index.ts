import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, roomId, masteryLevel, drillHistory } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get recent drill performance data
    const { data: recentDrills } = await supabase
      .from("drill_results")
      .select("*")
      .eq("user_id", userId)
      .eq("room_id", roomId)
      .order("completed_at", { ascending: false })
      .limit(20);

    // Analyze performance with AI
    const analysisPrompt = `Analyze this student's performance in the ${roomId} room and create a detailed report card.

**Mastery Level Achieved:** ${masteryLevel}/5

**Recent Drill Performance:**
${recentDrills?.map(d => `- Score: ${d.score}/${d.max_score}, Time: ${d.time_seconds}s, Type: ${d.drill_type}`).join('\n') || 'No drill data available'}

Generate a comprehensive report card with:
1. **Strengths** (2-3 specific skills they excel at)
2. **Weaknesses** (2-3 areas needing improvement)
3. **Mistakes Repeated** (patterns of errors, if any)
4. **Skills Gained** (what they've mastered at this level)
5. **Suggested Next Rooms** (2-3 rooms that build on these skills)
6. **Personalized Training Plan** (specific exercises to improve weak areas)

Be specific, encouraging, and actionable. Format as JSON with these exact keys: strengths, weaknesses, mistakes, skills_gained, suggested_rooms, training_plan (all arrays of strings).`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a Phototheology instructor creating detailed, personalized report cards." },
          { role: "user", content: analysisPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const reportCard = JSON.parse(aiResponse.choices[0].message.content);

    // Store report card
    const { data: savedReport, error: saveError } = await supabase
      .from("room_report_cards")
      .insert({
        user_id: userId,
        room_id: roomId,
        mastery_level: masteryLevel,
        report_data: reportCard,
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return new Response(
      JSON.stringify({ success: true, reportCard: savedReport }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-report-card error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
