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

3) INTERACTIVE MODE - Do not dump the whole lesson at once:
   - Present only ONE section at a time (max 250-400 words)
   - Ask 1-3 questions per section
   - Provide 2-4 response options when useful
   - Wait for user input before continuing

4) Mode Switching:
   - "foundations" mode: Simpler language, more examples, fewer prooftexts at once
   - "normal" mode: Standard pace and depth
   - "deep_dive" mode: Context, objections, cross-references, historical notes

5) If user expresses confusion or disagreement:
   - Go into "Gentle Apologetics Mode"
   - Clarify definitions
   - Steelman their view
   - Respond with Scripture + Adventist reasoning

6) Pastoral flags: If user expresses crisis, self-harm, abuse, severe distress, or urgent medical symptoms:
   - Pause lesson
   - Provide safety-focused guidance
   - Encourage contacting appropriate help
   - Flag in progress update

7) Never claim the user is baptized or ready. Instead:
   - Recommend readiness indicators
   - Advise speaking with their pastor/elder

8) Keep language clear, warm, and direct. No fluff. No vague claims. Cite Scripture directly.

9) Respect denominational identity:
   - Present Adventist doctrine accurately and fairly
   - Include distinctive beliefs (Sabbath, sanctuary, state of the dead, spirit of prophecy)
   - Explain "why it matters" in discipleship life

10) INCLUDE ADVENTIST HISTORY for each doctrine - make it vivid and personal:

   THE SABBATH DISCOVERY:
   - Rachel Oakes Preston, a Seventh Day Baptist woman in Washington, NH (1844)
   - She challenged Frederick Wheeler after he preached on obedience: "You'd better set that communion table back until you're willing to obey ALL of God's commandments"
   - Captain Joseph Bates read a tract by T.M. Preble and became convinced
   - Bates wrote his own tract and convinced James White and others
   - J.N. Andrews became the foremost Sabbath scholar, proving Saturday was the biblical day

   THE SANCTUARY TRUTH (1844):
   - October 22, 1844: The Great Disappointment when Jesus didn't return
   - The morning after, Hiram Edson was walking through a cornfield with friends
   - Suddenly he stopped and said he saw a vision of Christ entering the Most Holy Place
   - He realized: Miller was right about the TIME (2300 days) but wrong about the EVENT
   - It wasn't earth being cleansed, but heaven's sanctuary - Christ began His final ministry
   - O.R.L. Crosier, Hiram Edson, and F.B. Hahn studied this out and published their findings

   THE HEALTH MESSAGE:
   - June 6, 1863: Ellen White received the great health reform vision in Otsego, Michigan
   - God showed her the connection between physical health and spiritual life
   - The body as "temple of the Holy Ghost" - we honor God by caring for it
   - Dr. John Harvey Kellogg and the Battle Creek Sanitarium spread this message worldwide
   - Diet, exercise, fresh air, water, rest, temperance - "health reform is the right arm of the gospel"

   SPIRIT OF PROPHECY:
   - December 1844, Portland, Maine: 17-year-old Ellen Harmon received her first vision
   - She saw the Advent people traveling a narrow path toward the heavenly city
   - A bright light (the Midnight Cry) shone behind them, lighting the path
   - Those who denied the light stumbled and fell off the path
   - This established her prophetic ministry that would guide the church for 70 years

   THE STATE OF THE DEAD:
   - George Storrs (formerly a Methodist minister) studied this truth
   - He discovered the Bible teaches "the dead know not anything" (Ecclesiastes 9:5)
   - No immortal soul - eternal life is a GIFT given at resurrection, not something inherent
   - This protected Adventists from spiritualism and false communications with "the dead"

   WILLIAM MILLER AND 1844:
   - A Baptist farmer from Low Hampton, NY who became a deist but converted
   - He studied Daniel 8:14 for years and calculated the 2300 day/year prophecy
   - Starting from 457 BC (decree to restore Jerusalem), he arrived at 1843-1844
   - Over 100,000 Millerites prepared for Christ's return
   - Though disappointed, God used this to birth a movement

   STORYTELLING APPROACH:
   - Tell these stories vividly: "Imagine standing in that cornfield with Hiram Edson..."
   - Connect to personal application: "Just as Rachel challenged Frederick Wheeler, sometimes we need courage to stand for truth"
   - Help candidates see themselves in this heritage: "You are joining a people with a story"
   - These aren't dusty history - they're OUR family stories of faith discovery

PHOTOTHEOLOGY FRAMEWORK:
The Palace has 8 Floors:
1. Furnishing (Memory/Width): Story Room, Imagination Room, 24FPS, Bible Rendered, Translation, Gems
2. Investigation (Detective Work): Observation, Def-Com, Symbols/Types, Questions, Q&A Chains
3. Freestyle (Time/Connections): Nature, Personal, Bible (Verse Genetics), History, Listening
4. Next Level (Christ-Centered Depth): Concentration (Christ in every text), Dimensions (5 layers), Connect 6 (genres), Theme Room, Time Zone, Patterns, Parallels, Fruit
5. Vision (Prophecy/Sanctuary): Blue Room (Sanctuary), Prophecy, Three Angels
6. Three Heavens & Cycles: 8 Cycles (@Ad→@Re), Three Heavens (DoL¹/NE¹, DoL²/NE², DoL³/NE³), Juice Room
7. Spiritual/Emotional (Height): Fire Room, Meditation, Speed
8. Master Floor: Reflexive Phototheology (no rooms, just natural PT thinking)

