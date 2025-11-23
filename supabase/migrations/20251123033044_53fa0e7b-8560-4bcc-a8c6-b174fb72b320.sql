-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own mastery levels" ON public.room_mastery_levels;
DROP POLICY IF EXISTS "Users can insert their own mastery levels" ON public.room_mastery_levels;
DROP POLICY IF EXISTS "Users can update their own mastery levels" ON public.room_mastery_levels;
DROP POLICY IF EXISTS "Users can view their own streaks" ON public.mastery_streaks;
DROP POLICY IF EXISTS "Users can insert their own streaks" ON public.mastery_streaks;
DROP POLICY IF EXISTS "Users can update their own streaks" ON public.mastery_streaks;
DROP POLICY IF EXISTS "Users can view their own titles" ON public.global_master_titles;
DROP POLICY IF EXISTS "Users can insert their own titles" ON public.global_master_titles;
DROP POLICY IF EXISTS "Users can update their own titles" ON public.global_master_titles;
DROP POLICY IF EXISTS "Microlearning content viewable by all authenticated users" ON public.microlearning_content;

-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS update_room_mastery_levels_updated_at ON public.room_mastery_levels;
DROP TRIGGER IF EXISTS update_mastery_streaks_updated_at ON public.mastery_streaks;
DROP TRIGGER IF EXISTS update_global_master_titles_updated_at ON public.global_master_titles;
DROP FUNCTION IF EXISTS update_room_mastery_updated_at();
DROP FUNCTION IF EXISTS award_room_xp(UUID, TEXT, INTEGER, INTEGER, BOOLEAN, BOOLEAN, BOOLEAN);
DROP FUNCTION IF EXISTS update_mastery_streak(UUID);

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.microlearning_content CASCADE;
DROP TABLE IF EXISTS public.room_mastery_levels CASCADE;
DROP TABLE IF EXISTS public.mastery_streaks CASCADE;
DROP TABLE IF EXISTS public.global_master_titles CASCADE;

-- NOW create everything fresh
-- Create room_mastery_levels table
CREATE TABLE public.room_mastery_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  room_id TEXT NOT NULL,
  floor_number INTEGER NOT NULL,
  mastery_level INTEGER NOT NULL DEFAULT 1 CHECK (mastery_level BETWEEN 1 AND 5),
  xp_current INTEGER NOT NULL DEFAULT 0,
  xp_required INTEGER NOT NULL DEFAULT 100,
  total_drills_completed INTEGER NOT NULL DEFAULT 0,
  total_exercises_completed INTEGER NOT NULL DEFAULT 0,
  perfect_scores_count INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, room_id)
);

-- Create mastery_streaks table
CREATE TABLE public.mastery_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_active_days INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create global_master_titles table
CREATE TABLE public.global_master_titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT 'Novice Scholar',
  title_level INTEGER NOT NULL DEFAULT 1 CHECK (title_level BETWEEN 1 AND 8),
  rooms_mastered INTEGER NOT NULL DEFAULT 0,
  floors_completed INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create microlearning_content table
CREATE TABLE public.microlearning_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL,
  floor_number INTEGER NOT NULL,
  mastery_level INTEGER NOT NULL CHECK (mastery_level BETWEEN 1 AND 5),
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL DEFAULT 5,
  principle_focus TEXT,
  verse_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_id, mastery_level, lesson_number)
);

-- Enable RLS
ALTER TABLE public.room_mastery_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mastery_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_master_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.microlearning_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for room_mastery_levels
CREATE POLICY "Users can view their own mastery levels"
  ON public.room_mastery_levels FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mastery levels"
  ON public.room_mastery_levels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mastery levels"
  ON public.room_mastery_levels FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for mastery_streaks
CREATE POLICY "Users can view their own streaks"
  ON public.mastery_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks"
  ON public.mastery_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON public.mastery_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for global_master_titles
CREATE POLICY "Users can view their own titles"
  ON public.global_master_titles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own titles"
  ON public.global_master_titles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own titles"
  ON public.global_master_titles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for microlearning_content
CREATE POLICY "Microlearning content viewable by all authenticated users"
  ON public.microlearning_content FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Create trigger function
CREATE FUNCTION update_room_mastery_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply triggers
CREATE TRIGGER update_room_mastery_levels_updated_at
  BEFORE UPDATE ON public.room_mastery_levels
  FOR EACH ROW
  EXECUTE FUNCTION update_room_mastery_updated_at();

CREATE TRIGGER update_mastery_streaks_updated_at
  BEFORE UPDATE ON public.mastery_streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_room_mastery_updated_at();

CREATE TRIGGER update_global_master_titles_updated_at
  BEFORE UPDATE ON public.global_master_titles
  FOR EACH ROW
  EXECUTE FUNCTION update_room_mastery_updated_at();

