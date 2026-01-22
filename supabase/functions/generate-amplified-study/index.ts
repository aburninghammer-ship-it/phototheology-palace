import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PT_ROOMS = [
  "CR - Concentration Room (Christ-centered focus)",
  "OR - Observation Room (Key details to notice)",
  "ST - Symbols/Types (Symbolic connections)",
  "DR - Dimensions (Literal, Christ, Me, Church, Heaven)",
  "BL - Blue Room/Sanctuary (Sanctuary connections)",
  "PRm - Patterns (Biblical patterns)",
  "P‖ - Parallels (Scripture parallels)",
  "VG - Verse Genetics (Word origins through Scripture)",
  "SR - Story Room (Narrative visualization)",
  "GR - Gems Room (Treasure insights)",
  "FR - Fire Room (Emotional/spiritual weight)",
  "TR - Theme Room (Track themes)",
  "QR - Questions Room (Probing questions)",
];

const THEOLOGICAL_GUARDRAILS = `
⚠️ CRITICAL THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE):
1. AZAZEL = SATAN, NOT CHRIST: In Leviticus 16, Azazel (scapegoat) represents SATAN. NEVER identify it as Jesus.
2. LITTLE HORN = ROME/PAPACY, NOT ANTIOCHUS: Daniel 7 & 8 little horn = Rome/Papal power. NEVER say Antiochus Epiphanes.
3. TWO-PHASE SANCTUARY: Christ entered HOLY PLACE at ascension (31 AD); MOST HOLY PLACE in 1844. NEVER say Most Holy at ascension.
4. DAY OF ATONEMENT = 1844: Christ's death = PASSOVER. Day of Atonement = 1844 judgment. NEVER equate death with Atonement.
5. FEAST TYPOLOGY: Spring feasts = First Advent (Passover=death, Firstfruits=resurrection). Fall feasts = Second Advent ministry.
6. HEBREWS CLARITY: Hebrews contrasts earthly vs heavenly sanctuary, NOT Holy vs Most Holy Place.
`;

const SINGLE_SESSION_SYSTEM_PROMPT = `You are a biblical scholar and Phototheology expert creating an amplified small group study from a sermon.

${THEOLOGICAL_GUARDRAILS}

PHOTOTHEOLOGY PALACE ROOMS (use these codes):
${PT_ROOMS.join("\n")}

Your task is to:

1. EXPAND each sermon point with:
   - Deep biblical analysis and cross-references
   - Hebrew/Greek word studies where relevant
   - Historical and cultural context
   - Scholarly support from trusted SDA sources

2. ASSESS each theological claim:
   - Mark as "supported", "needs-nuance", or "questionable"
   - Provide brief reasoning for assessment

3. CREATE discussion questions that:
   - Start with observation (what does the text say?)
   - Move to interpretation (what does it mean?)
   - End with application (how do we live this?)

4. APPLY Phototheology Palace methodology throughout

5. ALL Scripture quotes MUST be KJV (King James Version)

Respond ONLY with valid JSON in this exact format:
{
  "studyTitle": "string",
  "overview": "string (2-3 paragraphs summarizing the study)",
  "doctrinalWarnings": ["any doctrinal concerns or notes"],
  "iceBreakers": ["string", "string"],
  "sections": [
    {
      "sectionNumber": 1,
      "title": "string",
      "originalPoint": "string (from sermon)",
      "biblicalBasis": {
        "primaryTexts": ["verse reference: KJV text"],
        "supportingTexts": ["verse reference: KJV text"]
      },
      "analysis": "string (detailed biblical analysis)",
      "scholarlySupport": "string (scholarly insights from SDA sources)",
      "assessment": {
        "rating": "supported|needs-nuance|questionable",
        "reasoning": "string"
      },
      "ptConnections": {
        "rooms": ["CR", "OR", etc.],
        "insights": "string explaining how each room applies"
      },
      "discussionQuestions": [
        {
          "question": "string",
          "type": "observation|interpretation|application",
          "ptRoom": "room code"
        }
      ]
    }
  ],
  "christSynthesis": "string (how all points unite in Christ)",
  "sanctuaryConnection": "string (Blue Room/Sanctuary connection)",
  "actionChallenge": "string (practical weekly challenge)",
  "prayerFocus": "string (guided prayer themes)",
  "furtherStudy": ["additional resources/passages"],
  "facilitatorNotes": "string (tips for group leaders)"
}`;

