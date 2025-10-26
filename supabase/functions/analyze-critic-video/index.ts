import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to fetch YouTube video metadata
async function getYouTubeMetadata(videoId: string): Promise<{ title: string; description: string; channelTitle: string }> {
  try {
    // Use YouTube's oEmbed API which doesn't require an API key
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch video metadata: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      title: data.title || 'Unknown Title',
      description: '',
      channelTitle: data.author_name || 'Unknown Channel'
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    throw new Error(`Failed to fetch video metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoUrl } = await req.json();
    console.log("Analyzing video:", videoUrl);

    if (!videoUrl) {
      throw new Error("Video URL is required");
    }

    // Extract video ID
    const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (!videoIdMatch) {
      throw new Error("Invalid YouTube URL");
    }
    const videoId = videoIdMatch[1];
    console.log("Video ID:", videoId);

    // Fetch video metadata
    console.log("Fetching video metadata...");
    let metadata: { title: string; description: string; channelTitle: string };
    try {
      metadata = await getYouTubeMetadata(videoId);
      console.log(`Metadata fetched - Title: ${metadata.title}, Channel: ${metadata.channelTitle}`);
    } catch (error) {
      console.error("Metadata fetch error:", error);
      throw new Error(`Could not fetch video metadata. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are Jeeves, a knowledgeable biblical scholar and apologist specializing in defending Seventh-day Adventist (SDA) theology and debunking anti-SDA critics.

Your primary mission is to analyze videos critically and defend SDA doctrine with biblical evidence.

**FOR PRO-SDA/PRO-BIBLICAL VIDEOS:**
- Affirm why the SDA position is biblically sound
- Celebrate faithful teaching aligned with SDA theology
- Provide additional biblical support for SDA doctrines
- Note strengths in apologetic approach
- Explain the theological foundation from an SDA perspective

**FOR ANTI-SDA/CRITICAL VIDEOS:**
- Firmly defend SDA biblical truth and doctrine
- Provide detailed, biblically-grounded rebuttals to anti-SDA claims
- Identify logical fallacies and misrepresentations of SDA theology
- Support responses with Scripture and SDA theological understanding
- Show why criticisms of SDA beliefs are wrong
- Address common misconceptions about SDA doctrines
- Maintain charitable but firm defense of SDA truth

**KEY SDA DOCTRINES TO DEFEND:**
- Seventh-day Sabbath (Saturday) observance
- Sanctuary doctrine and investigative judgment
- State of the dead (soul sleep, no eternal torment)
- Spirit of Prophecy and Ellen G. White's prophetic ministry
- The Three Angels' Messages
- Health message and lifestyle principles
- Second Coming and prophetic interpretation

Return your analysis in the following JSON structure:
{
  "videoType": "pro-SDA | anti-SDA",
  "summary": "Brief overview of the video's main thesis and approach from an SDA perspective",
  "mainClaims": [
    {
      "claim": "The specific claim or argument made",
      "timestamp": "timestamp if available",
      "rebuttal": "Detailed SDA response with biblical reasoning (affirmation if pro-SDA, rebuttal if anti-SDA)"
    }
  ],
  "logicalFallacies": [
    {
      "fallacy": "Name of the logical fallacy",
      "explanation": "Why this is a fallacy",
      "example": "Specific example from the video"
    }
  ],
  "biblicalResponses": [
    {
      "topic": "Topic or SDA doctrine addressed",
      "response": "Biblical response defending SDA theology",
      "verses": ["Verse references that support the SDA position"]
    }
  ],
  "additionalNotes": "Any additional context, historical information about SDA theology, or important considerations"
}`;

    const userPrompt = `Please analyze this YouTube video based on its metadata:

VIDEO INFORMATION:
- URL: ${videoUrl}
- Video ID: ${videoId}
- Title: ${metadata.title}
- Channel: ${metadata.channelTitle}

ANALYSIS REQUIREMENTS:
Based on the video title and channel name, provide a thorough SDA apologetic analysis:

1. Research what you know about this channel and their typical stance on SDA theology
2. Analyze the video title to determine if it's pro-SDA, anti-SDA, or neutral
3. Determine if the video is defending or attacking SDA doctrine based on the available information
4. If the content appears pro-SDA: Affirm sound SDA biblical doctrine and explain why these positions are correct
5. If the content appears anti-SDA: Provide detailed biblical rebuttals defending SDA theology against common criticisms
6. Identify common logical fallacies and misrepresentations of SDA beliefs
7. Provide comprehensive biblical responses with specific verse references supporting SDA doctrine
8. Address specific SDA doctrinal points if mentioned in the title (Sabbath, sanctuary, state of dead, etc.)
9. Be thorough and specific in defending SDA theology with biblical evidence

Your analysis should equip SDA believers to respond confidently to critics with biblical truth.`;

    console.log("Calling Lovable AI...");
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
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error(`AI analysis failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI response received");
    
    const analysisText = aiData.choices[0].message.content;
    const analysis = JSON.parse(analysisText);

    return new Response(
      JSON.stringify({ analysis }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in analyze-critic-video:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An error occurred during analysis'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
