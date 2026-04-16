-- ============================================================
-- Living Manna Church: Bulk import + auto-join for future signups
-- ============================================================

-- 1. Create pre-approved members table
CREATE TABLE IF NOT EXISTS public.church_preapproved_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id uuid NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member',
  claimed boolean NOT NULL DEFAULT false,
  claimed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(church_id, email)
);

-- RLS: only church admins can view/manage
ALTER TABLE public.church_preapproved_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Church admins can manage preapproved members"
  ON public.church_preapproved_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members cm
      WHERE cm.church_id = church_preapproved_members.church_id
        AND cm.user_id = auth.uid()
        AND cm.role = 'admin'
    )
  );

-- 2. Auto-join trigger: when a new user signs up, check if their email is pre-approved
CREATE OR REPLACE FUNCTION public.handle_preapproved_church_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_preapproved RECORD;
BEGIN
  -- Check if the new user's email is in the pre-approved list
  FOR v_preapproved IN
    SELECT id, church_id, role
    FROM public.church_preapproved_members
    WHERE LOWER(email) = LOWER(NEW.email)
      AND claimed = false
  LOOP
    -- Add them as a church member
    INSERT INTO public.church_members (church_id, user_id, role, joined_at)
    VALUES (v_preapproved.church_id, NEW.id, v_preapproved.role, NOW())
    ON CONFLICT (church_id, user_id) DO NOTHING;

    -- Mark as claimed
    UPDATE public.church_preapproved_members
    SET claimed = true, claimed_at = NOW()
    WHERE id = v_preapproved.id;
  END LOOP;

  RETURN NEW;
END;
$$;

-- Drop if exists to avoid duplicate
DROP TRIGGER IF EXISTS on_auth_user_preapproved_church ON auth.users;

CREATE TRIGGER on_auth_user_preapproved_church
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_preapproved_church_member();

-- 3. Insert all 95 emails into the pre-approved list for Living Manna
DO $$
DECLARE
  v_church_id uuid;
