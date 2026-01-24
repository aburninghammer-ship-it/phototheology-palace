-- Enhanced profiles for Mighty Networks replacement
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cover_photo_url TEXT,
ADD COLUMN IF NOT EXISTS ministry_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_profile_public BOOLEAN DEFAULT true;

-- Church branding settings
CREATE TABLE IF NOT EXISTS public.church_branding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  primary_color TEXT DEFAULT '#8B5CF6',
  secondary_color TEXT DEFAULT '#3B82F6',
  accent_color TEXT DEFAULT '#10B981',
  logo_url TEXT,
  banner_url TEXT,
  tagline TEXT,
  custom_css TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(church_id)
);

-- Role-based permissions
CREATE TABLE IF NOT EXISTS public.church_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'admin', 'leader', 'member', 'guest'
  permission TEXT NOT NULL, -- 'manage_members', 'create_events', 'post_announcements', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(church_id, role, permission)
);

-- Default permissions for each role
INSERT INTO public.church_permissions (church_id, role, permission)
SELECT c.id, role_perm.role, role_perm.permission
FROM public.churches c
CROSS JOIN (
  VALUES 
    ('admin', 'manage_members'),
    ('admin', 'manage_events'),
    ('admin', 'manage_announcements'),
    ('admin', 'manage_studies'),
    ('admin', 'manage_branding'),
    ('admin', 'view_analytics'),
    ('admin', 'manage_permissions'),
    ('leader', 'create_events'),
    ('leader', 'post_announcements'),
    ('leader', 'create_studies'),
    ('leader', 'view_analytics'),
    ('member', 'view_events'),
    ('member', 'rsvp_events'),
    ('member', 'post_community'),
    ('member', 'join_chat'),
    ('guest', 'view_events'),
    ('guest', 'view_community')
) AS role_perm(role, permission)
ON CONFLICT (church_id, role, permission) DO NOTHING;

-- Livestream embeds
CREATE TABLE IF NOT EXISTS public.church_livestreams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'youtube', 'zoom', 'vimeo', 'facebook'
  embed_url TEXT NOT NULL,
  is_live BOOLEAN DEFAULT false,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Course discussion boards
CREATE TABLE IF NOT EXISTS public.course_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL, -- Can reference bible_study_series, discipleship_packages, etc.
  course_type TEXT NOT NULL, -- 'bible_study', 'discipleship', 'truth_series', 'leader_training'
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_discussion_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES public.course_discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES public.course_discussion_replies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Content performance analytics
CREATE TABLE IF NOT EXISTS public.content_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'study', 'sermon', 'event', 'post', 'course'
  content_id UUID NOT NULL,
  views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  completions INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  avg_time_spent INTEGER DEFAULT 0, -- seconds
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(church_id, content_type, content_id, date)
);

-- Calendar sync tokens for Google/Outlook integration
CREATE TABLE IF NOT EXISTS public.user_calendar_sync (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'google', 'outlook'
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  calendar_id TEXT,
  sync_enabled BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Add recurring event support to church_events
ALTER TABLE public.church_events
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS recurrence_rule TEXT, -- iCal RRULE format
ADD COLUMN IF NOT EXISTS recurrence_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS parent_event_id UUID REFERENCES public.church_events(id);

-- Enable RLS on new tables
ALTER TABLE public.church_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_livestreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_calendar_sync ENABLE ROW LEVEL SECURITY;

-- RLS Policies for church_branding
CREATE POLICY "Church branding viewable by members" ON public.church_branding
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.church_members 
    WHERE church_members.church_id = church_branding.church_id 
    AND church_members.user_id = auth.uid()
  )
);

CREATE POLICY "Church branding manageable by admins" ON public.church_branding
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.church_members 
    WHERE church_members.church_id = church_branding.church_id 
    AND church_members.user_id = auth.uid()
    AND church_members.role = 'admin'
  )
);

-- RLS Policies for church_permissions
CREATE POLICY "Permissions viewable by members" ON public.church_permissions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.church_members 
    WHERE church_members.church_id = church_permissions.church_id 
    AND church_members.user_id = auth.uid()
  )
);

CREATE POLICY "Permissions manageable by admins" ON public.church_permissions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.church_members 
    WHERE church_members.church_id = church_permissions.church_id 
    AND church_members.user_id = auth.uid()
    AND church_members.role = 'admin'
  )
);

-- RLS Policies for church_livestreams
CREATE POLICY "Livestreams viewable by members" ON public.church_livestreams
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.church_members 
    WHERE church_members.church_id = church_livestreams.church_id 
    AND church_members.user_id = auth.uid()
  )
);

CREATE POLICY "Livestreams manageable by leaders" ON public.church_livestreams
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.church_members 
    WHERE church_members.church_id = church_livestreams.church_id 
    AND church_members.user_id = auth.uid()
    AND church_members.role IN ('admin', 'leader')
  )
);

-- RLS Policies for course_discussions
CREATE POLICY "Discussions viewable by authenticated" ON public.course_discussions
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Discussions creatable by authenticated" ON public.course_discussions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Discussions editable by author" ON public.course_discussions
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Discussions deletable by author" ON public.course_discussions
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for course_discussion_replies
CREATE POLICY "Replies viewable by authenticated" ON public.course_discussion_replies
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Replies creatable by authenticated" ON public.course_discussion_replies
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Replies editable by author" ON public.course_discussion_replies
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Replies deletable by author" ON public.course_discussion_replies
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for content_analytics
CREATE POLICY "Analytics viewable by church leaders" ON public.content_analytics
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.church_members 
    WHERE church_members.church_id = content_analytics.church_id 
    AND church_members.user_id = auth.uid()
    AND church_members.role IN ('admin', 'leader')
  )
);

CREATE POLICY "Analytics insertable by system" ON public.content_analytics
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for user_calendar_sync
CREATE POLICY "Calendar sync owned by user" ON public.user_calendar_sync
FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_church_branding_church ON public.church_branding(church_id);
CREATE INDEX IF NOT EXISTS idx_church_permissions_church_role ON public.church_permissions(church_id, role);
CREATE INDEX IF NOT EXISTS idx_church_livestreams_church ON public.church_livestreams(church_id);
CREATE INDEX IF NOT EXISTS idx_church_livestreams_live ON public.church_livestreams(church_id, is_live);
CREATE INDEX IF NOT EXISTS idx_course_discussions_course ON public.course_discussions(course_id, course_type);
CREATE INDEX IF NOT EXISTS idx_course_discussion_replies_discussion ON public.course_discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_content_analytics_church_date ON public.content_analytics(church_id, date);
CREATE INDEX IF NOT EXISTS idx_content_analytics_content ON public.content_analytics(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_user_calendar_sync_user ON public.user_calendar_sync(user_id);