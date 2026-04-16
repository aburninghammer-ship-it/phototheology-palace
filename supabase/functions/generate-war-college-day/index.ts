import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RANK_DESCRIPTIONS: Record<string, string> = {
  initiate: "Foundational Formation — build epistemological foundations and introduce the opponent's core worldview",
  apprentice: "Advanced Engagement — confront core challenges with deeper theological and philosophical analysis",
  strategist: "Strategic Depth — multi-layered defense weaving sanctuary, prophecy, and Great Controversy themes",
  tactician: "Tactical Mastery — proactive theological offense, turning the opponent's framework against itself",
  commander: "Elite Command — comprehensive battlefield dominance across all dimensions of the debate",
};

// ── Avatar-specific 56-day curriculum maps ────────────────────────────────────
// These provide focused day-by-day topics so the AI generates targeted content
// rather than generic apologetics material.

const AVATAR_CURRICULUM: Record<string, string[]> = {
  "anti-prophet": [
    // WEEK 1 — INITIATE: Foundations of Prophetic Authority
    "Day 1: What makes a prophet? Biblical criteria from Deuteronomy 13, 18; Isaiah 8:20; Matthew 7:15-20 — establishing the testing framework before examining Ellen White",
    "Day 2: Thought inspiration vs. verbal dictation — the SDA inspiration model and why it matters for every accusation that follows",
    "Day 3: How biblical prophets used sources — Luke's research (Luke 1:1-4), the Chronicler, Jude quoting 1 Enoch, Paul quoting pagan poets",
    "Day 4: The fruit test applied — 150 years, 200 countries, 900+ languages, health reform, education system, global mission. What are the actual fruits?",
    "Day 5: Who are the critics? Walter Rea, Dirk Anderson, Canright, Ronald Numbers — understanding their backgrounds, methods, and motivations",
    "Day 6: The emotional battlefield — why Ellen White criticism hits differently than other theological debates. Handling personal attachment and detachment",
    "Day 7: Review and synthesis — building your foundational defense framework for the weeks ahead",
    // WEEK 2 — INITIATE: The Plagiarism Charge
    "Day 8: Walter Rea's 'The White Lie' — what he actually claimed, his methodology, and his personal history with the church",
    "Day 9: The Fred Veltman 'Life of Christ Research Project' — the church-commissioned study of Desire of Ages. What it actually found vs. what critics claim it found",
    "Day 10: 19th-century literary conventions — how authors, preachers, and editors used sources in Ellen White's era. The presentism fallacy",
    "Day 11: Side-by-side analysis — examining the most commonly cited 'plagiarism' passages (Great Controversy / J.A. Wylie, Desire of Ages / William Hanna). What's borrowed and what's transformed",
    "Day 12: Ellen White's own statements about her use of sources — 'I do not write one article...' (Review & Herald 1903) in full context. What did she actually claim?",
    "Day 13: The scaffolding vs. the cathedral — distinguishing borrowed historical narrative from unique prophetic-interpretive framework (Great Controversy theme, sanctuary Christology)",
    "Day 14: Debate simulation — defending against a rapid-fire plagiarism assault with documented evidence",
    // WEEK 3 — APPRENTICE: Failed Prophecies
    "Day 15: The 1856 vision (Testimonies vol. 1, pp. 131-132) — 'some in this room will be food for worms, some will be translated.' Full context and conditional prophecy framework",
    "Day 16: Conditional prophecy in Scripture — Jeremiah 18:7-10, Jonah 3:4, Jesus' 'this generation' (Matthew 24:34), Paul's 'we who are alive' (1 Thessalonians 4:15)",
    "Day 17: The 'shut door' controversy — October 22, 1844 through the mid-1850s. What early Adventists actually believed and how understanding evolved",
    "Day 18: The Peter parallel — how the apostolic church's theology on Gentile inclusion (Acts 10-11, 15) mirrors Adventism's shut-door development",
    "Day 19: The 'Walled City' vision, 'old Jerusalem' statement, and other allegedly failed predictions — examining each in context",
    "Day 20: Prophetic delay as biblical theme — 2 Peter 3:9-12, the 'already/not yet' tension in all eschatological prophecy",
    "Day 21: Debate simulation — defending Ellen White's prophetic record against the Deuteronomy 18:22 challenge",
    // WEEK 4 — APPRENTICE: Health Visions and Science
    "Day 22: The June 6, 1863 Otsego health vision — what was revealed and its historical context",
    "Day 23: Sylvester Graham, James Caleb Jackson, Russell Trall — what Ellen White took, what she rejected, and what she uniquely contributed",
    "Day 24: The genetic fallacy — why similar ideas existing in culture does not disprove divine guidance. Joseph used Egyptian agriculture (Genesis 41)",
    "Day 25: The Adventist Health Studies (AHS-1 and AHS-2) — NIH-funded, 96,000+ participants, Loma Linda Blue Zone. The empirical verdict",
    "Day 26: The difficult health statements — amalgamation, wigs causing brain disease, masturbation warnings. Honest engagement without dismissal",
    "Day 27: Body-temple theology — how Ellen White uniquely embedded health reform within 1 Corinthians 6:19-20 framework. No secular reformer did this",
    "Day 28: Debate simulation — defending the health message against 'she just copied 19th-century health fads'",
    // WEEK 5 — STRATEGIST: Literary Dependency and the Great Controversy
    "Day 29: The Great Controversy and its sources — J.A. Wylie's 'History of Protestantism,' Merle d'Aubigne, Uriah Smith. Mapping the actual dependency",
    "Day 30: The Desire of Ages and its sources — William Hanna, John Harris, Daniel March, Alfred Edersheim. The Veltman findings in detail",
    "Day 31: Patriarchs and Prophets, Acts of the Apostles, Sketches from the Life of Paul — the broader literary dependency landscape",
    "Day 32: The 1911 revision of The Great Controversy — what was changed and why. Proof of dishonesty or responsible editorial stewardship?",
    "Day 33: The Synoptic Problem as parallel — Matthew, Mark, Luke share massive literary dependency. Does this disqualify them as inspired?",
    "Day 34: The unique prophetic contribution — Great Controversy theme, sanctuary Christology, health-education-mission integration. What no source provided",
    "Day 35: Debate simulation — confronting the 'it's all borrowed' argument with the cathedral vs. scaffolding framework",
    // WEEK 6 — STRATEGIST: The White Estate and Institutional Trust
    "Day 36: The White Estate — its history, purpose, and the accusation of controlling access to unpublished materials",
    "Day 37: The Investigative Judgment — was it invented to salvage the Great Disappointment? Daniel 7:9-10, 8:14 examined independently",
    "Day 38: Ellen White and Sola Scriptura — does her prophetic authority contradict the Protestant principle? The 'lesser light' framework",
    "Day 39: The 'amalgamation' statements — what she actually wrote, historical context, and why this remains the most difficult passage",
    "Day 40: Ellen White's contradictions — cataloguing the allegedly contradictory statements and providing honest, contextual responses",
    "Day 41: The testimony of former critics who returned — case studies of people who investigated, left, and came back. What changed their minds?",
    "Day 42: Debate simulation — multi-layered defense combining plagiarism, failed prophecy, and institutional trust challenges simultaneously",
    // WEEK 7 — TACTICIAN: Turning the Critic's Framework Against Itself
    "Day 43: The critic's hidden presuppositions — what standards of 'prophet testing' are they actually applying? Are those standards biblical or modern?",
    "Day 44: Applying the critic's standard to biblical prophets — if Ellen White fails, do Nathan, Jonah, Peter, and Paul also fail?",
    "Day 45: The Canright case study — D.M. Canright, the first major Ellen White critic. His arguments, his psychology, and the trajectory of his life",
    "Day 46: The psychology of deconstruction — why former SDAs attack Ellen White with particular intensity. Understanding the emotional dynamics",
    "Day 47: Offensive apologetics — proactively presenting the positive case for Ellen White's prophetic gift before critics frame the narrative",
    "Day 48: The 'tests of a prophet' applied comprehensively — walking through every biblical test with both Ellen White's successes AND honest acknowledgment of difficulties",
    "Day 49: Debate simulation — going on offense. Making the positive case so compelling that the critic must respond to YOUR evidence",
    // WEEK 8 — TACTICIAN: Comprehensive Mastery
    "Day 50: The Great Controversy vision of 1858 — the Lovett's Grove experience. Original testimony and its significance for the cosmic conflict framework",
    "Day 51: Ellen White's Christology — how her writings consistently point to Christ above all else. The concentration room principle across 100,000+ pages",
    "Day 52: The sanctuary and Ellen White — how her prophetic ministry is inseparable from the sanctuary message. Remove one and the other collapses",
    "Day 53: Modern scholarship and Ellen White — academic treatments beyond the critics: George Knight, Denis Fortin, Jerry Moon. The balanced scholarly view",
    "Day 54: The role of the Spirit of Prophecy in the Remnant — Revelation 12:17, 19:10. Theological necessity, not optional accessory",
    "Day 55: Full-spectrum defense — integrating all 8 weeks into a comprehensive, confident, honest apologetic for Ellen White's prophetic ministry",
    "Day 56: Final examination — the ultimate multi-vector debate combining every major criticism in a single engagement. War College graduation",
  ],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { avatarId, avatarName, trackTitle, dayNumber, rank, weekNumber, readingLevel } = await req.json();
    const isHighSchool = readingLevel === "high-school";
    const cacheAvatarId = isHighSchool ? `${avatarId}__simplified` : avatarId;
    console.log(`Request: avatar=${avatarId}, day=${dayNumber}, readingLevel=${readingLevel || "scholar"}, cacheKey=${cacheAvatarId}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Check cache first
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: cached } = await supabase
      .from("war_college_manuscripts")
      .select("manuscript_data")
      .eq("avatar_id", cacheAvatarId)
      .eq("day_number", dayNumber)
      .maybeSingle();

    if (cached?.manuscript_data) {
      console.log(`Cache hit: ${cacheAvatarId} day ${dayNumber}`);
      return new Response(JSON.stringify(cached.manuscript_data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cache miss — generate
    const rankDesc = RANK_DESCRIPTIONS[rank] || RANK_DESCRIPTIONS.initiate;

    const systemPrompt = `You are the Phototheology War College Manuscript Generator. You produce ultra-immersive, long-form strategic manuscripts for apologetics training.

CRITICAL RULES:
1. Write as a CONTINUOUS MANUSCRIPT — not an outline, not a worksheet, not modular segments.
2. Tone: Strategic, intellectual, formational. Like a War College reading assignment — NOT a devotional, NOT a classroom lecture, NOT a casual lesson.
3. Integrate theology, philosophy, and strategy ORGANICALLY — no choppy sections.
4. Weave the avatar's presence naturally (refer to the opponent by name as a strategic adversary whose arguments you are dissecting).
5. Use Scripture as INTELLECTUAL ANCHORS (full KJV quotes with book/chapter/verse in markdown blockquotes), not decorative.
6. Train the mind, don't just inform it.
7. Minimum 2,000 words for the manuscript body. Target 2,500–3,000 for depth.
8. NO headings or subheadings in the manuscript body — continuous prose only.
9. Use markdown blockquotes (>) for Scripture citations.
10. Phototheology integration: weave Great Controversy, Sanctuary typology, Covenant Cycles, Types/Parallels, and Christ-centered hermeneutics naturally without naming Palace rooms or codes.
11. SDA historicist and sanctuary theology guardrails apply at all times.
12. The manuscript should feel like a true 25–30 minute deep study session.
13. Each day MUST cover a distinct topic that progressively builds on the previous days within the track.
14. Day 1 always starts with the foundational epistemological or theological conflict central to the opponent's worldview.
15. Each subsequent day should advance deeper — never repeat the same ground.

OPPONENT WORLDVIEW CONTEXT:
- Avatar: ${avatarName} (${avatarId})
- Track: ${trackTitle}
- This opponent represents a specific worldview. Study their actual doctrines, arguments, and philosophical positions with scholarly accuracy before refuting them.

RANK DEPTH: ${rank} — ${rankDesc}
- Initiate (Weeks 1-2): Build foundations — define the conflict, establish epistemological ground, introduce the opponent's core framework.
- Apprentice (Weeks 3-4): Confront core challenges — engage their strongest arguments head-on with deeper analysis.
- Strategist (Weeks 5-6): Multi-layered defense — weave sanctuary, prophecy, Great Controversy themes into sophisticated rebuttals.
- Tactician (Weeks 7-8): Proactive offense — turn the opponent's own framework against itself, expose internal contradictions.
- Commander (Weeks 9-10): Comprehensive dominance — synthesize all dimensions into masterful theological warfare.

You MUST return valid JSON with this exact structure:
{
  "study": {
    "dayNumber": ${dayNumber},
    "title": "...",
    "subtitle": "...",
    "avatarId": "${avatarId}",
    "avatarName": "${avatarName}",
    "track": "${trackTitle}",
    "rank": "${rank}",
    "estimatedMinutes": 28,
    "manuscript": "... (the full continuous manuscript, 2000+ words, with markdown formatting for Scripture blockquotes) ...",
    "defenseApplication": {
      "commonObjection": "A real objection this opponent would raise, stated in their voice",
      "eliteResponse": "A devastating, philosophically precise SDA response"
    },
    "forgeExercise": "A specific writing exercise that forces the student to craft their own argument on today's topic (6-8 sentences, War College rating 9-10/10)",
    "masteryChecks": ["question1", "question2", "question3", "question4"],
    "tomorrowTeaser": "A compelling preview of tomorrow's escalation — what conflict comes next"
  }
}`;

    // High school reading level adjustments
    const highSchoolModifier = isHighSchool
      ? `\n\nCRITICAL OVERRIDE — SIMPLIFIED READING LEVEL:
This manuscript MUST be written at a 9th–10th grade reading level. This is NON-NEGOTIABLE. Every sentence must follow these rules:
- Use SHORT, CLEAR sentences (max 20-25 words each). Break long sentences into two or three.
- Replace ALL academic/philosophical vocabulary with everyday equivalents:
  • "epistemology" → "how we know what we know"
  • "presupposition" → "starting assumption"
  • "materialism/physicalism" → "the belief that only physical stuff is real"
  • "metaphysical" → "beyond what we can touch or measure"
  • "ontological" → "about what really exists"
  • "axiom" → "basic starting belief"
  • "empirical" → "based on observation and experiments"
  • "reductionist" → "shrinking everything down to just one explanation"
  • Define ANY technical term in parentheses on first use
- Use relatable analogies from everyday life, school, sports, technology, social media
- Keep the SAME depth of argument, the SAME number of points, the SAME Scripture citations
- Keep the SAME length (2,000–3,000 words) — do NOT shorten the manuscript. Simpler words take more space, not less.
- The tone should feel like a smart older brother or mentor explaining things, NOT a textbook
- Set "estimatedMinutes": 25 in the JSON output
DO NOT write a scholar-level manuscript. If a 15-year-old would need a dictionary, rewrite the sentence.`
      : "";

    // Inject avatar-specific curriculum if available
    const avatarCurriculum = AVATAR_CURRICULUM[avatarId];
    let curriculumContext = "";
    if (avatarCurriculum && avatarCurriculum[dayNumber - 1]) {
      const dayTopic = avatarCurriculum[dayNumber - 1];
      // Also include surrounding days for context
      const prevDay = dayNumber > 1 ? avatarCurriculum[dayNumber - 2] : null;
      const nextDay = dayNumber < avatarCurriculum.length ? avatarCurriculum[dayNumber] : null;
      curriculumContext = `\n\nSPECIFIC CURRICULUM FOR THIS DAY:\n${dayTopic}\n${prevDay ? `\nPrevious day covered: ${prevDay}` : ""}${nextDay ? `\nNext day will cover: ${nextDay}` : ""}\n\nYou MUST follow this specific topic for today's manuscript. Do not deviate to a different subject.`;
    }

    const userPrompt = `Generate War College Day ${dayNumber} study for the ${trackTitle} track.

Opponent: ${avatarName} (${avatarId})
Week: ${weekNumber}
Rank: ${rank}
Day in week: ${((dayNumber - 1) % 7) + 1}
${curriculumContext}

This is day ${dayNumber} of a 56-day formation system. Build on progressive depth — each day should advance the intellectual warfare deeper than the last.${!curriculumContext ? ` The topic should organically flow from what a student at day ${dayNumber} would need next in their training against ${avatarName}'s worldview.` : ""}

Produce the complete War College manuscript now.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt + highSchoolModifier },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 16384,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits required. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content returned from AI");

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      try {
        parsed = JSON.parse(content);
      } catch {
        console.error("Failed to parse AI response:", content.substring(0, 500));
        throw new Error("Failed to parse manuscript from AI response");
      }
    }

    // Cache the result (fire-and-forget)
    supabase
      .from("war_college_manuscripts")
      .upsert({
        avatar_id: cacheAvatarId,
        day_number: dayNumber,
        rank,
        manuscript_data: parsed,
      }, { onConflict: "avatar_id,day_number" })
      .then(({ error }) => {
        if (error) console.error("Cache write error:", error);
        else console.log(`Cached: ${cacheAvatarId} day ${dayNumber}`);
      });

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-war-college-day error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
