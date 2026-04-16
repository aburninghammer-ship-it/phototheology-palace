-- Church Events System
CREATE TABLE IF NOT EXISTS public.church_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    location TEXT,
    category TEXT DEFAULT 'general',
    max_attendees INTEGER,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.church_event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.church_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'attending',
    guest_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(event_id, user_id)
);

-- Push Notification Tokens
CREATE TABLE IF NOT EXISTS public.push_notification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    platform TEXT DEFAULT 'web',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, token)
);

CREATE TABLE IF NOT EXISTS public.push_notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    events_enabled BOOLEAN DEFAULT true,
    messages_enabled BOOLEAN DEFAULT true,
    announcements_enabled BOOLEAN DEFAULT true,
    study_reminders_enabled BOOLEAN DEFAULT true,
    prayer_requests_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Study Engagement Analytics
CREATE TABLE IF NOT EXISTS public.study_engagement_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
    study_id UUID,
    study_type TEXT,
    content_type TEXT,
    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Surveys & Polls
CREATE TABLE IF NOT EXISTS public.church_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    survey_type TEXT DEFAULT 'survey',
    status TEXT DEFAULT 'draft',
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    is_anonymous BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.church_survey_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.church_surveys(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'multiple_choice',
    options JSONB,
    is_required BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.church_survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.church_surveys(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.church_survey_questions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    response_value TEXT,
    response_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Chat Rooms
CREATE TABLE IF NOT EXISTS public.church_chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    room_type TEXT DEFAULT 'general',
    is_private BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.church_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.church_chat_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.church_chat_room_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.church_chat_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(room_id, user_id)
);

-- Enable RLS
ALTER TABLE public.church_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_engagement_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_chat_room_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for church_events
CREATE POLICY "Church members can view events" ON public.church_events
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.church_members WHERE church_members.church_id = church_events.church_id AND church_members.user_id = auth.uid())
    );

CREATE POLICY "Leaders can manage events" ON public.church_events
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.church_members WHERE church_members.church_id = church_events.church_id AND church_members.user_id = auth.uid() AND church_members.role IN ('admin', 'leader'))
    );

-- RLS Policies for RSVPs
CREATE POLICY "Members can view RSVPs" ON public.church_event_rsvps
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.church_events e JOIN public.church_members m ON e.church_id = m.church_id WHERE e.id = church_event_rsvps.event_id AND m.user_id = auth.uid())
    );

CREATE POLICY "Users can manage own RSVPs" ON public.church_event_rsvps
    FOR ALL USING (user_id = auth.uid());

-- RLS Policies for push notifications
CREATE POLICY "Users manage own tokens" ON public.push_notification_tokens
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users manage own preferences" ON public.push_notification_preferences
    FOR ALL USING (user_id = auth.uid());

-- RLS Policies for study engagement
CREATE POLICY "Users manage own sessions" ON public.study_engagement_sessions
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Leaders can view church sessions" ON public.study_engagement_sessions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.church_members WHERE church_members.church_id = study_engagement_sessions.church_id AND church_members.user_id = auth.uid() AND church_members.role IN ('admin', 'leader'))
    );

-- RLS Policies for surveys
CREATE POLICY "Members can view active surveys" ON public.church_surveys
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.church_members WHERE church_members.church_id = church_surveys.church_id AND church_members.user_id = auth.uid())
    );

CREATE POLICY "Leaders can manage surveys" ON public.church_surveys
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.church_members WHERE church_members.church_id = church_surveys.church_id AND church_members.user_id = auth.uid() AND church_members.role IN ('admin', 'leader'))
    );

CREATE POLICY "Members can view survey questions" ON public.church_survey_questions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.church_surveys s JOIN public.church_members m ON s.church_id = m.church_id WHERE s.id = church_survey_questions.survey_id AND m.user_id = auth.uid())
    );

CREATE POLICY "Leaders can manage questions" ON public.church_survey_questions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.church_surveys s JOIN public.church_members m ON s.church_id = m.church_id WHERE s.id = church_survey_questions.survey_id AND m.user_id = auth.uid() AND m.role IN ('admin', 'leader'))
    );

CREATE POLICY "Members can submit responses" ON public.church_survey_responses
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.church_surveys s JOIN public.church_members m ON s.church_id = m.church_id WHERE s.id = church_survey_responses.survey_id AND m.user_id = auth.uid())
    );

CREATE POLICY "Leaders can view responses" ON public.church_survey_responses
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.church_surveys s JOIN public.church_members m ON s.church_id = m.church_id WHERE s.id = church_survey_responses.survey_id AND m.user_id = auth.uid() AND m.role IN ('admin', 'leader'))
    );

-- RLS Policies for chat rooms
CREATE POLICY "Members can view chat rooms" ON public.church_chat_rooms
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.church_members WHERE church_members.church_id = church_chat_rooms.church_id AND church_members.user_id = auth.uid())
    );

CREATE POLICY "Leaders can manage chat rooms" ON public.church_chat_rooms
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.church_members WHERE church_members.church_id = church_chat_rooms.church_id AND church_members.user_id = auth.uid() AND church_members.role IN ('admin', 'leader'))
    );

CREATE POLICY "Members can view messages" ON public.church_chat_messages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.church_chat_rooms r JOIN public.church_members m ON r.church_id = m.church_id WHERE r.id = church_chat_messages.room_id AND m.user_id = auth.uid())
    );

CREATE POLICY "Members can send messages" ON public.church_chat_messages
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view room memberships" ON public.church_chat_room_members
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.church_chat_rooms r JOIN public.church_members m ON r.church_id = m.church_id WHERE r.id = church_chat_room_members.room_id AND m.user_id = auth.uid())
    );

CREATE POLICY "Users can join rooms" ON public.church_chat_room_members
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.church_chat_messages;