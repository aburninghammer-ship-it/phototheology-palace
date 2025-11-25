-- Add RLS policies to allow users to manage their own floor progress
CREATE POLICY "Users can insert their own floor progress"
ON user_floor_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own floor progress"
ON user_floor_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure Floor 1 is always unlocked for all users by default
-- This function will be triggered when a user profile is created
CREATE OR REPLACE FUNCTION initialize_floor_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert Floor 1 as unlocked for new users
  INSERT INTO user_floor_progress (user_id, floor_number, is_unlocked, rooms_required, rooms_completed)
  VALUES (NEW.id, 1, true, 6, 0)
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-initialize floor progress
DROP TRIGGER IF EXISTS on_profile_created_floor_progress ON profiles;
CREATE TRIGGER on_profile_created_floor_progress
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_floor_progress();