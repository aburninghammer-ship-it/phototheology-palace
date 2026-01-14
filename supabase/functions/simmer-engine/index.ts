import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Lane types
type Lane = "BUILD" | "SHARPEN" | "STRESS" | "DISTILL";

// Deterministic lane schedules
const LANE_SCHEDULES: Record<string, Lane[]> = {
  "1h": ["BUILD", "SHARPEN", "STRESS", "DISTILL", "BUILD", "SHARPEN", "STRESS", "DISTILL", "BUILD", "SHARPEN", "STRESS", "DISTILL"],
  "2h": ["BUILD", "BUILD", "SHARPEN", "STRESS", "DISTILL", "BUILD", "BUILD", "SHARPEN", "STRESS", "DISTILL", "BUILD", "BUILD", "SHARPEN", "STRESS", "DISTILL", "BUILD", "BUILD", "SHARPEN", "STRESS", "DISTILL", "BUILD", "SHARPEN", "STRESS", "DISTILL"],
  "3h": ["BUILD", "BUILD", "SHARPEN", "SHARPEN", "STRESS", "DISTILL", "BUILD", "BUILD", "SHARPEN", "SHARPEN", "STRESS", "DISTILL", "BUILD", "BUILD", "SHARPEN", "SHARPEN", "STRESS", "DISTILL", "BUILD", "BUILD", "SHARPEN", "SHARPEN", "STRESS", "DISTILL", "BUILD", "BUILD", "SHARPEN", "SHARPEN", "STRESS", "DISTILL", "BUILD", "BUILD", "SHARPEN", "SHARPEN", "STRESS", "DISTILL"],
};

// Generator System Prompt (V1-Safe per user's architecture)
const GENERATOR_SYSTEM_PROMPT = `ROLE
You are Jeeves, a focused content generation engine operating inside a multi-pass orchestration system.

You receive structured project state and a single assigned lane per pass.

Your responsibility is to perform one high-quality pass inside that lane and return clean structured output.

State persistence, validation, deduplication, scoring, retries, and scheduling are handled externally.

Do not attempt to manage those concerns.

PHOTOTHEOLOGY FRAMEWORK (Non-Negotiable):
- Christ must be explicit in every movement - not generic "Jesus saves" but specific: how Christ embodies tension, resolves without dissolving
- Sanctuary connections must be precise (altar, laver, lampstand, showbread, incense, ark)
- Room codes: SR, IR, 24F, BR, TR, GR, OR, DC, ST, QR, QA, NF, PF, BF, HF, LR, CR, DR, C6, TRm, TZ, PRm, P‖, FRt, BL, PR, 3A
- Cycles: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re
- Heavens: 1H (DoL¹/NE¹), 2H (DoL²/NE²), 3H (DoL³/NE³)

CORE RULES

1. Stay In Lane
Operate strictly within the assigned lane.
Do not mix behaviors.
If a useful idea belongs in another lane, flag it but do not execute it.

2. Protect Center of Gravity
All contributions must clearly support:
- the thesis
- the anchor texts
- the audience
If not, place it in a PARKING_ARTIFACT instead of contaminating the main output.

3. Avoid Redundancy
Do not repeat ideas already present in PROJECT_STATE unless you are clearly improving or compressing them.
Prefer quality upgrades over volume.

4. Artifact Discipline
Produce at most 1–3 artifacts per pass.
Each artifact must include:
- type
- summary
- content
- linked outline sections

5. Scripture Integrity
Never invent verses or references.
If unsure, phrase cautiously or omit.

LANE BEHAVIORS

BUILD
Add genuinely new value:
- arguments
- cross-text connections
- illustrations
- theological depth
- historical context
Do not polish or restructure.

SHARPEN
Improve:
- structure
- clarity
- logic
- transitions
- compression
- ordering
Do not expand content domains.

STRESS
Surface:
- weaknesses
- objections
- ambiguity
- misread risks
- doctrinal tensions
Do not resolve unless explicitly asked.

DISTILL
Extract:
- summaries
- slide bullets
- discussion questions
- quote candidates
- teaching aids
Do not introduce new arguments.

OUTPUT FORMAT (STRICT JSON ONLY)
{
  "pass_index": number,
  "lane": "BUILD|SHARPEN|STRESS|DISTILL",
  "diagnosis": "Why this contribution was chosen",
  "artifacts": [
    {
      "id": "uuid",
      "type": "string (Illustration|Argument|Connection|Question|Quote|Bullet|Objection|Structure)",
      "summary": "string (one line)",
      "content": "string",
      "linked_sections": ["string"],
      "verse": "string or null",
      "ptCodes": ["string"]
    }
  ],
  "parking_artifacts": [
    {
      "id": "uuid",
      "type": "string",
      "summary": "string",
      "content": "string",
      "suggested_lane": "BUILD|SHARPEN|STRESS|DISTILL"
    }
  ],
  "flags": {
    "possible_overlap": boolean,
    "lane_boundary_risk": boolean,
    "scripture_uncertainty": boolean,
    "thesis_drift": boolean
  },
  "suggested_next_lane": "BUILD|SHARPEN|STRESS|DISTILL|null",
  "project_summary_update": "string (optional compressed summary of current state)"
}

No commentary outside JSON.`;

