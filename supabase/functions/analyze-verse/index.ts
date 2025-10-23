import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const prompt = `Analyze ${book} ${chapter}:${verse} through the Phototheology Palace framework:

Verse text: "${verseText}"

🚨 CRITICAL - YOU ARE FAILING THIS TEST 🚨
Your previous analyses have been WRONG because you keep selecting the SAME principles (2D, @CyC, Lampstand) for EVERY verse.
This is INCORRECT. Each verse is unique and requires DIFFERENT principle combinations.

MANDATORY REQUIREMENTS:
1. READ the actual verse content CAREFULLY before selecting principles
2. Select 4-8 TOTAL principles that GENUINELY fit THIS specific verse
3. VARY your selections - no two verses should have identical principle sets
4. DO NOT use 2D + @CyC + Lampstand as your default - this is WRONG
5. If a principle doesn't authentically connect to the verse's content, DO NOT include it

SELECTION GUIDELINES BY CATEGORY:

Dimensions (pick 1-2 that genuinely fit):
- "2D" = Personal relationship with Christ, individual faith, Christ in me
- "3D" = Church community, body of Christ, ecclesiology
- "4D" = Prophecy, end times, apocalyptic themes
- "5D" = Heaven, celestial realm, divine throne room

Cycles (pick 0-2 that fit the historical/theological context):
- "@Ad" = Creation, fall, sin entering world
- "@No" = Judgment, deliverance through water, new beginnings
- "@Ab" = Faith, covenant promises, seed promise
- "@Mo" = Law, exodus, liberation, Sinai covenant
- "@Cy" = Restoration, rebuilding, return from exile
- "@CyC" = Christ's incarnation, ministry, first coming
- "@Sp" = Pentecost, Spirit's work, church age
- "@Re" = Second coming, final judgment, new earth

Sanctuary (pick 0-2 that connect to the verse's imagery):
- "Gate" = Entry, conversion, beginning of journey
- "Altar" = Sacrifice, substitution, atonement
- "Laver" = Cleansing, baptism, purification
- "Lampstand" = Light, witness, illumination, Holy Spirit
- "Table" = Fellowship, communion, provision
- "Incense" = Prayer, intercession, worship
- "Veil" = Access to God, barrier removed, mystery
- "Ark" = God's presence, mercy seat, law fulfilled

Feasts (pick 0-2 that match the verse's themes):
- "Passover" = Lamb's blood, deliverance, redemption
- "Unleavened Bread" = Purity, separation from sin
- "Firstfruits" = Resurrection, new life, Christ risen
- "Pentecost" = Spirit outpouring, church birth, harvest
- "Trumpets" = Warning, awakening, announcement
- "Atonement" = Cleansing, forgiveness, Day of the Lord
- "Tabernacles" = God dwelling with us, joy, pilgrimage

TESTING YOUR UNDERSTANDING - Examples:
- John 3:16 ("For God so loved...") → 2D, @CyC, Altar, Passover (God's love, Christ's gift, sacrifice)
- John 1:1 ("In the beginning...") → 5D, @Ad, Ark (Divine Word, creation, pre-existence)
- John 14:2 ("I go to prepare...") → 2D, 5D, @Re, Tabernacles (personal promise, heaven, future dwelling)
- John 15:5 ("I am the vine...") → 2D, 3D, Table (abiding in Christ, connected to body, fellowship)

NOW ANALYZE ${book} ${chapter}:${verse}:
What does THIS verse actually say? What principles authentically connect to its content?
Be specific. Be varied. Be correct.

Provide a JSON response with this structure:
{
  "dimensions": [],
  "cycles": [],
  "sanctuary": [],
  "feasts": [],
  "crossReferences": [
    {
      "book": "Genesis",
      "chapter": 3,
      "verse": 15,
      "reason": "Brief explanation",
      "principleType": "Type/Antitype|Parallel|Echo|Contextual",
      "confidence": 85
    }
  ],
  "commentary": "100-150 words explaining which principles apply and WHY they fit this specific verse based on its actual content",
  "christCenter": "100-150 words explaining how Christ is revealed in THIS specific verse"
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
            content: 'You are a biblical scholar trained in the Phototheology Palace method. You MUST analyze each verse uniquely - selecting different principle combinations based on the actual verse content. DO NOT use the same principles for every verse. Your previous analyses have been incorrect because you defaulted to 2D + @CyC + Lampstand repeatedly. Read each verse carefully and select principles that genuinely fit. Return only valid JSON.'
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
        principles: {
          dimensions: analysis.dimensions || [],
          cycles: analysis.cycles || [],
          sanctuary: analysis.sanctuary || [],
          feasts: analysis.feasts || [],
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
