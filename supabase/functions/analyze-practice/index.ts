import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { verseReference, exerciseContent, roomName, roomPrinciple, bibleText } = await req.json();
    
    console.log('Analyzing practice for:', { verseReference, roomName });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a biblical study mentor specializing in Phototheology methods. Your role is to analyze student practice work and provide constructive, encouraging feedback.

ROOM PRINCIPLE: ${roomPrinciple}

EVALUATION CRITERIA:
1. Does the practice correctly reference and engage with the biblical text?
2. Does it properly apply the ${roomName} principle?
3. Is the work thorough and thoughtful?
4. Are there any misinterpretations of the text?

FEEDBACK STYLE:
- Start with what they did WELL
- Be specific about strengths
- Gently correct any errors
- Suggest ONE improvement for next time
- End with encouragement
- Keep feedback under 200 words
- Use a warm, mentoring tone`;

    const userPrompt = `Verse/Story: ${verseReference}

BIBLE TEXT:
${bibleText}

STUDENT'S PRACTICE WORK:
${exerciseContent}

Please analyze this practice work. Does it properly apply the ${roomName} principle to this passage? Provide constructive feedback.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please contact support.' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API returned ${response.status}`);
    }

    const data = await response.json();
    const feedback = data.choices?.[0]?.message?.content;

    if (!feedback) {
      throw new Error('No feedback generated');
    }

    console.log('Feedback generated successfully');

    return new Response(
      JSON.stringify({ feedback }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-practice function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze practice';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
