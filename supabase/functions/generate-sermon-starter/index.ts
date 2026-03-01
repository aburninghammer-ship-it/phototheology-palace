import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Category-specific rules for the Sermon Forge engine
const CATEGORY_RULES: Record<string, {
  name: string;
  rules: string[];
  mandatoryRooms: string[];
  palaceAnchors: string[];
}> = {
  "end-time": {
    name: "End-Time Discernment",
    rules: [
      "Must include Three Heavens (1H/2H/3H) OR Prophecy Room",
      "Include present deception warning",
      "Christ as refuge (never fear-bait)",
      "No date-setting or speculation"
    ],
    mandatoryRooms: ["Three Heavens (1H/2H/3H)", "Prophecy Room (PR)", "Symbols/Types Room (ST)"],
    palaceAnchors: ["Floor 6 – Three Heavens", "Floor 5 – Prophecy Room", "Sanctuary – Most Holy Place"]
  },
  "current-events": {
    name: "Current Events (Non-Reactionary)",
    rules: [
      "NO headline chasing or naming specific events",
      "Event interpreted through prophetic PATTERN",
      "Focus on moral shift, war, religious pressure, economic tightening, or technological imitation",
      "Must keep sermon timeless"
    ],
    mandatoryRooms: ["Patterns Room (PRm)", "Cycles (@Ad-@Re)", "Concentration Room (CR)"],
    palaceAnchors: ["Floor 4 – Patterns Room", "Floor 6 – Cycles"]
  },
  "righteousness-by-faith": {
    name: "Righteousness by Faith",
    rules: [
      "Must expose false righteousness systems",
      "Expose self-generated obedience traps",
      "Christ as both substitute AND source",
      "Balance imputed and imparted righteousness"
    ],
    mandatoryRooms: ["Blue Room / Sanctuary (BL)", "Concentration Room (CR)", "Dimensions Room (DR)"],
    palaceAnchors: ["Sanctuary – Altar & Laver", "Blue Room typology"]
  },
  "prophecy": {
    name: "Prophecy (Daniel & Revelation)",
    rules: [
      "Must include timeline anchoring",
      "Apply Repeat & Enlarge logic",
      "Christological fulfillment required",
      "No speculation beyond Scripture"
    ],
    mandatoryRooms: ["Prophecy Room (PR)", "Mathematics Room (MATH)", "Symbols/Types Room (ST)", "Concentration Room (CR)"],
    palaceAnchors: ["Floor 5 – Prophecy Room", "Floor 5 – Mathematics Room", "Floor 2 – Symbols/Types"]
  },
  "sanctuary": {
    name: "Sanctuary Theology",
    rules: [
      "Must move: Outer Court → Holy Place → Most Holy Place",
      "Connect articles of furniture to Christ's ministry",
      "Day of Atonement as present reality"
    ],
    mandatoryRooms: ["Blue Room / Sanctuary (BL)", "Feasts Room (FE)", "Concentration Room (CR)"],
    palaceAnchors: ["Sanctuary – All Articles", "Floor 5 – Blue Room", "Sanctuary – Most Holy Place"]
  },
  "everlasting-gospel": {
    name: "Everlasting Gospel",
    rules: [
      "Must include: Cross, Judgment, Creation, Worship",
      "Rev 14 gospel, not Romans-only gospel",
      "Three Angels' Message framework"
    ],
    mandatoryRooms: ["Three Angels Room (3A)", "Blue Room / Sanctuary (BL)", "Concentration Room (CR)"],
    palaceAnchors: ["Floor 5 – Three Angels Room", "Sanctuary – Most Holy Place"]
  },
  "series-builder": {
    name: "Series Builder",
    rules: [
      "Must generate 3-7 sermon paths",
      "Each sermon uses different Palace room",
      "Advances same thesis throughout",
      "Climaxes Christologically"
    ],
    mandatoryRooms: ["Cycles (@Ad-@Re)", "Patterns Room (PRm)", "Dimensions Room (DR)"],
    palaceAnchors: ["Floor 4 – Patterns Room", "Floor 6 – Cycles", "Floor 4 – Dimensions Room"]
  }
};

