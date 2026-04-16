import PptxGenJS from 'pptxgenjs';
import {
  SlideDeck,
  SlideContent,
  PPT_THEMES,
  VENUE_PRESETS,
  ThemeId,
  VenueSize,
  SlideLayout,
  VisualStyle,
  VisualMood
} from '@/types/sermonPPT';

// Mood color variations
const MOOD_COLORS: Record<VisualMood, { bg: string; text: string; accent: string }> = {
  light: { bg: 'FFFFFF', text: '1A1A2E', accent: '3B82F6' },
  dark: { bg: '0F172A', text: 'F8FAFC', accent: '60A5FA' },
  warm: { bg: 'FDF8F3', text: '44403C', accent: 'D97706' },
  cool: { bg: 'F0F9FF', text: '1E3A5F', accent: '0EA5E9' },
  neutral: { bg: 'F9FAFB', text: '374151', accent: '6B7280' },
};

export class SermonPPTRenderer {
  private pptx: PptxGenJS;
  private deck: SlideDeck;
  private theme: typeof PPT_THEMES[ThemeId];
  private venue: typeof VENUE_PRESETS[VenueSize];

  constructor(deck: SlideDeck) {
    this.pptx = new PptxGenJS();
    this.deck = deck;
    this.theme = PPT_THEMES[deck.theme] || PPT_THEMES['palace-purple'];
    this.venue = VENUE_PRESETS[deck.venue] || VENUE_PRESETS['medium'];

    // Set presentation properties
    this.pptx.author = deck.metadata.preacher || 'Phototheology';
    this.pptx.title = deck.metadata.sermonTitle;
    this.pptx.subject = `Sermon: ${deck.metadata.sermonTitle}`;
    this.pptx.company = deck.metadata.church || 'Phototheology Palace';
  }

  private getScaledSize(baseSize: number): number {
    return Math.round(baseSize * this.venue.fontScale);
  }

  // Get colors based on visual style mood
  private getSlideColors(visualStyle?: VisualStyle) {
    if (visualStyle?.mood && MOOD_COLORS[visualStyle.mood]) {
      const moodColors = MOOD_COLORS[visualStyle.mood];
      return {
        background: visualStyle.invertColors ? this.theme.colors.accent : moodColors.bg,
        primary: visualStyle.invertColors ? moodColors.bg : this.theme.colors.primary,
        text: visualStyle.invertColors ? moodColors.bg : moodColors.text,
        accent: moodColors.accent,
        textMuted: this.theme.colors.textMuted,
      };
    }
    return visualStyle?.invertColors
      ? {
          background: this.theme.colors.accent,
          primary: this.theme.colors.background,
          text: this.theme.colors.background,
          accent: this.theme.colors.background,
          textMuted: this.theme.colors.background,
        }
      : this.theme.colors;
  }

  // Get font size multiplier based on emphasis
  private getEmphasisScale(emphasis?: string): number {
    switch (emphasis) {
      case 'dramatic': return 1.3;
      case 'bold': return 1.15;
      case 'subtle': return 0.9;
      case 'elegant': return 1.0;
      case 'modern': return 1.05;
      case 'classic': return 1.0;
      default: return 1.0;
    }
  }

  // Get alignment based on layout
  private getAlignment(layout?: SlideLayout): 'left' | 'center' | 'right' {
    switch (layout) {
      case 'left-aligned': return 'left';
      case 'right-aligned': return 'right';
      case 'centered':
      case 'minimal':
      case 'dramatic':
      case 'full-bleed':
      default: return 'center';
    }
  }

