-- Baptism Track Tables for Living Manna
-- Interactive 28 Fundamental Beliefs discipleship system

-- ============================================
-- 1. BAPTISM LESSONS - The 28 Fundamental Beliefs
-- ============================================
CREATE TABLE public.baptism_lessons (
  id TEXT PRIMARY KEY,  -- e.g., 'FB01_HolyScriptures'
  fundamental_number INT NOT NULL CHECK (fundamental_number BETWEEN 1 AND 28),
  title TEXT NOT NULL,
  description TEXT,
  pt_map JSONB,  -- floors/rooms/principles used
  scripture_pack JSONB,  -- key verses for this lesson
  estimated_minutes INT DEFAULT 30,
  prerequisites JSONB DEFAULT '[]'::jsonb,  -- lesson IDs that must be completed first
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for ordering
CREATE INDEX idx_baptism_lessons_fundamental_number ON public.baptism_lessons(fundamental_number);

-- ============================================
-- 2. CANDIDATE PROGRESS - Track progress per lesson
-- ============================================
CREATE TABLE public.baptism_candidate_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.baptism_candidates(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES public.baptism_lessons(id) ON DELETE CASCADE,
  state TEXT NOT NULL DEFAULT 'not_started' CHECK (state IN ('not_started', 'in_progress', 'completed', 'needs_review')),
  percent_complete INT DEFAULT 0 CHECK (percent_complete BETWEEN 0 AND 100),
  last_step TEXT,
  last_active_at TIMESTAMPTZ,
  quiz_best_score INT,
  confidence INT CHECK (confidence IS NULL OR confidence BETWEEN 0 AND 5),
  pastoral_flags JSONB DEFAULT '[]'::jsonb,
  completion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id, lesson_id)
);

-- Indexes
CREATE INDEX idx_baptism_candidate_progress_candidate ON public.baptism_candidate_progress(candidate_id);
CREATE INDEX idx_baptism_candidate_progress_lesson ON public.baptism_candidate_progress(lesson_id);
CREATE INDEX idx_baptism_candidate_progress_state ON public.baptism_candidate_progress(state);

-- ============================================
-- 3. LESSON ATTEMPTS - Each study session
-- ============================================
CREATE TABLE public.baptism_lesson_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.baptism_candidates(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES public.baptism_lessons(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  mode TEXT DEFAULT 'normal' CHECK (mode IN ('foundations', 'normal', 'deep_dive')),
  transcript_summary TEXT,
  progress_update JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_baptism_lesson_attempts_candidate ON public.baptism_lesson_attempts(candidate_id);
CREATE INDEX idx_baptism_lesson_attempts_lesson ON public.baptism_lesson_attempts(lesson_id);

-- ============================================
-- 4. LESSON RESPONSES - Individual question responses
-- ============================================
CREATE TABLE public.baptism_lesson_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.baptism_lesson_attempts(id) ON DELETE CASCADE,
  step_id TEXT NOT NULL,  -- e.g., 'S2_Q3'
  user_response TEXT,
  scored BOOLEAN DEFAULT FALSE,
  score INT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_baptism_lesson_responses_attempt ON public.baptism_lesson_responses(attempt_id);

-- ============================================
-- 5. READINESS ASSESSMENTS - Final evaluations
-- ============================================
CREATE TABLE public.baptism_readiness_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.baptism_candidates(id) ON DELETE CASCADE,
  assessed_at TIMESTAMPTZ DEFAULT NOW(),
  knowledge_score INT CHECK (knowledge_score IS NULL OR knowledge_score BETWEEN 0 AND 100),
  practice_score INT CHECK (practice_score IS NULL OR practice_score BETWEEN 0 AND 100),
  heart_score INT CHECK (heart_score IS NULL OR heart_score BETWEEN 0 AND 100),
  mentor_notes TEXT,
  recommendation TEXT CHECK (recommendation IS NULL OR recommendation IN ('continue', 'review', 'ready_for_interview')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_baptism_readiness_assessments_candidate ON public.baptism_readiness_assessments(candidate_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.baptism_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baptism_candidate_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baptism_lesson_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baptism_lesson_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baptism_readiness_assessments ENABLE ROW LEVEL SECURITY;

-- Lessons are readable by all authenticated users
CREATE POLICY "Anyone can read baptism lessons"
  ON public.baptism_lessons FOR SELECT
  TO authenticated
  USING (true);

-- Candidates can read/update their own progress
CREATE POLICY "Candidates can view own progress"
  ON public.baptism_candidate_progress FOR SELECT
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM public.baptism_candidates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can insert own progress"
  ON public.baptism_candidate_progress FOR INSERT
  TO authenticated
  WITH CHECK (
    candidate_id IN (
      SELECT id FROM public.baptism_candidates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can update own progress"
  ON public.baptism_candidate_progress FOR UPDATE
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM public.baptism_candidates WHERE user_id = auth.uid()
    )
  );

-- Church leaders can view all candidates in their church
CREATE POLICY "Church leaders can view candidate progress"
  ON public.baptism_candidate_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.baptism_candidates bc
      JOIN public.church_members cm ON bc.church_id = cm.church_id
      WHERE bc.id = baptism_candidate_progress.candidate_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'leader')
    )
  );

-- Similar policies for lesson attempts
CREATE POLICY "Candidates can view own attempts"
  ON public.baptism_lesson_attempts FOR SELECT
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM public.baptism_candidates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can insert own attempts"
  ON public.baptism_lesson_attempts FOR INSERT
  TO authenticated
  WITH CHECK (
    candidate_id IN (
      SELECT id FROM public.baptism_candidates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can update own attempts"
  ON public.baptism_lesson_attempts FOR UPDATE
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM public.baptism_candidates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Church leaders can view candidate attempts"
  ON public.baptism_lesson_attempts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.baptism_candidates bc
      JOIN public.church_members cm ON bc.church_id = cm.church_id
      WHERE bc.id = baptism_lesson_attempts.candidate_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'leader')
    )
  );

