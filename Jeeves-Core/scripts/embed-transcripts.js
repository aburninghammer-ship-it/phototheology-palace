#!/usr/bin/env node

/**
 * embed-transcripts.js
 *
 * Reads all normalized transcripts, chunks them into ~500-word overlapping
 * segments, generates OpenAI embeddings, and inserts them into the Supabase
 * transcript_chunks table.
 *
 * Usage:
 *   node Jeeves-Core/scripts/embed-transcripts.js
 *   node Jeeves-Core/scripts/embed-transcripts.js --dry-run
 *
 * Environment variables:
 *   OPENAI_API_KEY            - Required (unless --dry-run)
 *   SUPABASE_URL              - Defaults to https://tdjtumtdkjicnhlpqqzd.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY - Required (unless --dry-run)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// Resolve __dirname for ESM
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tdjtumtdkjicnhlpqqzd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DRY_RUN = process.argv.includes('--dry-run');

const CHUNK_SIZE = 500;          // target words per chunk
const CHUNK_OVERLAP = 50;        // overlap words between consecutive chunks
const EMBEDDING_BATCH_SIZE = 100; // max texts per OpenAI embedding call
const INSERT_BATCH_SIZE = 50;     // max rows per Supabase insert

const NORMALIZED_DIR = path.resolve(
  __dirname,
  '..',
  '03_Transcript-Corpus',
  'Normalized'
);

const MASTER_INDEX_PATH = path.resolve(
  __dirname,
  '..',
  'PT_MASTER_INDEX.csv'
);

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
if (!DRY_RUN) {
  if (!OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY is not set. Use --dry-run to skip API calls.');
    process.exit(1);
  }
  if (!SUPABASE_SERVICE_KEY) {
    console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is not set. Use --dry-run to skip API calls.');
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// CSV Parsing (handles quoted fields with commas)
// ---------------------------------------------------------------------------

/**
 * Parse a single CSV line respecting quoted fields.
 * Returns an array of field values with quotes stripped.
 */
function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // escaped quote inside quoted field
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

// ---------------------------------------------------------------------------
// Build filename -> category map from PT_MASTER_INDEX.csv
// ---------------------------------------------------------------------------

/**
 * Derives a "normalized filename" from a CSV cleaned filename so it can be
 * matched against the actual files in the Normalized/ directory.
 *
 * CSV filenames look like: cleaned_Some Title.en.txt
 * Normalized filenames:    Some Title.txt
 */
function csvNameToNormalized(csvName) {
  let name = csvName;
  // Strip leading "cleaned_" prefix
  if (name.startsWith('cleaned_')) {
    name = name.slice('cleaned_'.length);
  }
  // Strip date-prefix pattern like "20240216 - " that appears in some CSV names
  // but not in Normalized names. Only strip if the Normalized dir does NOT have
  // a file with the date prefix -- we handle this by trying both variants later.

  // Strip ".en" before .txt
  name = name.replace(/\.en\.txt$/i, '.txt');

  return name;
}

/**
 * Reads PT_MASTER_INDEX.csv and returns a Map where:
 *   key   = normalized filename (matching files in Normalized/)
 *   value = { primary: string, all: string[] }
 */
function buildCategoryMap() {
  const categoryMap = new Map();

  if (!fs.existsSync(MASTER_INDEX_PATH)) {
    console.warn(`WARN: Master index not found at ${MASTER_INDEX_PATH}. Category metadata will be empty.`);
    return categoryMap;
  }

  const raw = fs.readFileSync(MASTER_INDEX_PATH, 'utf-8');
  const lines = raw.split('\n').filter(l => l.trim());

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    if (fields.length < 2) continue;

    const csvFilename = fields[0].trim();
    const category = fields[1].trim();
    if (!csvFilename || !category) continue;

    const normName = csvNameToNormalized(csvFilename);

    if (!categoryMap.has(normName)) {
      categoryMap.set(normName, { primary: category, all: [category] });
    } else {
      const entry = categoryMap.get(normName);
      if (!entry.all.includes(category)) {
        entry.all.push(category);
      }
    }
  }

  return categoryMap;
}

// ---------------------------------------------------------------------------
// Discover all .txt files recursively under Normalized/
// ---------------------------------------------------------------------------

function collectFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.txt')) {
      results.push(fullPath);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Text Chunking
// ---------------------------------------------------------------------------

/**
 * Splits text into ~CHUNK_SIZE-word chunks with CHUNK_OVERLAP-word overlap.
 * Tries to break on sentence boundaries (. ! ?) near the target word count.
 *
 * Returns an array of { text, wordCount, chunkIndex }.
 */
function chunkText(text) {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return [];

  const chunks = [];
  let startIdx = 0;

  while (startIdx < words.length) {
    // Determine the ideal end index for this chunk
    let endIdx = Math.min(startIdx + CHUNK_SIZE, words.length);

    if (endIdx < words.length) {
      // Try to find a sentence boundary near the target end.
      // Search in a window: [target - 50, target + 50]
      const searchStart = Math.max(startIdx, endIdx - 50);
      const searchEnd = Math.min(words.length, endIdx + 50);

      let bestBoundary = -1;
      let bestDistance = Infinity;

      for (let i = searchStart; i < searchEnd; i++) {
        const word = words[i];
        // Check if this word ends with a sentence-ending punctuation
        if (/[.!?]["'\u201D\u2019)}\]]*$/.test(word)) {
          const boundary = i + 1; // chunk ends after this word
          const distance = Math.abs(boundary - endIdx);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestBoundary = boundary;
          }
        }
      }

      if (bestBoundary > startIdx && bestBoundary > startIdx + 100) {
        // Use the sentence boundary if it produces a reasonable chunk
        endIdx = bestBoundary;
      }
    }

    const chunkWords = words.slice(startIdx, endIdx);
    const chunkText = chunkWords.join(' ');

    chunks.push({
      text: chunkText,
      wordCount: chunkWords.length,
      chunkIndex: chunks.length,
    });

    // Move start forward by (chunk length - overlap)
    const advance = Math.max(chunkWords.length - CHUNK_OVERLAP, 1);
    startIdx += advance;

    // If the remaining words are fewer than the overlap, just stop
    if (words.length - startIdx < CHUNK_OVERLAP && startIdx < words.length) {
      // Grab the remainder if it has meaningful content
      const remainder = words.slice(startIdx);
      if (remainder.length > 20) {
        chunks.push({
          text: remainder.join(' '),
          wordCount: remainder.length,
          chunkIndex: chunks.length,
        });
      }
      break;
    }
  }

  return chunks;
}

// ---------------------------------------------------------------------------
// OpenAI Embeddings
// ---------------------------------------------------------------------------

/**
 * Calls OpenAI text-embedding-3-small for a batch of texts.
 * Returns an array of 1536-dimensional embedding vectors in the same order.
 */
async function getEmbeddings(texts) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: texts,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();

  // Sort by index to guarantee order matches input
  const sorted = data.data.sort((a, b) => a.index - b.index);
  return sorted.map(item => item.embedding);
}

// ---------------------------------------------------------------------------
// Supabase Inserts
// ---------------------------------------------------------------------------

/**
 * Inserts rows into the transcript_chunks table via Supabase REST API.
 * Each row: { source_file, chunk_index, chunk_text, word_count,
 *             category, categories, embedding }
 */
