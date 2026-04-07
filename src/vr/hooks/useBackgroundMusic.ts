import { useEffect, useRef, useCallback } from 'react';

const SHARED_TRACKS = [
  '/audio/still-water-mind.mp3',
  '/audio/still-water-mind-2.mp3',
  '/audio/still-waters-quiet-soul.mp3',
  '/audio/weightless-river.mp3',
];

export function useBackgroundMusic(_variant: 'night' | 'morning') {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackIndexRef = useRef(Math.floor(Math.random() * SHARED_TRACKS.length));
  const wantPlayRef = useRef(false);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = false;
    audio.volume = 0.30;
    audio.preload = 'auto';
    audio.src = SHARED_TRACKS[trackIndexRef.current];
    audioRef.current = audio;

    const onEnded = () => {
      trackIndexRef.current = (trackIndexRef.current + 1) % SHARED_TRACKS.length;
      audio.src = SHARED_TRACKS[trackIndexRef.current];
      if (wantPlayRef.current) {
        audio.play().catch((e) => console.warn('[bgMusic] cycle play failed:', e));
      }
    };

    const onError = (e: Event) => {
      console.warn('[bgMusic] audio error:', (e.target as HTMLAudioElement)?.error?.message);
    };

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      wantPlayRef.current = false;
    };
  }, []);

  const play = useCallback(() => {
    wantPlayRef.current = true;
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch((e) => console.warn('[bgMusic] play failed:', e));
  }, []);

  const pause = useCallback(() => {
    wantPlayRef.current = false;
    audioRef.current?.pause();
  }, []);

  return { play, pause };
}