-- Similar policies for responses
CREATE POLICY "Candidates can view own responses"
  ON public.baptism_lesson_responses FOR SELECT
  TO authenticated
  USING (
    attempt_id IN (
      SELECT bla.id FROM public.baptism_lesson_attempts bla
      JOIN public.baptism_candidates bc ON bla.candidate_id = bc.id
      WHERE bc.user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can insert own responses"
  ON public.baptism_lesson_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    attempt_id IN (
      SELECT bla.id FROM public.baptism_lesson_attempts bla
      JOIN public.baptism_candidates bc ON bla.candidate_id = bc.id
      WHERE bc.user_id = auth.uid()
    )
  );

-- Readiness assessments - candidates can view, leaders can manage
CREATE POLICY "Candidates can view own assessments"
  ON public.baptism_readiness_assessments FOR SELECT
  TO authenticated
  USING (
    candidate_id IN (
      SELECT id FROM public.baptism_candidates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Church leaders can manage assessments"
  ON public.baptism_readiness_assessments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.baptism_candidates bc
      JOIN public.church_members cm ON bc.church_id = cm.church_id
      WHERE bc.id = baptism_readiness_assessments.candidate_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'leader')
    )
  );

-- ============================================
-- SEED DATA: 28 FUNDAMENTAL BELIEFS
-- ============================================
INSERT INTO public.baptism_lessons (id, fundamental_number, title, description, pt_map, scripture_pack, estimated_minutes, prerequisites) VALUES

-- 1. The Holy Scriptures
('FB01_HolyScriptures', 1, 'The Holy Scriptures',
 'The Holy Scriptures, Old and New Testaments, are the written Word of God, given by divine inspiration.',
 '{"palace_path": [{"floor": "Foundation Floor", "rooms": ["Story Room", "Definition Room"]}, {"floor": "Investigation Floor", "rooms": ["Concordance Room", "Cross-Reference Room"]}], "principles": ["Dimensions (1D-5D)", "Static Ascension"]}',
 '[{"ref": "2 Timothy 3:16-17", "why": "All Scripture is God-breathed"}, {"ref": "2 Peter 1:20-21", "why": "Prophecy came from the Holy Spirit"}, {"ref": "Psalm 119:105", "why": "Word as lamp and light"}, {"ref": "John 17:17", "why": "Thy word is truth"}, {"ref": "Hebrews 4:12", "why": "Living and powerful Word"}, {"ref": "Isaiah 8:20", "why": "To the law and testimony"}, {"ref": "Proverbs 30:5-6", "why": "Every word of God is pure"}]',
 30, '[]'::jsonb),

-- 2. The Trinity (Godhead)
('FB02_Trinity', 2, 'The Trinity',
 'There is one God: Father, Son, and Holy Spirit, a unity of three co-eternal Persons.',
 '{"palace_path": [{"floor": "Foundation Floor", "rooms": ["Definition Room"]}, {"floor": "Christ-Centered Floor", "rooms": ["Concentration Room"]}, {"floor": "Investigation Floor", "rooms": ["Cross-Reference Room"]}], "principles": ["Dimensions (1D-5D)"]}',
 '[{"ref": "Deuteronomy 6:4", "why": "The Lord our God is one"}, {"ref": "Matthew 28:19", "why": "Baptize in name of Father, Son, Holy Spirit"}, {"ref": "2 Corinthians 13:14", "why": "Trinitarian blessing"}, {"ref": "John 1:1-3", "why": "The Word was God"}, {"ref": "Genesis 1:26", "why": "Let Us make man"}, {"ref": "John 14:16-17", "why": "Another Comforter"}, {"ref": "Isaiah 48:16", "why": "Lord GOD and His Spirit sent me"}]',
 35, '["FB01_HolyScriptures"]'::jsonb),

