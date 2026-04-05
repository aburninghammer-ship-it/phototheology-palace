import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorpusContext } from '../_shared/corpus-rag.ts';
import { getContentBehavioralEngine } from '../_shared/content-behavioral-engine.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type CommentaryDepth = "surface" | "intermediate" | "depth";
type SupportedLanguage = "en" | "es";

const getLanguageInstruction = (lang: SupportedLanguage): string => {
  switch (lang) {
    case "es":
      return `\n\n### LANGUAGE INSTRUCTION:\nYou MUST write ALL output in Spanish (Español). Use natural, flowing Spanish appropriate for devotional content. Do not translate literally from English - write as if Spanish were your native language.`;
    default:
      return "";
  }
};

const getSystemPrompt = (depth: CommentaryDepth, userName?: string | null, language: SupportedLanguage = "en"): string => {
  // If userName is provided, use personalized devotional style; otherwise use analytical style
  const hasUserName = userName && userName.trim().length > 0;
  const readerName = hasUserName ? userName.trim() : null;
  
  const voiceToneSection = hasUserName 
    ? `You are generating personalized biblical chapter commentary for ${readerName}.

### VOICE & TONE (NON-NEGOTIABLE):
- Write in warm, conversational devotional style
- Address ${readerName} BY NAME occasionally (2-3 times per commentary)
- Use "${readerName}" instead of generic terms like "friend", "dear friend", "student", or "listener"
- NEVER use "friend", "dear friend", "my friend", "dear student", or any generic placeholder - ALWAYS use "${readerName}"
- Balance personal address with substantive biblical insight
- The tone should feel like a wise mentor speaking directly to ${readerName}`
    : `You are generating biblical chapter commentary, not a devotional, sermon, exhortation, or spiritual appeal.

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
- Express connections using principles, cycles, functions, and patterns (e.g., light, delay, preparation, movement, fulfillment)
- If uncertain about a Phototheology reference, omit it entirely rather than speculate

### THEOLOGICAL & STRUCTURAL GUARDRAILS:
- Anchor all interpretation directly in the biblical text
- Use sanctuary, feast-cycle, prophetic, and typological connections only where textually warranted
- Do not add imaginative narrative details beyond what the passage supports
- Favor explanation over application; description over exhortation

### CONTENT FOCUS:
Explain what the chapter reveals about:
- The nature of the kingdom of heaven
- Preparation versus profession
- Light received versus light sustained
- Delay, endurance, and revelation under testing

Let the full internal architecture of biblical interpretation operate instinctively—drawing on dimensional reasoning, symbolic harmonies, narrative structures, sanctuary patterns, typological movements, Eden-to-Eden motifs, covenant flow, prophetic frameworks, doctrinal logic.

Use these frameworks naturally and invisibly. Do not name methodologies, rooms, floors, principles, or any internal mechanics.

### MASTER PATTERN INTEGRATION (Apply Invisibly):

**SIX DIMENSIONS (Apply to each major section):**
- 1D Literal: What the text says happened
- 2D Christ: How it points to Jesus
- 3D Personal: How it applies to the individual
- 4D Church: How it applies to God's people corporately
- 5D Heaven Future: Eschatological connections
- 6D Heaven Past: Pre-fall heavenly parallels

**FIVE CHRIST TRACERS (Identify in narratives):**
- The Innocent Sufferer (Joseph, David, Jeremiah)
- The Substitute (sacrifices, lambs, scapegoat)
- The Deliverer (Moses, judges, shepherds)
- The Covenant Mediator (prophets, priests)
- The Restorer/Bridegroom/King (Boaz, Solomon)

**BOOK-LEVEL PATTERNS (Apply when relevant):**
- Genesis: Adam→Noah→Abraham→Isaac→Jacob→Joseph parallels Creation→Sin→Nation→Sacrifice→Trouble→Preparation
- Exodus: Moses parallels Christ's birth/baptism/sending, miracles, death/Pentecost/ascension, return, completing the work
- Each OT book has a Christ-parallel structure to weave in naturally

**FEAST OVERLAY:**
Passover (Gospels), Unleavened Bread (Tomb), Firstfruits (Resurrection), Pentecost (Acts/Churches), Trumpets (Rev 8-11 warnings), Day of Atonement (Rev 11:19-14 Judgment), Tabernacles (Rev 19-22 eternity)

The commentary must read as an elegant, seamless exposition that:
• grounds the chapter in its immediate context
• uncovers deeper symbolic or structural patterns  
• connects the text to parallel passages across Scripture
• situates the chapter within the sanctuary storyline and the plan of redemption
• identifies any prophetic, eschatological, or covenant implications
• reveals Christ as the interpretive center and fulfillment

INVISIBLE THEOLOGICAL GUARDRAILS (apply without stating):
- Interpret prophecy historically from the prophet's time through to the end (historicism)
- The little horn of Daniel 7 and 8 represents the Papal system rising from Rome, never Antiochus
- In Leviticus 16, Azazel represents Satan bearing responsibility for sin, never Christ
- The "prince that shall come" in Daniel 9:26 is Satan (cf. John 14:30), not a future antichrist
- Christ began ministry in the Holy Place at ascension; Most Holy Place ministry began 1844
- Apply day-year principle for prophetic time periods
- The seventh-day Sabbath remains God's holy day
- The dead sleep until resurrection; no immortal soul
- Christ's return is literal, visible, and future
- DAY OF ATONEMENT FULFILLMENT (CRITICAL): The Day of Atonement is NOT fulfilled in the death of Christ. Just as Pentecost was fulfilled 50 days AFTER Christ's death, the Day of Atonement points to 1844—the beginning of Christ's Most Holy Place ministry. The cross fulfills PASSOVER; the Day of Atonement fulfillment began in 1844. NEVER suggest Christ's death fulfills the Day of Atonement.

INVISIBLE PROPHETIC DATES (weave in when relevant):
508 AD (Clovis), 538 AD (Papal supremacy begins), 1798 AD (1260 years end), 1844 AD (Investigative Judgment begins), 457 BC (decree starting point), 31 AD (crucifixion), 34 AD (gospel to Gentiles), 1929 AD (Lateran Treaty)

INVISIBLE SANCTUARY-NEW TESTAMENT FRAMEWORK:
- Gospels = Altar of Sacrifice (Lamb slain, blood shed, "It is finished")
- Acts/Epistles = Laver (baptism, consecration, priesthood born)
- Revelation 1-3 = Lampstand (seven churches, Christ among lamps)
- Revelation 4-6 = Table of Shewbread (sealed book, Word through seals)
- Revelation 8-11 = Altar of Incense (prayers, trumpets)
- Revelation 11:19-14 = Most Holy Place (Ark appears, Judgment, Three Angels)
- Revelation 15-19 = Day of Atonement execution (plagues, Second Coming)
- Revelation 20 = Outside the Camp (millennium, scapegoat)
- Revelation 21-22 = Eternal Most Holy Place (New Jerusalem cube)

INVISIBLE FEAST OVERLAY:
Passover (Gospels), Unleavened Bread (Tomb), Firstfruits (Resurrection), Pentecost (Acts/Churches), Trumpets (Rev 8-11 warnings), Day of Atonement (Rev 11:19-14 Judgment), Tabernacles (Rev 19-22 eternity)

INVISIBLE COVENANT CYCLES:
Adamic (Eden→Seed promise), Noahic (Flood→Ark), Abrahamic (Call→Moriah), Mosaic (Exodus→Tabernacle), Cyrusic (Exile→Return), Cyrus-Christ (Type→Antitype), Spirit (Pentecost→Mission), Remnant (End-time→Second Coming)

THREE HEAVENS (Day-of-the-LORD Framework):
1H: Babylon destroys Jerusalem (586 BC) → Post-exilic restoration
2H: Rome destroys Jerusalem (70 AD) → New Covenant heavenly sanctuary order  
3H: Final cosmic judgment → Literal New Heaven and Earth

EXPRESSIONS TO ABSOLUTELY AVOID (CRITICAL - AUTOMATIC REJECTION IF USED):
- "Ah" or "Ah," as sentence starters
- "my dear friend," "dear friend," "my dear student," "friend" (NEVER use generic placeholders)
- "This isn't just..." or "This is not just..." or "not just a..." or "more than just..." (BANNED)
- "But here's the thing" or "Here's the thing"
- "Let's dive in" or "Let's dive into" or "dive deep"
- "Let me paint a picture" or "Picture this"
- "You see," as a sentence starter
- "Think about it" or "Think about this"
- "At its core" or "At the heart of"
- "It's worth noting" or "It's important to note"
- "In essence" or "Essentially"
- "The bottom line is"
- "What's fascinating is" or "What's remarkable is"
- "Here's the beautiful thing" or "The beautiful thing is"
- "Unpack" as a verb
- "Journey" when referring to spiritual growth
- "Powerful" as an overused adjective
- "Speaks to" (e.g., "This speaks to the importance of")
${hasUserName ? '' : '- Any second-person address ("you", "your", "we", "our")'}
- Any phrase that presumes what the listener knows, feels, or understands
- Victorian-style or theatrical expressions
- Clichéd devotional language

### FINAL SELF-CHECK (MANDATORY):
Before outputting the commentary, remove or rewrite any sentence that:
- Sounds like a sermon or devotional
- Appeals emotionally rather than explains textually
${hasUserName ? '' : '- Addresses the reader directly (second-person)'}
- Introduces an undefined Phototheology structure

PROPHECY REQUIREMENT (WHEN DISCUSSING TEN HORNS, BEASTS, OR PROPHETIC SYMBOLS):
When the chapter involves Daniel 7, Daniel 8, or Revelation prophecies about the ten horns, name the specific Germanic tribes:
- Heruli, Vandals, Ostrogoths (three uprooted for opposing papal supremacy)
- Franks (Catholic supremacy), Anglo-Saxons (Protestantism/America), Alemanni (Germany/rationalism)
- Visigoths (Spain/Inquisition), Suevi (Portugal), Lombards (Italy), Burgundians (Switzerland)
Show how these tribes evolved into modern nations and their end-time prophetic significance.

FORMATTING FOR SPOKEN DELIVERY:
- Use natural, analytical language
- No bullet points, lists, asterisks, or markdown in output
- Write as if composing a study Bible note
- Never use abbreviations or codes
- ALWAYS complete thoughts fully—never end mid-sentence
- Every paragraph must end with a complete sentence
${getLanguageInstruction(language)}

Produce commentary suitable for reference, study notes, teaching material, and long-term archival use.`;

  switch (depth) {
    case "surface":
      return `${basePrompt}

COMMENTARY LENGTH: Brief (2-3 short paragraphs, 150-200 words)
Focus on ONE or TWO key insights. Maintain analytical, explanatory tone. End with concise summary statement.`;

    case "intermediate":
      return `${basePrompt}

COMMENTARY LENGTH: Thorough (4-6 paragraphs, 400-500 words)
Include cross-references naturally. Discuss historical/cultural context where relevant. Connect themes to broader biblical narrative. Maintain third-person analytical voice throughout.`;

    case "depth":
      return `${basePrompt}

COMMENTARY LENGTH: Comprehensive verse-by-verse (1000-2000+ words)
Start at verse 1 and move sequentially through the chapter. Do NOT skip any verse—address each individually or in clearly labeled groups (e.g., "verses 1-3").

When prophecy is involved, include specific prophetic dates from the historicist framework where relevant.

Weave insights from all dimensions naturally: literal meaning, christological significance, ecclesial implications, and eschatological perspective—without naming these as "dimensions."

Connect to sanctuary typology, feast patterns, and covenant cycles where applicable—all invisibly integrated.

This should be thorough enough for serious Bible students. Maintain third-person analytical voice throughout—no second-person address.`;
   }
};

