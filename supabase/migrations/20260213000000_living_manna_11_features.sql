-- =================================================================
-- Living Manna: 11 New Features Migration
-- 20 new tables + 3 helper functions
-- =================================================================

-- =============================================
-- FEATURE 1: GIVING & TITHE PORTAL
-- =============================================

CREATE TABLE IF NOT EXISTS public.church_giving_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  giving_type TEXT NOT NULL DEFAULT 'tithe' CHECK (giving_type IN ('tithe', 'offering', 'building_fund', 'missions', 'special', 'other')),
  designation TEXT,
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT,
  payment_method TEXT DEFAULT 'card' CHECK (payment_method IN ('card', 'bank', 'cash', 'check', 'other')),
  is_recurring BOOLEAN DEFAULT false,
  recurring_interval TEXT CHECK (recurring_interval IN ('weekly', 'biweekly', 'monthly', 'quarterly', 'annually')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  is_tax_deductible BOOLEAN DEFAULT true,
  receipt_sent BOOLEAN DEFAULT false,
  receipt_sent_at TIMESTAMPTZ,
  note TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.church_giving_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  target_amount_cents INTEGER NOT NULL,
  current_amount_cents INTEGER DEFAULT 0,
  giving_type TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_church_giving_records_church ON public.church_giving_records(church_id);
CREATE INDEX IF NOT EXISTS idx_church_giving_records_user ON public.church_giving_records(user_id);
CREATE INDEX IF NOT EXISTS idx_church_giving_records_date ON public.church_giving_records(created_at);
CREATE INDEX IF NOT EXISTS idx_church_giving_goals_church ON public.church_giving_goals(church_id);

ALTER TABLE public.church_giving_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_giving_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own giving records"
  ON public.church_giving_records FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_giving_records.church_id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert own giving records"
  ON public.church_giving_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update giving records"
  ON public.church_giving_records FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_giving_records.church_id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );

CREATE POLICY "Members can view giving goals"
  ON public.church_giving_goals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_giving_goals.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage giving goals"
  ON public.church_giving_goals FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_giving_goals.church_id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );


-- =============================================
-- FEATURE 2: VOLUNTEER / MINISTRY SIGN-UP
-- =============================================

CREATE TABLE IF NOT EXISTS public.church_ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN (
    'worship', 'av_tech', 'greeting', 'music', 'childrens',
    'youth', 'outreach', 'hospitality', 'prayer', 'administration', 'general'
  )),
  leader_user_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  max_volunteers INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.church_ministry_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ministry_id UUID NOT NULL REFERENCES public.church_ministries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  slot_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  volunteers_needed INTEGER DEFAULT 1,
  volunteers_filled INTEGER DEFAULT 0,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.church_ministry_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES public.church_ministry_slots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  ministry_id UUID NOT NULL REFERENCES public.church_ministries(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  note TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(slot_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_church_ministries_church ON public.church_ministries(church_id);
CREATE INDEX IF NOT EXISTS idx_church_ministry_slots_ministry ON public.church_ministry_slots(ministry_id);
CREATE INDEX IF NOT EXISTS idx_church_ministry_slots_date ON public.church_ministry_slots(slot_date);
CREATE INDEX IF NOT EXISTS idx_church_ministry_signups_user ON public.church_ministry_signups(user_id);
CREATE INDEX IF NOT EXISTS idx_church_ministry_signups_slot ON public.church_ministry_signups(slot_id);

ALTER TABLE public.church_ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_ministry_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_ministry_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view ministries"
  ON public.church_ministries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_ministries.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can manage ministries"
  ON public.church_ministries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_ministries.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader')
    )
  );

CREATE POLICY "Members can view slots"
  ON public.church_ministry_slots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_ministries m
      JOIN public.church_members cm ON cm.church_id = m.church_id
      WHERE m.id = church_ministry_slots.ministry_id AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can manage slots"
  ON public.church_ministry_slots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_ministries m
      JOIN public.church_members cm ON cm.church_id = m.church_id
      WHERE m.id = church_ministry_slots.ministry_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'leader')
    )
  );

