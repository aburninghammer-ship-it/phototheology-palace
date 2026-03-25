import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ═══════════════════════════════════════════════════════════════
// CANONICAL PALACE WHITELIST — The only valid rooms/terms
// ═══════════════════════════════════════════════════════════════

const VALID_ROOM_TAGS = new Set([
  // Floor 1 - Furnishing
  "SR", "IR", "24F", "BR", "TR", "GR",
  // Floor 2 - Investigation
  "OR", "DC", "ST", "QR", "QA",
  // Floor 3 - Freestyle
  "NF", "PF", "BF", "HF", "LR",
  // Floor 4 - Next Level
  "CR", "DR", "C6", "TRm", "TZ", "PRm", "P‖", "FRt", "CEC", "R66",
  // Floor 5 - Vision
  "BL", "PR", "3A", "FR", "MATH",
  // Floor 6 - Three Heavens & Cycles
  "JR",
  // Floor 7 - Spiritual/Emotional
  "FRm", "MR", "SRm",
  // Floor 8 - Master (no rooms, ∞)
]);

const VALID_ROOM_NAMES = new Set([
  "story room", "imagination room", "24fps", "bible rendered", "translation room", "gems room",
  "observation room", "def-com room", "symbols/types room", "questions room", "q&a room",
  "nature freestyle", "personal freestyle", "bible freestyle", "history/social freestyle", "listening room",
  "concentration room", "dimensions room", "connect 6", "theme room", "time zone room",
  "patterns room", "parallels room", "fruit room", "christ in every chapter", "room 66",
  "blue room", "sanctuary", "prophecy room", "three angels' room", "feasts room", "mathematics room",
  "juice room",
  "fire room", "meditation room", "speed room",
]);

const VALID_CYCLES = ["@Ad", "@No", "@Ab", "@Mo", "@Cy", "@CyC", "@Sp", "@Re"];

const VALID_HEAVENS = ["1H", "2H", "3H", "DoL¹", "DoL²", "DoL³", "NE¹", "NE²", "NE³"];

// ═══════════════════════════════════════════════════════════════
// FORBIDDEN TERMS — Known hallucination patterns
// ═══════════════════════════════════════════════════════════════

const FORBIDDEN_TERMS = [
  "Kingdom Floor", "Law Floor", "Transmission Room", "Grounding Room",
  "Transmutation Room", "Frequency Resonance", "Royal Throne Room",
  "Forensic Lab", "Interrogation Chamber", "Shadow Chamber",
  "Theological Floor", "Floor 9", "Floor 10", "Ninth Floor", "Tenth Floor",
  "Quantum Room", "Ascension Room", "Portal Room", "Gateway Room",
  "Activation Chamber", "Resonance Chamber", "Frequency Room",
  "Destiny Room", "Manifestation Room", "Alignment Room",
];

// Three Heavens misuse: atmospheric/spatial instead of Day-of-the-Lord
const THREE_HEAVENS_MISUSE = [
  "first heaven.*atmosphere",
  "first heaven.*sky",
  "second heaven.*stars",
  "second heaven.*cosmic",
  "third heaven.*god's abode",
  "third heaven.*paradise.*paul",
  "physical.*earthly.*heaven",
  "spiritual.*cosmic.*heaven",
  "divine.*new creation.*heaven",
];

interface Violation {
  source_table: string;
  record_id: string;
  field: string;
  violation_type: string;
  detail: string;
  snippet: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const violations: Violation[] = [];
    let totalScanned = 0;

    // Scan window: last 3 days (since we run 3x/week)
    const scanSince = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

    // ─── 1. Scan bible_commentaries (AI-generated commentary) ───
    const { data: commentaries } = await supabase
      .from("bible_commentaries")
      .select("id, commentary_text, created_at")
      .gte("created_at", scanSince)
      .limit(500);

    if (commentaries) {
      totalScanned += commentaries.length;
      for (const c of commentaries) {
        scanText(c.commentary_text, "bible_commentaries", c.id, "commentary_text", violations);
      }
    }

    // ─── 2. Scan challenge_leaderboard (Jeeves feedback) ───
    const { data: leaderboard } = await supabase
      .from("challenge_leaderboard")
      .select("id, jeeves_feedback, created_at")
      .gte("created_at", scanSince)
      .not("jeeves_feedback", "is", null)
      .limit(500);

    if (leaderboard) {
      totalScanned += leaderboard.length;
      for (const l of leaderboard) {
        if (l.jeeves_feedback) {
          scanText(l.jeeves_feedback, "challenge_leaderboard", l.id, "jeeves_feedback", violations);
        }
      }
    }

    // ─── 3. Scan challenge_submissions (AI feedback) ───
    const { data: submissions } = await supabase
      .from("challenge_submissions")
      .select("id, ai_feedback, created_at")
      .gte("created_at", scanSince)
      .not("ai_feedback", "is", null)
      .limit(500);

    if (submissions) {
      totalScanned += submissions.length;
      for (const s of submissions) {
        if (s.ai_feedback) {
          scanText(s.ai_feedback, "challenge_submissions", s.id, "ai_feedback", violations);
        }
      }
    }