-- 3. The Father
('FB03_Father', 3, 'God the Father',
 'God the eternal Father is the Creator, Source, Sustainer, and Sovereign of all creation.',
 '{"palace_path": [{"floor": "Foundation Floor", "rooms": ["Story Room"]}, {"floor": "Christ-Centered Floor", "rooms": ["Gospel Room"]}], "principles": ["Concentration"]}',
 '[{"ref": "Genesis 1:1", "why": "In the beginning God created"}, {"ref": "John 3:16", "why": "God so loved the world"}, {"ref": "John 14:9", "why": "He who has seen Me has seen the Father"}, {"ref": "1 Corinthians 8:6", "why": "One God, the Father"}, {"ref": "Ephesians 4:6", "why": "One God and Father of all"}, {"ref": "1 John 4:8", "why": "God is love"}, {"ref": "Psalm 103:13", "why": "As a father pities his children"}]',
 30, '["FB02_Trinity"]'::jsonb),

-- 4. The Son
('FB04_Son', 4, 'God the Son',
 'God the eternal Son became incarnate in Jesus Christ. Through Him all things were created.',
 '{"palace_path": [{"floor": "Christ-Centered Floor", "rooms": ["Concentration Room", "Gospel Room"]}, {"floor": "Prophecy Floor", "rooms": ["Sanctuary Room"]}], "principles": ["Concentration", "Types"]}',
 '[{"ref": "John 1:1-3,14", "why": "The Word became flesh"}, {"ref": "Colossians 1:15-17", "why": "Firstborn of all creation"}, {"ref": "Hebrews 1:1-3", "why": "Express image of His person"}, {"ref": "Philippians 2:5-8", "why": "Emptied Himself"}, {"ref": "Isaiah 53:4-6", "why": "He bore our griefs"}, {"ref": "John 14:6", "why": "I am the way, truth, life"}, {"ref": "Acts 4:12", "why": "No other name for salvation"}]',
 40, '["FB03_Father"]'::jsonb),

-- 5. The Holy Spirit
('FB05_HolySpirit', 5, 'God the Holy Spirit',
 'God the eternal Spirit was active with the Father and Son in Creation, incarnation, and redemption.',
 '{"palace_path": [{"floor": "Foundation Floor", "rooms": ["Definition Room"]}, {"floor": "Christ-Centered Floor", "rooms": ["Gospel Room"]}], "principles": ["Dimensions (1D-5D)"]}',
 '[{"ref": "Genesis 1:2", "why": "Spirit moved on waters"}, {"ref": "John 14:16-18,26", "why": "The Comforter"}, {"ref": "John 16:7-13", "why": "Spirit of truth guides"}, {"ref": "Acts 1:8", "why": "Power when Spirit comes"}, {"ref": "Romans 8:26-27", "why": "Spirit intercedes"}, {"ref": "Galatians 5:22-23", "why": "Fruit of the Spirit"}, {"ref": "Ephesians 4:30", "why": "Do not grieve the Spirit"}]',
 30, '["FB04_Son"]'::jsonb),

-- 6. Creation
('FB06_Creation', 6, 'Creation',
 'God has revealed in Scripture the authentic and historical account of His creative activity.',
 '{"palace_path": [{"floor": "Foundation Floor", "rooms": ["Story Room"]}, {"floor": "Investigation Floor", "rooms": ["Observation Room"]}, {"floor": "Freestyle Floor", "rooms": ["Nature Room"]}], "principles": ["Patterns", "Time-Cycles @Ad"]}',
 '[{"ref": "Genesis 1:1-2:3", "why": "Creation account"}, {"ref": "Exodus 20:8-11", "why": "Six days of creation"}, {"ref": "Psalm 33:6,9", "why": "By the word of the Lord"}, {"ref": "Hebrews 11:3", "why": "By faith we understand"}, {"ref": "Colossians 1:16", "why": "All things created by Him"}, {"ref": "John 1:3", "why": "Without Him nothing was made"}, {"ref": "Psalm 19:1", "why": "Heavens declare glory"}]',
 35, '["FB05_HolySpirit"]'::jsonb),