async function insertChunks(rows) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/transcript_chunks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Supabase insert error ${response.status}: ${errBody}`);
  }
}

// ---------------------------------------------------------------------------
// Batch helper
// ---------------------------------------------------------------------------

/**
 * Splits an array into sub-arrays of at most `size` elements.
 */
function batchArray(arr, size) {
  const batches = [];
  for (let i = 0; i < arr.length; i += size) {
    batches.push(arr.slice(i, i + size));
  }
  return batches;
}

// ---------------------------------------------------------------------------
// Category Lookup
// ---------------------------------------------------------------------------

/**
 * Tries to find category metadata for a given file path.
 * The Normalized filenames may differ from the CSV names in several ways,
 * so we try multiple matching strategies.
 */
function lookupCategory(filePath, categoryMap) {
  const baseName = path.basename(filePath); // e.g., "Some Title.txt"

  // Direct match
  if (categoryMap.has(baseName)) {
    return categoryMap.get(baseName);
  }

  // Try stripping a leading date prefix from the basename
  // e.g., "20240216 - Justification By Faith.txt" -> "Justification By Faith.txt"
  const dateStripped = baseName.replace(/^\d{8}\s*-\s*/, '');
  if (dateStripped !== baseName && categoryMap.has(dateStripped)) {
    return categoryMap.get(dateStripped);
  }

  // Fuzzy: try matching just the core title (strip date prefixes from both)
  // Also check CSV entries that have date prefixes
  for (const [csvName, entry] of categoryMap) {
    const csvCore = csvName.replace(/^\d{8}\s*-\s*/, '');
    if (csvCore === baseName || csvCore === dateStripped) {
      return entry;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Sleep helper for rate limiting
// ---------------------------------------------------------------------------

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('='.repeat(70));
  console.log('  Transcript Embedding Pipeline');
  console.log('='.repeat(70));
  console.log(`  Mode:         ${DRY_RUN ? 'DRY RUN (no API calls)' : 'LIVE'}`);
  console.log(`  Source:        ${NORMALIZED_DIR}`);
  console.log(`  Chunk size:    ~${CHUNK_SIZE} words, ${CHUNK_OVERLAP}-word overlap`);
  console.log(`  Embedding:     text-embedding-3-small (1536 dims)`);
  console.log(`  Supabase:      ${SUPABASE_URL}`);
  console.log('='.repeat(70));
  console.log();

  // 1. Build category map
  console.log('Loading PT_MASTER_INDEX.csv ...');
  const categoryMap = buildCategoryMap();
  console.log(`  -> ${categoryMap.size} unique filenames with category data`);
  console.log();

  // 2. Collect transcript files
  console.log('Scanning Normalized/ directory ...');
  if (!fs.existsSync(NORMALIZED_DIR)) {
    console.error(`ERROR: Normalized directory not found: ${NORMALIZED_DIR}`);
    process.exit(1);
  }
  const allFiles = collectFiles(NORMALIZED_DIR).sort();
  console.log(`  -> ${allFiles.length} transcript files found`);
  console.log();

  // 3. Process each file
  let totalChunks = 0;
  let totalWords = 0;
  let totalFilesProcessed = 0;
  let totalFilesSkipped = 0;
  const errors = [];

  // Collect all chunks across all files first, then batch embed + insert
  const allChunkRecords = [];

  for (let fileIdx = 0; fileIdx < allFiles.length; fileIdx++) {
    const filePath = allFiles[fileIdx];
    const baseName = path.basename(filePath);
    const relativePath = path.relative(NORMALIZED_DIR, filePath);

    try {
      const text = fs.readFileSync(filePath, 'utf-8').trim();
      if (!text) {
        console.log(`[${fileIdx + 1}/${allFiles.length}] Skipping (empty): ${relativePath}`);
        totalFilesSkipped++;
        continue;
      }

      const chunks = chunkText(text);
      if (chunks.length === 0) {
        console.log(`[${fileIdx + 1}/${allFiles.length}] Skipping (no chunks): ${relativePath}`);
        totalFilesSkipped++;
        continue;
      }

      // Lookup category
      const catInfo = lookupCategory(filePath, categoryMap);
      const primaryCategory = catInfo ? catInfo.primary : null;
      const allCategories = catInfo ? catInfo.all : [];

      const fileWordCount = chunks.reduce((sum, c) => sum + c.wordCount, 0);

      console.log(
        `[${fileIdx + 1}/${allFiles.length}] Processing: ${relativePath} (${chunks.length} chunks, ${fileWordCount} words${primaryCategory ? ', cat: ' + primaryCategory : ''})`
      );

      for (const chunk of chunks) {
        allChunkRecords.push({
          source_file: relativePath,
          chunk_index: chunk.chunkIndex,
          chunk_text: chunk.text,
          word_count: chunk.wordCount,
          category: primaryCategory,
          categories: allCategories,
        });
      }

      totalChunks += chunks.length;
      totalWords += fileWordCount;
      totalFilesProcessed++;
    } catch (err) {
      console.error(`[${fileIdx + 1}/${allFiles.length}] ERROR processing ${relativePath}: ${err.message}`);
      errors.push({ file: relativePath, error: err.message });
      totalFilesSkipped++;
    }
  }

  console.log();
  console.log('-'.repeat(70));
  console.log(`Chunking complete: ${allChunkRecords.length} chunks from ${totalFilesProcessed} files`);
  console.log('-'.repeat(70));
  console.log();

  // 4. Generate embeddings and insert in batches
  if (DRY_RUN) {
    console.log('DRY RUN: Skipping embedding generation and Supabase inserts.');
    console.log();
    console.log('Sample chunks (first 3):');
    for (let i = 0; i < Math.min(3, allChunkRecords.length); i++) {
      const rec = allChunkRecords[i];
      console.log(`  [${i}] source=${rec.source_file}, idx=${rec.chunk_index}, words=${rec.word_count}, cat=${rec.category}`);
      console.log(`       text: "${rec.chunk_text.slice(0, 120)}..."`);
    }
  } else {
    // Process in batches of EMBEDDING_BATCH_SIZE
    const embeddingBatches = batchArray(allChunkRecords, EMBEDDING_BATCH_SIZE);
    let chunksEmbedded = 0;
    let chunksInserted = 0;

    for (let batchIdx = 0; batchIdx < embeddingBatches.length; batchIdx++) {
      const batch = embeddingBatches[batchIdx];
      const texts = batch.map(r => r.chunk_text);

      console.log(
        `Embedding batch ${batchIdx + 1}/${embeddingBatches.length} (${texts.length} chunks) ...`
      );

      let embeddings;
      try {
        embeddings = await getEmbeddings(texts);
        chunksEmbedded += texts.length;
      } catch (err) {
        console.error(`  ERROR getting embeddings for batch ${batchIdx + 1}: ${err.message}`);
        errors.push({ file: `batch-${batchIdx + 1}`, error: `Embedding: ${err.message}` });
        // Skip this batch
        continue;
      }

      // Build rows for Supabase insert
      const rows = batch.map((rec, i) => ({
        source_file: rec.source_file,
        chunk_index: rec.chunk_index,
        chunk_text: rec.chunk_text,
        word_count: rec.word_count,
        category: rec.category,
        categories: rec.categories,
        embedding: embeddings[i],
      }));

      // Insert in sub-batches of INSERT_BATCH_SIZE
      const insertBatches = batchArray(rows, INSERT_BATCH_SIZE);
      for (let insertIdx = 0; insertIdx < insertBatches.length; insertIdx++) {
        const insertBatch = insertBatches[insertIdx];
        try {
          await insertChunks(insertBatch);
          chunksInserted += insertBatch.length;
          process.stdout.write(
            `  Inserted ${chunksInserted}/${allChunkRecords.length} chunks\r`
          );
        } catch (err) {
          console.error(
            `\n  ERROR inserting batch ${insertIdx + 1} of embedding batch ${batchIdx + 1}: ${err.message}`
          );
          errors.push({
            file: `insert-batch-${batchIdx + 1}-${insertIdx + 1}`,
            error: `Insert: ${err.message}`,
          });
        }
      }

      // Small delay between embedding batches to respect rate limits
      if (batchIdx < embeddingBatches.length - 1) {
        await sleep(200);
      }
    }

    console.log(); // clear the \r line
    console.log(`Embeddings generated: ${chunksEmbedded}`);
    console.log(`Rows inserted:        ${chunksInserted}`);
  }

  // 5. Summary
  console.log();
  console.log('='.repeat(70));
  console.log('  SUMMARY');
  console.log('='.repeat(70));
  console.log(`  Total files found:      ${allFiles.length}`);
  console.log(`  Files processed:        ${totalFilesProcessed}`);
  console.log(`  Files skipped/errored:  ${totalFilesSkipped}`);
  console.log(`  Total chunks:           ${totalChunks}`);
  console.log(`  Total words embedded:   ${totalWords.toLocaleString()}`);
  console.log(`  Mode:                   ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);

  if (errors.length > 0) {
    console.log();
    console.log(`  Errors (${errors.length}):`);
    for (const e of errors) {
      console.log(`    - ${e.file}: ${e.error}`);
    }
  }

  console.log('='.repeat(70));
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