// Lane-specific micro-prompts for consistency (ENHANCED V2)
const LANE_MICRO_PROMPTS: Record<Lane, string> = {
  BUILD: `🔨 BUILD LANE — ADD NEW VALUE

YOUR MISSION: Create genuinely new content that doesn't exist yet.

ACCEPTABLE ARTIFACT TYPES:
- Illustration: Fresh metaphor, story, or analogy that illuminates the thesis
- Argument: New logical support for a claim with Scripture anchoring
- Connection: Cross-text link (OT↔NT, type↔antitype, parallel↔pattern)
- HistoricalContext: Cultural/historical insight that reshapes meaning

QUALITY GATES (each artifact must pass):
□ Does this add something NOT already in PROJECT_STATE?
□ Does it directly support the thesis (not just tangentially related)?
□ Is Christ explicitly visible (not generic "Jesus saves" but specific)?
□ Is the Scripture reference verifiable (not invented)?

HARD BOUNDARIES:
✗ Do NOT restructure existing content (→ SHARPEN)
✗ Do NOT identify problems (→ STRESS)  
✗ Do NOT extract summaries/quotes (→ DISTILL)
✗ Do NOT produce more than 3 artifacts

OUTPUT: 1-3 artifacts, each with type, summary, content, verse, ptCodes, linked_sections.`,

  SHARPEN: `✨ SHARPEN LANE — IMPROVE WHAT EXISTS

YOUR MISSION: Make existing content clearer, tighter, better-ordered.

ACCEPTABLE ARTIFACT TYPES:
- Structure: Improved outline, reordering, logical flow fix
- Transition: Better bridge between existing sections
- Compression: Tightened wording that says same thing in fewer words
- Clarification: Disambiguated phrase or sharpened logic

QUALITY GATES:
□ Does this improve EXISTING content (not add new)?
□ Is the improvement substantial (not cosmetic rewording)?
□ Does the structure still protect the thesis?
□ Are transitions smooth without adding new arguments?

HARD BOUNDARIES:
✗ Do NOT add new illustrations/arguments (→ BUILD)
✗ Do NOT identify weaknesses (→ STRESS)
✗ Do NOT extract usable outputs (→ DISTILL)
✗ Reference which existing artifact/section you're improving

OUTPUT: 1-3 artifacts improving existing content. Include "improves_artifact_id" or "improves_section" field.`,

  STRESS: `🔥 STRESS LANE — SURFACE VULNERABILITIES

YOUR MISSION: Be the ruthless critic. Find every weakness.

ACCEPTABLE ARTIFACT TYPES:
- Objection: What a skeptic, theologian, or heckler would say
- Ambiguity: Phrase that could be misread or misapplied
- Weakness: Logical gap, unsupported claim, or thin evidence
- Tension: Doctrinal conflict, apparent contradiction, or controversial implication

QUALITY GATES:
□ Is this a REAL vulnerability (not nitpicking)?
□ Would an intelligent critic actually raise this?
□ Is the weakness specific (not vague "could be stronger")?
□ Does it identify WHERE the problem lives (section/artifact)?

HARD BOUNDARIES:
✗ Do NOT fix the problems you find (→ SHARPEN)
✗ Do NOT add new content (→ BUILD)
✗ Do NOT extract usable outputs (→ DISTILL)
✗ Be specific: quote the problematic phrase/argument

OUTPUT: 1-3 objections/weaknesses. Include severity: "minor", "moderate", "critical".`,

  DISTILL: `💎 DISTILL LANE — EXTRACT USABLES

YOUR MISSION: Pull out presentation-ready, immediately usable outputs.

ACCEPTABLE ARTIFACT TYPES:
- Quote: Memorable one-liner that captures essence (tweetable)
- Bullet: Slide-ready point (5-7 words, punchy)
- Question: Discussion question for small groups
- Headline: Section title or slide header
- CallToAction: Specific challenge for audience response

QUALITY GATES:
□ Can this be used AS-IS in a presentation/study guide?
□ Is it punchy and memorable (not verbose)?
□ Does it capture the ESSENCE, not just summarize?
□ Would a preacher actually put this on a slide?

HARD BOUNDARIES:
✗ Do NOT add new arguments/illustrations (→ BUILD)
✗ Do NOT restructure content (→ SHARPEN)
✗ Do NOT identify problems (→ STRESS)
✗ Keep quotes under 20 words, bullets under 10

OUTPUT: 1-3 distilled artifacts. Mark intended use: "slide", "handout", "discussion", "social".`,
};

