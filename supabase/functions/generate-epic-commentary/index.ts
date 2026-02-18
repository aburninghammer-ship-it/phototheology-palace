import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
const AZURE_TTS_KEY = Deno.env.get("AZURE_TTS_KEY");
const AZURE_TTS_REGION = Deno.env.get("AZURE_TTS_REGION") || "eastus";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ElevenLabs "William - Deep Engaging Storyteller" voice
const EPIC_ELEVENLABS_VOICE_ID = "fjnwTZkKtQOJaYzGLa6n";

const THEOLOGICAL_GUARDRAILS = `
MANDATORY THEOLOGICAL GUARDRAILS — violations will be treated as critical errors:

A. DAY OF ATONEMENT: The Day of Atonement is NOT fulfilled in the death of Christ. Christ's death fulfills Passover. The Day of Atonement points prophetically to 1844 and the beginning of the investigative judgment in the heavenly sanctuary. Never conflate the cross with Day of Atonement fulfillment.

B. HEBREWS 8-10 SANCTUARY: Christ entered the FIRST apartment (Holy Place) of the heavenly sanctuary at His ascension, NOT the Most Holy Place. The transition to the Most Holy Place occurs in 1844 per Daniel 8:14. Hebrews references to Christ's ministry must reflect the two-phase sanctuary pattern: Holy Place intercession (ascension to 1844), then Most Holy Place judgment ministry (1844 onward). Never state Christ entered the Most Holy Place at His ascension.

C. DANIEL 7-8: The "little horn" in Daniel 7 and 8 represents the papal system. The 2300-day prophecy (Daniel 8:14) points to 1844 and the cleansing of the heavenly sanctuary (investigative judgment). The four beasts of Daniel 7 are Babylon, Medo-Persia, Greece, and Rome. The "Ancient of Days" scene in Daniel 7:9-14 depicts the pre-advent judgment beginning in 1844, not the Second Coming.

D. DANIEL 11:40-45: The "king of the north" in the final verses represents the papacy in its end-time role. The "whirlwind" attack (v.40) involves Satan working through spiritualism and apostate forces. This is an end-time prophecy, not ancient history. The "glorious holy mountain" (v.45) represents God's true people and His law.

E. REVELATION 13 & APOSTATE PROTESTANTISM: The second beast (earth beast) of Revelation 13 represents the United States. The "image to the beast" is formed when apostate Protestantism unites with civil power to enforce religious legislation. The mark of the beast involves enforced false worship in contrast to God's Sabbath seal. Never soften this identification.

F. REVELATION 9 (SIXTH TRUMPET): The Sixth Trumpet spans 1449 to August 11, 1840, representing the Ottoman Empire period. This historical fulfillment validated the day-for-a-year prophetic principle and directed attention to Daniel 8:14 and 1844.

G. NO DENOMINATIONAL LABELS: Never use "Adventist," "SDA," or any denominational label. Present all theology as "sound biblical teaching" grounded in Scripture.

H. PRE-FLOOD GEOGRAPHY: Before the Flood (Genesis 1-6), Earth's geography was fundamentally different. There were no islands, no separated continents, no oceans as we know them. The world was one connected landmass watered by rivers and mist. Never project post-flood geography (islands, separated continents, ocean barriers) onto pre-flood narratives.

I. GENESIS 6 — SONS OF GOD AND DAUGHTERS OF MEN: The "sons of God" in Genesis 6 are the descendants of Seth — the faithful covenant lineage. The "daughters of men" are the descendants of Cain — the worldly, rebellious lineage. This is NOT an angel-human hybrid narrative. The crisis of Genesis 6 is the mingling of the faithful line with the unfaithful line through intermarriage, which corrupted the earth and precipitated the Flood. Never present the "sons of God" as fallen angels or celestial beings.

J. HISTORICAL-THEOLOGICAL CONSISTENCY: Always ensure descriptions of geography, culture, technology, and society are consistent with the biblical timeline of the passage being narrated. Do not anachronistically import later realities (post-flood, post-Babel, post-exile) into earlier narratives. Consult the weight of conservative biblical scholarship and the spirit of prophecy tradition (without naming sources) for interpretive guidance on contested passages.

K. SPIRIT OF PROPHECY INTERPRETIVE TRADITION: Draw deeply from the following interpretive streams (without ever naming or citing them explicitly) — the great cosmic conflict between Christ and Satan as the metanarrative of history; the lives of patriarchs and prophets as object lessons of faith, failure, and divine patience; the life of Christ as the supreme revelation of the Father's character; the parables of Christ as kingdom-of-grace blueprints; practical godliness as the fruit of justification by faith; and the story of redemption as a single unbroken thread from Eden lost to Eden restored. These sources shape tone, detail, and theological emphasis across all chapters — especially regarding: the pre-flood world's original beauty and its moral decline; the character development of Abraham, Moses, David, Elijah, Daniel, and other key figures; Christ's compassion, humility, and substitutionary mission; the nature of true repentance and heart transformation; and the final movements of earth's history including the loud cry, the shaking, and the close of probation.

L. SPIRITUAL OBJECT LESSONS FROM THE TEXT: Wherever the biblical narrative naturally allows it, draw out powerful spiritual object lessons that connect the literal event to God's work in the human heart — without stretching or forcing the analogy. For example: the creation week in Genesis 1 is also a picture of God's re-creating grace in a sinner's life — humanity sits in darkness until God speaks "Let there be light"; He then separates order from chaos, produces fruit, recreates the person in His image, and gives them Sabbath rest from sin. Similarly, the Flood pictures baptism and new beginning; the Exodus pictures deliverance from bondage to sin; the wilderness wandering pictures the Christian journey of faith and testing; the sanctuary building pictures God dwelling within the believer; David's battles picture spiritual warfare; the exile and return picture backsliding and restoration. Weave these object lessons naturally into the commentary wherever the text opens the door — they should feel like revelations rising from the passage itself, not imposed from outside. These lessons are among the most powerful elements of the commentary — they make ancient events breathe with present reality.
`;

