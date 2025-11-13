import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Get current month/year
    const now = new Date();
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Check if games already exist for this month
    const { data: existingGames } = await supabase
      .from('monthly_games')
      .select('id')
      .eq('month_year', monthYear);

    if (existingGames && existingGames.length >= 3) {
      return new Response(
        JSON.stringify({ message: "Games already generated for this month", games: existingGames }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate 3 unique game variations using AI
    const systemPrompt = `You are a creative game designer specializing in biblical learning games.
Generate innovative game variations that teach Bible knowledge through engaging mechanics.
Each game should be unique, fun, and educational.

Return a JSON array with 3 game objects, each containing:
{
  "game_name": "Creative game title",
  "game_description": "2-3 sentence description of the game and what makes it unique",
  "game_type": "One of: chain_chess_variant, verse_puzzle, prophecy_challenge, sanctuary_explorer, feast_timeline, symbol_match",
  "difficulty": "One of: kids, adults, advanced",
  "categories": ["Array of relevant categories"],
  "game_rules": {
    "objective": "What players are trying to achieve",
    "mechanics": "How the game is played step-by-step",
    "scoring": "How points are awarded",
    "special_features": "What makes this game unique",
    "example_challenge": "A sample challenge from the game"
  }
}`;

    const userPrompt = `Create 3 NEW biblical learning games for ${monthYear}.

Requirements:
1. Each game must be completely different from the others
2. Mix difficulty levels (1 kids, 1 adults, 1 advanced)
3. Use different game types
4. Incorporate Phototheology Palace concepts (rooms, principles, sanctuary, prophecy, etc.)
5. Make them engaging and replayable
6. Focus on different biblical themes or skills

Available game types:
- chain_chess_variant: Variations on the Chain Chess concept
- verse_puzzle: Puzzle-based verse learning
- prophecy_challenge: Daniel/Revelation prophecy games
- sanctuary_explorer: Games about the sanctuary and its meaning
- feast_timeline: Games about biblical feasts and their fulfillment
- symbol_match: Matching biblical symbols to their meanings

Available categories:
- Books of the Bible
- Rooms of the Palace
- Principles of the Palace
- Sanctuary Articles
- Biblical Feasts
- Prophecy Timelines
- Types and Shadows

Be creative! Think of mechanics like:
- Time-based challenges
- Pattern recognition
- Strategic verse selection
- Symbolic reasoning
- Historical chronology
- Collaborative storytelling

Return ONLY a valid JSON array of 3 game objects.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;
    
    // Parse the AI response
    let games;
    try {
      games = JSON.parse(content);
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (jsonMatch) {
        games = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    if (!Array.isArray(games) || games.length !== 3) {
      throw new Error('AI did not return 3 games as expected');
    }

    // Insert games into database
    const gamesToInsert = games.map(game => ({
      game_name: game.game_name,
      game_description: game.game_description,
      game_type: game.game_type,
      difficulty: game.difficulty,
      categories: game.categories,
      game_rules: game.game_rules,
      month_year: monthYear,
      is_active: true,
    }));

    const { data: insertedGames, error: insertError } = await supabase
      .from('monthly_games')
      .insert(gamesToInsert)
      .select();

    if (insertError) {
      throw insertError;
    }

    console.log(`Successfully generated ${insertedGames.length} games for ${monthYear}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        month_year: monthYear,
        games: insertedGames 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error generating monthly games:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
