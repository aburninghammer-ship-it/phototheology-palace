// Sermon PowerPoint Type Definitions

export type SlideType =
  | 'TITLE'
  | 'BIG_IDEA'
  | 'SCRIPTURE'
  | 'MAIN_POINT'
  | 'ILLUSTRATION'
  | 'GOSPEL_CENTER'
  | 'APPLICATION'
  | 'APPEAL'
  | 'DISCUSSION'
  | 'TRANSITION'
  | 'QUOTE'
  | 'QUESTION'
  | 'RECAP'
  | 'BLANK'
  | 'SPLIT'
  | 'FULLBLEED'
  | 'NUMBERED_POINT';

// AI-generated layout options
export type SlideLayout =
  | 'centered'
  | 'left-aligned'
  | 'right-aligned'
  | 'split-50'
  | 'split-70-30'
  | 'full-bleed'
  | 'stacked'
  | 'minimal'
  | 'dramatic';

// Visual style emphasis
export type VisualEmphasis = 'bold' | 'subtle' | 'dramatic' | 'elegant' | 'modern' | 'classic';

// Visual mood
export type VisualMood = 'light' | 'dark' | 'warm' | 'cool' | 'neutral';

// Visual style configuration per slide
export interface VisualStyle {
  emphasis?: VisualEmphasis;
  mood?: VisualMood;
  accent?: boolean;
  invertColors?: boolean;
}

// Point numbering for NUMBERED_POINT slides
export interface PointNumbering {
  current: number;
  total: number;
  label?: string;
}

export type ThemeId = 
  | 'minimal'
  | 'modern-dark'
  | 'cinematic'
  | 'warm-classic'
  | 'sanctuary'
  | 'palace-purple';

export type VenueSize = 'small' | 'medium' | 'large' | 'broadcast';

export interface ThemeColors {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textMuted: string;
}

export interface PPTTheme {
  id: ThemeId;
  name: string;
  description: string;
  colors: ThemeColors;
  fontHeading: string;
  fontBody: string;
}

export interface VenuePreset {
  id: VenueSize;
  name: string;
  description: string;
  fontScale: number;
  titleSize: number;
  bodySize: number;
  captionSize: number;
}

export interface SlideContent {
  type: SlideType;
  layout?: SlideLayout;
  visualStyle?: VisualStyle;
  title?: string;
  subtitle?: string;
  body?: string;
  scripture?: {
    reference: string;
    text: string;
    version?: string;
    highlightWords?: string[];
  };
  bullets?: string[];
  quote?: {
    text: string;
    attribution?: string;
  };
  numbering?: PointNumbering;
  speakerNotes?: string;
  designNotes?: string;
  imageUrl?: string;
  imagePrompt?: string;
}

export interface SlideDeck {
  metadata: {
    sermonTitle: string;
    preacher?: string;
    date?: string;
    church?: string;
    themePassage?: string;
    bibleVersion: string;
    suggestedMood?: 'reverent' | 'joyful' | 'contemplative' | 'urgent' | 'celebratory' | 'solemn';
  };
  theme: ThemeId;
  venue: VenueSize;
  slides: SlideContent[];
}

export interface PPTGenerationRequest {
  mode: 'full-sermon' | 'verses-only';
  sermonData?: {
    title: string;
    themePassage: string;
    sermonStyle: string;
    smoothStones: string[];
    bridges: string[];
    movieStructure: {
      opening?: string;
      climax?: string;
      resolution?: string;
      call_to_action?: string;
    };
    fullSermon?: string;
  };
  verses?: string[];
  settings: {
    theme: ThemeId;
    venue: VenueSize;
    slideCount: 'minimal' | 'standard' | 'expanded';
    bibleVersion: string;
    audienceType: 'seeker' | 'believer' | 'mixed';
  };
}

