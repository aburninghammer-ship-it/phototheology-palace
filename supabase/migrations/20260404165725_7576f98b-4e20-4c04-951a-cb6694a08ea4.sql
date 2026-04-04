
CREATE TABLE public.reginald_knowledge_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT 'changelog',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reginald_knowledge_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active knowledge entries"
ON public.reginald_knowledge_updates
FOR SELECT
USING (is_active = true);

COMMENT ON TABLE public.reginald_knowledge_updates IS 'Dynamic knowledge base entries that get injected into Reginald assistant prompt. Updated automatically every 6 hours.';
