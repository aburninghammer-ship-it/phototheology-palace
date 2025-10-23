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

Provide a JSON response with the following structure:
{
  "dimensions": ["2D", "3D", "4D", "5D"], // Which dimensional readings apply? 2D=Christ in me, 3D=Christ in Church, 4D=Christ in prophecy, 5D=Christ in heaven
  "cycles": ["@Ab", "@Mo", "@Cy", "@CyC", "@Sp"], // Which covenant cycles? @Ab=Abraham, @Mo=Moses, @Cy=Cyrus, @CyC=Christ, @Sp=Spirit
  "sanctuary": ["Altar", "Laver", "Lampstand", "Table", "Incense", "Veil", "Ark"], // Which sanctuary articles connect?
  "feasts": ["Passover", "Unleavened Bread", "Firstfruits", "Pentecost", "Trumpets", "Atonement", "Tabernacles"], // Which feast connections?
  "crossReferences": [
    {
      "book": "Genesis",
      "chapter": 3,
      "verse": 15,
      "reason": "Brief explanation of the connection",
      "principleType": "Type/Antitype|Parallel|Echo|Contextual",
      "confidence": 85
    }
  ], // Provide 2-4 highly relevant cross references
  "commentary": "A 100-150 word explanation of how this verse fits into the palace framework, explaining the dimensions, cycles, and sanctuary connections",
  "christCenter": "A 100-150 word explanation of how Christ is revealed in this verse"
}

Be selective - only include dimensions/cycles/sanctuary/feasts that genuinely apply. Not every verse touches every element. Focus on quality over quantity. Make sure cross-references are genuinely connected by theme, typology, or direct quotation.`;

    const response = await fetch('https://api.lovable.app/v1/chat/completions', {
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
        temperature: 0.7,
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
