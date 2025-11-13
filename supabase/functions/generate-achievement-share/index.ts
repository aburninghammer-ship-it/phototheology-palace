import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { achievementName, achievementIcon, points, userName, userLevel, userStreak, roomsCompleted } = await req.json();

    console.log('Generating achievement share image for:', achievementName);

    // Create a detailed prompt for the achievement share image
    const prompt = `Create a beautiful, celebratory social media share image with the following elements:

LAYOUT & DESIGN:
- A vibrant gradient background (purple to indigo to blue)
- Modern, clean design suitable for social media sharing
- 1200x630 pixels aspect ratio (optimal for social sharing)

MAIN CONTENT (centered):
- Large achievement badge icon: ${achievementIcon}
- Bold text: "ACHIEVEMENT UNLOCKED!"
- Achievement name in elegant font: "${achievementName}"
- Prominent "+${points} Points" in golden color

USER STATS (bottom third):
- Display name: "${userName}"
- Level ${userLevel} badge
- ${userStreak} day streak (with flame icon 🔥)
- ${roomsCompleted} rooms completed (with building icon 🏛️)

VISUAL ELEMENTS:
- Sparkles and confetti scattered around the badge
- Subtle shine/glow effect on the achievement badge
- Professional, polished look suitable for sharing
- Include "Phototheology Palace" branding subtly at bottom
- Add decorative borders or frames

STYLE:
- Ultra high resolution, professional quality
- Vibrant colors that pop on social media
- Celebratory and achievement-focused mood
- Modern typography with good contrast
- Eye-catching but not overwhelming`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI API error:', errorText);
      throw new Error(`Lovable AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Lovable AI response received');

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error('No image URL in response:', JSON.stringify(data));
      throw new Error('No image generated');
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in generate-achievement-share:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate share image';
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
