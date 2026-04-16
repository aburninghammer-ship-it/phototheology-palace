import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { getContentBehavioralEngine } from "../_shared/content-behavioral-engine.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

// Canonical room code → full name mapping to prevent AI hallucinating wrong names
const CANONICAL_ROOMS: Record<string, string> = {
  "SR": "Story Room", "IR": "Imagination Room", "24FPS": "24 Frames Per Second", "24F": "24 Frames Per Second",
  "BR": "Bible Rendered", "TR": "Translation Room", "GR": "Gems Room",
  "OR": "Observation Room", "DC": "Def-Com Room", "ST": "Symbols/Types Room",
  "QR": "Questions Room", "QA": "Q&A Chains Room",
  "NF": "Nature Freestyle", "PF": "Personal Freestyle", "BF": "Bible Freestyle",
  "HF": "History Freestyle", "LR": "Listening Room",
  "CR": "Concentration Room", "DR": "Dimensions Room", "C6": "Connect-6 Room",
  "TRm": "Theme Room", "TZ": "Time Zone Room", "PRm": "Patterns Room",
  "P||": "Parallels Room", "P‖": "Parallels Room", "FRt": "Fruit Room",
  "CEC": "Christ in Every Chapter", "R66": "Room 66",
  "BL": "Blue/Sanctuary Room", "PR": "Prophecy Room", "3A": "Three Angels Room",
  "FE": "Feasts Room", "MATH": "Mathematics Room",
  "123H": "Three Heavens Room", "1H": "First Heaven", "2H": "Second Heaven", "3H": "Third Heaven",
  "JR": "Juice Room",
  "FRm": "Fire Room", "MR": "Meditation Room", "SRm": "Speed Room",
};

// Extract room code from AI output like "CEC (Christ-Exposed Covenant)" → "CEC"
function extractRoomCode(roomStr: string): string | null {
  const match = roomStr.match(/^([A-Za-z0-9@‖|]+)/);
  return match ? match[1] : null;
}

