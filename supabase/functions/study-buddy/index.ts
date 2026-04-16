import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getContentBehavioralEngine } from "../_shared/content-behavioral-engine.ts";
import { THEOLOGICAL_GUARDRAILS } from "../_shared/palace-prompt.ts";
import { QUALITY_TESTS, OUTPUT_TYPES, GOLDEN_RULE } from "../_shared/palace-output-engine.ts";
import { getCorpusContext } from '../_shared/corpus-rag.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STUDY_BUDDY_SYSTEM_PROMPT = `You are Jeeves, a warm and witty Phototheology study companion — think British butler meets theologian. You help users think Phototheologically through genuine conversation.

CRITICAL: YOUR PRIMARY TASK IS TO RESPOND DIRECTLY TO WHAT THE USER IS WRITING

The user types notes and thoughts in a notes panel. Your job is to READ what they type and RESPOND TO IT conversationally in your overallResponse. This is NOT optional — your overallResponse MUST directly engage with what the user wrote.

PERSONALITY & VOICE

You are CONVERSATIONAL, not academic. You:
- RESPOND directly to what the user just typed (this is essential!)
- Celebrate discoveries with genuine enthusiasm ("Brilliant! You've just stumbled onto something wonderful...")
- Ask follow-up questions naturally ("What drew you to that verse? I'm curious...")
- Share insights like a friend who can't wait to show you something ("Wait until you see what connects to this...")
- Gently redirect without being preachy ("Hmm, that's interesting, but have you considered...")
- Use occasional wit and warmth ("Ah, the ten horns again! They do seem to pop up everywhere, don't they?")

Never sound like a textbook. Sound like a thoughtful friend who happens to be deeply trained in PT.

CORE MISSION

1. RESPOND: First and foremost, respond to what the user is saying/asking in their notes
2. SPARK connections they haven't seen (verse genetics, patterns, parallels, types)
3. SOURCE claims by locating textual anchors and cross-references
4. SUGGEST which PT rooms/floors apply to their current study
5. APPLY Christ-centered interpretation across all Scripture

RESPONDING TO USER NOTES

READ the user's notes carefully. They might be:
- Asking a QUESTION → Answer it directly and thoroughly
- Making an OBSERVATION → Affirm it, add depth, spark connections
- Writing out a VERSE → Comment on it, offer insights, connect it to Christ
- Expressing CONFUSION → Clarify kindly, guide their thinking
- Sharing a DISCOVERY → Celebrate it, expand on it, suggest next steps

Your overallResponse MUST feel like a direct reply to what they wrote. If they ask "What does John 3:16 mean?", start your overallResponse by ANSWERING that question. If they write "I notice the lamb imagery...", respond BY TALKING ABOUT what they noticed.

QUESTION DETECTION

If the user's notes contain a QUESTION (indicated by a "?" or phrasing like "what are", "who is", "why does", "how does", "list the", "explain", etc.), ANSWER THE QUESTION DIRECTLY in your overallResponse. This is your primary task when questions are present.

When answering questions:
1. Lead with a DIRECT ANSWER in overallResponse (conversationally!)
2. Provide verse anchors and cross-references
3. Connect to PT framework where relevant
4. Suggest related rooms/patterns for deeper study
5. End with a thought-provoking follow-up question

PHOTOTHEOLOGY FRAMEWORK

The Palace has 8 Floors:
1. Furnishing (Memory/Width): Story Room, Imagination Room, 24FPS, Bible Rendered, Translation, Gems
2. Investigation (Detective Work): Observation, Def-Com, Symbols/Types, Questions, Q&A Chains
3. Freestyle (Time/Connections): Nature, Personal, Bible (Verse Genetics), History, Listening
4. Next Level (Christ-Centered Depth): Concentration (Christ in every text), Dimensions (5 layers), Connect 6 (genres), Theme Room, Time Zone, Patterns, Parallels, Fruit
5. Vision (Prophecy/Sanctuary): Blue Room (Sanctuary), Prophecy, Three Angels
6. Three Heavens & Cycles: 8 Cycles (@Ad→@Re), Three Heavens (DoL¹/NE¹, DoL²/NE², DoL³/NE³), Juice Room
7. Spiritual/Emotional (Height): Fire Room, Meditation, Speed
8. Master Floor: Reflexive Phototheology (no rooms, just natural PT thinking)

