import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
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
      strongsNumber,
      // Series builder properties
      audienceType,
      context,
      primaryGoal,
      themeSubject,
      lessonCount
    } = requestBody;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "strongs-lookup") {
      // Import biblesdk for Strong's lookup
      const { getVerses } = await import('npm:biblesdk@0.4.0');
      
      try {
        // Map book names to biblesdk codes
        const bookCodeMap: Record<string, string> = {
          'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM', 'Deuteronomy': 'DEU',
          'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT', '1 Samuel': '1SA', '2 Samuel': '2SA',
          '1 Kings': '1KI', '2 Kings': '2KI', '1 Chronicles': '1CH', '2 Chronicles': '2CH',
          'Ezra': 'EZR', 'Nehemiah': 'NEH', 'Esther': 'EST', 'Job': 'JOB', 'Psalms': 'PSA',
          'Proverbs': 'PRO', 'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG', 'Isaiah': 'ISA',
          'Jeremiah': 'JER', 'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN',
          'Hosea': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON',
          'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP',
          'Haggai': 'HAG', 'Zechariah': 'ZEC', 'Malachi': 'MAL', 'Matthew': 'MAT',
          'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN', 'Acts': 'ACT', 'Romans': 'ROM',
          '1 Corinthians': '1CO', '2 Corinthians': '2CO', 'Galatians': 'GAL', 'Ephesians': 'EPH',
          'Philippians': 'PHP', 'Colossians': 'COL', '1 Thessalonians': '1TH', '2 Thessalonians': '2TH',
          '1 Timothy': '1TI', '2 Timothy': '2TI', 'Titus': 'TIT', 'Philemon': 'PHM',
          'Hebrews': 'HEB', 'James': 'JAS', '1 Peter': '1PE', '2 Peter': '2PE',
          '1 John': '1JN', '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD', 'Revelation': 'REV'
        };

        const bookCode = bookCodeMap[book];
        if (!bookCode) {
          throw new Error(`Unknown book: ${book}`);
        }

        // Fetch verse with Strong's data from biblesdk
        const response: any = await getVerses(bookCode, chapter, [verse, verse]);
        
        if (!response || !response.phrases || response.phrases.length === 0) {
          throw new Error('No Strong\'s data found for this verse');
        }

        // Extract Strong's data and build response
        const verseWords = response.phrases
          .filter((p: any) => p.verse === verse)
          .map((p: any) => ({
            text: p.text,
            strongs: p.strongs_number ? `${p.strongs_type}${p.strongs_number}` : null,
            transliteration: p.transliteration,
            definition: p.definition,
            hebrew_word: p.hebrew_word,
            greek_word: p.greek_word
          }));

        // Build structured response
        const strongsInfo = verseWords
          .filter((w: any) => w.strongs)
          .map((w: any) => {
            const lang = w.strongs?.startsWith('H') ? 'Hebrew' : 'Greek';
            const originalWord = w.strongs?.startsWith('H') ? w.hebrew_word : w.greek_word;
            return `
**${w.text}** (${w.strongs})
- **Original ${lang}:** ${originalWord || 'N/A'}
- **Transliteration:** ${w.transliteration || 'N/A'}
- **Definition:** ${w.definition || 'No definition available'}
`;
          }).join('\n');

        const fullText = verseWords.map((w: any) => w.text).join(' ').trim();

        return new Response(
          JSON.stringify({
            content: `## ${book} ${chapter}:${verse} - Strong's Concordance

**Verse Text:** ${fullText}

${strongsInfo || 'No Strong\'s numbers found for this verse.'}

---

💡 **How to Use This:**
- Click on the superscript numbers in the Bible text to see individual word definitions
- Compare different translations to understand the nuances
- Look for repeated Strong's numbers to find thematic connections`
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
- Try another verse
- The full Bible Strong's import is still in progress

Error: ${error.message}`
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

    } else if (mode === "quarterly_analysis") {
      systemPrompt = `You are Jeeves, an enthusiastic and engaging Bible study assistant who helps friends apply the 38-Room Phototheology Palace framework and the 5 Dimensions to Sabbath School lessons. You provide insightful, practical analysis that helps friends see deeper connections in Scripture.

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
- Help your friend see connections they might have missed
- Use specific methodology from the palace room if applicable
- End with an encouraging thought and emoji

Remember: Your goal is to make Bible study exciting and visually appealing while maintaining depth and accuracy!`;


    } else if (mode === "example") {
      systemPrompt = `You are Jeeves, a friendly Bible study assistant for Phototheology. 
Your role is to demonstrate how biblical principles work by providing clear, varied examples.
Always choose DIFFERENT verses for examples - never repeat the same verse.

**CRITICAL FORMATTING REQUIREMENTS:**
- Format your response in clear paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use bullet points (•) for lists
- Keep text easy to read and conversational
Be concise, profound, and friendly.`;

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
- Format ALL responses in clear, easy-to-read paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use emojis generously throughout (📖 ✨ 🔍 💡 ⭐ 🌟 ✅ 🎯 💭 🙏 📚 🔥 ⚡ 🎨 etc.)
- Use bullet points (•) for lists, NOT asterisks (*)
- NEVER use asterisks (*) at the start of lines
- Use **bold** ONLY for room names
- Keep text warm, conversational, and visually scannable

${PALACE_SCHEMA}

⚠️ CRITICAL: Only reference rooms that exist in the Palace Schema above. Never make up methodologies.`;

      userPrompt = `Analyze ${book} ${chapter}:${verseText.verse} to identify which principles and dimensions are REVEALED in the text.

Verse text: "${verseText.text}"

**FORMATTING INSTRUCTIONS - CRITICAL:**
- Use emojis throughout to make the response engaging
- Start with an opening observation emoji (🔍, 📖, ✨)
- NEVER use asterisks (*) for bullets - only use bullet points (•)
- Format each dimension/principle clearly with emojis

📖 **Opening Observation**
Provide 2-3 sentences about what immediately stands out in this text.

🌟 **Dimensions Revealed**
List each dimension present with brief explanation:
• **Literal dimension:** [explain if present]
• **Christ-centered dimension:** [explain if present]
• **Personal dimension:** [explain if present]
• **Church/Community dimension:** [explain if present]
• **Heavenly/Eschatological dimension:** [explain if present]

💎 **Palace Principles Visible**
Identify which rooms naturally connect (use emojis):
• [Room name and connection]
• [Room name and connection]
• [Room name and connection]

⚠️ **CRITICAL CONSTRAINT:** Select a maximum of ONE principle from each room. NEVER show multiple principles from the same room.
For example: If you identify Story Room (SR), do not also identify Imagination Room (IR) or any other Floor 1 room. Choose the MOST RELEVANT principle from each floor.

✨ **Interconnections**
Show how these revealed elements work together (2-3 sentences).

🎯 **Synthesis**
One profound insight that ties everything together.

Be specific about what's IN the text, not what could be applied to it.
IMPORTANT: At the end, include: "PRINCIPLES_REVEALED: [list]"`;

    } else if (mode === "commentary-applied") {
      systemPrompt = `You are Jeeves, a theologian providing insightful Bible commentary by APPLYING specific analytical frameworks to verses.
Provide deep, thoughtful analysis while remaining clear and accessible.

**CRITICAL FORMATTING REQUIREMENTS:**
- Format ALL responses in clear, easy-to-read paragraphs (2-4 sentences each)
- Separate each paragraph with a blank line
- Use emojis generously throughout (📖 ✨ 🔍 💡 ⭐ 🌟 ✅ 🎯 💭 🙏 📚 🔥 ⚡ 🎨 etc.)
- Start each room analysis with a relevant emoji
- Use bullet points (•) for lists, NOT asterisks (*)
- NEVER use asterisks (*) at the start of lines - always use bullet points (•) instead
- Use **bold** ONLY for room names like **Story Room (SR)**
- Keep text conversational, warm, and engaging
- Make your response visually scannable with clear sections

${PALACE_SCHEMA}

⚠️ CRITICAL INSTRUCTIONS:
1. Only use rooms that exist in the Palace Schema above
2. Use the EXACT methodology listed for each room
3. If using Bible Freestyle (BF): List verse relatives, don't write philosophical analysis
4. If using Connect-6 (C6): Discuss GENRE, not the 6 themes (those are in Theme Room)
5. Never invent new rooms or modify existing methods
6. NEVER start lines with asterisks - use bullet points (•) or emojis instead`;

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

${includeSOP ? `**IMPORTANT - SOP ANALYSIS:** Search for Ellen White statements that directly apply to or amplify this specific verse (${book} ${chapter}:${verseText.verse}). 
• If you find relevant statements, cite them with the book/chapter and show how they illuminate the verse
• If NO relevant Ellen White statements are found for this verse, simply state: "No statements found to amplify this verse."
• Do NOT provide generic Ellen White quotes - only include statements that specifically address this verse or passage
• Label clearly with 📜 emoji as "SOP Commentary:"` : ''}

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

${includeSOP ? '\n📜 **SOP Commentary**\nShare relevant Ellen White insights in a warm, accessible paragraph.\n\n' : ''}

✨ **Interconnections**
Show how these principles work together when applied to this verse. Use 2-3 sentences.

🎯 **Practical Application**
Give one concrete way to apply this insight. Keep it actionable and encouraging.

💫 **Closing Thought**
End with one profound, inspiring insight.

Keep it warm and easy to understand, visually appealing, and easy to scan.
      
      IMPORTANT: At the very end, on a new line, include: "PRINCIPLES_USED: ${principleList}"`;
    
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

CRITICAL: Use EXCLUSIVELY these codes - DO NOT invent or hallucinate any symbols. Return valid JSON only.`;

      userPrompt = `Create a biblical equation challenge at "${difficulty}" difficulty with ${symbolCount} principles.

**YOU MUST USE THIS SPECIFIC BIBLE PASSAGE AS THE FOUNDATION:** ${selectedPassage}

CRITICAL INSTRUCTIONS:
1. Write out the FULL TEXT of the verse(s) from ${selectedPassage} using KJV translation
2. Put the actual verse text in the "verse" field - just the Scripture text itself, nothing else
3. Then build your equation to illuminate THIS specific passage
4. If it's a well-known story/account, you can briefly mention it in your explanation

Example verse field format:
"verse": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life. (John 3:16)"

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
5. BUILD YOUR EQUATION TO ILLUMINATE THE PASSAGE: ${selectedPassage}
6. Create a coherent theological narrative through the equation that reveals Christ in this specific chapter
7. Show progressive relationships using operators

**EXAMPLE for pro level (12 principles):**
"@70w + @Mo + PO + @1260 → ABO + MS + @CyC + CR = 2H + @Sp → 3A + @Re"
(70 weeks prophecy + Mosaic cycle + Passover + 1260 years → Altar of Burnt Offering + Mercy Seat + Cyrus-Christ fulfillment + Concentration on Christ = Second Heaven order + Spirit cycle → Three Angels' Messages + Remnant)

**Return this JSON format:**
{
  "verse": "${selectedPassage}",
  "equation": "Your equation using ONLY codes listed above",
  "symbols": ["@70w: 70 Weeks Prophecy", "PO: Passover - Christ's sacrifice", "ABO: Altar of Burnt Offering - the cross", ...],
  "difficulty": "${difficulty}",
  "explanation": "Write a clear, instructional guide for people NEW to Phototheology that explains HOW to approach this challenge WITHOUT giving away the solution. Structure it in 4 paragraphs:\n\n**Paragraph 1 - Introduction (2-3 sentences):** Briefly introduce the chapter ${selectedPassage} and what Phototheology principles are (they're like 'study lenses' or 'interpretive keys' that help reveal deeper patterns in Scripture).\n\n**Paragraph 2 - Your Challenge Instructions (main section):** For EACH principle in the equation, write one clear instruction telling the user HOW to apply it to their study. Use this format:\n\n• Apply the [Principle Name] ([brief definition]) to your study of this chapter. Consider how [what to look for / what questions to ask / what connections to make].\n\nExample: 'Apply the Second Heaven principle (the time period covering 70 AD and the New Covenant cycle) to your study of this chapter. Consider how this text relates to that era and the transition from old to new covenant.'\n\nExample: 'Apply the Passover feast (Christ's sacrifice and deliverance) to your study. Look for themes of blood, sacrifice, deliverance, or lamb imagery in this passage.'\n\nExample: 'Apply the Veil (the separation that was removed through Christ) to your study. Ask yourself: what barrier or separation does this passage address? How does Christ remove it?'\n\nDo this for ALL principles in the equation.\n\n**Paragraph 3 - Understanding the Operators (2-3 sentences):** Explain that the + means 'combine these insights together,' → means 'this principle leads to or results in the next,' and = means 'all of this equals or fulfills this truth.' Tell them to trace the logical flow from principle to principle.\n\n**Paragraph 4 - Your Goal (1-2 sentences):** Remind them that their goal is to discover how all these principles work together to reveal something profound about Christ, salvation, or God's plan in this specific chapter. Encourage them to write out their findings and share them with the community!\n\nIMPORTANT: DO NOT solve the equation or give away answers. Only give instructions on HOW to apply each principle. Write in a warm, encouraging, teaching tone with clear formatting and bullet points."
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
      // Generate random verses for Chef Challenge with full text
      const { minVerses, maxVerses, difficulty } = requestBody;
      const numVerses = Math.floor(Math.random() * (maxVerses - minVerses + 1)) + minVerses;
      
      console.log(`=== GENERATING ${numVerses} CHEF VERSES (${difficulty} level) ===`);
      
      // Fetch random verses from database
      const { data: randomVerses, error: verseError } = await supabase
        .from('bible_verses_tokenized')
        .select('book, chapter, verse_num, text_kjv')
        .limit(numVerses * 10); // Get more than needed to randomize
      
      if (verseError || !randomVerses || randomVerses.length === 0) {
        console.error("Error fetching verses:", verseError);
        return new Response(
          JSON.stringify({ error: "Failed to fetch verses" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      // Randomly select verses
      const shuffled = randomVerses.sort(() => 0.5 - Math.random());
      const selectedVerses = shuffled.slice(0, numVerses).map(v => ({
        reference: `${v.book} ${v.chapter}:${v.verse_num}`,
        text: v.text_kjv
      }));
      
      console.log("Verses selected:", selectedVerses.length);
      
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
1. Creativity - Innovative connections?
2. Biblical Accuracy - Proper context?
3. Coherence - Logical flow?
4. Integration - Used all verses?

Be encouraging. Use emojis.

Return ONLY valid JSON:
{"rating":1-5,"feedback":"2-3 sentences"}`;
      
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
      
      systemPrompt = `You are Jeeves, demonstrating how to creatively tie random, unrelated Bible verses into a cohesive Bible study.

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
- Use ALL ${verses.length} verses naturally
- Maintain biblical accuracy
- Create logical flow
- Show creative connections
- Keep 2-3 paragraphs
- Use emojis sparingly

Return ONLY valid JSON:
{"modelAnswer":"your narrative"}`;
      
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
      
      systemPrompt = `You are Jeeves, a wise and enthusiastic Bible study assistant for Phototheology. Answer questions clearly and biblically, using the Palace framework when relevant.

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

Provide a clear, insightful answer in clear paragraphs:

Paragraph 1: Directly address their question${context ? ' in light of their study context' : ''}${historySection ? ' and previous conversation' : ''}

Paragraph 2: Use biblical references and examples

Paragraph 3: Apply relevant Palace principles when helpful using bullet points if listing multiple:
• Principle 1
• Principle 2

Paragraph 4: Provide encouragement and practical application

Keep it conversational and practical.`;
    } else if (mode === "research") {
      // Research mode - scholarly deep dive
      const { conversationHistory } = requestBody;
      
      console.log('Research mode activated for question:', question);
      
      systemPrompt = `You are Jeeves, a scholarly Bible research assistant for Phototheology. Provide in-depth, academically rigorous answers with proper references.

**RESEARCH MODE ACTIVATED:**
- Provide comprehensive, scholarly analysis
- Include biblical cross-references and scholarly perspectives
- Reference theologians, biblical scholars, and historical sources when relevant
- Examine original languages (Hebrew/Greek) when applicable
- Consider historical and cultural context
- Apply Phototheology Palace framework for structure

**CRITICAL FORMATTING:**
- Use clear section headers (## for main sections, ### for subsections)
- Format ALL responses in well-structured paragraphs
- Use bullet points (•) for lists
- Include **bold** for emphasis on key terms
- Reference biblical passages with book, chapter, and verse
      
${PALACE_SCHEMA}`;
      
      const contextSection = context ? `

**STUDY CONTEXT:**
${context}

Integrate this context into your scholarly analysis.` : '';

      const historySection = conversationHistory && conversationHistory.length > 0 ? `

**CONVERSATION HISTORY:**
${conversationHistory.map((msg: any) => `${msg.role === 'user' ? 'Student' : 'Jeeves'}: ${msg.content}`).join('\n\n')}

Build upon previous scholarly discussion.` : '';
      
      userPrompt = `Research Question: "${question}"${contextSection}${historySection}

Provide a comprehensive, scholarly response with the following structure:

## Overview
Directly address the question with a scholarly introduction (2-3 sentences)

## Biblical Foundation
• Examine relevant biblical passages with original language insights
• Provide cross-references and intertextual connections
• Apply Phototheology room analysis (Concentration, Dimensions, etc.)

## Historical & Cultural Context
• Explore the historical setting and cultural background
• Discuss how this informs interpretation
• Reference scholarly consensus and debates

## Theological Analysis
• Present different theological perspectives
• Apply systematic theology frameworks
• Integrate Palace principles:
  • Cycles (@Ad, @Mo, @Cy, @CyC, @Sp, @Re)
  • Three Heavens (1H, 2H, 3H)
  • Sanctuary connections
  • Prophetic patterns

## Practical Application
• Synthesize findings into clear takeaways
• Connect scholarly analysis to spiritual formation
• Provide actionable insights

## Further Study
• Suggest additional passages to explore
• Recommend scholarly resources
• Propose questions for deeper investigation

Keep tone scholarly yet accessible. Draw on theological traditions, biblical scholarship, and historical sources.`;
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