  // Render title slide with AI layout support - Enhanced with decorative elements
  private addTitleSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle);
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis);
    const align = this.getAlignment(content.layout);

    slide.background = { color: colors.background };

    // Gradient-like top accent with multiple bars
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.12,
      fill: { color: colors.accent },
      line: { width: 0 },
    });
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0.12,
      w: '100%',
      h: 0.06,
      fill: { color: colors.accent, transparency: 50 },
      line: { width: 0 },
    });

    // Decorative corner accent (top-left)
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 0.4,
      h: 1.2,
      fill: { color: colors.accent, transparency: 85 },
      line: { width: 0 },
    });

    // Title position based on layout
    const isDramatic = content.layout === 'dramatic' || content.visualStyle?.emphasis === 'dramatic';
    const titleY = isDramatic ? '28%' : '32%';

    // Decorative line above title
    slide.addShape(this.pptx.ShapeType.rect, {
      x: '38%',
      y: isDramatic ? 1.2 : 1.4,
      w: '24%',
      h: 0.02,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    slide.addText(content.title || this.deck.metadata.sermonTitle, {
      x: 0.5,
      y: titleY,
      w: '90%',
      h: 1.5,
      fontSize: this.getScaledSize((this.venue.titleSize + 8) * emphasisScale),
      fontFace: this.theme.fontHeading,
      color: colors.primary,
      align,
      bold: true,
    });

    // Decorative line below title
    slide.addShape(this.pptx.ShapeType.rect, {
      x: '38%',
      y: isDramatic ? 2.7 : 2.9,
      w: '24%',
      h: 0.02,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    if (content.subtitle || this.deck.metadata.themePassage) {
      // Scripture reference with subtle background
      const subtitle = content.subtitle || this.deck.metadata.themePassage || '';
      slide.addShape(this.pptx.ShapeType.roundRect, {
        x: '25%',
        y: 3.1,
        w: '50%',
        h: 0.55,
        fill: { color: colors.accent, transparency: 92 },
        line: { width: 0 },
        rectRadius: 0.04,
      });
      slide.addText(subtitle, {
        x: 0.5,
        y: '58%',
        w: '90%',
        h: 0.6,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.accent,
        align,
        italic: true,
      });
    }

    // Bottom accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 4.88,
      w: '100%',
      h: 0.12,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    if (this.deck.metadata.preacher || this.deck.metadata.date) {
      const meta = [this.deck.metadata.preacher, this.deck.metadata.date]
        .filter(Boolean)
        .join('  •  ');
      slide.addText(meta, {
        x: 0.5,
        y: 4.3,
        w: '90%',
        h: 0.5,
        fontSize: this.getScaledSize(this.venue.captionSize),
        fontFace: this.theme.fontBody,
        color: colors.textMuted,
        align,
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Big Idea - dramatic by default - Enhanced with bold visual treatment
  private addBigIdeaSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle || { mood: 'dark', emphasis: 'dramatic' });
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis || 'dramatic');

    // Use accent color for dramatic impact
    const bgColor = content.visualStyle?.invertColors ? colors.background : this.theme.colors.accent;
    slide.background = { color: bgColor };
    const textColor = content.visualStyle?.invertColors ? colors.text : this.theme.colors.background;

    // Dramatic gradient overlay effect using layered shapes
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
      fill: { color: '000000', transparency: 92 },
      line: { width: 0 },
    });

    // Bold corner accents
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 0.8,
      h: 0.8,
      fill: { color: textColor, transparency: 90 },
      line: { width: 0 },
    });
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 9.2,
      y: 4.2,
      w: 0.8,
      h: 0.8,
      fill: { color: textColor, transparency: 90 },
      line: { width: 0 },
    });

    // Top accent line
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 2,
      y: 0.5,
      w: 6,
      h: 0.03,
      fill: { color: textColor, transparency: 50 },
      line: { width: 0 },
    });

    if (content.title) {
      slide.addText(content.title.toUpperCase(), {
        x: 0.5,
        y: 0.7,
        w: '90%',
        h: 0.5,
        fontSize: this.getScaledSize(this.venue.captionSize),
        fontFace: this.theme.fontBody,
        color: textColor,
        align: 'center',
        bold: true,
        charSpacing: 6,
      });
    }

    // Main idea text with dramatic sizing
    slide.addText(content.body || '', {
      x: 0.75,
      y: '28%',
      w: '85%',
      h: 2.8,
      fontSize: this.getScaledSize((this.venue.titleSize) * emphasisScale),
      fontFace: this.theme.fontHeading,
      color: textColor,
      align: 'center',
      bold: true,
      valign: 'middle',
      lineSpacing: 44,
    });

    // Bottom accent line
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 2,
      y: 4.47,
      w: 6,
      h: 0.03,
      fill: { color: textColor, transparency: 50 },
      line: { width: 0 },
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Scripture with highlight support - Enhanced with decorative elements
  private addScriptureSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle);
    const align = this.getAlignment(content.layout);
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis || 'elegant');

    slide.background = { color: colors.background };

    // Top accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.08,
      fill: { color: colors.accent },
      line: { color: colors.accent, width: 0 },
    });

    // Left accent stripe
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 0.15,
      h: '100%',
      fill: { color: colors.accent, transparency: 85 },
      line: { width: 0 },
    });

    // Reference box with accent background
    const reference = content.scripture?.reference || content.title || '';
    slide.addShape(this.pptx.ShapeType.roundRect, {
      x: 0.5,
      y: 0.4,
      w: 3.5,
      h: 0.55,
      fill: { color: colors.accent, transparency: 10 },
      line: { color: colors.accent, width: 1 },
      rectRadius: 0.05,
    });

    slide.addText(reference, {
      x: 0.5,
      y: 0.4,
      w: 3.5,
      h: 0.55,
      fontSize: this.getScaledSize(this.venue.bodySize - 2),
      fontFace: this.theme.fontHeading,
      color: colors.accent,
      align: 'center',
      valign: 'middle',
      bold: true,
    });

    // Decorative vertical line before scripture
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0.6,
      y: 1.3,
      w: 0.04,
      h: 3.0,
      fill: { color: colors.accent, transparency: 40 },
      line: { width: 0 },
    });

    // Scripture text - check for highlights
    const scriptureText = content.scripture?.text || content.body || '';
    const highlightWords = content.scripture?.highlightWords || [];

    if (highlightWords.length > 0) {
      // Build text with highlights
      const textParts: Array<{ text: string; options?: any }> = [];
      let remainingText = scriptureText;

      highlightWords.forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi');
        const parts = remainingText.split(regex);
        parts.forEach(part => {
          if (part.toLowerCase() === word.toLowerCase()) {
            textParts.push({
              text: part,
              options: { bold: true, color: colors.accent }
            });
          } else if (part) {
            textParts.push({ text: part });
          }
        });
        remainingText = '';
      });

      if (textParts.length === 0) {
        textParts.push({ text: scriptureText });
      }

      slide.addText(textParts, {
        x: 0.9,
        y: '24%',
        w: '82%',
        h: 3.2,
        fontSize: this.getScaledSize((this.venue.bodySize + 2) * emphasisScale),
        fontFace: this.theme.fontBody,
        color: colors.text,
        align,
        valign: 'middle',
        italic: true,
        lineSpacing: 32,
      });
    } else {
      slide.addText(scriptureText, {
        x: 0.9,
        y: '24%',
        w: '82%',
        h: 3.2,
        fontSize: this.getScaledSize((this.venue.bodySize + 2) * emphasisScale),
        fontFace: this.theme.fontBody,
        color: colors.text,
        align,
        valign: 'middle',
        italic: true,
        lineSpacing: 32,
      });
    }

    // Bottom accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 4.92,
      w: '100%',
      h: 0.08,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    // Version badge in bottom right
    if (content.scripture?.version || this.deck.metadata.bibleVersion) {
      const version = content.scripture?.version || this.deck.metadata.bibleVersion;
      slide.addShape(this.pptx.ShapeType.roundRect, {
        x: 7.8,
        y: 4.6,
        w: 1.5,
        h: 0.35,
        fill: { color: colors.accent, transparency: 15 },
        line: { width: 0 },
        rectRadius: 0.03,
      });
      slide.addText(version, {
        x: 7.8,
        y: 4.6,
        w: 1.5,
        h: 0.35,
        fontSize: this.getScaledSize(this.venue.captionSize - 2),
        fontFace: this.theme.fontBody,
        color: colors.textMuted,
        align: 'center',
        valign: 'middle',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Numbered point slide - Enhanced with visual hierarchy and decorative elements
  private addNumberedPointSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle);
    const align = this.getAlignment(content.layout);
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis);

    slide.background = { color: colors.background };

    // Top accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.06,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    // Point number badge - circular with accent background
    if (content.numbering) {
      const pointNum = content.numbering.label || `${content.numbering.current}`;
      // Circle badge
      slide.addShape(this.pptx.ShapeType.ellipse, {
        x: 0.4,
        y: 0.35,
        w: 0.65,
        h: 0.65,
        fill: { color: colors.accent },
        line: { width: 0 },
      });
      // Number inside badge
      slide.addText(pointNum, {
        x: 0.4,
        y: 0.35,
        w: 0.65,
        h: 0.65,
        fontSize: this.getScaledSize(this.venue.bodySize - 2),
        fontFace: this.theme.fontHeading,
        color: colors.background,
        align: 'center',
        valign: 'middle',
        bold: true,
      });
      // Point indicator text
      if (content.numbering.total) {
        slide.addText(`POINT ${content.numbering.current} OF ${content.numbering.total}`, {
          x: 1.2,
          y: 0.45,
          w: 3,
          h: 0.4,
          fontSize: this.getScaledSize(this.venue.captionSize - 2),
          fontFace: this.theme.fontBody,
          color: colors.textMuted,
          align: 'left',
          valign: 'middle',
          charSpacing: 2,
        });
      }
    }

    // Decorative left border
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 1.15,
      w: 0.08,
      h: 2.8,
      fill: { color: colors.accent, transparency: 60 },
      line: { width: 0 },
    });

    // Title with better positioning
    slide.addText(content.title || '', {
      x: 0.5,
      y: 1.2,
      w: '90%',
      h: 0.9,
      fontSize: this.getScaledSize(this.venue.titleSize * emphasisScale),
      fontFace: this.theme.fontHeading,
      color: colors.primary,
      align,
      bold: true,
    });

    // Separator line under title
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0.5,
      y: 2.15,
      w: 2,
      h: 0.02,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    // Body or bullets with improved spacing
    if (content.bullets && content.bullets.length > 0) {
      const bulletText = content.bullets.map(b => ({ text: `  ${b}`, options: { bullet: { type: 'bullet' as const, characterCode: '●' }, indentLevel: 0 } }));
      slide.addText(bulletText, {
        x: 0.5,
        y: 2.4,
        w: '90%',
        h: 2.4,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        valign: 'top',
        lineSpacing: 32,
        paraSpaceAfter: 8,
      });
    } else if (content.body) {
      slide.addText(content.body, {
        x: 0.5,
        y: 2.4,
        w: '90%',
        h: 2.4,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        align,
        valign: 'top',
        lineSpacing: 30,
      });
    }

    // Bottom accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 4.94,
      w: '100%',
      h: 0.06,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Main point slide - Enhanced with decorative elements
  private addMainPointSlide(content: SlideContent): void {
    // Use numbered point renderer if numbering exists
    if (content.numbering) {
      this.addNumberedPointSlide(content);
      return;
    }

    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle);
    const align = this.getAlignment(content.layout);
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis);

    slide.background = { color: colors.background };

    // Top accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.06,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    // Left accent stripe
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0.6,
      w: 0.08,
      h: 3.6,
      fill: { color: colors.accent, transparency: 50 },
      line: { width: 0 },
    });

    // Title with accent underline
    slide.addText(content.title || '', {
      x: 0.5,
      y: 0.7,
      w: '90%',
      h: 0.9,
      fontSize: this.getScaledSize(this.venue.titleSize * emphasisScale),
      fontFace: this.theme.fontHeading,
      color: colors.primary,
      align,
      bold: true,
    });

    // Decorative underline
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0.5,
      y: 1.65,
      w: 2.5,
      h: 0.025,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    if (content.bullets && content.bullets.length > 0) {
      const bulletText = content.bullets.map(b => ({ text: `  ${b}`, options: { bullet: { type: 'bullet' as const, characterCode: '●' }, indentLevel: 0 } }));
      slide.addText(bulletText, {
        x: 0.5,
        y: 1.9,
        w: '90%',
        h: 2.8,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        valign: 'top',
        lineSpacing: 32,
        paraSpaceAfter: 8,
      });
    } else if (content.body) {
      slide.addText(content.body, {
        x: 0.5,
        y: 1.9,
        w: '90%',
        h: 2.8,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        align,
        valign: 'top',
        lineSpacing: 30,
      });
    }

    // Bottom accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 4.94,
      w: '100%',
      h: 0.06,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Quote slide with elegant styling - Enhanced with decorative elements
  private addQuoteSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle || { emphasis: 'elegant' });
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis || 'elegant');

    slide.background = { color: colors.background };

    // Top accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.06,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    // Elegant quote background panel
    slide.addShape(this.pptx.ShapeType.roundRect, {
      x: 0.6,
      y: 0.5,
      w: 8.8,
      h: 3.8,
      fill: { color: colors.accent, transparency: 95 },
      line: { color: colors.accent, width: 1, transparency: 70 },
      rectRadius: 0.08,
    });

    // Large decorative quote mark - opening
    slide.addText('"', {
      x: 0.8,
      y: 0.3,
      w: 1.2,
      h: 1.2,
      fontSize: 120,
      fontFace: 'Georgia',
      color: colors.accent,
      transparency: 30,
    });

    // Small decorative closing quote mark
    slide.addText('"', {
      x: 8.2,
      y: 3.5,
      w: 0.8,
      h: 0.8,
      fontSize: 60,
      fontFace: 'Georgia',
      color: colors.accent,
      transparency: 40,
    });

    // Quote text with better positioning
    slide.addText(content.quote?.text || content.body || '', {
      x: 1.2,
      y: 1.1,
      w: 7.6,
      h: 2.5,
      fontSize: this.getScaledSize((this.venue.bodySize + 4) * emphasisScale),
      fontFace: this.theme.fontBody,
      color: colors.text,
      align: 'center',
      valign: 'middle',
      italic: true,
      lineSpacing: 34,
    });

    // Attribution with decorative line
    if (content.quote?.attribution) {
      slide.addShape(this.pptx.ShapeType.rect, {
        x: 5.5,
        y: 4.0,
        w: 2.5,
        h: 0.015,
        fill: { color: colors.accent, transparency: 50 },
        line: { width: 0 },
      });
      slide.addText(`— ${content.quote.attribution}`, {
        x: 0.5,
        y: 4.1,
        w: '90%',
        h: 0.45,
        fontSize: this.getScaledSize(this.venue.captionSize + 2),
        fontFace: this.theme.fontBody,
        color: colors.textMuted,
        align: 'right',
      });
    }

    // Bottom accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 4.94,
      w: '100%',
      h: 0.06,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Question slide - dramatic centered - Enhanced with bold styling
  private addQuestionSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle || { mood: 'dark' });

    slide.background = { color: this.theme.colors.secondary };

    // Full-width accent bar at top
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.1,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    // Large dramatic question mark with subtle background circle
    slide.addShape(this.pptx.ShapeType.ellipse, {
      x: 4.0,
      y: 0.35,
      w: 2.0,
      h: 2.0,
      fill: { color: colors.accent, transparency: 90 },
      line: { color: colors.accent, width: 2, transparency: 60 },
    });

    slide.addText('?', {
      x: 4.0,
      y: 0.35,
      w: 2.0,
      h: 2.0,
      fontSize: 100,
      fontFace: this.theme.fontHeading,
      color: colors.accent,
      align: 'center',
      valign: 'middle',
      bold: true,
    });

    // Question text with better styling
    slide.addText(content.body || content.title || '', {
      x: 0.75,
      y: '48%',
      w: '85%',
      h: 2.0,
      fontSize: this.getScaledSize(this.venue.titleSize - 6),
      fontFace: this.theme.fontHeading,
      color: colors.text,
      align: 'center',
      valign: 'middle',
      lineSpacing: 38,
    });

    // Bottom accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 4.9,
      w: '100%',
      h: 0.1,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Transition - minimal, breathing room - Enhanced with elegant simplicity
  private addTransitionSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle);

    slide.background = { color: colors.background };

    // Subtle top accent
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.04,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    // Centered decorative line above text
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 4.0,
      y: 2.0,
      w: 2.0,
      h: 0.015,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    slide.addText(content.title || content.body || '', {
      x: 0.5,
      y: '42%',
      w: '90%',
      h: 1,
      fontSize: this.getScaledSize(this.venue.titleSize - 6),
      fontFace: this.theme.fontHeading,
      color: colors.accent,
      align: 'center',
      valign: 'middle',
    });

    // Centered decorative line below text
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 4.0,
      y: 3.0,
      w: 2.0,
      h: 0.015,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    // Subtle bottom accent
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 4.96,
      w: '100%',
      h: 0.04,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Application slide - warm mood by default - Enhanced with practical styling
  private addApplicationSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle || { mood: 'warm' });
    const align = this.getAlignment(content.layout);

    slide.background = { color: colors.background };

    // Top accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.08,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    // Application badge with icon-like styling
    slide.addShape(this.pptx.ShapeType.roundRect, {
      x: 0.4,
      y: 0.35,
      w: 2.0,
      h: 0.45,
      fill: { color: colors.accent, transparency: 15 },
      line: { color: colors.accent, width: 1 },
      rectRadius: 0.04,
    });

    slide.addText('APPLICATION', {
      x: 0.4,
      y: 0.35,
      w: 2.0,
      h: 0.45,
      fontSize: this.getScaledSize(this.venue.captionSize - 2),
      fontFace: this.theme.fontBody,
      color: colors.accent,
      align: 'center',
      valign: 'middle',
      bold: true,
      charSpacing: 3,
    });

    // Left accent stripe for action feel
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 1.0,
      w: 0.1,
      h: 3.5,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    slide.addText(content.title || '', {
      x: 0.5,
      y: 1.1,
      w: '90%',
      h: 0.75,
      fontSize: this.getScaledSize(this.venue.titleSize - 6),
      fontFace: this.theme.fontHeading,
      color: colors.primary,
      align,
      bold: true,
    });

    // Separator line
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0.5,
      y: 1.9,
      w: 1.8,
      h: 0.02,
      fill: { color: colors.accent, transparency: 50 },
      line: { width: 0 },
    });

    if (content.bullets && content.bullets.length > 0) {
      const bulletText = content.bullets.map(b => ({ text: `  ${b}`, options: { bullet: { type: 'bullet' as const, characterCode: '→' }, indentLevel: 0 } }));
      slide.addText(bulletText, {
        x: 0.5,
        y: 2.1,
        w: '90%',
        h: 2.6,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        valign: 'top',
        lineSpacing: 32,
        paraSpaceAfter: 8,
      });
    } else if (content.body) {
      slide.addText(content.body, {
        x: 0.5,
        y: 2.1,
        w: '90%',
        h: 2.6,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        align,
        valign: 'top',
        lineSpacing: 30,
      });
    }

    // Bottom accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 4.92,
      w: '100%',
      h: 0.08,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Appeal slide - dramatic, warm, urgent - Enhanced with compelling design
  private addAppealSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis || 'dramatic');
    const bgColor = this.theme.colors.accent;
    const textColor = this.theme.colors.background;

    // Use accent for urgent feeling
    slide.background = { color: bgColor };

    // Subtle overlay for depth
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
      fill: { color: '000000', transparency: 90 },
      line: { width: 0 },
    });

    // Top accent bar in contrasting color
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.15,
      fill: { color: textColor, transparency: 50 },
      line: { width: 0 },
    });

    // Decorative corner elements
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 0.6,
      h: 0.6,
      fill: { color: textColor, transparency: 85 },
      line: { width: 0 },
    });
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 9.4,
      y: 4.4,
      w: 0.6,
      h: 0.6,
      fill: { color: textColor, transparency: 85 },
      line: { width: 0 },
    });

    // Centered line above title
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 3.5,
      y: 1.0,
      w: 3.0,
      h: 0.02,
      fill: { color: textColor, transparency: 60 },
      line: { width: 0 },
    });

    slide.addText(content.title || 'INVITATION', {
      x: 0.5,
      y: 1.2,
      w: '90%',
      h: 1,
      fontSize: this.getScaledSize(this.venue.titleSize * emphasisScale),
      fontFace: this.theme.fontHeading,
      color: textColor,
      align: 'center',
      bold: true,
    });

    // Centered line below title
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 3.5,
      y: 2.3,
      w: 3.0,
      h: 0.02,
      fill: { color: textColor, transparency: 60 },
      line: { width: 0 },
    });

    if (content.body) {
      slide.addText(content.body, {
        x: 0.75,
        y: 2.6,
        w: '85%',
        h: 2.0,
        fontSize: this.getScaledSize(this.venue.bodySize + 2),
        fontFace: this.theme.fontBody,
        color: textColor,
        align: 'center',
        valign: 'top',
        lineSpacing: 34,
      });
    }

    // Bottom accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 4.85,
      w: '100%',
      h: 0.15,
      fill: { color: textColor, transparency: 50 },
      line: { width: 0 },
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Split layout slide (two columns) - Enhanced with visual divider
  private addSplitSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle);
    const isSplit5050 = content.layout === 'split-50';

    slide.background = { color: colors.background };

    // Top accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.06,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    // Vertical divider line
    const dividerX = isSplit5050 ? 4.85 : 6.4;
    slide.addShape(this.pptx.ShapeType.rect, {
      x: dividerX,
      y: 0.5,
      w: 0.02,
      h: 4.0,
      fill: { color: colors.accent, transparency: 60 },
      line: { width: 0 },
    });

    // Left column (wider if 70-30)
    const leftWidth = isSplit5050 ? 4.2 : 5.8;

    if (content.title) {
      slide.addText(content.title, {
        x: 0.5,
        y: 0.6,
        w: leftWidth,
        h: 0.75,
        fontSize: this.getScaledSize(this.venue.titleSize - 4),
        fontFace: this.theme.fontHeading,
        color: colors.primary,
        align: 'left',
        bold: true,
      });

      // Underline for title
      slide.addShape(this.pptx.ShapeType.rect, {
        x: 0.5,
        y: 1.4,
        w: 1.5,
        h: 0.02,
        fill: { color: colors.accent },
        line: { width: 0 },
      });
    }

    if (content.body) {
      slide.addText(content.body, {
        x: 0.5,
        y: 1.6,
        w: leftWidth,
        h: 2.8,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        valign: 'top',
        lineSpacing: 28,
      });
    }

    // Right column - scripture or secondary content
    const rightX = isSplit5050 ? 5.1 : 6.7;
    const rightWidth = isSplit5050 ? 4.2 : 2.8;

    if (content.scripture) {
      // Scripture reference badge
      slide.addShape(this.pptx.ShapeType.roundRect, {
        x: rightX,
        y: 0.6,
        w: rightWidth,
        h: 0.4,
        fill: { color: colors.accent, transparency: 90 },
        line: { color: colors.accent, width: 1 },
        rectRadius: 0.03,
      });

      slide.addText(content.scripture.reference, {
        x: rightX,
        y: 0.6,
        w: rightWidth,
        h: 0.4,
        fontSize: this.getScaledSize(this.venue.captionSize),
        fontFace: this.theme.fontBody,
        color: colors.accent,
        align: 'center',
        valign: 'middle',
        bold: true,
      });

      slide.addText(content.scripture.text, {
        x: rightX,
        y: 1.2,
        w: rightWidth,
        h: 3.2,
        fontSize: this.getScaledSize(this.venue.bodySize - 2),
        fontFace: this.theme.fontBody,
        color: colors.text,
        italic: true,
        valign: 'top',
        lineSpacing: 26,
      });
    }

    // Bottom accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 4.94,
      w: '100%',
      h: 0.06,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Full bleed - text positioned for background overlay - Enhanced with dramatic styling
  private addFullBleedSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle || { mood: 'dark' });
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis || 'dramatic');

    // Dark overlay feel
    slide.background = { color: colors.background };

    // Subtle gradient overlay from bottom
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 2.5,
      w: '100%',
      h: 2.5,
      fill: { color: '000000', transparency: 85 },
      line: { width: 0 },
    });

    // Bottom accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 4.85,
      w: '100%',
      h: 0.15,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    // Left accent stripe at bottom
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 3.0,
      w: 0.12,
      h: 1.85,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    if (content.title) {
      slide.addText(content.title, {
        x: 0.5,
        y: 3.2,
        w: '90%',
        h: 0.9,
        fontSize: this.getScaledSize(this.venue.titleSize * emphasisScale),
        fontFace: this.theme.fontHeading,
        color: colors.primary,
        align: 'left',
        bold: true,
      });
    }

    if (content.body) {
      slide.addText(content.body, {
        x: 0.5,
        y: 4.15,
        w: '90%',
        h: 0.6,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.textMuted,
        align: 'left',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Generic/fallback slide - Enhanced with consistent styling
  private addGenericSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle);
    const align = this.getAlignment(content.layout);

    slide.background = { color: colors.background };

    // Top accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.06,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    // Left accent stripe
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 0.1,
      h: '100%',
      fill: { color: colors.accent, transparency: 85 },
      line: { width: 0 },
    });

    if (content.title) {
      slide.addText(content.title, {
        x: 0.5,
        y: 0.6,
        w: '90%',
        h: 0.85,
        fontSize: this.getScaledSize(this.venue.titleSize - 4),
        fontFace: this.theme.fontHeading,
        color: colors.primary,
        align,
        bold: true,
      });

      // Underline
      slide.addShape(this.pptx.ShapeType.rect, {
        x: 0.5,
        y: 1.5,
        w: 2.0,
        h: 0.02,
        fill: { color: colors.accent },
        line: { width: 0 },
      });
    }

    if (content.body) {
      slide.addText(content.body, {
        x: 0.5,
        y: content.title ? 1.7 : 0.6,
        w: '90%',
        h: 3,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        align,
        valign: 'top',
        lineSpacing: 30,
      });
    }

    if (content.bullets && content.bullets.length > 0) {
      const bulletText = content.bullets.map(b => ({ text: `  ${b}`, options: { bullet: { type: 'bullet' as const, characterCode: '●' }, indentLevel: 0 } }));
      slide.addText(bulletText, {
        x: 0.5,
        y: content.title ? 1.7 : 0.6,
        w: '90%',
        h: 3,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        valign: 'top',
        lineSpacing: 32,
        paraSpaceAfter: 8,
      });
    }

    // Bottom accent bar
    slide.addShape(this.pptx.ShapeType.rect, {
      x: 0,
      y: 4.94,
      w: '100%',
      h: 0.06,
      fill: { color: colors.accent },
      line: { width: 0 },
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  public render(): void {
    for (const slide of this.deck.slides) {
      // Check for layout-specific rendering first
      if (slide.layout === 'split-50' || slide.layout === 'split-70-30' || slide.type === 'SPLIT') {
        this.addSplitSlide(slide);
        continue;
      }
      if (slide.layout === 'full-bleed' || slide.type === 'FULLBLEED') {
        this.addFullBleedSlide(slide);
        continue;
      }

      // Type-based rendering
      switch (slide.type) {
        case 'TITLE':
          this.addTitleSlide(slide);
          break;
        case 'BIG_IDEA':
          this.addBigIdeaSlide(slide);
          break;
        case 'SCRIPTURE':
          this.addScriptureSlide(slide);
          break;
        case 'MAIN_POINT':
        case 'NUMBERED_POINT':
          this.addMainPointSlide(slide);
          break;
        case 'QUOTE':
          this.addQuoteSlide(slide);
          break;
        case 'QUESTION':
          this.addQuestionSlide(slide);
          break;
        case 'TRANSITION':
          this.addTransitionSlide(slide);
          break;
        case 'APPLICATION':
          this.addApplicationSlide(slide);
          break;
        case 'APPEAL':
          this.addAppealSlide(slide);
          break;
        case 'ILLUSTRATION':
        case 'GOSPEL_CENTER':
        case 'DISCUSSION':
        case 'RECAP':
        case 'BLANK':
        default:
          this.addGenericSlide(slide);
          break;
      }
    }
  }

  public async download(): Promise<void> {
    const filename = this.deck.metadata.sermonTitle
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    await this.pptx.writeFile({ fileName: `${filename}_sermon.pptx` });
  }

  public async getBlob(): Promise<Blob> {
    return await this.pptx.write({ outputType: 'blob' }) as Blob;
  }
}

export async function generateAndDownloadPPT(deck: SlideDeck): Promise<void> {
  const renderer = new SermonPPTRenderer(deck);
  renderer.render();
  await renderer.download();
}

// Alias for backward compatibility
export const downloadSermonPPT = generateAndDownloadPPT;