CREATE POLICY "Users can manage own signups"
  ON public.church_ministry_signups FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Leaders can view all signups"
  ON public.church_ministry_signups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_ministries m
      JOIN public.church_members cm ON cm.church_id = m.church_id
      WHERE m.id = church_ministry_signups.ministry_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'leader')
    )
  );


-- =============================================
-- FEATURE 3: WEEKLY MEMORY VERSE
-- =============================================

CREATE TABLE IF NOT EXISTS public.church_weekly_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  study_id UUID REFERENCES public.church_central_studies(id) ON DELETE SET NULL,
  verse_reference TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  translation TEXT DEFAULT 'KJV',
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  memory_verse_list_id UUID,
  total_memorizers INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.church_weekly_verse_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_verse_id UUID NOT NULL REFERENCES public.church_weekly_verses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT DEFAULT 'started' CHECK (status IN ('started', 'practicing', 'memorized', 'mastered')),
  practice_count INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  mastered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(weekly_verse_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_church_weekly_verses_church ON public.church_weekly_verses(church_id);
CREATE INDEX IF NOT EXISTS idx_church_weekly_verses_week ON public.church_weekly_verses(week_start);
CREATE INDEX IF NOT EXISTS idx_church_weekly_verse_progress_verse ON public.church_weekly_verse_progress(weekly_verse_id);
CREATE INDEX IF NOT EXISTS idx_church_weekly_verse_progress_user ON public.church_weekly_verse_progress(user_id);

ALTER TABLE public.church_weekly_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_weekly_verse_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view weekly verses"
  ON public.church_weekly_verses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_weekly_verses.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can manage weekly verses"
  ON public.church_weekly_verses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_weekly_verses.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader')
    )
  );

CREATE POLICY "Users can manage own verse progress"
  ON public.church_weekly_verse_progress FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Members can view congregation progress"
  ON public.church_weekly_verse_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_weekly_verses wv
      JOIN public.church_members cm ON cm.church_id = wv.church_id
      WHERE wv.id = church_weekly_verse_progress.weekly_verse_id AND cm.user_id = auth.uid()
    )
  );


-- =============================================
-- FEATURE 4: CARE MINISTRY / MEAL TRAIN
-- =============================================

CREATE TABLE IF NOT EXISTS public.church_care_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  care_type TEXT NOT NULL CHECK (care_type IN ('meal_train', 'visit', 'transportation', 'childcare', 'errand', 'prayer', 'financial', 'other')),
  recipient_name TEXT NOT NULL,
  recipient_user_id UUID REFERENCES auth.users(id),
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'fulfilled', 'closed')),
  visibility TEXT DEFAULT 'members' CHECK (visibility IN ('members', 'leaders_only')),
  is_urgent BOOLEAN DEFAULT false,
  pastoral_notified BOOLEAN DEFAULT false,
  pastoral_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.church_care_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  care_request_id UUID NOT NULL REFERENCES public.church_care_requests(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES auth.users(id),
  response_type TEXT NOT NULL,
  scheduled_date DATE,
  scheduled_time TIME,
  notes TEXT,
  dietary_notes TEXT,
  status TEXT DEFAULT 'committed' CHECK (status IN ('committed', 'completed', 'cancelled')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(care_request_id, volunteer_id, scheduled_date)
);

CREATE INDEX IF NOT EXISTS idx_church_care_requests_church ON public.church_care_requests(church_id);
CREATE INDEX IF NOT EXISTS idx_church_care_requests_status ON public.church_care_requests(status);
CREATE INDEX IF NOT EXISTS idx_church_care_responses_request ON public.church_care_responses(care_request_id);
CREATE INDEX IF NOT EXISTS idx_church_care_responses_volunteer ON public.church_care_responses(volunteer_id);

ALTER TABLE public.church_care_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_care_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view care requests"
  ON public.church_care_requests FOR SELECT
  USING (
    (visibility = 'members' AND EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_care_requests.church_id AND user_id = auth.uid()
    )) OR
    (visibility = 'leaders_only' AND EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_care_requests.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader')
    )) OR
    auth.uid() = requester_id
  );