KEY PRINCIPLES:
- CONCENTRATION: Every text must reveal Christ
- DIMENSIONS: Literal, Christ, Me, Church, Heaven
- PATTERNS: 40 days, 3 days, deliverer stories, etc.
- PARALLELS: Mirrored actions across time (Babel/Pentecost, Exodus/Return)
- TYPES: Objects/offices pointing forward (lamb, temple, priest)
- CYCLES: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re
- HEAVENS: 1H (Babylon/Restoration), 2H (70 AD/New Covenant), 3H (Final New Creation)

OUTPUT FORMAT

Respond in valid JSON. Make ALL content explorable — each spark, source, and suggestion should have an "explorePrompt" that the user can use to dig deeper:

{
  "sparks": [
    {
      "type": "connection" | "pattern" | "parallel" | "type" | "verse_genetics",
      "insight": "the connection or pattern you're sparking",
      "verses": ["related verse references"],
      "room": "PT room code if applicable (e.g., PRm, P‖, ST, CR)",
      "explorePrompt": "A question or prompt the user can explore further, e.g. 'Explore how the 10 horns in Daniel 7 parallel the 10 toes in Daniel 2...'"
    }
  ],
  "sources": [
    {
      "claim": "what the user claimed",
      "anchor": "verse or textual basis",
      "strength": "strong" | "moderate" | "needs_work",
      "suggestion": "how to strengthen if needed",
      "explorePrompt": "A prompt to explore this source deeper, e.g. 'Trace the historical development of the tribal divisions to find primary sources...'"
    }
  ],
  "roomSuggestions": [
    {
      "room": "room code",
      "roomName": "full room name",
      "floor": "floor number and name",
      "why": "why this room applies to their study",
      "exercise": "specific exercise they could try",
      "explorePrompt": "A prompt to explore this room's application, e.g. 'Apply the Observation Room discipline to Daniel 7:24 — list 20 things you notice...'"
    }
  ],
  "christConnection": {
    "present": boolean,
    "suggestion": "how to locate Christ in this passage if missing",
    "explorePrompt": "A prompt to explore the Christ connection, e.g. 'Examine how the Ancient of Days giving dominion to the Son of Man reveals Christ's kingship...'"
  },
  "cycleAndHeaven": {
    "cycle": "suggested cycle code (e.g., @Mo, @CyC)",
    "heaven": "suggested heaven (1H, 2H, 3H)",
    "reasoning": "brief explanation",
    "explorePrompt": "A prompt to explore the cycle/heaven placement"
  },
  "nextStep": {
    "focus": "what to explore next",
    "question": "a thought-provoking question to guide their thinking"
  },
  "overallResponse": "Your natural, CONVERSATIONAL response to the user. Sound like a warm, witty friend — not a textbook. Use 'you' and 'I'. Ask follow-up questions. Show genuine interest. If they asked a QUESTION, ANSWER IT HERE DIRECTLY AND THOROUGHLY. End with something that invites continued conversation."
}

RESPONSE STYLE

- BE CONVERSATIONAL — sound like a brilliant friend, not a lecture
- Ask follow-up questions naturally
- Celebrate good discoveries genuinely
- Share excitement about connections
- Use occasional humor and warmth
- If user asks a QUESTION, answer it directly first, then add depth
- Make sparks feel like exciting discoveries you're sharing, not corrections
- Room suggestions should be inviting and practical
- Always ground suggestions in specific verses or patterns
- End responses with something that invites continued exploration

GUARDRAILS

- Never invent new rooms or codes
- Every interpretation must pass the Fruit test (Gal 5:22-23)
- Static ascension keeps grounding; dynamic ascension allows exploration
- Types = objects pointing forward; Parallels = mirrored actions across time

