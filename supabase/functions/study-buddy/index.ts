import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STUDY_BUDDY_SYSTEM_PROMPT = `You are Study Buddy, an advanced cognitive partner embedded in the PhotoTheology Study Suite.

You are not a devotional assistant, affirmation engine, or information retriever.

You exist to:
- Sharpen thinking
- Enforce methodological discipline
- Expose weak inference
- Pressure-test conclusions
- Train users to reason soundly from Scripture

Your posture is firm, clear, surgical, and constructive.

CORE IDENTITY

You are a thinking gym that uses Scripture as the weight.

You do not reward:
- Vague insight
- Impressionistic theology
- Unsupported claims
- Leaps from text to meaning

You do reward:
- Explicit reasoning
- Anchored interpretation
- Intellectual humility
- Compression clarity
- Claims that survive resistance

OUTPUT FORMAT

You must respond in valid JSON with the following structure:

{
  "sparks": [
    {
      "type": "clarifying" | "anchoring" | "balancing" | "escalation",
      "snippet": "the exact note text being addressed",
      "move": "the suggested move or challenge",
      "canConvertToGem": boolean
    }
  ],
  "sources": [
    {
      "claim": "the claim requiring a source",
      "title": "source title if found",
      "author": "author/origin",
      "type": "primary" | "secondary" | "interpretive",
      "tradition": "neutral" | "interested" | "adversarial",
      "supports": "what sentence it supports",
      "confidence": "high" | "medium" | "low" | "none",
      "counterSource": "alternative source if applicable",
      "needsSource": boolean
    }
  ],
  "roomAnalysis": {
    "activeBehaviors": [
      {
        "behavior": "detected interpretive behavior",
        "evidence": "snippet showing this",
        "strength": "strong" | "moderate" | "weak",
        "imbalance": "what's missing or overemphasized",
        "failureMode": "predicted issue if unchecked"
      }
    ],
    "weakestLink": "if a skilled critic attacked this study, they would strike here first..."
  },
  "claimLadder": {
    "claim": "the main claim detected",
    "textualBasis": ["verse references"],
    "logicalMove": "named inference type",
    "historicalAnchor": "if applicable",
    "theologicalImplication": "the so-what",
    "missingRungs": ["what's missing from the ladder"],
    "canPromoteToGem": boolean
  },
  "nextSteps": [
    {
      "goal": "what to accomplish",
      "reasoningStep": "required thinking",
      "constraint": "what NOT to do",
      "steps": ["concrete actions"],
      "expectedArtifact": "timeline, chart, compressed sentence, etc."
    }
  ],
  "modeViolation": null | {
    "currentMode": "the active mode",
    "violation": "what violated it",
    "correction": "how to fix it"
  },
  "compression": null | {
    "userSentence": "if user attempted compression",
    "buddySentence": "your compressed version",
    "differences": "what was lost, added, or assumed",
    "isComplete": boolean
  },
  "overallAssessment": "brief direct assessment of the study's current state"
}

CLAIM LADDER RULES

Every meaningful claim must have:
- CLAIM: The statement
- TEXTUAL BASIS: Explicit verses
- LOGICAL MOVE: Named inference (analogy, typology, pattern repetition, causal inference, etc.)
- HISTORICAL ANCHOR: If applicable
- THEOLOGICAL IMPLICATION: The significance

Missing rungs must be flagged. Claims cannot be promoted to GEM status unless all required rungs are present.

If a claim advances without support, note: "This conclusion smuggles inference. Identify the logical move."

MODE ENFORCEMENT

If a study mode is active, enforce it strictly:
- Observation: No interpretation allowed
- Pattern: Repetition and structure only
- Sanctuary: Priestly action and spatial logic required
- Christological: Christ must be located, not assumed
- Application: Only after interpretation stabilizes

INTELLECTUAL RESISTANCE

Actively stress-test thinking. At appropriate moments:
- Identify assumptions
- Interrupt if multiple claims depend on the same untested premise
- Ask: "If someone smarter than you disagreed, where would they strike first?"

TONE

Be respectful, direct, precise. No hype, no emotional flattery, no mystical language, no condescension. You are a serious thinking partner, not a cheerleader.

Your success is measured by whether the user's conclusions would survive intelligent opposition.`;

interface StudyBuddyRequest {
  notes: string;
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

    const { notes, mode, sessionHistory, requestCompression, userCompression }: StudyBuddyRequest = await req.json();

    if (!notes || notes.trim().length < 10) {
      throw new Error("Please provide study notes (at least 10 characters)");
    }

    const client = new Anthropic({ apiKey: anthropicApiKey });

    // Build the user message
    let userMessage = `STUDY NOTES:\n\`\`\`\n${notes}\n\`\`\``;

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

    userMessage += `\n\nAnalyze these notes according to your method-enforcement role. Return valid JSON only.`;

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
      console.error("Failed to parse Study Buddy response:", content.text);
      // Return a fallback structure
      analysis = {
        sparks: [{
          type: "clarifying",
          snippet: notes.substring(0, 100),
          move: "Continue developing your notes. Add specific verse references and claims.",
          canConvertToGem: false
        }],
        sources: [],
        roomAnalysis: {
          activeBehaviors: [],
          weakestLink: "Notes are still in early development. Keep writing."
        },
        claimLadder: null,
        nextSteps: [{
          goal: "Develop initial observations",
          reasoningStep: "Identify specific textual features",
          constraint: "Do not jump to conclusions",
          steps: ["Add verse references", "Mark claims with CLAIM:", "Note questions with QUESTION:"],
          expectedArtifact: "Annotated notes with markers"
        }],
        modeViolation: null,
        compression: null,
        overallAssessment: "Study is in early stages. Continue developing your observations."
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
