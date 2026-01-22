-- Church Events System
-- Full events management with RSVP, categories, and calendar support

-- Events table
CREATE TABLE IF NOT EXISTS public.church_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),

  -- Event details
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  location_type TEXT DEFAULT 'in_person' CHECK (location_type IN ('in_person', 'online', 'hybrid')),
  online_url TEXT, -- Zoom/YouTube/etc link

  -- Timing
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  all_day BOOLEAN DEFAULT false,
  timezone TEXT DEFAULT 'America/Los_Angeles',

  -- Recurrence (for recurring events)
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT, -- iCal RRULE format
  recurrence_end_date DATE,
  parent_event_id UUID REFERENCES public.church_events(id), -- For recurring instances

  -- Categorization
  category TEXT DEFAULT 'general' CHECK (category IN (
    'general', 'worship', 'bible_study', 'prayer', 'outreach',
    'fellowship', 'youth', 'children', 'mens', 'womens',
    'small_group', 'conference', 'training', 'other'
  )),

  -- Visibility
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'members', 'leaders')),
  featured BOOLEAN DEFAULT false,

  -- RSVP settings
  rsvp_enabled BOOLEAN DEFAULT true,
  rsvp_limit INTEGER, -- Max attendees (null = unlimited)
  rsvp_deadline TIMESTAMP WITH TIME ZONE,
  allow_guests BOOLEAN DEFAULT true,

  -- Media
  cover_image_url TEXT,

  -- Status
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled')),
  cancelled_reason TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Event RSVPs
CREATE TABLE IF NOT EXISTS public.church_event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.church_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- RSVP details
  status TEXT NOT NULL DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'not_going')),
  guest_count INTEGER DEFAULT 0,
  guest_names TEXT[], -- Names of guests

  -- Notes
  note TEXT,

  -- Attendance tracking
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  checked_in_by UUID REFERENCES auth.users(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  UNIQUE(event_id, user_id)
);

-- Event comments/discussion
CREATE TABLE IF NOT EXISTS public.church_event_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.church_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  content TEXT NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_church_events_church_id ON public.church_events(church_id);
CREATE INDEX IF NOT EXISTS idx_church_events_start_time ON public.church_events(start_time);
CREATE INDEX IF NOT EXISTS idx_church_events_category ON public.church_events(category);
CREATE INDEX IF NOT EXISTS idx_church_event_rsvps_event_id ON public.church_event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_church_event_rsvps_user_id ON public.church_event_rsvps(user_id);

-- Enable RLS
ALTER TABLE public.church_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_event_comments ENABLE ROW LEVEL SECURITY;

-- Policies for church_events
CREATE POLICY "Members can view public church events"
  ON public.church_events FOR SELECT
  USING (
    visibility = 'public' OR
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_events.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can create events"
  ON public.church_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_events.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader', 'pastor')
    )
  );

CREATE POLICY "Leaders can update their church events"
  ON public.church_events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_events.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader', 'pastor')
    )
  );

CREATE POLICY "Leaders can delete events"
  ON public.church_events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_events.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader', 'pastor')
    )
  );

-- Policies for RSVPs
CREATE POLICY "Users can view RSVPs for events they can see"
  ON public.church_event_rsvps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_events
      WHERE id = church_event_rsvps.event_id
    )
  );

CREATE POLICY "Users can RSVP to events"
  ON public.church_event_rsvps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own RSVPs"
  ON public.church_event_rsvps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own RSVPs"
  ON public.church_event_rsvps FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for comments
CREATE POLICY "Users can view event comments"
  ON public.church_event_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_events
      WHERE id = church_event_comments.event_id
    )
  );

CREATE POLICY "Users can comment on events"
  ON public.church_event_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.church_event_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.church_event_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Function to get upcoming events for a church
CREATE OR REPLACE FUNCTION get_upcoming_church_events(p_church_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS SETOF public.church_events
LANGUAGE sql
STABLE
AS $$
  SELECT * FROM public.church_events
  WHERE church_id = p_church_id
    AND status = 'published'
    AND start_time >= now()
  ORDER BY start_time ASC
  LIMIT p_limit;
$$;

-- Function to get RSVP counts for an event
CREATE OR REPLACE FUNCTION get_event_rsvp_counts(p_event_id UUID)
RETURNS TABLE(going BIGINT, maybe BIGINT, not_going BIGINT, total_guests BIGINT)
LANGUAGE sql
STABLE
AS $$
  SELECT
    COUNT(*) FILTER (WHERE status = 'going'),
    COUNT(*) FILTER (WHERE status = 'maybe'),
    COUNT(*) FILTER (WHERE status = 'not_going'),
    COALESCE(SUM(guest_count) FILTER (WHERE status = 'going'), 0)
  FROM public.church_event_rsvps
  WHERE event_id = p_event_id;
$$;