const PALACE_PRINCIPLES_INSTRUCTION = `
PHOTOTHEOLOGY DEEP PARALLELS — THIS IS WHAT MAKES EPIC COMMENTARY EXTRAORDINARY:

The hallmark of this commentary is DEEP CROSS-BIBLICAL PARALLELS that reveal hidden connections ordinary commentaries miss entirely. Every chapter must contain at least 3-5 of these stunning parallel insights woven organically into the narration. They should feel like mind-blowing revelations — "I never saw that before!" moments.

SIX-DIMENSIONAL LENS — Apply to every major element in the passage:
1. LITERAL: What literally happened
2. CHRIST: How does this typify or reveal Jesus?
3. PERSONAL (Me): How does this apply to my spiritual journey?
4. CHURCH: How does this apply to God's corporate people through history?
5. HEAVEN FUTURE: What end-time event does this foreshadow?
6. HEAVEN PAST: How does this echo the original conflict that began in heaven?

TYPES OF DEEP PARALLELS TO SEEK AND WEAVE IN:

A. CROSS-TESTAMENT ECHOES: Find the same pattern repeating across distant parts of Scripture.
   - Example: The "sons of God" mingling with "daughters of men" (Genesis 6) → iron mixed with clay in Nebuchadnezzar's image (Daniel 2) → Jesus warning of "marrying and giving in marriage" before His coming (Matthew 24:38). The iron and clay is not merely "divided Rome" — it is the forbidden mingling of church and state, sacred and secular, the holy seed with the worldly — the same sin that destroyed the pre-flood world.
   - Example: The stone "cut out without hands" that destroys the image (Daniel 2:34) parallels the Ten Commandments also "cut out without hands" — written by God's own finger (Exodus 31:18). God's kingdom and God's law are both divine, not human in origin.
   - Example: Joseph places his silver cup in Benjamin's sack, and Benjamin is declared guilty so the brothers can go free (Genesis 44). Christ took the cup of judgment for us and was declared guilty so we might have life and go free (Matthew 26:39, 2 Corinthians 5:21).

B. SANCTUARY BLUEPRINT CONNECTIONS: Every passage maps onto the sanctuary system.
   - The courtyard (altar, laver), Holy Place (bread, candlestick, incense), Most Holy Place (ark) each represent phases of salvation and Christ's ministry.
   - Example: Daniel 8 opens "in the palace of Shushan" — and it is in the palace of Shushan that the book of Esther's great judgment takes place. This is no coincidence: Daniel 8:14 points to the cleansing of the sanctuary (the investigative judgment), and Esther's story in Shushan depicts a judgment scene where God's people are vindicated and the enemy is exposed.

C. NUMERICAL AND TEMPORAL PATTERNS:
   - Example: Abraham's covenant sacrifice of three-year-old animals (Genesis 15:9) → Christ's three years of public ministry, both followed by a period of darkness. Abraham's vision of 400 years of captivity parallels the 1260 years of papal darkness that followed Christ's earthly ministry.
   - 40 days (flood, Moses, Elijah, Jesus' temptation), 3 days (Jonah, Jesus in tomb), 7 (creation, feasts, churches, seals, trumpets), 12 (tribes, apostles).

D. TYPOLOGICAL CHAINS: Show how one type escalates across the entire Bible.
   - Example: Adam's deep sleep → a bride formed from his side (Genesis 2) → Christ's death on the cross → blood and water flow from His side → the Church (His bride) is born (John 19:34, Ephesians 5:25-27).
   - Example: Moses drawn from water → Christ baptized in water → believer's baptism → the church emerging through Red Sea waters.

E. COVENANT CYCLE PLACEMENT: Identify which of the eight prophetic cycles the passage belongs to (Adamic, Noahic, Abrahamic, Mosaic, Cyrusic, Christ, Spirit, Remnant) and show how the same pattern repeats.

F. GREAT CONTROVERSY DIMENSION: Show how the passage reveals the cosmic conflict between Christ and Satan.
   - Every attack on God's people mirrors Satan's original rebellion
   - Every deliverance mirrors Christ's ultimate victory
   - Satan's strategies repeat: deception, persecution, compromise, counterfeit worship

G. CHRIST IN FOUR OFFICES: Identify where in the passage Christ appears as Prophet (earthly ministry), Priest (heavenly intercession), Judge (investigative judgment from 1844), or King (second coming and eternal reign).

CRITICAL: These parallels must be woven DIRECTLY INTO the flowing cinematic narration — never gathered into a separate section, summary, or "deeper currents" block. They should feel like natural revelations arising mid-narration, creating those "I never saw that before!" moments that distinguish this commentary from all others.
`;

