/**
 * Shared RAG Utility — Pastor Ivor Myers Corpus Integration
 *
 * Provides corpus context retrieval for all Jeeves modes and standalone edge functions.
 * Authority Hierarchy: Scripture (Tier 1) > Core Method (Tier 2) > Corpus (Tier 3) > Supporting Sources (Tier 4)
 *
 * Non-blocking: returns empty result on any failure, never throws.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// ─── Corpus Categories ─────────────────────────────────────────────
export const CORPUS_CATEGORIES = {
  PROPHECY: "Prophecy-Daniel-Revelation",
  SANCTUARY: "Sanctuary-Judgment-1844",
  APOLOGETICS: "Apologetics-Defense",
  GOSPEL: "Gospel-Salvation-Righteousness",
  GREAT_CONTROVERSY: "Great-Controversy-Cosmic-Conflict",
  HEALTH: "Health-Temperance-Lifestyle",
  SECOND_COMING: "Second-Coming-End-Times",
  CHRISTIAN_LIVING: "Christian-Living-Discipleship",
  EVANGELISM: "Evangelism-Mission-Outreach",
  CHURCH_HISTORY: "Church-History-Remnant",
  FAMILY: "Family-Relationships-Youth",
  WORSHIP: "Worship-Prayer-Devotion",
  EDUCATION: "Education-Hermeneutics",
  CULTURE: "Culture-Media-Society",
} as const;

// ─── Mode → Category Mapping ───────────────────────────────────────
export function getCategoryForMode(mode: string): string | null {
  switch (mode) {
    case "prophetic":
    case "prophecy-watch":
    case "chain-prophecy":
      return CORPUS_CATEGORIES.PROPHECY;
    case "sanctuary":
    case "chain-sanctuary":
      return CORPUS_CATEGORIES.SANCTUARY;
    case "chain-witness":
    case "apologetics":
    case "defense":
      return CORPUS_CATEGORIES.APOLOGETICS;
    case "culture":
    case "culture-lens":
      return CORPUS_CATEGORIES.CULTURE;
    case "health":
    case "health-temple":
      return CORPUS_CATEGORIES.HEALTH;
    case "gospel":
    case "chain-gospel":
      return CORPUS_CATEGORIES.GOSPEL;
    case "great-controversy":
    case "chain-controversy":
      return CORPUS_CATEGORIES.GREAT_CONTROVERSY;
    case "sermon-builder":
    case "evangelism":
      return CORPUS_CATEGORIES.EVANGELISM;
    case "devotional":
    case "worship":
    case "prayer":
      return CORPUS_CATEGORIES.WORSHIP;
    default:
      return null; // No category filter — search entire corpus
  }
}

// ─── Result Type ────────────────────────────────────────────────────
export interface CorpusResult {
  corpusContext: string;
  chunkCount: number;
  chunks: Array<{ content: string; source_file: string; category: string; similarity: number }>;
}

const EMPTY_RESULT: CorpusResult = { corpusContext: "", chunkCount: 0, chunks: [] };

// ─── Options ────────────────────────────────────────────────────────
export interface CorpusOptions {
  query: string;
  matchCount?: number;
  threshold?: number;
  category?: string | null;
  mode?: string;
  supabaseClient?: any;
}

// ─── Main Function ──────────────────────────────────────────────────
export async function getCorpusContext(options: CorpusOptions): Promise<CorpusResult> {
  try {
    const {
      query,
      matchCount = 3,
      threshold = 0.65,
      category,
      mode,
      supabaseClient,
    } = options;

    if (!query || query.trim().length < 3) return EMPTY_RESULT;

    // Resolve category: explicit > mode-derived > null
    const filterCategory = category !== undefined ? category : (mode ? getCategoryForMode(mode) : null);

    // Get OpenAI key for embedding
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) return EMPTY_RESULT;

    // Generate embedding
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query.slice(0, 8000),
      }),
    });

    if (!embeddingResponse.ok) return EMPTY_RESULT;

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data?.[0]?.embedding;
    if (!queryEmbedding) return EMPTY_RESULT;

    // Get or create Supabase client
    const supabase = supabaseClient || createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Search corpus
    const { data: corpusChunks, error } = await supabase.rpc(
      'search_transcript_chunks',
      {
        query_embedding: queryEmbedding,
        match_count: matchCount,
        match_threshold: threshold,
        filter_category: filterCategory,
      }
    );

    if (error || !corpusChunks || corpusChunks.length === 0) return EMPTY_RESULT;

    // Format context
    const formattedChunks = corpusChunks
      .map((chunk: any) => `[Source: ${chunk.source_file} | Category: ${chunk.category}]\n${chunk.content}`)
      .join('\n\n---\n\n');

    const corpusContext = `\n\n## PASTOR IVOR MYERS TEACHING CONTEXT (Tier 3 — Voice & Applied Theology)
The following excerpts are from Pastor Ivor Myers' sermons and teachings. Use them to:
- Maintain voice consistency with his teaching style
- Apply his interpretive patterns and Phototheology connections
- Reference his insights where relevant
- But ALWAYS verify against Scripture (Tier 1) first

${formattedChunks}

Remember: These transcripts inform your VOICE and APPLICATION style. Scripture remains the primary authority.`;

    console.log(`RAG: Injected ${corpusChunks.length} corpus chunks${mode ? ` for mode: ${mode}` : ''}`);

    return {
      corpusContext,
      chunkCount: corpusChunks.length,
      chunks: corpusChunks,
    };
  } catch (err) {
    // Non-blocking: if RAG fails, caller continues without corpus context
    console.error('RAG retrieval error (non-blocking):', err);
    return EMPTY_RESULT;
  }
}
