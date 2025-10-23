export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface Chapter {
  book: string;
  chapter: number;
  verses: Verse[];
}

export type PrincipleType = 
  | "1D" | "2D" | "3D" | "4D" | "5D"
  | "1H" | "2H" | "3H"
  | "Heaven-Past" | "Heaven-Now" | "Heaven-Future"
  | "Earth-Past" | "Earth-Now" | "Earth-Future";

export type CycleType = "@Ad" | "@Se" | "@No" | "@Ab" | "@Mo" | "@Cy" | "@Sp" | "@Re";

export type SanctuaryArticle = 
  | "Gate" | "Altar" | "Laver" | "Lampstand" 
  | "Table" | "Incense" | "Veil" | "Ark";

export type FeastType = 
  | "Passover" | "Unleavened-Bread" | "Firstfruits" 
  | "Pentecost" | "Trumpets" | "Atonement" | "Tabernacles";

export type FrameType = "F01" | "F02" | "F03" | "F04" | "F05" | "F06" | "F07" | "F08" | "F09" | "F10" | "F11" | "F12";

export interface CrossReference {
  book: string;
  chapter: number;
  verse: number;
  reason: string;
  principleType: string;
  confidence: number; // 0-100
}

export interface VerseAnnotation {
  verseId: string;
  principles: {
    dimensions?: PrincipleType[];
    cycles?: CycleType[];
    sanctuary?: SanctuaryArticle[];
    feasts?: FeastType[];
    frames?: FrameType[];
  };
  crossReferences: CrossReference[];
  commentary?: string;
  christCenter?: string;
}

export interface PrincipleLens {
  dimension?: PrincipleType;
  horizon?: "1H" | "2H" | "3H";
  timeSlice?: string;
  cycle?: CycleType;
  sanctuary?: SanctuaryArticle;
  feast?: FeastType;
  frame?: FrameType;
}

export interface StudyEquation {
  id: string;
  reference: string; // e.g., "John 3:16"
  lenses: PrincipleLens;
  createdAt: Date;
  name?: string;
}

export const BIBLE_BOOKS = [
  // Old Testament
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  // New Testament
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];
