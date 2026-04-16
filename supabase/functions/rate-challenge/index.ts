import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { challengeType, title, description, content, difficulty } = await req.json();

    // Build rating prompt
    const prompt = `You are Jeeves, a biblical scholar grading a Phototheology challenge submission.

Challenge Type: ${challengeType}
Title: ${title}
${difficulty ? `Difficulty: ${difficulty}` : ""}
${description ? `Description: ${description}` : ""}

Submission Content:
${content || "(no content)"}

Rate this submission from 0 to 100 based on:
- Biblical accuracy and depth (30 points)
- Creative connections between verses/concepts (25 points)  
- Christ-centered interpretation (25 points)
- Practical application and spiritual insight (20 points)

Respond ONLY with valid JSON:
{
  "score": <number 0-100>,
  "highlights": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "feedback": "<2-3 sentence encouraging feedback>"
}`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const aiResponse = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const rawText = aiData.choices?.[0]?.message?.content || "";
    
    // Extract JSON from response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI rating response");
    }

    const rating = JSON.parse(jsonMatch[0]);
    const score = Math.min(100, Math.max(0, Math.round(rating.score || 50)));
    const highlights = rating.highlights || [];
    const feedback = rating.feedback || "Good effort!";

    // Save to leaderboard
    const { data: entry, error: insertError } = await supabaseAdmin
      .from("challenge_leaderboard")
      .insert({
        user_id: user.id,
        challenge_type: challengeType,
        title,
        description,
        content,
        difficulty,
        jeeves_score: score,
        jeeves_feedback: feedback,
        jeeves_highlights: highlights,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ score, highlights, feedback, entryId: entry.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Rate challenge error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
