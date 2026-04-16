-- House Fires Upgrade: group types, invite codes, privacy, 7-member cap, conduct acceptance

-- Add new columns to small_groups
ALTER TABLE public.small_groups
  ADD COLUMN IF NOT EXISTS group_type TEXT NOT NULL DEFAULT 'study'
    CHECK (group_type IN ('study', 'freestyle', 'apologetics', 'prayer', 'ministry')),
  ADD COLUMN IF NOT EXISTS is_private BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS invite_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS conduct_accepted BOOLEAN NOT NULL DEFAULT false;

-- Change default max_members from 12 to 7
ALTER TABLE public.small_groups ALTER COLUMN max_members SET DEFAULT 7;

-- Invite code generation function (pattern from game_night_invites)
CREATE OR REPLACE FUNCTION public.generate_house_fire_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  code TEXT;
  attempts INT := 0;
BEGIN
  LOOP
    code := 'HF' || UPPER(SUBSTRING(MD5(random()::TEXT || NOW()::TEXT) FROM 1 FOR 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.small_groups WHERE invite_code = code);
    attempts := attempts + 1;
    IF attempts > 100 THEN
      RAISE EXCEPTION 'Failed to generate unique invite code';
    END IF;
  END LOOP;
  RETURN code;
END;
$$;

-- Auto-generate invite code for private groups
CREATE OR REPLACE FUNCTION public.auto_generate_invite_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.is_private = true AND (NEW.invite_code IS NULL OR NEW.invite_code = '') THEN
    NEW.invite_code := public.generate_house_fire_invite_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_invite_code ON public.small_groups;
CREATE TRIGGER trg_auto_invite_code
  BEFORE INSERT OR UPDATE ON public.small_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_invite_code();

-- Member count enforcement function
CREATE OR REPLACE FUNCTION public.enforce_house_fire_member_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_count INT;
  max_allowed INT;
BEGIN
  SELECT count(*) INTO current_count
  FROM public.small_group_members
  WHERE group_id = NEW.group_id AND is_active = true;

  SELECT max_members INTO max_allowed
  FROM public.small_groups
  WHERE id = NEW.group_id;

  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'Group is at capacity (% members)', max_allowed;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_member_limit ON public.small_group_members;
CREATE TRIGGER trg_enforce_member_limit
  BEFORE INSERT ON public.small_group_members
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_house_fire_member_limit();

-- Allow any church member to create groups (drop admin/leader restriction)
DROP POLICY IF EXISTS "Church admins can manage small groups" ON public.small_groups;
DROP POLICY IF EXISTS "Church members can create small groups" ON public.small_groups;

CREATE POLICY "Church members can create small groups"
  ON public.small_groups
  FOR INSERT
  WITH CHECK (
    auth.uid() = leader_id
    AND EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = small_groups.church_id
        AND user_id = auth.uid()
        AND status = 'active'
    )
  );

-- Leaders can update their own groups
DROP POLICY IF EXISTS "Group leaders can update their groups" ON public.small_groups;
CREATE POLICY "Group leaders can update their groups"
  ON public.small_groups
  FOR UPDATE
  USING (auth.uid() = leader_id);

-- Auto-add creator as leader member
CREATE OR REPLACE FUNCTION public.auto_add_group_leader()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.small_group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.leader_id, 'leader')
  ON CONFLICT (group_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_add_leader ON public.small_groups;
CREATE TRIGGER trg_auto_add_leader
  AFTER INSERT ON public.small_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_add_group_leader();