BEGIN
  -- Find the Living Manna church
  SELECT id INTO v_church_id
  FROM public.churches
  WHERE name ILIKE '%Living Manna%'
  LIMIT 1;

  IF v_church_id IS NULL THEN
    RAISE EXCEPTION 'Living Manna church not found in churches table';
  END IF;

  RAISE NOTICE 'Found Living Manna church: %', v_church_id;

  -- Insert all emails as pre-approved (duplicates ignored)
  INSERT INTO public.church_preapproved_members (church_id, email, role)
  VALUES
    (v_church_id, 'pprempeh@gmail.com', 'member'),
    (v_church_id, 'silvia927.sa@gmail.com', 'member'),
    (v_church_id, 'gavinanthony1@gmail.com', 'member'),
    (v_church_id, 'norwalksonbeams@yahoo.com', 'member'),
    (v_church_id, 'bautista.phillip@gmail.com', 'member'),
    (v_church_id, 'breekeys28@gmail.com', 'member'),
    (v_church_id, 'karla.bivens@gmail.com', 'member'),
    (v_church_id, 'jenigx@hotmail.com', 'member'),
    (v_church_id, 'kennethbritt@hotmail.com', 'member'),
    (v_church_id, 'teambroden@gmail.com', 'member'),
    (v_church_id, 'jossybroden@gmail.com', 'member'),
    (v_church_id, 'jeannabrower1971@gmail.com', 'member'),
    (v_church_id, 'rjpaint721@gmail.com', 'member'),
    (v_church_id, 'nicolethehealthcoach@gmail.com', 'member'),
    (v_church_id, 'carlson_michelle@hotmail.com', 'member'),
    (v_church_id, 'lovelydolll8dy@comcast.net', 'member'),
    (v_church_id, 'drew.celaya@yahoo.com', 'member'),
    (v_church_id, 'bearssportsfan@yahoo.com', 'member'),
    (v_church_id, 'shacheb@gmail.com', 'member'),
    (v_church_id, 'clark7004@suddenlink.net', 'member'),
    (v_church_id, 'clarkjacqueline13@gmail.com', 'member'),
    (v_church_id, 'pastorcooper@mac.com', 'member'),
    (v_church_id, 'shanecooper94@gmail.com', 'member'),
    (v_church_id, 'lcoppedge@hotmail.com', 'member'),
    (v_church_id, 'crysangel25@gmail.com', 'member'),
    (v_church_id, 'levaina7@live.com', 'member'),
    (v_church_id, 'alonso09@gmail.com', 'member'),
    (v_church_id, 'knicole.curtis@gmail.com', 'member'),
    (v_church_id, 'songstressjoy@hotmail.com', 'member'),
    (v_church_id, 'patrice@livingmanna.live', 'member'),
    (v_church_id, 'marieearlington@gmail.com', 'member'),
    (v_church_id, 'alyssia.plata@gmail.com', 'member'),
    (v_church_id, 'amdegibson@gmail.com', 'member'),
    (v_church_id, 'qpeazy7@yahoo.com', 'member'),
    (v_church_id, 'fit2ahtee@yahoo.com', 'member'),
    (v_church_id, 'godsrn33@yahoo.com', 'member'),
    (v_church_id, 'johnnyoheasley69@gmail.com', 'member'),
    (v_church_id, 'graham-henry@att.net', 'member'),
    (v_church_id, 'pretty_tigger13@yahoo.com', 'member'),
    (v_church_id, 'mariajosehummel@gmail.com', 'member'),
    (v_church_id, 'terri.humphreys@ashgrove.com', 'member'),
    (v_church_id, 'gnizzard@gmail.com', 'member'),
    (v_church_id, 'sdizzard@gmail.com', 'member'),
    (v_church_id, 'artice3201@gmail.com', 'member'),
    (v_church_id, 'artmon@bellsouth.net', 'member'),
    (v_church_id, 'd2rjohnson77@gmail.com', 'member'),
    (v_church_id, 'sharonfaye191973@gmail.com', 'member'),
    (v_church_id, 'deezinesd9@gmail.com', 'member'),
    (v_church_id, 'gigi@livingmanna.church', 'member'),
    (v_church_id, 'cyntiebevz@gmail.com', 'member'),
    (v_church_id, 'windthinnet@yahoo.com', 'member'),
    (v_church_id, 'james@jak-cpas.com', 'member'),
    (v_church_id, 'mkendrick@puc.edu', 'member'),
    (v_church_id, 'kdonna462@aol.com', 'member'),
    (v_church_id, 'tracylofton2003@yahoo.com', 'member'),
    (v_church_id, 'shellyssnowdogs@gmail.com', 'member'),
    (v_church_id, 'followthecreator@live.com', 'member'),
    (v_church_id, 'mcdonalddonna@msn.com', 'member'),
    (v_church_id, 'nursehmcdonald@icloud.com', 'member'),
    (v_church_id, 'pamc16@aol.com', 'member'),
    (v_church_id, 'kiyana.mckenzie@gmail.com', 'member'),
    (v_church_id, 'pmitchellcsm@gmail.com', 'member'),
    (v_church_id, 'lesanndramorton@yahoo.com', 'member'),
    (v_church_id, 'amuller@capitalcitysdac.org', 'member'),
    (v_church_id, 'atontemyers@gmail.com', 'member'),
    (v_church_id, 'imyers@northeastern.org', 'member'),
    (v_church_id, 'laurence777nagy@gmail.com', 'member'),
    (v_church_id, 'mae23ann@gmail.com', 'member'),
    (v_church_id, 'leafriser4197@yahoo.com', 'member'),
    (v_church_id, 'jonesgenevia@hotmail.com', 'member'),
    (v_church_id, 'tbumphus82@gmail.com', 'member'),
    (v_church_id, 'tpchurchgirl@gmail.com', 'member'),
    (v_church_id, 'sperkins@smbp.com', 'member'),
    (v_church_id, 'artelle@yahoo.com', 'member'),
    (v_church_id, 'newstart3tv@gmail.com', 'member'),
    (v_church_id, 'regina.d.irector@gmail.com', 'member'),
    (v_church_id, 'lorich84@yahoo.com', 'member'),
    (v_church_id, 'slrvlr6970@gmail.com', 'member'),
    (v_church_id, 'b.roni.sam.roderick@gmail.com', 'member'),
    (v_church_id, 'sandram.silas@gmail.com', 'member'),
    (v_church_id, 'amara_dk@hotmail.com', 'member'),
    (v_church_id, 'bladeofhope17@gmail.com', 'member'),
    (v_church_id, 'randyst.amant@gmail.com', 'member'),
    (v_church_id, 'cstan705@cox.net', 'member'),
    (v_church_id, 'drms.my.email@gmail.com', 'member'),
    (v_church_id, 'kristinakmhomes@msn.com', 'member'),
    (v_church_id, 'mykmhomes@msn.com', 'member'),
    (v_church_id, 'gabrieltuailuuluu@gmail.com', 'member'),
    (v_church_id, 'eelco.vanderveen@gmail.com', 'member'),
    (v_church_id, 'anavan631@gmail.com', 'member'),
    (v_church_id, 'wordink@yahoo.com', 'member'),
    (v_church_id, 'mhamilton144@yahoo.com', 'member'),
    (v_church_id, 'doctorwhyte@gmail.com', 'member'),
    (v_church_id, 'delewonyoung@gmail.com', 'member'),
    (v_church_id, 'lynne.zeigler7@gmail.com', 'member')
  ON CONFLICT (church_id, email) DO NOTHING;

  RAISE NOTICE 'Inserted 95 pre-approved emails for Living Manna';
END $$;

-- 4. Immediately import any who already have accounts
DO $$
DECLARE
  v_church_id uuid;
  v_preapproved RECORD;
  v_user_id uuid;
  v_imported int := 0;
  v_already int := 0;
BEGIN
  SELECT id INTO v_church_id
  FROM public.churches
  WHERE name ILIKE '%Living Manna%'
  LIMIT 1;

  FOR v_preapproved IN
    SELECT id, email, role
    FROM public.church_preapproved_members
    WHERE church_id = v_church_id AND claimed = false
  LOOP
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE LOWER(email) = LOWER(v_preapproved.email)
    LIMIT 1;

    IF v_user_id IS NOT NULL THEN
      -- Check if already a member
      IF EXISTS (
        SELECT 1 FROM public.church_members
        WHERE church_id = v_church_id AND user_id = v_user_id
      ) THEN
        -- Mark as claimed since they're already a member
        UPDATE public.church_preapproved_members
        SET claimed = true, claimed_at = NOW()
        WHERE id = v_preapproved.id;
        v_already := v_already + 1;
      ELSE
        -- Add as member
        INSERT INTO public.church_members (church_id, user_id, role, joined_at)
        VALUES (v_church_id, v_user_id, v_preapproved.role, NOW());

        UPDATE public.church_preapproved_members
        SET claimed = true, claimed_at = NOW()
        WHERE id = v_preapproved.id;
        v_imported := v_imported + 1;
      END IF;
    END IF;
  END LOOP;

  RAISE NOTICE '--- IMPORT RESULTS ---';
  RAISE NOTICE 'New members added: %', v_imported;
  RAISE NOTICE 'Already members: %', v_already;
  RAISE NOTICE 'Awaiting signup: remaining unclaimed rows in church_preapproved_members';
END $$;
