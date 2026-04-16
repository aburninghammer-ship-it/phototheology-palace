-- Fix: UNIQUE(user_id, group_id, day_number) does not enforce uniqueness
-- when group_id IS NULL (PostgreSQL treats NULLs as distinct in unique constraints).
-- Add a partial unique index to prevent duplicate solo progress entries.
CREATE UNIQUE INDEX IF NOT EXISTS idx_dc_progress_solo_unique
  ON death_chamber_progress (user_id, day_number)
  WHERE group_id IS NULL;
