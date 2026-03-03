import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { exam_id, answers, time_used_seconds } = await req.json();
    if (!exam_id || !answers) throw new Error("Missing exam_id or answers");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Fetch exam with full questions data
    const { data: exam, error: fetchError } = await supabaseClient
      .from("master_exam_attempts")
      .select("*")
      .eq("id", exam_id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !exam) throw new Error("Exam not found");
    if (exam.status === "completed") throw new Error("Exam already graded");

    // Mark as submitted
    await supabaseClient
      .from("master_exam_attempts")
      .update({
        status: "grading",
        user_answers: answers,
        time_used_seconds,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", exam_id);

    const questions = exam.questions_data as any[];

    // Separate MC/TF (auto-grade) from SA (AI-grade)
    const autoGradeResults: Record<number, { correct: boolean; feedback: string }> = {};
    const sentenceQuestions: any[] = [];

    for (const q of questions) {
      const userAnswer = answers[q.id]?.trim() || "";

      if (q.type === "mc" || q.type === "tf") {
        const isCorrect = userAnswer.toLowerCase() === q.correct_answer.toLowerCase();
        autoGradeResults[q.id] = {
          correct: isCorrect,
          feedback: isCorrect
            ? "Correct!"
            : `Incorrect. The correct answer is: ${q.correct_answer}. ${q.explanation}`,
        };
      } else if (q.type === "sa") {
        sentenceQuestions.push({
          id: q.id,
          question: q.question,
          correct_answer: q.correct_answer,
          grading_rubric: q.grading_rubric || [],
          explanation: q.explanation,
          user_answer: userAnswer,
        });
      }
    }

    // AI-grade sentence answers
    let aiGradingResults: Record<number, { correct: boolean; partial_credit: number; feedback: string }> = {};

    if (sentenceQuestions.length > 0) {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

      const gradingPrompt = `Grade these sentence-answer questions from a Phototheology master exam.
For each question, evaluate the student's answer against the correct answer and grading rubric.
Award partial credit: 0 (wrong/blank), 0.5 (partially correct), or 1 (fully correct).
Provide brief, specific feedback.

Questions to grade:
${JSON.stringify(sentenceQuestions, null, 2)}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              content: "You are a strict but fair Phototheology exam grader. Grade each sentence answer against the rubric. Be specific in feedback.",
            },
            { role: "user", content: gradingPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "submit_grades",
                description: "Submit grades for all sentence answers",
                parameters: {
                  type: "object",
                  properties: {
                    grades: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          question_id: { type: "number" },
                          correct: { type: "boolean" },
                          partial_credit: { type: "number", enum: [0, 0.5, 1] },
                          feedback: { type: "string" },
                        },
                        required: ["question_id", "correct", "partial_credit", "feedback"],
                      },
                    },
                  },
                  required: ["grades"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "submit_grades" } },
        }),
      });

      if (!response.ok) {
        console.error("AI grading error:", response.status, await response.text());
        // Fallback: mark all SA as 0
        for (const sq of sentenceQuestions) {
          aiGradingResults[sq.id] = {
            correct: false,
            partial_credit: 0,
            feedback: "Unable to grade — please review manually.",
          };
        }
      } else {
        const aiResult = await response.json();
        const toolCall = aiResult.choices[0]?.message?.tool_calls?.[0];
        if (toolCall) {
          const parsed = JSON.parse(toolCall.function.arguments);
          for (const g of parsed.grades) {
            aiGradingResults[g.question_id] = {
              correct: g.correct,
              partial_credit: g.partial_credit,
              feedback: g.feedback,
            };
          }
        }
      }
    }

    // Compute scores
    let totalPoints = 0;
    let totalCorrect = 0;
    const categoryTotals: Record<string, { earned: number; possible: number }> = {};
    const perQuestionResults: any[] = [];

    for (const q of questions) {
      const cat = q.category;
      if (!categoryTotals[cat]) categoryTotals[cat] = { earned: 0, possible: 0 };
      categoryTotals[cat].possible += 1;

      let earned = 0;
      let feedback = "";
      let correct = false;

      if (q.type === "mc" || q.type === "tf") {
        const result = autoGradeResults[q.id];
        earned = result.correct ? 1 : 0;
        correct = result.correct;
        feedback = result.feedback;
      } else if (q.type === "sa") {
        const result = aiGradingResults[q.id];
        if (result) {
          earned = result.partial_credit;
          correct = result.correct;
          feedback = result.feedback;
        }
      }

      totalPoints += earned;
      if (earned >= 1) totalCorrect++;
      categoryTotals[cat].earned += earned;

      perQuestionResults.push({
        id: q.id,
        category: q.category,
        type: q.type,
        question: q.question,
        correct_answer: q.correct_answer,
        user_answer: answers[q.id] || "",
        correct,
        earned,
        feedback,
        explanation: q.explanation,
      });
    }

    const overallScore = Math.round((totalPoints / 50) * 100);

    const categoryScores: Record<string, { earned: number; possible: number; percentage: number }> = {};
    for (const [cat, totals] of Object.entries(categoryTotals)) {
      categoryScores[cat] = {
        ...totals,
        percentage: totals.possible > 0 ? Math.round((totals.earned / totals.possible) * 100) : 0,
      };
    }

    // Update exam row
    const { error: updateError } = await supabaseClient
      .from("master_exam_attempts")
      .update({
        user_answers: answers,
        score: overallScore,
        total_correct: totalCorrect,
        category_scores: categoryScores,
        ai_grading: perQuestionResults,
        time_used_seconds,
        status: "completed",
        graded_at: new Date().toISOString(),
      })
      .eq("id", exam_id);

    if (updateError) console.error("Failed to update exam:", updateError);

    // Insert into game_scores for leaderboard
    const { error: scoreError } = await supabaseClient.from("game_scores").insert({
      user_id: user.id,
      game_type: "master_exam",
      score: overallScore,
      mode: "exam",
      metadata: {
        exam_id,
        total_correct: totalCorrect,
        time_used_seconds,
        attempt_number: exam.attempt_number,
      },
    });

    if (scoreError) console.error("Failed to insert game_score:", scoreError);

    return new Response(
      JSON.stringify({
        score: overallScore,
        total_correct: totalCorrect,
        total_questions: 50,
        category_scores: categoryScores,
        per_question: perQuestionResults,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Grade master exam error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
