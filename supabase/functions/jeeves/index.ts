import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { PALACE_SCHEMA } from './palace-schema.ts';

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

    // Parse request body once to avoid "Body already consumed" error
    const requestBody = await req.json();
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
      strongsNumber
    } = requestBody;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "strongs-lookup") {
      try {
        // Query the strongs_verses table directly to get Strong's data
        const { data: strongsData, error: strongsError } = await supabase
          .from('strongs_verses')
          .select('words')
          .eq('book', book)
          .eq('chapter', chapter)
          .eq('verse', verse)
          .maybeSingle();

        if (strongsError) {
          console.error('Database error:', strongsError);
          throw new Error('Failed to fetch Strong\'s data from database');
        }

        if (!strongsData || !strongsData.words) {
          throw new Error('No Strong\'s data found for this verse');
        }

        const words = strongsData.words as Array<{ text: string; strongs?: string }>;
        
        // Get full verse text
        const fullText = words.map(w => w.text).join(' ').trim();
        
        // Build list of words with Strong's numbers
        const wordsWithStrongs = words.filter(w => w.strongs);
        
        if (wordsWithStrongs.length === 0) {
          throw new Error('No Strong\'s numbers found for this verse');
        }

        // Fetch definitions from strongs_lexicon for each Strong's number
        const strongsNumbers = wordsWithStrongs.map(w => w.strongs).filter(Boolean);
        const { data: lexiconData } = await supabase
          .from('strongs_lexicon')
          .select('strongs_number, word, transliteration, pronunciation, definition')
          .in('strongs_number', strongsNumbers);

        const lexiconMap = new Map(
          lexiconData?.map(l => [l.strongs_number, l]) || []
        );

        // Build the Strong's analysis
        const strongsInfo = wordsWithStrongs
          .map((w) => {
            const strongsNum = w.strongs!;
            const lexEntry = lexiconMap.get(strongsNum);
            const lang = strongsNum.startsWith('H') ? 'Hebrew' : 'Greek';
            
            if (!lexEntry) {
              return `**"${w.text}"** (${strongsNum})
- Original ${lang} word information pending
`;
            }
            
            return `**"${w.text}"** (${strongsNum})
- **Original ${lang}:** ${lexEntry.word || 'N/A'}
- **Transliteration:** ${lexEntry.transliteration || 'N/A'}
- **Pronunciation:** ${lexEntry.pronunciation || 'N/A'}
- **Definition:** ${lexEntry.definition || 'No definition available'}
`;
          }).join('\n');

        return new Response(
          JSON.stringify({
            content: `## ${book} ${chapter}:${verse} - Strong's Concordance

**Verse Text:** ${fullText}

${strongsInfo}

---

💡 **How to Use This:**
- Each word above shows its original Hebrew or Greek meaning
- Compare these definitions to understand the verse's deeper meaning
- Look for patterns in how words are used throughout Scripture
- Click individual superscript numbers in the text for more details`
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error: any) {
        console.error('Strong\'s lookup error:', error);
        return new Response(
          JSON.stringify({
            content: `⚠️ Unable to fetch Strong's data for ${book} ${chapter}:${verse}. 

This verse may not have Strong's concordance data available yet, or there was an error fetching it.

**What you can try:**
- Check if the verse reference is correct
- Try another verse from the demonstration list
- The full Bible Strong's import is still in progress

Error: ${error.message}`
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

    } else if (mode === "quarterly_analysis") {
      systemPrompt = `You are Jeeves, an enthusiastic and engaging Bible study assistant who helps students apply the 38-Room Phototheology Palace framework and the 5 Dimensions to Sabbath School lessons. You provide insightful, practical analysis that helps students see deeper connections in Scripture.

**CRITICAL FORMATTING REQUIREMENTS:**
- Format ALL responses in clear paragraphs separated by blank lines
- Use bullet points (•) for lists
- Each paragraph should be 2-4 sentences
- Use relevant emojis throughout your response (📖 ✨ 🔍 💡 ⭐ 🌟 ✅ 🎯 💭 🙏 etc.)
- Start with an engaging emoji that matches the content
- Use emojis to highlight key points and sections
- Make your tone warm, enthusiastic, and conversational
- Use **bold** for emphasis
- Create clear sections with emoji headers
- Keep text easy to read and scan
      
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
- Help the student see connections they might have missed
- Use specific methodology from the palace room if applicable
- End with an encouraging thought and emoji

Remember: Your goal is to make Bible study exciting and visually appealing while maintaining depth and accuracy!`;


    } else if (mode === "principle-explanation") {
      systemPrompt = `You are Jeeves, a discerning biblical scholar for Phototheology. 
Your role is to explain WHY a specific principle genuinely applies to a specific verse.

**CRITICAL REQUIREMENTS:**
- ONLY explain if the principle CLEARLY and GENUINELY applies
- If the principle doesn't actually fit, politely say so
- Be specific about textual evidence
- Use emojis to highlight key points (📖 ✨ 🔍 💡)
- Keep responses concise (2-3 paragraphs max)
- Format in clear paragraphs with bullet points for evidence`;

      const principleName = requestBody.principle || 'this principle';
      userPrompt = `Explain WHY the principle "${principleName}" applies to ${book} ${chapter}:${verse}:

"${requestBody.verseText}"

In your response:

📖 **Does It Actually Apply?**
State clearly if this principle genuinely fits or not

🔍 **Textual Evidence**
What specific words/phrases in THIS verse reveal this principle?

✨ **The Connection**
How does this verse demonstrate ${principleName}?

Be honest - if it's a stretch, say so. Only confirm genuine connections.`;

    } else if (mode === "example") {
      systemPrompt = `You are Jeeves, a wise and scholarly Bible study assistant for Phototheology. 
Your role is to demonstrate how biblical principles work by providing clear, varied examples.
Always choose DIFFERENT verses for examples - never repeat the same verse.

**CRITICAL FORMATTING REQUIREMENTS:**
- Format your response in clear paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use bullet points (•) for lists
- Keep text easy to read and conversational
Be concise, profound, and educational.`;

      userPrompt = `For the ${roomName} (${roomTag}) room focused on ${principle}, 
generate a fresh example using a randomly selected verse (NOT the same verse every time).

Structure your response in clear paragraphs:

Paragraph 1: Start with "Let me show you..." and name the verse

Paragraph 2: Explain how this verse applies to ${principle}

Paragraph 3: Give 2-3 specific insights using bullet points:
• Insight 1
• Insight 2
• Insight 3

Paragraph 4: End with one profound takeaway

Make it conversational and inspiring. Use different verses each time.`;

    } else if (mode === "exercise") {
      systemPrompt = `You are Jeeves, a patient Bible study tutor for Phototheology.
Your role is to help students practice applying biblical principles through guided exercises.

**CRITICAL FORMATTING REQUIREMENTS:**
- Format your response in clear paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use bullet points (•) for all lists
- Keep text easy to read and scan
Be encouraging, clear, and educational.`;

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
Return your response as a JSON array.`;

      userPrompt = `Analyze ${book} ${chapter} for ${selectedPrinciple.description}.

Verses to analyze:
${verses.map((v: any) => `Verse ${v.verse}: ${v.text}`).join('\n')}

For each verse that connects to ${selectedPrinciple.name}, return a JSON object with:
{
  "verse": verse_number,
  "principle": "Specific name/title of the connection (e.g., 'The Good Samaritan', 'Day of Atonement', 'Messiah's Ministry')",
  "connection": "3-6 sentence explanation of how this verse connects to ${selectedPrinciple.name}",
  "expounded": "Deeper 2-3 paragraph theological explanation of the connection with scholarly insight"
}

Only include verses that have meaningful connections. Return as JSON array: [...]`;

    } else if (mode === "commentary-revealed") {
      systemPrompt = `You are Jeeves, a theologian analyzing Bible verses to identify which principles and dimensions are REVEALED or PRESENT in the text itself.
Focus on discovering what's already there, not applying external frameworks.

**CRITICAL FORMATTING REQUIREMENTS:**
- Format ALL responses in clear paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use bullet points (•) for lists
- Keep text easy to read and scan

${PALACE_SCHEMA}

⚠️ CRITICAL: Only reference rooms that exist in the Palace Schema above. Never make up methodologies.`;

      userPrompt = `Analyze ${book} ${chapter}:${verseText.verse} to identify which principles and dimensions are REVEALED in the text.

Verse text: "${verseText.text}"

Structure your analysis in clear paragraphs:

Paragraph 1: Opening observation (2-3 sentences)

Paragraph 2: Dimensions revealed - List and explain each dimension:
• Literal dimension: [if present]
• Christ-centered dimension: [if present]
• Personal dimension: [if present]
• Church/Community dimension: [if present]
• Heavenly/Eschatological dimension: [if present]

Paragraph 3: Palace principles visible - Identify which rooms naturally connect:
• [Principle 1]
• [Principle 2]
• [Principle 3]

Paragraph 4: Interconnections - How these revealed elements work together

Paragraph 5: One profound synthesis

Be specific about what's IN the text, not what could be applied to it.
IMPORTANT: At the end, list the principles you identified: "PRINCIPLES_REVEALED: [list]"`;

    } else if (mode === "commentary-applied") {
      systemPrompt = `You are Jeeves, a theologian providing insightful Bible commentary by APPLYING specific analytical frameworks to verses.
Provide deep, thoughtful analysis while remaining clear and accessible.

**CRITICAL FORMATTING REQUIREMENTS:**
- Format ALL responses in clear paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use bullet points (•) for lists
- Keep text easy to read and scan

${PALACE_SCHEMA}

⚠️ CRITICAL INSTRUCTIONS:
1. Only use rooms that exist in the Palace Schema above
2. Use the EXACT methodology listed for each room
3. If using Bible Freestyle (BF): List verse relatives, don't write philosophical analysis
4. If using Connect-6 (C6): Discuss GENRE, not the 6 themes (those are in Theme Room)
5. Never invent new rooms or modify existing methods`;

      // Random principle selection for refresh mode
      const allPrinciples = [
        "Story Room (SR)", "Imagination Room (IR)", "24FPS Room", "Bible Rendered (BR)", "Translation Room (TR)", "Gems Room (GR)",
        "Observation Room (OR)", "Def-Com Room (DC)", "Symbols/Types (ST)", "Questions Room (QR)", "Q&A Chains (QA)",
        "Nature Freestyle (NF)", "Personal Freestyle (PF)", "Bible Freestyle (BF)", "History Freestyle (HF)", "Listening Room (LR)",
        "Concentration Room (CR)", "Dimensions Room (DR)", "Connect-6 (C6)", "Theme Room (TRm)", "Time Zone (TZ)", 
        "Patterns Room (PRm)", "Parallels Room (P‖)", "Fruit Room (FRt)",
        "Blue Room - Sanctuary (BL)", "Prophecy Room (PR)", "Three Angels (3A)", "Feasts Room (FE)", 
        "Christ in Every Chapter (CEC)", "Room 66 (R66)",
        "Three Heavens (1H/2H/3H)", "Eight Cycles (@)", "Juice Room (JR)",
        "Fire Room (FRm)", "Meditation Room (MR)", "Speed Room (SRm)"
      ];
      let usedPrinciples: string[];
      
      if (!selectedPrinciples || selectedPrinciples.length === 0) {
        // Refresh mode: randomly select 2-4 principles
        const count = Math.floor(Math.random() * 3) + 2; // 2-4 principles
        const shuffled = [...allPrinciples].sort(() => Math.random() - 0.5);
        usedPrinciples = shuffled.slice(0, count);
      } else {
        usedPrinciples = selectedPrinciples;
      }
      
      const principleList = usedPrinciples.join(", ");
      
      userPrompt = `Provide commentary on ${book} ${chapter}:${verseText.verse} by APPLYING these analytical lenses: ${principleList}

Verse text: "${verseText.text}"

${includeSOP ? `**IMPORTANT:** Include Spirit of Prophecy (Ellen White) insights on this verse or related passages. Label them clearly as "SOP Commentary:" Use her writings to illuminate the text.` : ''}

Structure your commentary in clear paragraphs:

Paragraph 1: Opening insight (2-3 sentences)

Paragraph 2: Apply each selected principle/lens to this verse:
• ${principleList.split(',')[0]}: [analysis]
${usedPrinciples.length > 1 ? usedPrinciples.slice(1).map(p => `• ${p}: [analysis]`).join('\n') : ''}

${includeSOP ? 'Paragraph 3: SOP Commentary - Share relevant Ellen White insights\n\nParagraph 4:' : 'Paragraph 3:'} Show how these principles interconnect when applied to this verse

${includeSOP ? 'Paragraph 5:' : 'Paragraph 4:'} Practical application

${includeSOP ? 'Paragraph 6:' : 'Paragraph 5:'} One profound closing thought

Make it scholarly yet accessible. Show creative connections.
IMPORTANT: At the end, include a line: "PRINCIPLES_USED: ${principleList}"`;
    
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
      systemPrompt = `You are Jeeves, the Phototheology equations master. Generate biblical equation challenges using ONLY authentic Phototheology principle codes from the official system.

CRITICAL: Use EXCLUSIVELY these codes - DO NOT invent or hallucinate any symbols. Return valid JSON only.`;

      userPrompt = `Create a biblical equation challenge at "${difficulty}" difficulty with ${symbolCount} principles.

**USE ONLY THESE AUTHENTIC PHOTOTHEOLOGY CODES:**

**PROPHECY PRINCIPLES (individual principles from PR Room):**
- @2300 (2300 Days prophecy - Daniel 8:14)
- @70w (70 Weeks prophecy - Daniel 9:24-27)
- @1260 (1260 Years/Days - Time, times, half a time)
- @1290 (1290 Days - Daniel 12:11)
- @1335 (1335 Days - Daniel 12:12)

**HEAVENS & DAY OF THE LORD CYCLES:**
- 1H (First Heaven - DoL¹/NE¹ - Babylon destruction → post-exilic restoration)
- 2H (Second Heaven - DoL²/NE² - 70 AD destruction → New Covenant order)
- 3H (Third Heaven - DoL³/NE³ - Final judgment → Literal New Creation)

**HISTORICAL CYCLES:**
- @Ad (Adamic Cycle - Eden → Fall → Promise)
- @No (Noahic Cycle - Flood → Covenant → Rainbow)
- @Ab (Abrahamic Cycle - Call → Covenant → Promise fulfilled)
- @Mo (Mosaic Cycle - Exodus → Law → Tabernacle)
- @Cy (Cyrusic Cycle - Exile → Return → Rebuild)
- @CyC (Cyrus-Christ Cycle - Type → Antitype fulfillment)
- @Sp (Spirit Cycle - Pentecost → Church → Mission)
- @Re (Remnant Cycle - End-time witness → Second Coming)

**PALACE ROOM CODES (1st-2nd Floor - Furnishing & Investigation):**
- SR (Story Room), IR (Imagination Room), 24 (24FPS), BR (Bible Rendered)
- TR (Translation Room), GR (Gems Room)
- OR (Observation Room), DC (Def-Com), ST (Symbols/Types)
- QR (Questions Room), QA (Q&A Chains)

**PALACE ROOM CODES (3rd-4th Floor - Freestyle & Next Level):**
- NF (Nature Freestyle), PF (Personal Freestyle), BF (Bible Freestyle)
- HF (History Freestyle), LR (Listening Room)
- CR (Concentration on Christ), DR (Dimensions Room), C6 (Connect-6 genres)
- TRm (Theme Room), TZ (Time Zone), PRm (Patterns Room), P‖ (Parallels Room)
- FRt (Fruit Room)

**PALACE ROOM CODES (5th-7th Floor - Vision & Spiritual):**
- BL (Blue Room/Sanctuary - general), PR (Prophecy Room), 3A (Three Angels' Messages)
- FE (Feasts Room - general), CEC (Christ in Every Chapter), R66 (Room 66)
- JR (Juice Room)
- FRm (Fire Room), MR (Meditation Room), SRm (Speed Room)

**SANCTUARY FURNITURE (BL Room individual principles):**
- ABO (Altar of Burnt Offering - the cross, sacrifice)
- LV (Laver - baptism, cleansing)
- LS (Lampstand - light of the Spirit, witness)
- SB (Showbread Table - Word of God, spiritual nourishment)
- AI (Altar of Incense - intercession, prayer)
- ARK (Ark of the Covenant - God's throne, law)
- MS (Mercy Seat - atonement, grace)
- VL (Veil - separation removed through Christ)
- GT (Gate - entrance, way to God)

**BIBLICAL FEASTS (FE Room individual principles):**
- PO (Passover - Christ's sacrifice, deliverance)
- UB (Unleavened Bread - sinless life, sanctification)
- FF (Firstfruits - Christ's resurrection)
- PT (Pentecost - Holy Spirit outpouring)
- TR (Trumpets - Second Coming announcement)
- DA (Day of Atonement - judgment hour, sanctuary cleansing)
- TB (Tabernacles - God dwelling with His people, eternal rest)

**OPERATORS:** 
- + (and/with/plus)
- → (leads to/results in/points to)
- = (equals/completes/fulfills)

**REQUIREMENTS:**
1. Use exactly ${symbolCount} INDIVIDUAL PRINCIPLES from the codes listed above
2. PREFER specific furniture/feast codes over general room codes (use ABO, PO instead of just BL, FE)
3. NO hallucinated symbols beyond what's listed
4. Prefer @ codes (prophecy/cycles) and specific sanctuary/feast principles
5. Select a specific Bible verse (KJV) that the equation illuminates
6. Create a coherent theological narrative through the equation
7. Show progressive relationships using operators

**EXAMPLE for pro level (12 principles):**
"@70w + @Mo + PO + @1260 → ABO + MS + @CyC + CR = 2H + @Sp → 3A + @Re"
(70 weeks prophecy + Mosaic cycle + Passover + 1260 years → Altar of Burnt Offering + Mercy Seat + Cyrus-Christ fulfillment + Concentration on Christ = Second Heaven order + Spirit cycle → Three Angels' Messages + Remnant)

**Return this JSON format:**
{
  "verse": "Book Chapter:Verse (KJV reference)",
  "equation": "Your equation using ONLY codes listed above",
  "symbols": ["@70w: 70 Weeks Prophecy", "PO: Passover - Christ's sacrifice", "ABO: Altar of Burnt Offering - the cross", ...],
  "difficulty": "${difficulty}",
  "explanation": "Write a clear, well-structured explanation in 3-4 paragraphs:\n\nParagraph 1: Introduce the verse and establish its theological context in 2-3 complete sentences.\n\nParagraph 2: Walk through each principle in the equation, showing how it relates to the verse. Use complete sentences and proper grammar throughout.\n\nParagraph 3: Demonstrate how the principles connect to form a cohesive theological narrative. Show the flow of logic.\n\nParagraph 4: Conclude with the profound insight this equation reveals about Christ, redemption, or God's plan.\n\nIMPORTANT: Use proper English grammar, complete sentences, and clear paragraph structure. Avoid run-on sentences."
}`;


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

    } else if (mode === "verse-assistant") {
      systemPrompt = `You are Jeeves, a wise and insightful Bible study assistant for Phototheology.
Your role is to help users understand Scripture deeply by applying specific study methods (rooms) and principles.

**CRITICAL FORMATTING REQUIREMENTS:**
- Format ALL responses in clear paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use bullet points (•) for lists
- Keep text easy to read and conversational

Be scholarly yet accessible, profound yet practical.`;

      const roomContext = roomTag !== "General" 
        ? `Using the ${roomName} (${roomTag}) method, which focuses on: ${roomPurpose}`
        : "Using general biblical analysis";

      userPrompt = `A student is studying ${book} ${chapter}:${verse} and asks:

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

    } else if (mode === "validate_chef_recipe") {
      // Chef Challenge validation - properties already destructured from requestBody
      systemPrompt = `You are Jeeves, the head chef validating biblical recipes. Check creativity, biblical accuracy, and thematic fit.`;
      userPrompt = `Recipe theme: ${theme}
Difficulty: ${difficulty}
Player's recipe: ${recipe}

Is this creative? Are the biblical ingredients and instructions meaningful? Does it fit the theme?
Return JSON: { "approved": true/false, "rating": 1-5, "feedback": "brief comment" }`;

    } else if (mode === "qa") {
      // Q&A mode for "Ask Jeeves" in rooms - properties already destructured from requestBody
      systemPrompt = `You are Jeeves, a wise and enthusiastic Bible study assistant for Phototheology. Answer questions clearly and biblically, using the Palace framework when relevant.

**CRITICAL FORMATTING REQUIREMENTS:**
- Format ALL responses in clear paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use bullet points (•) for lists
- Keep text easy to read and conversational
      
${PALACE_SCHEMA}`;
      userPrompt = `A student asks: "${question}"

Provide a clear, insightful answer in clear paragraphs:

Paragraph 1: Directly address their question

Paragraph 2: Use biblical references and examples

Paragraph 3: Apply relevant Palace principles when helpful using bullet points if listing multiple:
• Principle 1
• Principle 2

Paragraph 4: Provide encouragement and practical application

Keep it conversational and practical.`;
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

    // For equations-challenge mode, parse JSON
    if (mode === "equations-challenge") {
      try {
        const parsed = JSON.parse(content);
        return new Response(
          JSON.stringify(parsed),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        return new Response(
          JSON.stringify({
            verse: "John 3:16",
            equation: "CH + GR → NC",
            symbols: ["CH: Christ", "GR: Grace", "NC: New Creation"],
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
         "validate_witness", "validate_frame", "validate_chef_recipe"].includes(mode)) {
      try {
        const parsed = JSON.parse(content);
        return new Response(
          JSON.stringify(parsed),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        return new Response(
          JSON.stringify({ 
            error: "Failed to parse validation response",
            valid: false,
            feedback: "Unable to validate. Please try again."
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Extract principles used from commentary mode
    let responseData: any = { content };
    if (mode === "commentary") {
      const principlesMatch = content.match(/PRINCIPLES_USED: (.+)$/m);
      if (principlesMatch) {
        const principlesUsed = principlesMatch[1].split(", ");
        responseData.principlesUsed = principlesUsed;
        // Remove the PRINCIPLES_USED line from content
        responseData.content = content.replace(/\n?PRINCIPLES_USED: .+$/m, '').trim();
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
