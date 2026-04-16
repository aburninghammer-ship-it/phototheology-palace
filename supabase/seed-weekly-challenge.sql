-- Seed the first Weekly Study Challenge
-- Run this after creating the tables

-- Calculate current week number
DO $$
DECLARE
  v_week_number INTEGER;
  v_year INTEGER;
  v_starts_at TIMESTAMPTZ;
  v_ends_at TIMESTAMPTZ;
BEGIN
  -- Get current week info
  v_year := EXTRACT(YEAR FROM NOW());
  v_week_number := EXTRACT(WEEK FROM NOW());

  -- Calculate Sunday start and Friday end
  v_starts_at := date_trunc('week', NOW()) + INTERVAL '0 days'; -- Sunday
  v_ends_at := date_trunc('week', NOW()) + INTERVAL '4 days 23 hours 59 minutes 59 seconds'; -- Friday 11:59:59 PM

  -- Insert first challenge
  INSERT INTO weekly_study_challenges (
    week_number,
    year,
    title,
    theme,
    anchor_passage,
    study_prompt,
    pt_focus,
    difficulty,
    hints,
    status,
    starts_at,
    ends_at
  ) VALUES (
    v_week_number,
    v_year,
    'The Sanctuary Blueprint: Heaven''s Pattern on Earth',
    'Understanding God''s dwelling plan from Exodus to Revelation',
    'Hebrews 8:1-5',
    'Study Hebrews 8:1-5 and explore this question: What does it mean that the earthly sanctuary was a "shadow" and "copy" of heavenly things? How does understanding this pattern help us interpret other parts of Scripture? Look for connections between the earthly sanctuary service and Christ''s ministry in heaven. What PT principles help unlock this passage?',
    ARRAY['Sanctuary Blueprint', 'Types & Shadows', 'Christ-Centered Reading', 'Parallels'],
    'intermediate',
    '{"hint1": "Consider the Greek word for ''pattern'' (typos) and its implications", "hint2": "Look at how the sanctuary articles point to Christ''s work", "hint3": "Connect Hebrews 8 with Exodus 25:40"}',
    'active',
    v_starts_at,
    v_ends_at
  )
  ON CONFLICT (week_number, year) DO UPDATE SET
    title = EXCLUDED.title,
    theme = EXCLUDED.theme,
    anchor_passage = EXCLUDED.anchor_passage,
    study_prompt = EXCLUDED.study_prompt,
    pt_focus = EXCLUDED.pt_focus,
    status = 'active';

END $$;

-- Additional sample challenges for future weeks (inactive/draft)
INSERT INTO weekly_study_challenges (
  week_number,
  year,
  title,
  theme,
  anchor_passage,
  study_prompt,
  pt_focus,
  difficulty,
  status,
  starts_at,
  ends_at
) VALUES
(
  EXTRACT(WEEK FROM NOW()) + 1,
  EXTRACT(YEAR FROM NOW()),
  'The Lamb Slain from the Foundation',
  'Christ in the Plan of Redemption',
  'Revelation 13:8',
  'Explore what it means that Jesus was "the Lamb slain from the foundation of the world." How does this truth appear in Genesis? What does it reveal about God''s foreknowledge versus His predetermined plan? Use PT principles to trace the Lamb imagery from Genesis through Revelation.',
  ARRAY['Types & Shadows', 'Christ-Centered Reading', 'Patterns', 'Prophetic Connections'],
  'intermediate',
  'draft',
  date_trunc('week', NOW()) + INTERVAL '7 days',
  date_trunc('week', NOW()) + INTERVAL '11 days 23 hours 59 minutes 59 seconds'
),
(
  EXTRACT(WEEK FROM NOW()) + 2,
  EXTRACT(YEAR FROM NOW()),
  'The Two Covenants: Promise vs Performance',
  'Understanding Covenant Theology through Scripture',
  'Galatians 4:21-31',
  'Study Paul''s allegory of Hagar and Sarah in Galatians 4. What do these two women represent about the old and new covenants? How does the sanctuary blueprint help us understand the difference between covenant-keeping by human effort versus divine promise? Look for parallel stories in Scripture.',
  ARRAY['Parallels', 'Story Comparison', 'Covenant Theology', 'Types & Shadows'],
  'advanced',
  'draft',
  date_trunc('week', NOW()) + INTERVAL '14 days',
  date_trunc('week', NOW()) + INTERVAL '18 days 23 hours 59 minutes 59 seconds'
),
(
  EXTRACT(WEEK FROM NOW()) + 3,
  EXTRACT(YEAR FROM NOW()),
  'Melchizedek: Priest-King Mystery',
  'The Order of Melchizedek and Christ''s Priesthood',
  'Hebrews 7:1-10',
  'Who was Melchizedek and why does Hebrews spend so much time discussing him? How does understanding Melchizedek illuminate Christ''s unique role as both King and Priest? Look for Genesis connections and trace this theme through the Psalms to Hebrews.',
  ARRAY['Christ-Centered Reading', 'Types & Shadows', 'Prophetic Connections', 'Story Comparison'],
  'advanced',
  'draft',
  date_trunc('week', NOW()) + INTERVAL '21 days',
  date_trunc('week', NOW()) + INTERVAL '25 days 23 hours 59 minutes 59 seconds'
)
ON CONFLICT (week_number, year) DO NOTHING;

-- Verify insertion
SELECT
  title,
  anchor_passage,
  status,
  starts_at::date as starts,
  ends_at::date as ends
FROM weekly_study_challenges
ORDER BY week_number;
