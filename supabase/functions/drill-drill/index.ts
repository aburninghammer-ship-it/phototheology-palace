import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// CORRECT Phototheology Palace structure per the knowledge bank
const PALACE_STRUCTURE = `
## Phototheology Palace Structure (CORRECT)

### Floor 1 - Furnishing (Memory & Visualization)
- SR (Story Room): What exactly happened—and in what order? Break into beats.
- IR (Imagination Room): What do you see, hear, feel, smell, taste? Sensory immersion.
- 24 (24FPS Room): One memorable image per chapter for instant retrieval.
- BR (Bible Rendered): One glyph per 24-chapter block - compress the canon.
- TR (Translation Room): Convert words into pictures - verse to icon, book to mural.
- GR (Gems Room): Combine 2-4 unrelated texts to find rare truths.

### Floor 2 - Investigation (Detective Work)
- OR (Observation Room): 20-50 observations. Start with WHAT IS HAPPENING before interpretation.
- DC (Def-Com Room): Define key terms in Greek/Hebrew, consult trusted commentaries.
- ST (Symbols/Types Room): Track symbols (Lamb, Rock, Light) through Scripture to Christ.
- QR (Questions Room): Generate 50-100 questions: INTRA, INTER, and PALACE questions.
- QA (Q&A Room): Let Scripture answer Scripture - cross-reference chains.

### Floor 3 - Freestyle (Connections for Time)
- NF (Nature Freestyle): See Scripture lessons in nature (Psalm 1's tree, storms, sunrise).
- PF (Personal Freestyle): Your life becomes the object lesson.
- BF (Bible Freestyle): Verse genetics - trace relationships between verses.
- HF (History/Social Freestyle): See lessons in culture, history, current events.
- LR (Listening Room): Turn conversations and sermons into Scripture connections.

### Floor 4 - Next Level (Christ-Centered Depth)
- CR (Concentration Room): Every text must reveal Christ. John 5:39, Luke 24:27.
- DR (Dimensions Room): 5 dimensions - 1D Literal, 2D Christ, 3D Me, 4D Church, 5D Heaven.
- C6 (Connect 6 Room): Classify by genre - Law, Poetry, Prophecy, Gospel, Epistle, Parable.
- TRm (Theme Room): Place on walls - Sanctuary, Life of Christ, Great Controversy, Time-Prophecy.
- TZ (Time Zone Room): 6 zones - Heaven-Past/Now/Future, Earth-Past/Now/Future.
- PRm (Patterns Room): 40 days, 3 days, deliverer stories - recurring motifs.
- P‖ (Parallels Room): Mirrored actions - Babel/Pentecost, Exodus/Return from Babylon.
- FRt (Fruit Room): Does it produce love, joy, peace, patience, kindness, goodness, faith, meekness, temperance?

### Floor 5 - Vision (Prophecy & Sanctuary)
- BL (Blue/Sanctuary Room): Map to sanctuary furniture - Altar, Laver, Lampstand, Table, Incense, Ark.
- PR (Prophecy Room): Daniel/Revelation timelines, repeat-and-enlarge patterns.
- 3A (Three Angels Room): Everlasting Gospel, Babylon Fallen, Warning against the beast.

### Floor 6 - Three Heavens & Cycles
- Cycles: @Ad (Adamic), @No (Noahic), @Ab (Abrahamic), @Mo (Mosaic), @Cy (Cyrusic), @CyC (Cyrus-Christ), @Sp (Spirit), @Re (Remnant)
- Heavens: 1H (DoL¹/NE¹), 2H (DoL²/NE²), 3H (DoL³/NE³)
- JR (Juice Room): Run entire book through all principles.

### Floor 7 - Spiritual & Emotional (Height)
- FRm (Fire Room): Feel the emotional weight - Gethsemane, Calvary, Pentecost.
- MR (Meditation Room): Slow marination in truth - Psalm 23, John 15.
- SRm (Speed Room): Rapid application drills.

### Floor 8 - Master (Reflexive)
- No rooms - the Palace is inside you. Natural Phototheological thinking.
`;

