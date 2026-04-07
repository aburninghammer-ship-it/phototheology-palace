import { useEffect, useRef, useCallback } from 'react';

const SHARED_TRACKS = [
  '/audio/still-water-mind.mp3',
  '/audio/still-water-mind-2.mp3',
  '/audio/still-waters-quiet-soul.mp3',
  '/audio/weightless-river.mp3',
];

const CROSSFADE_MS = 4000; // 4-second crossfade between songs
const BASE_VOLUME = 0.30;

export function useBackgroundMusic(_variant: 'night' | 'morning') {
  const audioARef = useRef<HTMLAudioElement | null>(null);
  const audioBRef = useRef<HTMLAudioElement | null>(null);
  const activeRef = useRef<'a' | 'b'>('a');
  const trackIndexRef = useRef(Math.floor(Math.random() * SHARED_TRACKS.length));
  const wantPlayRef = useRef(false);
  const crossfadeTimerRef = useRef<number>();

  const getActive = useCallback(() =>
    activeRef.current === 'a' ? audioARef.current : audioBRef.current, []);
  const getIncoming = useCallback(() =>
    activeRef.current === 'a' ? audioBRef.current : audioARef.current, []);

  const crossfadeToNext = useCallback(() => {
    if (!wantPlayRef.current) return;

    const outgoing = getActive();
    const incoming = getIncoming();
    if (!outgoing || !incoming) return;

    // Prepare next track
    trackIndexRef.current = (trackIndexRef.current + 1) % SHARED_TRACKS.length;
    incoming.src = SHARED_TRACKS[trackIndexRef.current];
    incoming.volume = 0;
    incoming.play().catch((e) => console.warn('[bgMusic] crossfade play failed:', e));

    // Crossfade: ramp volumes over CROSSFADE_MS
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
    const audioA = new Audio();
    const audioB = new Audio();
    [audioA, audioB].forEach(a => {
      a.loop = false;
      a.volume = 0;
      a.preload = 'auto';
    });
    audioA.volume = BASE_VOLUME;
    audioA.src = SHARED_TRACKS[trackIndexRef.current];
    audioARef.current = audioA;
    audioBRef.current = audioB;
    activeRef.current = 'a';

    // When active track is near end, start crossfade
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

    // Fallback: if track ends without crossfade trigger
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
  }, [crossfadeToNext]);

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
