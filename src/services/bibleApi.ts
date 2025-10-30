import { Chapter, Verse } from "@/types/bible";

// Using Bible API - you can switch to different APIs or local data
const BIBLE_API_BASE = "https://bible-api.com";

// Available translations
export const BIBLE_TRANSLATIONS = [
  { value: "kjv", label: "King James Version (KJV)" },
  { value: "web", label: "World English Bible (WEB)" },
  { value: "bbe", label: "Bible in Basic English (BBE)" },
  { value: "clementine", label: "Clementine Latin Vulgate" },
  { value: "almeida", label: "João Ferreira de Almeida (Portuguese)" },
] as const;

export type Translation = typeof BIBLE_TRANSLATIONS[number]["value"];

// Fallback data for John 3 (for demo purposes)
const JOHN_3_FALLBACK: Chapter = {
  book: "John",
  chapter: 3,
  verses: [
    { book: "John", chapter: 3, verse: 1, text: "There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:" },
    { book: "John", chapter: 3, verse: 2, text: "The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him." },
    { book: "John", chapter: 3, verse: 3, text: "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God." },
    { book: "John", chapter: 3, verse: 4, text: "Nicodemus saith unto him, How can a man be born when he is old? can he enter the second time into his mother's womb, and be born?" },
    { book: "John", chapter: 3, verse: 5, text: "Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God." },
    { book: "John", chapter: 3, verse: 6, text: "That which is born of the flesh is flesh; and that which is born of the Spirit is spirit." },
    { book: "John", chapter: 3, verse: 7, text: "Marvel not that I said unto thee, Ye must be born again." },
    { book: "John", chapter: 3, verse: 8, text: "The wind bloweth where it listeth, and thou hearest the sound thereof, but canst not tell whence it cometh, and whither it goeth: so is every one that is born of the Spirit." },
    { book: "John", chapter: 3, verse: 9, text: "Nicodemus answered and said unto him, How can these things be?" },
    { book: "John", chapter: 3, verse: 10, text: "Jesus answered and said unto him, Art thou a master of Israel, and knowest not these things?" },
    { book: "John", chapter: 3, verse: 11, text: "Verily, verily, I say unto thee, We speak that we do know, and testify that we have seen; and ye receive not our witness." },
    { book: "John", chapter: 3, verse: 12, text: "If I have told you earthly things, and ye believe not, how shall ye believe, if I tell you of heavenly things?" },
    { book: "John", chapter: 3, verse: 13, text: "And no man hath ascended up to heaven, but he that came down from heaven, even the Son of man which is in heaven." },
    { book: "John", chapter: 3, verse: 14, text: "And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up:" },
    { book: "John", chapter: 3, verse: 15, text: "That whosoever believeth in him should not perish, but have eternal life." },
    { book: "John", chapter: 3, verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
    { book: "John", chapter: 3, verse: 17, text: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved." },
    { book: "John", chapter: 3, verse: 18, text: "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God." },
    { book: "John", chapter: 3, verse: 19, text: "And this is the condemnation, that light is come into the world, and men loved darkness rather than light, because their deeds were evil." },
    { book: "John", chapter: 3, verse: 20, text: "For every one that doeth evil hateth the light, neither cometh to the light, lest his deeds should be reproved." },
    { book: "John", chapter: 3, verse: 21, text: "But he that doeth truth cometh to the light, that his deeds may be made manifest, that they are wrought in God." },
  ]
};

export const fetchChapter = async (book: string, chapter: number, translation: Translation = "kjv"): Promise<Chapter> => {
  // Use fallback for John 3
  if (book === "John" && chapter === 3 && translation === "kjv") {
    return Promise.resolve(JOHN_3_FALLBACK);
  }
  
  try {
    const response = await fetch(
      `${BIBLE_API_BASE}/${book}${chapter}?translation=${translation}`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (!response.ok) {
      throw new Error("API request failed");
    }
    
    const data = await response.json();
    
    const verses: Verse[] = data.verses.map((v: any) => ({
      book: data.reference.split(" ")[0],
      chapter: v.chapter,
      verse: v.verse,
      text: v.text
    }));
    
    return {
      book: data.reference.split(" ")[0],
      chapter,
      verses
    };
  } catch (error) {
    console.error("Error fetching chapter:", error);
    // Return placeholder verses when API fails
    return {
      book,
      chapter,
      verses: Array.from({ length: 20 }, (_, i) => ({
        book,
        chapter,
        verse: i + 1,
        text: `${book} ${chapter}:${i + 1} - Verse text temporarily unavailable. The Bible API service may be experiencing issues. Please try refreshing the page in a moment.`
      }))
    };
  }
};

export const searchBible = async (query: string, translation: Translation = "kjv"): Promise<Verse[]> => {
  try {
    const response = await fetch(
      `${BIBLE_API_BASE}/${query}?translation=${translation}`,
      { signal: AbortSignal.timeout(5000) }
    );
    const data = await response.json();
    
    if (data.verses) {
      return data.verses.map((v: any) => ({
        book: v.book_name,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error searching Bible:", error);
    return [];
  }
};

// Word search across multiple verses
export const searchBibleByWord = async (
  word: string,
  translation: Translation = "kjv",
  searchType: "contains" | "exact" | "starts" = "contains"
): Promise<Verse[]> => {
  // For word search, we'll use common passages as a demo
  // In production, you'd want a full-text search API
  const commonBooks = ["John", "Genesis", "Psalms", "Matthew", "Romans"];
  const results: Verse[] = [];
  
  try {
    for (const book of commonBooks) {
      // Search first few chapters of each book
      for (let chapter = 1; chapter <= 3; chapter++) {
        try {
          const chapterData = await fetchChapter(book, chapter, translation);
          
          const matchingVerses = chapterData.verses.filter(verse => {
            const text = verse.text.toLowerCase();
            const searchTerm = word.toLowerCase();
            
            switch (searchType) {
              case "exact":
                return text.split(/\s+/).includes(searchTerm);
              case "starts":
                return text.split(/\s+/).some(w => w.startsWith(searchTerm));
              case "contains":
              default:
                return text.includes(searchTerm);
            }
          });
          
          results.push(...matchingVerses);
          
          // Limit results to prevent too many
          if (results.length >= 20) {
            return results.slice(0, 20);
          }
        } catch (err) {
          // Continue with next chapter
          continue;
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error("Error in word search:", error);
    return [];
  }
};

// Dynamic verse analysis using AI
export const getVerseAnnotations = async (book: string, chapter: number, verse: number) => {
  try {
    // First fetch the verse text
    const chapterData = await fetchChapter(book, chapter);
    const verseData = chapterData.verses.find(v => v.verse === verse);
    
    if (!verseData) {
      throw new Error('Verse not found');
    }

    // Call the edge function to analyze the verse
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-verse`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          book,
          chapter,
          verse,
          verseText: verseData.text
        }),
        signal: AbortSignal.timeout(30000)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to analyze verse');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting verse annotations:', error);
    
    // Fallback to basic mock data
    return {
      verseId: `${book}-${chapter}-${verse}`,
      principles: {
        dimensions: ["2D" as const],
        cycles: ["@CyC" as const],
        sanctuary: [],
        feasts: [],
        frames: []
      },
      crossReferences: [],
      commentary: "Analysis temporarily unavailable. Please try again.",
      christCenter: "Every verse reveals Christ, the Author and Finisher of our faith."
    };
  }
};