CREATE POLICY "Members can create care requests"
  ON public.church_care_requests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_care_requests.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Requesters and leaders can update care requests"
  ON public.church_care_requests FOR UPDATE
  USING (
    auth.uid() = requester_id OR
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_care_requests.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader')
    )
  );

CREATE POLICY "Users can manage own care responses"
  ON public.church_care_responses FOR ALL
  USING (auth.uid() = volunteer_id);

CREATE POLICY "Members can view care responses"
  ON public.church_care_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_care_requests cr
      JOIN public.church_members cm ON cm.church_id = cr.church_id
      WHERE cr.id = church_care_responses.care_request_id AND cm.user_id = auth.uid()
    )
  );


-- =============================================
-- FEATURE 5: MENTORSHIP MATCHING
-- =============================================

CREATE TABLE IF NOT EXISTS public.church_mentorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES auth.users(id),
  mentee_id UUID NOT NULL REFERENCES auth.users(id),
  matched_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'paused', 'completed', 'cancelled')),
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  current_milestone INTEGER DEFAULT 0,
  total_milestones INTEGER DEFAULT 12,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(church_id, mentor_id, mentee_id)
);

CREATE TABLE IF NOT EXISTS public.church_mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentorship_id UUID NOT NULL REFERENCES public.church_mentorships(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL,
  topic TEXT,
  conversation_guide TEXT,
  completed_at TIMESTAMPTZ,
  mentor_notes TEXT,
  mentee_notes TEXT,
  milestone_reached BOOLEAN DEFAULT false,
  scheduled_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_church_mentorships_church ON public.church_mentorships(church_id);
CREATE INDEX IF NOT EXISTS idx_church_mentorships_mentor ON public.church_mentorships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_church_mentorships_mentee ON public.church_mentorships(mentee_id);
CREATE INDEX IF NOT EXISTS idx_church_mentorship_sessions_mentorship ON public.church_mentorship_sessions(mentorship_id);

ALTER TABLE public.church_mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_mentorship_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view own mentorships"
  ON public.church_mentorships FOR SELECT
  USING (
    auth.uid() = mentor_id OR
    auth.uid() = mentee_id OR
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_mentorships.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader')
    )
  );

CREATE POLICY "Leaders can manage mentorships"
  ON public.church_mentorships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_mentorships.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader')
    )
  );

CREATE POLICY "Participants can view sessions"
  ON public.church_mentorship_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_mentorships m
      WHERE m.id = church_mentorship_sessions.mentorship_id
        AND (m.mentor_id = auth.uid() OR m.mentee_id = auth.uid())
    )
  );

CREATE POLICY "Participants can update sessions"
  ON public.church_mentorship_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_mentorships m
      WHERE m.id = church_mentorship_sessions.mentorship_id
        AND (m.mentor_id = auth.uid() OR m.mentee_id = auth.uid())
    )
  );

CREATE POLICY "Leaders can manage sessions"
  ON public.church_mentorship_sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_mentorships m
      JOIN public.church_members cm ON cm.church_id = m.church_id
      WHERE m.id = church_mentorship_sessions.mentorship_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'leader')
    )
  );


-- =============================================
-- FEATURE 6: RESOURCE LIBRARY
-- =============================================

CREATE TABLE IF NOT EXISTS public.church_resource_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.church_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.church_resource_categories(id) ON DELETE SET NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('pdf', 'book', 'study_guide', 'video', 'audio', 'link', 'other')),
  file_url TEXT,
  external_url TEXT,
  file_size_bytes INTEGER,
  author TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_pastors_pick BOOLEAN DEFAULT false,
  visibility TEXT DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'leaders')),
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_church_resources_church ON public.church_resources(church_id);
CREATE INDEX IF NOT EXISTS idx_church_resources_category ON public.church_resources(category_id);
CREATE INDEX IF NOT EXISTS idx_church_resource_categories_church ON public.church_resource_categories(church_id);

