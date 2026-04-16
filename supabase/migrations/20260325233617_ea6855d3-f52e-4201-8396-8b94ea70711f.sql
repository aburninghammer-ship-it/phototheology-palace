CREATE TABLE IF NOT EXISTS hallucination_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at timestamptz NOT NULL DEFAULT now(),
  total_scanned integer NOT NULL DEFAULT 0,
  violations_found integer NOT NULL DEFAULT 0,
  violations jsonb NOT NULL DEFAULT '[]',
  summary text,
  status text NOT NULL DEFAULT 'completed'
);

ALTER TABLE hallucination_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON hallucination_audit_logs
  FOR ALL USING (false);