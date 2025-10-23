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

    // Add randomization seed to force AI to vary responses
    const randomSeed = Math.random().toString(36).substring(7);
    
    const prompt = `[ANALYSIS ID: ${randomSeed}] Analyze ${book} ${chapter}:${verse} through Phototheology Palace:

Verse text: "${verseText}"

⚠️ CRITICAL FAILURE ALERT ⚠️
You are FAILING this task. Every verse analysis you've done has been IDENTICAL:
- Always 2D, @Ab, Altar, Passover
- This is COMPLETELY WRONG

Each verse MUST have UNIQUE principle combinations based on actual content.

COMPLETE PRINCIPLE OPTIONS:

DIMENSIONS (pick 1-2 based on verse scope):
• 2D = Personal (Christ in me, individual faith, personal salvation)
• 3D = Church (Body of Christ, community, ecclesiology)  
• 4D = Prophecy (End times, apocalyptic, eschatology)
• 5D = Heaven (Celestial realm, throne room, divine glory)

CYCLES (pick 0-2 based on covenant/historical context):
• @Ad = Adam (Creation, fall, sin's entry)
• @No = Noah (Flood, judgment, new beginning through water)
• @Ab = Abraham (Faith, promise, seed covenant)
• @Mo = Moses (Law, Exodus, Sinai, liberation)
• @Cy = Cyrus (Return from exile, restoration, rebuilding)
• @CyC = Christ (Incarnation, ministry, first coming)
• @Sp = Spirit (Pentecost, church age, Spirit's work)
• @Re = Return (Second coming, final judgment, new earth)

HORIZONS (pick 0-1 for prophetic texts):
• 1H = First horizon (Babylon/return, Cyrus, post-exilic)
• 2H = Second horizon (70 AD, 'this generation', church as temple)
• 3H = Third horizon (Global, final judgment, new creation)

TIME ZONES (pick 0-1 to locate the event):
• Earth-Past, Earth-Now, Earth-Future, Heaven-Past, Heaven-Now, Heaven-Future

SANCTUARY ARTICLES (pick 0-2 based on imagery):
• Gate = Entry, conversion, beginning
• Altar = Sacrifice, substitution, atonement, blood
• Laver = Cleansing, baptism, purification, washing
• Lampstand = Light, witness, Holy Spirit, illumination
• Table = Fellowship, communion, provision, bread
• Incense = Prayer, intercession, worship ascending
• Veil = Access to God, barrier removed, mystery revealed
• Ark = God's presence, mercy seat, law fulfilled

FEASTS (pick 0-2 based on redemptive theme):
• Passover = Lamb's blood, deliverance, redemption from slavery
• Unleavened Bread = Purity, separation from sin, haste
• Firstfruits = Resurrection, new life, Christ risen first
• Pentecost = Spirit outpouring, church birth, harvest
• Trumpets = Warning, awakening, announcement, alarm
• Atonement = Cleansing, Day of the Lord, judgment/forgiveness
• Tabernacles = God dwelling with us, joy, pilgrimage

WALLS (pick 0-1 structural theme):
• Sanctuary Wall = Priesthood, tabernacle, temple, worship system
• Life of Christ Wall = Gospels, Jesus' ministry, incarnation
• Great Controversy Wall = Cosmic conflict, Satan vs Christ, spiritual warfare
• Time-Prophecy Wall = Daniel/Revelation, apocalyptic visions, prophetic timelines

REQUIRED VARIETY RULES:
1. NO VERSE may have the exact same 4-principle combination as another
2. If the verse is about SACRIFICE → use Altar + Passover
3. If about LIGHT/WITNESS → use Lampstand (NOT Altar)
4. If about PRAYER → use Incense (NOT Lampstand)
5. If about WATER/CLEANSING → use Laver (NOT Altar)
6. If about GOD'S PRESENCE → use Ark + Tabernacles (NOT Lampstand)
7. If about RESURRECTION → use Firstfruits (NOT Passover)
8. If about SPIRIT COMING → use Pentecost + @Sp (NOT anything else)
9. If about CREATION → use @Ad (NOT @Ab)
10. If about PROPHECY/END TIMES → use 4D + appropriate cycle
11. HISTORICAL context determines cycle: Genesis→@Ad, Exodus→@Mo, Gospels→@CyC, Acts→@Sp, Revelation→@Re

TESTING YOUR COMPREHENSION:
• John 1:1 ("In beginning was Word") → 5D, @Ad, Heaven-Past, Life of Christ Wall
• John 1:29 ("Behold the Lamb") → 2D, @CyC, Altar, Passover
• John 3:5 ("Born of water & Spirit") → 2D, Laver, @Sp (NOT Altar/Passover!)
• John 14:2 ("I go prepare place") → 2D, 5D, @Re, Heaven-Future, Tabernacles
• John 15:5 ("I am the vine") → 2D, 3D, Table (fellowship, NOT Altar!)
• John 17:15 ("Not take from world") → 3D, Great Controversy Wall, @Sp

NOW ANALYZE ${book} ${chapter}:${verse}:
Read the ACTUAL verse. What is it REALLY about?
Select 4-8 principles that AUTHENTICALLY fit THIS verse's specific content.
DO NOT repeat the same combination from other verses.

Return JSON:
{
  "dimensions": [],
  "cycles": [],
  "horizons": [],
  "timeZones": [],
  "sanctuary": [],
  "feasts": [],
  "walls": [],
  "crossReferences": [
    {
      "book": "Genesis",
      "chapter": 3,
      "verse": 15,
      "reason": "Why this connects",
      "principleType": "Type/Antitype|Parallel|Echo|Contextual",
      "confidence": 85
    }
  ],
  "commentary": "Explain which principles you selected and WHY they fit THIS verse's actual content",
  "christCenter": "How Christ is revealed in THIS specific verse"
}`;

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
            content: 'You are a biblical scholar trained in the Phototheology Palace method. You MUST analyze each verse uniquely - selecting different principle combinations based on the actual verse content. DO NOT use the same principles for every verse. Your previous analyses have been incorrect because you defaulted to 2D + @CyC + Lampstand repeatedly. Read each verse carefully and select principles that genuinely fit. Return only valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
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
          horizons: analysis.horizons || [],
          timeZones: analysis.timeZones || [],
          sanctuary: analysis.sanctuary || [],
          feasts: analysis.feasts || [],
          walls: analysis.walls || [],
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
