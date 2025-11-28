import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { 
  PALACE_SCHEMA, 
  MASTER_IDENTITY,
  THINKING_PROCESS,
  UNIVERSAL_RESPONSE_RULES,
  APPLICATION_ENGINE,
  MASTERY_SYSTEM,
  THEOLOGICAL_REASONING,
  INTERACTION_MODES,
  GUARDRAILS,
  REQUEST_HANDLING,
  NEVER_DO_THIS,
  ALWAYS_DO_THIS,
  FIVE_MASTERMIND_COUNCIL,
  FORMATTING_REQUIREMENTS,
  CLOSING_BEHAVIOR
} from './palace-schema.ts';

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
    let userFirstName: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
        
        // Fetch user's first name from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single();
        
        if (profile?.first_name) {
          userFirstName = profile.first_name;
        }
        
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

    // Parse request body once to avoid "Body already consumed" error
    const requestBody = await req.json();
    const {
      action,
      roomTag, 
      roomName, 
      principle, 
      mode,
      message,
      context: requestContext,
      book, 
      chapter, 
      verses, 
      verseText, 
      selectedPrinciples,
      verse,
      equation,
      symbols,
      isFirstMove,
      previousMoves,
      userCommentary,
      userVerse,
      category,
      categories,
      topic,
      query,
      description,
      verse_reference,
      room_type,
      question,
      roomPurpose,
      availableCategories,
      includeSOP,
      difficulty,
      symbolCount,
      challengeCategory,
      newChallengeCategory,
      lessonTitle,
      dayTitle,
      lessonContent,
      bibleVerses,
      selectedRoom,
      selectedPrinciple,
      userQuestion,
      scenario,
      selectedFruits,
      title,
      theme,
      style,
      existingStones,
      stones,
      existingBridges,
      bridges,
      scope,
      timePeriod,
      // Game validation properties
      cards,
      explanation,
      items,
      narrative,
      zones,
      genres,
      doctrine,
      card,
      answer,
      issue,
      diagnosis,
      attack,
      defense,
      pieces,
      objection,
      storyboard,
      recipe,
      chartType,
      chartData,
      chartTitle,
      roomMethod,
      strongsWord,
      strongsNumber,
      // Series builder properties
      audienceType,
      context,
      primaryGoal,
      themeSubject,
      lessonCount,
      // Commentary properties
      classicCommentary,
      // User identification
      userName,
      // Card deck properties
      roomId,
      userAnswer,
      textType
    } = requestBody;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const PRINCIPLES = [
      { code: "P‖", name: "Parallels" },
      { code: "PRm", name: "Patterns" },
      { code: "@T", name: "Types" },
      { code: "CR", name: "Christ-Centered" },
      { code: "BL", name: "Sanctuary" },
      { code: "FE", name: "Feasts" },
      { code: "DR", name: "Dimensions" },
      { code: "TZ", name: "Time Zones" },
    ];

    // Handle Find Verses action (for memory lists)
    if (action === 'find_verses') {
      const { query } = requestBody;
      
      if (!query) {
        return new Response(
          JSON.stringify({ error: 'Query is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const prompt = `You are Jeeves, helping a user find Bible verses for their memory list.

The user is asking: "${query}"

Your task:
1. Identify the key topics, themes, or subjects in their request
2. Find 8-12 highly relevant Bible verses that match their request
3. For each verse, provide:
   - The exact verse reference (format: "Book Chapter:Verse")
   - The full verse text (KJV)
   - A brief explanation (1 sentence) of why this verse is relevant to their request

CRITICAL RULES:
- ONLY return real, accurate Bible verses
- Double-check verse references are correct
- Use KJV text
- Focus on verses that are clear and memorable for memorization
- If they mention specific books (like Daniel, Revelation), prioritize those books
- If they mention specific topics (sanctuary, prophecy, beasts), find the most relevant verses

Return as a JSON array with this exact format:
[
  {
    "reference": "Daniel 7:3",
    "text": "And four great beasts came up from the sea, diverse one from another.",
    "explanation": "Introduces the four beasts representing kingdoms in Daniel's prophecy"
  }
]`;

      try {
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: 'You are Jeeves, a Bible study assistant specializing in finding verses that match specific topics and themes. You are extremely accurate with verse references and always verify they exist.' },
              { role: 'user', content: prompt }
            ],
          }),
        });

        const data = await response.json();
        let content = data.choices[0].message.content;
        
        // Clean control characters
        content = content.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
        
        // Extract JSON
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const verses = JSON.parse(jsonMatch[0]);
          return new Response(
            JSON.stringify({ verses }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        throw new Error('Failed to parse verses from response');
      } catch (error) {
        console.error('Error finding verses:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to find verses. Please try rephrasing your request.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Handle Scripture Chain action
    if (action === 'generate_scripture_chain') {
      const { verse: verseText, book, chapter, verseNumber } = requestBody;
      
      const prompt = `Given this verse from ${book} ${chapter}:${verseNumber} - "${verseText}"

Find 4-8 other Bible verses that connect to this verse through Phototheology principles (types, parallels, patterns, Christ-centered connections, etc.). For each connection:
1. Provide the verse reference
2. Include the verse text
3. Explain how it connects and which PT principle links them
4. Name the principle used (e.g., "Type", "Parallel", "Pattern", "Christ-Center", etc.)

Return as JSON array with objects containing: verse, text, connection, principle`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You are a Phototheology expert helping users discover connections between Bible verses using Phototheology principles.' },
            { role: 'user', content: prompt }
          ],
        }),
      });

      const data = await response.json();
      let content = data.choices[0].message.content;
      
      // Clean control characters
      content = content.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
      
      // Extract JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const links = JSON.parse(jsonMatch[0]);
        return new Response(
          JSON.stringify({ links }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('Failed to parse scripture chain from response');
    }

    // Handle Principle Chapter Scan action
    if (action === 'scan_chapter_for_principle') {
      const { book, chapter, principle } = requestBody;
      
      const principleName = PRINCIPLES.find(p => p.code === principle)?.name || principle;
      
      // Special handling for multi-principle rooms to enforce valid sub-principles
      let systemPromptAddition = '';
      
      if (principle === 'Theme Room (TRm)' || principleName.includes('Theme Room')) {
        systemPromptAddition = `

CRITICAL: The Theme Room (TRm) has EXACTLY 6 themes/walls that form the structural framework of biblical architecture:

1. **Sanctuary Wall** - Texts that connect to the sanctuary system, its furniture, services, and symbolism
2. **Life of Christ Wall** - Texts anchoring in Christ's incarnation, ministry, death, resurrection, and ascension
3. **Great Controversy Wall** - Texts revealing the cosmic battle between Christ and Satan
4. **Time Prophecy Wall** - Verses tied to prophetic timelines and prophetic periods
5. **Gospel Floor** - The foundation: justification, sanctification, glorification
6. **Heaven Ceiling** - The final hope: new creation, eternal life, God's dwelling with humanity

You MUST identify which of these 6 specific themes applies to each verse. DO NOT invent other themes like "Truth, Righteousness, Morality" or any other concepts. ONLY use the 6 themes listed above.

For each verse, identify which ONE theme from the list above is most prominent and explain how it connects to that specific wall/floor/ceiling.`;
      } else if (principle === 'Dimensions Room (DR)' || principleName.includes('Dimensions')) {
        systemPromptAddition = `

CRITICAL: The Dimensions Room (DR) has EXACTLY 5 dimensions:
1. **Literal (1D)** - What the text literally says
2. **Christ (2D)** - How it points to Jesus
3. **Me (3D)** - Personal application
4. **Church (4D)** - Application to the community of believers
5. **Heaven (5D)** - Eschatological/eternal perspective

ONLY use these 5 dimensions. Do not invent other dimensions.`;
      } else if (principle === 'Connect-6 (C6)' || principleName.includes('Connect-6')) {
        systemPromptAddition = `

CRITICAL: Connect-6 (C6) identifies GENRE, not themes. The 6 valid genres are:
1. **Prophecy** - Symbolic, apocalyptic literature
2. **Parable** - Story with hidden spiritual meaning
3. **Epistle** - Letters with doctrinal teaching
4. **History** - Narrative of events
5. **Gospel** - Jesus' life and ministry
6. **Poetry** - Hebrew poetry (parallelism, metaphor)

ONLY use these 6 genres. Do not invent categories like "Divine Attributes" or "Wisdom Literature."`;
      } else if (principle === 'Time Zone (TZ)' || principleName.includes('Time Zone')) {
        systemPromptAddition = `

CRITICAL: The Time Zone Room (TZ) views texts through 6 specific time zone lenses (Heaven/Earth × Past/Present/Future):
1. **Heaven-Past** - Viewing text through pre-fall heaven context
2. **Heaven-Present** - Viewing text through current heavenly ministry context
3. **Heaven-Future** - Viewing text through eternal new creation context
4. **Earth-Past** - Viewing text through historical biblical events
5. **Earth-Present** - Viewing text through current human experience
6. **Earth-Future** - Viewing text through end-time prophecy context

You MUST specify which ONE time zone lens you're using for each verse. A verse can be understood through multiple zones, but you must name the specific zone you're applying.`;
      }
      
      const prompt = `Scan ${book} chapter ${chapter} and find all verses where the Phototheology principle "${principleName}" can be applied.

For each verse you identify:
1. Provide the verse reference (e.g., "${book} ${chapter}:5")
2. Include the verse text
3. Explain specifically how ${principleName} applies to that verse
4. Be selective - only include verses where the principle genuinely applies

Return as JSON array with objects containing: verse, text, connection, principle`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: `You are a Phototheology expert analyzing Bible chapters to identify where specific principles apply.${systemPromptAddition}` },
            { role: 'user', content: prompt }
          ],
        }),
      });

      const data = await response.json();
      let content = data.choices[0].message.content;
      
      // Clean control characters
      content = content.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
      
      // Extract JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const results = JSON.parse(jsonMatch[0]);
        return new Response(
          JSON.stringify({ results }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('Failed to parse principle scan from response');
    }

    let systemPrompt = "";
    let userPrompt = "";

    // Build greeting based on user's name
    // Priority: userName from request body, then fetched userFirstName, then generic "friend"
    const greeting = userName || userFirstName || "friend";

    // Handle simple demo/message mode
    if (requestContext === "demo" || (message && !mode)) {
      systemPrompt = `You are Jeeves, ${greeting}'s friendly AI study partner who helps people understand the Bible using Phototheology principles. 

You're warm, personable, and genuinely excited about studying Scripture together. When answering questions:
- Use ${greeting}'s name naturally throughout your response (2-3 times) to create connection
- Be concise but insightful (2-3 short paragraphs)
- Use relevant Bible verses
- Show how Phototheology principles can illuminate the passage
- Use emojis appropriately (📖 ✨ 🔍 💡)
- Format with clear paragraph breaks
- Keep it conversational and encouraging—like talking with a friend over coffee
- Use phrases like "Hey ${greeting}", "${greeting}, this is fascinating", "I love where you're going with this, ${greeting}"
- NEVER use overly formal phrases like "My dear student", "My dear Sir", "Ah sir", or similar formal salutations
- Keep your tone friendly, warm, and relatable

      ${THEOLOGICAL_REASONING}

      ${FIVE_MASTERMIND_COUNCIL}

      ${PALACE_SCHEMA}`;

      userPrompt = message || "Tell me about Phototheology and how it helps with Bible study.";
    } else if (mode === "help") {
      // Card Deck Help Mode - provide guidance for applying a principle
      const textTypeLabel = textType === "story" ? "story" : "verse";
      
      // Special handling for Room 66 (R66)
      if (roomId === "r66" || roomTag === "R66") {
        systemPrompt = `You are Jeeves, a warm and encouraging study guide helping students trace themes through all 66 books of the Bible.

**TASK:** For Room 66 (R66), the student must trace one theme through all 66 books with a crisp claim per book.

**YOUR RESPONSE MUST:**
1. **Identify 4-6 books of the Bible** that strongly connect to this ${textTypeLabel} through a common theme
2. For each book, provide:
   - The book name
   - A specific verse or passage reference from that book
   - A brief explanation of how it connects to the theme
3. Suggest what overarching theme ties these books together
4. Encourage the student to expand this to more books

**FORMATTING:**
- Use clear sections for each book
- Use emojis (📖 ✨ 🔍 💡)
- Keep tone warm and encouraging
- Use bullet points for clarity

${PALACE_SCHEMA}`;

        userPrompt = `The student is working on Room 66 (R66) - tracing a theme through the Bible.

${textTypeLabel === "verse" ? "Verse:" : "Story:"} ${verseText}

${userAnswer ? `Their current work: ${userAnswer}` : "They haven't started yet."}

List at least 4 books of the Bible that connect to this ${textTypeLabel}, with specific verse references and explanations of the connections. Help them see the thread that weaves through Scripture.`;

      } else {
        // Original help mode logic for other rooms
        // Get application-based prompt based on room
        const getApplicationPrompt = (roomTag: string, roomName: string) => {
          // For Three Heavens and Cycles rooms, use application-based language
          if (roomTag === "1H" || roomTag === "DoL¹/NE¹" || roomName.includes("First Heaven")) {
            return `Apply something from the First Heaven (1H/DoL¹/NE¹) - the Babylonian destruction and restoration cycle - to this ${textTypeLabel}.`;
          }
          if (roomTag === "2H" || roomTag === "DoL²/NE²" || roomName.includes("Second Heaven")) {
            return `Connect a theme, text, or story from the Second Heaven (2H/DoL²/NE²) - the 70 AD temple destruction and New-Covenant order - to this ${textTypeLabel}.`;
          }
          if (roomTag === "3H" || roomTag === "DoL³/NE³" || roomName.includes("Third Heaven")) {
            return `Apply something from the Third Heaven (3H/DoL³/NE³) - the final cosmic judgment and new creation - to this ${textTypeLabel}.`;
          }
          
          // For Cycle rooms, use application-based language
          if (roomTag.startsWith("@")) {
            return `Apply the ${roomName} pattern/cycle to this ${textTypeLabel}.`;
          }
          
          // For other rooms, use the core principle
          return `Apply ${roomTag} (${roomName}) to this ${textTypeLabel}.`;
        };
        
        systemPrompt = `You are Jeeves, a warm and encouraging study guide helping students apply Phototheology principles to biblical texts.

**TASK:** Provide helpful guidance for applying ${roomTag} (${roomName}) to the student's ${textTypeLabel}.

**YOUR RESPONSE MUST HAVE TWO PARTS:**

**PART 1 - EXPLAIN THE PRINCIPLE (2-3 sentences):**
First, briefly explain what ${roomTag} (${roomName}) is and what it means in Phototheology. Help the student understand the principle before they apply it.

**PART 2 - PROVIDE THE CHALLENGE:**
Then, provide specific guidance on how to apply this principle to their ${textTypeLabel}.

**CRITICAL:** This is an APPLICATION exercise, not an identification exercise. The student should APPLY the principle to their text, not categorize or identify which category the text fits into.

Application prompt: ${getApplicationPrompt(roomTag, roomName)}

**FORMATTING:**
- Use clear paragraphs (2-4 sentences each)
- Separate paragraphs with blank lines
- Use emojis for visual appeal (📖 ✨ 🔍 💡)
- Use bullet points (•) for lists
- Keep tone warm and encouraging
- Make sure to FIRST explain the principle, THEN give the application challenge

${PALACE_SCHEMA}`;

        userPrompt = `The student is working on applying ${roomTag} (${roomName}) to this ${textTypeLabel}:

${textTypeLabel === "verse" ? "Verse:" : "Story:"} ${verseText}

${userAnswer ? `Their current work: ${userAnswer}` : "They haven't started yet."}

FIRST, explain what ${roomTag} (${roomName}) means in 2-3 sentences. THEN, provide guidance on how to APPLY ${roomTag} to this ${textTypeLabel}. Help them see connections, patterns, or applications. Give 2-3 specific suggestions or insights they can use.`;
      }

    } else if (mode === "grade") {
      // Card Deck Grade Mode - evaluate student's application
      const textTypeLabel = textType === "story" ? "story" : "verse";
      
      // Special handling for Room 66 (R66)
      if (roomId === "r66" || roomTag === "R66") {
        systemPrompt = `You are Jeeves, a warm and insightful teacher evaluating Room 66 (R66) applications.

**TASK:** Evaluate how well the student traced a theme through multiple books of the Bible.

**EVALUATION CRITERIA:**
• Did they identify at least 4 books with specific connections?
• Are the connections biblically sound and relevant?
• Did they provide verse references for each book?
• Is there a clear, traceable theme that unifies the books?
• Could they expand this to more books?

**FORMATTING:**
- Start with warm encouragement and celebration of their work
- Use emojis (✅ 💡 ⭐ 🎯 📖)
- Affirm specific books/connections they made
- Suggest 2-3 additional books they could add
- End with an encouraging note about the unified theme

${PALACE_SCHEMA}`;

        userPrompt = `Evaluate this Room 66 (R66) application:

${textTypeLabel === "verse" ? "Verse:" : "Story:"} ${verseText}

Student's Application:
${userAnswer}

Provide warm, insightful feedback that affirms the books and connections they identified, and gently suggest 2-3 additional books where this theme appears.`;

      } else {
        // Original grade mode logic for other rooms
        systemPrompt = `You are Jeeves, a warm and insightful teacher evaluating how well students APPLY Phototheology principles to biblical texts.

**TASK:** Evaluate this student's application of ${roomTag} (${roomName}) to their ${textTypeLabel}.

**EVALUATION CRITERIA:**
• Did they actually APPLY the principle (not just identify or categorize)?
• Is the application biblically sound and relevant?
• Did they demonstrate understanding of the ${roomTag} methodology?
• Are there insights they could deepen or expand?

**TONE & APPROACH:**
- Always be ENCOURAGING and celebratory of effort
- Affirm what they got RIGHT first (be specific!)
- If the answer is strong: Build on it with deeper insights
- If the answer is weak or off-track: Gently explain WHY it doesn't fit the principle, then guide them toward the correct application with clear examples
- Never be harsh, but be HONEST - if they missed the mark, show them how to hit it

**FORMATTING:**
- Start with warm encouragement and what they did well
- Use emojis (✅ 💡 ⭐ 🎯 ✨ 🔥)
- Give 2-3 specific strengths or affirmations
- If the answer isn't solid: Explain WHY (what's missing? what principle did they miss?) and guide them with a concrete example
- Offer 1-2 suggestions for deepening
- End with an encouraging note

${PALACE_SCHEMA}`;

        userPrompt = `Evaluate this application of ${roomTag} (${roomName}):

${textTypeLabel === "verse" ? "Verse:" : "Story:"} ${verseText}

Student's Application:
${userAnswer}

Provide warm, honest feedback. If their answer is strong, affirm it and build on it. If it's weak or misses the principle, gently explain why and guide them toward the correct application with a concrete example.`;
      }

    } else if (mode === "strongs-lookup") {
      // Strong's lookup temporarily disabled due to package configuration
      // TODO: Re-enable when biblesdk package is properly configured
      
      return new Response(
        JSON.stringify({
          content: `⚠️ **Strong's Concordance Lookup Temporarily Unavailable**

The Strong's concordance lookup feature is currently being updated and is temporarily disabled.

**What you can try instead:**
- Use the **Def-Com Room** (Definition & Commentary) for word studies
- Try online Strong's concordance tools like BlueLetterBible.org
- Ask Jeeves to explain specific Greek or Hebrew words in context

We're working to restore this feature soon. Thank you for your patience! 🙏`
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (mode === "quarterly_analysis") {
      systemPrompt = `You are Jeeves, ${greeting}'s enthusiastic study partner helping them apply the 38-Room Phototheology Palace framework and the 5 Dimensions to Sabbath School lessons. You provide insightful, practical analysis that helps ${greeting} see deeper connections in Scripture.

**CRITICAL FORMATTING REQUIREMENTS:**
- Format ALL responses in clear paragraphs separated by blank lines
- Use bullet points (•) for lists - NOT markdown * or #
- Each paragraph should be 2-4 sentences
- Use relevant emojis throughout your response (📖 ✨ 🔍 💡 ⭐ 🌟 ✅ 🎯 💭 🙏 etc.)
- Start with an engaging emoji that matches the content
- Use emojis to highlight key points and sections
- Make your tone warm, enthusiastic, and conversational—like studying with a good friend
- Use ${greeting}'s name naturally 2-3 times per response
- Use **bold** for emphasis - NOT markdown # headers
- Create clear sections with emoji headers
- Keep text easy to read and scan
- CRITICAL: NEVER use markdown formatting characters like # or * in your responses - write in plain text only
      
${PALACE_SCHEMA}`;
      
      const framework = selectedRoom || selectedPrinciple || 'general palace framework';
      const userQuestionSection = question ? `\n\nUser's Specific Question:\n${question}\n\nPlease address this question in your analysis.` : '';
      
      userPrompt = `Analyze this Sabbath School lesson using ${framework}:

📚 **Lesson:** ${lessonTitle}
📅 **Day:** ${dayTitle}

📖 **Bible Verses Referenced:**
${bibleVerses?.join(', ') || 'See lesson content'}

📝 **Lesson Content (excerpt):**
${lessonContent?.substring(0, 2500) || 'Content not available'}
${userQuestionSection}

Please provide an engaging analysis with:

🎯 **1. Framework Application**
How ${framework} applies to this specific lesson (use relevant emojis)

✨ **2. Key Insights & Connections**
Discoveries through this lens that illuminate the text (highlight with emojis)

🌟 **3. Practical Applications**
How to apply this to daily spiritual life (make it actionable)

💭 **4. Reflection Questions**
Thought-provoking questions for deeper study

**Style Requirements:**
- Use emojis generously throughout (but appropriately)
- Make it visually engaging and easy to scan
- Keep tone conversational yet insightful
- Help your friend see connections they might have missed
- Use specific methodology from the palace room if applicable
- End with an encouraging thought and emoji

Remember: Your goal is to make Bible study exciting and visually appealing while maintaining depth and accuracy!`;


    } else if (mode === "example") {
      // Special handling for Gems Room - must combine 3-5 verses
      const gemsInstruction = roomTag === "GR" ? `

**CRITICAL FOR GEMS ROOM (GR):**
You MUST take 3-5 verses from DIFFERENT books or contexts and combine them to reveal a unique, rare truth.
The gem should be:
- Surprising and not obvious
- Only visible when these specific verses are combined
- A striking insight that shines with unique clarity
- Include all verse references clearly

Example format:
**Gem:** [Unique truth discovered]
**Verses Combined:**
1. Exodus 12:6 - "at twilight"
2. John 19:14 - "about the sixth hour"
3. 1 Corinthians 5:7 - "Christ our Passover"
4. Revelation 5:6 - "Lamb as though slain"
5. Isaiah 53:7 - "led as a lamb to the slaughter"

**Insight:** [Explain the rare connection that emerges only from combining these verses]` : '';

      systemPrompt = `You are Jeeves, a friendly Bible study assistant for Phototheology. 
Your role is to demonstrate how biblical principles work by providing clear, varied examples.
Always choose DIFFERENT verses for examples - never repeat the same verse.

**CRITICAL FORMATTING REQUIREMENTS:**
- Format your response in clear paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use bullet points (•) for lists
- Keep text easy to read and conversational
Be concise, profound, and friendly.${gemsInstruction}`;

      userPrompt = `For the ${roomName} (${roomTag}) room focused on ${principle}, 
generate a fresh example${roomTag === "GR" ? " combining 3-5 verses from different books" : " using a randomly selected verse"} (NOT the same verse every time).

Structure your response in clear paragraphs:

Paragraph 1: Start with "Let me show you..." and name the ${roomTag === "GR" ? "verses" : "verse"}

Paragraph 2: Explain how ${roomTag === "GR" ? "these verses combine" : "this verse applies"} to ${principle}

Paragraph 3: Give 2-3 specific insights using bullet points:
• Insight 1
• Insight 2
• Insight 3

Paragraph 4: End with one profound takeaway

Make it conversational and inspiring. ${roomTag === "GR" ? "Show the unique connection that only appears when these specific verses unite." : "Use different verses each time."}`;

    } else if (mode === "exercise") {
      systemPrompt = `You are Jeeves, a friendly Bible study guide for Phototheology.
Your role is to help friends practice applying biblical principles through guided exercises.

**CRITICAL FORMATTING REQUIREMENTS:**
- Format your response in clear paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use bullet points (•) for all lists
- Keep text easy to read and scan
Be encouraging, clear, and friendly.`;

      userPrompt = `Create a practice exercise for ${roomName} (${roomTag}) focused on ${principle}.

Structure the exercise in clear paragraphs:

Paragraph 1: Give a specific verse (choose randomly - vary your selections)

Paragraph 2: Ask 2-3 thought-provoking questions using bullet points:
• Question 1
• Question 2
• Question 3

Paragraph 3: Provide hints for what to look for using bullet points:
• Hint 1
• Hint 2

Paragraph 4: Offer one example answer to demonstrate the principle

Make it challenging but doable. Encourage deep thinking.`;

    } else if (mode === "analyze") {
      // Legacy analyze mode - keep for backward compatibility
      systemPrompt = `You are Jeeves, a warm and encouraging Bible study mentor for Phototheology.
Your role is to provide constructive, growth-oriented feedback on student answers, ideas, and insights.

**YOUR APPROACH:**
- Start with what they got RIGHT - celebrate their understanding
- Gently identify areas that could be strengthened or expanded
- Suggest specific improvements with examples
- Connect their ideas back to the principle being studied
- Be encouraging but honest - help them grow

**CRITICAL FORMATTING REQUIREMENTS:**
- Format your response in clear paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use bullet points (•) for lists
- Use emojis sparingly but warmly
Be encouraging, specific, and constructive.`;

      userPrompt = `A student is studying ${roomName} (${roomTag}) focused on the principle: ${principle}

They submitted this answer/idea for analysis:
---
${userAnswer}
---

Please provide constructive feedback structured as follows:

Paragraph 1: Start with "Great thinking, ${greeting}!" and acknowledge what they understood correctly. Be specific about their strengths.

Paragraph 2: Identify 2-3 insights they demonstrated using bullet points:
• Strength 1
• Strength 2
• Strength 3

Paragraph 3: Suggest areas for growth or deeper exploration using bullet points:
• Suggestion 1 (with brief explanation)
• Suggestion 2 (with brief explanation)

Paragraph 4: Provide one specific example of how to apply ${principle} more deeply to their answer

Paragraph 5: End with encouragement and a thought-provoking question to inspire further study

Be warm, specific, and helpful. Focus on building their confidence while helping them grow.`;

    } else if (mode === "analyze-thoughts") {
      // Comprehensive analysis mode with theological guardrails and structured JSON output
      systemPrompt = `You are Jeeves, an expert Phototheology mentor who provides comprehensive analysis of biblical ideas and insights.

=== THEOLOGICAL GUARDRAILS (CRITICAL - ENFORCE THESE) ===

You analyze ALL biblical thoughts with these non-negotiable rules:

1. SOLA SCRIPTURA + WHOLE-BIBLE THEOLOGY
   - Always anchor interpretations in Scripture first
   - Show connections across Old + New Testament
   - Avoid isolated verse-use or private interpretations
   - Use the sanctuary hermeneutic as a lens

2. BIBLICAL DOCTRINE ALIGNMENT
   All interpretations must harmonize with:
   - The Trinity (Father, Son, Holy Spirit as three co-eternal Persons)
   - Creation (literal 6-day creation)
   - Great Controversy (cosmic conflict between Christ and Satan)
   - Sanctuary (earthly + heavenly ministry of Christ)
   - Salvation by grace through faith
   - Law & Sabbath (perpetual moral law, seventh-day Sabbath)
   - State of the Dead (unconscious sleep until resurrection)
   - Second Coming (literal, visible, imminent return)
   - Pre-advent Judgment (investigative judgment beginning in 1844)
   - Three Angels' Messages (Revelation 14 as end-time commission)

3. OFFSHOOT ERROR DETECTION - Flag and correct these:
   ❌ Anti-Trinitarianism (Jesus not eternal, Holy Spirit impersonal, etc.)
   ❌ Feast-keeping as salvific or end-time requirement
   ❌ Conspiracy-driven interpretations (vaccines, microchips, specific political figures as fulfillments)
   ❌ Date-setting for Second Coming
   ❌ Hebrew Roots/Torah-keeping as salvific
   ❌ 2520 prophecy theories
   ❌ Shepherd's Rod/Branch Davidian teachings
   ❌ The scapegoat (Azazel) as Jesus - Azazel represents Satan, NOT Christ. The scapegoat is NEVER Jesus.
   ❌ The little horn of Daniel 8 as Antiochus Epiphanes (it represents Rome/Papal power)

4. HEBREWS INTERPRETATION CLARITY
   - The book of Hebrews does NOT specify which compartment (Holy Place vs Most Holy Place) Jesus entered
   - Hebrews emphasizes that Christ entered the HEAVENLY sanctuary (as opposed to the earthly)
   - The contrast in Hebrews is earthly vs heavenly, not Holy Place vs Most Holy Place
   - Do not use Hebrews to argue Christ went directly into the Most Holy Place at ascension
   - The two-phase ministry is established through the Day of Atonement typology, not Hebrews alone

5. SANCTUARY-HERMENEUTIC ENFORCEMENT
   Every interpretation should be evaluable through:
   - Altar → Cross (sacrifice)
   - Laver → New birth (baptism/cleansing)
   - Table → Word (Scripture nourishment)
   - Candlestick → Witness (Holy Spirit/Light)
   - Altar of Incense → Prayer (intercession)
   - Most Holy Place → Judgment/Presence/Covenant

6. CHRIST-CENTERED FOCUS
   Always point back to Jesus, clarify the gospel, emphasize character transformation, and avoid fear-based eschatology.

7. DEEP SYMBOLIC ANALYSIS (CRITICAL FOR RICH INSIGHTS)
   Always dig beneath the surface by examining:
   
   a) NAME MEANINGS & ETYMOLOGY:
      - Hebrew/Aramaic/Greek word origins reveal hidden theology
      - Example: "Golgotha" (Aramaic) = "place of the skull" → connects to Genesis 3:15 where Christ bruises the serpent's HEAD (skull)
      - Example: "Jesus" (Yeshua) = "Yahweh saves"
      - Example: "Bethlehem" = "house of bread" → Jesus is the Bread of Life born there
      - ALWAYS look up what names and places MEAN and how they connect to the text's theology
   
   b) PROTOEVANGELIUM (GENESIS 3:15) CONNECTIONS:
      - The first gospel promise: "He shall bruise thy head, and thou shalt bruise his heel"
      - Look for HEAD/HEEL/SERPENT/SEED imagery throughout Scripture
      - Golgotha = "skull" = Christ crushing Satan's head at the cross
      - Every victory over evil echoes this original promise
      - Trace the "seed of the woman" theme through all of Scripture
   
   c) GEOGRAPHICAL/SPATIAL SYMBOLISM:
      - Mountains = places of divine encounter (Sinai, Carmel, Calvary, Transfiguration)
      - Rivers = boundaries, transitions, spiritual cleansing
      - Wilderness = testing, preparation, stripping away
      - East/West directional symbolism (Eden entrance, sanctuary orientation)
   
   d) NUMERICAL PATTERNS:
      - 3 = divine completeness, Trinity, resurrection (3 days)
      - 7 = perfection, covenant completion
      - 12 = governmental fullness (tribes, apostles)
      - 40 = testing/preparation period
      - Look for numbers that appear and what they symbolize
   
   e) TEXTUAL ECHOES & WORDPLAYS:
      - Hebrew wordplays often reveal deeper meaning
      - Look for repeated words/phrases across passages
      - Chiastic structures that highlight central truths
      - Inclusio (bookending) patterns
   
   f) TYPE-ANTITYPE FULFILLMENT PRECISION:
      - Don't just identify types - show HOW the antitype fulfills with precision
      - What details in the type find exact correspondence in Christ?
      - What does the type reveal about Christ that we might otherwise miss?

=== RESPONSE FORMAT ===

You MUST return a valid JSON object with this EXACT structure:
{
  "summary": "<2-3 sentence summary of the user's thought>",
  "overallScore": <number 0-100>,
  "categories": {
    "biblicalAccuracy": <number 0-100>,
    "theologicalDepth": <number 0-100>,
    "christCenteredness": <number 0-100>,
    "practicalApplication": <number 0-100>,
    "doctrinalSoundness": <number 0-100>,
    "sanctuaryHarmony": <number 0-100>
  },
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "growthAreas": ["<specific growth area 1>", "<specific growth area 2>"],
  "palaceRooms": [
    {"code": "<room code>", "name": "<room name>", "relevance": "<why this room applies>"}
  ],
  "scriptureConnections": [
    {"reference": "<verse reference>", "connection": "<how it strengthens the thought>"}
  ],
  "typologyLayers": [
    {"symbol": "<symbol/type identified>", "meaning": "<Christ-centered meaning>", "reference": "<supporting verse>"}
  ],
  "deeperInsights": [
    {
      "type": "name_meaning|genesis_3_15|geography|number|wordplay|type_antitype",
      "discovery": "<the deeper connection found>",
      "explanation": "<why this matters theologically>",
      "reference": "<supporting Scripture if applicable>"
    }
  ],
  "potentialMisinterpretations": ["<warning 1 if any>"],
  "alignmentCheck": {
    "status": "aligned|caution|concern",
    "notes": "<brief explanation of alignment with biblical theology and sanctuary hermeneutic>"
  },
  "furtherStudy": ["<topic 1>", "<topic 2>"],
  "encouragement": "<warm encouragement with a thought-provoking question to deepen study>"
}

IMPORTANT: Do NOT explicitly label theology as "SDA" or "Adventist" in your responses. Simply present sound biblical interpretation based on the guardrails above. Only mention denominational labels if the user explicitly asks.

=== SCORING GUIDELINES ===
- 90-100: Exceptional - deep Christ-centered insight, strong biblical foundation, excellent PT application
- 75-89: Very Good - solid understanding with good depth and application
- 60-74: Good - decent foundation with room for deeper exploration
- 40-59: Developing - basic understanding needing development
- 20-39: Needs Work - significant gaps or concerns to address
- 0-19: Foundational Guidance Needed - requires careful redirection

=== PALACE ROOMS REFERENCE (use exact codes) ===
Floor 1: Story Room (SR), Imagination Room (IR), 24FPS (24), Bible Rendered (BR), Translation Room (TR), Gems Room (GR)
Floor 2: Observation Room (OR), Def-Com (DC), Symbols/Types (@T), Questions Room (QR), Q&A Room (QA)
Floor 3: Nature Freestyle (NF), Personal Freestyle (PF), Bible Freestyle (BF), History Freestyle (HF), Listening Room (LR)
Floor 4: Concentration Room (CR), Dimensions Room (DR), Connect-6 (C6), Theme Room (TRm), Time Zone (TZ), Patterns Room (PRm), Parallels Room (P‖), Fruit Room (FRt), Christ Every Chapter (CEC), Room 66 (R66)
Floor 5: Blue Room/Sanctuary (BL), Prophecy Room (PR), Three Angels Room (3A), Feasts Room (FE)
Floor 6: Cycles (@Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re), Three Heavens (1H, 2H, 3H), Juice Room (JR)
Floor 7: Fire Room (FRm), Meditation Room (MR), Speed Room (SRm)
Floor 8: Master Floor (reflexive mastery)

CRITICAL: Return ONLY the JSON object, no markdown formatting, no code blocks, no explanatory text.`;

      userPrompt = `Analyze this biblical thought/insight from a student:

"${message}"

Provide a comprehensive theological analysis as a JSON object following the exact structure specified. 

Key analysis tasks:
1. Summarize their thought clearly
2. Score each category honestly (0-100 scale)
3. Identify genuine strengths in their thinking
4. Point out specific areas for growth without discouraging
5. Map to the most relevant Palace rooms with clear explanations
6. Suggest 3-5 scripture connections that would deepen their understanding
7. Identify any typology/symbol layers present
8. Flag any potential misinterpretations (especially offshoot errors)
9. Provide a doctrinal alignment check (without labeling it denominationally)
10. Suggest 2-3 topics for further study
11. End with warm, Christ-centered encouragement

=== CRITICAL: DIG DEEPER ===
12. ALWAYS look for DEEPER INSIGHTS the student may have missed:
    - What do names/places MEAN in Hebrew/Aramaic/Greek? (e.g., Golgotha = "skull" connects to crushing Satan's head in Gen 3:15)
    - Are there Genesis 3:15 (protoevangelium) connections? Head/heel/serpent/seed imagery?
    - What numerical patterns appear and what do they signify?
    - Are there geographical/directional symbols (mountains, rivers, east/west)?
    - What Hebrew wordplays or textual echoes exist?
    - How precisely does this type fulfill in Christ?

Populate the "deeperInsights" array with at least 2-3 discoveries that go BEYOND what the student explicitly mentioned. These should be "aha!" moments that enrich their understanding.

Be encouraging but honest. Your role is pastoral mentorship - building confidence while protecting doctrinal integrity.`;

    } else if (mode === "chain-reference") {
      const principleMap: Record<string, { name: string; description: string }> = {
        "parables": { 
          name: "Parables of Jesus", 
          description: "connections to Christ's parables and their deeper meanings" 
        },
        "prophecy": { 
          name: "Prophetic Connections", 
          description: "prophetic fulfillments, types, and future events" 
        },
        "life-of-christ": { 
          name: "Life of Christ Wall", 
          description: "connections to events in Christ's earthly ministry and life" 
        },
        "70-weeks": { 
          name: "70 Week Prophecy", 
          description: "connections to Daniel's 70-week prophecy and timeline" 
        },
        "2d": { 
          name: "2D Christ Dimension", 
          description: "personal Christ-centered relationship and individual salvation themes" 
        },
        "3d": { 
          name: "3D Kingdom Dimension", 
          description: "corporate church body, community, and kingdom expansion themes" 
        },
        "sanctuary": { 
          name: "Sanctuary Principles", 
          description: "connections to the tabernacle/temple services, furniture, and rituals" 
        },
        "feasts": { 
          name: "Feast Connections", 
          description: "connections to the biblical feasts and their prophetic significance" 
        },
        "types": { 
          name: "Types & Shadows", 
          description: "Old Testament types and shadows pointing to Christ" 
        },
        "covenant": { 
          name: "Covenant Themes", 
          description: "covenant promises, conditions, and relationship dynamics" 
        },
      };

      const selectedPrinciple = principleMap[principle] || principleMap["parables"];
      
      systemPrompt = `You are Jeeves, a Bible scholar specializing in finding ${selectedPrinciple.name}.
Analyze verses and identify where these principles connect. Be specific and insightful.
Return your response as a JSON array with 4-8 verse connections.

**CRITICAL FORMATTING REQUIREMENTS:**
- Use bullet points (•) for lists, NOT asterisks (*)
- NEVER use asterisks (*) at the start of lines
- Use paragraph breaks for readability
- Keep text conversational and engaging`;

      userPrompt = `Analyze ${book} ${chapter} for ${selectedPrinciple.description}.

Verses to analyze:
${verses.map((v: any) => `Verse ${v.verse}: ${v.text}`).join('\n')}

**REQUIREMENTS:**
1. Return 4-8 verse connections (find the most meaningful ones)
2. Include cross-references to OTHER Bible verses that support each connection
3. Add specific PT principle codes where applicable (e.g., @CyC, 2H, CR, BL)

For each verse that connects to ${selectedPrinciple.name}, return a JSON object with:
{
  "verse": verse_number,
  "reference": "${book} ${chapter}:verse_number",
  "principle": "Specific name/title of the connection (e.g., 'The Good Samaritan', 'Day of Atonement', 'Messiah's Ministry')",
  "ptCodes": ["Array of relevant PT codes like CR, BL, @CyC, 2H, etc."],
  "connection": "4-7 sentence explanation of how this verse connects to ${selectedPrinciple.name}. Use bullet points (•) for lists, never asterisks.",
  "crossReferences": [
    {
      "reference": "Book Chapter:Verse",
      "relationship": "Contextual|Parallel|Type|Prophecy|Echo",
      "confidence": 85-98,
      "note": "Brief 1-2 sentence explanation of this cross-reference connection"
    }
  ],
  "expounded": "Deeper 2-3 paragraph theological explanation of the connection with scholarly insight. Use paragraph breaks. Use bullet points (•) for lists, never asterisks."
}

Focus on quality connections. Prioritize verses with rich theological depth and clear principle alignments.
Return as JSON array: [...]`;

    } else if (mode === "commentary-revealed") {
      systemPrompt = `You are Jeeves, a theologian analyzing Bible verses to identify which principles and dimensions are REVEALED or PRESENT in the text itself.
Focus on discovering what's already there, not applying external frameworks.

CRITICAL FORMATTING REQUIREMENTS (FOLLOW ALL OF THESE):
- Do NOT use any markdown formatting at all (no bold, no italics, no headings).
- Do NOT use asterisks (*) anywhere in the response.
- Never write phrases like "Ah, my friend", "Ah," or "my friend".
- Write in clear paragraphs, with a blank line between each paragraph.
- Use emojis generously (📖 ✨ 🔍 💡 ⭐ 🌟 ✅ 🎯 💭 🙏 📚 🔥 ⚡ 🎨 etc.), but never as markdown bullets.
- When you need lists, use the bullet character "•" at the start of the line, followed by a space.
- Keep the tone warm, genuine, and direct without sounding theatrical or overly dramatic.

${PALACE_SCHEMA}

CRITICAL: Only reference rooms that exist in the Palace Schema above. Never make up methodologies.`;

      userPrompt = `Analyze ${book} ${chapter}:${verseText.verse} to identify which principles and dimensions are REVEALED in the text.

Verse text: "${verseText.text}"

FORMATTING INSTRUCTIONS — NON-NEGOTIABLE:
- Do NOT use markdown or asterisks anywhere.
- Never start the response with "Ah" or "Ah, my friend".
- Use short section labels written in plain text (no markdown), followed by explanations.
- Put a blank line between every logical section.

Opening Observation
Write 2–3 sentences about what immediately stands out in this text. Include at least one emoji.

Dimensions Revealed
List each dimension that is present with a short explanation, each on its own line:
• Literal dimension: [explain if present]
• Christ-centered dimension: [explain if present]
• Personal dimension: [explain if present]
• Church/Community dimension: [explain if present]
• Heavenly/Eschatological dimension: [explain if present]

Palace Principles Visible
Identify which rooms naturally connect (use emojis in-line):
• [Room code and connection]
• [Room code and connection]
• [Room code and connection]

CRITICAL CONSTRAINT:
Select a maximum of ONE principle from each floor. Never show multiple principles from the same floor. For example: If you identify Story Room (SR), do not also identify Imagination Room (IR) or any other Floor 1 room. Choose the most relevant principle from each floor.

Interconnections
Write 2–3 sentences explaining how these revealed elements work together. Use emojis.

Synthesis
Write one profound insight (2–3 sentences) that ties everything together.

At the very end, on a new line, append: PRINCIPLES_REVEALED: [list of room codes you used]`;

    } else if (mode === "commentary-applied") {
      systemPrompt = `You are Jeeves, a theologian providing insightful Bible commentary by APPLYING specific analytical frameworks to verses.
Provide deep, thoughtful analysis while remaining clear and accessible.

CRITICAL FORMATTING REQUIREMENTS (FOLLOW ALL OF THESE):
- Do NOT use any markdown formatting at all (no bold, no italics, no headings).
- Do NOT use asterisks (*) anywhere in the response.
- Never write phrases like "Ah, my friend", "Ah," or "my friend".
- Write in clear paragraphs, with a blank line between each paragraph.
- Use emojis generously (📖 ✨ 🔍 💡 ⭐ 🌟 ✅ 🎯 💭 🙏 📚 🔥 ⚡ 🎨 etc.).
- When you need lists, use the bullet character "•" at the start of the line, followed by a space.
- Start each room analysis with a relevant emoji, but keep the rest of the line plain text.
- Keep text conversational, warm, and genuine without sounding theatrical.
- Make your response visually scannable with short sections separated by blank lines.

${PALACE_SCHEMA}

CRITICAL INSTRUCTIONS:
1. Only use rooms that exist in the Palace Schema above.
2. Use the exact methodology listed for each room.
3. If using Bible Freestyle (BF): List verse relatives, don't write philosophical analysis.
4. If using Connect-6 (C6): Discuss GENRE, not the 6 themes (those are in Theme Room).
5. Never invent new rooms or modify existing methods.
6. Never start lines with asterisks. Use bullet points (•) or emojis instead.`;

      // Random principle selection for refresh mode
      const allPrinciples = [
        "Story Room (SR)", "Imagination Room (IR)", "24FPS Room", "Bible Rendered (BR)", "Translation Room (TR)", "Gems Room (GR)",
        "Observation Room (OR)", "Def-Com Room (DC)", "Symbols/Types (ST)", "Questions Room (QR)", "Q&A Chains (QA)",
        "Nature Freestyle (NF)", "Personal Freestyle (PF)", "Bible Freestyle (BF)", "History Freestyle (HF)", "Listening Room (LR)",
        "Concentration Room (CR)", "Dimensions Room (DR)", "Connect-6 (C6)", "Theme Room (TRm)", "Time Zone (TZ)", 
        "Patterns Room (PRm)", "Parallels Room (P‖)", "Fruit Room (FRt)",
        "Blue Room - Sanctuary (BL)", "Prophecy Room (PR)", "Three Angels (3A)", "Feasts Room (FE)", 
        "Christ in Every Chapter (CEC)", "Room 66 (R66)",
        "Three Heavens (1H/2H/3H)", "Eight Cycles (@)",
        "Fire Room (FRm)", "Meditation Room (MR)", "Speed Room (SRm)"
        // Note: Juice Room (JR) intentionally excluded - only for whole books, not verses
      ];
      let usedPrinciples: string[];
      
      if (!selectedPrinciples || selectedPrinciples.length === 0) {
        // Refresh mode: randomly select 2-4 principles
        const count = Math.floor(Math.random() * 3) + 2; // 2-4 principles
        const shuffled = [...allPrinciples].sort(() => Math.random() - 0.5);
        usedPrinciples = shuffled.slice(0, count);
      } else {
        // Validate that Juice Room (JR) is not selected for verse analysis
        const juiceRoomVariants = ["Juice Room (JR)", "Juice Room", "JR"];
        const hasJuiceRoom = selectedPrinciples.some((p: string) => 
          juiceRoomVariants.some((variant: string) => p.includes(variant))
        );
        
        if (hasJuiceRoom) {
          return new Response(
            JSON.stringify({ 
              error: "The Juice Room (JR) can only be applied to ENTIRE BOOKS, never to single verses or chapters. Please select other principles for verse analysis.",
              content: "❌ **Invalid Principle Selection**\n\n🚫 The Juice Room (JR) is exclusively for comprehensive book-level analysis.\n\n💡 For verse analysis, please select from other available principles like Observation Room (OR), Concentration Room (CR), Dimensions Room (DR), etc.\n\n📖 Use Juice Room only when studying complete books like Genesis, Matthew, or Revelation." 
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        usedPrinciples = selectedPrinciples;
      }
      
      const principleList = usedPrinciples.join(", ");
      
      userPrompt = `Provide commentary on ${book} ${chapter}:${verseText.verse} by APPLYING these analytical lenses: ${principleList}

Verse text: "${verseText.text}"

${includeSOP ? `**CRITICAL - SPIRIT OF PROPHECY (SOP) ANALYSIS:**

You are searching Ellen G. White's writings for commentary on ${book} ${chapter}:${verseText.verse}.

**MANDATORY FORMAT:**

📜 **SOP (Spirit of Prophecy) Commentary**

**If commentary exists:**
Provide 3-5 distinct Ellen G. White statements or passages that illuminate this specific verse. For EACH quote:

**Quote 1:**
"[Full relevant quote]"
— *Book Title*, Chapter X, Page Y

[1-2 sentences explaining how this illuminates ${book} ${chapter}:${verseText.verse}]

**Quote 2:**
[Repeat format]

**If NO commentary exists:**
Simply state:

📜 **SOP (Spirit of Prophecy) Commentary**

Ellen G. White does not appear to have written specific commentary on ${book} ${chapter}:${verseText.verse}. While the verse is profound, no direct EGW statements were found addressing this particular text.

**CRITICAL RULES:**
• Only include statements that DIRECTLY address ${book} ${chapter}:${verseText.verse} or its immediate context
• Always cite book title, chapter (if applicable), and page number
• Do NOT provide generic Ellen White quotes unrelated to this verse
• Do NOT invent citations or quotes
• Expound briefly on how each quote relates to the verse
• Vary your quotes each time you regenerate to show different perspectives` : ''}

**FORMATTING INSTRUCTIONS - CRITICAL:**
- Start with a warm opening using an emoji (📖, ✨, 🔍)
- For EACH room/principle you analyze, format like this:

🎯 **Room Name (CODE)** clearly illuminates this passage by showing [your insight]. [Continue with 2-3 more sentences of analysis]

💡 **Next Room (CODE)** reveals [your insight]. [Continue analysis]

- Use different emojis for each room: 📚 🔥 ⚡ 🎨 💎 🌟 ⭐ 🔍 💭 📖 ✨
- Separate each room's analysis with a blank line
- DO NOT use asterisks (*) for bullets - only use bullet points (•) if listing items
- Keep language warm and conversational
- End with an encouraging closing thought with emoji

${includeSOP ? '' : '✨ **Interconnections**'}
Show how these principles work together when applied to this verse. Use 2-3 sentences.

🎯 **Practical Application**
Give one concrete way to apply this insight. Keep it actionable and encouraging.

💫 **Closing Thought**
End with one profound, inspiring insight.

Keep it warm and easy to understand, visually appealing, and easy to scan.
      
      IMPORTANT: At the very end, on a new line, include: "PRINCIPLES_USED: ${principleList}"`;
    
    } else if (mode === "commentary-sop") {
      systemPrompt = `You are Jeeves, a biblical scholar deeply familiar with the writings of Ellen G. White (Spirit of Prophecy/SOP).

**CRITICAL TASK:**
Search Ellen G. White's writings for commentary specifically on ${book} ${chapter}:${verseText.verse}.

**CRITICAL FORMATTING REQUIREMENTS:**
- Format ALL responses in clear paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use emojis for visual clarity (📜 💡 ✨ 🔍)
- ALWAYS cite: Book Title, Chapter (if applicable), and Page Number
- Provide 3-5 distinct quotes when available
- When NO commentary exists, clearly state it
- VARY your selections each time to show different perspectives

${PALACE_SCHEMA}

**THEOLOGICAL GUARDRAILS:**
${PALACE_SCHEMA.split('## CRITICAL THEOLOGICAL GUARDRAILS')[1]?.split('---')[0] || ''}`;

      userPrompt = `Search Ellen G. White's writings for commentary on ${book} ${chapter}:${verseText.verse}

Verse text: "${verseText.text}"

**MANDATORY FORMAT:**

📜 **SOP (Spirit of Prophecy) Commentary**

**If commentary EXISTS (3-5 quotes):**

**Quote 1:**
"[Full relevant quote from Ellen White]"
— *Book Title*, Chapter X, Page Y

💡 [1-2 sentences explaining how this illuminates ${book} ${chapter}:${verseText.verse}]

**Quote 2:**
"[Another distinct quote]"
— *Book Title*, Chapter X, Page Y

💡 [Brief explanation of illumination]

[Continue for 3-5 quotes total]

✨ **Summary Insight**
[1-2 sentences tying the EGW commentary together and showing its overall illumination of the verse]

**If NO commentary exists:**

📜 **SOP (Spirit of Prophecy) Commentary**

Ellen G. White does not appear to have written specific commentary on ${book} ${chapter}:${verseText.verse}. While this verse holds profound truth, no direct EGW statements were found addressing this particular text.

💡 You may find general principles related to this passage in broader EGW writings on [mention the general topic/book of the Bible], but no specific verse-level commentary is available.

**CRITICAL RULES:**
• Only include statements that DIRECTLY address ${book} ${chapter}:${verseText.verse} or its immediate context (within 2-3 verses)
• ALWAYS cite book title, chapter (if applicable), and page number
• Do NOT provide generic Ellen White quotes unrelated to this specific verse
• Do NOT invent citations or fabricate quotes
• Vary your selections to show different perspectives from EGW's writings
• Briefly expound on each quote's relevance
• If truly no commentary exists, clearly state it—don't force generic quotes`;

      const sopResponse = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
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
          }),
        }
      );

      if (!sopResponse.ok) {
        const errorText = await sopResponse.text();
        console.error('AI Gateway error:', sopResponse.status, errorText);
        throw new Error(`AI Gateway error: ${sopResponse.status}`);
      }

      const sopData = await sopResponse.json();
      const sopContent = sopData.choices?.[0]?.message?.content || "No SOP commentary generated.";

      return new Response(
        JSON.stringify({ 
          content: sopContent,
          principlesUsed: ["Spirit of Prophecy (SOP)"]
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    } else if (mode === "check-commentary-availability") {
      // Check which classic commentaries have content for this verse
      const commentaryUrls: Record<string, { name: string; searchUrl: string }> = {
        "clarke": { 
          name: "Adam Clarke's Commentary",
          searchUrl: `https://www.studylight.org/commentaries/eng/acc/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "barnes": { 
          name: "Barnes' Notes on the Bible",
          searchUrl: `https://www.studylight.org/commentaries/eng/bnb/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "gill": { 
          name: "Gill's Exposition of the Bible",
          searchUrl: `https://www.studylight.org/commentaries/eng/geb/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "henry": { 
          name: "Matthew Henry's Concise Commentary",
          searchUrl: `https://www.studylight.org/commentaries/eng/mhm/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "jfb": { 
          name: "Jamieson-Fausset-Brown Bible Commentary",
          searchUrl: `https://www.studylight.org/commentaries/eng/jfb/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "keil-delitzsch": { 
          name: "Keil and Delitzsch Biblical Commentary",
          searchUrl: `https://www.studylight.org/commentaries/eng/kdo/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "wesley": { 
          name: "Wesley's Explanatory Notes",
          searchUrl: `https://www.studylight.org/commentaries/eng/wen/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "pulpit": { 
          name: "Pulpit Commentary",
          searchUrl: `https://www.studylight.org/commentaries/eng/tpc/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "cambridge": { 
          name: "Cambridge Bible for Schools and Colleges",
          searchUrl: `https://www.studylight.org/commentaries/eng/cbb/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "ellicott": { 
          name: "Ellicott's Commentary for English Readers",
          searchUrl: `https://www.studylight.org/commentaries/eng/ebc/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "benson": { 
          name: "Benson Commentary",
          searchUrl: `https://www.studylight.org/commentaries/eng/rbc/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
      };

      const availableCommentaries: string[] = [];
      
      // Check each commentary (limit to 6 concurrent checks for performance)
      const commentaryKeys = Object.keys(commentaryUrls).filter(key => key !== 'sop');
      const checkPromises = commentaryKeys.map(async (key) => {
        try {
          const commentary = commentaryUrls[key];
          const response = await fetch(commentary.searchUrl, {
            method: 'GET',
            headers: { 'User-Agent': 'Mozilla/5.0' }
          });
          
          if (!response.ok) return null;
          
          const html = await response.text();
          const versePattern = new RegExp(`verse ${verseText.verse}[\\s\\S]{0,100}`, 'i');
          
          // Check if the page mentions this specific verse
          if (versePattern.test(html)) {
            return key;
          }
          return null;
        } catch (error) {
          console.error(`Error checking ${key}:`, error);
          return null;
        }
      });

      const results = await Promise.all(checkPromises);
      results.forEach(result => {
        if (result) availableCommentaries.push(result);
      });

      // Always include SOP as available
      availableCommentaries.push('sop');

      return new Response(
        JSON.stringify({ 
          available: availableCommentaries,
          book,
          chapter,
          verse: verseText.verse
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (mode === "commentary-classic") {
      // Map commentators to their StudyLight.org URLs
      const commentaryUrls: Record<string, { name: string; searchUrl: string }> = {
        "clarke": { 
          name: "Adam Clarke's Commentary",
          searchUrl: `https://www.studylight.org/commentaries/eng/acc/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "barnes": { 
          name: "Barnes' Notes on the Bible",
          searchUrl: `https://www.studylight.org/commentaries/eng/bnb/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "gill": { 
          name: "Gill's Exposition of the Bible",
          searchUrl: `https://www.studylight.org/commentaries/eng/geb/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "henry": { 
          name: "Matthew Henry's Concise Commentary",
          searchUrl: `https://www.studylight.org/commentaries/eng/mhm/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "jfb": { 
          name: "Jamieson-Fausset-Brown Bible Commentary",
          searchUrl: `https://www.studylight.org/commentaries/eng/jfb/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "keil-delitzsch": { 
          name: "Keil and Delitzsch Biblical Commentary",
          searchUrl: `https://www.studylight.org/commentaries/eng/kdo/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "wesley": { 
          name: "Wesley's Explanatory Notes",
          searchUrl: `https://www.studylight.org/commentaries/eng/wen/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "pulpit": { 
          name: "Pulpit Commentary",
          searchUrl: `https://www.studylight.org/commentaries/eng/tpc/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "cambridge": { 
          name: "Cambridge Bible for Schools and Colleges",
          searchUrl: `https://www.studylight.org/commentaries/eng/cbb/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "ellicott": { 
          name: "Ellicott's Commentary for English Readers",
          searchUrl: `https://www.studylight.org/commentaries/eng/ebc/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "benson": { 
          name: "Benson Commentary",
          searchUrl: `https://www.studylight.org/commentaries/eng/rbc/${book.toLowerCase().replace(/ /g, '-')}/${chapter}.html`
        },
        "sop": { 
          name: "Spirit of Prophecy",
          searchUrl: "" // SOP handled separately above
        },
      };

      const selectedCommentary = commentaryUrls[classicCommentary] || commentaryUrls["clarke"];
      
      // Fetch the actual webpage
      let webpageContent = "";
      try {
        const webResponse = await fetch(selectedCommentary.searchUrl, {
          method: 'GET',
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        if (webResponse.ok) {
          webpageContent = await webResponse.text();
        }
      } catch (error) {
        console.error('Error fetching webpage:', error);
      }

      // Use AI to extract and format the commentary from the web page
      systemPrompt = `You are a biblical scholar extracting commentary text from a classic Bible commentary webpage.

Your task is to:
1. Find the commentary text for ${book} ${chapter}:${verseText.verse} from the provided webpage content
2. Extract ONLY the actual words written by the original commentator - do not paraphrase or generate new text
3. Format it cleanly for reading, preserving the original author's voice and style

CRITICAL FORMATTING REQUIREMENTS:
- Do NOT use any markdown formatting (no bold, italics, headings)
- Do NOT use asterisks (*) anywhere
- Write in clear paragraphs with blank lines between them
- Use the bullet character "•" for any lists
- If the webpage doesn't contain commentary for this specific verse, say "Commentary not available for this verse"
- ONLY extract and present what the original commentator actually wrote

Present the actual historical commentary text, preserving the original author's words and perspective.`;

      userPrompt = `Here is the HTML content from ${selectedCommentary.name} for ${book} ${chapter}:

${webpageContent.slice(0, 50000)}

Extract the commentary specifically for verse ${verseText.verse}. The verse text is: "${verseText.text}"

Find and present the original commentator's words for this specific verse. If you cannot find specific commentary for verse ${verseText.verse}, state clearly that commentary is not available.`;

      const classicResponse = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
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
          }),
        }
      );

      if (!classicResponse.ok) {
        const errorText = await classicResponse.text();
        console.error('AI Gateway error:', classicResponse.status, errorText);
        throw new Error(`AI Gateway error: ${classicResponse.status}`);
      }

      const classicData = await classicResponse.json();
      let classicContent = classicData.choices?.[0]?.message?.content || "No commentary generated.";
      
      // Clean control characters
      classicContent = classicContent.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

      return new Response(
        JSON.stringify({ 
          content: classicContent,
          principlesUsed: [selectedCommentary.name]
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    
    } else if (mode === "principle-amplification") {
      systemPrompt = `You are Jeeves, a friendly biblical scholar helping friends understand how Phototheology principles amplify and illuminate Scripture.
      
**CRITICAL FORMATTING REQUIREMENTS:**
- Format ALL responses in clear, easy-to-read paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use emojis generously throughout (🔍 💡 ✨ 📖 🎯 ⭐ 💎 🌟 etc.)
- Use bullet points (•) for lists, NOT asterisks (*)
- NEVER use asterisks (*) at the start of lines
- Use **bold** for emphasis on key terms
- Keep text warm, conversational, and insightful
- Tone: Warm and friendly ("Ah, my friend" style, not overly formal)

${PALACE_SCHEMA}

⚠️ CRITICAL: Only reference principles that exist in the Palace Schema above. Use the EXACT methodology for the principle.`;

      userPrompt = `Explain how the principle "${principle}" amplifies and illuminates this verse:

${book} ${chapter}:${verse}
"${verseText}"

**YOUR TASK:**
Show specifically HOW this principle reveals insight in this verse. Be concrete and practical.

🎯 **Opening** (2-3 sentences)
Start with how this principle naturally connects to this verse.

💡 **Application** (2-3 paragraphs)
Walk through the specific methodology of this principle as it applies to this verse. Show what it reveals that we might otherwise miss.

✨ **Insight** (1-2 sentences)
One profound takeaway that this principle unlocks in this verse.

Make it scholarly yet accessible, warm and illuminating.`;
     
    } else if (mode === "hebrew-greek-analysis") {
      const { strongsNumber, originalWord, transliteration, partOfSpeech } = requestBody;
      
      systemPrompt = `You are Jeeves, an expert in biblical Hebrew and Greek. You help friends understand the depth and richness of Scripture through word analysis.

TASK: Provide comprehensive linguistic analysis of this Hebrew/Greek word in its biblical context.

WORD DETAILS:
- Strong's: ${strongsNumber}
- Original: ${originalWord}
- Transliteration: ${transliteration}
- Part of Speech: ${partOfSpeech}

VERSE CONTEXT:
- Reference: ${book} ${chapter}:${verse}
- English Text: "${verseText}"

CRITICAL FORMATTING REQUIREMENTS:
- Use clear paragraph breaks (double newlines)
- Add emojis: 📖 Etymology | 🎯 Core Meaning | 💡 In Context | 🔍 Cross-References | ✨ Significance
- Use bullet points with • or - for lists
- Use **bold** for key Hebrew/Greek terms
- Include pronunciation help where helpful
- Keep each section concise but rich (2-4 sentences)
- Tone: Conversational and warm ("Ah, my friend" not "My dear student")

ANALYSIS STRUCTURE (provide all 5 sections):

📖 **Etymology & Root**
Explain word origin, root meaning, and linguistic family. What's the basic building block?

🎯 **Core Meaning**
Define the primary meaning and semantic range. What are the main ways this word is used?

💡 **In This Context**
How does this word function specifically in THIS verse? Why did the author choose THIS word?

🔍 **Cross-References**
Mention 2-3 other key passages where this word appears. What patterns emerge?

✨ **Theological Significance**
What does this word reveal about God, salvation, or covenant? How does understanding the original language enrich the English translation?

Keep it warm and conversational. Help your friend see the treasure in the original languages.`;
      
      userPrompt = `Ah, my friend, let's explore Strong's ${strongsNumber} (${originalWord}) in ${book} ${chapter}:${verse}. Show me what treasures this word holds!`;
    
    } else if (mode === "generate-drills") {
      // Properties already destructured from requestBody
      
      systemPrompt = `You are Jeeves, a master trainer creating dynamic practice drills for palace room mastery.
Generate 10 unique, progressive training drills that help users master this specific room's methodology.`;

      userPrompt = `Create 10 training drills for the ${roomName} (${roomTag}) room.

Room Purpose: ${roomPurpose}
Room Method: ${roomMethod}

For each drill, provide:
1. A clear, actionable title (5-8 words)
2. A brief description (1-2 sentences explaining what skill this drill builds)
3. A specific prompt/challenge (2-3 sentences giving the user a concrete task)

Make drills progressively harder (1-3 beginner, 4-7 intermediate, 8-10 advanced).
Vary the approach - use different verses, different angles, different challenges.
Make them practical and immediately applicable.

Return JSON format:
{
  "drills": [
    {
      "title": "Drill title",
      "description": "What this builds",
      "prompt": "Specific task for the user"
    }
  ]
}`;

    } else if (mode === "generate-chart") {
      systemPrompt = `You are Jeeves, a data visualization expert for Bible study.
Generate simple, clear chart data in JSON format for visualizing biblical concepts.`;

      // Properties already destructured from requestBody
      
      userPrompt = `Create a ${chartType} chart with the title "${chartTitle}".

Generate JSON data for the chart in this format:
{
  "type": "${chartType}",
  "title": "${chartTitle}",
  "data": [
    { "label": "Category 1", "value": 10 },
    { "label": "Category 2", "value": 20 }
  ],
  "description": "Brief 1-2 sentence explanation of what this chart shows"
}

Chart context: ${chartData || "General Bible study visualization"}

Make it educational and insightful.`;

    } else if (mode === "chain-chess") {
      console.log("=== CHAIN CHESS MODE ===");
      console.log("Is first move:", isFirstMove);
      console.log("Verse:", verse);
      console.log("Available categories:", availableCategories);
      console.log("Difficulty:", difficulty);
      
      // availableCategories and difficulty already extracted from req.json() above
      const difficultyContext = difficulty === "kids"
        ? "Use simpler language and shorter sentences. Make it encouraging and fun for children aged 8-14."
        : "Use scholarly language with depth. Make it theologically rich for adult learners.";
      
      systemPrompt = `You are Jeeves, an enthusiastic Bible study companion playing Chain Chess!
Your role is to make insightful biblical commentary that builds connections between verses and principles.
Be scholarly yet warm, like an excited friend sharing discoveries.
${difficultyContext}

**CRITICAL:** YOU MUST respond in VALID JSON format with these REQUIRED fields:
{
  "verse": "book chapter:verse",
  "commentary": "your 3-4 sentence insightful thought about the verse",
  "challengeCategory": "specific challenge"
}

**RULES FOR COMMENTARY (YOUR THOUGHT):**
- MUST be 3-4 complete sentences
- MUST provide actual biblical insight (not meta-commentary about the game)
- MUST be enthusiastic and engaging
- MUST connect to biblical truth and principles
- This is YOUR THOUGHT - share your scholarly insight!

**CRITICAL RULES FOR CHALLENGES:**
- If category is "Books of the Bible" → specify the book name: "Books of the Bible - Romans" or "Books of the Bible - Isaiah"
- If category is "Rooms of the Palace" → specify the room name: "Rooms of the Palace - Story Room" or "Rooms of the Palace - Sanctuary"
- If category is "Principles of the Palace" → specify the principle: "Principles of the Palace - 2D/3D" or "Principles of the Palace - Time Zones"

You MUST be specific. Never give a generic category without naming the specific book, room, or principle.`;

      if (isFirstMove) {
        const categoriesText = (availableCategories || ["Books of the Bible", "Rooms of the Palace", "Principles of the Palace"]).join(", ");
        userPrompt = `You're starting a Chain Chess game! You go FIRST. 

**YOU CHOOSE THE OPENING VERSE!**

Pick any powerful, well-known Bible verse to start the game. This will be the foundation verse for the entire game.

Available categories for this game: ${categoriesText}

**YOUR CRITICAL TASK:**
1. Choose an excellent opening verse (like John 3:16, Romans 8:28, Psalm 23:1, etc.)

2. Give a 3-4 sentence exposition/build on that verse:
   - Explain what the verse means
   - Share biblical insight using original language (Greek/Hebrew) if relevant
   - Show why this verse is profound
   - Connect to theological truth
   - Be enthusiastic and scholarly!
   
3. Then challenge the player with a SPECIFIC challenge:
   - If using "Books of the Bible" → name a specific book: "Books of the Bible - Romans"
   - If using "Rooms of the Palace" → name a specific room: "Rooms of the Palace - Story Room"
   - If using "Principles of the Palace" → name a specific principle: "Principles of the Palace - 2D/3D"

**IMPORTANT:** 
- Choose a clear, powerful verse to start
- Your commentary should be an exposition/build that teaches about the verse
- You MUST be specific in your challenge category

**EXAMPLE FORMAT:**
{
  "verse": "John 3:16",
  "commentary": "What a magnificent cornerstone to begin our theological exploration! John 3:16 encapsulates the very heart of the Gospel, articulating God's unconditional 'agape' love for a fallen world. The phrase 'only begotten Son' (Greek: monogenēs) emphasizes Christ's unique divine filiation. This verse frames salvation not as human achievement but as divine initiative, freely offered to 'whosoever believes.'",
  "challengeCategory": "Books of the Bible - Romans"
}

**FOR THIS GAME:**
NOW: Choose your opening verse, give an insightful exposition, then challenge them with a SPECIFIC challenge from these categories: ${categoriesText}

Return ONLY valid JSON with:
- verse: (your chosen verse reference)
- commentary: (your insightful exposition on the verse)
- challengeCategory: (specific challenge with book/room/principle name)`;
      } else {
        const lastMove = previousMoves[previousMoves.length - 1];
        const categoriesText = (availableCategories || ["Books of the Bible", "Rooms of the Palace", "Principles of the Palace"]).join(", ");
        
        // Handle generic challenges by making them specific
        let specificChallenge = lastMove.challengeCategory || "Books of the Bible";
        if (!specificChallenge.includes(" - ")) {
          // User gave a generic challenge - make it specific
          if (specificChallenge.includes("Books of the Bible")) {
            const books = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "Isaiah", "Jeremiah", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "Revelation"];
            const randomBook = books[Math.floor(Math.random() * books.length)];
            specificChallenge = `Books of the Bible - ${randomBook}`;
          } else if (specificChallenge.includes("Rooms of the Palace")) {
            const rooms = ["Story Room", "Observation Room", "Gems Room", "Concentration Room", "Sanctuary (Blue Room)", "Theme Room", "Patterns Room"];
            const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
            specificChallenge = `Rooms of the Palace - ${randomRoom}`;
          } else if (specificChallenge.includes("Principles")) {
            const principles = ["2D/3D", "Time Zones", "Repeat & Enlarge", "Heaven Ceiling", "Gospel Floor"];
            const randomPrinciple = principles[Math.floor(Math.random() * principles.length)];
            specificChallenge = `Principles of the Palace - ${randomPrinciple}`;
          }
        }
        
        userPrompt = `Continue Chain Chess on ${verse}.

Player's previous move:
Verse: "${lastMove.verse}"
Commentary: "${lastMove.commentary}"
Their challenge: "${specificChallenge}"

Available categories: ${categoriesText}

**YOUR TASK:**
1. Find a verse that relates to their challenge "${specificChallenge}"
2. Give 3-4 sentences of insightful commentary connecting your verse to the challenge
3. Show excitement about the connection you're making
4. Challenge them back with a SPECIFIC challenge using this format:
   - "Books of the Bible - [BOOK NAME]" (e.g., "Books of the Bible - Psalms", "Books of the Bible - Daniel")
   - "Rooms of the Palace - [ROOM NAME]" (e.g., "Rooms of the Palace - Feasts Room", "Rooms of the Palace - Gems Room")
   - "Principles of the Palace - [PRINCIPLE]" (e.g., "Principles of the Palace - 2D", "Principles of the Palace - Repeat & Enlarge")

**CRITICAL:** DO NOT use generic categories! ALWAYS include the specific book/room/principle name after the dash!

Example CORRECT challenges:
- "Books of the Bible - Exodus"
- "Rooms of the Palace - Theme Room"
- "Principles of the Palace - Heaven Ceiling"

Example WRONG challenges (DO NOT DO THIS):
- "Books of the Bible" (missing specific book!)
- "Principles of the Palace" (missing specific principle!)

Return JSON: { "verse": "reference", "commentary": "...", "challengeCategory": "Category - SPECIFIC NAME" }`;
      }

    } else if (mode === "equations-challenge") {
      // Complete Bible book and chapter data
      const bibleBooks = [
        { name: "Genesis", chapters: 50 }, { name: "Exodus", chapters: 40 }, { name: "Leviticus", chapters: 27 },
        { name: "Numbers", chapters: 36 }, { name: "Deuteronomy", chapters: 34 }, { name: "Joshua", chapters: 24 },
        { name: "Judges", chapters: 21 }, { name: "Ruth", chapters: 4 }, { name: "1 Samuel", chapters: 31 },
        { name: "2 Samuel", chapters: 24 }, { name: "1 Kings", chapters: 22 }, { name: "2 Kings", chapters: 25 },
        { name: "1 Chronicles", chapters: 29 }, { name: "2 Chronicles", chapters: 36 }, { name: "Ezra", chapters: 10 },
        { name: "Nehemiah", chapters: 13 }, { name: "Esther", chapters: 10 }, { name: "Job", chapters: 42 },
        { name: "Psalms", chapters: 150 }, { name: "Proverbs", chapters: 31 }, { name: "Ecclesiastes", chapters: 12 },
        { name: "Song of Solomon", chapters: 8 }, { name: "Isaiah", chapters: 66 }, { name: "Jeremiah", chapters: 52 },
        { name: "Lamentations", chapters: 5 }, { name: "Ezekiel", chapters: 48 }, { name: "Daniel", chapters: 12 },
        { name: "Hosea", chapters: 14 }, { name: "Joel", chapters: 3 }, { name: "Amos", chapters: 9 },
        { name: "Obadiah", chapters: 1 }, { name: "Jonah", chapters: 4 }, { name: "Micah", chapters: 7 },
        { name: "Nahum", chapters: 3 }, { name: "Habakkuk", chapters: 3 }, { name: "Zephaniah", chapters: 3 },
        { name: "Haggai", chapters: 2 }, { name: "Zechariah", chapters: 14 }, { name: "Malachi", chapters: 4 },
        { name: "Matthew", chapters: 28 }, { name: "Mark", chapters: 16 }, { name: "Luke", chapters: 24 },
        { name: "John", chapters: 21 }, { name: "Acts", chapters: 28 }, { name: "Romans", chapters: 16 },
        { name: "1 Corinthians", chapters: 16 }, { name: "2 Corinthians", chapters: 13 }, { name: "Galatians", chapters: 6 },
        { name: "Ephesians", chapters: 6 }, { name: "Philippians", chapters: 4 }, { name: "Colossians", chapters: 4 },
        { name: "1 Thessalonians", chapters: 5 }, { name: "2 Thessalonians", chapters: 3 }, { name: "1 Timothy", chapters: 6 },
        { name: "2 Timothy", chapters: 4 }, { name: "Titus", chapters: 3 }, { name: "Philemon", chapters: 1 },
        { name: "Hebrews", chapters: 13 }, { name: "James", chapters: 5 }, { name: "1 Peter", chapters: 5 },
        { name: "2 Peter", chapters: 3 }, { name: "1 John", chapters: 5 }, { name: "2 John", chapters: 1 },
        { name: "3 John", chapters: 1 }, { name: "Jude", chapters: 1 }, { name: "Revelation", chapters: 22 }
      ];
      
      // Randomly select book and chapter from entire Bible
      const randomBook = bibleBooks[Math.floor(Math.random() * bibleBooks.length)];
      const randomChapter = Math.floor(Math.random() * randomBook.chapters) + 1;
      
      // Generate verse reference (single verse, verse range, or story/account)
      const referenceType = Math.random();
      let selectedPassage: string;
      
      if (referenceType < 0.33) {
        // Single verse (e.g., "John 3:16")
        const verse = Math.floor(Math.random() * 30) + 1; // Most chapters have at least 30 verses
        selectedPassage = `${randomBook.name} ${randomChapter}:${verse}`;
      } else if (referenceType < 0.67) {
        // Verse range (e.g., "Genesis 22:1-14")
        const startVerse = Math.floor(Math.random() * 20) + 1;
        const endVerse = startVerse + Math.floor(Math.random() * 10) + 3; // Range of 3-12 verses
        selectedPassage = `${randomBook.name} ${randomChapter}:${startVerse}-${endVerse}`;
      } else {
        // Story/account description with verse range
        const startVerse = Math.floor(Math.random() * 15) + 1;
        const endVerse = startVerse + Math.floor(Math.random() * 15) + 5;
        selectedPassage = `${randomBook.name} ${randomChapter}:${startVerse}-${endVerse}`;
      }
      
      systemPrompt = `You are Jeeves, the Phototheology equations master. Generate biblical equation challenges using ONLY authentic Phototheology principle codes from the official system.

**CRITICAL: ONLY USE THESE APPROVED CODES - NEVER INVENT OR HALLUCINATE SYMBOLS:**

**Floor 1 (Furnishing):** 24, BR, GR, IR, SR, TR
**Floor 2 (Investigation):** DC, OR, QA, QB, ST
**Floor 3 (Freestyle):** BF, HF, LR, NF, PF
**Floor 4 Rooms:** CR, C6, DR, FRT, ∥, ≈, TRM, TZ
**Floor 4 Dimensions:** 1D, 2D, 3D, 4D, 5D
**Floor 4 Connect-6 Genres:** Ep, Go, Hi, Pa, Po, Pr
**Floor 4 Theme Walls:** \\G, |GC, \\H, |LC, |S, |TP
**Floor 4 Time Zones:** Ef, En, Epa, Hf, Hpa, Hp
**Floor 4 Fruit:** -f, -ge, -g, -j, -ls, -lv, -m, -p, -t
**Floor 5 (Vision):** BL, CEC, FE, PR, R66, 3A
**Floor 5 Sanctuary:** SAN-ALT, SAN-INCENSE, SAN-ARK, SAN-LAMP, SAN-LAVER, SAN-BREAD
**Floor 5 Prophecy:** @120, @1260, @2300, @400, @70w, @70y
**Floor 5 Angels:** 3AM-1, 3AM-2, 3AM-3
**Floor 5 Feasts:** FE-AT, FE-FI, FE-PA, FE-PE, FE-TA, FE-TR, FE-UN
**Floor 6 (Three Heavens):** DoL¹/NE¹, DoL²/NE², DoL³/NE³
**Floor 6 Cycles:** @Ab, @Ad, @Cy, @Sp, @Mo, @No, @Re, @Se
**Floor 6 Rooms:** 8C, JR
**Floor 7 (Spiritual):** FRM, MR, SRM

**NEVER USE THESE - THEY ARE NOT VALID CODES:** CH, NC, Grace, New Creation, Christ (use CR for Concentration on Christ instead)

Return valid JSON only.`;

      userPrompt = `Create a biblical equation challenge at "${difficulty}" difficulty with EXACTLY ${symbolCount} principles.

**CRITICAL REQUIREMENT: Your equation MUST include EXACTLY ${symbolCount} Phototheology codes - no more, no less!**

**VARIETY REQUIREMENT: Generate a completely unique equation. Random seed: ${requestBody.randomSeed || Date.now()}. Never repeat the same verse or code combination.**

**YOU MUST USE THIS SPECIFIC BIBLE PASSAGE AS THE FOUNDATION:** ${selectedPassage}

CRITICAL INSTRUCTIONS:
1. Write out the FULL TEXT of the verse(s) from ${selectedPassage} using KJV translation
2. Put the actual verse text in the "verse" field - just the Scripture text itself, nothing else
3. Then build your equation to illuminate THIS specific passage
4. If it's a well-known story/account, you can briefly mention it in your explanation

Example verse field format:
"verse": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life. (John 3:16)"

**USE ONLY THESE APPROVED PHOTOTHEOLOGY CODES (from the official Principle Codes Reference):**

**Floor 1 (Furnishing):** 24 (24FPS), BR (Bible Rendered), GR (Gems), IR (Imagination), SR (Story), TR (Translation)
**Floor 2 (Investigation):** DC (Def-Com), OR (Observation), QA (Q&A Chains), QB (Questions), ST (Symbols/Types)
**Floor 3 (Freestyle):** BF (Bible Freestyle), HF (History Freestyle), LR (Listening), NF (Nature Freestyle), PF (Personal Freestyle)
**Floor 4 Rooms:** CR (Concentration on Christ), C6 (Connect-6), DR (Dimensions), FRT (Fruit), ∥ (Parallels), ≈ (Patterns), TRM (Theme), TZ (Time Zone)
**Floor 4 Dimensions:** 1D (Literal), 2D (Christ), 3D (Personal), 4D (Church), 5D (Heaven)
**Floor 4 Genres:** Ep (Epistle), Go (Gospel), Hi (History), Pa (Parable), Po (Poetry), Pr (Prophecy)
**Floor 4 Themes:** \\G (Gospel Floor), |GC (Great Controversy), \\H (Heaven Ceiling), |LC (Life of Christ), |S (Sanctuary), |TP (Time Prophecy)
**Floor 4 Time Zones:** Ef (Earth Future), En (Earth Now), Epa (Earth Past), Hf (Heaven Future), Hpa (Heaven Past), Hp (Heaven Present)
**Floor 4 Fruit:** -f (Faith), -ge (Gentleness), -g (Goodness), -j (Joy), -ls (Longsuffering), -lv (Love), -m (Meekness), -p (Peace), -t (Temperance)
**Floor 5 (Vision):** BL (Blue Room), CEC (Christ Every Chapter), FE (Feasts), PR (Prophecy), R66 (Room 66), 3A (Three Angels)
**Floor 5 Sanctuary:** SAN-ALT (Altar), SAN-INCENSE (Incense), SAN-ARK (Ark), SAN-LAMP (Lampstand), SAN-LAVER (Laver), SAN-BREAD (Showbread)
**Floor 5 Prophecy:** @120 (120 Years), @1260 (1260 Days), @2300 (2300 Days), @400 (400 Years), @70w (70 Weeks), @70y (70 Years)
**Floor 5 Angels:** 3AM-1 (First Angel), 3AM-2 (Second Angel), 3AM-3 (Third Angel)
**Floor 5 Feasts:** FE-AT (Atonement), FE-FI (Firstfruits), FE-PA (Passover), FE-PE (Pentecost), FE-TA (Tabernacles), FE-TR (Trumpets), FE-UN (Unleavened Bread)
**Floor 6 Heavens:** DoL¹/NE¹ (First Day of LORD), DoL²/NE² (Second Day of LORD), DoL³/NE³ (Third Day of LORD)
**Floor 6 Cycles:** @Ab (Abrahamic), @Ad (Adamic), @Cy (Cyrusic), @Sp (Spirit), @Mo (Mosaic), @No (Noahic), @Re (Remnant), @Se (Seth)
**Floor 6 Rooms:** 8C (Eight Cycles), JR (Juice Room)
**Floor 7 (Spiritual):** FRM (Fire), MR (Meditation), SRM (Speed)

**OPERATORS:** + (and/with), → (leads to/results in), = (equals/is)

**NEVER use these invalid codes:** CH, NC, Grace, New Creation, Christ (use CR for Christ-centered study)

**REQUIREMENTS:**
1. **CRITICAL: Use EXACTLY ${symbolCount} codes from the approved list above - NOT MORE, NOT LESS**
2. Build your equation to illuminate ${selectedPassage}
3. NO hallucinated symbols beyond what's listed
4. Create a coherent theological narrative
5. Show progressive relationships using operators
6. **The equation MUST contain exactly ${symbolCount} distinct Phototheology codes**

**Return JSON:**
{
  "verse": "FULL KJV text of ${selectedPassage} here",
  "equation": "${selectedPassage} (CODE1 + CODE2 + CODE3 ${symbolCount > 3 ? '+ ...' : ''} → FINAL_CODE) =?",
  "symbols": ["CODE: Full principle name", "CODE2: Full principle name", ${symbolCount > 3 ? '"CODE3: Full principle name", ...' : ''} /* MUST be exactly ${symbolCount} symbols */],
  "difficulty": "${difficulty}",
  "explanation": "Write a clear, instructional guide for people NEW to Phototheology that explains HOW to approach this challenge WITHOUT giving away the solution. Structure it in 4 paragraphs:\n\n**Paragraph 1 - Introduction (2-3 sentences):** Briefly introduce the chapter ${selectedPassage} and what Phototheology principles are (they're like 'study lenses' or 'interpretive keys' that help reveal deeper patterns in Scripture).\n\n**Paragraph 2 - Your Challenge Instructions (main section):** For EACH principle in the equation, write one clear instruction telling the user HOW to apply it to their study. Use this format:\n\n• Apply the [Principle Name] ([brief definition]) to your study of this chapter. Consider how [what to look for / what questions to ask / what connections to make].\n\nExample: 'Apply the Second Heaven principle (the time period covering the New Covenant cycle) to your study of this chapter. Consider how this text relates to that era and the transition from old to new covenant.'\n\nExample: 'Apply the Passover feast (Christ's sacrifice and deliverance) to your study. Look for themes of blood, sacrifice, deliverance, or lamb imagery in this passage.'\n\nDo this for ALL principles in the equation.\n\n**Paragraph 3 - Understanding the Operators (2-3 sentences):** Explain that the + means 'combine these insights together,' → means 'this principle leads to or results in the next,' and = means 'all of this equals or fulfills this truth.' Tell them to trace the logical flow from principle to principle.\n\n**Paragraph 4 - Your Goal (1-2 sentences):** Remind them that their goal is to discover how all these principles work together to reveal something profound about Christ, salvation, or God's plan in this specific chapter. Encourage them to write out their findings and share them with the community!\n\nIMPORTANT: DO NOT solve the equation or give away answers. Only give instructions on HOW to apply each principle. Write in a warm, encouraging, teaching tone with clear formatting and bullet points."
}

**FINAL REMINDER: Count your codes! Your equation and symbols array MUST contain exactly ${symbolCount} Phototheology codes. Do not generate less than ${symbolCount} codes!**

Make the equation specifically illuminate ${selectedPassage}.`;



    } else if (mode === "solve-equation") {
      systemPrompt = `You are Jeeves, the master Phototheology teacher. When given a biblical equation, you solve it step-by-step, showing how each principle connects to reveal deeper truth about Christ and Scripture.

CRITICAL: Be thorough, clear, and educational. Show your work like a master teacher demonstrating to a student.`;

      userPrompt = `I need you to solve this Phototheology equation step-by-step:

📖 **Verse:** ${requestBody.verse}
🔢 **Equation:** ${requestBody.equation}
📋 **Symbols Used:** ${requestBody.symbols?.join(', ')}

Please provide a masterful solution with these sections:

**1. Verse Context (2-3 sentences)**
What's happening in this passage? Set the scene.

**2. Breaking Down the Equation (walk through each symbol)**
For each principle in the equation, explain in well-structured paragraphs:
• What this principle means
• How it connects to the verse
• What insight it reveals

Use complete sentences and proper paragraph structure. Avoid run-on sentences.

**3. The Flow of Logic**
Show how the operators (+, →, =) connect the principles to build the theological argument. What's the progression of thought?

**4. The Profound Insight**
What does this equation ultimately reveal about Christ, salvation, or God's plan? What's the "aha!" moment?

**5. Practical Application**
How should this change how we read Scripture or live our lives?

Format with clear headers, bullet points, and paragraphs. Be enthusiastic and insightful!`;

    } else if (mode === "chain-chess-feedback") {
      // All variables already extracted from req.json() above
      const difficultyContext = difficulty === "kids"
        ? "Score generously to encourage kids. 6-8 for good effort, 9-10 for excellent insights."
        : "Score rigorously for adults. 4-6 for decent, 7-8 for strong, 9-10 for exceptional.";
        
      systemPrompt = `You are Jeeves, scoring Chain Chess responses! 
Celebrate what makes each response impactful, like an excited friend.
${difficultyContext}
Evaluate: biblical accuracy, depth of insight, verse relevance to challenge, and connection quality.`;

      const lastMove = previousMoves[previousMoves.length - 1];
      
      userPrompt = `The player responded to the game on ${verse} using the "${challengeCategory}" challenge:

Jeeves' challenge: "${challengeCategory}"
Player's verse: "${userVerse}"
Player's commentary: "${userCommentary}"
Player's challenge back: "${newChallengeCategory}"

Previous context: "${lastMove.commentary}"

**EVALUATE:**
1. Did their verse "${userVerse}" appropriately relate to the challenge "${challengeCategory}"?
2. Did they build on the previous thought?
3. Is their commentary biblically sound and insightful?
4. Is their challenge specific enough?

Respond in this JSON format:
{
  "feedback": "2-3 enthusiastic sentences highlighting what makes their response impactful and one specific way it could be even stronger",
  "score": 8
}

Be genuinely excited about good insights! ${difficultyContext}`;
    
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
      const scopeContext = scope === "america"
        ? "Focus on events in the United States of America" 
        : "Focus on events globally, outside the United States";
      
      const timePeriodValue = timePeriod || "1month";
      const timeFrames: Record<string, string> = {
        "1month": "last 30 days",
        "3months": "last 3 months",
        "6months": "last 6 months",
        "1year": "last year",
        "2years": "last 2 years",
        "5years": "last 5 years"
      };
      
      systemPrompt = `You are Jeeves, a historicist prophecy scholar analyzing contemporary events through the lens of Matthew 24 and Revelation 13:11. You identify prophetic signals in current events.`;

      // First, search the web for relevant articles
      const searchQuery = scopeContext.includes("United States")
        ? `Christian nationalism church state separation USA ${timeFrames[timePeriodValue]}`
        : `religious authoritarianism global ${timeFrames[timePeriodValue]}`;
      
      console.log(`Searching web for: ${searchQuery}`);
      
      let searchResults = "";
      let hasSearchResults = false;
      try {
        const searchResponse = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('TAVILY_API_KEY') || 'tvly-demo-key'}`
          },
          body: JSON.stringify({
            query: searchQuery,
            search_depth: 'advanced',
            include_answer: false,
            max_results: 5
          })
        });
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.results && searchData.results.length > 0) {
            searchResults = searchData.results
              .map((r: any) => `Title: ${r.title}\nURL: ${r.url}\nSnippet: ${r.content}`)
              .join('\n\n');
            hasSearchResults = true;
          }
        }
      } catch (e) {
        console.log('Web search unavailable, generating from knowledge');
      }

      userPrompt = hasSearchResults 
        ? `Based on these recent news articles from the ${timeFrames[timePeriodValue]}, create ONE prophetic signal. ${scopeContext}.

RECENT ARTICLES:
${searchResults}

FOCUS AREAS (choose one that matches the articles):
- Christian Nationalism: Christian supremacy movements, theocratic rhetoric
- Church-State Erosion: Religious symbols in government, faith-based policy  
- Authoritarianism in Christianity: Religious law enforcement advocacy
- Natural Disasters: Climate events as signs (Matthew 24)
- Papal Influence: Vatican diplomatic moves, ecumenical unity
- Religious Liberty Threats: Sunday law proposals, NSPM-7 policies

Return JSON format:
{
  "title": "Title from actual article or clear event name",
  "description": "2-3 paragraphs with clear paragraph breaks: (1) Describe the actual event with specifics, (2) Explain prophetic significance, (3) Show pattern. Use \\n\\n between paragraphs for readability.",
  "category": "church-state" | "christian-nationalism" | "natural" | "religious-liberty" | "authoritarianism",
  "source_url": "URL from the articles above (REQUIRED)",
  "verses": ["Matthew 24:X", "Revelation 13:11"]
}

CRITICAL: Always include a valid source_url from the articles provided above.`
        : `Generate ONE prophetic signal based on observable trends from the ${timeFrames[timePeriodValue]}. ${scopeContext}.

FOCUS AREAS (choose one):
- Christian Nationalism: Christian supremacy movements, theocratic rhetoric
- Church-State Erosion: Religious symbols in government, faith-based policy  
- Authoritarianism in Christianity: Religious law enforcement advocacy
- Natural Disasters: Climate events as signs (Matthew 24)
- Papal Influence: Vatican diplomatic moves, ecumenical unity
- Religious Liberty Threats: Sunday law proposals, NSPM-7 policies

Create a signal based on well-documented patterns and observable trends in these areas. Reference specific types of events that have been occurring (e.g., "state legislatures mandating religious displays", "increased Christian nationalist rhetoric in politics", "ecumenical movements bringing denominations together").

Return JSON format:
{
  "title": "Clear, specific event or trend name",
  "description": "2-3 paragraphs with clear paragraph breaks: (1) Describe the trend/pattern with specifics, (2) Explain prophetic significance, (3) Show how this fits the pattern. Use \\n\\n between paragraphs for readability.",
  "category": "church-state" | "christian-nationalism" | "natural" | "religious-liberty" | "authoritarianism",
  "source_url": "https://example.com/relevant-source (use a plausible news source URL format)",
  "verses": ["Matthew 24:X", "Revelation 13:11"]
}

Be factual and based on observable, documentable trends. Not sensational.`;

    } else if (mode === "daily-encouragement") {
      // Fetch user's name from profile
      let userName = "friend";
      if (userId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', userId)
          .single();
        
        if (profile?.full_name) {
          userName = profile.full_name.split(' ')[0]; // Use first name only
        } else if (profile?.email) {
          userName = profile.email.split('@')[0]; // Use email prefix as fallback
        }
      }
      
      systemPrompt = `You are Jeeves, a wise and encouraging spiritual mentor. Your role is to provide daily encouragement for Christians fighting the war against self and sin.`;
      userPrompt = `Generate a brief, powerful daily encouragement (2-3 sentences) for ${userName} that follows this pattern:

"${userName}, today you may be tempted to [common temptation], but in all such cases, remember [biblical truth and encouragement for victory]."

Focus on common spiritual battles like anger, pride, lust, fear, discouragement, or compromise. Be specific, practical, and encouraging. Always point to Christ's power and grace. Address ${userName} directly and naturally throughout.`;
    
    } else if (mode === "scenario-feedback") {
      systemPrompt = `You are Jeeves, a wise spiritual warfare trainer. You help Christians understand which Fruits of the Spirit are needed for specific trials.`;
      userPrompt = `A believer faced this scenario: ${scenario}

They chose to exercise these fruits: ${selectedFruits}

Provide brief (2-3 sentences) feedback on their choice. If correct, affirm and explain why these fruits work together. If incorrect, gently explain what fruits would be more effective and why.`;
    
    } else if (mode === "research") {
      systemPrompt = `You are Jeeves, ${greeting}'s personal biblical research assistant providing comprehensive, scholarly analysis.

**PERSONALIZATION:**
- Use ${greeting}'s name naturally throughout your response (2-3 times) to maintain connection
- Use warm, engaging phrases like "Hey ${greeting}", "${greeting}, this is fascinating", "I think you'll find this interesting, ${greeting}"
- NEVER use overly formal phrases like "My dear student", "My dear Sir", "My dear friend", "Ah sir"
- Keep tone warm and conversational even while being scholarly

Include citations, cross-references, historical context, and theological perspectives.`;

      userPrompt = `Provide deep research for ${greeting} on: "${query}"

Structure your research:
1. Overview (2-3 paragraphs introducing the topic)
2. Biblical Foundation (examine key passages with cross-references)
3. Historical Context (cultural and historical background)
4. Theological Perspectives (different scholarly viewpoints)
5. Practical Applications (how this applies today)
6. Key Insights (3-5 major takeaways)
7. Further Study (suggest related topics and passages)

Include verse citations, cross-references, and scholarly depth. Make it comprehensive but accessible. Use ${greeting}'s name 2-3 times naturally.`;
    
    } else if (mode === "sermon-setup") {
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
      systemPrompt = "You are Jeeves, helping identify powerful AHA moments (smooth stones) for sermons.";
      userPrompt = `For a sermon on "${theme}", suggest 2-3 potential smooth stones (powerful Phototheology insights).
${existingStones && existingStones.length > 0 ? `\nThey already have: ${existingStones.join('; ')}` : ''}

Each stone should be:
- A mind-blowing biblical insight
- Memorable and quotable
- Connected to the theme
- Different from what they already have

Present them as options, not mandates.`;

    } else if (mode === "sermon-bridges") {
      systemPrompt = "You are Jeeves, helping create narrative bridges between sermon points.";
      userPrompt = `Help create bridges to connect these 5 smooth stones into a flowing narrative:
${stones.map((s: string, i: number) => `Stone ${i+1}: ${s}`).join('\n')}

${existingBridges && existingBridges.length > 0 ? `\nExisting bridges: ${existingBridges.join('; ')}` : ''}

Suggest 2-3 potential bridge transitions that:
- Flow naturally between the stones
- Maintain narrative momentum
- Keep the audience engaged
- Build toward a climax`;

    } else if (mode === "sermon-structure") {
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

    } else if (mode === "generate-series-outline") {
      systemPrompt = `You are Jeeves, a Bible study expert specializing in creating Christ-centered, Palace-integrated lesson series. You design engaging, transformational series that teach people to see Jesus at the center of Scripture and apply Phototheology principles.

Return your response as valid JSON only.`;

      userPrompt = `Create a ${lessonCount}-lesson Bible study series with these parameters:

**Audience:** ${audienceType}
**Context:** ${context}
**Goal:** ${primaryGoal}
**Theme/Subject:** ${themeSubject}

Return ONLY valid JSON in this exact format:
{
  "outline": [
    {
      "lessonNumber": 1,
      "title": "Lesson title here",
      "bigIdea": "One-sentence summary",
      "keyPassages": "Scripture references",
      "corePoints": ["Point 1", "Point 2", "Point 3"],
      "christEmphasis": "How this lesson reveals Christ",
      "mainFloors": ["Floor 1 Name", "Floor 4 Name"],
      "keyRooms": ["Room code 1", "Room code 2"],
      "palaceActivity": "Hands-on Palace practice activity",
      "discussionQuestions": ["Question 1", "Question 2", "Question 3"]
    }
  ]
}

Guidelines:
- Each lesson builds on the previous
- Christ must be central to every lesson
- Include 2-3 Palace floors/rooms per lesson
- Activities should be practical and doable
- Questions should prompt deeper thinking
- Adjust tone/depth for the audience type
- Align with the stated goal and theme`;

    } else if (mode === "verse-assistant") {
      systemPrompt = `You are Jeeves, a friendly and insightful Bible study assistant for Phototheology.
Your role is to help friends understand Scripture deeply by applying specific study methods (rooms) and principles.

**CRITICAL FORMATTING REQUIREMENTS:**
- Format ALL responses in clear paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use bullet points (•) for lists
- Keep text easy to read and conversational
- Tone: Warm and conversational ("Ah, my friend" style, not overly formal)

Be warm and conversational, profound yet practical.`;

      const roomContext = roomTag !== "General" 
        ? `Using the ${roomName} (${roomTag}) method, which focuses on: ${roomPurpose}`
        : "Using general biblical analysis";

      userPrompt = `A friend is studying ${book} ${chapter}:${verse} and asks:

"${question}"

Verse text: "${verseText}"

${roomContext}

Provide a thoughtful response in clear paragraphs:

Paragraph 1-2: Directly answer their question

Paragraph 3: ${roomTag !== "General" ? `Apply the ${roomName} method to this verse` : "Apply sound biblical principles"}

Paragraph 4: Give 2-3 specific insights using bullet points:
• Insight 1
• Insight 2
• Insight 3

Paragraph 5: Include a practical takeaway or application

Paragraph 6: If relevant, suggest cross-references or connections

Be conversational, educational, and inspiring. Help them see deeper truth.`;

    } else if (mode === "generate-flashcards") {
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

    } else if (mode === "translate-verse") {
      // Translate verse into visual description using Phototheology Translation Room principles
      systemPrompt = `You are Jeeves, a Phototheology expert specializing in the Translation Room (TR).

The Translation Room translates abstract Scripture into concrete, memorable images following these principles:
- Words become pictures
- Verses become images
- Groups of verses become sequences
- Chapters become scenes
- Books become murals

Your task: When given a Bible verse reference, provide a vivid, concrete visual description that captures the essence of that verse as a memorable "word picture."

Guidelines:
- Be specific and visual (colors, textures, actions, emotions)
- Make it memorable and striking
- Stay faithful to the Scripture's meaning
- Use sensory details (sight, sound, touch)
- Keep descriptions 2-3 sentences maximum
- Focus on one central, powerful image

Example:
Input: "John 3:16"
Output: "A radiant Father figure extending His hand, holding a precious gift wrapped in golden light, reaching across a dark chasm toward countless silhouetted figures. The gift glows with eternal warmth, bridging the impossible distance."`;

      userPrompt = `Translate this verse into a vivid word picture: ${description}

Provide ONLY the visual description, no explanation or commentary.`;

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
    } else if (mode === "validate_chain") {
      // ChainWar game validation - properties already destructured from requestBody
      systemPrompt = `You are Jeeves, validating Chain War card combinations. Check if the player's chain of symbols logically connects to their verse and explanation.`;
      userPrompt = `Player played these cards: ${cards.join(', ')}
Verse: ${verse}
Explanation: ${explanation}

Is this a valid biblical chain? Does the verse fit? Does the explanation show real understanding?
Return JSON: { "valid": true/false, "feedback": "brief comment" }`;

    } else if (mode === "validate_sanctuary") {
      // SanctuaryRun game validation - properties already destructured from requestBody
      systemPrompt = `You are Jeeves, validating Sanctuary Run narratives. Check if the player's gospel story flows coherently through the sanctuary items.`;
      userPrompt = `Player used these sanctuary items in order: ${items.map((i: any) => i.name).join(' → ')}
Their narrative: ${narrative}

Does this form a coherent gospel story? Does each item fit its traditional meaning?
Return JSON: { "coherent": true/false, "feedback": "brief comment" }`;

    } else if (mode === "validate_time_zones") {
      // TimeZoneInvasion game validation - properties already destructured from requestBody
      systemPrompt = `You are Jeeves, validating Time Zone placements. Check if the player's zone choices make biblical sense.`;
      userPrompt = `Verse: ${verse}
Selected zones: ${zones.join(', ')}
Player's explanation: ${explanation}

Do these time zones apply to this verse? Is the explanation biblically sound?
Return JSON: { "quality": "excellent"/"good"/"weak", "feedback": "brief comment", "points": 0-2 }`;

    } else if (mode === "validate_connect6") {
      // Connect6Draft game validation - properties already destructured from requestBody
      systemPrompt = `You are Jeeves, validating Connect-6 doctrine proofs. Check if verses from different genres support the doctrine.`;
      userPrompt = `Doctrine: ${doctrine}
Genres used: ${genres.join(', ')}
Verse explanations: ${verses}

Do these verses from these genres actually support this doctrine?
Return JSON: { "valid": true/false, "feedback": "brief comment" }`;

    } else if (mode === "validate_christ") {
      // ChristLock game validation - properties already destructured from requestBody
      systemPrompt = `You are Jeeves, validating Christ-centered interpretations. Check if the player's explanation truly reveals Christ in the verse.`;
      userPrompt = `Christ card: ${card.name}
Verse: ${verse}
Player's answer: ${answer}

Does this genuinely reveal Christ in this verse? Is it biblical and profound?
Return JSON: { "reveals_christ": true/false, "feedback": "brief comment" }`;

    } else if (mode === "validate_controversy") {
      // ControversyRaid game validation - properties already destructured from requestBody
      systemPrompt = `You are Jeeves, validating spiritual warfare diagnoses. Check if the player's biblical diagnosis fits the modern issue.`;
      userPrompt = `Card used: ${card.name}
Modern issue: ${issue}
Player's diagnosis: ${diagnosis}

Is this a biblical diagnosis of this spiritual issue? Does the card principle apply?
Return JSON: { "captured": true/false, "feedback": "brief comment" }`;

    } else if (mode === "validate_dragon_defense") {
      // EscapeTheDragon game validation - properties already destructured from requestBody
      systemPrompt = `You are Jeeves, validating remnant defenses. Check if the player's theological defense answers the dragon's attack.`;
      userPrompt = `Dragon attack: ${attack}
Defense cards: ${cards.join(', ')}
Player's defense: ${defense}

Does this defense biblically answer the attack? Does it use the cards effectively?
Return JSON: { "survived": true/false, "feedback": "brief comment" }`;

    } else if (mode === "validate_equation") {
      // EquationBuilder game validation - properties already destructured from requestBody
      systemPrompt = `You are Jeeves, validating theological equations. Check if the player's equation is logically coherent and biblically sound.`;
      userPrompt = `Equation pieces: ${pieces.join(' ')}
Player's explanation: ${explanation}

Does this equation make theological sense? Is the explanation biblical?
Return JSON: { "valid": true/false, "feedback": "brief comment" }`;

    } else if (mode === "validate_witness") {
      // WitnessTrial game validation - properties already destructured from requestBody
      systemPrompt = `You are Jeeves, validating apologetics responses. Check if the player's biblical defense answers the objection convincingly.`;
      userPrompt = `Cards available: ${cards.join(', ')}
Objection: ${objection}
Player's defense: ${defense}

Does this defense use the cards? Does it answer the objection with Scripture?
Return JSON: { "convincing": true/false, "feedback": "brief comment" }`;

    } else if (mode === "validate_frame") {
      // FrameSnapshot game validation - properties already destructured from requestBody
      systemPrompt = `You are Jeeves, validating Frame Snapshot narratives. Check if the 4-part salvation story flows coherently.`;
      userPrompt = `Storyboard cards: ${storyboard.join(', ')}
Player's narrative: ${narrative}

Does this form a coherent 4-part salvation story using these frames?
Return JSON: { "coherent": true/false, "feedback": "brief comment" }`;

    } else if (mode === "generate_chef_verses") {
      // Generate random verses for Chef Challenge with proper KJV text from Bible API
      const { minVerses, maxVerses, difficulty } = requestBody;
      const numVerses = Math.floor(Math.random() * (maxVerses - minVerses + 1)) + minVerses;
      
      console.log(`=== GENERATING ${numVerses} CHEF VERSES (${difficulty} level) ===`);
      
      // Genealogy chapters to exclude (low context)
      const excludedChapters: Record<string, number[]> = {
        'Genesis': [5, 10, 11, 36], // Genealogies
        'Exodus': [6], // Genealogy section
        'Numbers': [1, 2, 3, 7, 26, 33], // Census lists and genealogies
        '1 Chronicles': [1, 2, 3, 4, 5, 6, 7, 8, 9], // Extensive genealogies
        'Ezra': [2, 8], // Lists of returnees
        'Nehemiah': [7, 11, 12], // Lists and genealogies
        'Matthew': [1], // Genealogy of Jesus
        'Luke': [3], // Genealogy of Jesus
        '1 Timothy': [1], // Partial - warning against genealogies
      };
      
      // Helper function to check if verse has meaningful content
      const hasGoodContext = (text: string): boolean => {
        // Remove verse numbers and extra spaces
        const cleanText = text.replace(/\d+/g, '').trim();
        
        // Verse must be at least 50 characters (roughly 8-10 words)
        if (cleanText.length < 50) return false;
        
        // Check if verse is mostly names (pattern: "X begat Y; and Y begat Z")
        const begatCount = (text.match(/begat|begot|son of|daughter of/gi) || []).length;
        if (begatCount >= 2) return false;
        
        // Check if verse contains mostly capitalized words (likely names)
        const words = cleanText.split(/\s+/);
        const capitalizedWords = words.filter(w => /^[A-Z][a-z]+/.test(w)).length;
        if (capitalizedWords / words.length > 0.6) return false;
        
        return true;
      };
      
      // All 66 books of the Bible
      const allBibleBooks = [
        'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
        'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
        '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther',
        'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
        'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
        'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
        'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
        'Matthew', 'Mark', 'Luke', 'John', 'Acts',
        'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
        'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
        '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
        'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
        'Jude', 'Revelation'
      ];
      
      // Shuffle books for random selection
      const shuffledBooks = allBibleBooks.sort(() => 0.5 - Math.random());
      
      const selectedVerses: Array<{ reference: string; text: string }> = [];
      const usedBooks = new Set<string>();
      
      // Iterate through shuffled books - ONLY 1 verse per book
      for (const book of shuffledBooks) {
        if (selectedVerses.length >= numVerses) break;
        if (usedBooks.has(book)) continue; // Already used this book
        
        // Query verses from this book in the database
        const { data: bookVerses, error } = await supabase
          .from('bible_verses_tokenized')
          .select('book, chapter, verse_num')
          .eq('book', book)
          .limit(100);
        
        if (!error && bookVerses && bookVerses.length > 0) {
          // Filter out excluded chapters
          const validVerses = bookVerses.filter(v => {
            const excludedForBook = excludedChapters[book] || [];
            return !excludedForBook.includes(v.chapter);
          });
          
          if (validVerses.length === 0) continue;
          
          // Try up to 5 times to find a good verse from this book
          let attempts = 0;
          let verseAdded = false;
          
          while (attempts < 5 && !verseAdded) {
            attempts++;
            const randomVerse = validVerses[Math.floor(Math.random() * validVerses.length)];
            
            // Fetch the actual English text from Bible API
            try {
              const bibleApiUrl = `https://bible-api.com/${encodeURIComponent(book)}+${randomVerse.chapter}:${randomVerse.verse_num}?translation=kjv`;
              console.log(`Fetching: ${bibleApiUrl}`);
              
              const response = await fetch(bibleApiUrl);
              if (response.ok) {
                const data = await response.json();
                const verseText = data.text?.trim().replace(/\n/g, ' ');
                
                // Check if verse has good context
                if (verseText && hasGoodContext(verseText)) {
                  selectedVerses.push({
                    reference: `${book} ${randomVerse.chapter}:${randomVerse.verse_num}`,
                    text: verseText
                  });
                  usedBooks.add(book);
                  verseAdded = true;
                  console.log(`✓ Added verse from ${book} (attempt ${attempts})`);
                } else {
                  console.log(`⚠ Skipped low-context verse from ${book} ${randomVerse.chapter}:${randomVerse.verse_num}`);
                }
              } else {
                console.warn(`Failed to fetch ${book} ${randomVerse.chapter}:${randomVerse.verse_num}, status: ${response.status}`);
              }
            } catch (err) {
              console.error(`Error fetching verse from ${book}:`, err);
            }
          }
          
          if (!verseAdded) {
            console.warn(`⚠ Could not find good verse from ${book} after ${attempts} attempts`);
          }
        }
      }
      
      console.log(`Generated ${selectedVerses.length} verses from ${usedBooks.size} different books`);
      console.log(`Books used:`, Array.from(usedBooks));
      
      if (selectedVerses.length < numVerses) {
        return new Response(
          JSON.stringify({ 
            error: `Only found ${selectedVerses.length} verses. Bible API may be rate limiting.`,
            verses: selectedVerses 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      return new Response(
        JSON.stringify({ verses: selectedVerses }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (mode === "check_chef_recipe") {
      // Check player's Chef Challenge recipe
      const { recipe, verses, difficulty } = requestBody;
      
      console.log(`=== CHECKING CHEF RECIPE (${difficulty} level) ===`);
      
      const verseRefs = verses.map((v: any) => v.reference).join(', ');
      
      systemPrompt = `You are Jeeves, evaluating a creative Bible study. Student had ${verses.length} random, unrelated verses to tie together.

**IMPORTANT:** Verses can be analyzed in ANY ORDER - there is no requirement to follow the sequence given. Students may rearrange verses to best support their theological connections.

${THEOLOGICAL_REASONING}

**CRITICAL: If you mention Phototheology codes, you MUST ONLY use these approved codes:**
Floor 1: 24, BR, GR, IR, SR, TR
Floor 2: DC, OR, QA, QB, ST
Floor 3: BF, HF, LR, NF, PF
Floor 4 Rooms: CR, C6, DR, FRT, ∥, ≈, TRM, TZ
Floor 4 Dimensions: 1D, 2D, 3D, 4D, 5D
Floor 4 Connect-6: Ep, Go, Hi, Pa, Po, Pr
Floor 4 Theme: \\G, |GC, \\H, |LC, |S, |TP
Floor 4 Time Zones: Ef, En, Epa, Hf, Hpa, Hp
Floor 4 Fruit: -f, -ge, -g, -j, -ls, -lv, -m, -p, -t
Floor 5: BL, CEC, FE, PR, R66, 3A
Floor 5 Sanctuary: SAN-ALT, SAN-INCENSE, SAN-ARK, SAN-LAMP, SAN-LAVER, SAN-BREAD
Floor 5 Prophecy: @120, @1260, @2300, @400, @70w, @70y
Floor 5 Angels: 3AM-1, 3AM-2, 3AM-3
Floor 5 Feasts: FE-AT, FE-FI, FE-PA, FE-PE, FE-TA, FE-TR, FE-UN
Floor 6: DoL¹/NE¹, DoL²/NE², DoL³/NE³
Floor 6 Cycles: @Ab, @Ad, @Cy, @Sp, @Mo, @No, @Re, @Se
Floor 6 Rooms: 8C, JR
Floor 7: FRM, MR, SRM

**NEVER use codes like "CH", "NC", "Grace", "New Creation", "Christ" as codes - these are NOT valid!**

Grade on:
1. **Master Thesis** - Did they establish a clear unifying thesis?
2. **Logical Structure** - Does it follow the progression: God's Foundation → Human Condition → Divine Response → Human Consequence → Redemptive Hope?
3. **Verse Integration** - Did they explain each verse's plain meaning and connection to the thesis?
4. **Bridge Quality** - Are transitions explicit causal logic ("because/therefore"), not vague ("this reminds us")?
5. **Scripture Anchoring** - Are connections supported by cross-references, typology, or patterns?
6. **Theological Conclusion** - Does it synthesize with a clear doctrinal insight?
7. **Verse Compliance** - Did they ONLY use verses provided? (No adding extra verses!)

Be encouraging but point out where reasoning could be strengthened. Use emojis.

Return ONLY valid JSON:
{"rating":1-5,"feedback":"2-3 sentences highlighting thesis quality, logical flow, and areas for improvement"}`;
      
      userPrompt = `Verses given: ${verseRefs}
Difficulty: ${difficulty}

Student's Recipe:
${recipe}

Evaluate this creative connection.`;

    } else if (mode === "get_chef_model_answer") {
      // Get model answer for Chef Challenge
      const { verses, difficulty } = requestBody;
      
      console.log(`=== GENERATING MODEL ANSWER (${difficulty} level) ===`);
      
      const verseRefs = verses.map((v: any) => v.reference).join(', ');
      
      systemPrompt = `You are Jeeves, demonstrating how to creatively tie random, unrelated Bible verses into a cohesive, theologically precise Bible study.

**IMPORTANT:** You can analyze and present verses in ANY ORDER that best supports your theological connections. Rearrange freely to create the strongest narrative flow.

${THEOLOGICAL_REASONING}

**CRITICAL: If you mention Phototheology codes, you MUST ONLY use these approved codes:**
Floor 1: 24, BR, GR, IR, SR, TR
Floor 2: DC, OR, QA, QB, ST
Floor 3: BF, HF, LR, NF, PF
Floor 4 Rooms: CR, C6, DR, FRT, ∥, ≈, TRM, TZ
Floor 4 Dimensions: 1D, 2D, 3D, 4D, 5D
Floor 4 Connect-6: Ep, Go, Hi, Pa, Po, Pr
Floor 4 Theme: \\G, |GC, \\H, |LC, |S, |TP
Floor 4 Time Zones: Ef, En, Epa, Hf, Hpa, Hp
Floor 4 Fruit: -f, -ge, -g, -j, -ls, -lv, -m, -p, -t
Floor 5: BL, CEC, FE, PR, R66, 3A
Floor 5 Sanctuary: SAN-ALT, SAN-INCENSE, SAN-ARK, SAN-LAMP, SAN-LAVER, SAN-BREAD
Floor 5 Prophecy: @120, @1260, @2300, @400, @70w, @70y
Floor 5 Angels: 3AM-1, 3AM-2, 3AM-3
Floor 5 Feasts: FE-AT, FE-FI, FE-PA, FE-PE, FE-TA, FE-TR, FE-UN
Floor 6: DoL¹/NE¹, DoL²/NE², DoL³/NE³
Floor 6 Cycles: @Ab, @Ad, @Cy, @Sp, @Mo, @No, @Re, @Se
Floor 6 Rooms: 8C, JR
Floor 7: FRM, MR, SRM

**NEVER use codes like "CH", "NC", "Grace", "New Creation", "Christ" as codes - these are NOT valid!**

Requirements:
- **ESTABLISH MASTER THESIS FIRST** - State your unifying thesis in one clear sentence
- **CATEGORIZE ALL VERSES** - Assign each to Wisdom/Warning/Divine Presence/Historical Memory/Human Response/Promise
- **BUILD LOGICAL FLOW** - Arrange: God's Foundation → Human Condition → Divine Response → Human Consequence → Redemptive Hope
- **EXPLAIN EACH VERSE PRECISELY** - Plain meaning + how it fits thesis + how it bridges to next verse
- **USE EXPLICIT CAUSAL LOGIC** - "Because ___, therefore ___", not vague "this reminds us"
- **ANCHOR IN SCRIPTURE** - Support with cross-references, typology, patterns
- **END WITH SYNTHESIS** - Clear doctrinal insight that feels inevitable
- Use ALL ${verses.length} verses naturally
- Keep 3-4 paragraphs
- Use emojis sparingly

Return ONLY valid JSON:
{"modelAnswer":"your theologically precise narrative with master thesis, categorized verses, logical flow, and strong synthesis"}`;
      
      userPrompt = `Create a ${difficulty}-level Bible study connecting these random verses: ${verseRefs}`;

    } else if (mode === "validate_chef_recipe") {
      // Legacy Chef Challenge validation - properties already destructured from requestBody
      systemPrompt = `You are Jeeves, the head chef validating biblical recipes. Check creativity, biblical accuracy, and thematic fit.`;
      userPrompt = `Recipe theme: ${theme}
Difficulty: ${difficulty}
Player's recipe: ${recipe}

Is this creative? Are the biblical ingredients and instructions meaningful? Does it fit the theme?
Return JSON: { "approved": true/false, "rating": 1-5, "feedback": "brief comment" }`;

    } else if (mode === "qa") {
      // Q&A mode for "Ask Jeeves" in rooms - properties already destructured from requestBody
      const { conversationHistory } = requestBody;
      
      systemPrompt = `You are Jeeves, ${greeting}'s enthusiastic study partner helping them understand Scripture with clarity and depth through Phototheology.

${THEOLOGICAL_REASONING}

**YOUR APPROACH:**
- Use ${greeting}'s name naturally throughout your response (2-3 times) to create connection
- Keep it conversational and personable—like discussing Scripture with a friend over coffee
- Provide clear, insightful answers with biblical depth
- Use the Palace framework when relevant to structure understanding
- Include verse references and quotations
- Apply Phototheology principles to illuminate the text
- Use phrases like "Great question, ${greeting}!", "${greeting}, here's what I'm seeing", "I think you'll find this helpful, ${greeting}"
- NEVER use overly formal phrases like "My dear student", "My dear Sir", "Ah sir"

**CRITICAL FORMATTING REQUIREMENTS:**
- Format ALL responses in clear paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use bullet points (•) for lists
- Keep text easy to read and conversational
- Remember the conversation context and build on previous questions
      
${PALACE_SCHEMA}`;
      
      const contextSection = context ? `

**STUDY CONTEXT:**
${context}

Incorporate this context into your answer when relevant.` : '';

      const historySection = conversationHistory && conversationHistory.length > 0 ? `

**CONVERSATION HISTORY:**
${conversationHistory.map((msg: any) => `${msg.role === 'user' ? 'Student' : 'Jeeves'}: ${msg.content}`).join('\n\n')}

Use this conversation history to provide contextual answers that build on previous discussion.` : '';
      
      userPrompt = `A student asks: "${question}"${contextSection}${historySection}

Provide a clear, insightful answer with depth and biblical grounding:

**Paragraph 1 - Direct Answer:**
Directly address their question${context ? ' in light of their study context' : ''}${historySection ? ' and previous conversation' : ''}. Be specific and clear.

**Paragraph 2 - Biblical Foundation:**
Provide biblical references with verse quotations. Show what Scripture actually says on this topic.

**Paragraph 3 - Palace Principles Application:**
Apply relevant Phototheology principles when helpful. Use bullet points if listing multiple:
• Principle 1 with explanation
• Principle 2 with explanation

**Paragraph 4 - Practical Application & Encouragement:**
Connect the answer to spiritual formation and daily life. Provide encouragement and next steps.

Keep it conversational, practical, and biblically rich. Aim for 300-500 words with depth.`;
    } else if (mode === "research") {
      // Research mode - scholarly deep dive
      const { conversationHistory } = requestBody;
      
      console.log('Research mode activated for question:', question);
      
      systemPrompt = `You are Jeeves, ${greeting}'s scholarly study partner providing in-depth, academically rigorous, and historically informed research that traces concepts through time and intertwines them with biblical prophecy.

**YOUR EXPERTISE:**
- Biblical prophecy and apocalyptic literature (Daniel, Revelation, etc.)
- Historical theology and church history
- Adventist prophetic interpretation and pioneer perspectives
- Historical connections between religion, politics, and social movements
- Original languages (Hebrew, Greek) and biblical exegesis
- Typology, patterns, and prophetic symbols
- The Great Controversy theme across history
- Social justice and biblical righteousness

**RESEARCH MODE MANDATE:**
- Use ${greeting}'s name naturally throughout (2-3 times) to maintain personal connection in this scholarly work
- Keep tone warm and engaging even while being scholarly—like discussing research with an enthusiastic colleague
- Use phrases like "Hey ${greeting}, this is fascinating", "${greeting}, let's trace this through history", "I think you'll find this really interesting, ${greeting}"
- NEVER use overly formal phrases like "My dear student", "My dear Sir", "Ah sir"
- Provide COMPREHENSIVE, multi-layered scholarly analysis (aim for 1000-2000 words minimum for complex topics)
- TRACE historical concepts through time with specific dates, events, and sources
- INTERTWINE biblical prophecy with historical fulfillment
- Include biblical cross-references with verse quotations
- Reference SDA pioneers (e.g., Uriah Smith, James White, Ellen White, J.N. Andrews) when discussing prophetic interpretation
- Examine original languages when applicable
- Consider multiple theological perspectives while maintaining biblical fidelity
- Connect historical movements to their biblical and prophetic context
- Apply Phototheology Palace framework throughout

**CRITICAL DEPTH REQUIREMENTS:**
When discussing historical-theological topics:
1. **Historical Tracing:** Follow concepts chronologically with specific dates and key figures
2. **Theological Interweaving:** Show how biblical texts connect to historical events
3. **Prophetic Fulfillment:** Identify where prophecy meets history
4. **SDA Pioneer Perspective:** Include how early Adventist scholars understood these connections
5. **Contemporary Application:** Bring insights forward to today
6. **Scholarly Rigor:** Use proper academic language while remaining accessible

**FORMATTING REQUIREMENTS:**
- Use clear section headers (## for main sections, ### for subsections)
- Format responses in well-structured paragraphs (3-5 sentences each)
- Use bullet points (•) for detailed lists
- Include **bold** for emphasis on key terms and concepts
- Use > blockquotes for important quotations
- Reference biblical passages: Book Chapter:Verse format
- Separate major sections with blank lines for readability
      
${THEOLOGICAL_REASONING}

${PALACE_SCHEMA}`;
      
      const contextSection = context ? `

**STUDY CONTEXT:**
${context}

Weave this study context throughout your analysis, showing how it connects to the broader research question.` : '';

      const historySection = conversationHistory && conversationHistory.length > 0 ? `

**CONVERSATION HISTORY:**
${conversationHistory.map((msg: any) => `${msg.role === 'user' ? 'Student' : 'Jeeves'}: ${msg.content}`).join('\n\n')}

Build upon and reference previous scholarly discussion. Show how this new question extends or deepens the conversation.` : '';
      
      userPrompt = `Research Question: "${question}"${contextSection}${historySection}

Provide a comprehensive, scholarly, and historically grounded response with this detailed structure:

## I. Opening Context (2-3 paragraphs)
- Acknowledge the depth and importance of the question
- Provide a roadmap of what will be covered
- Establish the biblical and historical framework

## II. Biblical Foundation (Comprehensive Analysis)
### A. Primary Texts
- Quote and exegete key biblical passages in full
- Examine original language insights (Hebrew/Greek)
- Apply Phototheology principles (CR - Christ-Centered, DR - 5 Dimensions, BL - Sanctuary connections)

### B. Cross-References & Intertextual Connections  
- Trace the theme through multiple books of the Bible
- Show typological patterns and prophetic parallels
- Use P‖ (Parallels) and PRm (Patterns) principles

## III. Historical Development & Fulfillment
### A. Chronological Tracing (Be Specific)
- Trace concepts from biblical times through history with dates
- Identify key historical figures, movements, and events
- Show how prophecy has been fulfilled in history

### B. Theological-Historical Interweaving
- Connect biblical prophecy to historical events
- Show how religious movements shaped and were shaped by Scripture
- Examine both faithful and perverted Christianity through history

## IV. SDA Pioneer Perspective (When Relevant)
- Quote or reference early Adventist scholars' understanding
- Show how pioneers connected prophecy to their historical context
- Apply their interpretive principles to today

## V. Contemporary Relevance & Application
- Connect historical patterns to present-day realities
- Apply prophetic warnings to current situations
- Provide practical spiritual applications

## VI. Synthesis & Key Insights
- Summarize the major threads woven together
- Highlight the most important takeaways (5-7 points)
- Show how everything connects to the Great Controversy theme

## VII. Further Study
- Suggest related biblical passages for deeper exploration
- Recommend specific Palace rooms for continued study
- Pose 2-3 questions for further reflection

**LENGTH EXPECTATION:** For complex historical-theological topics, provide 1500-2500 words. Show your work. Trace the threads. Intertwine the concepts. Be scholarly but accessible. This is deep research mode—give them the depth they're asking for.`;
    } else if (mode === "sermon_titles") {
      // Generate sermon title ideas
      systemPrompt = `You are Jeeves, a creative sermon title expert for preachers and teachers.

Generate compelling, memorable sermon titles that:
- Connect to biblical truth
- Create curiosity and interest
- Are relevant to contemporary life
- Are clear and memorable
- Include scripture references that support the theme

Return ONLY valid JSON with no markdown, no code blocks, no backticks.`;

      userPrompt = `Generate 5 creative, diverse sermon titles.

For each title, provide:
- A compelling sermon title
- A brief description (1-2 sentences) of the sermon's focus
- 2-3 suggested scripture references that support this theme
- 1-2 relevant tags (e.g., "grace", "faith", "relationships", "hope", "perseverance")

Return ONLY a JSON object with this exact structure:
{
  "titles": [
    {
      "title": "string",
      "description": "string",
      "scripture_references": ["string", "string"],
      "tags": ["string", "string"]
    }
  ]
}

Make the titles diverse, covering different themes and biblical books. Be creative and engaging.`;

    } else if (mode === "branch_study") {
      // BranchStudy mode - interactive branching Bible study
      const { action, verseReference, anchorText, usedVerses, usedRooms, userResponse, conversationHistory, studyMode, level = 'easy' } = requestBody;
      
      console.log("=== BRANCH STUDY REQUEST ===");
      console.log("Action:", action);
      console.log("Study Mode:", studyMode);
      console.log("Difficulty Level:", level);
      console.log("Verse/Story:", verseReference || anchorText);
      
      if (action === "start") {
        // Starting a new branch study
        const isJeevesLed = studyMode === "jeeves-led";
        
        const levelInstructions = {
          easy: 'Choose verses that follow the general theme and topic of the anchor text. Make connections clear and intuitive.',
          intermediate: 'Choose verses that relate to the theme but require some thought to connect. Mix obvious and subtle connections.',
          pro: 'Choose verses that are tangentially related - same keywords or concepts but from different contexts. Connections require deeper analysis.',
          master: 'Choose verses that appear COMPLETELY RANDOM - from vastly different books, genres, and contexts. The student must work hard to find any connection at all.'
        };

        systemPrompt = `You are Jeeves running BranchStudy, a branching Bible study mode. Stay in Bible exposition, theology, and application—no fictional role-play.

The user has provided an anchor text: ${verseReference}
Difficulty Level: ${level.toUpperCase()}

This may be a verse reference (e.g., "John 3:16") OR a story/parable name (e.g., "Parable of the Wheat and Tares", "Good Samaritan", "David and Goliath").

${isJeevesLed ? `
JEEVES-LED MODE: You are the teacher. The user ONLY chooses paths. NEVER ask for user thoughts or reflections.

Your task:
1. Identify and locate the text:
   - If it's a verse reference, quote it in full
   - If it's a story/parable name, identify the biblical location(s) and provide a brief summary
2. Provide 2-3 paragraphs of rich teaching using PT rooms/principles:
   - Historical/literary context
   - Key elements and their significance
   - Main theological point (Christ-centered)
3. IMMEDIATELY present the choice in EXACT format:

**Choose your next branch:**

A. Cross-reference verses
B. Palace principles

Type A or B to continue.

CRITICAL: Use exactly this format. NO reflection questions. NO asking what they think.
` : `
TRADITIONAL MODE: Interactive study with user reflection.

Your task:
1. Identify and locate the text:
   - If it's a verse reference, quote it in full
   - If it's a story/parable name, identify the biblical location(s) and provide a brief summary
2. Provide concise exposition in 2-3 paragraphs
3. Ask 1-3 reflection/application questions for the user to consider
4. End with: "Take a moment to reflect on these questions. When you're ready, share your thoughts and I'll offer you paths to explore further."
`}

VERSE SELECTION STRATEGY (for when user chooses verses):
${levelInstructions[level as keyof typeof levelInstructions]}

Keep a warm, pastoral tone. Be clear about sin, judgment, and grace.`;

        userPrompt = `Begin a BranchStudy session with the anchor text: ${verseReference}

Note: This may be a specific verse reference or a story/parable name. If it's a story, identify where it's found in Scripture and provide context.

${isJeevesLed ? 'Teach richly using PT principles, then IMMEDIATELY present the A/B choice in EXACT format shown above. NO reflection questions.' : 'Provide exposition and reflection questions. Do NOT offer verse/principle options yet.'}`;
        
        console.log("Starting new BranchStudy with:", verseReference);
        console.log("System prompt length:", systemPrompt.length);
        console.log("User prompt:", userPrompt);
        
      } else if (action === "select_option") {
        // User has selected an option (A, B, C, D, or E)
        const selectedOption = userResponse.trim().toUpperCase();
        const isJeevesLed = studyMode === "jeeves-led";
        
        // Determine if user selected from 2-option branch or 5-option selection
        const lastAssistantMessage = conversationHistory && conversationHistory.length > 0 
          ? conversationHistory[conversationHistory.length - 1]?.content || ""
          : "";
        
        const optionCount = (lastAssistantMessage.match(/^[A-E]\./gm) || []).length;
        const isSelectingBranch = optionCount === 2; // User chose from A/B branch
        const isSelectingSpecific = optionCount === 5; // User chose from A-E options
        
        // Extract all previously presented verses and principles to avoid repetition
        const conversationText = conversationHistory?.map((m: any) => m.content).join('\n') || '';
        const presentedVerses = new Set<string>();
        const presentedPrinciples = new Set<string>();
        
        // Extract verse references (e.g., "Genesis 1:1", "John 3:16")
        const verseMatches = conversationText.matchAll(/([A-Z][a-z]+(?: [A-Z][a-z]+)*) (\d+):(\d+)/g);
        for (const match of verseMatches) {
          presentedVerses.add(`${match[1]} ${match[2]}:${match[3]}`);
        }
        
        // Extract room codes (e.g., "SR", "CR", "BL")
        const roomMatches = conversationText.matchAll(/\b([A-Z]{2,4})\b \(/g);
        for (const match of roomMatches) {
          presentedPrinciples.add(match[1]);
        }
        
        const avoidanceList = {
          verses: Array.from(presentedVerses),
          principles: Array.from(presentedPrinciples)
        };
        
        console.log(`Previous message had ${optionCount} options. isSelectingBranch: ${isSelectingBranch}, isSelectingSpecific: ${isSelectingSpecific}`);
        console.log('Previously presented verses:', avoidanceList.verses);
        console.log('Previously presented principles:', avoidanceList.principles);
        
        const levelInstructions = {
          easy: 'Choose verses that follow the general theme and topic of the anchor text. Make connections clear and intuitive.',
          intermediate: 'Choose verses that relate to the theme but require some thought to connect. Mix obvious and subtle connections.',
          pro: 'Choose verses that are tangentially related - same keywords or concepts but from different contexts. Connections require deeper analysis.',
          master: 'Choose verses that appear COMPLETELY RANDOM - from vastly different books, genres, and contexts. The student must work hard to find any connection at all.'
        };

        systemPrompt = `You are Jeeves running BranchStudy. The anchor text is: ${anchorText}
Difficulty Level: ${level.toUpperCase()}

Already used verses: ${(usedVerses || []).join(', ')}
Already used Palace rooms: ${(usedRooms || []).join(', ')}

The user selected option ${selectedOption} from your previous set of options.

${isJeevesLed ? `
JEEVES-LED MODE: You teach, user chooses paths. NO reflection questions ever.

${isSelectingBranch ? `**User chose from A/B branch - Present 5 options:**

**CRITICAL: AVOID REPETITION**
Already presented verses: ${avoidanceList.verses.length > 0 ? avoidanceList.verses.join(', ') : 'none yet'}
Already presented principles: ${avoidanceList.principles.length > 0 ? avoidanceList.principles.join(', ') : 'none yet'}
YOU MUST choose completely NEW and DIFFERENT verses/principles that have NOT been presented before in this study.

${selectedOption === 'A' ? `If VERSES:
VERSE SELECTION STRATEGY: ${levelInstructions[level as keyof typeof levelInstructions]}

Format (MUST include full verse text):
A. [Book Chapter:Verse] "[Full verse text quoted]"
B. [Book Chapter:Verse] "[Full verse text quoted]"
C. [Book Chapter:Verse] "[Full verse text quoted]"
D. [Book Chapter:Verse] "[Full verse text quoted]"
E. [Book Chapter:Verse] "[Full verse text quoted]"

Example:
A. Proverbs 3:5 "Trust in the LORD with all thine heart; and lean not unto thine own understanding."` : `If PRINCIPLES:
Present 5 Palace rooms/principles showing how they unlock this anchor text.

**CRITICAL SPECIFICITY REQUIREMENT:**
- For rooms with multiple principles, you MUST specify the EXACT principle from the lists below.
- NEVER invent new sub-principles that aren't on these lists.

**EXACT VALID SUB-PRINCIPLES (use ONLY these):**
- DR (Dimensions): Literal, Christ, Me, Church, Heaven
- C6 (Connect-6): Prophecy, Parable, Epistle, History, Gospel, Poetry
- TZ (Time Zone): 1H, 2H, 3H, Earth-Past, Earth-Present, Earth-Future, Heaven-Past, Heaven-Present, Heaven-Future
- TRm (Theme Room): Life of Christ Wall, Sanctuary Wall, Time Prophecy Wall, Great Controversy Wall, Heaven Ceiling, Gospel Floor

**Examples (showing CORRECT format):** 
  - "A. (DR - Me) (Dimensions Room - Me Application)" NOT just "(DR)"
  - "B. (C6 - Prophecy) (Connect-6 - Prophecy Genre)" NOT "(C6 - Divine Attributes)" ← WRONG, not a real principle!
  - "C. (TZ - 1H) (Time Zone - First Heaven)" NOT just "(TZ)"
  - "D. (TRm - Sanctuary Wall) (Theme Room - Sanctuary Wall)" NOT just "(TRm)"
  - "E. (@Mo) (Mosaic Cycle)" ← single-principle rooms remain as is

Format for multi-principle rooms: "A. ([ROOM] - [Specific Principle]) ([Room Name] - [Specific Application]) - Brief explanation..."
Format for single-principle rooms: "A. ([ROOM]) ([Room Name]) - Brief explanation..."

A. [Room with specifics] - [How it applies]
B. [Room with specifics] - [How it applies]
C. [Room with specifics] - [How it applies]
D. [Room with specifics] - [How it applies]
E. [Room with specifics] - [How it applies]`}

Choose A, B, C, D, or E.` : ''}

${isSelectingSpecific ? `**User chose from A-E options - Teach and present NEW branch:**

1. Begin: "Excellent choice. Here's the connection..."
2. TEACH deeply on this connection (2-3 paragraphs minimum) - explain how this verse/principle connects to the anchor text using PT principles
   **IMPORTANT:** If teaching a principle, be SPECIFIC about which aspect you're exploring and ONLY use valid sub-principles:
   - For DR: Literal, Christ, Me, Church, or Heaven
   - For C6: Prophecy, Parable, Epistle, History, Gospel, or Poetry (NOT "Divine Attributes" or other invented categories)
   - For TZ: Specific heaven/time combination
   - For TRm: Specific wall/floor from the valid list
3. Then present NEW branch:

**Choose your next branch:**

A. Cross-reference verses
B. Palace principles

Type A or B to continue.` : ''}

Make connections clear and Christ-centered. NO user reflection questions.
` : `
TRADITIONAL MODE: The user is responding to your questions.

Your task:
1. Acknowledge their selection of option ${selectedOption} (1 sentence)
2. Provide a brief comment on what that option reveals (2-3 sentences)
3. Offer 5 new labeled options (A, B, C, D, E) to continue exploring

Keep it conversational but let the user do more of the reflection.
`}

Available Palace rooms (avoid repeating): Story Room (SR), Imagination Room (IR), Observation Room (OR), Def-Com Room (DC), Symbols/Types (@T), Questions Room (?), Concentration Room (CR), Dimensions Room (DR), Connect 6 (C6), Patterns (PRm), Parallels (P‖), Fruit Room (FRt), Blue/Sanctuary (BL), Prophecy (PR), Three Angels (3A), Fire Room (FRm), Meditation (MR)`;

        // Build messages from conversation history
        const messages = [];
        if (conversationHistory && Array.isArray(conversationHistory)) {
          conversationHistory.forEach((msg: any) => {
            messages.push({
              role: msg.role,
              content: msg.content
            });
          });
        }
        
        // Add current selection
        messages.push({
          role: "user",
          content: `I choose ${selectedOption}`
        });
        
        userPrompt = messages.map((m: any) => m.content).join('\n\n');
        
      } else if (action === "continue") {
        // Continuing an existing study (user is responding with their own thoughts, not selecting an option)
        const isSummaryRequest = /\b(summarize|end|turn this into a study)\b/i.test(userResponse);
        const isJeevesLed = studyMode === "jeeves-led";
        
        if (isSummaryRequest) {
          systemPrompt = `You are Jeeves running BranchStudy. The anchor text is: ${anchorText}

Already used verses: ${(usedVerses || []).join(', ')}
Already used Palace rooms: ${(usedRooms || []).join(', ')}

The user has requested a summary. Provide:
1. Summary of the path (anchor + branches chosen)
2. Short, Christ-centered synthesis of the main doctrine
3. A teaching outline with:
   - Title
   - Key texts
   - 3-5 main points
   - 3-5 discussion questions
   - 1-2 life applications

Format this as a complete Bible study that could be used with others.`;
        } else {
          systemPrompt = `You are Jeeves running BranchStudy. The anchor text is: ${anchorText}

Already used verses: ${(usedVerses || []).join(', ')}
Already used Palace rooms: ${(usedRooms || []).join(', ')}

${isJeevesLed ? `
JEEVES-LED MODE: User responded. Determine what they chose.

**If they typed A or B (branch choice):**
They want ${userResponse.toUpperCase() === 'A' ? 'verses' : 'principles'}. Provide 5 options:

${userResponse.toUpperCase() === 'A' ? `
CRITICAL: Choose RANDOM verses from different books that DON'T obviously connect.
- Pick from diverse genres (law, poetry, wisdom, prophecy, gospels, epistles)
- Avoid obvious thematic matches
- Choose verses that seem unrelated at first glance

Format EXACTLY:
A. [Book Chapter:Verse] "[Full verse text in quotes]"
B. [Book Chapter:Verse] "[Full verse text in quotes]"
C. [Book Chapter:Verse] "[Full verse text in quotes]"
D. [Book Chapter:Verse] "[Full verse text in quotes]"
E. [Book Chapter:Verse] "[Full verse text in quotes]"

Example:
A. Proverbs 3:5 "Trust in the LORD with all thine heart; and lean not unto thine own understanding."
` : `
Format EXACTLY:
A. [Room Code] ([Room Name]) - [Brief how it applies]
B. [Room Code] ([Room Name]) - [Brief how it applies]
etc.
`}

**If they chose A-E (specific option):**
Teach deeply on that choice, then present new A/B branch.
` : `
TRADITIONAL MODE: Acknowledge their reflection, then offer A/B paths.
`}

Available Palace rooms to choose from (avoid already used ones): Story Room (SR), Imagination Room (IR), Observation Room (OR), Def-Com Room (DC), Symbols/Types (@T), Questions Room (?), Concentration Room (CR), Dimensions Room (DR), Connect 6 (C6), Patterns (PRm), Parallels (P‖), Fruit Room (FRt), Blue/Sanctuary (BL), Prophecy (PR), Three Angels (3A), Fire Room (FRm), Meditation (MR)

When presenting options, clearly label them A, B, and C. Be clear about which type you're offering (verses OR rooms, not both in the same set of 3).

Keep responses focused and pastoral. Avoid repetition of already-used verses and rooms.`;
        }
        
        // Build messages from conversation history
        const messages = [];
        if (conversationHistory && Array.isArray(conversationHistory)) {
          conversationHistory.forEach((msg: any) => {
            messages.push({
              role: msg.role,
              content: msg.content
            });
          });
        }
        
        // Add current user response
        messages.push({
          role: "user",
          content: userResponse
        });
        
        userPrompt = messages.map((m: any) => m.content).join('\n\n');
      }

    } else if (mode === "room-insight-chat") {
      // Room Insight Chat mode - for asking questions about specific room analysis
      const { roomCode, roomName, roomContent, conversationHistory } = requestBody;
      
      systemPrompt = `You are Jeeves, a wise Bible study assistant helping students understand Phototheology room insights.

**CONTEXT:**
You are having a conversation about the ${roomName} (${roomCode}) analysis of ${book} ${chapter}:${verse}.

**THE ROOM INSIGHT BEING DISCUSSED:**
${roomContent}

**YOUR ROLE:**
- Answer questions specifically about this room's insight
- Help students understand the connections and implications
- Reference the original verse: "${verseText}"
- Keep responses clear, concise (2-3 paragraphs max)
- Use emojis appropriately (📖 ✨ 🔍 💡 etc.)
- Format with clear paragraph breaks

**FORMATTING:**
- Use bullet points (•) for lists
- Separate paragraphs with blank lines
- Be conversational and encouraging`;

      // Build conversation context
      const conversationMessages = [
        { role: "system", content: systemPrompt }
      ];
      
      // Add conversation history if exists
      if (conversationHistory && Array.isArray(conversationHistory)) {
        conversationHistory.forEach((msg: any) => {
          conversationMessages.push({
            role: msg.role,
            content: msg.content
          });
        });
      }
      
      // Add current question
      conversationMessages.push({
        role: "user",
        content: question
      });
      
      // Use the conversation messages in the API call
      const chatResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: conversationMessages,
          temperature: 0.8,
        }),
      });

      if (!chatResponse.ok) {
        if (chatResponse.status === 429) {
          return new Response(
            JSON.stringify({ error: "Too many requests. Please try again in a few minutes." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        throw new Error("Failed to get response from AI");
      }

      const chatData = await chatResponse.json();
      const responseContent = chatData.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
      
      return new Response(
        JSON.stringify({ response: responseContent }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (mode === "encyclopedia") {
      // Bible Encyclopedia mode - comprehensive lookup of biblical content
      systemPrompt = `You are a comprehensive Bible Encyclopedia assistant with deep knowledge of biblical scholarship and church history across multiple traditions.

**CATEGORY:** ${category}
**QUERY:** ${query}

**YOUR ROLE:**
- Provide comprehensive, accurate biblical information based on Scripture
- Use a historicist approach to prophecy (continuous fulfillment through history)
- Emphasize Christ-centered interpretation and the Great Controversy theme
- Reference specific Bible passages (book, chapter, verse)
- Present information in clear, organized sections
- Be scholarly yet accessible
- Include historical context from church history (Protestant, Catholic, Jewish, Islamic history when relevant)

**FORMATTING RULES - VERY IMPORTANT:**
🚫 DO NOT use markdown symbols (#, ##, *, **, etc.)
✅ DO use plain text with:
   • Emojis for section headers (📖 for scripture, 🏛️ for history, 🌟 for significance, etc.)
   • Bullet points (•) for lists
   • Clear line breaks between sections
   • Bold text only through natural emphasis, not markdown

**STRUCTURE YOUR RESPONSE:**

[Emoji] Section Title
Content here with natural emphasis
• Key point one
• Key point two
• Key point three

[Another Emoji] Next Section
More content...

**HISTORICAL CONTEXT:**
When relevant, include historical development:
⛪ Early Church period (1st-5th century)
🏰 Medieval Christianity (5th-15th century)
⚔️ Protestant Reformation (16th century)
📚 American Protestant movements (19th century including Adventist history)
🕌 Islamic historical context (when discussing shared biblical figures)
✡️ Jewish historical tradition (especially regarding Torah and Hebrew scriptures)
🏛️ Modern archaeological and historical findings

**CATEGORY-SPECIFIC GUIDANCE:**

${category === "events" ? `**EVENTS:**
📅 Event Overview - Describe with historical context
👥 Key People - List those involved
⏰ Timeline - Chronological progression
📖 Scripture - Cite all relevant passages
🌟 Significance - Theological importance and prophetic meaning
🏛️ Historical Development - How this event has been viewed through church history` : ""}

${category === "maps" ? `**MAPS:**
📍 Location - Geographical description with modern context
🏛️ Biblical Significance - Why this place matters
📜 Major Events - What happened here
🗺️ Nearby Places - Distances and directions
🚶 Journey Details - Travel routes and significance
⛪ Pilgrimage History - How various traditions have revered this place` : ""}

${category === "prophecy" ? `**PROPHECY:**
📖 Prophecy Context - Historical background and setting
🔍 Understanding the Prophecy - Continuous fulfillment through history
⏰ Historical Fulfillments - How prophecy has unfolded through time
🌍 Present Truth - Contemporary relevance and application
🔗 Prophetic Connections - Links to Daniel, Revelation, and other prophecies
⛪ Historical Views - How this prophecy has been understood through Protestant history` : ""}

${category === "charts" ? `**CHARTS:**
📊 Visual Overview - Describe the structure
📅 Timeline/Sequence - Chronological flow
🔗 Relationships - Connections between elements
📝 Notes - Explanatory details
💡 Key Insights - Important takeaways` : ""}

${category === "people" ? `**PEOPLE:**
👤 Overview - Brief biographical intro
📅 Life Events - Key moments chronologically
🌟 Role in Salvation History - Place in God's plan
✝️ Christ Connections - Typology and prophetic significance
🏛️ Historical Context - Cultural and religious background of their time
💡 Character Lessons - What we learn from their life
📖 Scripture References - All mentions` : ""}

**IMPORTANT:**
- Use plenty of emojis to make it visually engaging
- Keep paragraphs short and scannable
- Use bullet points liberally
- No markdown syntax at all
- Be thorough but organized
- Always cite scripture
- Emphasize the sanctuary, Sabbath, state of the dead, and prophetic truth when relevant
- Show Christ in all Scripture

**CRITICAL - SOURCES REQUIREMENT:**
- ALWAYS include actual clickable URLs to reliable sources for ALL historical claims
- When mentioning Church Fathers, theologians, historical documents, or events, you MUST provide working web links
- Format citations like: "Early Church Fathers, such as Irenaeus of Lyons (2nd century) [https://www.newadvent.org/fathers/0103.htm] recognized..."
- For quotes, include the source URL immediately after: "Ellen White stated... (Review and Herald, July 23, 1889) [https://m.egwwritings.org/...]"
- Use reputable sources: academic databases, church history archives, digital libraries (e.g., CCEL, New Advent, Internet Archive)
- If you reference Augustine, Luther, or other historical figures, link to their actual writings or scholarly sources about them
- NEVER make historical claims without providing a verifiable source URL`;


      userPrompt = `Please provide comprehensive encyclopedia information about: ${query}`;
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
    let content = data.choices[0]?.message?.content || "No response generated";
    
    // Clean markdown code fencing from JSON responses
    content = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

    // Global cleanup for Jeeves text responses
    // Remove all markdown bold/italic markers and discourage theatrical openings
    content = content
      .replace(/\*\*/g, '')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/\*(?!\s)/g, '')
      .replace(/^[Aa]h, my friend[.!]?\s*/m, '')
      .replace(/^[Aa]h[,!]?\s*/m, '')
      .replace(/my friend[,!]?/gi, '')
      .trim();

    // For maps or charts category in encyclopedia mode, generate an image
    let mapImageUrl = null;
    if (mode === "encyclopedia" && (category === "maps" || category === "charts")) {
      try {
        const imageType = category === "maps" ? "map" : "chart";
        console.log(`Generating ${imageType} image for:`, query);
        
        const imagePrompt = category === "maps" 
          ? `Create a detailed biblical map showing: ${query}. The map should include:
- Clear geographical features (mountains, rivers, seas)
- Important biblical locations marked with labels
- Historical travel routes if relevant
- A simple legend
- Vintage cartographic style with aged parchment appearance
- Minimal but clear text labels in English
Style: Historical biblical atlas map, professional cartography, detailed but readable`
          : `Create a detailed biblical prophecy chart for: ${query}. The chart should include:
- Clear timeline or sequential structure
- Key prophetic symbols and interpretations
- Color-coded sections for different periods or kingdoms
- Biblical references labeled on relevant sections
- Clean, professional prophetic chart style
- Easy to read text labels and annotations
- Historicist perspective showing continuous fulfillment
Style: Professional prophetic chart, clear typography, organized layout, spiritual yet scholarly`;

        const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [
              {
                role: "user",
                content: imagePrompt
              }
            ],
            modalities: ["image", "text"]
          })
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          mapImageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          console.log(`${imageType.charAt(0).toUpperCase() + imageType.slice(1)} image generated successfully`);
        } else {
          console.error(`Failed to generate ${imageType} image:`, imageResponse.status);
        }
      } catch (error) {
        console.error(`Error generating ${category} image:`, error);
        // Continue without the image if generation fails
      }
    }

    // For generate-drills mode, parse JSON
    if (mode === "generate-drills") {
      try {
        const parsed = JSON.parse(content);
        return new Response(
          JSON.stringify(parsed),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        return new Response(
          JSON.stringify({ drills: [] }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // For sermon_titles mode, parse JSON
    if (mode === "sermon_titles") {
      try {
        const parsed = JSON.parse(content);
        return new Response(
          JSON.stringify(parsed),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error('Failed to parse sermon titles JSON:', error);
        return new Response(
          JSON.stringify({ 
            titles: [], 
            error: "Failed to generate titles. Please try again." 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // For equations-challenge mode, parse JSON and validate
    if (mode === "equations-challenge") {
      try {
        const parsed = JSON.parse(content);
        
        // Validate symbol count matches request
        const expectedCount = requestBody.symbolCount || 3;
        if (parsed.symbols && parsed.symbols.length !== expectedCount) {
          console.error(`Symbol count mismatch: expected ${expectedCount}, got ${parsed.symbols.length}`);
          // Return error so frontend can retry
          return new Response(
            JSON.stringify({
              error: "Invalid symbol count",
              expectedCount,
              actualCount: parsed.symbols.length,
              verse: "Please try regenerating...",
              equation: "Retry needed",
              symbols: [],
              difficulty: difficulty || "easy",
              explanation: "The AI generated an incorrect number of symbols. Please click Regenerate to try again."
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" } 
            }
          );
        }
        
        return new Response(
          JSON.stringify(parsed),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        return new Response(
          JSON.stringify({
            verse: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life. (John 3:16)",
            equation: "CR + GR → 2D",
            symbols: ["CR: Concentration Room (Christ-centered)", "GR: Gems Room", "2D: Christ Dimension"],
            difficulty: difficulty || "easy",
            explanation: "Unable to generate equation. Please try again."
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // For solve-equation mode, return text solution
    if (mode === "solve-equation") {
      return new Response(
        JSON.stringify({ solution: content }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    // For generate-series-outline mode, parse JSON
    if (mode === "generate-series-outline") {
      try {
        const parsed = JSON.parse(content);
        return new Response(
          JSON.stringify(parsed),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error('Error parsing series outline:', error);
        return new Response(
          JSON.stringify({
            error: 'Failed to generate series outline',
            outline: []
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // For generate-chart mode, parse JSON
    if (mode === "generate-chart") {
      try {
        const parsed = JSON.parse(content);
        return new Response(
          JSON.stringify(parsed),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        return new Response(
          JSON.stringify({
            type: "bar",
            title: "Chart Data",
            data: [],
            description: "Unable to generate chart data"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // For prophecy-signal mode, parse JSON
    if (mode === "prophecy-signal") {
      try {
        const parsed = JSON.parse(content);

        // Ensure we have a source_url if any URL is present in the response
        if (!parsed.source_url) {
          const urlMatch = content.match(/https?:\/\/\S+/);
          if (urlMatch) {
            parsed.source_url = urlMatch[0];
          }
        }

        return new Response(
          JSON.stringify(parsed),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        const urlMatch = content.match(/https?:\/\/\S+/);
        const fallbackSourceUrl = urlMatch ? urlMatch[0] : undefined;

        return new Response(
          JSON.stringify({
            title: "Prophetic Signal",
            description: content,
            category: "general",
            verses: [],
            source_url: fallbackSourceUrl,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // For chain-chess and chain-chess-feedback modes, parse the response
    if (mode === "chain-chess") {
      console.log("=== PARSING CHAIN CHESS RESPONSE ===");
      console.log("Raw AI response:", content);
      
      try {
        const parsed = JSON.parse(content);
        console.log("Parsed response:", parsed);
        
        // Ensure all required fields are present
        if (!parsed.verse) {
          console.error("Missing verse in response");
          throw new Error("Missing verse in AI response");
        }
        
        if (!parsed.commentary || parsed.commentary.trim() === "") {
          console.error("Missing or empty commentary in response");
          throw new Error("Missing commentary (thought) in AI response");
        }
        
        if (!parsed.challengeCategory) {
          console.error("Missing challengeCategory in response");
          throw new Error("Missing challengeCategory in AI response");
        }
        
        console.log("=== VALID RESPONSE ===");
        console.log("Verse:", parsed.verse);
        console.log("Commentary (Jeeves' thought):", parsed.commentary);
        console.log("Challenge:", parsed.challengeCategory);
        
        return new Response(
          JSON.stringify({ 
            verse: parsed.verse,
            commentary: parsed.commentary,
            challengeCategory: parsed.challengeCategory,
            score: 8 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (parseError) {
        console.error("=== ERROR PARSING CHAIN CHESS ===");
        console.error("Parse error:", parseError);
        console.error("Raw content:", content);
        
        // Fallback if not JSON - return error instead of trying to salvage
        const errorMessage = parseError instanceof Error ? parseError.message : "Unknown error";
        return new Response(
          JSON.stringify({ 
            error: "Failed to parse AI response. Please try again.",
            details: errorMessage,
            rawContent: content.substring(0, 500) // First 500 chars for debugging
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
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

    // Parse JSON responses for game validation modes
    if (["validate_chain", "validate_sanctuary", "validate_time_zones", "validate_connect6", 
         "validate_christ", "validate_controversy", "validate_dragon_defense", "validate_equation",
         "validate_witness", "validate_frame", "validate_chef_recipe", "generate_chef_verses",
         "check_chef_recipe", "get_chef_model_answer"].includes(mode)) {
      try {
        console.log(`=== ${mode.toUpperCase()} RESPONSE ===`);
        console.log("Raw content:", content);
        const parsed = JSON.parse(content);
        console.log("Parsed JSON:", parsed);
        
        if (mode === "generate_chef_verses") {
          console.log("Verses generated:", parsed.verses?.length || 0);
          console.log("Verse list:", parsed.verses);
        }
        
        return new Response(
          JSON.stringify(parsed),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (parseError) {
        console.error(`=== ERROR PARSING ${mode.toUpperCase()} ===`);
        console.error("Parse error:", parseError);
        console.error("Raw content:", content);
        return new Response(
          JSON.stringify({ 
            error: "Failed to parse validation response",
            valid: false,
            feedback: "Unable to validate. Please try again.",
            rawContent: content.substring(0, 500)
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Extract principles used from commentary mode
    let responseData: any = { content };
    
    // Add map/chart image for encyclopedia maps or charts mode
    if (mode === "encyclopedia" && (category === "maps" || category === "charts") && mapImageUrl) {
      responseData.mapImageUrl = mapImageUrl;
    }
    
    if (mode === "commentary") {
      const principlesMatch = content.match(/PRINCIPLES_USED: (.+)$/m);
      if (principlesMatch) {
        const principlesUsed = principlesMatch[1].split(", ");
        responseData.principlesUsed = principlesUsed;
        // Remove the PRINCIPLES_USED line from content
        responseData.content = content.replace(/\n?PRINCIPLES_USED: .+$/m, '').trim();
      }
    }
    
    // Track used verses and rooms for branch_study mode
    if (mode === "branch_study") {
      console.log("=== BRANCH STUDY RESPONSE ===");
      console.log("Response length:", content.length);
      console.log("First 300 chars:", content.substring(0, 300));
      console.log("Checking for option pattern (A. B. C. D. E.)...");
      
      // Check if response contains the 5 options
      const optionMatches = content.match(/^[A-E]\.\s+/gm);
      if (optionMatches) {
        console.log(`✅ Found ${optionMatches.length} options in response`);
      } else {
        console.log("❌ No options found in response");
      }
      
      // VALIDATE SUB-PRINCIPLES: Check for hallucinated sub-principles
      const validSubPrinciples: { [key: string]: string[] } = {
        'DR': ['Literal', 'Christ', 'Me', 'Church', 'Heaven'],
        'C6': ['Prophecy', 'Parable', 'Epistle', 'History', 'Gospel', 'Poetry'],
        'TZ': ['1H', '2H', '3H', 'Earth-Past', 'Earth-Present', 'Earth-Future', 'Heaven-Past', 'Heaven-Present', 'Heaven-Future'],
        'TRm': ['Life of Christ Wall', 'Sanctuary Wall', 'Time Prophecy Wall', 'Great Controversy Wall', 'Heaven Ceiling', 'Gospel Floor']
      };
      
      // Check for invalid sub-principles in the response
      const invalidPrinciples: string[] = [];
      Object.keys(validSubPrinciples).forEach(roomCode => {
        const subPrinciplePattern = new RegExp(`\\(${roomCode}\\s*-\\s*([^)]+)\\)`, 'gi');
        let match;
        while ((match = subPrinciplePattern.exec(content)) !== null) {
          const subPrinciple = match[1].trim();
          const validList = validSubPrinciples[roomCode];
          
          // Check if the sub-principle is valid (case-insensitive)
          const isValid = validList.some(valid => 
            valid.toLowerCase() === subPrinciple.toLowerCase()
          );
          
          if (!isValid) {
            invalidPrinciples.push(`${roomCode} - ${subPrinciple} (not in valid list: ${validList.join(', ')})`);
            console.log(`❌ HALLUCINATION DETECTED: ${roomCode} - ${subPrinciple}`);
          }
        }
      });
      
      // If hallucinations detected, return error to retry
      if (invalidPrinciples.length > 0) {
        console.log("❌ VALIDATION FAILED - Invalid sub-principles detected");
        return new Response(
          JSON.stringify({ 
            error: "Jeeves hallucinated invalid principles. Please try again.",
            invalidPrinciples,
            hint: "The AI invented sub-principles that don't exist in the Palace. Regenerating..."
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      const { usedVerses = [], usedRooms = [] } = requestBody;
      const newUsedVerses = [...usedVerses];
      const newUsedRooms = [...usedRooms];
      
      // Extract verse references from the response (simplified pattern)
      const versePattern = /\b([1-3]?\s*[A-Za-z]+)\s+(\d+):(\d+(?:-\d+)?)\b/g;
      const verseMatches = content.match(versePattern);
      if (verseMatches) {
        verseMatches.forEach((verse: string) => {
          const normalized = verse.trim();
          if (!newUsedVerses.includes(normalized)) {
            newUsedVerses.push(normalized);
          }
        });
      }
      
      // Extract room codes from the response
      const roomCodes = ['SR', 'IR', 'OR', 'DC', '@T', '?', 'CR', 'DR', 'C6', 'PRm', 'P‖', 'FRt', 'BL', 'PR', '3A', 'FRm', 'MR'];
      roomCodes.forEach((code: string) => {
        if (content.includes(code) && !newUsedRooms.includes(code)) {
          newUsedRooms.push(code);
        }
      });
      
      responseData.usedVerses = newUsedVerses;
      responseData.usedRooms = newUsedRooms;
      
      console.log("Updated usedVerses:", newUsedVerses);
      console.log("Updated usedRooms:", newUsedRooms);
    }

    // Handle analyze-thoughts mode - parse JSON and return structured analysis
    if (mode === "analyze-thoughts") {
      try {
        // Clean the content - remove any markdown code blocks
        let cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        // Try to extract JSON from the response
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          return new Response(
            JSON.stringify({ analysis }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } else {
          console.error("No JSON found in analyze-thoughts response:", cleanContent.substring(0, 500));
          throw new Error("Failed to parse analysis response");
        }
      } catch (parseError) {
        console.error("Error parsing analyze-thoughts JSON:", parseError);
        // Return a fallback structured response
        return new Response(
          JSON.stringify({ 
            analysis: {
              overallScore: 7,
              categories: {
                biblicalAccuracy: 7,
                depthOfInsight: 7,
                christCenteredness: 7,
                ptApplication: 7
              },
              strengths: [
                "You've made an effort to engage with Scripture thoughtfully",
                "Your willingness to explore biblical connections shows growth"
              ],
              growthAreas: [
                "Consider exploring deeper Christ-centered connections",
                "Try connecting your insight to specific Palace rooms"
              ],
              palaceMapping: {
                primaryRoom: "Concentration Room (CR)",
                relatedRooms: ["Questions Room (QR)", "Gems Room (GR)"],
                floorRecommendation: "Continue building foundations on Floor 1-2 before advancing"
              },
              scriptureConnections: [
                { reference: "John 5:39", connection: "Jesus said the Scriptures testify of Him - keep searching for Christ!" },
                { reference: "2 Timothy 2:15", connection: "Study to show yourself approved, rightly dividing the word of truth" }
              ],
              encouragement: "Keep studying and growing! Every insight is a stepping stone. What other Scripture might connect to your idea?"
            }
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify(responseData),
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
