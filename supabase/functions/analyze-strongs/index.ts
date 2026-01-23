import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Token {
  t: string;      // English word
  s?: string;     // Strong's number (H#### or G####)
  h?: string;     // Hebrew/Greek original word
  tr?: string;    // Transliteration
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, verse, text } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to get tokenized data from database
    const { data: tokenizedData, error } = await supabase
      .from('bible_verses_tokenized')
      .select('tokens, text_kjv')
      .eq('book', book)
      .eq('chapter', chapter)
      .eq('verse_num', verse)
      .single();

    if (tokenizedData && tokenizedData.tokens) {
      // Parse tokens from the database
      const tokens = tokenizedData.tokens as Token[];
      const words = tokens
        .filter((token) => token.s && token.s !== '<nil>')
        .map((token) => ({
          word: token.t,
          strongsNumber: token.s || '',
          originalWord: token.h || '',
          transliteration: token.tr || '',
          definition: getBasicDefinition(token.s || ''),
        }));

      return new Response(
        JSON.stringify({ 
          words,
          source: 'database',
          verseText: tokenizedData.text_kjv
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no tokenized data, use AI to analyze
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const oldTestamentBooks = [
      'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 
      'joshua', 'judges', 'ruth', '1 samuel', '2 samuel', '1 kings', '2 kings',
      '1 chronicles', '2 chronicles', 'ezra', 'nehemiah', 'esther', 'job', 
      'psalm', 'psalms', 'proverbs', 'ecclesiastes', 'song of solomon', 
      'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel', 
      'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 
      'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi'
    ];
    const isOldTestament = oldTestamentBooks.includes(book.toLowerCase());
    const language = isOldTestament ? 'Hebrew' : 'Greek';

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
            content: `You are a Strong's Concordance expert. Analyze the verse and return JSON only.
Return an array of objects with these exact fields for each key word:
- word: English word from the verse
- strongsNumber: Strong's number (H#### for Hebrew, G#### for Greek)
- originalWord: Original ${language} word
- transliteration: How it sounds in English
- definition: Brief definition (max 20 words)

Only include words that have Strong's numbers. Return valid JSON array only, no markdown.`
          },
          { 
            role: 'user', 
            content: `Analyze: "${text}" from ${book} ${chapter}:${verse}. Return JSON array only.` 
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let analysisText = data.choices?.[0]?.message?.content || '[]';
    
    // Clean up the response
    analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let words = [];
    try {
      words = JSON.parse(analysisText);
    } catch {
      console.error('Failed to parse AI response:', analysisText);
      words = [];
    }

    return new Response(
      JSON.stringify({ 
        words,
        source: 'ai',
        verseText: text
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-strongs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage, words: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getBasicDefinition(strongsNum: string): string {
  // Basic definitions for common Strong's numbers - would be expanded with a full lexicon
  const definitions: Record<string, string> = {
    'H430': 'God, gods, mighty ones (Elohim)',
    'H7225': 'beginning, first, chief',
    'H1254': 'to create, shape, form',
    'H8064': 'heaven, sky, heavens',
    'H776': 'earth, land, ground',
    'G2316': 'God, deity, the supreme Divinity',
    'G3056': 'word, speech, matter (Logos)',
    'G2424': 'Jesus - Yahweh saves',
    'G5547': 'Christ, Anointed One, Messiah',
    'G26': 'love (agape) - unconditional love',
    'G4102': 'faith, belief, trust',
    'G5485': 'grace, favor, kindness',
  };
  return definitions[strongsNum] || 'Definition available via Strong\'s Concordance';
}
