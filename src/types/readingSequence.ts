// Voice ID type for reading sequences
type VoiceId = string;

export interface SequenceItem {
  id: string;
  book: string;
  chapter: number;
  startVerse?: number;
  endVerse?: number;
  order: number;
}

export type CommentaryDepth = "surface" | "intermediate" | "depth" | "deep-drill";
export type CommentaryMode = "chapter" | "verse";

export interface ReadingSequenceBlock {
  sequenceNumber: number; // 1-5
  enabled: boolean;
  items: SequenceItem[];
  voice: VoiceId;
  playbackSpeed: number;
  playOrder: "listed" | "reverse" | "shuffle";
  includeJeevesCommentary: boolean;
  commentaryOnly?: boolean; // Skip verse reading, play only commentary
  commentaryVoice?: VoiceId;
  commentaryDepth?: CommentaryDepth;
  commentaryMode?: CommentaryMode;
  backgroundMusic?: boolean; // Enable background music
}

export interface SavedReadingSequence {
  id: string;
  userId: string;
  name: string;
  description?: string;
  roomTags: string[];
  isPublic: boolean;
  playCount: number;
  sequences: ReadingSequenceBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface SequencePlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentSequenceIndex: number;
  currentItemIndex: number;
  currentVerse: number;
  totalVerses: number;
  progress: number;
}

export const ROOM_TAG_OPTIONS = [
  { value: "SR", label: "Story Room", color: "bg-blue-500" },
  { value: "IR", label: "Imagination Room", color: "bg-purple-500" },
  { value: "24F", label: "24FPS Room", color: "bg-green-500" },
  { value: "BR", label: "Bible Rendered", color: "bg-amber-500" },
  { value: "OR", label: "Observation Room", color: "bg-cyan-500" },
  { value: "PR", label: "Prophecy Room", color: "bg-red-500" },
  { value: "BL", label: "Blue Room (Sanctuary)", color: "bg-indigo-500" },
  { value: "PRm", label: "Patterns Room", color: "bg-pink-500" },
  { value: "LR", label: "Listening Room", color: "bg-teal-500" },
];

export const PRESET_SEQUENCES = [
  {
    name: "Prophecy Pack",
    description: "Daniel + Revelation prophetic sequence",
    roomTags: ["PR"],
    items: [
      { book: "Daniel", chapter: 7 },
      { book: "Revelation", chapter: 13 },
      { book: "Daniel", chapter: 8 },
      { book: "Daniel", chapter: 9 },
      { book: "Daniel", chapter: 10 },
    ],
  },
  {
    name: "Sanctuary Journey",
    description: "Walk through the sanctuary system",
    roomTags: ["BL"],
    items: [
      { book: "Exodus", chapter: 25 },
      { book: "Exodus", chapter: 26 },
      { book: "Exodus", chapter: 27 },
      { book: "Leviticus", chapter: 16 },
      { book: "Hebrews", chapter: 8 },
      { book: "Hebrews", chapter: 9 },
    ],
  },
  {
    name: "Wisdom Set",
    description: "Practical wisdom from Scripture",
    roomTags: ["SR", "OR"],
    items: [
      { book: "Proverbs", chapter: 1 },
      { book: "Proverbs", chapter: 3 },
      { book: "James", chapter: 1 },
      { book: "Ecclesiastes", chapter: 12 },
    ],
  },
  {
    name: "Gospel Harmony",
    description: "Christ's story across Gospels",
    roomTags: ["SR", "IR"],
    items: [
      { book: "Luke", chapter: 2 },
      { book: "John", chapter: 1 },
      { book: "Matthew", chapter: 5 },
      { book: "Mark", chapter: 15 },
      { book: "John", chapter: 20 },
    ],
  },
  {
    name: "Creation to Fall",
    description: "The beginning of everything",
    roomTags: ["SR", "24F"],
    items: [
      { book: "Genesis", chapter: 1 },
      { book: "Genesis", chapter: 2 },
      { book: "Genesis", chapter: 3 },
    ],
  },
];
