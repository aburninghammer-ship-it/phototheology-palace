import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const JUDGING_RUBRIC = `
You are Jeeves, a wise theological AI assistant for PhotoTheology (PT).
You are judging submissions for the weekly Bible study challenge.

SCORING RUBRIC (100 points total):

1. DEPTH (0-25 points):
   - Original insights not commonly known (5-10)
   - Multi-layered understanding (5-10)
   - Connects surface and deep meaning (5-5)
   - Shows genuine discovery vs surface observation (0-5)

2. BIBLICAL ACCURACY (0-25 points):
   - Accurate Scripture interpretation (5-10)
   - Context-aware reading (historical, literary) (5-5)
   - No eisegesis (reading into text) (5-5)
   - Harmonizes with whole Bible (0-5)
   - Respects sanctuary blueprint when relevant (0-5)

3. PT PRINCIPLES (0-25 points):
   - Correct PT principle identification (5-10)
   - Types/Parallels/Patterns properly applied (5-10)
   - Christ-centered interpretation (5-5)
   - Sanctuary connections when relevant (0-5)

4. CLARITY (0-25 points):
   - Clear thesis/main point (5-10)
   - Logical flow of thought (5-5)
   - Supporting evidence provided (5-5)
   - Accessible language (0-5)

IMPORTANT GUIDELINES:
- Be encouraging but honest
- Highlight what was done well
- Provide constructive feedback
- Identify 1-2 standout quotes from exceptional submissions
- Consider depth over length
- Reward biblical accuracy highly
- Penalize speculation or forced typology

OUTPUT FORMAT (JSON):
{
  "ai_score": number (0-100),
  "depth_score": number (0-25),
  "biblical_score": number (0-25),
  "pt_score": number (0-25),
  "clarity_score": number (0-25),
  "ai_feedback": "2-3 sentence constructive feedback",
  "highlight_quotes": ["Notable quote 1", "Notable quote 2"] // Empty if none stand out
}
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { challengeId, manual } = await req.json();

    // Get the challenge
    let challenge;
    if (challengeId) {
      const { data, error } = await supabase
        .from("weekly_study_challenges")
        .select("*")
        .eq("id", challengeId)
        .single();
      if (error) throw error;
      challenge = data;
    } else {
      // Get current week's challenge that's ready for judging
      const { data, error } = await supabase
        .from("weekly_study_challenges")
        .select("*")
        .eq("status", "active")
        .lte("ends_at", new Date().toISOString())
        .order("ends_at", { ascending: false })
        .limit(1)
        .single();
      if (error) throw error;
      challenge = data;
    }

    if (!challenge) {
      return new Response(
        JSON.stringify({ error: "No challenge ready for judging" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Get all submissions for this challenge
    const { data: submissions, error: subError } = await supabase
      .from("weekly_study_submissions")
      .select("*")
      .eq("challenge_id", challenge.id)
      .is("ai_score", null); // Only unjudged submissions

    if (subError) throw subError;

    if (!submissions || submissions.length === 0) {
      return new Response(
        JSON.stringify({ message: "No submissions to judge", judged: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Judging ${submissions.length} submissions for challenge: ${challenge.title}`);

    const aiGatewayUrl = Deno.env.get("AI_GATEWAY_URL") || "https://ai.lovable.dev/api/chat";

    // Judge each submission
    const judgedResults = [];
    for (const submission of submissions) {
      try {
        const prompt = `
Challenge: "${challenge.title}"
Anchor Passage: ${challenge.anchor_passage}
Study Prompt: ${challenge.study_prompt}
PT Focus Areas: ${challenge.pt_focus?.join(", ") || "General"}

SUBMISSION TO JUDGE:

Main Insight:
${submission.main_insight}

Scripture Connections: ${submission.scripture_connections?.join(", ") || "None provided"}

PT Principles Applied: ${submission.pt_principles_applied?.join(", ") || "None specified"}

Practical Application:
${submission.practical_application || "Not provided"}

Supporting Evidence:
${submission.supporting_evidence || "Not provided"}

---
Please evaluate this submission according to the rubric and return ONLY valid JSON.
`;

        const response = await fetch(aiGatewayUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("AI_GATEWAY_API_KEY")}`,
          },
          body: JSON.stringify({
            messages: [
              { role: "system", content: JUDGING_RUBRIC },
              { role: "user", content: prompt },
            ],
            model: "gemini-2.5-flash",
            temperature: 0.3,
          }),
        });

        if (!response.ok) {
          console.error(`AI error for submission ${submission.id}:`, await response.text());
          continue;
        }

        const aiResponse = await response.json();
        const content = aiResponse.choices?.[0]?.message?.content || "";

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error(`No JSON found in response for submission ${submission.id}`);
          continue;
        }

        const scores = JSON.parse(jsonMatch[0]);

        // Update submission with scores
        const { error: updateError } = await supabase
          .from("weekly_study_submissions")
          .update({
            ai_score: scores.ai_score,
            depth_score: scores.depth_score,
            biblical_score: scores.biblical_score,
            pt_score: scores.pt_score,
            clarity_score: scores.clarity_score,
            ai_feedback: scores.ai_feedback,
            highlight_quotes: scores.highlight_quotes || [],
          })
          .eq("id", submission.id);

        if (updateError) {
          console.error(`Update error for submission ${submission.id}:`, updateError);
          continue;
        }

        judgedResults.push({
          id: submission.id,
          user_id: submission.user_id,
          score: scores.ai_score,
        });

        // Small delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error(`Error judging submission ${submission.id}:`, err);
      }
    }

    // Select winners (top 3)
    if (judgedResults.length > 0) {
      const sorted = judgedResults.sort((a, b) => b.score - a.score);
      const top3 = sorted.slice(0, 3);

      // Get winner profiles for commentary
      const winnerCommentary = [
        "Exceptional depth of insight and Christ-centered interpretation. Your understanding of the sanctuary blueprint connection was particularly noteworthy.",
        "Strong biblical accuracy and clear application. Your parallel connections showed mature theological thinking.",
        "Solid grasp of PT principles with practical wisdom. Your clarity made complex truths accessible.",
      ];

      const badges = ["Weekly Scholar", null, null];
      const xpRewards = [200, 100, 75];

      for (let i = 0; i < top3.length; i++) {
        const winner = top3[i];

        // Get the submission for standout insight
        const submission = submissions.find((s) => s.id === winner.id);

        await supabase.from("weekly_study_winners").insert({
          challenge_id: challenge.id,
          submission_id: winner.id,
          user_id: winner.user_id,
          rank: i + 1,
          jeeves_commentary: winnerCommentary[i],
          standout_insight: submission?.main_insight?.substring(0, 200),
          xp_awarded: xpRewards[i],
          badge_awarded: badges[i],
        });

        // Award XP (if function exists)
        try {
          await supabase.rpc("award_xp", {
            p_user_id: winner.user_id,
            p_amount: xpRewards[i],
          });
        } catch (e) {
          console.log("XP award function not available");
        }
      }

      // Update challenge status to judged
      await supabase
        .from("weekly_study_challenges")
        .update({ status: "judged" })
        .eq("id", challenge.id);

      // Create notifications for winners
      for (let i = 0; i < top3.length; i++) {
        await supabase.from("notifications").insert({
          user_id: top3[i].user_id,
          type: "weekly_challenge_winner",
          title: i === 0 ? "You Won This Week's Challenge!" : `You placed ${i + 1}${i === 1 ? "nd" : "rd"} in the Weekly Challenge!`,
          message: `Congratulations! ${winnerCommentary[i]}`,
          link: "/weekly-challenge",
          metadata: {
            rank: i + 1,
            xp_awarded: xpRewards[i],
            badge: badges[i],
          },
        });
      }

      // Broadcast live notification
      const channel = supabase.channel("weekly-winner");
      await channel.send({
        type: "broadcast",
        event: "weekly-winner-announced",
        payload: {
          challengeId: challenge.id,
          challengeTitle: challenge.title,
          winnerId: top3[0].user_id,
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        judged: judgedResults.length,
        winners: judgedResults.slice(0, 3).map((r, i) => ({
          rank: i + 1,
          score: r.score,
        })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Judge weekly submissions error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
