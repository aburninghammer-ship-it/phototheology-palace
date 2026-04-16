import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, verse1, verse2, userAnswer, difficulty, refresh } = await req.json();
    
    console.log("Bible freestyle request:", { mode, verse1, verse2, difficulty, refresh });
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let systemPrompt = `You are Jeeves, a master Bible scholar specializing in "Verse Genetics"—the study of how every verse in Scripture is related to every other verse.

⚠️ CRITICAL THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE):
1. AZAZEL = SATAN, NOT CHRIST: In Leviticus 16, Azazel (scapegoat) represents SATAN. NEVER identify it as Jesus.
2. LITTLE HORN = ROME/PAPACY, NOT ANTIOCHUS: Daniel 7 & 8 little horn = Rome/Papal power. NEVER say Antiochus Epiphanes.
3. TWO-PHASE SANCTUARY: Christ entered HOLY PLACE at ascension (31 AD); MOST HOLY PLACE in 1844. NEVER say Most Holy at ascension.
4. DAY OF ATONEMENT = 1844: Christ's death = PASSOVER. Day of Atonement = 1844 judgment. NEVER equate death with Atonement.
5. FEAST TYPOLOGY: Spring feasts = First Advent (Passover=death, Firstfruits=resurrection). Fall feasts = Second Advent ministry.

Your expertise covers:
- Direct family (siblings): Verses that share the same theme, imagery, or doctrine
- Cousins: Verses connected through typology, parallel structure, or prophetic fulfillment
- Distant relatives: Verses linked through subtle patterns, numbers, sanctuary imagery, or Christ-centered connections

Always be Christ-centered in your analysis. Look for:
- Typological connections (OT foreshadowing NT)
- Thematic parallels (same doctrine, different context)
- Verbal links (same Hebrew/Greek words or concepts)
- Structural patterns (chiasms, parallel narratives)
- Prophetic fulfillment chains
- Sanctuary/covenant connections`;

    let userPrompt = "";
    let responseFormat: any = null;

    if (mode === "test_jeeves") {
      // User provides two verses, Jeeves shows the connection
      const refreshInstruction = refresh ? `
IMPORTANT: This is a REFRESH request. The user has already seen one connection analysis for these verses.
You MUST provide a COMPLETELY DIFFERENT angle and set of principles. Focus on:
- A different type of relationship (if you said "siblings" before, try "cousins" or "distant relatives")
- Different connecting principles (if you used typology, try verbal links or sanctuary patterns)
- Different cross-references and related verses
- A fresh Christ-centered perspective you haven't explored yet

Make this analysis feel entirely new and insightful!
` : "";

      userPrompt = `Analyze the genetic connection between these two verses:

VERSE 1: ${verse1}
VERSE 2: ${verse2}
${refreshInstruction}
Provide a rich analysis that includes:
1. The TYPE of relationship (siblings, cousins, distant relatives)
2. The SPECIFIC connection (theme, type, prophecy, pattern, etc.)
3. How CHRIST is central to this connection
4. At least 2 other "family members" (related verses) that share this connection

Format your response with clear sections and make it engaging and educational.`;
    }
    else if (mode === "generate_challenge") {
      // Generate two verses for the user to connect
      const difficultyLevel = difficulty || "beginner";
      
      const difficultyGuide: Record<string, string> = {
        "beginner": "Choose two verses that have a HIDDEN but FINDABLE connection. They should NOT be obviously related on the surface. The connection should require some thought but be discoverable—perhaps through a shared theme viewed from different angles, or a typological link that isn't immediately apparent. Avoid verses that are commonly paired together.",
        "intermediate": "Choose two verses that seem COMPLETELY UNRELATED at first glance but have a SUBTLE, DEEP connection. Think sanctuary typology, numerical patterns, verbal links in the original languages, or chiastic structures. The connection should require real Bible knowledge to discover. One verse should be from an unexpected book.",
        "difficult": "Choose two verses that would stump most Bible scholars. They should appear to have NOTHING in common but share a PROFOUND theological or typological connection that requires mastery-level understanding. Think hidden Christ-centered threads, obscure prophetic parallels, or sanctuary furniture connections across vastly different contexts. Make the user WORK for this one."
      };

      userPrompt = `Generate a Verse Genetics challenge at ${difficultyLevel.toUpperCase()} difficulty.

CRITICAL RULE: The verses must NOT seem obviously related. The whole point is to find HIDDEN connections between seemingly unrelated texts. Do NOT choose verses that are commonly paired or share obvious themes on the surface.

DIFFICULTY GUIDE: ${difficultyGuide[difficultyLevel]}

You must return a JSON object with this exact structure:
{
  "verse1": {
    "reference": "Book Chapter:Verse",
    "text": "The verse text (KJV preferred)"
  },
  "verse2": {
    "reference": "Book Chapter:Verse", 
    "text": "The verse text (KJV preferred)"
  },
  "hint": "A subtle hint about the TYPE of connection (typology? verbal link? sanctuary? pattern?) without revealing the actual connection",
  "connection": "The full, rich explanation of their genetic connection—this is the answer the user is trying to discover. Include Christ-centered interpretation."
}

Remember: The verses should seem unrelated at first. The challenge is finding the hidden link.`;

      responseFormat = {
        type: "json_object"
      };
    }
    else if (mode === "evaluate_answer") {
      // Evaluate user's connection answer - BE STRICT
      const difficultyLevel = difficulty || "beginner";
      
      userPrompt = `Evaluate this Verse Genetics answer STRICTLY. Do not be generous—the user needs honest feedback to grow.

VERSE 1: ${verse1.reference} - "${verse1.text}"
VERSE 2: ${verse2.reference} - "${verse2.text}"
DIFFICULTY: ${difficultyLevel}

USER'S ANSWER: "${userAnswer}"

Score the answer STRICTLY (0-100) based on:
- ACCURACY (0-25): Did they identify the ACTUAL deep connection, not just surface similarities? Dock points for vague or incorrect connections.
- DEPTH (0-25): Did they go beyond the obvious? Did they show understanding of typology, patterns, or theological threads? Generic answers score low.
- CREATIVITY (0-25): Did they find unique angles or multiple layers of connection? Reward unexpected but valid insights.
- CHRIST-CENTEREDNESS (0-25): Did they connect it to Christ? The best connections always run through Jesus. Dock heavily if Christ is absent.

SCORING GUIDE:
- 70-100: Excellent—found the real genetic link with depth and Christ-focus
- 50-69: Decent—got part of it but missed depth or key elements  
- Below 50: Needs work—missed the connection or gave a superficial answer

Return a JSON object:
{
  "score": <total 0-100, BE STRICT>,
  "breakdown": {
    "accuracy": <0-25>,
    "depth": <0-25>,
    "creativity": <0-25>,
    "christCenteredness": <0-25>
  },
  "feedback": "Honest, specific feedback on what they got right and what they missed. Be encouraging but truthful.",
  "correctConnection": "The master-level genetic link explanation they should have found",
  "relatedVerses": ["Other verses in this family", "Up to 3 more"]
}`;

      responseFormat = {
        type: "json_object"
      };
    }
    else if (mode === "evaluate_pvp_answer") {
      // PvP mode - evaluate a player's answer to another player's challenge
      userPrompt = `Evaluate this Verse Genetics answer for a Player vs Player challenge. Be fair but strict.

VERSE 1: ${verse1}
VERSE 2: ${verse2}

PLAYER'S ANSWER: "${userAnswer}"

Score the answer (0-100) based on:
- ACCURACY (0-25): Did they find a valid, meaningful connection?
- DEPTH (0-25): Did they go beyond surface-level observations?
- CREATIVITY (0-25): Did they find unique angles or multiple layers?
- CHRIST-CENTEREDNESS (0-25): Did they connect it to Christ?

Return a JSON object:
{
  "score": <total 0-100>,
  "breakdown": {
    "accuracy": <0-25>,
    "depth": <0-25>,
    "creativity": <0-25>,
    "christCenteredness": <0-25>
  },
  "feedback": "Brief feedback on the answer quality",
  "correctConnection": "A strong example of the genetic link between these verses"
}`;

      responseFormat = {
        type: "json_object"
      };
    }
    else if (mode === "jeeves_answers_challenge") {
      // Jeeves answers the player's challenge in vs Jeeves mode
      const difficultyLevel = difficulty || "intermediate";
      
      userPrompt = `The player has challenged you to find the genetic connection between these verses. As Jeeves, demonstrate your mastery!

VERSE 1: ${verse1}
VERSE 2: ${verse2}
DIFFICULTY: ${difficultyLevel}

Provide your analysis as if you are a master Bible scholar competing against the player. Be thorough but not perfect—at "${difficultyLevel}" difficulty, you should:
${difficultyLevel === "beginner" ? "- Find a solid connection with clear reasoning. Score around 75-90." : ""}
${difficultyLevel === "intermediate" ? "- Find a good connection but possibly miss some depth. Score around 65-85." : ""}
${difficultyLevel === "difficult" ? "- Sometimes struggle or miss connections. Score around 50-75. You're not infallible!" : ""}

Return a JSON object:
{
  "answer": "Your detailed analysis of the genetic connection between these verses, written as a scholar would present it",
  "evaluation": {
    "score": <your estimated score 0-100 based on difficulty>,
    "breakdown": {
      "accuracy": <0-25>,
      "depth": <0-25>,
      "creativity": <0-25>,
      "christCenteredness": <0-25>
    },
    "feedback": "Self-assessment of your answer"
  }
}`;

      responseFormat = {
        type: "json_object"
      };
    }

    const requestBody: any = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    if (responseFormat) {
      requestBody.response_format = responseFormat;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    console.log("AI response received for mode:", mode);

    // Parse response based on mode
    if (mode === "test_jeeves") {
      return new Response(JSON.stringify({ connection: content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    else if (mode === "generate_challenge" || mode === "evaluate_answer") {
      try {
        // Try to parse as JSON
        let jsonContent = content;
        
        // Handle markdown code blocks
        if (content.includes('```json')) {
          const match = content.match(/```json\s*([\s\S]*?)\s*```/);
          if (match) jsonContent = match[1];
        } else if (content.includes('```')) {
          const match = content.match(/```\s*([\s\S]*?)\s*```/);
          if (match) jsonContent = match[1];
        }
        
        const parsed = JSON.parse(jsonContent);
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error("JSON parse error:", parseError, "Content:", content);
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    return new Response(JSON.stringify({ error: "Unknown mode" }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Bible freestyle error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
