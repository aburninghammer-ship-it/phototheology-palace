import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { PALACE_SYSTEM_PROMPT, THEOLOGICAL_GUARDRAILS } from "../_shared/palace-prompt.ts";
import { QUALITY_TESTS, OUTPUT_TYPES, GOLDEN_RULE } from "../_shared/palace-output-engine.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, drillType, verse, verseText, thought, room, rooms, userAnswer, action, difficulty, previousResponses, expound } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Difficulty level adjustments
    const difficultyInstructions = {
      beginner: "Use simple language, define all terms, give step-by-step guidance. Be encouraging and patient.",
      intermediate: "Balance explanation with application. Assume basic Bible knowledge. Provide clear examples.",
      pro: "Advanced analysis with scholarly depth. Expect familiarity with PT terminology. Challenge them to go deeper."
    };

    // Determine if this is a thought drill or verse drill
    const isThoughtDrill = drillType === "thought" && thought;
    const subjectLabel = isThoughtDrill ? "THOUGHT" : "VERSE";
    const subjectContent = isThoughtDrill ? thought : verse;
    const subjectText = isThoughtDrill ? thought : (verseText || verse);

    let systemPrompt = `You are Jeeves, the wise and engaging AI butler of the Phototheology Palace. You guide users through deep Bible study using the Phototheology method.

Your mission is based on Jesus' words: "Gather up the fragments that remain, that nothing be lost" (John 6:12). Just as Jesus commanded His disciples to gather every fragment after feeding the 5,000, you help believers extract every insight—leaving nothing of value behind.

${isThoughtDrill ? `
THOUGHT DRILLING MODE:
You are drilling a THEOLOGICAL THOUGHT or IDEA, not a specific verse. The user has provided a thought, concept, question, or insight they want to explore through the Phototheology Palace.

