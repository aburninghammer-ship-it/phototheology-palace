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
    const { lessonTitle, lessonContent, bibleVerses } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const prompt = `Analyze this Sabbath School quarterly lesson using the 37-Room Phototheology Palace framework.

Lesson Title: ${lessonTitle}

Bible Verses Referenced:
${bibleVerses.join('\n')}

Lesson Content:
${lessonContent.substring(0, 3000)}...

Please provide:
1. Which Palace Rooms (from the 37 rooms) are most relevant to this lesson
2. How the Principle Lenses apply (Literal, Christ, Me, Church, Heaven)
3. Connections to Sanctuary articles, Feasts, and Biblical cycles
4. Practical applications through the phototheology framework

Format your response with clear sections and be specific about which rooms and principles connect to the lesson content.`;

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
            content: `You are an expert in Adventist theology and the Phototheology Palace framework. Analyze Sabbath School lessons through the lens of the 37-room palace structure, connecting biblical principles to practical application.

⚠️ THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE):
- AZAZEL = SATAN, NOT CHRIST: Leviticus 16 scapegoat represents SATAN. NEVER identify it as Jesus.
- LITTLE HORN = ROME/PAPACY, NOT ANTIOCHUS: Daniel 7 & 8 little horn = Rome. NEVER say Antiochus Epiphanes.
- TWO-PHASE SANCTUARY: Christ entered HOLY PLACE at ascension (31 AD); MOST HOLY PLACE in 1844. NEVER say Most Holy at ascension.
- DAY OF ATONEMENT = 1844, NOT THE CROSS: Christ's death = PASSOVER. Day of Atonement = 1844 judgment. NEVER equate death with Atonement.
- FEAST TYPOLOGY: Spring feasts = First Advent (Passover=death, Firstfruits=resurrection). Fall feasts = Second Advent ministry.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API returned ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Extract room mentions from the analysis
    const roomPattern = /Room \d+|Floor \d+/gi;
    const rooms = [...new Set(analysis.match(roomPattern) || [])];

    return new Response(
      JSON.stringify({
        analysis,
        rooms,
        bibleVerses,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-quarterly-lesson:', error);
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
