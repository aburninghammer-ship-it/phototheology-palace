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
    // ===== MANDATORY AUTH + ADMIN CHECK =====
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: adminCheck } = await supabaseAuth
      .from("admin_users").select("id").eq("user_id", user.id).maybeSingle();
    if (!adminCheck) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { startBook, startChapter, batchSize = 5, regenerate = false, books: targetBooks, mode = "epic" } = await req.json();

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Build queue of chapters to generate
    const queue: { book: string; chapter: number }[] = [];

    if (targetBooks && Array.isArray(targetBooks) && targetBooks.length > 0) {
      // Targeted mode: generate specific books/chapters
      // e.g. [{ book: "Daniel", chapters: [1,2,...,12] }, { book: "Revelation", chapters: [1,...,22] }, { book: "Matthew", chapters: [24] }]
      for (const entry of targetBooks) {
        if (!entry.book) continue;
        if (entry.chapters && Array.isArray(entry.chapters)) {
          for (const ch of entry.chapters) {
            queue.push({ book: entry.book, chapter: ch });
          }
        } else {
          // If no chapters specified, look up the chapter count
          const bookEntry = BIBLE_BOOKS.find(([b]) => b === entry.book);
          if (bookEntry) {
            for (let ch = 1; ch <= bookEntry[1]; ch++) {
              queue.push({ book: entry.book, chapter: ch });
            }
          }
        }
      }
    } else {
      // Sequential mode: start from startBook/startChapter and continue through the Bible
      let started = !startBook;
      for (const [book, chapters] of BIBLE_BOOKS) {
        if (!started && book === startBook) started = true;
        if (!started) continue;

        const startCh = book === startBook && startChapter ? startChapter : 1;

        for (let ch = startCh; ch <= chapters; ch++) {
          queue.push({ book, chapter: ch });
        }
      }
    }

    // Filter out already-generated chapters (unless regenerate)
    let toGenerate = queue;
    if (!regenerate) {
      const { data: existing } = await supabaseAdmin
        .from("epic_commentaries")
        .select("book, chapter")
        .eq("status", "ready")
        .eq("commentary_mode", mode);

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

    console.log(`[BatchEpic] Firing off ${batch.length} chapters (mode: ${mode}). ${toGenerate.length - batch.length} remaining after this batch.`);

    // Fire-and-forget: kick off all chapters and return immediately
    // Each generate-epic-commentary call handles its own DB persistence
    const firePromises = batch.map(async (item, idx) => {
      // Stagger requests to avoid rate limits (2s between each)
      await new Promise((r) => setTimeout(r, idx * 2000));
      
      try {
        console.log(`[BatchEpic] → Firing ${item.book} ${item.chapter} (mode: ${mode})`);
        
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
              mode,
            }),
          },
        );

        const data = await response.json();
        console.log(`[BatchEpic] ✅ ${item.book} ${item.chapter}: ${data.status || "done"}`);
      } catch (error) {
        console.error(`[BatchEpic] ❌ ${item.book} ${item.chapter}:`, error);
      }
    });

    // Fire and forget — don't await
    Promise.all(firePromises).then(() => {
      console.log(`[BatchEpic] All ${batch.length} chapters completed.`);
    }).catch((err) => {
      console.error(`[BatchEpic] Batch error:`, err);
    });

    // Return immediately with queued status
    return new Response(
      JSON.stringify({
        message: `Queued ${batch.length} chapters for ${mode} mode generation. They will process in the background.`,
        queued: batch.map(b => `${b.book} ${b.chapter}`),
        totalRemaining: toGenerate.length - batch.length,
        nextBatch: toGenerate[batch.length]
          ? { startBook: toGenerate[batch.length].book, startChapter: toGenerate[batch.length].chapter }
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
