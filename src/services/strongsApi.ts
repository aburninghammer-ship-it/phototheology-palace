// Strong's Concordance Data and API
import { supabase } from "@/integrations/supabase/client";

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
  // Phototheology Extensions
  sanctuary_link?: string;
  time_zone_code?: string;
  dimension_code?: string;
  cycle_code?: string;
  prophecy_link?: string;
  pt_notes?: string;
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
  // Strip morphological codes (e.g., "G3756=PRT-N" -> "G3756")
  let baseNumber = number.split('=')[0];
  
  // Strip leading zeros (G0444 -> G444, H01234 -> H1234)
  baseNumber = baseNumber.replace(/^([GH])0+/, '$1');
  
  console.log(`[Strong's] Looking up: ${number} -> ${baseNumber}`);
  
  try {
    // Try to fetch from strongs_dictionary
    const { data, error } = await supabase
      .from('strongs_dictionary')
      .select('*')
      .eq('strongs_number', baseNumber)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching Strong's ${number}:`, error);
    }
    
    if (!data) {
      console.warn(`Strong's number ${number} not found in database`);
    }
    
    if (data && !error) {
      // Cast to any to handle type mismatch until types are regenerated
      const entry = data as any;
      return {
        number: entry.strongs_number,
        word: entry.word,
        transliteration: entry.transliteration || '',
        pronunciation: entry.transliteration || '', // Use transliteration as pronunciation
        language: entry.language as 'Hebrew' | 'Greek',
        definition: entry.definition,
        usage: entry.gloss ? entry.gloss.split(', ') : [], // Use gloss for usage
        occurrences: 0, // Not available in basic dictionary
        derivation: entry.definition || '',
        // Phototheology fields - not in basic dictionary
        sanctuary_link: undefined,
        time_zone_code: undefined,
        dimension_code: undefined,
        cycle_code: undefined,
        prophecy_link: undefined,
        pt_notes: undefined
      };
    }
  } catch (error) {
    console.error('Error fetching Strong\'s entry from database:', error);
  }
  
  // Fallback to hardcoded data (merge both dictionaries)
  const allData = { ...STRONGS_DATA, ...ADDITIONAL_STRONGS };
  return allData[baseNumber] || allData[number] || null;
};

// Search Strong's by word - exact match on usage/translation
export const searchStrongs = async (word: string): Promise<StrongsEntry[]> => {
  const searchWord = word.toLowerCase().trim();

  // First, try to find exact matches in usage (English translations)
  const exactMatches = Object.values(STRONGS_DATA).filter(entry =>
    entry.usage.some(u => u.toLowerCase() === searchWord)
  );

  if (exactMatches.length > 0) {
    return exactMatches;
  }

  // If no exact matches, try to find words where usage starts with the search word
  // This catches cases like searching "love" and finding "love", "loved", "loves"
  const startsWithMatches = Object.values(STRONGS_DATA).filter(entry =>
    entry.usage.some(u => u.toLowerCase().startsWith(searchWord))
  );

  if (startsWithMatches.length > 0) {
    return startsWithMatches;
  }

  // Finally, check transliteration for exact match (for Greek/Hebrew searches)
  const transliterationMatches = Object.values(STRONGS_DATA).filter(entry =>
    entry.transliteration.toLowerCase() === searchWord
  );

  return transliterationMatches;
};

