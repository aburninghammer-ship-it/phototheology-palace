-- Bulk import members for Living Manna Church
-- Members without existing accounts will be skipped (they need to sign up first, then be invited)

DO $$
DECLARE
  v_church_id uuid;
  v_user_id uuid;
  v_email text;
  v_imported int := 0;
  v_skipped int := 0;
  v_already_member int := 0;
  v_emails text[] := ARRAY[
    'pprempeh@gmail.com',
    'silvia927.sa@gmail.com',
    'gavinanthony1@gmail.com',
    'norwalksonbeams@yahoo.com',
    'bautista.phillip@gmail.com',
    'Breekeys28@gmail.com',
    'karla.bivens@gmail.com',
    'jenigx@hotmail.com',
    'kennethbritt@hotmail.com',
    'TeamBroden@gmail.com',
    'jossybroden@gmail.com',
    'jeannabrower1971@gmail.com',
    'rjpaint721@gmail.com',
    'nicolethehealthcoach@gmail.com',
    'carlson_michelle@hotmail.com',
    'lovelydolll8dy@comcast.net',
    'drew.celaya@yahoo.com',
    'bearssportsfan@yahoo.com',
    'shacheb@gmail.com',
    'clark7004@suddenlink.net',
    'clarkjacqueline13@gmail.com',
    'pastorcooper@mac.com',
    'shanecooper94@gmail.com',
    'lcoppedge@hotmail.com',
    'crysangel25@gmail.com',
    'levaina7@live.com',
    'alonso09@gmail.com',
    'knicole.curtis@gmail.com',
    'songstressjoy@hotmail.com',
    'patrice@livingmanna.live',
    'marieearlington@gmail.com',
    'alyssia.plata@gmail.com',
    'amdegibson@gmail.com',
    'qpeazy7@yahoo.com',
    'fit2ahtee@yahoo.com',
    'Godsrn33@yahoo.com',
    'johnnyoheasley69@gmail.com',
    'graham-henry@att.net',
    'pretty_tigger13@yahoo.com',
    'mariajosehummel@gmail.com',
    'terri.humphreys@ashgrove.com',
    'gnizzard@gmail.com',
    'sdizzard@gmail.com',
    'artice3201@gmail.com',
    'artmon@bellsouth.net',
    'd2rjohnson77@gmail.com',
    'sharonfaye191973@gmail.com',
    'deezinesd9@gmail.com',
    'gigi@livingmanna.church',
    'cyntiebevz@gmail.com',
    'windthinnet@yahoo.com',
    'james@jak-cpas.com',
    'mkendrick@puc.edu',
    'kdonna462@aol.com',
    'tracylofton2003@yahoo.com',
    'shellyssnowdogs@gmail.com',
    'followthecreator@live.com',
    'McDonaldDonna@msn.com',
    'nursehmcdonald@icloud.com',
    'pamc16@aol.com',
    'kiyana.mckenzie@gmail.com',
    'pmitchellcsm@gmail.com',
    'lesanndramorton@yahoo.com',
    'AMuller@capitalcitysdac.org',
    'atontemyers@gmail.com',
    'imyers@northeastern.org',
    'laurence777nagy@gmail.com',
    'mae23ann@gmail.com',
    'leafriser4197@yahoo.com',
    'jonesgenevia@hotmail.com',
    'tbumphus82@gmail.com',
    'tpchurchgirl@gmail.com',
    'sperkins@smbp.com',
    'artelle@yahoo.com',
    'newstart3tv@gmail.com',
    'regina.d.irector@gmail.com',
    'lorich84@yahoo.com',
    'slrvlr6970@gmail.com',
    'b.roni.sam.roderick@gmail.com',
    'sandram.silas@gmail.com',
    'amara_dk@hotmail.com',
    'bladeofhope17@gmail.com',
    'randyst.amant@gmail.com',
    'cstan705@cox.net',
    'DRMS.My.Email@gmail.com',
    'kristinakmhomes@msn.com',
    'mykmhomes@msn.com',
    'gabrieltuailuuluu@gmail.com',
    'eelco.vanderveen@gmail.com',
    'anavan631@gmail.com',
    'wordink@yahoo.com',
    'mhamilton144@yahoo.com',
    'doctorwhyte@gmail.com',
    'delewonyoung@gmail.com',
    'lynne.zeigler7@gmail.com'
  ];
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

  -- Loop through each email and add as member
  FOREACH v_email IN ARRAY v_emails
  LOOP
    -- Look up user by email (case-insensitive)
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE LOWER(email) = LOWER(v_email)
    LIMIT 1;

    IF v_user_id IS NULL THEN
      RAISE NOTICE 'SKIPPED - No account found for: %', v_email;
      v_skipped := v_skipped + 1;
      CONTINUE;
    END IF;

    -- Check if already a member
    IF EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = v_church_id AND user_id = v_user_id
    ) THEN
      RAISE NOTICE 'ALREADY MEMBER - %', v_email;
      v_already_member := v_already_member + 1;
      CONTINUE;
    END IF;

    -- Insert as member (default role = 'member')
    INSERT INTO public.church_members (church_id, user_id, role, joined_at)
    VALUES (v_church_id, v_user_id, 'member', NOW());

    RAISE NOTICE 'IMPORTED - %', v_email;
    v_imported := v_imported + 1;
  END LOOP;

  RAISE NOTICE '--- IMPORT COMPLETE ---';
  RAISE NOTICE 'Imported: %', v_imported;
  RAISE NOTICE 'Already members: %', v_already_member;
  RAISE NOTICE 'Skipped (no account): %', v_skipped;
  RAISE NOTICE 'Total processed: %', array_length(v_emails, 1);
END $$;
