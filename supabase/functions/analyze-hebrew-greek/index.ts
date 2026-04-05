import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { getContentBehavioralEngine } from "../_shared/content-behavioral-engine.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { word, verse, context, book } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Normalize book name and check if Old Testament (Hebrew)
    const normalizedBook = book?.toLowerCase()?.trim() || '';
    const oldTestamentBooks = [
      'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 
      'joshua', 'judges', 'ruth', '1 samuel', '2 samuel', '1 kings', '2 kings',
      '1 chronicles', '2 chronicles', 'ezra', 'nehemiah', 'esther', 'job', 
      'psalm', 'psalms', 'proverbs', 'ecclesiastes', 'song of solomon', 'song of songs', 
      'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel', 
      'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 
      'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi'
    ];
    const isOldTestament = oldTestamentBooks.includes(normalizedBook);

    const language = isOldTestament ? 'Hebrew' : 'Greek';

    const systemPrompt = `You are a biblical language expert providing Strong's Concordance-style word analysis. 
Analyze the word "${word}" from ${book} in ${language}.

Provide:
1. **Original ${language} Word**: The likely ${language} word/root
2. **Transliteration**: How it's pronounced in English
3. **Strong's Number**: Best matching Strong's number (format: H#### for Hebrew, G#### for Greek)
4. **Definition**: Clear, concise meaning
5. **Usage**: How it's used in biblical context
6. **Related Words**: Similar words in scripture

Context: "${verse}"
Full context: "${context}"

Format your response in clean markdown with bold headings.`;

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
          { role: 'user', content: `Analyze the word "${word}" in this context.` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
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
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content;

    if (!analysis) {
      throw new Error('No analysis generated');
    }

    return new Response(
      JSON.stringify({ 
        analysis,
        language,
        word,
        verse 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-hebrew-greek:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
