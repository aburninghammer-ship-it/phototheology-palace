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
    const { exam_id, question_id, user_answer } = await req.json();
    if (!exam_id || !question_id) throw new Error("Missing exam_id or question_id");

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

    // Fetch exam
    const { data: exam, error: fetchError } = await supabaseClient
      .from("master_exam_attempts")
      .select("id, user_id, status, questions_data, per_question_grades")
      .eq("id", exam_id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !exam) throw new Error("Exam not found");
    if (exam.status !== "in_progress") throw new Error("Exam is not in progress");

    const questions = exam.questions_data as any[];
    const question = questions.find((q: any) => q.id === question_id);
    if (!question) throw new Error("Question not found");

    const answer = (user_answer || "").trim();
    let correct = false;
    let earned = 0;
    let feedback = "";

    if (question.type === "mc" || question.type === "tf") {
      // Exact match grading
      correct = answer.toLowerCase() === question.correct_answer.toLowerCase();
      earned = correct ? 1 : 0;
      feedback = correct
        ? "Correct!"
        : "Incorrect.";
    } else if (question.type === "sa") {
      // AI grading for short answer
      if (!answer) {
        correct = false;
        earned = 0;
        feedback = "No answer provided.";
      } else {
        const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
        if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

        const gradingPrompt = `Grade this short-answer question from a Phototheology master exam.

Question: ${question.question}
Correct Answer: ${question.correct_answer}
Grading Rubric: ${JSON.stringify(question.grading_rubric || [])}
Student's Answer: ${answer}

Evaluate the student's answer. Award partial credit: 0 (wrong/blank), 0.5 (partially correct), or 1 (fully correct).
Provide brief, specific feedback explaining why the answer earned its grade. Do NOT reveal the correct answer in your feedback.`;

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
                content: "You are a strict but fair Phototheology exam grader. Grade the answer against the rubric. Be specific in feedback. Do NOT reveal the correct answer.",
              },
              { role: "user", content: gradingPrompt },
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "submit_grade",
                  description: "Submit grade for the answer",
                  parameters: {
                    type: "object",
                    properties: {
                      correct: { type: "boolean" },
                      partial_credit: { type: "number", enum: [0, 0.5, 1] },
                      feedback: { type: "string" },
                    },
                    required: ["correct", "partial_credit", "feedback"],
                    additionalProperties: false,
                  },
                },
              },
            ],
            tool_choice: { type: "function", function: { name: "submit_grade" } },
          }),
        });

        if (!response.ok) {
          console.error("AI grading error:", response.status, await response.text());
          feedback = "Unable to grade — please try again.";
          earned = 0;
          correct = false;
        } else {
          const aiResult = await response.json();
          const toolCall = aiResult.choices[0]?.message?.tool_calls?.[0];
          if (toolCall) {
            const parsed = JSON.parse(toolCall.function.arguments);
            correct = parsed.correct;
            earned = parsed.partial_credit;
            feedback = parsed.feedback;
          } else {
            feedback = "Unable to grade — please try again.";
            earned = 0;
            correct = false;
          }
        }
      }
    }

    // Write result to per_question_grades JSONB column
    const existingGrades = (exam.per_question_grades as Record<string, any>) || {};
    existingGrades[String(question_id)] = {
      correct,
      earned,
      feedback,
      user_answer: answer,
      graded_at: new Date().toISOString(),
    };

    await supabaseClient
      .from("master_exam_attempts")
      .update({ per_question_grades: existingGrades })
      .eq("id", exam_id);

    return new Response(
      JSON.stringify({ correct, earned, feedback }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Grade single question error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