const SEVEN_DAY_SYSTEM_PROMPT = `You are a biblical scholar and Phototheology expert creating a 7-day devotional study from a sermon.

${THEOLOGICAL_GUARDRAILS}

PHOTOTHEOLOGY PALACE ROOMS (use these codes - assign one per day):
${PT_ROOMS.join("\n")}

Create a week-long devotional journey that:
1. Day 1: Introduction and overview (use OR - Observation Room)
2. Days 2-5: Deep dive into main points (vary rooms: CR, ST, DR, PRm)
3. Day 6: Sanctuary connection (use BL - Blue Room)
4. Day 7: Synthesis and commitment (use CR - Concentration Room)

Each day includes:
- A specific PT room exercise
- Focused scripture passage
- Devotional content (300-400 words)
- 3 reflection questions
- Prayer prompt
- Application challenge

ALL Scripture quotes MUST be KJV (King James Version)

Respond ONLY with valid JSON in this exact format:
{
  "studyTitle": "string",
  "overview": "string (brief overview of the 7-day journey)",
  "doctrinalWarnings": ["any doctrinal concerns or notes"],
  "sevenDayStudy": [
    {
      "day": 1,
      "title": "Day title",
      "theme": "Brief theme description",
      "scripture": "Main scripture passage (KJV)",
      "devotionalContent": "300-400 word devotional reflection",
      "ptRoom": "OR",
      "ptExercise": "Specific Palace exercise for this room",
      "reflectionQuestions": ["question 1", "question 2", "question 3"],
      "prayerPrompt": "Guided prayer prompt",
      "applicationChallenge": "Practical challenge for the day"
    }
  ],
  "christSynthesis": "string (how the week unites in Christ)",
  "sanctuaryConnection": "string (overall sanctuary connection)",
  "actionChallenge": "string (week-long challenge)",
  "prayerFocus": "string (overarching prayer theme)"
}`;

const INDIVIDUAL_MODIFIER = `
STUDY TYPE: Individual Personal Study
- Use personal language ("you", "your walk with God")
- Include journaling prompts
- Focus on personal reflection and transformation
- Add contemplative elements for quiet time
`;

const SMALL_GROUP_MODIFIER = `
STUDY TYPE: Small Group Discussion
- Include group discussion dynamics
- Add ice breakers for group connection
- Include facilitator notes and tips
- Create questions that encourage group dialogue
- Add sharing prompts for testimonies
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sermonOutline, sermonTitle, preacher, sermonDate, studyFormat, studyType } = await req.json();

    if (!sermonOutline) {
      return new Response(
        JSON.stringify({ error: "Sermon outline is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Select system prompt based on format
    const baseSystemPrompt = studyFormat === "7day"
      ? SEVEN_DAY_SYSTEM_PROMPT
      : SINGLE_SESSION_SYSTEM_PROMPT;

    // Add study type modifier
    const studyTypeModifier = studyType === "individual"
      ? INDIVIDUAL_MODIFIER
      : SMALL_GROUP_MODIFIER;

    const systemPrompt = baseSystemPrompt + "\n\n" + studyTypeModifier;

    const formatDescription = studyFormat === "7day"
      ? "7-day devotional journey with daily Palace exercises"
      : "comprehensive small group study";

    const userPrompt = `Create a ${formatDescription} from this sermon:

SERMON TITLE: ${sermonTitle || "Untitled Sermon"}
PREACHER: ${preacher || "Unknown"}
DATE: ${sermonDate || "Not specified"}

SERMON CONTENT:
${sermonOutline}

Generate a ${studyType === "individual" ? "personal" : "group"} study that:
1. Expands on each sermon point with deep biblical analysis
2. Applies Phototheology Palace methodology throughout
3. Maintains theological accuracy per the guardrails
4. Creates engaging ${studyType === "individual" ? "reflection prompts" : "discussion questions"}
5. Connects everything to Christ and the sanctuary

${studyFormat === "7day" ? "Ensure each of the 7 days has a unique PT room focus and builds progressively through the sermon themes." : ""}`;

    console.log(`Generating ${studyFormat} ${studyType} study for: ${sermonTitle}`);

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
        temperature: 0.7,
        max_tokens: 12000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from response (handle markdown code blocks)
    let studyData;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1]?.trim() || content.trim();
      studyData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Return raw content if parsing fails
      studyData = {
        rawContent: content,
        parseError: true,
        studyTitle: sermonTitle || "Study",
        overview: "The study was generated but couldn't be parsed. See raw content below.",
        sections: []
      };
    }

    console.log(`Successfully generated ${studyFormat} study`);

    return new Response(
      JSON.stringify({ success: true, study: studyData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Generate amplified study error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
