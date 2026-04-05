
-- Archive bible_commentaries
CREATE TABLE public.bible_commentaries_archive AS 
SELECT *, now() as archived_at FROM public.bible_commentaries;

-- Archive bible_audio_cache
CREATE TABLE public.bible_audio_cache_archive AS 
SELECT *, now() as archived_at FROM public.bible_audio_cache;

-- Archive verse_commentary_cache
CREATE TABLE public.verse_commentary_cache_archive AS 
SELECT *, now() as archived_at FROM public.verse_commentary_cache;

-- Archive egw_chapter_cache
CREATE TABLE public.egw_chapter_cache_archive AS 
SELECT *, now() as archived_at FROM public.egw_chapter_cache;

-- Archive image_bible_cache
CREATE TABLE public.image_bible_cache_archive AS 
SELECT *, now() as archived_at FROM public.image_bible_cache;
