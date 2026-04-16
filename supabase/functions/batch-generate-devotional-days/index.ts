import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";
import { getContentBehavioralEngine } from '../_shared/content-behavioral-engine.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Batch Generate Devotional Days
 * 
 * This function finds all active devotional plans that have fewer generated days
 * than their duration, and generates the missing days.
 * 
 * Can be triggered:
 * 1. Manually via admin action
 * 2. Via cron job to catch up on missing days
 * 
 * Parameters (optional):
 * - planId: Generate only for a specific plan
 * - maxDaysPerPlan: Limit how many days to generate per plan (default: 5)
 * - maxPlans: Limit how many plans to process (default: 10)
 */

serve(async (req) => {
  console.log("[batch-generate-devotional-days] Function invoked");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { planId, planIds, maxDaysPerPlan = 5, maxPlans = 10 } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration missing");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find plans that need days generated - include both active plans AND failed plans for retry
    let query = supabase
      .from("devotional_plans")
      .select("id, user_id, title, theme, format, duration, study_style, started_at, status")
      .in("status", ["active", "failed"]) // Also retry failed plans
      .order("created_at", { ascending: false });

    // Support both planId (single) and planIds (array)
    if (planIds && Array.isArray(planIds) && planIds.length > 0) {
      query = query.in("id", planIds);
      console.log(`Filtering by planIds: ${planIds.join(", ")}`);
    } else if (planId) {
      query = query.eq("id", planId);
      console.log(`Filtering by planId: ${planId}`);
    } else {
      query = query.limit(maxPlans);
    }

    const { data: plans, error: plansError } = await query;

    if (plansError) {
      console.error("Error fetching plans:", plansError);
      throw plansError;
    }

    console.log(`Found ${plans?.length || 0} active plans to check`);

    const results: { planId: string; planTitle: string; daysGenerated: number; errors: string[] }[] = [];

    for (const plan of plans || []) {
      const planResult = {
        planId: plan.id,
        planTitle: plan.title,
        daysGenerated: 0,
        errors: [] as string[],
      };

      try {
        // Get existing days for this plan
        const { data: existingDays, error: daysError } = await supabase
          .from("devotional_days")
          .select("day_number")
          .eq("plan_id", plan.id)
          .order("day_number", { ascending: true });

        if (daysError) {
          planResult.errors.push(`Failed to fetch existing days: ${daysError.message}`);
          results.push(planResult);
          continue;
        }

        const existingDayNumbers = new Set(existingDays?.map(d => d.day_number) || []);
        const totalDays = plan.duration || 7;

        // For failed plans without started_at, set it now
        if (!plan.started_at && plan.status === "failed") {
          const now = new Date().toISOString();
          await supabase
            .from("devotional_plans")
            .update({ started_at: now, status: "active" })
            .eq("id", plan.id);
          plan.started_at = now;
          console.log(`Plan ${plan.id}: Set started_at for failed plan and reset to active`);
        }

        // Skip plans that still don't have started_at (draft plans that somehow got in)
        if (!plan.started_at) {
          console.log(`Plan ${plan.id}: No started_at, skipping`);
          results.push(planResult);
          continue;
        }

        // Calculate which day is currently unlocked based on calendar days since started_at
        const startedAt = new Date(plan.started_at);
        const now = new Date();
        // Use UTC calendar dates to avoid timezone/hour issues
        const startDate = new Date(Date.UTC(startedAt.getUTCFullYear(), startedAt.getUTCMonth(), startedAt.getUTCDate()));
        const todayDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const calendarDaysSinceStart = Math.floor((todayDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const unlockedDay = Math.min(calendarDaysSinceStart + 1, totalDays);

        console.log(`Plan ${plan.id}: ${existingDayNumbers.size} days exist, unlocked up to day ${unlockedDay} of ${totalDays}, status: ${plan.status}`);

        // Find missing days that should be unlocked
        const missingDays: number[] = [];
        for (let day = 1; day <= unlockedDay; day++) {
          if (!existingDayNumbers.has(day)) {
            missingDays.push(day);
          }
        }

        if (missingDays.length === 0) {
          console.log(`Plan ${plan.id}: No missing days to generate`);
          results.push(planResult);
          continue;
        }

        console.log(`Plan ${plan.id}: Need to generate days: ${missingDays.join(", ")}`);

        // Get personalization info if this is for a devotional profile
        let personName = "";
        let primaryIssue = "";
        let issueDescription = "";

        const { data: profile } = await supabase
          .from("devotional_profiles")
          .select("name, primary_issue, current_situation, issue_description_encrypted")
          .eq("active_plan_id", plan.id)
          .maybeSingle();

        if (profile) {
          personName = profile.name || "";
          primaryIssue = profile.primary_issue || "";

          // Try to decrypt issue description
          if (profile.issue_description_encrypted) {
            try {
              const { data: decrypted, error: decErr } = await supabase.rpc("decrypt_token", {
                encrypted_token: profile.issue_description_encrypted,
              });
              if (!decErr && typeof decrypted === "string") {
                issueDescription = decrypted;
              }
            } catch {
              // Fall back to current_situation
            }
          }

          if (!issueDescription) {
            issueDescription = profile.current_situation || "";
          }
        }

        // Generate missing days (up to maxDaysPerPlan)
        const daysToGenerate = missingDays.slice(0, maxDaysPerPlan);
        
        // Get existing titles to avoid duplication
        const { data: existingTitles } = await supabase
          .from("devotional_days")
          .select("title")
          .eq("plan_id", plan.id);

        const usedTitles = existingTitles?.map((d: any) => d.title).filter(Boolean) || [];

        for (const dayNumber of daysToGenerate) {
          try {
            const result = await generateDevotionalDay(
              LOVABLE_API_KEY,
              supabase,
              plan,
              dayNumber,
              personName,
              primaryIssue,
              issueDescription,
              usedTitles
            );

            if (result.success) {
              planResult.daysGenerated++;
              console.log(`Plan ${plan.id}: Generated day ${dayNumber}`);
              // Add the new title to avoid list for subsequent days
              if (result.title) {
                usedTitles.push(result.title);
              }
            } else {
              planResult.errors.push(`Day ${dayNumber}: ${result.error}`);
            }
          } catch (err: any) {
            planResult.errors.push(`Day ${dayNumber}: ${err.message}`);
          }

          // Small delay between days to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // If we generated days for a failed plan, mark it as active
        if (planResult.daysGenerated > 0 && plan.status === "failed") {
          await supabase
            .from("devotional_plans")
            .update({ status: "active" })
            .eq("id", plan.id);
          console.log(`Plan ${plan.id}: Recovered from failed status, now active`);
        }

      } catch (err: any) {
        planResult.errors.push(`Plan error: ${err.message}`);
      }

      results.push(planResult);
    }

    const totalGenerated = results.reduce((sum, r) => sum + r.daysGenerated, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);

    console.log(`[batch-generate-devotional-days] Complete: ${totalGenerated} days generated, ${totalErrors} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        plansProcessed: results.length,
        totalDaysGenerated: totalGenerated,
        totalErrors,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in batch-generate-devotional-days:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function generateDevotionalDay(
  apiKey: string,
  supabase: any,
  plan: any,
  dayNumber: number,
  personName: string,
  primaryIssue: string,
  issueDescription: string,
  usedTitles: string[] = []
): Promise<{ success: boolean; error?: string; title?: string }> {
  const forPersonNote = personName
    ? `\nThis devotional is written PERSONALLY for: ${personName}. Address ${personName} BY NAME at least 2-3 times throughout the devotional.`
    : "";

  const issueNote = primaryIssue
    ? `\nPRIMARY STRUGGLE: ${primaryIssue}${issueDescription ? ` - ${issueDescription}` : ""}`
    : issueDescription ? `\nSITUATION DETAILS: ${issueDescription}` : "";

  const avoidTitlesNote = usedTitles.length > 0
    ? `\n\nCRITICAL - TITLE UNIQUENESS REQUIREMENT:
The following titles have ALREADY been used in this devotional series. You MUST create a COMPLETELY DIFFERENT title:
${usedTitles.map((t, i) => `  ${i + 1}. "${t}"`).join("\n")}

DO NOT use any of these titles or variations of them. Create something fresh and specific to THIS day's unique insight.`
    : "";

  const systemPrompt = `You are Jeeves, the Phototheology devotional writer. Write devotionals as 3-5 FLOWING PARAGRAPHS of continuous prose.

FORMAT: NO bullet points. NO section headers. NO labeled parts. Just essay-style reading.
NEVER use "dear" in any form - no "Dear friend", "dear one", "my dear", etc.${avoidTitlesNote}

${personName ? `CRITICAL PERSONALIZATION RULES:
- This devotional is for a SPECIFIC PERSON named ${personName}
- Address ${personName} BY NAME 2-3 times throughout (naturally woven in)
- Use their name at key moments: opening greeting, mid-devotional encouragement, closing charge
- Sound like a pastor writing a personal letter to ${personName}, not a generic template
- Their struggles become the ENTRY POINT to Christ's provision
- NEVER use "Dear ${personName}" - just use their name directly` : ""}

Write 500-750 words of flowing, contemplative prose that:
- Uses 2-4 Scriptures woven naturally into the text
- Reveals unexpected connections
- Moves from observation → tension → illumination → call
- Ends with stillness or resolve, not hype`;

  const userPrompt = `Create day ${dayNumber} of a ${plan.duration}-day devotional on the theme: "${plan.theme}"
${forPersonNote}${issueNote}

Generate ONLY day ${dayNumber} as flowing paragraphs. This day should build on the journey so far while offering fresh insight.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
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
            name: "create_devotional_days",
            description: "Return an array of devotional day objects.",
            parameters: {
              type: "object",
              properties: {
                days: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      day_number: { type: "integer" },
                      title: { type: "string", description: "UNIQUE evocative title (3-6 words) - specific to THIS day's insight, avoid generic phrases" },
                      scripture_reference: { type: "string", description: "Primary passage reference" },
                      devotional_text: { type: "string", description: "3-5 paragraph essay-style devotional (500-750 words). NO headers. NO bullet points." },
                      memory_hook: { type: "string", description: "One-line quotable insight" },
                    },
                    required: ["day_number", "title", "scripture_reference", "devotional_text", "memory_hook"],
                  },
                },
              },
              required: ["days"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "create_devotional_days" } },
      max_tokens: 8192,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI API error:", response.status, errorText);
    return { success: false, error: `AI generation failed: ${response.status}` };
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

  if (!toolCall?.function?.arguments) {
    return { success: false, error: "No tool call in response" };
  }

  const argsObj = JSON.parse(toolCall.function.arguments);
  const days = argsObj.days;

  if (!Array.isArray(days) || days.length === 0) {
    return { success: false, error: "No days in response" };
  }

  const day = days[0];

  // Validate devotional text isn't truncated
  const devText = (day.devotional_text || '').trim();
  if (devText.length < 500 || !/[.!?"')\n]$/.test(devText)) {
    return { success: false, error: `Devotional text appears truncated (${devText.length} chars)` };
  }

  // Insert the generated day
  const { error: insertError } = await supabase.from("devotional_days").insert({
    plan_id: plan.id,
    day_number: day.day_number || dayNumber,
    title: day.title,
    scripture_reference: day.scripture_reference,
    devotional_text: day.devotional_text,
    memory_hook: day.memory_hook,
    // Legacy fields for backwards compatibility
    scripture_text: "",
    christ_connection: day.devotional_text?.substring(0, 500) || "",
    application: "",
    prayer: "",
    challenge: "",
    journal_prompt: "",
  });

  if (insertError) {
    console.error("Insert error:", insertError);
    return { success: false, error: "Failed to save devotional day" };
  }

  return { success: true, title: day.title };
}
