-- Make title and theme_passage nullable to allow saving incomplete sermons
ALTER TABLE public.sermons ALTER COLUMN title DROP NOT NULL;
ALTER TABLE public.sermons ALTER COLUMN theme_passage DROP NOT NULL;