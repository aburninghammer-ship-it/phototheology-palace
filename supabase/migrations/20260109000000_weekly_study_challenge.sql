-- Weekly Study Challenge Tables
-- Creates unified weekly study challenge system with Jeeves judging

-- Table 1: Weekly Study Challenges
CREATE TABLE IF NOT EXISTS weekly_study_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  anchor_passage TEXT NOT NULL,
  study_prompt TEXT NOT NULL,
  pt_focus TEXT[] DEFAULT '{}',
  difficulty TEXT DEFAULT 'intermediate',
  hints JSONB,
  status TEXT DEFAULT 'active',
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(week_number, year)
);

-- Table 2: Weekly Study Submissions
CREATE TABLE IF NOT EXISTS weekly_study_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES weekly_study_challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Submission content
  main_insight TEXT NOT NULL,
  scripture_connections TEXT[] DEFAULT '{}',
  pt_principles_applied TEXT[] DEFAULT '{}',
  practical_application TEXT,
  supporting_evidence TEXT,

  -- Metadata
  time_spent INTEGER,
  word_count INTEGER,

  -- AI Evaluation (filled by Jeeves)
  ai_score INTEGER,
  depth_score INTEGER,
  biblical_score INTEGER,
  pt_score INTEGER,
  clarity_score INTEGER,
  ai_feedback TEXT,
  highlight_quotes TEXT[] DEFAULT '{}',

  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(challenge_id, user_id)
);