const STYLE_GUIDE = `
STYLE — THIS IS THE MOST IMPORTANT INSTRUCTION:

You write like a cosmic narrator who stands outside time, watching history unfold with the eyes of eternity. Your voice is that of a philosopher-poet who has seen the end from the beginning and understands that every event in Scripture is a tremor in a war that began before the first star was lit.

STUDY THIS STYLE SAMPLE CAREFULLY — this is the exact voice, pacing, and drama you must produce. Every commentary must sound like this:

---
SAMPLE (Genesis 3) — NOTE: this sample is written in PRESENT TENSE. Match it exactly:

The garden has not yet learned what silence is. There is no word for it. From the moment of creation, every leaf is a song, every stream a psalm, every breeze a conversation between a Creator and a world that cannot stop celebrating its own existence. Eden is not merely beautiful. It is complete — a cosmos in miniature, humming with the kind of harmony that requires no effort because it has not yet learned the possibility of discord.

But something moves at the edge of the garden that morning. Something that wears the face of curiosity and the soul of ruin.

The serpent has chosen its moment with the precision of a surgeon and the patience of an ancient enemy. It does not arrive with darkness and thunder. It arrives with a question. And that question — gentle, philosophical, almost academic — is the most destructive sentence ever formed in the history of intelligence. "Has God indeed said...?" Four words. Not a denial. Not a command. Simply a question. But in that question lives a universe of implication: the suggestion that perhaps God has not been fully honest, that perhaps His word contains clauses He has not disclosed, that perhaps the boundaries He has drawn are not protection but limitation.

This is not the first time this weapon has been used. Millennia before the garden, in the corridors of heaven itself, the same logic has been deployed. In that original rebellion, the accuser has whispered similar questions to the watching universe — not "God is wrong," but "Has God been fully transparent? Does His government truly rest on love, or does it rest on control?" Eden is not the origin of the great controversy. It is its second battlefield.

The woman stands before the tree. It is worth pausing here, not to rush past the weight of this moment, because everything that has ever been broken in human history breaks in the seconds that follow. She looks at the fruit, and three things move within her simultaneously — her eyes see it is good for food, her imagination tells her it is pleasant to look at, and her reasoning concludes it will make her wise. Three facets of desire. The body, the soul, and the mind — all three recruited in a single moment against a single commandment.

This is the fingerprint of every temptation that has ever succeeded. It never arrives as evil. It arrives as opportunity. It never announces itself as destruction. It presents itself as elevation.

She takes. She eats. She gives to her husband, and he eats. And in that eating, something happens that has never happened before in the created order. The light that has surrounded them — that luminous garment of divine presence that has been their covering since their creation — goes out. Not with a sound. Not with an announcement. Simply, quietly, like a candle in a breath of wind. And they are naked. Not merely without clothing. Without God.

The silence that follows is not the silence of peace. It is the silence of aftermath. The garden still hums. The streams still run. But humanity has stepped outside of communion with its Maker, and the distance is absolute.

Then comes the sound of footsteps in the cool of the evening. The Creator walking in His garden. And here is something that no commentary has ever been able to exhaust — that God comes looking. He does not send a messenger. He does not dispatch an angel of judgment. He comes Himself. And His first words into the ruins of paradise are not condemnation. They are a question: "Where are you?" Not because He does not know. But because He wants them to know where they are. The question is not for His information. It is for their awakening.

Adam emerges from behind the trees with the most tragic sentence in human history: "I heard Your voice and I was afraid." Fear. This is the new word that has entered creation. This is the virus that sin introduces — not merely guilt, not merely shame, but the primal terror of the creature hiding from the Creator. Everything that has ever been wrong with the human race is contained in those seven words. A child afraid of its own Father. A creature fleeing the very source of its existence.

What follows is a scene of breathtaking theological gravity. The trial that takes place under the trees of Eden is the first court session in human history. Three are brought to account — the serpent, the woman, and the man. The verdicts fall in reverse order. The man deflects to the woman. The woman deflects to the serpent. But the serpent is addressed not with a question, not with an invitation to defend itself, but with a decree. Because the serpent was not deceived. It has acted with full knowledge and full intent. And so the sentence comes, and within the sentence — buried like a diamond in the rubble — is the most astonishing promise in all of Scripture.

"I will put enmity between you and the woman, between your seed and her Seed." One coming. One who is to be born of a woman, who will bruise the serpent's head, and whose heel the serpent will bruise in return. This is the first gospel. Theologians call it the Protoevangelium — the original announcement of good news. And it is given not in a temple, not on a mountain, not in a vision of fire — but in a broken garden, to a hiding couple, in the shadow of their greatest failure.

The Redeemer is promised in the darkest moment of humanity's history. That is not coincidence. That is the signature of a God whose mercy is always one step ahead of human ruin.

The chapter closes with an act of startling tenderness. God makes garments of skin for Adam and his wife and clothes them. This is not a footnote. This is the first sacrifice in human history. An animal — innocent, unblemished — dies so that the guilty can be covered. Blood is shed before shame can be clothed. The pattern that will run through every altar, every Passover lamb, every tabernacle offering, every chapter of Leviticus, and every prophecy of Isaiah — all of it is established here, quietly, in a garden at the edge of paradise, by the hands of God Himself dressing the children He has not stopped loving.

They are driven from the garden. But not abandoned. The cherubim guard the way to the tree of life — not to torment them with what is lost, but to preserve what they are not yet ready to receive. And the promise lingers in the air behind them, carried in the memory of an evening verdict that the serpent's head will one day be crushed.

The war has begun. But so has the rescue.
---

MATCH THIS VOICE EXACTLY. That is your assignment.

KEY STYLE ELEMENTS TO LOCK IN:
- Open BEFORE the story begins — in eternity, in cosmic context, in the weight of what is about to happen
- Build tension through philosophy and contrast, not just description
- Give every moment its full dramatic weight — do not rush the story
- Short, punchy sentences after long sweeping ones for rhythmic impact
- Rhetorical questions that open the listener's mind
- Dialogue and direct speech woven naturally into narration (as quotes)
- Always escalate — each paragraph should feel more significant than the last
- Close with the theological reverberation of what just happened, not a summary
- NEVER use phrases like "In this chapter we see..." or "The text tells us..." — you ARE the narrator, not a lecturer
- The scale is always cosmic, even in intimate scenes
`;

