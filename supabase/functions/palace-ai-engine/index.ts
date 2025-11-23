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
    const { action, userId } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Fetch comprehensive user data
    const [drillResults, roomProgress, masteryLevels, reportCards] = await Promise.all([
      supabase.from('drill_results').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
      supabase.from('room_progress').select('*').eq('user_id', userId),
      supabase.from('room_mastery_levels').select('*').eq('user_id', userId),
      supabase.from('room_report_cards').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
    ]);

    if (action === 'analyze') {
      // Generate comprehensive learning profile analysis
      const analysisPrompt = `You are the Palace AI Engine, an advanced adaptive learning system for biblical study using the Phototheology method.

Analyze this user's learning data with DEEP PATTERN RECOGNITION to identify blind spots and predict struggles:

DRILL RESULTS (${drillResults.data?.length || 0} recent attempts):
${JSON.stringify(drillResults.data?.slice(0, 20) || [], null, 2)}

ROOM PROGRESS (${roomProgress.data?.length || 0} rooms):
${JSON.stringify(roomProgress.data || [], null, 2)}

MASTERY LEVELS:
${JSON.stringify(masteryLevels.data || [], null, 2)}

REPORT CARDS:
${JSON.stringify(reportCards.data?.map(r => ({
  room: r.room_id,
  level: r.mastery_level,
  strengths: r.report_data?.strengths,
  weaknesses: r.report_data?.weaknesses,
  mistakes: r.report_data?.mistakes
})) || [], null, 2)}

CRITICAL ANALYSIS REQUIREMENTS:

1. BLIND SPOT DETECTION - Identify what the user DOESN'T KNOW they don't know:
   - Patterns they consistently miss but don't recognize
   - Principles they skip over without realizing
   - Connections they fail to make repeatedly
   - Look for room transitions where confusion increases

2. STRUGGLE PREDICTION - Forecast future difficulties:
   - Based on current weaknesses, predict which verses/concepts will be hard
   - Identify prerequisite knowledge gaps that will cause future problems
   - Detect cognitive load patterns (when do they get overwhelmed?)
   - Predict which room principles will conflict with their current understanding

3. HIDDEN STRENGTHS - Find untapped potential:
   - Skills they use unconsciously
   - Natural learning patterns they don't recognize
   - Transferable abilities from strong rooms to weak rooms

Generate a JSON response with this EXACT structure (no additional text):
{
  "top_strengths": [
    {"room_id": "SR", "skill": "Visual memory", "confidence_score": 0.92, "evidence": "Consistently scores 90%+ on image recall"}
  ],
  "identified_weaknesses": [
    {"room_id": "CR", "skill": "Christ connections", "error_pattern": "Misses typological links", "frequency": "high"}
  ],
  "blind_spots": [
    {"room_id": "PRm", "principle": "Covenant patterns", "missed_count": 12, "context": "Never applies Abrahamic covenant structure to NT passages", "severity": "critical"}
  ],
  "learning_style": "visual|analytical|intuitive|mixed",
  "optimal_difficulty": "easy|medium|hard|expert",
  "attention_span_minutes": 20,
  "best_study_times": ["morning", "evening"],
  "accuracy_trend": [{"date": "2025-01-15", "score": 0.85}],
  "speed_improvement": [{"date": "2025-01-15", "avg_time": 45}],
  "consistency_score": 0.75,
  "predicted_struggles": [
    {"verse_ref": "Daniel 8:14", "room_id": "PR", "reason": "Requires sanctuary knowledge (blind spot) + time calculation (weakness)", "confidence": 0.87, "will_struggle_when": "Encountering symbolic time prophecy"}
  ],
  "recommended_focus_areas": ["Fill sanctuary knowledge gap before prophecy", "Practice covenant patterns"],
  "next_challenge_level": "medium|hard|expert",
  "cognitive_load_threshold": 3,
  "learning_velocity": "accelerating|steady|plateauing|declining"
}`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{ role: 'user', content: analysisPrompt }],
          response_format: { type: "json_object" }
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('AI API Error:', aiResponse.status, errorText);
        throw new Error(`AI analysis failed: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const analysis = JSON.parse(aiData.choices[0].message.content);

      // Upsert learning profile
      await supabase.from('user_learning_profiles').upsert({
        user_id: userId,
        ...analysis,
        last_analysis_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      return new Response(JSON.stringify({ success: true, profile: analysis }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'generate_drills') {
      const { roomId, count = 3 } = await req.json();
      
      // Get learning profile
      const { data: profile } = await supabase
        .from('user_learning_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!profile) {
        throw new Error('No learning profile found. Run analysis first.');
      }

      const weaknesses = profile.identified_weaknesses || [];
      const predictions = profile.predicted_struggles || [];

      const drillPrompt = `You are the Palace AI Engine. Generate ${count} personalized drills for room ${roomId}.

User's weaknesses: ${JSON.stringify(weaknesses.filter((w: any) => w.room_id === roomId))}
Predicted struggles: ${JSON.stringify(predictions.filter((p: any) => p.room_id === roomId))}
Optimal difficulty: ${profile.optimal_difficulty}
Learning style: ${profile.learning_style}

Generate drills that:
1. Target identified weaknesses
2. Test predicted struggle areas
3. Match optimal difficulty
4. Suit their learning style

Return JSON array with this structure:
[
  {
    "drill_type": "remedial|strengthening|challenge|prediction_test",
    "difficulty_level": "medium|hard",
    "target_skill": "Pattern recognition in covenants",
    "prompt": "Explain how the Abrahamic covenant relates to...",
    "expected_answer": "The pattern shows...",
    "hints": ["Consider Genesis 15", "Look at typology"],
    "verses_involved": ["Genesis 15:18", "Hebrews 11:8"],
    "principles_tested": ["Patterns", "Typology"],
    "generated_reason": "Addresses weakness in covenant connections",
    "addresses_weakness": true,
    "priority": 8
  }
]`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{ role: 'user', content: drillPrompt }],
          response_format: { type: "json_object" }
        }),
      });

      const aiData = await aiResponse.json();
      const drills = JSON.parse(aiData.choices[0].message.content);

      // Insert drills
      const drillRecords = drills.map((drill: any) => ({
        user_id: userId,
        room_id: roomId,
        floor_number: 4, // Default to depth floor
        ...drill,
        scheduled_for: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));

      await supabase.from('personalized_drills').insert(drillRecords);

      return new Response(JSON.stringify({ success: true, drills: drillRecords }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create_schedule') {
      const { focusRooms, duration = 'weekly' } = await req.json();
      
      const { data: profile } = await supabase
        .from('user_learning_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      const schedulePrompt = `Create a personalized practice schedule for these rooms: ${focusRooms.join(', ')}

User profile:
- Attention span: ${profile?.attention_span_minutes || 20} minutes
- Best study times: ${profile?.best_study_times?.join(', ') || 'flexible'}
- Recommended focus areas: ${profile?.recommended_focus_areas?.join(', ') || 'general'}
- Next challenge level: ${profile?.next_challenge_level || 'medium'}

Duration: ${duration}

Create a JSON schedule:
{
  "schedule_name": "Targeted Mastery Plan",
  "schedule_type": "weekly",
  "daily_goals": [
    {"day": "Monday", "rooms": ["SR"], "drills": 3, "time_minutes": 20, "focus": "Visual memory"},
    {"day": "Tuesday", "rooms": ["CR"], "drills": 2, "time_minutes": 15, "focus": "Christ connections"}
  ],
  "weekly_milestones": {
    "week1": "Complete Story Room drills",
    "week2": "Master Concentration Room basics"
  },
  "difficulty_progression": "gradual"
}`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{ role: 'user', content: schedulePrompt }],
          response_format: { type: "json_object" }
        }),
      });

      const aiData = await aiResponse.json();
      const schedule = JSON.parse(aiData.choices[0].message.content);

      const scheduleRecord = {
        user_id: userId,
        ...schedule,
        focus_rooms: focusRooms,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };

      const { data } = await supabase
        .from('practice_schedules')
        .insert(scheduleRecord)
        .select()
        .single();

      return new Response(JSON.stringify({ success: true, schedule: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Palace AI Engine error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});