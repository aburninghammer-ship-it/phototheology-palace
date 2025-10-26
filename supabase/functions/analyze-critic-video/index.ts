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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }
    
    if (!YOUTUBE_API_KEY) {
      throw new Error("YOUTUBE_API_KEY not configured. Please add your YouTube Data API v3 key to analyze videos accurately.");
    }

    // Fetch video metadata from YouTube Data API
    let videoData = {
      title: "",
      description: "",
      channelTitle: "",
      tags: [] as string[],
      categoryId: ""
    };
    
    try {
      const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
      console.log("Fetching video metadata from YouTube API...");
      
      const videoResponse = await fetch(youtubeApiUrl);
      if (videoResponse.ok) {
        const videoJson = await videoResponse.json();
        if (videoJson.items && videoJson.items.length > 0) {
          const snippet = videoJson.items[0].snippet;
          videoData = {
            title: snippet.title || "",
            description: snippet.description || "",
            channelTitle: snippet.channelTitle || "",
            tags: snippet.tags || [],
            categoryId: snippet.categoryId || ""
          };
          console.log("Video metadata fetched successfully");
        }
      }
    } catch (error) {
      console.log("Could not fetch video metadata:", error);
    }

    // Try to fetch captions if available
    let captions = "";
    try {
      const captionsUrl = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`;
      const captionsResponse = await fetch(captionsUrl);
      if (captionsResponse.ok) {
        const captionsJson = await captionsResponse.json();
        if (captionsJson.items && captionsJson.items.length > 0) {
          captions = "Captions are available for this video.";
          console.log("Captions found");
        }
      }
    } catch (error) {
      console.log("Could not fetch captions info:", error);
    }

    const systemPrompt = `You are Jeeves, a knowledgeable biblical scholar and apologist specializing in defending biblical truth.

Your task is to analyze videos with discernment:

**FOR PRO-BIBLICAL/PRO-DOCTRINE VIDEOS:**
- Affirm why the biblical position is correct
- Celebrate faithful teaching
- Provide additional biblical support
- Note strengths in apologetic approach
- Explain the theological foundation

**FOR ANTI-BIBLICAL/ANTI-DOCTRINE/ANTI-TRINITY VIDEOS:**
- Defend biblical truth firmly
- Provide detailed, biblically-grounded rebuttals
- Identify logical fallacies in their arguments
- Support responses with Scripture and sound theology
- Show why the criticism is wrong
- Maintain charitable but firm defense of truth

Return your analysis in the following JSON structure:
{
  "videoType": "pro-biblical | anti-biblical",
  "summary": "Brief overview of the video's main thesis and approach",
  "mainClaims": [
    {
      "claim": "The specific claim or argument made",
      "timestamp": "timestamp if available",
      "rebuttal": "Detailed response with biblical reasoning (affirmation if pro-biblical, rebuttal if anti-biblical)"
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
      "topic": "Topic or doctrine addressed",
      "response": "Biblical response with explanation",
      "verses": ["Verse references that support the response"]
    }
  ],
  "additionalNotes": "Any additional context, historical information, or important considerations"
}`;

    const userPrompt = `Please analyze this YouTube video comprehensively:

VIDEO URL: ${videoUrl}
VIDEO ID: ${videoId}

VIDEO METADATA:
- Title: ${videoData.title}
- Channel: ${videoData.channelTitle}
- Description: ${videoData.description}
- Tags: ${videoData.tags.join(", ")}
${captions ? `- ${captions}` : ""}

Based on this video information, provide a thorough biblical analysis:

ANALYSIS REQUIREMENTS:
1. Determine if the video is pro-biblical or anti-biblical based on the title, description, channel, and tags
2. Analyze the main theological claims or positions evident from the metadata
3. If pro-biblical: Affirm the sound doctrine with Scripture and explain why it's correct
4. If anti-biblical: Provide detailed biblical rebuttals showing why the claims are wrong
5. Identify any logical fallacies that may be present based on common patterns in similar content
6. Provide comprehensive biblical responses with specific verse references

Be thorough and accurate based on the available video information.`;

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
