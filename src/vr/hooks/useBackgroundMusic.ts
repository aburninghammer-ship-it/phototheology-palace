import { useEffect, useRef, useCallback } from 'react';

const SHARED_TRACKS = [
  '/audio/still-water-mind.mp3',
  '/audio/still-water-mind-2.mp3',
  '/audio/still-waters-quiet-soul.mp3',
  '/audio/weightless-river.mp3',
];

export function useBackgroundMusic(variant: 'night' | 'morning') {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackIndexRef = useRef(0);

  const tracks = SHARED_TRACKS;

  useEffect(() => {
    const audio = new Audio();
    audio.loop = false;
    audio.volume = 0.18;
    audioRef.current = audio;

    // Pick a random starting track
    trackIndexRef.current = Math.floor(Math.random() * tracks.length);

    const onEnded = () => {
      // Cycle to next track
      trackIndexRef.current = (trackIndexRef.current + 1) % tracks.length;
      audio.src = tracks[trackIndexRef.current];
      audio.play().catch(() => {});
    };

    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };
  }, [tracks]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.src || audio.src === window.location.href) {
      audio.src = tracks[trackIndexRef.current];
    }
    audio.play().catch(() => {});
  }, [tracks]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  return { play, pause };
}