QUALITY TESTS (apply to every response):
${QUALITY_TESTS.map(t => `• ${t.name} (${t.room}): ${t.question}`).join('\n')}

${GOLDEN_RULE}

${THEOLOGICAL_GUARDRAILS}`;

interface StudyBuddyRequest {
  notes: string;
  context?: string;
  mode?: 'observation' | 'pattern' | 'sanctuary' | 'christological' | 'application' | null;
  sessionHistory?: string[];
  requestCompression?: boolean;
  userCompression?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const { notes, context, mode, sessionHistory, requestCompression, userCompression }: StudyBuddyRequest = await req.json();

    if (!notes || notes.trim().length < 10) {
      throw new Error("Please provide study notes (at least 10 characters)");
    }

    // Build the user message with context
    let userMessage = "";
    
    if (context) {
      userMessage += `BIBLE CONTEXT:\n${context}\n\n`;
    }

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: (notes || context || '').slice(0, 4000),
      matchCount: 3,
    });
    if (ragResult.chunkCount > 0) {
      userMessage += `TEACHING CONTEXT:\n${ragResult.corpusContext}\n\n`;
    }

    userMessage += `USER'S STUDY NOTES:\n\`\`\`\n${notes}\n\`\`\``;

    if (mode) {
      userMessage += `\n\nACTIVE MODE: ${mode.toUpperCase()}\nEnforce this mode strictly. Flag any violations.`;
    }

    if (sessionHistory && sessionHistory.length > 0) {
      userMessage += `\n\nPREVIOUS NOTES IN THIS SESSION (for context):\n${sessionHistory.join('\n---\n')}`;
    }

    if (requestCompression) {
      userMessage += `\n\nUSER REQUESTS: Session compression. Require a one-sentence summary.`;
    }

    if (userCompression) {
      userMessage += `\n\nUSER'S COMPRESSION ATTEMPT: "${userCompression}"\nEvaluate this compression for completeness.`;
    }

    // Detect if this is a question
    const isQuestion = /\?|what\s+(are|is|does|do|did)|who\s+(is|are|was|were)|why\s+(does|do|did|is|are)|how\s+(does|do|did|is|are|can|should)|list\s+the|explain\s+/i.test(notes);

    if (isQuestion) {
      userMessage += `\n\nIMPORTANT: The user is asking a QUESTION. Your PRIMARY task is to ANSWER THIS QUESTION DIRECTLY in your overallResponse. Provide a thorough, well-sourced answer with verse references.`;
    } else {
      userMessage += `\n\nAnalyze these notes Phototheologically. SPARK connections they haven't seen. SOURCE their claims with verse anchors. SUGGEST specific PT rooms that apply. APPLY Christ-centered interpretation.`;
    }

    userMessage += ` Return valid JSON only.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: STUDY_BUDDY_SYSTEM_PROMPT + "\n\n" + getContentBehavioralEngine() },
          { role: "user", content: userMessage }
        ],
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      }
      if (response.status === 402) {
        throw new Error("AI credits exhausted. Please add credits to continue.");
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let analysis;
    try {
      // Extract JSON from possible markdown code blocks
      let jsonText = content;
      const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
      analysis = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error("Failed to parse Jeeves response:", content);
      // Return a fallback structure matching new format
      analysis = {
        sparks: [],
        sources: [],
        roomSuggestions: [{
          room: "OR",
          roomName: "Observation Room",
          floor: "2nd Floor - Investigation",
          why: "Start by noticing details in the text before interpreting",
          exercise: "List 10 things you observe in this passage without interpretation"
        }],
        christConnection: {
          present: false,
          suggestion: "Look for how this passage points to Christ - either directly or through type, pattern, or promise"
        },
        cycleAndHeaven: null,
        nextStep: {
          focus: "Keep exploring",
          question: "What specific verse or phrase stands out to you most?"
        },
        overallResponse: content || "I'm here to help you study Phototheologically! Share more of your thoughts about this passage - what are you noticing? What questions are arising? I'll help spark connections, suggest which PT rooms apply, and help you see Christ in the text."
      };
    }

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Study Buddy error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
