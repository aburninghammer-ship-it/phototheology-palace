import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { verseReference, verseText, breakdown } = await req.json();
    
    if (!breakdown || !Array.isArray(breakdown)) {
      throw new Error('Breakdown data is required and must be an array');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Generate social media summary showcasing the 7 principles
    const principlesSummary = breakdown.map((item: any, idx: number) => 
      `Floor ${idx + 1} - ${item.principle_applied}: ${item.key_insight}`
    ).join('\n\n');

    const summaryPrompt = `Create an engaging explanation (2-3 sentences, max 400 characters) for sharing this daily Bible verse that showcases Phototheology's unique 7-floor analysis:

Verse: ${verseReference}
"${verseText}"

7-Floor Analysis Applied:
${principlesSummary}

Your explanation should:
- Clearly communicate what makes this analysis special (7 different perspectives from 7 floors of study)
- Use natural, accessible language (avoid awkward phrases like "God-Kind life")
- Create genuine curiosity about the deeper meaning revealed
- Be inspiring yet conversational

Focus on how each floor reveals a different dimension of truth in this verse.`;

    const summaryResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5-mini',
        messages: [
          {
            role: 'user',
            content: summaryPrompt
          }
        ],
      }),
    });

    const summaryData = await summaryResponse.json();
    const summary = summaryData.choices[0].message.content;

    // Generate simple verse image (compact for social sharing)
    const imagePrompt = `Create a compact, beautiful image for this Bible verse (optimized for social media thumbnail size):

"${verseText}"
- ${verseReference}

Style: Simple and clean with elegant typography on a warm gradient background. The verse text should be clearly readable. Minimal design - no complex imagery, just beautiful text presentation. Square format, suitable as a small preview image for sharing.`;

    const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: imagePrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    const imageData = await imageResponse.json();
    const imageBase64 = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageBase64) {
      throw new Error('Failed to generate image');
    }

    return new Response(
      JSON.stringify({
        summary: `${summary}\n\nExplore the full 7-floor analysis: https://phototheology.lovable.app/daily-verse`,
        imageBase64,
        appUrl: 'https://phototheology.lovable.app/daily-verse'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-daily-verse-share:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
