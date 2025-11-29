export interface BibleTranslation {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
  languageCode: string;
  description: string;
  year: number;
  readingLevel: "easy" | "moderate" | "scholarly";
  style: "word-for-word" | "thought-for-thought" | "paraphrase";
  available: boolean;
}

export const BIBLE_TRANSLATIONS: BibleTranslation[] = [
  // English Translations
  {
    id: "kjv",
    name: "King James Version",
    abbreviation: "KJV",
    language: "English",
    languageCode: "en",
    description: "The classic 1611 translation, beloved for its majestic language",
    year: 1611,
    readingLevel: "scholarly",
    style: "word-for-word",
    available: true,
  },
  {
    id: "nkjv",
    name: "New King James Version",
    abbreviation: "NKJV",
    language: "English",
    languageCode: "en",
    description: "Updated KJV with modern English while preserving style",
    year: 1982,
    readingLevel: "moderate",
    style: "word-for-word",
    available: true,
  },
  {
    id: "esv",
    name: "English Standard Version",
    abbreviation: "ESV",
    language: "English",
    languageCode: "en",
    description: "Essentially literal translation balancing accuracy and readability",
    year: 2001,
    readingLevel: "moderate",
    style: "word-for-word",
    available: true,
  },
  {
    id: "niv",
    name: "New International Version",
    abbreviation: "NIV",
    language: "English",
    languageCode: "en",
    description: "World's most popular modern English translation",
    year: 1978,
    readingLevel: "easy",
    style: "thought-for-thought",
    available: true,
  },
  {
    id: "nlt",
    name: "New Living Translation",
    abbreviation: "NLT",
    language: "English",
    languageCode: "en",
    description: "Clear, natural English that's easy to understand",
    year: 1996,
    readingLevel: "easy",
    style: "thought-for-thought",
    available: true,
  },
  {
    id: "nasb",
    name: "New American Standard Bible",
    abbreviation: "NASB",
    language: "English",
    languageCode: "en",
    description: "Most literal major English translation",
    year: 1971,
    readingLevel: "scholarly",
    style: "word-for-word",
    available: true,
  },
  {
    id: "amp",
    name: "Amplified Bible",
    abbreviation: "AMP",
    language: "English",
    languageCode: "en",
    description: "Expanded translation with clarifying words",
    year: 1965,
    readingLevel: "moderate",
    style: "word-for-word",
    available: true,
  },
  {
    id: "msg",
    name: "The Message",
    abbreviation: "MSG",
    language: "English",
    languageCode: "en",
    description: "Contemporary paraphrase in everyday language",
    year: 2002,
    readingLevel: "easy",
    style: "paraphrase",
    available: true,
  },
  {
    id: "csb",
    name: "Christian Standard Bible",
    abbreviation: "CSB",
    language: "English",
    languageCode: "en",
    description: "Optimal equivalence translation",
    year: 2017,
    readingLevel: "easy",
    style: "thought-for-thought",
    available: true,
  },
  
  // Spanish Translations
  {
    id: "rvr1960",
    name: "Reina-Valera 1960",
    abbreviation: "RVR1960",
    language: "Spanish",
    languageCode: "es",
    description: "La traducción más usada en español",
    year: 1960,
    readingLevel: "moderate",
    style: "word-for-word",
    available: true,
  },
  {
    id: "nvi",
    name: "Nueva Versión Internacional",
    abbreviation: "NVI",
    language: "Spanish",
    languageCode: "es",
    description: "Traducción moderna y fácil de entender",
    year: 1999,
    readingLevel: "easy",
    style: "thought-for-thought",
    available: true,
  },
  
  // Portuguese Translations
  {
    id: "arc",
    name: "Almeida Revista e Corrigida",
    abbreviation: "ARC",
    language: "Portuguese",
    languageCode: "pt",
    description: "Tradução clássica em português",
    year: 1969,
    readingLevel: "moderate",
    style: "word-for-word",
    available: true,
  },
  {
    id: "nvi-pt",
    name: "Nova Versão Internacional",
    abbreviation: "NVI-PT",
    language: "Portuguese",
    languageCode: "pt",
    description: "Versão moderna em português brasileiro",
    year: 2001,
    readingLevel: "easy",
    style: "thought-for-thought",
    available: true,
  },
  
  // French Translation
  {
    id: "lsg",
    name: "Louis Segond",
    abbreviation: "LSG",
    language: "French",
    languageCode: "fr",
    description: "Traduction protestante classique française",
    year: 1910,
    readingLevel: "moderate",
    style: "word-for-word",
    available: true,
  },
  
  // German Translation
  {
    id: "lut",
    name: "Luther Bibel",
    abbreviation: "LUT",
    language: "German",
    languageCode: "de",
    description: "Martin Luther's historic German translation",
    year: 1534,
    readingLevel: "scholarly",
    style: "word-for-word",
    available: true,
  },
];

export const getTranslationsByLanguage = (languageCode: string): BibleTranslation[] => {
  return BIBLE_TRANSLATIONS.filter(t => t.languageCode === languageCode && t.available);
};

export const getTranslationById = (id: string): BibleTranslation | undefined => {
  return BIBLE_TRANSLATIONS.find(t => t.id === id);
};

export const getEnglishTranslations = (): BibleTranslation[] => {
  return getTranslationsByLanguage("en");
};

export const getAllLanguages = (): { code: string; name: string }[] => {
  const languages = new Map<string, string>();
  BIBLE_TRANSLATIONS.forEach(t => {
    languages.set(t.languageCode, t.language);
  });
  return Array.from(languages, ([code, name]) => ({ code, name }));
};
