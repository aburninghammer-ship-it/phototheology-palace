-- Source Library & Study Series Feature Tables
-- Migration: 20260203120000_source_library_and_series.sql

-- ============================================
-- FEATURE 2: Source Library
-- ============================================

-- User uploaded source documents
CREATE TABLE IF NOT EXISTS user_source_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('pdf', 'docx', 'pptx', 'txt')),
  file_size_bytes INTEGER,
  storage_path TEXT,
  extracted_text TEXT,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_source_documents ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own sources
CREATE POLICY "Users manage own sources" ON user_source_documents
  FOR ALL USING (auth.uid() = user_id);

-- Full-text search index for document content
CREATE INDEX IF NOT EXISTS idx_source_documents_search ON user_source_documents
  USING gin(to_tsvector('english', COALESCE(extracted_text, '')));

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_source_documents_user ON user_source_documents(user_id);

-- Index for document type filtering
CREATE INDEX IF NOT EXISTS idx_source_documents_type ON user_source_documents(document_type);

-- ============================================
-- FEATURE 5: Bible Study Series Generator
-- ============================================

-- Bible study series (parent table)
CREATE TABLE IF NOT EXISTS user_study_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  source_document_ids UUID[] DEFAULT '{}',
  theme TEXT,
  target_audience TEXT,
  lesson_count INTEGER DEFAULT 4,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'complete', 'published')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Individual lessons within a series
CREATE TABLE IF NOT EXISTS study_series_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID NOT NULL REFERENCES user_study_series(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  introduction TEXT,
  sections JSONB DEFAULT '[]',
  discussion_questions TEXT[] DEFAULT '{}',
  application_points TEXT[] DEFAULT '{}',
  key_scriptures TEXT[] DEFAULT '{}',
  closing_prayer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_study_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_series_lessons ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own series
CREATE POLICY "Users manage own series" ON user_study_series
  FOR ALL USING (auth.uid() = user_id);

-- Users can only manage lessons in their own series
CREATE POLICY "Users manage own lessons" ON study_series_lessons
  FOR ALL USING (
    series_id IN (SELECT id FROM user_study_series WHERE user_id = auth.uid())
  );

-- Indexes for series
CREATE INDEX IF NOT EXISTS idx_study_series_user ON user_study_series(user_id);
CREATE INDEX IF NOT EXISTS idx_study_series_status ON user_study_series(status);

-- Indexes for lessons
CREATE INDEX IF NOT EXISTS idx_series_lessons_series ON study_series_lessons(series_id);
CREATE INDEX IF NOT EXISTS idx_series_lessons_number ON study_series_lessons(series_id, lesson_number);

-- ============================================
-- Helper Functions
-- ============================================

-- Function to search source documents by content
CREATE OR REPLACE FUNCTION search_source_documents(
  search_query TEXT,
  user_id_param UUID
)
RETURNS SETOF user_source_documents
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM user_source_documents
  WHERE user_id = user_id_param
    AND (
      to_tsvector('english', COALESCE(extracted_text, '')) @@ plainto_tsquery('english', search_query)
      OR title ILIKE '%' || search_query || '%'
      OR search_query = ANY(tags)
    )
  ORDER BY
    ts_rank(to_tsvector('english', COALESCE(extracted_text, '')), plainto_tsquery('english', search_query)) DESC,
    created_at DESC;
END;
$$;

-- Function to get series with lesson count
CREATE OR REPLACE FUNCTION get_user_series_with_stats(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  theme TEXT,
  target_audience TEXT,
  lesson_count INTEGER,
  completed_lessons INTEGER,
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.title,
    s.description,
    s.theme,
    s.target_audience,
    s.lesson_count,
    COALESCE((SELECT COUNT(*)::INTEGER FROM study_series_lessons l WHERE l.series_id = s.id), 0) as completed_lessons,
    s.status,
    s.created_at,
    s.updated_at
  FROM user_study_series s
  WHERE s.user_id = user_id_param
  ORDER BY s.updated_at DESC;
END;
$$;