-- Table 3: Weekly Study Winners
CREATE TABLE IF NOT EXISTS weekly_study_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES weekly_study_challenges(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES weekly_study_submissions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  rank INTEGER NOT NULL,
  jeeves_commentary TEXT NOT NULL,
  standout_insight TEXT,
  xp_awarded INTEGER DEFAULT 0,
  badge_awarded TEXT,

  announced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 4: Weekly Sermon Suggestions
CREATE TABLE IF NOT EXISTS weekly_sermon_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  topic_id UUID REFERENCES sermon_topics(id),
  title TEXT NOT NULL,
  preview TEXT,
  anchor_passage TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 5: Weekly Challenge Shares (for viral growth)
CREATE TABLE IF NOT EXISTS weekly_challenge_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES weekly_study_challenges(id) ON DELETE CASCADE,
  sharer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  share_code TEXT UNIQUE NOT NULL,
  share_platform TEXT,  -- twitter, facebook, whatsapp, email, link
  clicks INTEGER DEFAULT 0,
  signups INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 6: Guest Contributions (non-users can leave thoughts)
CREATE TABLE IF NOT EXISTS weekly_challenge_guest_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES weekly_study_challenges(id) ON DELETE CASCADE,
  share_id UUID REFERENCES weekly_challenge_shares(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  contribution TEXT NOT NULL,
  ip_hash TEXT,  -- For rate limiting, hashed for privacy
  converted_to_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table 7: Referral tracking for signups from challenge shares
CREATE TABLE IF NOT EXISTS weekly_challenge_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id UUID REFERENCES weekly_challenge_shares(id),
  referrer_user_id UUID REFERENCES auth.users(id),
  referred_user_id UUID REFERENCES auth.users(id),
  challenge_id UUID REFERENCES weekly_study_challenges(id),
  xp_awarded INTEGER DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_status ON weekly_study_challenges(status);
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_dates ON weekly_study_challenges(starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_weekly_submissions_challenge ON weekly_study_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_weekly_submissions_user ON weekly_study_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_submissions_score ON weekly_study_submissions(ai_score DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_winners_challenge ON weekly_study_winners(challenge_id);
CREATE INDEX IF NOT EXISTS idx_weekly_winners_user ON weekly_study_winners(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_shares_code ON weekly_challenge_shares(share_code);
CREATE INDEX IF NOT EXISTS idx_weekly_shares_challenge ON weekly_challenge_shares(challenge_id);
CREATE INDEX IF NOT EXISTS idx_weekly_guest_contributions_challenge ON weekly_challenge_guest_contributions(challenge_id);

-- RLS Policies

-- Challenges: Public read, admin write
ALTER TABLE weekly_study_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active challenges" ON weekly_study_challenges
  FOR SELECT USING (status IN ('active', 'closed', 'judged'));

CREATE POLICY "Admins can manage challenges" ON weekly_study_challenges
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Submissions: Users can manage their own, view others after submitting
ALTER TABLE weekly_study_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own submissions" ON weekly_study_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own submissions" ON weekly_study_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view others after submitting" ON weekly_study_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM weekly_study_submissions s
      WHERE s.challenge_id = weekly_study_submissions.challenge_id
      AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own submissions" ON weekly_study_submissions
  FOR UPDATE USING (auth.uid() = user_id);

-- Winners: Public read
ALTER TABLE weekly_study_winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view winners" ON weekly_study_winners
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage winners" ON weekly_study_winners
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Sermon Suggestions: Public read
ALTER TABLE weekly_sermon_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sermon suggestions" ON weekly_sermon_suggestions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage suggestions" ON weekly_sermon_suggestions
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Function to get current week's challenge
CREATE OR REPLACE FUNCTION get_current_weekly_challenge()
RETURNS weekly_study_challenges AS $$
  SELECT * FROM weekly_study_challenges
  WHERE status = 'active'
  AND now() BETWEEN starts_at AND ends_at
  ORDER BY created_at DESC
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Function to get user's submission for current week
CREATE OR REPLACE FUNCTION get_user_weekly_submission(p_user_id UUID)
RETURNS weekly_study_submissions AS $$
  SELECT s.* FROM weekly_study_submissions s
  JOIN weekly_study_challenges c ON s.challenge_id = c.id
  WHERE s.user_id = p_user_id
  AND c.status = 'active'
  AND now() BETWEEN c.starts_at AND c.ends_at
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_weekly_challenge_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_weekly_challenges_timestamp
  BEFORE UPDATE ON weekly_study_challenges
  FOR EACH ROW EXECUTE FUNCTION update_weekly_challenge_timestamp();

CREATE TRIGGER update_weekly_submissions_timestamp
  BEFORE UPDATE ON weekly_study_submissions
  FOR EACH ROW EXECUTE FUNCTION update_weekly_challenge_timestamp();

-- RLS for Shares
ALTER TABLE weekly_challenge_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own shares" ON weekly_challenge_shares
  FOR INSERT WITH CHECK (auth.uid() = sharer_user_id);

CREATE POLICY "Anyone can view shares by code" ON weekly_challenge_shares
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own shares" ON weekly_challenge_shares
  FOR UPDATE USING (auth.uid() = sharer_user_id);

-- RLS for Guest Contributions (public insert, read)
ALTER TABLE weekly_challenge_guest_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create guest contributions" ON weekly_challenge_guest_contributions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view guest contributions" ON weekly_challenge_guest_contributions
  FOR SELECT USING (true);

-- RLS for Referrals
ALTER TABLE weekly_challenge_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their referrals" ON weekly_challenge_referrals
  FOR SELECT USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

-- Function to create a share link
CREATE OR REPLACE FUNCTION create_challenge_share(
  p_challenge_id UUID,
  p_platform TEXT DEFAULT 'link'
)
RETURNS weekly_challenge_shares AS $$
DECLARE
  v_share weekly_challenge_shares;
  v_code TEXT;
BEGIN
  -- Generate unique share code
  v_code := encode(gen_random_bytes(6), 'base64');
  v_code := replace(replace(v_code, '+', '-'), '/', '_');

  INSERT INTO weekly_challenge_shares (challenge_id, sharer_user_id, share_code, share_platform)
  VALUES (p_challenge_id, auth.uid(), v_code, p_platform)
  RETURNING * INTO v_share;

  RETURN v_share;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track share click
CREATE OR REPLACE FUNCTION track_share_click(p_share_code TEXT)
RETURNS void AS $$
BEGIN
  UPDATE weekly_challenge_shares
  SET clicks = clicks + 1
  WHERE share_code = p_share_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