-- Function to award XP and check for level up
CREATE FUNCTION award_room_xp(
  p_user_id UUID,
  p_room_id TEXT,
  p_floor_number INTEGER,
  p_xp_amount INTEGER,
  p_drill_completed BOOLEAN DEFAULT FALSE,
  p_exercise_completed BOOLEAN DEFAULT FALSE,
  p_perfect_score BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mastery RECORD;
  v_new_xp INTEGER;
  v_leveled_up BOOLEAN := FALSE;
  v_new_level INTEGER;
  v_result JSONB;
BEGIN
  -- Get or create mastery record
  INSERT INTO room_mastery_levels (user_id, room_id, floor_number)
  VALUES (p_user_id, p_room_id, p_floor_number)
  ON CONFLICT (user_id, room_id) DO NOTHING;
  
  -- Get current mastery data
  SELECT * INTO v_mastery
  FROM room_mastery_levels
  WHERE user_id = p_user_id AND room_id = p_room_id
  FOR UPDATE;
  
  -- Calculate new XP
  v_new_xp := v_mastery.xp_current + p_xp_amount;
  v_new_level := v_mastery.mastery_level;
  
  -- Check for level up (progressive XP requirements: 100, 250, 500, 1000)
  WHILE v_new_xp >= v_mastery.xp_required AND v_new_level < 5 LOOP
    v_new_xp := v_new_xp - v_mastery.xp_required;
    v_new_level := v_new_level + 1;
    v_leveled_up := TRUE;
    
    -- Update XP requirement for next level
    v_mastery.xp_required := CASE v_new_level
      WHEN 2 THEN 250
      WHEN 3 THEN 500
      WHEN 4 THEN 1000
      WHEN 5 THEN 0
      ELSE 100
    END;
  END LOOP;
  
  -- Cap XP at max level
  IF v_new_level = 5 THEN
    v_new_xp := 0;
  END IF;
  
  -- Update mastery record
  UPDATE room_mastery_levels
  SET 
    mastery_level = v_new_level,
    xp_current = v_new_xp,
    xp_required = v_mastery.xp_required,
    total_drills_completed = total_drills_completed + CASE WHEN p_drill_completed THEN 1 ELSE 0 END,
    total_exercises_completed = total_exercises_completed + CASE WHEN p_exercise_completed THEN 1 ELSE 0 END,
    perfect_scores_count = perfect_scores_count + CASE WHEN p_perfect_score THEN 1 ELSE 0 END,
    last_activity_at = NOW()
  WHERE user_id = p_user_id AND room_id = p_room_id;
  
  -- Update global title if room mastered (level 5)
  IF v_new_level = 5 AND v_mastery.mastery_level < 5 THEN
    INSERT INTO global_master_titles (user_id, rooms_mastered, total_xp)
    VALUES (p_user_id, 1, p_xp_amount)
    ON CONFLICT (user_id) DO UPDATE
    SET 
      rooms_mastered = global_master_titles.rooms_mastered + 1,
      total_xp = global_master_titles.total_xp + p_xp_amount,
      updated_at = NOW();
  ELSE
    INSERT INTO global_master_titles (user_id, total_xp)
    VALUES (p_user_id, p_xp_amount)
    ON CONFLICT (user_id) DO UPDATE
    SET 
      total_xp = global_master_titles.total_xp + p_xp_amount,
      updated_at = NOW();
  END IF;
  
  v_result := jsonb_build_object(
    'xp_awarded', p_xp_amount,
    'new_xp', v_new_xp,
    'new_level', v_new_level,
    'leveled_up', v_leveled_up,
    'xp_required', v_mastery.xp_required
  );
  
  RETURN v_result;
END;
$$;

-- Function to update streak
CREATE FUNCTION update_mastery_streak(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_streak RECORD;
  v_days_diff INTEGER;
  v_result JSONB;
BEGIN
  INSERT INTO mastery_streaks (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  SELECT * INTO v_streak
  FROM mastery_streaks
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  v_days_diff := CURRENT_DATE - v_streak.last_activity_date;
  
  IF v_days_diff = 0 THEN
    v_result := jsonb_build_object(
      'streak_continued', FALSE,
      'current_streak', v_streak.current_streak,
      'message', 'Already active today'
    );
  ELSIF v_days_diff = 1 THEN
    UPDATE mastery_streaks
    SET 
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_activity_date = CURRENT_DATE,
      total_active_days = total_active_days + 1
    WHERE user_id = p_user_id;
    
    v_result := jsonb_build_object(
      'streak_continued', TRUE,
      'current_streak', v_streak.current_streak + 1,
      'message', 'Streak continued!'
    );
  ELSE
    UPDATE mastery_streaks
    SET 
      current_streak = 1,
      last_activity_date = CURRENT_DATE,
      total_active_days = total_active_days + 1
    WHERE user_id = p_user_id;
    
    v_result := jsonb_build_object(
      'streak_continued', FALSE,
      'current_streak', 1,
      'message', 'Streak reset. Start fresh!'
    );
  END IF;
  
  RETURN v_result;
END;
$$;