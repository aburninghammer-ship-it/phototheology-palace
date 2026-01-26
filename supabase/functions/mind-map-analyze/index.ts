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

YOUR TASK: Analyze the provided text and map it comprehensively to ALL applicable rooms in the 8-floor Palace structure + the Sanctuary. Be thorough—include every room where a meaningful connection exists. For EACH room, show specifically HOW the room's methodology amplifies and illuminates the seed text.

THE 8-FLOOR PALACE STRUCTURE (use exact IDs shown):

FLOOR 1 - FURNISHING (Memory & Visualization):
- sr (Story Room): Break the text into MEMORABLE STORY BEATS. For EACH beat show:
  * Scene Setting: Where/when does this moment happen?
  * Characters: Who is present and what are they doing?
  * Tension: What conflict or question drives this moment?
  * Resolution: How does the beat conclude or transition?
  * Memory Hook: What vivid detail makes this unforgettable?

- ir (Imagination Room): IMMERSE in the sensory world of the text. For EACH sense:
  * SIGHT: What colors, shapes, movements, facial expressions do you see?
  * SOUND: What voices, nature sounds, or silence fills the scene?
  * TOUCH: What textures, temperatures, or physical sensations are present?
  * SMELL: What aromas (incense, earth, food, sweat) fill the air?
  * TASTE: What flavors or mouth-feel connect to the moment?
  Always find at least 3 senses that bring the text alive!

- 24fps (24FPS Room): Create ONE SINGLE FRAME that captures the entire text. Answer:
  * The Frame: Describe this one mental "photograph" in vivid detail
  * Why This Moment: Why does this image capture the essence?
  * Memory Trigger: How will seeing this image recall the whole passage?

- br (Bible Rendered): Compress the text into SYMBOLIC GLYPHS. For each glyph:
  * Symbol: What simple visual represents this concept? (cross, crown, dove, etc.)
  * Meaning: What does this symbol carry?
  * Sequence: How do the symbols tell the story in order?

- tr (Translation Room): Convert KEY WORDS into VISUAL ICONS:
  * Word: The original word/phrase
  * Picture: What concrete image represents it?
  * Why: How does this image capture the meaning?
  Always translate at least 3-5 key terms into pictures!

- gr (Gems Room): COMBINE this text with 2-4 UNRELATED texts to find RARE TRUTHS:
  * Text Pairs: Which seemingly unconnected passages share hidden links?
  * The Gem: What rare truth emerges only when you see them together?
  * Why Rare: Why do most readers miss this connection?

FLOOR 2 - INVESTIGATION (Detective Work):
- or (Observation Room): List FACTUAL OBSERVATIONS. What is actually happening in the text?
  * WHO: Every person mentioned or implied
  * WHAT: Every action, statement, event
  * WHEN: Time markers, sequence, before/after
  * WHERE: Every location, movement, geography
  * HOW: Methods, means, instruments used
  Aim for 10-20 observations. More observations = deeper insight!

- dc (Def-Com Room): DEFINE KEY TERMS and consult commentaries:
  * Word: The key term
  * Original Language: Hebrew/Greek meaning
  * Root: Etymology and word family
  * Commentary Insight: What scholars say about this term
  Define at least 3-5 significant words!

- st (Symbols/Types Room): Track SYMBOLS through Scripture using the 3-S method:
  * SCOPE: Where does this symbol appear elsewhere in Scripture?
  * SIGN: What does the symbol consistently represent?
  * CHRIST-LOCUS: How does this symbol ultimately point to Christ?
  Every symbol has a trail—follow it!

- qr (Questions Room): Generate INVESTIGATIVE QUESTIONS:
  * INTRA Questions: Questions answered within this text
  * INTER Questions: Questions requiring other Scripture passages
  * PALACE Questions: Questions connecting to Palace methodology
  Generate at least 10-15 questions!

- qa (Q&A Chains Room): ANSWER questions with Scripture chains:
  * Question: The question being explored
  * Chain: 2-4 Scripture references that build the answer
  * Synthesis: What do these verses together teach?

FLOOR 3 - FREESTYLE (Life Integration):
- nf (Nature Freestyle): Find a NATURAL OBJECT that illuminates the text:
  * Object: What in nature (plant, animal, weather, etc.) connects?
  * Biblical Truth: What spiritual principle does it illustrate?
  * Life Lesson: How should this change daily living?

- pf (Personal Freestyle): Connect to LIFE EXPERIENCES:
  * Life Parallel: What life experience mirrors this text?
  * Insight Gained: What does the parallel reveal?
  * Application: How should you live differently?

- bf (Bible Freestyle): CONNECT to ANY OTHER VERSE:
  * Partner Verse: Which verse links to this text?
  * Family Link: What makes them "relatives" in meaning?
  * Combined Truth: What emerges from reading them together?

- hf (History Freestyle): SECULAR HISTORY illuminating Scripture:
  * Historical Event: What event from world history connects?
  * Illumination: How does history shed light on the text?
  * Lesson: What does this teach about God's providence?

