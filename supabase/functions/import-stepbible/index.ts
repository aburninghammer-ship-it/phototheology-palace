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

    // Sample verses from key passages
    const sampleVerses = [
      {
        book: "John",
        chapter: 3,
        verse_num: 16,
        text_kjv: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
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
          { t: "Son", s: "G5207" },
          { t: "that", s: null },
          { t: "whosoever", s: null },
          { t: "believeth", s: "G4100" },
          { t: "in", s: null },
          { t: "him", s: null },
          { t: "should", s: null },
          { t: "not", s: null },
          { t: "perish", s: "G622" },
          { t: "but", s: null },
          { t: "have", s: "G2192" },
          { t: "everlasting", s: "G166" },
          { t: "life", s: "G2222" }
        ]
      },
      {
        book: "John",
        chapter: 1,
        verse_num: 1,
        text_kjv: "In the beginning was the Word, and the Word was with God, and the Word was God.",
        tokens: [
          { t: "In", s: null },
          { t: "the", s: null },
          { t: "beginning", s: "G746" },
          { t: "was", s: null },
          { t: "the", s: null },
          { t: "Word", s: "G3056" },
          { t: "and", s: null },
          { t: "the", s: null },
          { t: "Word", s: "G3056" },
          { t: "was", s: null },
          { t: "with", s: null },
          { t: "God", s: "G2316" },
          { t: "and", s: null },
          { t: "the", s: null },
          { t: "Word", s: "G3056" },
          { t: "was", s: null },
          { t: "God", s: "G2316" }
        ]
      },
      {
        book: "John",
        chapter: 14,
        verse_num: 6,
        text_kjv: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
        tokens: [
          { t: "Jesus", s: null },
          { t: "saith", s: null },
          { t: "unto", s: null },
          { t: "him", s: null },
          { t: "I", s: null },
          { t: "am", s: null },
          { t: "the", s: null },
          { t: "way", s: "G3598" },
          { t: "the", s: null },
          { t: "truth", s: "G225" },
          { t: "and", s: null },
          { t: "the", s: null },
          { t: "life", s: "G2222" },
          { t: "no", s: null },
          { t: "man", s: null },
          { t: "cometh", s: null },
          { t: "unto", s: null },
          { t: "the", s: null },
          { t: "Father", s: "G3962" },
          { t: "but", s: null },
          { t: "by", s: null },
          { t: "me", s: null }
        ]
      },
      {
        book: "Genesis",
        chapter: 1,
        verse_num: 1,
        text_kjv: "In the beginning God created the heaven and the earth.",
        tokens: [
          { t: "In", s: null },
          { t: "the", s: null },
          { t: "beginning", s: "H7225" },
          { t: "God", s: "H430" },
          { t: "created", s: "H1254" },
          { t: "the", s: null },
          { t: "heaven", s: "H8064" },
          { t: "and", s: null },
          { t: "the", s: null },
          { t: "earth", s: "H776" }
        ]
      },
      {
        book: "Psalm",
        chapter: 23,
        verse_num: 1,
        text_kjv: "The LORD is my shepherd; I shall not want.",
        tokens: [
          { t: "The", s: null },
          { t: "LORD", s: "H3068" },
          { t: "is", s: null },
          { t: "my", s: null },
          { t: "shepherd", s: "H7462" },
          { t: "I", s: null },
          { t: "shall", s: null },
          { t: "not", s: "H3808" },
          { t: "want", s: "H2637" }
        ]
      },
      {
        book: "Romans",
        chapter: 3,
        verse_num: 23,
        text_kjv: "For all have sinned, and come short of the glory of God;",
        tokens: [
          { t: "For", s: null },
          { t: "all", s: "G3956" },
          { t: "have", s: null },
          { t: "sinned", s: "G264" },
          { t: "and", s: null },
          { t: "come short", s: "G5302" },
          { t: "of", s: null },
          { t: "the", s: null },
          { t: "glory", s: "G1391" },
          { t: "of", s: null },
          { t: "God", s: "G2316" }
        ]
      },
      {
        book: "Romans",
        chapter: 6,
        verse_num: 23,
        text_kjv: "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.",
        tokens: [
          { t: "For", s: null },
          { t: "the", s: null },
          { t: "wages", s: "G3800" },
          { t: "of", s: null },
          { t: "sin", s: "G266" },
          { t: "is", s: null },
          { t: "death", s: "G2288" },
          { t: "but", s: null },
          { t: "the", s: null },
          { t: "gift", s: "G5486" },
          { t: "of", s: null },
          { t: "God", s: "G2316" },
          { t: "is", s: null },
          { t: "eternal", s: "G166" },
          { t: "life", s: "G2222" },
          { t: "through", s: null },
          { t: "Jesus", s: null },
          { t: "Christ", s: null },
          { t: "our", s: null },
          { t: "Lord", s: "G2962" }
        ]
      },
      {
        book: "Ephesians",
        chapter: 2,
        verse_num: 8,
        text_kjv: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:",
        tokens: [
          { t: "For", s: null },
          { t: "by", s: null },
          { t: "grace", s: "G5485" },
          { t: "are", s: null },
          { t: "ye", s: null },
          { t: "saved", s: "G4982" },
          { t: "through", s: null },
          { t: "faith", s: "G4102" },
          { t: "and", s: null },
          { t: "that", s: null },
          { t: "not", s: null },
          { t: "of", s: null },
          { t: "yourselves", s: null },
          { t: "it", s: null },
          { t: "is", s: null },
          { t: "the", s: null },
          { t: "gift", s: "G1435" },
          { t: "of", s: null },
          { t: "God", s: "G2316" }
        ]
      },
      {
        book: "Philippians",
        chapter: 4,
        verse_num: 13,
        text_kjv: "I can do all things through Christ which strengtheneth me.",
        tokens: [
          { t: "I", s: null },
          { t: "can", s: "G2480" },
          { t: "do", s: null },
          { t: "all things", s: "G3956" },
          { t: "through", s: null },
          { t: "Christ", s: "G5547" },
          { t: "which", s: null },
          { t: "strengtheneth", s: "G1743" },
          { t: "me", s: null }
        ]
      },
      {
        book: "Revelation",
        chapter: 1,
        verse_num: 8,
        text_kjv: "I am Alpha and Omega, the beginning and the ending, saith the Lord, which is, and which was, and which is to come, the Almighty.",
        tokens: [
          { t: "I", s: null },
          { t: "am", s: null },
          { t: "Alpha", s: "G1" },
          { t: "and", s: null },
          { t: "Omega", s: "G5598" },
          { t: "the", s: null },
          { t: "beginning", s: "G746" },
          { t: "and", s: null },
          { t: "the", s: null },
          { t: "ending", s: "G5056" },
          { t: "saith", s: null },
          { t: "the", s: null },
          { t: "Lord", s: "G2962" },
          { t: "which", s: null },
          { t: "is", s: null },
          { t: "and", s: null },
          { t: "which", s: null },
          { t: "was", s: null },
          { t: "and", s: null },
          { t: "which", s: null },
          { t: "is to come", s: null },
          { t: "the", s: null },
          { t: "Almighty", s: "G3841" }
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
