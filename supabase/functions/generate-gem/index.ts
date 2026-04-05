import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorpusContext } from '../_shared/corpus-rag.ts';
import { getContentBehavioralEngine } from '../_shared/content-behavioral-engine.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple hash function for content deduplication
function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Gem style configurations
const GEM_STYLES = {
  typology: {
    name: "Typology Gem",
    focus: "Christ-centered connections between Old Testament types and New Testament antitypes that are NOT already well-known",
    instructions: `Focus on TYPOLOGY — but DEEP, NON-OBVIOUS typology:
- Find a type/shadow connection that is NOT already catalogued in standard study Bibles
- Use the 5 Christ Tracers: Innocent Sufferer, Substitute, Deliverer, Covenant Mediator, Restorer/Bridegroom/King
- The type MUST come from a passage NOT commonly associated with Christ
- FORBIDDEN obvious examples: Joseph sold for silver, Passover lamb = Lamb of God, Bronze serpent, Isaac on Moriah, Jonah 3 days — these are too well-known
- Instead: find types in unexpected places — Levitical laws, obscure narratives, Wisdom literature, geographic details, architectural specifications`
  },
  hebrew_greek: {
    name: "Word Study Gem",
    focus: "Hebrew or Greek word insights revealing meaning that transforms understanding of a passage",
    instructions: `Focus on ORIGINAL LANGUAGE INSIGHT — but go DEEPER than vocabulary lists:
- Do NOT just define a well-known word (hesed, shalom, agape, logos — these are overdone)
- Instead: find a word whose Hebrew/Greek meaning INVERTS or TRANSFORMS a familiar passage
- Show how the same root word creates an invisible thread between passages no one connects
- Look for: wordplay the English hides, grammatical forms that change meaning, words used ONCE that echo another book
- The insight must make the reader say "I've read that verse 100 times and never saw that"`
  },
  prophecy: {
    name: "Prophecy Gem",
    focus: "Prophetic patterns and structural connections that go beyond standard prophecy charts",
    instructions: `Focus on PROPHECY — but NOT standard prophecy-fulfillment charts:
- Do NOT use: Isaiah 53 = Jesus, Daniel 2 statue, Micah 5:2 = Bethlehem — these are basic
- Instead: find prophetic STRUCTURAL patterns — mathematical symmetry, narrative inversion, covenant progression
- Use the 8 Prophetic Cycles: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re
- Apply the 3 Heavens framework when relevant (1H, 2H, 3H)
- CRITICAL: Day of Atonement = 1844 judgment, NOT the cross (Passover = cross)
- Show how prophecy creates a HIDDEN ARCHITECTURE across books that different human authors couldn't have coordinated`
  },
  palace: {
    name: "Palace Gem",
    focus: "Connection to PhotoTheology Palace methodology that unlocks a non-obvious insight",
    instructions: `Focus on PALACE METHODOLOGY — applied to SURPRISING material:
- Tie the gem to a specific Palace room/floor
- Reference the room's unique approach:
  * Story Room (narrative structure)
  * Observation Room (textual details)
  * Symbols/Types Room (symbolic meanings)
  * Dimensions Room (6-dimensional analysis)
  * Blue/Sanctuary Room (sanctuary connections)
  * Prophecy Room (prophetic overlay)
  * Parallels Room (mirrored actions)
  * Concentration Room (Christ in every verse)
- The room's method must unlock something INVISIBLE to casual reading
- Apply the method to a passage that seems barren of deeper meaning — show it's actually rich`
  },
  chiasm: {
    name: "Chiasm Gem",
    focus: "Literary structures that reveal hidden theological emphasis",
    instructions: `Focus on LITERARY STRUCTURE — but find UNDISCOVERED patterns:
- Do NOT use well-known chiasms (Genesis 1, Psalm 23, Flood narrative — these are catalogued)
- Instead: find a chiastic structure or parallel construction that reveals a SHOCKING center point
- Look in: minor prophets, Levitical laws, epistles, genealogies, travel narratives
- Show how the structure was INVISIBLE until you map it — then it changes the entire passage's meaning
- The center of the chiasm must reveal something theologically explosive`
  },
  number: {
    name: "Number Gem",
    focus: "Biblical number patterns that reveal divine intentionality across distant texts",
    instructions: `Focus on BIBLICAL NUMBERS — but NOT the standard list:
- Do NOT just say: 7 = completion, 12 = governance, 40 = testing — that's a chart, not a gem
- Instead: find a NUMBER that creates an invisible connection between passages no one links
- Show mathematical precision across books written centuries apart
- Look for: timing patterns, counting structures, dimensional ratios, generational sequences
- The number pattern must feel like discovering a hidden code — not reading a reference table`
  },
  story: {
    name: "Story Gem",
    focus: "Narrative parallels between stories that appear to have NOTHING in common",
    instructions: `Focus on STORY PARALLELS — but between UNLIKELY pairs:
- FORBIDDEN obvious pairs: Joseph/Christ, Moses/Christ, Elijah/John Baptist, Adam/Christ, Exodus/Redemption
- Instead: connect stories from DIFFERENT GENRES that share a hidden structural pattern
- Pair Law with Epistle, Wisdom with Apocalyptic, Poetry with Narrative
- The reader's first reaction should be: "What could these possibly have in common?"
- Then the parallels should be undeniable once revealed
- Look for: reversal patterns, death→life movements, exile→return arcs, garden→mountain progressions`
  }
};

