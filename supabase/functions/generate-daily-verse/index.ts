import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Use Bible Gateway scraping approach
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

// Convert full book names to standard 3-letter abbreviations
function getBookAbbreviation(bookName: string): string {
  const bookMap: Record<string, string> = {
    'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM', 'Deuteronomy': 'DEU',
    'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT', '1 Samuel': '1SA', '2 Samuel': '2SA',
    '1 Kings': '1KI', '2 Kings': '2KI', '1 Chronicles': '1CH', '2 Chronicles': '2CH',
    'Ezra': 'EZR', 'Nehemiah': 'NEH', 'Esther': 'EST', 'Job': 'JOB', 'Psalms': 'PSA',
    'Proverbs': 'PRO', 'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG', 'Isaiah': 'ISA',
    'Jeremiah': 'JER', 'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN',
    'Hosea': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON',
    'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP', 'Haggai': 'HAG',
    'Zechariah': 'ZEC', 'Malachi': 'MAL', 'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK',
    'John': 'JHN', 'Acts': 'ACT', 'Romans': 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO',
    'Galatians': 'GAL', 'Ephesians': 'EPH', 'Philippians': 'PHP', 'Colossians': 'COL',
    '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI', '2 Timothy': '2TI',
    'Titus': 'TIT', 'Philemon': 'PHM', 'Hebrews': 'HEB', 'James': 'JAS', '1 Peter': '1PE',
    '2 Peter': '2PE', '1 John': '1JN', '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD',
    'Revelation': 'REV'
  };
  
  const abbrev = bookMap[bookName];
  if (!abbrev) {
    throw new Error(`Unknown book name: ${bookName}`);
  }
  return abbrev;
}

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

