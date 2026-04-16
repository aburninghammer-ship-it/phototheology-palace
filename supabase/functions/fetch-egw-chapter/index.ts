import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mapping from app book IDs to EGW Writings book numbers and chapter paragraph IDs
// These IDs correspond to the AMP pages at text.egwwritings.org/amp/read/{bookNum}.{paraId}
const EGW_BOOK_MAP: Record<string, { bookNum: number; chapters: number[] }> = {
  "patriarchs-prophets": {
    bookNum: 84,
    chapters: [0, 68, 117, 155, 215, 254, 289, 336, 399, 428, 454, 488, 517, 584, 632, 697, 729, 758, 813, 852, 901, 945, 1042, 1118, 1195, 1225, 1270, 1328, 1403, 1479, 1538, 1614, 1631, 1687, 1755, 1797, 1859, 1887, 1932, 1988, 2012, 2085, 2127, 2163, 2214, 2245, 2302, 2326, 2352, 2414, 2434, 2461, 2499, 2538, 2620, 2666, 2698, 2726, 2786, 2832, 2900, 2946, 2996, 3013, 3043, 3100, 3169, 3203, 3236, 3274, 3303, 3386, 3447, 3535],
  },
  "prophets-kings": {
    bookNum: 88,
    chapters: [0, 72, 120, 190, 234, 301, 361, 422, 461, 505, 544, 621, 671, 723, 767, 820, 887, 954, 1008, 1036, 1073, 1115, 1165, 1237, 1297, 1332, 1371, 1417, 1458, 1495, 1548, 1641, 1702, 1753, 1818, 1886, 1962, 2014, 2070, 2125, 2180, 2235, 2285, 2323, 2403, 2454, 2525, 2594, 2641, 2665, 2697, 3314, 2789, 2818, 2869, 2902, 2934, 2965, 3012, 3136, 3221],
  },
  "desire-of-ages": {
    bookNum: 130,
    chapters: [0, 21, 61, 82, 120, 149, 188, 235, 269, 316, 361, 432, 458, 509, 544, 621, 676, 739, 791, 815, 882, 907, 981, 1052, 1076, 1120, 1155, 1212, 1268, 1322, 1369, 1414, 1507, 1538, 1573, 1599, 1649, 1678, 1726, 1755, 1800, 1834, 1908, 1931, 1958, 1990, 2042, 2068, 2101, 2166, 2204, 2253, 2331, 2371, 2429, 2469, 2495, 2528, 2556, 2622, 2654, 2686, 2715, 2781, 2836, 2874, 2938, 2987, 3046, 3081, 3127, 3159, 3208, 3257, 3359, 3419, 3509, 3548, 3660, 3742, 3790, 3841, 3880, 3913, 3940, 3977, 4019, 4080],
  },
  "acts-apostles": {
    bookNum: 127,
    chapters: [0, 22, 53, 86, 128, 180, 222, 281, 312, 355, 396, 422, 463, 516, 551, 614, 672, 719, 772, 824, 882, 926, 972, 1020, 1076, 1124, 1187, 1240, 1286, 1318, 1365, 1427, 1476, 1525, 1582, 1638, 1682, 1709, 1757, 1849, 1890, 1909, 1939, 1976, 2039, 2074, 2144, 2162, 2174, 2201, 2250, 2269, 2335, 2377, 2409, 2454, 2496, 2541, 2611],
  },
  "great-controversy": {
    bookNum: 132,
    chapters: [0, 69, 160, 200, 257, 336, 419, 526, 646, 768, 832, 896, 963, 1083, 1118, 1214, 1321, 1368, 1450, 1565, 1619, 1704, 1774, 1851, 1918, 1960, 2041, 2087, 2168, 2227, 2286, 2312, 2343, 2404, 2495, 2545, 2635, 2680, 2727, 2769, 2868, 2946, 2989],
  },
  "steps-to-christ": {
    bookNum: 108,
    chapters: [0, 21, 52, 75, 139, 160, 186, 217, 258, 296, 332, 367, 422, 459],
  },
  "christs-object-lessons": {
    bookNum: 15,
    chapters: [0, 31, 78, 221, 254, 279, 296, 356, 393, 462, 487, 497, 555, 617, 681, 766, 833, 899, 934, 1027, 1070, 1104, 1160, 1222, 1349, 1417, 1643, 1690, 1754, 1833],
  },
};

