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

CRITICAL INSTRUCTIONS:
1. Read the verse carefully and identify ONLY the principles that genuinely fit this specific verse
2. You MUST vary your selections - different verses should have different principle combinations
3. Select 4-8 total principles across all categories (not all from one category)
4. Be highly selective - only choose principles that authentically connect to this verse's content
5. DO NOT default to the same principles for every verse

Provide a JSON response with this structure:
{
  "dimensions": [], // Pick 1-2 that fit: "2D"=Christ in me, "3D"=Christ in Church, "4D"=Christ in prophecy, "5D"=Christ in heaven
  "cycles": [], // Pick 0-2 that fit: "@Ad"=Adam, "@No"=Noah, "@Ab"=Abraham, "@Mo"=Moses, "@Cy"=Cyrus, "@CyC"=Christ, "@Sp"=Spirit, "@Re"=Return
  "sanctuary": [], // Pick 0-2 that fit: "Gate", "Altar", "Laver", "Lampstand", "Table", "Incense", "Veil", "Ark"
  "feasts": [], // Pick 0-2 that fit: "Passover", "Unleavened Bread", "Firstfruits", "Pentecost", "Trumpets", "Atonement", "Tabernacles"
  "crossReferences": [
    {
      "book": "Genesis",
      "chapter": 3,
      "verse": 15,
      "reason": "Brief explanation",
      "principleType": "Type/Antitype|Parallel|Echo|Contextual",
      "confidence": 85
    }
  ], // Provide 2-4 highly relevant cross references
  "commentary": "100-150 words explaining which principles apply and WHY they fit this specific verse",
  "christCenter": "100-150 words explaining how Christ is revealed in THIS verse"
}

IMPORTANT EXAMPLES OF SELECTIVITY:
- A verse about water might connect to Laver (cleansing) or baptism
- A verse about sacrifice clearly connects to Altar and Passover
- A verse about God's presence connects to Ark and Tabernacles
- A verse about light connects to Lampstand
- A verse about prayer connects to Incense
- A historical narrative in Exodus connects to @Mo cycle
- A promise to Abraham connects to @Ab cycle
- A resurrection theme connects to Firstfruits feast

Analyze THIS specific verse with fresh eyes - what principles genuinely fit its unique content?`;

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
            content: 'You are a biblical scholar trained in the Phototheology Palace method. Analyze verses through this framework with precision and theological depth. Return only valid JSON.'
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
