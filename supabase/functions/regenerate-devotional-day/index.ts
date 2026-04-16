import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";
import { getContentBehavioralEngine } from '../_shared/content-behavioral-engine.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type RegenerateDayRequest = {
  planId: string;
  dayNumber: number;
};

serve(async (req) => {
  console.log("[regenerate-devotional-day] invoked");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planId, dayNumber } = (await req.json()) as RegenerateDayRequest;

    if (!planId || !dayNumber || !Number.isFinite(dayNumber)) {
      return new Response(JSON.stringify({ error: "planId and dayNumber are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
      throw new Error("Backend configuration missing");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: authData, error: authError } = await userSupabase.auth.getUser();
    const user = authData?.user;

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: plan, error: planError } = await admin
      .from("devotional_plans")
      .select("id, user_id, theme, format, duration, study_style")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      return new Response(JSON.stringify({ error: "Devotional plan not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (plan.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "You do not have permission to modify this plan" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (dayNumber < 1 || dayNumber > Number(plan.duration || 0)) {
      return new Response(JSON.stringify({ error: "dayNumber out of range" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Personalization: resolve linked profile (if any)
    let personName = "";
    let primaryIssue = "";
    let issueSeverity = "";
    let issueDescription = "";

    try {
      const { data: linkedProfile } = await userSupabase
        .from("devotional_profiles")
        .select("id, name, primary_issue, issue_severity, current_situation")
        .eq("active_plan_id", planId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (linkedProfile) {
        personName = linkedProfile.name || "";
        primaryIssue = linkedProfile.primary_issue || "";
        issueSeverity = linkedProfile.issue_severity || "";
        issueDescription = linkedProfile.current_situation || "";

        const { data: decryptedRows, error: decErr } = await userSupabase.rpc(
          "get_decrypted_devotional_profile",
          { _profile_id: linkedProfile.id }
        );

        if (!decErr && Array.isArray(decryptedRows) && decryptedRows[0]?.issue_description) {
          issueDescription = String(decryptedRows[0].issue_description);
        }
      }
    } catch (e) {
      console.warn("[regenerate-devotional-day] profile lookup failed", e);
    }

    const forPersonNote = personName
      ? `\nThis devotional is written PERSONALLY for: ${personName}. Address ${personName} BY NAME 2-3 times total (opening, mid, closing). Always capitalize their name properly.`
      : "";

    const contextNote = issueDescription ? `\nSITUATION DETAILS: ${issueDescription}` : "";
    const issueNote = primaryIssue
      ? `\nPRIMARY STRUGGLE: ${primaryIssue}${issueDescription ? ` - ${issueDescription}` : ""}`
      : "";

    const systemPrompt = `You are Jeeves, the Phototheology devotional writer. Write devotionals as 3-5 FLOWING PARAGRAPHS of continuous prose.

FORMAT: NO bullet points. NO section headers. NO labeled parts. Just essay-style reading.
NEVER use "dear" in any form - no "Dear friend", "dear one", "my dear", etc.

${personName ? `CRITICAL PERSONALIZATION RULES:
- This devotional is for a SPECIFIC PERSON named ${personName}
- Address ${personName} BY NAME 2-3 times TOTAL (opening, mid, closing)
- Refer to their situation in plain language at least once (use the provided situation details; don't be vague)
- Sound like a caring pastor writing a personal note, not a template` : ""}

Write 500-750 words of flowing, contemplative prose that:
- Uses 2-4 Scriptures woven naturally into the text
- Reveals at least one unexpected connection
- Moves from observation → tension → illumination → call
- Ends with stillness or resolve, not hype.`;

    const userPrompt = `Create day ${dayNumber} of a ${plan.duration}-day devotional on the theme: "${plan.theme}"
Format: ${plan.format}
Study Style: ${plan.study_style || "balanced"}${forPersonNote}${issueNote}${contextNote}

Generate ONLY day ${dayNumber} as a JSON object via tool call.`;

    console.log("[regenerate-devotional-day] calling AI", { planId, dayNumber, personName: !!personName });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_devotional_day",
              description: "Return one devotional day object.",
              parameters: {
                type: "object",
                properties: {
                  day: {
                    type: "object",
                    properties: {
                      day_number: { type: "integer" },
                      title: { type: "string" },
                      scripture_reference: { type: "string" },
                      devotional_text: { type: "string" },
                      memory_hook: { type: "string" },
                    },
                    required: ["day_number", "title", "scripture_reference", "devotional_text", "memory_hook"],
                    additionalProperties: false,
                  },
                },
                required: ["day"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_devotional_day" } },
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[regenerate-devotional-day] AI error", response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a minute." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits required. Please add credits and try again." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: "No tool call in AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const argsObj = JSON.parse(toolCall.function.arguments);
    const day = argsObj?.day;

    if (!day?.devotional_text || !day?.title || !day?.scripture_reference) {
      return new Response(JSON.stringify({ error: "Invalid day returned from AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update existing day row (preserve ID so progress links remain valid)
    const { data: existingDay, error: existingErr } = await admin
      .from("devotional_days")
      .select("id")
      .eq("plan_id", planId)
      .eq("day_number", dayNumber)
      .maybeSingle();

    if (existingErr) {
      console.warn("[regenerate-devotional-day] existing day lookup error", existingErr);
    }

    if (existingDay?.id) {
      const { error: updateErr } = await admin
        .from("devotional_days")
        .update({
          title: day.title,
          scripture_reference: day.scripture_reference,
          devotional_text: day.devotional_text,
          memory_hook: day.memory_hook,
          christ_connection: String(day.devotional_text).slice(0, 500),
        })
        .eq("id", existingDay.id);

      if (updateErr) throw updateErr;
    } else {
      const { error: insertErr } = await admin.from("devotional_days").insert({
        plan_id: planId,
        day_number: dayNumber,
        title: day.title,
        scripture_reference: day.scripture_reference,
        devotional_text: day.devotional_text,
        memory_hook: day.memory_hook,
        // Legacy fields
        scripture_text: "",
        christ_connection: String(day.devotional_text).slice(0, 500),
        application: "",
        prayer: "",
        challenge: "",
        journal_prompt: "",
      });

      if (insertErr) throw insertErr;
    }

    console.log("[regenerate-devotional-day] success", { planId, dayNumber });

    return new Response(
      JSON.stringify({
        success: true,
        plan_id: planId,
        day_number: dayNumber,
        title: day.title,
        scripture_reference: day.scripture_reference,
        devotional_text: day.devotional_text,
        memory_hook: day.memory_hook,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("[regenerate-devotional-day] error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