// Verse data with Strong's numbers
const VERSES_WITH_STRONGS: Record<string, {
  text: string;
  words: Array<{ text: string; strongs?: string }>
}> = {
  "John-3-16": {
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
  },
  "John-3-3": {
    text: "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.",
    words: [
      { text: "Jesus" },
      { text: "answered" },
      { text: "and" },
      { text: "said" },
      { text: "unto" },
      { text: "him," },
      { text: "Verily," },
      { text: "verily," },
      { text: "I" },
      { text: "say" },
      { text: "unto" },
      { text: "thee," },
      { text: "Except" },
      { text: "a" },
      { text: "man", strongs: "G444" },
      { text: "be" },
      { text: "born", strongs: "G1080" },
      { text: "again", strongs: "G509" },
      { text: "he" },
      { text: "cannot" },
      { text: "see", strongs: "G1492" },
      { text: "the" },
      { text: "kingdom", strongs: "G932" },
      { text: "of" },
      { text: "God.", strongs: "G2316" }
    ]
  },
  "John-1-1": {
    text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
    words: [
      { text: "In" },
      { text: "the" },
      { text: "beginning", strongs: "G746" },
      { text: "was" },
      { text: "the" },
      { text: "Word,", strongs: "G3056" },
      { text: "and" },
      { text: "the" },
      { text: "Word", strongs: "G3056" },
      { text: "was" },
      { text: "with" },
      { text: "God,", strongs: "G2316" },
      { text: "and" },
      { text: "the" },
      { text: "Word", strongs: "G3056" },
      { text: "was" },
      { text: "God.", strongs: "G2316" }
    ]
  },
  "John-14-6": {
    text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
    words: [
      { text: "Jesus" },
      { text: "saith" },
      { text: "unto" },
      { text: "him," },
      { text: "I" },
      { text: "am" },
      { text: "the" },
      { text: "way,", strongs: "G3598" },
      { text: "the" },
      { text: "truth,", strongs: "G225" },
      { text: "and" },
      { text: "the" },
      { text: "life:", strongs: "G2222" },
      { text: "no" },
      { text: "man" },
      { text: "cometh" },
      { text: "unto" },
      { text: "the" },
      { text: "Father,", strongs: "G3962" },
      { text: "but" },
      { text: "by" },
      { text: "me." }
    ]
  },
  "Genesis-1-1": {
    text: "In the beginning God created the heaven and the earth.",
    words: [
      { text: "In" },
      { text: "the" },
      { text: "beginning", strongs: "H7225" },
      { text: "God", strongs: "H430" },
      { text: "created", strongs: "H1254" },
      { text: "the" },
      { text: "heaven", strongs: "H8064" },
      { text: "and" },
      { text: "the" },
      { text: "earth.", strongs: "H776" }
    ]
  },
  "Psalm-23-1": {
    text: "The LORD is my shepherd; I shall not want.",
    words: [
      { text: "The" },
      { text: "LORD", strongs: "H3068" },
      { text: "is" },
      { text: "my" },
      { text: "shepherd;", strongs: "H7462" },
      { text: "I" },
      { text: "shall" },
      { text: "not", strongs: "H3808" },
      { text: "want.", strongs: "H2637" }
    ]
  },
  "Romans-3-23": {
    text: "For all have sinned, and come short of the glory of God;",
    words: [
      { text: "For" },
      { text: "all", strongs: "G3956" },
      { text: "have" },
      { text: "sinned,", strongs: "G264" },
      { text: "and" },
      { text: "come short", strongs: "G5302" },
      { text: "of" },
      { text: "the" },
      { text: "glory", strongs: "G1391" },
      { text: "of" },
      { text: "God;", strongs: "G2316" }
    ]
  },
  "Romans-6-23": {
    text: "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.",
    words: [
      { text: "For" },
      { text: "the" },
      { text: "wages", strongs: "G3800" },
      { text: "of" },
      { text: "sin", strongs: "G266" },
      { text: "is" },
      { text: "death;", strongs: "G2288" },
      { text: "but" },
      { text: "the" },
      { text: "gift", strongs: "G5486" },
      { text: "of" },
      { text: "God", strongs: "G2316" },
      { text: "is" },
      { text: "eternal", strongs: "G166" },
      { text: "life", strongs: "G2222" },
      { text: "through" },
      { text: "Jesus" },
      { text: "Christ" },
      { text: "our" },
      { text: "Lord.", strongs: "G2962" }
    ]
  },
  "Ephesians-2-8": {
    text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:",
    words: [
      { text: "For" },
      { text: "by" },
      { text: "grace", strongs: "G5485" },
      { text: "are" },
      { text: "ye" },
      { text: "saved", strongs: "G4982" },
      { text: "through" },
      { text: "faith;", strongs: "G4102" },
      { text: "and" },
      { text: "that" },
      { text: "not" },
      { text: "of" },
      { text: "yourselves:" },
      { text: "it" },
      { text: "is" },
      { text: "the" },
      { text: "gift", strongs: "G1435" },
      { text: "of" },
      { text: "God:", strongs: "G2316" }
    ]
  },
  "Matthew-28-19": {
    text: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:",
    words: [
      { text: "Go" },
      { text: "ye" },
      { text: "therefore," },
      { text: "and" },
      { text: "teach", strongs: "G3100" },
      { text: "all", strongs: "G3956" },
      { text: "nations,", strongs: "G1484" },
      { text: "baptizing", strongs: "G907" },
      { text: "them" },
      { text: "in" },
      { text: "the" },
      { text: "name", strongs: "G3686" },
      { text: "of" },
      { text: "the" },
      { text: "Father,", strongs: "G3962" },
      { text: "and" },
      { text: "of" },
      { text: "the" },
      { text: "Son,", strongs: "G5207" },
      { text: "and" },
      { text: "of" },
      { text: "the" },
      { text: "Holy", strongs: "G40" },
      { text: "Ghost:", strongs: "G4151" }
    ]
  },
  "Philippians-4-13": {
    text: "I can do all things through Christ which strengtheneth me.",
    words: [
      { text: "I" },
      { text: "can", strongs: "G2480" },
      { text: "do" },
      { text: "all things", strongs: "G3956" },
      { text: "through" },
      { text: "Christ", strongs: "G5547" },
      { text: "which" },
      { text: "strengtheneth", strongs: "G1743" },
      { text: "me." }
    ]
  },
  "1 Corinthians-13-13": {
    text: "And now abideth faith, hope, charity, these three; but the greatest of these is charity.",
    words: [
      { text: "And" },
      { text: "now" },
      { text: "abideth", strongs: "G3306" },
      { text: "faith,", strongs: "G4102" },
      { text: "hope,", strongs: "G1680" },
      { text: "charity,", strongs: "G26" },
      { text: "these" },
      { text: "three;" },
      { text: "but" },
      { text: "the" },
      { text: "greatest", strongs: "G3187" },
      { text: "of" },
      { text: "these" },
      { text: "is" },
      { text: "charity.", strongs: "G26" }
    ]
  },
  "Isaiah-53-5": {
    text: "But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.",
    words: [
      { text: "But" },
      { text: "he" },
      { text: "was" },
      { text: "wounded", strongs: "H2490" },
      { text: "for" },
      { text: "our" },
      { text: "transgressions,", strongs: "H6588" },
      { text: "he" },
      { text: "was" },
      { text: "bruised", strongs: "H1792" },
      { text: "for" },
      { text: "our" },
      { text: "iniquities:", strongs: "H5771" },
      { text: "the" },
      { text: "chastisement", strongs: "H4148" },
      { text: "of" },
      { text: "our" },
      { text: "peace", strongs: "H7965" },
      { text: "was" },
      { text: "upon" },
      { text: "him;" },
      { text: "and" },
      { text: "with" },
      { text: "his" },
      { text: "stripes", strongs: "H2250" },
      { text: "we" },
      { text: "are" },
      { text: "healed.", strongs: "H7495" }
    ]
  },
  "Revelation-21-4": {
    text: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.",
    words: [
      { text: "And" },
      { text: "God", strongs: "G2316" },
      { text: "shall" },
      { text: "wipe away", strongs: "G1813" },
      { text: "all", strongs: "G3956" },
      { text: "tears", strongs: "G1144" },
      { text: "from" },
      { text: "their" },
      { text: "eyes;" },
      { text: "and" },
      { text: "there" },
      { text: "shall" },
      { text: "be" },
      { text: "no", strongs: "G3756" },
      { text: "more" },
      { text: "death,", strongs: "G2288" },
      { text: "neither" },
      { text: "sorrow,", strongs: "G3997" },
      { text: "nor" },
      { text: "crying,", strongs: "G2906" },
      { text: "neither" },
      { text: "shall" },
      { text: "there" },
      { text: "be" },
      { text: "any" },
      { text: "more" },
      { text: "pain:", strongs: "G4192" },
      { text: "for" },
      { text: "the" },
      { text: "former things", strongs: "G4413" },
      { text: "are" },
      { text: "passed away.", strongs: "G565" }
    ]
  }
};

