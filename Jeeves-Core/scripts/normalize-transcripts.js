#!/usr/bin/env node

/**
 * normalize-transcripts.js
 *
 * Reads all .vtt, .srt, and .txt transcript files from the YouTube-Transcripts
 * directory (including subdirectories), deduplicates across formats, normalizes
 * the text, and outputs one clean .txt per unique transcript to the Normalized/
 * output directory.
 *
 * Usage:
 *   node scripts/normalize-transcripts.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const INPUT_ROOT = path.join(
  __dirname,
  '..',
  '03_Transcript-Corpus',
  'YouTube-Transcripts'
);

const OUTPUT_ROOT = path.join(
  __dirname,
  '..',
  '03_Transcript-Corpus',
  'Normalized'
);

const SUBDIRS = ['Daniel', 'Health', 'Phototheology', 'Revelation', 'Sermons'];

const SUPPORTED_EXTENSIONS = ['.vtt', '.srt', '.txt'];

// Priority order for deduplication.
// SRT has the cleanest structure (timestamps + sequence numbers on separate lines).
// VTT is next best (has inline tags but structured).
// .txt files from this corpus have inline sequence numbers which make them hardest to clean.
// cleaned_ prefixed files are even worse (inline numbers create triple-duplicated text).
// Lower number = higher priority.
function filePriority(filename) {
  const base = path.basename(filename);
  const ext = path.extname(filename);

  // cleaned_ files have mangled inline numbers; lowest priority
  if (base.startsWith('cleaned_')) return 10;
  if (ext === '.srt') return 1;
  if (ext === '.vtt') return 2;
  if (ext === '.txt') return 3;
  return 20;
}

// ---------------------------------------------------------------------------
// Filename normalisation
// ---------------------------------------------------------------------------

/**
 * Derive a clean output filename from the source file name.
 * - Strips "cleaned_" prefix
 * - Strips date prefixes like "20240928 - "
 * - Strips ".en" language suffix before the extension
 * - Always outputs as .txt
 */
function cleanOutputName(filename) {
  let name = filename;

  // Remove cleaned_ prefix
  name = name.replace(/^cleaned_/, '');

  // Remove date prefix pattern: "YYYYMMDD - "
  name = name.replace(/^\d{8}\s*-\s*/, '');

  // Remove .en before the extension
  name = name.replace(/\.en(\.\w+)$/, '$1');

  // Force .txt extension
  const ext = path.extname(name);
  if (ext && ext !== '.txt') {
    name = name.slice(0, -ext.length) + '.txt';
  } else if (!ext) {
    name = name + '.txt';
  }

  return name;
}

/**
 * Derive the canonical key used to group files that represent the same transcript.
 */
function canonicalKey(filename) {
  return cleanOutputName(filename).toLowerCase();
}

// ---------------------------------------------------------------------------
// Text cleaning helpers
// ---------------------------------------------------------------------------

/** Returns true if the line is a VTT/SRT timestamp line. */
function isTimestampLine(line) {
  return /^\d{2}:\d{2}:\d{2}[.,]\d{3}\s*-->/.test(line.trim());
}

/** Returns true if the line is a pure SRT sequence number. */
function isSrtSequenceNumber(line) {
  return /^\d+$/.test(line.trim());
}

/** Returns true if the line is a VTT header or metadata line. */
function isVttHeader(line) {
  const t = line.trim();
  return (
    t === 'WEBVTT' ||
    /^Kind:\s*/i.test(t) ||
    /^Language:\s*/i.test(t) ||
    /^NOTE\b/.test(t) ||
    /^STYLE\b/.test(t) ||
    /^REGION\b/.test(t)
  );
}

/** Strip inline VTT tags: <c>, </c>, <00:00:00.480>, etc. */
function stripInlineTags(line) {
  let s = line.replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, '');
  s = s.replace(/<\/?[a-zA-Z][^>]*>/g, '');
  return s;
}

/** Strip VTT positioning metadata: align:start position:0% etc. */
function stripPositionMetadata(line) {
  return line
    .replace(/\b(align|position|line|size|vertical|region)\s*:\s*[^\s]*/gi, '')
    .trim();
}

// ---------------------------------------------------------------------------
// SRT Parser (preferred source format)
// ---------------------------------------------------------------------------

/**
 * Parse SRT content into an ordered list of cue objects.
 * Each cue has { index, startMs, endMs, lines[] }.
 */
function parseSrtCues(raw) {
  const blocks = raw.split(/\n\s*\n/);
  const cues = [];

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;

    // First line should be the sequence number
    if (!/^\d+$/.test(lines[0])) continue;

    // Second line should be the timestamp
    if (!isTimestampLine(lines[1])) continue;

    const textLines = lines.slice(2).map(l => stripInlineTags(l).trim()).filter(Boolean);

    cues.push({
      index: parseInt(lines[0], 10),
      textLines
    });
  }

  return cues;
}

