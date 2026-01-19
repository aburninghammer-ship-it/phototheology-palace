import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { decodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { fileBase64, fileName, bucketName, contentType } = await req.json();
    
    console.log(`Uploading file: ${fileName} to bucket: ${bucketName}`);
    console.log(`Content type: ${contentType}`);

    // Decode base64 to binary
    const fileData = decodeBase64(fileBase64);
    
    console.log(`File size: ${fileData.length} bytes`);

    // Delete existing file if it exists
    const { error: deleteError } = await supabaseAdmin.storage
      .from(bucketName)
      .remove([fileName]);
    
    if (deleteError) {
      console.log("Delete error (might not exist):", deleteError.message);
    }

    // Upload the new file
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, fileData, {
        contentType: contentType || "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    console.log("Upload successful:", data);

    // Get the public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return new Response(
      JSON.stringify({ 
        success: true, 
        path: data.path,
        publicUrl: urlData.publicUrl 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