/**
 * Fetch chapter text from EGW Writings AMP page (authoritative source).
 * Returns array of paragraph strings, or null if fetch/parse fails.
 */
async function fetchFromEGWWritings(bookId: string, chapterNumber: number): Promise<string[] | null> {
  const bookConfig = EGW_BOOK_MAP[bookId];
  if (!bookConfig) {
    console.log(`No EGW book mapping for: ${bookId}`);
    return null;
  }

  if (chapterNumber < 1 || chapterNumber >= bookConfig.chapters.length) {
    console.log(`Chapter ${chapterNumber} out of range for ${bookId} (max: ${bookConfig.chapters.length - 1})`);
    return null;
  }

  const paraId = bookConfig.chapters[chapterNumber];
  const url = `https://text.egwwritings.org/amp/read/${bookConfig.bookNum}.${paraId}`;
  console.log(`Fetching EGW chapter from: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PhototheologyApp/1.0)",
        "Accept": "text/html",
      },
    });

    if (!response.ok) {
      console.error(`EGW fetch failed: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Extract paragraph text from <p> tags
    // The AMP pages contain paragraphs with the chapter text and PP/GC/DA etc. references
    const paragraphs: string[] = [];

    // Match all <p> tags and extract their text content
    const pTagRegex = /<p>([\s\S]*?)<\/p>/g;
    let match;

    while ((match = pTagRegex.exec(html)) !== null) {
      let text = match[1];

      // Remove HTML tags but preserve text content
      // Remove <span> tags (bible links, page breaks, notes)
      text = text.replace(/<span class="page-break"[^>]*><\/span>/g, "");
      text = text.replace(/<span class="non-egw-note">[^<]*<\/span>/g, "");
      text = text.replace(/<span class="sameasprevious">([^<]*(?:<[^>]*>[^<]*)*)<\/span>/g, "$1");
      text = text.replace(/<span class="egwlink[^"]*"[^>]*>([^<]*)<\/span>/g, "$1");
      text = text.replace(/<span[^>]*>([^<]*)<\/span>/g, "$1");
      // Remove any remaining nested spans
      text = text.replace(/<span[^>]*>/g, "").replace(/<\/span>/g, "");
      // Convert <br> to newlines (for poetry/verse sections)
      text = text.replace(/<br\s*\/?>/g, "\n");
      // Remove any other HTML tags
      text = text.replace(/<[^>]+>/g, "");
      // Clean up whitespace
      text = text.replace(/\s+/g, " ").trim();
      // Remove trailing EGW reference (e.g., "PP 33.1", "GC 5.2", "DA 12.3")
      text = text.replace(/\s+[A-Z]{2,4}\s+\d+\.\d+\s*$/, "");

      // Skip empty paragraphs or very short ones (navigation, etc.)
      if (text.length > 20) {
        paragraphs.push(text);
      }
    }

    if (paragraphs.length > 0) {
      console.log(`Successfully extracted ${paragraphs.length} paragraphs from EGW Writings`);
      return paragraphs;
    }

    console.log("No paragraphs found in EGW HTML");
    return null;
  } catch (error) {
    console.error("Error fetching from EGW Writings:", error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookId, chapterNumber, chapterTitle, bookTitle, forceRefresh } = await req.json();

    if (!bookId || !chapterNumber || !chapterTitle || !bookTitle) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // If forceRefresh, delete cached chapter AND any associated commentary
    if (forceRefresh) {
      console.log(`Force refresh requested for ${bookId} ch${chapterNumber}`);
      await supabase
        .from("egw_chapter_cache")
        .delete()
        .eq("book_id", bookId)
        .eq("chapter_number", chapterNumber);
      // Also clear any cached commentary for this chapter (stored with chapter_number=0 and composite book_id key)
      await supabase
        .from("egw_chapter_cache")
        .delete()
        .like("book_id", `${bookId}_ch${chapterNumber}_%`)
        .eq("chapter_number", 0);
    } else {
      // Check cache first — serve if we have a complete chapter (10+ paragraphs)
      const { data: cached } = await supabase
        .from("egw_chapter_cache")
        .select("paragraphs")
        .eq("book_id", bookId)
        .eq("chapter_number", chapterNumber)
        .maybeSingle();

      if (cached?.paragraphs && Array.isArray(cached.paragraphs) && cached.paragraphs.length >= 10) {
        return new Response(
          JSON.stringify({ paragraphs: cached.paragraphs, cached: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // If cache exists but is too short, delete it
      if (cached?.paragraphs && Array.isArray(cached.paragraphs) && cached.paragraphs.length > 0 && cached.paragraphs.length < 10) {
        console.log(`Cache hit but only ${cached.paragraphs.length} paragraphs — regenerating`);
        await supabase
          .from("egw_chapter_cache")
          .delete()
          .eq("book_id", bookId)
          .eq("chapter_number", chapterNumber);
      }
    }

    // PRIMARY SOURCE: Fetch from EGW Writings (authoritative, public domain text)
    let paragraphs = await fetchFromEGWWritings(bookId, chapterNumber);

    // FALLBACK: If EGW Writings fetch fails, use AI generation
    if (!paragraphs || paragraphs.length === 0) {
      console.log("EGW Writings fetch failed, falling back to AI generation");

      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) {
        throw new Error("LOVABLE_API_KEY not configured");
      }

      const prompt = `You are a faithful reproducer of Ellen G. White's writings. Reproduce the ENTIRE, COMPLETE, UNABRIDGED text of the chapter below as accurately as possible from your training data. These works are in the public domain.

**Book:** ${bookTitle}
**Chapter ${chapterNumber}:** "${chapterTitle}"

CRITICAL INSTRUCTIONS:
1. Reproduce the COMPLETE chapter text — EVERY paragraph from the FIRST sentence to the LAST sentence of the chapter
2. Do NOT summarize, abbreviate, or skip ANY paragraphs — the user needs the FULL chapter
3. Ellen White chapters are typically 20-60 paragraphs long. If your output has fewer than 15 paragraphs, you are almost certainly truncating — keep going
4. Break the text into natural paragraphs as they appear in the original
5. Return ONLY a JSON array of paragraph strings, each being the full text of that paragraph
6. Do NOT add commentary, headers, chapter titles, or footnotes — just the raw EGW text
7. Maintain the original sentence structure and vocabulary
8. If you are uncertain about exact wording, reproduce the closest faithful version
9. Do NOT stop early. The chapter is not complete until you reach the final paragraph
10. Most EGW chapters end with a powerful concluding statement or Scripture reference — make sure you include it

Return ONLY a valid JSON array like: ["First paragraph text...", "Second paragraph text...", ..., "Final paragraph text..."]`;

      const response = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-pro",
            messages: [
              { role: "system", content: "You are a faithful reproducer of Ellen G. White's public domain writings. You MUST reproduce COMPLETE, UNABRIDGED chapters — every paragraph from first to last. Never truncate or summarize. Return only valid JSON arrays of paragraph strings." },
              { role: "user", content: prompt },
            ],
            max_tokens: 32768,
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("AI gateway error:", response.status, errText);

        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        throw new Error("Failed to generate chapter text");
      }

      const data = await response.json();
      const rawText = data?.choices?.[0]?.message?.content;

      if (!rawText) {
        throw new Error("No content returned from AI");
      }

      try {
        let cleanText = rawText.trim();
        if (cleanText.startsWith("```")) {
          cleanText = cleanText.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
        }
        paragraphs = JSON.parse(cleanText);
        if (!Array.isArray(paragraphs)) throw new Error("Not an array");
        paragraphs = paragraphs.filter((p: string) => typeof p === "string" && p.trim().length > 0);
      } catch {
        paragraphs = rawText
          .split(/\n\n+/)
          .map((p: string) => p.trim())
          .filter((p: string) => p.length > 0);
      }
    }

    if (!paragraphs || paragraphs.length === 0) {
      throw new Error("No paragraphs generated");
    }

    // Cache the result
    await supabase
      .from("egw_chapter_cache")
      .upsert({
        book_id: bookId,
        chapter_number: chapterNumber,
        chapter_title: chapterTitle,
        paragraphs,
      }, { onConflict: "book_id,chapter_number" });

    return new Response(
      JSON.stringify({ paragraphs, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("fetch-egw-chapter error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Failed to fetch chapter" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
