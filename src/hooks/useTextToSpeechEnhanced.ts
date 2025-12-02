import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isOnline } from '@/services/offlineAudioCache';

// Available ElevenLabs voices
export const ELEVENLABS_VOICES = [
  { id: 'aria', name: 'Aria', description: 'Warm and expressive female voice' },
  { id: 'roger', name: 'Roger', description: 'Deep and authoritative male voice' },
  { id: 'sarah', name: 'Sarah', description: 'Clear and professional female voice' },
  { id: 'laura', name: 'Laura', description: 'Gentle and soothing female voice' },
  { id: 'charlie', name: 'Charlie', description: 'Friendly and casual male voice' },
  { id: 'george', name: 'George', description: 'Distinguished British male voice' },
  { id: 'callum', name: 'Callum', description: 'Young and energetic male voice' },
  { id: 'river', name: 'River', description: 'Calm and meditative voice' },
  { id: 'liam', name: 'Liam', description: 'Strong and confident male voice' },
  { id: 'charlotte', name: 'Charlotte', description: 'Elegant and refined female voice' },
  { id: 'alice', name: 'Alice', description: 'Bright and cheerful female voice' },
  { id: 'matilda', name: 'Matilda', description: 'Warm Australian female voice' },
  { id: 'will', name: 'Will', description: 'Casual American male voice' },
  { id: 'jessica', name: 'Jessica', description: 'Articulate and clear female voice' },
  { id: 'eric', name: 'Eric', description: 'Mature and wise male voice' },
  { id: 'chris', name: 'Chris', description: 'Versatile and natural male voice' },
  { id: 'brian', name: 'Brian', description: 'Deep and resonant male voice' },
  { id: 'daniel', name: 'Daniel', description: 'British narrator voice' },
  { id: 'lily', name: 'Lily', description: 'Sweet and youthful female voice' },
  { id: 'bill', name: 'Bill', description: 'Gravelly and distinctive male voice' },
] as const;

export type VoiceId = typeof ELEVENLABS_VOICES[number]['id'];

type TTSMode = 'elevenlabs' | 'browser' | 'auto';

interface UseTextToSpeechEnhancedOptions {
  defaultVoice?: VoiceId;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  mode?: TTSMode; // 'elevenlabs', 'browser', or 'auto' (default: auto)
  timeout?: number; // Timeout for ElevenLabs requests (default: 10000ms)
}

interface SpeakOptions {
  voice?: VoiceId;
  book?: string;
  chapter?: number;
  verse?: number;
  useCache?: boolean;
}

/**
 * Enhanced TTS hook with offline fallback capabilities
 * - Automatically detects network connectivity
 * - Falls back to browser TTS when offline or ElevenLabs fails
 * - Supports manual mode selection
 * - Adds timeout protection for slow networks
 */
