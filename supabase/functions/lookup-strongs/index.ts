import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extended Strong's definitions database
const strongsDatabase: Record<string, { original: string; transliteration: string; definition: string }> = {
  // Hebrew words (Old Testament)
  'H1': { original: 'אָב', transliteration: 'ʾāḇ', definition: 'Father; ancestor, forefather; originator, patron; chief, ruler' },
  'H430': { original: 'אֱלֹהִים', transliteration: 'ʾĕlōhîm', definition: 'God (plural intensive); gods, divine beings, angels; as superlative: the supreme God' },
  'H3068': { original: 'יְהוָה', transliteration: 'YHWH', definition: 'The proper name of the God of Israel; LORD, Jehovah, the Existing One, I AM' },
  'H7225': { original: 'רֵאשִׁית', transliteration: 'rēʾšîṯ', definition: 'Beginning, first, chief part; the first in time, rank, or order; firstfruits' },
  'H1254': { original: 'בָּרָא', transliteration: 'bārāʾ', definition: 'To create, shape, form; to bring into existence; always used of divine creative activity' },
  'H8064': { original: 'שָׁמַיִם', transliteration: 'šāmayim', definition: 'Heaven, heavens, sky; the visible heavens; the abode of God; the celestial realm' },
  'H776': { original: 'אֶרֶץ', transliteration: 'ʾereṣ', definition: 'Earth, land, territory; the whole earth; a specific country or region; ground, soil' },
  'H1285': { original: 'בְּרִית', transliteration: 'bərîṯ', definition: 'Covenant, treaty, alliance; a binding agreement between parties; Gods covenant with man' },
  'H6944': { original: 'קֹדֶשׁ', transliteration: 'qōḏeš', definition: 'Holiness, sacredness; apartness, separateness; a holy thing or place; sanctuary' },
  'H7307': { original: 'רוּחַ', transliteration: 'rûaḥ', definition: 'Spirit, wind, breath; the Spirit of God; life force; disposition, mind' },
  'H3478': { original: 'יִשְׂרָאֵל', transliteration: 'yiśrāʾēl', definition: 'Israel - "he strives with God"; Jacob\'s name after wrestling with God; the nation of Israel' },
  'H4872': { original: 'מֹשֶׁה', transliteration: 'mōšeh', definition: 'Moses - "drawn out"; the lawgiver, prophet, and leader who brought Israel out of Egypt' },
  'H1732': { original: 'דָּוִד', transliteration: 'dāwîḏ', definition: 'David - "beloved"; king of Israel; ancestor of the Messiah; a man after Gods own heart' },
  'H4899': { original: 'מָשִׁיחַ', transliteration: 'māšîaḥ', definition: 'Messiah, anointed one; the expected king and deliverer; Christ' },
  'H3091': { original: 'יְהוֹשׁוּעַ', transliteration: 'yəhôšuaʿ', definition: 'Joshua - "Yahweh is salvation"; Moses successor; same name as Jesus in Hebrew' },

  // Greek words (New Testament)
  'G1': { original: 'Α', transliteration: 'alpha', definition: 'Alpha, the first letter; Christ as "the Alpha and Omega" - the beginning' },
  'G26': { original: 'ἀγάπη', transliteration: 'agapē', definition: 'Love; divine love; unconditional, sacrificial love; affection, goodwill, benevolence' },
  'G40': { original: 'ἅγιος', transliteration: 'hagios', definition: 'Holy, sacred, set apart; pure, morally blameless; dedicated to God' },
  'G225': { original: 'ἀλήθεια', transliteration: 'alētheia', definition: 'Truth; reality, sincerity; the truth as taught by Christianity; integrity' },
  'G266': { original: 'ἁμαρτία', transliteration: 'hamartia', definition: 'Sin; missing the mark; offense against God; sinful deed or nature' },
  'G932': { original: 'βασιλεία', transliteration: 'basileia', definition: 'Kingdom, reign, royal power; the Kingdom of God/Heaven; divine rule' },
  'G1342': { original: 'δίκαιος', transliteration: 'dikaios', definition: 'Righteous, just, upright; conforming to Gods laws; innocent, faultless' },
  'G1515': { original: 'εἰρήνη', transliteration: 'eirēnē', definition: 'Peace; tranquility; harmony; the peace of God; welfare, prosperity' },
  'G1680': { original: 'ἐλπίς', transliteration: 'elpis', definition: 'Hope; expectation, confidence; the Christian hope of eternal salvation' },
  'G2098': { original: 'εὐαγγέλιον', transliteration: 'euangelion', definition: 'Gospel, good news; the glad tidings of salvation through Christ' },
  'G2222': { original: 'ζωή', transliteration: 'zōē', definition: 'Life; the absolute fullness of life; eternal life; the life of God' },
  'G2316': { original: 'θεός', transliteration: 'theos', definition: 'God; the supreme Deity; the one true God; godhead, divine nature' },
  'G2424': { original: 'Ἰησοῦς', transliteration: 'Iēsous', definition: 'Jesus - "Yahweh saves"; the Son of God, the Savior, the Messiah' },
  'G2962': { original: 'κύριος', transliteration: 'kyrios', definition: 'Lord, Master; supreme authority; title for God and Christ; owner' },
  'G3056': { original: 'λόγος', transliteration: 'logos', definition: 'Word; the divine Word (Christ); speech, message; reason, thought' },
  'G3962': { original: 'πατήρ', transliteration: 'patēr', definition: 'Father; God as Father; an ancestor, forefather; one who originates' },
  'G4102': { original: 'πίστις', transliteration: 'pistis', definition: 'Faith, belief, trust; conviction; faithfulness, fidelity; Christian faith' },
  'G4151': { original: 'πνεῦμα', transliteration: 'pneuma', definition: 'Spirit; the Holy Spirit; a spirit being; breath, wind; disposition' },
  'G4991': { original: 'σωτηρία', transliteration: 'sōtēria', definition: 'Salvation; deliverance, preservation; spiritual salvation through Christ' },
  'G5043': { original: 'τέκνον', transliteration: 'teknon', definition: 'Child; offspring; a term of endearment; children of God; disciples' },
  'G5207': { original: 'υἱός', transliteration: 'huios', definition: 'Son; the Son of God (Christ); a son by birth or adoption; descendant' },
  'G5485': { original: 'χάρις', transliteration: 'charis', definition: 'Grace; unmerited favor; the grace of God in salvation; gratitude, thanks' },
  'G5547': { original: 'Χριστός', transliteration: 'Christos', definition: 'Christ, the Anointed One; the Messiah; Greek equivalent of Hebrew Mashiach' },
  'G5590': { original: 'ψυχή', transliteration: 'psychē', definition: 'Soul; life; the inner self; heart, mind; the seat of feelings and will' },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { strongsNumber, dictionary = 'strongs' } = await req.json();

    console.log(`Looking up ${strongsNumber} in ${dictionary}`);

    const normalizedNumber = strongsNumber.toUpperCase().trim();
    const isHebrew = normalizedNumber.startsWith('H');
    const language = isHebrew ? 'Hebrew' : 'Greek';

    // Check our local database first
    const entry = strongsDatabase[normalizedNumber];

    if (entry) {
      return new Response(
        JSON.stringify({
          result: {
            strongsNumber: normalizedNumber,
            originalWord: entry.original,
            transliteration: entry.transliteration,
            definition: entry.definition,
            language,
          },
          source: 'database'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If not in local database, use AI to generate definition
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({
          result: null,
          error: 'Definition not found in database'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Not in local DB, using AI lookup');

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
            content: `You are a biblical lexicon expert. Provide Strong's Concordance data for ${language} words.
Return ONLY valid JSON with these exact fields:
{
  "original": "the ${language} word in its native script",
  "transliteration": "how to pronounce it in English letters",
  "definition": "comprehensive definition (30-50 words)"
}
No markdown, no explanation, just the JSON object.`
          },
          {
            role: 'user',
            content: `Provide Strong's data for ${normalizedNumber}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '';
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const parsed = JSON.parse(content);
      return new Response(
        JSON.stringify({
          result: {
            strongsNumber: normalizedNumber,
            originalWord: parsed.original || '',
            transliteration: parsed.transliteration || '',
            definition: parsed.definition || '',
            language,
          },
          source: 'ai'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch {
      return new Response(
        JSON.stringify({
          result: null,
          error: 'Failed to parse AI response'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error: unknown) {
    console.error('Error in lookup-strongs:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ result: null, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
