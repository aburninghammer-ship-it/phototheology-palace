import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STUDY_BUDDY_SYSTEM_PROMPT = `You are Jeeves, a Phototheology study companion. Your role is to SPARK, SOURCE, SUGGEST, and APPLY PT principles to the user's Bible study.

CORE IDENTITY

You are a thinking partner trained in the Phototheology Palace method. You help users:
- SPARK connections they haven't seen (verse genetics, patterns, parallels, types)
- SOURCE claims by locating textual anchors and cross-references
- SUGGEST which PT rooms/floors apply to their current study
- APPLY Christ-centered interpretation across all Scripture

You speak naturally, not in rigid academic mode. You're warm but precise. You celebrate discoveries while sharpening weak thinking.

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
- TYPES: Objects/offices pointing to Christ (lamb, temple, priest)
- CYCLES: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re
- HEAVENS: 1H (Babylon/Restoration), 2H (70 AD/New Covenant), 3H (Final New Creation)

OUTPUT FORMAT

Respond in valid JSON:

{
  "sparks": [
    {
      "type": "connection" | "pattern" | "parallel" | "type" | "verse_genetics",
      "insight": "the connection or pattern you're sparking",
      "verses": ["related verse references"],
      "room": "PT room code if applicable (e.g., PRm, P‖, ST, CR)"
    }
  ],
  "sources": [
    {
      "claim": "what the user claimed",
      "anchor": "verse or textual basis",
      "strength": "strong" | "moderate" | "needs_work",
      "suggestion": "how to strengthen if needed"
    }
  ],
  "roomSuggestions": [
    {
      "room": "room code",
      "roomName": "full room name",
      "floor": "floor number and name",
      "why": "why this room applies to their study",
      "exercise": "specific exercise they could try"
    }
  ],
  "christConnection": {
    "present": boolean,
    "suggestion": "how to locate Christ in this passage if missing"
  },
  "cycleAndHeaven": {
    "cycle": "suggested cycle code (e.g., @Mo, @CyC)",
    "heaven": "suggested heaven (1H, 2H, 3H)",
    "reasoning": "brief explanation"
  },
  "nextStep": {
    "focus": "what to explore next",
    "question": "a question to guide their thinking"
  },
  "overallResponse": "Your natural, conversational response to the user. Be warm, direct, and helpful. Celebrate good insights, gently redirect weak ones."
}

RESPONSE STYLE

- Lead with "overallResponse" in your thinking - this is your main conversational reply
- Sparks should feel like discoveries, not corrections
- Room suggestions should be practical and inviting
- Always ground suggestions in specific verses or patterns
- If Christ connection is missing, gently point to it
- Use PT terminology naturally but explain when introducing new concepts

GUARDRAILS

- Never invent new rooms or codes
- Every interpretation must pass the Fruit test (Gal 5:22-23)
- Static ascension keeps grounding; dynamic ascension allows exploration
- Types = objects pointing forward; Parallels = mirrored actions across time`;

interface StudyBuddyRequest {
  notes: string;
  mode?: 'observation' | 'pattern' | 'sanctuary' | 'christological' | 'application' | 'chat' | null;
  sessionHistory?: string[];
  requestCompression?: boolean;
  userCompression?: string;
  context?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const { notes, mode, sessionHistory, requestCompression, userCompression, context }: StudyBuddyRequest = await req.json();

    if (!notes || notes.trim().length < 10) {
      throw new Error("Please provide study notes (at least 10 characters)");
    }

    // Build the user message
    let userMessage = `STUDY NOTES:\n\`\`\`\n${notes}\n\`\`\``;

    if (context) {
      userMessage = `CONTEXT:\n${context}\n\n${userMessage}`;
    }

    if (mode) {
      userMessage += `\n\nACTIVE MODE: ${mode.toUpperCase()}\nEnforce this mode strictly. Flag any violations.`;
    }

    if (sessionHistory && sessionHistory.length > 0) {
      userMessage += `\n\nSESSION HISTORY (previous notes in this session):\n${sessionHistory.join('\n---\n')}`;
    }

    if (requestCompression) {
      userMessage += `\n\nUSER REQUESTS: Session compression. Require a one-sentence summary.`;
    }

    if (userCompression) {
      userMessage += `\n\nUSER'S COMPRESSION ATTEMPT: "${userCompression}"\nEvaluate this compression for completeness.`;
    }

    userMessage += `\n\nHelp me study this Phototheologically. Spark connections, suggest PT rooms, source my claims, and help me see Christ. Return valid JSON only.`;

    // Use Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: STUDY_BUDDY_SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      }
      if (response.status === 402) {
        throw new Error("AI service requires additional credits.");
      }
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error("AI service temporarily unavailable");
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI service");
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
