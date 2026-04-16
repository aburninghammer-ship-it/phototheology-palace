/**
 * Interpretation Detection for Observation Flux
 *
 * Enforces "Observe only. Do not interpret." mechanically through regex patterns.
 */

export interface ValidationResult {
  valid: boolean;
  type: 'valid' | 'hard_penalty' | 'soft_warning' | 'bonus';
  points: number;
  feedback: string;
  pattern?: string;
}

// Hard triggers - instant penalty, interpretation detected
const HARD_TRIGGERS = {
  // Meaning-claim verbs
  meaningVerbs: /\b(means?|meaning|represents?|symbolizes?|points?\s+to|refers?\s+to|stands?\s+for|signifies?|typifies?|foreshadows?)\b/i,

  // Theology imports (often interpretive in OR)
  theologyImports: /\b(grace|mercy|forgiveness|atonement|justification|sanctification|salvation|gospel|repentance|conversion|redemption|propitiation)\b/i,

  // Mind-reading / motive attribution
  mindReading: /\b(intended|wanted|decided|tried\s+to|meant\s+to|hoped|planned|thought|believed|felt\s+that|knew\s+that)\b/i,

  // Moral evaluation
  moralEvaluation: /\b(sinful|righteous|evil|good|wicked|holy|blessed|cursed|pure|defiled)\b/i,

  // Prophecy IDs (observation forbids identification)
  prophecyIds: /\b(papacy|rome|america|islam|jesuits?|babylon|antichrist|beast\s+power)\b/i,

  // Date interpretations
  dateInterpretations: /\b(1798|1844|538|1260\s+years?|2300\s+days?|time\s+of\s+the\s+end)\b/i,
};

// Soft triggers - prompt rephrase unless quoted
const SOFT_TRIGGERS = {
  emotionalTerms: /\b(feel|felt|emotion|heart|love|kindness|compassion|pity|anger|joy)\b/i,
};

