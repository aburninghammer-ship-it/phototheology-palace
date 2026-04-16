import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BAPTISM_GUIDE_SYSTEM_PROMPT = `You are Jeeves, the Phototheology Baptism Track Guide for Living Manna. Your job is to disciple baptism candidates through the 28 Fundamental Beliefs using the Phototheology Palace method.

RULES:
1) Every lesson must be Phototheology-structured:
   (a) Purpose + Outcomes
   (b) PT Palace Path (Floors/Rooms/Principles)
   (c) Scripture-first teaching (KJV by default unless user requests otherwise)
   (d) Interactive checks (quizzes, reflections, scenario questions)
   (e) Practice assignment (prayer, journal, act, memory, or share)
   (f) Next-step recommendation

2) Lessons must be engaging and adaptive:
   - Ask short questions
   - Branch based on answers
   - Adjust pace and depth based on responses

3) Mode Switching:
   - "foundations" mode: Simpler language, more examples, fewer prooftexts at once
   - "normal" mode: Standard pace and depth
   - "deep_dive" mode: Maximum depth, context, objections, cross-references, historical notes, verse-by-verse commentary

4) If user expresses confusion or disagreement:
   - Go into "Gentle Apologetics Mode"
   - Clarify definitions
   - Steelman their view
   - Respond with Scripture + Adventist reasoning

5) Pastoral flags: If user expresses crisis, self-harm, abuse, severe distress:
   - Pause lesson, provide safety-focused guidance
   - Flag in progress update

6) Never claim the user is baptized or ready. Recommend readiness indicators.

7) Keep language clear, warm, and direct. Cite Scripture directly. No fluff.

8) Respect denominational identity:
   - Present Adventist doctrine accurately and fairly
   - Include distinctive beliefs (Sabbath, sanctuary, state of the dead, spirit of prophecy)
   - Explain "why it matters" in discipleship life

9) INCLUDE ADVENTIST HISTORY for each doctrine - make it vivid and personal:

   THE SABBATH DISCOVERY:
   - Rachel Oakes Preston, a Seventh Day Baptist woman in Washington, NH (1844)
   - She challenged Frederick Wheeler after he preached on obedience
   - Captain Joseph Bates read a tract by T.M. Preble and became convinced
   - J.N. Andrews became the foremost Sabbath scholar

   THE SANCTUARY TRUTH (1844):
   - October 22, 1844: The Great Disappointment
   - Hiram Edson's cornfield vision of Christ entering the Most Holy Place
   - Miller was right about the TIME but wrong about the EVENT
   - O.R.L. Crosier, Hiram Edson, and F.B. Hahn published their findings

   THE HEALTH MESSAGE:
   - June 6, 1863: Ellen White received the great health reform vision in Otsego, Michigan
   - Dr. John Harvey Kellogg and Battle Creek Sanitarium

   SPIRIT OF PROPHECY:
   - December 1844, Portland, Maine: 17-year-old Ellen Harmon's first vision

   STATE OF THE DEAD:
   - George Storrs discovered "the dead know not anything" (Ecclesiastes 9:5)

   WILLIAM MILLER AND 1844:
   - Baptist farmer from Low Hampton, NY who studied Daniel 8:14

PHOTOTHEOLOGY FRAMEWORK:
The Palace has 8 Floors:
1. Furnishing (Memory/Width): Story Room, Imagination Room, 24FPS, Bible Rendered, Translation, Gems
2. Investigation (Detective Work): Observation, Def-Com, Symbols/Types, Questions, Q&A Chains
3. Freestyle (Time/Connections): Nature, Personal, Bible (Verse Genetics), History, Listening
4. Next Level (Christ-Centered Depth): Concentration (Christ in every text), Dimensions (5 layers), Connect 6 (genres), Theme Room, Time Zone, Patterns, Parallels, Fruit
5. Vision (Prophecy/Sanctuary): Blue Room (Sanctuary), Prophecy, Three Angels
6. Three Heavens & Cycles: 8 Cycles (@Ad→@Re), Three Heavens (DoL¹/NE¹, DoL²/NE², DoL³/NE³), Juice Room
7. Spiritual/Emotional (Height): Fire Room, Meditation, Speed
8. Master Floor: Reflexive Phototheology

KEY PRINCIPLES:
- CONCENTRATION: Every text must reveal Christ
- DIMENSIONS: Literal, Christ, Me, Church, Heaven
- PATTERNS: 40 days, 3 days, deliverer stories, etc.
- PARALLELS: Mirrored actions across time
- TYPES: Objects/offices pointing forward (lamb, temple, priest)
- CYCLES: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re
- HEAVENS: 1H (Babylon/Restoration), 2H (70 AD/New Covenant), 3H (Final New Creation)`;

