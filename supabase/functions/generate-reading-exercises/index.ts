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
    } else {
      // Delete existing exercises when regenerating to force new generation
      await supabase
        .from('reading_plan_daily_exercises')
        .delete()
        .eq('user_progress_id', userProgressId)
        .eq('day_number', dayNumber);
      
      console.log('Deleted existing exercises for regeneration');
    }

    // Generate exercises using AI
    // Helper function to randomly select n unique floors from 1-8
    const selectRandomFloors = (count: number): number[] => {
      const allFloors = [1, 2, 3, 4, 5, 6, 7, 8];
      const shuffled = allFloors.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count).sort((a, b) => a - b);
    };

    const floorsConfigMap: Record<string, { floorCount: number; roomsPerFloor: number }> = {
      standard: { floorCount: 3, roomsPerFloor: 2 },
      focused: { floorCount: 5, roomsPerFloor: 3 },
      intensive: { floorCount: 6, roomsPerFloor: 4 },
      deep: { floorCount: 8, roomsPerFloor: 5 }
    };
    const config = floorsConfigMap[depthMode] || { floorCount: 3, roomsPerFloor: 2 };
    
    // Randomly select floors each time (especially important when regenerating)
    const selectedFloors = selectRandomFloors(config.floorCount);
    console.log(`Selected floors for ${depthMode} mode (regenerate: ${regenerate}):`, selectedFloors);
    
    const floorsConfig = { floors: selectedFloors, roomsPerFloor: config.roomsPerFloor };

    const passageText = passages.map((p: any) => `${p.book} ${p.chapter}${p.verses ? `:${p.verses}` : ''}`).join(', ');

    const systemPrompt = "You are a Phototheology Palace guide. Generate floor exercises for today's Bible reading that train students in the 8-Floor method. Use only the floor numbers provided in the user message and return ONLY valid JSON with an 'exercises' array of { floorNumber, floorName, title, rooms (MUST be an array of room codes/names), prompt, questions (array of strings) }. CRITICAL: rooms must ALWAYS be an array, never a string.";


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
      // First attempt: parse the content directly
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error (first attempt):', parseError);
      console.error('Failed to parse content (first 500 chars):', jsonString.substring(0, 500));

      // Fallback 1: try to extract the JSON object between the first '{' and last '}'
      const firstBrace = jsonString.indexOf('{');
      const lastBrace = jsonString.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const sliced = jsonString.slice(firstBrace, lastBrace + 1);
        try {
          parsed = JSON.parse(sliced);
        } catch (secondError) {
          console.error('JSON parse error (second attempt):', secondError);
          console.error('Failed sliced content (first 500 chars):', sliced.substring(0, 500));
          throw new Error(`Invalid JSON from AI after cleanup: ${secondError instanceof Error ? secondError.message : 'Unknown error'}`);
        }
      } else {
        throw new Error(`Invalid JSON from AI: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
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