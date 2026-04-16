// Gamma.app API Type Definitions
// API v1.0 - https://developers.gamma.app/docs

export interface GammaGenerateRequest {
  inputText: string; // 1-750,000 characters
  format: 'presentation' | 'document' | 'social' | 'webpage';
  themeId?: string;
  themeName?: string;
  numCards?: number; // 1-60 for Pro, 1-75 for Ultra
  cardSplit?: 'auto' | 'inputTextBreaks';
  textOptions?: GammaTextOptions;
  cardOptions?: GammaCardOptions;
  imageOptions?: GammaImageOptions;
  additionalInstructions?: string; // 1-2000 characters
  exportAs?: 'pdf' | 'pptx';
  folderIds?: string[];
  sharingOptions?: GammaSharingOptions;
}

export interface GammaTextOptions {
  amount?: 'brief' | 'medium' | 'detailed' | 'extensive';
  tone?: string; // e.g., "reverent", "inspiring", "educational"
  audience?: string;
  language?: string; // 60+ languages supported
}

export interface GammaCardOptions {
  dimensions?: 'fluid' | '16x9' | '4x3' | 'pageless' | 'letter' | 'a4' | '1x1' | '4x5' | '9x16';
  headerFooter?: {
    topLeft?: GammaHeaderFooterContent;
    topRight?: GammaHeaderFooterContent;
    topCenter?: GammaHeaderFooterContent;
    bottomLeft?: GammaHeaderFooterContent;
    bottomRight?: GammaHeaderFooterContent;
    bottomCenter?: GammaHeaderFooterContent;
  };
}

export interface GammaHeaderFooterContent {
  type: 'text' | 'image' | 'cardNumber';
  value?: string;
}

export interface GammaImageOptions {
  source?: 'aiGenerated' | 'none';
  model?: 'imagen-4-pro' | 'flux-fast-1.1';
  style?: 'photorealistic' | 'illustration' | 'abstract';
}

export interface GammaSharingOptions {
  workspaceAccess?: 'noAccess' | 'view' | 'comment' | 'edit' | 'fullAccess';
  externalAccess?: 'noAccess' | 'view' | 'comment';
  emailOptions?: {
    emails?: string[];
    message?: string;
  };
}

export interface GammaGenerateResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  gammaUrl?: string;
  exportUrl?: string; // URL to download PPTX/PDF if exportAs was specified
  title?: string;
  numCards?: number;
  error?: string;
}

export interface GammaTheme {
  id: string;
  name: string;
  description?: string;
  previewUrl?: string;
}

export interface GammaFolder {
  id: string;
  name: string;
}

// Sermon-specific Gamma settings
export interface SermonGammaSettings {
  apiKey?: string;
  defaultTone: string;
  defaultAudience: string;
  imageStyle: 'photorealistic' | 'illustration' | 'abstract' | 'none';
  textAmount: 'brief' | 'medium' | 'detailed';
  dimensions: '16x9' | '4x3' | 'fluid';
}

export const DEFAULT_SERMON_GAMMA_SETTINGS: SermonGammaSettings = {
  defaultTone: 'reverent, inspiring',
  defaultAudience: 'church congregation',
  imageStyle: 'photorealistic',
  textAmount: 'medium',
  dimensions: '16x9',
};

// Helper to build sermon content for Gamma
export function buildSermonInputText(params: {
  title: string;
  themePassage?: string;
  smoothStones?: string[];
  bridges?: string[];
  movieStructure?: {
    opening?: string;
    climax?: string;
    resolution?: string;
    call_to_action?: string;
  };
  fullSermon?: string;
  bibleVersion?: string;
}): string {
  const sections: string[] = [];

  // Title slide content
  sections.push(`# ${params.title}`);
  if (params.themePassage) {
    sections.push(`Theme Passage: ${params.themePassage}`);
  }

  sections.push('\n---\n');

  // Opening/Hook
  if (params.movieStructure?.opening) {
    sections.push(`## Opening`);
    sections.push(params.movieStructure.opening);
    sections.push('\n---\n');
  }

  // Main Points (Smooth Stones)
  if (params.smoothStones && params.smoothStones.length > 0) {
    params.smoothStones.forEach((stone, idx) => {
      sections.push(`## Point ${idx + 1}`);
      sections.push(stone);

      // Add bridge if available
      if (params.bridges && params.bridges[idx]) {
        sections.push(`\nTransition: ${params.bridges[idx]}`);
      }
      sections.push('\n---\n');
    });
  }

  // Climax
  if (params.movieStructure?.climax) {
    sections.push(`## Climax`);
    sections.push(params.movieStructure.climax);
    sections.push('\n---\n');
  }

  // Resolution
  if (params.movieStructure?.resolution) {
    sections.push(`## Resolution`);
    sections.push(params.movieStructure.resolution);
    sections.push('\n---\n');
  }

  // Call to Action / Application
  if (params.movieStructure?.call_to_action) {
    sections.push(`## Call to Action`);
    sections.push(params.movieStructure.call_to_action);
  }

  // If full sermon is available, append key excerpts
  if (params.fullSermon && params.fullSermon.length > 0) {
    // Truncate if too long (Gamma limit is 750k chars, but we want focused content)
    const maxLength = 50000;
    const sermonExcerpt = params.fullSermon.length > maxLength
      ? params.fullSermon.substring(0, maxLength) + '...'
      : params.fullSermon;

    sections.push('\n---\n');
    sections.push(`## Full Sermon Content`);
    sections.push(sermonExcerpt);
  }

  return sections.join('\n');
}

// Helper to build verses-only content
export function buildVersesInputText(verses: string[], bibleVersion: string = 'KJV'): string {
  const sections: string[] = [];

  sections.push(`# Scripture Presentation`);
  sections.push(`Bible Version: ${bibleVersion}`);
  sections.push('\n---\n');

  verses.forEach((verse, idx) => {
    sections.push(`## ${verse}`);
    sections.push(`Display this Scripture passage prominently.`);
    if (idx < verses.length - 1) {
      sections.push('\n---\n');
    }
  });

  return sections.join('\n');
}
