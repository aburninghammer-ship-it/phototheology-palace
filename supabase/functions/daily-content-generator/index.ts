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

    // Generate tomorrow's content
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(6, 0, 0, 0);

    console.log('Generating content for:', tomorrow.toISOString());

    // Generate Daily Challenge
    const challengePrompt = `Create a Phototheology-based daily Bible study challenge that helps users memorize scripture using the 8-floor memory palace method (Foundation, Wisdom, Kingdom, Law, Grace, Prophecy, Glory, New Creation).

Requirements:
- Title: Engaging and descriptive
- Description: Guide users to create vivid mental images connecting verses. Include specific visualization instructions and practical applications.
- Select 3 related verses that build on each other
- Difficulty: choose from easy, intermediate, advance, or pro
- Focus on one of these themes: Sanctuary furniture, Biblical feasts, Prophetic timelines, Christ's ministry, or Memory palace techniques

Format your response as JSON:
{
  "title": "string",
  "description": "string (100-200 words with specific visualization instructions)",
  "verses": ["reference 1", "reference 2", "reference 3"],
  "difficulty": "easy|intermediate|advance|pro"
}`;

    const challengeResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: challengePrompt }],
      }),
    });

    if (!challengeResponse.ok) {
      throw new Error(`AI API error: ${challengeResponse.status}`);
    }

    const challengeData = await challengeResponse.json();
    const challengeContent = JSON.parse(challengeData.choices[0].message.content);

    // Insert challenge
    const { error: challengeError } = await supabase
      .from('challenges')
      .insert({
        title: challengeContent.title,
        description: challengeContent.description,
        verses: challengeContent.verses,
        difficulty: challengeContent.difficulty,
        challenge_type: 'daily',
        starts_at: tomorrow.toISOString(),
      });

    if (challengeError) {
      console.error('Challenge insert error:', challengeError);
      throw challengeError;
    }

    console.log('Daily challenge created:', challengeContent.title);

    // Generate Treasure Hunt
    const huntPrompt = `Create a biblical treasure hunt with 5-8 clues based on the 8-floor memory palace system.

Requirements:
- Title: Compelling biblical theme
- Difficulty: choose from easy, intermediate, advance, or pro (match number of clues: easy=5, intermediate=6, advance=7, pro=8)
- Biblical conclusion: Powerful summary of the biblical truth (one sentence)
- Clues: Each clue should have:
  * room_tag: one of (foundation, wisdom, kingdom, law, grace, prophecy, glory, new_creation)
  * principle: Short principle name
  * hint: Question that guides to answer (engaging, not too easy)
  * correct_answer: Single word or short phrase

Theme ideas: Biblical characters, prophecy, Christ's ministry, sanctuary service, salvation history, end times

Format as JSON:
{
  "title": "string",
  "difficulty": "easy|intermediate|advance|pro",
  "biblical_conclusion": "string",
  "clues": [
    {
      "room_tag": "foundation|wisdom|kingdom|law|grace|prophecy|glory|new_creation",
      "principle": "string",
      "hint": "string",
      "correct_answer": "string"
    }
  ]
}`;

    const huntResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: huntPrompt }],
      }),
    });

    if (!huntResponse.ok) {
      throw new Error(`AI API error for hunt: ${huntResponse.status}`);
    }

    const huntData = await huntResponse.json();
    const huntContent = JSON.parse(huntData.choices[0].message.content);

    // Calculate expiration (30 days from tomorrow)
    const expiration = new Date(tomorrow);
    expiration.setDate(expiration.getDate() + 30);

    // Insert treasure hunt
    const { data: hunt, error: huntError } = await supabase
      .from('treasure_hunts')
      .insert({
        title: huntContent.title,
        difficulty: huntContent.difficulty,
        total_clues: huntContent.clues.length,
        biblical_conclusion: huntContent.biblical_conclusion,
        expires_at: expiration.toISOString(),
      })
      .select()
      .single();

    if (huntError || !hunt) {
      console.error('Hunt insert error:', huntError);
      throw huntError;
    }

    console.log('Treasure hunt created:', huntContent.title);

    // Insert clues
    const clues = huntContent.clues.map((clue: any, index: number) => ({
      hunt_id: hunt.id,
      clue_number: index + 1,
      room_tag: clue.room_tag,
      principle: clue.principle,
      hint: clue.hint,
      correct_answer: clue.correct_answer,
    }));

    const { error: cluesError } = await supabase
      .from('treasure_hunt_clues')
      .insert(clues);

    if (cluesError) {
      console.error('Clues insert error:', cluesError);
      throw cluesError;
    }

    console.log(`Inserted ${clues.length} clues for hunt`);

    return new Response(
      JSON.stringify({
        success: true,
        challenge: challengeContent.title,
        hunt: huntContent.title,
        scheduled_for: tomorrow.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in daily-content-generator:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
