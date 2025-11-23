import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Palace principles that can be applied
const PALACE_PRINCIPLES = [
  { code: "SR", name: "Story Room", description: "Recall narratives and visualize scenes" },
  { code: "IR", name: "Imagination Room", description: "Step inside the story with immersive empathy" },
  { code: "OR", name: "Observation Room", description: "Notice details like a detective" },
  { code: "DC", name: "Def-Com", description: "Examine Greek/Hebrew meanings and context" },
  { code: "ST", name: "Symbols/Types", description: "Identify types and symbols pointing to Christ" },
  { code: "CR", name: "Concentration Room", description: "Find Christ in every text" },
  { code: "DR", name: "Dimensions Room", description: "View text across 5 dimensions: Literal, Christ, Me, Church, Heaven" },
  { code: "C6", name: "Connect 6", description: "Classify by genre (prophecy, poetry, history, etc.)" },
  { code: "TRm", name: "Theme Room", description: "Map to Palace walls (Sanctuary, Life of Christ, Great Controversy, etc.)" },
  { code: "TZ", name: "Time Zone", description: "Locate in past, present, or future contexts" },
  { code: "PRm", name: "Patterns Room", description: "Recognize recurring motifs across Scripture" },
  { code: "P‖", name: "Parallels Room", description: "Find mirrored actions and events" },
  { code: "FRt", name: "Fruit Room", description: "Test if interpretation produces Christlike character" },
  { code: "BL", name: "Blue Room", description: "Connect to sanctuary furniture and services" },
  { code: "PR", name: "Prophecy Room", description: "Align with prophetic timelines" },
  { code: "@Ad", name: "Adamic Cycle", description: "First cycle: Fall → Promise → Seed conflict" },
  { code: "@Mo", name: "Mosaic Cycle", description: "Exodus → Covenant → Sanctuary nation" },
  { code: "@CyC", name: "Cyrus-Christ Cycle", description: "Type meets antitype in Christ" },
  { code: "@Sp", name: "Spirit Cycle", description: "Church age under Spirit power" },
  { code: "@Re", name: "Remnant Cycle", description: "Final witness before Second Coming" }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already have a verse for today
    const { data: existingVerse } = await supabase
      .from('daily_verses')
      .select('*')
      .eq('date', today)
      .single();
    
    if (existingVerse) {
      return new Response(
        JSON.stringify({ message: 'Daily verse already exists for today', verse: existingVerse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Select 3-5 random principles
    const numPrinciples = 3 + Math.floor(Math.random() * 3); // 3 to 5
    const shuffled = [...PALACE_PRINCIPLES].sort(() => Math.random() - 0.5);
    const selectedPrinciples = shuffled.slice(0, numPrinciples);
    
    // For demo, using a meaningful verse - in production, you'd have a curated list
    const verseReference = "John 3:16";
    const verseText = "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.";
    
    // Generate breakdown using Lovable AI
    const principlesDesc = selectedPrinciples.map(p => `- ${p.code} (${p.name}): ${p.description}`).join('\n');
    
    const prompt = `You are a Phototheology expert analyzing Scripture. Break down this verse using the following ${numPrinciples} palace principles:

${principlesDesc}

Verse: ${verseReference}
"${verseText}"

For EACH principle listed above, provide:
1. A brief application (2-3 sentences)
2. A key insight
3. A practical takeaway

Format your response as a structured JSON with this exact schema:
{
  "breakdown": [
    {
      "principle_code": "code",
      "principle_name": "name",
      "application": "detailed application text",
      "key_insight": "main insight",
      "practical_takeaway": "action step"
    }
  ]
}

Make it engaging, Christ-centered, and practically applicable.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a Phototheology expert teaching biblical principles.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const breakdown = JSON.parse(aiData.choices[0].message.content);
    
    // Store in database
    const { data: newVerse, error: insertError } = await supabase
      .from('daily_verses')
      .insert({
        verse_reference: verseReference,
        verse_text: verseText,
        principles_used: selectedPrinciples.map(p => p.code),
        breakdown: breakdown,
        date: today
      })
      .select()
      .single();
    
    if (insertError) throw insertError;
    
    // Get users who have daily verse notifications enabled
    const { data: usersWithPrefs } = await supabase
      .from('notification_preferences')
      .select('user_id')
      .eq('daily_verse_enabled', true);
    
    // Get all users who don't have preferences set (default to enabled)
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('id');
    
    const usersWithPrefsIds = new Set(usersWithPrefs?.map(p => p.user_id) || []);
    const allUserIds = allProfiles?.map(p => p.id) || [];
    
    // Include users with explicit opt-in AND users without any preference (default enabled)
    const usersToNotify = allUserIds.filter(userId => {
      const hasPreference = Array.from(usersWithPrefsIds).some(id => id === userId);
      return hasPreference || !usersWithPrefsIds.has(userId);
    });
    
    if (usersToNotify.length > 0) {
      const notifications = usersToNotify.map(userId => ({
        user_id: userId,
        type: 'daily_verse',
        title: '🌅 Today\'s Verse of the Day',
        message: `${verseReference} - Explore with ${numPrinciples} Palace principles!`,
        link: '/daily-verse',
        metadata: {
          verse_id: newVerse.id,
          verse_reference: verseReference
        }
      }));
      
      const { error: notifError } = await supabase
        .from('notifications')
        .insert(notifications);
      
      if (notifError) {
        console.error('Error creating notifications:', notifError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        verse: newVerse,
        notifications_sent: usersToNotify.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error generating daily verse:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
