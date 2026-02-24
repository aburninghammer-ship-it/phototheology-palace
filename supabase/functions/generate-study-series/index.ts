import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_MODEL = "google/gemini-3-flash-preview";

type TargetAudience = "adults" | "youth" | "children" | "mixed";

const AUDIENCE_ADJUSTMENTS: Record<TargetAudience, string> = {
  adults: `
    - Use mature theological language and concepts
    - Include deeper doctrinal discussions
    - Reference scholarly insights where appropriate
    - Applications should address adult life situations (work, marriage, parenting, etc.)`,
  youth: `
    - Use engaging, relatable language
    - Include relevant modern examples and analogies
    - Keep sections concise and interactive
    - Applications should address teen challenges (identity, peer pressure, purpose)`,
  children: `
    - Use simple, clear language
    - Include visual descriptions and stories
    - Keep lessons short with hands-on activities
    - Applications should be concrete and age-appropriate`,
  mixed: `
    - Balance depth with accessibility
    - Include discussion points for different ages
    - Provide tiered applications for different life stages
    - Use family-friendly examples`,
};

const OUTLINE_SYSTEM_PROMPT = `You are an expert Bible study curriculum designer creating multi-lesson study series.

YOUR TASK: Generate a complete outline for a Bible study series based on the provided source material.

REQUIREMENTS:
- Create exactly {lessonCount} lessons
- Each lesson should build on previous ones
- Include a clear theme that ties all lessons together
- Ensure logical progression from introduction to application
- Use KJV for all scripture references

AUDIENCE CONSIDERATIONS:
{audienceAdjustments}

OUTPUT FORMAT (JSON only, no markdown):
{
  "title": "Series title",
  "description": "2-3 sentence series description",
  "theme": "Central theme of the series",
  "targetAudience": "{audience}",
  "lessons": [
    {
      "number": 1,
      "title": "Lesson title",
      "focus": "Main focus of this lesson",
      "keyScriptures": ["Scripture references"],
      "mainPoints": ["Point 1", "Point 2", "Point 3"]
    }
  ]
}`;

const LESSON_SYSTEM_PROMPT = `You are an expert Bible study writer creating detailed lesson content.

YOUR TASK: Generate complete content for a single Bible study lesson.

SERIES CONTEXT:
- Series Title: {seriesTitle}
- Series Theme: {seriesTheme}
- Lesson Number: {lessonNumber} of {totalLessons}
- Lesson Title: {lessonTitle}
- Lesson Focus: {lessonFocus}
- Key Scriptures: {keyScriptures}

AUDIENCE CONSIDERATIONS:
{audienceAdjustments}

REQUIREMENTS:
- Create engaging, biblically sound content
- Include clear teaching sections with scripture support
- Provide thoughtful discussion questions
- Include practical application points
- Use KJV for all scripture quotations
- End with a meaningful closing prayer

OUTPUT FORMAT (JSON only, no markdown):
{
  "number": {lessonNumber},
  "title": "Lesson title",
  "introduction": "2-3 paragraph introduction that hooks the reader and introduces the topic",
  "sections": [
    {
      "title": "Section title",
      "content": "Teaching content (2-4 paragraphs)",
      "scriptures": ["Scripture references with brief quotes"],
      "illustration": "Optional real-life illustration or story"
    }
  ],
  "discussionQuestions": [
    "Open-ended question 1",
    "Open-ended question 2",
    "Open-ended question 3",
    "Open-ended question 4",
    "Open-ended question 5"
  ],
  "applicationPoints": [
    "Practical application 1",
    "Practical application 2",
    "Practical application 3"
  ],
  "keyScriptures": ["Main scriptures for this lesson"],
  "closingPrayer": "A prayer that ties together the lesson themes"
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      action,
      sourceTexts,
      title,
      description,
      targetAudience,
      lessonCount,
      seriesId,
      lessonOutline,
      userId,
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Action: Generate series outline
    if (action === "outline") {
      if (!sourceTexts || !Array.isArray(sourceTexts) || sourceTexts.length === 0) {
        return new Response(
          JSON.stringify({ error: "Source texts are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const combinedText = sourceTexts.join("\n\n---\n\n");
      const truncatedText = combinedText.length > 15000
        ? combinedText.substring(0, 15000) + "..."
        : combinedText;

      const audience = (targetAudience || "adults") as TargetAudience;
      const count = lessonCount || 4;

      const systemPrompt = OUTLINE_SYSTEM_PROMPT
        .replace("{lessonCount}", String(count))
        .replace("{audienceAdjustments}", AUDIENCE_ADJUSTMENTS[audience])
        .replace("{audience}", audience);

      const userPrompt = `Create a ${count}-lesson Bible study series outline from this content:

${title ? `REQUESTED TITLE: ${title}\n` : ""}
${description ? `DESCRIPTION: ${description}\n` : ""}
TARGET AUDIENCE: ${audience}

SOURCE MATERIAL:
${truncatedText}

Generate the series outline now. Return ONLY JSON.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI API error:", errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const aiResponse = await response.json();
      let content = aiResponse.choices?.[0]?.message?.content || "";

      // Parse JSON
      if (content.includes("```json")) {
        content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (content.includes("```")) {
        content = content.replace(/```\n?/g, "");
      }

      const outline = JSON.parse(content.trim());

      // Deduct credits for outline
      if (userId) {
        await supabase.rpc("deduct_ai_credits", {
          user_id_param: userId,
          feature_param: "study-series-outline",
          model_param: DEFAULT_MODEL,
        });
      }

      return new Response(
        JSON.stringify(outline),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: Generate a single lesson
    if (action === "lesson") {
      if (!lessonOutline || !lessonOutline.number) {
        return new Response(
          JSON.stringify({ error: "Lesson outline is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const audience = (targetAudience || "adults") as TargetAudience;

      const systemPrompt = LESSON_SYSTEM_PROMPT
        .replace("{seriesTitle}", lessonOutline.seriesTitle || "Bible Study Series")
        .replace("{seriesTheme}", lessonOutline.seriesTheme || "")
        .replace(/{lessonNumber}/g, String(lessonOutline.number))
        .replace("{totalLessons}", String(lessonOutline.totalLessons || lessonCount || 4))
        .replace("{lessonTitle}", lessonOutline.title || "")
        .replace("{lessonFocus}", lessonOutline.focus || "")
        .replace("{keyScriptures}", (lessonOutline.keyScriptures || []).join(", "))
        .replace("{audienceAdjustments}", AUDIENCE_ADJUSTMENTS[audience]);

      const sourceContext = sourceTexts && sourceTexts.length > 0
        ? `\n\nSOURCE MATERIAL:\n${sourceTexts.join("\n\n").substring(0, 8000)}`
        : "";

      const userPrompt = `Generate complete content for this lesson:

LESSON ${lessonOutline.number}: ${lessonOutline.title}
Focus: ${lessonOutline.focus}
Key Scriptures: ${(lessonOutline.keyScriptures || []).join(", ")}
Main Points to Cover: ${(lessonOutline.mainPoints || []).join("; ")}
${sourceContext}

Generate the full lesson content now. Return ONLY JSON.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.4,
          max_tokens: 6000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI API error:", errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const aiResponse = await response.json();
      let content = aiResponse.choices?.[0]?.message?.content || "";

      // Parse JSON
      if (content.includes("```json")) {
        content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (content.includes("```")) {
        content = content.replace(/```\n?/g, "");
      }

      const lesson = JSON.parse(content.trim());

      // Save lesson to database if seriesId provided
      if (seriesId) {
        const { error: insertError } = await supabase
          .from("study_series_lessons")
          .insert({
            series_id: seriesId,
            lesson_number: lesson.number,
            title: lesson.title,
            introduction: lesson.introduction,
            sections: lesson.sections,
            discussion_questions: lesson.discussionQuestions,
            application_points: lesson.applicationPoints,
            key_scriptures: lesson.keyScriptures,
            closing_prayer: lesson.closingPrayer,
          });

        if (insertError) {
          console.error("Lesson insert error:", insertError);
        }
      }

      // Deduct credits for lesson
      if (userId) {
        await supabase.rpc("deduct_ai_credits", {
          user_id_param: userId,
          feature_param: "study-series-lesson",
          model_param: DEFAULT_MODEL,
        });
      }

      return new Response(
        JSON.stringify(lesson),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: Generate full series (outline + all lessons)
    if (action === "full") {
      if (!sourceTexts || !Array.isArray(sourceTexts) || sourceTexts.length === 0) {
        return new Response(
          JSON.stringify({ error: "Source texts are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const audience = (targetAudience || "adults") as TargetAudience;
      const count = lessonCount || 4;

      // Step 1: Generate outline
      const combinedText = sourceTexts.join("\n\n---\n\n");
      const truncatedText = combinedText.length > 15000
        ? combinedText.substring(0, 15000) + "..."
        : combinedText;

      const outlineSystemPrompt = OUTLINE_SYSTEM_PROMPT
        .replace("{lessonCount}", String(count))
        .replace("{audienceAdjustments}", AUDIENCE_ADJUSTMENTS[audience])
        .replace("{audience}", audience);

      const outlineResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: [
            { role: "system", content: outlineSystemPrompt },
            {
              role: "user",
              content: `Create a ${count}-lesson Bible study series outline:\n\n${title ? `TITLE: ${title}\n` : ""}${description ? `DESCRIPTION: ${description}\n` : ""}TARGET: ${audience}\n\nSOURCE:\n${truncatedText}\n\nReturn ONLY JSON.`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 4096,
        }),
      });

      if (!outlineResponse.ok) {
        throw new Error(`Outline generation failed: ${outlineResponse.status}`);
      }

      const outlineAi = await outlineResponse.json();
      let outlineContent = outlineAi.choices?.[0]?.message?.content || "";
      if (outlineContent.includes("```")) {
        outlineContent = outlineContent.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      }
      const outline = JSON.parse(outlineContent.trim());

      // Create series record in database
      let createdSeriesId = seriesId;
      if (userId && !createdSeriesId) {
        const { data: seriesData, error: seriesError } = await supabase
          .from("user_study_series")
          .insert({
            user_id: userId,
            title: outline.title,
            description: outline.description,
            theme: outline.theme,
            target_audience: audience,
            lesson_count: count,
            status: "generating",
          })
          .select()
          .single();

        if (seriesError) {
          console.error("Series insert error:", seriesError);
        } else {
          createdSeriesId = seriesData.id;
        }
      }

      // Deduct credits for outline
      if (userId) {
        await supabase.rpc("deduct_ai_credits", {
          user_id_param: userId,
          feature_param: "study-series-outline",
          model_param: DEFAULT_MODEL,
        });
      }

      // Step 2: Generate each lesson
      const lessons = [];
      for (const lessonOutline of outline.lessons) {
        const lessonSystemPrompt = LESSON_SYSTEM_PROMPT
          .replace("{seriesTitle}", outline.title)
          .replace("{seriesTheme}", outline.theme)
          .replace(/{lessonNumber}/g, String(lessonOutline.number))
          .replace("{totalLessons}", String(count))
          .replace("{lessonTitle}", lessonOutline.title)
          .replace("{lessonFocus}", lessonOutline.focus)
          .replace("{keyScriptures}", (lessonOutline.keyScriptures || []).join(", "))
          .replace("{audienceAdjustments}", AUDIENCE_ADJUSTMENTS[audience]);

        const lessonResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: DEFAULT_MODEL,
            messages: [
              { role: "system", content: lessonSystemPrompt },
              {
                role: "user",
                content: `Generate lesson ${lessonOutline.number}: ${lessonOutline.title}\nFocus: ${lessonOutline.focus}\nMain Points: ${(lessonOutline.mainPoints || []).join("; ")}\n\nReturn ONLY JSON.`,
              },
            ],
            response_format: { type: "json_object" },
            temperature: 0.4,
            max_tokens: 6000,
          }),
        });

        if (lessonResponse.ok) {
          const lessonAi = await lessonResponse.json();
          let lessonContent = lessonAi.choices?.[0]?.message?.content || "";
          if (lessonContent.includes("```")) {
            lessonContent = lessonContent.replace(/```json\n?/g, "").replace(/```\n?/g, "");
          }
          const lesson = JSON.parse(lessonContent.trim());
          lessons.push(lesson);

          // Save lesson to database
          if (createdSeriesId) {
            await supabase
              .from("study_series_lessons")
              .insert({
                series_id: createdSeriesId,
                lesson_number: lesson.number,
                title: lesson.title,
                introduction: lesson.introduction,
                sections: lesson.sections,
                discussion_questions: lesson.discussionQuestions,
                application_points: lesson.applicationPoints,
                key_scriptures: lesson.keyScriptures,
                closing_prayer: lesson.closingPrayer,
              });
          }

          // Deduct credits for lesson
          if (userId) {
            await supabase.rpc("deduct_ai_credits", {
              user_id_param: userId,
              feature_param: "study-series-lesson",
              model_param: DEFAULT_MODEL,
            });
          }
        }
      }

      // Update series status to complete
      if (createdSeriesId) {
        await supabase
          .from("user_study_series")
          .update({ status: "complete" })
          .eq("id", createdSeriesId);
      }

      const fullSeries = {
        id: createdSeriesId,
        ...outline,
        lessons,
        status: "complete",
        generatedAt: new Date().toISOString(),
      };

      return new Response(
        JSON.stringify(fullSeries),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'outline', 'lesson', or 'full'" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Study series generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Generation failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
