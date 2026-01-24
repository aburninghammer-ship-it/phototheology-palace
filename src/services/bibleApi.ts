import { Chapter, Verse } from "@/types/bible";
import { supabase } from "@/integrations/supabase/client";
import { BIBLE_BOOKS } from "@/types/bible";
import { cacheChapter, getCachedChapter, preCacheSurrounding, isOnline } from "./offlineCache";
import { getVerseCountForChapter } from "@/data/bibleVerseCounts";
import { BOOK_NAME_TO_CODE } from "@/data/bibleBooks";

// Using Bible API - you can switch to different APIs or local data
const BIBLE_API_BASE = "https://bible-api.com";

// Available translations - expanded list
export const BIBLE_TRANSLATIONS = [
  // Popular English translations
  { value: "kjv", label: "King James Version (KJV)" },
  { value: "kjvs", label: "KJV + Strong's (Interactive)" },
  { value: "niv", label: "New International Version (NIV)" },
  { value: "esv", label: "English Standard Version (ESV)" },
  { value: "nkjv", label: "New King James Version (NKJV)" },
  { value: "nlt", label: "New Living Translation (NLT)" },
  { value: "nasb", label: "New American Standard Bible (NASB)" },
  { value: "web", label: "World English Bible (WEB)" },
  // Additional translations
  { value: "asv", label: "American Standard Version (ASV)" },
  { value: "ylt", label: "Young's Literal Translation (YLT)" },
  { value: "darby", label: "Darby Translation (DARBY)" },
  { value: "bbe", label: "Bible in Basic English (BBE)" },
  { value: "clementine", label: "Clementine Latin Vulgate" },
  { value: "almeida", label: "Almeida (Portuguese)" },
  { value: "rves", label: "Reina Valera (Spanish)" },
  { value: "rvr", label: "Reina Valera Revisada (Spanish)" },
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
    { book: "John", chapter: 3, verse: 22, text: "After these things came Jesus and his disciples into the land of Judaea; and there he tarried with them, and baptized." },
    { book: "John", chapter: 3, verse: 23, text: "And John also was baptizing in Aenon near to Salim, because there was much water there: and they came, and were baptized." },
    { book: "John", chapter: 3, verse: 24, text: "For John was not yet cast into prison." },
    { book: "John", chapter: 3, verse: 25, text: "Then there arose a question between some of John's disciples and the Jews about purifying." },
    { book: "John", chapter: 3, verse: 26, text: "And they came unto John, and said unto him, Rabbi, he that was with thee beyond Jordan, to whom thou barest witness, behold, the same baptizeth, and all men come to him." },
    { book: "John", chapter: 3, verse: 27, text: "John answered and said, A man can receive nothing, except it be given him from heaven." },
    { book: "John", chapter: 3, verse: 28, text: "Ye yourselves bear me witness, that I said, I am not the Christ, but that I am sent before him." },
    { book: "John", chapter: 3, verse: 29, text: "He that hath the bride is the bridegroom: but the friend of the bridegroom, which standeth and heareth him, rejoiceth greatly because of the bridegroom's voice: this my joy therefore is fulfilled." },
    { book: "John", chapter: 3, verse: 30, text: "He must increase, but I must decrease." },
    { book: "John", chapter: 3, verse: 31, text: "He that cometh from above is above all: he that is of the earth is earthly, and speaketh of the earth: he that cometh from heaven is above all." },
    { book: "John", chapter: 3, verse: 32, text: "And what he hath seen and heard, that he testifieth; and no man receiveth his testimony." },
    { book: "John", chapter: 3, verse: 33, text: "He that hath received his testimony hath set to his seal that God is true." },
    { book: "John", chapter: 3, verse: 34, text: "For he whom God hath sent speaketh the words of God: for God giveth not the Spirit by measure unto him." },
    { book: "John", chapter: 3, verse: 35, text: "The Father loveth the Son, and hath given all things into his hand." },
    { book: "John", chapter: 3, verse: 36, text: "He that believeth on the Son hath everlasting life: and he that believeth not the Son shall not see life; but the wrath of God abideth on him." },
  ]
};

