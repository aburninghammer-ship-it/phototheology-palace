/**
 * useImmersiveMode - Global state for immersive audio playback
 * Manages fullscreen cinematic player with ambient music overlay
 */
import { useState, useCallback, useRef, useEffect } from "react";

export interface ImmersiveTrack {
  id: string;
  title: string;
  subtitle?: string;
  type: "commentary" | "apologetics" | "tour" | "devotional" | "study";
  /** The audio URL or a function that generates audio and returns a URL */
  audioUrl?: string;
  /** For continuous autoplay: the next track generator */
  generateAudio?: () => Promise<string | null>;
  /** Display text (verse text, script, etc.) */
  displayText?: string;
  /** Book/chapter for verse display */
  book?: string;
  chapter?: number;
  /** Mode label (Epic, Scholar, etc.) */
  modeName?: string;
  /** Icon emoji */
  icon?: string;
  /** Background audio mode: "music" (default cinematic tracks), "ambient-sounds" (nature/tones), "none" */
  ambientMode?: "music" | "ambient-sounds" | "none";
  /** Total session duration in seconds. When set, ambient music continues after voice ends and fades out at this mark. */
  sessionDurationSec?: number;
}

export interface ImmersiveQueue {
  tracks: ImmersiveTrack[];
  currentIndex: number;
}

export interface ImmersiveState {
  isOpen: boolean;
  queue: ImmersiveQueue;
  ambientMusicEnabled: boolean;
  ambientVolume: number;
  continuousPlay: boolean;
}

const STORAGE_KEY = "pt-immersive-prefs";

function loadPrefs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const p = JSON.parse(saved);
      return {
        ambientMusicEnabled: p.ambientMusicEnabled ?? true,
        ambientVolume: p.ambientVolume ?? 0.25,
        continuousPlay: p.continuousPlay ?? true,
      };
    }
  } catch {}
  return { ambientMusicEnabled: true, ambientVolume: 0.25, continuousPlay: true };
}

export function useImmersiveMode() {
  const prefs = useRef(loadPrefs());
  const [state, setState] = useState<ImmersiveState>({
    isOpen: false,
    queue: { tracks: [], currentIndex: 0 },
    ambientMusicEnabled: prefs.current.ambientMusicEnabled,
    ambientVolume: prefs.current.ambientVolume,
    continuousPlay: prefs.current.continuousPlay,
  });

  // Persist preferences
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ambientMusicEnabled: state.ambientMusicEnabled,
      ambientVolume: state.ambientVolume,
      continuousPlay: state.continuousPlay,
    }));
  }, [state.ambientMusicEnabled, state.ambientVolume, state.continuousPlay]);

  const openImmersive = useCallback((tracks: ImmersiveTrack[], startIndex = 0) => {
    setState(s => ({
      ...s,
      isOpen: true,
      queue: { tracks, currentIndex: startIndex },
    }));
  }, []);

  const closeImmersive = useCallback(() => {
    setState(s => ({ ...s, isOpen: false }));
  }, []);

  const nextTrack = useCallback(() => {
    setState(s => {
      const next = s.queue.currentIndex + 1;
      if (next >= s.queue.tracks.length) return s;
      return { ...s, queue: { ...s.queue, currentIndex: next } };
    });
  }, []);

  const prevTrack = useCallback(() => {
    setState(s => {
      const prev = s.queue.currentIndex - 1;
      if (prev < 0) return s;
      return { ...s, queue: { ...s.queue, currentIndex: prev } };
    });
  }, []);

  const setAmbientMusic = useCallback((enabled: boolean) => {
    setState(s => ({ ...s, ambientMusicEnabled: enabled }));
  }, []);

  const setAmbientVolume = useCallback((vol: number) => {
    setState(s => ({ ...s, ambientVolume: vol }));
  }, []);

  const setContinuousPlay = useCallback((enabled: boolean) => {
    setState(s => ({ ...s, continuousPlay: enabled }));
  }, []);

  const currentTrack = state.queue.tracks[state.queue.currentIndex] || null;
  const hasNext = state.queue.currentIndex < state.queue.tracks.length - 1;
  const hasPrev = state.queue.currentIndex > 0;

  return {
    ...state,
    currentTrack,
    hasNext,
    hasPrev,
    openImmersive,
    closeImmersive,
    nextTrack,
    prevTrack,
    setAmbientMusic,
    setAmbientVolume,
    setContinuousPlay,
  };
}
