-- Fix search_path for the initialize_floor_progress function
CREATE OR REPLACE FUNCTION initialize_floor_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert Floor 1 as unlocked for new users
  INSERT INTO user_floor_progress (user_id, floor_number, is_unlocked, rooms_required, rooms_completed)
  VALUES (NEW.id, 1, true, 6, 0)
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;