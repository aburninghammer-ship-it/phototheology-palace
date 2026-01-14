import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Polish mode prompts
const POLISH_PROMPTS: Record<string, string> = {
  logical_flow: `You are a sermon editor focused on LOGICAL FLOW.

Your task: Improve the argument progression and reasoning clarity WITHOUT changing the core claims or adding new theological assertions.

FOCUS AREAS:
- Ensure smooth transitions between ideas
- Clarify cause-and-effect relationships
- Remove logical jumps or gaps
- Strengthen the "therefore" connections
- Make the reasoning path clear for listeners

CONSTRAINTS:
- Do NOT change the theological claims
- Do NOT add new Scripture references
- Do NOT introduce new concepts not in the original
- Preserve the author's voice and style`,

  scripture_integration: `You are a sermon editor focused on SCRIPTURE INTEGRATION.

Your task: Better weave Scripture references into the narrative WITHOUT adding new references or changing interpretations.

FOCUS AREAS:
- Smooth transitions into and out of Scripture quotes
- Ensure context is preserved when citing verses
- Connect Scripture to the surrounding argument naturally
- Avoid proof-texting patterns
- Make references feel organic, not forced

CONSTRAINTS:
- Do NOT add new Scripture references
- Do NOT change the interpretation of existing references
- Do NOT remove any Scripture citations
- Preserve exact quote text`,

  cognitive_load: `You are a sermon editor focused on COGNITIVE LOAD.

Your task: Simplify complex sections to improve comprehension WITHOUT dumbing down the theology.

FOCUS AREAS:
- Break long sentences into shorter ones
- Replace jargon with accessible language
- Add brief clarifications where needed
- Improve paragraph structure
- Reduce working memory demands

CONSTRAINTS:
- Do NOT remove theological depth
- Do NOT oversimplify nuanced points
- Do NOT add new claims or arguments
- Preserve the intellectual substance`,

  application: `You are a sermon editor focused on APPLICATION.

Your task: Strengthen practical takeaways and action steps WITHOUT adding new theological claims.

FOCUS AREAS:
- Make applications more specific and actionable
- Connect abstract truths to concrete life situations
- Add "this week" type language where appropriate
- Ensure applications flow from the theological content
- Make the "so what" crystal clear

CONSTRAINTS:
- Applications must derive from existing content
- Do NOT add new theological arguments
- Do NOT change the doctrinal claims
- Keep the SDA worldview perspective`,

  persuasive: `You are a sermon editor focused on PERSUASIVE impact.

Your task: Enhance rhetorical impact and emotional resonance WITHOUT manipulation or adding claims.

FOCUS AREAS:
- Strengthen the hook and opening
- Add appropriate emotional weight
- Improve rhythm and cadence for speaking
- Enhance word choice for impact
- Strengthen the call to action

CONSTRAINTS:
- Do NOT use manipulation tactics
- Do NOT add emotional content not grounded in the text
- Do NOT change the theological substance
- Maintain intellectual integrity`,
};

const VALIDATION_PROMPT = `You are a validation checker for sermon polish operations.

Given the ORIGINAL and POLISHED versions, verify:

1. CLAIM_PRESERVED: Are the theological claims identical? (true/false)
2. SCRIPTURE_UNCHANGED: Are all Scripture references exactly preserved? (true/false)
3. LOGIC_INTACT: Is the logical structure and flow preserved or improved? (true/false)
4. NO_NEW_CLAIMS: Were any new theological claims introduced? (should be false for pass)

Return JSON:
{
  "claim_preserved": boolean,
  "scripture_unchanged": boolean,
  "logic_intact": boolean,
  "no_new_claims": boolean,
  "details": ["string array of specific concerns if any"]
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      sessionId,
      polishMode,
      contentToPolish,
      outlineContext,
    } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the auth user from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const polishPrompt = POLISH_PROMPTS[polishMode];
    if (!polishPrompt) {
      throw new Error(`Invalid polish mode: ${polishMode}`);
    }

    // Build context
    let outlineStr = "";
    if (outlineContext?.nodes?.length > 0) {
      outlineStr = "\n\nSERMON OUTLINE:\n" + outlineContext.nodes.map((n: any, i: number) =>
        `${i + 1}. ${n.label}`
      ).join("\n");
    }

    // Step 1: Apply polish
    const polishResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: polishPrompt },
          {
            role: "user",
            content: `${outlineStr}

ORIGINAL CONTENT TO POLISH:
${contentToPolish}

Please return the polished version. After the polished content, add a brief explanation of changes in this format:
---CHANGES---
[Brief explanation of what was changed and why]`
          },
        ],
        temperature: 0.4, // Lower temperature for more controlled edits
      }),
    });

    if (!polishResponse.ok) {
      const errorText = await polishResponse.text();
      console.error("Polish AI error:", errorText);
      throw new Error("Failed to apply polish");
    }

    const polishData = await polishResponse.json();
    const polishResult = polishData.choices?.[0]?.message?.content || "";

    // Parse polished content and explanation
    let polishedContent = polishResult;
    let aiExplanation = "";

    const changesSplit = polishResult.split("---CHANGES---");
    if (changesSplit.length > 1) {
      polishedContent = changesSplit[0].trim();
      aiExplanation = changesSplit[1].trim();
    }

    // Step 2: Validate the polish
    const validationResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: VALIDATION_PROMPT },
          {
            role: "user",
            content: `ORIGINAL:
${contentToPolish}

POLISHED:
${polishedContent}

Validate the polish operation and return JSON.`
          },
        ],
        temperature: 0.2,
      }),
    });

    let validation = {
      claim_preserved: true,
      scripture_unchanged: true,
      logic_intact: true,
      no_new_claims: true,
      details: [] as string[],
    };

    if (validationResponse.ok) {
      const validationData = await validationResponse.json();
      const validationContent = validationData.choices?.[0]?.message?.content || "";

      try {
        const jsonMatch = validationContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          validation = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error("Failed to parse validation:", e);
      }
    }

    // Step 3: Create snapshot in database
    const { data: snapshot, error: snapshotError } = await supabase
      .from("sermon_writer_polish_snapshots")
      .insert({
        session_id: sessionId,
        user_id: user.id,
        content_before: contentToPolish,
        outline_before: outlineContext || { nodes: [], transitions: [] },
        polish_mode: polishMode,
        target_type: 'full',
        validation,
        content_after: polishedContent,
        ai_explanation: aiExplanation,
        status: 'pending',
      })
      .select()
      .single();

    if (snapshotError) {
      console.error("Snapshot error:", snapshotError);
      throw new Error("Failed to create snapshot");
    }

    // Generate diff summary
    const originalWords = contentToPolish.split(/\s+/).length;
    const polishedWords = polishedContent.split(/\s+/).length;
    const wordDiff = polishedWords - originalWords;
    const diffSummary = `Words: ${originalWords} → ${polishedWords} (${wordDiff >= 0 ? '+' : ''}${wordDiff})`;

    // Update snapshot with diff summary
    await supabase
      .from("sermon_writer_polish_snapshots")
      .update({ diff_summary: diffSummary })
      .eq("id", snapshot.id);

    return new Response(
      JSON.stringify({
        success: true,
        snapshotId: snapshot.id,
        polishedContent,
        validation,
        aiExplanation,
        diffSummary,
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