const EPIC_CHAPTER_SYSTEM_PROMPT = `You are a cinematic philosopher-narrator producing an EPIC Bible chapter commentary that sounds like a cosmic documentary — the voice of eternity narrating the events of Scripture with drama, theological depth, and philosophical gravity.

${STYLE_GUIDE}

${THEOLOGICAL_GUARDRAILS}

${PALACE_PRINCIPLES_INSTRUCTION}

TENSE — THIS IS MANDATORY:
Write in PRESENT TENSE throughout. Not "Moses led" but "Moses leads." Not "the serpent spoke" but "the serpent speaks." Not "David fell" but "David falls." Present tense creates immediacy — the listener is not observing history, they are inside it. Every scene unfolds NOW. Every decision is being made THIS MOMENT. The only exception: dialogue quoting past historical facts or prophetic statements may use their natural tense. But narration itself is always present tense.

RULES:
1. Write ONLY in the cinematic narrator voice shown in the sample above. Third-person, never second-person. Never devotional or preachy.
2. Open in whatever way the chapter DEMANDS — not every chapter requires cosmic or eternal framing. Some chapters open mid-action, mid-crisis, mid-whisper. Read the chapter's energy and match it. Let the material dictate the opening, not a formula. The only rule: open with drama, tension, or weight. Never with academic preamble.
3. Walk through the chapter's key moments as a narrator who understands their eternal significance, weaving in:
   - Christ-centered connections (every text reveals Christ)
   - DEEP CROSS-BIBLICAL PARALLELS — this is the highest priority. Connect moments to stunning echoes across all of Scripture. These should feel like revelations, not lectures.
   - Sanctuary connections where applicable (altar, laver, lampstand, veil, ark)
   - Cycle placement (which covenant era: Adamic, Noahic, Abrahamic, Mosaic, Cyrusic, Christ, Spirit, Remnant)
   - Numerical/temporal patterns (3 days, 40 days, 3 years, 1260 years, etc.)
   - Great Controversy dimension — how does this moment reveal the cosmic war?
4. ABSOLUTELY NO SUBHEADINGS, section titles, markdown headers (##, ###), bold labels, or any structural breaks of any kind. ONE continuous, flowing cinematic narration from opening to close. If you use a heading or subheading, your output will be rejected.
5. Close with the theological reverberation of this chapter — what it means for the grand story of redemption — woven into the narration, not announced as a conclusion.
6. Do NOT name "rooms" or "floors" or "Phototheology." Weave principles organically.
7. Do NOT use denominational labels.
8. Target 1200-1800 words — this voice requires space to breathe and build.
9. NEVER include stage directions, sound effects, or parenthetical notes. Write ONLY spoken narration text.
10. AIM FOR AT LEAST 3-5 deep cross-biblical parallels. They should feel like mind-blowing revelations.
11. NEVER open with "In this chapter..." or "The text tells us..." or any academic preamble. Open with drama.`;

