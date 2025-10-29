import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!roles || roles.role !== "admin") {
      throw new Error("Forbidden: Admin access required");
    }

    console.log("Starting Bible import (simplified demo)...");

    // For now, import a small sample to test the system
    const sampleVerses = [
      {
        book: "John",
        chapter: 3,
        verse_num: 16,
        text_kjv: "For God so loved the world, that he gave his only begotten Son",
        tokens: [
          { t: "For", s: null },
          { t: "God", s: "G2316" },
          { t: "so", s: null },
          { t: "loved", s: "G25" },
          { t: "the", s: null },
          { t: "world", s: "G2889" },
          { t: "that", s: null },
          { t: "he", s: null },
          { t: "gave", s: "G1325" },
          { t: "his", s: null },
          { t: "only", s: "G3439" },
          { t: "begotten", s: "G3439" },
          { t: "Son", s: "G5207" }
        ]
      }
    ];

    const { error: insertError } = await supabase
      .from('bible_verses_tokenized')
      .upsert(sampleVerses, { onConflict: 'book,chapter,verse_num' });

    if (insertError) {
      throw insertError;
    }

    console.log("Import completed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bible import completed (demo version)",
        stats: {
          totalVersesImported: sampleVerses.length,
          totalErrors: 0
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Import error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
