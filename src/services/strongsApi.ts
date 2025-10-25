// Strong's Concordance Data and API
export interface StrongsEntry {
  number: string;
  word: string;
  transliteration: string;
  pronunciation: string;
  language: "Hebrew" | "Greek";
  definition: string;
  usage: string[];
  occurrences: number;
  derivation?: string;
}

// Sample Strong's data for demonstration
// In production, this would come from a complete Strong's database
const STRONGS_DATA: Record<string, StrongsEntry> = {
  "G2316": {
    number: "G2316",
    word: "θεός",
    transliteration: "theos",
    pronunciation: "theh'-os",
    language: "Greek",
    definition: "A deity, especially the supreme Divinity",
    usage: ["God", "god", "godly"],
    occurrences: 1343,
    derivation: "Of uncertain affinity"
  },
  "G25": {
    number: "G25",
    word: "ἀγαπάω",
    transliteration: "agapaō",
    pronunciation: "ag-ap-ah'-o",
    language: "Greek",
    definition: "To love (in a social or moral sense)",
    usage: ["love", "beloved"],
    occurrences: 143,
    derivation: "Perhaps from agan (much)"
  },
  "G2889": {
    number: "G2889",
    word: "κόσμος",
    transliteration: "kosmos",
    pronunciation: "kos'-mos",
    language: "Greek",
    definition: "Orderly arrangement, the world, universe",
    usage: ["world", "adorning"],
    occurrences: 186,
    derivation: "Probably from the base of komizō"
  },
  "G1325": {
    number: "G1325",
    word: "δίδωμι",
    transliteration: "didōmi",
    pronunciation: "did'-o-mee",
    language: "Greek",
    definition: "To give, bestow",
    usage: ["give", "bestow", "grant", "commit"],
    occurrences: 415,
    derivation: "A prolonged form of a primary verb"
  },
  "G3439": {
    number: "G3439",
    word: "μονογενής",
    transliteration: "monogenēs",
    pronunciation: "mon-og-en-ace'",
    language: "Greek",
    definition: "Only-born, only-begotten, unique",
    usage: ["only begotten", "only"],
    occurrences: 9,
    derivation: "From monos and genos"
  },
  "G5207": {
    number: "G5207",
    word: "υἱός",
    transliteration: "huios",
    pronunciation: "hwee-os'",
    language: "Greek",
    definition: "A son (literal or figurative)",
    usage: ["son", "child"],
    occurrences: 382,
    derivation: "Apparently a primary word"
  },
  "G4100": {
    number: "G4100",
    word: "πιστεύω",
    transliteration: "pisteuō",
    pronunciation: "pist-yoo'-o",
    language: "Greek",
    definition: "To have faith, believe, trust",
    usage: ["believe", "commit unto", "trust"],
    occurrences: 248,
    derivation: "From pistis"
  },
  "G2222": {
    number: "G2222",
    word: "ζωή",
    transliteration: "zōē",
    pronunciation: "dzo-ay'",
    language: "Greek",
    definition: "Life, both physical and spiritual",
    usage: ["life", "lifetime"],
    occurrences: 135,
    derivation: "From zaō"
  },
  "G166": {
    number: "G166",
    word: "αἰώνιος",
    transliteration: "aiōnios",
    pronunciation: "ahee-o'-nee-os",
    language: "Greek",
    definition: "Perpetual, eternal",
    usage: ["eternal", "everlasting", "forever"],
    occurrences: 71,
    derivation: "From aiōn"
  }
};

// Parse Strong's numbers from verse text
export const parseStrongsFromText = (text: string): { word: string; strongs: string }[] => {
  // This would parse actual Strong's tagged text
  // For demo, we'll return sample data
  return [];
};

// Get Strong's entry by number
export const getStrongsEntry = async (number: string): Promise<StrongsEntry | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return STRONGS_DATA[number] || null;
};

// Search Strong's by word
export const searchStrongs = async (word: string): Promise<StrongsEntry[]> => {
  const results = Object.values(STRONGS_DATA).filter(entry => 
    entry.word.toLowerCase().includes(word.toLowerCase()) ||
    entry.transliteration.toLowerCase().includes(word.toLowerCase()) ||
    entry.usage.some(u => u.toLowerCase().includes(word.toLowerCase()))
  );
  
  return results;
};

// Get verse with Strong's numbers (demo data for John 3:16)
export const getVerseWithStrongs = (book: string, chapter: number, verse: number): {
  text: string;
  words: Array<{ text: string; strongs?: string }>
} | null => {
  // Demo data for John 3:16
  if (book === "John" && chapter === 3 && verse === 16) {
    return {
      text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      words: [
        { text: "For" },
        { text: "God", strongs: "G2316" },
        { text: "so" },
        { text: "loved", strongs: "G25" },
        { text: "the" },
        { text: "world", strongs: "G2889" },
        { text: "that" },
        { text: "he" },
        { text: "gave", strongs: "G1325" },
        { text: "his" },
        { text: "only begotten", strongs: "G3439" },
        { text: "Son", strongs: "G5207" },
        { text: "that" },
        { text: "whosoever" },
        { text: "believeth", strongs: "G4100" },
        { text: "in" },
        { text: "him" },
        { text: "should" },
        { text: "not" },
        { text: "perish" },
        { text: "but" },
        { text: "have" },
        { text: "everlasting", strongs: "G166" },
        { text: "life", strongs: "G2222" }
      ]
    };
  }
  
  // For other verses, return null (feature not available for that verse yet)
  return null;
};
