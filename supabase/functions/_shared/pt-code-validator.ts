/**
 * PT Code Validator
 * Validates Jeeves output for hallucinated PT codes and meanings.
 * Catches errors, logs them, and provides correction suggestions.
 */

// The ONLY valid PT codes and their EXACT meanings
export const VALID_PT_CODES: Record<string, string> = {
  // Floor 1 - Furnishing
  "SR": "Story Room",
  "IR": "Imagination Room",
  "24": "24FPS Room",
  "BR": "Bible Rendered",
  "TR": "Translation Room",
  "GR": "Gems Room",

  // Floor 2 - Investigation
  "OR": "Observation Room",
  "DC": "Def-Com Room",
  "@T": "Symbols/Types Room",
  "QR": "Questions Room",
  "QA": "Q&A Chains Room",

  // Floor 3 - Freestyle
  "NF": "Nature Freestyle",
  "PF": "Personal Freestyle",
  "BF": "Bible Freestyle",
  "HF": "History Freestyle",
  "LR": "Listening Room",

  // Floor 4 - Next Level
  "CR": "Concentration Room",
  "DR": "Dimensions Room",
  "C6": "Connect-6",
  "TRm": "Theme Room",
  "TZ": "Time Zone",
  "PRm": "Patterns Room",
  "P‖": "Parallels Room",
  "FRt": "Fruit Room",
  "CEC": "Christ Every Chapter",
  "R66": "Room 66",

  // Floor 5 - Vision
  "BL": "Blue Room/Sanctuary",
  "PR": "Prophecy Room",
  "3A": "Three Angels Room",
  "FE": "Feasts Room",

  // Floor 6 - Cycles & Three Heavens
  "@Ad": "Adamic Cycle",
  "@No": "Noahic Cycle",
  "@Ab": "Abrahamic Cycle",
  "@Mo": "Mosaic Cycle",
  "@Cy": "Cyrusic Cycle",
  "@CyC": "Cyrus-Christ Cycle",
  "@Sp": "Spirit Cycle",
  "@Re": "Remnant Cycle",
  "1H": "First Heaven",
  "2H": "Second Heaven",
  "3H": "Third Heaven",
  "JR": "Juice Room",

  // Floor 7 - Spiritual
  "FRm": "Fire Room",
  "MR": "Meditation Room",
  "SRm": "Speed Room",
};

// Known hallucinated codes and meanings to catch
const HALLUCINATED_PATTERNS = [
  // Invented codes
  { pattern: /\bCE\b.*?\([^)]*Enabl/gi, description: "CE (Christ's Enabling)" },
  { pattern: /\bC\b.*?\([^)]*Christ.*?Work/gi, description: "C (Christ's Work)" },
  { pattern: /\bCW\b.*?\(/gi, description: "CW code" },
  { pattern: /\bCA\b.*?\([^)]*Christ/gi, description: "CA (Christ's Aspect)" },
  { pattern: /\bCP\b.*?\([^)]*Christ/gi, description: "CP code" },

  // Invented meanings for real codes
  { pattern: /\bBL\b.*?\([^)]*Body.*?Light/gi, description: "BL misinterpreted as 'Body of Light'" },
  { pattern: /\bCR\b.*?\([^)]*Christ.*?Room(?!\s*=\s*Concentration)/gi, description: "CR misinterpreted as 'Christ Room'" },
  { pattern: /\bPR\b.*?\([^)]*Priest/gi, description: "PR misinterpreted as 'Priesthood Room'" },
  { pattern: /\bPR\b.*?\([^)]*Prayer.*?Room/gi, description: "PR misinterpreted as 'Prayer Room'" },

  // Generic pattern for any code followed by invented meaning
  { pattern: /"([A-Z]{1,3})"\s*\((?!Story|Imagination|24FPS|Bible|Translation|Gems|Observation|Def-Com|Symbols|Types|Questions|Q&A|Nature|Personal|History|Listening|Concentration|Dimensions|Connect|Theme|Time|Patterns|Parallels|Fruit|Christ Every|Room 66|Blue|Sanctuary|Prophecy|Three Angels|Feasts|Adamic|Noahic|Abrahamic|Mosaic|Cyrusic|Spirit|Remnant|First|Second|Third|Juice|Fire|Meditation|Speed)[^)]+\)/gi, description: "Unknown code with invented meaning" },
];

export interface ValidationResult {
  isValid: boolean;
  violations: Array<{
    type: "invented_code" | "invented_meaning" | "unknown";
    detected: string;
    context: string;
    correction: string;
  }>;
  correctedText?: string;
  apology?: string;
}

