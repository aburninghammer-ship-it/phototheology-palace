import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-IMAGE-BIBLE] ${step}${detailsStr}`);
};

interface ChapterRequest {
  book: string;
  chapter: number;
  theme: string;
  summary: string;
  visualIcon: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Authentication failed");

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) throw new Error("Unauthorized - admin access required");
    logStep("Admin verified");

    const { chapters, skipExisting = true }: { chapters: ChapterRequest[], skipExisting?: boolean } = await req.json();
    
    if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
      throw new Error("No chapters provided");
    }

    logStep("Processing chapters", { count: chapters.length });

    const results: { book: string; chapter: number; success: boolean; url?: string; error?: string }[] = [];

    for (const chapterData of chapters) {
      const { book, chapter, theme, summary, visualIcon } = chapterData;
      const key = `${book}-${chapter}`;

      try {
        // Check if already exists
        if (skipExisting) {
          const { data: existing } = await supabase
            .from("image_bible_cache")
            .select("public_url")
            .eq("book", book)
            .eq("chapter", chapter)
            .maybeSingle();

          if (existing) {
            logStep(`Skipping existing: ${key}`);
            results.push({ book, chapter, success: true, url: existing.public_url });
            continue;
          }
        }

        logStep(`Generating image for ${key}`);

        // Create a simple mnemonic image prompt - 24FPS Room style
        // The chapter number should be visibly integrated into the image
        const chapterNumDisplay = chapter.toString();
        const bookAbbrev = book.substring(0, 1).toUpperCase(); // e.g. "G" for Genesis
        
        const prompt = `Create a SIMPLE mnemonic memory image for ${book} chapter ${chapter}.

CRITICAL REQUIREMENTS:
1. The number "${chapterNumDisplay}" must be prominently displayed IN the image - either:
   - On an object (like "${chapterNumDisplay}" carved on a stone, written on a scroll, on a shield, on pottery)
   - As part of the scene (${chapterNumDisplay} items shown, ${chapterNumDisplay} fingers held up)
   - On a marker/sign showing "${bookAbbrev}${chapter}" 
   
2. SIMPLE DESIGN - show only ONE key visual symbol/object that represents this chapter:
   - ${visualIcon}
   
3. Style: Clean cartoon/illustration style, simple shapes, bold colors, WHITE or light cream background. Think "emoji meets children's Bible illustration" - memorable and iconic, not detailed or realistic.

4. The image should be a SINGLE memorable symbol that helps someone remember: "${theme}"

DO NOT: Add complex backgrounds, multiple scenes, detailed landscapes, or realistic photo styles.
DO: Create a simple, bold, iconic image with the chapter number visible.`;

        // Call Lovable AI image generation
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [{ role: "user", content: prompt }],
            modalities: ["image", "text"],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          logStep(`AI error for ${key}`, { status: response.status, error: errorText });
          
          if (response.status === 429) {
            results.push({ book, chapter, success: false, error: "Rate limited - try again later" });
            // Wait before continuing
            await new Promise(r => setTimeout(r, 5000));
            continue;
          }
          if (response.status === 402) {
            results.push({ book, chapter, success: false, error: "Credits exhausted" });
            break; // Stop processing
          }
          results.push({ book, chapter, success: false, error: `AI error: ${response.status}` });
          continue;
        }

        const aiData = await response.json();
        const imageBase64 = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageBase64 || !imageBase64.startsWith("data:image")) {
          logStep(`No image returned for ${key}`);
          results.push({ book, chapter, success: false, error: "No image generated" });
          continue;
        }

        // Extract base64 data
        const base64Data = imageBase64.split(",")[1];
        const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Upload to storage
        const storagePath = `chapters/${book.toLowerCase().replace(/\s+/g, "-")}/${chapter}.png`;
        
        const { error: uploadError } = await supabase.storage
          .from("image-bible")
          .upload(storagePath, imageBuffer, {
            contentType: "image/png",
            upsert: true,
          });

        if (uploadError) {
          logStep(`Upload error for ${key}`, uploadError);
          results.push({ book, chapter, success: false, error: `Upload failed: ${uploadError.message}` });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("image-bible")
          .getPublicUrl(storagePath);

        const publicUrl = urlData.publicUrl;

        // Save to cache table
        await supabase.from("image_bible_cache").upsert({
          book,
          chapter,
          theme,
          storage_path: storagePath,
          public_url: publicUrl,
          prompt_used: prompt,
        }, {
          onConflict: "book,chapter",
        });

        logStep(`Success: ${key}`, { url: publicUrl });
        results.push({ book, chapter, success: true, url: publicUrl });

        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 1000));

      } catch (chapterError: unknown) {
        const errorMsg = chapterError instanceof Error ? chapterError.message : String(chapterError);
        logStep(`Error for ${key}`, { error: errorMsg });
        results.push({ book, chapter, success: false, error: errorMsg });
      }
    }

    const successCount = results.filter(r => r.success).length;
    logStep("Generation complete", { success: successCount, total: chapters.length });

    return new Response(
      JSON.stringify({ 
        success: true, 
        generated: successCount,
        total: chapters.length,
        results 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
