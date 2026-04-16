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
    const { prompt, style = "classical", book, chapter, theme } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Enhanced style descriptors for high-quality biblical art
    const styleDescriptors: Record<string, string> = {
      classical: "Renaissance oil painting style, dramatic chiaroscuro lighting like Rembrandt or Caravaggio, rich golden tones, museum-quality fine art",
      ethereal: "Luminous ethereal style, soft glowing light rays, heavenly atmosphere, delicate watercolor-like gradients, dreamlike quality",
      epic: "Epic cinematic composition, dramatic wide-angle perspective, volumetric god rays, majestic scale, movie poster quality",
      symbolic: "Rich symbolic iconography, medieval manuscript illumination meets modern design, gold leaf accents, deep meaningful imagery",
      naturalistic: "Photorealistic natural lighting, authentic Middle Eastern landscapes, historically accurate clothing and architecture",
      stainedglass: "Stained glass window aesthetic, vibrant jewel-toned colors, bold outlines, light streaming through colored glass effect"
    };

    const selectedStyle = styleDescriptors[style] || styleDescriptors.classical;
    
    // Build context-aware prompt
    const contextInfo = book && chapter && theme 
      ? `Scene from ${book} chapter ${chapter}: "${theme}".` 
      : "";

    const enhancedPrompt = `Create a stunning, high-quality biblical artwork:

${contextInfo}

Scene: ${prompt}

Art Style: ${selectedStyle}

Requirements:
- Ultra high resolution, museum-quality artwork
- Dramatic composition with clear focal point
- Rich, deep colors with masterful use of light and shadow
- Emotionally evocative and spiritually meaningful
- NO text, words, letters, or watermarks in the image
- Suitable for Bible study visualization and memorization
- Capture the essence of the biblical narrative
- Professional fine art quality`;

    console.log("Generating high-quality image for:", { book, chapter, theme, style });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: enhancedPrompt
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Insufficient credits. Please add credits to continue." }),
          { 
            status: 402, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the image from the response
    const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageData) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image generated");
    }

    return new Response(
      JSON.stringify({ image: imageData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error("Error in generate-visual-anchor:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to generate image" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});