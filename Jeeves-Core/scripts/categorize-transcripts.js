#!/usr/bin/env node
/**
 * categorize-transcripts.js
 *
 * Categorizes normalized YouTube transcripts into doctrinal/topical folders
 * for the Phototheology corpus. Copies (not moves) each transcript into one
 * or more matching category folders and generates a master CSV index.
 *
 * Usage:
 *   node categorize-transcripts.js
 *
 * Input sources (checked in order):
 *   1. Normalized/ subfolder under YouTube-Transcripts (if it exists)
 *   2. cleaned_* prefixed .txt files in YouTube-Transcripts root + subdirs
 *   3. All .txt files in YouTube-Transcripts root + subdirs (fallback)
 *
 * Existing pre-categorized subdirectories are mapped:
 *   Daniel/       -> Prophecy-Daniel-Revelation
 *   Revelation/   -> Prophecy-Daniel-Revelation
 *   Health/       -> Health-Wellness
 *   Phototheology/ -> Phototheology-Principles
 *   Sermons/      -> Sermons-General
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Paths ───────────────────────────────────────────────────────────────────

const JEEVES_CORE = path.resolve(__dirname, '..');
const TRANSCRIPTS_ROOT = path.join(
  JEEVES_CORE,
  '03_Transcript-Corpus',
  'YouTube-Transcripts'
);
const NORMALIZED_DIR = path.join(TRANSCRIPTS_ROOT, 'Normalized');
const PT_CORPUS = path.join(
  JEEVES_CORE,
  '03_Transcript-Corpus',
  'PT-Corpus'
);
const CSV_OUTPUT = path.join(JEEVES_CORE, 'PT_MASTER_INDEX.csv');

// ─── Category definitions ────────────────────────────────────────────────────

const CATEGORIES = [
  'Prophecy-Daniel-Revelation',
  'Sanctuary-Judgment-1844',
  'Phototheology-Principles',
  'Apologetics-Defense',
  'Bible-Study-Methods',
  'Mental-Health-Soul-Care',
  'Sermons-General',
  'Marriage-Family',
  'Health-Wellness',
  'Current-Events-Commentary',
  'Three-Angels-Messages',
  'Sabbath-Law',
  'Creation-Origins',
  'Christian-Living',
];

const DEFAULT_CATEGORY = 'Sermons-General';

// ─── Keyword rules (order matters: first match wins for multi-keyword lines,
//     but a transcript can match MULTIPLE categories) ─────────────────────────

const KEYWORD_RULES = [
  {
    category: 'Prophecy-Daniel-Revelation',
    keywords: [
      'daniel',
      'revelation',
      'prophecy',
      'beast',
      'horn',
      'seal',
      'trumpet',
      'dragon',
      'mark of the beast',
      '666',
      'end time',
      'second coming',
      'rapture',
      'tribulation',
    ],
  },
  {
    category: 'Sanctuary-Judgment-1844',
    keywords: [
      'sanctuary',
      '1844',
      'judgment',
      'investigative',
      'atonement',
      'holy place',
      'most holy',
      'cleansing',
      'high priest',
      'heavenly sanctuary',
    ],
  },
  {
    category: 'Phototheology-Principles',
    keywords: [
      'phototheology',
      'palace',
      'pt',
      'rooms',
      'floors',
      'dimensions',
      'study suite',
      'connect 6',
      'freestyle',
    ],
  },
  {
    category: 'Apologetics-Defense',
    keywords: [
      'apologetics',
      'atheist',
      'skeptic',
      'proof',
      'evidence',
      'defend',
      'critic',
      'debate',
      'perry',
      'fact check',
    ],
  },
  {
    category: 'Bible-Study-Methods',
    keywords: [
      'how to study',
      'bible study method',
      'hermeneutic',
      'exegesis',
      'interpretation',
    ],
  },
  {
    category: 'Mental-Health-Soul-Care',
    keywords: [
      'mental health',
      'depression',
      'anxiety',
      'counselor',
      'soul care',
      'enemy in your head',
      'mind',
      'safe place',
    ],
  },
  {
    category: 'Marriage-Family',
    keywords: [
      'marriage',
      'relationship',
      'communication',
      'spouse',
      'family',
    ],
  },
  {
    category: 'Health-Wellness',
    keywords: [
      'health',
      'naturopath',
      'cold',
      'flu',
      'therapy',
      'cell signaling',
      'water therapy',
    ],
  },
  {
    category: 'Current-Events-Commentary',
    keywords: [
      'nationalism',
      'politics',
      'america',
      'social',
      'race',
      'racism',
      'kirk',
      'election',
      'culture',
    ],
  },
  {
    category: 'Three-Angels-Messages',
    keywords: [
      'three angels',
      'everlasting gospel',
      'babylon',
      'loud cry',
    ],
  },
  {
    category: 'Sabbath-Law',
    keywords: [
      'sabbath',
      'law',
      'commandment',
      'ten commandments',
      'sunday',
    ],
  },
  {
    category: 'Creation-Origins',
    keywords: [
      'creation',
      'evolution',
      'genesis 1',
      'origins',
    ],
  },
  {
    category: 'Christian-Living',
    keywords: [],   // placeholder -- assigned via leftover logic if no other match
  },
];

// Map existing subdirectories to forced categories
const SUBDIR_CATEGORY_MAP = {
  'Daniel': 'Prophecy-Daniel-Revelation',
  'Revelation': 'Prophecy-Daniel-Revelation',
  'Health': 'Health-Wellness',
  'Phototheology': 'Phototheology-Principles',
  'Sermons': 'Sermons-General',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Ensure a directory exists, creating it recursively if needed.
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Read file content with graceful encoding fallback.
 */