// Additional Strong's entries
const ADDITIONAL_STRONGS: Record<string, StrongsEntry> = {
  "G3588": {
    number: "G3588",
    word: "ὁ",
    transliteration: "ho",
    pronunciation: "ho",
    language: "Greek",
    definition: "The definite article",
    usage: ["the", "this", "that"],
    occurrences: 19870,
    derivation: "The Greek article"
  },
  "G2532": {
    number: "G2532",
    word: "καί",
    transliteration: "kai",
    pronunciation: "kahee",
    language: "Greek",
    definition: "And, even, also, namely",
    usage: ["and", "also", "even", "both"],
    occurrences: 9018,
    derivation: "Apparently a primary particle"
  },
  "G1722": {
    number: "G1722",
    word: "ἐν",
    transliteration: "en",
    pronunciation: "en",
    language: "Greek",
    definition: "In, on, at, by, with",
    usage: ["in", "by", "with", "among"],
    occurrences: 2757,
    derivation: "A primary preposition"
  },
  "G1510": {
    number: "G1510",
    word: "εἰμί",
    transliteration: "eimi",
    pronunciation: "i-mee'",
    language: "Greek",
    definition: "I am, exist",
    usage: ["am", "is", "are", "was", "be"],
    occurrences: 2462,
    derivation: "First person singular present indicative"
  },
  "G846": {
    number: "G846",
    word: "αὐτός",
    transliteration: "autos",
    pronunciation: "ow-tos'",
    language: "Greek",
    definition: "He, she, it, self, same",
    usage: ["him", "them", "her", "it", "same", "self"],
    occurrences: 5595,
    derivation: "From the particle au"
  },
  "G3056": {
    number: "G3056",
    word: "λόγος",
    transliteration: "logos",
    pronunciation: "log'-os",
    language: "Greek",
    definition: "Word, speech, reason, the divine Word",
    usage: ["word", "saying", "speech", "reason"],
    occurrences: 330,
    derivation: "From lego"
  },
  "G1096": {
    number: "G1096",
    word: "γίνομαι",
    transliteration: "ginomai",
    pronunciation: "ghin'-om-ahee",
    language: "Greek",
    definition: "To become, be made, happen",
    usage: ["be", "become", "come to pass", "be made"],
    occurrences: 669,
    derivation: "A primary verb"
  },
  "G4314": {
    number: "G4314",
    word: "πρός",
    transliteration: "pros",
    pronunciation: "pros",
    language: "Greek",
    definition: "To, towards, with, at",
    usage: ["unto", "to", "with", "for"],
    occurrences: 700,
    derivation: "A strengthened form of pro"
  },
  "G444": {
    number: "G444",
    word: "ἄνθρωπος",
    transliteration: "anthrōpos",
    pronunciation: "anth'-ro-pos",
    language: "Greek",
    definition: "A human being, man, mankind",
    usage: ["man", "mankind", "person"],
    occurrences: 550,
    derivation: "From anēr and ōps"
  },
  "G1080": {
    number: "G1080",
    word: "γεννάω",
    transliteration: "gennaō",
    pronunciation: "ghen-nah'-o",
    language: "Greek",
    definition: "To beget, bring forth, be born",
    usage: ["beget", "bear", "be born"],
    occurrences: 97,
    derivation: "From genos"
  },
  "G509": {
    number: "G509",
    word: "ἄνωθεν",
    transliteration: "anōthen",
    pronunciation: "an'-o-then",
    language: "Greek",
    definition: "From above, again, anew",
    usage: ["from above", "again", "from the beginning"],
    occurrences: 13,
    derivation: "From anō"
  },
  "G1492": {
    number: "G1492",
    word: "εἴδω",
    transliteration: "eidō",
    pronunciation: "i'-do",
    language: "Greek",
    definition: "To see, perceive, know",
    usage: ["see", "behold", "know"],
    occurrences: 666,
    derivation: "A primary verb"
  },
  "G932": {
    number: "G932",
    word: "βασιλεία",
    transliteration: "basileia",
    pronunciation: "bas-il-i'-ah",
    language: "Greek",
    definition: "Royal power, kingdom, reign",
    usage: ["kingdom", "reign"],
    occurrences: 162,
    derivation: "From basileus"
  },
  "G746": {
    number: "G746",
    word: "ἀρχή",
    transliteration: "archē",
    pronunciation: "ar-khay'",
    language: "Greek",
    definition: "Beginning, origin, first",
    usage: ["beginning", "principality", "rule"],
    occurrences: 58,
    derivation: "From archomai"
  },
  "G3598": {
    number: "G3598",
    word: "ὁδός",
    transliteration: "hodos",
    pronunciation: "hod-os'",
    language: "Greek",
    definition: "A way, road, journey",
    usage: ["way", "road", "journey"],
    occurrences: 101,
    derivation: "Apparently a primary word"
  },
  "G225": {
    number: "G225",
    word: "ἀλήθεια",
    transliteration: "alētheia",
    pronunciation: "al-ay'-thi-a",
    language: "Greek",
    definition: "Truth, reality, sincerity",
    usage: ["truth", "truly", "verity"],
    occurrences: 109,
    derivation: "From alēthēs"
  },
  "G3962": {
    number: "G3962",
    word: "πατήρ",
    transliteration: "patēr",
    pronunciation: "pat-ayr'",
    language: "Greek",
    definition: "A father, ancestor",
    usage: ["father", "parent"],
    occurrences: 413,
    derivation: "Apparently a primary word"
  },
  // Hebrew Strong's Numbers
  "H7225": {
    number: "H7225",
    word: "רֵאשִׁית",
    transliteration: "re'shiyth",
    pronunciation: "ray-sheeth'",
    language: "Hebrew",
    definition: "The first, beginning, best, chief",
    usage: ["beginning", "firstfruit", "chief"],
    occurrences: 51,
    derivation: "From the same as ro'sh"
  },
  "H430": {
    number: "H430",
    word: "אֱלֹהִים",
    transliteration: "elohiym",
    pronunciation: "el-o-heem'",
    language: "Hebrew",
    definition: "Gods, God, judges, angels",
    usage: ["God", "gods", "judges"],
    occurrences: 2606,
    derivation: "Plural of eloahh"
  },
  "H1254": {
    number: "H1254",
    word: "בָּרָא",
    transliteration: "bara'",
    pronunciation: "baw-raw'",
    language: "Hebrew",
    definition: "To create, shape, form",
    usage: ["create", "creator", "choose"],
    occurrences: 54,
    derivation: "A primitive root"
  },
  "H8064": {
    number: "H8064",
    word: "שָׁמַיִם",
    transliteration: "shamayim",
    pronunciation: "shaw-mah'-yim",
    language: "Hebrew",
    definition: "Heaven, heavens, sky",
    usage: ["heaven", "air", "sky"],
    occurrences: 420,
    derivation: "Dual of an unused singular"
  },
  "H776": {
    number: "H776",
    word: "אֶרֶץ",
    transliteration: "erets",
    pronunciation: "eh'-rets",
    language: "Hebrew",
    definition: "Earth, land, country",
    usage: ["earth", "land", "country"],
    occurrences: 2505,
    derivation: "From an unused root"
  },
  "H3068": {
    number: "H3068",
    word: "יְהֹוָה",
    transliteration: "Yehovah",
    pronunciation: "yeh-ho-vaw'",
    language: "Hebrew",
    definition: "The proper name of the God of Israel",
    usage: ["LORD", "Jehovah"],
    occurrences: 6519,
    derivation: "From hayah"
  },
  "H7462": {
    number: "H7462",
    word: "רָעָה",
    transliteration: "ra'ah",
    pronunciation: "raw-aw'",
    language: "Hebrew",
    definition: "To tend a flock, pasture, shepherd",
    usage: ["feed", "shepherd", "pastor"],
    occurrences: 173,
    derivation: "A primitive root"
  },
  "H3808": {
    number: "H3808",
    word: "לֹא",
    transliteration: "lo'",
    pronunciation: "lo",
    language: "Hebrew",
    definition: "Not, no",
    usage: ["not", "no", "neither"],
    occurrences: 5188,
    derivation: "A primitive particle"
  },
  "H2637": {
    number: "H2637",
    word: "חָסֵר",
    transliteration: "chaser",
    pronunciation: "khaw-sare'",
    language: "Hebrew",
    definition: "To lack, need, be without",
    usage: ["lack", "want", "decrease"],
    occurrences: 23,
    derivation: "A primitive root"
  },
  "H2490": {
    number: "H2490",
    word: "חָלַל",
    transliteration: "chalal",
    pronunciation: "khaw-lal'",
    language: "Hebrew",
    definition: "To pierce, wound, pollute",
    usage: ["wound", "pierce", "profane"],
    occurrences: 135,
    derivation: "A primitive root"
  },
  "H6588": {
    number: "H6588",
    word: "פֶּשַׁע",
    transliteration: "pesha'",
    pronunciation: "peh'-shah",
    language: "Hebrew",
    definition: "Transgression, rebellion",
    usage: ["transgression", "trespass", "sin"],
    occurrences: 93,
    derivation: "From pasha'"
  },
  "H1792": {
    number: "H1792",
    word: "דָּכָא",
    transliteration: "daka'",
    pronunciation: "daw-kaw'",
    language: "Hebrew",
    definition: "To be crushed, broken, bruised",
    usage: ["bruise", "break", "crush"],
    occurrences: 18,
    derivation: "A primitive root"
  },
  "H5771": {
    number: "H5771",
    word: "עָוֹן",
    transliteration: "avon",
    pronunciation: "aw-vone'",
    language: "Hebrew",
    definition: "Iniquity, guilt, punishment",
    usage: ["iniquity", "guilt", "punishment"],
    occurrences: 231,
    derivation: "From avah"
  },
  "H4148": {
    number: "H4148",
    word: "מוּסָר",
    transliteration: "muwcar",
    pronunciation: "moo-sawr'",
    language: "Hebrew",
    definition: "Discipline, chastisement, correction",
    usage: ["instruction", "correction", "chastisement"],
    occurrences: 50,
    derivation: "From yasar"
  },
  "H7965": {
    number: "H7965",
    word: "שָׁלוֹם",
    transliteration: "shalowm",
    pronunciation: "shaw-lome'",
    language: "Hebrew",
    definition: "Peace, wholeness, welfare",
    usage: ["peace", "prosperity", "health"],
    occurrences: 236,
    derivation: "From shalam"
  },
  "H2250": {
    number: "H2250",
    word: "חַבּוּרָה",
    transliteration: "chabbuwrah",
    pronunciation: "khab-boo-raw'",
    language: "Hebrew",
    definition: "Stripe, wound, bruise",
    usage: ["stripe", "hurt", "wound"],
    occurrences: 7,
    derivation: "From chabar"
  },
  "H7495": {
    number: "H7495",
    word: "רָפָא",
    transliteration: "rapha'",
    pronunciation: "raw-faw'",
    language: "Hebrew",
    definition: "To heal, repair, make whole",
    usage: ["heal", "physician", "cure"],
    occurrences: 69,
    derivation: "A primitive root"
  },
  // Additional Greek Strong's Numbers
  "G3956": {
    number: "G3956",
    word: "πᾶς",
    transliteration: "pas",
    pronunciation: "pas",
    language: "Greek",
    definition: "All, every, the whole",
    usage: ["all", "every", "whole"],
    occurrences: 1243,
    derivation: "A primary word"
  },
  "G264": {
    number: "G264",
    word: "ἁμαρτάνω",
    transliteration: "hamartanō",
    pronunciation: "ham-ar-tan'-o",
    language: "Greek",
    definition: "To miss the mark, sin, err",
    usage: ["sin", "trespass", "offend"],
    occurrences: 43,
    derivation: "From hamartia"
  },
  "G5302": {
    number: "G5302",
    word: "ὑστερέω",
    transliteration: "hustereō",
    pronunciation: "hoos-ter-eh'-o",
    language: "Greek",
    definition: "To come short, be lacking, need",
    usage: ["lack", "come short", "want"],
    occurrences: 16,
    derivation: "From husteros"
  },
  "G1391": {
    number: "G1391",
    word: "δόξα",
    transliteration: "doxa",
    pronunciation: "dox'-ah",
    language: "Greek",
    definition: "Glory, splendor, brightness",
    usage: ["glory", "dignity", "honor"],
    occurrences: 166,
    derivation: "From dokeo"
  },
  "G3800": {
    number: "G3800",
    word: "ὀψώνιον",
    transliteration: "opsōnion",
    pronunciation: "op-so'-nee-on",
    language: "Greek",
    definition: "Wages, pay, compensation",
    usage: ["wages", "reward"],
    occurrences: 4,
    derivation: "From opson"
  },
  "G266": {
    number: "G266",
    word: "ἁμαρτία",
    transliteration: "hamartia",
    pronunciation: "ham-ar-tee'-ah",
    language: "Greek",
    definition: "Sin, sinfulness, offense",
    usage: ["sin", "sinful", "offense"],
    occurrences: 174,
    derivation: "From hamartano"
  },
  "G2288": {
    number: "G2288",
    word: "θάνατος",
    transliteration: "thanatos",
    pronunciation: "than'-at-os",
    language: "Greek",
    definition: "Death, physical or spiritual",
    usage: ["death", "deadly"],
    occurrences: 120,
    derivation: "From thnēskō"
  },
  "G5486": {
    number: "G5486",
    word: "χάρισμα",
    transliteration: "charisma",
    pronunciation: "khar'-is-mah",
    language: "Greek",
    definition: "A gift of grace, free gift",
    usage: ["gift", "free gift"],
    occurrences: 17,
    derivation: "From charizomai"
  },
  "G2962": {
    number: "G2962",
    word: "κύριος",
    transliteration: "kurios",
    pronunciation: "koo'-ree-os",
    language: "Greek",
    definition: "Lord, master, owner",
    usage: ["Lord", "master", "sir"],
    occurrences: 748,
    derivation: "From kuros"
  },
  "G5485": {
    number: "G5485",
    word: "χάρις",
    transliteration: "charis",
    pronunciation: "khar'-ece",
    language: "Greek",
    definition: "Grace, favor, kindness",
    usage: ["grace", "favor", "thankworthy"],
    occurrences: 155,
    derivation: "From chairo"
  },
  "G4982": {
    number: "G4982",
    word: "σῴζω",
    transliteration: "sōzō",
    pronunciation: "sode'-zo",
    language: "Greek",
    definition: "To save, deliver, protect",
    usage: ["save", "heal", "preserve"],
    occurrences: 110,
    derivation: "From sōs"
  },
  "G4102": {
    number: "G4102",
    word: "πίστις",
    transliteration: "pistis",
    pronunciation: "pis'-tis",
    language: "Greek",
    definition: "Faith, belief, trust, confidence",
    usage: ["faith", "belief", "assurance"],
    occurrences: 244,
    derivation: "From peithō"
  },
  "G1435": {
    number: "G1435",
    word: "δῶρον",
    transliteration: "dōron",
    pronunciation: "do'-ron",
    language: "Greek",
    definition: "A gift, present, offering",
    usage: ["gift", "offering"],
    occurrences: 19,
    derivation: "A present"
  },
  "G3100": {
    number: "G3100",
    word: "μαθητεύω",
    transliteration: "mathēteuō",
    pronunciation: "math-ayt-yoo'-o",
    language: "Greek",
    definition: "To be a disciple, make disciples",
    usage: ["teach", "disciple", "instruct"],
    occurrences: 4,
    derivation: "From mathētēs"
  },
  "G1484": {
    number: "G1484",
    word: "ἔθνος",
    transliteration: "ethnos",
    pronunciation: "eth'-nos",
    language: "Greek",
    definition: "A nation, people group, Gentiles",
    usage: ["nation", "Gentile", "heathen"],
    occurrences: 162,
    derivation: "Probably from ethō"
  },
  "G907": {
    number: "G907",
    word: "βαπτίζω",
    transliteration: "baptizō",
    pronunciation: "bap-tid'-zo",
    language: "Greek",
    definition: "To baptize, immerse, dip",
    usage: ["baptize", "wash"],
    occurrences: 77,
    derivation: "From baptō"
  },
  "G3686": {
    number: "G3686",
    word: "ὄνομα",
    transliteration: "onoma",
    pronunciation: "on'-om-ah",
    language: "Greek",
    definition: "A name, authority, character",
    usage: ["name", "named"],
    occurrences: 231,
    derivation: "From ginosko"
  },
  "G40": {
    number: "G40",
    word: "ἅγιος",
    transliteration: "hagios",
    pronunciation: "hag'-ee-os",
    language: "Greek",
    definition: "Holy, sacred, set apart",
    usage: ["holy", "saint", "holy one"],
    occurrences: 233,
    derivation: "From hagos"
  },
  "G4151": {
    number: "G4151",
    word: "πνεῦμα",
    transliteration: "pneuma",
    pronunciation: "pnyoo'-mah",
    language: "Greek",
    definition: "Spirit, wind, breath",
    usage: ["Spirit", "ghost", "spirit"],
    occurrences: 385,
    derivation: "From pneō"
  },
  "G2480": {
    number: "G2480",
    word: "ἰσχύω",
    transliteration: "ischuō",
    pronunciation: "is-khoo'-o",
    language: "Greek",
    definition: "To have strength, be able, prevail",
    usage: ["can", "be able", "prevail"],
    occurrences: 28,
    derivation: "From ischus"
  },
  "G5547": {
    number: "G5547",
    word: "Χριστός",
    transliteration: "Christos",
    pronunciation: "khris-tos'",
    language: "Greek",
    definition: "Anointed One, Messiah, Christ",
    usage: ["Christ", "Messiah"],
    occurrences: 569,
    derivation: "From chriō"
  },
  "G1743": {
    number: "G1743",
    word: "ἐνδυναμόω",
    transliteration: "endunamoō",
    pronunciation: "en-doo-nam-o'-o",
    language: "Greek",
    definition: "To strengthen, empower",
    usage: ["strengthen", "enable", "increase in strength"],
    occurrences: 7,
    derivation: "From en and dunamis"
  },
  "G3306": {
    number: "G3306",
    word: "μένω",
    transliteration: "menō",
    pronunciation: "men'-o",
    language: "Greek",
    definition: "To remain, abide, stay",
    usage: ["abide", "remain", "dwell"],
    occurrences: 118,
    derivation: "A primary verb"
  },
  "G1680": {
    number: "G1680",
    word: "ἐλπίς",
    transliteration: "elpis",
    pronunciation: "el-pece'",
    language: "Greek",
    definition: "Hope, expectation, confidence",
    usage: ["hope", "expectation"],
    occurrences: 53,
    derivation: "From elpō"
  },
  "G26": {
    number: "G26",
    word: "ἀγάπη",
    transliteration: "agapē",
    pronunciation: "ag-ah'-pay",
    language: "Greek",
    definition: "Love, charity, affection",
    usage: ["love", "charity", "dear"],
    occurrences: 116,
    derivation: "From agapaō"
  },
  "G3187": {
    number: "G3187",
    word: "μείζων",
    transliteration: "meizōn",
    pronunciation: "mide'-zone",
    language: "Greek",
    definition: "Greater, larger, elder",
    usage: ["greater", "more", "elder"],
    occurrences: 48,
    derivation: "Comparative of megas"
  },
  "G1813": {
    number: "G1813",
    word: "ἐξαλείφω",
    transliteration: "exaleiphō",
    pronunciation: "ex-al-i'-fo",
    language: "Greek",
    definition: "To wipe out, erase, blot out",
    usage: ["blot out", "wipe away"],
    occurrences: 5,
    derivation: "From ek and aleiphō"
  },
  "G1144": {
    number: "G1144",
    word: "δάκρυον",
    transliteration: "dakruon",
    pronunciation: "dak'-roo-on",
    language: "Greek",
    definition: "A tear",
    usage: ["tear"],
    occurrences: 10,
    derivation: "Perhaps akin to dakno"
  },
  "G3756": {
    number: "G3756",
    word: "οὐ",
    transliteration: "ou",
    pronunciation: "oo",
    language: "Greek",
    definition: "No, not",
    usage: ["not", "no"],
    occurrences: 1606,
    derivation: "A primary word"
  },
  "G3997": {
    number: "G3997",
    word: "πένθος",
    transliteration: "penthos",
    pronunciation: "pen'-thos",
    language: "Greek",
    definition: "Mourning, sadness, sorrow",
    usage: ["mourning", "sorrow"],
    occurrences: 5,
    derivation: "From the alternate of paschō"
  },
  "G2906": {
    number: "G2906",
    word: "κραυγή",
    transliteration: "kraugē",
    pronunciation: "krow-gay'",
    language: "Greek",
    definition: "An outcry, clamor, crying",
    usage: ["cry", "crying"],
    occurrences: 6,
    derivation: "From krazo"
  },
  "G4192": {
    number: "G4192",
    word: "πόνος",
    transliteration: "ponos",
    pronunciation: "pon'-os",
    language: "Greek",
    definition: "Pain, labor, distress",
    usage: ["pain", "labor"],
    occurrences: 4,
    derivation: "From the base of penes"
  },
  "G4413": {
    number: "G4413",
    word: "πρῶτος",
    transliteration: "prōtos",
    pronunciation: "pro'-tos",
    language: "Greek",
    definition: "First, foremost, chief",
    usage: ["first", "chief", "former"],
    occurrences: 155,
    derivation: "Contracted superlative of pro"
  },
  "G565": {
    number: "G565",
    word: "ἀπέρχομαι",
    transliteration: "aperchomai",
    pronunciation: "ap-erkh'-om-ahee",
    language: "Greek",
    definition: "To go away, depart, pass away",
    usage: ["depart", "go", "pass"],
    occurrences: 117,
    derivation: "From apo and erchomai"
  }
};