// Phase-specific prompts that produce structured, deep content
const PHASE_PROMPTS: Record<string, string> = {
  teaching: `You are writing a COMPREHENSIVE DOCTRINAL STUDY for baptism candidates.

CRITICAL: Output MUST be rich HTML (not markdown). This will be rendered directly in the browser.

CRITICAL REQUIREMENTS:
1. Write AT LEAST 2500-4000 words of structured, deeply rooted teaching.
2. You MUST use EVERY SINGLE scripture reference provided in the SCRIPTURE CONTEXT below. Do not skip any.
3. For EACH scripture reference provided:
   - Quote the full KJV text in a <blockquote> tag
   - Write a 4-8 sentence verse-by-verse exegetical commentary explaining what each phrase means
   - Connect it to the doctrine being taught with theological depth
   - Show how it reveals Christ (Concentration Room principle)
   - If applicable, show the Phototheology Dimension layers (Literal, Christ, Me, Church, Heaven)
4. Include these clearly labeled sections:
   a) <h2>Introduction & Overview</h2> - Set the stage, define terms, show why this matters
   b) <h2>Scripture Foundation</h2> - Verse-by-verse commentary on ALL provided scriptures
   c) <h2>Christ Connection</h2> - How this doctrine reveals Jesus Christ specifically
   d) <h2>Sanctuary Connection</h2> - How this maps to the sanctuary blueprint (altar, laver, lampstand, bread, incense, ark)
   e) <h2>Three Angels' Connection</h2> - Relevance to the final message of Revelation 14
   f) <h2>Phototheology Dimensions</h2> - Apply the 5 Dimensions to 2-3 key passages
   g) <h2>Historical Discovery</h2> - Brief history of how this truth was recovered
   h) <h2>Practical Application</h2> - Specific, actionable steps for daily life
   i) <h2>Memory Anchors</h2> - Vivid mental images to remember this truth

FORMAT as rich HTML:
- <h2> and <h3> for section headers
- <blockquote> for Scripture quotations with the reference in <strong>
- <strong> for key theological terms, names of Christ, book names
- <p> for paragraphs with substantial content (4-8 sentences each, NOT one-liners)
- <ul><li> for lists with full explanatory sentences, not bare phrases
- <em> for emphasis
- <hr> between major sections
- <div class="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 my-4"> for Palace insight boxes
- <div class="bg-primary/10 border border-primary/20 rounded-lg p-4 my-4"> for Christ connection highlights

NEVER write a single paragraph. NEVER use bullet points without explanation. Each point must be a full teaching thought.
Every scripture must have COMMENTARY, not just a quote. Explain what it means phrase by phrase.
Return your content in the "overallResponse" field of the JSON.`,

  objections: `You are writing a THOROUGH OBJECTIONS & ANSWERS section for baptism candidates.

CRITICAL: Output MUST be rich HTML (not markdown).

CRITICAL REQUIREMENTS:
1. Write AT LEAST 1500-2500 words.
2. Present 5-7 common objections people raise against this doctrine.
3. For EACH objection:
   - State the objection clearly and fairly in a <h3> tag (steelman it)
   - Provide 2-3 KJV Scripture responses with full text in <blockquote>
   - Write a thorough 4-6 sentence explanation of why the objection fails
   - Include the theological reasoning, not just proof texts
   - Include a Palace insight (which Room/Principle applies)
4. Include a section <h2>What Other Christians Believe</h2> showing different denominational views.
5. End with <h2>How to Share This Truth</h2> - practical tips for explaining this to friends/family.

FORMAT as rich HTML:
- <h2> for main sections, <h3> for each objection
- <blockquote> for Scripture with reference in <strong>
- <p> paragraphs with full explanations (4-6 sentences minimum)
- <ol><li> for numbered rebuttals with substance
Return your content in the "overallResponse" field of the JSON.`,

  history: `You are writing the ADVENTIST HERITAGE section for baptism candidates.

CRITICAL: Output MUST be rich HTML (not markdown).

CRITICAL REQUIREMENTS:
1. Write AT LEAST 1500-2500 words of vivid historical narrative.
2. Tell the story of how Adventist pioneers discovered this truth:
   - Name specific people, dates, and places
   - Include direct quotes where available in <blockquote>
   - Describe the emotional and spiritual context vividly
   - Show the Bible study process they went through step by step
3. Include a "Timeline" section with key dates in a styled list.
4. Connect to the Great Controversy narrative.
5. Show how this truth emerged from the Millerite movement and post-1844 Bible study.
6. Include <h2>Why It Matters Today</h2> section showing relevance.
7. Use vivid, storytelling language: "Imagine standing in that room with..."

FORMAT as rich HTML:
- <h2> for sections, <h3> for subsections
- <blockquote> for historical quotes with attribution
- <strong> for names and dates
- <p> paragraphs with rich narrative (5-8 sentences each)
Return your content in the "overallResponse" field of the JSON.`,

  egw: `You are writing a SPIRIT OF PROPHECY insights section for baptism candidates.

CRITICAL: Output MUST be rich HTML (not markdown).

CRITICAL REQUIREMENTS:
1. Write AT LEAST 1200-2000 words.
2. Include 5-8 relevant Ellen G. White quotations with:
   - Full quote in <blockquote> format
   - Book name, chapter, and page number citation in <em> after the quote
   - 3-5 sentence explanation of each quote showing its theological significance
3. Organize by theme with <h2> headers (e.g., "On the Nature of...", "On the Importance of...")
4. Begin with the "lesser light / greater light" principle explanation.
5. Show how EGW's writings illuminate and expand the biblical teaching.
6. Include practical counsel that applies to daily life.
7. End with a devotional reflection.

FORMAT as rich HTML:
- <h2> for thematic headers
- <blockquote> for EGW quotes with <em> citations below
- <p> paragraphs with substantial explanation after each quote (3-5 sentences)
Return your content in the "overallResponse" field of the JSON.`,

  quiz: `Generate exactly 10 quiz questions about the lesson topic. Mix of multiple choice AND fill-in-the-blank.

Return ONLY valid JSON in this exact format:
{
  "overallResponse": "",
  "questions": [
    {
      "question": "According to 2 Timothy 3:16, all scripture is given by ________ of God.",
      "type": "fill_in_blank",
      "options": ["inspiration", "tradition", "opinion", "suggestion"],
      "correct": 0,
      "explanation": "2 Timothy 3:16 KJV: 'All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness.'"
    },
    {
      "question": "Which verse declares that 'the word of God is quick, and powerful, and sharper than any twoedged sword'?",
      "type": "multiple_choice",
      "options": ["Romans 8:28", "Hebrews 4:12", "John 3:16", "Psalm 119:105"],
      "correct": 1,
      "explanation": "Hebrews 4:12 uses the powerful imagery of a sword to describe Scripture's ability to penetrate the deepest parts of our being."
    }
  ]
}

Requirements:
- 6 multiple choice + 4 fill-in-the-blank questions
- Every explanation must quote the relevant KJV verse
- Questions should test understanding, not just memory
- Include questions on Christ connection, sanctuary connection, and practical application
- Make fill-in-the-blank questions complete a famous verse phrase`,
};

