/**
 * Study Guide Template Generator
 * Transforms Mind Map Palace analysis data into a formatted study guide
 */

import type { AIMapAnalysis, PrincipleData, CrossConnection } from '@/components/mind-map/types';
import { palaceFloors as floors } from '@/data/palaceData';

export interface StudyGuideOptions {
  title?: string;
  includeApplications?: boolean;
  includeVisualHooks?: boolean;
  includeCrossReferences?: boolean;
  includeSanctuary?: boolean;
  format: 'markdown' | 'html';
}

export interface StudyGuideSection {
  heading: string;
  level: 1 | 2 | 3;
  content: string;
  scriptures?: string[];
  visualHook?: string;
  application?: string;
}

export interface StudyGuide {
  title: string;
  theme: string;
  sections: StudyGuideSection[];
  crossReferences: CrossConnection[];
  applicationSummary: string[];
  closingReflection: string;
}

/**
 * Generate a study guide from Mind Map analysis data
 */
export function generateStudyGuide(
  analysis: AIMapAnalysis,
  sourceText: string,
  options: StudyGuideOptions = { format: 'markdown' }
): StudyGuide {
  const {
    includeApplications = true,
    includeVisualHooks = true,
    includeCrossReferences = true,
    includeSanctuary = true,
  } = options;

  const sections: StudyGuideSection[] = [];
  const applicationSummary: string[] = [];

  // Generate title from overall theme
  const title = options.title || analysis.overallTheme || 'Bible Study Guide';

  // Introduction section
  sections.push({
    heading: 'Overview',
    level: 1,
    content: `This study explores: "${analysis.overallTheme}"`,
  });

  // Source text summary
  const sourcePreview = sourceText.length > 500
    ? sourceText.substring(0, 500) + '...'
    : sourceText;
  sections.push({
    heading: 'Source Text',
    level: 2,
    content: sourcePreview,
  });

  // Process each relevant floor
  const relevantFloors = analysis.relevantFloors || [];

  for (const floorNum of relevantFloors) {
    const floor = floors.find(f => f.number === floorNum);
    if (!floor) continue;

    const floorRooms = Object.entries(analysis.roomAnalysis)
      .filter(([roomId, result]) => {
        const room = floor.rooms?.find(r => r.id === roomId);
        return room && result.applicable && result.principles.length > 0;
      });

    if (floorRooms.length === 0) continue;

    // Floor heading
    sections.push({
      heading: `Floor ${floorNum}: ${floor.name}`,
      level: 1,
      content: floor.subtitle || '',
    });

    // Process rooms in this floor
    for (const [roomId, roomResult] of floorRooms) {
      const room = floor.rooms?.find(r => r.id === roomId);
      if (!room) continue;

      // Room heading
      sections.push({
        heading: `${room.tag} - ${room.name}`,
        level: 2,
        content: room.coreQuestion || '',
      });

      // Process principles for this room
      for (const principle of roomResult.principles) {
        const principleSection: StudyGuideSection = {
          heading: 'Principle',
          level: 3,
          content: principle.content,
          scriptures: principle.scriptures,
        };

        // Add evidence
        if (principle.evidence && principle.evidence.length > 0) {
          principleSection.content += '\n\n**Evidence:** ' + principle.evidence.join('; ');
        }

        // Add theological insight
        if (principle.insight) {
          principleSection.content += '\n\n**Insight:** ' + principle.insight;
        }

        // Add visual hook if requested
        if (includeVisualHooks && principle.visualHook) {
          principleSection.visualHook = principle.visualHook;
          principleSection.content += '\n\n**Visual Memory Hook:** ' + principle.visualHook;
        }

        // Add application if requested
        if (includeApplications && principle.application) {
          principleSection.application = principle.application;
          principleSection.content += '\n\n**Application:** ' + principle.application;
          applicationSummary.push(principle.application);
        }

        sections.push(principleSection);
      }
    }
  }

  // Sanctuary Analysis (if applicable and requested)
  if (includeSanctuary && analysis.sanctuaryAnalysis) {
    const sanctuaryEntries = Object.entries(analysis.sanctuaryAnalysis)
      .filter(([_, result]) => result.applicable && result.insights.length > 0);

    if (sanctuaryEntries.length > 0) {
      sections.push({
        heading: 'Sanctuary Connections',
        level: 1,
        content: 'How this passage connects to the sanctuary pattern:',
      });

      for (const [elementId, result] of sanctuaryEntries) {
        for (const insight of result.insights) {
          const sanctuarySection: StudyGuideSection = {
            heading: formatSanctuaryElementName(elementId),
            level: 2,
            content: insight.content,
            scriptures: insight.scriptures,
          };

          if (insight.insight) {
            sanctuarySection.content += '\n\n**Connection:** ' + insight.insight;
          }

          if (includeApplications && insight.application) {
            sanctuarySection.application = insight.application;
            applicationSummary.push(insight.application);
          }

          sections.push(sanctuarySection);
        }
      }
    }
  }

  // Cross-references
  const crossRefs = includeCrossReferences ? analysis.crossConnections : [];
  if (crossRefs.length > 0) {
    sections.push({
      heading: 'Thematic Connections',
      level: 1,
      content: crossRefs.map(ref =>
        `**${ref.from} → ${ref.to}** (${ref.type}): ${ref.description}`
      ).join('\n\n'),
    });
  }

  // Application summary
  if (applicationSummary.length > 0) {
    sections.push({
      heading: 'Application Summary',
      level: 1,
      content: applicationSummary.map((app, i) => `${i + 1}. ${app}`).join('\n'),
    });
  }

  // Closing reflection
  const closingReflection = generateClosingReflection(analysis.overallTheme);

  return {
    title,
    theme: analysis.overallTheme,
    sections,
    crossReferences: crossRefs,
    applicationSummary,
    closingReflection,
  };
}