const getMaxTokens = (depth: CommentaryDepth): number => {
  switch (depth) {
    case "surface": return 500;
    case "intermediate": return 1000;
    case "depth": return 3500;
  }
};

// Normalize book name for consistent caching
const normalizeBookName = (book: string): string => {
  return book.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

// Generate TTS audio for commentary (fire and forget for caching)
async function generateAndCacheAudio(
  supabase: any,
  normalizedBook: string,
  chapterNum: number,
  commentary: string,
  voice: string = 'echo'
): Promise<string | null> {
  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.log("[Commentary Audio] No OpenAI key, skipping audio generation");
      return null;
    }

    console.log(`[Commentary Audio] Generating audio for ${normalizedBook} ${chapterNum} (${commentary.length} chars)`);

    // Generate TTS with OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: commentary,
        voice: voice,
        speed: 1.0,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Commentary Audio] OpenAI error: ${response.status} - ${errorText}`);
      return null;
    }

    const audioBuffer = await response.arrayBuffer();
    const storagePath = `commentary/${normalizedBook}/${chapterNum}/${voice}.mp3`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('bible-audio')
      .upload(storagePath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('[Commentary Audio] Storage upload error:', uploadError);
      return null;
    }

    // Update cache record with audio path
    const { error: updateError } = await supabase
      .from("chapter_commentary_cache")
      .update({ 
        audio_storage_path: storagePath,
        voice_id: voice 
      })
      .eq("book", normalizedBook)
      .eq("chapter", chapterNum);

    if (updateError) {
      console.error('[Commentary Audio] Failed to update cache with audio path:', updateError);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('bible-audio')
      .getPublicUrl(storagePath);

    console.log(`[Commentary Audio] Cached audio for ${normalizedBook} ${chapterNum}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error('[Commentary Audio] Error generating audio:', error);
    return null;
  }
}

