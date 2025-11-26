import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cardCode, storyText, storyReference, opponentName, jeevesName } = await req.json();

    if (!cardCode || !storyText) {
      throw new Error('Missing required fields: cardCode and storyText');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

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
      "@Ad": "Adamic Cycle - Eden to exile, seed promise",
      "@No": "Noahic Cycle - Flood, ark, rainbow covenant",
      "@Ab": "Abrahamic Cycle - Call, covenant people",
      "@Mo": "Mosaic Cycle - Exodus, sanctuary, law",
      "@Cy": "Cyrusic Cycle - Exile to return and rebuild",
      "@CyC": "Cyrus-Christ Cycle - Type to antitype Deliverer",
      "@Sp": "Holy Spirit Cycle - Church age, Pentecost",
      "@Re": "Remnant Cycle - End-time witness to Second Coming",
      "1H": "First Heaven - Destruction/Restoration (586 BC)",
      "2H": "Second Heaven - New Covenant order (70 AD)",
      "3H": "Third Heaven - Final New Creation",
    };

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