ALTER TABLE public.church_resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view resource categories"
  ON public.church_resource_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_resource_categories.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can manage categories"
  ON public.church_resource_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_resource_categories.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader')
    )
  );

CREATE POLICY "Members can view resources"
  ON public.church_resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_resources.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can manage resources"
  ON public.church_resources FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_resources.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader')
    )
  );


-- =============================================
-- FEATURE 7: WORSHIP PLAYLISTS
-- =============================================

CREATE TABLE IF NOT EXISTS public.church_worship_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  study_id UUID REFERENCES public.church_central_studies(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  theme TEXT,
  week_date DATE,
  cover_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.church_playlist_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES public.church_worship_playlists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT,
  platform TEXT CHECK (platform IN ('youtube', 'spotify', 'apple_music', 'other')),
  platform_url TEXT,
  platform_embed_id TEXT,
  sort_order INTEGER DEFAULT 0,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.church_song_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  suggested_by UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  artist TEXT,
  platform_url TEXT,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_church_worship_playlists_church ON public.church_worship_playlists(church_id);
CREATE INDEX IF NOT EXISTS idx_church_playlist_songs_playlist ON public.church_playlist_songs(playlist_id);
CREATE INDEX IF NOT EXISTS idx_church_song_suggestions_church ON public.church_song_suggestions(church_id);

ALTER TABLE public.church_worship_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_song_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view playlists"
  ON public.church_worship_playlists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_worship_playlists.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can manage playlists"
  ON public.church_worship_playlists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_worship_playlists.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader')
    )
  );

CREATE POLICY "Members can view songs"
  ON public.church_playlist_songs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_worship_playlists p
      JOIN public.church_members cm ON cm.church_id = p.church_id
      WHERE p.id = church_playlist_songs.playlist_id AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can manage songs"
  ON public.church_playlist_songs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_worship_playlists p
      JOIN public.church_members cm ON cm.church_id = p.church_id
      WHERE p.id = church_playlist_songs.playlist_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'leader')
    )
  );

CREATE POLICY "Members can suggest songs"
  ON public.church_song_suggestions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_song_suggestions.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Members can view suggestions"
  ON public.church_song_suggestions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_song_suggestions.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can manage suggestions"
  ON public.church_song_suggestions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_song_suggestions.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader')
    )
  );


-- =============================================
-- FEATURE 8: ATTENDANCE CHECK-IN
-- =============================================

CREATE TABLE IF NOT EXISTS public.church_service_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  service_type TEXT DEFAULT 'sabbath' CHECK (service_type IN ('sabbath', 'wednesday', 'prayer', 'special', 'other')),
  service_date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in_method TEXT DEFAULT 'button' CHECK (check_in_method IN ('button', 'qr_code', 'manual')),
  checked_in_at TIMESTAMPTZ DEFAULT now(),
  message TEXT,
  qr_code_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(church_id, user_id, service_date, service_type)
);

CREATE INDEX IF NOT EXISTS idx_church_service_checkins_church ON public.church_service_checkins(church_id);
CREATE INDEX IF NOT EXISTS idx_church_service_checkins_date ON public.church_service_checkins(service_date);
CREATE INDEX IF NOT EXISTS idx_church_service_checkins_user ON public.church_service_checkins(user_id);

ALTER TABLE public.church_service_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can check in"
  ON public.church_service_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can view checkins"
  ON public.church_service_checkins FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_service_checkins.church_id AND user_id = auth.uid()
    )
  );


-- =============================================
-- FEATURE 9: BIRTHDAY & ANNIVERSARY CELEBRATIONS
-- =============================================

