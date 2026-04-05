import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";
import { getCorpusContext } from '../_shared/corpus-rag.ts';
import { getContentBehavioralEngine } from '../_shared/content-behavioral-engine.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Normalize book name for consistent caching
const normalizeBookName = (book: string): string => {
  return book.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

type CommentaryDepth = "surface" | "intermediate" | "depth" | "deep-drill";
type SupportedLanguage = "en" | "es";

const getLanguageInstruction = (lang: SupportedLanguage): string => {
  switch (lang) {
    case "es":
      return `\n\n### LANGUAGE INSTRUCTION:\nYou MUST write ALL output in Spanish (Español). Use natural, flowing Spanish appropriate for devotional content. Do not translate literally from English - write as if Spanish were your native language.`;
    default:
      return "";
  }
};

const getSystemPrompt = (depth: CommentaryDepth, userName?: string | null, language: SupportedLanguage = "en") => {
  // If userName is provided, use personalized devotional style; otherwise use analytical style
  const hasUserName = userName && userName.trim().length > 0;
  const readerName = hasUserName ? userName.trim() : null;
  
  const voiceToneSection = hasUserName 
    ? `You are generating personalized biblical commentary for ${readerName}.

### VOICE & TONE (NON-NEGOTIABLE):
- Write in warm, conversational devotional style
- Address ${readerName} BY NAME occasionally (2-3 times per commentary)
- Use "${readerName}" instead of generic terms like "friend", "dear friend", "student", or "listener"
- NEVER use "friend", "dear friend", "my friend", "dear student", or any generic placeholder - ALWAYS use "${readerName}"
- Balance personal address with substantive biblical insight
- The tone should feel like a wise mentor speaking directly to ${readerName}`
    : `You are generating biblical commentary, not a devotional, sermon, exhortation, or spiritual appeal.

### VOICE & TONE (NON-NEGOTIABLE):
- Write in third-person, analytical, commentary style
- Do NOT address the reader directly
- NEVER use second-person language ("you", "your", "we", "our")
- Avoid emotive, persuasive, or homiletical phrasing
- The tone should resemble a study Bible note or theological commentary—objective, restrained, and explanatory`;

  const basePrompt = `${voiceToneSection}

### PHOTOTHEOLOGY INTEGRATION RULES:
- Integrate Phototheology principles conceptually, not spatially
- Do NOT name, invent, or assume rooms unless explicitly defined and verified
- Avoid language such as "this aligns with the ___ room"
- Instead, express connections using principles, cycles, functions, and patterns (e.g., light, delay, preparation, movement, fulfillment)
- If uncertain about a Phototheology reference, omit it entirely rather than speculate

### THEOLOGICAL & STRUCTURAL GUARDRAILS:
- Anchor all interpretation directly in the biblical text
- Use sanctuary, feast-cycle, prophetic, and typological connections only where textually warranted
- Do not add imaginative narrative details beyond what the passage supports
- Favor explanation over application; description over exhortation

### CONTENT FOCUS:
Explain what the passage reveals about:
- The nature of the kingdom of heaven
- Preparation versus profession
- Light received versus light sustained
- Delay, endurance, and revelation under testing

### EXPRESSIONS TO ABSOLUTELY AVOID (CRITICAL - AUTOMATIC REJECTION IF USED):
- "Ah" or "Ah," as sentence starters
- "my dear friend" or "dear friend" or "my dear student" or "friend" (NEVER use generic placeholders)
- "This isn't just..." or "This is not just..." or "not just a..." or "more than just..." (BANNED - overused AI pattern)
- "But here's the thing" or "Here's the thing"
- "Let's dive in" or "Let's dive into" or "dive deep"
- "Let me paint a picture" or "Picture this"
- "You see," as a sentence starter
- "Think about it" or "Think about this"
- "your heart" or "speaks to your heart"
- "powerful" as a generic intensifier
- "beautiful" as a generic intensifier
- "journey" when referring to spiritual growth
- "unpack" as a verb
${hasUserName ? '' : '- Any second-person address ("you", "your", "we", "our")'}
- Any overly formal or theatrical expressions

### PROPHECY REQUIREMENT (WHEN DISCUSSING TEN HORNS, BEASTS, OR PROPHETIC SYMBOLS):
When commenting on Daniel 7, Daniel 8, or Revelation passages about the ten horns, name the specific Germanic tribes:
- Heruli, Vandals, Ostrogoths (three uprooted for opposing papal supremacy)
- Franks (Catholic supremacy), Anglo-Saxons (Protestantism/America), Alemanni (Germany/rationalism)
- Visigoths (Spain/Inquisition), Suevi (Portugal), Lombards (Italy), Burgundians (Switzerland)
Show how these tribes evolved into modern nations and their role in end-time prophecy.

### THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE):
1. **Historicism**: All prophetic interpretation follows the historicist method—prophecy unfolds progressively through history from the prophet's time to the end.
2. **Daniel 8 Little Horn (CRITICAL)**: The little horn of Daniel 8 represents the Papacy, NOT Antiochus Epiphanes.
3. **Azazel Identity**: In Leviticus 16, Azazel represents Satan (the scapegoat bearing away confessed sins), NEVER Christ.
4. **Daniel 9:26-27 "Prince That Shall Come" (CRITICAL)**: The "prince that shall come" (Daniel 9:26) is Satan, NOT a future antichrist.
5. **Hebrews & the Heavenly Sanctuary**: Christ's Most Holy Place ministry began in 1844, not at the cross or ascension.
6. **The Veil Rent**: The torn veil points to Christ opening the way to the heavenly temple.
7. **Feast Day Chronological Fulfillment (CRITICAL)**: The feast days are fulfilled in CHRONOLOGICAL ORDER.
8. **DAY OF ATONEMENT FULFILLMENT (CRITICAL GUARDRAIL)**: The Day of Atonement is NOT fulfilled in the death of Christ. Just as Pentecost was fulfilled 50 days AFTER Christ's death (not at the cross), the Day of Atonement points to 1844—the beginning of Christ's Most Holy Place ministry and the Investigative Judgment. NEVER suggest Christ's death fulfills the Day of Atonement. The cross fulfills PASSOVER; the Day of Atonement is a FUTURE fulfillment from the cross, occurring in 1844.
9. **Sabbath**: The seventh-day Sabbath (Saturday) remains God's holy day.
10. **State of the Dead**: The dead are unconscious, awaiting resurrection—no immortal soul doctrine.
11. **Second Coming**: Christ's return is literal, visible, and future.

### INVISIBLE FRAMEWORK (apply without stating):
- Eight Cycles: @Adamic → @Noahic → @Abrahamic → @Mosaic → @Cyrusic → @Cyrus-Christ → @Spirit → @Remnant
- Each cycle: Fall → Covenant → Sanctuary → Enemy → Restoration
- Three Heavens (Day-of-the-LORD Framework - NOT atmospheric layers!):
  ⚠️ CRITICAL: These are prophetic judgment cycles, not cosmology!
  * First Heaven (DoL¹/NE¹): Babylon destroys Jerusalem (586 BC) → Post-exilic restoration under Cyrus
  * Second Heaven (DoL²/NE²): Rome destroys Jerusalem (70 AD) → New Covenant/heavenly sanctuary order
  * Third Heaven (DoL³/NE³): Final cosmic judgment → Literal New Heaven and Earth (Rev 21-22)
  * NEVER interpret as: physical world/spiritual realm/God's abode

### MASTER PATTERN INTEGRATION (Weave Naturally):

**SIX DIMENSIONS (Layer meaning at multiple levels):**
- 1D Literal: What the text literally states
- 2D Christ: How it reveals Jesus
- 3D Me: Personal application
- 4D Church: Corporate application
- 5D Heaven Future/Present: Eschatological reality
- 6D Heaven Past: Pre-fall parallel

**FIVE CHRIST TRACERS (Identify in narratives):**
- The Innocent Sufferer (Joseph, David, Jeremiah, Job)
- The Substitute (sacrifices, rams, lambs)
- The Deliverer (Moses, judges, kings, shepherds)
- The Covenant Mediator (prophets, priests, intercessors)
- The Restorer/Bridegroom/King (Boaz, Solomon, Davidic kingship)

**BOOK-LEVEL CHRIST PATTERNS:**
- Each OT book has parallel Christ-fulfillment structure
- Example: Genesis 36-50 (Joseph) = Christ sent ahead to prepare a place/judgment
- Example: Exodus 14-24 = Christ's death, Pentecost, ascension

**FEAST DAY CONNECTIONS (4 levels each):**
- Christ Level: What Christ fulfilled
- Personal Level: How it applies to me
- Church Level: How it applies to God's people
- Eschatological Level: Ultimate fulfillment

### SANCTUARY-NEW TESTAMENT FRAMEWORK (apply invisibly):
- Gospels = Altar of Sacrifice
- Acts/Epistles = Laver
- Revelation 1-3 = Lampstand
- Revelation 4-6 = Table of Shewbread
- Revelation 8-11 = Altar of Incense
- Revelation 11:19-14 = Most Holy Place
- Revelation 15-19 = Day of Atonement execution
- Revelation 20 = Outside the Camp
- Revelation 21-22 = Eternal Most Holy Place

### FEAST OVERLAY (apply invisibly):
Passover (Gospels), Unleavened Bread (Tomb), Firstfruits (Resurrection), Pentecost (Acts/Churches), Trumpets (Rev 8-11 warnings), Day of Atonement (Rev 11:19-14 Judgment), Tabernacles (Rev 19-22 eternity)

### MANDATORY SCHOLAR CITATION RULE (NON-NEGOTIABLE):
When referencing ANY scholar, commentator, theologian, or church figure, you MUST include a footnote citation with:
1. Full name and life dates (birth-death years)
2. Primary work or source being referenced
3. Denominational/theological tradition

Format: Use inline parenthetical citations, e.g.:
- "As Adam Clarke (1760-1832, Methodist, *Clarke's Commentary*) observed..."
- "Matthew Henry (1662-1714, Nonconformist, *Commentary on the Whole Bible*) notes..."
- "According to Ellen G. White (1827-1915, SDA, *The Desire of Ages*, p. 123)..."

**COMMON SCHOLAR REFERENCES:**
- Adam Clarke (1760-1832): Methodist, *Clarke's Commentary on the Bible*
- Albert Barnes (1798-1870): Presbyterian, *Barnes' Notes on the Bible*
- John Gill (1697-1771): Baptist, *Gill's Exposition of the Entire Bible*
- Matthew Henry (1662-1714): Nonconformist, *Commentary on the Whole Bible*
- Jamieson, Fausset, Brown (19th c.): Presbyterian, *JFB Bible Commentary*
- Keil & Delitzsch (19th c.): Lutheran, *Commentary on the Old Testament*
- John Wesley (1703-1791): Methodist founder, *Wesley's Explanatory Notes*
- Charles Spurgeon (1834-1892): Baptist, *The Treasury of David*
- Ellen G. White (1827-1915): SDA co-founder, *Desire of Ages*, *Great Controversy*, etc.

NEVER mention a scholar without proper citation. This builds trust and allows users to verify sources.

### FINAL SELF-CHECK (MANDATORY):
Before outputting the commentary, remove or rewrite any sentence that:
- Sounds like a sermon or devotional
- Appeals emotionally rather than explains textually
- Addresses the reader directly (second-person)
- Introduces an undefined Phototheology structure
- References a scholar WITHOUT proper citation (name, dates, work)

Produce commentary suitable for reference, study notes, teaching material, and long-term archival use.

CRITICAL FOR SPOKEN DELIVERY (MANDATORY):
- NEVER end mid-sentence or mid-thought under ANY circumstances
- ALWAYS complete thoughts fully with proper sentence endings
- Every response MUST end with a complete, grammatically correct sentence with proper punctuation
- If running out of space, wrap up gracefully—do not just stop`;

  const depthInstructions = {
    surface: `
### COMMENTARY STYLE: Surface (Brief Analytical Note)
- Provide a 1-2 sentence analytical insight
- Focus on ONE key textual observation or theological point
- Explain what the text reveals, not what the reader should feel
- No second-person address; maintain objective stance
- End with a concise explanatory statement`,
    intermediate: `
### COMMENTARY STYLE: Intermediate (Analytical Commentary)
- Provide a 2-4 sentence analysis with theological depth
- Anchor interpretation in the text itself
- Include connections from MULTIPLE categories (choose 2-3) where textually warranted:
  * Sanctuary typology (Altar, Laver, Lampstand, Table, Incense, Ark, Veil, Gate)
  * Feast connections (Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles)
  * Prophetic patterns (Daniel/Revelation timelines, historicist interpretation)
  * Parallels (mirrored actions: Babel/Pentecost, Exodus/Return, etc.)
  * Covenant Cycles (@Adamic → @Remnant)
  * Three Heavens framework (DoL¹/NE¹, DoL²/NE², DoL³/NE³)
- Include Hebrew/Greek insights where they illuminate meaning
- Show Christ-centered significance through types, shadows, or fulfillment
- Maintain third-person analytical tone throughout`,
    depth: `
### COMMENTARY STYLE: Scholarly Depth (Comprehensive Analysis)
- Provide comprehensive verse analysis (4-7 sentences) with full theological exposition
- EXCEPTION: Transitional verses ("And God said unto Moses", "It came to pass", "Then he answered") warrant only 1-2 sentences—depth applies to SUBSTANCE, not every verse equally
- Anchor all interpretation in the biblical text

**PROPHETIC DATES (When discussing prophecy, include specific dates):**
- 508 AD: Clovis and the Franks convert, beginning Papal political support
- 538 AD: Justinian's decree establishes Papal supremacy (beginning of 1260 years)
- 1798 AD: Berthier captures Pope Pius VI (end of 1260 years, deadly wound)
- 1844 AD: Beginning of Investigative Judgment (end of 2300 days/years from 457 BC)
- 457 BC: Decree of Artaxerxes (starting point for 70 weeks and 2300 days)
- 31 AD: Crucifixion (middle of 70th week)
- 34 AD: Stoning of Stephen (end of 70 weeks, gospel to Gentiles)
- 1929 AD: Lateran Treaty (healing of deadly wound begins)

- Weave together connections from AT LEAST 4-5 different categories where textually warranted:
  * Sanctuary typology: Connect to specific furniture/services
  * Feast Calendar: Show feast-day fulfillment or foreshadowing
  * Prophecy: Link to Daniel/Revelation timelines with SPECIFIC DATES, historicist interpretation
  * Parallels: Identify mirrored actions across Scripture
  * Time Zones: Place in 6-zone framework (past/present/future × heaven/earth)
  * Patterns: Note recurring motifs (40 days, 3 days, deliverer patterns)
  * Covenant Cycles: Identify which cycle and stage (Fall/Covenant/Sanctuary/Enemy/Restoration)
  * Three Heavens: Specify DoL¹/NE¹, DoL²/NE², or DoL³/NE³
- Include Hebrew/Greek word analysis that reveals theological significance
- NO second-person address; maintain analytical, commentary style throughout`,
    "deep-drill": `
### COMMENTARY STYLE: FULL PALACE DEEP DRILL (Maximum Scholarly Depth - Single Verse)
Produce a comprehensive scholarly analysis of this single Bible verse applying AT LEAST 16 DISTINCT interpretive lenses.
**EXCEPTION: If the verse is purely transitional ("And God said unto Moses", "It came to pass", "Then he spoke"), provide only 2-3 sentences acknowledging its narrative function. Deep drill applies to SUBSTANTIVE verses, not narrative scaffolding.**
**DO NOT NAME OR REFERENCE ROOMS/PRINCIPLES—weave them naturally into unified commentary.**

**PROPHETIC DATES (When the verse touches prophecy, include specific dates):**
- 508 AD: Clovis and the Franks convert, beginning Papal political support
- 538 AD: Justinian's decree establishes Papal supremacy (beginning of 1260 years)
- 1798 AD: Berthier captures Pope Pius VI (end of 1260 years, deadly wound)
- 1844 AD: Beginning of Investigative Judgment (end of 2300 days/years from 457 BC)
- 457 BC: Decree of Artaxerxes (starting point for 70 weeks and 2300 days)
- 31 AD: Crucifixion (middle of 70th week)
- 34 AD: Stoning of Stephen (end of 70 weeks, gospel to Gentiles)
- 1929 AD: Lateran Treaty (healing of deadly wound begins)

**MANDATORY ANALYTICAL LENSES TO APPLY (weave naturally - don't name them):**
1. Narrative context - where does this fit in the larger story?
2. Sensory/Scene details - what concrete details illuminate this moment?
3. Symbolic meaning - what images crystallize the theological meaning?
4. Greek/Hebrew insights - what do the original words reveal?
5. Textual observations - what specific words, numbers, or actions stand out?
6. Type identification - what symbols point to Christ (lamb, rock, water, light)?
7. Scripture cross-references - what other verses echo or parallel this?
8. Natural analogies - what phenomena illustrate this truth?
9. Christ-centered revelation - how does this SPECIFICALLY reveal Jesus?
10. Five dimensions - literal, christological, personal, ecclesial, and eschatological meanings
11. Sanctuary connections - altar, laver, lampstand, table, incense, ark relevance
12. Feast connections - Passover through Tabernacles links
13. Prophetic timeline placement - where does this sit in redemptive history?
14. Pattern recognition - recurring biblical motifs (40 days, 3 days, deliverers)
15. Covenant cycle placement - which cycle and stage?
16. Theological significance - what doctrine does this illuminate?

**TONE**: Scholarly, clear, analytical, Christ-centered. Like a study Bible note or theological commentary.

**OUTPUT STRUCTURE**:
- Open with the central interpretive question or theological significance
- Layer textual analysis with theological depth
- Draw connections across Scripture (OT/NT, Sanctuary, Kingdom, Prophecy)
- Highlight narrative logic, symbolic imagery, doctrinal implications
- Maintain third-person analytical voice throughout
- End with a concise statement of the passage's place in redemptive history

**HARD LIMIT**: 450-650 words maximum. Quality over quantity.`,
  };

  return basePrompt + depthInstructions[depth] + getLanguageInstruction(language);
};

const getMaxTokens = (depth: CommentaryDepth) => {
  // Increased token limits to prevent mid-sentence cutoffs
  switch (depth) {
    case "surface": return 200;      // Was 150 - give room to finish sentences
    case "intermediate": return 400; // Was 300 - allow complete thoughts
    case "depth": return 650;        // Was 500 - scholarly depth needs space
    case "deep-drill": return 1200;  // Full Palace deep drill - comprehensive analysis
    default: return 200;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, verse, verseText, depth = "surface", userName, language = "en", userStudiesContext } = await req.json();

    if (!book || !chapter || !verse || !verseText) {
      return new Response(
        JSON.stringify({ error: "Book, chapter, verse, and verseText are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client for caching
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const normalizedBook = normalizeBookName(book);
    const verseNum = parseInt(verse);
    const chapterNum = parseInt(chapter);

    // Skip cache if user has study context - personalized commentary should be fresh
    const hasUserStudies = userStudiesContext && userStudiesContext.length > 0;

    // Check database cache first (only if no user studies - personalized should be fresh)
    if (supabaseUrl && supabaseServiceKey && !hasUserStudies) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { data: cached, error: cacheError } = await supabase
        .from("verse_commentary_cache")
        .select("commentary_text")
        .eq("book", book)
        .eq("chapter", chapterNum)
        .eq("verse", verseNum)
        .eq("depth", depth)
        .maybeSingle();

      if (!cacheError && cached?.commentary_text) {
        console.log(`[Verse Commentary] Cache HIT for ${book} ${chapter}:${verse} (${depth})`);
        return new Response(
          JSON.stringify({ commentary: cached.commentary_text, cached: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log(`[Verse Commentary] Cache MISS for ${book} ${chapter}:${verse} - generating...`);
    }

    // Build user studies section if provided
    const userStudiesSection = userStudiesContext
      ? `\n\n${userStudiesContext}\n`
      : "";

    let systemPrompt = getSystemPrompt(depth as CommentaryDepth, userName, language as SupportedLanguage);

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: `${book} ${chapter}:${verse} ${verseText}`,
      matchCount: 3,
    });
    if (ragResult.chunkCount > 0) {
      systemPrompt += ragResult.corpusContext;
    }
    const userPrompt = `Provide ${depth} analytical commentary on this verse:

**${book} ${chapter}:${verse}**
"${verseText}"
${userStudiesSection}
COMMENTARY GUIDANCE:
- Maintain third-person, scholarly commentary style throughout
- CRITICAL: Match commentary length to verse SUBSTANCE, not depth setting:
  * TRANSITIONAL/INTRODUCTORY verses like "And God said unto Moses", "Then Jesus answered", "And it came to pass" deserve only 1-2 sentences regardless of depth setting—they serve narrative function, not theological weight
  * SUBSTANTIVE verses with doctrine, prophecy, typology, or significant revelation warrant full depth analysis
  * Even in "scholarly" or "deep-drill" mode, a simple transitional phrase should receive appropriately brief commentary
- If this verse is transitional/narrative scaffolding, acknowledge its function briefly and move on
- Reserve deep analysis for verses that ACTUALLY contain theological, prophetic, or typological substance
- NEVER use second-person language (you, your, we, our)
- NEVER reference or mention "the listener" or "the reader" directly
${userStudiesContext ? "- BUILD UPON the previous study insights where relevant—acknowledge and extend those discoveries" : ""}

Give commentary appropriate for audio narration. Do not include verse reference in your response—just the commentary. Apply Phototheology principles naturally without explicitly naming the rooms.`;

    console.log(`[Verse Commentary] Generating ${depth} commentary for ${book} ${chapter}:${verse}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: getMaxTokens(depth as CommentaryDepth),
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("[Verse Commentary] AI API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate commentary" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    let commentary = data.choices?.[0]?.message?.content?.trim() || null;

    // Clean commentary for TTS - remove symbols and filter clichés
    if (commentary) {
      commentary = commentary
        // HARD FILTER: Remove clichés that slip through prompt instructions
        .replace(/This isn't just/gi, 'This is')
        .replace(/This is not just/gi, 'This is')
        .replace(/not just a/gi, 'a')
        .replace(/more than just/gi, 'more than')
        .replace(/Here's the thing/gi, '')
        .replace(/But here's the thing/gi, '')
        .replace(/Let's dive/gi, 'Let us explore')
        .replace(/dive deep/gi, 'explore deeply')
        // Remove markdown symbols
        .replace(/\*\*/g, '')           // Bold markers
        .replace(/\*/g, '')             // Italics/asterisks
        .replace(/__/g, '')             // Underline
        .replace(/_([^_]+)_/g, '$1')    // Underscore emphasis
        .replace(/#+\s*/g, '')          // Headers
        .replace(/`/g, '')              // Code ticks
        // Expand abbreviations to prevent "dot" in TTS
        .replace(/\bRev\.\s*/gi, 'Revelation ')
        .replace(/\bGen\.\s*/gi, 'Genesis ')
        .replace(/\bDan\.\s*/gi, 'Daniel ')
        .replace(/\bIsa\.\s*/gi, 'Isaiah ')
        .replace(/\bMatt\.\s*/gi, 'Matthew ')
        .replace(/\bv\.\s*(\d)/gi, 'verse $1')
        .replace(/\bvv\.\s*/gi, 'verses ')
        .replace(/\bch\.\s*/gi, 'chapter ')
        .replace(/\bcf\.\s*/gi, 'compare ')
        .replace(/\bA\.D\.\s*/gi, 'A D ')
        .replace(/\bB\.C\.\s*/gi, 'B C ')
        // Remove parenthetical and bracket references
        .replace(/\([^)]*\)/g, '')
        .replace(/\[[^\]]*\]/g, '')
        // Clean punctuation
        .replace(/—/g, ', ')
        .replace(/–/g, ', ')
        .replace(/\.\.\./g, '.')
        .replace(/…/g, '.')
        .replace(/"/g, '').replace(/"/g, '')
        .replace(/'/g, "'").replace(/'/g, "'")
        .replace(/\s+/g, ' ')
        .replace(/\s+\./g, '.')
        .replace(/\s+,/g, ',')
        .replace(/,\s*,/g, ',')
        .replace(/\.\s*\./g, '.')
        .trim();
    }

    console.log(`[Verse Commentary] Generated ${commentary?.length || 0} chars for ${book} ${chapter}:${verse}`);

    // Cache the generated commentary for future use (only if no user studies)
    if (commentary && supabaseUrl && supabaseServiceKey && !hasUserStudies) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Fire and forget - don't wait for cache to complete
      supabase
        .from("verse_commentary_cache")
        .upsert({
          book,
          chapter: chapterNum,
          verse: verseNum,
          depth,
          commentary_text: commentary,
        }, { onConflict: "book,chapter,verse,depth" })
        .then(({ error }) => {
          if (error) {
            console.error("[Verse Commentary] Cache insert error:", error);
          } else {
            console.log(`[Verse Commentary] Cached ${book} ${chapter}:${verse} (${depth})`);
          }
        });
    }

    return new Response(
      JSON.stringify({ commentary, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Verse Commentary] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
