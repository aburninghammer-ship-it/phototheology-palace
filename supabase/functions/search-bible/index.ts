import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map of common story/event keywords to relevant verses
const STORY_KEYWORDS: Record<string, { book: string; chapter: number }[]> = {
  // Creation and early Genesis
  "creation": [{ book: "Genesis", chapter: 1 }, { book: "Genesis", chapter: 2 }],
  "adam and eve": [{ book: "Genesis", chapter: 2 }, { book: "Genesis", chapter: 3 }],
  "fall": [{ book: "Genesis", chapter: 3 }],
  "cain and abel": [{ book: "Genesis", chapter: 4 }],
  "noah": [{ book: "Genesis", chapter: 6 }, { book: "Genesis", chapter: 7 }],
  "flood": [{ book: "Genesis", chapter: 7 }, { book: "Genesis", chapter: 8 }],
  "babel": [{ book: "Genesis", chapter: 11 }],
  "tower of babel": [{ book: "Genesis", chapter: 11 }],

  // Abraham
  "abraham": [{ book: "Genesis", chapter: 12 }, { book: "Genesis", chapter: 15 }, { book: "Genesis", chapter: 22 }],
  "isaac sacrifice": [{ book: "Genesis", chapter: 22 }],
  "sodom": [{ book: "Genesis", chapter: 19 }],

  // Jacob and Joseph
  "jacob": [{ book: "Genesis", chapter: 28 }, { book: "Genesis", chapter: 32 }],
  "jacob's ladder": [{ book: "Genesis", chapter: 28 }],
  "joseph": [{ book: "Genesis", chapter: 37 }, { book: "Genesis", chapter: 39 }],
  "coat of many colors": [{ book: "Genesis", chapter: 37 }],

  // Moses and Exodus
  "moses": [{ book: "Exodus", chapter: 3 }, { book: "Exodus", chapter: 14 }, { book: "Exodus", chapter: 20 }],
  "burning bush": [{ book: "Exodus", chapter: 3 }],
  "passover": [{ book: "Exodus", chapter: 12 }],
  "red sea": [{ book: "Exodus", chapter: 14 }],
  "ten commandments": [{ book: "Exodus", chapter: 20 }],
  "golden calf": [{ book: "Exodus", chapter: 32 }],
  "tabernacle": [{ book: "Exodus", chapter: 25 }, { book: "Exodus", chapter: 40 }],
  "sanctuary": [{ book: "Exodus", chapter: 25 }, { book: "Leviticus", chapter: 16 }],

  // David
  "david": [{ book: "1 Samuel", chapter: 17 }, { book: "2 Samuel", chapter: 7 }],
  "goliath": [{ book: "1 Samuel", chapter: 17 }],
  "david and goliath": [{ book: "1 Samuel", chapter: 17 }],

  // Prophets
  "daniel": [{ book: "Daniel", chapter: 1 }, { book: "Daniel", chapter: 6 }],
  "lion's den": [{ book: "Daniel", chapter: 6 }],
  "fiery furnace": [{ book: "Daniel", chapter: 3 }],
  "jonah": [{ book: "Jonah", chapter: 1 }, { book: "Jonah", chapter: 2 }],

  // Jesus - Birth
  "nativity": [{ book: "Luke", chapter: 2 }, { book: "Matthew", chapter: 1 }],
  "birth of jesus": [{ book: "Luke", chapter: 2 }],
  "wise men": [{ book: "Matthew", chapter: 2 }],

  // Jesus - Ministry
  "sermon on the mount": [{ book: "Matthew", chapter: 5 }, { book: "Matthew", chapter: 6 }],
  "beatitudes": [{ book: "Matthew", chapter: 5 }],
  "lord's prayer": [{ book: "Matthew", chapter: 6 }],
  "transfiguration": [{ book: "Matthew", chapter: 17 }],
  "feeding 5000": [{ book: "John", chapter: 6 }],
  "water into wine": [{ book: "John", chapter: 2 }],
  "lazarus": [{ book: "John", chapter: 11 }],

  // Parables
  "prodigal son": [{ book: "Luke", chapter: 15 }],
  "good samaritan": [{ book: "Luke", chapter: 10 }],
  "sower": [{ book: "Matthew", chapter: 13 }],
  "lost sheep": [{ book: "Luke", chapter: 15 }],
  "talents": [{ book: "Matthew", chapter: 25 }],
  "ten virgins": [{ book: "Matthew", chapter: 25 }],

  // Jesus - Passion
  "last supper": [{ book: "Matthew", chapter: 26 }, { book: "John", chapter: 13 }],
  "gethsemane": [{ book: "Matthew", chapter: 26 }],
  "crucifixion": [{ book: "Matthew", chapter: 27 }, { book: "John", chapter: 19 }],
  "resurrection": [{ book: "Matthew", chapter: 28 }, { book: "John", chapter: 20 }],
  "ascension": [{ book: "Acts", chapter: 1 }],

  // Early Church
  "pentecost": [{ book: "Acts", chapter: 2 }],
  "paul": [{ book: "Acts", chapter: 9 }, { book: "Acts", chapter: 13 }],
  "damascus road": [{ book: "Acts", chapter: 9 }],

  // Revelation
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, limit = 50 } = await req.json();

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ results: [], error: "Query must be at least 2 characters" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const searchQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // First, check if this matches a known story/event
    for (const [keyword, references] of Object.entries(STORY_KEYWORDS)) {
      if (searchQuery.includes(keyword) || keyword.includes(searchQuery)) {
        // Fetch verses from database for this story
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
              results.push({
                book: verse.book,
                chapter: verse.chapter,
                verse: verse.verse_num,
                text: verse.text_kjv.trim()
              });
            }
          }

          if (results.length >= limit) break;
        }

        if (results.length >= limit) break;
      }
    }

    // If we have story results, return them
    if (results.length > 0) {
      return new Response(
        JSON.stringify({ results: results.slice(0, limit) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Otherwise, do a text search in the database
    // Use ILIKE for case-insensitive partial matching
    const { data: searchResults, error: searchError } = await supabase
      .from('bible_verses_tokenized')
      .select('book, chapter, verse_num, text_kjv')
      .ilike('text_kjv', `%${searchQuery}%`)
      .limit(limit);

    if (searchError) {
      console.error('Database search error:', searchError);
      throw searchError;
    }

    if (searchResults && searchResults.length > 0) {
      for (const verse of searchResults) {
        results.push({
          book: verse.book,
          chapter: verse.chapter,
          verse: verse.verse_num,
          text: verse.text_kjv.trim()
        });
      }
    }

    // If no exact phrase match, try word-by-word search
    if (results.length === 0) {
      const words = searchQuery.split(/\s+/).filter(w => w.length > 2);

      if (words.length > 0) {
        // Build a query that matches all words
        let queryBuilder = supabase
          .from('bible_verses_tokenized')
          .select('book, chapter, verse_num, text_kjv');

        // Add ILIKE for each word
        for (const word of words) {
          queryBuilder = queryBuilder.ilike('text_kjv', `%${word}%`);
        }

        const { data: wordResults, error: wordError } = await queryBuilder.limit(limit);

        if (!wordError && wordResults) {
          for (const verse of wordResults) {
            results.push({
              book: verse.book,
              chapter: verse.chapter,
              verse: verse.verse_num,
              text: verse.text_kjv.trim()
            });
          }
        }
      }
    }

    // Sort results: prioritize exact phrase matches
    results.sort((a, b) => {
      const aExact = a.text.toLowerCase().includes(searchQuery) ? 0 : 1;
      const bExact = b.text.toLowerCase().includes(searchQuery) ? 0 : 1;
      return aExact - bExact;
    });

    return new Response(
      JSON.stringify({ results: results.slice(0, limit) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ results: [], error: error instanceof Error ? error.message : 'Search failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