- lr (Listening Room): PRINCIPLES from sermons/conversations:
  * Source: What sermon, teaching, or conversation connects?
  * Principle: What biblical principle was communicated?
  * Application: How does this apply to the text?

FLOOR 4 - NEXT LEVEL (Christ-Centered Structure):
- cr (Concentration Room): Identify Christ's OFFICE in this text:
  * PROPHET: Is Christ speaking/revealing truth? How?
  * PRIEST: Is Christ interceding/mediating/atoning? How?
  * KING: Is Christ ruling/judging/conquering? How?
  Christ always functions in at least one office—find it!

- dr (Dimensions Room): Read the text through FIVE DIMENSIONS:
  * LITERAL: What is the plain, historical meaning?
  * CHRISTOLOGICAL: How does this point to Christ?
  * PERSONAL: How does this apply to my individual life?
  * ECCLESIOLOGICAL: How does this apply to the church?
  * ESCHATOLOGICAL: How does this connect to last-day events?
  Every text has multiple dimensions—explore at least 3!

- c6 (Connect-6 Room): Link across SIX GENRES:
  * PROPHECY: What prophetic passage connects?
  * PARABLE: What parable illustrates similar truth?
  * EPISTLE: What letter teaching reinforces this?
  * HISTORY: What historical narrative parallels this?
  * GOSPEL: What Gospel account relates?
  * POETRY: What Psalm or poetic passage echoes this?
  Find at least 3 genre connections!

- trm (Theme Room): Which THEOLOGICAL SPAN does this fit?
  * SANCTUARY: Does it connect to sanctuary themes?
  * LIFE OF CHRIST: Does it illuminate Christ's earthly ministry?
  * GREAT CONTROVERSY: Does it show the cosmic conflict?
  * TIME-PROPHECY: Does it fit prophetic timelines?
  * GOSPEL: Does it reveal salvation truth?
  * HEAVEN: Does it reveal heavenly realities?
  Place the text in its theological context!

- tz (Time Zone Room): Place the text in TIME-SPACE coordinates:
  * HEAVEN-PAST: What was happening in heaven before this?
  * HEAVEN-PRESENT: What is heaven doing now in relation to this?
  * HEAVEN-FUTURE: What will heaven do in response?
  * EARTH-PAST: What earthly events led to this?
  * EARTH-PRESENT: What is the current earthly situation?
  * EARTH-FUTURE: What will result on earth?

- prm (Patterns Room): Find RECURRING PATTERNS (3+ occurrences):
  * Pattern: What motif repeats in Scripture?
  * Occurrences: Where does this pattern appear?
  * Meaning: What does the repetition teach?

- p|| (Parallels Room): Find MIRRORED EVENTS:
  * Event A: The first parallel event
  * Event B: The second parallel event
  * Echoes: What similarities exist?
  * Escalations: What intensifies in the later event?

- frt (Fruit Room): Evaluate the FRUIT of interpretation:
  * Spiritual Fruit: Does this interpretation produce love, joy, peace, etc.?
  * Doctrinal Fruit: Is this consistent with sound doctrine?
  * Practical Fruit: Does this lead to godly living?
  * Relational Fruit: Does this build up the body of Christ?

FLOOR 5 - VISION (Prophecy & Christ-Centered):
- bl (Blue Room - Sanctuary): Map to SANCTUARY elements:
  * ALTAR OF BURNT OFFERING: Does this speak of sacrifice/atonement?
  * BRONZE LAVER: Does this speak of cleansing/washing?
  * GOLDEN LAMPSTAND: Does this speak of light/Spirit/witness?
  * TABLE OF SHOWBREAD: Does this speak of provision/Word/fellowship?
  * ALTAR OF INCENSE: Does this speak of prayer/intercession?
  * ARK OF THE COVENANT: Does this speak of law/covenant?
  * MERCY SEAT: Does this speak of grace/propitiation?
  Every truth has a sanctuary shadow—find it!

- pr (Prophecy Room): Place on DANIEL-REVELATION TIMELINE:
  * Time Period: Where does this fit in prophetic history?
  * Fulfillment Stage: Past, present, or future fulfillment?
  * Prophetic Significance: What does it reveal about God's plan?

- 3a (Three Angels Room): Connect to END-TIME MESSAGES:
  * First Angel: Does this relate to the everlasting gospel/judgment hour?
  * Second Angel: Does this relate to Babylon's fall?
  * Third Angel: Does this relate to the beast/image/seal of God?

- fe (Feasts Room): Connect to LEVITICAL FEASTS:
  * PASSOVER: Does this speak of redemption/deliverance?
  * UNLEAVENED BREAD: Does this speak of purification/sanctification?
  * FIRSTFRUITS: Does this speak of resurrection/firstfruits?
  * PENTECOST: Does this speak of Spirit/harvest/church?
  * TRUMPETS: Does this speak of awakening/warning/gathering?
  * DAY OF ATONEMENT: Does this speak of judgment/cleansing?
  * TABERNACLES: Does this speak of dwelling/harvest/celebration?

