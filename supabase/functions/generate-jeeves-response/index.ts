import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client for caching
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Generate cache key from inputs
function generateCacheKey(mode: string, cardCode: string | null, storyText: string): string {
  // Truncate story text to first 500 chars for cache key (same text = same response)
  const truncatedText = storyText.slice(0, 500);
  const keyParts = [mode, cardCode || 'none', truncatedText];
  // Simple hash
  let hash = 0;
  const str = keyParts.join('|');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `jeeves_${Math.abs(hash).toString(36)}`;
}

// Check cache for existing response
async function checkCache(cacheKey: string): Promise<{ response: string; selectedRooms?: string[] } | null> {
  try {
    const { data, error } = await supabase
      .from('jeeves_response_cache')
      .select('response, selected_rooms, hit_count')
      .eq('cache_key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error || !data) return null;

    // Increment hit count (fire and forget)
    supabase
      .from('jeeves_response_cache')
      .update({ hit_count: (data.hit_count || 0) + 1 })
      .eq('cache_key', cacheKey)
      .then(() => {});

    console.log('✅ Cache HIT for key:', cacheKey);
    return { response: data.response, selectedRooms: data.selected_rooms };
  } catch (e) {
    console.error('Cache check error:', e);
    return null;
  }
}

// Store response in cache
async function storeInCache(
  cacheKey: string,
  mode: string,
  cardCode: string | null,
  storyReference: string | null,
  response: string,
  selectedRooms?: string[]
): Promise<void> {
  try {
    await supabase
      .from('jeeves_response_cache')
      .upsert({
        cache_key: cacheKey,
        mode,
        card_code: cardCode,
        story_reference: storyReference,
        response,
        selected_rooms: selectedRooms,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      }, { onConflict: 'cache_key' });
    console.log('✅ Stored in cache:', cacheKey);
  } catch (e) {
    console.error('Cache store error:', e);
  }
}

// All PT room codes organized by floor
const ALL_ROOMS = {
  floor1: ["SR", "IR", "24", "BR", "TR", "GR"],
  floor2: ["OR", "DC", "ST", "QR", "QA"],
  floor3: ["NF", "PF", "BF", "HF", "LR"],
  floor4: ["CR", "DR", "C6", "TRm", "TZ", "PRm", "P‖", "FRt"],
  floor5: ["BL", "PR", "3A"],
  floor6: ["@Ad", "@No", "@Ab", "@Mo", "@Cy", "@CyC", "@Sp", "@Re", "1H", "2H", "3H"],
};

// Principle descriptions for context
const principleInfo: Record<string, string> = {
  "SR": "Story Room - Store Bible stories as vivid mental movies",
  "IR": "Imagination Room - Step inside stories with sanctified imagination",
  "24": "24FPS Room - Break Scripture into frames, one image per chapter",
  "BR": "Bible Rendered Room - Map entire Bible with master images",
  "TR": "Translation Room - Convert abstract texts into concrete images",
  "GR": "Gems Room - Collect striking insights and discoveries",
  "OR": "Observation Room - Notice details without interpretation",
  "DC": "Def-Com Room - Test words under microscope (Greek/Hebrew)",
  "ST": "Symbols/Types Room - Recognize God's universal language",
  "QR": "Questions Room - Ask relentless questions until truth emerges",
  "QA": "Q&A Room - Cross-examine witnesses, Scripture answers Scripture",
  "NF": "Nature Freestyle - See lessons in creation",
  "PF": "Personal Freestyle - Turn your life into object lessons",
  "BF": "Bible Freestyle - Connect verses spontaneously",
  "HF": "History Freestyle - Let Bible interpret the world",
  "LR": "Listening Room - Turn conversations into connections",
  "CR": "Concentration Room - Every text must reveal Christ",
  "DR": "Dimensions Room - View through 5 dimensions",
  "C6": "Connect 6 Room - Connect across 6 genres",
  "TRm": "Theme Room - Anchor on great walls of salvation",
  "TZ": "Time Zone Room - Locate across 6 time zones",
  "PRm": "Patterns Room - Recognize recurring motifs",
  "P‖": "Parallels Room - See mirrored actions across time",
  "FRt": "Fruit Room - Test if study produces Christlike character",
  "BL": "Blue Room (Sanctuary) - The architectural blueprint of salvation",
  "PR": "Prophecy Room - Line up the stars of Daniel and Revelation",
  "3A": "Three Angels' Room - The final gospel syllabus of Rev 14",
  "@Ad": "Adamic Cycle - Eden to exile, seed promise",
  "@No": "Noahic Cycle - Flood, ark, rainbow covenant",
  "@Ab": "Abrahamic Cycle - Call, covenant people",
  "@Mo": "Mosaic Cycle - Exodus, sanctuary, law",
  "@Cy": "Cyrusic Cycle - Exile to return and rebuild",
  "@CyC": "Cyrus-Christ Cycle - Type to antitype Deliverer",
  "@Sp": "Holy Spirit Cycle - Church age, Pentecost",
  "@Re": "Remnant Cycle - End-time witness to Second Coming",
  "1H": "First Heaven (DoL¹/NE¹) - Day of the LORD: Babylon destroys Jerusalem (586 BC) → Post-exilic restoration",
  "2H": "Second Heaven (DoL²/NE²) - Day of the LORD: Rome destroys Jerusalem (70 AD) → New Covenant/church order",
  "3H": "Third Heaven (DoL³/NE³) - Day of the LORD: Final cosmic judgment → Literal New Creation (NOT atmospheric layers!)",
};

// Simple hash function for text to ensure consistent but varied selection
function hashText(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Select one room from each floor based on text hash to ensure variety
function selectRoomsFromAllFloors(text: string): string[] {
  const hash = hashText(text);
  const selectedRooms: string[] = [];
  
  Object.values(ALL_ROOMS).forEach((floorRooms, floorIndex) => {
    // Use different parts of the hash for each floor
    const roomIndex = (hash + floorIndex * 7 + text.length) % floorRooms.length;
    selectedRooms.push(floorRooms[roomIndex]);
  });
  
  return selectedRooms;
}

// Generate gather fragments response with interconnected insights
async function generateGatherFragments(
  storyText: string,
  storyReference: string,
  selectedRooms: string[],
  jeevesName: string,
  apiKey: string
): Promise<string> {
  const roomDescriptions = selectedRooms
    .map(code => `${code}: ${principleInfo[code] || code}`)
    .join('\n');

  const systemPrompt = `You are ${jeevesName}, a Phototheology master conducting a comprehensive Palace analysis.

Your task: Apply one principle from each of the 6 Palace floors to illuminate the given Bible text. Each insight must:
1. Be grounded in that specific room's methodology
2. Connect meaningfully to insights from other rooms - show how they weave together
3. Build toward a unified Christ-centered understanding

The selected rooms for this analysis are:
${roomDescriptions}

CRITICAL FORMATTING RULES:
- Format each room's insight with the room code as a header (e.g., "📖 SR - Story Room:")
- Make each insight 2-3 sentences, substantive but focused
- After all 6 room insights, provide a "🔗 UNIFIED THREAD" section (2-3 sentences) showing how all insights connect
- Use emojis for visual interest but keep them minimal
- NO markdown asterisks or bold formatting
- Write with warmth and scholarly depth`;

  const userPrompt = `Bible Text${storyReference ? ` (${storyReference})` : ''}:
${storyText}

Apply the selected PT principles from all 6 floors, ensuring each insight connects to the others and reveals Christ.`;

  console.log('Generating gather-fragments with rooms:', selectedRooms);

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
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

  const aiData = await response.json();
  const content = aiData.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content in AI response');
  }

  console.log('✅ Generated gather-fragments response successfully');
  return content;
}

// Generate fragment dialogue response for interactive conversation
async function generateFragmentDialogue(
  storyText: string,
  storyReference: string,
  roomCode: string,
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  jeevesName: string,
  apiKey: string
): Promise<string> {
  const roomDesc = principleInfo[roomCode] || roomCode;
  const isFirstMessage = conversationHistory.length === 0;

  const systemPrompt = `You are ${jeevesName}, a Phototheology expert engaged in an interactive Bible study dialogue.

You are currently discussing the ${roomCode} (${roomDesc}) principle as applied to a specific Bible text. The user is exploring this principle with you - they may ask questions, share their own thoughts, challenge your insights, or seek deeper understanding.

Guidelines:
- Stay focused on this specific principle (${roomCode}) and how it illuminates the text
- Engage warmly and conversationally, like a mentor in dialogue
- If they share a thought, affirm what's good and gently correct or expand what needs it
- If they ask a question, answer thoroughly but concisely
- If they challenge your insight, engage thoughtfully - you may adjust or defend your position
- Connect back to Christ when natural
- Keep responses focused (2-4 short paragraphs max)
- Use emojis sparingly for warmth
- NO markdown formatting (asterisks, bold, etc.)

🔥 CRITICAL - ASK PROBING QUESTIONS:
You MUST end EVERY response with a thought-provoking question to deepen their study. This is essential for promoting deeper thinking.

Types of questions to ask:
- Observation questions: "What else do you notice in this passage that might connect to ${roomCode}?"
- Reflection questions: "How does this insight challenge or confirm your previous understanding?"
- Application questions: "Where do you see this pattern playing out in your own spiritual journey?"
- Connection questions: "Can you think of another Scripture passage where this same principle applies?"
- Christ-centered questions: "What does this reveal about Christ's character or mission?"
- Personal questions: "What is the Spirit stirring in your heart as we explore this together?"

${isFirstMessage ? `FIRST MESSAGE: Since this is their first message, warmly welcome them into the dialogue and ask an opening question that invites them to share what drew them to explore this principle further.` : ''}

Bible Text${storyReference ? ` (${storyReference})` : ''}:
"${storyText}"`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    })),
    { role: 'user', content: userMessage }
  ];

  console.log('Generating fragment dialogue response with probing questions...');

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI API error:', response.status, errorText);
    throw new Error(`AI API error: ${response.status}`);
  }

  const aiData = await response.json();
  const content = aiData.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content in AI response');
  }

  console.log('✅ Generated fragment dialogue response successfully');
  return content;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cardCode, storyText, storyReference, opponentName, jeevesName, mode, userMessage, conversationHistory } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Handle "fragment-dialogue" mode - interactive conversation about a specific principle
    if (mode === 'fragment-dialogue') {
      console.log('Fragment dialogue request:', { storyText: !!storyText, cardCode, userMessage: !!userMessage });
      
      if (!cardCode || !userMessage) {
        const missing = [];
        if (!cardCode) missing.push('cardCode');
        if (!userMessage) missing.push('userMessage');
        throw new Error(`Missing required fields for fragment dialogue: ${missing.join(', ')}`);
      }
      
      // Use storyText if available, otherwise use a default context
      const contextText = storyText || 'Continue the conversation about this Phototheology principle.';
      
      const dialogueResponse = await generateFragmentDialogue(
        contextText,
        storyReference || '',
        cardCode,
        userMessage,
        conversationHistory || [],
        jeevesName || 'Jeeves',
        LOVABLE_API_KEY
      );
      
      return new Response(
        JSON.stringify({ response: dialogueResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle "gather fragments" mode - one principle from every floor
    if (mode === 'gather-fragments') {
      if (!storyText) {
        throw new Error('Missing required field: storyText');
      }

      // Check cache first
      const cacheKey = generateCacheKey('gather-fragments', null, storyText);
      const cached = await checkCache(cacheKey);
      if (cached) {
        return new Response(
          JSON.stringify({ response: cached.response, selectedRooms: cached.selectedRooms, cached: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const selectedRooms = selectRoomsFromAllFloors(storyText);
      console.log('Selected rooms for gather-fragments:', selectedRooms);

      const fragmentsResponse = await generateGatherFragments(
        storyText,
        storyReference || '',
        selectedRooms,
        jeevesName || 'Jeeves',
        LOVABLE_API_KEY
      );

      // Store in cache
      await storeInCache(cacheKey, 'gather-fragments', null, storyReference, fragmentsResponse, selectedRooms);

      return new Response(
        JSON.stringify({ response: fragmentsResponse, selectedRooms }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Standard single-card mode
    if (!cardCode || !storyText) {
      throw new Error('Missing required fields: cardCode and storyText');
    }

    // Check cache first (only for non-opponent matches - opponent name makes it unique)
    if (!opponentName) {
      const cacheKey = generateCacheKey('standard', cardCode, storyText);
      const cached = await checkCache(cacheKey);
      if (cached) {
        return new Response(
          JSON.stringify({ response: cached.response, cached: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const principleDesc = principleInfo[cardCode] || cardCode;
    const referenceText = storyReference ? ` (${storyReference})` : '';
    const addressOpponent = opponentName ? `Your opponent is ${opponentName}. When addressing them, start by using their name naturally in your response.` : '';

    const systemPrompt = `You are ${jeevesName || 'Jeeves'}, a Phototheology expert playing PT Card Battle.

${addressOpponent}

Your task: Apply the given PT principle card to illuminate the Bible text with depth, insight, and biblical grounding.

Guidelines:
- Show genuine understanding of both the principle and the text
- Include specific textual details from the passage
- Make connections to other Scripture when relevant
- Show Christ-centered interpretation when appropriate
- Be substantive with 2-4 full paragraphs (150-300 words total)
- Demonstrate typology, patterns, or prophetic connections when they fit
- Include practical spiritual application when natural

CRITICAL FORMATTING RULES:
- NEVER start your response with "Ah." or similar generic greetings - it sounds fake and impersonal
${opponentName ? `- Start by addressing your opponent naturally using their name (e.g., "${opponentName},")` : ''}
- DO NOT use asterisks (*) or double asterisks (**) for emphasis
- DO NOT use any markdown formatting at all
- DO use emojis generously throughout your response (✨ 🎯 💡 📖 🔥 ⚡ 🌟 ⛪ 🙏 etc.)
- DO break your response into clear paragraphs with blank lines between them
- Make it engaging, warm, and insightful
- Write naturally as if explaining to a friend who loves studying Scripture

Write as if you're a scholar who deeply loves Scripture and sees rich connections everywhere.`;

    const userPrompt = `Bible Text${referenceText}:
${storyText}

PT Principle Card: ${cardCode}
(${principleDesc})

Apply this principle to illuminate the text. Show depth, biblical grounding, and insight.`;

    console.log('Calling AI to generate Jeeves response...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const response = aiData.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No content in AI response');
    }

    console.log('✅ Generated Jeeves response successfully');

    // Store in cache (only for non-opponent matches)
    if (!opponentName) {
      const cacheKey = generateCacheKey('standard', cardCode, storyText);
      await storeInCache(cacheKey, 'standard', cardCode, storyReference, response);
    }

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-jeeves-response:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
