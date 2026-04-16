import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validator System Prompt
const VALIDATOR_SYSTEM_PROMPT = `You are a strict VALIDATOR for sermon content generation.

Your job is to CHECK artifacts for quality, not to generate content.

You will receive:
1. The project thesis/claim
2. Anchor texts
3. One or more artifacts to validate

For EACH artifact, you must evaluate:

1. LANE_COMPLIANCE (0-100)
   - Does this artifact belong in its assigned lane?
   - BUILD: Does it ADD new content (not polish or critique)?
   - SHARPEN: Does it IMPROVE existing content (not add new)?
   - STRESS: Does it SURFACE problems (not solve them)?
   - DISTILL: Does it EXTRACT usables (not add arguments)?

2. THESIS_ALIGNMENT (0-100)
   - Does this artifact support the thesis?
   - Or does it drift into unrelated territory?
   - Red flag: content that's interesting but irrelevant

3. SCRIPTURE_INTEGRITY (0-100)
   - Are verse references accurate?
   - Any signs of hallucinated verses?
   - Uncertain = 50, Clearly accurate = 100, Clearly wrong = 0

4. REDUNDANCY_RISK (0-100)
   - 0 = completely unique
   - 100 = nearly identical to existing artifacts
   - Check against the existing artifacts provided

5. FORMAT_INTEGRITY (0-100)
   - Is the artifact properly formatted?
   - Does it have required fields (type, summary, content)?
   - Is it the right length (not too verbose)?

OUTPUT FORMAT (STRICT JSON):
{
  "validations": [
    {
      "artifact_id": "string",
      "lane_compliance": number,
      "thesis_alignment": number,
      "scripture_integrity": number,
      "redundancy_risk": number,
      "format_integrity": number,
      "overall_score": number,
      "passed": boolean,
      "issues": ["string"],
      "recommendations": ["string"]
    }
  ],
  "session_health": {
    "thesis_drift_detected": boolean,
    "redundancy_creep_detected": boolean,
    "lane_confusion_detected": boolean,
    "scripture_concerns": boolean,
    "overall_health": "healthy|warning|critical",
    "summary": "string"
  }
}

PASSING THRESHOLD: overall_score >= 70
Only artifacts with passed=true should be committed.

CRITICAL FORMATTING RULES:
- NEVER include raw artifact UUIDs in your issue descriptions or recommendations
- Refer to artifacts by their summary/type, not by ID
- Keep issue descriptions focused on the actual problem, not referencing internal IDs
- Use human-readable references like "the illustration about..." or "the argument for..."`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { sessionId, artifactIds } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch session
    const { data: session, error: fetchError } = await supabase
      .from("sermon_simmer_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (fetchError || !session) throw new Error("Session not found");

    const artifacts = session.artifacts as any[] || [];
    
    // Filter to artifacts we want to validate
    let toValidate = artifacts;
    if (artifactIds && artifactIds.length > 0) {
      toValidate = artifacts.filter((a: any) => artifactIds.includes(a.id));
    } else {
      // Validate most recent batch (last 5 unvalidated)
      toValidate = artifacts
        .filter((a: any) => !a.validated)
        .slice(-5);
    }

    if (toValidate.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No artifacts to validate" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build validation prompt
    const validationPrompt = `THESIS: ${session.core_claim || "Not yet established"}

ANCHOR TEXTS: ${session.theme_passage || session.theme}

EXISTING ARTIFACTS (for redundancy check):
${artifacts.slice(0, -toValidate.length).map((a: any) => `- [${a.type}] ${a.summary}`).join("\n") || "None yet"}

ARTIFACTS TO VALIDATE:
${JSON.stringify(toValidate, null, 2)}

Validate each artifact and return STRICT JSON.`;

    // Call Validator Model
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: VALIDATOR_SYSTEM_PROMPT },
          { role: "user", content: validationPrompt },
        ],
        temperature: 0.2, // Low temp for consistency
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI error:", errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("Failed to validate");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    let result: any = {};
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      throw new Error("Failed to parse validation response");
    }

    // Update artifacts with validation results
    const validations = result.validations || [];
    const updatedArtifacts = artifacts.map((artifact: any) => {
      const validation = validations.find((v: any) => v.artifact_id === artifact.id);
      if (validation) {
        return {
          ...artifact,
          validated: true,
          validation_score: validation.overall_score,
          validation_passed: validation.passed,
          validation_issues: validation.issues,
        };
      }
      return artifact;
    });

    // Record validation errors for failed artifacts
    const validationErrors = session.validation_errors as any[] || [];
    for (const validation of validations) {
      if (!validation.passed) {
        validationErrors.push({
          artifact_id: validation.artifact_id,
          score: validation.overall_score,
          issues: validation.issues,
          recommendations: validation.recommendations,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Update session
    const { error: updateError } = await supabase
      .from("sermon_simmer_sessions")
      .update({
        artifacts: updatedArtifacts,
        validation_errors: validationErrors,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        validations: result.validations,
        session_health: result.session_health,
        passed: validations.filter((v: any) => v.passed).length,
        failed: validations.filter((v: any) => !v.passed).length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
