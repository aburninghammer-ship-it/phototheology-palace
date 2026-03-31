import { useEffect, useRef, useState, useCallback } from 'react';

interface StreamingAudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number; // 0-1
  isLoading: boolean;
  analyserData: Uint8Array | null;
}

interface StreamingAudioControls {
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
}

export function useStreamingAudio(src: string): [StreamingAudioState, StreamingAudioControls] {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const [state, setState] = useState<StreamingAudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    progress: 0,
    isLoading: true,
    analyserData: null,
  });

  // Initialize audio element and Web Audio API
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata';
    audio.src = src;
    audioRef.current = audio;

    const onLoadedMetadata = () => {
      setState((s) => ({ ...s, duration: audio.duration, isLoading: false }));
    };
    const onTimeUpdate = () => {
      const progress = audio.duration > 0 ? audio.currentTime / audio.duration : 0;
      setState((s) => ({ ...s, currentTime: audio.currentTime, progress }));
    };
    const onPlay = () => setState((s) => ({ ...s, isPlaying: true }));
    const onPause = () => setState((s) => ({ ...s, isPlaying: false }));
    const onEnded = () => setState((s) => ({ ...s, isPlaying: false, progress: 1 }));
    const onWaiting = () => setState((s) => ({ ...s, isLoading: true }));
    const onCanPlay = () => setState((s) => ({ ...s, isLoading: false }));

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audioContextRef.current?.close();
    };
  }, [src]);

  // Connect Web Audio API for spatial audio and analyser
  const ensureAudioContext = useCallback(() => {
    if (audioContextRef.current || !audioRef.current) return;

    const ctx = new AudioContext();
    audioContextRef.current = ctx;

    const source = ctx.createMediaElementSource(audioRef.current);
    sourceNodeRef.current = source;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

    source.connect(analyser);
    analyser.connect(ctx.destination);
  }, []);

  // Update analyser data on animation frame when playing
  useEffect(() => {
    if (!state.isPlaying || !analyserRef.current || !dataArrayRef.current) return;

    let raf: number;
    const update = () => {
      analyserRef.current!.getByteFrequencyData(dataArrayRef.current!);
      setState((s) => ({ ...s, analyserData: new Uint8Array(dataArrayRef.current!.buffer.slice(0)) }));
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [state.isPlaying]);

  const play = useCallback(() => {
    ensureAudioContext();
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    audioRef.current?.play();
  }, [ensureAudioContext]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current?.paused) {
      play();
    } else {
      pause();
    }
  }, [play, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  return [state, { play, pause, togglePlayPause, seek }];
}