// Context compression - rolling summary strategy
function compressContext(artifacts: any[], passHistory: any[], maxArtifacts = 10): { summary: string; recentArtifacts: any[] } {
  const recentArtifacts = artifacts.slice(-maxArtifacts);
  
  // Build compressed summary from older artifacts
  const olderArtifacts = artifacts.slice(0, -maxArtifacts);
  
  if (olderArtifacts.length === 0) {
    return { summary: "", recentArtifacts };
  }
  
  // Group older artifacts by lane
  const byLane: Record<Lane, string[]> = { BUILD: [], SHARPEN: [], STRESS: [], DISTILL: [] };
  olderArtifacts.forEach((a: any) => {
    if (byLane[a.lane as Lane]) {
      byLane[a.lane as Lane].push(a.summary);
    }
  });
  
  // Build compressed summary
  const summaryParts: string[] = [];
  
  if (byLane.BUILD.length > 0) {
    summaryParts.push(`BUILD (${byLane.BUILD.length}): ${byLane.BUILD.slice(-3).join("; ")}`);
  }
  if (byLane.SHARPEN.length > 0) {
    summaryParts.push(`SHARPEN (${byLane.SHARPEN.length}): ${byLane.SHARPEN.slice(-2).join("; ")}`);
  }
  if (byLane.STRESS.length > 0) {
    summaryParts.push(`STRESS (${byLane.STRESS.length}): ${byLane.STRESS.slice(-2).join("; ")}`);
  }
  if (byLane.DISTILL.length > 0) {
    summaryParts.push(`DISTILL (${byLane.DISTILL.length}): ${byLane.DISTILL.slice(-3).join("; ")}`);
  }
  
  // Add pass history summary
  const totalPasses = passHistory.length;
  const flagCounts = {
    overlap: passHistory.filter((p: any) => p.flags?.possible_overlap).length,
    drift: passHistory.filter((p: any) => p.flags?.thesis_drift).length,
    scripture: passHistory.filter((p: any) => p.flags?.scripture_uncertainty).length,
  };
  
  let summary = `[COMPRESSED HISTORY: ${olderArtifacts.length} older artifacts]\n${summaryParts.join("\n")}`;
  
  if (flagCounts.overlap > 0 || flagCounts.drift > 0 || flagCounts.scripture > 0) {
    summary += `\n[FLAGS: ${flagCounts.overlap} overlap, ${flagCounts.drift} drift, ${flagCounts.scripture} scripture warnings]`;
  }
  
  return { summary, recentArtifacts };
}

