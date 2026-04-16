/**
 * Clear Commentary Cache Edge Function
 *
 * Admin utility to clear cached commentary that contains errors.
 * Requires admin authentication.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Admin user IDs who can clear cache
const ADMIN_IDS = [
  "f49b239c-ff0c-4763-a954-b569da753a83", // Add your admin user ID
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_creator")
      .eq("id", user.id)
      .single();

    if (!profile?.is_creator && !ADMIN_IDS.includes(user.id)) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { book, chapter, verse, tier, clearAll } = await req.json();

    let deletedCount = 0;
    const results: string[] = [];

    // Clear from bible_commentaries table
    if (clearAll) {
      const { error } = await supabase
        .from("bible_commentaries")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

      if (!error) {
        results.push(`Cleared all bible_commentaries`);
      }
    } else {
      let query = supabase.from("bible_commentaries").delete();

      if (book) query = query.eq("book", book);
      if (chapter) query = query.eq("chapter", chapter);
      if (verse) query = query.eq("verse", verse);
      if (tier) query = query.eq("tier", tier);

      const { error } = await query;

      if (!error) {
        results.push(`Cleared bible_commentaries for ${book || "all books"} ${chapter ? `chapter ${chapter}` : ""} ${verse ? `verse ${verse}` : ""} ${tier ? `(${tier})` : ""}`);
      }
    }

    // Also clear from verse_commentary_cache if it exists
    if (book || clearAll) {
      let verseQuery = supabase.from("verse_commentary_cache").delete();

      if (!clearAll) {
        if (book) verseQuery = verseQuery.eq("book", book);
        if (chapter) verseQuery = verseQuery.eq("chapter", parseInt(chapter));
        if (verse) verseQuery = verseQuery.eq("verse", parseInt(verse));
      } else {
        verseQuery = verseQuery.neq("id", 0); // Delete all
      }

      const { error: verseError } = await verseQuery;
      if (!verseError) {
        results.push(`Cleared verse_commentary_cache`);
      }
    }

    // Clear chapter_commentary_cache if clearing whole chapters
    if ((book && chapter && !verse) || clearAll) {
      let chapterQuery = supabase.from("chapter_commentary_cache").delete();

      if (!clearAll && book) {
        const normalizedBook = book.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        chapterQuery = chapterQuery.eq("book", normalizedBook);
        if (chapter) chapterQuery = chapterQuery.eq("chapter", parseInt(chapter));
      } else if (clearAll) {
        chapterQuery = chapterQuery.neq("id", 0);
      }

      const { error: chapterError } = await chapterQuery;
      if (!chapterError) {
        results.push(`Cleared chapter_commentary_cache`);
      }
    }

    console.log(`[ClearCache] Admin ${user.email} cleared cache:`, results);

    return new Response(
      JSON.stringify({
        success: true,
        message: results.join("; "),
        clearedBy: user.email,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("[ClearCache] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