    // ─── 4. Scan chapter_commentary_cache ───
    const { data: chapterComm } = await supabase
      .from("chapter_commentary_cache")
      .select("id, commentary_text, created_at")
      .gte("created_at", scanSince)
      .limit(500);

    if (chapterComm) {
      totalScanned += chapterComm.length;
      for (const c of chapterComm) {
        scanText(c.commentary_text, "chapter_commentary_cache", c.id, "commentary_text", violations);
      }
    }

    // ─── 5. Scan character_deep_analyses ───
    const { data: charAnalyses } = await supabase
      .from("character_deep_analyses")
      .select("id, analysis_text, created_at")
      .gte("created_at", scanSince)
      .limit(500);

    if (charAnalyses) {
      totalScanned += charAnalyses.length;
      for (const a of charAnalyses) {
        scanText(a.analysis_text, "character_deep_analyses", a.id, "analysis_text", violations);
      }
    }

    // ─── Build summary ───
    const summary = violations.length === 0
      ? `✅ Clean audit: ${totalScanned} records scanned, no hallucinations detected.`
      : `⚠️ ${violations.length} violation(s) found across ${totalScanned} records scanned.`;

    // ─── Log results ───
    await supabase.from("hallucination_audit_logs").insert({
      total_scanned: totalScanned,
      violations_found: violations.length,
      violations: violations,
      summary,
    });

    console.log(`[Hallucination Audit] ${summary}`);

    return new Response(JSON.stringify({ summary, totalScanned, violations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Hallucination Audit] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// SCAN ENGINE
// ═══════════════════════════════════════════════════════════════

function scanText(
  text: string,
  table: string,
  recordId: string,
  field: string,
  violations: Violation[]
) {
  if (!text) return;
  const lower = text.toLowerCase();

  // 1. Check forbidden terms
  for (const term of FORBIDDEN_TERMS) {
    if (lower.includes(term.toLowerCase())) {
      violations.push({
        source_table: table,
        record_id: recordId,
        field,
        violation_type: "FORBIDDEN_TERM",
        detail: `Hallucinated term: "${term}"`,
        snippet: extractSnippet(text, term),
      });
    }
  }

  // 2. Check Three Heavens misuse (spatial instead of Day-of-the-Lord)
  for (const pattern of THREE_HEAVENS_MISUSE) {
    const regex = new RegExp(pattern, "i");
    if (regex.test(text)) {
      violations.push({
        source_table: table,
        record_id: recordId,
        field,
        violation_type: "THREE_HEAVENS_MISUSE",
        detail: `Three Heavens described spatially instead of as Day-of-the-Lord cycles. Pattern: ${pattern}`,
        snippet: extractSnippet(text, pattern.split(".*")[0]),
      });
    }
  }

  // 3. Check for invented floors (Floor 9+)
  const inventedFloor = text.match(/(?:floor\s*(\d+))/gi);
  if (inventedFloor) {
    for (const match of inventedFloor) {
      const num = parseInt(match.replace(/\D/g, ""));
      if (num > 8) {
        violations.push({
          source_table: table,
          record_id: recordId,
          field,
          violation_type: "INVENTED_FLOOR",
          detail: `Reference to non-existent Floor ${num}. Only Floors 1-8 exist.`,
          snippet: extractSnippet(text, match),
        });
      }
    }
  }

  // 4. Spot-check for room tags that look like Palace references but aren't valid
  const possibleTags = text.match(/\b([A-Z]{2,4})\s*(?:Room|room|-\s)/g);
  if (possibleTags) {
    for (const tagMatch of possibleTags) {
      const tag = tagMatch.replace(/\s*(Room|room|-\s).*/i, "").trim();
      if (tag.length >= 2 && tag.length <= 4 && !VALID_ROOM_TAGS.has(tag)) {
        // Filter out common English abbreviations
        const commonAbbreviations = new Set(["THE", "AND", "FOR", "NOT", "BUT", "ALL", "HIS", "HER", "WAS", "ARE", "HAS", "HAD", "CAN", "WHO", "HOW", "WHY", "OLD", "NEW", "DAY", "GOD", "ONE", "TWO", "MAN", "SON", "HIM"]);
        if (!commonAbbreviations.has(tag)) {
          violations.push({
            source_table: table,
            record_id: recordId,
            field,
            violation_type: "SUSPECT_ROOM_TAG",
            detail: `Possible hallucinated room tag: "${tag}" — not in canonical whitelist.`,
            snippet: extractSnippet(text, tagMatch),
          });
        }
      }
    }
  }
}

function extractSnippet(text: string, searchTerm: string): string {
  const idx = text.toLowerCase().indexOf(searchTerm.toLowerCase());
  if (idx === -1) return text.substring(0, 120) + "...";
  const start = Math.max(0, idx - 60);
  const end = Math.min(text.length, idx + searchTerm.length + 60);
  return (start > 0 ? "..." : "") + text.substring(start, end) + (end < text.length ? "..." : "");
}
