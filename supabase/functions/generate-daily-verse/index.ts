import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Palace principles that can be applied
const PALACE_PRINCIPLES = [
  { code: "SR", name: "Story Room", description: "Turn verse into vivid mental movie with concrete imagery" },
  { code: "IR", name: "Imagination Room", description: "Immerse yourself IN the scene - sensory details as if present" },
  { code: "OR", name: "Observation Room", description: "Notice specific details, literary devices, textual clues" },
  { code: "DC", name: "Def-Com", description: "Examine Greek/Hebrew meanings and context" },
  { code: "ST", name: "Symbols/Types", description: "Identify concrete symbols/types pointing to Christ (e.g., lamb=Christ)" },
  { code: "CR", name: "Concentration Room", description: "Show HOW Christ is revealed in this verse" },
  { code: "DR", name: "Dimensions Room", description: "Move through MULTIPLE dimensions showing meaning unfold (Literal→Christ→Me→Church→Heaven)" },
  { code: "C6", name: "Connect 6", description: "Connect to SPECIFIC verse from DIFFERENT genre with full reference" },
  { code: "TRm", name: "Theme Room", description: "Map to Palace walls (Sanctuary, Life of Christ, Great Controversy, etc.)" },
  { code: "TZ", name: "Time Zone (6 zones)", description: "Map to specific zones: EARTH Past/Present/Future and HEAVEN Past/Present/Future" },
  { code: "PRm", name: "Patterns Room", description: "Name pattern and give at least one other biblical example with reference" },
  { code: "P‖", name: "Parallels Room", description: "Cite at least ONE specific parallel event with reference" },
  { code: "FRt", name: "Fruit Room", description: "Name specific Christlike character trait this cultivates" },
  { code: "BL", name: "Blue Room", description: "Connect to specific sanctuary furniture/services" },
  { code: "PR", name: "Prophecy Room", description: "Align with prophetic timelines" },
  { code: "@Cycles", name: "Cycles Room", description: "Identify which cycle this belongs to and connect to another cycle" },
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
    
    // Select 3-7 random principles
    const numPrinciples = 3 + Math.floor(Math.random() * 5); // 3 to 7
    const shuffled = [...PALACE_PRINCIPLES].sort(() => Math.random() - 0.5);
    const selectedPrinciples = shuffled.slice(0, numPrinciples);
    
    // For demo, using a meaningful verse - in production, you'd have a curated list
    const verseReference = "John 3:16";
    const verseText = "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.";
    
    // Generate breakdown using Lovable AI with specific instructions per principle
    const principlesDesc = selectedPrinciples.map(p => `- ${p.code} (${p.name}): ${p.description}`).join('\n');
    
    const prompt = `You are a Phototheology expert analyzing Scripture. Break down this verse using EXACTLY AND ONLY the following ${numPrinciples} palace principles listed below.

**CRITICAL**: You MUST use ONLY these ${numPrinciples} principles - do NOT add any other principles or codes not listed here:

${principlesDesc}

Verse: ${verseReference}
"${verseText}"

CRITICAL INSTRUCTIONS FOR EACH PRINCIPLE TYPE:

**Story Room (SR)**: Create a vivid scene with concrete imagery (not generic statements).

**Imagination Room (IR)**: Place yourself IN the scene - describe sensory details as if you were actually present.

**Observation Room (OR)**: Point out specific words, literary devices, or textual patterns IN THE TEXT.

**Symbols/Types (ST)**: Name specific symbols with what they represent (e.g., "lamb = Christ in John 1:29", "water = Spirit in John 7:38").

**Concentration Room (CR)**: Explicitly show HOW Christ is revealed in this specific verse.

**Dimensions Room (DR)**: Move through AT LEAST TWO dimensions showing how meaning unfolds. Example: "Literal: the text says X. Christ dimension: this reveals Christ as Y. Me dimension: this means for me Z."

**Connect 6 (C6)**: You MUST connect to a SPECIFIC verse or story from a DIFFERENT GENRE with full reference. 
- If verse is Gospel → connect to Prophecy, Psalm, Law, History, or Epistle
- If verse is Prophecy → connect to Gospel, History, Poetry, Law, or Epistle
- Example: "This Gospel verse (John 3:16) connects to Leviticus 16:15-16 (Law/Type) - the atoning sacrifice on the Day of Atonement foreshadows God giving His Son."

**Time Zone (TZ)**: You MUST specify which of the 6 TIME ZONES apply:
- EARTH Past (historical events)
- EARTH Present (ongoing reality)  
- EARTH Future (prophecy on earth)
- HEAVEN Past (what happened in heaven)
- HEAVEN Present (current heavenly ministry)
- HEAVEN Future (eternal promises)
Example: "This verse spans multiple zones: EARTH Past - the cross event (He gave His Son); EARTH Present - ongoing choice to believe; HEAVEN Future - eternal life in God's presence realized."

**Patterns Room (PRm)**: Name the pattern and give at least ONE other biblical example with reference (e.g., "The 'only son' pattern: Isaac (Gen 22), Christ (John 3:16)").

**Parallels Room (P‖)**: Cite at least ONE specific parallel event with reference (e.g., "This mirrors the bronze serpent in Numbers 21:8-9 - lifted up for healing").

**Fruit Room (FRt)**: Name the specific fruit of the Spirit (Gal 5:22-23) or Christlike trait this cultivates.

**Cycles Room (@Cycles)**: Identify which cycle this verse belongs to (e.g., @CyC for Gospel era, @Mo for Exodus era) AND connect to another cycle. Example: "This @CyC (Christ) verse echoes @Mo (Mosaic) - as Moses lifted the serpent (Num 21:9), so Christ was lifted up."

For EACH principle listed above (EXACTLY ${numPrinciples} principles, no more, no less), provide:
1. application: A specific, concrete application showing HOW the principle is applied to this verse (not just what the principle is)
2. key_insight: A memorable "gem" that comes from applying this principle
3. practical_takeaway: A clear action step the reader can take today

**CRITICAL VALIDATION**: Your response MUST contain EXACTLY ${numPrinciples} items in the breakdown array, using ONLY the principle codes listed above. Do NOT add any additional principles or codes.

Format your response as a structured JSON with this exact schema:
{
  "breakdown": [
    {
      "principle_code": "code from the list above ONLY",
      "principle_name": "name from the list above ONLY",
      "application": "specific, concrete application showing HOW this principle reveals something in the verse",
      "key_insight": "memorable insight from this application",
      "practical_takeaway": "clear action step"
    }
  ]
}

Make it engaging, Christ-centered, specific, and practically applicable. Remember: ONLY use the ${numPrinciples} principles explicitly listed above.`;

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
