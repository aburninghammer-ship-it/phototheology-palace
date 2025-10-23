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

    const { mode, category } = await req.json();
    
    console.log('Generating escape room:', mode, category);

    let systemPrompt = '';
    let puzzles: any[] = [];

    if (mode === 'category_gauntlet') {
      // Generate Category Gauntlet puzzles
      systemPrompt = `Create a 60-minute Category Gauntlet escape room for the "${category}" category.

CATEGORY DEFINITIONS:
- prophecy: Dan/Rev spine, timelines, symbols (Beast empires, 70 weeks, 2300 days, sanctuary cleansing)
- sanctuary: Furniture flow (Altar→Laver→Table→Lampstand→Incense→Veil→Ark), Feasts (Passover, Pentecost, Trumpets, Day of Atonement, Tabernacles), priestly typology
- gospel_mission: Christ in every chapter, Room 66 theme threading, Ethics/Church, Great Commission patterns

ROOM ORDER (fixed):
1. Story Room (≅ Type⇄Antitype)
2. Symbols Room (SYM-)
3. Blue/Sanctuary (Altar→Ark walk)
4. Mathematics/Timeline (@70wks, @2300, prophetic periods)
5. Room 66 + 24FPS pairing (Theme threading + Cross frames)

Create 5 puzzles + 1 Meta Boss. Each puzzle must:
- Specify room_tag from valid palace tags
- State the exact principle (core question)
- Give a clear prompt requiring KJV verses
- List 2-4 expected_verses as KJV references
- Include brief typology_notes (1-2 sentences)
- Perfect score: 5 pts, Partial: 3 pts

Meta Boss requirements:
- Multi-room synthesis requiring ≥5 rooms
- 5-7 line Christ-centered commentary
- Score: 10 pts perfect

Format as JSON:
{
  "title": "string (compelling title for this ${category} gauntlet)",
  "biblical_conclusion": "string (2-3 sentence synthesis)",
  "puzzles": [
    {
      "puzzle_number": 1,
      "room_tag": "EXACT tag (e.g., SR, ST, BL, @, FE)",
      "principle": "EXACT core question from that room",
      "prompt": "Clear challenge requiring specific verses (2-3 sentences)",
      "expected_verses": ["Book Chapter:Verse", "Book Chapter:Verse"],
      "typology_notes": "Brief 1-2 sentence guidance"
    }
  ]
}`;

    } else if (mode === 'floor_race') {
      // Generate Floor Race puzzles
      systemPrompt = `Create a 60-minute Floor-by-Floor Race escape room with 7 floor puzzles + 1 Summit Meta.

FLOOR THEMES:
1. Foundations (Story + Symbols): Proto-gospel, type-antitype basics
2. Blue/Sanctuary (Altar–Laver): Sacrifice and cleansing typology
3. 24FPS + Christ in Every Chapter: Cross frames across Scripture
4. Mathematics/Timeline + Room 66: Prophetic counts + global gospel
5. Feasts + Blue (Holy Place): Festival typology + furniture
6. Defense/Doctrine + Law/Worship: Spirit personhood + end-time identity
7. Judgment Scene (Dan-Rev): Heavenly court + Rev 14:7

Create 7 floor puzzles + 1 Summit Meta. Each floor puzzle must:
- Use 2-3 rooms from that floor's theme
- Specify room_tag and principle
- Give a clear prompt requiring 2-3 KJV verses
- List expected_verses
- Include brief typology_notes
- Perfect: 4 pts, Partial: 2 pts
- Time cap: 6 minutes per floor

Summit Meta ("Maker, Mercy, Judgment"):
- Requires selecting best verses from prior floors
- One verse each for: Creator, Redeemer, Judge
- 5-7 line synthesis showing why worship (Rev 14:7) requires all three
- Score: 10 pts

Format as JSON:
{
  "title": "string (compelling title for this floor race)",
  "biblical_conclusion": "string (2-3 sentence synthesis)",
  "puzzles": [
    {
      "puzzle_number": 1,
      "floor_number": 1,
      "room_tag": "EXACT tag",
      "principle": "EXACT core question",
      "prompt": "Challenge requiring 2-3 verses (2-3 sentences)",
      "expected_verses": ["Book Chapter:Verse"],
      "typology_notes": "Brief guidance (1-2 sentences)"
    }
  ]
}`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: systemPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = JSON.parse(aiData.choices[0].message.content);

    // Set expiration (60 minutes from now)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Insert escape room
    const { data: room, error: roomError } = await supabase
      .from('escape_rooms')
      .insert({
        title: content.title,
        mode: mode,
        category: mode === 'category_gauntlet' ? category : null,
        difficulty: 'pro',
        time_limit_minutes: 60,
        max_hints: mode === 'category_gauntlet' ? 3 : 2,
        biblical_conclusion: content.biblical_conclusion,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (roomError || !room) {
      console.error('Room insert error:', roomError);
      throw roomError;
    }

    console.log('Escape room created:', content.title);

    // Insert puzzles
    const puzzleInserts = content.puzzles.map((puzzle: any) => ({
      room_id: room.id,
      puzzle_number: puzzle.puzzle_number,
      floor_number: puzzle.floor_number || null,
      room_tag: puzzle.room_tag,
      principle: puzzle.principle,
      prompt: puzzle.prompt,
      expected_verses: puzzle.expected_verses,
      typology_notes: puzzle.typology_notes || '',
      points_perfect: mode === 'category_gauntlet' ? (puzzle.puzzle_number === 6 ? 10 : 5) : (puzzle.puzzle_number === 8 ? 10 : 4),
      points_partial: mode === 'category_gauntlet' ? (puzzle.puzzle_number === 6 ? 0 : 3) : (puzzle.puzzle_number === 8 ? 0 : 2),
      time_cap_minutes: mode === 'floor_race' ? 6 : null,
    }));

    const { error: puzzlesError } = await supabase
      .from('escape_room_puzzles')
      .insert(puzzleInserts);

    if (puzzlesError) {
      console.error('Puzzles insert error:', puzzlesError);
      throw puzzlesError;
    }

    console.log(`Inserted ${puzzleInserts.length} puzzles for escape room`);

    return new Response(
      JSON.stringify({
        success: true,
        room_id: room.id,
        title: content.title,
        mode: mode,
        expires_at: expiresAt.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-escape-room:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});