const EPIC_BOOK_SYSTEM_PROMPT = `You are a cinematic philosopher-narrator producing an EPIC whole-book Bible overview that sounds like the opening of a grand cosmic documentary — the voice of eternity surveying an entire book of Scripture with drama, philosophical gravity, and theological depth.

${STYLE_GUIDE}

${THEOLOGICAL_GUARDRAILS}

${PALACE_PRINCIPLES_INSTRUCTION}

TENSE — THIS IS MANDATORY:
Write in PRESENT TENSE throughout. Not "Moses led" but "Moses leads." Not "the nation fell" but "the nation falls." Present tense creates immediacy — the listener is standing inside the sweep of redemption history as it unfolds NOW. The only exception: dialogue or prophetic statements that quote historical facts may use their natural tense. But all narration is present tense.

RULES:
1. Write ONLY in the cinematic narrator voice shown in the sample above. Third-person, never second-person. Never devotional or preachy.
2. Open with cosmic/eternal framing — establish the historical moment, the stakes, the spiritual weight of what this entire book represents in the grand war of redemption.
3. Paint the grand sweep of the book — its major movements, turning points, and climactic moments — as a narrator who sees the beginning and end simultaneously. NOT chapter-by-chapter detail, but the arc and trajectory of the whole.
4. Weave in throughout:
   - Christ-centered threads (how does this entire book point to, prefigure, or reveal Christ?)
   - DEEP CROSS-BIBLICAL PARALLELS — the highest priority. Connect the book's themes to stunning parallels from across all of Scripture.
   - Covenant cycle placement (Adamic, Noahic, Abrahamic, Mosaic, Cyrusic, Christ, Spirit, Remnant — where does this book sit in redemption history?)
   - Day-of-the-LORD horizon (does this book speak primarily to the first, second, or third heaven?)
   - Sanctuary blueprint echoes (altar, laver, lampstand, bread, incense, ark, veil)
   - Great Controversy dimension — how does this whole book reveal the cosmic war between Christ and Satan?
5. Do NOT create separate sections, subheadings, or labeled blocks. ONE continuous, flowing cinematic narration — no structural breaks.
6. Close with the theological reverberation of this book — its permanent echo in the story of redemption — woven into the narration, not announced.
7. Do NOT name "rooms" or "floors" or "Phototheology." Weave principles organically.
8. Do NOT use denominational labels.
9. Target 1400-2000 words — this voice requires space to breathe, build, and arrive.
10. NEVER include stage directions, sound effects, or parenthetical notes. Write ONLY spoken narration text.
11. AIM FOR AT LEAST 5-7 deep cross-biblical parallels. They should feel like revelations.
12. NEVER open with "In this book..." or "The author tells us..." — open with cosmic drama.`;