-- 7. The Nature of Humanity
('FB07_NatureOfHumanity', 7, 'The Nature of Humanity',
 'Man and woman were made in the image of God with individuality, power to think and do.',
 '{"palace_path": [{"floor": "Foundation Floor", "rooms": ["Story Room", "Definition Room"]}, {"floor": "Christ-Centered Floor", "rooms": ["Character Room"]}], "principles": ["Dimensions (1D-5D)"]}',
 '[{"ref": "Genesis 1:26-28", "why": "Made in Gods image"}, {"ref": "Genesis 2:7", "why": "Breath of life"}, {"ref": "Genesis 2:15", "why": "To tend the garden"}, {"ref": "Psalm 8:4-8", "why": "A little lower than angels"}, {"ref": "Acts 17:26-28", "why": "In Him we live and move"}, {"ref": "Genesis 3:1-6", "why": "The fall"}, {"ref": "Romans 5:12", "why": "Sin entered through one man"}]',
 30, '["FB06_Creation"]'::jsonb),

-- 8. The Great Controversy
('FB08_GreatControversy', 8, 'The Great Controversy',
 'All humanity is now involved in a great controversy between Christ and Satan.',
 '{"palace_path": [{"floor": "Prophecy Floor", "rooms": ["Prophecy Room", "Three Angels Room"]}, {"floor": "Investigation Floor", "rooms": ["Patterns Room"]}], "principles": ["Time-Cycles", "Parallels"]}',
 '[{"ref": "Revelation 12:7-9", "why": "War in heaven"}, {"ref": "Isaiah 14:12-14", "why": "Lucifers fall"}, {"ref": "Ezekiel 28:12-17", "why": "Origin of evil"}, {"ref": "Genesis 3:15", "why": "Enmity between seeds"}, {"ref": "Job 1:6-12", "why": "Satan accuses Job"}, {"ref": "Zechariah 3:1-5", "why": "Satan accuses Joshua"}, {"ref": "Revelation 12:17", "why": "War with remnant"}]',
 40, '["FB07_NatureOfHumanity"]'::jsonb),

-- 9. The Life, Death, and Resurrection of Christ
('FB09_LifeDeathResurrection', 9, 'The Life, Death, and Resurrection of Christ',
 'In Christs life of perfect obedience, suffering, death, and resurrection, God provided the only means of atonement.',
 '{"palace_path": [{"floor": "Christ-Centered Floor", "rooms": ["Concentration Room", "Gospel Room"]}, {"floor": "Prophecy Floor", "rooms": ["Sanctuary Room"]}], "principles": ["Concentration", "Types", "Parallels"]}',
 '[{"ref": "John 3:16", "why": "God gave His only Son"}, {"ref": "Isaiah 53:4-12", "why": "Suffering servant"}, {"ref": "1 Corinthians 15:3-4", "why": "Died, buried, rose"}, {"ref": "Romans 6:23", "why": "Gift of God is eternal life"}, {"ref": "1 Peter 2:21-24", "why": "He bore our sins"}, {"ref": "Hebrews 2:9", "why": "Tasted death for everyone"}, {"ref": "Romans 4:25", "why": "Raised for justification"}]',
 45, '["FB08_GreatControversy"]'::jsonb),

-- 10. The Experience of Salvation
('FB10_ExperienceOfSalvation', 10, 'The Experience of Salvation',
 'In infinite love and mercy God made Christ to be sin for us, that we might be made righteousness.',
 '{"palace_path": [{"floor": "Christ-Centered Floor", "rooms": ["Gospel Room"]}, {"floor": "Community Floor", "rooms": ["Life Application Room"]}], "principles": ["Dimensions (1D-5D)"]}',
 '[{"ref": "2 Corinthians 5:17-21", "why": "New creation in Christ"}, {"ref": "John 3:3-8", "why": "Born again"}, {"ref": "Romans 8:1-4", "why": "No condemnation"}, {"ref": "Galatians 2:20", "why": "Christ lives in me"}, {"ref": "Ephesians 2:8-10", "why": "Saved by grace through faith"}, {"ref": "Romans 5:1", "why": "Justified by faith"}, {"ref": "1 John 2:1-2", "why": "Advocate with the Father"}]',
 35, '["FB09_LifeDeathResurrection"]'::jsonb),

-- 11. Growing in Christ
('FB11_GrowingInChrist', 11, 'Growing in Christ',
 'By His death on the cross Jesus triumphed over evil. We grow as we daily submit to Him.',
 '{"palace_path": [{"floor": "Christ-Centered Floor", "rooms": ["Character Room"]}, {"floor": "Community Floor", "rooms": ["Life Application Room"]}], "principles": ["Fruit Test"]}',
 '[{"ref": "Colossians 2:6,15", "why": "Walk in Him"}, {"ref": "2 Peter 3:18", "why": "Grow in grace"}, {"ref": "Ephesians 4:13-15", "why": "Grow up into Christ"}, {"ref": "Philippians 2:12-13", "why": "Work out salvation"}, {"ref": "Romans 12:1-2", "why": "Transformed by renewing mind"}, {"ref": "Galatians 5:22-25", "why": "Walk in the Spirit"}, {"ref": "2 Corinthians 3:18", "why": "Changed from glory to glory"}]',
 30, '["FB10_ExperienceOfSalvation"]'::jsonb),

