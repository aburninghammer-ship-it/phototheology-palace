import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProgressId, dayNumber, passages, depthMode, regenerate } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Check if exercises already exist (unless regenerating)
    if (!regenerate) {
      const { data: existing } = await supabase
        .from('reading_plan_daily_exercises')
        .select('*')
        .eq('user_progress_id', userProgressId)
        .eq('day_number', dayNumber)
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({ exercises: existing.floor_exercises }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Generate exercises using AI
    const floorsConfigMap: Record<string, { floors: number[]; roomsPerFloor: number }> = {
      standard: { floors: [1, 2, 3], roomsPerFloor: 2 },
      focused: { floors: [1, 2, 3, 4, 5], roomsPerFloor: 3 },
      intensive: { floors: [1, 2, 3, 4, 5, 6, 7, 8], roomsPerFloor: 4 },
      deep: { floors: [1, 2, 3, 4, 5, 6, 7, 8], roomsPerFloor: 5 }
    };
    const floorsConfig = floorsConfigMap[depthMode] || { floors: [1, 2, 3, 4], roomsPerFloor: 3 };

    const passageText = passages.map((p: any) => `${p.book} ${p.chapter}${p.verses ? `:${p.verses}` : ''}`).join(', ');

    const systemPrompt = `You are a Phototheology Palace guide. Generate floor exercises for today's Bible reading that train students in the 8-Floor method.

For each floor, select ${floorsConfig.roomsPerFloor} different rooms and create prompts that engage the student.

FLOOR 1 (Furnishing - Memory):
Rooms: Story Room (SR), Imagination Room (IR), 24FPS (24), Bible Rendered (BR), Translation Room (TR), Gems Room (GR)

FLOOR 2 (Investigation):
Rooms: Observation Room (OR), Def-Com Room (DC), Symbols/Types (@T), Questions Room (?), Q&A Chains (QA)

FLOOR 3 (Freestyle):
Rooms: Nature Freestyle (NF), Personal Freestyle (PF), Bible Freestyle (BF), History/Social Freestyle (HF), Listening Room (LR)

FLOOR 4 (Next Level):
Rooms: Concentration Room (CR), Dimensions Room (DR), Connect 6 (C6), Theme Room (TRm), Time Zone (TZ), Patterns Room (PRm), Parallels Room (P‖), Fruit Room (FRt)

FLOOR 5 (Vision):
Rooms: Blue Room/Sanctuary (BL), Prophecy Room (PR), Three Angels' Room (3A)

FLOOR 6 (Cycles & Heavens):
Rooms: Cycle Placement (@Ad→@Re), Heaven Horizon (1H/2H/3H), Juice Room (JR)

FLOOR 7 (Spiritual/Emotional):
Rooms: Fire Room (FRm), Meditation Room (MR), Speed Room (SR)

FLOOR 8 (Master):
Rooms: Reflexive mastery (no specific rooms, just flowing naturally)

Return ONLY valid JSON with this structure:
{
  "exercises": [
    {
      "floorNumber": 1,
      "floorName": "Furnishing Floor",
      "title": "Story Room (SR) + Imagination Room (IR)",
      "rooms": ["SR", "IR"],
      "prompt": "Detailed, engaging prompt that guides the student...",
      "questions": ["Question 1?", "Question 2?", "Question 3?"]
    }
  ]
}`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Generate ${floorsConfig.floors.length} floor exercises (floors ${floorsConfig.floors.join(', ')}) for: ${passageText}. 
            
Each exercise should have ${floorsConfig.roomsPerFloor} rooms combined, with one unified prompt and 3 guiding questions. Make the prompts engaging, Christ-centered, and practical. Vary which rooms are used to keep it fresh.` 
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      throw new Error(`AI generation failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;
    
    if (!content) throw new Error('No AI response content');

    // Log the raw content for debugging
    console.log('Raw AI response:', content);

    // Try to extract JSON if it's wrapped in markdown code blocks
    let jsonString = content.trim();
    
    // Remove markdown code blocks if present
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse content:', jsonString.substring(0, 500));
      throw new Error(`Invalid JSON from AI: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
    
    const exercises = parsed.exercises || [];

    // Store in database
    const { error: upsertError } = await supabase
      .from('reading_plan_daily_exercises')
      .upsert({
        user_progress_id: userProgressId,
        day_number: dayNumber,
        passages: passages,
        floor_exercises: exercises,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_progress_id,day_number'
      });

    if (upsertError) throw upsertError;

    return new Response(
      JSON.stringify({ exercises }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating exercises:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to generate exercises' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});