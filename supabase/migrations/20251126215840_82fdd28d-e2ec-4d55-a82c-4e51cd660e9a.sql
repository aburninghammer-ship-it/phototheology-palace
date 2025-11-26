-- Create memory verse lists table
CREATE TABLE IF NOT EXISTS public.memory_verse_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT,
  is_public BOOLEAN DEFAULT false,
  is_collaborative BOOLEAN DEFAULT false,
  bible_version TEXT DEFAULT 'kjv',
  target_verse_count INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create memory verse list items table
CREATE TABLE IF NOT EXISTS public.memory_verse_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES public.memory_verse_lists(id) ON DELETE CASCADE,
  verse_reference TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create memory game sessions table
CREATE TABLE IF NOT EXISTS public.memory_game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  list_id UUID NOT NULL REFERENCES public.memory_verse_lists(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL, -- 'first-letter', 'fill-blanks', 'rearrange', 'type-first-letter'
  score INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Create memory list collaborators table
CREATE TABLE IF NOT EXISTS public.memory_list_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES public.memory_verse_lists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member', -- 'owner', 'editor', 'member'
  joined_at TIMESTAMPTZ DEFAULT now()
);

-- Create memory verse mastery tracking
CREATE TABLE IF NOT EXISTS public.memory_verse_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  list_id UUID NOT NULL REFERENCES public.memory_verse_lists(id) ON DELETE CASCADE,
  verse_reference TEXT NOT NULL,
  mastery_level INTEGER DEFAULT 0, -- 0-5, 5 being fully memorized
  last_practiced_at TIMESTAMPTZ DEFAULT now(),
  next_review_at TIMESTAMPTZ DEFAULT now(),
  times_practiced INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memory_verse_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_verse_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_list_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_verse_mastery ENABLE ROW LEVEL SECURITY;

-- RLS Policies for memory_verse_lists
CREATE POLICY "Users can view their own lists and public lists"
  ON public.memory_verse_lists
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR is_public = true
    OR EXISTS (
      SELECT 1 FROM public.memory_list_collaborators 
      WHERE list_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own lists"
  ON public.memory_verse_lists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists"
  ON public.memory_verse_lists
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists"
  ON public.memory_verse_lists
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for memory_verse_list_items
CREATE POLICY "Users can view items from accessible lists"
  ON public.memory_verse_list_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memory_verse_lists 
      WHERE id = list_id 
      AND (
        user_id = auth.uid() 
        OR is_public = true
        OR EXISTS (
          SELECT 1 FROM public.memory_list_collaborators 
          WHERE list_id = memory_verse_lists.id AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can add items to their own lists"
  ON public.memory_verse_list_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memory_verse_lists 
      WHERE id = list_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in their own lists"
  ON public.memory_verse_list_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.memory_verse_lists 
      WHERE id = list_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items from their own lists"
  ON public.memory_verse_list_items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.memory_verse_lists 
      WHERE id = list_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for memory_game_sessions
CREATE POLICY "Users can view their own game sessions"
  ON public.memory_game_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own game sessions"
  ON public.memory_game_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game sessions"
  ON public.memory_game_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for memory_list_collaborators
CREATE POLICY "Users can view collaborators of accessible lists"
  ON public.memory_list_collaborators
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memory_verse_lists 
      WHERE id = list_id 
      AND (user_id = auth.uid() OR is_collaborative = true)
    )
  );

CREATE POLICY "List owners can manage collaborators"
  ON public.memory_list_collaborators
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.memory_verse_lists 
      WHERE id = list_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for memory_verse_mastery
CREATE POLICY "Users can view their own mastery"
  ON public.memory_verse_mastery
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mastery records"
  ON public.memory_verse_mastery
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mastery records"
  ON public.memory_verse_mastery
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_memory_verse_lists_user_id ON public.memory_verse_lists(user_id);
CREATE INDEX idx_memory_verse_lists_public ON public.memory_verse_lists(is_public) WHERE is_public = true;
CREATE INDEX idx_memory_verse_list_items_list_id ON public.memory_verse_list_items(list_id);
CREATE INDEX idx_memory_game_sessions_user_id ON public.memory_game_sessions(user_id);
CREATE INDEX idx_memory_game_sessions_list_id ON public.memory_game_sessions(list_id);
CREATE INDEX idx_memory_list_collaborators_list_id ON public.memory_list_collaborators(list_id);
CREATE INDEX idx_memory_list_collaborators_user_id ON public.memory_list_collaborators(user_id);
CREATE INDEX idx_memory_verse_mastery_user_id ON public.memory_verse_mastery(user_id);
CREATE INDEX idx_memory_verse_mastery_next_review ON public.memory_verse_mastery(next_review_at);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_memory_lists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_memory_lists_timestamp
  BEFORE UPDATE ON public.memory_verse_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_memory_lists_updated_at();