-- Floor-based mastery progression system

-- Update global master titles to be floor-based
DROP TABLE IF EXISTS global_master_titles CASCADE;

CREATE TABLE global_master_titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  floors_completed INTEGER NOT NULL DEFAULT 0,
  current_floor INTEGER NOT NULL DEFAULT 1,
  total_xp INTEGER NOT NULL DEFAULT 0,
  global_streak_days INTEGER NOT NULL DEFAULT 0,
  last_global_practice_date DATE,
  master_title TEXT, -- 'blue', 'red', 'gold', 'purple', 'white', 'black'
  black_master_exam_passed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Floor progression tracking
CREATE TABLE user_floor_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  floor_number INTEGER NOT NULL CHECK (floor_number >= 1 AND floor_number <= 8),
  is_unlocked BOOLEAN NOT NULL DEFAULT false,
  rooms_required INTEGER NOT NULL, -- How many rooms needed to complete this floor
  rooms_completed INTEGER NOT NULL DEFAULT 0,
  floor_completed_at TIMESTAMPTZ,
  floor_assessment_passed_at TIMESTAMPTZ,
  floor_assessment_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, floor_number)
);

-- Floor assessments (comprehensive tests)
CREATE TABLE floor_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  floor_number INTEGER NOT NULL CHECK (floor_number >= 1 AND floor_number <= 8),
  assessment_type TEXT NOT NULL, -- 'comprehensive', 'retention', 'teaching', 'black_master_exam'
  questions_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  user_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_feedback JSONB NOT NULL DEFAULT '{}'::jsonb,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Room scope configurations (e.g., 24FPS Genesis-only for Floor 1)
CREATE TABLE room_scope_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL,
  floor_number INTEGER NOT NULL CHECK (floor_number >= 1 AND floor_number <= 8),
  scope_description TEXT NOT NULL,
  scope_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., {"books": ["Genesis"], "chapters": 50}
  xp_requirement INTEGER NOT NULL,
  streak_requirement INTEGER NOT NULL,
  curriculum_percentage_required INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(room_id, floor_number)
);

-- Insert Floor 1 initial unlock for all existing users
INSERT INTO user_floor_progress (user_id, floor_number, is_unlocked, rooms_required)
SELECT DISTINCT user_id, 1, true, 3
FROM room_mastery_levels
ON CONFLICT (user_id, floor_number) DO NOTHING;

-- Insert all 8 floors for each user (locked by default except floor 1)
INSERT INTO user_floor_progress (user_id, floor_number, is_unlocked, rooms_required)
SELECT DISTINCT user_id, floor_num, (floor_num = 1), 
  CASE floor_num
    WHEN 1 THEN 3
    WHEN 2 THEN 3
    WHEN 3 THEN 3
    WHEN 4 THEN 4
    WHEN 5 THEN 3
    WHEN 6 THEN 2
    WHEN 7 THEN 3
    WHEN 8 THEN 1
  END
FROM room_mastery_levels
CROSS JOIN generate_series(1, 8) AS floor_num
ON CONFLICT (user_id, floor_number) DO NOTHING;

-- Function to unlock next floor
CREATE OR REPLACE FUNCTION unlock_next_floor()
RETURNS TRIGGER AS $$
DECLARE
  v_current_floor INTEGER;
  v_rooms_required INTEGER;
  v_rooms_completed INTEGER;
BEGIN
  -- Get current floor and progress
  SELECT floor_number, rooms_required, rooms_completed
  INTO v_current_floor, v_rooms_required, v_rooms_completed
  FROM user_floor_progress
  WHERE id = NEW.id;
  
  -- Check if floor is complete
  IF v_rooms_completed >= v_rooms_required AND NEW.floor_assessment_passed_at IS NOT NULL THEN
    -- Mark floor as completed
    UPDATE user_floor_progress
    SET floor_completed_at = NOW()
    WHERE id = NEW.id;
    
    -- Unlock next floor if not at max
    IF v_current_floor < 8 THEN
      UPDATE user_floor_progress
      SET is_unlocked = true
      WHERE user_id = NEW.user_id AND floor_number = v_current_floor + 1;
      
      -- Update global progress
      UPDATE global_master_titles
      SET 
        floors_completed = v_current_floor,
        current_floor = v_current_floor + 1,
        master_title = CASE v_current_floor
          WHEN 1 THEN 'blue'
          WHEN 2 THEN 'red'
          WHEN 3 THEN 'gold'
          WHEN 4 THEN 'purple'
          WHEN 5 THEN 'white'
          WHEN 6 THEN 'white'
          WHEN 7 THEN 'black_candidate'
          ELSE master_title
        END,
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    END IF;
    
    -- If Floor 8 completed, mark as Black Master
    IF v_current_floor = 8 THEN
      UPDATE global_master_titles
      SET 
        floors_completed = 8,
        master_title = 'black',
        black_master_exam_passed_at = NOW(),
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_unlock_next_floor
AFTER UPDATE ON user_floor_progress
FOR EACH ROW
WHEN (OLD.floor_assessment_passed_at IS NULL AND NEW.floor_assessment_passed_at IS NOT NULL)
EXECUTE FUNCTION unlock_next_floor();

-- RLS Policies
ALTER TABLE global_master_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_floor_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE floor_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_scope_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own global titles" ON global_master_titles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own floor progress" ON user_floor_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own assessments" ON floor_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Room scope configs viewable by all" ON room_scope_configs
  FOR SELECT USING (true);

-- Indexes
CREATE INDEX idx_floor_progress_user ON user_floor_progress(user_id);
CREATE INDEX idx_floor_assessments_user ON floor_assessments(user_id);
CREATE INDEX idx_global_titles_user ON global_master_titles(user_id);