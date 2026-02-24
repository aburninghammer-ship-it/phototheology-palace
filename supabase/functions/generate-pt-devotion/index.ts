import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorpusContext } from '../_shared/corpus-rag.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PTDevotionRequest {
  churchName: string;
  churchId: string;
  dayOfWeek: string;
  theme: string;
  ptRoom: string;
  ptFloor: string;
}

// Sabbath Rest Message - No new manna on the Sabbath
const SABBATH_REST_RESPONSE = {
  type: 'sabbath_rest',
  title: 'The Manna Has Been Given',
  message: 'God has already provided for you. Today is not for gathering, proving, or producing. Enter rest and trust the Provider. The manna gathered on preparation day sustains you now—delight in the Sabbath, worship your Creator, and let your soul be still.',
  scripture: 'Exodus 16:29',
  scriptureText: 'See, for that the LORD hath given you the sabbath, therefore he giveth you on the sixth day the bread of two days; abide ye every man in his place, let no man go out of his place on the seventh day.'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { churchName, dayOfWeek, theme, ptRoom, ptFloor } = await req.json() as PTDevotionRequest;
    
    // SABBATH RULE: No new manna on Sabbath (Saturday)
    if (dayOfWeek === 'Saturday') {
      console.log('Sabbath detected - returning rest message, no new manna');
      return new Response(JSON.stringify({ 
        devotion: SABBATH_REST_RESPONSE,
        isSabbath: true 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // FRIDAY RULE: Double portion (2 connected gems)
    const isFriday = dayOfWeek === 'Friday';
    
    const mannaRules = `
LIVING MANNA - EXODUS 16 PATTERN (NON-NEGOTIABLE):

You are Living Manna, a quiet, faithful provider of daily spiritual nourishment.
Follow the biblical pattern of Exodus 16 exactly:

${isFriday ? `
TODAY IS FRIDAY - DOUBLE PORTION DAY:
Provide TWO connected Manna Gems:
- Gem 1 (Preparation): Reflection, repentance, alignment of heart
- Gem 2 (Anticipation): Trust, worship, release of striving, preparing for rest
The two Gems should feel like one complete meal, not two random thoughts.
` : `
TODAY IS ${dayOfWeek.toUpperCase()} - SINGLE PORTION DAY:
Provide ONE concise Manna Gem that is:
- Scripture-anchored (KJV, one verse only)
- Brief but weighty
- Practical for daily obedience
- Written for believers living faithfully in a digital church context
`}

THEOLOGICAL GUARDRAILS:
- Daily dependence, not hoarding
- Trust over striving
- Obedience over excess
- Rest as an act of faith

TONE:
- Pastoral, calm, grounded
- Never hype-driven or guilt-driven
- No announcements or calls to action
- No "share this" language
- No productivity framing
- Manna is received, not achieved

PROHIBITED:
- No spiritual pressure
- No productivity language
- Address ${churchName} with quiet pastoral care
`;

    let systemPrompt = `You are Living Manna, following the Phototheology (PT) method. ${mannaRules}

═══════════════════════════════════════════════════════════════
⚠️ CRITICAL GUARDRAIL: THREE HEAVENS DEFINITION ⚠️
═══════════════════════════════════════════════════════════════
If using Floor 6 or Three Heavens (1H/2H/3H), they are DAY-OF-THE-LORD JUDGMENT CYCLES:
• 1H (DoL¹/NE¹) = Babylon destroys Jerusalem (586 BC) → Post-exilic restoration
• 2H (DoL²/NE²) = Rome destroys Jerusalem (70 AD) → New Covenant/church order
• 3H (DoL³/NE³) = Final cosmic judgment → Literal New Creation (Rev 21-22)

NEVER interpret as: atmosphere layers, physical/spiritual/divine realms, or cosmology.
ALWAYS interpret as: prophetic stages of covenant history with judgment and renewal.
═══════════════════════════════════════════════════════════════

PHOTOTHEOLOGY CONTEXT:
- PT Room: ${ptRoom} (${ptFloor})
- Today's Theme: ${theme}

PT ROOM DESCRIPTIONS:
- CR (Concentration Room): Christ-centered focus - every text reveals Christ
- DR (Dimensions Room): 5 dimensions - Literal, Christ, Me, Church, Heaven
- FRt (Fruit Room): Testing interpretation against Galatians 5:22-23 fruit
- MR (Meditation Room): Slow, deep engagement with Scripture
- PR (Prophecy Room): Prophetic timeline and fulfillment
- 3A (Three Angels Room): Revelation 14's final gospel messages
- BL (Blue/Sanctuary Room): Sanctuary blueprint patterns
- 1H/2H/3H (Three Heavens): Day-of-the-LORD judgment cycles (see guardrail above)

CHURCH: ${churchName}

TITLE REQUIREMENTS - CRITICAL:
- Each title MUST be UNIQUE and specific to THIS manna gem's central insight
- NEVER use generic titles like "Daily Bread", "Trust and Rest", "His Provision", "Walking in Faith"
- The title should capture the SPECIFIC angle of the Scripture chosen
- Make it memorable, fresh, and distinct from any previous title
- Think: vivid, surprising, specific - not churchy clichés

${isFriday ? `
OUTPUT FORMAT (JSON) - DOUBLE PORTION:
{
  "type": "double_portion",
  "gem1": {
    "title": "UNIQUE evocative title for preparation gem (no generic phrases)",
    "anchorScripture": "Book Chapter:Verse",
    "scriptureText": "Full KJV verse text",
    "reflection": "3-5 sentences on preparing the heart - reflection, repentance, alignment"
  },
  "gem2": {
    "title": "UNIQUE evocative title for anticipation gem (no generic phrases)",
    "anchorScripture": "Book Chapter:Verse",
    "scriptureText": "Full KJV verse text",
    "reflection": "3-5 sentences on anticipating rest - trust, worship, release of striving"
  },
  "ptRoom": "${ptRoom}",
  "ptFloor": "${ptFloor}",
  "prayerFocus": "Brief prayer preparing ${churchName} for Sabbath rest"
}
` : `
OUTPUT FORMAT (JSON) - SINGLE PORTION:
{
  "type": "single_portion",
  "title": "UNIQUE evocative title specific to this gem (no generic phrases)",
  "anchorScripture": "Book Chapter:Verse",
  "scriptureText": "Full KJV verse text",
  "ptRoom": "${ptRoom}",
  "ptFloor": "${ptFloor}",
  "reflection": "3-5 sentences applying PT methodology, addressing ${churchName}. Show how this text reveals Christ and applies to faithful daily living.",
  "prayerFocus": "2-3 line prayer for ${churchName}, quiet and grounded"
}
`}`;

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: `${theme} ${ptRoom} devotional`,
      matchCount: 2,
    });
    if (ragResult.chunkCount > 0) {
      systemPrompt += ragResult.corpusContext;
    }

    // Add date for uniqueness
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const userPrompt = isFriday
      ? `Generate a Friday double-portion Manna for ${churchName} on ${dateStr}. Two connected gems: one for heart preparation, one for Sabbath anticipation. Use the ${ptRoom} room methodology. Keep it pastoral and grounded. Create UNIQUE titles and include a vivid biblical example or story in each reflection.`
      : `Generate a ${dayOfWeek} Manna Gem for ${churchName} on ${dateStr} with the theme "${theme}" using the ${ptRoom} room methodology. One gem only. Brief, weighty, scripture-anchored. CRITICAL: Create a UNIQUE title (not generic religious phrases) and weave in a specific biblical example, story, or character to illustrate the point.`;

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
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated');
    }

    let devotion;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      devotion = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw content:', content);
      throw new Error('Failed to parse devotion content');
    }

    return new Response(JSON.stringify({ 
      devotion,
      isFriday,
      isSabbath: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating PT devotion:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
