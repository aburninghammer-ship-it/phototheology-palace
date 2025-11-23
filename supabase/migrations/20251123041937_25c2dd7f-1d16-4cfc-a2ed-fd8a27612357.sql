-- Add focused_room tracking to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS focused_room_id TEXT,
ADD COLUMN IF NOT EXISTS focused_room_floor INTEGER,
ADD COLUMN IF NOT EXISTS focused_room_set_at TIMESTAMPTZ;

-- Add comment
COMMENT ON COLUMN profiles.focused_room_id IS 'The room ID that the user is currently focusing on for mastery';
COMMENT ON COLUMN profiles.focused_room_floor IS 'The floor number of the focused room';
COMMENT ON COLUMN profiles.focused_room_set_at IS 'When the user set their current focus room';