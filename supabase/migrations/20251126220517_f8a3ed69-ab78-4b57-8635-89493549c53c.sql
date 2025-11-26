-- Add PT principle tracking to memory lists
ALTER TABLE memory_verse_lists
ADD COLUMN pt_principles JSONB DEFAULT '{
  "cycles": [],
  "dimensions": [],
  "horizons": [],
  "sanctuary_articles": [],
  "feasts": [],
  "walls": [],
  "frames": []
}'::jsonb;

-- Add PT insights and discovery tracking to list items
ALTER TABLE memory_verse_list_items
ADD COLUMN pt_insights JSONB DEFAULT '{
  "christ_center": null,
  "dimensions": [],
  "cycles": [],
  "horizons": [],
  "sanctuary_connections": [],
  "feast_connections": [],
  "cross_references": []
}'::jsonb,
ADD COLUMN pt_discovered BOOLEAN DEFAULT false,
ADD COLUMN discovery_unlocked_at TIMESTAMPTZ;

-- Create PT mastery tracking table
CREATE TABLE pt_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  principle_type TEXT NOT NULL, -- 'cycle', 'dimension', 'horizon', 'sanctuary', 'feast', 'wall', 'frame'
  principle_code TEXT NOT NULL, -- '@Mo', '1D', '1H', 'Altar', etc.
  verses_memorized TEXT[] DEFAULT '{}',
  mastery_level INTEGER DEFAULT 0, -- 0-100 percentage
  first_encountered_at TIMESTAMPTZ DEFAULT now(),
  last_practiced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, principle_type, principle_code)
);

-- Create PT cross-reference suggestions table
CREATE TABLE pt_cross_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_verse TEXT NOT NULL, -- e.g., "John 3:16"
  target_verse TEXT NOT NULL,
  connection_type TEXT NOT NULL, -- 'same_cycle', 'same_sanctuary', 'parallel', 'type', etc.
  principle_codes TEXT[] NOT NULL, -- PT codes that link them
  strength INTEGER DEFAULT 50, -- 0-100, how strong the connection is
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user PT preferences table
CREATE TABLE user_pt_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  pt_mode TEXT DEFAULT 'beginner', -- 'beginner', 'expert'
  show_insights_after_game BOOLEAN DEFAULT true,
  auto_suggest_cross_refs BOOLEAN DEFAULT true,
  palace_view_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies for pt_mastery
ALTER TABLE pt_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own PT mastery"
ON pt_mastery FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own PT mastery"
ON pt_mastery FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own PT mastery"
ON pt_mastery FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own PT mastery"
ON pt_mastery FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for pt_cross_references (public read)
ALTER TABLE pt_cross_references ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view PT cross-references"
ON pt_cross_references FOR SELECT
USING (true);

-- RLS Policies for user_pt_preferences
ALTER TABLE user_pt_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own PT preferences"
ON user_pt_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own PT preferences"
ON user_pt_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own PT preferences"
ON user_pt_preferences FOR UPDATE
USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_pt_mastery_user_principle ON pt_mastery(user_id, principle_type, principle_code);
CREATE INDEX idx_pt_cross_refs_source ON pt_cross_references(source_verse);
CREATE INDEX idx_pt_cross_refs_target ON pt_cross_references(target_verse);
CREATE INDEX idx_memory_list_items_pt_discovered ON memory_verse_list_items(pt_discovered);

-- Trigger for updated_at
CREATE TRIGGER update_pt_mastery_updated_at
  BEFORE UPDATE ON pt_mastery
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_pt_preferences_updated_at
  BEFORE UPDATE ON user_pt_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();