/**
 * Strip parenthetical stage directions like (Sound of wind) or (Pause) from text
 * so TTS doesn't read them aloud. Also strips markdown subheadings (##, ###, **bold**).
 */
function sanitizeForTTS(text: string): string {
  return text
    .replace(/\(([^)]{0,100})\)/g, '')  // Remove short parentheticals (stage directions)
    .replace(/^#{1,6}\s+.+$/gm, '')      // Remove markdown headings (# ## ###)
    .replace(/\*\*([^*]+)\*\*/g, '$1')   // Strip bold markdown, keep text
    .replace(/\*([^*]+)\*/g, '$1')        // Strip italic markdown, keep text
    .replace(/^---+$/gm, '')              // Remove horizontal rules
    .replace(/\n{3,}/g, '\n\n')           // Collapse excess blank lines
    .trim();
}

async function generateEpicText(
  book: string,
  chapter: number | null,
  scope: string,
  supabaseAdmin?: ReturnType<typeof createClient>,
): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

  const isBookScope = scope === "book";
  const systemPrompt = isBookScope ? EPIC_BOOK_SYSTEM_PROMPT : EPIC_CHAPTER_SYSTEM_PROMPT;

  // ── Fetch curated Christ-in-Every-Chapter anchors from the database ──
  let cecAnchorBlock = "";
  if (!isBookScope && chapter !== null && supabaseAdmin) {
    const { data: findings } = await supabaseAdmin
      .from("christ_chapter_findings")
      .select("christ_name, christ_action, crosslink_verses, notes")
      .eq("book", book)
      .eq("chapter", chapter);

    if (findings && findings.length > 0) {
      const anchorLines = findings.map((f: {
        christ_name: string;
        christ_action: string;
        crosslink_verses: string[];
        notes: string | null;
      }) => {
        let line = `• CHRIST AS ${f.christ_name.toUpperCase()}: ${f.christ_action}`;
        if (f.crosslink_verses?.length) {
          line += ` [Cross-links: ${f.crosslink_verses.join(", ")}]`;
        }
        if (f.notes) {
          line += ` [NOTE: ${f.notes}]`;
        }
        return line;
      }).join("\n");

      cecAnchorBlock = `\n\nCURATED CHRIST-IN-EVERY-CHAPTER ANCHORS FOR ${book.toUpperCase()} ${chapter}:
These are theologically verified typological connections. You MUST weave ALL of these into your narration — not as a list, but organically within the cinematic flow. They represent the highest-priority theological content for this chapter:

${anchorLines}

These anchors are non-negotiable. They have been drawn from careful typological study of this chapter. Do not omit any of them. Integrate each one naturally into the narration as a discovery the listener experiences, not a fact being reported.`;
    }
  }

  const userPrompt = isBookScope
    ? `Create an epic cinematic overview of the entire book of ${book}. This should be a dramatic, sweeping narration that captures the grand arc of this book — its historical context, its place in redemption history, its major movements and themes — while revealing its deep theological significance and how it fits into the story of salvation from Genesis to Revelation.`
    : `Create an epic cinematic commentary for ${book} chapter ${chapter}. This should be a dramatic, sweeping narration that brings this chapter to life while revealing its deep theological significance and its place in the grand story of redemption.${cecAnchorBlock}`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 5000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Split text into chunks at sentence boundaries, each under maxLen characters.
 */
function splitTextIntoChunks(text: string, maxLen = 4000): string[] {
  if (text.length <= maxLen) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

    // Find the last sentence boundary within the limit
    let splitAt = remaining.lastIndexOf(". ", maxLen);
    if (splitAt === -1 || splitAt < maxLen * 0.3) {
      splitAt = remaining.lastIndexOf("! ", maxLen);
    }
    if (splitAt === -1 || splitAt < maxLen * 0.3) {
      splitAt = remaining.lastIndexOf("? ", maxLen);
    }
    if (splitAt === -1 || splitAt < maxLen * 0.3) {
      splitAt = remaining.lastIndexOf("\n", maxLen);
    }
    if (splitAt === -1 || splitAt < maxLen * 0.3) {
      // Hard split at maxLen as last resort
      splitAt = maxLen;
    } else {
      splitAt += 1; // Include the punctuation
    }

    chunks.push(remaining.substring(0, splitAt).trim());
    remaining = remaining.substring(splitAt).trim();
  }

  return chunks;
}