// Theme definitions
export const PPT_THEMES: Record<ThemeId, PPTTheme> = {
  'minimal': {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean white with subtle accents',
    colors: {
      background: 'FFFFFF',
      primary: '1A1A2E',
      secondary: '4A4A68',
      accent: '3B82F6',
      text: '1A1A2E',
      textMuted: '6B7280',
    },
    fontHeading: 'Helvetica Neue',
    fontBody: 'Helvetica Neue',
  },
  'modern-dark': {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Sleek dark mode with high contrast',
    colors: {
      background: '0F172A',
      primary: 'F8FAFC',
      secondary: 'CBD5E1',
      accent: '60A5FA',
      text: 'F8FAFC',
      textMuted: '94A3B8',
    },
    fontHeading: 'Helvetica Neue',
    fontBody: 'Helvetica Neue',
  },
  'cinematic': {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Dramatic gradients and bold typography',
    colors: {
      background: '18181B',
      primary: 'FAFAFA',
      secondary: 'D4D4D8',
      accent: 'F59E0B',
      text: 'FAFAFA',
      textMuted: 'A1A1AA',
    },
    fontHeading: 'Georgia',
    fontBody: 'Helvetica Neue',
  },
  'warm-classic': {
    id: 'warm-classic',
    name: 'Warm Classic',
    description: 'Traditional warmth with cream tones',
    colors: {
      background: 'FDF8F3',
      primary: '44403C',
      secondary: '78716C',
      accent: 'B45309',
      text: '44403C',
      textMuted: '78716C',
    },
    fontHeading: 'Georgia',
    fontBody: 'Georgia',
  },
  'sanctuary': {
    id: 'sanctuary',
    name: 'Sanctuary',
    description: 'Deep blues inspired by stained glass',
    colors: {
      background: '1E3A5F',
      primary: 'F0F9FF',
      secondary: 'BAE6FD',
      accent: 'FCD34D',
      text: 'F0F9FF',
      textMuted: 'BAE6FD',
    },
    fontHeading: 'Georgia',
    fontBody: 'Helvetica Neue',
  },
  'palace-purple': {
    id: 'palace-purple',
    name: 'Palace Purple',
    description: 'Royal purple with gold accents',
    colors: {
      background: '2E1065',
      primary: 'FAF5FF',
      secondary: 'E9D5FF',
      accent: 'FCD34D',
      text: 'FAF5FF',
      textMuted: 'C4B5FD',
    },
    fontHeading: 'Georgia',
    fontBody: 'Helvetica Neue',
  },
};

// Venue presets
export const VENUE_PRESETS: Record<VenueSize, VenuePreset> = {
  small: {
    id: 'small',
    name: 'Small Room',
    description: 'Bible study, small group (10-30 people)',
    fontScale: 0.85,
    titleSize: 36,
    bodySize: 20,
    captionSize: 14,
  },
  medium: {
    id: 'medium',
    name: 'Medium Church',
    description: 'Standard sanctuary (50-200 people)',
    fontScale: 1.0,
    titleSize: 44,
    bodySize: 24,
    captionSize: 16,
  },
  large: {
    id: 'large',
    name: 'Large Venue',
    description: 'Large auditorium (200+ people)',
    fontScale: 1.15,
    titleSize: 52,
    bodySize: 28,
    captionSize: 18,
  },
  broadcast: {
    id: 'broadcast',
    name: 'Broadcast',
    description: 'Streaming/TV (optimized for screens)',
    fontScale: 1.25,
    titleSize: 60,
    bodySize: 32,
    captionSize: 20,
  },
};

// Audience types
export type AudienceType = 'evangelistic' | 'discipleship' | 'doctrinal' | 'devotional';

// Export settings types
export interface PPTExportSettings {
  theme_id: ThemeId;
  venue_preset: VenueSize;
  bible_version: string;
  include_speaker_notes: boolean;
  slide_count: number;
  audience: AudienceType;
}

// Sermon deck alias for compatibility
export type SermonDeck = SlideDeck;

// Slide count options
export const SLIDE_COUNT_OPTIONS = [
  { value: '8', label: '8 slides' },
  { value: '12', label: '12 slides' },
  { value: '16', label: '16 slides' },
  { value: '20', label: '20 slides' },
  { value: '24', label: '24 slides' },
] as const;

// Bible version options
export const BIBLE_VERSIONS = [
  { value: 'KJV', label: 'King James Version' },
  { value: 'NKJV', label: 'New King James Version' },
  { value: 'ESV', label: 'English Standard Version' },
  { value: 'NIV', label: 'New International Version' },
  { value: 'NASB', label: 'New American Standard Bible' },
  { value: 'NLT', label: 'New Living Translation' },
] as const;

// Default export settings
export const DEFAULT_EXPORT_SETTINGS: PPTExportSettings = {
  theme_id: 'palace-purple',
  venue_preset: 'medium',
  bible_version: 'KJV',
  include_speaker_notes: true,
  slide_count: 16,
  audience: 'discipleship',
};
