import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { getCorpusContext } from '../_shared/corpus-rag.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Curated list of impactful, standalone verses from across all 66 books
// These are verses that work well for daily devotional context
const CURATED_VERSES = [
  // Genesis
  "Genesis 1:1", "Genesis 1:26-27", "Genesis 3:15", "Genesis 12:1-3", "Genesis 15:6", "Genesis 22:14", "Genesis 28:15", "Genesis 50:20",
  // Exodus  
  "Exodus 3:14", "Exodus 14:14", "Exodus 15:2", "Exodus 20:2-3", "Exodus 33:14", "Exodus 34:6-7",
  // Leviticus
  "Leviticus 19:18", "Leviticus 20:26",
  // Numbers
  "Numbers 6:24-26", "Numbers 23:19",
  // Deuteronomy
  "Deuteronomy 4:29", "Deuteronomy 6:4-5", "Deuteronomy 7:9", "Deuteronomy 29:29", "Deuteronomy 31:6", "Deuteronomy 31:8",
  // Joshua
  "Joshua 1:8-9", "Joshua 24:15",
  // Judges
  "Judges 6:12",
  // Ruth
  "Ruth 1:16",
  // 1 Samuel
  "1 Samuel 2:2", "1 Samuel 15:22", "1 Samuel 16:7",
  // 2 Samuel
  "2 Samuel 7:22", "2 Samuel 22:2-3",
  // 1 Kings
  "1 Kings 8:56", "1 Kings 18:21",
  // 2 Kings
  "2 Kings 6:16",
  // 1 Chronicles - ONLY meaningful devotional verses
  "1 Chronicles 16:11", "1 Chronicles 16:34", "1 Chronicles 29:11-12",
  // 2 Chronicles
  "2 Chronicles 7:14", "2 Chronicles 16:9", "2 Chronicles 20:15",
  // Ezra
  "Ezra 8:22",
  // Nehemiah
  "Nehemiah 8:10",
  // Job
  "Job 1:21", "Job 13:15", "Job 19:25-26", "Job 23:10", "Job 42:5-6",
  // Psalms - A rich selection
  "Psalm 1:1-3", "Psalm 8:3-4", "Psalm 16:8", "Psalm 18:2", "Psalm 19:1", "Psalm 19:14", "Psalm 23:1", "Psalm 23:4", 
  "Psalm 24:1", "Psalm 27:1", "Psalm 27:4", "Psalm 32:8", "Psalm 34:8", "Psalm 37:4", "Psalm 37:23-24", "Psalm 40:2-3",
  "Psalm 42:1-2", "Psalm 46:1", "Psalm 46:10", "Psalm 51:10", "Psalm 55:22", "Psalm 56:3", "Psalm 62:1-2", "Psalm 63:1",
  "Psalm 73:25-26", "Psalm 84:10", "Psalm 90:12", "Psalm 91:1-2", "Psalm 100:4-5", "Psalm 103:1-2", "Psalm 103:12",
  "Psalm 119:11", "Psalm 119:105", "Psalm 121:1-2", "Psalm 139:14", "Psalm 139:23-24", "Psalm 145:18",
  // Proverbs
  "Proverbs 3:5-6", "Proverbs 3:9-10", "Proverbs 4:23", "Proverbs 9:10", "Proverbs 11:25", "Proverbs 16:3", 
  "Proverbs 16:9", "Proverbs 18:10", "Proverbs 22:6", "Proverbs 27:17", "Proverbs 31:30",
  // Ecclesiastes
  "Ecclesiastes 3:1", "Ecclesiastes 3:11", "Ecclesiastes 12:13-14",
  // Song of Solomon
  "Song of Solomon 2:4", "Song of Solomon 8:6-7",
  // Isaiah
  "Isaiah 6:8", "Isaiah 9:6", "Isaiah 25:8", "Isaiah 26:3", "Isaiah 30:15", "Isaiah 40:8", "Isaiah 40:28-31",
  "Isaiah 41:10", "Isaiah 43:1-2", "Isaiah 43:18-19", "Isaiah 53:5-6", "Isaiah 55:8-9", "Isaiah 55:11", "Isaiah 58:11", "Isaiah 61:1-3",
  // Jeremiah
  "Jeremiah 1:5", "Jeremiah 17:7-8", "Jeremiah 29:11", "Jeremiah 29:13", "Jeremiah 31:3", "Jeremiah 33:3",
  // Lamentations
  "Lamentations 3:22-23", "Lamentations 3:25-26",
  // Ezekiel
  "Ezekiel 36:26", "Ezekiel 37:3-5",
  // Daniel
  "Daniel 2:20-21", "Daniel 3:17-18", "Daniel 6:22", "Daniel 12:3",
  // Hosea
  "Hosea 6:3", "Hosea 14:4",
  // Joel
  "Joel 2:12-13", "Joel 2:28",
  // Amos
  "Amos 5:24",
  // Micah
  "Micah 6:8", "Micah 7:18-19",
  // Habakkuk
  "Habakkuk 2:14", "Habakkuk 3:17-18",
  // Zephaniah
  "Zephaniah 3:17",
  // Zechariah
  "Zechariah 4:6",
  // Malachi
  "Malachi 3:6", "Malachi 3:10",
  // Matthew
  "Matthew 5:14-16", "Matthew 5:43-44", "Matthew 6:33", "Matthew 7:7-8", "Matthew 11:28-30", "Matthew 16:24-25",
  "Matthew 18:20", "Matthew 19:26", "Matthew 22:37-39", "Matthew 28:18-20",
  // Mark
  "Mark 1:15", "Mark 8:34-35", "Mark 9:23-24", "Mark 10:27", "Mark 11:22-24", "Mark 12:30-31",
  // Luke
  "Luke 1:37", "Luke 6:27-28", "Luke 6:38", "Luke 9:23", "Luke 10:27", "Luke 11:9-10", "Luke 12:32", "Luke 15:10",
  // John
  "John 1:1", "John 1:12", "John 3:16-17", "John 4:14", "John 6:35", "John 8:12", "John 8:32", "John 10:10",
  "John 11:25-26", "John 13:34-35", "John 14:1-3", "John 14:6", "John 14:27", "John 15:4-5", "John 15:13", "John 16:33", "John 17:3",
  // Acts
  "Acts 1:8", "Acts 2:38", "Acts 4:12", "Acts 17:28", "Acts 20:35",
  // Romans
  "Romans 1:16", "Romans 3:23-24", "Romans 5:1", "Romans 5:8", "Romans 6:23", "Romans 8:1", "Romans 8:18",
  "Romans 8:28", "Romans 8:31", "Romans 8:37-39", "Romans 10:9-10", "Romans 12:1-2", "Romans 12:12", "Romans 15:13",
  // 1 Corinthians
  "1 Corinthians 1:18", "1 Corinthians 2:9", "1 Corinthians 6:19-20", "1 Corinthians 10:13", "1 Corinthians 10:31",
  "1 Corinthians 13:4-7", "1 Corinthians 13:13", "1 Corinthians 15:55-57", "1 Corinthians 16:13-14",
  // 2 Corinthians
  "2 Corinthians 1:3-4", "2 Corinthians 4:16-18", "2 Corinthians 5:7", "2 Corinthians 5:17", "2 Corinthians 5:21",
  "2 Corinthians 9:7-8", "2 Corinthians 12:9",
  // Galatians
  "Galatians 2:20", "Galatians 5:1", "Galatians 5:22-23", "Galatians 6:9",
  // Ephesians
  "Ephesians 2:8-10", "Ephesians 3:16-17", "Ephesians 3:20-21", "Ephesians 4:2-3", "Ephesians 4:32", "Ephesians 6:10-11",
  // Philippians
  "Philippians 1:6", "Philippians 2:3-4", "Philippians 2:13", "Philippians 3:13-14", "Philippians 4:4-5",
  "Philippians 4:6-7", "Philippians 4:8", "Philippians 4:13", "Philippians 4:19",
  // Colossians
  "Colossians 1:16-17", "Colossians 2:6-7", "Colossians 3:1-2", "Colossians 3:12-14", "Colossians 3:23-24",
  // 1 Thessalonians
  "1 Thessalonians 4:16-17", "1 Thessalonians 5:16-18",
  // 2 Thessalonians
  "2 Thessalonians 3:3",
  // 1 Timothy
  "1 Timothy 1:15", "1 Timothy 2:5", "1 Timothy 4:12", "1 Timothy 6:6",
  // 2 Timothy
  "2 Timothy 1:7", "2 Timothy 2:15", "2 Timothy 3:16-17", "2 Timothy 4:7-8",
  // Titus
  "Titus 2:11-12", "Titus 3:5",
  // Hebrews
  "Hebrews 4:12", "Hebrews 4:15-16", "Hebrews 10:23-25", "Hebrews 11:1", "Hebrews 11:6", "Hebrews 12:1-2",
  "Hebrews 13:5-6", "Hebrews 13:8",
  // James
  "James 1:2-4", "James 1:5", "James 1:12", "James 1:17", "James 1:22", "James 4:7-8", "James 5:16",
  // 1 Peter
  "1 Peter 1:3-4", "1 Peter 2:9", "1 Peter 3:15", "1 Peter 4:8", "1 Peter 5:6-7", "1 Peter 5:8-9",
  // 2 Peter
  "2 Peter 1:3-4", "2 Peter 3:9", "2 Peter 3:18",
  // 1 John
  "1 John 1:7", "1 John 1:9", "1 John 3:1", "1 John 4:7-8", "1 John 4:18-19", "1 John 5:4-5", "1 John 5:14-15",
  // Jude
  "Jude 1:24-25",
  // Revelation
  "Revelation 1:8", "Revelation 3:20", "Revelation 12:11", "Revelation 14:12", "Revelation 21:4", "Revelation 22:12-13",
];

