/**
 * CRITICAL: Theological Validation Rules
 * 
 * This file enforces hard theological rules that must never be violated
 * anywhere in the application - including Jeeves responses, challenges,
 * games, courses, and any user-generated content.
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates content against hard theological rules
 */
export function validateTheologicalContent(content: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Convert to lowercase for case-insensitive checking
  const lowerContent = content.toLowerCase();

  // Rule 1: Scapegoat must NEVER be identified as Jesus/Christ
  if (lowerContent.includes('scapegoat')) {
    const scapegoatPatterns = [
      /scapegoat.*jesus/i,
      /scapegoat.*christ/i,
      /jesus.*scapegoat/i,
      /christ.*scapegoat/i,
      /scapegoat.*represents.*jesus/i,
      /scapegoat.*represents.*christ/i,
      /scapegoat.*is.*jesus/i,
      /scapegoat.*is.*christ/i,
      /scapegoat.*symbolizes.*jesus/i,
      /scapegoat.*symbolizes.*christ/i,
      /jesus.*is.*scapegoat/i,
      /christ.*is.*scapegoat/i,
    ];

    for (const pattern of scapegoatPatterns) {
      if (pattern.test(content)) {
        errors.push(
          'CRITICAL VIOLATION: The scapegoat must NEVER be identified as Jesus or Christ. ' +
          'The scapegoat (Leviticus 16:8-10, 20-22) represents Azazel/Satan bearing sin AFTER atonement is complete. ' +
          'Christ is the LORD\'S goat (the one slain), NOT the scapegoat (sent away).'
        );
        break;
      }
    }
  }

  // Rule 2: Little horn of Daniel 8 must NEVER be identified as Antiochus
  if (lowerContent.includes('antiochus') && lowerContent.includes('daniel')) {
    const antiochusPatterns = [
      /antiochus.*daniel\s*8/i,
      /daniel\s*8.*antiochus/i,
      /little\s+horn.*antiochus/i,
      /antiochus.*little\s+horn/i,
      /daniel\s*8.*168\s*bc/i,
      /168\s*bc.*daniel\s*8/i,
    ];

    for (const pattern of antiochusPatterns) {
      if (pattern.test(content)) {
        errors.push(
          'CRITICAL VIOLATION: The little horn of Daniel 8 must NEVER be identified as Antiochus Epiphanes. ' +
          'The little horn of Daniel 8 represents papal Rome, not Antiochus. ' +
          'While Antiochus may be a type, he does NOT fulfill the Daniel 8 prophecy. ' +
          'The 2,300 days point to 1844 and the judgment hour, not the Maccabean period.'
        );
        break;
      }
    }
  }

  // Warning: Ensure proper scapegoat teaching when mentioned
  if (lowerContent.includes('scapegoat') && errors.length === 0) {
    const hasCorrectTeaching = 
      lowerContent.includes('azazel') || 
      lowerContent.includes('satan') ||
      (lowerContent.includes('lord') && lowerContent.includes('goat'));

    if (!hasCorrectTeaching) {
      warnings.push(
        'WARNING: When mentioning the scapegoat, clarify that it represents Azazel/Satan, ' +
        'and that Christ is the LORD\'S goat (slain), not the scapegoat (sent away).'
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates and sanitizes content, throwing an error if validation fails
 */
export function validateOrThrow(content: string, context: string = 'Content'): void {
  const result = validateTheologicalContent(content);
  
  if (!result.valid) {
    throw new Error(
      `Theological validation failed for ${context}:\n` +
      result.errors.join('\n')
    );
  }
}

/**
 * Gets a list of all theological rules for display
 */
export function getTheologicalRules(): Array<{ id: string; rule: string; rationale: string }> {
  return [
    {
      id: 'scapegoat-never-christ',
      rule: 'The scapegoat is NEVER Jesus Christ',
      rationale:
        'Leviticus 16 describes two goats: the LORD\'S goat (slain, representing Christ\'s sacrifice) ' +
        'and the scapegoat (Azazel, sent away, representing Satan bearing final guilt after atonement is complete). ' +
        'Confusing these destroys the sanctuary message of complete atonement and final judgment.',
    },
    {
      id: 'little-horn-never-antiochus',
      rule: 'The little horn of Daniel 8 is NEVER Antiochus Epiphanes',
      rationale:
        'The little horn of Daniel 8 represents papal Rome, fulfilling prophecy through the 2,300-day/year timeline ' +
        'pointing to 1844. While Antiochus Epiphanes may be a type of the desolating power, he does NOT fulfill ' +
        'the specific details of Daniel 8. This distinction is fundamental to Adventist prophetic interpretation.',
    },
  ];
}
