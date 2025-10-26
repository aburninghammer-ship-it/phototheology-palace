-- Update escape_rooms table to support all game modes and all palace rooms
ALTER TABLE public.escape_rooms 
DROP CONSTRAINT IF EXISTS escape_rooms_mode_check;

ALTER TABLE public.escape_rooms 
ADD CONSTRAINT escape_rooms_mode_check 
CHECK (mode IN ('room_as_room', 'category_gauntlet', 'floor_race', 'live_mission', 'async_hunt'));

ALTER TABLE public.escape_rooms 
DROP CONSTRAINT IF EXISTS escape_rooms_category_check;

ALTER TABLE public.escape_rooms 
ADD CONSTRAINT escape_rooms_category_check 
CHECK (category IN (
  'prophecy', 'sanctuary', 'gospel_mission', 'story', 'symbols', 'christ_concentration', 'dimensions',
  'observation', 'questions', 'imagination', 'translation', 'gems', 'def_com', 'types',
  'nature_freestyle', 'personal_freestyle', 'bible_freestyle', 'history_freestyle', 'listening',
  'connect_6', 'theme', 'time_zone', 'patterns', 'parallels', 'fruit',
  'blue', 'three_angels', 'feasts', 'juice', 'fire', 'meditation', 'speed'
) OR category IS NULL);