import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, slideType, mood, style } = await req.json();

    console.log("[generate-slide-image] Generating image for:", { slideType, mood });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Build an enhanced prompt based on slide context
    const styleDescriptors: Record<string, string> = {
      light: "bright, clean, modern, minimalist, white and soft tones",
      dark: "moody, dramatic, deep shadows, rich colors, cinematic lighting",
      warm: "golden hour, warm amber tones, inviting, comfortable, sunset colors",
      cool: "serene, blue tones, peaceful, contemplative, morning light",
      neutral: "balanced, professional, subtle textures, sophisticated",
    };

    const slideTypeDescriptors: Record<string, string> = {
      TITLE: "epic, grand, establishing shot, hero image",
      BIG_IDEA: "powerful, iconic, single focal point, conceptual art",
      SCRIPTURE: "ancient, sacred, reverent, soft lighting, ethereal",
      MAIN_POINT: "clear, focused, instructional, professional",
      ILLUSTRATION: "narrative, storytelling, cinematic, evocative",
      GOSPEL_CENTER: "redemptive, light breaking through, hope, cross imagery subtle",
      APPLICATION: "practical, relatable, everyday life, warm and inviting",
      APPEAL: "emotional, urgent, call to action, dramatic lighting",
      TRANSITION: "abstract, minimal, flowing, connecting",
      QUESTION: "contemplative, mystery, dramatic pause, thoughtful",
    };

    const moodStyle = styleDescriptors[mood] || styleDescriptors.neutral;
    const typeStyle = slideTypeDescriptors[slideType] || "professional, clean";

    const enhancedPrompt = `Create a presentation slide background image: ${prompt}

Style: ${moodStyle}
Purpose: ${typeStyle}

Requirements:
- 16:9 widescreen aspect ratio
- Suitable as a background with text overlay
- Leave space for text (avoid busy center areas)
- High quality, professional look
- No text or watermarks
- Subtle, not distracting from message
- Ultra high resolution`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: enhancedPrompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("[generate-slide-image] AI error:", response.status, errorText);
      throw new Error(`AI image generation failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract image from response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("[generate-slide-image] No image in response:", JSON.stringify(data).substring(0, 500));
      throw new Error("No image generated");
    }

    console.log("[generate-slide-image] Image generated successfully");

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[generate-slide-image] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