-- 12. The Church
('FB12_Church', 12, 'The Church',
 'The church is the community of believers who confess Jesus Christ as Lord and Savior.',
 '{"palace_path": [{"floor": "Community Floor", "rooms": ["House Fire Room", "Mission Room"]}, {"floor": "Foundation Floor", "rooms": ["Definition Room"]}], "principles": ["Dimensions (1D-5D)"]}',
 '[{"ref": "Matthew 16:18", "why": "I will build My church"}, {"ref": "Ephesians 1:22-23", "why": "Church is His body"}, {"ref": "1 Corinthians 12:12-27", "why": "One body, many members"}, {"ref": "Ephesians 4:11-16", "why": "Gifts for building up"}, {"ref": "Matthew 28:19-20", "why": "Go and make disciples"}, {"ref": "Acts 2:42-47", "why": "Early church fellowship"}, {"ref": "Colossians 1:18", "why": "Head of the body"}]',
 30, '["FB11_GrowingInChrist"]'::jsonb),

-- 13. The Remnant and Its Mission
('FB13_Remnant', 13, 'The Remnant and Its Mission',
 'The universal church includes all who truly believe in Christ. In the last days, a remnant has been called out.',
 '{"palace_path": [{"floor": "Prophecy Floor", "rooms": ["Three Angels Room", "Prophecy Room"]}, {"floor": "Community Floor", "rooms": ["Mission Room"]}], "principles": ["Time-Cycles @Re", "Patterns"]}',
 '[{"ref": "Revelation 12:17", "why": "Remnant keeps commandments"}, {"ref": "Revelation 14:6-12", "why": "Three angels messages"}, {"ref": "Revelation 19:10", "why": "Testimony of Jesus"}, {"ref": "2 Corinthians 5:20", "why": "Ambassadors for Christ"}, {"ref": "Matthew 24:14", "why": "Gospel to all nations"}, {"ref": "Isaiah 1:9", "why": "Remnant preserved"}, {"ref": "Romans 11:5", "why": "Remnant by grace"}]',
 40, '["FB12_Church"]'::jsonb),

-- 14. Unity in the Body of Christ
('FB14_Unity', 14, 'Unity in the Body of Christ',
 'The church is one body with many members, called from every nation, kindred, tongue, and people.',
 '{"palace_path": [{"floor": "Community Floor", "rooms": ["House Fire Room"]}, {"floor": "Christ-Centered Floor", "rooms": ["Gospel Room"]}], "principles": ["Parallels"]}',
 '[{"ref": "Ephesians 4:1-6", "why": "One Lord, one faith, one baptism"}, {"ref": "John 17:20-23", "why": "That they may be one"}, {"ref": "Galatians 3:28", "why": "All one in Christ"}, {"ref": "Colossians 3:10-15", "why": "Put on love"}, {"ref": "Romans 12:4-5", "why": "One body in Christ"}, {"ref": "1 Corinthians 1:10", "why": "Be perfectly joined"}, {"ref": "Psalm 133:1", "why": "Dwell together in unity"}]',
 25, '["FB13_Remnant"]'::jsonb),

-- 15. Baptism
('FB15_Baptism', 15, 'Baptism',
 'By baptism we confess our faith in the death and resurrection of Jesus Christ.',
 '{"palace_path": [{"floor": "Christ-Centered Floor", "rooms": ["Gospel Room"]}, {"floor": "Investigation Floor", "rooms": ["Types Room"]}], "principles": ["Types", "Parallels"]}',
 '[{"ref": "Matthew 28:19-20", "why": "Baptize in the name"}, {"ref": "Romans 6:1-6", "why": "Buried with Him in baptism"}, {"ref": "Colossians 2:12-13", "why": "Raised with Him"}, {"ref": "Acts 2:38", "why": "Repent and be baptized"}, {"ref": "Acts 22:16", "why": "Wash away sins"}, {"ref": "Mark 1:9-11", "why": "Jesus baptism"}, {"ref": "1 Peter 3:21", "why": "Baptism saves us"}]',
 35, '["FB14_Unity"]'::jsonb),

