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

    console.log('Starting batch generation of escape rooms...');

    const configurations = [
      // Category Gauntlet - Prophecy
      { mode: 'category_gauntlet', category: 'prophecy' },
      { mode: 'category_gauntlet', category: 'sanctuary' },
      { mode: 'category_gauntlet', category: 'gospel_mission' },
      // Floor Race variations
      { mode: 'floor_race', category: null },
      { mode: 'floor_race', category: null },
    ];

    const results = [];

    for (const config of configurations) {
      try {
        const result = await generateEscapeRoom(supabase, LOVABLE_API_KEY, config);
        results.push(result);
        console.log(`Generated: ${result.title}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to generate ${config.mode} - ${config.category}:`, error);
        results.push({ error: error instanceof Error ? error.message : 'Unknown error', config });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        generated_count: results.filter((r: any) => !r.error).length,
        results: results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in batch-generate-escape-rooms:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function generateEscapeRoom(supabase: any, apiKey: string, config: any) {
  const { mode, category } = config;
  
  let systemPrompt = '';

  if (mode === 'category_gauntlet') {
    const categoryDescriptions = {
      prophecy: 'Daniel/Revelation spine, prophetic timelines (70 weeks, 2300 days), sanctuary cleansing, beast/horn symbolism',
      sanctuary: 'Sanctuary furniture flow (Altar→Laver→Table→Lampstand→Incense→Veil→Ark), Biblical feasts (Passover, Pentecost, Trumpets, Day of Atonement, Tabernacles), priestly typology and Christ-fulfillment',
      gospel_mission: 'Christ in every chapter, Room 66 theme threading, Great Commission patterns, gospel to all nations, Ethics and Church mission'
    };

    systemPrompt = `Create a 60-minute Category Gauntlet escape room for the "${category}" category.

CATEGORY FOCUS: ${categoryDescriptions[category as keyof typeof categoryDescriptions]}

ROOM ORDER (must follow exactly):
1. Story Room (≅ Type⇄Antitype) - Show how OT types prefigure NT fulfillment
2. Symbols Room (SYM-BEAST, SYM-LAMB, SYM-HORN, etc.) - Interpret biblical symbols consistently
3. Blue/Sanctuary - Walk through tabernacle furniture with Christ-centered typology
4. Mathematics/Timeline - Prophetic calculations (@70wks, @2300, time prophecies)
5. Room 66 + 24FPS - Thread themes across all 66 books + identify Cross frames

Then: META BOSS requiring synthesis across all 5 rooms.

VALID ROOM TAGS:
- SR (Story Room), ST (Symbols/Types), BL (Blue Room—Sanctuary)
- @ (Eight Cycles/Timeline), TZ (Time Zone), 3A (Three Angels)
- FE (Feasts Room), R66 (Room 66), 24 (24FPS Room)
- CR (Concentration Room), CEC (Christ in Every Chapter)

Create exactly 6 puzzles (5 rooms + 1 Meta Boss). Each must:
- Use EXACT room tag from valid list
- State the precise core question/principle for that room
- Give a clear prompt requiring 2-4 specific KJV verses
- List expected_verses as exact KJV references (Book Chapter:Verse)
- Include typology_notes (1-2 sentences of guidance)
- Points: Perfect=5, Partial=3 (Meta: Perfect=10, Partial=0)

Make puzzles challenging but solvable within ~9 minutes each. Meta requires 5-7 line synthesis touching all 5 rooms.

Format as JSON:
{
  "title": "string (compelling title emphasizing ${category} theme)",
  "biblical_conclusion": "string (2-3 sentences tying all puzzles to Christ-centered gospel)",
  "puzzles": [
    {
      "puzzle_number": 1,
      "room_tag": "SR",
      "principle": "What exactly happened—and in what order?",
      "prompt": "Clear challenge (2-3 sentences requiring specific verses)",
      "expected_verses": ["Genesis 3:15", "John 1:29"],
      "typology_notes": "Brief guidance (1-2 sentences)"
    }
  ]
}`;

  } else if (mode === 'floor_race') {
    systemPrompt = `Create a 60-minute Floor-by-Floor Race escape room with 7 floor puzzles + 1 Summit Meta.

FLOOR THEMES (must follow exactly):
1. Foundations (Story + Symbols): Proto-gospel (Gen 3:15), Messiah identification, type-antitype basics
2. Blue/Sanctuary (Altar–Laver): Sacrifice and cleansing meeting at the cross
3. 24FPS + Christ in Every Chapter: Cross frames visible from Torah through Gospels
4. Mathematics/Timeline + Room 66: 69 weeks to Messiah + everlasting gospel to all nations
5. Feasts + Blue (Holy Place): Festival typology paired with tabernacle furniture
6. Defense/Doctrine + Law/Worship: Spirit as Person + end-time saints' identity (Rev 14:12)
7. Judgment Scene (Dan-Rev): Heavenly court connected to Rev 14:7

Then: SUMMIT META "Maker, Mercy, Judgment" - Select best verses from prior floors showing Creator, Redeemer, Judge.

VALID ROOM TAGS:
- SR (Story), ST (Symbols), BL (Blue/Sanctuary), FE (Feasts)
- @ (Timeline), TZ (Time Zone), R66 (Room 66), 24 (24FPS)
- CR (Concentration), CEC (Christ in Every Chapter), 3A (Three Angels)
- DC (Def-Com), OR (Observation), FRt (Fruit Room)

Create exactly 8 puzzles (7 floors + 1 Summit). Each floor puzzle must:
- Use 2-3 valid room tags from that floor's theme
- Give clear prompt requiring 2-3 KJV verses
- List expected_verses as exact references
- Include typology_notes (1-2 sentences)
- Points: Perfect=4, Partial=2
- Time cap: 6 minutes (auto-advance after cap with solution shown)

Summit Meta must:
- Require selecting one verse each for Maker/Mercy/Judgment from prior work
- Demand 5-7 line synthesis showing why Rev 14:7 worship requires all three
- Points: Perfect=10, Partial=0

Format as JSON:
{
  "title": "string (epic title for this floor race to the summit)",
  "biblical_conclusion": "string (2-3 sentences of Christ-centered synthesis)",
  "puzzles": [
    {
      "puzzle_number": 1,
      "floor_number": 1,
      "room_tag": "SR",
      "principle": "What exactly happened—and in what order?",
      "prompt": "Challenge requiring 2-3 verses",
      "expected_verses": ["Genesis 3:15", "John 1:29"],
      "typology_notes": "Guidance (1-2 sentences)"
    }
  ]
}`;
  }

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
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
      category: category,
      difficulty: 'pro',
      time_limit_minutes: 60,
      max_hints: mode === 'category_gauntlet' ? 3 : 2,
      biblical_conclusion: content.biblical_conclusion,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (roomError || !room) {
    throw roomError;
  }

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
    throw puzzlesError;
  }

  return {
    room_id: room.id,
    title: content.title,
    mode: mode,
    category: category,
    puzzle_count: puzzleInserts.length,
  };
}