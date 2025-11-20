-- Insert monthly book-based reading plans
INSERT INTO reading_plans (name, description, duration_days, plan_type, depth_mode, daily_schedule) VALUES
('Genesis in a Month', 'Journey through Creation, Fall, and the Patriarchs with daily Palace exercises', 31, 'book-monthly', 'focused', '{"estimated_time_minutes": 25, "book": "Genesis", "chapters_per_day": 1.6}'::jsonb),
('Exodus in a Month', 'Experience the Deliverance and Sanctuary with Palace mapping', 30, 'book-monthly', 'focused', '{"estimated_time_minutes": 25, "book": "Exodus", "chapters_per_day": 1.3}'::jsonb),
('Leviticus in a Month', 'Deep dive into the Sanctuary system and holiness', 30, 'book-monthly', 'deep', '{"estimated_time_minutes": 20, "book": "Leviticus", "chapters_per_day": 0.9}'::jsonb),
('Numbers in a Month', 'Follow Israel through the wilderness with Cycle mapping', 30, 'book-monthly', 'focused', '{"estimated_time_minutes": 25, "book": "Numbers", "chapters_per_day": 1.2}'::jsonb),
('Deuteronomy in a Month', 'Moses'' final teachings with Time Zone placement', 30, 'book-monthly', 'focused', '{"estimated_time_minutes": 25, "book": "Deuteronomy", "chapters_per_day": 1.1}'::jsonb),
('Psalms in a Month', 'Worship through the Prayer Book with emotional floors', 31, 'book-monthly', 'standard', '{"estimated_time_minutes": 15, "book": "Psalms", "chapters_per_day": 4.8}'::jsonb),
('Proverbs in a Month', 'Daily wisdom with Fruit Room applications', 31, 'book-monthly', 'standard', '{"estimated_time_minutes": 10, "book": "Proverbs", "chapters_per_day": 1}'::jsonb),
('Isaiah in a Month', 'The Gospel in prophecy with Day of the Lord horizons', 31, 'book-monthly', 'deep', '{"estimated_time_minutes": 30, "book": "Isaiah", "chapters_per_day": 2.1}'::jsonb),
('Daniel in a Month', 'Prophecy and sanctuary united across Three Heavens', 30, 'book-monthly', 'deep', '{"estimated_time_minutes": 25, "book": "Daniel", "chapters_per_day": 0.4}'::jsonb),
('Matthew in a Month', 'The King revealed with Christ-Centered concentration', 28, 'book-monthly', 'focused', '{"estimated_time_minutes": 20, "book": "Matthew", "chapters_per_day": 1}'::jsonb),
('Mark in a Month', 'The Servant in action with Story Room visualization', 28, 'book-monthly', 'standard', '{"estimated_time_minutes": 15, "book": "Mark", "chapters_per_day": 0.6}'::jsonb),
('Luke in a Month', 'The Perfect Man with dimensional study', 28, 'book-monthly', 'focused', '{"estimated_time_minutes": 20, "book": "Luke", "chapters_per_day": 0.9}'::jsonb),
('John in a Month', 'The Divine Son with parallel rooms', 28, 'book-monthly', 'focused', '{"estimated_time_minutes": 20, "book": "John", "chapters_per_day": 0.75}'::jsonb),
('Acts in a Month', 'The Spirit Cycle in action with timeline mapping', 28, 'book-monthly', 'focused', '{"estimated_time_minutes": 20, "book": "Acts", "chapters_per_day": 1}'::jsonb),
('Romans in a Month', 'The Gospel systematized with 5 Dimensions', 28, 'book-monthly', 'deep', '{"estimated_time_minutes": 25, "book": "Romans", "chapters_per_day": 0.6}'::jsonb),
('Hebrews in a Month', 'The Superior Christ and Sanctuary blueprint', 28, 'book-monthly', 'deep', '{"estimated_time_minutes": 25, "book": "Hebrews", "chapters_per_day": 0.5}'::jsonb),
('Revelation in a Month', 'The Remnant Cycle and final judgment with Vision Floor', 31, 'book-monthly', 'deep', '{"estimated_time_minutes": 30, "book": "Revelation", "chapters_per_day": 0.7}'::jsonb)
ON CONFLICT DO NOTHING;