/**
 * Process SRT cues to extract unique text.
 *
 * YouTube auto-generated subtitles use a rolling-window pattern:
 *   Cue 1: "line A"               (new content appearing)
 *   Cue 2: "line A"               (freeze frame, same content)
 *   Cue 3: "line A\nline B"       (line B appears below A)
 *   Cue 4: "line B"               (A scrolls off, B remains)
 *   Cue 5: "line B\nline C"       (line C appears below B)
 *   ...
 *
 * The unique new content in each cue is the LAST line of multi-line cues,
 * provided it wasn't already seen. Single-line cues that match a previously
 * seen line are pure repeats and can be skipped.
 */
function extractTextFromSrtCues(cues) {
  const uniqueLines = [];
  const seen = new Set();

  for (const cue of cues) {
    if (cue.textLines.length === 0) continue;

    // For each line in the cue, only add it if not already seen
    for (const line of cue.textLines) {
      const normalized = line.toLowerCase().trim();
      if (!normalized) continue;

      if (!seen.has(normalized)) {
        seen.add(normalized);
        uniqueLines.push(line);
      }
    }
  }

  return uniqueLines;
}

// ---------------------------------------------------------------------------
// VTT Parser
// ---------------------------------------------------------------------------

/**
 * Parse VTT content into text lines, stripping all metadata.
 * Uses same dedup strategy as SRT since VTT has the same rolling pattern.
 */
function processVtt(raw) {
  const lines = raw.split('\n');
  const textLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (isVttHeader(trimmed)) continue;
    if (isTimestampLine(trimmed)) continue;

    let cleaned = stripInlineTags(trimmed);
    cleaned = stripPositionMetadata(cleaned);
    cleaned = cleaned.trim();

    if (cleaned) {
      textLines.push(cleaned);
    }
  }

  // Deduplicate using the same seen-set approach
  const uniqueLines = [];
  const seen = new Set();

  for (const line of textLines) {
    const normalized = line.toLowerCase().trim();
    if (!normalized) continue;

    if (!seen.has(normalized)) {
      seen.add(normalized);
      uniqueLines.push(line);
    }
  }

  return uniqueLines;
}

// ---------------------------------------------------------------------------
// TXT Parser (fallback -- these have inline sequence numbers)
// ---------------------------------------------------------------------------

/**
 * Process .txt transcript files.
 * These have a pattern where subtitle sequence numbers appear inline:
 *   "1 hey guys Pastor Ivor Myers here and in 2 hey guys Pastor Ivor ..."
 *
 * Strategy: treat each line, strip leading/trailing numbers, split on
 * " <number> " boundaries to get text fragments, then deduplicate.
 */
function processTxt(raw) {
  const lines = raw.split('\n');
  const allFragments = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Split on inline sequence number boundaries
    // A sequence number is a standalone integer between text fragments
    const fragments = trimmed.split(/(?:^|\s)\d{1,5}(?:\s|$)/);

    for (const frag of fragments) {
      const cleaned = frag.trim();
      if (cleaned) {
        allFragments.push(cleaned);
      }
    }
  }

  // Deduplicate
  const uniqueLines = [];
  const seen = new Set();

  for (const frag of allFragments) {
    const normalized = frag.toLowerCase().trim();
    if (!normalized) continue;

    if (!seen.has(normalized)) {
      seen.add(normalized);
      uniqueLines.push(frag);
    }
  }

  return uniqueLines;
}

// ---------------------------------------------------------------------------
// Format dispatcher
// ---------------------------------------------------------------------------

/**
 * Extract deduplicated text lines from a transcript file.
 * Returns an array of unique text lines.
 */
function extractTextLines(raw, ext, filename) {
  const base = path.basename(filename);

  // cleaned_ files are .txt but with the same inline-number issue
  if (base.startsWith('cleaned_') || ext === '.txt') {
    return processTxt(raw);
  }

  if (ext === '.srt') {
    const cues = parseSrtCues(raw);
    return extractTextFromSrtCues(cues);
  }

  if (ext === '.vtt') {
    return processVtt(raw);
  }

  // Unknown format: return raw lines
  return raw.split('\n').map(l => l.trim()).filter(Boolean);
}

// ---------------------------------------------------------------------------
// Paragraph builder
// ---------------------------------------------------------------------------

/**
 * Join short subtitle-derived lines into readable paragraphs.
 * Inserts a paragraph break roughly every THRESHOLD characters,
 * preferring to break at sentence boundaries.
 */
