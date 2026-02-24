-- Migration: Add transcript embeddings for RAG retrieval
-- Enables vector similarity search over Pastor Ivor Myers YouTube transcript corpus

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- 2. Create the transcript_chunks table
CREATE TABLE IF NOT EXISTS public.transcript_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding vector(1536),
  source_file TEXT NOT NULL,
  category TEXT,
  chunk_index INTEGER NOT NULL,
  word_count INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create an index for vector similarity search
CREATE INDEX IF NOT EXISTS transcript_chunks_embedding_idx
ON public.transcript_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 4. Create text search indexes
CREATE INDEX IF NOT EXISTS transcript_chunks_source_idx ON public.transcript_chunks(source_file);
CREATE INDEX IF NOT EXISTS transcript_chunks_category_idx ON public.transcript_chunks(category);

-- 5. Create the similarity search function
CREATE OR REPLACE FUNCTION public.search_transcript_chunks(
  query_embedding vector(1536),
  match_count INT DEFAULT 5,
  match_threshold FLOAT DEFAULT 0.7,
  filter_category TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  source_file TEXT,
  category TEXT,
  chunk_index INTEGER,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tc.id,
    tc.content,
    tc.source_file,
    tc.category,
    tc.chunk_index,
    tc.metadata,
    1 - (tc.embedding <=> query_embedding) AS similarity
  FROM public.transcript_chunks tc
  WHERE
    tc.embedding IS NOT NULL
    AND (filter_category IS NULL OR tc.category = filter_category)
    AND 1 - (tc.embedding <=> query_embedding) > match_threshold
  ORDER BY tc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 6. Enable Row Level Security
ALTER TABLE public.transcript_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read transcript chunks"
ON public.transcript_chunks FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow service role to manage transcript chunks"
ON public.transcript_chunks FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 7. Table comment
COMMENT ON TABLE public.transcript_chunks IS 'Vectorized transcript chunks from Pastor Ivor Myers YouTube corpus for RAG retrieval in Jeeves AI';