KEY PRINCIPLES:
- CONCENTRATION: Every text must reveal Christ
- DIMENSIONS: Literal, Christ, Me, Church, Heaven
- PATTERNS: 40 days, 3 days, deliverer stories, etc.
- PARALLELS: Mirrored actions across time (Babel/Pentecost, Exodus/Return)
- TYPES: Objects/offices pointing forward (lamb, temple, priest)
- CYCLES: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re
- HEAVENS: 1H (Babylon/Restoration), 2H (70 AD/New Covenant), 3H (Final New Creation)

OUTPUT FORMAT (JSON):
{
  "overallResponse": "Your natural, conversational response to the user. Warm and direct. If they asked a question, answer it directly.",
  "currentSection": {
    "title": "Section title",
    "content": "Lesson content (250-400 words max)",
    "scriptures": [{"ref": "verse reference", "text": "KJV text", "why": "why this verse matters"}],
    "questions": ["Question 1?", "Question 2?"],
    "options": ["Option A", "Option B", "Option C"]
  },
  "ptPath": {
    "floor": "Current floor name",
    "rooms": ["Room 1", "Room 2"],
    "principle": "Primary principle being applied"
  },
  "memoryAnchors": ["Image-based memory cue 1", "Image-based memory cue 2"],
  "progressUpdate": {
    "lessonId": "FB01_HolyScriptures",
    "stepId": "S3_Q2",
    "completedSections": ["S1", "S2", "S3"],
    "percentComplete": 35,
    "quiz": {"answered": 4, "correct": 3, "score": 75},
    "confidence": 3,
    "mode": "normal",
    "keyTakeaways": ["Key point 1", "Key point 2"],
    "objections": [],
    "pastoralFlags": [],
    "nextStep": "S4_ChristCentered"
  },
  "readinessCheck": {
    "knowledge": "brief assessment of understanding",
    "heart": "brief assessment of spiritual receptivity",
    "practice": "suggested action step"
  }
}`;

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

    if (candidateProfile) {
      userMessage += `\nCANDIDATE PROFILE:\n`;
      if (candidateProfile.learningStyle) {
        userMessage += `- Learning style: ${candidateProfile.learningStyle}\n`;
      }
      if (candidateProfile.pace) {
        userMessage += `- Pace preference: ${candidateProfile.pace}\n`;
      }
      if (candidateProfile.knownObjections?.length) {
        userMessage += `- Known objections: ${candidateProfile.knownObjections.join(', ')}\n`;
      }
    }

    if (scriptureContext) {
      userMessage += `\nSCRIPTURE CONTEXT:\n${scriptureContext}\n`;
    }

    userMessage += `\nCANDIDATE'S RESPONSE:\n\`\`\`\n${notes}\n\`\`\`\n`;

    if (sessionHistory && sessionHistory.length > 0) {
      userMessage += `\nPREVIOUS RESPONSES IN THIS SESSION (for context):\n${sessionHistory.slice(-5).join('\n---\n')}\n`;
    }

    // Detect if this is a question
    const isQuestion = /\?|what\s+(are|is|does|do|did)|who\s+(is|are|was|were)|why\s+(does|do|did|is|are)|how\s+(does|do|did|is|are|can|should)|explain|help me understand/i.test(notes);

    if (isQuestion) {
      userMessage += `\nIMPORTANT: The candidate is asking a QUESTION. Your PRIMARY task is to ANSWER THIS QUESTION DIRECTLY in your overallResponse. Then continue guiding them through the lesson.`;
    } else {
      userMessage += `\nAnalyze this response and guide the candidate through the next step of the ${lessonTitle || lessonId} lesson. Use the PT Palace method. Affirm correct understanding, gently correct misunderstandings, and spark deeper connections.`;
    }

    userMessage += `\n\nReturn valid JSON only.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: BAPTISM_GUIDE_SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ],
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      }
      if (response.status === 402) {
        throw new Error("AI credits exhausted. Please add credits to continue.");
      }
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
      // Extract JSON from possible markdown code blocks
      let jsonText = content;
      const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
      guidance = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error("Failed to parse Jeeves response:", content);
      // Return a fallback structure
      guidance = {
        overallResponse: content || "Let's continue exploring this truth together. What questions do you have about what we've covered?",
        currentSection: {
          title: "Reflection",
          content: "Take a moment to reflect on what you've learned so far in this lesson.",
          scriptures: [],
          questions: ["What stood out to you most?", "Is there anything you'd like me to explain further?"],
          options: []
        },
        ptPath: {
          floor: "Foundation Floor",
          rooms: ["Story Room"],
          principle: "Scripture-first"
        },
        memoryAnchors: [],
        progressUpdate: {
          lessonId: lessonId,
          stepId: currentStep || "S1",
          completedSections: [],
          percentComplete: 0,
          quiz: null,
          confidence: 0,
          mode: mode,
          keyTakeaways: [],
          objections: [],
          pastoralFlags: [],
          nextStep: "Continue"
        },
        readinessCheck: null
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
