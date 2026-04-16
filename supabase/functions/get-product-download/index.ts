import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Map product IDs to their PDF filenames in storage
// Products can have single file (string) or multiple files (string[])
const PRODUCT_FILES: Record<string, string | string[]> = {
  "quick-start-guide": "THE-PHOTOTHEOLOGY-QUICK-START-GUIDE.pdf",
  "genesis-6-days": "GENESIS-IN-6-DAYS.pdf",
  "study-suite": [
    "FLOOR-2.pdf",
    "FLOOR-4-The-Next-Level-Floor.pdf", 
    "FLOOR-6.pdf"
  ],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product } = await req.json();

    if (!product || !PRODUCT_FILES[product]) {
      return new Response(
        JSON.stringify({ error: "Invalid product specified" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const files = PRODUCT_FILES[product];
    const bucketName = "products";

    // Handle single file or multiple files
    if (typeof files === "string") {
      // Single file - return single URL
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(files, 3600);

      if (error) {
        console.error("[get-product-download] Storage error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to generate download link" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`[get-product-download] Generated signed URL for ${product}`);

      return new Response(
        JSON.stringify({ url: data.signedUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Multiple files - return array of URLs with names
      const urls: { name: string; url: string }[] = [];
      
      for (const fileName of files) {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(fileName, 3600);

        if (error) {
          console.error(`[get-product-download] Storage error for ${fileName}:`, error);
          continue;
        }

        urls.push({
          name: fileName.replace('.pdf', '').replace(/-/g, ' ').replace(/study suite (\d)/, 'Study Suite Part $1'),
          url: data.signedUrl
        });
      }

      if (urls.length === 0) {
        return new Response(
          JSON.stringify({ error: "Failed to generate download links" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`[get-product-download] Generated ${urls.length} signed URLs for ${product}`);

      return new Response(
        JSON.stringify({ urls }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("[get-product-download] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
