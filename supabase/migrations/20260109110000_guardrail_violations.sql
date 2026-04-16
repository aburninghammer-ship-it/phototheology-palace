-- Guardrail Violations Tracking
-- Logs when Jeeves produces hallucinated PT codes or meanings for analysis and improvement

CREATE TABLE IF NOT EXISTS guardrail_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Context
  mode TEXT NOT NULL, -- Which Jeeves mode produced the violation
  input_text TEXT, -- What the user asked (truncated)
  output_text TEXT, -- What Jeeves produced (truncated)

  -- Violation details
  violations JSONB NOT NULL DEFAULT '[]', -- Array of violation objects
  violation_count INTEGER NOT NULL DEFAULT 0,

  -- Status
  reviewed BOOLEAN DEFAULT false,
  review_notes TEXT,
  correction_applied BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- Index for finding unreviewed violations
CREATE INDEX IF NOT EXISTS idx_guardrail_violations_reviewed
  ON guardrail_violations(reviewed, created_at DESC);

-- Index for analyzing violation patterns by mode
CREATE INDEX IF NOT EXISTS idx_guardrail_violations_mode
  ON guardrail_violations(mode, created_at DESC);

-- RLS - Only admins can access this table (service role only)
ALTER TABLE guardrail_violations ENABLE ROW LEVEL SECURITY;

-- No public access - only service role can read/write
-- This ensures violation logs stay private for improvement purposes

-- Summary view for common violations
CREATE OR REPLACE VIEW guardrail_violation_summary AS
SELECT
  mode,
  COUNT(*) as total_violations,
  COUNT(*) FILTER (WHERE reviewed = false) as unreviewed,
  MAX(created_at) as last_violation,
  jsonb_agg(DISTINCT v->>'context') as violation_types
FROM guardrail_violations,
LATERAL jsonb_array_elements(violations) as v
GROUP BY mode
ORDER BY total_violations DESC;
