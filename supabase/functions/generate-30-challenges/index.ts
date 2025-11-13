import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
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
      { type: "dimension-drill", tier: "Quick", principle: "Dimensions Room (DR)" },
      { type: "connect-6", tier: "Quick", principle: "Connect 6 Room (C6)" },
      { type: "sanctuary-map", tier: "Core", principle: "Blue Room (BL)" },
      { type: "christ-chapter", tier: "Core", principle: "Concentration Room (CR)" },
      { type: "fruit-check", tier: "Quick", principle: "Fruit Room (FRt)" },
      { type: "subject-connection", tier: "Core", principle: "Multiple Rooms" },
      { type: "chef-recipe", tier: "Quick", principle: "Bible Freestyle (BF) + Concentration Room (CR)" },
      { type: "equation-decode", tier: "Core", principle: "Multiple Palace Principles" },
      { type: "70-questions", tier: "Deep", principle: "Questions Room (QR)" },
      { type: "principle-study", tier: "Core", principle: "Multiple Rooms" }
    ];

    const difficulties = ["easy", "intermediate", "advanced"];
    const createdChallenges = [];

    for (let day = 1; day <= 30; day++) {
      const challengeType = challengeTypes[day % challengeTypes.length];
      const difficulty = difficulties[Math.floor((day - 1) / 10)];

      const prompt = `Generate a daily Phototheology challenge for Day ${day} of 30.

Challenge Type: ${challengeType.type}
Tier: ${challengeType.tier}
Principle: ${challengeType.principle}
Difficulty: ${difficulty}

${challengeType.type === "chef-recipe" ? `
For chef-recipe challenges:
- Provide a theological theme (e.g., "The Gospel in 5 verses", "Sanctuary service from altar to ark", "State of the dead")
- Challenge users to create a coherent mini-sermon using ONLY Bible verse references (no commentary)
- Require 5-7 verses minimum
- Verses should flow together and build a complete theological point

Return JSON with:
{
  "title": "engaging title (e.g., 'Biblical Recipe: The Gospel Journey')",
  "description": "brief instructions (50-75 words)",
  "challenge_subtype": "chef-recipe",
  "challenge_tier": "${challengeType.tier}",
  "difficulty": "${difficulty}",
  "principle_used": "${challengeType.principle}",
  "ui_config": {
    "theme": "the theological theme to build",
    "min_verses": 5
  },
  "passage_reference": "Theme-based (no specific passage)",
  "expected_insights": ["insight about verse selection", "insight about theological flow"]
}
` : challengeType.type === "equation-decode" ? `
For equation-decode challenges:
- Provide a Bible verse
- Create an equation using Palace principle codes (e.g., "CR + 2D + BL + @CyC = ?")
- Use real Palace codes: CR (Concentration), DR (Dimensions), BL (Blue/Sanctuary), @CyC (Cyrus-Christ cycle), 1H/2H/3H (Heavens), etc.
- Challenge users to decode what each symbol means and how they combine to reveal Christ

Return JSON with:
{
  "title": "engaging title (e.g., 'Decode: John 3:16')",
  "description": "brief instructions (50-75 words)",
  "challenge_subtype": "equation-decode",
  "challenge_tier": "${challengeType.tier}",
  "difficulty": "${difficulty}",
  "principle_used": "${challengeType.principle}",
  "ui_config": {
    "equation": "CR + 2D + BL + @CyC",
    "hints": ["What does CR reveal about Christ?", "How does the sanctuary pattern appear?"]
  },
  "passage_reference": "Book Chapter:Verse",
  "expected_insights": ["insight about Christ-centered reading", "insight about sanctuary/cycles"]
}
` : challengeType.type === "70-questions" ? `
For 70-questions challenges:
- Provide a Bible passage (typically 3-10 verses)
- Challenge users to ask 70 questions (or aim for it): Intratextual, Intertextual, Phototheological
- Intratextual: questions within the text (Why this word? Why this order?)
- Intertextual: questions across Scripture (Where else? How does this connect?)
- Phototheological: questions within PT framework (Which rooms? Which cycle?)

Return JSON with:
{
  "title": "engaging title (e.g., '70 Questions on Daniel 7:13-14')",
  "description": "instructions emphasizing question types (75-100 words)",
  "challenge_subtype": "70-questions",
  "challenge_tier": "${challengeType.tier}",
  "difficulty": "${difficulty}",
  "principle_used": "${challengeType.principle}",
  "ui_config": {
    "target_questions": 70
  },
  "passage_reference": "Book Chapter:Verse(s)",
  "expected_insights": ["insight about interrogation depth", "insight about cross-textual connections"]
}
` : challengeType.type === "principle-study" ? `
For principle-study challenges:
- Provide a Bible passage
- Specify 2-3 Palace principles to apply (e.g., "Apply Dimensions Room, Patterns Room, and Cycles")
- Guide users through a structured study using those principles
- Include prompts like "How does the 5D (Heaven) dimension appear?" or "What cycle does this fall in?"

Return JSON with:
{
  "title": "engaging title (e.g., 'Multi-Principle Study: Isaiah 53')",
  "description": "detailed study instructions (100-150 words)",
  "challenge_subtype": "principle-study",
  "challenge_tier": "${challengeType.tier}",
  "difficulty": "${difficulty}",
  "principle_used": "${challengeType.principle}",
  "ui_config": {
    "principles": ["Dimensions Room (DR)", "Patterns Room (PRm)", "Cycles (@Cy)"],
    "prompts": ["What does the 5D dimension reveal?", "What pattern repeats here?", "Which cycle frames this text?"]
  },
  "passage_reference": "Book Chapter:Verse(s)",
  "expected_insights": ["insight about multi-dimensional reading", "insight about cycle placement"]
}
` : challengeType.type === "subject-connection" ? `
For subject-connection challenges:
- Present 2-3 biblical subjects that seem unrelated at first
- Guide users to discover deep connections between them using Palace principles
- Example subjects: "7 Churches of Revelation + Sanctuary Furniture", "Parable of Sower + Exodus Red Sea Crossing"
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
  "passage_reference": "Multiple passages",
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