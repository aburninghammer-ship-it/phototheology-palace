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

    // Check if verse is too simple for analysis
    const wordCount = verseText.split(/\s+/).length;
    const isTransitional = /^(And|But|Then|So|For|Now|Therefore)\s+(he|she|they|it)\s+(said|went|came|did|was)/i.test(verseText);
    
    if (wordCount < 5 || (wordCount < 10 && isTransitional)) {
      // Skip simple transitional verses - return empty principles
      return new Response(
        JSON.stringify({
          verseId: `${book}-${chapter}-${verse}`,
          principles: {
            dimensions: [],
            cycles: [],
            horizons: [],
            timeZones: [],
            sanctuary: [],
            feasts: [],
            walls: []
          },
          crossReferences: [],
          commentary: "",
          christCenter: "",
          roomsUsed: [],
          floorsCovered: [],
          roomAnalysis: {}
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    const prompt = `Analyze ${book} ${chapter}:${verse}:

Verse text: "${verseText}"

CRITICAL INSTRUCTIONS:
1. Only identify principles that GENUINELY and CLEARLY apply to this specific verse
2. Do NOT force interpretations or stretch connections
3. Return AT MOST 5 principles total (from floors 3-6 only)
4. If the verse is simple or transitional, return EMPTY arrays
5. Focus on the MOST OBVIOUS and RELEVANT principles only

Floors 3-6 Principles to Consider (ONLY if they clearly apply):
- Dimensions (1D-5D): Does this verse have clear literal, Christ-centered, personal, church, or heavenly dimensions?
- Cycles (@Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re): Does this clearly fit a specific covenant cycle?
- Horizons (1H, 2H, 3H): Does this clearly reference a prophetic horizon?
- Sanctuary (Gate, Altar, Laver, Lampstand, Table, Incense, Veil, Ark): Does this clearly connect to sanctuary furniture?
- Feasts (Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles): Does this clearly fulfill/foreshadow a feast?
- TimeZones (Earth-Past/Now/Future, Heaven-Past/Now/Future): Clear time context?
- Walls (Sanctuary Wall, Life of Christ Wall, Great Controversy Wall, Time-Prophecy Wall): Clear thematic wall?

Return JSON with ONLY the principles that CLEARLY and GENUINELY apply. If none apply, return empty arrays.

{
  "dimensions": [],
  "cycles": [],
  "horizons": [],
  "timeZones": [],
  "sanctuary": [],
  "feasts": [],
  "walls": []
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
            content: 'You are a discerning biblical scholar. ONLY identify principles that CLEARLY and GENUINELY apply to the verse. Do NOT force interpretations. Return AT MOST 5 total principles. If the verse is simple or transitional, return empty arrays. Return ONLY valid JSON with no markdown.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    // Clean up potential markdown code blocks from Gemini response
    let cleanedText = analysisText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();
    
    const analysis = JSON.parse(cleanedText);
    
    // Combine all principles and limit to 5
    const allPrinciples = [
      ...(analysis.dimensions || []),
      ...(analysis.cycles || []),
      ...(analysis.horizons || []),
      ...(analysis.timeZones || []),
      ...(analysis.sanctuary || []),
      ...(analysis.feasts || []),
      ...(analysis.walls || []),
    ];
    
    const limitedPrinciples = allPrinciples.slice(0, 5);

    return new Response(
      JSON.stringify({
        verseId: `${book}-${chapter}-${verse}`,
        principles: {
          dimensions: analysis.dimensions || [],
          cycles: analysis.cycles || [],
          horizons: analysis.horizons || [],
          timeZones: analysis.timeZones || [],
          sanctuary: analysis.sanctuary || [],
          feasts: analysis.feasts || [],
          walls: analysis.walls || []
        },
        crossReferences: [],
        commentary: "",
        christCenter: "",
        roomsUsed: [],
        floorsCovered: [],
        roomAnalysis: {}
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
