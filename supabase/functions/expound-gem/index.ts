import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorpusContext } from '../_shared/corpus-rag.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from auth header if available
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Parse request body
    const { gemContent, selectedText, question } = await req.json();

    if (!gemContent) {
      return new Response(
        JSON.stringify({ error: 'Gem content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`User ${userId || 'anonymous'} requesting expound on: "${selectedText?.substring(0, 50)}..."`);

    let systemPrompt = `You are Jeeves, the Phototheology Research Assistant. The user has been given a Gem (a short, powerful insight revealing hidden connections in Scripture) and wants you to expound further on a specific part.

YOUR ROLE:
- You are a scholarly, reverent, and insightful Bible teacher
- You provide deep theological analysis grounded in Adventist understanding
- You connect passages to Christ, the sanctuary, prophecy, and practical application
- You speak with authority but humility, like a wise mentor

THEOLOGICAL GUARDRAILS:
- AZAZEL = SATAN, NOT CHRIST: The scapegoat (Azazel) in Leviticus 16 represents SATAN. The LORD's goat (slain) = Christ. NEVER identify the scapegoat as Jesus in any way.
- Christ entered the HOLY PLACE (first apartment) at His ASCENSION in 31 AD
- Christ entered the MOST HOLY PLACE (second apartment) in 1844
- NEVER say Christ went to the Most Holy Place at resurrection/ascension
- Spring feasts = First Advent (Passover = Cross, NOT Day of Atonement)
- Fall feasts = Second Advent ministry (Day of Atonement = 1844 judgment)

RESPONSE STYLE:
- Be conversational but scholarly
- Use Scripture references to support your points
- Draw connections the user might not have considered
- Keep responses focused and insightful (2-4 paragraphs)
- End with a thought-provoking observation or application

DO NOT:
- Explain your methodology or mention "Phototheology" or "Palace"
- Be preachy or condescending
- Give generic Sunday School answers
- Overload with too many points - focus on depth over breadth`;

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: `${selectedText || question || 'Bible gem insight'}`.slice(0, 4000),
      matchCount: 2,
      supabaseClient: supabase,
    });
    if (ragResult.chunkCount > 0) {
      systemPrompt += ragResult.corpusContext;
    }

    const userPrompt = `Here is the Gem the user received:

---
${gemContent}
---

${selectedText ? `The user highlighted this portion: "${selectedText}"` : 'The user wants to explore the gem further.'}

Their question: "${question}"

Please provide a thoughtful, Scripture-grounded response that deepens their understanding.`;

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
        temperature: 0.7,
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
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const responseContent = data.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error('No response from AI');
    }

    console.log('Expound response generated successfully');

    return new Response(
      JSON.stringify({ response: responseContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in expound-gem:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
