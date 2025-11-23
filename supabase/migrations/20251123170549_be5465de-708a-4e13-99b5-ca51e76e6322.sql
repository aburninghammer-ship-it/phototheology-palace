-- Fix search_path for the new trigger function (replace without dropping)
CREATE OR REPLACE FUNCTION update_room_curriculum_updated_at()
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