export const fetchChapter = async (book: string, chapter: number, translation: Translation = "kjv"): Promise<Chapter> => {
  
  // Check offline cache first
  const cached = getCachedChapter(book, chapter, translation);
  if (cached) {
    // Pre-cache surrounding chapters in background
    preCacheSurrounding(book, chapter, translation, fetchChapterFromAPI);
    return cached;
  }
  
  // If offline and no cache, return placeholder
  if (!isOnline()) {
    return {
      book,
      chapter,
      verses: [{
        book,
        chapter,
        verse: 1,
        text: "You are currently offline and this chapter is not cached. Please connect to the internet to load this chapter."
      }]
    };
  }
  
  return fetchChapterFromAPI(book, chapter, translation);
};

const fetchChapterFromAPI = async (book: string, chapter: number, translation: Translation = "kjv"): Promise<Chapter> => {
  try {
    // Use our backend proxy (retries + fallbacks) for reliability
    const { data, error } = await supabase.functions.invoke("bible-api", {
      body: { book, chapter, version: translation },
    });

    if (error) throw error;
    if (!data?.verses || !Array.isArray(data.verses) || data.verses.length === 0) {
      throw new Error("No verses returned");
    }

    const verses: Verse[] = data.verses.map((v: any) => ({
      book: v.book ?? book,
      chapter: v.chapter ?? chapter,
      verse: v.verse,
      text: v.text,
    }));

    const chapterData: Chapter = {
      book: verses[0]?.book ?? book,
      chapter,
      verses,
    };

    // Cache the fetched chapter
    cacheChapter(book, chapter, translation, chapterData);

    // Pre-cache surrounding chapters in background
    preCacheSurrounding(book, chapter, translation, fetchChapterFromAPI);

    return chapterData;
  } catch (error) {
    console.error("Error fetching chapter:", error);

    // Get the accurate verse count from our complete data
    const bookCode = BOOK_NAME_TO_CODE.get(book) || book.toUpperCase().substring(0, 3);
    let verseCount = getVerseCountForChapter(bookCode, chapter);
    
    // Fallback to reasonable default if book code not found
    if (!verseCount || verseCount === 0) {
      verseCount = 25; // Reasonable default
    }

    // Return empty chapter - UI should handle this gracefully
    return {
      book,
      chapter,
      verses: []
    } as Chapter;
  }
};

export const searchBible = async (query: string, translation: Translation = "kjv"): Promise<Verse[]> => {
  try {
    const response = await fetch(
      `${BIBLE_API_BASE}/${encodeURIComponent(query)}?translation=${translation}`,
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

// Word search across the entire Bible using AI for accurate KJV results
export const searchBibleByWord = async (
  searchTerm: string,
  scope: "all" | "ot" | "nt" = "all",
  page: number = 1,
  limit: number = 50
): Promise<{ verses: Verse[]; total: number; hasMore: boolean }> => {
  try {
    // Use AI-powered search for accurate KJV results
    const { data, error } = await supabase.functions.invoke("search-bible-word", {
      body: { searchTerm, scope, page, limit },
    });

    if (error) {
      console.error('Error calling word search function:', error);
      return { verses: [], total: 0, hasMore: false };
    }

    if (data?.results) {
      const verses = data.results.map((r: any) => ({
        book: r.book,
        chapter: r.chapter,
        verse: r.verse,
        text: r.text
      }));
      return { 
        verses, 
        total: data.total_estimated || verses.length,
        hasMore: data.has_more || false
      };
    }

    return { verses: [], total: 0, hasMore: false };
  } catch (error) {
    console.error('Error in searchBibleByWord:', error);
    return { verses: [], total: 0, hasMore: false };
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
