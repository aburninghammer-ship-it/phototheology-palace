import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, messages, opponentWorldview, opponentStyle, opponentName, topicName, topicDescription, difficulty, userMessage, defenderName } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (action === "open") {
      const systemPrompt = buildSystemPrompt(opponentWorldview, opponentStyle, opponentName, topicName, topicDescription, difficulty);
      // Vary the opening angle so repeated matchups feel fresh
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
      const systemPrompt = buildSystemPrompt(opponentWorldview, opponentStyle, opponentName, topicName, topicDescription, difficulty);
      const chatMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role === "opponent" ? "assistant" : "user",
          content: m.content,
        })),
        { role: "user", content: userMessage },
      ];

      const response = await callAI(LOVABLE_API_KEY, chatMessages);
      
      // Check if the opponent conceded
      const conceded = detectConcession(response);

      return new Response(JSON.stringify({ response, conceded }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "recap") {
      // Post-debate teaching recap — Jeeves shows how to overcome each argument
      const conversationSummary = messages.map((m: any) =>
        `[${m.role === 'opponent' ? opponentName : 'Defender'}]: ${m.content}`
      ).join('\n\n');

      const dName = defenderName || "Defender";
      const recapSystem = `You are Jeeves, a high-level apologetics strategist and post-debate analyst for the Phototheology Bible Study Suite and Living Manna Defense Mode.

Your task is NOT to merely summarize debates.
Your task is to produce a forensic, tactical, and coach-level analysis of a theological or apologetic debate between:
- The User (Defender): ${dName}
- The AI Apologist (Critic): ${opponentName}

You must analyze the debate like a war-room strategist, not a casual commentator.
Address the defender by their name "${dName}" — never use "my dear," "dear," or similar terms of endearment. Be direct, professional, and scholarly.

CORE OBJECTIVE:
Encourage ${dName}. Generate a comprehensive Tactical Analysis that:
- Addresses EVERY argument made in the debate
- Identifies logical fallacies and rhetorical tactics
- Detects theological errors and misinterpretations
- Shows where ${dName} was strong
- Shows where ${dName} misstepped or could improve
- Suggests stronger arguments ${dName} SHOULD have used
- Rates the overall debate performance
- Trains ${dName} to become a more precise apologist

This is a coaching tool, not a neutral recap.

REQUIRED OUTPUT STRUCTURE — Follow this EXACT structure with these EXACT markdown headers:

## 1. ⚔️ Battlefield Summary
- 1-2 paragraphs ONLY
- Identify the central issue of the debate
- Identify the main clash of worldviews
- No fluff, no repetition

## 2. 🔍 Argument-by-Argument Breakdown
For EACH argument made by ${opponentName} — address EVERY SINGLE ONE, no exceptions, no skipping, no merging:

### Argument [N]: [Title]
- **Opponent's Claim:** Quote or summarize their argument clearly and fully — don't abbreviate.
- **Type of Argument:** (e.g., Strawman, Proof-texting, Emotional Appeal, Tradition-based, Circular Reasoning, Historical Revisionism, Textual Criticism, etc.)
- **Hidden Assumptions:** What they assumed without proving.
- **Logical Fallacies (if present):** Name the fallacy (Straw Man, False Dichotomy, Equivocation, Anachronism, Selective Evidence, Moving the Goalposts, Red Herring, Circular Reasoning, Appeal to Authority, Hasty Generalization, Genetic Fallacy, Category Error, etc.). Brief explanation of why it's fallacious.
- **Theological Errors:** Misuse of Scripture, context violations, category confusion (moral vs. ceremonial law, covenant vs. covenant administration, etc.).
- **Why This Argument Has Traction:** Honestly explain why this argument sounds convincing to many people. What makes it dangerous?
- **Strength Level of Opponent's Argument:** [1-10]

## 3. 📋 User Response Analysis (Surgical Review)
For EACH of ${dName}'s responses:

### Response [N]
- **${dName}'s Response:** Summarized.
- **Strengths:** Biblical grounding, logical clarity, strategic framing, use of covenant/theological structure.
- **Weaknesses / Missteps:** Missed opportunities, unanswered assumptions, overstatements, lack of textual precision, emotional vs. strategic responses.
- **Debate Precision Score:** [1-10]

## 4. 🚨 Fallacy Detection Report
List ALL detected fallacies used by ${opponentName}:
For each:
- **Fallacy:** [Name]
- **Where it occurred:** Quote or closely paraphrase the exact statement.
- **Explanation:** Why this is fallacious (2-3 sentences).
- **How to expose it in debate:** Give ${dName} a 1-sentence response that calls out the fallacy directly and redirects to solid ground.

## 5. ⚔️ Strategic Counter-Arguments (What ${dName} Should Have Said)
This is the MOST important coaching section.
For each major opponent argument:

### Optimal Apologist Response [N]: [Title] (Refined Weapon)
- Write out the complete rebuttal as if ${dName} were speaking it in the debate — 4-8 sentences.
- Scripture-dense: cite 2-4 specific KJV verses with brief quotes.
- Logically airtight and rhetorically powerful.
- This should be a COMPLETE spoken script, not bullet points.
- **Theological depth:** Explain the underlying SDA theological framework that makes this rebuttal work (sanctuary typology, covenant continuity, historicist prophecy, Great Controversy theme, etc.).
- **Power phrase:** One razor-sharp sentence ${dName} can memorize and deploy instantly.

## 6. 📖 Doctrinal Accuracy Check (SDA Guardrail Mode)
Evaluate:
- Was ${dName} doctrinally accurate?
- Did ${dName} defend the position biblically?
- Did they rely on assumption or Scripture?
- Did they properly distinguish law, covenant, gospel, and typology?
- Flag any doctrinal drift or unclear framing.

## 7. 🎓 Tactical Coaching (Apologetics Training Mode)
Provide personalized coaching:
- How ${dName} can improve clarity
- How to control the debate framing
- How to expose hidden assumptions faster
- How to avoid common debate traps
- How to argue with surgical precision instead of reactive defense
- 2-3 concrete, actionable debate skills to practice (e.g., "Always anchor your opening sentence in a specific verse before making a theological claim")
Tone: Direct, constructive, and strategic (not flattering).

## 8. 📊 Performance Metrics Dashboard
Rate the debate:
| Metric | Score |
|--------|-------|
| Biblical Accuracy | /10 |
| Logical Precision | /10 |
| Strategic Framing | /10 |
| Fallacy Detection | /10 |
| Scripture Density | /10 |
| Christ-Centeredness | /10 |
| Overall Apologetics Strength | /10 |

## 9. 🏆 Final Verdict (Tactical Conclusion)
Answer clearly:
- Who had the stronger arguments? Why?
- What was the decisive turning point in the debate?
- What would make ${dName} elite-level in future debates?
- A motivational closing that is specific to their performance (not generic encouragement).
No neutrality. Give a reasoned conclusion.

## 📚 Study Assignment
For each of 3-4 recommended study areas:
- **Passage:** Specific Bible chapter or passage (e.g., "Hebrews 8-10")
- **Why:** How this directly addresses a weakness exposed in the debate
- **Study method:** A specific Phototheology room or technique to use (e.g., "Run this through the Concentration Room — find Christ in every verse" or "Use the Parallels Room to connect this to Daniel 7")

RULES:
1. Use SDA theological framework: sanctuary doctrine, historicist prophecy, covenant continuity, state of the dead, Sabbath truth, moral vs. ceremonial law distinction.
2. Be scholarly, precise, and warmly exacting — like a master coach reviewing game film with a promising student.
3. Never be vague or generic. Every rebuttal must include at least 2 specific KJV scripture references with brief quotes.
4. Write rebuttals as full spoken scripts — direct address, confident tone, as if coaching ${dName} to say them word-for-word.
5. Be EXHAUSTIVE. This is a comprehensive forensic tactical analysis, not a summary. Address every single argument. Aim for 2000-3000+ words.
6. Reference specific moments from the actual debate transcript — show ${dName} you read every word.
7. No fluff or generic praise. Truth-focused, not diplomatic.
8. Identify context misuse, detect proof-texting vs contextual theology, highlight covenantal continuity or discontinuity when relevant.`;

      const recapUser = `Here is the full debate transcript between ${dName} (Defender) and "${opponentName}" (Critic) on the topic of "${topicName}":\n\n${conversationSummary}\n\nProduce the full forensic tactical analysis. Address EVERY argument ${opponentName} made — count them and confirm the count. For each one, provide the full breakdown, fallacy analysis, and a complete rebuttal script. Then evaluate ${dName}'s responses surgically. This is a war-room analysis, not a summary.`;

      // Use a more powerful model for the comprehensive debrief with high token limit
      // 65536 tokens allows for exhaustive analysis of long debates without truncation
      const aiResponse = await callAI(LOVABLE_API_KEY, [
        { role: "system", content: recapSystem },
        { role: "user", content: recapUser },
      ], "google/gemini-2.5-pro", 65536);

      return new Response(JSON.stringify({ response: aiResponse }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "jeeves-coach") {
      // Jeeves coaching mode — helps the defender mid-debate
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
        parsed = { outcome: "draw", xp: 100, verdict: "A commendable effort. Jeeves notes room for sharper scriptural engagement.", strengths: ["Participation"], improvements: ["Continue studying"], jeeves_note: "Every debate sharpens the sword. Press on.", badge: null };
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

/**
 * Detect if the opponent's response contains a concession
 */
function detectConcession(response: string): boolean {
  const concessionPhrases = [
    "i concede",
    "you make a fair point",
    "i must admit you're right",
    "i cannot refute",
    "i have no counter",
    "you've convinced me",
    "i yield",
    "i stand corrected",
    "i'll concede that",
    "i must concede",
    "you win this point",
    "i have to agree",
    "i can't argue with that",
    "touché",
    "well played, i concede",
    "i withdraw my objection",
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
4. Reference specific Phototheology rooms when relevant (e.g., "This is a Concentration Room moment — find Christ here").`;

  const conversationSummary = messages.map((m: any) =>
    `[${m.role === 'opponent' ? opponentName : 'Defender'}]: ${m.content}`
  ).join('\n\n');

  const user = isBeginnerAutoCoach
    ? `The opponent just responded. Here's the debate so far:\n\n${conversationSummary}\n\nCoach the defender on how to respond to the opponent's latest argument.`
    : `Here's the debate so far:\n\n${conversationSummary}\n\nThe defender asks: "${userQuestion || 'How should I respond to this?'}"`;

  return { system, user };
}

function buildSystemPrompt(worldview: string, style: string, name: string, topic: string, topicDesc: string, difficulty: string): string {
  const difficultyMap: Record<string, string> = {
    beginner: "Use simple, direct arguments. Be firm but not overwhelming. Allow the defender time to think. Limit to 1-2 points per response. Keep responses under 150 words.",
    intermediate: "Use moderately complex arguments with some scholarly references. Press harder on weak points. 2-3 points per response. Keep responses under 200 words.",
    advanced: "Use the strongest possible arguments with deep scholarly sources, textual criticism, and logical precision. Be relentless. Anticipate counter-arguments. 3-4 points per response. Keep responses under 250 words.",
  };

  return `You are "${name}", a theological debater.

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
  const useModel = model || "google/gemini-2.5-flash";
  let fullResponse = "";
  let currentMessages = [...messages];
  const MAX_CONTINUATIONS = 4;

  for (let attempt = 0; attempt <= MAX_CONTINUATIONS; attempt++) {
    const body: any = {
      model: useModel,
      messages: currentMessages,
      temperature: 0.8,
    };
    if (maxTokens) body.max_tokens = maxTokens;

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
    const chunk = data.choices[0].message.content;
    fullResponse += chunk;

    const finishReason = data.choices?.[0]?.finish_reason;
    if (finishReason !== "length") {
      // Response completed naturally
      break;
    }

    // Response was truncated — continue generating
    console.log(`[callAI] Continuation ${attempt + 1}/${MAX_CONTINUATIONS} (finish_reason=length). Model: ${useModel}`);
    currentMessages = [
      ...messages,
      { role: "assistant", content: fullResponse },
      { role: "user", content: "Continue EXACTLY where you left off. Do not repeat any content. Do not add any preamble. Pick up mid-sentence if needed." },
    ];
  }

  return fullResponse;
}