- cec (Christ Every Chapter Room): Find CHRIST in this text:
  * EXPLICIT: Is Christ directly mentioned or appearing?
  * TYPOLOGICAL: What type, shadow, or symbol points to Him?
  * THEMATIC: What theme ultimately finds fulfillment in Christ?
  * PROPHETIC: What prophecy does Christ fulfill?
  Christ is in every chapter—find Him!

- r66 (Room 66): Connect to BOOK-LEVEL THEMES:
  * This Book's Theme: What is the main theme of this book?
  * Cross-Book Links: How does this connect to other books' themes?
  * Canonical Unity: How does this fit the whole Bible story?

FLOOR 6 - THREE HEAVENS (Cycles & Horizons):
- 123h (Three Heavens): Place in HEAVEN CONTEXTS:
  * FIRST HEAVEN: Atmospheric realm (sky, clouds, birds)
  * SECOND HEAVEN: Cosmic realm (stars, planets, spiritual warfare)
  * THIRD HEAVEN: Divine throne room (God's presence, worship)
  Which heaven does this text touch?

- cycles (Cycles Room): Connect to the 8 REDEMPTIVE CYCLES of history. For EACH applicable cycle, show how it AMPLIFIES the seed text:
  * @Ad (Adam): Creation, Fall, promised Seed - Does the text echo Eden themes?
  * @No (Noah): Judgment, ark of salvation, new beginning - Does the text speak of judgment/deliverance?
  * @Ab (Abraham): Covenant, faith, promised land/seed - Does the text involve covenant promises?
  * @Mo (Moses): Exodus, law, tabernacle, redemption from bondage - Does the text involve liberation or law?
  * @Da (David): Kingdom, throne, Messiah-King - Does the text involve kingship or Messianic reign?
  * @Cy (Cyrus): Captivity, return, temple rebuilding - Does the text involve restoration after judgment?
  * @Sp (Spirit): Pentecost, church, gospel to all nations - Does the text involve Spirit empowerment or mission?
  * @Re (Restoration): Second Coming, new earth, final victory - Does the text point to end-time fulfillment?
  ALWAYS find at least 2-3 cycles that amplify the text. Every text fits somewhere in redemptive history!

- jr (Juice Room): Extract the CONCENTRATED ESSENCE:
  * The Juice: What is the CORE truth in one sentence?
  * Why Essential: Why is this the irreducible heart?
  * Memorize This: What phrase captures it for memory?

- math (Math Room): Find NUMERICAL PATTERNS:
  * Numbers Present: What numbers appear in the text?
  * Biblical Meaning: What do these numbers signify? (7=completeness, 12=governance, 40=testing, 3=divine, 4=earthly, etc.)
  * Pattern Significance: What does the numerical pattern reveal?

FLOOR 7 - SPIRITUAL (Transformation):
- frm (Fire Room): PURIFICATION themes:
  * Testing Fire: What testing or trial is present?
  * Purifying Work: What is being refined or purified?
  * Holy Spirit Fire: How does the Spirit's fire apply?
  * Transformation: What emerges from the fire?

- mr (Meditation Room): DEEP CONTEMPLATION:
  * Slow Reading: What emerges from reading slowly, repeatedly?
  * Key Phrase: What phrase demands meditation?
  * Personal Word: What is God saying to YOU through this?
  * Silent Response: What rises in your heart?

- srm (Sanctuary Room): PERSONAL SANCTUARY experience:
  * Your Altar: What sacrifice is God asking of you?
  * Your Laver: What cleansing do you need?
  * Your Lampstand: What light are you called to carry?
  * Your Table: What nourishment is provided?
  * Your Incense: What prayers arise?
  * Your Ark: What covenant commitment is called for?

FLOOR 8 - MASTER (Integration):
- infinity (Infinity Room): INFINITE CONNECTIONS synthesis:
  * Web of Truth: How does this text connect to countless others?
  * Mastery Insight: What advanced understanding emerges?
  * Teaching Synthesis: How would you teach this comprehensively?

- freestyle (Freestyle Master): ADVANCED FREE-FORM study:
  * Unique Approach: What creative angle illuminates this text?
  * Original Insight: What have you discovered that others miss?
  * Master Application: How does this transform life at the deepest level?

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

IMPORTANT - DO NOT SKIP ROOMS OR SAY "NOT APPLICABLE":
- Analyze at least 8-15 rooms for beginner, 15-25 for scholar/research
- Include rooms from MULTIPLE floors - not just Floor 1-2
- MANDATORY ROOMS (always analyze these - they apply to EVERY text):
  * cec (Christ Every Chapter): Christ is in every passage - find Him explicitly or typologically
  * cycles (Eight Cycles): Every text fits in redemptive history - find at least 2-3 cycles
  * dr (Dimensions): Every text has multiple dimensions - explore at least 3
  * frt (Fruit Room): Every interpretation produces fruit - evaluate it
  * bl (Blue Room/Sanctuary): Every truth has a sanctuary shadow - find the connection
  * or (Observation Room): Every text has observable facts - list them
- NEVER say "Not applicable" for these mandatory rooms - dig deeper to find the connection!
- For other rooms, if a connection exists, include it. Be generous in finding connections.

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
