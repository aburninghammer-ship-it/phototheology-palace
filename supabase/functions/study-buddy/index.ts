import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.39.0";

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
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicApiKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const { notes, context, mode, sessionHistory, requestCompression, userCompression }: StudyBuddyRequest = await req.json();

    if (!notes || notes.trim().length < 10) {
      throw new Error("Please provide study notes (at least 10 characters)");
    }

    const client = new Anthropic({ apiKey: anthropicApiKey });

    // Build the user message with context
    let userMessage = "";
    
    if (context) {
      userMessage += `BIBLE CONTEXT:\n${context}\n\n`;
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

    userMessage += `\n\nAnalyze these notes Phototheologically. SPARK connections they haven't seen. SOURCE their claims with verse anchors. SUGGEST specific PT rooms that apply. APPLY Christ-centered interpretation. Return valid JSON only.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: STUDY_BUDDY_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Parse the JSON response
    let analysis;
    try {
      // Extract JSON from possible markdown code blocks
      let jsonText = content.text;
      const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
      analysis = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error("Failed to parse Jeeves response:", content.text);
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
        overallResponse: "I'm here to help you study Phototheologically! Share more of your thoughts about this passage - what are you noticing? What questions are arising? I'll help spark connections, suggest which PT rooms apply, and help you see Christ in the text."
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
