import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const FALLBACK_TRACKS = [
  '/audio/still-water-mind.mp3',
  '/audio/still-water-mind-2.mp3',
  '/audio/still-waters-quiet-soul.mp3',
  '/audio/weightless-river.mp3',
];

const CROSSFADE_MS = 4000;
const BASE_VOLUME = 0.30;

export function useBackgroundMusic(_variant: 'night' | 'morning') {
  const audioARef = useRef<HTMLAudioElement | null>(null);
  const audioBRef = useRef<HTMLAudioElement | null>(null);
  const activeRef = useRef<'a' | 'b'>('a');
  const trackIndexRef = useRef(0);
  const wantPlayRef = useRef(false);
  const crossfadeTimerRef = useRef<number>();
  const tracksRef = useRef<string[]>(FALLBACK_TRACKS);
  const [tracksLoaded, setTracksLoaded] = useState(false);

  // Load tracks from DB
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('watch_music_tracks')
          .select('file_url')
          .eq('is_active', true)
          .eq('category', 'watch')
          .order('sort_order', { ascending: true });

        if (data && data.length > 0) {
          tracksRef.current = data.map((t: any) => t.file_url);
        }
      } catch {
        // Use fallback
      }
      // Shuffle tracks so playback order is different every session
      for (let i = tracksRef.current.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tracksRef.current[i], tracksRef.current[j]] = [tracksRef.current[j], tracksRef.current[i]];
      }
      trackIndexRef.current = 0;
      setTracksLoaded(true);
    })();
  }, []);

  const getActive = useCallback(() =>
    activeRef.current === 'a' ? audioARef.current : audioBRef.current, []);
  const getIncoming = useCallback(() =>
    activeRef.current === 'a' ? audioBRef.current : audioARef.current, []);

  const crossfadeToNext = useCallback(() => {
    if (!wantPlayRef.current) return;
    const outgoing = getActive();
    const incoming = getIncoming();
    if (!outgoing || !incoming) return;

    trackIndexRef.current = (trackIndexRef.current + 1) % tracksRef.current.length;
    incoming.src = tracksRef.current[trackIndexRef.current];
    incoming.volume = 0;
    incoming.play().catch((e) => console.warn('[bgMusic] crossfade play failed:', e));

    const steps = 40;
    const stepMs = CROSSFADE_MS / steps;
    let step = 0;
    const outStartVol = outgoing.volume;

    if (crossfadeTimerRef.current) clearInterval(crossfadeTimerRef.current);
    crossfadeTimerRef.current = window.setInterval(() => {
      step++;
      const progress = step / steps;
      outgoing.volume = Math.max(0, outStartVol * (1 - progress));
      incoming.volume = BASE_VOLUME * progress;
      if (step >= steps) {
        clearInterval(crossfadeTimerRef.current);
        outgoing.pause();
        outgoing.src = '';
        incoming.volume = BASE_VOLUME;
        activeRef.current = activeRef.current === 'a' ? 'b' : 'a';
      }
    }, stepMs);
  }, [getActive, getIncoming]);

  useEffect(() => {
    if (!tracksLoaded) return;

    const audioA = new Audio();
    const audioB = new Audio();
    [audioA, audioB].forEach(a => {
      a.loop = false;
      a.volume = 0;
      a.preload = 'auto';
    });
    audioA.volume = BASE_VOLUME;
    audioA.src = tracksRef.current[trackIndexRef.current];
    audioARef.current = audioA;
    audioBRef.current = audioB;
    activeRef.current = 'a';

    const handleTimeUpdate = () => {
      const active = activeRef.current === 'a' ? audioA : audioB;
      if (
        active.duration &&
        active.duration - active.currentTime <= CROSSFADE_MS / 1000 &&
        active.duration - active.currentTime > (CROSSFADE_MS / 1000) - 0.3 &&
        wantPlayRef.current
      ) {
        crossfadeToNext();
      }
    };

    audioA.addEventListener('timeupdate', handleTimeUpdate);
    audioB.addEventListener('timeupdate', handleTimeUpdate);

    const handleEnded = () => {
      if (wantPlayRef.current) crossfadeToNext();
    };
    audioA.addEventListener('ended', handleEnded);
    audioB.addEventListener('ended', handleEnded);

    const onError = (e: Event) => {
      console.warn('[bgMusic] audio error:', (e.target as HTMLAudioElement)?.error?.message);
    };
    audioA.addEventListener('error', onError);
    audioB.addEventListener('error', onError);

    return () => {
      if (crossfadeTimerRef.current) clearInterval(crossfadeTimerRef.current);
      [audioA, audioB].forEach(a => {
        a.removeEventListener('timeupdate', handleTimeUpdate);
        a.removeEventListener('ended', handleEnded);
        a.removeEventListener('error', onError);
        a.pause();
        a.removeAttribute('src');
        a.load();
      });
      wantPlayRef.current = false;
    };
  }, [tracksLoaded, crossfadeToNext]);

  const play = useCallback(() => {
    wantPlayRef.current = true;
    const audio = getActive();
    if (!audio) return;
    audio.play().catch((e) => console.warn('[bgMusic] play failed:', e));
  }, [getActive]);

  const pause = useCallback(() => {
    wantPlayRef.current = false;
    if (crossfadeTimerRef.current) clearInterval(crossfadeTimerRef.current);
    audioARef.current?.pause();
    audioBRef.current?.pause();
  }, []);

  return { play, pause };
}
