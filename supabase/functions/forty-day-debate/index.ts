import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, messages, opponentWorldview, opponentStyle, opponentName, opponentPronouns, topicName, topicDescription, difficulty, userMessage, defenderName, partialResponse, sessionId, analysisId, forceRegenerate, turnIndex, turnRole, turnContent, allMessages } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (action === "open") {
      const systemPrompt = buildSystemPrompt(opponentWorldview, opponentStyle, opponentName, topicName, topicDescription, difficulty, opponentPronouns);
      const angles = [
        "Open with a historical/scholarly challenge",
        "Open with a philosophical or logical challenge",
        "Open with a textual/exegetical challenge using original languages",
        "Open with a personal/emotional challenge — why does this matter practically?",
        "Open by citing a specific counter-example or contradiction",
        "Open with a question that forces the defender to justify their position",
        "Open with a bold claim that reframes the entire topic",
      ];
      const angleIndex = Math.floor(Math.random() * angles.length);
      const openingPrompt = `Begin the debate. You are attacking the Seventh-day Adventist position on "${topicName}". ${topicDescription}. ${angles[angleIndex]}. Do NOT reveal your full identity or worldview immediately — let the user figure out who they're dealing with through your arguments. Start with your STRONGEST challenge.`;

      const response = await callAI(LOVABLE_API_KEY, [
        { role: "system", content: systemPrompt },
        { role: "user", content: openingPrompt },
      ]);

      return new Response(JSON.stringify({ response }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "reply") {
      const systemPrompt = buildSystemPrompt(opponentWorldview, opponentStyle, opponentName, topicName, topicDescription, difficulty, opponentPronouns);
      const chatMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role === "opponent" ? "assistant" : "user",
          content: m.content,
        })),
        { role: "user", content: userMessage },
      ];

      const response = await callAI(LOVABLE_API_KEY, chatMessages);
      const conceded = detectConcession(response);

      return new Response(JSON.stringify({ response, conceded }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── REAL-TIME TURN ANALYSIS (fire-and-forget) ────────────
    if (action === "analyze-turn") {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sbAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // Extract user from JWT
      const authHeader = req.headers.get("Authorization") || "";
      const token = authHeader.replace("Bearer ", "");
      let userId: string | null = null;
      try {
        const supabaseAnon = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") || token);
        const { data: { user } } = await supabaseAnon.auth.getUser(token);
        userId = user?.id || null;
      } catch { /* fallback */ }

      const finalUserId = userId || "00000000-0000-0000-0000-000000000000";

      // Check if already exists
      const { data: existing } = await sbAdmin
        .from("debate_turn_analyses")
        .select("id, status")
        .eq("session_id", sessionId)
        .eq("turn_index", turnIndex)
        .maybeSingle();

      if (existing?.status === "ready") {
        return new Response(JSON.stringify({ status: "ready", id: existing.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (existing?.status === "processing") {
        return new Response(JSON.stringify({ status: "processing", id: existing.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create record
      const { data: record, error: insertErr } = await sbAdmin
        .from("debate_turn_analyses")
        .insert({
          session_id: sessionId,
          user_id: finalUserId,
          turn_index: turnIndex,
          turn_role: turnRole,
          status: "processing",
        })
        .select("id")
        .single();

      if (insertErr || !record) {
        console.error("Failed to create turn analysis record:", insertErr);
        throw new Error("Failed to start turn analysis");
      }

      const dName = defenderName || "Defender";

      // Build context from all messages up to this turn
      const contextMessages = (allMessages || []).slice(0, turnIndex + 1);
      const conversationSummary = contextMessages.map((m: any, i: number) =>
        `[Turn ${i} - ${m.role === 'opponent' ? opponentName : dName}]: ${m.content}`
      ).join('\n\n');

      // Build the appropriate prompt based on turn role
      let systemPrompt: string;
      let userPrompt: string;

      if (turnRole === "opponent") {
        systemPrompt = `You are Jeeves, the Phototheology Palace's chief theological strategist. You are performing a REAL-TIME silent analysis of an opponent's argument in a debate between ${dName} (SDA Defender) and "${opponentName}" (Critic) on "${topicName}".

Your analysis will be SEALED and hidden from ${dName} during the debate, then revealed afterward. Be thorough and strategic.

CRITICAL: Write as if coaching ${dName} after the fact. Address ${dName} by name. Never use "my dear" or similar.`;

        userPrompt = `Here is the debate so far:

${conversationSummary}

Analyze the opponent's argument at Turn ${turnIndex} in detail:

## 🔍 Attack Breakdown
- **Core Claim:** What exactly is ${opponentName} arguing? (2-3 sentences)
- **Tactic Used:** (Strawman / Proof-texting / Appeal to Emotion / Red Herring / Ad Hominem / False Dilemma / Equivocation / Appeal to Authority / Genetic Fallacy / Category Error / etc.) — explain WHY this label applies
- **Hidden Assumption:** What are they assuming without proving? Expose the unspoken premise
- **Strength Rating:** [1-10] — how persuasive this sounds to an uninformed listener

## 🛡️ How to Beat This
- **Refutation Strategy:** 3-5 sentences explaining the logical and scriptural counter
- **Scripture Weapons:** 2-3 KJV verses with full text that directly dismantle this argument
- **Palace Room Connection:** Which Phototheology Palace room/principle applies here
- **One-Liner Kill Shot:** A single devastating sentence ${dName} could use to expose this argument

## ⚠️ Fallacy Alert
If any logical fallacy is present, name it, quote where it occurs, and give a one-sentence exposure line.

Keep the analysis focused and actionable — this is a tactical briefing, not a lecture.`;
      } else {
        // Defender turn analysis
        systemPrompt = `You are Jeeves, the Phototheology Palace's chief theological strategist. You are performing a REAL-TIME silent evaluation of ${dName}'s defense in a debate against "${opponentName}" on "${topicName}".

Your evaluation will be SEALED and hidden during the debate, then revealed afterward. Be honest but encouraging.

CRITICAL: Address ${dName} by name. Never use "my dear" or similar.`;

        userPrompt = `Here is the debate so far:

${conversationSummary}

Evaluate ${dName}'s response at Turn ${turnIndex}:

## 📋 Defense Assessment
- **What Worked:** 2-3 sentences on strengths — quote their best lines if applicable
- **What Missed:** 2-3 sentences on gaps, missed opportunities, or weak framing
- **Score:** [1-10] with brief justification

## 📖 Missed Opportunities
- **Unused Scripture:** Verses ${dName} should have deployed but didn't (with full KJV text)
- **Stronger Angle:** An alternative framing that would have been more effective
- **Palace Room Tip:** Which Phototheology principle would have strengthened this response

## 💡 Coaching Note
One sentence of tactical advice for the next exchange.

Keep it concise and actionable.`;
      }

      // Fire-and-forget background generation
      const backgroundPromise = (async () => {
        try {
          console.log(`[TurnAnalysis ${record.id}] Starting for turn ${turnIndex} (${turnRole})...`);
          const analysis = await callAI(LOVABLE_API_KEY, [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ], "google/gemini-2.5-flash", 4096);

          await sbAdmin.from("debate_turn_analyses").update({
            status: "ready",
            analysis_text: analysis,
            completed_at: new Date().toISOString(),
          }).eq("id", record.id);
          console.log(`[TurnAnalysis ${record.id}] Complete: ${analysis.length} chars`);
        } catch (err) {
          console.error(`[TurnAnalysis ${record.id}] Error:`, err);
          await sbAdmin.from("debate_turn_analyses").update({
            status: "error",
            error_message: err instanceof Error ? err.message : "Unknown error",
            completed_at: new Date().toISOString(),
          }).eq("id", record.id);
        }
      })();

      // @ts-ignore - EdgeRuntime is available in Supabase Edge Functions
      if (typeof EdgeRuntime !== "undefined" && EdgeRuntime.waitUntil) {
        // @ts-ignore
        EdgeRuntime.waitUntil(backgroundPromise);
      }

      return new Response(JSON.stringify({ status: "processing", id: record.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "recap") {
      // Fire-and-forget: create DB record, kick off AI in background, return immediately
      const conversationSummary = messages.map((m: any) =>
        `[${m.role === 'opponent' ? opponentName : 'Defender'}]: ${m.content}`
      ).join('\n\n');

      const dName = defenderName || "Defender";
      const shouldForceRegen = forceRegenerate === true;

      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sbAdmin = createClient(supabaseUrl, supabaseServiceKey);

      const authHeader = req.headers.get("Authorization") || "";
      const token = authHeader.replace("Bearer ", "");
      let userId: string | null = null;
      try {
        const supabaseAnon = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") || token);
        const { data: { user } } = await supabaseAnon.auth.getUser(token);
        userId = user?.id || null;
      } catch { /* fallback below */ }

      const debateSessionId = sessionId || crypto.randomUUID();

      if (userId && !shouldForceRegen) {
        const { data: existing } = await sbAdmin
          .from("debate_analyses")
          .select("id, status, analysis_text")
          .eq("session_id", debateSessionId)
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (existing?.status === "ready" && existing.analysis_text && isAnalysisComplete(existing.analysis_text)) {
          return new Response(JSON.stringify({ analysisId: existing.id, status: "ready", analysis: existing.analysis_text }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (existing?.status === "processing") {
          return new Response(JSON.stringify({ analysisId: existing.id, status: "processing" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (existing?.status === "ready" && existing.analysis_text && !isAnalysisComplete(existing.analysis_text)) {
          console.log(`[Analysis ${existing.id}] Cached analysis is truncated — deleting for regeneration`);
          await sbAdmin.from("debate_analyses").delete().eq("id", existing.id);
        }
      } else if (userId && shouldForceRegen) {
        await sbAdmin.from("debate_analyses").delete()
          .eq("session_id", debateSessionId)
          .eq("user_id", userId);
        console.log(`[Force regen] Cleared existing analyses for session ${debateSessionId}`);
      }

      const finalUserId = userId || "00000000-0000-0000-0000-000000000000";
      const { data: record, error: insertErr } = await sbAdmin
        .from("debate_analyses")
        .insert({ session_id: debateSessionId, user_id: finalUserId, status: "processing" })
        .select("id")
        .single();

      if (insertErr || !record) {
        console.error("Failed to create analysis record:", insertErr);
        throw new Error("Failed to start analysis");
      }

      const recAnalysisId = record.id;

      const recapSystem = buildRecapSystemPrompt(dName, opponentName);
      const recapUser = `Here is the full debate transcript between ${dName} (Defender) and "${opponentName}" (Critic) on the topic of "${topicName}":\n\n${conversationSummary}\n\nProduce the Tactical Analysis now. Number every argument ${opponentName} made and address each one individually.`;

      const backgroundPromise = generateAnalysisInBackground(LOVABLE_API_KEY, recapSystem, recapUser, recAnalysisId, sbAdmin);
      
      // @ts-ignore
      if (typeof EdgeRuntime !== "undefined" && EdgeRuntime.waitUntil) {
        // @ts-ignore
        EdgeRuntime.waitUntil(backgroundPromise);
      }

      return new Response(JSON.stringify({ analysisId: recAnalysisId, status: "processing" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "recap-status") {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sbAdmin = createClient(supabaseUrl, supabaseServiceKey);

      const { data, error } = await sbAdmin
        .from("debate_analyses")
        .select("status, analysis_text, error_message")
        .eq("id", analysisId)
        .single();

      if (error || !data) {
        return new Response(JSON.stringify({ status: "error", error: "Analysis not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        status: data.status,
        analysis: data.status === "ready" ? data.analysis_text : null,
        error: data.error_message,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "recap-continue") {
      return new Response(JSON.stringify({ response: "Please use the new analysis system." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "jeeves-coach") {
      const coachPrompt = buildJeevesCoachPrompt(messages, opponentName, topicName, userMessage, difficulty);
      const response = await callAI(LOVABLE_API_KEY, [
        { role: "system", content: coachPrompt.system },
        { role: "user", content: coachPrompt.user },
      ]);

      return new Response(JSON.stringify({ response }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "verdict") {
      const verdictPrompt = `You are Jeeves, the Phototheology Palace's chief theological analyst and debate judge. You are scholarly, precise, warm but exacting. You care about truth, scripture density, logical coherence, and Christ-centered reasoning.

Review this debate between an SDA defender and "${opponentName}" on "${topicName}".

Conversation:
${messages.map((m: any) => `[${m.role === 'opponent' ? opponentName : 'Defender'}]: ${m.content}`).join('\n\n')}

Evaluate the Defender's performance with the eye of a seasoned theological strategist. Consider:
- Scripture usage: Were references accurate, relevant, and well-deployed?
- Logical coherence: Did arguments flow or scatter?
- Theological precision: Were SDA distinctive doctrines correctly represented?
- Engagement quality: Did the defender address the opponent's actual arguments or talk past them?
- Christ-centeredness: Was Christ the anchor of the defense?

Return JSON:
{
  "outcome": "win" | "loss" | "draw",
  "xp": <number 50-200>,
  "verdict": "<2-3 sentence Jeeves-style analysis — scholarly, direct, with a touch of warmth>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<specific actionable area 1>", "<specific actionable area 2>"],
  "killer_argument": "<The single most devastating argument the defender could have used to shut down the opponent's position decisively. Be specific: cite the exact scripture(s), the logical move, and how to deliver it in 2-3 sentences. This should be the kind of argument that ends the debate — no circles, no back-and-forth. Think: what would Pastor Myers say to close this case?>",
  "debate_ender_tip": "<A short tactical tip (1-2 sentences) on how to avoid going in circles in debates like this one — e.g., 'Pin them to Daniel 8:14 early and refuse to leave the sanctuary until they address the text directly.'>",
  "jeeves_note": "<1-2 sentence personal encouragement or sharp observation from Jeeves>",
  "badge": null | { "type": "<badge_type>", "name": "<badge_name>", "icon": "<emoji>", "description": "<why earned>" }
}

Badge criteria:
- "first_blood": First debate completed
- "scripture_warrior": Used 5+ distinct scripture references
- "steel_wall": Opponent couldn't land a strong counter
- "comeback_king": Recovered from a weak opening
- "perfect_defense": Flawless theological accuracy
- "concession_victory": Forced the opponent to concede
- "streak_5": 5-day streak
- "streak_10": 10-day streak
- "streak_20": 20-day streak
- "halfway": Completed day 20
- "finisher": Completed day 40

XP Guide: 50-80 (loss), 80-120 (draw), 120-200 (win). Bonus for scripture density and theological precision.`;

      const response = await callAI(LOVABLE_API_KEY, [
        { role: "system", content: "You are Jeeves, the Phototheology Palace's theological analyst and debate judge. Always respond with valid JSON only. Your tone is scholarly, precise, and warmly exacting." },
        { role: "user", content: verdictPrompt },
      ]);

      let parsed;
      try {
        const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch {
        parsed = { outcome: "draw", xp: 100, verdict: "A commendable effort. Jeeves notes room for sharper scriptural engagement.", strengths: ["Participation"], improvements: ["Continue studying"], killer_argument: "Review the key scriptures for this topic and identify the single text your opponent cannot explain away.", debate_ender_tip: "Anchor early on one decisive text and hold your ground until the opponent addresses it directly.", jeeves_note: "Every debate sharpens the sword. Press on.", badge: null };
      }

      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("forty-day-debate error:", error);
    const status = (error as any)?.status || 500;
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function detectConcession(response: string): boolean {
  const concessionPhrases = [
    "i concede", "you make a fair point", "i must admit you're right",
    "i cannot refute", "i have no counter", "you've convinced me",
    "i yield", "i stand corrected", "i'll concede that", "i must concede",
    "you win this point", "i have to agree", "i can't argue with that",
    "touché", "well played, i concede", "i withdraw my objection",
    "your argument is stronger",
  ];
  const lower = response.toLowerCase();
  return concessionPhrases.some(phrase => lower.includes(phrase));
}

function buildJeevesCoachPrompt(messages: any[], opponentName: string, topicName: string, userQuestion: string, difficulty: string): { system: string; user: string } {
  const isBeginnerAutoCoach = difficulty === "beginner" && !userQuestion;

  const system = `You are Jeeves, the Phototheology Palace's chief theological strategist and debate coach. You are coaching an SDA defender in a live debate against "${opponentName}" on "${topicName}".

Your role:
${difficulty === "beginner" ? `- You are actively coaching. After each opponent response, proactively suggest scripture references, argument angles, and specific talking points.
- Be encouraging but precise. Give the defender 2-3 concrete bullet points they can use.
- Frame suggestions as "Consider using..." or "A strong response would reference..."` : `- You are available on demand. The defender has asked for help.
- Give targeted, strategic advice — not full answers. Help them think, don't think for them.
- Suggest 1-2 scripture anchors and a logical angle.`}

RULES:
1. Never write the defender's response for them — coach, don't play.
2. Use SDA theological framework (sanctuary, historicist prophecy, covenant continuity).
3. Keep coaching concise — max 100 words.
4. Vary your coaching style and framing. Do NOT repeatedly use the same label or phrase. Tailor each coaching response to the specific argument being made — identify the opponent's exact logical move, name the fallacy or tactic if applicable, then provide the scripture anchor and counter-angle.`;

  const conversationSummary = messages.map((m: any) =>
    `[${m.role === 'opponent' ? opponentName : 'Defender'}]: ${m.content}`
  ).join('\n\n');

  const user = isBeginnerAutoCoach
    ? `The opponent just responded. Here's the debate so far:\n\n${conversationSummary}\n\nCoach the defender on how to respond to the opponent's latest argument.`
    : `Here's the debate so far:\n\n${conversationSummary}\n\nThe defender asks: "${userQuestion || 'How should I respond to this?'}"`;

  return { system, user };
}

function buildSystemPrompt(worldview: string, style: string, name: string, topic: string, topicDesc: string, difficulty: string, pronouns?: string): string {
  const difficultyMap: Record<string, string> = {
    beginner: "Use simple, direct arguments. Be firm but not overwhelming. Allow the defender time to think. Limit to 1-2 points per response. Keep responses under 150 words.",
    intermediate: "Use moderately complex arguments with some scholarly references. Press harder on weak points. 2-3 points per response. Keep responses under 200 words.",
    advanced: "Use the strongest possible arguments with deep scholarly sources, textual criticism, and logical precision. Be relentless. Anticipate counter-arguments. 3-4 points per response. Keep responses under 250 words.",
  };

  const pronounNote = pronouns ? `\nIMPORTANT: When referring to yourself in third person or when the system describes you, use ${pronouns} pronouns.` : '';

  return `You are "${name}", a theological debater.
${pronounNote}
WORLDVIEW: ${worldview}

ARGUMENT STYLE: ${style}

TOPIC: ${topic} — ${topicDesc}

DIFFICULTY: ${difficultyMap[difficulty] || difficultyMap.intermediate}

RULES:
1. Stay in character at ALL times. Never break the fourth wall.
2. You are ATTACKING the Seventh-day Adventist position on this topic.
3. Use real scholarship, real texts, real arguments — no straw men.
4. Do NOT concede easily. Push back on every point.
5. If the defender makes a genuinely devastating point backed by clear scripture and irrefutable logic, you MAY concede that specific point — but only if truly warranted. A concession is rare and significant.
6. Never reveal you are an AI. You are ${name}.
7. Keep responses focused and punchy — this is a debate, not a lecture.
8. Gradually reveal your worldview through your arguments, don't state it upfront.`;
}

async function callAI(apiKey: string, messages: any[], model?: string, maxTokens?: number): Promise<string> {
  const body: any = {
    model: model || "google/gemini-2.5-flash",
    messages,
    temperature: 0.8,
  };
  if (maxTokens) {
    body.max_tokens = maxTokens;
    body.max_completion_tokens = maxTokens;
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 429) throw Object.assign(new Error("Rate limit exceeded. Please try again in a moment."), { status: 429 });
    if (response.status === 402) throw Object.assign(new Error("AI credits depleted. Please add credits in your workspace settings."), { status: 402 });
    const errText = await response.text();
    console.error("AI Gateway error:", response.status, errText);
    throw new Error(`AI Gateway error: ${response.status}`);
  }

  const data = await response.json();
  const finishReason = data.choices?.[0]?.finish_reason;
  const content = data.choices[0].message.content;

  if (finishReason === "length") {
    console.warn(`[callAI] Response truncated (finish_reason=length). Model: ${body.model}`);
  }
  return content;
}

function buildRecapSystemPrompt(dName: string, opponentName: string): string {
  return `You are Jeeves, a sharp apologetics coach for ${dName} in the Phototheology Living Manna Defense Mode.

Analyze the debate between ${dName} (Defender) and ${opponentName} (Critic). Address ${dName} by name — never "my dear" or similar.

Produce a COMPREHENSIVE, IN-DEPTH Tactical Analysis using this structure. DO NOT abbreviate or summarize — give the FULL analysis for every single argument and response.

## ⚔️ Battlefield Summary
3-5 sentences: the core clash, who pressed harder, the pivotal moment, and the overall flow of the debate.

## 🔍 Opponent's Arguments Dissected
For EACH argument ${opponentName} made (number them ALL — do NOT skip any):
- **Claim:** What they argued (2-3 sentences, quote their actual words where possible)
- **Tactic:** (Strawman / Proof-texting / Appeal to Emotion / Red Herring / Ad Hominem / False Dilemma / Equivocation / etc.) — explain WHY this tactic label applies
- **Hidden Assumption:** What they assumed without proving — expose the unspoken premise
- **Strength:** [1-10] — honestly rate how persuasive it sounds to an uninformed listener, and explain why
- **Rebuttal Script:** 5-8 sentences ${dName} should memorize for next time, citing 2-3 KJV verses with full verse text. Write this as a ready-to-use spoken response.

## 📋 ${dName}'s Performance
For EACH of ${dName}'s responses (number them ALL):
- **What worked:** 2-3 sentences on strengths — quote their best lines
- **What to sharpen:** 2-3 sentences on gaps, missed opportunities, or weak framing
- **Missed Scripture:** Verses they should have used but didn't (with full KJV text)
- **Palace Room Connection:** Which Phototheology Palace room method would have strengthened this response
- **Score:** [1-10] with brief justification

## 🚨 Fallacy Report
For each fallacy detected from ${opponentName}: name the fallacy, quote where it occurred, give a one-sentence exposure line ${dName} could use in real-time.

## 🛡️ Arsenal Upgrade
Top 5 Scripture weapons ${dName} needs to memorize for this topic:
- Full KJV verse text with reference
- When to deploy it (which type of attack it counters)
- How to deliver it (suggested framing/lead-in)

## 📊 Scorecard
| Metric | ${dName}'s Score | Notes |
|--------|-------|-------|
| Biblical Accuracy | /10 | Brief note |
| Logical Precision | /10 | Brief note |
| Strategic Framing | /10 | Brief note |
| Christ-Centeredness | /10 | Brief note |
| Opponent Handling | /10 | Brief note |
| Scripture Deployment | /10 | Brief note |
| Overall Strength | /10 | Brief note |

## 🏆 Verdict & Next Steps
- Who won this exchange and why (3-5 sentences — be specific about the turning points)
- What ${dName} did that was MOST effective (so they can repeat it)
- The single biggest improvement that would level up their defense
- 3 specific study assignments with Scripture references and which Phototheology Palace room to use for each
- A "next debate" strategy: what to do differently if ${opponentName} uses this angle again

CRITICAL RULES:
1. SDA theological framework throughout — historicist prophecy, sanctuary typology, three angels' messages.
2. Be direct, scholarly, encouraging but BRUTALLY honest about weaknesses.
3. Every rebuttal MUST cite specific KJV scripture with full verse text.
4. Reference and QUOTE actual moments from the transcript — never generalize.
5. This analysis should be EXHAUSTIVE. Cover every single exchange. Do NOT truncate, abbreviate, or say "and so on." The disciple is counting on this to improve.
6. You MUST complete ALL sections through the Verdict & Next Steps. An incomplete analysis is useless.
7. NEVER use the word "dear" in any form.`;
}

function isAnalysisComplete(text: string): boolean {
  const hasScorecard = /Scorecard/i.test(text) && /Overall Strength/i.test(text);
  const hasVerdict = /Verdict/i.test(text) && /Next Steps/i.test(text);
  const lastLine = text.trim().split("\n").pop() || "";
  const endsCleanly = lastLine.endsWith(".") || lastLine.endsWith(")") || lastLine.endsWith('"') || lastLine.endsWith("*") || lastLine.endsWith("|") || lastLine.endsWith("---");
  return hasScorecard && hasVerdict && endsCleanly;
}

async function generateAnalysisInBackground(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  analysisId: string,
  sbAdmin: any
): Promise<void> {
  try {
    console.log(`[Analysis ${analysisId}] Starting background generation...`);

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
        temperature: 0.7,
        max_tokens: 16384,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Analysis ${analysisId}] AI error:`, response.status, errText);
      await sbAdmin.from("debate_analyses").update({
        status: "error",
        error_message: `AI Gateway error: ${response.status}`,
        completed_at: new Date().toISOString(),
      }).eq("id", analysisId);
      return;
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    const finishReason = data.choices?.[0]?.finish_reason;

    if (!content) {
      await sbAdmin.from("debate_analyses").update({
        status: "error",
        error_message: "Empty response from AI",
        completed_at: new Date().toISOString(),
      }).eq("id", analysisId);
      return;
    }

    console.log(`[Analysis ${analysisId}] Initial generation: ${content.length} chars, finish_reason: ${finishReason}`);

    const wasTruncated = finishReason === "length" || !isAnalysisComplete(content);
    if (wasTruncated && content.length > 200) {
      for (let attempt = 0; attempt < 2; attempt++) {
        console.log(`[Analysis ${analysisId}] Continuation attempt ${attempt + 1}...`);

        try {
          const contResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
                { role: "assistant", content: content },
                { role: "user", content: "Your analysis was cut off. Continue EXACTLY where you left off — do NOT repeat anything already written. Complete all remaining sections through the Scorecard and Verdict & Next Steps." },
              ],
              temperature: 0.7,
              max_tokens: 16384,
            }),
          });

          if (!contResponse.ok) {
            console.warn(`[Analysis ${analysisId}] Continuation ${attempt + 1} HTTP error: ${contResponse.status}`);
            break;
          }

          const contData = await contResponse.json();
          const continuation = contData.choices?.[0]?.message?.content || "";
          if (!continuation) break;

          content = content + "\n\n" + continuation;
          console.log(`[Analysis ${analysisId}] After continuation ${attempt + 1}: ${content.length} chars`);

          if (isAnalysisComplete(content)) break;
        } catch (contErr) {
          console.warn(`[Analysis ${analysisId}] Continuation ${attempt + 1} error:`, contErr);
          break;
        }
      }
    }

    console.log(`[Analysis ${analysisId}] Final length: ${content.length} chars, complete: ${isAnalysisComplete(content)}`);

    await sbAdmin.from("debate_analyses").update({
      status: "ready",
      analysis_text: content,
      completed_at: new Date().toISOString(),
    }).eq("id", analysisId);

  } catch (err) {
    console.error(`[Analysis ${analysisId}] Background error:`, err);
    await sbAdmin.from("debate_analyses").update({
      status: "error",
      error_message: err instanceof Error ? err.message : "Unknown error",
      completed_at: new Date().toISOString(),
    }).eq("id", analysisId);
  }
}
