import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_MODEL = "google/gemini-3-flash-preview";

const requiredRoomsForMode = (mode: string): number => {
  switch (mode) {
    case "beginner":
      return 8;
    case "preacher":
      return 12;
    case "research":
      return 20;
    case "scholar":
    default:
      return 15;
  }
};

const MIND_MAP_SYSTEM_PROMPT = `
You are Jeeves, analyzing text through the Phototheology Palace framework for mind map visualization.

YOUR TASK: Analyze the provided text and map it comprehensively to ALL applicable rooms in the 8-floor Palace structure + the Sanctuary. Be thorough—include every room where a meaningful connection exists.

THE 8-FLOOR PALACE STRUCTURE (use exact IDs shown):

FLOOR 1 - FURNISHING (Memory & Visualization):
- sr (Story Room): Break down narratives into memorable beats/scenes
- ir (Imagination Room): Sensory immersion - what do you see, hear, feel, smell, taste?
- 24fps (24FPS Room): One memorable image per chapter for instant recall
- br (Bible Rendered): Compress into symbolic glyphs for overview
- tr (Translation Room): Convert words into pictures, icons, visual representations
- gr (Gems Room): Combine 2-4 unrelated texts to discover rare truths

FLOOR 2 - INVESTIGATION (Detective Work):
- or (Observation Room): List 20+ factual observations - what is happening?
- dc (Def-Com Room): Define key terms in original language, consult commentaries
- st (Symbols/Types Room): Track symbols through Scripture - Scope, Sign, Christ-locus
- qr (Questions Room): Generate 50+ questions (Intra, Inter, Palace)
- qa (Q&A Chains Room): Answer questions with 2-4 Scripture cross-references

FLOOR 3 - FREESTYLE (Life Integration):
- nf (Nature Freestyle): Natural object → Biblical truth → Practical lesson
- pf (Personal Freestyle): Life events paralleling biblical narratives
- bf (Bible Freestyle): Connect any two verses - find the family link
- hf (History Freestyle): Secular events illuminating Scripture
- lr (Listening Room): Capture biblical principles from sermons/conversations

FLOOR 4 - NEXT LEVEL (Christ-Centered Structure):
- cr (Concentration Room): Prophet/Priest/King - which office is Christ exercising?
- dr (Dimensions Room): Literal, Christological, Personal, Ecclesiological, Eschatological
- c6 (Connect-6 Room): Link across 6 genres - Prophecy, Parable, Epistle, History, Gospel, Poetry
- trm (Theme Room): Which theological span? Sanctuary/Life of Christ/Great Controversy/Time-Prophecy/Gospel/Heaven
- tz (Time Zone Room): Heaven-Past, Heaven-Present, Heaven-Future, Earth-Past, Earth-Present, Earth-Future
- prm (Patterns Room): Recurring motifs appearing 3+ times across Scripture
- p|| (Parallels Room): Two mirrored events - what echoes and what escalates?
- frt (Fruit Room): What fruit does this interpretation produce?

FLOOR 5 - VISION (Prophecy & Types):
- bl (Blue Room - Sanctuary): Map to sanctuary articles/services - which element applies?
- pr (Prophecy Room): Daniel-Revelation historicist timeline placement
- 3a (Three Angels Room): End-time message connections
- fe (Feasts Room): Levitical feast typology and fulfillment

FLOOR 6 - THREE HEAVENS (Cycles & Horizons):
- cec (Christ Every Chapter Room): Where is Christ in this passage? Explicit or typological?
- r66 (Room 66): Book-level themes across all 66 books
- 123h (Three Heavens): First/Second/Third heaven contexts
- cycles (Cycles Room): 8 redemptive cycles (@Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re)
- jr (Juice Room): Concentrated spiritual essence extraction
- math (Math Room): Biblical numerology patterns (7, 12, 40, etc.)

FLOOR 7 - SPIRITUAL (Transformation):
- frm (Fire Room): Purification, testing, Holy Spirit fire
- mr (Meditation Room): Deep contemplative engagement
- srm (Sanctuary Room): Personal sanctuary experience

FLOOR 8 - MASTER (Integration):
- infinity (Infinity Room): Infinite connections, mastery synthesis
- freestyle (Freestyle Master): Advanced free-form study

SANCTUARY STRUCTURE:
- Camp (outer world)
- Courtyard: Altar of Burnt Offering (sacrifice/blood), Bronze Laver (cleansing/washing)
- Holy Place: Golden Lampstand (light/Spirit), Table of Showbread (provision/Word), Altar of Incense (prayer/intercession)
- Most Holy Place: Ark of the Covenant (law/covenant), Mercy Seat (grace/propitiation), Cherubim (worship/presence)

MODE ADJUSTMENTS:
- BEGINNER: 5-8 rooms, simplified language, clear patterns only
- SCHOLAR: 10-20+ rooms, deep cross-references, scholarly evidence
- PREACHER: 8-15 rooms, focus on teaching hooks, illustrations, sermon applications
- RESEARCH: Exhaustive analysis, all applicable rooms, academic rigor

ANALYSIS REQUIREMENTS (for EACH applicable room):
1. PRINCIPLE: Identify specific patterns/truths from the text (2-3 per room)
2. EVIDENCE: Direct quotes or paraphrases supporting the principle
3. INSIGHT: The "so what" - why this matters theologically
4. APPLICATION: Practical, actionable takeaway for the reader's life
5. VISUAL HOOK: A concrete, memorable image (not abstractions)
6. CONFIDENCE: 0-100 score based on how clearly text demonstrates this

IMPORTANT - DO NOT SKIP ROOMS:
- Analyze at least 8-15 rooms for beginner, 15-25 for scholar/research
- Include rooms from MULTIPLE floors - not just Floor 1-2
- Always attempt Christ Every Chapter (cec), Dimensions (dr), and Fruit (frt) rooms
- Always check sanctuary connections (bl)

MANDATORY RULES:
- Return ONLY valid JSON
- Use EXACT room IDs as shown (lowercase: sr, ir, 24fps, or, cec, etc.)
- Include PRACTICAL APPLICATIONS for each principle
- Be generous in finding connections - err on the side of inclusion
- Visual hooks must be concrete images, not abstract concepts
- Scripture quotations should be KJV

RESPONSE FORMAT (JSON only, no markdown):
{
  "overallTheme": "1-2 sentence summary of how this text maps to the Palace",
  "relevantFloors": [1, 2, 4, 5, 6],
  "roomAnalysis": {
    "sr": {
      "applicable": true,
      "principles": [{
        "id": "sr-1",
        "content": "Brief statement of the principle/pattern found",
        "evidence": ["Quote 1 from text", "Quote 2 from text"],
        "insight": "Why this matters - the deeper theological meaning",
        "application": "Practical takeaway: How should this change how you live, pray, or think?",
        "visualHook": "A concrete, memorable image (e.g., 'a shepherd leaving 99 sheep in the open field')",
        "confidence": 85,
        "scriptures": ["John 3:16"]
      }]
    },
    "cec": {
      "applicable": true,
      "principles": [{
        "id": "cec-1",
        "content": "How Christ appears in this text (explicitly or typologically)",
        "evidence": ["Textual evidence pointing to Christ"],
        "insight": "The Christological significance",
        "application": "How this Christ-connection should impact your worship and daily walk",
        "visualHook": "Christ-centered image",
        "confidence": 90,
        "scriptures": ["Colossians 1:17"]
      }]
    },
    "dr": {
      "applicable": true,
      "principles": [{
        "id": "dr-1",
        "content": "Multi-dimensional reading of the text",
        "evidence": ["Supporting text"],
        "insight": "How each dimension (Literal, Christ, Personal, Church, Eschatological) opens new meaning",
        "application": "Specific application for your life dimension",
        "visualHook": "A prism splitting light into spectrum",
        "confidence": 80,
        "scriptures": []
      }]
    }
  },
  "sanctuaryAnalysis": {
    "altar-of-burnt-offering": {
      "applicable": true,
      "insights": [{
        "id": "altar-1",
        "content": "Connection to sacrifice theme",
        "evidence": ["Quote from text"],
        "insight": "How this points to Christ's sacrifice",
        "application": "How should this shape your understanding of Christ's atonement?",
        "visualHook": "Flames consuming offering on bronze altar",
        "confidence": 90
      }]
    }
  },
  "crossConnections": [{
    "from": "sr",
    "to": "cec",
    "type": "typological",
    "description": "The narrative arc foreshadows Christ's redemptive work"
  }]
}
`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, mode = "scholar" } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Truncate very long texts
    const truncatedText = text.length > 8000 ? text.substring(0, 8000) + "..." : text;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const modeInstructions: Record<string, string> = {
      beginner:
        "MODE: BEGINNER - Use simple language, but still map to at least 8 rooms across multiple floors.",
      scholar:
        "MODE: SCHOLAR - Map to at least 15 rooms across multiple floors with solid cross-references.",
      preacher:
        "MODE: PREACHER - Map to at least 12 rooms, prioritize hooks/illustrations and clear applications.",
      research:
        "MODE: RESEARCH - Map to 20+ rooms with exhaustive, evidence-driven connections.",
    };
    const modeInstruction = modeInstructions[String(mode)] || modeInstructions.scholar;

    const requiredRooms = requiredRoomsForMode(String(mode));

    const strictOutputInstruction = [
      `STRICT OUTPUT RULES:`,
      `- Return ONLY valid JSON (no markdown).`,
      `- roomAnalysis MUST contain at least ${requiredRooms} room IDs (keys).`,
      `- sanctuaryAnalysis MUST contain at least 1 sanctuary element (key).`,
      `- For each included room: applicable=true and include 1-3 principles with application + visualHook + KJV cross-refs.`,
      `- Do not return empty objects for roomAnalysis or sanctuaryAnalysis.`,
    ].join("\n");

    const callGateway = async (extraUserInstruction?: string) => {
      const userPrompt = [
        `Analyze this text and map it to the Phototheology Palace.`,
        extraUserInstruction ? `\n${extraUserInstruction}` : "",
        `\nTEXT:\n${truncatedText}`,
      ].join("\n");

      return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: [
            {
              role: "system",
              content: [MIND_MAP_SYSTEM_PROMPT, modeInstruction, strictOutputInstruction].join("\n\n"),
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          // Some models honor this OpenAI field; harmless if ignored.
          response_format: { type: "json_object" },
          temperature: 0.25,
          max_tokens: 8192,
        }),
      });
    };

    const response = await callGateway();

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits are paused. Please add more credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const parseGatewayJson = async (resp: Response) => {
      const aiResponse = await resp.json();
      const message = aiResponse.choices?.[0]?.message;
      const content = message?.content || "";

      // Parse JSON from response (handle potential markdown wrapping)
      let parsed;
      let jsonStr = content;
      if (jsonStr.includes("```json")) {
        jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (jsonStr.includes("```")) {
        jsonStr = jsonStr.replace(/```\n?/g, "");
      }
      parsed = JSON.parse(jsonStr.trim());
      return parsed;
    };

    let analysis: any;
    try {
      analysis = await parseGatewayJson(response);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      analysis = null;
    }

    const roomCount = analysis?.roomAnalysis ? Object.keys(analysis.roomAnalysis).length : 0;
    const sanctuaryCount = analysis?.sanctuaryAnalysis ? Object.keys(analysis.sanctuaryAnalysis).length : 0;

    // One retry if the model returns an incomplete/empty map.
    if (!analysis || roomCount < requiredRooms || sanctuaryCount < 1) {
      try {
        const retry = await callGateway(
          `Your last output was incomplete. Fix it now: roomAnalysis must have at least ${requiredRooms} room IDs and sanctuaryAnalysis must have at least 1 key. Return ONLY JSON.`
        );
        if (retry.ok) {
          analysis = await parseGatewayJson(retry);
        }
      } catch (retryErr) {
        console.error("Retry parse error:", retryErr);
      }
    }

    // Final fallback structure (never crash the client)
    if (!analysis || !analysis.relevantFloors || !analysis.roomAnalysis) {
      analysis = {
        overallTheme: "Analysis completed but response format was unexpected",
        relevantFloors: [1, 2],
        roomAnalysis: {
          or: {
            applicable: true,
            principles: [
              {
                id: "or-1",
                content: "The text contains observable elements that merit further study",
                evidence: [text.substring(0, 100) + "..."],
                insight: "Careful observation is the first step in understanding Scripture",
                application: "Slow down and list what the text actually says before interpreting it.",
                visualHook: "A magnifying glass hovering over an open scroll",
                confidence: 70,
                scriptures: ["Psalm 119:18"],
              },
            ],
          },
        },
        sanctuaryAnalysis: {
          "altar-of-burnt-offering": {
            applicable: false,
            insights: [
              {
                id: "altar-0",
                content: "Placeholder sanctuary slot",
                evidence: ["(placeholder)"],
                insight: "(placeholder)",
                application: "(placeholder)",
                visualHook: "(placeholder)",
                confidence: 1,
              },
            ],
          },
        },
        crossConnections: [],
      };
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Mind map analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : "Analysis failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
