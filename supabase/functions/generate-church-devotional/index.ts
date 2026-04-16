import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChurchDevotionalRequest {
  churchName: string;
  theologicalFrame?: string;
  dayTheme: string;
  dayOfWeek: string;
  customGuidelines?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { churchName, theologicalFrame, dayTheme, dayOfWeek, customGuidelines } = await req.json() as ChurchDevotionalRequest;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Map day themes to focused content
    const dayThemeDescriptions: Record<string, string> = {
      monday: "Identity - Who we are as the church, scattered yet united in Christ",
      tuesday: "Righteousness - Personal holiness in private spaces, living rightly when no one is watching",
      wednesday: "Prayer - Intercession, spiritual warfare, unity in prayer",
      thursday: "Mission - Witness, digital evangelism, conversations that point to Christ",
      friday: "Encouragement - Perseverance, faithfulness, endurance in the faith",
      sabbath: "Rest & Reflection - Trust, dependence, abiding in Christ's finished work",
      sunday: "Vision - Kingdom perspective, eternal focus, the big picture of God's plan"
    };

    const themeDescription = dayThemeDescriptions[dayOfWeek.toLowerCase()] || dayTheme;

    const systemPrompt = `You are a pastoral devotional writer for ${churchName}. You write in a non-performative, spiritually grounded tone that is pastoral, prophetic, and biblically realistic.

CRITICAL INSTRUCTION: You MUST address this devotional specifically to "${churchName}" throughout. Use the church name naturally in the meditation, communal practice, and closing prayer. Examples:
- "Family of ${churchName}, today we..."
- "As ${churchName}, we are called to..."
- "Lord, strengthen ${churchName} as we..."

THEOLOGICAL FRAME:
${theologicalFrame || `The church is not defined by shared space, but by shared Spirit. This is a theology of:
- Presence without proximity
- Faithfulness without visibility  
- Mission without platforms
- Discipline of righteousness without applause`}

KEY BIBLICAL FOUNDATIONS (return to these):
- "Where two or three are gathered in My name…" (Matthew 18:20)
- "They that were scattered went everywhere preaching the word." (Acts 8:4)
- "Though I am absent in body, yet I am with you in spirit." (Colossians 2:5)
- "You also, as living stones, are being built up a spiritual house." (1 Peter 2:5)

TODAY'S THEME: ${themeDescription}

TONE REQUIREMENTS:
- Quiet confidence
- Biblical realism
- Mission-first urgency
- Think Hebrews + Acts, not Instagram devotionals
- Avoid over-sentimentality, internet slang, or "we're special because we're different" language
- Address ${churchName} by name at least 2-3 times throughout the devotional

CONTENT UNIQUENESS - CRITICAL:
- Each devotional MUST offer a FRESH, UNIQUE insight - not repeated lessons
- INCLUDE specific biblical examples, stories, or characters to illustrate points
- Paint vivid biblical scenes - don't just quote verses, tell the story
- Reference specific narratives (Acts church scatter, early believers' challenges, etc.)
- The lesson must feel NEW each time, even if the day-of-week theme is similar

${customGuidelines ? `ADDITIONAL GUIDELINES:\n${customGuidelines}` : ''}

TITLE REQUIREMENTS - CRITICAL:
- Each title MUST be UNIQUE and SPECIFIC to this devotional's central message
- NEVER use generic titles like "Walking Together", "United in Christ", "Standing Firm", "His Faithfulness"
- The title should capture the SPECIFIC angle or insight of THIS devotional
- Make it memorable, declarative, and distinct from any previous devotional title
- Think: "If someone saw only this title, they'd be curious what's inside"

OUTPUT FORMAT (JSON):
{
  "title": "Unique, declarative title specific to this devotional's angle (avoid generic church phrases)",
  "anchorScripture": "Full verse reference (e.g., Matthew 18:20)",
  "scriptureText": "Full text of the scripture verse(s) - include 2-4 verses if relevant",
  "meditation": "A substantial, 4-6 paragraph meditation (each paragraph 4-6 sentences) that: 1) Opens by addressing ${churchName} directly with a compelling hook 2) Explores the scripture's original context and meaning 3) Reframes online/scattered church as biblical, not modern 4) Develops the theme with rich theological depth and practical insight 5) Calls to personal holiness without external pressure 6) Links righteousness to mission, not comfort 7) Closes with a Christ-centered synthesis. Write with pastoral warmth and prophetic urgency. Each paragraph should build on the previous one, creating a cohesive spiritual journey through the text.",
  "communalPractice": "2-3 specific, actionable practices for ${churchName} community engagement throughout the week. Include both digital and in-person options where applicable.",
  "closingPrayer": "A rich 8-12 line pastoral prayer addressing God on behalf of ${churchName}, always plural (we, not I). Structure: 1) Acknowledge God's character related to today's theme 2) Confess our weakness in this area 3) Ask for specific grace and strength 4) Intercede for the church body 5) Close with a declaration of trust and hope"
}`;

    // Add date context for unique titles
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

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
          { role: 'user', content: `Generate a ${dayOfWeek} devotional with the theme: "${dayTheme}" for ${dateStr}. Make it powerful, grounded, and mission-focused for ${churchName}. Create a UNIQUE title that hasn't been used before - something fresh and specific to the insight you'll share today.` }
        ],
        temperature: 0.8,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated');
    }

    // Parse the JSON response
    let devotional;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      devotional = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw content:', content);
      throw new Error('Failed to parse devotional content');
    }

    return new Response(JSON.stringify({ devotional }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating church devotional:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