function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (_err) {
    try {
      // Attempt latin1 for files with unusual encoding
      return fs.readFileSync(filePath, 'latin1');
    } catch (_err2) {
      console.warn(`  [WARN] Could not read: ${filePath}`);
      return '';
    }
  }
}

/**
 * Extract the first N words from a text string.
 */
function firstNWords(text, n) {
  return text
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, n)
    .join(' ');
}

/**
 * Count words in text.
 */
function wordCount(text) {
  const trimmed = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!trimmed) return 0;
  return trimmed.split(' ').length;
}

/**
 * Escape a value for CSV (RFC 4180).
 */
function csvEscape(value) {
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Escape special regex characters.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Classify a transcript by analyzing both its filename and content body.
 * Returns an array of matching category names. If none match, returns
 * the default category.
 *
 * @param {string} filename   - The base filename (without directory)
 * @param {string} content    - The full file content
 * @param {string|null} forcedCategory - Category forced by subdirectory
 * @returns {string[]}
 */
function classify(filename, content, forcedCategory) {
  const first500 = firstNWords(content, 500);
  const haystack = (filename + ' ' + first500).toLowerCase();

  const matched = [];

  // Always include the forced category from subdirectory mapping
  if (forcedCategory) {
    matched.push(forcedCategory);
  }

  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.length === 0) continue; // skip Christian-Living placeholder
    if (matched.includes(rule.category)) continue; // already forced

    for (const kw of rule.keywords) {
      // Use word-boundary-aware matching for short keywords to avoid false positives
      // For multi-word phrases, simple includes is fine and more reliable
      let found = false;
      if (kw.length <= 3) {
        // Short keyword: require word boundary (space, punctuation, start/end)
        const re = new RegExp('\\b' + escapeRegex(kw) + '\\b', 'i');
        found = re.test(haystack);
      } else {
        found = haystack.includes(kw);
      }

      if (found) {
        matched.push(rule.category);
        break; // one keyword is enough to assign this category
      }
    }
  }

  if (matched.length === 0) {
    matched.push(DEFAULT_CATEGORY);
  }

  return matched;
}

// ─── Collect transcript files ────────────────────────────────────────────────

/**
 * Walk a directory (non-recursive) and return .txt files.
 */
function collectTxtFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.txt') && !f.startsWith('.'))
    .map((f) => path.join(dir, f));
}

/**
 * Gather all transcript files to process.
 * Returns an array of { filePath, sourceSubdir } objects.
 */
