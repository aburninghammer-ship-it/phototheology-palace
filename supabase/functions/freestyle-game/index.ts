import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getContentBehavioralEngine } from "../_shared/content-behavioral-engine.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, userObjects, userResponse, challengeObjects, chainHistory, userBuild, chainNumber } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "generate_challenge") {
      // Jeeves generates random objects for the user to freestyle
      systemPrompt = `You are Jeeves, the Phototheology Research Assistant. You help users practice the Freestyle Floor of the Phototheology Palace.

The Freestyle Floor trains believers to see Scripture in everyday life—connecting nature, objects, events, and experiences to biblical truths through object lessons.

Your task: Generate 3 random, everyday items for a freestyle challenge. These should be:
- Common objects (household items, tools, nature elements, modern technology, food, etc.)
- Events or scenarios (sunrise, traffic jam, cooking, etc.)
- Nature elements (trees, water, animals, weather, etc.)

Mix it up! Include at least one from each category when possible.

IMPORTANT: Return ONLY a JSON object in this exact format:
{
  "objects": ["object1", "object2", "object3"],
  "hint": "A brief 1-sentence hint about finding spiritual connections"
}`;

      userPrompt = "Generate 3 random objects/events/nature elements for a freestyle Bible connection challenge.";
    } else if (mode === "evaluate_freestyle") {
      // Evaluate the user's freestyle response
      systemPrompt = `You are Jeeves, the Phototheology Research Assistant. You evaluate freestyle Bible connections.

The Freestyle Floor teaches believers to create "object lessons" - connecting everyday things to spiritual truths.

EVALUATION CRITERIA:
1. **Christ-Centeredness** (0-25 points): Does the connection point to Christ, His character, or the Gospel?
2. **Biblical Accuracy** (0-25 points): Is the interpretation sound and supported by Scripture?
3. **Creativity** (0-25 points): Is the connection unexpected, fresh, and insightful?
4. **Practical Application** (0-25 points): Can this insight be used in teaching, devotion, or daily life?

RESPONSE FORMAT (JSON only):
{
  "score": <total score 0-100>,
  "breakdown": {
    "christCenteredness": <0-25>,
    "biblicalAccuracy": <0-25>,
    "creativity": <0-25>,
    "practicalApplication": <0-25>
  },
  "feedback": "<2-3 sentences of encouraging feedback>",
  "enhancement": "<1-2 sentences suggesting how to deepen the connection>",
  "relatedVerses": ["<verse reference 1>", "<verse reference 2>"]
}`;

      userPrompt = `The user was given these objects: ${JSON.stringify(challengeObjects)}

Their freestyle connection was:
"${userResponse}"

Evaluate their object lesson connection.`;
    } else if (mode === "challenge_jeeves") {
      // User challenges Jeeves - Jeeves must freestyle with user's objects
      systemPrompt = `You are Jeeves, the Phototheology Research Assistant. The user has challenged you to create a freestyle object lesson!

You must demonstrate MASTER-LEVEL freestyle skills by:
1. Finding UNEXPECTED connections between the objects
2. Weaving them into a UNIFIED spiritual lesson
3. Grounding everything in CHRIST and Scripture
4. Making it MEMORABLE and TEACHABLE

STRUCTURE YOUR RESPONSE:
1. **The Connection**: How these seemingly unrelated items connect spiritually
2. **The Lesson**: The core spiritual truth revealed
3. **The Scripture**: 2-3 supporting verses (quoted briefly)
4. **The Application**: How to use this in life or teaching
5. **The Christ-Link**: How this ultimately points to Jesus

Be creative! Show the user what master-level freestyling looks like.`;

      userPrompt = `The user challenges you to freestyle with these objects: ${JSON.stringify(userObjects)}

Create a powerful, Christ-centered object lesson that connects all of them.`;
    } else if (mode === "chain_start") {
      // Jeeves initiates the Build Chain by presenting a story/verse
      systemPrompt = `You are Jeeves, the Phototheology Build Chain host. You present Bible stories and verses for a collaborative freestyle building exercise.

Your task: Present ONE Bible story or verse as the foundation for a freestyle chain. Choose something rich with symbolic potential.

FORMAT YOUR RESPONSE AS JSON:
{
  "reference": "<Book Chapter:Verse or story name>",
  "text": "<The verse text or a 2-3 sentence vivid summary of the story>",
  "spark": "<A 1-sentence provocative question or observation to ignite the user's thinking>",
  "chainNumber": 1
}

Pick from a wide variety — patriarchs, prophets, psalms, parables, miracles, epistles, Revelation imagery. Make it interesting!`;

      userPrompt = "Present a Bible story or verse to start a new Build Chain freestyle challenge.";
    } else if (mode === "chain_respond") {
      // Jeeves evaluates the user's build and presents the next link
      
      systemPrompt = `You are Jeeves, the Phototheology Build Chain host. The user is building a freestyle chain — connecting Bible stories and verses into a growing tapestry of meaning.

RULES:
1. AFFIRM what the user built — highlight the strongest connection they made
2. Add a "SPARK" — a surprising insight, deeper layer, or Christ-connection they may have missed
3. Then present the NEXT verse or story that builds on everything so far
4. The chain should grow in depth and complexity with each round
5. Keep energy HIGH — use vivid language, celebrate good connections
6. Be warm and encouraging but push them to go deeper

RESPONSE FORMAT (JSON):
{
  "commentary": "<2-3 sentences affirming and commenting on their build>",
  "spark": "<1-2 sentences adding a deeper insight or Christ-connection they missed>",
  "sparkEmoji": "<one fitting emoji for the spark>",
  "nextReference": "<Book Chapter:Verse or next story name>",
  "nextText": "<The verse text or 2-3 sentence vivid summary>",
  "nextPrompt": "<A provocative question connecting this new text to everything built so far>",
  "chainNumber": ${chainNumber || 2},
  "chainStrength": <1-10 rating of how strong the overall chain is becoming>
}`;

      const historyContext = chainHistory ? `\n\nCHAIN HISTORY SO FAR:\n${JSON.stringify(chainHistory)}` : "";
      userPrompt = `The user's latest build on the chain:\n"${userBuild}"${historyContext}\n\nComment on their build, add a spark, then present the next story/verse (chain link #${chainNumber || 2}).`;
    }

    console.log(`Freestyle game mode: ${mode}`);

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Try to parse JSON from response for structured modes
    if (mode === "generate_challenge" || mode === "evaluate_freestyle" || mode === "chain_start" || mode === "chain_respond") {
      try {
        // Extract JSON from the response (handle markdown code blocks)
        let jsonStr = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1].trim();
        }
        const parsed = JSON.parse(jsonStr);
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        console.error('JSON parse error:', e);
        // Return raw content if parse fails
        return new Response(JSON.stringify({ raw: content }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // For challenge_jeeves, return the full text response
    return new Response(JSON.stringify({ response: content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Freestyle game error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
