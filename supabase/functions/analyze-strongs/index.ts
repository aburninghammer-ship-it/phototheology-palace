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
    const { book, chapter, verse, text, dictionary = 'strongs' } = await req.json();
    
    console.log(`Analyzing ${book} ${chapter}:${verse} with ${dictionary} dictionary`);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to get tokenized data from database first
    const { data: tokenizedData, error } = await supabase
      .from('bible_verses_tokenized')
      .select('tokens, text_kjv')
      .eq('book', book)
      .eq('chapter', chapter)
      .eq('verse_num', verse)
      .single();

    if (tokenizedData && tokenizedData.tokens) {
      console.log('Found tokenized data in database');
      // Parse tokens from the database
      const tokens = tokenizedData.tokens as Token[];
      const words = tokens
        .filter((token) => token.s && token.s !== '<nil>')
        .map((token) => ({
          word: token.t,
          strongsNumber: token.s || '',
          originalWord: token.h || '',
          transliteration: token.tr || '',
          definition: getDefinition(token.s || '', dictionary),
        }));

      return new Response(
        JSON.stringify({ 
          words,
          source: 'database',
          dictionary,
          verseText: tokenizedData.text_kjv
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no tokenized data, use AI to analyze
    console.log('No tokenized data found, using AI analysis');
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

    // Customize prompt based on dictionary type
    let dictionaryContext = '';
    if (dictionary === 'thayers') {
      dictionaryContext = `Use Thayer's Greek Lexicon style - focus on theological meaning, NT usage patterns, and classical Greek connections.`;
    } else if (dictionary === 'bdb') {
      dictionaryContext = `Use Brown-Driver-Briggs style - focus on Hebrew root meanings, semantic ranges, and OT usage contexts.`;
    } else {
      dictionaryContext = `Use Strong's Concordance style - provide concise definitions with Strong's numbers.`;
    }

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
            content: `You are a biblical lexicon expert. ${dictionaryContext}
Analyze the verse and return JSON only.
Return an array of objects with these exact fields for each key word:
- word: English word from the verse
- strongsNumber: Strong's number (H#### for Hebrew, G#### for Greek)
- originalWord: Original ${language} word
- transliteration: How it sounds in English
- definition: ${dictionary === 'thayers' ? 'Detailed theological definition (30-50 words)' : dictionary === 'bdb' ? 'Hebrew root analysis with semantic range (30-50 words)' : 'Brief definition (max 20 words)'}

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
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let analysisText = data.choices?.[0]?.message?.content || '[]';
    
    // Clean up the response
    analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let words = [];
    try {
      words = JSON.parse(analysisText);
      console.log(`AI returned ${words.length} words`);
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisText);
      words = [];
    }

    return new Response(
      JSON.stringify({ 
        words,
        source: 'ai',
        dictionary,
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

function getDefinition(strongsNum: string, dictionary: string): string {
  // Extended definitions based on dictionary type
  const strongsDefinitions: Record<string, string> = {
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

  const thayersDefinitions: Record<string, string> = {
    'G2316': 'θεός (theos): The supreme Deity; in NT usage refers to the one true God, the Father, or the divine nature. Used 1,343 times.',
    'G3056': 'λόγος (logos): A word uttered by a living voice expressing thought; in John\'s Gospel, the personal Wisdom and Power of God, the second person of the Trinity.',
    'G2424': 'Ἰησοῦς (Iēsous): Jesus, the Son of God, the Savior of mankind. Hebrew equivalent of Joshua meaning "Yahweh is salvation."',
    'G5547': 'Χριστός (Christos): The Anointed One, equivalent to Hebrew Messiah. Designates Jesus as the promised deliverer and king.',
    'G26': 'ἀγάπη (agapē): Affection, good will, love, benevolence. In NT distinctly the love of God for man and man for God, sacrificial love.',
    'G4102': 'πίστις (pistis): Conviction of truth, belief; in NT the conviction that God exists and is the rewarder of those who seek Him.',
    'G5485': 'χάρις (charis): Grace, that which affords joy, pleasure; especially the divine grace influencing the heart and its reflection in life.',
  };

  const bdbDefinitions: Record<string, string> = {
    'H430': 'אֱלֹהִים (ʾĕlōhîm): Plural of אֵל; rulers, judges, divine ones, angels; as intensive plural: god, goddess; or as true plural: gods. Most frequently: the (true) God.',
    'H7225': 'רֵאשִׁית (rēʾšîṯ): From רֹאשׁ; beginning, first, chief part, firstfruits. Temporal: in the beginning; qualitative: the choice part.',
    'H1254': 'בָּרָא (bārāʾ): To shape, create, fashion. In Qal always with God as subject, denoting divine creative activity producing something new.',
    'H8064': 'שָׁמַיִם (šāmayim): Dual form; heaven, heavens, sky. The visible heavens, the atmosphere, or the abode of God.',
    'H776': 'אֶרֶץ (ʾereṣ): Earth, land, territory. The whole earth as opposed to heaven; a specific land or country; ground or soil.',
  };

  if (dictionary === 'thayers' && thayersDefinitions[strongsNum]) {
    return thayersDefinitions[strongsNum];
  }
  if (dictionary === 'bdb' && bdbDefinitions[strongsNum]) {
    return bdbDefinitions[strongsNum];
  }
  if (strongsDefinitions[strongsNum]) {
    return strongsDefinitions[strongsNum];
  }
  
  return dictionary === 'thayers' 
    ? 'Detailed definition available in Thayer\'s Greek-English Lexicon'
    : dictionary === 'bdb'
    ? 'Full entry available in Brown-Driver-Briggs Hebrew Lexicon'
    : 'Definition available via Strong\'s Concordance';
}