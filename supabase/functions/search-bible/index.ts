import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Bible API base URL
const BIBLE_API_BASE = "https://bible-api.com";

// Map of common story/event keywords to relevant verses
const STORY_KEYWORDS: Record<string, { book: string; chapter: number; verses?: string }[]> = {
  // Creation and early Genesis
  "creation": [{ book: "Genesis", chapter: 1 }, { book: "Genesis", chapter: 2 }],
  "adam and eve": [{ book: "Genesis", chapter: 2 }, { book: "Genesis", chapter: 3 }],
  "fall": [{ book: "Genesis", chapter: 3 }],
  "cain and abel": [{ book: "Genesis", chapter: 4 }],
  "noah": [{ book: "Genesis", chapter: 6 }, { book: "Genesis", chapter: 7 }, { book: "Genesis", chapter: 8 }],
  "flood": [{ book: "Genesis", chapter: 7 }, { book: "Genesis", chapter: 8 }],
  "ark": [{ book: "Genesis", chapter: 6 }, { book: "Genesis", chapter: 7 }],
  "babel": [{ book: "Genesis", chapter: 11 }],
  "tower of babel": [{ book: "Genesis", chapter: 11 }],

  // Abraham
  "abraham": [{ book: "Genesis", chapter: 12 }, { book: "Genesis", chapter: 15 }, { book: "Genesis", chapter: 22 }],
  "abram": [{ book: "Genesis", chapter: 12 }, { book: "Genesis", chapter: 15 }],
  "isaac sacrifice": [{ book: "Genesis", chapter: 22 }],
  "sodom": [{ book: "Genesis", chapter: 19 }],
  "lot": [{ book: "Genesis", chapter: 19 }],

  // Jacob and Joseph
  "jacob": [{ book: "Genesis", chapter: 28 }, { book: "Genesis", chapter: 32 }],
  "jacob's ladder": [{ book: "Genesis", chapter: 28 }],
  "esau": [{ book: "Genesis", chapter: 25 }, { book: "Genesis", chapter: 27 }],
  "joseph": [{ book: "Genesis", chapter: 37 }, { book: "Genesis", chapter: 39 }, { book: "Genesis", chapter: 41 }],
  "coat of many colors": [{ book: "Genesis", chapter: 37 }],

  // Moses and Exodus
  "moses": [{ book: "Exodus", chapter: 3 }, { book: "Exodus", chapter: 14 }, { book: "Exodus", chapter: 20 }],
  "burning bush": [{ book: "Exodus", chapter: 3 }],
  "plagues": [{ book: "Exodus", chapter: 7 }, { book: "Exodus", chapter: 8 }, { book: "Exodus", chapter: 9 }, { book: "Exodus", chapter: 10 }],
  "passover": [{ book: "Exodus", chapter: 12 }],
  "red sea": [{ book: "Exodus", chapter: 14 }],
  "parting of the sea": [{ book: "Exodus", chapter: 14 }],
  "ten commandments": [{ book: "Exodus", chapter: 20 }, { book: "Deuteronomy", chapter: 5 }],
  "golden calf": [{ book: "Exodus", chapter: 32 }],
  "tabernacle": [{ book: "Exodus", chapter: 25 }, { book: "Exodus", chapter: 26 }, { book: "Exodus", chapter: 40 }],
  "sanctuary": [{ book: "Exodus", chapter: 25 }, { book: "Leviticus", chapter: 16 }, { book: "Hebrews", chapter: 9 }],

  // Joshua and Judges
  "joshua": [{ book: "Joshua", chapter: 1 }, { book: "Joshua", chapter: 6 }],
  "jericho": [{ book: "Joshua", chapter: 6 }],
  "rahab": [{ book: "Joshua", chapter: 2 }],
  "gideon": [{ book: "Judges", chapter: 6 }, { book: "Judges", chapter: 7 }],
  "samson": [{ book: "Judges", chapter: 13 }, { book: "Judges", chapter: 16 }],
  "delilah": [{ book: "Judges", chapter: 16 }],

  // Ruth and Samuel
  "ruth": [{ book: "Ruth", chapter: 1 }, { book: "Ruth", chapter: 2 }],
  "samuel": [{ book: "1 Samuel", chapter: 1 }, { book: "1 Samuel", chapter: 3 }],
  "saul": [{ book: "1 Samuel", chapter: 9 }, { book: "1 Samuel", chapter: 15 }],

  // David
  "david": [{ book: "1 Samuel", chapter: 17 }, { book: "2 Samuel", chapter: 7 }, { book: "Psalms", chapter: 23 }],
  "goliath": [{ book: "1 Samuel", chapter: 17 }],
  "david and goliath": [{ book: "1 Samuel", chapter: 17 }],
  "bathsheba": [{ book: "2 Samuel", chapter: 11 }],
  "absalom": [{ book: "2 Samuel", chapter: 15 }, { book: "2 Samuel", chapter: 18 }],

  // Solomon and Kings
  "solomon": [{ book: "1 Kings", chapter: 3 }, { book: "1 Kings", chapter: 10 }],
  "temple": [{ book: "1 Kings", chapter: 6 }, { book: "1 Kings", chapter: 8 }, { book: "2 Chronicles", chapter: 7 }],
  "elijah": [{ book: "1 Kings", chapter: 17 }, { book: "1 Kings", chapter: 18 }, { book: "1 Kings", chapter: 19 }],
  "elisha": [{ book: "2 Kings", chapter: 2 }, { book: "2 Kings", chapter: 4 }],
  "naaman": [{ book: "2 Kings", chapter: 5 }],

  // Prophets
  "daniel": [{ book: "Daniel", chapter: 1 }, { book: "Daniel", chapter: 3 }, { book: "Daniel", chapter: 6 }],
  "lion's den": [{ book: "Daniel", chapter: 6 }],
  "fiery furnace": [{ book: "Daniel", chapter: 3 }],
  "shadrach meshach abednego": [{ book: "Daniel", chapter: 3 }],
  "nebuchadnezzar dream": [{ book: "Daniel", chapter: 2 }],
  "jonah": [{ book: "Jonah", chapter: 1 }, { book: "Jonah", chapter: 2 }],
  "whale": [{ book: "Jonah", chapter: 1 }],
  "isaiah": [{ book: "Isaiah", chapter: 6 }, { book: "Isaiah", chapter: 53 }],
  "suffering servant": [{ book: "Isaiah", chapter: 53 }],

  // Post-exile
  "esther": [{ book: "Esther", chapter: 4 }, { book: "Esther", chapter: 5 }],
  "nehemiah": [{ book: "Nehemiah", chapter: 1 }, { book: "Nehemiah", chapter: 2 }],
  "ezra": [{ book: "Ezra", chapter: 1 }, { book: "Ezra", chapter: 7 }],

  // Jesus - Birth and Early Life
  "nativity": [{ book: "Luke", chapter: 2 }, { book: "Matthew", chapter: 1 }],
  "birth of jesus": [{ book: "Luke", chapter: 2 }, { book: "Matthew", chapter: 1 }],
  "christmas": [{ book: "Luke", chapter: 2 }],
  "wise men": [{ book: "Matthew", chapter: 2 }],
  "magi": [{ book: "Matthew", chapter: 2 }],
  "shepherds": [{ book: "Luke", chapter: 2 }],
  "baptism of jesus": [{ book: "Matthew", chapter: 3 }, { book: "Mark", chapter: 1 }],
  "temptation": [{ book: "Matthew", chapter: 4 }, { book: "Luke", chapter: 4 }],

  // Jesus - Ministry
  "sermon on the mount": [{ book: "Matthew", chapter: 5 }, { book: "Matthew", chapter: 6 }, { book: "Matthew", chapter: 7 }],
  "beatitudes": [{ book: "Matthew", chapter: 5 }],
  "lord's prayer": [{ book: "Matthew", chapter: 6 }, { book: "Luke", chapter: 11 }],
  "transfiguration": [{ book: "Matthew", chapter: 17 }, { book: "Mark", chapter: 9 }],
  "feeding 5000": [{ book: "John", chapter: 6 }, { book: "Matthew", chapter: 14 }],
  "water into wine": [{ book: "John", chapter: 2 }],
  "wedding at cana": [{ book: "John", chapter: 2 }],
  "walking on water": [{ book: "Matthew", chapter: 14 }, { book: "John", chapter: 6 }],
  "lazarus": [{ book: "John", chapter: 11 }],

  // Parables
  "prodigal son": [{ book: "Luke", chapter: 15 }],
  "good samaritan": [{ book: "Luke", chapter: 10 }],
  "sower": [{ book: "Matthew", chapter: 13 }, { book: "Mark", chapter: 4 }],
  "mustard seed": [{ book: "Matthew", chapter: 13 }, { book: "Mark", chapter: 4 }],
  "lost sheep": [{ book: "Luke", chapter: 15 }, { book: "Matthew", chapter: 18 }],
  "talents": [{ book: "Matthew", chapter: 25 }],
  "ten virgins": [{ book: "Matthew", chapter: 25 }],

  // Jesus - Passion
  "last supper": [{ book: "Matthew", chapter: 26 }, { book: "John", chapter: 13 }],
  "garden of gethsemane": [{ book: "Matthew", chapter: 26 }, { book: "Mark", chapter: 14 }],
  "gethsemane": [{ book: "Matthew", chapter: 26 }],
  "betrayal": [{ book: "Matthew", chapter: 26 }, { book: "Mark", chapter: 14 }],
  "judas": [{ book: "Matthew", chapter: 26 }, { book: "Matthew", chapter: 27 }],
  "crucifixion": [{ book: "Matthew", chapter: 27 }, { book: "John", chapter: 19 }],
  "cross": [{ book: "Matthew", chapter: 27 }, { book: "John", chapter: 19 }],
  "resurrection": [{ book: "Matthew", chapter: 28 }, { book: "John", chapter: 20 }],
  "empty tomb": [{ book: "Matthew", chapter: 28 }, { book: "John", chapter: 20 }],
  "ascension": [{ book: "Acts", chapter: 1 }],

  // Early Church
  "pentecost": [{ book: "Acts", chapter: 2 }],
  "stephen": [{ book: "Acts", chapter: 7 }],
  "paul": [{ book: "Acts", chapter: 9 }, { book: "Acts", chapter: 13 }],
  "saul conversion": [{ book: "Acts", chapter: 9 }],
  "damascus road": [{ book: "Acts", chapter: 9 }],
  "peter": [{ book: "Acts", chapter: 2 }, { book: "Acts", chapter: 10 }],
  "cornelius": [{ book: "Acts", chapter: 10 }],

  // Revelation
  "revelation": [{ book: "Revelation", chapter: 1 }, { book: "Revelation", chapter: 21 }, { book: "Revelation", chapter: 22 }],
  "seven churches": [{ book: "Revelation", chapter: 2 }, { book: "Revelation", chapter: 3 }],
  "new jerusalem": [{ book: "Revelation", chapter: 21 }],
  "second coming": [{ book: "Revelation", chapter: 19 }, { book: "Matthew", chapter: 24 }],
  "armageddon": [{ book: "Revelation", chapter: 16 }],
  "144000": [{ book: "Revelation", chapter: 7 }, { book: "Revelation", chapter: 14 }],
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

    const searchQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // First, check if this matches a known story/event
    for (const [keyword, references] of Object.entries(STORY_KEYWORDS)) {
      if (searchQuery.includes(keyword) || keyword.includes(searchQuery)) {
        // Fetch chapters for this story
        for (const ref of references.slice(0, 3)) { // Limit to 3 chapters per story
          try {
            const response = await fetch(`${BIBLE_API_BASE}/${ref.book}+${ref.chapter}?translation=kjv`);
            if (response.ok) {
              const data = await response.json();
              if (data.verses) {
                for (const verse of data.verses.slice(0, 5)) { // First 5 verses of each chapter
                  results.push({
                    book: ref.book,
                    chapter: ref.chapter,
                    verse: verse.verse,
                    text: verse.text.trim()
                  });
                }
              }
            }
          } catch (e) {
            console.error(`Error fetching ${ref.book} ${ref.chapter}:`, e);
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

    // Otherwise, search for the phrase using Bible API's search
    // Search multiple books for the phrase
    const booksToSearch = [
      "Genesis", "Exodus", "Psalms", "Proverbs", "Isaiah",
      "Matthew", "Mark", "Luke", "John", "Acts", "Romans",
      "1 Corinthians", "Ephesians", "Hebrews", "Revelation"
    ];

    for (const book of booksToSearch) {
      if (results.length >= limit) break;

      try {
        // Fetch first few chapters of each book and search locally
        for (let chapter = 1; chapter <= 10; chapter++) {
          if (results.length >= limit) break;

          const response = await fetch(`${BIBLE_API_BASE}/${book}+${chapter}?translation=kjv`);
          if (!response.ok) continue;

          const data = await response.json();
          if (!data.verses) continue;

          for (const verse of data.verses) {
            if (results.length >= limit) break;

            const verseText = verse.text.toLowerCase();
            // Search for the query words in the verse
            const queryWords = searchQuery.split(/\s+/).filter(w => w.length > 2);
            const matchesAllWords = queryWords.every(word => verseText.includes(word));
            const matchesPhrase = verseText.includes(searchQuery);

            if (matchesPhrase || (queryWords.length > 1 && matchesAllWords)) {
              results.push({
                book: book,
                chapter: chapter,
                verse: verse.verse,
                text: verse.text.trim()
              });
            }
          }
        }
      } catch (e) {
        console.error(`Error searching ${book}:`, e);
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