// Fetch verse text from Bible API
async function fetchVerseText(reference: string): Promise<string> {
  try {
    const apiUrl = `https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Bible API error: ${response.status}`);
    }
    const data = await response.json();
    return data.text.trim();
  } catch (error) {
    console.error('Error fetching verse:', error);
    throw new Error(`Could not fetch verse: ${reference}`);
  }
}

// Palace principles organized by floor
const PALACE_PRINCIPLES = [
  // Floor 1 - Furnishing
  { code: "SR", name: "Story Room", floor: 1, description: "Vivid mental movie of the passage" },
  { code: "IR", name: "Imagination Room", floor: 1, description: "Step inside the scene - feel, see, hear" },
  { code: "TR", name: "Translation Room", floor: 1, description: "Abstract words → concrete images" },
  { code: "GR", name: "Gems Room", floor: 1, description: "Treasury of striking insights" },
  // Floor 2 - Investigation
  { code: "OR", name: "Observation Room", floor: 2, description: "Forensic details - fingerprints of meaning" },
  { code: "DC", name: "Def-Com", floor: 2, description: "Greek/Hebrew + cultural context" },
  { code: "ST", name: "Symbols/Types", floor: 2, description: "God's universal language - shadows of Christ" },
  { code: "QR", name: "Questions Room", floor: 2, description: "Intra/inter/phototheological questions" },
  // Floor 3 - Freestyle
  { code: "NF", name: "Nature Freestyle", floor: 3, description: "Nature as second book - creation sermon" },
  { code: "PF", name: "Personal Freestyle", floor: 3, description: "Life experiences as object lessons" },
  { code: "BF", name: "Bible Freestyle", floor: 3, description: "Verse genetics - family tree connections" },
  { code: "HF", name: "History Freestyle", floor: 3, description: "History/culture as teaching points" },
  // Floor 4 - Next Level
  { code: "CR", name: "Concentration Room", floor: 4, description: "Every text reveals Christ" },
  { code: "DR", name: "Dimensions Room", floor: 4, description: "5 dimensions: Literal, Christ, Me, Church, Heaven" },
  { code: "PRm", name: "Patterns Room", floor: 4, description: "Recurring motifs across Scripture" },
  { code: "P‖", name: "Parallels Room", floor: 4, description: "Mirrored actions across time" },
  { code: "FRt", name: "Fruit Room", floor: 4, description: "Test: produces Christlike character?" },
  // Floor 5 - Vision
  { code: "BL", name: "Blue Room (Sanctuary)", floor: 5, description: "Sanctuary blueprint of salvation" },
  { code: "PR", name: "Prophecy Room", floor: 5, description: "Prophetic telescope - Daniel/Revelation" },
  { code: "3A", name: "Three Angels", floor: 5, description: "Final gospel syllabus - Rev 14:6-12" },
  { code: "Feasts", name: "Feasts Room", floor: 5, description: "Israel's calendar pointing to Christ" },
  // Floor 6 - Three Heavens & Cycles
  { code: "@Mo", name: "Mosaic Cycle", floor: 6, description: "Exodus → Sinai → Tabernacle nation" },
  { code: "@CyC", name: "Cyrus-Christ Cycle", floor: 6, description: "Type meets Antitype" },
  { code: "@Re", name: "Remnant Cycle", floor: 6, description: "Final apostasy → Witness → Second Coming" },
  { code: "1H/2H/3H", name: "Three Heavens", floor: 6, description: "Day of the LORD horizons" },
  // Floor 7 - Spiritual & Emotional
  { code: "FRm", name: "Fire Room", floor: 7, description: "Emotional conviction - furnace experience" },
  { code: "MR", name: "Meditation Room", floor: 7, description: "Slow marination - breathe the words" },
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
    
    const { force, verse_reference } = await req.json().catch(() => ({ force: false, verse_reference: null }));
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already have a verse for today
    const { data: existingVerse } = await supabase
      .from('daily_verses')
      .select('*')
      .eq('date', today)
      .single();
    
    if (existingVerse && !force) {
      return new Response(
        JSON.stringify({ message: 'Daily verse already exists for today', verse: existingVerse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If force regeneration, delete existing verse
    if (existingVerse && force) {
      await supabase.from('daily_verses').delete().eq('date', today);
      console.log('Force regeneration: deleted existing verse for', today);
    }
    
    // Fetch recently used verse references to avoid repetition
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: recentDailyVerses } = await supabase
      .from('daily_verses')
      .select('verse_reference, principles_used')
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);
    
    const recentVerseRefs = new Set(recentDailyVerses?.map(v => v.verse_reference) || []);
    
    // Recently used principles (last 14 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const recentPrinciples = new Set<string>();
    recentDailyVerses?.forEach(v => {
      const verseDate = new Date(v.verse_reference);
      if (Array.isArray(v.principles_used)) {
        v.principles_used.forEach((code: string) => recentPrinciples.add(code));
      }
    });
    
    // Select verse
    let verseReference: string;
    let verseText: string;
    
    if (verse_reference) {
      verseReference = verse_reference;
      verseText = await fetchVerseText(verse_reference);
    } else {
      // Filter available verses - exclude recently used
      const availableVerses = CURATED_VERSES.filter(v => !recentVerseRefs.has(v));
      
      if (availableVerses.length === 0) {
        console.log('All curated verses used recently, resetting pool');
        // If all verses have been used, pick from full list
        const randomBytes = new Uint32Array(1);
        crypto.getRandomValues(randomBytes);
        const randomIndex = randomBytes[0] % CURATED_VERSES.length;
        verseReference = CURATED_VERSES[randomIndex];
      } else {
        // Use crypto-grade randomness
        const randomBytes = new Uint32Array(1);
        crypto.getRandomValues(randomBytes);
        const randomIndex = randomBytes[0] % availableVerses.length;
        verseReference = availableVerses[randomIndex];
      }
      
      console.log(`Selected verse: ${verseReference} from ${availableVerses.length} available verses`);
      verseText = await fetchVerseText(verseReference);
    }
    
    // Select one principle from each floor (1-7), preferring fresh ones
    const floors = [1, 2, 3, 4, 5, 6, 7];
    const selectedPrinciples: typeof PALACE_PRINCIPLES[0][] = [];
    
    for (const floorNum of floors) {
      const floorPrinciples = PALACE_PRINCIPLES.filter(p => p.floor === floorNum);
      const freshPrinciples = floorPrinciples.filter(p => !recentPrinciples.has(p.code));
      
      const pool = freshPrinciples.length > 0 ? freshPrinciples : floorPrinciples;
      const randomBytes = new Uint32Array(1);
      crypto.getRandomValues(randomBytes);
      const selected = pool[randomBytes[0] % pool.length];
      if (selected) {
        selectedPrinciples.push(selected);
      }
    }
    
    console.log('Selected principles:', selectedPrinciples.map(p => `${p.code} (Floor ${p.floor})`));
    
    // Generate breakdown using AI
    const principlesPrompt = selectedPrinciples.map((p, idx) => 
      `Floor ${p.floor}: ${p.code} - ${p.name} (${p.description})`
    ).join('\n');
    
const prompt = `You are a Phototheology Master analyzing Scripture through the 8-Floor Palace framework.

⚠️ PLAIN LANGUAGE RULE — CRITICAL: Your output text must be written in plain, natural English that any Bible reader can understand. Do NOT include technical shorthand codes in your output. This means:
- NO DoL¹/NE¹, DoL²/NE², DoL³/NE³ in any text
- NO @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re cycle codes
- NO 1H, 2H, 3H heaven codes
- NO room codes like SR, IR, TR, GR, OR, DC, ST, QR, CR, DR, PRm, P‖, FRt, BL, PR, 3A, FRm, MR in the written text
These codes are for INTERNAL ANALYSIS ONLY. Describe their concepts using full English words instead (e.g., say "the First Heaven judgment cycle" instead of "DoL¹/NE¹", "the Story Room" instead of "SR", "the Remnant cycle" instead of "@Re").


═══════════════════════════════════════════════════════════════
⚠️ CRITICAL GUARDRAIL: THREE HEAVENS DEFINITION ⚠️
═══════════════════════════════════════════════════════════════
The Three Heavens (1H/2H/3H) in Phototheology are NOT about atmospheric layers or cosmology.
They are THREE DAY-OF-THE-LORD JUDGMENT CYCLES:

• 1H (DoL¹/NE¹) = First Day of the LORD: Babylon destroys Jerusalem (586 BC) → Post-exilic restoration under Cyrus
• 2H (DoL²/NE²) = Second Day of the LORD: Rome destroys Jerusalem (70 AD) → New Covenant/heavenly sanctuary order, church as temple  
• 3H (DoL³/NE³) = Third Day of the LORD: Final cosmic judgment → Literal New Heaven and Earth (Rev 21-22)

NEVER interpret Three Heavens as:
❌ First atmosphere, second atmosphere, third atmosphere
❌ Physical world, spiritual realm, God's abode
❌ Earth realm, angelic realm, divine realm

ALWAYS interpret Three Heavens as prophetic horizons - stages of covenant history marked by judgment and renewal.
═══════════════════════════════════════════════════════════════

Verse: ${verseReference}
"${verseText}"

**YOUR ASSIGNED ROOMS** (Use EXACTLY these, in order):
${principlesPrompt}

For EACH room, provide a JSON object with:
- principle_applied: The room code (e.g., "SR", "CR")
- principle_name: Full name (e.g., "Story Room")
- floor: The floor number as string (e.g., "Floor 1")
- application: 2-3 sentences applying this room's methodology to the verse
- key_insight: One striking insight revealed through this lens
- practical_takeaway: One actionable application for daily life

═══════════════════════════════════════════════════════════════
⚠️ SPECIAL RULE FOR GEMS ROOM (GR) — CRITICAL ⚠️
═══════════════════════════════════════════════════════════════
If "GR" (Gems Room) is one of your assigned rooms, do NOT simply apply the daily verse.
Instead, the Gems Room produces a GEM: select 2-3 seemingly UNRELATED verses from different books of the Bible (NOT the daily verse itself) and reveal a powerful, unexpected connection between them — a hidden thread that ties them together and points to Christ.

For the GR entry:
- "application": State the 2-3 verses you chose (with full references), then explain the hidden connection that unites them into a single striking insight.
- "key_insight": The gem itself — the surprising theological thread revealed.
- "practical_takeaway": How this hidden connection deepens the believer's understanding or walk with Christ.

The gem must feel like a discovery — not an obvious cross-reference. Think: verses from different genres, eras, and contexts that share a buried link only visible through careful study.
═══════════════════════════════════════════════════════════════

Also identify the verse_genre using Connect-6: Gospel, Law, History, Poetry, Prophecy, or Epistle.

Return ONLY valid JSON in this format:
{
  "verse_genre": "string",
  "breakdown": [
    {
      "principle_applied": "string",
      "principle_name": "string", 
      "floor": "string",
      "application": "string",
      "key_insight": "string",
      "practical_takeaway": "string"
    }
  ]
}`;

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: 'daily verse Phototheology insight',
      matchCount: 2,
      supabaseClient: supabase,
    });
    const ragSection = ragResult.chunkCount > 0 ? ragResult.corpusContext : '';

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a Phototheology Master. Return ONLY valid JSON, no markdown or extra text.' + ragSection },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || '';
    
    // Clean and parse response
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    content = content.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    
    let breakdown;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        breakdown = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Parse error:', parseError, 'Content:', content.substring(0, 500));
      // Fallback breakdown
      breakdown = {
        verse_genre: "Poetry",
        breakdown: selectedPrinciples.map(p => ({
          principle_applied: p.code,
          principle_name: p.name,
          floor: `Floor ${p.floor}`,
          application: `This verse illuminates through the ${p.name} principle.`,
          key_insight: "God's Word reveals His character and plan.",
          practical_takeaway: "Meditate on this truth today."
        }))
      };
    }
    
    // Save to database
    const { data: savedVerse, error: saveError } = await supabase
      .from('daily_verses')
      .insert({
        date: today,
        verse_reference: verseReference,
        verse_text: verseText,
        principles_used: selectedPrinciples.map(p => p.code),
        breakdown: breakdown
      })
      .select()
      .single();
    
    if (saveError) {
      console.error('Error saving verse:', saveError);
      throw new Error('Failed to save daily verse');
    }
    
    console.log('Successfully generated and saved daily verse:', verseReference);
    
    return new Response(
      JSON.stringify({ message: 'Daily verse generated successfully', verse: savedVerse }),
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
