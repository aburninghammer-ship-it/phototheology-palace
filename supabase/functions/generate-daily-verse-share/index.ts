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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Generate social media summary showcasing the 7 principles
    const principlesSummary = breakdown.map((item: any, idx: number) => 
      `${idx + 1}. ${item.principle_applied} (${item.floor}): ${item.key_insight}`
    ).join('\n');

    const summaryPrompt = `Create an engaging social media post (max 280 characters) for this daily Bible verse that highlights how Phototheology's unique 7-principle analysis provides deeper understanding:

Verse: ${verseReference}
Text: "${verseText}"

7 Principles Applied:
${principlesSummary}

Your summary should:
- Tease the depth of understanding these 7 different perspectives provide
- Emphasize that this verse is analyzed through 7 unique lenses (floors of the Palace)
- Create curiosity about the app's ability to reveal layers of meaning
- End with a call to explore the full 7-principle breakdown in Phototheology

Be inspiring and highlight the unique multi-dimensional commentary approach.`;

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

    // Generate simple verse image
    const imagePrompt = `Create a beautiful, simple, inspirational image for this Bible verse:

"${verseText}"
- ${verseReference}

Style: Clean, modern, with elegant typography. Use warm, inspiring colors. The verse text should be clearly readable and centered. Include subtle decorative elements like light rays, gentle gradients, or minimal biblical imagery. Professional social media graphic style.`;

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
        summary,
        imageBase64,
        appUrl: 'https://phototheology.lovable.app/daily-verse'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-daily-verse-share:', error);
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