// Valid observation patterns - bonus points
const VALID_PATTERNS = {
  // Count observations
  counts: /\b(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b.*\b(verbs?|actions?|characters?|people|persons?|times?|words?)\b/i,

  // Agency observations
  agency: /\b(all|only|every|no|none)\b.*\b(actions?|verbs?)\b.*\b(are|is|by|from|of)\b/i,

  // Sequence observations
  sequence: /\b(before|after|then|first|next|finally|precedes?|follows?|prior\s+to|subsequent)\b/i,

  // Spatial/structural observations
  spatial: /\b(beginning|middle|end|appears?|mentioned|stated|written|occurs?)\b/i,

  // Quote-based observations (always valid)
  quoteBased: /(the\s+)?(phrase|word|text|verse)\s+['"].*['"]\s+(appears?|is\s+used|occurs?|is\s+mentioned)/i,

  // Character/entity counting
  entityCount: /\b(character|person|entity|subject|object)\b.*\b(is|are|mentioned|appears?)\b/i,
};

// Check if text contains a quote that allows soft trigger words
function hasQuotedPhrase(text: string): boolean {
  // Check for patterns like: the phrase "X" appears, "X" is mentioned, etc.
  return /['"][^'"]+['"]/.test(text) &&
         /(phrase|word|text|verse|says?|states?|reads?|appears?|mentioned|written)/i.test(text);
}

// Check for hard interpretation triggers
function checkHardTriggers(text: string): { triggered: boolean; pattern: string } | null {
  for (const [name, pattern] of Object.entries(HARD_TRIGGERS)) {
    if (pattern.test(text)) {
      return { triggered: true, pattern: name };
    }
  }
  return null;
}

// Check for soft triggers (only penalize if not quoted)
function checkSoftTriggers(text: string): { triggered: boolean; pattern: string } | null {
  if (hasQuotedPhrase(text)) {
    return null; // Quoted phrases are allowed
  }

  for (const [name, pattern] of Object.entries(SOFT_TRIGGERS)) {
    if (pattern.test(text)) {
      return { triggered: true, pattern: name };
    }
  }
  return null;
}

// Check for valid observation patterns (bonus)
function checkValidPatterns(text: string): { matched: boolean; pattern: string; points: number } | null {
  // Quote-based always gets highest bonus
  if (VALID_PATTERNS.quoteBased.test(text)) {
    return { matched: true, pattern: 'quoteBased', points: 20 };
  }

  // Agency observations (high value)
  if (VALID_PATTERNS.agency.test(text)) {
    return { matched: true, pattern: 'agency', points: 15 };
  }

  // Sequence observations (high value)
  if (VALID_PATTERNS.sequence.test(text)) {
    return { matched: true, pattern: 'sequence', points: 15 };
  }

  // Count observations
  if (VALID_PATTERNS.counts.test(text)) {
    return { matched: true, pattern: 'counts', points: 10 };
  }

  // Entity counting
  if (VALID_PATTERNS.entityCount.test(text)) {
    return { matched: true, pattern: 'entityCount', points: 10 };
  }

  // Spatial/structural
  if (VALID_PATTERNS.spatial.test(text)) {
    return { matched: true, pattern: 'spatial', points: 10 };
  }

  return null;
}

// Generate feedback messages
const FEEDBACK_MESSAGES = {
  // Hard trigger feedback
  meaningVerbs: "You're interpreting meaning. Stick to what the text explicitly says.",
  theologyImports: "Theological terms import interpretation. Describe only what's written.",
  mindReading: "You can't observe someone's thoughts. Describe their actions instead.",
  moralEvaluation: "Moral judgments are interpretive. Just describe what happened.",
  prophecyIds: "Identification is interpretation. Describe what the text says, not what it 'means'.",
  dateInterpretations: "Date calculations are interpretive. Stick to what's written.",

  // Soft trigger feedback
  emotionalTerms: "Rephrase using the exact words from the verse, or quote the phrase directly.",

  // Valid pattern feedback
  quoteBased: "Excellent use of direct quotation!",
  agency: "Great agency observation - who does what matters!",
  sequence: "Good sequencing - order reveals structure!",
  counts: "Nice counting - precision builds understanding!",
  entityCount: "Good entity identification!",
  spatial: "Good structural observation!",

  // Default
  valid: "Valid observation.",
  neutral: "Observation recorded.",
};

/**
 * Validate an observation line
 */
export function validateObservation(text: string): ValidationResult {
  const trimmed = text.trim();

  // Empty lines are neutral
  if (!trimmed) {
    return {
      valid: true,
      type: 'valid',
      points: 0,
      feedback: '',
    };
  }

  // Check hard triggers first
  const hardTrigger = checkHardTriggers(trimmed);
  if (hardTrigger) {
    return {
      valid: false,
      type: 'hard_penalty',
      points: -10,
      feedback: FEEDBACK_MESSAGES[hardTrigger.pattern as keyof typeof FEEDBACK_MESSAGES] || FEEDBACK_MESSAGES.meaningVerbs,
      pattern: hardTrigger.pattern,
    };
  }

  // Check soft triggers
  const softTrigger = checkSoftTriggers(trimmed);
  if (softTrigger) {
    return {
      valid: false,
      type: 'soft_warning',
      points: -5,
      feedback: FEEDBACK_MESSAGES[softTrigger.pattern as keyof typeof FEEDBACK_MESSAGES] || FEEDBACK_MESSAGES.emotionalTerms,
      pattern: softTrigger.pattern,
    };
  }

  // Check for bonus patterns
  const validPattern = checkValidPatterns(trimmed);
  if (validPattern) {
    return {
      valid: true,
      type: 'bonus',
      points: validPattern.points,
      feedback: FEEDBACK_MESSAGES[validPattern.pattern as keyof typeof FEEDBACK_MESSAGES] || FEEDBACK_MESSAGES.valid,
      pattern: validPattern.pattern,
    };
  }

  // Default: valid but no bonus
  return {
    valid: true,
    type: 'valid',
    points: 5,
    feedback: FEEDBACK_MESSAGES.neutral,
  };
}

/**
 * Validate multiple observation lines
 */
export function validateObservations(text: string): {
  results: ValidationResult[];
  totalPoints: number;
  validCount: number;
  penaltyCount: number;
} {
  const lines = text.split('\n').filter(line => line.trim());
  const results = lines.map(validateObservation);

  return {
    results,
    totalPoints: results.reduce((sum, r) => sum + r.points, 0),
    validCount: results.filter(r => r.valid).length,
    penaltyCount: results.filter(r => !r.valid).length,
  };
}

/**
 * Check if text references a verb that doesn't exist in the verse
 */
export function checkForNonExistentVerb(
  observation: string,
  actualVerbs: string[],
  decoyVerbs: string[]
): { isDecoy: boolean; verb: string } | null {
  const lowerObservation = observation.toLowerCase();

  for (const decoy of decoyVerbs) {
    if (lowerObservation.includes(decoy.toLowerCase())) {
      // Make sure it's not actually in the verse
      const isActual = actualVerbs.some(v =>
        v.toLowerCase().includes(decoy.toLowerCase())
      );
      if (!isActual) {
        return { isDecoy: true, verb: decoy };
      }
    }
  }

  return null;
}