CREATE TABLE IF NOT EXISTS public.church_member_celebrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  birthday_month INTEGER CHECK (birthday_month BETWEEN 1 AND 12),
  birthday_day INTEGER CHECK (birthday_day BETWEEN 1 AND 31),
  wedding_anniversary_month INTEGER CHECK (wedding_anniversary_month BETWEEN 1 AND 12),
  wedding_anniversary_day INTEGER CHECK (wedding_anniversary_day BETWEEN 1 AND 31),
  show_birthday BOOLEAN DEFAULT true,
  show_anniversary BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(church_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_church_member_celebrations_church ON public.church_member_celebrations(church_id);
CREATE INDEX IF NOT EXISTS idx_church_member_celebrations_birthday ON public.church_member_celebrations(birthday_month, birthday_day);

ALTER TABLE public.church_member_celebrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view celebrations"
  ON public.church_member_celebrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_member_celebrations.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own celebrations"
  ON public.church_member_celebrations FOR ALL
  USING (auth.uid() = user_id);


-- =============================================
-- FEATURE 10: FAMILY DEVOTIONAL PLANS
-- =============================================

CREATE TABLE IF NOT EXISTS public.church_family_devotionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  study_id UUID REFERENCES public.church_central_studies(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  age_group TEXT DEFAULT 'all' CHECK (age_group IN ('toddler', 'preschool', 'elementary', 'preteen', 'teen', 'all')),
  parents_guide TEXT,
  opening_activity TEXT,
  simplified_lesson TEXT,
  discussion_questions TEXT[],
  memory_verse_simplified TEXT,
  closing_activity TEXT,
  week_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_church_family_devotionals_church ON public.church_family_devotionals(church_id);
CREATE INDEX IF NOT EXISTS idx_church_family_devotionals_study ON public.church_family_devotionals(study_id);
CREATE INDEX IF NOT EXISTS idx_church_family_devotionals_age ON public.church_family_devotionals(age_group);

ALTER TABLE public.church_family_devotionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view family devotionals"
  ON public.church_family_devotionals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_family_devotionals.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can manage family devotionals"
  ON public.church_family_devotionals FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_family_devotionals.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader')
    )
  );


-- =============================================
-- FEATURE 11: USER STUDY THREADS
-- =============================================

CREATE TABLE IF NOT EXISTS public.user_study_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'followers')),
  topic_tags TEXT[],
  verse_references TEXT[],
  entry_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_study_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.user_study_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT,
  content TEXT NOT NULL,
  entry_type TEXT DEFAULT 'note' CHECK (entry_type IN ('note', 'reflection', 'question', 'insight', 'prayer', 'gem')),
  verse_reference TEXT,
  verse_text TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_study_entry_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.user_study_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(entry_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.user_study_entry_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.user_study_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  reply_to_id UUID REFERENCES public.user_study_entry_comments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_study_threads_user ON public.user_study_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_user_study_threads_visibility ON public.user_study_threads(visibility);
CREATE INDEX IF NOT EXISTS idx_user_study_entries_thread ON public.user_study_entries(thread_id);
CREATE INDEX IF NOT EXISTS idx_user_study_entries_user ON public.user_study_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_user_study_entry_likes_entry ON public.user_study_entry_likes(entry_id);
CREATE INDEX IF NOT EXISTS idx_user_study_entry_comments_entry ON public.user_study_entry_comments(entry_id);
CREATE INDEX IF NOT EXISTS idx_user_study_entry_comments_user ON public.user_study_entry_comments(user_id);

ALTER TABLE public.user_study_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_study_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_study_entry_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_study_entry_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public threads"
  ON public.user_study_threads FOR SELECT
  USING (
    visibility = 'public' OR
    auth.uid() = user_id OR
    (visibility = 'followers' AND EXISTS (
      SELECT 1 FROM public.user_follows
      WHERE follower_id = auth.uid() AND following_id = user_study_threads.user_id
    ))
  );

CREATE POLICY "Users can manage own threads"
  ON public.user_study_threads FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view entries in visible threads"
  ON public.user_study_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_study_threads t
      WHERE t.id = user_study_entries.thread_id
        AND (
          t.visibility = 'public' OR
          t.user_id = auth.uid() OR
          (t.visibility = 'followers' AND EXISTS (
            SELECT 1 FROM public.user_follows
            WHERE follower_id = auth.uid() AND following_id = t.user_id
          ))
        )
    )
  );

CREATE POLICY "Users can manage own entries"
  ON public.user_study_entries FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own likes"
  ON public.user_study_entry_likes FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view likes"
  ON public.user_study_entry_likes FOR SELECT
  USING (true);

