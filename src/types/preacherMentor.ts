// Preacher Mentor Commentary Engine v1 - Shared Types

export type Genre =
  | "narrative"
  | "epistle"
  | "prophecy"
  | "poetry"
  | "wisdom"
  | "law"
  | "gospel"
  | "apocalyptic"
  | "doctrinal";

export interface LanguageTerm {
  original: string;
  transliteration: string;
  pronunciation: string;
  language: "Hebrew" | "Greek";
  strongsNumber?: string;
  definition: string;
  semanticRange?: string;
  lexicalNotes?: string;
  interpretiveImpact: string;
}

export interface PassageAnalysis {
  passage_ref: string;
  primary_room: string;
  secondary_rooms: string[];
  genre: Genre;
  doctrinal_sensitivity: number; // 0-10
  rationale: {
    primary_reason: string;
    signal_keywords: string[];
    genre_reasoning: string;
  };
  signal_scores: Record<string, number>;
  model_version: string;
  cached: boolean;
}

export interface CommentarySections {
  meaning: string;
  language_insight: LanguageTerm[];
  cross_scripture: string;
  palace_framing: string;
  preaching_orientation: string;
}

export interface ComplianceReport {
  sermon_check_passed: boolean;
  room_validation_passed: boolean;
  word_count: number;
  banned_phrases_found: string[];
  invalid_rooms_found: string[];
}

export interface CommentaryResponse {
  passage_ref: string;
  primary_room: string;
  secondary_rooms: string[];
  genre: Genre;
  sections: CommentarySections;
  compliance_report: ComplianceReport;
  study_buddy_prompts: string[];
  model_version: string;
  cached: boolean;
}

export interface LensOverride {
  user_id: string;
  passage_ref: string;
  override_primary_room: string;
  ai_original_primary: string;
  created_at: string;
}

export interface StudyPrefs {
  scholarly_view: boolean;
  advanced_lens: boolean;
}