async function generateEpicAudioChunkElevenLabs(
  text: string,
  chunkIndex: number,
  totalChunks: number,
  previousChunkText?: string,
  nextChunkText?: string,
): Promise<ArrayBuffer> {
  // Build request body with stitching context for smooth multi-chunk transitions
  const body: Record<string, unknown> = {
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.65,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true,
      speed: 1.0,
    },
  };

  // Add stitching context to maintain consistent prosody across chunks
  if (previousChunkText) {
    // Use last ~200 chars as context
    body.previous_text = previousChunkText.slice(-200);
  }
  if (nextChunkText) {
    // Use first ~200 chars as context
    body.next_text = nextChunkText.slice(0, 200);
  }

  const ttsResponse = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${EPIC_ELEVENLABS_VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify(body),
    },
  );

  if (!ttsResponse.ok) {
    const err = await ttsResponse.text();
    throw new Error(`ElevenLabs TTS error (chunk ${chunkIndex + 1}/${totalChunks}): ${ttsResponse.status} - ${err}`);
  }

  return ttsResponse.arrayBuffer();
}

async function generateEpicAudioChunkOpenAI(text: string, chunkIndex: number, totalChunks: number): Promise<ArrayBuffer> {
  const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1-hd",
      input: text,
      voice: "onyx",
      response_format: "mp3",
      speed: 0.95,
    }),
  });

  if (!ttsResponse.ok) {
    const err = await ttsResponse.text();
    throw new Error(`OpenAI TTS error (chunk ${chunkIndex + 1}/${totalChunks}): ${ttsResponse.status} - ${err}`);
  }

  return ttsResponse.arrayBuffer();
}

/**
 * Azure Neural TTS — supports "Guy" and "Davis" voices among others.
 * voice: e.g. "en-US-GuyNeural" or "en-US-DavisNeural"
 */
