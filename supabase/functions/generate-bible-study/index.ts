import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, description, sessionCount } = await req.json();
    
    if (!topic || !sessionCount) {
      return new Response(
        JSON.stringify({ error: 'Topic and session count are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert Bible study curriculum designer who creates engaging, theologically sound, and practical Bible study series. You specialize in Phototheology principles and Seventh-day Adventist theology.

Your studies should:
- Be Christ-centered and doctrinally sound
- Include engaging icebreakers and discussion questions
- Provide practical applications
- Use multiple scripture references
- Be appropriate for small groups
- Include opening and closing prayers
- Follow a clear structure

Generate a comprehensive Bible study series in the following JSON format:
{
  "seriesTitle": "Title of the series",
  "overview": "Brief overview of the series",
  "sessions": [
    {
      "sessionNumber": 1,
      "title": "Session title",
      "scripture": "Primary scripture reference",
      "openingPrayer": "A prayer to open the session",
      "icebreaker": "An engaging question or activity to start discussion",
      "mainTeaching": "Main teaching content (3-4 paragraphs)",
      "discussionQuestions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
      "practicalApplication": "How to apply this in daily life",
      "closingPrayer": "A prayer to close the session"
    }
  ]
}`;

    const userPrompt = `Create a ${sessionCount}-session Bible study series on the topic: "${topic}"
${description ? `\nAdditional details: ${description}` : ''}

Make each session substantial and engaging. Include specific scripture references, thoughtful discussion questions, and practical applications.`;

    console.log('Generating Bible study with Lovable AI...');
    
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
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI generation failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    let study;
    try {
      study = JSON.parse(generatedContent);
    } catch (e) {
      console.error('Failed to parse AI response:', generatedContent);
      throw new Error('Failed to parse generated study');
    }

    console.log('Bible study generated successfully');
    
    return new Response(
      JSON.stringify({ study }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-bible-study function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