// Normalize a room string to use canonical name
function normalizeRoomName(roomStr: string): string {
  const code = extractRoomCode(roomStr);
  if (code && CANONICAL_ROOMS[code]) {
    return `${code} (${CANONICAL_ROOMS[code]})`;
  }
  return roomStr; // Return as-is if not recognized
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, verse, verseText } = await req.json();

    if (!book || !chapter || !verse || !verseText) {
      throw new Error('Missing required parameters');
    }

    // Add randomization seed to force AI to vary responses
    const randomSeed = Math.random().toString(36).substring(7);
    
    const prompt = `[ANALYSIS ID: ${randomSeed}] Analyze ${book} ${chapter}:${verse} through the COMPLETE 37-Room Phototheology Palace:

Verse text: "${verseText}"

🏛️ MANDATORY: UTILIZE ALL 37 PALACE ROOMS AS ANALYTICAL LENSES 🏛️

You MUST analyze this verse through multiple rooms across all 8 floors. Each verse should touch AT LEAST 8-12 different rooms.

═══════════════════════════════════════════════════════════════
FLOOR 1: FURNISHING (Memory & Visualization)
═══════════════════════════════════════════════════════════════
🔹 SR (Story Room): What narrative beats/sequence does this verse contain or reference?
🔹 IR (Imagination Room): What sensory details can be visualized (sights, sounds, textures)?
🔹 24FPS (24 Frames Per Second): What single memorable image represents this verse?
🔹 BR (Bible Rendered): How does this fit in the macro 24-chapter frame?
🔹 TR (Translation Room): What abstract concepts need concrete visual translation?
🔹 GR (Gems Room): What rare truth emerges when combined with other texts?

═══════════════════════════════════════════════════════════════
FLOOR 2: INVESTIGATION (Detective Work)
═══════════════════════════════════════════════════════════════
🔹 OR (Observation Room): What grammar, repetitions, contrasts are present?
🔹 DC (Def-Com Room): What key terms need lexical/cultural definition?
   • MUST include Hebrew/Greek word studies with Strong's numbers
   • MUST cite standard commentaries (Gill, Clarke, Matthew Henry, Barnes, etc.)
🔹 ST (Symbols/Types Room): What symbols appear and what is their Christ-fulfillment?
🔹 QR (Questions Room): What questions must be asked within and across this text?
🔹 QA (Q&A Chains Room): What Scripture answers the questions this verse raises?

═══════════════════════════════════════════════════════════════
FLOOR 3: FREESTYLE (Time & Daily Integration)
═══════════════════════════════════════════════════════════════
🔹 NF (Nature Freestyle): What natural objects/processes illustrate this truth?
🔹 PF (Personal Freestyle): How does this connect to personal testimony?
🔹 BF (Bible Freestyle): What are this verse's "genetic relatives"?
🔹 HF (History/Social Freestyle): How does this verse frame current events?
🔹 LR (Listening Room): What sermons/quotes echo this verse?

═══════════════════════════════════════════════════════════════
FLOOR 4: NEXT LEVEL (Christ-Centered Structure)
═══════════════════════════════════════════════════════════════
🔹 CR (Concentration Room): Where is Jesus? (Office/Title, Act, Benefit, Horizon)
🔹 DR (Dimensions Room): Use LITERAL dimension plus ONE other dimension
   • 1D = Literal (what the text says plainly, historical/grammatical) - ALWAYS include this
   • 2D = Christ (how does this text reveal Christ? His person, work, or character)
   • 3D = Me (how it relates to me individually, personal application)
   • 4D = Church (how it relates to the church, corporate body, community)
   • 5D = Heaven (how it relates to heaven, eternal realities, new creation)
   CRITICAL: Do NOT use all five dimensions - choose literal + ONE other
🔹 C6 (Connect-6 Room): How does this text connect across genres? Which genres illuminate it? Can you link it to Prophecy/Parable/Epistle/History/Gospel/Poetry?
🔹 TRm (Theme Room): Which structural span? (Sanctuary/Life of Christ/Great Controversy/Time-Prophecy/Gospel/Heaven)
🔹 TZ (Time Zone): Earth-Past/Now/Future OR Heaven-Past/Now/Future
🔹 PRm (Patterns Room): What recurring motif appears across Scripture?
🔹 P|| (Parallels Room): What event/action mirrors this one?
🔹 FRt (Fruit Room): What character fruit does this reading produce?

═══════════════════════════════════════════════════════════════
FLOOR 5: VISION (Sanctuary, Prophecy & Feasts)
═══════════════════════════════════════════════════════════════
🔹 BL (Blue/Sanctuary Room): Which sanctuary article/service?
   • Gate, Altar, Laver, Lampstand, Table, Incense, Veil, Ark
   • Daily service or Day of Atonement
   ⚠️ CRITICAL SANCTUARY TWO-PHASE MINISTRY:
   - Christ entered the HOLY PLACE (first apartment) at His ASCENSION in 31 AD
   - Christ entered the MOST HOLY PLACE (second apartment) in 1844
   - NEVER say Christ went to the Most Holy Place at resurrection/ascension!
   - Hebrews contrasts EARTHLY vs HEAVENLY sanctuary, NOT Holy vs Most Holy Place
🔹 PR (Prophecy Room): Daniel-Revelation symbols, timelines, parallel visions
🔹 3A (Three Angels Room): How does this proclaim everlasting gospel/judgment/Babylon/Beast warning?
🔹 FE (Feasts Room): Which feast does this fulfill/foreshadow?
   • Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles
   ⚠️ CRITICAL FEAST TYPOLOGY: Spring feasts (Passover, Unleavened Bread, Firstfruits, Pentecost) = Christ's FIRST ADVENT
   - Passover = Christ's DEATH (NOT Day of Atonement!)
   - Unleavened Bread = Christ's BURIAL
   - Firstfruits = Christ's RESURRECTION
   - Pentecost = Holy Spirit outpouring
   Fall feasts (Trumpets, Atonement, Tabernacles) = Christ's SECOND ADVENT ministry
   - Day of Atonement = 1844 heavenly ministry, NOT the cross!
   NEVER equate Jesus's death/resurrection with Day of Atonement - that is PASSOVER/FIRSTFRUITS
🔹 CEC (Christ in Every Chapter): Christ title/role, what He does, crosslink
🔹 R66 (Room 66): How does this theme develop Genesis→Revelation?

═══════════════════════════════════════════════════════════════
FLOOR 6: THREE HEAVENS & CYCLES (Horizons & History)
═══════════════════════════════════════════════════════════════
⚠️ CRITICAL: Three Heavens are DAY-OF-THE-LORD JUDGMENT CYCLES, NOT atmospheric layers!
🔹 123H (Three Heavens/Horizons Room): Which prophetic horizon?
   • 1H (DoL¹/NE¹) = Babylon destroys Jerusalem (586 BC) → Post-exilic restoration under Cyrus
   • 2H (DoL²/NE²) = Rome destroys Jerusalem (70 AD) → New Covenant order, church as living temple
   • 3H (DoL³/NE³) = Final global judgment → Literal New Heaven and Earth (Rev 21-22)
   ❌ NEVER: atmosphere/physical world/spiritual realm interpretation
   ✅ ALWAYS: prophetic stages of covenant history marked by judgment and renewal
🔹 @ (Eight Cycles Room): Which covenant cycle?
   • @Ad (Adam), @No (Noah), @Ab (Abraham), @Mo (Moses)
   • @Cy (Cyrus), @CyC (Christ), @Sp (Spirit/Church), @Re (Return)
⚠️ NOTE: The Juice Room (JR) is RESERVED for whole-book analysis (entire books like Genesis or Matthew) and MUST NOT be used for single-verse analysis in this tool. Do not include JR anywhere in your output for this verse.

═══════════════════════════════════════════════════════════════
FLOOR 7: SPIRITUAL & EMOTIONAL (Heart & Soul)
═══════════════════════════════════════════════════════════════
🔹 FRm (Fire Room): What wound or hope does this ignite?
🔹 MR (Meditation Room): What one truth to carry today?
🔹 SRm (Speed Room): What quick recall/reflex does this build?

═══════════════════════════════════════════════════════════════
FLOOR 8: MASTER (Reflexive Thought)
═══════════════════════════════════════════════════════════════
🔹 ∞ (Infinity/Reflexive Mastery Room): How do rooms work together naturally?

═══════════════════════════════════════════════════════════════
⚠️ CRITICAL ANALYSIS RULES ⚠️
═══════════════════════════════════════════════════════════════
1. Use AT LEAST 8-12 rooms per verse analysis
2. Vary room selection based on verse content
3. Every verse MUST have different room combinations
4. If sacrifice → Altar + Passover + SR (story of sacrifice)
5. If light → Lampstand + TR (translation) + IR (imagination)
6. If prayer → Incense + MR (meditation) + FRm (fire)
7. If creation → @Ad + OR (observation) + NF (nature)
8. If prophecy → PR + 4D + TZ + 3H
9. If resurrection → Firstfruits + CEC + @CyC
10. If Spirit → Pentecost + @Sp + Lampstand

NOW ANALYZE ${book} ${chapter}:${verse}:
1. Read the ACTUAL verse content carefully
2. Select 8-12 rooms that AUTHENTICALLY fit THIS specific verse
3. Include rooms from AT LEAST 4 different floors
4. Provide specific insights for each room selected
5. DO NOT default to the same 4 rooms every time
6. CRITICAL: When using DC (Def-Com Room), MUST include Hebrew/Greek definitions with Strong's numbers AND commentary citations (Gill, Clarke, etc.)
7. CRITICAL: Always write room abbreviations with full names in parentheses: "SR (Story Room)", "DC (Def-Com Room)", "DR (Dimensions Room)", etc.
8. CRITICAL: When using DR (Dimensions Room), use literal dimension + ONE other dimension only. For Me dimension, say "how it relates to you individually"

Return JSON:
{
  "roomsUsed": ["SR (Story Room)", "DR (Dimensions Room)", "BL (Blue/Sanctuary Room)", "CR (Concentration Room)", "FE (Feasts Room)", "OR (Observation Room)", "GR (Gems Room)", "MR (Meditation Room)"],
  "floorsCovered": [1, 2, 4, 5, 7],
  "roomAnalysis": {
    "SR (Story Room)": "This verse opens a pivotal narrative moment 🌙 where Nicodemus, a respected Pharisee and ruler, approaches Jesus under the cover of darkness. The story beat here is one of cautious curiosity meeting divine revelation. Notice how the nighttime setting adds dramatic tension to what becomes one of Scripture's most famous dialogues.",
    "DR (Dimensions Room)": "Let's explore this verse through two dimensions:\n\n1D (Literal): The text plainly tells us that Nicodemus, identified as a Pharisee and ruler of the Jews, came to Jesus at night and acknowledged Him as a teacher from God based on the miracles He performed.\n\n3D (How it relates to you individually): This challenges you personally to consider your own approach to Christ 🙏 Do you come in secret like Nicodemus, or do you boldly acknowledge Him? The verse invites honest self-examination about your own spiritual seeking.",
    "DC (Def-Com Room)": "The Greek word for 'miracles' here is sēmeia (Strong's G4592), meaning 'signs' or 'tokens.' These weren't just displays of power but divine signatures authenticating Jesus's identity.\n\nMatthew Henry's commentary notes: 'Nicodemus came by night, perhaps for fear of the Jews, or perhaps to have the more free conversation with Christ.' 📚\n\nGill's Exposition adds: 'He came to Jesus by night; not from any bad principles or intentions, but from fear of the Jews, lest he should be turned out of the synagogue.'",
    "BL (Blue/Sanctuary Room)": "The nighttime visit echoes the Old Testament pattern where God often revealed Himself in darkness or through night visions ⛪ Just as the sanctuary lamp burned continually through the night, Christ the Light receives this seeker in darkness.",
    "etc": "Continue with additional rooms using natural paragraphs and emojis"
  },
  "dimensions": ["2D", "3D"],
  "cycles": ["@CyC"],
  "horizons": [],
  "timeZones": ["Earth-Now"],
  "sanctuary": ["Altar"],
  "feasts": ["Passover"],
  "walls": ["Life of Christ Wall"],
  "crossReferences": [
    {
      "book": "Genesis",
      "chapter": 3,
      "verse": 15,
      "reason": "Why this connects",
      "principleType": "Type/Antitype|Parallel|Echo|Contextual",
      "confidence": 85
    }
  ],
   "commentary": "Write a warm, flowing analysis explaining which 8-12 rooms you used and WHY each fits THIS verse's content. Use emojis throughout (✨ 📖 🙏 ❤️ 💡) to make it engaging. Break into natural paragraphs with spacing. NEVER use asterisks for bold. Always write room abbreviations with full names: 'SR (Story Room)', 'DC (Def-Com Room)', 'DR (Dimensions Room)'. For DC room, include Hebrew/Greek with Strong's numbers and commentary citations. For DR room, use literal dimension + ONE other dimension only (for Me dimension, phrase as 'how it relates to you individually'). Show how rooms from different floors work together in a conversational way.",
   "christCenter": "CRITICAL: Write 2-3 flowing paragraphs explaining SPECIFICALLY how Christ appears in ${book} ${chapter}:${verse} based on the actual verse content and the rooms you analyzed. Use emojis naturally (✝️ ✨ 🙏 ❤️). NEVER use generic statements like 'Every verse reveals Christ' - instead, show EXACTLY how Christ is revealed in THIS SPECIFIC VERSE through the rooms analyzed (e.g., if you used CR (Concentration Room), explain what office/title Christ holds here; if BL (Blue/Sanctuary Room), show which sanctuary article reveals Him; if FE (Feasts Room), explain which feast He fulfills). Make it verse-specific and personal. NEVER use asterisks."
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a biblical scholar MASTER of the 37-room Phototheology Palace. 

CRITICAL FORMATTING REQUIREMENTS:
• Write in natural, flowing paragraphs with proper spacing between ideas
• Use emojis liberally throughout your analysis to make it engaging and visual (✨ 📖 🙏 ❤️ 💡 ⛪ ✝️ 🌟 etc.)
• NEVER use asterisks (*) for emphasis or bold text
• Instead of "**word**" just write the word naturally in context
• Break up long sections with blank lines to create breathing room
• Use bullet points with emojis (• or ✨) for lists
• Write in a warm, conversational yet scholarly tone
• Each room analysis should be its own clear paragraph

ANALYSIS REQUIREMENTS:
1) Analyze each verse using 8-12 DIFFERENT rooms from multiple floors
2) ALWAYS write room abbreviations with full names in parentheses: "SR (Story Room)", "DC (Def-Com Room)", "DR (Dimensions Room)"
3) When using DC (Def-Com Room), MUST include Hebrew/Greek definitions with Strong's numbers AND cite standard commentaries (Gill, Clarke, Matthew Henry, Barnes)
4) For DR (Dimensions Room), clarify which dimensions: 1D=Literal, 2D=Christ, 3D=Me, 4D=Church, 5D=Heaven
5) Provide specific insights for EACH room\n\n` + getContentBehavioralEngine()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'analyze_verse',
              description: 'Analyze a Bible verse through the Phototheology Palace rooms',
              parameters: {
                type: 'object',
                properties: {
                  roomsUsed: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of 8-12 rooms used with full names like "SR (Story Room)"'
                  },
                  floorsCovered: {
                    type: 'array',
                    items: { type: 'number' },
                    description: 'Floor numbers covered (1-8)'
                  },
                  roomAnalysis: {
                    type: 'object',
                    description: 'Analysis for each room used, with room name as key',
                    additionalProperties: { type: 'string' }
                  },
                  dimensions: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Dimensions used: 1D, 2D, 3D, 4D, 5D'
                  },
                  cycles: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Covenant cycles: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re'
                  },
                  horizons: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Prophetic horizons: 1H, 2H, 3H'
                  },
                  timeZones: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Time zones: Earth-Past, Earth-Now, Earth-Future, Heaven-Past, Heaven-Now, Heaven-Future'
                  },
                  sanctuary: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Sanctuary elements: Gate, Altar, Laver, Lampstand, Table, Incense, Veil, Ark'
                  },
                  feasts: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Feasts: Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles'
                  },
                  walls: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Theme walls: Sanctuary Wall, Life of Christ Wall, Great Controversy Wall, Time Prophecy Wall, Gospel Floor, Heaven Ceiling'
                  },
                  crossReferences: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        book: { type: 'string' },
                        chapter: { type: 'number' },
                        verse: { type: 'number' },
                        reason: { type: 'string' },
                        principleType: { type: 'string' },
                        confidence: { type: 'number' }
                      },
                      required: ['book', 'chapter', 'verse', 'reason']
                    }
                  },
                  commentary: {
                    type: 'string',
                    description: 'Warm flowing analysis explaining which rooms were used and why'
                  },
                  christCenter: {
                    type: 'string',
                    description: '2-3 paragraphs showing specifically how Christ appears in this verse'
                  }
                },
                required: ['roomsUsed', 'floorsCovered', 'roomAnalysis', 'commentary', 'christCenter'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'analyze_verse' } }
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract structured output from tool call
    const toolCall = data.choices[0].message.tool_calls?.[0];
    if (!toolCall || !toolCall.function.arguments) {
      throw new Error('No tool call response from AI');
    }
    
    const analysis = JSON.parse(toolCall.function.arguments);

    // Normalize room names to prevent AI hallucinations
    const normalizedRoomsUsed = (analysis.roomsUsed || []).map(normalizeRoomName);

    const normalizedRoomAnalysis: Record<string, string> = {};
    for (const [key, value] of Object.entries(analysis.roomAnalysis || {})) {
      normalizedRoomAnalysis[normalizeRoomName(key)] = value as string;
    }

    return new Response(
      JSON.stringify({
        verseId: `${book}-${chapter}-${verse}`,
        roomsUsed: normalizedRoomsUsed,
        floorsCovered: analysis.floorsCovered || [],
        roomAnalysis: normalizedRoomAnalysis,
        principles: {
          dimensions: analysis.dimensions || [],
          cycles: analysis.cycles || [],
          horizons: analysis.horizons || [],
          timeZones: analysis.timeZones || [],
          sanctuary: analysis.sanctuary || [],
          feasts: analysis.feasts || [],
          walls: analysis.walls || [],
          frames: [] // Can be added later if needed
        },
        crossReferences: analysis.crossReferences || [],
        commentary: analysis.commentary || '',
        christCenter: analysis.christCenter || ''
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error analyzing verse:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