// Merge additional Strong's data
Object.assign(STRONGS_DATA, ADDITIONAL_STRONGS);

// Concordance entry - a verse where a Strong's word appears
export interface ConcordanceEntry {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string; // The English word used in this verse
  highlightWord: string; // The word to highlight
}

// Get concordance data for a Strong's number - all verses where this word appears
export const getStrongsConcordance = async (strongsNumber: string, limit: number = 50): Promise<ConcordanceEntry[]> => {
  // Strip morphological codes and normalize
  let baseNumber = strongsNumber.split('=')[0];
  baseNumber = baseNumber.replace(/^([GH])0+/, '$1');

  console.log(`[Concordance] Looking up verses for: ${baseNumber}`);

  try {
    // Query bible_verses_tokenized for verses containing this Strong's number
    // The tokens column contains an array of objects with 's' or 'strongs' field
    const { data, error } = await supabase
      .from('bible_verses_tokenized')
      .select('book, chapter, verse_num, text_kjv, tokens')
      .or(`tokens.cs.{"s":"${baseNumber}"},tokens.cs.{"strongs":"${baseNumber}"}`)
      .limit(limit);

    if (error) {
      console.error(`[Concordance] Database error:`, error);
      // Fall back to hardcoded data
      return getHardcodedConcordance(baseNumber);
    }

    if (!data || data.length === 0) {
      console.log(`[Concordance] No database results, using hardcoded data`);
      return getHardcodedConcordance(baseNumber);
    }

    console.log(`[Concordance] Found ${data.length} verses in database`);

    // Process each verse to find the translated word
    return data.map(verse => {
      const tokens = verse.tokens as Array<{ t?: string; word?: string; s?: string; strongs?: string }>;

      // Find the token with our Strong's number to get the English translation
      const matchingToken = tokens.find(t =>
        (t.s === baseNumber || t.strongs === baseNumber) ||
        (t.s?.startsWith(baseNumber) || t.strongs?.startsWith(baseNumber))
      );

      const translation = matchingToken?.t || matchingToken?.word || '';

      return {
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse_num,
        text: verse.text_kjv,
        translation: translation.replace(/[.,!?;:'"()[\]{}]/g, ''),
        highlightWord: translation,
      };
    });
  } catch (error) {
    console.error('[Concordance] Error:', error);
    return getHardcodedConcordance(baseNumber);
  }
};

// Hardcoded concordance data for common Strong's numbers
const HARDCODED_CONCORDANCE: Record<string, ConcordanceEntry[]> = {
  "G26": [ // agape - love
    { book: "John", chapter: 3, verse: 16, text: "For God so loved the world, that he gave his only begotten Son...", translation: "loved", highlightWord: "loved" },
    { book: "John", chapter: 13, verse: 34, text: "A new commandment I give unto you, That ye love one another...", translation: "love", highlightWord: "love" },
    { book: "John", chapter: 15, verse: 13, text: "Greater love hath no man than this, that a man lay down his life for his friends.", translation: "love", highlightWord: "love" },
    { book: "Romans", chapter: 5, verse: 8, text: "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.", translation: "love", highlightWord: "love" },
    { book: "Romans", chapter: 8, verse: 35, text: "Who shall separate us from the love of Christ?", translation: "love", highlightWord: "love" },
    { book: "Romans", chapter: 8, verse: 39, text: "...shall be able to separate us from the love of God, which is in Christ Jesus our Lord.", translation: "love", highlightWord: "love" },
    { book: "1 Corinthians", chapter: 13, verse: 4, text: "Charity suffereth long, and is kind; charity envieth not...", translation: "charity", highlightWord: "Charity" },
    { book: "1 Corinthians", chapter: 13, verse: 13, text: "And now abideth faith, hope, charity, these three; but the greatest of these is charity.", translation: "charity", highlightWord: "charity" },
    { book: "Galatians", chapter: 5, verse: 22, text: "But the fruit of the Spirit is love, joy, peace...", translation: "love", highlightWord: "love" },
    { book: "Ephesians", chapter: 3, verse: 19, text: "And to know the love of Christ, which passeth knowledge...", translation: "love", highlightWord: "love" },
    { book: "1 John", chapter: 4, verse: 8, text: "He that loveth not knoweth not God; for God is love.", translation: "love", highlightWord: "love" },
    { book: "1 John", chapter: 4, verse: 16, text: "...God is love; and he that dwelleth in love dwelleth in God, and God in him.", translation: "love", highlightWord: "love" },
  ],
  "G25": [ // agapao - to love
    { book: "John", chapter: 3, verse: 16, text: "For God so loved the world, that he gave his only begotten Son...", translation: "loved", highlightWord: "loved" },
    { book: "John", chapter: 14, verse: 21, text: "He that hath my commandments, and keepeth them, he it is that loveth me...", translation: "loveth", highlightWord: "loveth" },
    { book: "John", chapter: 21, verse: 15, text: "...Simon, son of Jonas, lovest thou me more than these?", translation: "lovest", highlightWord: "lovest" },
    { book: "Romans", chapter: 8, verse: 28, text: "...all things work together for good to them that love God...", translation: "love", highlightWord: "love" },
    { book: "Ephesians", chapter: 5, verse: 25, text: "Husbands, love your wives, even as Christ also loved the church...", translation: "love", highlightWord: "love" },
  ],
  "G2316": [ // theos - God
    { book: "John", chapter: 1, verse: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God.", translation: "God", highlightWord: "God" },
    { book: "John", chapter: 3, verse: 16, text: "For God so loved the world, that he gave his only begotten Son...", translation: "God", highlightWord: "God" },
    { book: "Romans", chapter: 1, verse: 1, text: "Paul, a servant of Jesus Christ, called to be an apostle, separated unto the gospel of God.", translation: "God", highlightWord: "God" },
    { book: "Romans", chapter: 8, verse: 28, text: "And we know that all things work together for good to them that love God...", translation: "God", highlightWord: "God" },
    { book: "1 John", chapter: 4, verse: 8, text: "He that loveth not knoweth not God; for God is love.", translation: "God", highlightWord: "God" },
  ],
  "G4102": [ // pistis - faith
    { book: "Romans", chapter: 1, verse: 17, text: "...The just shall live by faith.", translation: "faith", highlightWord: "faith" },
    { book: "Romans", chapter: 10, verse: 17, text: "So then faith cometh by hearing, and hearing by the word of God.", translation: "faith", highlightWord: "faith" },
    { book: "Galatians", chapter: 2, verse: 16, text: "...by the faith of Jesus Christ, even we have believed in Jesus Christ...", translation: "faith", highlightWord: "faith" },
    { book: "Ephesians", chapter: 2, verse: 8, text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God.", translation: "faith", highlightWord: "faith" },
    { book: "Hebrews", chapter: 11, verse: 1, text: "Now faith is the substance of things hoped for, the evidence of things not seen.", translation: "faith", highlightWord: "faith" },
    { book: "Hebrews", chapter: 11, verse: 6, text: "But without faith it is impossible to please him...", translation: "faith", highlightWord: "faith" },
    { book: "James", chapter: 2, verse: 17, text: "Even so faith, if it hath not works, is dead, being alone.", translation: "faith", highlightWord: "faith" },
  ],
  "G5485": [ // charis - grace
    { book: "John", chapter: 1, verse: 14, text: "...full of grace and truth.", translation: "grace", highlightWord: "grace" },
    { book: "John", chapter: 1, verse: 17, text: "...but grace and truth came by Jesus Christ.", translation: "grace", highlightWord: "grace" },
    { book: "Romans", chapter: 3, verse: 24, text: "Being justified freely by his grace through the redemption that is in Christ Jesus.", translation: "grace", highlightWord: "grace" },
    { book: "Romans", chapter: 5, verse: 20, text: "...But where sin abounded, grace did much more abound.", translation: "grace", highlightWord: "grace" },
    { book: "Romans", chapter: 6, verse: 14, text: "...for ye are not under the law, but under grace.", translation: "grace", highlightWord: "grace" },
    { book: "Ephesians", chapter: 2, verse: 8, text: "For by grace are ye saved through faith...", translation: "grace", highlightWord: "grace" },
    { book: "Titus", chapter: 2, verse: 11, text: "For the grace of God that bringeth salvation hath appeared to all men.", translation: "grace", highlightWord: "grace" },
  ],
  "H430": [ // elohim - God
    { book: "Genesis", chapter: 1, verse: 1, text: "In the beginning God created the heaven and the earth.", translation: "God", highlightWord: "God" },
    { book: "Genesis", chapter: 1, verse: 26, text: "And God said, Let us make man in our image, after our likeness...", translation: "God", highlightWord: "God" },
    { book: "Exodus", chapter: 20, verse: 3, text: "Thou shalt have no other gods before me.", translation: "gods", highlightWord: "gods" },
    { book: "Deuteronomy", chapter: 6, verse: 4, text: "Hear, O Israel: The LORD our God is one LORD.", translation: "God", highlightWord: "God" },
    { book: "Psalm", chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want.", translation: "LORD", highlightWord: "LORD" },
  ],
  "H3068": [ // YHWH - LORD
    { book: "Genesis", chapter: 2, verse: 4, text: "...in the day that the LORD God made the earth and the heavens.", translation: "LORD", highlightWord: "LORD" },
    { book: "Exodus", chapter: 3, verse: 14, text: "And God said unto Moses, I AM THAT I AM...", translation: "LORD", highlightWord: "LORD" },
    { book: "Exodus", chapter: 20, verse: 2, text: "I am the LORD thy God, which have brought thee out of the land of Egypt...", translation: "LORD", highlightWord: "LORD" },
    { book: "Psalm", chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want.", translation: "LORD", highlightWord: "LORD" },
    { book: "Isaiah", chapter: 40, verse: 31, text: "But they that wait upon the LORD shall renew their strength...", translation: "LORD", highlightWord: "LORD" },
  ],
  "G4982": [ // sozo - to save
    { book: "Matthew", chapter: 1, verse: 21, text: "...for he shall save his people from their sins.", translation: "save", highlightWord: "save" },
    { book: "John", chapter: 3, verse: 17, text: "...but that the world through him might be saved.", translation: "saved", highlightWord: "saved" },
    { book: "Acts", chapter: 2, verse: 21, text: "...whosoever shall call on the name of the Lord shall be saved.", translation: "saved", highlightWord: "saved" },
    { book: "Acts", chapter: 16, verse: 31, text: "Believe on the Lord Jesus Christ, and thou shalt be saved...", translation: "saved", highlightWord: "saved" },
    { book: "Romans", chapter: 10, verse: 9, text: "...thou shalt be saved.", translation: "saved", highlightWord: "saved" },
    { book: "Ephesians", chapter: 2, verse: 8, text: "For by grace are ye saved through faith...", translation: "saved", highlightWord: "saved" },
  ],
};

const getHardcodedConcordance = (strongsNumber: string): ConcordanceEntry[] => {
  return HARDCODED_CONCORDANCE[strongsNumber] || [];
};

// Get verse with Strong's numbers
export const getVerseWithStrongs = async (book: string, chapter: number, verse: number): Promise<{
  text: string;
  words: Array<{ text: string; strongs?: string }>
} | null> => {
  console.log(`[Strong's] Fetching ${book} ${chapter}:${verse}`);
  
  try {
    // Try to fetch from database first
    const { data, error } = await supabase
      .from('bible_verses_tokenized')
      .select('text_kjv, tokens')
      .eq('book', book)
      .eq('chapter', chapter)
      .eq('verse_num', verse)
      .maybeSingle();
    
    if (data && !error) {
      console.log(`[Strong's] Found in database: ${book} ${chapter}:${verse}`);
      console.log(`[Strong's] Sample token data:`, data.tokens[0]);
      
      // Parse the tokens JSONB array - handle both old format (t/s) and new format (word/strongs)
      const tokens = data.tokens as Array<{ 
        t?: string; 
        s?: string | null; 
        word?: string; 
        strongs?: string | null;
        position?: number;
        definition?: string | null;
        hebrew_word?: string | null;
        greek_word?: string | null;
        transliteration?: string | null;
      }>;
      
      // Check if we have transliteration but no English - this means data needs re-import
      const firstToken = tokens[0];
      const textValue = firstToken?.t || firstToken?.word || '';
      
      // Detect if the text contains transliteration markers (dots and slashes)
      // Transliteration typically has patterns like: va./, 'a., bi/sh., etc.
      const isTransliteration = textValue.includes('./') || 
                                 (textValue.includes('.') && textValue.includes('/')) ||
                                 textValue.match(/[a-z]\.[A-Z]/);
      
      if (isTransliteration) {
        console.warn(`[Strong's] ${book} ${chapter}:${verse} contains transliteration instead of English. Skipping Strong's display.`);
        // Return null to fall back to regular verse display
        return null;
      }
      
      const words = tokens.map(token => ({
        text: token.t || token.word || '',
        strongs: (token.s && token.s !== 'null') ? token.s : 
                 (token.strongs && token.strongs !== 'null') ? token.strongs : undefined,
        lemma: (token as any).h?.split(' ')[0] || undefined,
        transliteration: (token as any).h?.split(' ')[1] || (token as any).tr || undefined,
        part_of_speech: (token as any).pos || undefined
      }));
      
      console.log(`[Strong's] First word extracted:`, words[0]);
      
      return {
        text: data.text_kjv,
        words
      };
    }
    
    if (error) {
      console.error(`[Strong's] Database error for ${book} ${chapter}:${verse}:`, error);
    }
  } catch (error) {
    console.error('[Strong\'s] Error fetching verse from database:', error);
  }
  
  // Fallback to hardcoded data
  const key = `${book}-${chapter}-${verse}`;
  const hardcodedData = VERSES_WITH_STRONGS[key];
  
  if (hardcodedData) {
    console.log(`[Strong's] Found in hardcoded data: ${key}`);
  } else {
    console.log(`[Strong's] No data available for: ${key}`);
  }
  
  return hardcodedData || null;
};