/**
 * Validates text for hallucinated PT codes
 */
export function validatePTCodes(text: string): ValidationResult {
  const violations: ValidationResult["violations"] = [];

  // Check for hallucinated patterns
  for (const { pattern, description } of HALLUCINATED_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        violations.push({
          type: match.includes("(") ? "invented_meaning" : "invented_code",
          detected: match,
          context: description,
          correction: getSuggestion(match),
        });
      }
    }
  }

  // Check for any code-like pattern with parenthetical explanation
  const codePattern = /["']?([A-Z@][A-Z0-9‖]{0,3})["']?\s*\(([^)]+)\)/g;
  let match;
  while ((match = codePattern.exec(text)) !== null) {
    const [fullMatch, code, meaning] = match;
    const normalizedCode = code.replace(/["']/g, "");

    // Check if it's a valid code
    if (VALID_PT_CODES[normalizedCode]) {
      // Check if the meaning is correct
      const correctMeaning = VALID_PT_CODES[normalizedCode];
      if (!meaning.toLowerCase().includes(correctMeaning.toLowerCase().split("/")[0].split(" ")[0])) {
        violations.push({
          type: "invented_meaning",
          detected: fullMatch,
          context: `${normalizedCode} should be "${correctMeaning}", not "${meaning}"`,
          correction: `${normalizedCode} (${correctMeaning})`,
        });
      }
    } else if (!["AD", "BC", "KJV", "NIV", "ESV", "OT", "NT"].includes(normalizedCode)) {
      // Unknown code that's not a common abbreviation
      violations.push({
        type: "invented_code",
        detected: fullMatch,
        context: `"${normalizedCode}" is not a valid PT code`,
        correction: "Remove the code and use plain language instead",
      });
    }
  }

  const isValid = violations.length === 0;

  return {
    isValid,
    violations,
    correctedText: isValid ? undefined : attemptCorrection(text, violations),
    apology: isValid ? undefined : generateApology(violations),
  };
}

function getSuggestion(match: string): string {
  if (match.toLowerCase().includes("body of light")) {
    return "BL means 'Blue Room/Sanctuary', not 'Body of Light'. Use plain language to describe concepts about light.";
  }
  if (match.toLowerCase().includes("christ") && match.toLowerCase().includes("enabl")) {
    return "There is no 'CE' code in Phototheology. Say 'Christ's enabling work' in plain English.";
  }
  if (match.toLowerCase().includes("christ") && match.toLowerCase().includes("work")) {
    return "There is no 'C' or 'CW' code in Phototheology. Describe Christ's work using natural language.";
  }
  return "Use plain language instead of inventing PT codes.";
}

function attemptCorrection(text: string, violations: ValidationResult["violations"]): string {
  let corrected = text;

  for (const violation of violations) {
    // Remove or replace hallucinated codes
    if (violation.type === "invented_code") {
      corrected = corrected.replace(violation.detected, "");
    } else if (violation.type === "invented_meaning") {
      // Try to replace with correct meaning
      const codeMatch = violation.detected.match(/["']?([A-Z@][A-Z0-9‖]{0,3})["']?\s*\([^)]+\)/);
      if (codeMatch) {
        const code = codeMatch[1];
        if (VALID_PT_CODES[code]) {
          corrected = corrected.replace(violation.detected, `${code} (${VALID_PT_CODES[code]})`);
        } else {
          corrected = corrected.replace(violation.detected, "");
        }
      }
    }
  }

  return corrected.replace(/\s+/g, " ").trim();
}

function generateApology(violations: ValidationResult["violations"]): string {
  const uniqueIssues = [...new Set(violations.map(v => v.context))];

  if (uniqueIssues.length === 1) {
    return `I apologize for the error. I incorrectly referenced "${violations[0].detected}" - ${violations[0].context}. ${violations[0].correction}`;
  }

  return `I apologize for referencing invalid PT terminology. The following errors were made:\n${
    uniqueIssues.slice(0, 3).map((issue, i) => `${i + 1}. ${issue}`).join("\n")
  }\n\nI should use only official PT codes with their correct meanings, or describe concepts in plain language.`;
}

/**
 * Log a guardrail violation to the database
 */
export async function logGuardrailViolation(
  supabase: any,
  mode: string,
  input: string,
  output: string,
  violations: ValidationResult["violations"]
): Promise<void> {
  try {
    await supabase.from("guardrail_violations").insert({
      mode,
      input_text: input.substring(0, 1000),
      output_text: output.substring(0, 2000),
      violations: violations,
      violation_count: violations.length,
    });
  } catch (error) {
    console.error("[PT Validator] Failed to log violation:", error);
  }
}