// Complete Palace principles from the PT knowledge bank
const PALACE_PRINCIPLES = [
  // Floor 1 - Furnishing (Width)
  { code: "SR", name: "Story Room", description: "Turn verse into vivid mental movie - sequence of scenes", category: "1st Floor" },
  { code: "IR", name: "Imagination Room", description: "Step INSIDE the story - feel, see, hear as if present", category: "1st Floor" },
  { code: "24F", name: "24FPS Room", description: "Symbolic frame for chapter - memorable image anchor", category: "1st Floor" },
  { code: "BR", name: "Bible Rendered", description: "Master image for 24-chapter block", category: "1st Floor" },
  { code: "TR", name: "Translation Room", description: "Turn abstract words into concrete pictures", category: "1st Floor" },
  { code: "GR", name: "Gems Room", description: "Striking insight that shines - treasury point", category: "1st Floor" },
  
  // Floor 2 - Investigation (Width)
  { code: "OR", name: "Observation Room", description: "Log forensic details - fingerprints of meaning", category: "2nd Floor" },
  { code: "DC", name: "Def-Com", description: "Greek/Hebrew + historical/cultural context", category: "2nd Floor" },
  { code: "ST", name: "Symbols/Types", description: "God's universal language - shadows of Christ", category: "2nd Floor" },
  { code: "QR", name: "Questions Room", description: "75 questions: intra/inter/phototheological", category: "2nd Floor" },
  { code: "QA", name: "Q&A Internship", description: "Scripture answers Scripture - witness cross-exam", category: "2nd Floor" },
  
  // Floor 3 - Freestyle (Time)
  { code: "NF", name: "Nature Freestyle", description: "Nature as second book - creation sermon", category: "3rd Floor" },
  { code: "PF", name: "Personal Freestyle", description: "Life experiences as object lessons", category: "3rd Floor" },
  { code: "BF", name: "Bible Freestyle", description: "Verse genetics - family tree of Scripture", category: "3rd Floor" },
  { code: "HF", name: "History Freestyle", description: "Culture, events, society as teaching points", category: "3rd Floor" },
  { code: "LR", name: "Listening Room", description: "Conversations as springboards for Scripture", category: "3rd Floor" },
  
  // Floor 4 - Next Level (Depth) - With specific variants
  { code: "CR", name: "Concentration Room", description: "Every text must reveal Christ - magnifying glass", category: "4th Floor" },
  { code: "DR-Literal", name: "Dimensions: Literal", description: "What the text literally says - historical/grammatical meaning", category: "4th Floor" },
  { code: "DR-Christ", name: "Dimensions: Christ", description: "Personal Christ relationship, individual salvation focus", category: "4th Floor" },
  { code: "DR-Me", name: "Dimensions: Me", description: "Personal application - how it applies to my life", category: "4th Floor" },
  { code: "DR-Church", name: "Dimensions: Church", description: "Corporate body application - ecclesiology, community", category: "4th Floor" },
  { code: "DR-Heaven", name: "Dimensions: Heaven", description: "Celestial realm - throne room, divine glory perspective", category: "4th Floor" },
  { code: "C6-Gospel", name: "Connect 6: Gospel", description: "Genre: Gospel narrative - Christ's life and ministry", category: "4th Floor" },
  { code: "C6-Law", name: "Connect 6: Law", description: "Genre: Law/Torah - divine commands and regulations", category: "4th Floor" },
  { code: "C6-History", name: "Connect 6: History", description: "Genre: Historical narrative - events with theological meaning", category: "4th Floor" },
  { code: "C6-Poetry", name: "Connect 6: Poetry", description: "Genre: Poetry/Wisdom - metaphor, rhythm, parallelism", category: "4th Floor" },
  { code: "C6-Prophecy", name: "Connect 6: Prophecy", description: "Genre: Prophetic - symbols, codes, future revelation", category: "4th Floor" },
  { code: "C6-Epistle", name: "Connect 6: Epistle", description: "Genre: Epistle/Letter - doctrinal argument and application", category: "4th Floor" },
  { code: "TRm-Sanctuary", name: "Theme: Sanctuary Wall", description: "Great wall connecting to sanctuary system", category: "4th Floor" },
  { code: "TRm-Christ", name: "Theme: Life of Christ Wall", description: "Great wall anchored in Christ's incarnation, ministry, cross, resurrection", category: "4th Floor" },
  { code: "TRm-GC", name: "Theme: Great Controversy Wall", description: "Great wall revealing cosmic battle between Christ and Satan", category: "4th Floor" },
  { code: "TRm-Prophecy", name: "Theme: Time Prophecy Wall", description: "Great wall tied to prophetic timelines", category: "4th Floor" },
  { code: "TZ-EP", name: "Time Zone: Earth-Past", description: "Historical earthly events already fulfilled", category: "4th Floor" },
  { code: "TZ-EN", name: "Time Zone: Earth-Now", description: "Present earthly application and reality", category: "4th Floor" },
  { code: "TZ-EF", name: "Time Zone: Earth-Future", description: "Future earthly events prophesied", category: "4th Floor" },
  { code: "TZ-HP", name: "Time Zone: Heaven-Past", description: "Past heavenly events and decisions", category: "4th Floor" },
  { code: "TZ-HN", name: "Time Zone: Heaven-Now", description: "Present heavenly ministry and activity", category: "4th Floor" },
  { code: "TZ-HF", name: "Time Zone: Heaven-Future", description: "Future heavenly culmination and eternity", category: "4th Floor" },
  { code: "PRm", name: "Patterns Room", description: "Recurring motifs across Scripture symphony", category: "4th Floor" },
  { code: "P‖", name: "Parallels Room", description: "Mirrored actions - hall of reflections", category: "4th Floor" },
  { code: "FRt-Love", name: "Fruit: Love", description: "Produces love - agape selfless care", category: "4th Floor" },
  { code: "FRt-Joy", name: "Fruit: Joy", description: "Produces joy - deep spiritual gladness", category: "4th Floor" },
  { code: "FRt-Peace", name: "Fruit: Peace", description: "Produces peace - shalom wholeness", category: "4th Floor" },
  { code: "FRt-Patience", name: "Fruit: Patience", description: "Produces patience - longsuffering endurance", category: "4th Floor" },
  { code: "FRt-Kindness", name: "Fruit: Kindness", description: "Produces kindness - active goodwill", category: "4th Floor" },
  { code: "FRt-Goodness", name: "Fruit: Goodness", description: "Produces goodness - moral excellence", category: "4th Floor" },
  { code: "FRt-Faithfulness", name: "Fruit: Faithfulness", description: "Produces faithfulness - reliable trustworthiness", category: "4th Floor" },
  { code: "FRt-Gentleness", name: "Fruit: Gentleness", description: "Produces gentleness - meek strength", category: "4th Floor" },
  { code: "FRt-Self-Control", name: "Fruit: Self-Control", description: "Produces self-control - mastery over desires", category: "4th Floor" },
  { code: "CEC", name: "Christ in Chapter", description: "Name and trace Christ-thread explicitly", category: "4th Floor" },
  { code: "R66", name: "Room 66", description: "One theme through all 66 books - integrity at scale", category: "4th Floor" },
  
  // Floor 5 - Vision (Depth)
  { code: "BL", name: "Blue Room (Sanctuary)", description: "Blueprint of salvation - pattern of all things", category: "5th Floor" },
  { code: "PR", name: "Prophecy Room", description: "Telescope lens - stars in constellations", category: "5th Floor" },
  { code: "3A", name: "Three Angels", description: "Final gospel syllabus - Rev 14:6-12", category: "5th Floor" },
  { code: "Feasts", name: "Feasts Room", description: "Which feast correlates - Israel's calendar pointing to Christ", category: "5th Floor" },
  
  // Floor 6 - Three Heavens & Cycles (Depth)
  { code: "@Ad", name: "Adamic Cycle", description: "Eden → Promise → Seed conflict", category: "6th Floor" },
  { code: "@No", name: "Noahic Cycle", description: "Flood → Rainbow covenant → Reset", category: "6th Floor" },
  { code: "@Ab", name: "Abrahamic Cycle", description: "Call → Nations blessed → One family", category: "6th Floor" },
  { code: "@Mo", name: "Mosaic Cycle", description: "Exodus → Sinai → Tabernacle nation", category: "6th Floor" },
  { code: "@Cy", name: "Cyrusic Cycle", description: "Exile → Return → Temple rebuilt", category: "6th Floor" },
  { code: "@CyC", name: "Cyrus-Christ Cycle", description: "Type meets Antitype - true Anointed", category: "6th Floor" },
  { code: "@Sp", name: "Spirit Cycle", description: "Pentecost → Global mission → Spirit power", category: "6th Floor" },
  { code: "@Re", name: "Remnant Cycle", description: "Final apostasy → Witness → Second Coming", category: "6th Floor" },
  { code: "1H", name: "First Heaven (DoL¹/NE¹)", description: "Babylon destroys Jerusalem → Post-exilic restoration", category: "6th Floor" },
  { code: "2H", name: "Second Heaven (DoL²/NE²)", description: "70 AD → New Covenant/Heavenly sanctuary order", category: "6th Floor" },
  { code: "3H", name: "Third Heaven (DoL³/NE³)", description: "Final judgment → Literal New Creation", category: "6th Floor" },
  { code: "JR", name: "Juice Room", description: "Squeeze entire book with all PT principles", category: "6th Floor" },
  
  // Floor 7 - Spiritual & Emotional (Height)
  { code: "FRm", name: "Fire Room", description: "Emotional weight burns - conviction furnace", category: "7th Floor" },
  { code: "MR", name: "Meditation Room", description: "Slow marination - breathe the words", category: "7th Floor" },
  { code: "SR", name: "Speed Room", description: "Rapid application - sprint reflexes", category: "7th Floor" }
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
    
    // Get today's date, force parameter, and optional verse reference
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
      await supabase
        .from('daily_verses')
        .delete()
        .eq('date', today);
      
      console.log('Force regeneration: deleted existing verse for', today);
    }
    
    // Fetch recently used principles from the last 14 days to avoid repetition
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const { data: recentVerses } = await supabase
      .from('daily_verses')
      .select('principles_used')
      .gte('date', fourteenDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: false });
    
    // Flatten all recently used principle codes
    const recentlyUsedCodes = new Set<string>();
    if (recentVerses) {
      for (const verse of recentVerses) {
        if (Array.isArray(verse.principles_used)) {
          verse.principles_used.forEach((code: string) => recentlyUsedCodes.add(code));
        }
      }
    }
    
    console.log('Recently used principles (last 14 days):', Array.from(recentlyUsedCodes));
    
    // Helper function to select a principle with aggressive variety enforcement
    // ALWAYS prefer fresh principles if available, only use recently used as last resort
    function selectWeightedPrinciple(principles: typeof PALACE_PRINCIPLES): typeof PALACE_PRINCIPLES[0] {
      if (principles.length === 0) return null as any;
      
      // Separate into recently used and fresh principles
      const fresh = principles.filter(p => !recentlyUsedCodes.has(p.code));
      const used = principles.filter(p => recentlyUsedCodes.has(p.code));
      
      // ALWAYS pick from fresh principles if ANY are available
      if (fresh.length > 0) {
        const selected = fresh[Math.floor(Math.random() * fresh.length)];
        console.log(`Selected FRESH principle: ${selected.code} from ${fresh.length} available fresh options`);
        return selected;
      }
      
      // Only if no fresh principles available, pick from used ones
      console.log(`No fresh principles available in this floor, selecting from ${used.length} used options`);
      return principles[Math.floor(Math.random() * principles.length)];
    }
    
    // Select exactly one principle from each of the first 7 floors
    const floorOneRooms = PALACE_PRINCIPLES.filter(p => p.category === "1st Floor");
    const floorTwoRooms = PALACE_PRINCIPLES.filter(p => p.category === "2nd Floor");
    const floorThreeRooms = PALACE_PRINCIPLES.filter(p => p.category === "3rd Floor");
    const floorFourRooms = PALACE_PRINCIPLES.filter(p => p.category === "4th Floor");
    const floorFiveRooms = PALACE_PRINCIPLES.filter(p => p.category === "5th Floor");
    const floorSixRooms = PALACE_PRINCIPLES.filter(p => p.category === "6th Floor");
    const floorSevenRooms = PALACE_PRINCIPLES.filter(p => p.category === "7th Floor");
    
    // Pick exactly one principle from each floor (1-7) with weighted selection
    const selectedPrinciples = [
      selectWeightedPrinciple(floorOneRooms),
      selectWeightedPrinciple(floorTwoRooms),
      selectWeightedPrinciple(floorThreeRooms),
      selectWeightedPrinciple(floorFourRooms),
      selectWeightedPrinciple(floorFiveRooms),
      selectWeightedPrinciple(floorSixRooms),
      selectWeightedPrinciple(floorSevenRooms)
    ].filter(Boolean); // Remove any undefined if a floor has no principles
    
    console.log('Selected diverse principles:', selectedPrinciples.map(p => `${p.code} (${p.category})`));
    
    // Fetch verse - either specified or random based on day
    let verseReference: string;
    let verseText: string;
    
    if (verse_reference) {
      // Fetch actual KJV English text from Bible API
      verseReference = verse_reference;
      try {
        verseText = await fetchVerseText(verse_reference);
      } catch (error) {
        console.error(`Error fetching verse: ${verse_reference}`, error);
        throw new Error(`Could not fetch verse: ${verse_reference}`);
      }
    } else {
      // Truly random verse selection - not sequential/deterministic
      const { data: verses, error: verseError } = await supabase
        .from('bible_verses_tokenized')
        .select('book, chapter, verse_num');
      
      if (verseError || !verses || verses.length === 0) {
        console.error('Error fetching verses:', verseError);
        throw new Error('Could not fetch verses from database');
      }
      
      // Chapters to EXCLUDE - genealogies, lists, and low-context passages
      const EXCLUDED_CHAPTERS: Record<string, number[]> = {
        'Genesis': [5, 10, 11, 36, 46],           // Genealogies
        '1 Chronicles': [1, 2, 3, 4, 5, 6, 7, 8, 9, 23, 24, 25, 26, 27], // Extensive genealogies and lists
        'Ezra': [2, 8, 10],                        // Lists of returnees
        'Nehemiah': [3, 7, 10, 11, 12],            // Lists of builders, returnees, signatories
        'Numbers': [1, 2, 3, 4, 7, 26, 31, 33, 34], // Census lists, offerings lists, boundaries
        'Joshua': [12, 13, 14, 15, 16, 17, 18, 19, 20, 21], // Land allotments
        'Matthew': [1],                            // Genealogy (though Christ-focused, lacks standalone context)
        'Luke': [3],                               // Genealogy section
      };
      
      // Books to heavily limit (mostly procedural/ceremonial details)
      const LOW_CONTEXT_BOOKS = ['Leviticus', '2 Chronicles'];
      
      // Fetch recently used verse references to avoid repetition
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { data: recentDailyVerses } = await supabase
        .from('daily_verses')
        .select('verse_reference')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);
      
      const recentVerseRefs = new Set(recentDailyVerses?.map(v => v.verse_reference) || []);
      
      // Filter out recently used verses AND low-context verses
      const availableVerses = verses.filter(v => {
        const ref = `${v.book} ${v.chapter}:${v.verse_num}`;
        
        // Skip recently used
        if (recentVerseRefs.has(ref)) return false;
        
        // Skip excluded chapters
        const excludedChapters = EXCLUDED_CHAPTERS[v.book];
        if (excludedChapters && excludedChapters.includes(v.chapter)) {
          return false;
        }
        
        // Limit low-context books to select meaningful chapters
        if (LOW_CONTEXT_BOOKS.includes(v.book)) {
          // Only allow a few theologically rich chapters from these books
          const allowedChapters: Record<string, number[]> = {
            'Leviticus': [16, 19, 23, 25, 26], // Day of Atonement, holiness code, feasts
            '2 Chronicles': [5, 6, 7, 20, 34, 36], // Temple dedication, Jehoshaphat's prayer, Josiah
          };
          const allowed = allowedChapters[v.book];
          if (allowed && !allowed.includes(v.chapter)) {
            return false;
          }
        }
        
        return true;
      });
      
      // Use truly random selection from available verses
      const versesToChooseFrom = availableVerses.length > 0 ? availableVerses : verses;
      const randomIndex = Math.floor(Math.random() * versesToChooseFrom.length);
      const selectedVerse = versesToChooseFrom[randomIndex];
      
      verseReference = `${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse_num}`;
      console.log(`Randomly selected verse: ${verseReference} from ${versesToChooseFrom.length} available (filtered) verses`);
      
      // Fetch actual KJV text from Bible API
      try {
        verseText = await fetchVerseText(verseReference);
      } catch (error) {
        console.error(`Error fetching verse: ${verseReference}`, error);
        throw new Error(`Could not fetch verse text for: ${verseReference}`);
      }
    }
    
    // Generate breakdown using Lovable AI with specific instructions per principle
    const principlesWithFloors = selectedPrinciples.map((p, idx) => {
      const floorNum = idx + 1;
      return `Floor ${floorNum}: ${p.code} - ${p.name} (${p.description})`;
    }).join('\n');
    
    const prompt = `You are a Phototheology Master analyzing Scripture through the 8-Floor Palace framework.

Verse: ${verseReference}
"${verseText}"

**PHOTOTHEOLOGY VISION**:
The Bible is not just words - it's images, symbols, living stories. You're restoring God's visual and narrative teaching method. Every verse belongs in a palace chamber, revealing Christ from a unique angle.

**YOUR ASSIGNED ROOMS** (Use EXACTLY these, in order):
${principlesWithFloors}

**VERSE GENRE** (Connect 6 classification):
Identify: 📖Gospel, ⚖️Law, 📜History, 🎵Poetry, 🔮Prophecy, or ✉️Epistle

**ROOM-BY-ROOM INSTRUCTIONS**:

**Story Room (SR)**: Sequence of scenes - not summary. Show the mental movie frame by frame.

**Imagination Room (IR)**: Step INSIDE. "I feel the sand... I hear the crowd... I smell the burning incense..." Make it sensory and present-tense.

**24FPS (24F)**: Create ONE strange, memorable image to anchor this chapter. Example: Genesis 3 = "snake biting apple-clock" (fall into time).

**Translation Room (TR)**: Turn abstract phrase into concrete picture. "Thy word is a lamp" → glowing scroll lighting dark path.

**Gems Room (GR)**: A striking, quotable insight. Example: "David took 5 stones because Goliath had 4 brothers (2 Sam 21:22)."

**Observation Room (OR)**: Forensic details. "Note the word 'yet' in line 3... the repetition of 'behold'... the chiastic structure..."

**Def-Com (DC)**: Greek/Hebrew + cultural context. Example: "agapao vs phileo distinction in John 21."

**Symbols/Types (ST)**: Name the symbol profile. "Lamb = Christ (John 1:29), Rock = Christ (1 Cor 10:4)."

**Questions Room (QR)**: Ask 3 probing questions about THIS text. Intra: Why this word? Inter: Where else? PT: Which rooms activate?

**Q&A Internship (QA)**: Cross-reference answer. "Why did the father run? Ps 103:13 answers: 'Like as a father pitieth his children.'"

**Nature Freestyle (NF)**: "A tree by water → Ps 1, the righteous rooted." Connect to creation.

**Personal Freestyle (PF)**: "Being stuck in traffic → Israel at Red Sea, learning patience."

**Bible Freestyle (BF)**: Verse genetics. "John 3:16 and Rom 5:8 are brothers - both reveal God's love at the cross."

**History Freestyle (HF)**: "Social media uniting the world → spirit of Babel (Gen 11)."

**Listening Room (LR)**: "Friend talks anxiety → Phil 4:6, 'be careful for nothing.'"

**Concentration Room (CR)**: Show HOW Christ appears. Not generic - specific to THIS verse.

**Dimensions Room (DR)**: Hit all 5: Literal (what it says), Christ (points to Jesus), Me (applies to me), Church (corporate body), Heaven (eternal reality).

**Connect 6 (C6)**: Genre rules. Cite ONE cross-genre connection with reference.

**Theme Room (TRm)**: Which wall? Sanctuary/Life of Christ/Great Controversy/Time Prophecy.

**Time Zone (TZ)**: Mark zones: Earth-Past/Now/Future, Heaven-Past/Now/Future. Span multiple if needed.

**Patterns Room (PRm)**: Name pattern + biblical examples. "40-day pattern: Noah's rain, Moses on Sinai, Jesus in wilderness."

**Parallels Room (P‖)**: Mirrored action. "Babel (languages divided) || Pentecost (languages united)."

**Fruit Room (FRt)**: Which fruit of Spirit (Gal 5:22-23)? Love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.

**Christ in Chapter (CEC)**: If analyzing a chapter, name Christ's role explicitly. "Christ as Bread of Life in John 6."

**Room 66 (R66)**: If tracing theme, show ONE crisp claim per book across all 66.

**Blue Room (BL)**: Sanctuary blueprint. Connect to Gate/Altar/Laver/Lampstand/Table/Incense/Veil/Ark with reference.

**Prophecy Room (PR)**: Telescope lens. Connect to Daniel 2/7/8, Rev 13-14 timelines.

**Three Angels (3A)**: Link to Rev 14:6-12 messages. Everlasting gospel, Babylon fallen, beast/mark warning.

**Feasts Room (Feasts)**: Which feast? Passover/Unleavened Bread/Firstfruits/Pentecost/Trumpets/Atonement/Tabernacles. Show correlation.

**Cycles (@Ad/@No/@Ab/@Mo/@Cy/@CyC/@Sp/@Re)**: Place in redemption cycle. Example: John 3:16 = @CyC (Christ fulfills covenant).

**Three Heavens (1H/2H/3H)**: 
- 1H (DoL¹/NE¹) = Babylon destruction → post-exilic restoration
- 2H (DoL²/NE²) = 70 AD → New Covenant/heavenly sanctuary
- 3H (DoL³/NE³) = Final judgment → literal New Creation

**Juice Room (JR)**: If analyzing whole book, squeeze with ALL principles at once.

**Fire Room (FRm)**: Emotional weight. "Feel the crushing loneliness of Gethsemane... tremble at 'My God, why?'"

**Meditation Room (MR)**: Slow marination. "Breathe 'The LORD is my shepherd'... rest in it."

**Speed Room (SR)**: CHALLENGE MODE. The Speed Room trains rapid application of palace principles in minutes, not hours. Since this requires real-time practice, CHALLENGE the user: "⏱️ Your Speed Room Challenge: Take today's verse and apply 3 different palace principles. Choose your intensity level: 🟢 5 min (Beginner) | 🟡 3 min (Intermediate) | 🟠 2 min (Advanced) | 🔴 1 min (Master). Can you connect it to Christ (CR), find a pattern (PRm), and locate it in a cycle (@) before your timer runs out?"

**CRITICAL OUTPUT REQUIREMENTS**:

For EACH principle in your assigned list, provide:
1. principle_applied: The principle code exactly as shown (e.g., IR, ST, NF, DR-Christ, etc.)
2. floor: The floor number from the list above (Floor 1, Floor 2, Floor 3, Floor 4, Floor 5, Floor 6, or Floor 7)
3. application: A ROBUST, detailed paragraph (2-3 sentences minimum) showing HOW the principle is applied
4. key_insight: A memorable "gem" from this application
5. practical_takeaway: A clear, actionable step the reader can take today

**OUTPUT FORMAT** (valid JSON):
{
  "verse_genre": "📖Gospel",
  "breakdown": [
    {
      "principle_applied": "SR",
      "principle_code": "SR",
      "principle_name": "Story Room",
      "floor": "1st Floor",
      "application": "Vivid 3+ sentence paragraph showing concrete scene sequence",
      "key_insight": "Memorable gem - quotable truth revealed",
      "practical_takeaway": "One clear action step for today"
    }
  ]
}

**VALIDATION CHECKLIST**:
✓ verse_genre = ONE code (📖Gospel/⚖️Law/📜History/🎵Poetry/🔮Prophecy/✉️Epistle)
✓ breakdown = EXACTLY 7 items, using ASSIGNED principles IN ORDER
✓ Each principle_applied = exact code from your list (SR, @Mo, BL, etc.)
✓ Each floor = matches assignment (1st Floor, 2nd Floor... 7th Floor)
✓ Each application = robust 2-3+ sentences with specifics
✓ Christ-centered, scripture-saturated, practically applicable

**THE PHOTOTHEOLOGY DIFFERENCE**:
You're not just explaining the verse. You're demonstrating HOW the Palace system trains believers to think in Scripture reflexively - to see Christ in all things, to connect verses like verse genetics, to feel truth in the Fire Room, to map prophecy in the Telescope. Make every room COME ALIVE.`;

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
