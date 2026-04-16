import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Map of common story/event keywords to relevant verses
const STORY_KEYWORDS: Record<string, { book: string; chapter: number }[]> = {
  "creation": [{ book: "Genesis", chapter: 1 }, { book: "Genesis", chapter: 2 }],
  "adam and eve": [{ book: "Genesis", chapter: 2 }, { book: "Genesis", chapter: 3 }],
  "fall": [{ book: "Genesis", chapter: 3 }],
  "cain and abel": [{ book: "Genesis", chapter: 4 }],
  "noah": [{ book: "Genesis", chapter: 6 }, { book: "Genesis", chapter: 7 }],
  "flood": [{ book: "Genesis", chapter: 7 }, { book: "Genesis", chapter: 8 }],
  "babel": [{ book: "Genesis", chapter: 11 }],
  "tower of babel": [{ book: "Genesis", chapter: 11 }],
  "abraham": [{ book: "Genesis", chapter: 12 }, { book: "Genesis", chapter: 15 }, { book: "Genesis", chapter: 22 }],
  "isaac sacrifice": [{ book: "Genesis", chapter: 22 }],
  "sodom": [{ book: "Genesis", chapter: 19 }],
  "jacob": [{ book: "Genesis", chapter: 28 }, { book: "Genesis", chapter: 32 }],
  "jacob's ladder": [{ book: "Genesis", chapter: 28 }],
  "joseph": [{ book: "Genesis", chapter: 37 }, { book: "Genesis", chapter: 39 }],
  "coat of many colors": [{ book: "Genesis", chapter: 37 }],
  "moses": [{ book: "Exodus", chapter: 3 }, { book: "Exodus", chapter: 14 }, { book: "Exodus", chapter: 20 }],
  "burning bush": [{ book: "Exodus", chapter: 3 }],
  "passover": [{ book: "Exodus", chapter: 12 }],
  "red sea": [{ book: "Exodus", chapter: 14 }],
  "ten commandments": [{ book: "Exodus", chapter: 20 }],
  "golden calf": [{ book: "Exodus", chapter: 32 }],
  "tabernacle": [{ book: "Exodus", chapter: 25 }, { book: "Exodus", chapter: 40 }],
  "sanctuary": [{ book: "Exodus", chapter: 25 }, { book: "Leviticus", chapter: 16 }],
  "david": [{ book: "1 Samuel", chapter: 17 }, { book: "2 Samuel", chapter: 7 }],
  "goliath": [{ book: "1 Samuel", chapter: 17 }],
  "david and goliath": [{ book: "1 Samuel", chapter: 17 }],
  "daniel": [{ book: "Daniel", chapter: 1 }, { book: "Daniel", chapter: 6 }],
  "lion's den": [{ book: "Daniel", chapter: 6 }],
  "fiery furnace": [{ book: "Daniel", chapter: 3 }],
  "jonah": [{ book: "Jonah", chapter: 1 }, { book: "Jonah", chapter: 2 }],
  "nativity": [{ book: "Luke", chapter: 2 }, { book: "Matthew", chapter: 1 }],
  "birth of jesus": [{ book: "Luke", chapter: 2 }],
  "wise men": [{ book: "Matthew", chapter: 2 }],
  "sermon on the mount": [{ book: "Matthew", chapter: 5 }, { book: "Matthew", chapter: 6 }],
  "beatitudes": [{ book: "Matthew", chapter: 5 }],
  "lord's prayer": [{ book: "Matthew", chapter: 6 }],
  "transfiguration": [{ book: "Matthew", chapter: 17 }],
  "feeding 5000": [{ book: "John", chapter: 6 }],
  "water into wine": [{ book: "John", chapter: 2 }],
  "lazarus": [{ book: "John", chapter: 11 }],
  "prodigal son": [{ book: "Luke", chapter: 15 }],
  "good samaritan": [{ book: "Luke", chapter: 10 }],
  "sower": [{ book: "Matthew", chapter: 13 }],
  "lost sheep": [{ book: "Luke", chapter: 15 }],
  "talents": [{ book: "Matthew", chapter: 25 }],
  "ten virgins": [{ book: "Matthew", chapter: 25 }],
  "last supper": [{ book: "Matthew", chapter: 26 }, { book: "John", chapter: 13 }],
  "gethsemane": [{ book: "Matthew", chapter: 26 }],
  "crucifixion": [{ book: "Matthew", chapter: 27 }, { book: "John", chapter: 19 }],
  "resurrection": [{ book: "Matthew", chapter: 28 }, { book: "John", chapter: 20 }],
  "ascension": [{ book: "Acts", chapter: 1 }],
  "pentecost": [{ book: "Acts", chapter: 2 }],
  "paul": [{ book: "Acts", chapter: 9 }, { book: "Acts", chapter: 13 }],
  "damascus road": [{ book: "Acts", chapter: 9 }],
  "revelation": [{ book: "Revelation", chapter: 1 }, { book: "Revelation", chapter: 21 }],
  "new jerusalem": [{ book: "Revelation", chapter: 21 }],
  "second coming": [{ book: "Revelation", chapter: 19 }, { book: "Matthew", chapter: 24 }],
};

