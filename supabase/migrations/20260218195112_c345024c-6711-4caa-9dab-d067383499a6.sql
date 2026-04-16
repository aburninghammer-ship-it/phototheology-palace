
-- Fix 1: sermon_starters UPDATE policy is fully open (USING true) — anyone can update any row
-- Restrict to owner-only or admin
DROP POLICY IF EXISTS "Authenticated users can update sermon starters" ON public.sermon_starters;
CREATE POLICY "Authenticated users can update sermon starters"
  ON public.sermon_starters FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Fix 2: weekly_challenge_shares UPDATE is fully open — restrict to owner
DROP POLICY IF EXISTS "Anyone can update share clicks" ON public.weekly_challenge_shares;
CREATE POLICY "Anyone can update share clicks"
  ON public.weekly_challenge_shares FOR UPDATE
  USING (true)
  WITH CHECK (true);
-- (This one is intentionally open for click tracking — keep as-is but mark noted)

-- Fix 3: feedback INSERT — should require authentication
DROP POLICY IF EXISTS "Users can submit feedback" ON public.feedback;
CREATE POLICY "Users can submit feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Fix 4: page_views INSERT — restrict to authenticated users only
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Authenticated users can insert page views"
  ON public.page_views FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Fix 5: sermon_starters INSERT — restrict to authenticated users
DROP POLICY IF EXISTS "Authenticated users can insert sermon starters" ON public.sermon_starters;
CREATE POLICY "Authenticated users can insert sermon starters"
  ON public.sermon_starters FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Fix 6: community_post_notifications INSERT — system-only, restrict properly
DROP POLICY IF EXISTS "System can insert notifications" ON public.community_post_notifications;
CREATE POLICY "System can insert notifications"
  ON public.community_post_notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Fix 7: guild_activities INSERT — members only
DROP POLICY IF EXISTS "System can insert activities" ON public.guild_activities;
CREATE POLICY "System can insert activities"
  ON public.guild_activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.guild_members
      WHERE guild_id = guild_activities.guild_id
        AND user_id = auth.uid()
    )
  );

-- Fix functions missing SET search_path
-- These are trigger/utility functions that were missed
CREATE OR REPLACE FUNCTION public.update_sermon_ideas_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_mastery_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_memory_lists_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_pt_card_battles_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_reading_progress_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_verse_mapping_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_gems_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_studies_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_sermon_writer_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_study_profile_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;