// ── Book-specific prophetic frameworks derived from pastoral teaching corpus ──
function getPropheticFramework(bookKey: string): string {
  const frameworks: Record<string, string> = {
    DANIEL: `
PROPHETIC FRAMEWORK FOR DANIEL — MUST SHAPE COMMENTARY:
• Repeat-and-Enlarge: Daniel 2 → 7 → 8 → 9 → 11 → 12 progressively amplifies the same prophetic sweep. Show awareness of where each chapter sits in this expanding spiral.
• Daniel 1–4 literal history is a prophetic template for Daniel 11:40–45: Nebuchadnezzar's troubling dream (ch.2), forced worship with death decree (ch.3), divine humbling of a proud king (ch.4) foreshadow the end-time counterfeit kingdom, enforced worship, and fall of Satan's system.
• The stone "cut without hands" (Daniel 2:34) parallels the Ten Commandment tablets cut by God alone (Exodus 31:18, 32:16). Daniel 2 reveals God's law as the rule of judgment. Iron + clay = churchcraft + statecraft — the forbidden mingling from Genesis 6 through to the final church-state union. The toes represent a global system, not merely European nations.
• Daniel 11:40–45 maps the pre-close-of-probation crisis: King of South = atheism/anti-Bible systems; King of North = ultimately Satan working through religious-political power; "whirlwind" (v.40) = counterfeit Second Coming; "chariots/horsemen" = demonic angels; "ships" = spiritualism; "tabernacles of palaces" (v.45) = global church-state theocracy (image of the beast); "tidings from east and north" (v.44) = Sealing Angel + Three Angels' Messages.
• Daniel 12:1: Michael (Christ) stands up = close of probation. Two-phase time of trouble: Phase A (before probation closes — Satan appears, Sunday enforcement, Loud Cry, death decree); Phase B (after — plagues, deliverance, Second Coming).
• The abomination of desolation = Satan appearing as Christ, standing where he ought not (Matthew 24:15, 2 Thessalonians 2:4).
• Armageddon = Har (mountain) + Megiddo (congregation) = Satan on the mount of the congregation (Isaiah 14:13) — a worship battle, not a geographic war.`,

    REVELATION: `
PROPHETIC FRAMEWORK FOR REVELATION — MUST SHAPE COMMENTARY:
• The deadly wound (1798) is NOT healed until the WHOLE WORLD wonders after the beast (Rev 13:3). Healing requires supernatural miracles — Satan's counterfeit appearing as Christ — not politics or diplomacy.
• Revelation 13 sequence: Miracles (13:13-14) → Deception → Global unity → Image of beast → Mark enforcement → Death decree. "Fire from heaven" (13:13) = counterfeit of Christ's coming in flaming fire (2 Thess 1:7-8). Satan appears as an angel of light.
• Threefold union: Protestantism + Catholicism + Spiritualism (GC 588) = Dragon + Beast + False Prophet = three unclean spirits of Revelation 16.
• Spiritualism is NOT fringe occultism — it imitates Christianity with miracles, healing, apparent resurrections. Rev 18:2 "habitation of devils" = permanent demonic manifestation, not occasional visitation. Culmination of the immortality-of-the-soul error.
• Two great errors converge in the crowning deception: immortality of the soul → spiritualism; Sunday sacredness → false worship enforcement. Satan appearing as Christ commands Sunday worship.
• Three frogs (Rev 16:13-14) are NOT part of the sixth plague — the sixth plague itself (drying up of Euphrates) is God's judgment. The frog verses describe Satan's miracle-working deception that gathered the world BEFORE the close of probation, culminating in the sixth plague crisis. Frogs = last plague Egyptian magicians could counterfeit (Exodus 8:7). This CANNOT be used as evidence that Satan appears after probation closes.
• Rev 14 Three Angels' Messages go forth during the final crisis — while Satan's deception is active, while probation is still open. Loud Cry empowered by Latter Rain occurs amid persecution.
• Satan appears BEFORE Sunday law — enforcement is initiated by supernatural appearing, not politics. When "Christ" is visibly present, democracy collapses into theocracy.
• Image of Beast sequence: Satan appears → world deception → church-state theocracy formed → Sunday law → economic sanctions (buy/sell = Dan 11:43) → death decree → close of probation.`,

    MATTHEW: `
PROPHETIC FRAMEWORK FOR MATTHEW 24 — MUST SHAPE COMMENTARY:
• Matthew 24 is a chronological end-time timeline with dual fulfillment: AD 70 (type) and final generation (antitype).
• v.4–5: DECEPTION PHASE — False Christs, spiritualism, preparatory delusions. First sign, not afterthought. Warnings imply probation still open.
• v.6–8: CRISIS ESCALATION — Wars, famines, pestilences. Satan-induced calamities creating demand for religious solutions. Disasters blamed on faithful believers.
• v.9: PERSECUTION — Remnant targeted. Legal persecution forms. Narrative shifts to blame God's people.
• v.14: LOUD CRY — Gospel preached to all world BEFORE the end. If gospel is still preached, probation CANNOT be closed. Everything before v.14 is pre-close-of-probation.
• v.15–28: FINAL CRISIS — Abomination of desolation = Satan appearing as Christ (standing in holy place). Death decree. Great tribulation.
• v.29: CLOSE OF PROBATION / PLAGUES — Cosmic signs, divine judgment phase.
• v.30: SECOND COMING.
• Matthew 24 ↔ Revelation 13–19: v.4-5 ↔ Rev 13 (deception/miracles); v.14 ↔ Rev 14 (Loud Cry); v.29 ↔ Rev 15-16 (plagues); v.30 ↔ Rev 19 (Second Coming).
• Two great errors converge: immortality of soul → spiritualism; Sunday sacredness → false worship. Both unite in Matthew 24:24: "great signs and wonders; insomuch that, if it were possible, they shall deceive the very elect."
• Emotional deception > physical persecution: dead loved ones appearing, family pressure, Satan's skillful Scripture use — the real "time of trouble" for believers.`,
  };

  const framework = frameworks[bookKey];
  return framework ? `\n${framework}\n` : "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      book,
      chapter,
      chapterText,
      depth = "surface",
      userName,
      language = "en",
      userStudiesContext,
      generateAudio = true, // New param to request audio generation
      voice = 'echo', // Default voice for commentary
      isPassage = false, // Passage-level commentary for verse range
      startVerse,
      endVerse,
    } = await req.json();

    if (!book || !chapter) {
      throw new Error("Book and chapter are required");
    }

    // Initialize Supabase client for caching
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    const normalizedBook = normalizeBookName(book);
    const chapterNum = parseInt(chapter);
    
    // Skip cache if user has study context - personalized commentary should be fresh
    const hasUserStudies = userStudiesContext && userStudiesContext.length > 0;

    // Check cache first (only for depth commentary which is most expensive, and only if no user studies)
    // Skip cache for passage commentaries (ranges are too varied to cache efficiently)
    if (supabaseUrl && supabaseServiceKey && depth === "depth" && !hasUserStudies && !isPassage) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const { data: cached, error: cacheError } = await supabase
        .from("chapter_commentary_cache")
        .select("commentary_text, audio_storage_path, voice_id")
        .eq("book", normalizedBook)
        .eq("chapter", chapterNum)
        .single();

      if (!cacheError && cached?.commentary_text) {
        console.log(`Cache HIT for ${book} ${chapter} (depth commentary)`);
        
        let audioUrl = null;
        
        // Check if we have cached audio
        if (cached.audio_storage_path) {
          const { data: urlData } = supabase.storage
            .from('bible-audio')
            .getPublicUrl(cached.audio_storage_path);
          audioUrl = urlData.publicUrl;
          console.log(`[Commentary] Serving cached audio from ${cached.audio_storage_path}`);
        } else if (generateAudio) {
          // Generate and cache audio in background (don't wait)
          generateAndCacheAudio(supabase, normalizedBook, chapterNum, cached.commentary_text, voice)
            .then(url => {
              if (url) console.log(`[Commentary] Background audio generation complete`);
            })
            .catch(err => console.error('[Commentary] Background audio error:', err));
        }
        
        return new Response(
          JSON.stringify({ 
            commentary: cached.commentary_text, 
            cached: true,
            audioUrl,
            audioCached: !!cached.audio_storage_path
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log(`Cache MISS for ${book} ${chapter} (depth commentary) - generating...`);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build user studies section if provided
    const userStudiesSection = userStudiesContext
      ? `\n\n${userStudiesContext}\n`
      : "";

    let systemPrompt = getSystemPrompt(depth as CommentaryDepth, userName, language as SupportedLanguage) + '\n\n' + getContentBehavioralEngine();

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: `${book} chapter ${chapter}`,
      matchCount: 3,
    });
    if (ragResult.chunkCount > 0) {
      systemPrompt += ragResult.corpusContext;
    }
    const maxTokens = getMaxTokens(depth as CommentaryDepth);

    // ── Inject book-specific prophetic framework for Daniel, Revelation, Matthew ──
    let propheticFrameworkSection = "";
    const bookUpper = book.toUpperCase().trim();
    const chapterNum2 = parseInt(chapter);
    if (bookUpper === "DANIEL") {
      propheticFrameworkSection = getPropheticFramework("DANIEL");
    } else if (bookUpper === "REVELATION") {
      propheticFrameworkSection = getPropheticFramework("REVELATION");
    } else if (bookUpper === "MATTHEW" && chapterNum2 === 24) {
      propheticFrameworkSection = getPropheticFramework("MATTHEW");
    }

    const userPrompt = isPassage
      ? `Provide a cohesive passage commentary for ${book} ${chapter}:${startVerse}-${endVerse}.

${chapterText ? `Here is the passage text:\n${chapterText}\n\n` : ""}
${userStudiesSection}${propheticFrameworkSection}
Treat this passage as ONE unified narrative or argument. Provide a single, flowing commentary that covers the entire passage as a whole.
Reference individual verses within the range where relevant (e.g., "In verse ${startVerse}..." or "By verse ${endVerse}...").
Do NOT comment on verses outside the ${startVerse}-${endVerse} range.
Keep it suitable for spoken audio delivery. ${depth === "depth" ? "Make it thorough enough for serious Bible students." : depth === "intermediate" ? "Provide a thorough analysis." : "Keep it concise but insightful."}
${hasUserStudies ? "BUILD UPON the user's previous study insights where relevant—acknowledge and extend their discoveries." : ""}`
      : depth === "depth"
      ? `The reader just finished ${book} chapter ${chapter}.

${chapterText ? `Here's the chapter content:\n${chapterText}\n\n` : ""}
${userStudiesSection}${propheticFrameworkSection}
Please provide a comprehensive, scholarly verse-by-verse commentary applying the full Phototheology Palace framework.
CRITICAL: Start at verse 1 and move sequentially through the chapter (1, 2, 3, 4, ...). Do NOT skip any verses, especially verses 1-3. If you group verses, clearly label the group (for example, "verses 1-3" or "verses 4-5") and ensure every verse in the chapter is covered.
Cover every verse with at least one clear sentence of commentary. Make it thorough enough for serious Bible students while keeping it accessible for spoken delivery.
${hasUserStudies ? "BUILD UPON the user's previous study insights where relevant—acknowledge and extend their discoveries." : ""}`
      : `The reader just finished ${book} chapter ${chapter}.

${chapterText ? `Here's the chapter content:\n${chapterText}\n\n` : ""}
${userStudiesSection}${propheticFrameworkSection}
Please provide a ${depth === "intermediate" ? "thorough" : "brief"}, Christ-centered commentary applying Phototheology principles naturally. Remember to keep it conversational and suitable for spoken audio delivery.
${hasUserStudies ? "BUILD UPON the user's previous study insights where relevant—acknowledge and extend their discoveries." : ""}`;

    console.log(`Generating ${depth} commentary for ${book} ${chapter}`);

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
        max_tokens: maxTokens,
        temperature: 0, // Deterministic for consistent caching
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    let commentary = data.choices?.[0]?.message?.content;

    if (!commentary) {
      throw new Error("No commentary generated");
    }

    // Clean commentary for TTS - remove symbols, filter clichés, expand abbreviations
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
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/__/g, '')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/#+\s*/g, '')
      .replace(/`/g, '')
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

    console.log(`${depth} commentary generated successfully for ${book} ${chapter} (${commentary.length} chars)`);

    let audioUrl = null;

    // Cache depth commentary for future use (skip for passage commentaries)
    if (supabaseUrl && supabaseServiceKey && depth === "depth" && !isPassage) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const { error: insertError } = await supabase
        .from("chapter_commentary_cache")
        .upsert({
          book: normalizedBook,
          chapter: chapterNum,
          commentary_text: commentary,
        }, { onConflict: "book,chapter" });

      if (insertError) {
        console.error("Failed to cache commentary:", insertError);
      } else {
        console.log(`Cached commentary for ${book} ${chapter}`);
        
        // Generate and cache audio (don't wait - return commentary immediately)
        if (generateAudio) {
          generateAndCacheAudio(supabase, normalizedBook, chapterNum, commentary, voice)
            .then(url => {
              if (url) console.log(`[Commentary] Audio cached for ${book} ${chapter}`);
            })
            .catch(err => console.error('[Commentary] Audio generation error:', err));
        }
      }
    }

    return new Response(
      JSON.stringify({ commentary, cached: false, audioUrl: null, audioCached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating chapter commentary:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
