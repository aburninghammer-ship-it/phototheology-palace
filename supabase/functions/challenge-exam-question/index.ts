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
    const { exam_id, question_id, user_reasoning } = await req.json();
    if (!exam_id || !question_id || !user_reasoning?.trim()) {
      throw new Error("Missing exam_id, question_id, or user_reasoning");
    }

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
      .select("id, user_id, status, questions_data, per_question_grades, challenge_data")
      .eq("id", exam_id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !exam) throw new Error("Exam not found");
    if (exam.status !== "in_progress") throw new Error("Exam is not in progress");

    const grades = (exam.per_question_grades as Record<string, any>) || {};
    const grade = grades[String(question_id)];
    if (!grade) throw new Error("Question has not been graded yet");
    if (grade.correct && grade.earned >= 1) throw new Error("Question was already graded correct");

    const challenges = (exam.challenge_data as Record<string, any>) || {};
    if (challenges[String(question_id)]) throw new Error("Question has already been challenged");

    const questions = exam.questions_data as any[];
    const question = questions.find((q: any) => q.id === question_id);
    if (!question) throw new Error("Question not found");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const challengePrompt = `You are reviewing a student's challenge to their exam grade on a Phototheology master exam.

QUESTION: ${question.question}
CORRECT ANSWER: ${question.correct_answer}
STUDENT'S ANSWER: ${grade.user_answer}
ORIGINAL GRADE: ${grade.earned >= 0.5 ? "Partial credit (0.5/1)" : "Incorrect (0/1)"}
ORIGINAL FEEDBACK: ${grade.feedback}

STUDENT'S CHALLENGE REASONING:
${user_reasoning.trim()}

GRADING RUBRIC: ${JSON.stringify(question.grading_rubric || [])}
EXPLANATION: ${question.explanation}

IMPORTANT INSTRUCTIONS:
- Only accept this challenge if the student's reasoning genuinely demonstrates understanding of the correct concept.
- A student saying "I think I'm right" or "please reconsider" without substance is NOT sufficient.
- The student must provide a clear theological or factual clarification that shows their answer captures the key concept.
- Do NOT reverse the grade out of sympathy or politeness.
- If the student's original answer was genuinely wrong and their reasoning doesn't fix that, REJECT the challenge.
- If the student demonstrates genuine understanding that their answer, while worded differently, captures the essential truth, ACCEPT.`;

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
            content: "You are a strict but fair Phototheology exam review board. You evaluate student challenges to exam grades. You maintain high academic standards and only reverse grades when the student genuinely demonstrates understanding.",
          },
          { role: "user", content: challengePrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_challenge_decision",
              description: "Submit the challenge decision",
              parameters: {
                type: "object",
                properties: {
                  accepted: { type: "boolean", description: "Whether the challenge is accepted (grade reversed to correct)" },
                  feedback: { type: "string", description: "Explanation of the decision" },
                },
                required: ["accepted", "feedback"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_challenge_decision" } },
      }),
    });

    let accepted = false;
    let feedback = "Unable to process challenge — please try again.";

    if (response.ok) {
      const aiResult = await response.json();
      const toolCall = aiResult.choices[0]?.message?.tool_calls?.[0];
      if (toolCall) {
        const parsed = JSON.parse(toolCall.function.arguments);
        accepted = parsed.accepted;
        feedback = parsed.feedback;
      }
    } else {
      console.error("AI challenge error:", response.status, await response.text());
    }

    // Record challenge result
    challenges[String(question_id)] = {
      user_reasoning: user_reasoning.trim(),
      accepted,
      feedback,
      challenged_at: new Date().toISOString(),
    };

    // If accepted, update the grade
    if (accepted) {
      grades[String(question_id)] = {
        ...grade,
        correct: true,
        earned: 1,
        feedback: grade.feedback + " [Challenge accepted]",
        challenge_accepted: true,
      };
    }

    await supabaseClient
      .from("master_exam_attempts")
      .update({
        challenge_data: challenges,
        per_question_grades: grades,
      })
      .eq("id", exam_id);

    return new Response(
      JSON.stringify({ accepted, feedback }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Challenge exam question error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
