import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { ReadingSequenceBlock } from "@/types/readingSequence";

interface AudioPlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  sequences: ReadingSequenceBlock[];
  currentSeqIdx: number;
  currentItemIdx: number;
  currentVerseIdx: number;
  sequenceName?: string;
}

interface GlobalAudioContextType {
  // Bible reading state
  bibleAudioState: AudioPlaybackState | null;
  setBibleAudioState: (state: AudioPlaybackState | null) => void;
  
  // Control functions
  startBibleReading: (sequences: ReadingSequenceBlock[], name?: string) => void;
  stopBibleReading: () => void;
  updateBibleProgress: (seqIdx: number, itemIdx: number, verseIdx: number) => void;
  pauseBibleReading: () => void;
  resumeBibleReading: () => void;
  
  // Mini player visibility
  showMiniPlayer: boolean;
  setShowMiniPlayer: (show: boolean) => void;
  
  // Reference to actual audio element for external control
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const GlobalAudioContext = createContext<GlobalAudioContextType | null>(null);

export const useGlobalAudio = () => {
  const context = useContext(GlobalAudioContext);
  if (!context) {
    throw new Error("useGlobalAudio must be used within GlobalAudioProvider");
  }
  return context;
};

export const GlobalAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bibleAudioState, setBibleAudioState] = useState<AudioPlaybackState | null>(null);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startBibleReading = useCallback((sequences: ReadingSequenceBlock[], name?: string) => {
    setBibleAudioState({
      isPlaying: true,
      isPaused: false,
      sequences,
      currentSeqIdx: 0,
      currentItemIdx: 0,
      currentVerseIdx: 0,
      sequenceName: name,
    });
    setShowMiniPlayer(true);
  }, []);

  const stopBibleReading = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setBibleAudioState(null);
    setShowMiniPlayer(false);
  }, []);

  const updateBibleProgress = useCallback((seqIdx: number, itemIdx: number, verseIdx: number) => {
    setBibleAudioState(prev => prev ? {
      ...prev,
      currentSeqIdx: seqIdx,
      currentItemIdx: itemIdx,
      currentVerseIdx: verseIdx,
    } : null);
  }, []);

  const pauseBibleReading = useCallback(() => {
    setBibleAudioState(prev => prev ? { ...prev, isPaused: true, isPlaying: false } : null);
  }, []);

  const resumeBibleReading = useCallback(() => {
    setBibleAudioState(prev => prev ? { ...prev, isPaused: false, isPlaying: true } : null);
  }, []);

  return (
    <GlobalAudioContext.Provider value={{
      bibleAudioState,
      setBibleAudioState,
      startBibleReading,
      stopBibleReading,
      updateBibleProgress,
      pauseBibleReading,
      resumeBibleReading,
      showMiniPlayer,
      setShowMiniPlayer,
      audioRef,
    }}>
      {children}
    </GlobalAudioContext.Provider>
  );
};
