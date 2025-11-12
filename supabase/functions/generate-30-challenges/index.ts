import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating 30 daily challenges...');

    const challengeTypes = [
      { type: "dimension-drill", tier: "Core", principle: "5 Dimensions (DR)" },
      { type: "connect-6", tier: "Quick", principle: "Connect 6 Genres (C6)" },
      { type: "sanctuary-map", tier: "Deep", principle: "Sanctuary Blueprint (BL)" },
      { type: "christ-chapter", tier: "Core", principle: "Christ in Every Chapter (CEC)" },
      { type: "fruit-check", tier: "Quick", principle: "Fruit Test (FRt)" },
      { type: "subject-connection", tier: "Core", principle: "Theme Connections (TRm)" },
    ];

    const difficulties = ["easy", "intermediate", "advanced"];
    const createdChallenges = [];

    for (let day = 1; day <= 30; day++) {
      const challengeType = challengeTypes[day % challengeTypes.length];
      const difficulty = difficulties[Math.floor((day - 1) / 10)];

      const prompt = `Create a Phototheology daily challenge for Day ${day} of 30.

Challenge Type: ${challengeType.type}
Difficulty: ${difficulty}
Principle Focus: ${challengeType.principle}

Create a ${challengeType.type} challenge that teaches users to apply ${challengeType.principle} to Scripture study.

${challengeType.type === "subject-connection" ? `
For SUBJECT CONNECTION challenges:
- Present 2-3 biblical subjects that seem unrelated at first
- Guide users to discover deep connections between them using Palace principles
- Example subjects: "7 Churches of Revelation + Sanctuary Furniture", "Parable of Sower + Exodus Red Sea Crossing", "Daniel's Beasts + Christ's Parables"
- Users should identify: shared symbols, parallel patterns, Christ-centered connections, prophetic links

Return JSON with:
{
  "title": "engaging title",
  "description": "detailed instructions (150-200 words)",
  "challenge_subtype": "${challengeType.type}",
  "challenge_tier": "${challengeType.tier}",
  "difficulty": "${difficulty}",
  "principle_used": "${challengeType.principle}",
  "ui_config": {
    "subjects": ["Subject 1", "Subject 2", "Subject 3 (optional)"],
    "connection_prompts": ["What symbols appear in both?", "How does Christ connect them?", "What prophetic pattern links them?"],
    "hints": ["hint 1", "hint 2"]
  },
  "passage_reference": "Book Chapter:Verse(s)",
  "expected_insights": ["insight 1", "insight 2", "insight 3"]
}
` : `
Return JSON with appropriate fields for ${challengeType.type}:
{
  "title": "engaging title",
  "description": "detailed instructions",
  "challenge_subtype": "${challengeType.type}",
  "challenge_tier": "${challengeType.tier}",
  "difficulty": "${difficulty}",
  "principle_used": "${challengeType.principle}",
  "ui_config": { appropriate config },
  "passage_reference": "Book Chapter:Verse",
  "expected_insights": ["insight 1", "insight 2"]
}
`}`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        console.error(`Failed to generate challenge for day ${day}`);
        continue;
      }

      const data = await response.json();
      const challenge = JSON.parse(data.choices[0].message.content);

      const { error } = await supabase
        .from('challenges')
        .insert({
          title: challenge.title,
          description: challenge.description,
          challenge_type: 'daily',
          challenge_subtype: challenge.challenge_subtype,
          challenge_tier: challenge.challenge_tier,
          difficulty: challenge.difficulty,
          principle_used: challenge.principle_used,
          ui_config: challenge.ui_config,
          passage_reference: challenge.passage_reference,
          expected_insights: challenge.expected_insights,
          day_in_rotation: day,
        });

      if (error) {
        console.error(`Error inserting challenge for day ${day}:`, error);
      } else {
        createdChallenges.push({ day, title: challenge.title });
        console.log(`✅ Created challenge ${day}/30: ${challenge.title}`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        created: createdChallenges.length,
        challenges: createdChallenges
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-30-challenges:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});