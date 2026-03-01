import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { getCorpusContext } from '../_shared/corpus-rag.ts';

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

    // Generate tomorrow's content
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(6, 0, 0, 0);

    console.log('Generating content for:', tomorrow.toISOString());

    // RAG corpus injection (single call, reused for both challenge and hunt)
    const ragResult = await getCorpusContext({
      query: 'Phototheology Bible study memory palace sanctuary',
      matchCount: 2,
      supabaseClient: supabase,
    });
    const ragSection = ragResult.chunkCount > 0 ? ragResult.corpusContext : '';

    // Generate Daily Challenge
    const challengePrompt = `Create a Phototheology-based daily Bible study challenge that helps users memorize scripture using the 8-floor memory palace method (Foundation, Wisdom, Kingdom, Law, Grace, Prophecy, Glory, New Creation).

Requirements:
- Title: Engaging and descriptive
- Description: Guide users to create vivid mental images connecting verses. Include specific visualization instructions and practical applications.
- Select 3 related verses that build on each other
- Difficulty: choose from easy, intermediate, advance, or pro
- Focus on one of these themes: Sanctuary furniture, Biblical feasts, Prophetic timelines, Christ's ministry, or Memory palace techniques

Format your response as JSON:
{
  "title": "string",
  "description": "string (100-200 words with specific visualization instructions)",
  "verses": ["reference 1", "reference 2", "reference 3"],
  "difficulty": "easy|intermediate|advance|pro"
}`;

    const challengeResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          ...(ragSection ? [{ role: 'system', content: ragSection }] : []),
          { role: 'user', content: challengePrompt },
        ],
      }),
    });

    if (!challengeResponse.ok) {
      throw new Error(`AI API error: ${challengeResponse.status}`);
    }

    const challengeData = await challengeResponse.json();
    const rawChallengeContent = challengeData.choices[0].message.content;
    // Extract JSON from markdown code blocks if present
    const challengeJsonMatch = rawChallengeContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    const challengeJsonStr = challengeJsonMatch ? challengeJsonMatch[1].trim() : rawChallengeContent.trim();
    const challengeContent = JSON.parse(challengeJsonStr);

    // Insert challenge
    const { error: challengeError } = await supabase
      .from('challenges')
      .insert({
        title: challengeContent.title,
        description: challengeContent.description,
        verses: challengeContent.verses,
        difficulty: challengeContent.difficulty,
        challenge_type: 'daily',
        starts_at: tomorrow.toISOString(),
      });

    if (challengeError) {
      console.error('Challenge insert error:', challengeError);
      throw challengeError;
    }

    console.log('Daily challenge created:', challengeContent.title);

    // Generate Treasure Hunt - Palace Methodology Training
    const huntPrompt = `Create a biblical treasure hunt that TEACHES Phototheology Palace methodology through progressive clues. Each clue should guide users through actual Palace rooms and their principles.

FORMAT: Create 8-10 clues that progress through Palace floors, teaching the methodology:

PALACE ROOMS & PRINCIPLES:

FLOOR 1 - FURNISHING (Memory & Width):
- SR (Story Room): "What exactly happened—and in what order?" → Story sequencing
- IR (Imagination Room): "What does it feel like to stand there?" → Immersive experience
- 24 (24FPS Room): "What image will make this chapter unforgettably findable?" → Chapter frames
- BR (Bible Rendered): "What block image captures this 24-chapter arc?" → Book rendering
- TR (Translation Room): "What does this verse look like?" → Verse visualization
- GR (Gems Room): "What powerful insight sparkles here?" → Insight collection

FLOOR 2 - INVESTIGATION (Detective Work):
- OR (Observation Room): "What 30 fingerprints/footprints can I log?" → Detail noticing
- DC (Def-Com Room): "What does this word mean (Greek/Hebrew/context)?" → Word study
- ST (Symbols/Types Room): "What does this symbol/type point to?" → Typology
- QR (Questions Room): "What intra/inter/PT questions reveal depth?" → Interrogation
- QA (Q&A Chains Room): "What verse answers this verse?" → Cross-reference

FLOOR 3 - FREESTYLE (Time Expansion):
- NF (Nature Freestyle): "What in nature illustrates this truth?" → Natural theology
- PF (Personal Freestyle): "How does this connect to my life?" → Application
- BF (Bible Freestyle): "What verse cousins relate here?" → Verse genetics
- HF (History/Social Freestyle): "How does history/culture echo this?" → Contextual parallels
- LR (Listening Room): "What sermon/quote connects?" → Active listening

FLOOR 4 - NEXT LEVEL (Depth):
- CR (Concentration Room): "Where is Christ in this text?" → Christ-centered focus
- DR (Dimensions Room): "Show 5 dimensions: Literal/Christ/Me/Church/Heaven" → Layered meaning
- C6 (Connect 6): "What genre (prophecy/poetry/history/gospel/epistle/parable)?" → Genre rules
- TRm (Theme Room): "Which wall? Sanctuary/Christ Life/Great Controversy/Time Prophecy" → Theme placement
- TZ (Time Zone): "Past, present, or future? Earth or heaven?" → Timeline
- PRm (Patterns Room): "What repeating motif appears?" → Pattern recognition
- P‖ (Parallels Room): "What mirrored action echoes here?" → Historical reflection
- FRt (Fruit Room): "Does this interpretation produce Christlike fruit?" → Validation
- CEC (Christ in Every Chapter): "How is Christ present in THIS chapter?" → Chapter Christ focus
- R66 (Room 66): "Trace this theme across all 66 books" → Bible-wide themes

FLOOR 5 - VISION (Prophecy & Sanctuary):
- BL (Blue/Sanctuary Room): "How does sanctuary furniture map this truth?" → Blueprint
- PR (Prophecy Room): "Which prophetic timeline does this fulfill?" → Telescope
- 3A (Three Angels): "How do the Three Angels' Messages apply?" → Mission
- FE (Feasts Room): "Which feast correlates to this text/story?" → Festival calendar

FLOOR 6 - THREE HEAVENS (Cycles):
- @Ad (Adamic): Eden → Promise cycle
- @No (Noahic): Flood → Covenant cycle  
- @Ab (Abrahamic): Call → People cycle
- @Mo (Mosaic): Exodus → Nation cycle
- @Cy (Cyrusic): Exile → Return cycle
- @CyC (Cyrus-Christ): Type → Antitype cycle
- @Sp (Spirit): Pentecost → Church cycle
- @Re (Remnant): End-time → Second Coming cycle
- JR (Juice Room): "Squeeze this book through ALL Palace principles" → Full-book analysis

FLOOR 7 - SPIRITUAL (Heart):
- FRm (Fire Room): "How does this burn into your heart?" → Conviction
- MR (Meditation Room): "Marinate in this truth" → Slow contemplation
- SRm (Speed Room): "Quick recall under pressure" → Rapid application

FLOOR 8 - MASTER (Reflexive):
- ∞ (Mastery): "Do I think Phototheologically naturally?" → Reflexive integration

HUNT STRUCTURE EXAMPLES:
1. **Floor 1 Journey**: SR → IR → 24 → TR (Story to Image progression)
2. **Investigation Training**: OR → ST → QR → QA (Detective skills)
3. **Christ-Centered Quest**: CR → DR → CEC → BL (Finding Jesus everywhere)
4. **Prophecy Path**: PR → 3A → @CyC → FE (Prophetic understanding)
5. **Multi-Floor Ascent**: SR → OR → CR → BL → @Sp (Full palace climb)

Each clue should:
1. TEACH the room's specific method/principle
2. APPLY it to a specific Bible passage
3. Lead naturally to the next room's discovery
4. Build Palace methodology understanding

EXAMPLE PROGRESSIVE CLUES:

Clue 1 (SR - Story Room): "In John 11:1-44, we use the Story Room method: 'What happened and in what order?' Identify the 5 main story beats from Lazarus's illness to resurrection. What is the room tag that asks this question?"
Answer: "SR" or "Story Room"
Explanation: "The Story Room teaches narrative sequencing. John 11 flows: sickness → death → delay → resurrection → belief. This structure anchors deeper study."

Clue 2 (IR - Imagination Room): "Now step INSIDE the story. John 11:35 says 'Jesus wept.' Use the Imagination Room's question: 'What does it feel like to stand there?' Picture yourself beside Jesus at Lazarus's tomb. What room teaches immersive Bible experience?"
Answer: "IR" or "Imagination Room"  
Explanation: "The Imagination Room turns memory into experience. Feeling Jesus' grief makes the text unforgettable."

Clue 3 (CR - Concentration Room): "Every text reveals Christ. In John 11:25, Jesus declares 'I am the resurrection and the life.' What Palace principle asks 'Where is Christ in this text?' Name the room."
Answer: "CR" or "Concentration Room"
Explanation: "The Concentration Room insists Christ is the center. Jesus isn't just performing resurrection—He IS resurrection."

Return JSON format:
{
  "title": "Engaging title (e.g., 'The Christ-Centered Quest', 'Story to Sanctuary Journey')",
  "difficulty": "beginner|pro|scholar",
  "category": "Palace Floor focus (e.g., 'Floor 1: Furnishing', 'Multi-Floor Journey')",
  "time_limit_hours": 24,
  "clues": [
    {
      "clue_number": 1,
      "clue_type": "room",
      "hint": "Teaching hint explaining the room's METHOD with biblical application (200-400 chars)",
      "correct_answers": ["primary", "alternate", "abbreviated"],
      "explanation": "Why this teaches the principle and connects forward (150-250 chars)"
    }
  ],
  "final_verse": "Book Chapter:Verse",
  "final_verse_text": "Full KJV text of treasure verse",
  "biblical_conclusion": "Summary of Palace principles taught and Christ-centered insight (500-700 chars)"
}`;

    const huntResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          ...(ragSection ? [{ role: 'system', content: ragSection }] : []),
          { role: 'user', content: huntPrompt },
        ],
      }),
    });

    if (!huntResponse.ok) {
      throw new Error(`AI API error for hunt: ${huntResponse.status}`);
    }

    const huntData = await huntResponse.json();
    const rawHuntContent = huntData.choices[0].message.content;
    // Extract JSON from markdown code blocks if present
    const huntJsonMatch = rawHuntContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    const huntJsonStr = huntJsonMatch ? huntJsonMatch[1].trim() : rawHuntContent.trim();
    const huntContent = JSON.parse(huntJsonStr);

    // ── Validate room answers against real Palace rooms ──
    const VALID_ROOMS: Record<string, string[]> = {
      'sr': ['sr', 'story room'],
      'ir': ['ir', 'imagination room'],
      '24': ['24', '24fps', '24fps room'],
      'br': ['br', 'bible rendered', 'bible rendered room'],
      'tr': ['tr', 'translation room'],
      'gr': ['gr', 'gems room'],
      'or': ['or', 'observation room'],
      'dc': ['dc', 'def-com', 'def-com room', 'defcom'],
      'st': ['st', 'symbols/types room', 'symbols types room', 'symbols room', 'types room'],
      'qr': ['qr', 'questions room'],
      'qa': ['qa', 'q&a chains room', 'qa chains', 'q&a room'],
      'nf': ['nf', 'nature freestyle'],
      'pf': ['pf', 'personal freestyle'],
      'bf': ['bf', 'bible freestyle', 'verse genetics'],
      'hf': ['hf', 'history freestyle', 'history/social freestyle'],
      'lr': ['lr', 'listening room'],
      'cr': ['cr', 'concentration room'],
      'dr': ['dr', 'dimensions room'],
      'c6': ['c6', 'connect 6', 'connect-6'],
      'trm': ['trm', 'theme room'],
      'tz': ['tz', 'time zone', 'time zone room'],
      'prm': ['prm', 'patterns room'],
      'p||': ['p||', 'parallels room', 'parallels'],
      'frt': ['frt', 'fruit room'],
      'cec': ['cec', 'christ every chapter', 'christ in every chapter'],
      'r66': ['r66', 'room 66'],
      'bl': ['bl', 'blue room', 'sanctuary room', 'blue room sanctuary'],
      'pr': ['pr', 'prophecy room'],
      '3a': ['3a', 'three angels room', 'three angels'],
      'fe': ['fe', 'feasts room'],
      'frm': ['frm', 'fire room'],
      'mr': ['mr', 'meditation room'],
      'srm': ['srm', 'speed room'],
      'jr': ['jr', 'juice room'],
    };

    const allValidAnswers = new Set<string>();
    for (const aliases of Object.values(VALID_ROOMS)) {
      for (const a of aliases) allValidAnswers.add(a.toLowerCase());
    }

    // Validate each clue's correct_answers for room-type clues
    if (huntContent.clues) {
      for (const clue of huntContent.clues) {
        if (clue.clue_type === 'room' && clue.correct_answers) {
          const validatedAnswers = clue.correct_answers.filter((ans: string) =>
            allValidAnswers.has(ans.toLowerCase().trim())
          );
          if (validatedAnswers.length === 0) {
            // AI hallucinated — try to extract a valid room from the hint text
            for (const [tag, aliases] of Object.entries(VALID_ROOMS)) {
              if (clue.hint && aliases.some((a: string) => clue.hint.toLowerCase().includes(a))) {
                clue.correct_answers = [tag, ...aliases];
                console.log(`Fixed hallucinated room answer for clue ${clue.clue_number} → ${tag}`);
                break;
              }
            }
          } else {
            // Enrich with aliases so more user inputs are accepted
            const enriched = new Set<string>(validatedAnswers.map((a: string) => a.toLowerCase().trim()));
            for (const ans of validatedAnswers) {
              for (const [tag, aliases] of Object.entries(VALID_ROOMS)) {
                if (aliases.some((a: string) => a.toLowerCase() === ans.toLowerCase().trim())) {
                  for (const alias of aliases) enriched.add(alias);
                }
              }
            }
            clue.correct_answers = Array.from(enriched);
          }
        }
      }
    }

    // Calculate expiration (24 hours from tomorrow start)
    const expiration = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);

    // Insert treasure hunt
    const { data: hunt, error: huntError } = await supabase
      .from('treasure_hunts')
      .insert({
        title: huntContent.title,
        difficulty: huntContent.difficulty,
        category: huntContent.category,
        time_limit_hours: huntContent.time_limit_hours,
        clues: huntContent.clues,
        final_verse: huntContent.final_verse,
        final_verse_text: huntContent.final_verse_text,
        biblical_conclusion: huntContent.biblical_conclusion,
        expires_at: expiration.toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (huntError || !hunt) {
      console.error('Hunt insert error:', huntError);
      throw huntError;
    }

    console.log('Treasure hunt created:', huntContent.title);

    return new Response(
      JSON.stringify({
        success: true,
        challenge: challengeContent.title,
        hunt: huntContent.title,
        scheduled_for: tomorrow.toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in daily-content-generator:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});