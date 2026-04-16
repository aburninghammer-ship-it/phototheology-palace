-- Add danyelle0214@aol.com as a pre-approved Living Manna member
DO $$
DECLARE
  v_church_id uuid;
BEGIN
  SELECT id INTO v_church_id
  FROM public.churches
  WHERE name ILIKE '%Living Manna%'
  LIMIT 1;

  IF v_church_id IS NULL THEN
    RAISE EXCEPTION 'Living Manna church not found in churches table';
  END IF;

  INSERT INTO public.church_preapproved_members (church_id, email, role)
  VALUES (v_church_id, 'danyelle0214@aol.com', 'member')
  ON CONFLICT (church_id, email) DO NOTHING;

  RAISE NOTICE 'Added danyelle0214@aol.com as pre-approved Living Manna member';
END $$;