-- 16. The Lords Supper
('FB16_LordsSupper', 16, 'The Lords Supper',
 'The Lords Supper is a participation in the emblems of the body and blood of Jesus.',
 '{"palace_path": [{"floor": "Prophecy Floor", "rooms": ["Sanctuary Room"]}, {"floor": "Christ-Centered Floor", "rooms": ["Concentration Room"]}], "principles": ["Types", "Concentration"]}',
 '[{"ref": "1 Corinthians 11:23-26", "why": "Do this in remembrance"}, {"ref": "Matthew 26:26-28", "why": "This is My body, blood"}, {"ref": "John 6:48-58", "why": "Bread of life"}, {"ref": "1 Corinthians 10:16-17", "why": "Communion of body"}, {"ref": "John 13:1-17", "why": "Foot washing"}, {"ref": "Exodus 12:1-14", "why": "Passover type"}, {"ref": "Matthew 26:29", "why": "Until Kingdom comes"}]',
 30, '["FB15_Baptism"]'::jsonb),

-- 17. Spiritual Gifts and Ministries
('FB17_SpiritualGifts', 17, 'Spiritual Gifts and Ministries',
 'God bestows upon all members spiritual gifts which each member is to employ.',
 '{"palace_path": [{"floor": "Community Floor", "rooms": ["Mission Room"]}, {"floor": "Foundation Floor", "rooms": ["Definition Room"]}], "principles": ["Fruit Test"]}',
 '[{"ref": "1 Corinthians 12:4-11", "why": "Varieties of gifts"}, {"ref": "Romans 12:6-8", "why": "Gifts differing by grace"}, {"ref": "Ephesians 4:11-13", "why": "For equipping saints"}, {"ref": "1 Peter 4:10-11", "why": "Minister gifts to one another"}, {"ref": "Acts 6:1-7", "why": "Deacons appointed"}, {"ref": "1 Corinthians 12:28", "why": "God appointed in church"}, {"ref": "Matthew 25:14-30", "why": "Parable of talents"}]',
 30, '["FB16_LordsSupper"]'::jsonb),

-- 18. The Gift of Prophecy
('FB18_GiftOfProphecy', 18, 'The Gift of Prophecy',
 'The Scriptures testify that one of the gifts of the Holy Spirit is prophecy.',
 '{"palace_path": [{"floor": "Prophecy Floor", "rooms": ["Prophecy Room"]}, {"floor": "Investigation Floor", "rooms": ["Observation Room"]}], "principles": ["Time-Cycles", "Fruit Test"]}',
 '[{"ref": "Revelation 19:10", "why": "Testimony of Jesus is spirit of prophecy"}, {"ref": "Revelation 12:17", "why": "Remnant has testimony"}, {"ref": "Amos 3:7", "why": "God reveals to prophets"}, {"ref": "Joel 2:28-29", "why": "Pour out Spirit, prophesy"}, {"ref": "1 Corinthians 14:1-4", "why": "Desire spiritual gifts"}, {"ref": "1 Thessalonians 5:20-21", "why": "Do not despise prophecies"}, {"ref": "Numbers 12:6", "why": "Vision and dream"}]',
 35, '["FB17_SpiritualGifts"]'::jsonb),

-- 19. The Law of God
('FB19_LawOfGod', 19, 'The Law of God',
 'The great principles of Gods law are embodied in the Ten Commandments and exemplified in Christs life.',
 '{"palace_path": [{"floor": "Foundation Floor", "rooms": ["Definition Room"]}, {"floor": "Prophecy Floor", "rooms": ["Sanctuary Room"]}, {"floor": "Christ-Centered Floor", "rooms": ["Character Room"]}], "principles": ["Concentration", "Types"]}',
 '[{"ref": "Exodus 20:1-17", "why": "Ten Commandments"}, {"ref": "Matthew 22:37-40", "why": "Love God and neighbor"}, {"ref": "Matthew 5:17-20", "why": "Not to abolish but fulfill"}, {"ref": "Romans 7:12", "why": "Law is holy"}, {"ref": "James 2:10-12", "why": "Law of liberty"}, {"ref": "Psalm 19:7-11", "why": "Law is perfect"}, {"ref": "1 John 5:3", "why": "His commandments not burdensome"}]',
 40, '["FB18_GiftOfProphecy"]'::jsonb),