/**
 * Convert study guide to markdown string
 */
export function studyGuideToMarkdown(guide: StudyGuide): string {
  let markdown = `# ${guide.title}\n\n`;
  markdown += `> **Theme:** ${guide.theme}\n\n`;
  markdown += `---\n\n`;

  for (const section of guide.sections) {
    const headingPrefix = '#'.repeat(section.level + 1);
    markdown += `${headingPrefix} ${section.heading}\n\n`;
    markdown += `${section.content}\n\n`;

    if (section.scriptures && section.scriptures.length > 0) {
      markdown += `**Scripture References:** ${section.scriptures.join(', ')}\n\n`;
    }
  }

  markdown += `---\n\n`;
  markdown += `## Closing Reflection\n\n`;
  markdown += `${guide.closingReflection}\n\n`;
  markdown += `---\n\n`;
  markdown += `*Generated using Phototheology Mind Map Palace*\n`;

  return markdown;
}

/**
 * Convert study guide to HTML string
 */
export function studyGuideToHTML(guide: StudyGuide): string {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${guide.title}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #4a4a4a; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    h2 { color: #666; margin-top: 30px; }
    h3 { color: #888; }
    blockquote { border-left: 4px solid #ddd; margin: 20px 0; padding-left: 20px; color: #666; font-style: italic; }
    .scripture { background: #f9f9f9; padding: 10px; border-radius: 4px; margin: 10px 0; }
    .theme { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .application { background: #e8f5e9; padding: 15px; border-radius: 4px; margin: 15px 0; border-left: 4px solid #4caf50; }
    .visual-hook { background: #fff3e0; padding: 15px; border-radius: 4px; margin: 15px 0; border-left: 4px solid #ff9800; }
    hr { border: none; border-top: 1px solid #eee; margin: 40px 0; }
    .footer { text-align: center; color: #999; font-size: 0.9em; margin-top: 40px; }
  </style>
</head>
<body>
  <h1>${guide.title}</h1>
  <div class="theme"><strong>Theme:</strong> ${guide.theme}</div>
`;

  for (const section of guide.sections) {
    const tag = `h${section.level + 1}`;
    html += `<${tag}>${section.heading}</${tag}>\n`;
    html += `<p>${section.content.replace(/\n/g, '</p><p>')}</p>\n`;

    if (section.scriptures && section.scriptures.length > 0) {
      html += `<div class="scripture"><strong>Scripture References:</strong> ${section.scriptures.join(', ')}</div>\n`;
    }
  }

  html += `<hr>
  <h2>Closing Reflection</h2>
  <p>${guide.closingReflection}</p>
  <hr>
  <div class="footer"><em>Generated using Phototheology Mind Map Palace</em></div>
</body>
</html>`;

  return html;
}

/**
 * Format sanctuary element ID to readable name
 */
function formatSanctuaryElementName(elementId: string): string {
  const names: Record<string, string> = {
    'altar-of-sacrifice': 'Altar of Sacrifice',
    'laver': 'Laver',
    'table-of-showbread': 'Table of Showbread',
    'candlestick': 'Golden Candlestick',
    'altar-of-incense': 'Altar of Incense',
    'ark': 'Ark of the Covenant',
    'mercy-seat': 'Mercy Seat',
  };
  return names[elementId] || elementId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Generate a closing reflection based on the theme
 */
function generateClosingReflection(theme: string): string {
  return `As we conclude this study, may the truths discovered about "${theme}" become deeply rooted in your heart. Remember that Scripture is not merely information to be learned, but a living Word that transforms us when we meditate upon it.

Take time this week to revisit the principles and applications from this study. Consider keeping a journal to record how God speaks to you through these insights.

"Thy word have I hid in mine heart, that I might not sin against thee." — Psalm 119:11 (KJV)`;
}
