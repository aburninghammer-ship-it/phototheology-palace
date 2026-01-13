-- Add unique constraint on teachable_email for upsert operations
ALTER TABLE public.teachable_students ADD CONSTRAINT teachable_students_teachable_email_key UNIQUE (teachable_email);