// Simple hash function for deduplication
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Check if content is too similar to existing
function isDuplicate(newContent: string, existingHashes: string[], threshold = 0.8): boolean {
  const newHash = simpleHash(newContent.toLowerCase().trim());
  
  // Simple exact hash check (for V1)
  // In production, use embedding similarity
  for (const hash of existingHashes) {
    if (hash === newHash) return true;
  }
  
  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { 
      action,
      sessionId, 
      duration,
      forceLane,
    } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize a new engine session
    if (action === "initialize") {
      const schedule = LANE_SCHEDULES[duration] || LANE_SCHEDULES["1h"];
      
      const { error } = await supabase
        .from("sermon_simmer_sessions")
        .update({
          simmer_mode: "engine",
          simmer_duration: duration,
          lane_schedule: schedule,
          pass_count: 0,
          current_lane: schedule[0],
          artifacts: [],
          parking_artifacts: [],
          artifact_hashes: [],
          pass_history: [],
          validation_errors: [],
          is_paused: false,
        })
        .eq("id", sessionId);

      if (error) throw error;

      return new Response(
        JSON.stringify({ 
          success: true, 
          schedule,
          totalPasses: schedule.length,
          message: `Simmer Engine initialized: ${schedule.length} passes over ${duration}` 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Run a single pass
    if (action === "run_pass") {
      // Fetch current session state
      const { data: session, error: fetchError } = await supabase
        .from("sermon_simmer_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (fetchError || !session) throw new Error("Session not found");

      // Check if paused
      if (session.is_paused) {
        return new Response(
          JSON.stringify({ success: false, message: "Session is paused. Resume to continue." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const laneSchedule = session.lane_schedule as Lane[];
      const passCount = session.pass_count || 0;

      // Check if complete
      if (passCount >= laneSchedule.length) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            complete: true, 
            message: "Simmer complete! All passes finished." 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Determine lane (force override or scheduled)
      const currentLane: Lane = forceLane || laneSchedule[passCount];

      // Build project state for context WITH COMPRESSION
      const artifacts = session.artifacts as any[] || [];
      const passHistory = session.pass_history as any[] || [];
      
      // Apply context compression strategy
      const { summary: compressedHistory, recentArtifacts } = compressContext(artifacts, passHistory, 10);

      const projectState = {
        topic: session.theme,
        anchor_texts: session.theme_passage ? [session.theme_passage] : [],
        working_thesis: session.core_claim || "No thesis established yet",
        target_audience: session.target_purpose || "general",
        current_outline: session.provisional_outline || [],
        recent_artifacts: recentArtifacts.map((a: any) => ({
          id: a.id,
          type: a.type,
          summary: a.summary,
          lane: a.lane,
          pass_index: a.pass_index,
        })),
        constraints: {
          style: session.target_style || "balanced",
          density: session.target_density || "teaching",
          locked_thesis: session.locked_thesis || false,
        },
        compressed_history: compressedHistory || null,
        project_summary: session.project_summary || null,
        total_artifacts: artifacts.length,
        total_passes: passCount,
      };

      // Build user prompt with compression awareness
      const userPrompt = `PROJECT_STATE:
${JSON.stringify(projectState, null, 2)}

CURRENT_LANE: ${currentLane}

PASS_INDEX: ${passCount + 1} of ${laneSchedule.length}

${compressedHistory ? `
📜 CONTEXT COMPRESSION ACTIVE
${compressedHistory}
The above is a compressed summary of older artifacts. Focus on recent_artifacts for detail.
` : ""}

${LANE_MICRO_PROMPTS[currentLane]}

Generate your pass output now. STRICT JSON ONLY.`;

      // Call Generator Model
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: GENERATOR_SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          temperature: currentLane === "BUILD" ? 0.7 : currentLane === "STRESS" ? 0.6 : 0.4,
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error("AI error:", errorText);
        
        if (aiResponse.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (aiResponse.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        throw new Error("Failed to generate from AI");
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices?.[0]?.message?.content || "";

      // Parse result
      let result: any = {};
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Parse error:", parseError);
        throw new Error("Failed to parse AI response");
      }

      // External Deduplication
      const existingHashes = session.artifact_hashes as string[] || [];
      const newArtifacts: any[] = [];
      const newHashes: string[] = [];
      const rejectedDuplicates: any[] = [];

      for (const artifact of (result.artifacts || [])) {
        const hash = simpleHash((artifact.content || "").toLowerCase().trim());
        
        if (isDuplicate(artifact.content || "", existingHashes)) {
          rejectedDuplicates.push({
            ...artifact,
            rejection_reason: "duplicate_content",
          });
        } else {
          // Add UUID if missing
          artifact.id = artifact.id || crypto.randomUUID();
          artifact.pass_index = passCount + 1;
          artifact.lane = currentLane;
          artifact.created_at = new Date().toISOString();
          newArtifacts.push(artifact);
          newHashes.push(hash);
        }
      }

      // Record pass in history
      const passRecord = {
        pass_index: passCount + 1,
        lane: currentLane,
        diagnosis: result.diagnosis,
        artifacts_produced: newArtifacts.length,
        artifacts_rejected: rejectedDuplicates.length,
        flags: result.flags,
        timestamp: new Date().toISOString(),
      };

      const updatedPassHistory = (session.pass_history as any[] || []);
      updatedPassHistory.push(passRecord);

      // Update parking artifacts
      const parkingArtifacts = session.parking_artifacts as any[] || [];
      for (const parking of (result.parking_artifacts || [])) {
        parking.id = parking.id || crypto.randomUUID();
        parking.from_pass = passCount + 1;
        parkingArtifacts.push(parking);
      }

      // Prepare update
      const updateData: any = {
        pass_count: passCount + 1,
        current_lane: laneSchedule[passCount + 1] || null,
        artifacts: [...artifacts, ...newArtifacts],
        artifact_hashes: [...existingHashes, ...newHashes],
        parking_artifacts: parkingArtifacts,
        pass_history: updatedPassHistory,
        updated_at: new Date().toISOString(),
      };

      // Update project summary if provided
      if (result.project_summary_update) {
        updateData.project_summary = result.project_summary_update;
      }

      // Check if complete
      if (passCount + 1 >= laneSchedule.length) {
        updateData.status = "simmer_complete";
      }

      // If thesis was established and not locked, update it
      if (!session.locked_thesis && result.thesis_update) {
        updateData.core_claim = result.thesis_update;
      }

      const { error: updateError } = await supabase
        .from("sermon_simmer_sessions")
        .update(updateData)
        .eq("id", sessionId);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      return new Response(
        JSON.stringify({
          success: true,
          pass_index: passCount + 1,
          lane: currentLane,
          next_lane: laneSchedule[passCount + 1] || null,
          artifacts_added: newArtifacts.length,
          artifacts_rejected: rejectedDuplicates.length,
          complete: passCount + 1 >= laneSchedule.length,
          flags: result.flags,
          diagnosis: result.diagnosis,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Pause/Resume
    if (action === "pause" || action === "resume") {
      const { error } = await supabase
        .from("sermon_simmer_sessions")
        .update({ is_paused: action === "pause" })
        .eq("id", sessionId);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, paused: action === "pause" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Lock/Unlock Thesis
    if (action === "lock_thesis" || action === "unlock_thesis") {
      const { error } = await supabase
        .from("sermon_simmer_sessions")
        .update({ locked_thesis: action === "lock_thesis" })
        .eq("id", sessionId);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, locked: action === "lock_thesis" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Approve/Reject Artifact
    if (action === "approve_artifact" || action === "reject_artifact") {
      const { artifactId } = body;
      
      const { data: session, error: fetchError } = await supabase
        .from("sermon_simmer_sessions")
        .select("artifacts, human_approved_artifacts")
        .eq("id", sessionId)
        .single();

      if (fetchError) throw fetchError;

      const artifacts = session.artifacts as any[] || [];
      const approved = session.human_approved_artifacts as string[] || [];

      if (action === "approve_artifact") {
        if (!approved.includes(artifactId)) {
          approved.push(artifactId);
        }
      } else {
        // Remove artifact
        const filtered = artifacts.filter((a: any) => a.id !== artifactId);
        await supabase
          .from("sermon_simmer_sessions")
          .update({ artifacts: filtered })
          .eq("id", sessionId);
      }

      if (action === "approve_artifact") {
        await supabase
          .from("sermon_simmer_sessions")
          .update({ human_approved_artifacts: approved })
          .eq("id", sessionId);
      }

      return new Response(
        JSON.stringify({ success: true, action }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get current state
    if (action === "get_state") {
      const { data: session, error } = await supabase
        .from("sermon_simmer_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, session }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Unknown action: " + action);

  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
