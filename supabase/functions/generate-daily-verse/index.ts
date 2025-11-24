import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Genre codes for Connect 6
const GENRE_CODES = {
  gospel: "📖Gospel",
  law: "⚖️Law", 
  history: "📜History",
  poetry: "🎵Poetry",
  prophecy: "🔮Prophecy",
  epistle: "✉️Epistle"
};

// Palace principles that can be applied
const PALACE_PRINCIPLES = [
  // Floor 1 - Furnishing (Width)
  { code: "SR", name: "Story Room", description: "Turn verse into vivid mental movie with concrete imagery", category: "1st Floor" },
  { code: "IR", name: "Imagination Room", description: "Immerse yourself IN the scene - sensory details as if present", category: "1st Floor" },
  
  // Floor 2 - Investigation (Width)
  { code: "OR", name: "Observation Room", description: "Notice specific details, literary devices, textual clues", category: "2nd Floor" },
  { code: "DC", name: "Def-Com", description: "Examine Greek/Hebrew meanings and context", category: "2nd Floor" },
  { code: "ST", name: "Symbols/Types", description: "Identify concrete symbols/types pointing to Christ (e.g., lamb=Christ)", category: "2nd Floor" },
  
  // Floor 3 - Freestyle (Time)
  { code: "NF", name: "Nature Freestyle", description: "Connect to nature elements (tree, storm, sunrise, etc.)", category: "3rd Floor" },
  { code: "PF", name: "Personal Freestyle", description: "Apply to personal life experiences and journey", category: "3rd Floor" },
  { code: "BF", name: "Bible Freestyle", description: "Connect to related verses through verse genetics", category: "3rd Floor" },
  
  // Floor 4 - Next Level (Depth)
  { code: "CR", name: "Concentration Room", description: "Show HOW Christ is revealed in this verse", category: "4th Floor" },
  { code: "DR-Lit", name: "Literal Dimension", description: "What the text literally means", category: "4th Floor" },
  { code: "DR-Christ", name: "Christ Dimension", description: "How does it point to Jesus?", category: "4th Floor" },
  { code: "DR-Me", name: "Personal Dimension", description: "How does it apply to me?", category: "4th Floor" },
  { code: "DR-Church", name: "Church Dimension", description: "How does it apply to the church?", category: "4th Floor" },
  { code: "DR-Heaven", name: "Heaven Dimension", description: "How does it apply to heaven/eternity?", category: "4th Floor" },
  { code: "TRm", name: "Theme Room", description: "Map to Palace walls (Sanctuary, Life of Christ, Great Controversy, etc.)", category: "4th Floor" },
  { code: "PRm", name: "Patterns Room", description: "Name pattern and give at least one other biblical example with reference", category: "4th Floor" },
  { code: "P‖", name: "Parallels Room", description: "Cite at least ONE specific parallel event with reference", category: "4th Floor" },
  { code: "FRt", name: "Fruit Room", description: "Name specific Christlike character trait this cultivates", category: "4th Floor" },
  
  // Floor 5 - Vision (Depth)
  { code: "BL", name: "Blue Room", description: "Connect to specific sanctuary furniture/services", category: "5th Floor" },
  { code: "PR", name: "Prophecy Room", description: "Align with prophetic timelines", category: "5th Floor" },
  
  // Floor 6 - Three Heavens & Cycles (Depth)
  { code: "@Ad", name: "Adamic Cycle", description: "First cycle: Fall → Promise → Seed conflict", category: "6th Floor" },
  { code: "@Mo", name: "Mosaic Cycle", description: "Exodus → Covenant → Sanctuary nation", category: "6th Floor" },
  { code: "@CyC", name: "Cyrus-Christ Cycle", description: "Type meets antitype in Christ", category: "6th Floor" },
  { code: "@Sp", name: "Spirit Cycle", description: "Church age under Spirit power", category: "6th Floor" },
  { code: "@Re", name: "Remnant Cycle", description: "Final witness before Second Coming", category: "6th Floor" },
  
  // Floor 7 - Spiritual & Emotional (Height)
  { code: "FRm", name: "Fire Room", description: "Feel the emotional weight and conviction of the text", category: "7th Floor" },
  { code: "MR", name: "Meditation Room", description: "Slow down and marinate in the truth", category: "7th Floor" }
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
    
    // Select exactly one principle from each of the first 7 floors
    const floorOneRooms = PALACE_PRINCIPLES.filter(p => p.category === "1st Floor");
    const floorTwoRooms = PALACE_PRINCIPLES.filter(p => p.category === "2nd Floor");
    const floorThreeRooms = PALACE_PRINCIPLES.filter(p => p.category === "3rd Floor");
    const floorFourRooms = PALACE_PRINCIPLES.filter(p => p.category === "4th Floor");
    const floorFiveRooms = PALACE_PRINCIPLES.filter(p => p.category === "5th Floor");
    const floorSixRooms = PALACE_PRINCIPLES.filter(p => p.category === "6th Floor");
    const floorSevenRooms = PALACE_PRINCIPLES.filter(p => p.category === "7th Floor");
    
    // Pick exactly one principle from each floor (1-7)
    const selectedPrinciples = [
      floorOneRooms[Math.floor(Math.random() * floorOneRooms.length)],
      floorTwoRooms[Math.floor(Math.random() * floorTwoRooms.length)],
      floorThreeRooms[Math.floor(Math.random() * floorThreeRooms.length)],
      floorFourRooms[Math.floor(Math.random() * floorFourRooms.length)],
      floorFiveRooms[Math.floor(Math.random() * floorFiveRooms.length)],
      floorSixRooms[Math.floor(Math.random() * floorSixRooms.length)],
      floorSevenRooms[Math.floor(Math.random() * floorSevenRooms.length)]
    ].filter(Boolean); // Remove any undefined if a floor has no principles
    
    console.log('Selected diverse principles:', selectedPrinciples.map(p => `${p.code} (${p.category})`));
    
    // Curated list of impactful verses across genres and books
    const VERSE_LIBRARY = [
      { ref: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
      { ref: "Psalm 23:1", text: "The LORD is my shepherd; I shall not want." },
      { ref: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me." },
      { ref: "Proverbs 3:5-6", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." },
      { ref: "Romans 8:28", text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
      { ref: "Isaiah 40:31", text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." },
      { ref: "Matthew 11:28", text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest." },
      { ref: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },
      { ref: "2 Timothy 1:7", text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind." },
      { ref: "Joshua 1:9", text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest." },
      { ref: "1 Corinthians 13:4-5", text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil." },
      { ref: "Ephesians 2:8-9", text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast." },
      { ref: "Hebrews 11:1", text: "Now faith is the substance of things hoped for, the evidence of things not seen." },
      { ref: "Revelation 21:4", text: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away." },
      { ref: "Genesis 1:1", text: "In the beginning God created the heaven and the earth." },
      { ref: "Exodus 20:8", text: "Remember the sabbath day, to keep it holy." },
      { ref: "Daniel 12:3", text: "And they that be wise shall shine as the brightness of the firmament; and they that turn many to righteousness as the stars for ever and ever." },
      { ref: "1 John 4:19", text: "We love him, because he first loved us." },
      { ref: "Galatians 5:22-23", text: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, Meekness, temperance: against such there is no law." },
      { ref: "Colossians 3:2", text: "Set your affection on things above, not on things on the earth." },
    ];
    
    // Select verse based on day of year to ensure daily rotation
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const selectedVerse = VERSE_LIBRARY[dayOfYear % VERSE_LIBRARY.length];
    const verseReference = selectedVerse.ref;
    const verseText = selectedVerse.text;
    
    // Generate breakdown using Lovable AI with specific instructions per principle
    const principlesWithFloors = selectedPrinciples.map((p, idx) => {
      const floorNum = idx + 1;
      return `Floor ${floorNum}: ${p.code} - ${p.name} (${p.description})`;
    }).join('\n');
    
    const prompt = `You are a Phototheology expert demonstrating the CREATIVE GENIUS of the Phototheology system.

Verse: ${verseReference}
"${verseText}"

**THE POWER OF PHOTOTHEOLOGY**:
Phototheology's genius is that ANY verse can be analyzed through MULTIPLE analytical lenses to extract deeper meaning. You are NOT just identifying what the verse reveals - you are ACTIVELY APPLYING different tools to discover hidden connections and insights.

**CRITICAL - FLOOR ASSIGNMENTS**:
You MUST use the principles in the EXACT order given below. The floor number is determined by the position in the list:

${principlesWithFloors}

**VERSE GENRE (What is Revealed)**:
First, identify the verse's literary category - what TYPE of text this is:
Use ONE of these codes: 📖Gospel, ⚖️Law, 📜History, 🎵Poetry, 🔮Prophecy, or ✉️Epistle

**CRITICAL UNDERSTANDING**:
These principles are ANALYTICAL TOOLS, not just descriptions of what the verse "is about."
Show the FLEXIBILITY and DEPTH of Phototheology by making creative, insightful connections that reveal Christ in fresh ways.

**CRITICAL - SPECIFIC CODES FOR principle_applied**:
You MUST use these EXACT emoji/symbol codes in the principle_applied field:

For Connect 6 room: Use EXACT genre emoji codes:
  - 📖Gospel (not C6 or gospel)
  - ⚖️Law (not C6 or law)
  - 📜History (not C6 or history)
  - 🎵Poetry (not C6 or poetry)
  - 🔮Prophecy (not C6 or prophecy)
  - ✉️Epistle (not C6 or epistle)

For Time Zone room: Use EXACT zone emoji codes:
  - 🌍Past (not TZ or Earth Past)
  - 🌍Now (not TZ or Earth Now)
  - 🌍Future (not TZ or Earth Future)
  - ☁️Past (not TZ or Heaven Past)
  - ☁️Now (not TZ or Heaven Now)
  - ☁️Future (not TZ or Heaven Future)

For Cycle rooms: Use EXACT cycle codes:
  - @Ad (not Cycles or Adamic)
  - @Mo (not Cycles or Mosaic)
  - @CyC (not Cycles or Cyrus-Christ)
  - @Sp (not Cycles or Spirit)
  - @Re (not Cycles or Remnant)

For all other rooms (SR, IR, OR, DC, ST, CR, DR, TRm, PRm, P‖, FRt, BL, PR):
  - Use the exact room code as-is (e.g., SR, OR, CR)

CRITICAL INSTRUCTIONS FOR EACH PRINCIPLE TYPE:

**Story Room (SR)**: Create a vivid scene with concrete imagery (not generic statements).

**Imagination Room (IR)**: Place yourself IN the scene - describe sensory details as if you were actually present.

**Observation Room (OR)**: Point out specific words, literary devices, or textual patterns IN THE TEXT.

**Symbols/Types (ST)**: Name specific symbols with what they represent (e.g., "lamb = Christ in John 1:29", "water = Spirit in John 7:38").

**Concentration Room (CR)**: Explicitly show HOW Christ is revealed in this specific verse.

**Dimensions (DR-Lit, DR-Christ, DR-Me, DR-Church, DR-Heaven)**: Pick ONE specific dimension and show how the verse reveals meaning in that layer. Example for DR-Christ: "This verse reveals Christ as the ultimate gift - God's own Son given for humanity's redemption."

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

For EACH of the 7 principles listed above, provide:
1. principle_applied: The principle code exactly as shown (e.g., IR, ST, NF, DR-Christ, etc.)
2. floor: The floor number from the list above (Floor 1, Floor 2, Floor 3, Floor 4, Floor 5, Floor 6, or Floor 7)
3. application: A ROBUST, detailed paragraph (2-3 sentences minimum) showing HOW the principle is applied
4. key_insight: A memorable "gem" from this application
5. practical_takeaway: A clear, actionable step the reader can take today

**CRITICAL VALIDATION**: 
- verse_genre: ONE genre code (📖Gospel, ⚖️Law, 📜History, 🎵Poetry, 🔮Prophecy, or ✉️Epistle)
- breakdown: EXACTLY 7 items IN THE ORDER LISTED ABOVE
- Each principle_applied MUST match the code from the list above
- Each floor MUST match the floor number from the list above (Floor 1 through Floor 7)

Format your response as a structured JSON with this exact schema:
{
  "verse_genre": "📖Gospel",
  "breakdown": [
    {
      "principle_applied": "IR",
      "principle_code": "IR",
      "principle_name": "Imagination Room",
      "floor": "Floor 1",
      "application": "specific, concrete application",
      "key_insight": "memorable insight",
      "practical_takeaway": "clear action step"
    }
  ]
}

Make it engaging, Christ-centered, specific, and practically applicable.`;

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
      .eq('daily_verse', true);
    
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
        message: `${verseReference} - Explore with 7 Palace principles!`,
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