-- 20. The Sabbath
('FB20_Sabbath', 20, 'The Sabbath',
 'The gracious Creator rested on the seventh day and instituted the Sabbath for all people.',
 '{"palace_path": [{"floor": "Foundation Floor", "rooms": ["Story Room"]}, {"floor": "Prophecy Floor", "rooms": ["Sanctuary Room"]}, {"floor": "Christ-Centered Floor", "rooms": ["Concentration Room"]}], "principles": ["Types", "Parallels", "Time-Cycles"]}',
 '[{"ref": "Genesis 2:1-3", "why": "God rested, blessed, sanctified"}, {"ref": "Exodus 20:8-11", "why": "Remember the Sabbath"}, {"ref": "Mark 2:27-28", "why": "Sabbath made for man"}, {"ref": "Luke 4:16", "why": "Jesus custom on Sabbath"}, {"ref": "Isaiah 58:13-14", "why": "Call Sabbath a delight"}, {"ref": "Ezekiel 20:12,20", "why": "Sign between God and us"}, {"ref": "Hebrews 4:9-10", "why": "Sabbath rest remains"}]',
 45, '["FB19_LawOfGod"]'::jsonb),

-- 21. Stewardship
('FB21_Stewardship', 21, 'Stewardship',
 'We are Gods stewards, entrusted with time, opportunities, abilities, possessions, and the earth.',
 '{"palace_path": [{"floor": "Community Floor", "rooms": ["Life Application Room"]}, {"floor": "Foundation Floor", "rooms": ["Definition Room"]}], "principles": ["Fruit Test"]}',
 '[{"ref": "Genesis 1:26-28", "why": "Dominion given"}, {"ref": "1 Chronicles 29:14", "why": "All things come from You"}, {"ref": "Malachi 3:8-12", "why": "Tithes and offerings"}, {"ref": "Matthew 25:14-30", "why": "Stewardship parable"}, {"ref": "1 Corinthians 6:19-20", "why": "Body is temple"}, {"ref": "Luke 12:42-48", "why": "Faithful steward"}, {"ref": "2 Corinthians 9:6-7", "why": "Cheerful giver"}]',
 30, '["FB20_Sabbath"]'::jsonb),

-- 22. Christian Behavior
('FB22_ChristianBehavior', 22, 'Christian Behavior',
 'We are called to be a godly people who think, feel, and act in harmony with biblical principles.',
 '{"palace_path": [{"floor": "Christ-Centered Floor", "rooms": ["Character Room"]}, {"floor": "Community Floor", "rooms": ["Life Application Room"]}], "principles": ["Fruit Test", "Dimensions (1D-5D)"]}',
 '[{"ref": "1 John 2:6", "why": "Walk as He walked"}, {"ref": "Ephesians 5:1-11", "why": "Walk as children of light"}, {"ref": "Romans 12:1-2", "why": "Living sacrifice"}, {"ref": "1 Corinthians 10:31", "why": "Do all to glory of God"}, {"ref": "Philippians 4:8", "why": "Think on these things"}, {"ref": "1 Peter 3:3-4", "why": "Adorning the heart"}, {"ref": "3 John 1:2", "why": "Prosper and be in health"}]',
 30, '["FB21_Stewardship"]'::jsonb),

-- 23. Marriage and the Family
('FB23_MarriageFamily', 23, 'Marriage and the Family',
 'Marriage was divinely established in Eden and affirmed by Jesus as a lifelong union.',
 '{"palace_path": [{"floor": "Foundation Floor", "rooms": ["Story Room"]}, {"floor": "Community Floor", "rooms": ["House Fire Room"]}], "principles": ["Patterns", "Types"]}',
 '[{"ref": "Genesis 2:18-25", "why": "Institution of marriage"}, {"ref": "Matthew 19:3-9", "why": "What God joined"}, {"ref": "Ephesians 5:21-33", "why": "Husbands and wives"}, {"ref": "Proverbs 22:6", "why": "Train up a child"}, {"ref": "Malachi 4:5-6", "why": "Turn hearts of fathers"}, {"ref": "Colossians 3:18-21", "why": "Family relationships"}, {"ref": "Deuteronomy 6:5-9", "why": "Teach diligently"}]',
 30, '["FB22_ChristianBehavior"]'::jsonb),

-- 24. Christs Ministry in the Heavenly Sanctuary
('FB24_HeavenlySanctuary', 24, 'Christs Ministry in the Heavenly Sanctuary',
 'There is a sanctuary in heaven. Christ ministers there on our behalf.',
 '{"palace_path": [{"floor": "Prophecy Floor", "rooms": ["Sanctuary Room", "Prophecy Room"]}, {"floor": "Christ-Centered Floor", "rooms": ["Concentration Room"]}], "principles": ["Types", "Parallels", "Time-Cycles @CyC"]}',
 '[{"ref": "Hebrews 8:1-5", "why": "Minister of true tabernacle"}, {"ref": "Hebrews 9:11-12", "why": "Greater tabernacle"}, {"ref": "Daniel 8:14", "why": "2300 days, sanctuary cleansed"}, {"ref": "Hebrews 4:14-16", "why": "Great High Priest"}, {"ref": "Leviticus 16:1-34", "why": "Day of Atonement type"}, {"ref": "Revelation 11:19", "why": "Temple opened in heaven"}, {"ref": "1 John 2:1", "why": "Advocate with Father"}]',
 50, '["FB23_MarriageFamily"]'::jsonb),

