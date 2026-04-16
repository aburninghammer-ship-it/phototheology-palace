import { useState, useCallback, useRef, useEffect } from "react";
import { isOnline } from "@/services/offlineAudioCache";

interface UseOfflineTTSOptions {
  onVerseChange?: (verseNumber: number) => void;
  defaultRate?: number;
}

interface Verse {
  verse: number;
  text: string;
}

/**
 * Offline-capable TTS hook using browser's native speechSynthesis
 * This is used as a fallback when ElevenLabs is unavailable (offline mode)
 */
export const useOfflineTTS = (verses: Verse[], options?: UseOfflineTTSOptions) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(options?.defaultRate ?? 1);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef(false);
  const keepAliveIntervalRef = useRef<number | null>(null);

  // Keep speech synthesis alive on mobile browsers
  useEffect(() => {
    const keepAlive = () => {
      if (isPlayingRef.current && speechSynthesis.speaking) {
        if (speechSynthesis.paused) {
          console.log('[OfflineTTS] Resuming suspended speech');
          speechSynthesis.resume();
        }
      }
    };

    if (isPlaying) {
      keepAliveIntervalRef.current = window.setInterval(keepAlive, 5000);
    }

    return () => {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
    };
  }, [isPlaying]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      // Filter to English voices and prioritize higher quality ones
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      setAvailableVoices(englishVoices);
      
      // Try to select a good default voice
      const preferredVoice = englishVoices.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Microsoft') || 
        v.name.includes('Samantha') ||
        v.name.includes('Daniel')
      ) || englishVoices[0];
      
      if (preferredVoice && !selectedVoice) {
        setSelectedVoice(preferredVoice);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
      speechSynthesis.cancel();
    };
  }, []);

  const speakVerse = useCallback((verseIndex: number) => {
    if (!verses[verseIndex]) return;
    
    speechSynthesis.cancel();
    
    const verse = verses[verseIndex];
    const text = verse.text;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackRate;
    utterance.pitch = 1;
    utterance.lang = 'en-US'; // Force English to prevent Hebrew detection
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.onstart = () => {
      setCurrentVerseIndex(verseIndex);
      options?.onVerseChange?.(verse.verse);
    };
    
    utterance.onend = () => {
      if (isPlayingRef.current && verseIndex < verses.length - 1) {
        // Small pause between verses
        setTimeout(() => {
          if (isPlayingRef.current) {
            speakVerse(verseIndex + 1);
          }
        }, 300);
      } else if (verseIndex >= verses.length - 1) {
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    };
    
    utterance.onerror = (event) => {
      console.error('[OfflineTTS] Speech synthesis error:', event);
      setIsPlaying(false);
      isPlayingRef.current = false;
    };
    
    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [verses, playbackRate, selectedVoice, options]);

  const play = useCallback((startVerseIndex?: number) => {
    const startIndex = startVerseIndex ?? currentVerseIndex;
    setIsPlaying(true);
    isPlayingRef.current = true;
    speakVerse(startIndex);
  }, [currentVerseIndex, speakVerse]);

  const pause = useCallback(() => {
    speechSynthesis.pause();
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  const resume = useCallback(() => {
    speechSynthesis.resume();
    setIsPlaying(true);
    isPlayingRef.current = true;
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    isPlayingRef.current = false;
    setCurrentVerseIndex(0);
  }, []);

  const skipToVerse = useCallback((verseNumber: number) => {
    const verseIndex = verses.findIndex(v => v.verse === verseNumber);
    if (verseIndex !== -1) {
      speechSynthesis.cancel();
      setCurrentVerseIndex(verseIndex);
      if (isPlayingRef.current) {
        speakVerse(verseIndex);
      }
    }
  }, [verses, speakVerse]);

  const nextVerse = useCallback(() => {
    if (currentVerseIndex < verses.length - 1) {
      skipToVerse(verses[currentVerseIndex + 1].verse);
    }
  }, [currentVerseIndex, verses, skipToVerse]);

  const previousVerse = useCallback(() => {
    if (currentVerseIndex > 0) {
      skipToVerse(verses[currentVerseIndex - 1].verse);
    }
  }, [currentVerseIndex, verses, skipToVerse]);

  const changePlaybackRate = useCallback((rate: number) => {
    setPlaybackRate(rate);
    // If currently playing, restart with new rate
    if (isPlayingRef.current) {
      speechSynthesis.cancel();
      setTimeout(() => {
        if (isPlayingRef.current) {
          speakVerse(currentVerseIndex);
        }
      }, 100);
    }
  }, [currentVerseIndex, speakVerse]);

  const changeVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    // If currently playing, restart with new voice
    if (isPlayingRef.current) {
      speechSynthesis.cancel();
      setTimeout(() => {
        if (isPlayingRef.current) {
          speakVerse(currentVerseIndex);
        }
      }, 100);
    }
  }, [currentVerseIndex, speakVerse]);

  // Speak a single text (for commentary, etc.)
  const speakText = useCallback((text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackRate;
      utterance.pitch = 1;
      utterance.lang = 'en-US'; // Force English to prevent Hebrew detection
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);
      
      speechSynthesis.speak(utterance);
    });
  }, [playbackRate, selectedVoice]);

  return {
    isPlaying,
    currentVerseIndex,
    currentVerse: verses[currentVerseIndex]?.verse ?? 1,
    playbackRate,
    availableVoices,
    selectedVoice,
    play,
    pause,
    resume,
    stop,
    skipToVerse,
    nextVerse,
    previousVerse,
    changePlaybackRate,
    changeVoice,
    speakText,
    isOnline: isOnline(),
  };
};
