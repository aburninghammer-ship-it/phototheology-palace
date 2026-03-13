import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-CHARACTER-IMAGE] ${step}${detailsStr}`);
};

interface CharacterRequest {
  id: string;
  name: string;
  prompt: string;
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

    const { characters, skipExisting = true }: { characters: CharacterRequest[], skipExisting?: boolean } = await req.json();

    if (!characters || !Array.isArray(characters) || characters.length === 0) {
      throw new Error("No characters provided");
    }

    logStep("Processing characters", { count: characters.length });

    const results: { id: string; name: string; success: boolean; url?: string; error?: string }[] = [];

    for (const charData of characters) {
      const { id, name, prompt } = charData;

      try {
        // Check if already exists
        if (skipExisting) {
          const { data: existing } = await supabase
            .from("character_image_cache")
            .select("public_url")
            .eq("character_id", id)
            .maybeSingle();

          if (existing) {
            logStep(`Skipping existing: ${id}`);
            results.push({ id, name, success: true, url: existing.public_url });
            continue;
          }
        }

        logStep(`Generating image for ${name} (${id})`);

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
          logStep(`AI error for ${id}`, { status: response.status, error: errorText });

          if (response.status === 429) {
            results.push({ id, name, success: false, error: "Rate limited - try again later" });
            await new Promise(r => setTimeout(r, 5000));
            continue;
          }
          if (response.status === 402) {
            results.push({ id, name, success: false, error: "Credits exhausted" });
            break; // Stop processing
          }
          results.push({ id, name, success: false, error: `AI error: ${response.status}` });
          continue;
        }

        const aiData = await response.json();
        const imageBase64 = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageBase64 || !imageBase64.startsWith("data:image")) {
          logStep(`No image returned for ${id}`);
          results.push({ id, name, success: false, error: "No image generated" });
          continue;
        }

        // Extract base64 data
        const base64Data = imageBase64.split(",")[1];
        const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Upload to storage
        const storagePath = `portraits/${id}.png`;

        const { error: uploadError } = await supabase.storage
          .from("character-images")
          .upload(storagePath, imageBuffer, {
            contentType: "image/png",
            upsert: true,
          });

        if (uploadError) {
          logStep(`Upload error for ${id}`, uploadError);
          results.push({ id, name, success: false, error: `Upload failed: ${uploadError.message}` });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("character-images")
          .getPublicUrl(storagePath);

        const publicUrl = urlData.publicUrl;

        // Save to cache table
        await supabase.from("character_image_cache").upsert({
          character_id: id,
          storage_path: storagePath,
          public_url: publicUrl,
          prompt_used: prompt,
        }, {
          onConflict: "character_id",
        });

        logStep(`Success: ${id}`, { url: publicUrl });
        results.push({ id, name, success: true, url: publicUrl });

        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 1000));

      } catch (charError: unknown) {
        const errorMsg = charError instanceof Error ? charError.message : String(charError);
        logStep(`Error for ${id}`, { error: errorMsg });
        results.push({ id, name, success: false, error: errorMsg });
      }
    }

    const successCount = results.filter(r => r.success).length;
    logStep("Generation complete", { success: successCount, total: characters.length });

    return new Response(
      JSON.stringify({
        success: true,
        generated: successCount,
        total: characters.length,
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