-- 25. The Second Coming of Christ
('FB25_SecondComing', 25, 'The Second Coming of Christ',
 'The second coming of Christ is the blessed hope of the church.',
 '{"palace_path": [{"floor": "Prophecy Floor", "rooms": ["Prophecy Room", "Three Angels Room"]}, {"floor": "Christ-Centered Floor", "rooms": ["Gospel Room"]}], "principles": ["Time-Cycles @Re", "Patterns"]}',
 '[{"ref": "John 14:1-3", "why": "I will come again"}, {"ref": "Acts 1:9-11", "why": "Same Jesus will return"}, {"ref": "Matthew 24:27,30-31", "why": "Coming in clouds"}, {"ref": "1 Thessalonians 4:16-17", "why": "Caught up together"}, {"ref": "Titus 2:13", "why": "Blessed hope"}, {"ref": "Revelation 1:7", "why": "Every eye will see"}, {"ref": "Matthew 24:36,44", "why": "No one knows the day"}]',
 40, '["FB24_HeavenlySanctuary"]'::jsonb),

-- 26. Death and Resurrection
('FB26_DeathResurrection', 26, 'Death and Resurrection',
 'The wages of sin is death. But God grants eternal life to the redeemed.',
 '{"palace_path": [{"floor": "Foundation Floor", "rooms": ["Definition Room"]}, {"floor": "Christ-Centered Floor", "rooms": ["Gospel Room"]}], "principles": ["Types", "Patterns"]}',
 '[{"ref": "Romans 6:23", "why": "Wages of sin is death"}, {"ref": "Ecclesiastes 9:5-6", "why": "Dead know nothing"}, {"ref": "Psalm 146:4", "why": "Thoughts perish"}, {"ref": "John 11:11-14", "why": "Death is sleep"}, {"ref": "1 Corinthians 15:51-55", "why": "Resurrection at last trump"}, {"ref": "1 Thessalonians 4:13-16", "why": "Dead in Christ rise"}, {"ref": "John 5:28-29", "why": "All in graves hear voice"}]',
 35, '["FB25_SecondComing"]'::jsonb),

-- 27. The Millennium and the End of Sin
('FB27_Millennium', 27, 'The Millennium and the End of Sin',
 'The millennium is the thousand-year reign of Christ with His saints in heaven.',
 '{"palace_path": [{"floor": "Prophecy Floor", "rooms": ["Prophecy Room", "Three Angels Room"]}, {"floor": "Investigation Floor", "rooms": ["Cross-Reference Room"]}], "principles": ["Time-Cycles", "Three Heavens"]}',
 '[{"ref": "Revelation 20:1-6", "why": "Thousand years"}, {"ref": "Revelation 20:7-10", "why": "Satan loosed, then destroyed"}, {"ref": "Jeremiah 4:23-26", "why": "Earth without form"}, {"ref": "2 Peter 3:10-13", "why": "Elements melt"}, {"ref": "Malachi 4:1-3", "why": "Day burning as oven"}, {"ref": "Revelation 21:1", "why": "New heaven and earth"}, {"ref": "1 Corinthians 6:2-3", "why": "Saints judge world"}]',
 40, '["FB26_DeathResurrection"]'::jsonb),

-- 28. The New Earth
('FB28_NewEarth', 28, 'The New Earth',
 'On the new earth God will provide an eternal home for the redeemed.',
 '{"palace_path": [{"floor": "Prophecy Floor", "rooms": ["Three Angels Room"]}, {"floor": "Christ-Centered Floor", "rooms": ["Gospel Room"]}, {"floor": "Memory Floor", "rooms": ["24FPS Room"]}], "principles": ["Three Heavens 3H", "Parallels"]}',
 '[{"ref": "Revelation 21:1-7", "why": "New heaven and earth"}, {"ref": "Revelation 22:1-5", "why": "River of life, tree of life"}, {"ref": "Isaiah 65:17-25", "why": "New heavens and earth"}, {"ref": "2 Peter 3:13", "why": "New earth where righteousness dwells"}, {"ref": "Isaiah 11:6-9", "why": "Wolf dwells with lamb"}, {"ref": "Revelation 21:4", "why": "No more death or tears"}, {"ref": "1 Corinthians 2:9", "why": "Eye has not seen"}]',
 35, '["FB27_Millennium"]'::jsonb);

-- ============================================
-- TRIGGER: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_baptism_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_baptism_candidate_progress_timestamp
  BEFORE UPDATE ON public.baptism_candidate_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_baptism_progress_timestamp();
