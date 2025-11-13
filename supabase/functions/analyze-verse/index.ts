import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

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
🔹 DR (Dimensions Room): LITERAL • CHRIST • ME • CHURCH • HEAVEN
   • 1D = Literal (what the text says plainly, historical/grammatical)
   • 2D = Christ (personal Christ relationship, individual salvation)
   • 3D = Me (personal application, how it applies to my life)
   • 4D = Church (corporate body, ecclesiology, community)
   • 5D = Heaven (celestial realm, throne room, divine glory)
🔹 C6 (Connect-6 Room): Which genre? (Prophecy/Parable/Epistle/History/Gospel/Poetry)
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
🔹 PR (Prophecy Room): Daniel-Revelation symbols, timelines, parallel visions
🔹 3A (Three Angels Room): How does this proclaim everlasting gospel/judgment/Babylon/Beast warning?
🔹 FE (Feasts Room): Which feast does this fulfill/foreshadow?
   • Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles
🔹 CEC (Christ in Every Chapter): Christ title/role, what He does, crosslink
🔹 R66 (Room 66): How does this theme develop Genesis→Revelation?

═══════════════════════════════════════════════════════════════
FLOOR 6: THREE HEAVENS & CYCLES (Horizons & History)
═══════════════════════════════════════════════════════════════
🔹 123H (Three Heavens/Horizons Room): Which prophetic horizon?
   • 1H = Babylon/return (Cyrus, post-exilic)
   • 2H = 70 AD, 'this generation', church as temple
   • 3H = Global, final judgment, new creation
🔹 @ (Eight Cycles Room): Which covenant cycle?
   • @Ad (Adam), @No (Noah), @Ab (Abraham), @Mo (Moses)
   • @Cy (Cyrus), @CyC (Christ), @Sp (Spirit/Church), @Re (Return)
🔹 JR (Juice Room): What's the essence through multiple palace rooms?

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
8. CRITICAL: Clarify dimensions correctly: 1D=Literal, 2D=Christ, 3D=Me, 4D=Church, 5D=Heaven

Return JSON:
{
  "roomsUsed": ["SR (Story Room)", "DR (Dimensions Room)", "BL (Blue/Sanctuary Room)", "CR (Concentration Room)", "FE (Feasts Room)", "OR (Observation Room)", "GR (Gems Room)", "MR (Meditation Room)"],
  "floorsCovered": [1, 2, 4, 5, 7],
  "roomAnalysis": {
    "SR (Story Room)": "Story beat analysis here",
    "DR (Dimensions Room)": "1D: Literal reading shows... 2D: Christ is revealed as... 3D: For me personally this means... 4D: The Church learns... 5D: Heaven perspective shows...",
    "DC (Def-Com Room)": "Hebrew/Greek: [word] (Strong's H####/G####) means [definition]. Gill's Commentary notes: [quote]. Clarke adds: [quote].",
    "BL (Blue/Sanctuary Room)": "Sanctuary connection here",
    "etc": "Always include full room names in parentheses"
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
  "commentary": "MUST explain which 8-12 rooms you used and WHY each fits THIS verse's content. Always write room abbreviations with full names: 'SR (Story Room)', 'DC (Def-Com Room)', 'DR (Dimensions Room)'. For DC room, include Hebrew/Greek with Strong's numbers and commentary citations. For DR room, clarify which dimensions (1D=Literal, 2D=Christ, 3D=Me, 4D=Church, 5D=Heaven). Show how rooms from different floors work together.",
  "christCenter": "How Christ is revealed through the specific rooms analyzed"
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
            content: 'You are a biblical scholar MASTER of the 37-room Phototheology Palace. CRITICAL REQUIREMENTS: 1) Analyze each verse using 8-12 DIFFERENT rooms from multiple floors. 2) ALWAYS write room abbreviations with full names in parentheses: "SR (Story Room)", "DC (Def-Com Room)", "DR (Dimensions Room)". 3) When using DC (Def-Com Room), MUST include Hebrew/Greek definitions with Strong\'s numbers AND cite standard commentaries (Gill, Clarke, Matthew Henry, Barnes). 4) For DR (Dimensions Room), clarify which dimensions: 1D=Literal, 2D=Christ, 3D=Me, 4D=Church, 5D=Heaven. 5) Provide specific insights for EACH room. Return only valid JSON with roomsUsed array and roomAnalysis object using full room names.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    const analysis = JSON.parse(analysisText);

    return new Response(
      JSON.stringify({
        verseId: `${book}-${chapter}-${verse}`,
        roomsUsed: analysis.roomsUsed || [],
        floorsCovered: analysis.floorsCovered || [],
        roomAnalysis: analysis.roomAnalysis || {},
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