// Depth configurations
const DEPTH_CONFIGS = {
  quick: {
    name: "Quick Gem",
    instructions: "Keep this gem SHORT and PUNCHY — 2-3 sentences for The Thread, 3-4 sentences for The Gem. Focus on ONE powerful connection. No extensive cross-references.",
    maxLength: "brief"
  },
  study: {
    name: "Study Gem",
    instructions: "Provide a MEDIUM-LENGTH gem with fuller exploration. Include 2-3 supporting references. The Thread can be 3-4 sentences, The Gem 5-6 sentences.",
    maxLength: "moderate"
  },
  deep: {
    name: "Deep Gem",
    instructions: "Create a COMPREHENSIVE gem with multiple layers. Include extensive cross-references (4-6 verses). Apply multiple PT dimensions. The Thread can be 4-5 sentences, The Gem 6-8 sentences with deeper theological connections.",
    maxLength: "extensive"
  }
};

// Day names for messages
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Get daily limits based on day of week (Sabbath-aware)
function getDailyLimit(dayOfWeek: number): number {
  if (dayOfWeek === 6) return 0; // Saturday (Sabbath) - no gems
  if (dayOfWeek === 5) return 2; // Friday - 2 gems
  return 1; // Sunday-Thursday - 1 gem
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    let style = 'random';
    let depth = 'study';
    let passage: string | undefined;
    let mode = 'personal';

    try {
      const body = await req.json();
      style = body.style || 'random';
      depth = body.depth || 'study';
      passage = body.passage;
      mode = body.mode || 'personal';
    } catch {
      // No body or invalid JSON, use defaults
    }

    // Handle random style selection
    const styleKeys = Object.keys(GEM_STYLES);
    let actualStyle = style;
    if (style === 'random') {
      actualStyle = styleKeys[Math.floor(Math.random() * styleKeys.length)];
    }

    const styleConfig = GEM_STYLES[actualStyle as keyof typeof GEM_STYLES] || GEM_STYLES.typology;
    const depthConfig = DEPTH_CONFIGS[depth as keyof typeof DEPTH_CONFIGS] || DEPTH_CONFIGS.study;

    // Get user ID from auth header if available
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Get current time and day info
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const today = now.toISOString().split('T')[0];

    // For Gem of the Day mode, check if one already exists for today
    if (mode === 'daily') {
      const { data: existingDailyGem } = await supabase
        .from('generated_gems')
        .select('*')
        .eq('is_gem_of_day', true)
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lte('created_at', `${today}T23:59:59.999Z`)
        .maybeSingle();

      if (existingDailyGem) {
        console.log('Returning existing Gem of the Day');
        return new Response(
          JSON.stringify({
            gem: existingDailyGem.content,
            title: existingDailyGem.title,
            style: existingDailyGem.gem_style || actualStyle,
            depth: existingDailyGem.gem_depth || depth,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Sabbath-aware gem limits (only for personal mode)
    const DAILY_LIMIT = getDailyLimit(dayOfWeek);

    // Check if it's Sabbath
    if (DAILY_LIMIT === 0 && mode === 'personal') {
      return new Response(
        JSON.stringify({
          error: "It's Sabbath! Take time to rest and reflect. Gem discovery resumes tomorrow.",
          limit_reached: true,
          is_sabbath: true,
          gems_today: 0,
          daily_limit: 0
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the start of today (UTC midnight)
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const dayStartISO = startOfDay.toISOString();

    let gemsToday = 0;
    if (userId && mode === 'personal') {
      // Check by user ID for today (excluding gem of day)
      const { count, error: countError } = await supabase
        .from('generated_gems')
        .select('*', { count: 'exact', head: true })
        .eq('generated_for_user_id', userId)
        .eq('is_gem_of_day', false)
        .gte('created_at', dayStartISO);

      if (countError) {
        console.error('Error checking daily limit:', countError);
      } else {
        gemsToday = count || 0;
      }
    } else if (!userId) {
      // For anonymous users, check total anonymous gems today
      const { count, error: countError } = await supabase
        .from('generated_gems')
        .select('*', { count: 'exact', head: true })
        .is('generated_for_user_id', null)
        .gte('created_at', dayStartISO);

      if (countError) {
        console.error('Error checking anonymous daily limit:', countError);
      } else {
        // Anonymous users share a daily pool of 50
        if ((count || 0) >= 50) {
          return new Response(
            JSON.stringify({
              error: 'Daily gem limit reached for anonymous users. Sign in for your personal daily limit.',
              limit_reached: true
            }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    const gemsRemaining = Math.max(0, DAILY_LIMIT - gemsToday);

    if (userId && gemsToday >= DAILY_LIMIT && mode === 'personal') {
      const isFriday = dayOfWeek === 5;
      return new Response(
        JSON.stringify({
          error: isFriday
            ? `You've discovered your 2 Friday gems! Tomorrow is Sabbath rest, so come back Sunday for more.`
            : `You've discovered your gem for ${DAY_NAMES[dayOfWeek]}! Return tomorrow for another treasure.`,
          limit_reached: true,
          gems_today: gemsToday,
          daily_limit: DAILY_LIMIT,
          gems_remaining: 0,
          day_of_week: DAY_NAMES[dayOfWeek]
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating ${styleConfig.name} (${depthConfig.name}) for user ${userId || 'anonymous'} (${DAY_NAMES[dayOfWeek]}, ${gemsRemaining} remaining)`);

    // Generate a unique seed
    const uniqueSeed = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${userId || 'anonymous'}-${actualStyle}`;

    // Build the passage focus instruction
    const passageFocus = passage
      ? `\n\nPASSAGE FOCUS: The user wants a gem that involves or connects to ${passage}. At least one of the verses MUST be from this passage or directly related to it.`
      : '';

    let systemPrompt = `You are Jeeves, the Phototheology Research Assistant. Your task is to produce a ${styleConfig.name}—a short, powerful, mind-opening insight that reveals a hidden connection between seemingly unrelated Bible verses.

${styleConfig.instructions}

DEPTH LEVEL: ${depthConfig.name}
${depthConfig.instructions}
${passageFocus}

═══════════════════════════════════════════════════════════════
ANTI-OBVIOUS FILTER — READ THIS FIRST
═══════════════════════════════════════════════════════════════

A Gem is NOT:
- A collection of obvious cross-references
- Verses that share the same nouns or keywords
- Parallel passages already linked in study Bibles
- Prophecy → fulfillment chains that are already explicit
- Anything a marginal-reference Bible already connects

BEFORE generating, apply this disqualification test:
1. Do these verses already reference each other? → DISCARD
2. Are they connected by shared keywords or nouns? → DISCARD
3. Would a standard study Bible margin already link them? → DISCARD
4. Is this a well-known sermon illustration? → DISCARD
If any answer is YES, choose different verses and try again.

A Gem MUST:
- Use 2–4 verses that appear UNRELATED on the surface
- Cross biblical genres (Law / Wisdom / Prophets / Gospel / Epistle / Apocalyptic)
- Require conceptual reasoning to connect — not keyword matching
- Produce intellectual TENSION before clarity
- Create a "How did I never see that?" reaction
- Be Christ-centered without forcing typology artificially

INSTEAD of keywords, search for:
- Shared structural patterns (death→life, exile→return, water→Spirit, garden→mountain)
- Mathematical symmetry across books
- Narrative inversion (one story mirrors another in reverse)
- Covenant progression hidden across genres
- Hidden metaphors that link distant texts
- Judgment-to-mercy movements
- First mention vs final fulfillment (but NOT obvious ones)
- Sanctuary patterns embedded in non-sanctuary texts
- Psychological/emotional states mirrored across covenants

═══════════════════════════════════════════════════════════════
GOAL OF A GEM
═══════════════════════════════════════════════════════════════

A Gem must feel like a "hidden facet of Scripture suddenly turning in the light."
It must be:
- SURPRISING (an advanced Bible student would say "I've never noticed that")
- STRUCTURALLY ELEGANT (the connection is precise, not forced)
- DEEP (rich theology, not superficial)
- GROUNDED in sound biblical theology (no offshoot errors)
- ACCURATE + DEFENSIBLE (with references)

═══════════════════════════════════════════════════════════════
CRITICAL THEOLOGICAL GUARDRAILS
═══════════════════════════════════════════════════════════════

⚠️ AZAZEL / SCAPEGOAT — ABSOLUTE RULE:
- The scapegoat (Azazel) in Leviticus 16 represents SATAN, NEVER Christ/Jesus
- The LORD's goat (slain) = Christ's sacrifice
- The scapegoat (sent away) = Satan bearing final guilt AFTER atonement is complete
- NEVER identify, compare, liken, or shadow-type the scapegoat as Jesus in any way
- If discussing Leviticus 16, you MUST distinguish the two goats correctly

⚠️ SANCTUARY TWO-PHASE MINISTRY:
- Christ entered the HOLY PLACE (first apartment) at His ASCENSION in 31 AD
- Christ entered the MOST HOLY PLACE (second apartment) in 1844
- NEVER say Christ went to the Most Holy Place at resurrection/ascension!

⚠️ FEAST TYPOLOGY:
SPRING FEASTS = Christ's FIRST ADVENT (already fulfilled):
- Passover → Christ's DEATH on the cross (NOT Day of Atonement!)
- Unleavened Bread → Christ's BURIAL and sinless life
- Firstfruits → Christ's RESURRECTION
- Pentecost → Holy Spirit outpouring

FALL FEASTS = Christ's SECOND ADVENT ministry (end-time):
- Trumpets → Final warning (1840s movement)
- Day of Atonement → 1844 heavenly Most Holy Place ministry, NOT THE CROSS!
- Tabernacles → Second Coming

═══════════════════════════════════════════════════════════════

Required GEM Structure (use these exact headers):

🔹 GEM TITLE
A poetic 3–7 word title capturing the insight.

🔹 THE VERSES
List 2–4 chosen verses in full (KJV). These verses must appear to have NOTHING in common at first glance.

🔹 THE QUESTION
"What could these possibly have in common?" — Frame the tension. Let the reader feel the disconnect before revealing the connection.

🔹 THE THREAD
A ${depth === 'quick' ? '2-3' : depth === 'study' ? '3-4' : '4-5'} sentence explanation that slowly reveals the unexpected connection. Build from tension to clarity.

🔹 THE GEM
A ${depth === 'quick' ? '3-4' : depth === 'study' ? '5-6' : '6-8'} sentence paragraph showing the beauty of the connection. End with ONE unforgettable sentence that compresses the entire insight — the "hit line."

🔹 BIBLICAL ALIGNMENT
2-3 sentences confirming alignment with redemption, sanctuary, and sound biblical theology. NEVER use the word "Adventist" or any denominational label.

═══════════════════════════════════════════════════════════════
QUALITY GATE — SELF-CHECK BEFORE OUTPUTTING
═══════════════════════════════════════════════════════════════

Before finalizing, evaluate your gem:
- Is this SURPRISING? Would an advanced student say "I never noticed that"?
- Is this NON-OBVIOUS? Could someone find this with a concordance? If yes → regenerate.
- Is this STRUCTURALLY ELEGANT? Is the connection precise, not forced?
- Do the verses come from DIFFERENT genres? If they're all from the same genre → reconsider.
If the answer to any check is NO → start over with different verses.

FORMATTING: Use emojis sparingly (📖 ✨ 💎). NO markdown bold/italic. Clean, readable format.

Unique seed: ${uniqueSeed}`;

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: passage || 'Bible gem insight hidden connection',
      matchCount: 2,
      supabaseClient: supabase,
    });
    if (ragResult.chunkCount > 0) {
      systemPrompt += ragResult.corpusContext;
    systemPrompt += "\n\n" + getContentBehavioralEngine();
    }

    const userPrompt = `Produce a ${styleConfig.name} at ${depthConfig.name} depth. ${passage ? `Connect to ${passage} but pair it with a verse from a COMPLETELY DIFFERENT genre that shares NO obvious keywords.` : 'Select verses from DIFFERENT genres (Law/Wisdom/Prophets/Gospel/Epistle) that appear to have NOTHING in common on the surface.'} Apply the Anti-Obvious Filter — disqualify any connection a study Bible margin would already make. The reader should feel intellectual tension before clarity. Follow the Gem structure exactly. Include THE QUESTION section. Seed: ${uniqueSeed}`;

    console.log('Generating gem with Lovable AI...');

    let gemContent: string | null = null;
    let gemTitle = 'Untitled Gem';
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Generation attempt ${attempts}/${maxAttempts}`);

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt + ` (attempt ${attempts})` }
          ],
          temperature: 0.95,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);

        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const candidateContent = data.choices[0]?.message?.content;

      if (!candidateContent) {
        console.error('No content in AI response, retrying...');
        continue;
      }

      // Check for duplicates
      const normalizedContent = candidateContent.replace(/\s+/g, ' ').trim();
      const contentHash = hashContent(normalizedContent);

      const { data: existingGem } = await supabase
        .from('generated_gems')
        .select('id')
        .eq('content_hash', contentHash)
        .maybeSingle();

      if (existingGem) {
        console.log(`Duplicate detected, regenerating...`);
        continue;
      }

      gemContent = candidateContent;

      // Extract title
      const titleMatch = candidateContent.match(/🔹 GEM TITLE[\s\S]*?["\"]?([^"\n]+)["\"]?(?=\n|🔹)/i) ||
                         candidateContent.match(/GEM TITLE[:\s]*["\"]?([^"\n]+)["\"]?/i);
      gemTitle = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, '') : 'Untitled Gem';

      // Store the gem
      const { error: insertError } = await supabase
        .from('generated_gems')
        .insert({
          content_hash: contentHash,
          title: gemTitle,
          content: candidateContent,
          generated_for_user_id: userId,
          gem_style: actualStyle,
          gem_depth: depth,
          passage_focus: passage || null,
          is_gem_of_day: mode === 'daily'
        });

      if (insertError) {
        console.error('Error storing gem:', insertError);
      } else {
        console.log(`Stored ${styleConfig.name} gem`);
      }

      break;
    }

    if (!gemContent) {
      throw new Error('Failed to generate a unique gem after multiple attempts');
    }

    console.log(`✅ ${styleConfig.name} generated: ${gemTitle}`);

    return new Response(
      JSON.stringify({
        gem: gemContent,
        title: gemTitle,
        style: actualStyle,
        depth: depth,
        gems_remaining: gemsRemaining - 1,
        day_of_week: DAY_NAMES[dayOfWeek]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-gem:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