interface SearchResult {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

// ─── ACTION: text (default) — DB-based text search ───
async function handleTextSearch(body: any) {
  const { query, limit = 50 } = body;

  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    return { results: [], error: "Query must be at least 2 characters" };
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const searchQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // Check story/event keywords
  for (const [keyword, references] of Object.entries(STORY_KEYWORDS)) {
    if (searchQuery.includes(keyword) || keyword.includes(searchQuery)) {
      for (const ref of references.slice(0, 3)) {
        const { data: verses, error } = await supabase
          .from('bible_verses_tokenized')
          .select('book, chapter, verse_num, text_kjv')
          .eq('book', ref.book)
          .eq('chapter', ref.chapter)
          .order('verse_num')
          .limit(5);

        if (!error && verses) {
          for (const verse of verses) {
            results.push({ book: verse.book, chapter: verse.chapter, verse: verse.verse_num, text: verse.text_kjv.trim() });
          }
        }
        if (results.length >= limit) break;
      }
      if (results.length >= limit) break;
    }
  }

  if (results.length > 0) {
    return { results: results.slice(0, limit) };
  }

  // Text search with ILIKE
  const { data: searchResults, error: searchError } = await supabase
    .from('bible_verses_tokenized')
    .select('book, chapter, verse_num, text_kjv')
    .ilike('text_kjv', `%${searchQuery}%`)
    .limit(limit);

  if (searchError) throw searchError;

  if (searchResults?.length) {
    for (const verse of searchResults) {
      results.push({ book: verse.book, chapter: verse.chapter, verse: verse.verse_num, text: verse.text_kjv.trim() });
    }
  }

  // Word-by-word fallback
  if (results.length === 0) {
    const words = searchQuery.split(/\s+/).filter(w => w.length > 2);
    if (words.length > 0) {
      let queryBuilder = supabase.from('bible_verses_tokenized').select('book, chapter, verse_num, text_kjv');
      for (const word of words) {
        queryBuilder = queryBuilder.ilike('text_kjv', `%${word}%`);
      }
      const { data: wordResults, error: wordError } = await queryBuilder.limit(limit);
      if (!wordError && wordResults) {
        for (const verse of wordResults) {
          results.push({ book: verse.book, chapter: verse.chapter, verse: verse.verse_num, text: verse.text_kjv.trim() });
        }
      }
    }
  }

  results.sort((a, b) => {
    const aExact = a.text.toLowerCase().includes(searchQuery) ? 0 : 1;
    const bExact = b.text.toLowerCase().includes(searchQuery) ? 0 : 1;
    return aExact - bExact;
  });

  return { results: results.slice(0, limit) };
}

// ─── ACTION: events — AI-powered event search ───
async function handleEventSearch(body: any) {
  const { events, excludeReferences = [] } = body;
  if (!events || events.length === 0) throw new Error("At least one event is required");

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const eventList = events.join(", ");
  const excludeNote = excludeReferences.length > 0
    ? `\n\nIMPORTANT: Do NOT include these verses as they were already shown: ${excludeReferences.join(", ")}`
    : "";

  const systemPrompt = `You are a Bible scholar specializing in finding scripture passages related to biblical events and stories.
Given a list of biblical events/stories, find the most relevant Bible verses (KJV) that describe or reference those events.

Return a JSON array with 5-8 results. Each result should have:
- reference: The Bible reference (e.g., "Genesis 3:6")
- text: The actual verse text from KJV
- event_name: Which event this relates to
- summary: A brief one-sentence explanation of how this verse connects to the event

Focus on verses that directly describe the event or are key moments in the story.
Only return valid JSON array, no markdown or explanation.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Find key Bible verses (KJV) related to these biblical events/stories: ${eventList}${excludeNote}\n\nReturn only a JSON array like:\n[{"reference": "Genesis 3:6", "text": "And when the woman saw...", "event_name": "The Fall", "summary": "The moment Eve took the forbidden fruit"}]` },
      ],
    }),
  });

  if (!response.ok) {
    if (response.status === 429) return { error: "Rate limit exceeded. Please try again in a moment.", _status: 429 };
    if (response.status === 402) return { error: "AI credits exhausted. Please add funds.", _status: 402 };
    throw new Error("AI gateway error");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "[]";
  let results = [];
  try {
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```")) cleanContent = cleanContent.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
    results = JSON.parse(cleanContent);
  } catch { results = []; }

  return { results };
}

// ─── ACTION: word — AI-powered word search ───
async function handleWordSearch(body: any) {
  const { searchTerm, scope = "all", page = 1, limit = 50 } = body;
  if (!searchTerm || searchTerm.trim().length < 2) throw new Error("Search term must be at least 2 characters");

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const offset = (page - 1) * limit;
  const scopeDescription = scope === "ot" ? "Old Testament only (Genesis through Malachi)" : scope === "nt" ? "New Testament only (Matthew through Revelation)" : "the entire Bible (all 66 books)";

  const systemPrompt = `You are a Bible search expert with perfect knowledge of the King James Version (KJV).
Your task is to find ALL verses in the KJV Bible that contain the exact word or phrase provided.
Search scope: ${scopeDescription}

CRITICAL RULES:
1. Only return verses that actually contain the search term (case-insensitive match)
2. Return the EXACT KJV text, not paraphrased or from other translations
3. Include verses with the word in any form (e.g., "stick", "sticks", "sticketh")
4. Order results in biblical order: Genesis to Revelation
5. Return results as a JSON array with: reference, text, book, chapter, verse

For pagination, return results ${offset + 1} through ${offset + limit} if there are more than ${limit} results total.
Also include a "total_estimated" field with your estimate of total matching verses.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Find all KJV Bible verses containing "${searchTerm}" (case-insensitive).\nScope: ${scope === "ot" ? "Old Testament" : scope === "nt" ? "New Testament" : "All Bible"}\nPage: ${page} (showing results ${offset + 1}-${offset + limit})\n\nReturn JSON format:\n{\n  "results": [\n    {"reference": "Genesis 1:1", "text": "In the beginning...", "book": "Genesis", "chapter": 1, "verse": 1}\n  ],\n  "total_estimated": 25,\n  "has_more": true\n}` },
      ],
    }),
  });

  if (!response.ok) {
    if (response.status === 429) return { error: "Rate limit exceeded. Please try again in a moment.", _status: 429 };
    if (response.status === 402) return { error: "AI credits exhausted. Please add funds.", _status: 402 };
    throw new Error("AI gateway error");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  let parsed = { results: [], total_estimated: 0, has_more: false };
  try {
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```")) cleanContent = cleanContent.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
    parsed = JSON.parse(cleanContent);
  } catch { /* use defaults */ }

  return parsed;
}

// ─── ROUTER ───
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    // Route by action: "text" (default), "events", "word"
    const action = body.action || "text";

    let result: any;
    switch (action) {
      case "events":
        result = await handleEventSearch(body);
        break;
      case "word":
        result = await handleWordSearch(body);
        break;
      case "text":
      default:
        result = await handleTextSearch(body);
        break;
    }

    const status = result?._status || 200;
    if (result?._status) delete result._status;

    return new Response(JSON.stringify(result), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ results: [], error: error instanceof Error ? error.message : 'Search failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
