import { Chapter, Verse } from "@/types/bible";

// Using Bible API - you can switch to different APIs or local data
const BIBLE_API_BASE = "https://bible-api.com";

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

export const fetchChapter = async (book: string, chapter: number): Promise<Chapter> => {
  // Use fallback for John 3
  if (book === "John" && chapter === 3) {
    return Promise.resolve(JOHN_3_FALLBACK);
  }
  
  try {
    const response = await fetch(`${BIBLE_API_BASE}/${book}${chapter}?translation=kjv`);
    
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
    // Return empty chapter for now
    return {
      book,
      chapter,
      verses: Array.from({ length: 10 }, (_, i) => ({
        book,
        chapter,
        verse: i + 1,
        text: `Verse ${i + 1} text would appear here. (API unavailable - using demo data)`
      }))
    };
  }
};

export const searchBible = async (query: string): Promise<Verse[]> => {
  try {
    const response = await fetch(`${BIBLE_API_BASE}/${query}?translation=kjv`);
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

// Mock data for demonstration - replace with actual principle database
export const getVerseAnnotations = async (book: string, chapter: number, verse: number) => {
  // Enhanced mock data based on verse
  const isJohn316 = book === "John" && chapter === 3 && verse === 16;
  
  return {
    verseId: `${book}-${chapter}-${verse}`,
    principles: {
      dimensions: isJohn316 ? ["2D" as const, "3D" as const, "4D" as const] : ["2D" as const],
      cycles: ["@Ab" as const, "@Cy" as const],
      sanctuary: isJohn316 ? ["Altar" as const, "Ark" as const] : ["Altar" as const],
      feasts: ["Passover" as const],
      frames: ["F03" as const]
    },
    crossReferences: isJohn316 ? [
      {
        book: "Exodus",
        chapter: 12,
        verse: 13,
        reason: "Typology: Blood protection prefigures Christ's sacrifice",
        principleType: "Type/Antitype",
        confidence: 95
      },
      {
        book: "Romans",
        chapter: 5,
        verse: 8,
        reason: "Direct parallel: God demonstrates His love through sacrifice",
        principleType: "Parallel",
        confidence: 98
      },
      {
        book: "Numbers",
        chapter: 21,
        verse: 9,
        reason: "Type: Bronze serpent lifted up prefigures Christ lifted up",
        principleType: "Type/Antitype",
        confidence: 92
      },
      {
        book: "1 John",
        chapter: 4,
        verse: 9,
        reason: "Echo: God sent His Son as a manifestation of love",
        principleType: "Echo",
        confidence: 96
      }
    ] : [
      {
        book: "Romans",
        chapter: 3,
        verse: 23,
        reason: "Context: Universal need for salvation",
        principleType: "Contextual",
        confidence: 85
      }
    ],
    commentary: isJohn316 
      ? "This verse stands as the gospel in miniature, weaving together multiple theological dimensions. Through the 2D lens (Christ in me), it speaks to personal salvation. The 3D lens (Church) reveals God's redemptive plan for all believers. The Sanctuary connection to the Altar emphasizes the substitutionary sacrifice, while the Passover feast connection roots it in covenant history. The @Ab cycle places it within the Abrahamic promise of blessing all nations."
      : "This verse contributes to the larger narrative of new birth and spiritual transformation. The dialogue with Nicodemus establishes the necessity of divine regeneration for entering God's kingdom.",
    christCenter: isJohn316
      ? "Christ is the central figure—the 'only begotten Son' who embodies God's love. He is both the gift and the giver of eternal life. The verse points to His sacrificial death (implicit in 'gave') and His role as the exclusive means of salvation. He is the fulfillment of the bronze serpent type (v.14), the manifestation of divine love, and the bridge between God's holiness and human need."
      : "Christ reveals Himself as the authoritative teacher who has come from heaven, possessing divine knowledge and authority to declare spiritual truth."
  };
};