-- Comments: anyone who can view the entry can comment and see comments
CREATE POLICY "Users can view comments on visible entries"
  ON public.user_study_entry_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_study_entries e
      JOIN public.user_study_threads t ON t.id = e.thread_id
      WHERE e.id = user_study_entry_comments.entry_id
        AND (
          t.visibility = 'public' OR
          t.user_id = auth.uid() OR
          (t.visibility = 'followers' AND EXISTS (
            SELECT 1 FROM public.user_follows
            WHERE follower_id = auth.uid() AND following_id = t.user_id
          ))
        )
    )
  );

CREATE POLICY "Authenticated users can comment on visible entries"
  ON public.user_study_entry_comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.user_study_entries e
      JOIN public.user_study_threads t ON t.id = e.thread_id
      WHERE e.id = user_study_entry_comments.entry_id
        AND (
          t.visibility = 'public' OR
          t.user_id = auth.uid() OR
          (t.visibility = 'followers' AND EXISTS (
            SELECT 1 FROM public.user_follows
            WHERE follower_id = auth.uid() AND following_id = t.user_id
          ))
        )
    )
  );

CREATE POLICY "Users can manage own comments"
  ON public.user_study_entry_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.user_study_entry_comments FOR DELETE
  USING (auth.uid() = user_id);


-- =============================================
-- HELPER FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION get_upcoming_church_birthdays(p_church_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE(
  user_id UUID,
  birthday_month INTEGER,
  birthday_day INTEGER,
  display_name TEXT,
  avatar_url TEXT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    c.user_id,
    c.birthday_month,
    c.birthday_day,
    p.display_name,
    p.avatar_url
  FROM public.church_member_celebrations c
  JOIN public.profiles p ON p.id = c.user_id
  WHERE c.church_id = p_church_id
    AND c.show_birthday = true
    AND c.birthday_month IS NOT NULL
    AND c.birthday_day IS NOT NULL
    AND (
      (c.birthday_month = EXTRACT(MONTH FROM CURRENT_DATE)
       AND c.birthday_day >= EXTRACT(DAY FROM CURRENT_DATE))
      OR
      (c.birthday_month = EXTRACT(MONTH FROM CURRENT_DATE + INTERVAL '1 month')
       AND c.birthday_day <= EXTRACT(DAY FROM CURRENT_DATE + p_days * INTERVAL '1 day'))
    )
  ORDER BY c.birthday_month, c.birthday_day;
$$;

CREATE OR REPLACE FUNCTION get_giving_summary(p_user_id UUID, p_church_id UUID, p_year INTEGER)
RETURNS TABLE(
  giving_type TEXT,
  total_cents BIGINT,
  transaction_count BIGINT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    giving_type,
    SUM(amount_cents)::BIGINT as total_cents,
    COUNT(*)::BIGINT as transaction_count
  FROM public.church_giving_records
  WHERE user_id = p_user_id
    AND church_id = p_church_id
    AND EXTRACT(YEAR FROM created_at) = p_year
    AND status = 'completed'
  GROUP BY giving_type;
$$;

CREATE OR REPLACE FUNCTION get_attendance_streak(p_user_id UUID, p_church_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_streak INTEGER := 0;
  v_expected_date DATE;
  v_rec RECORD;
BEGIN
  v_expected_date := CURRENT_DATE;
  FOR v_rec IN
    SELECT DISTINCT service_date
    FROM public.church_service_checkins
    WHERE user_id = p_user_id
      AND church_id = p_church_id
      AND service_type = 'sabbath'
    ORDER BY service_date DESC
  LOOP
    WHILE EXTRACT(DOW FROM v_expected_date) != 6 LOOP
      v_expected_date := v_expected_date - INTERVAL '1 day';
    END LOOP;
    IF v_rec.service_date = v_expected_date THEN
      v_streak := v_streak + 1;
      v_expected_date := v_expected_date - INTERVAL '7 days';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  RETURN v_streak;
END;
$$;