function buildParagraphs(lines) {
  if (lines.length === 0) return '';

  // First, join all lines into one continuous text
  const continuous = lines.join(' ');

  // Split into sentences (rough heuristic: split on .!? followed by space and capital)
  // But for subtitle text, sentences often don't have perfect punctuation,
  // so we'll just accumulate words and break on sentence-ending punctuation.
  const THRESHOLD = 500;
  const paragraphs = [];
  let accumulator = '';

  // Split into rough sentence chunks by looking for sentence-end punctuation
  const words = continuous.split(/\s+/);
  for (const word of words) {
    if (!accumulator) {
      accumulator = word;
    } else {
      accumulator += ' ' + word;
    }

    // Check for paragraph break opportunity
    if (accumulator.length >= THRESHOLD && /[.!?]["')\]]*$/.test(word)) {
      paragraphs.push(accumulator.trim());
      accumulator = '';
    }
  }

  if (accumulator.trim()) {
    paragraphs.push(accumulator.trim());
  }

  return paragraphs.join('\n\n');
}

// ---------------------------------------------------------------------------
// Final cleanup
// ---------------------------------------------------------------------------

function finalCleanup(text) {
  let cleaned = text;

  // Collapse multiple spaces into one
  cleaned = cleaned.replace(/[ \t]+/g, ' ');

  // Collapse 3+ newlines into 2
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Trim each line
  cleaned = cleaned
    .split('\n')
    .map(l => l.trim())
    .join('\n');

  return cleaned.trim();
}

// ---------------------------------------------------------------------------
// File discovery & deduplication
// ---------------------------------------------------------------------------

function collectFiles(rootDir, subdir) {
  const dir = subdir ? path.join(rootDir, subdir) : rootDir;
  const results = [];

  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) continue;
    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext)) continue;

    results.push({
      fullPath: path.join(dir, entry.name),
      subdir: subdir || '',
      filename: entry.name,
      ext
    });
  }

  return results;
}

function deduplicateFiles(allFiles) {
  const groups = new Map();

  for (const file of allFiles) {
    const key = file.subdir + '::' + canonicalKey(file.filename);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(file);
  }

  const selected = [];
  for (const [, files] of groups) {
    files.sort((a, b) => filePriority(a.filename) - filePriority(b.filename));
    selected.push(files[0]);
  }

  return selected;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log('=== Transcript Normalizer ===\n');
  console.log(`Input:  ${INPUT_ROOT}`);
  console.log(`Output: ${OUTPUT_ROOT}\n`);

  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });

  // Collect files from top-level + known subdirs + any other subdirs
  let allFiles = collectFiles(INPUT_ROOT, '');

  for (const sub of SUBDIRS) {
    allFiles = allFiles.concat(collectFiles(INPUT_ROOT, sub));
  }

  try {
    const entries = fs.readdirSync(INPUT_ROOT, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !SUBDIRS.includes(entry.name)) {
        allFiles = allFiles.concat(collectFiles(INPUT_ROOT, entry.name));
      }
    }
  } catch (_) {
    // ignore
  }

  console.log(`Total source files found: ${allFiles.length}`);

  const selected = deduplicateFiles(allFiles);
  console.log(`Unique transcripts after deduplication: ${selected.length}\n`);

  let totalFilesProcessed = 0;
  let totalWordCount = 0;
  const errors = [];

  for (const file of selected) {
    try {
      const raw = fs.readFileSync(file.fullPath, 'utf-8');

      // Extract deduplicated text lines
      const textLines = extractTextLines(raw, file.ext, file.filename);

      // Build paragraphs
      const paragraphed = buildParagraphs(textLines);

      // Final cleanup
      const finalText = finalCleanup(paragraphed);

      // Determine output path
      const outputName = cleanOutputName(file.filename);
      let outputDir = OUTPUT_ROOT;

      if (file.subdir) {
        outputDir = path.join(OUTPUT_ROOT, file.subdir);
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputPath = path.join(outputDir, outputName);
      fs.writeFileSync(outputPath, finalText, 'utf-8');

      const words = finalText.split(/\s+/).filter(w => w.length > 0).length;
      totalWordCount += words;
      totalFilesProcessed++;

      const relPath = file.subdir ? path.join(file.subdir, outputName) : outputName;
      console.log(`  [OK] ${relPath} (${words.toLocaleString()} words)`);
    } catch (err) {
      errors.push({ file: file.fullPath, error: err.message });
      console.error(`  [ERR] ${file.filename}: ${err.message}`);
    }
  }

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Total source files scanned:    ${allFiles.length}`);
  console.log(`Total unique transcripts:      ${selected.length}`);
  console.log(`Total files written:           ${totalFilesProcessed}`);
  console.log(`Total word count (all files):  ${totalWordCount.toLocaleString()}`);

  if (errors.length > 0) {
    console.log(`\nErrors: ${errors.length}`);
    for (const e of errors) {
      console.log(`  - ${e.file}: ${e.error}`);
    }
  }

  console.log('\nDone.');
}

main();
