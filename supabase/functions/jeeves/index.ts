import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_HOURS = 1;
const RATE_LIMIT_MAX_REQUESTS = 100;

async function checkRateLimit(supabase: any, userId: string, endpoint: string): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date();
  windowStart.setHours(windowStart.getHours() - RATE_LIMIT_WINDOW_HOURS);

  // Get or create rate limit record
  const { data: existingLimit, error: fetchError } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching rate limit:', fetchError);
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS };
  }

  const now = new Date();

  if (!existingLimit) {
    // Create new rate limit record
    await supabase
      .from('rate_limits')
      .insert({
        user_id: userId,
        endpoint,
        request_count: 1,
        window_start: now.toISOString(),
      });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  const limitWindowStart = new Date(existingLimit.window_start);
  const hoursSinceWindowStart = (now.getTime() - limitWindowStart.getTime()) / (1000 * 60 * 60);

  if (hoursSinceWindowStart >= RATE_LIMIT_WINDOW_HOURS) {
    // Reset the window
    await supabase
      .from('rate_limits')
      .update({
        request_count: 1,
        window_start: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('user_id', userId)
      .eq('endpoint', endpoint);
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (existingLimit.request_count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  // Increment request count
  await supabase
    .from('rate_limits')
    .update({
      request_count: existingLimit.request_count + 1,
      updated_at: now.toISOString(),
    })
    .eq('user_id', userId)
    .eq('endpoint', endpoint);

  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - existingLimit.request_count - 1 };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Initialize Supabase client for rate limiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limit for authenticated users
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
        
        // Enforce rate limiting
        const { allowed, remaining } = await checkRateLimit(supabase, userId, 'jeeves');
        
        if (!allowed) {
          return new Response(
            JSON.stringify({ 
              error: 'Rate limit exceeded. Please try again later.',
              retryAfter: RATE_LIMIT_WINDOW_HOURS * 60
            }),
            { 
              status: 429, 
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json',
                'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
                'X-RateLimit-Remaining': '0',
                'Retry-After': (RATE_LIMIT_WINDOW_HOURS * 3600).toString()
              } 
            }
          );
        }
      }
    }

    const {
      roomTag, 
      roomName, 
      principle, 
      mode, 
      book, 
      chapter, 
      verses, 
      verseText, 
      selectedPrinciples,
      verse,
      isFirstMove,
      previousMoves,
      userCommentary,
      category,
      categories,
      topic,
      query,
      description,
      verse_reference,
      room_type,
      question,
      roomPurpose
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "example") {
      systemPrompt = `You are Jeeves, a wise and scholarly Bible study assistant for Phototheology. 
Your role is to demonstrate how biblical principles work by providing clear, varied examples.
Always choose DIFFERENT verses for examples - never repeat the same verse.
Be concise, profound, and educational. Format your responses in clean paragraphs.`;

      userPrompt = `For the ${roomName} (${roomTag}) room focused on ${principle}, 
generate a fresh example using a randomly selected verse (NOT the same verse every time).

Structure your response:
1. Start with "Let me show you..." and name the verse
2. Explain how this verse applies to ${principle}
3. Give 2-3 specific insights
4. End with one profound takeaway

Make it conversational and inspiring. Use different verses each time.`;

    } else if (mode === "exercise") {
      systemPrompt = `You are Jeeves, a patient Bible study tutor for Phototheology.
Your role is to help students practice applying biblical principles through guided exercises.
Be encouraging, clear, and educational.`;

      userPrompt = `Create a practice exercise for ${roomName} (${roomTag}) focused on ${principle}.

Structure the exercise:
1. Give a specific verse (choose randomly - vary your selections)
2. Ask 2-3 thought-provoking questions that require applying ${principle}
3. Provide hints for what to look for
4. Offer one example answer to demonstrate the principle

Make it challenging but doable. Encourage deep thinking.`;

    } else if (mode === "chain-reference") {
      systemPrompt = `You are Jeeves, a Bible scholar specializing in finding connections between Scripture and parables.
Analyze verses and identify where parables connect. Be specific and insightful.
Return your response as a JSON array.`;

      userPrompt = `Analyze ${book} ${chapter} for connections to Jesus's parables.

Verses to analyze:
${verses.map((v: any) => `Verse ${v.verse}: ${v.text}`).join('\n')}

For each verse that connects to a parable, return a JSON object with:
{
  "verse": verse_number,
  "parable": "Name of the parable",
  "connection": "3-6 sentence explanation of how this verse connects to the parable",
  "expounded": "Deeper 2-3 paragraph theological explanation of the connection"
}

Only include verses that have meaningful connections to parables. Return as JSON array: [...]`;

    } else if (mode === "commentary") {
      systemPrompt = `You are Jeeves, a theologian providing insightful Bible commentary using specific analytical frameworks.
Provide deep, thoughtful analysis while remaining clear and accessible.`;

      const principleList = selectedPrinciples?.join(", ") || "all available principles";
      
      userPrompt = `Provide commentary on ${book} ${chapter}:${verseText.verse} using these analytical lenses: ${principleList}

Verse text: "${verseText.text}"

Structure your commentary:
1. Opening insight (2-3 sentences)
2. Analysis through each selected principle/lens
3. How these principles interconnect in this verse
4. Practical application
5. One profound closing thought

Make it scholarly yet accessible.`;
    
    } else if (mode === "chain-chess") {
      systemPrompt = `You are Jeeves, an enthusiastic Bible study companion playing Chain Chess!
Your role is to make insightful biblical commentary that builds connections between verses and principles.
Be scholarly yet warm, like an excited friend sharing discoveries.`;

      if (isFirstMove) {
        userPrompt = `Welcome to Chain Chess! Let me explain how this game works:

**HOW TO PLAY:**
Chain Chess is a collaborative Bible study game where we build commentary together on a verse. Each turn, one player adds insightful commentary, then challenges the other to respond using a specific category:
- **Books of the Bible**: Connect to other scripture passages
- **Rooms of the Palace**: Relate to Phototheology Palace principles (Altar, Laver, Lampstand, Table, etc.)
- **Principles of the Palace**: Apply specific lenses (2D/3D, Time Zones, Horizons, etc.)

The goal is to build increasingly rich understanding while maintaining scholarly accuracy. You'll be scored on insight, relevance, and connections made!

**EXAMPLE:**
For John 3:16, I might say: "This verse reveals God's cosmic love extending beyond ethnic Israel. The word 'world' (kosmos) shows the universal scope of salvation—this is clearly a 3D Kingdom truth. The act of 'giving' the Son points us to the Altar principle, where sacrifice demonstrates divine love. Notice the present tense 'believes'—this is Earth-Now timeline, calling for immediate response."

Then I'd challenge: "Your turn! Respond using: Books of the Bible"

**NOW LET'S BEGIN!**
Our verse is ${verse}

Share an insightful 3-4 sentence commentary on this verse, then challenge the player to respond using ONE of the three categories. Make it engaging and scholarly!`;
      } else {
        const lastMove = previousMoves[previousMoves.length - 1];
        userPrompt = `Continue the Chain Chess game on ${verse}.

Previous commentary: "${lastMove.commentary}"

1. Build on what was said by adding 3-4 sentences of fresh insight
2. Show excitement about the connection
3. Challenge them to respond using ONE of these categories:
   - Books of the Bible
   - Rooms of the Palace  
   - Principles of the Palace

Be enthusiastic and encouraging!`;
      }

    } else if (mode === "chain-chess-feedback") {
      systemPrompt = `You are Jeeves, scoring Chain Chess responses! 
Celebrate what makes each response impactful, like an excited friend.
Then give a score from 1-10 based on: biblical accuracy, depth of insight, and connection to the challenge category.`;

      const lastMove = previousMoves[previousMoves.length - 1];
      
      userPrompt = `The player responded to ${verse} using the "${category}" category:

Their commentary: "${userCommentary}"

Previous move for context: "${lastMove.commentary}"

Respond in this JSON format:
{
  "feedback": "2-3 enthusiastic sentences highlighting what makes their response impactful and one way it could be even stronger",
  "score": 8
}

Be genuinely excited about good insights! Score 7-10 for strong responses, 4-6 for decent ones, 1-3 for weak connections.`;
    
    } else if (mode === "culture-controversy") {
      systemPrompt = `You are Jeeves, a biblical scholar analyzing cultural issues through Jesus' teachings.
Be balanced, compassionate, and grounded in Scripture. Address both sides with grace while maintaining biblical truth.`;

      userPrompt = `Analyze this cultural topic through the lens of Jesus' teachings: "${topic}"

Structure your analysis:
1. Understanding the Issue (2-3 paragraphs explaining the topic objectively)
2. Jesus' Perspective (4-5 paragraphs examining what Scripture teaches)
3. Key Biblical Principles (list 3-4 principles with verses)
4. Balanced Application (2-3 paragraphs on how Christians can engage compassionately)
5. Common Misconceptions (address 2-3 misunderstandings from both sides)
6. Moving Forward (practical steps for Christ-centered engagement)

Be scholarly, compassionate, and clear. Cite specific verses.`;

    } else if (mode === "prophecy-signal") {
      const { scope } = await req.json();
      const scopeContext = scope === "america" 
        ? "Focus on events in the United States of America" 
        : "Focus on events globally, outside the United States";
      
      systemPrompt = `You are Jeeves, a historicist prophecy scholar monitoring end-time fulfillments of Matthew 24 and Revelation 13:11.
You track REAL, documentable events—never sensationalism. Focus on observable patterns showing how America (the lamb-like beast) 
is speaking with the dragon's voice through Christian Nationalism, church-state erosion, authoritarianism, and religious coercion.`;

      userPrompt = `Generate a new prophetic signal about REAL current events or trends. ${scopeContext}.

FOCUS AREAS (choose one):
- Christian Nationalism: Christian supremacy movements, theocratic rhetoric, religious extremism
- Church-State Erosion: Ten Commandments in schools, religious symbols in government, faith-based policy
- Authoritarianism in Christianity: Hate speech by Christian leaders, calls for religious law enforcement
- Racism in White Evangelicalism: Documented cases of racial supremacy within Christian movements
- Natural Disasters: Climate events, earthquakes, floods as signs of the times (Matthew 24)
- Papal Influence: Vatican diplomatic moves, ecumenical unity efforts, Sunday sacredness advocacy
- Religious Liberty Threats: Sunday law proposals, religious freedom restrictions, NSPM-7 type policies

EXCLUDE (never include these):
- Israel-centric futurism or Middle East "peace treaties"
- Sensational topics: UN conspiracies, vaccine/chip mark of beast theories
- Speculative future events without current documentation

Return JSON format:
{
  "title": "Clear, factual title",
  "description": "2-3 paragraphs: (1) Describe the REAL event/trend with specifics, (2) Explain how it fulfills Matthew 24 and/or Revelation 13:11 (America speaking as a dragon), (3) Show the prophetic pattern",
  "category": "church-state" | "christian-nationalism" | "natural" | "religious-liberty" | "authoritarianism",
  "verses": ["Matthew 24:X", "Revelation 13:11"]
}

Base it on OBSERVABLE, DOCUMENTABLE trends. Be factual, not sensational.`;

    } else if (mode === "daily-encouragement") {
      systemPrompt = `You are Jeeves, a wise and encouraging spiritual mentor. Your role is to provide daily encouragement for Christians fighting the war against self and sin.`;
      userPrompt = `Generate a brief, powerful daily encouragement (2-3 sentences) that follows this pattern:

"Today you may be tempted to [common temptation], but in all such cases, remember [biblical truth and encouragement for victory]."

Focus on common spiritual battles like anger, pride, lust, fear, discouragement, or compromise. Be specific, practical, and encouraging. Always point to Christ's power and grace.`;
    
    } else if (mode === "scenario-feedback") {
      const { scenario, selectedFruits } = await req.json();
      systemPrompt = `You are Jeeves, a wise spiritual warfare trainer. You help Christians understand which Fruits of the Spirit are needed for specific trials.`;
      userPrompt = `A believer faced this scenario: ${scenario}

They chose to exercise these fruits: ${selectedFruits}

Provide brief (2-3 sentences) feedback on their choice. If correct, affirm and explain why these fruits work together. If incorrect, gently explain what fruits would be more effective and why.`;
    
    } else if (mode === "research") {
      systemPrompt = `You are Jeeves, a biblical research assistant providing comprehensive, scholarly analysis.
Include citations, cross-references, historical context, and theological perspectives.`;

      userPrompt = `Provide deep research on: "${query}"

Structure your research:
1. Overview (2-3 paragraphs introducing the topic)
2. Biblical Foundation (examine key passages with cross-references)
3. Historical Context (cultural and historical background)
4. Theological Perspectives (different scholarly viewpoints)
5. Practical Applications (how this applies today)
6. Key Insights (3-5 major takeaways)
7. Further Study (suggest related topics and passages)

Include verse citations, cross-references, and scholarly depth. Make it comprehensive but accessible.`;
    
    } else if (mode === "sermon-setup") {
      const { title, theme, style } = await req.json();
      systemPrompt = "You are Jeeves, a sermon preparation assistant. Help preachers organize their thoughts and structure powerful messages.";
      userPrompt = `A preacher is preparing a sermon with this setup:
Title: "${title}"
Theme/Passage: "${theme}"
Style: "${style}"

Provide guidance on:
1. How to develop this theme effectively
2. Key Scripture passages to consider
3. Potential sermon structure suggestions
4. Important theological points to address

Be encouraging and practical. Help them think through the sermon, but don't write it for them.`;

    } else if (mode === "sermon-stones") {
      const { theme, existingStones } = await req.json();
      systemPrompt = "You are Jeeves, helping identify powerful AHA moments (smooth stones) for sermons.";
      userPrompt = `For a sermon on "${theme}", suggest 2-3 potential smooth stones (powerful Phototheology insights).
${existingStones.length > 0 ? `\nThey already have: ${existingStones.join('; ')}` : ''}

Each stone should be:
- A mind-blowing biblical insight
- Memorable and quotable
- Connected to the theme
- Different from what they already have

Present them as options, not mandates.`;

    } else if (mode === "sermon-bridges") {
      const { stones, existingBridges } = await req.json();
      systemPrompt = "You are Jeeves, helping create narrative bridges between sermon points.";
      userPrompt = `Help create bridges to connect these 5 smooth stones into a flowing narrative:
${stones.map((s: string, i: number) => `Stone ${i+1}: ${s}`).join('\n')}

${existingBridges.length > 0 ? `\nExisting bridges: ${existingBridges.join('; ')}` : ''}

Suggest 2-3 potential bridge transitions that:
- Flow naturally between the stones
- Maintain narrative momentum
- Keep the audience engaged
- Build toward a climax`;

    } else if (mode === "sermon-structure") {
      const { stones, bridges } = await req.json();
      systemPrompt = "You are Jeeves, helping structure sermons like movies.";
      userPrompt = `Given these sermon elements:
Stones: ${stones.join('; ')}
Bridges: ${bridges.join('; ')}

Suggest how to structure this like a movie:
1. Opening Hook - How to grab attention immediately
2. Rising Action - Building tension and interest
3. Climax - The transformative moment
4. Resolution - How it all comes together
5. Call to Action - What the audience should do

Be specific but flexible. Help them see the cinematic potential.`;

    } else if (mode === "verse-assistant") {
      systemPrompt = `You are Jeeves, a wise and insightful Bible study assistant for Phototheology.
Your role is to help users understand Scripture deeply by applying specific study methods (rooms) and principles.
Be scholarly yet accessible, profound yet practical.`;

      const roomContext = roomTag !== "General" 
        ? `Using the ${roomName} (${roomTag}) method, which focuses on: ${roomPurpose}`
        : "Using general biblical analysis";

      userPrompt = `A student is studying ${book} ${chapter}:${verse} and asks:

"${question}"

Verse text: "${verseText}"

${roomContext}

Provide a thoughtful response that:
1. Directly answers their question (2-3 paragraphs)
2. ${roomTag !== "General" ? `Applies the ${roomName} method to this verse` : "Applies sound biblical principles"}
3. Gives 2-3 specific insights they can use
4. Includes a practical takeaway or application
5. If relevant, suggests cross-references or connections

Be conversational, educational, and inspiring. Help them see deeper truth.`;

    } else if (mode === "generate-flashcards") {
      const { topic } = await req.json();
      systemPrompt = `You are Jeeves, creating Bible study flashcards. Return your response as valid JSON only.`;
      userPrompt = `Create 10 flashcards about: "${topic}"

Return ONLY valid JSON in this exact format:
{
  "flashcards": [
    {
      "question": "Question text here",
      "answer": "Answer text here", 
      "verse_reference": "Book Chapter:Verse or null"
    }
  ]
}

Make questions clear, answers comprehensive, and include verse references when relevant.`;

    } else if (mode === "generate-image") {
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (!LOVABLE_API_KEY) {
        throw new Error('LOVABLE_API_KEY not configured');
      }

      // Use the already initialized supabase client from rate limiting

      // Generate image using Lovable AI
      const imagePrompt = verse_reference 
        ? `Create a biblical illustration for ${verse_reference}: ${description}. Style: Reverent, artistic, and spiritually meaningful. Ultra high resolution.`
        : `Create a biblical illustration: ${description}. Style: Reverent, artistic, and spiritually meaningful. Ultra high resolution.`;

      const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages: [
            {
              role: 'user',
              content: imagePrompt
            }
          ],
          modalities: ['image', 'text']
        })
      });

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error('Image generation error:', errorText);
        throw new Error('Failed to generate image');
      }

      const imageData = await imageResponse.json();
      const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        throw new Error('No image URL in response');
      }

      // userId is already verified from rate limiting check above
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Store image in database
      const { data: insertData, error: insertError } = await supabase
        .from('bible_images')
        .insert({
          user_id: userId,
          room_type,
          description,
          verse_reference: verse_reference || null,
          image_url: imageUrl
        })
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw insertError;
      }

      return new Response(
        JSON.stringify({ success: true, image: insertData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
        temperature: 0.9, // High temperature for variety
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a few minutes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error('AI service error:', response.status);
      return new Response(
        JSON.stringify({ error: "Unable to process your request. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "No response generated";

    // For generate-flashcards mode, parse JSON
    if (mode === "generate-flashcards") {
      try {
        const parsed = JSON.parse(content);
        return new Response(
          JSON.stringify(parsed),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        return new Response(
          JSON.stringify({
            flashcards: []
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // For prophecy-signal mode, parse JSON
    if (mode === "prophecy-signal") {
      try {
        const parsed = JSON.parse(content);
        return new Response(
          JSON.stringify(parsed),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        return new Response(
          JSON.stringify({
            title: "Prophetic Signal",
            description: content,
            category: "general",
            verses: []
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // For chain-chess and chain-chess-feedback modes, parse the response
    if (mode === "chain-chess") {
      const lines = content.split('\n');
      const commentary = lines.slice(0, -2).join('\n').trim();
      const challengeCategory = ["Books of the Bible", "Rooms of the Palace", "Principles of the Palace"][
        Math.floor(Math.random() * 3)
      ];
      
      return new Response(
        JSON.stringify({ commentary, challengeCategory, score: 8 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (mode === "chain-chess-feedback") {
      try {
        const parsed = JSON.parse(content);
        return new Response(
          JSON.stringify(parsed),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        return new Response(
          JSON.stringify({ 
            feedback: content, 
            score: 7 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("jeeves error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