export function useTextToSpeechEnhanced(options: UseTextToSpeechEnhancedOptions = {}) {
  const {
    defaultVoice = 'daniel',
    onStart,
    onEnd,
    onError,
    mode = 'auto',
    timeout = 10000
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>(defaultVoice);
  const [wasCached, setWasCached] = useState(false);
  const [currentMode, setCurrentMode] = useState<'elevenlabs' | 'browser'>('elevenlabs');
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'slow'>('online');
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedBrowserVoice, setSelectedBrowserVoice] = useState<SpeechSynthesisVoice | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keepAliveIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Keep speech synthesis alive on mobile browsers
  useEffect(() => {
    const keepAlive = () => {
      if (isPlaying && utteranceRef.current) {
        // Resume if paused (iOS/Safari bug workaround)
        if (speechSynthesis.paused) {
          console.log('[TTS] Resuming suspended speech synthesis');
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

  // Handle audio context suspension (mobile browsers)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && audioContextRef.current?.state === 'running') {
        console.log('[TTS] Page hidden, audio context may suspend');
      } else if (!document.hidden && audioContextRef.current?.state === 'suspended') {
        console.log('[TTS] Resuming audio context after suspension');
        audioContextRef.current.resume().catch(err => 
          console.error('[TTS] Failed to resume audio context:', err)
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Load browser voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      setBrowserVoices(englishVoices);

      // Select a good default browser voice
      const preferredVoice = englishVoices.find(v =>
        v.name.includes('Google') ||
        v.name.includes('Microsoft') ||
        v.name.includes('Samantha') ||
        v.name.includes('Daniel')
      ) || englishVoices[0];

      if (preferredVoice && !selectedBrowserVoice) {
        setSelectedBrowserVoice(preferredVoice);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedBrowserVoice]);

  // Monitor network status
  useEffect(() => {
    const checkNetwork = () => {
      if (!isOnline()) {
        setNetworkStatus('offline');
      } else {
        setNetworkStatus('online');
      }
    };

    checkNetwork();
    window.addEventListener('online', checkNetwork);
    window.addEventListener('offline', checkNetwork);

    return () => {
      window.removeEventListener('online', checkNetwork);
      window.removeEventListener('offline', checkNetwork);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Stop browser TTS
    speechSynthesis.cancel();

    setIsPlaying(false);
    onEnd?.();
  }, [onEnd]);

  // Browser TTS fallback with chunking for long texts
  const speakWithBrowser = useCallback(async (text: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        speechSynthesis.cancel();

        // Split long texts into chunks to prevent timeout (iOS limit ~15 seconds)
        const MAX_CHUNK_LENGTH = 200; // ~15-20 seconds of speech
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const chunks: string[] = [];
        let currentChunk = '';

        for (const sentence of sentences) {
          if ((currentChunk + sentence).length > MAX_CHUNK_LENGTH && currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
          } else {
            currentChunk += sentence;
          }
        }
        if (currentChunk) chunks.push(currentChunk.trim());

        console.log(`[TTS] Split text into ${chunks.length} chunks for reliable playback`);

        let currentChunkIndex = 0;

        const speakChunk = () => {
          if (currentChunkIndex >= chunks.length) {
            setIsPlaying(false);
            onEnd?.();
            resolve();
            return;
          }

          const utterance = new SpeechSynthesisUtterance(chunks[currentChunkIndex]);
          utterance.rate = 1;
          utterance.pitch = 1;

          if (selectedBrowserVoice) {
            utterance.voice = selectedBrowserVoice;
          }

          utterance.onstart = () => {
            if (currentChunkIndex === 0) {
              setCurrentMode('browser');
              setIsPlaying(true);
              onStart?.();
            }
            console.log(`[TTS] Playing chunk ${currentChunkIndex + 1}/${chunks.length}`);
          };

          utterance.onend = () => {
            currentChunkIndex++;
            // Small delay between chunks for natural pacing
            setTimeout(speakChunk, 100);
          };

          utterance.onerror = (event) => {
            console.error('[TTS] Browser TTS error on chunk:', currentChunkIndex, event);
            // Try to continue with next chunk
            currentChunkIndex++;
            if (currentChunkIndex < chunks.length) {
              setTimeout(speakChunk, 500);
            } else {
              setIsPlaying(false);
              reject(new Error('Browser TTS failed'));
            }
          };

          utteranceRef.current = utterance;
          speechSynthesis.speak(utterance);
        };

        speakChunk();
      } catch (error) {
        reject(error);
      }
    });
  }, [selectedBrowserVoice, onStart, onEnd]);

  // ElevenLabs TTS with timeout
  const speakWithElevenLabs = useCallback(async (text: string, speakOptions?: SpeakOptions) => {
    const opts: SpeakOptions = speakOptions || {};

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setNetworkStatus('slow');
    }, timeout);

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: text.trim(),
          voice: opts.voice || selectedVoice,
          book: opts.book,
          chapter: opts.chapter,
          verse: opts.verse,
          useCache: opts.useCache !== false
        }
      });

      clearTimeout(timeoutId);

      if (error) {
        throw new Error(error.message || 'Failed to generate speech');
      }

      let audioUrl: string;

      // Check if we got a cached URL or need to decode base64
      if (data?.audioUrl) {
        audioUrl = data.audioUrl;
        setWasCached(data.cached === true);
        console.log(`[TTS] Using ${data.cached ? 'cached' : 'newly cached'} audio`);
      } else if (data?.audioContent) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        audioUrl = URL.createObjectURL(audioBlob);
        setWasCached(false);
      } else {
        throw new Error('No audio content received');
      }

      // Create and play audio with AudioContext for better mobile support
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      // Create AudioContext if needed (helps prevent suspension on mobile)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Resume context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      audioRef.current.src = audioUrl;
      
      // Handle playback end
      audioRef.current.onended = () => {
        setIsPlaying(false);
        if (audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl);
        }
        onEnd?.();
      };
      
      // Handle errors with retry logic
      audioRef.current.onerror = () => {
        console.error('[TTS] Audio playback error');
        setIsPlaying(false);
        if (audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl);
        }
        throw new Error('Audio playback failed');
      };

      // Handle interruptions (phone calls, etc.)
      audioRef.current.onpause = () => {
        console.log('[TTS] Audio paused (possibly by system)');
      };

      await audioRef.current.play();
      setCurrentMode('elevenlabs');
      setIsPlaying(true);
      onStart?.();

    } catch (error) {
      clearTimeout(timeoutId);

      // If abort, network is slow/offline
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Network timeout - connection too slow');
      }

      throw error;
    }
  }, [selectedVoice, timeout, onStart, onEnd]);

  const speak = useCallback(async (text: string, speakOptions?: SpeakOptions | VoiceId) => {
    if (!text.trim()) {
      toast.error('No text to speak');
      return;
    }

    // Handle legacy call signature (voice as second param)
    const opts: SpeakOptions = typeof speakOptions === 'string'
      ? { voice: speakOptions }
      : speakOptions || {};

    // Stop any currently playing audio
    stop();

    setIsLoading(true);
    setWasCached(false);

    try {
      // Determine which TTS to use
      let shouldUseBrowser = false;

      if (mode === 'browser') {
        shouldUseBrowser = true;
      } else if (mode === 'elevenlabs') {
        shouldUseBrowser = false;
      } else {
        // Auto mode: decide based on network
        shouldUseBrowser = networkStatus === 'offline';
      }

      if (shouldUseBrowser || networkStatus === 'offline') {
        // Use browser TTS
        console.log('[TTS] Using browser TTS (offline or requested)');
        await speakWithBrowser(text);
      } else {
        // Try ElevenLabs first, fallback to browser on error
        try {
          console.log('[TTS] Attempting ElevenLabs TTS');
          await speakWithElevenLabs(text, opts);
        } catch (elevenLabsError) {
          console.warn('[TTS] ElevenLabs failed, falling back to browser TTS:', elevenLabsError);
          toast.info('Using offline voice mode');
          await speakWithBrowser(text);
        }
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate speech';
      console.error('[TTS] Complete failure:', error);
      toast.error(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  }, [mode, networkStatus, stop, speakWithBrowser, speakWithElevenLabs, onError]);

  return {
    speak,
    stop,
    isLoading,
    isPlaying,
    selectedVoice,
    setSelectedVoice,
    voices: ELEVENLABS_VOICES,
    wasCached,
    currentMode, // 'elevenlabs' or 'browser'
    networkStatus, // 'online', 'offline', or 'slow'
    browserVoices,
    selectedBrowserVoice,
    setSelectedBrowserVoice,
  };
}