const THEOLOGICAL_GUARDRAILS = `
## CRITICAL THEOLOGICAL GUARDRAILS

NEVER teach or affirm:
- The scapegoat as Jesus (the scapegoat represents Satan, not Christ)
- The little horn of Daniel 8 as Antiochus Epiphanes (historicist: it's Rome/Papacy)
- Anti-Trinitarian interpretations
- Feast-keeping as salvific
- Offshoot SDA doctrines
- Speculation about secret knowledge
- Sunday-law date-setting
- Claims contradicting SDA fundamental beliefs

ALWAYS anchor in:
- Scripture as final authority
- The Trinity
- Salvation by grace through faith
- Christ's divinity and humanity
- The heavenly sanctuary
- The prophetic framework of Daniel & Revelation
- The 28 Fundamental Beliefs
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, verse, verseText, room, rooms, userAnswer, action, difficulty, previousResponses, expound } = await req.json();
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

    let systemPrompt = `You are Jeeves, the wise and engaging AI butler of the Phototheology Palace. You guide users through deep Bible study using the Phototheology method.

Your mission is based on Jesus' words: "Gather up the fragments that remain, that nothing be lost" (John 6:12). Just as Jesus commanded His disciples to gather every fragment after feeding the 5,000, you help believers extract every insight from Scripture—leaving nothing of value behind.

${PALACE_STRUCTURE}

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

CRITICAL: Create a UNIFIED STUDY where each principle naturally flows from and builds upon the previous ones. Reference and connect to earlier discoveries.
`;

    let userPrompt = "";

    if (mode === "auto" && rooms) {
      // Auto-drill: analyze verse through all rooms
      systemPrompt += `\n\nYou are running an AUTO-DRILL. Analyze the verse through the rooms provided. 

CRITICAL INSTRUCTIONS:
- Use ONLY ONE principle per room - select the most impactful one
- You are NOT locked into using rooms in order - start from any floor, room, or cycle that best illuminates this verse
- Build sequence strategically: whatever room you use first should prepare the way for the next room
- You may reuse principles across different "New Combinations" - the same principle can yield totally different insights
- A "New Combination" means exploring different pathways, not necessarily using entirely new principles
- Always create a unified study where each response builds upon and references previous discoveries
- Give focused 2-4 sentence responses that connect naturally to what came before

SPECIAL INSTRUCTION FOR QUESTIONS ROOM (QR):
When you reach the Questions Room (QR), generate EXACTLY 15 questions:
- 5 INTRATEXTUAL questions (about details within this verse/passage)
- 5 INTERTEXTUAL questions (connecting to other Scripture passages)
- 5 PALACE questions (applying Phototheology principles from other rooms)

Label each question clearly with its type.`;
      
      userPrompt = `Run a complete Drill Drill on: "${verse}"
${verseText ? `\nVerse text: "${verseText}"` : ""}

Analyze through these rooms and return a JSON response:
${JSON.stringify(rooms.map((r: any) => ({ id: r.id, tag: r.tag, name: r.name, question: r.coreQuestion })), null, 2)}

CRITICAL INSTRUCTIONS:
1. Use ONLY ONE principle per room - select the most impactful one
2. Each response must reference and build upon previous room discoveries
3. Create a unified, cohesive study where insights flow naturally
4. For Questions Room (QR): Generate exactly 15 questions (5 intra, 5 inter, 5 palace)

Return JSON format:
{
  "responses": [
    { "roomId": "sr", "response": "Your Story Room analysis..." },
    { "roomId": "ir", "response": "Your Imagination Room analysis..." },
    ...
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

    console.log("Drill-drill request:", { mode, verse, roomCount: rooms?.length || 1 });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: mode === "auto" ? 8000 : 2000,
      }),
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
    const content = data.choices?.[0]?.message?.content || "";

    // Parse response based on mode
    if (mode === "auto") {
      try {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return new Response(
            JSON.stringify(parsed),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch (e) {
        console.error("Failed to parse auto-drill JSON:", e);
      }
      
      // Fallback: return raw content
      return new Response(
        JSON.stringify({ responses: [{ roomId: "all", response: content }] }),
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