function gatherTranscripts() {
  const files = [];

  // Strategy 1: Normalized/ folder exists
  if (fs.existsSync(NORMALIZED_DIR)) {
    console.log('[INFO] Found Normalized/ folder. Reading from there.');
    for (const f of collectTxtFiles(NORMALIZED_DIR)) {
      files.push({ filePath: f, sourceSubdir: null });
    }
    // Also check Normalized sub-folders for pre-categorized content
    for (const subdir of Object.keys(SUBDIR_CATEGORY_MAP)) {
      const subPath = path.join(NORMALIZED_DIR, subdir);
      for (const f of collectTxtFiles(subPath)) {
        files.push({ filePath: f, sourceSubdir: subdir });
      }
    }
    if (files.length > 0) return files;
  }

  // Strategy 2: cleaned_ prefixed files in YouTube-Transcripts root + subdirs
  console.log('[INFO] Looking for cleaned_ prefixed .txt files (normalized transcripts)...');
  const rootCleaned = collectTxtFiles(TRANSCRIPTS_ROOT).filter((f) =>
    path.basename(f).startsWith('cleaned_')
  );
  if (rootCleaned.length > 0) {
    for (const f of rootCleaned) {
      files.push({ filePath: f, sourceSubdir: null });
    }
  }
  // Check pre-categorized subdirectories for cleaned_ files too
  for (const subdir of Object.keys(SUBDIR_CATEGORY_MAP)) {
    const subPath = path.join(TRANSCRIPTS_ROOT, subdir);
    const subCleaned = collectTxtFiles(subPath).filter((f) =>
      path.basename(f).startsWith('cleaned_')
    );
    for (const f of subCleaned) {
      files.push({ filePath: f, sourceSubdir: subdir });
    }
  }
  if (files.length > 0) {
    console.log(`[INFO] Found ${files.length} cleaned (normalized) transcript files.`);
    return files;
  }

  // Strategy 3: Fallback -- all .txt files
  console.log('[INFO] No normalized files found. Falling back to ALL .txt files.');
  for (const f of collectTxtFiles(TRANSCRIPTS_ROOT)) {
    files.push({ filePath: f, sourceSubdir: null });
  }
  for (const subdir of Object.keys(SUBDIR_CATEGORY_MAP)) {
    const subPath = path.join(TRANSCRIPTS_ROOT, subdir);
    for (const f of collectTxtFiles(subPath)) {
      files.push({ filePath: f, sourceSubdir: subdir });
    }
  }

  return files;
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log('==========================================================');
  console.log('  Phototheology Transcript Categorizer');
  console.log('==========================================================\n');

  // 1. Create category folders under PT-Corpus
  console.log('[STEP 1] Creating category folders under PT-Corpus/...');
  ensureDir(PT_CORPUS);
  for (const cat of CATEGORIES) {
    ensureDir(path.join(PT_CORPUS, cat));
  }
  console.log(`  Created ${CATEGORIES.length} category folders.\n`);

  // 2. Gather transcripts
  console.log('[STEP 2] Gathering transcript files...');
  const transcripts = gatherTranscripts();
  if (transcripts.length === 0) {
    console.error('[ERROR] No transcript files found. Exiting.');
    process.exit(1);
  }
  console.log(`  Found ${transcripts.length} transcript files to categorize.\n`);

  // 3. Classify and copy
  console.log('[STEP 3] Classifying and copying transcripts...\n');

  const categoryCounts = {};
  for (const cat of CATEGORIES) {
    categoryCounts[cat] = 0;
  }

  const csvRows = []; // each row: { filename, category, wordCount, first50 }
  let copiedTotal = 0;
  let errorCount = 0;

  for (let i = 0; i < transcripts.length; i++) {
    const { filePath, sourceSubdir } = transcripts[i];
    const basename = path.basename(filePath);

    // Read content
    const content = readFileSafe(filePath);
    if (!content && content !== '') {
      errorCount++;
      continue;
    }

    // Determine forced category from subdirectory
    const forcedCategory = sourceSubdir
      ? SUBDIR_CATEGORY_MAP[sourceSubdir] || null
      : null;

    // Classify
    const categories = classify(basename, content, forcedCategory);

    // Compute stats
    const wc = wordCount(content);
    const first50 = firstNWords(content, 50);

    // Copy into each matching category folder
    for (const cat of categories) {
      const destPath = path.join(PT_CORPUS, cat, basename);
      try {
        fs.copyFileSync(filePath, destPath);
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        copiedTotal++;
      } catch (err) {
        console.warn(`  [WARN] Failed to copy ${basename} -> ${cat}: ${err.message}`);
        errorCount++;
      }

      // Add CSV row for each category assignment
      csvRows.push({
        filename: basename,
        category: cat,
        wordCount: wc,
        first50: first50,
      });
    }

    // Progress indicator every 50 files
    if ((i + 1) % 50 === 0 || i + 1 === transcripts.length) {
      process.stdout.write(`  Processed ${i + 1} / ${transcripts.length} files\r`);
    }
  }

  console.log('\n');

  // 4. Write CSV index
  console.log('[STEP 4] Writing master index CSV...');
  const csvHeader = 'Filename,Category,Word_Count,First_50_Words';
  const csvLines = csvRows.map((row) =>
    [
      csvEscape(row.filename),
      csvEscape(row.category),
      row.wordCount,
      csvEscape(row.first50),
    ].join(',')
  );

  try {
    fs.writeFileSync(CSV_OUTPUT, csvHeader + '\n' + csvLines.join('\n') + '\n', 'utf-8');
    console.log(`  Written to: ${CSV_OUTPUT}`);
    console.log(`  Total rows: ${csvLines.length}\n`);
  } catch (err) {
    console.error(`  [ERROR] Could not write CSV: ${err.message}`);
  }

  // 5. Print summary
  console.log('==========================================================');
  console.log('  CATEGORIZATION SUMMARY');
  console.log('==========================================================');
  console.log(`  Total transcript files scanned : ${transcripts.length}`);
  console.log(`  Total copies made              : ${copiedTotal}`);
  console.log(`  Errors / warnings              : ${errorCount}`);
  console.log('');
  console.log('  Category Breakdown:');
  console.log('  ----------------------------------------------------------');

  // Sort by count descending
  const sorted = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of sorted) {
    const bar = '#'.repeat(Math.min(count, 60));
    console.log(`  ${cat.padEnd(32)} ${String(count).padStart(4)}  ${bar}`);
  }

  console.log('  ----------------------------------------------------------');
  console.log('\n  Done! PT-Corpus folders are ready for Jeeves ingestion.');
  console.log(`  CSV index: ${CSV_OUTPUT}\n`);
}

main();
