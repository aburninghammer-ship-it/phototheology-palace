import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Full Bible book list with chapter counts
const BIBLE_BOOKS: [string, number][] = [
  ["Genesis", 50], ["Exodus", 40], ["Leviticus", 27], ["Numbers", 36], ["Deuteronomy", 34],
  ["Joshua", 24], ["Judges", 21], ["Ruth", 4], ["1 Samuel", 31], ["2 Samuel", 24],
  ["1 Kings", 22], ["2 Kings", 25], ["1 Chronicles", 29], ["2 Chronicles", 36],
  ["Ezra", 10], ["Nehemiah", 13], ["Esther", 10], ["Job", 42], ["Psalms", 150],
  ["Proverbs", 31], ["Ecclesiastes", 12], ["Song of Solomon", 8],
  ["Isaiah", 66], ["Jeremiah", 52], ["Lamentations", 5], ["Ezekiel", 48],
  ["Daniel", 12], ["Hosea", 14], ["Joel", 3], ["Amos", 9], ["Obadiah", 1],
  ["Jonah", 4], ["Micah", 7], ["Nahum", 3], ["Habakkuk", 3], ["Zephaniah", 3],
  ["Haggai", 2], ["Zechariah", 14], ["Malachi", 4],
  ["Matthew", 28], ["Mark", 16], ["Luke", 24], ["John", 21],
  ["Acts", 28], ["Romans", 16], ["1 Corinthians", 16], ["2 Corinthians", 13],
  ["Galatians", 6], ["Ephesians", 6], ["Philippians", 4], ["Colossians", 4],
  ["1 Thessalonians", 5], ["2 Thessalonians", 3], ["1 Timothy", 6], ["2 Timothy", 4],
  ["Titus", 3], ["Philemon", 1], ["Hebrews", 13], ["James", 5],
  ["1 Peter", 5], ["2 Peter", 3], ["1 John", 5], ["2 John", 1], ["3 John", 1],
  ["Jude", 1], ["Revelation", 22],
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { startBook, startChapter, batchSize = 5, regenerate = false } = await req.json();

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Build queue of chapters to generate
    const queue: { book: string; chapter: number }[] = [];
    let started = !startBook; // If no startBook, start from beginning

    for (const [book, chapters] of BIBLE_BOOKS) {
      if (!started && book === startBook) started = true;
      if (!started) continue;

      const startCh = book === startBook && startChapter ? startChapter : 1;

      for (let ch = startCh; ch <= chapters; ch++) {
        queue.push({ book, chapter: ch });
      }
    }

    // Filter out already-generated chapters (unless regenerate)
    let toGenerate = queue;
    if (!regenerate) {
      const { data: existing } = await supabaseAdmin
        .from("epic_commentaries")
        .select("book, chapter")
        .eq("status", "ready");

      const existingSet = new Set(
        (existing || []).map((e) => `${e.book}:${e.chapter}`),
      );

      toGenerate = queue.filter(
        (q) => !existingSet.has(`${q.book}:${q.chapter}`),
      );
    }

    // Take only batchSize items
    const batch = toGenerate.slice(0, batchSize);

    if (batch.length === 0) {
      return new Response(
        JSON.stringify({
          message: "All chapters already generated!",
          totalRemaining: 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log(`[BatchEpic] Processing ${batch.length} chapters. ${toGenerate.length - batch.length} remaining after this batch.`);

    // Process sequentially to avoid rate limits
    const results: { book: string; chapter: number; status: string; error?: string }[] = [];

    for (const item of batch) {
      try {
        console.log(`[BatchEpic] → ${item.book} ${item.chapter}`);

        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/generate-epic-commentary`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({
              book: item.book,
              chapter: item.chapter,
              regenerate,
            }),
          },
        );

        const data = await response.json();
        results.push({
          book: item.book,
          chapter: item.chapter,
          status: data.status || "error",
          error: data.error,
        });

        // Brief pause between generations to respect rate limits
        await new Promise((r) => setTimeout(r, 2000));
      } catch (error) {
        results.push({
          book: item.book,
          chapter: item.chapter,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Next batch starting point
    const nextItem = toGenerate[batch.length];

    return new Response(
      JSON.stringify({
        processed: results,
        totalRemaining: toGenerate.length - batch.length,
        nextBatch: nextItem
          ? { startBook: nextItem.book, startChapter: nextItem.chapter }
          : null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("[BatchEpic Error]:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
