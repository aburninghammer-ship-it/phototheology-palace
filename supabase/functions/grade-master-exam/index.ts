import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { exam_id, answers, time_used_seconds, mode, room_name: clientRoomName } = await req.json();
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

    const { data: exam, error: fetchError } = await supabaseClient
      .from("master_exam_attempts")
      .select("*")
      .eq("id", exam_id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !exam) throw new Error("Exam not found");
    if (exam.status === "completed") throw new Error("Exam already graded");

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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // In finalize mode, read pre-graded results and only grade remaining
    const preGradedResults = (mode === "finalize" && exam.per_question_grades)
      ? (exam.per_question_grades as Record<string, any>)
      : {};

    // Auto-grade MC/TF, collect SA for AI grading (skipping pre-graded)
    const autoGradeResults: Record<number, { correct: boolean; feedback: string }> = {};
    const sentenceQuestions: any[] = [];

    for (const q of questions) {
      // Skip questions already pre-graded in finalize mode
      if (preGradedResults[String(q.id)]) continue;

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
          id: q.id, question: q.question, correct_answer: q.correct_answer,
          grading_rubric: q.grading_rubric || [], explanation: q.explanation,
          user_answer: userAnswer,
        });
      }
    }

    // AI-grade sentence answers (only ungraded ones)
    let aiGradingResults: Record<number, { correct: boolean; partial_credit: number; feedback: string }> = {};

    if (sentenceQuestions.length > 0) {
      // Retry up to 2 times for AI grading
      let gradingAttempts = 0;
      let gradingSuccess = false;
      while (gradingAttempts < 2 && !gradingSuccess) {
        gradingAttempts++;
        try {
          const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: gradingAttempts === 1 ? "google/gemini-2.5-flash" : "google/gemini-3-flash-preview",
              messages: [
                { role: "system", content: "You are a strict but fair Phototheology exam grader." },
                { role: "user", content: `Grade these sentence-answer questions:\n${JSON.stringify(sentenceQuestions, null, 2)}` },
              ],
              tools: [{
                type: "function",
                function: {
                  name: "submit_grades",
                  description: "Submit grades for sentence answers",
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
                  },
                },
              }],
              tool_choice: { type: "function", function: { name: "submit_grades" } },
            }),
          });

          if (response.ok) {
            const aiResult = await response.json();
            const toolCall = aiResult.choices[0]?.message?.tool_calls?.[0];
            if (toolCall) {
              const parsed = JSON.parse(toolCall.function.arguments);
              for (const g of parsed.grades) {
                aiGradingResults[g.question_id] = {
                  correct: g.correct, partial_credit: g.partial_credit, feedback: g.feedback,
                };
              }
              gradingSuccess = true;
            }
          } else {
            const errText = await response.text();
            console.error(`AI grading attempt ${gradingAttempts} failed: ${response.status}`, errText);
            if (response.status === 429 || response.status === 402) {
              // Don't retry rate limits / payment issues
              break;
            }
          }
        } catch (fetchErr) {
          console.error(`AI grading fetch error attempt ${gradingAttempts}:`, fetchErr);
        }
      }

      if (!gradingSuccess) {
        console.warn("All AI grading attempts failed, using fallback grades");
        for (const sq of sentenceQuestions) {
          aiGradingResults[sq.id] = { correct: false, partial_credit: 0, feedback: "Unable to grade — please retry." };
        }
      }
    }

    // Compute scores — merge pre-graded + newly graded
    let totalPoints = 0;
    let totalCorrect = 0;
    const categoryTotals: Record<string, { earned: number; possible: number }> = {};
    const perQuestionResults: any[] = [];

    for (const q of questions) {
      const cat = q.category;
      if (!categoryTotals[cat]) categoryTotals[cat] = { earned: 0, possible: 0 };
      categoryTotals[cat].possible += 1;

      let earned = 0, feedback = "", correct = false;

      // Check if pre-graded
      const preGrade = preGradedResults[String(q.id)];
      if (preGrade) {
        earned = preGrade.earned;
        correct = preGrade.correct;
        feedback = preGrade.feedback;
      } else if (q.type === "mc" || q.type === "tf") {
        const result = autoGradeResults[q.id];
        earned = result.correct ? 1 : 0;
        correct = result.correct;
        feedback = result.feedback;
      } else if (q.type === "sa") {
        const result = aiGradingResults[q.id];
        if (result) { earned = result.partial_credit; correct = result.correct; feedback = result.feedback; }
      }

      totalPoints += earned;
      if (earned >= 1) totalCorrect++;
      categoryTotals[cat].earned += earned;

      perQuestionResults.push({
        id: q.id, category: q.category, type: q.type, question: q.question,
        correct_answer: q.correct_answer, user_answer: answers[q.id] || "",
        correct, earned, feedback, explanation: q.explanation,
      });
    }

    const totalQ = questions.length;
    const overallScore = Math.round((totalPoints / totalQ) * 100);

    const categoryScores: Record<string, { earned: number; possible: number; percentage: number }> = {};
    for (const [cat, totals] of Object.entries(categoryTotals)) {
      categoryScores[cat] = {
        ...totals,
        percentage: totals.possible > 0 ? Math.round((totals.earned / totals.possible) * 100) : 0,
      };
    }

    // === DIAGNOSTIC ANALYSIS (for diagnostic exam types) ===
    const examType = exam.exam_type || "master";
    let diagnosticReport: any = null;
    const isRoomTest = examType.startsWith("room_test_");

    if (examType !== "master") {
      console.log("Generating diagnostic report...");
      
      const incorrectQuestions = perQuestionResults.filter((q: any) => !q.correct);
      const partialQuestions = perQuestionResults.filter((q: any) => q.earned === 0.5);

      let diagnosticPrompt: string;

      if (isRoomTest) {
        const roomCode = examType.replace("room_test_", "");
        const roomName = exam.room_name || roomCode.toUpperCase();
        
        diagnosticPrompt = `You are the Phototheology Room Intelligence Diagnostic Engine. Analyze this Room Test result for the "${roomName}" room and produce a mastery diagnosis.

ROOM: ${roomName} (Code: ${roomCode})
OVERALL SCORE: ${overallScore}%
TOTAL CORRECT: ${totalCorrect}/${totalQ}

CATEGORY BREAKDOWN:
${JSON.stringify(categoryScores, null, 2)}

INCORRECT ANSWERS (${incorrectQuestions.length}):
${JSON.stringify(incorrectQuestions.map((q: any) => ({
  category: q.category,
  question: q.question,
  user_answer: q.user_answer,
  correct_answer: q.correct_answer,
  type: q.type,
})), null, 2)}

PARTIAL CREDIT (${partialQuestions.length}):
${JSON.stringify(partialQuestions.map((q: any) => ({
  category: q.category,
  question: q.question,
  user_answer: q.user_answer,
  correct_answer: q.correct_answer,
})), null, 2)}

Generate a JSON diagnostic report with this EXACT structure:
{
  "competency_level": "beginner|developing|strong|advanced|guide|strategist",
  "competency_label": "Beginner Explorer|Developing Builder|Strong Connector|Advanced Interpreter|PT Guide|PT Strategist",
  "mastery_level": 1-5,
  "mastery_title": "Novice|Student|Builder|Teacher|Master",
  "room_score_summary": "One-sentence verdict: how well does the user understand and apply this room's discipline?",
  "strength_analysis": "2-3 sentences about what the user does well IN THIS ROOM's discipline, referencing specific question patterns",
  "weakness_analysis": "2-3 sentences about weak areas specific to THIS ROOM's method — be direct and constructive",
  "error_patterns": [
    {
      "pattern": "Description of the thinking error specific to this room's discipline",
      "frequency": 3,
      "examples": ["Brief example from their wrong answers"],
      "recommendation": "Specific actionable fix using this room's method"
    }
  ],
  "weakness_map": {
    "room_application": {"score": 75, "verdict": "Solid grasp of basic application"},
    "room_distinction": {"score": 50, "verdict": "Confuses this room with X room"},
    "room_depth": {"score": 60, "verdict": "Surface-level only — needs deeper engagement"},
    "room_integration": {"score": 40, "verdict": "Cannot yet connect this room to other PT principles"}
  },
  "weekly_plan": [
    {
      "day": "Monday",
      "focus": "Specific drill for this room",
      "activities": ["Activity 1 using this room's method", "Activity 2"],
      "time_minutes": 20
    },
    {"day": "Tuesday", "focus": "...", "activities": ["..."], "time_minutes": 20},
    {"day": "Wednesday", "focus": "...", "activities": ["..."], "time_minutes": 20},
    {"day": "Thursday", "focus": "...", "activities": ["..."], "time_minutes": 20},
    {"day": "Friday", "focus": "...", "activities": ["..."], "time_minutes": 20},
    {"day": "Saturday", "focus": "Review & correct mistakes", "activities": ["..."], "time_minutes": 25},
    {"day": "Sunday", "focus": "Mini-retest: 15 questions", "activities": ["Take targeted checkpoint quiz"], "time_minutes": 15}
  ],
  "focus_areas": ["Specific area 1 for this room", "Area 2", "Area 3"],
  "next_room_recommendation": "Which related room should the user study next to strengthen this room's discipline?"
}

RULES:
- ALL analysis must be specific to the ${roomName} room's discipline
- Mastery level: 1 (0-30%), 2 (31-50%), 3 (51-70%), 4 (71-85%), 5 (86-100%)
- The weekly plan should use THIS ROOM's specific exercises and methods
- Reference PT room names and principles specifically
- next_room_recommendation should name a complementary room`;
      } else {
        diagnosticPrompt = `You are the Phototheology Diagnostic Engine. Analyze this ${examType} exam result and produce a diagnostic report.

EXAM TYPE: ${examType}
OVERALL SCORE: ${overallScore}%
TOTAL CORRECT: ${totalCorrect}/${totalQ}

CATEGORY BREAKDOWN:
${JSON.stringify(categoryScores, null, 2)}

INCORRECT ANSWERS (${incorrectQuestions.length}):
${JSON.stringify(incorrectQuestions.map((q: any) => ({
  category: q.category,
  question: q.question,
  user_answer: q.user_answer,
  correct_answer: q.correct_answer,
  type: q.type,
})), null, 2)}

PARTIAL CREDIT (${partialQuestions.length}):
${JSON.stringify(partialQuestions.map((q: any) => ({
  category: q.category,
  question: q.question,
  user_answer: q.user_answer,
  correct_answer: q.correct_answer,
})), null, 2)}

Generate a JSON diagnostic report with this EXACT structure:
{
  "competency_level": "beginner|developing|strong|advanced|guide|strategist",
  "competency_label": "Beginner Explorer|Developing Builder|Strong Connector|Advanced Interpreter|PT Guide|PT Strategist",
  "strength_analysis": "2-3 sentences about what the user does well, referencing specific categories",
  "weakness_analysis": "2-3 sentences about weak areas, being direct but constructive",
  "error_patterns": [
    {
      "pattern": "Description of the thinking error",
      "frequency": 3,
      "examples": ["Brief example from their wrong answers"],
      "recommendation": "Specific actionable fix"
    }
  ],
  "weekly_plan": [
    {"day": "Monday", "focus": "Review Floor 1 room roles", "activities": ["Complete 10 room-classification drills", "Re-read Palace overview"], "time_minutes": 20},
    {"day": "Tuesday", "focus": "...", "activities": ["..."], "time_minutes": 20},
    {"day": "Wednesday", "focus": "...", "activities": ["..."], "time_minutes": 20},
    {"day": "Thursday", "focus": "...", "activities": ["..."], "time_minutes": 20},
    {"day": "Friday", "focus": "...", "activities": ["..."], "time_minutes": 20},
    {"day": "Saturday", "focus": "Review mistakes and rewrite incorrect answers", "activities": ["..."], "time_minutes": 25},
    {"day": "Sunday", "focus": "Mini-retest: 15 questions targeting weak areas", "activities": ["Take targeted checkpoint quiz"], "time_minutes": 15}
  ],
  "focus_areas": ["Area 1", "Area 2", "Area 3"]
}

RULES:
- Identify 2-5 error patterns based on the wrong answers
- The weekly plan should target the SPECIFIC weak categories
- Be direct in weakness analysis — don't sugarcoat
- Reference PT room names and principles specifically
- The plan should feel actionable, not generic`;
      }

      try {
        // Retry diagnostic with model fallback
        const diagModels = ["google/gemini-2.5-flash", "google/gemini-3-flash-preview"];
        for (const diagModel of diagModels) {
          try {
            const diagResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: diagModel,
                messages: [{ role: "user", content: diagnosticPrompt }],
                response_format: { type: "json_object" },
              }),
            });

            if (diagResponse.ok) {
              const diagResult = await diagResponse.json();
              const rawContent = diagResult.choices[0].message.content;
              let cleanContent = rawContent.trim();
              if (cleanContent.startsWith("```")) {
                cleanContent = cleanContent.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
              }
              diagnosticReport = JSON.parse(cleanContent);
              console.log(`Diagnostic report generated with ${diagModel}`);
              break;
            } else {
              const errText = await diagResponse.text();
              console.error(`Diagnostic AI failed with ${diagModel}: ${diagResponse.status}`, errText);
            }
          } catch (innerDiagErr) {
            console.error(`Diagnostic fetch error with ${diagModel}:`, innerDiagErr);
          }
        }
      } catch (diagErr) {
        console.error("Diagnostic generation error:", diagErr);
      }
    }

    // === UPDATE ROOM MASTERY LEVELS (for room tests) ===
    if (isRoomTest) {
      try {
        const roomCode = examType.replace("room_test_", "");
        const roomFloorMap: Record<string, number> = {
          sr: 1, ir: 1, "24fps": 1, br: 1, tr: 1, gr: 1,
          or: 2, dc: 2, st: 2, qr: 2, qa: 2,
          nf: 3, pf: 3, bf: 3, hf: 3, lr: 3,
          cr: 4, dr: 4, c6: 4, trm: 4, tz: 4, prm: 4, "p||": 4, frt: 4, cec: 4, r66: 4,
          bl: 5, pr: 5, "3a": 5, fe: 5, feasts: 5,
          "1h": 6, "2h": 6, "3h": 6, cycles: 6, jr: 6,
          frm: 7, mr: 7, srm: 7,
        };
        const floorNumber = roomFloorMap[roomCode] || 1;
        
        // Calculate mastery level from score
        let newMasteryLevel = 1;
        if (overallScore >= 86) newMasteryLevel = 5;
        else if (overallScore >= 71) newMasteryLevel = 4;
        else if (overallScore >= 51) newMasteryLevel = 3;
        else if (overallScore >= 31) newMasteryLevel = 2;

        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // Check existing mastery
        const { data: existing } = await supabaseAdmin
          .from("room_mastery_levels")
          .select("id, mastery_level, total_drills_completed, perfect_scores_count, xp_current")
          .eq("user_id", user.id)
          .eq("room_id", roomCode)
          .maybeSingle();

        const xpEarned = Math.round(overallScore * 2); // 0-200 XP per test
        const isPerfect = overallScore >= 95;

        if (existing) {
          // Only update level if new score is higher
          const bestLevel = Math.max(existing.mastery_level || 1, newMasteryLevel);
          await supabaseAdmin
            .from("room_mastery_levels")
            .update({
              mastery_level: bestLevel,
              total_drills_completed: (existing.total_drills_completed || 0) + 1,
              perfect_scores_count: (existing.perfect_scores_count || 0) + (isPerfect ? 1 : 0),
              xp_current: (existing.xp_current || 0) + xpEarned,
              last_activity_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          await supabaseAdmin
            .from("room_mastery_levels")
            .insert({
              user_id: user.id,
              room_id: roomCode,
              floor_number: floorNumber,
              mastery_level: newMasteryLevel,
              total_drills_completed: 1,
              perfect_scores_count: isPerfect ? 1 : 0,
              xp_current: xpEarned,
              xp_required: 500,
              last_activity_at: new Date().toISOString(),
            });
        }

        // Add mastery data to diagnostic report
        if (diagnosticReport) {
          diagnosticReport.mastery_update = {
            room_code: roomCode,
            floor_number: floorNumber,
            new_level: newMasteryLevel,
            xp_earned: xpEarned,
            is_perfect: isPerfect,
          };
        }

        console.log(`Room mastery updated: ${roomCode} → Level ${newMasteryLevel}, +${xpEarned} XP`);
      } catch (masteryErr) {
        console.error("Failed to update room mastery:", masteryErr);
      }
    }

    // Update exam row
    const updateData: any = {
      user_answers: answers,
      score: overallScore,
      total_correct: totalCorrect,
      category_scores: categoryScores,
      ai_grading: perQuestionResults,
      time_used_seconds,
      status: "completed",
      graded_at: new Date().toISOString(),
    };

    if (diagnosticReport) {
      updateData.diagnostic_report = diagnosticReport;
      updateData.error_patterns = diagnosticReport.error_patterns || [];
    }

    await supabaseClient
      .from("master_exam_attempts")
      .update(updateData)
      .eq("id", exam_id);

    // Insert game score
    await supabaseClient.from("game_scores").insert({
      user_id: user.id,
      game_type: examType === "master" ? "master_exam" : `diagnostic_${examType}`,
      score: overallScore,
      mode: "exam",
      metadata: {
        exam_id, exam_type: examType, total_correct: totalCorrect,
        time_used_seconds, attempt_number: exam.attempt_number,
      },
    });

    // Feed diagnostic data into palace-ai-engine learning profile
    if (diagnosticReport && examType !== "master") {
      try {
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );
        
        // Upsert exam diagnostic data into learning profile
        const { data: existingProfile } = await supabaseAdmin
          .from("user_learning_profiles")
          .select("recommended_focus_areas")
          .eq("user_id", user.id)
          .single();

        const mergedFocus = [
          ...(existingProfile?.recommended_focus_areas || []),
          ...(diagnosticReport.focus_areas || []),
        ].filter((v: string, i: number, a: string[]) => a.indexOf(v) === i).slice(0, 10);

        await supabaseAdmin.from("user_learning_profiles").upsert({
          user_id: user.id,
          recommended_focus_areas: mergedFocus,
          last_analysis_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        console.log("Learning profile updated with exam diagnostics");
      } catch (profileErr) {
        console.error("Failed to update learning profile:", profileErr);
      }
    }

    return new Response(
      JSON.stringify({
        score: overallScore,
        total_correct: totalCorrect,
        total_questions: totalQ,
        category_scores: categoryScores,
        per_question: perQuestionResults,
        diagnostic: diagnosticReport,
        exam_type: examType,
        room_name: isRoomTest ? (clientRoomName || examType.replace("room_test_", "").toUpperCase()) : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Grade master exam error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