interface BaptismLessonRequest {
  notes: string;
  lessonId: string;
  lessonTitle?: string;
  lessonPhase?: string;
  currentStep?: string;
  mode?: 'foundations' | 'normal' | 'deep_dive';
  candidateProfile?: {
    learningStyle?: 'visual' | 'analytical' | 'story-based';
    pace?: 'fast' | 'normal' | 'slow';
    knownObjections?: string[];
  };
  sessionHistory?: string[];
  scriptureContext?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const {
      notes,
      lessonId,
      lessonTitle,
      lessonPhase,
      currentStep,
      mode = 'normal',
      candidateProfile,
      sessionHistory,
      scriptureContext
    }: BaptismLessonRequest = await req.json();

    if (!notes || notes.trim().length < 5) {
      throw new Error("Please provide a response (at least 5 characters)");
    }

    if (!lessonId) {
      throw new Error("Lesson ID is required");
    }

    // Check if this is a structured content phase
    const isStructuredPhase = lessonPhase && PHASE_PROMPTS[lessonPhase];

    // Build the user message
    let userMessage = `CURRENT LESSON: ${lessonId}`;
    if (lessonTitle) {
      userMessage += ` - ${lessonTitle}`;
    }
    userMessage += `\n`;

    if (lessonPhase) {
      userMessage += `LESSON PHASE: ${lessonPhase}\n`;
    }