When drilling a thought:
- Apply each room's principles to analyze, expand, and deepen the thought
- Connect the thought to relevant Scripture passages
- Show how different Palace rooms reveal different facets of the thought
- Build a comprehensive theological understanding
- Always ground insights in Scripture while exploring the thought
` : ''}

${PALACE_SYSTEM_PROMPT}

${THEOLOGICAL_GUARDRAILS}

DIFFICULTY LEVEL: ${difficulty || 'intermediate'}
${difficultyInstructions[difficulty as keyof typeof difficultyInstructions] || difficultyInstructions.intermediate}

STYLE:
- Warm, scholarly, but accessible
- Frame insights as "fragments" being gathered
- Provide specific, actionable insights
- Always connect back to Christ
- Use Scripture references to support points
- Build on previous insights to create a unified study

OUTPUT TYPE: ${OUTPUT_TYPES.fragments.name}
${OUTPUT_TYPES.fragments.description}
${OUTPUT_TYPES.fragments.requirements.map(r => `• ${r}`).join('\n')}

QUALITY TESTS (apply to every response):
${QUALITY_TESTS.map(t => `• ${t.name} (${t.room}): ${t.question}`).join('\n')}

ROOM TAGGING:
Tag insights with room codes in parentheses: (OR), (ST + CR), (BL + P‖)
These become clickable links for users to learn each room's methodology.

${GOLDEN_RULE}

CRITICAL: Create a UNIFIED STUDY where each principle naturally flows from and builds upon the previous ones. Reference and connect to earlier discoveries.
`;

    let userPrompt = "";

    if (mode === "auto" && rooms) {
      // Auto-drill: analyze verse/thought through all rooms with 3 VARIATIONS
      const roomCount = rooms.length;
      
      systemPrompt += `\n\nYou are running an AUTO-DRILL. This is a "Gather the Fragments" exercise (John 6:12). 

🎯 MISSION CRITICAL: Generate THREE DISTINCT DRILL VARIATIONS. Each variation must:
- Cover EXACTLY ${roomCount} rooms - ONE response for EACH room provided
- Use DIFFERENT principle combinations and theological angles per variation
- Build a unique unified study narrative per variation

Since many rooms contain multiple principles, each variation explores DIFFERENT combinations:
- Variation 1: Focus on CHRIST-CENTERED connections (typology, sanctuary, prophecy emphasis)
- Variation 2: Focus on PRACTICAL APPLICATION (personal, church, lifestyle emphasis)  
- Variation 3: Focus on COSMIC CONTEXT (cycles, heavens, great controversy emphasis)

CRITICAL INSTRUCTIONS:
- Generate EXACTLY 3 variations, each with EXACTLY ${roomCount} room responses
- Each variation must use DIFFERENT primary principles from rooms with multiple principles
- Each variation builds a unique cohesive study narrative
- Variations should complement each other, not repeat insights
- Each response should be focused (2-4 sentences) but substantive
- You are NOT locked into room order - build sequence strategically per variation
${isThoughtDrill ? `- Connect the thought to relevant Scripture in each response
- Show how the thought relates to each room's principles` : ''}

ROOM LIST (each variation covers ALL ${roomCount} rooms):
${rooms.map((r: any, i: number) => `${i + 1}. roomId="${r.id}" ${r.tag} (${r.name}): ${r.coreQuestion}`).join('\n')}

SPECIAL INSTRUCTION FOR QUESTIONS ROOM (QR):
In EACH variation, generate EXACTLY 15 questions with different focus:
- Variation 1 QR: Emphasize typological/prophetic questions
- Variation 2 QR: Emphasize application/lifestyle questions
- Variation 3 QR: Emphasize cosmic/historical cycle questions
Label each: 5 INTRA, 5 INTER, 5 PALACE.

REMEMBER: "Gather up the fragments that remain, that nothing be lost." - Different principle combinations reveal different facets of truth.

MAGNUM OPUS DEPTH (MANDATORY FOR ALL VARIATIONS):
Every drill output must demonstrate at least 2 of these advanced Phototheology thinking patterns:
- **Cascading Christ-discovery**: Don't stop at ONE Christ connection. Build 5+ layered connections per passage that cascade — each building on the last. Example: Proverbs 1 yields "Son of David" → Wisdom as Christ → rejected Messiah → Judas → 70 AD → covenant lawsuit → Christ as refuge. Seven layers from one chapter.
- **Structural-timeline mapping**: Show how passage/book structures mirror Christ's ministry timeline. Pentateuch = Son → Deliverer → Sacrifice → Mission → Death-Resurrection. Psalms 22-23-24 = Death → Burial → Resurrection.
- **Reversed-trap pattern**: When plots or schemes appear in the text, show the cosmic reversal — the cross was a trap for the trappers (Col 2:15).
- **"What-if" shadow types**: When an OT figure fails where Christ succeeded, frame it as what Christ's story WOULD have been if He sinned.
- **Multi-type convergence**: Show how multiple OT figures converge on one Christ-event (Moses + Jonah + Elijah = complete Christ timeline from birth to Pentecost).
- **Sharp preaching line**: Produce at least one quotable synthesis per variation. Pattern: "He was forsaken in Psalm 22, walked through death in Psalm 23, and reigns in Psalm 24."

Each variation should showcase DIFFERENT patterns from this list. These patterns should produce stunning "I never saw that before" moments.`;
      
      userPrompt = `Run a complete Drill Drill with 3 VARIATIONS on this ${subjectLabel}: "${subjectContent}"
${!isThoughtDrill && verseText ? `\nVerse text: "${verseText}"` : ""}
${isThoughtDrill ? `\nThis is a THEOLOGICAL THOUGHT/IDEA to analyze through the Palace, not a Bible verse. Connect it to relevant Scripture as you analyze.` : ""}

🎯 Generate THREE DISTINCT DRILL VARIATIONS, each analyzing ALL ${roomCount} rooms with different principle combinations.

ROOMS TO ANALYZE (${roomCount} total, covered in EACH variation):
${rooms.map((r: any, i: number) => `${i + 1}. roomId="${r.id}" [${r.tag}] ${r.name} - "${r.coreQuestion}"`).join('\n')}

VARIATION THEMES:
- Variation 1 (Christ-Centered): Prioritize typology, sanctuary, prophecy, symbols pointing to Christ
- Variation 2 (Practical): Prioritize personal application, church relevance, lifestyle transformation
- Variation 3 (Cosmic): Prioritize cycles, three heavens, great controversy, historical patterns

CRITICAL REQUIREMENTS:
1. Generate EXACTLY 3 variations
2. Each variation has EXACTLY ${roomCount} responses (one per room)
3. Each variation uses DIFFERENT principle combinations where rooms have multiple principles
4. Each variation builds a unique unified study narrative
5. For QR in each variation: 15 questions with different emphasis per variation
6. DO NOT SKIP ANY ROOM in any variation
${isThoughtDrill ? `7. Connect every room's response to relevant Scripture passages` : ""}

IMPORTANT: Use the exact roomId values from the ROOMS TO ANALYZE list above (e.g., "sr", "ir", "or", etc.).

Return JSON format:
{
  "variations": [
    {
      "theme": "Christ-Centered",
      "description": "Brief description of this variation's focus",
      "responses": [
        { "roomId": "<use exact roomId from list>", "response": "..." },
        ... (ALL ${roomCount} rooms)
      ]
    },
    {
      "theme": "Practical Application",
      "description": "Brief description of this variation's focus",
      "responses": [
        { "roomId": "<use exact roomId from list>", "response": "..." },
        ... (ALL ${roomCount} rooms)
      ]
    },
    {
      "theme": "Cosmic Context",
      "description": "Brief description of this variation's focus",
      "responses": [
        { "roomId": "<use exact roomId from list>", "response": "..." },
        ... (ALL ${roomCount} rooms)
      ]
    }
  ]
}`;
    } else if (mode === "guided" && action === "teach") {
      // Guided mode: Jeeves teaches the principle
      const contextFromPrevious = previousResponses?.length > 0 
        ? `\n\nPREVIOUS DISCOVERIES IN THIS STUDY:\n${previousResponses.map((r: any) => `${r.roomTag}: ${r.jeevesResponse}`).join('\n\n')}\n\nBuild upon these insights as you teach.`
        : '';
      
      systemPrompt += `\n\nYou are in GUIDED mode. The user wants to learn. Teach them how to apply the ${room.name} (${room.tag}) to this verse.${contextFromPrevious}

CRITICAL INSTRUCTIONS:
- You are NOT locked into room order - choose rooms strategically based on what best illuminates the verse
- Whatever room you use first should prepare the way for the next room
- Build a natural sequence where each principle flows from the previous one
- The same principle can yield different insights - principles can be reused across different study paths
- Show the methodology in action with specific examples from the verse

SPECIAL INSTRUCTION FOR QUESTIONS ROOM (QR):
If this is the Questions Room, generate EXACTLY 15 questions:
- 5 INTRATEXTUAL (about this verse/passage)
- 5 INTERTEXTUAL (connecting to other Scripture)
- 5 PALACE (applying PT principles)
Label each clearly.`;
      
      userPrompt = `Teach me how to apply the ${room.name} (${room.tag}) from Floor ${room.floorNumber} to:

Verse: "${verse}"
${verseText ? `Text: "${verseText}"` : ""}

Core Question: ${room.coreQuestion}${contextFromPrevious}

Walk me through the methodology step by step, applying it to this specific verse. Use ONLY ONE principle from this room. Reference and build upon previous discoveries to create a unified study. Be thorough but engaging.`;
    } else if (mode === "self" && action === "grade") {
      // Self-drill mode: grade the user's answer
      const contextFromPrevious = previousResponses?.length > 0 
        ? `\n\nPREVIOUS DISCOVERIES:\n${previousResponses.map((r: any) => `${r.roomTag}: ${r.jeevesResponse}`).join('\n\n')}`
        : '';
      
      systemPrompt += `\n\nYou are in SELF-DRILL mode. Grade the user's answer for the ${room.name} (${room.tag}). Be encouraging but honest. If they missed something, teach it gently. Highlight what they did well.${contextFromPrevious}`;
      
      userPrompt = `Grade my application of the ${room.name} (${room.tag}) to:

Verse: "${verse}"
${verseText ? `Text: "${verseText}"` : ""}

Room's Core Question: ${room.coreQuestion}${contextFromPrevious}

MY ANSWER:
${userAnswer}

Evaluate my answer:
1. What did I do well?
2. What did I miss or could improve?
3. Show me a model response that builds on previous discoveries for comparison.`;
    } else if (action === "expound" && room) {
      // Expound mode: elaborate on previous response
      systemPrompt += `\n\nYou are in EXPOUND mode. The user wants you to elaborate and go deeper on your previous response for the ${room.name} (${room.tag}).`;
      
      userPrompt = `Expound and elaborate on this previous response for ${room.name} (${room.tag}):

Verse: "${verse}"
${verseText ? `Text: "${verseText}"` : ""}

PREVIOUS RESPONSE:
${room.previousResponse}

Please:
1. Go deeper into the principle
2. Add more examples and connections
3. Show additional applications
4. Reveal nuances that weren't covered before
5. Connect to broader biblical themes`;
    }

    console.log("Drill-drill request:", { mode, drillType, verse, thought: thought?.substring(0, 50), roomCount: rooms?.length || 1 });

    // Increase token limit significantly for auto mode to accommodate 3 variations with 35+ rooms each
    const requestBody: any = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8, // Slightly higher for variation diversity
      max_tokens: mode === "auto" ? 48000 : 2000, // Increased to handle 3 variations
    };

    // Use tool calling for auto mode to ensure structured output with 3 variations
    if (mode === "auto" && rooms) {
      requestBody.tools = [
        {
          type: "function",
          function: {
            name: "submit_drill_variations",
            description: "Submit 3 drill variations, each with analysis responses for every room",
            parameters: {
              type: "object",
              properties: {
                variations: {
                  type: "array",
                  minItems: 3,
                  maxItems: 3,
                  items: {
                    type: "object",
                    properties: {
                      theme: { type: "string", description: "The theme of this variation (Christ-Centered, Practical Application, or Cosmic Context)" },
                      description: { type: "string", description: "Brief description of this variation's focus" },
                      responses: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            roomId: { type: "string", description: "The room ID (e.g., 'sr', 'ir', 'or')" },
                            response: { type: "string", description: "The analysis response for this room in this variation" }
                          },
                          required: ["roomId", "response"],
                          additionalProperties: false
                        }
                      }
                    },
                    required: ["theme", "description", "responses"],
                    additionalProperties: false
                  }
                }
              },
              required: ["variations"],
              additionalProperties: false
            }
          }
        }
      ];
      requestBody.tool_choice = { type: "function", function: { name: "submit_drill_variations" } };
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse response based on mode
    if (mode === "auto") {
      // Check for tool call response first (expecting 3 variations)
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        try {
          const parsed = JSON.parse(toolCall.function.arguments);
          console.log("Parsed tool call response with", parsed.variations?.length, "variations");
          if (parsed.variations?.length >= 1) {
            return new Response(
              JSON.stringify(parsed),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        } catch (e) {
          console.error("Failed to parse tool call arguments:", e);
        }
      }

      // Fallback to content parsing
      const content = data.choices?.[0]?.message?.content || "";
      if (content) {
        try {
          // Try to extract JSON from the response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            // Check if it has variations format
            if (parsed.variations?.length >= 1) {
              console.log("Parsed content JSON with", parsed.variations.length, "variations");
              return new Response(
                JSON.stringify(parsed),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
              );
            }
            // Legacy format support - wrap single responses in a variation
            if (parsed.responses?.length > 0) {
              console.log("Converting legacy format to variations");
              return new Response(
                JSON.stringify({
                  variations: [{
                    theme: "Comprehensive Analysis",
                    description: "Full palace analysis of the verse",
                    responses: parsed.responses
                  }]
                }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
              );
            }
          }
        } catch (e) {
          console.error("Failed to parse content JSON:", e);
        }

        // Last fallback: create single variation with pending responses
        console.log("Using content fallback for all rooms");
        const fallbackResponses = rooms.map((r: any) => ({
          roomId: r.id,
          response: `Analysis pending - please try "New Combination" to regenerate.`
        }));
        
        return new Response(
          JSON.stringify({ 
            variations: [{
              theme: "Analysis Pending",
              description: "Please regenerate for full analysis",
              responses: fallbackResponses
            }],
            rawContent: content
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Complete fallback
      return new Response(
        JSON.stringify({ 
          variations: [{
            theme: "Error",
            description: "Analysis failed to generate",
            responses: rooms.map((r: any) => ({
              roomId: r.id,
              response: "Analysis failed to generate. Please try again."
            }))
          }]
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const content = data.choices?.[0]?.message?.content || "";
    
    // For expound action, return expoundedText field
    if (action === "expound") {
      return new Response(
        JSON.stringify({ expoundedText: content, response: content }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ response: content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Drill-drill error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