// Current event types that can be filtered through prophetic patterns
const CURRENT_EVENT_TYPES = [
  { id: "moral-shift", label: "Moral Shift", pattern: "Judges cycle of moral decline" },
  { id: "war", label: "War/Conflict", pattern: "Daniel's metal kingdoms in conflict" },
  { id: "religious-pressure", label: "Religious Pressure", pattern: "Revelation's church-state union" },
  { id: "economic", label: "Economic Tightening", pattern: "Revelation 13's buying and selling" },
  { id: "technology", label: "Technological Imitation", pattern: "Image of the Beast dynamics" }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      topic,
      topicId,
      level,
      anchorScriptures,
      category,
      currentEventType,
      generateSeries,
      seriesLength,
      ptRooms,
      roomLabels
    } = await req.json();

    if (!topic || !level) {
      return new Response(
        JSON.stringify({ error: "Topic and level are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get category-specific rules (legacy support)
    const categoryConfig = category ? CATEGORY_RULES[category] : null;
    const eventConfig = currentEventType ? CURRENT_EVENT_TYPES.find(e => e.id === currentEventType) : null;
    
    // PT Rooms mode (new feature for verse-based sermon ideas)
    const hasPtRooms = ptRooms && Array.isArray(ptRooms) && ptRooms.length > 0;

    const systemPrompt = `You are Jeeves, the PhotoTheology Sermon Forge architect.

⚠️ CRITICAL MODE: DISCOVERY-BASED SPARKS ⚠️

You are NOT writing a sermon outline, commentary, or study guide.
You are creating a THINKING CATALYST — a match, not a bonfire; a trailhead, not the summit.

SPARK MODE RULES (NON-NEGOTIABLE):
1. KNOW the PT room internally — but NEVER name it explicitly in starterParagraph or bigIdea
2. Speak AROUND the insight, not AT it — let the user feel smart for discovering
3. Use QUESTIONS and TENSIONS, not conclusions
4. Create MOVEMENT, not resolution
5. NO insider language in the main idea: no "Sanctuary message," "Three Angels," "PhotoTheology," "Palace," "Floor X," "Room Y"
6. The user should finish reading and think "Oh... I see where this could go" — NOT "That's already mapped out"

WHAT A STARTER MUST DO:
• Provoke curiosity
• Hint at connections without naming them
• Invite exploration
• Leave room for the preacher to BUILD
• Use phrasing like: "What if...", "Why would...", "Notice that...", "Jesus says X before Y — why?"

WHAT A STARTER MUST NEVER DO:
• State conclusions
• Name advanced frameworks outright
• Front-load interpretive outcomes
• Close discovery loops

EXAMPLE OF WRONG (too declarative):
"The new birth grants access to God's heavenly kingdom, reflected in the Sanctuary message and amplified by the Three Angels' present truth."
→ This is a FINISHED thought. The framework is named. The synthesis is declared.

EXAMPLE OF RIGHT (discovery-based):
"Jesus tells Nicodemus that without a birth from above, the kingdom cannot even be seen. Why would spiritual vision depend on origin rather than effort? What kind of life must be entered before truth can be understood?"
→ No framework named. No conclusion stated. Curiosity created. Direction implied.

The starterParagraph should read like a provocative question or unresolved tension that INVITES exploration.
The bigIdea should be a thesis that OPENS inquiry, not CLOSES it.

⚠️ CRITICAL THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE):
1. AZAZEL = SATAN, NOT CHRIST: In Leviticus 16, Azazel (scapegoat) represents SATAN. NEVER identify it as Jesus.
2. LITTLE HORN = ROME/PAPACY, NOT ANTIOCHUS: Daniel 7 & 8 little horn = Rome/Papal power. NEVER say Antiochus Epiphanes.
3. TWO-PHASE SANCTUARY: Christ entered HOLY PLACE at ascension (31 AD); MOST HOLY PLACE in 1844. NEVER say Most Holy at ascension.
4. DAY OF ATONEMENT = 1844: Christ's death = PASSOVER. Day of Atonement = 1844 judgment. NEVER equate death with Atonement.
5. FEAST TYPOLOGY: Spring feasts = First Advent (Passover=death, Firstfruits=resurrection). Fall feasts = Second Advent ministry.
6. HEBREWS CLARITY: Hebrews contrasts earthly vs heavenly sanctuary, NOT Holy vs Most Holy Place.

THE 8 FLOORS OF THE PHOTOTHEOLOGY PALACE (for internal use only):
- Floor 1 (Furnishing): Story Room, Imagination Room, 24FPS Room, Bible Rendered, Translation Room, Gems Room
- Floor 2 (Investigation): Observation Room, Def-Com Room, Symbols/Types Room, Questions Room, Q&A Chains Room
- Floor 3 (Freestyle): Nature Freestyle, Personal Freestyle, Bible Freestyle, History Freestyle, Listening Room
- Floor 4 (Next Level): Concentration Room, Dimensions Room, Connect-6, Theme Room, Time Zone, Patterns Room, Parallels Room, Fruit Room
- Floor 5 (Vision): Blue Room (Sanctuary), Prophecy Room, Three Angels Room, Feasts Room, Room 66
- Floor 6 (Three Heavens & Cycles): Three Heavens Room, Eight Cycles Room, Mathematics Room, Juice Room
- Floor 7 (Spiritual): Fire Room, Meditation Room, Speed Room
- Floor 8 (Master): The palace becomes invisible—internalized and instinctive

${hasPtRooms ? `
SELECTED PT ROOMS (INTERNAL LENS ONLY - DO NOT NAME IN OUTPUT):
${ptRooms.join(', ')} ${roomLabels ? `(${roomLabels.join(', ')})` : ''}

Use these rooms as your INTERNAL interpretive lens. Apply their methods and questions to shape the starter.
But the starterParagraph and bigIdea must NOT name these rooms — they must EMBODY their principles invisibly.
The palaceAnchors array CAN name rooms (that's technical metadata) but the prose must remain discovery-based.
` : ''}

${categoryConfig ? `
CATEGORY: ${categoryConfig.name}
CATEGORY RULES (MUST FOLLOW):
${categoryConfig.rules.map((r: string) => `• ${r}`).join('\n')}

MANDATORY ROOMS TO USE (internally):
${categoryConfig.mandatoryRooms.join(', ')}
` : ''}

${eventConfig ? `
CURRENT EVENT FILTER:
This sermon addresses: ${eventConfig.label}
Interpret through prophetic pattern: "${eventConfig.pattern}"
NEVER name specific headlines, countries, or people. Keep it TIMELESS.
` : ''}

INTERNAL TEMPLATE (include in JSON but NOT in prose):
• Palace Floor(s)
• Rooms Activated
• Governing Principle
• Christological Axis
• Time Orientation (where applicable)
• False Center Exposed (what lie does this expose?)
• Gospel Resolution

LEVEL GUIDANCE:
- Beginner: More guiding questions in the floors section, but starterParagraph stays discovery-based
- Intermediate: Balanced hints with room for exploration
- Master: Dense questions that expect deep engagement

ALL Scripture quotes MUST be KJV (King James Version).

Respond ONLY with valid JSON in this exact format:
{
  "starterTitle": "string (compelling, evocative, non-technical title — no PT language)",
  "starterParagraph": "string (2-3 paragraphs of QUESTIONS and TENSIONS that invite discovery — NO frameworks named, NO conclusions stated, NO insider language)",
  "bigIdea": "string (one-sentence thesis framed as a tension or question to explore, NOT a finished declaration)",
  "palaceAnchors": ["Floor X – Room Name", "Sanctuary – Article"],
  "keyTexts": {
    "oldTestament": ["reference1", "reference2"],
    "gospels": ["reference1"],
    "epistles": ["reference1"],
    "revelation": ["reference1"]
  },
  "illustrationHooks": ["hook1", "hook2"],
  "floors": {
    "floor1": {
      "roomUsed": "Observation Room (OR)",
      "keyWords": ["word1", "word2", "word3", "word4", "word5"],
      "observationQuestions": ["question1", "question2", "question3", "question4"],
      "historicalNotes": "string or null"
    },
    "floor2": {
      "roomUsed": "Symbols/Types Room (ST)",
      "symbols": [
        {"symbol": "name", "definition": "one-line biblical definition", "crossRefs": ["ref1", "ref2"]}
      ]
    },
    "floor3": {
      "roomUsed": "Blue Room / Sanctuary (BL)",
      "article": "sanctuary article name or null",
      "connection": "how it connects patternally",
      "explanation": "brief explanation or null if no connection"
    },
    "floor4": {
      "roomUsed": "Story Room (SR)",
      "stories": [
        {"reference": "story reference", "parallels": "what parallels", "contrasts": "what contrasts", "caution": "what not to over-connect"}
      ]
    },
    "floor5": {
      "roomsUsed": ["Prophecy Room (PR)", "Cycles (@Ad-@Re)"],
      "propheticConnections": [
        {"type": "Confirmed Fulfillment | Typological Echo | Thematic Pattern", "description": "description"}
      ]
    },
    "floor6": {
      "roomUsed": "Concentration Room (CR)",
      "guidedQuestions": ["question1", "question2"],
      "christPresence": "fulfillment | anticipation | contrast | future resolution",
      "ntReferences": ["NT reference"]
    },
    "floor7": {
      "roomUsed": "Fire Room (FRm)",
      "applicationAngles": [
        {"area": "Personal", "question": "question framed as question not command"},
        {"area": "Community", "question": "question"},
        {"area": "Mission", "question": "question"}
      ]
    },
    "floor8": {
      "roomUsed": "Meditation Room (MR)",
      "responseMovements": ["repentance", "trust", "hope", "surrender", "mission"],
      "songThemes": ["theme1", "theme2"],
      "prayerFocus": "prayer focus description",
      "callToAction": "specific call to action"
    }
  },
  "internalTemplate": {
    "palaceFloor": "Floor number and name",
    "roomsActivated": ["room1", "room2"],
    "governingPrinciple": "The principle that governs this sermon",
    "christologicalAxis": "How Christ is central",
    "timeOrientation": "Where this fits in salvation history",
    "falseCenterExposed": "What lie or false center this sermon exposes",
    "gospelResolution": "How the gospel resolves the tension"
  },
  "seriesExpansion": ${generateSeries ? `[
    {"sermonNumber": 1, "title": "title", "focus": "brief focus", "primaryRoom": "room name"},
    {"sermonNumber": 2, "title": "title", "focus": "brief focus", "primaryRoom": "room name"},
    {"sermonNumber": 3, "title": "title", "focus": "brief focus", "primaryRoom": "room name"}
    ${seriesLength && seriesLength > 3 ? `, {"sermonNumber": 4, "title": "title", "focus": "brief focus", "primaryRoom": "room name"}` : ''}
    ${seriesLength && seriesLength > 4 ? `, {"sermonNumber": 5, "title": "title", "focus": "brief focus", "primaryRoom": "room name"}` : ''}
    ${seriesLength && seriesLength >= 7 ? `, {"sermonNumber": 6, "title": "title", "focus": "brief focus", "primaryRoom": "room name"}, {"sermonNumber": 7, "title": "title", "focus": "brief focus", "primaryRoom": "room name"}` : ''}
  ]` : 'null'},
  "roomRefs": ["OR", "ST", "SR", "StR", "TR", "CR", "AR", "WR"]
}`;

    const userPrompt = `Create a ${level} level PhotoTheology Sermon SPARK (not outline) for the topic: "${topic}"

${hasPtRooms ? `
INTERNAL LENS (apply these but DO NOT name them in the starterParagraph or bigIdea):
${roomLabels ? roomLabels.map((label: string, i: number) => `- ${ptRooms[i]}: ${label}`).join('\n') : ptRooms.join(', ')}

Let these rooms shape your QUESTIONS and TENSIONS, but keep the prose discovery-based.
` : ''}

${categoryConfig ? `Category: ${categoryConfig.name}` : ''}
${eventConfig ? `Current Event Type: ${eventConfig.label} (interpret through pattern: "${eventConfig.pattern}")` : ''}

${anchorScriptures && anchorScriptures.length > 0
  ? `Anchor Scriptures to consider: ${anchorScriptures.join(", ")}`
  : "Use appropriate scriptures that relate to this topic."}

${generateSeries ? `Generate a ${seriesLength || 3}-part sermon series expansion with each sermon using a different Palace room but advancing the same thesis, climaxing Christologically.` : ''}

CRITICAL REMINDERS:
- The starterParagraph must be QUESTIONS and TENSIONS, not conclusions
- Use language like "Why would...", "What if...", "Notice that..."
- NO insider terminology in the main idea (no "Sanctuary message", "Three Angels", "PhotoTheology", etc.)
- Create curiosity that makes the user think "I see where this could go"
- The bigIdea should OPEN inquiry, not CLOSE it
- You know the PT framework internally — let it SHAPE the questions invisibly`;

    console.log(`[generate-sermon-starter] Generating ${level} starter for topic: ${topic}, category: ${category || 'none'}`);

    const makeAIRequest = async (useCompactPrompt = false) => {
      const compactUserPrompt = useCompactPrompt 
        ? `Create a CONCISE ${level} level PhotoTheology Sermon Starter for: "${topic}". Keep ALL floor descriptions under 50 words each. Be brief but insightful.`
        : userPrompt;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt + (useCompactPrompt ? "\n\nCRITICAL: Keep ALL responses CONCISE. Each floor description must be under 50 words. Do not write long paragraphs." : "") },
            { role: "user", content: compactUserPrompt },
          ],
          temperature: 0.7,
          max_completion_tokens: 8000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[generate-sermon-starter] AI API error: ${errorText}`);
        throw new Error(`AI API error: ${response.status}`);
      }

      return response.json();
    };

    let starterData;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      const useCompact = attempts > 1;
      
      console.log(`[generate-sermon-starter] Attempt ${attempts}/${maxAttempts}, compact mode: ${useCompact}`);
      
      const aiResponse = await makeAIRequest(useCompact);
      const content = aiResponse.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content in AI response");
      }

      // Clean the content - remove markdown code blocks if present
      let cleanedContent = content.trim();
      if (cleanedContent.startsWith("```json")) {
        cleanedContent = cleanedContent.slice(7);
      } else if (cleanedContent.startsWith("```")) {
        cleanedContent = cleanedContent.slice(3);
      }
      if (cleanedContent.endsWith("```")) {
        cleanedContent = cleanedContent.slice(0, -3);
      }
      cleanedContent = cleanedContent.trim();

      try {
        starterData = JSON.parse(cleanedContent);
        console.log(`[generate-sermon-starter] Successfully parsed on attempt ${attempts}`);
        break;
      } catch (parseError) {
        console.error(`[generate-sermon-starter] Parse attempt ${attempts} failed. Content length: ${content.length}`);
        console.error(`[generate-sermon-starter] Content preview: ${content.substring(0, 500)}...`);
        
        if (attempts >= maxAttempts) {
          // Try to salvage partial JSON by finding the last complete object
          const lastBraceIndex = cleanedContent.lastIndexOf('}');
          if (lastBraceIndex > 0) {
            try {
              // Count braces to find a valid cutoff
              let braceCount = 0;
              let validEndIndex = -1;
              for (let i = 0; i < cleanedContent.length; i++) {
                if (cleanedContent[i] === '{') braceCount++;
                if (cleanedContent[i] === '}') {
                  braceCount--;
                  if (braceCount === 0) {
                    validEndIndex = i + 1;
                    break;
                  }
                }
              }
              if (validEndIndex > 0) {
                starterData = JSON.parse(cleanedContent.substring(0, validEndIndex));
                console.log("[generate-sermon-starter] Salvaged partial JSON successfully");
                break;
              }
            } catch {
              // Salvage failed
            }
          }
          console.error("[generate-sermon-starter] All parse attempts failed");
          throw new Error("Failed to parse AI response as JSON after multiple attempts");
        }
      }
    }

    console.log(`[generate-sermon-starter] Successfully generated starter: ${starterData.starterTitle}`);

    // Save to database if topicId provided
    if (topicId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { error: insertError } = await supabase
        .from("sermon_starters")
        .insert({
          topic_id: topicId,
          starter_title: starterData.starterTitle,
          level,
          floors: starterData,
          room_refs: starterData.roomRefs || [],
          quality_status: "published",
        });

      if (insertError) {
        console.error("[generate-sermon-starter] Database insert error:", insertError);
      } else {
        console.log("[generate-sermon-starter] Saved starter to database");
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        starter: starterData,
        categoryUsed: categoryConfig?.name || null,
        eventTypeUsed: eventConfig?.label || null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[generate-sermon-starter] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        success: false
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