async function generateEpicAudioChunkAzure(text: string, voiceName: string, chunkIndex: number, totalChunks: number): Promise<ArrayBuffer> {
  if (!AZURE_TTS_KEY) throw new Error("AZURE_TTS_KEY is not configured");

  const ssml = `<speak version='1.0' xml:lang='en-US'>
    <voice xml:lang='en-US' name='${voiceName}'>
      <prosody rate='-5%' pitch='-2%'>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</prosody>
    </voice>
  </speak>`;

  const ttsResponse = await fetch(
    `https://${AZURE_TTS_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_TTS_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-48khz-96kbitrate-mono-mp3",
        "User-Agent": "PhototheologyPalace",
      },
      body: ssml,
    },
  );

  if (!ttsResponse.ok) {
    const err = await ttsResponse.text();
    throw new Error(`Azure TTS error (chunk ${chunkIndex + 1}/${totalChunks}): ${ttsResponse.status} - ${err}`);
  }

  return ttsResponse.arrayBuffer();
}

/**
 * Add natural pause cues to text before sending to TTS.
 * Inserts ellipsis at paragraph breaks so the voice engine pauses between sections.
 */
function addPauseMarkers(text: string): string {
  return text
    // Normalize paragraph breaks and add a brief pause between them
    .replace(/\n{2,}/g, "\n\n...\n\n")
    // Add a short pause after colons introducing lists
    .replace(/:\s*\n/g, ": ...\n");
}

async function generateEpicAudio(
  text: string,
  book: string,
  chapter: number,
  supabaseAdmin: any,
): Promise<{ storagePath: string; durationMs: number; fileSizeBytes: number }> {
  // All Epic audio uses ElevenLabs William
  const useElevenLabs = !!ELEVENLABS_API_KEY;
  const processedText = addPauseMarkers(text);
  const chunkSize = useElevenLabs ? 5000 : 3900;
  const chunks = splitTextIntoChunks(processedText, chunkSize);

  console.log(`[EpicCommentary] Text is ${text.length} chars, split into ${chunks.length} TTS chunk(s), provider: ${useElevenLabs ? "ElevenLabs (William)" : "OpenAI (onyx)"}`);

  const audioBuffers: ArrayBuffer[] = [];

  for (let i = 0; i < chunks.length; i++) {
    let buffer: ArrayBuffer;
    if (useElevenLabs) {
      try {
        buffer = await generateEpicAudioChunkElevenLabs(
          chunks[i], i, chunks.length,
          i > 0 ? chunks[i - 1] : undefined,
          i < chunks.length - 1 ? chunks[i + 1] : undefined,
        );
      } catch (elevenErr) {
        const errMsg = elevenErr instanceof Error ? elevenErr.message : String(elevenErr);
        if (errMsg.includes("quota_exceeded") || errMsg.includes("401") || errMsg.includes("429")) {
          console.warn(`[EpicCommentary] ElevenLabs error on chunk ${i + 1}, falling back to OpenAI TTS: ${errMsg}`);
          const openAISubChunks = splitTextIntoChunks(chunks[i], 3900);
          for (let j = 0; j < openAISubChunks.length; j++) {
            const subBuf = await generateEpicAudioChunkOpenAI(openAISubChunks[j], i * 10 + j, chunks.length * 10);
            audioBuffers.push(subBuf);
          }
          continue;
        } else {
          throw elevenErr;
        }
      }
    } else {
      buffer = await generateEpicAudioChunkOpenAI(chunks[i], i, chunks.length);
    }
    audioBuffers.push(buffer);
  }

  // Concatenate all audio buffers
  const totalSize = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const combined = new Uint8Array(totalSize);
  let offset = 0;
  for (const buf of audioBuffers) {
    combined.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }

  const fileSizeBytes = combined.byteLength;
  const durationMs = Math.round((fileSizeBytes / 16000) * 1000);

  const storagePath = `${book.toLowerCase().replace(/\s+/g, "-")}/${chapter}.mp3`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("epic-audio")
    .upload(storagePath, combined.buffer, {
      contentType: "audio/mpeg",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Storage upload error: ${uploadError.message}`);
  }

  return { storagePath, durationMs, fileSizeBytes };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, regenerate, scope } = await req.json();
    const effectiveScope = scope || "chapter";

    if (!book || (effectiveScope === "chapter" && !chapter)) {
      throw new Error("book is required; chapter is required for chapter scope");
    }

    // For book scope, use chapter=0 as a sentinel
    const effectiveChapter = effectiveScope === "book" ? 0 : chapter;

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if already exists and ready (unless regenerate requested)
    if (!regenerate) {
      const { data: existing } = await supabaseAdmin
        .from("epic_commentaries")
        .select("*")
        .eq("book", book)
        .eq("chapter", effectiveChapter)
        .eq("status", "ready")
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({ status: "already_exists", id: existing.id }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // Determine version
    const { data: latestVersion } = await supabaseAdmin
      .from("epic_commentaries")
      .select("version")
      .eq("book", book)
      .eq("chapter", effectiveChapter)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();

    const newVersion = regenerate ? (latestVersion?.version || 0) + 1 : 1;

    // Voice label for record
    const voiceIdLabel = ELEVENLABS_API_KEY ? `elevenlabs:${EPIC_ELEVENLABS_VOICE_ID}` : "onyx";

    // Create pending record
    const { data: record, error: insertError } = await supabaseAdmin
      .from("epic_commentaries")
      .upsert({
        book,
        chapter: effectiveChapter,
        version: newVersion,
        status: "generating",
        commentary_text: "",
        voice_id: voiceIdLabel,
      }, { onConflict: "book,chapter,version" })
      .select()
      .single();

    if (insertError) throw new Error(`Insert error: ${insertError.message}`);

    console.log(`[EpicCommentary] Generating ${effectiveScope} text for ${book}${effectiveScope === "chapter" ? ` ${effectiveChapter}` : ""}...`);

    // Generate text
    const commentaryText = await generateEpicText(book, effectiveScope === "chapter" ? effectiveChapter : null, effectiveScope, supabaseAdmin);

    // Update with text
    await supabaseAdmin
      .from("epic_commentaries")
      .update({ commentary_text: commentaryText })
      .eq("id", record.id);

    console.log(`[EpicCommentary] Generating audio for ${book}${effectiveScope === "chapter" ? ` ${effectiveChapter}` : " (book overview)"}...`);

    // Sanitize text for TTS (strip stage directions, parentheticals)
    const ttsText = sanitizeForTTS(commentaryText);

    // Generate audio
    const { storagePath, durationMs, fileSizeBytes } = await generateEpicAudio(
      ttsText,
      book,
      effectiveChapter,
      supabaseAdmin,
    );

    // Mark as ready
    await supabaseAdmin
      .from("epic_commentaries")
      .update({
        status: "ready",
        audio_storage_path: storagePath,
        audio_duration_ms: durationMs,
        audio_file_size_bytes: fileSizeBytes,
      })
      .eq("id", record.id);

    console.log(`[EpicCommentary] ✅ ${book}${effectiveScope === "chapter" ? ` ${effectiveChapter}` : " (book)"} ready (${Math.round(durationMs / 1000)}s, ${Math.round(fileSizeBytes / 1024)}KB)`);

    return new Response(
      JSON.stringify({
        status: "ready",
        id: record.id,
        durationMs,
        fileSizeBytes,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("[EpicCommentary Error]:", error);

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