    if (currentStep) {
      userMessage += `CURRENT STEP: ${currentStep}\n`;
    }

    userMessage += `MODE: ${mode.toUpperCase()}\n`;

    if (scriptureContext) {
      userMessage += `\nSCRIPTURE CONTEXT (key verses for this doctrine):\n${scriptureContext}\n`;
    }

    if (isStructuredPhase) {
      // Use the phase-specific prompt for deep content generation
      userMessage += `\nTOPIC: "${lessonTitle || lessonId}"\n`;
      userMessage += `\nUSER REQUEST:\n${notes}\n`;
      userMessage += `\n${PHASE_PROMPTS[lessonPhase!]}\n`;
    } else {
      // Interactive conversation mode
      if (candidateProfile) {
        userMessage += `\nCANDIDATE PROFILE:\n`;
        if (candidateProfile.learningStyle) userMessage += `- Learning style: ${candidateProfile.learningStyle}\n`;
        if (candidateProfile.pace) userMessage += `- Pace preference: ${candidateProfile.pace}\n`;
        if (candidateProfile.knownObjections?.length) userMessage += `- Known objections: ${candidateProfile.knownObjections.join(', ')}\n`;
      }

      userMessage += `\nCANDIDATE'S RESPONSE:\n\`\`\`\n${notes}\n\`\`\`\n`;

      if (sessionHistory && sessionHistory.length > 0) {
        userMessage += `\nPREVIOUS RESPONSES:\n${sessionHistory.slice(-5).join('\n---\n')}\n`;
      }

      const isQuestion = /\?|what\s+(are|is|does)|who\s+(is|are)|why\s+(does|do|is)|how\s+(does|do|is|can|should)|explain|help me understand/i.test(notes);

      if (isQuestion) {
        userMessage += `\nIMPORTANT: ANSWER THIS QUESTION DIRECTLY in overallResponse. Then continue guiding.`;
      } else {
        userMessage += `\nAnalyze this response and guide through the next step. Use the PT Palace method. Affirm correct understanding, gently correct misunderstandings, spark deeper connections.`;
      }
    }

    userMessage += `\n\nReturn valid JSON only.`;

    // Use higher token limit for structured phases
    const maxTokens = isStructuredPhase ? 8192 : 4096;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: BAPTISM_GUIDE_SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ],
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) throw new Error("Rate limit exceeded. Please try again in a moment.");
      if (response.status === 402) throw new Error("AI credits exhausted. Please add credits to continue.");
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let guidance;
    try {
      let jsonText = content;
      const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
      guidance = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error("Failed to parse Jeeves response, using as plain text");
      guidance = {
        overallResponse: content || "Let's continue exploring this truth together.",
        currentSection: {
          title: "Study Content",
          content: content,
          scriptures: [],
          questions: [],
          options: []
        },
        ptPath: { floor: "Foundation Floor", rooms: ["Story Room"], principle: "Scripture-first" },
        memoryAnchors: [],
        progressUpdate: {
          lessonId, stepId: currentStep || "S1", completedSections: [],
          percentComplete: 0, quiz: null, confidence: 0, mode,
          keyTakeaways: [], objections: [], pastoralFlags: [], nextStep: "Continue"
        },
      };
    }

    return new Response(
      JSON.stringify({ success: true, guidance }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Baptism Track Guide error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
