import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { buildCacheKey, getCachedAudio, setCachedAudio } from '@/lib/ttsAudioCache';
import { isOnline } from '@/services/offlineAudioCache';
import { setupMediaSession, updateMediaSessionPlaybackState, clearMediaSession } from '@/lib/mediaSessionHelper';

// Available Speechify voices
export const OPENAI_VOICES = [
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative male' },
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
  { id: 'echo', name: 'Echo', description: 'Warm and conversational male' },
  { id: 'fable', name: 'Fable', description: 'Expressive British accent' },
  { id: 'nova', name: 'Nova', description: 'Warm and engaging female' },
  { id: 'shimmer', name: 'Shimmer', description: 'Clear and bright female' },
  { id: 'ash', name: 'Ash', description: 'Soft and gentle' },
  { id: 'coral', name: 'Coral', description: 'Warm and friendly female' },
  { id: 'sage', name: 'Sage', description: 'Calm and thoughtful' },
] as const;

export type VoiceId = typeof OPENAI_VOICES[number]['id'];

type TTSMode = 'openai' | 'browser' | 'auto';

interface UseTextToSpeechEnhancedOptions {
  defaultVoice?: VoiceId;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  mode?: TTSMode; // 'openai', 'browser', or 'auto' (default: auto)
  timeout?: number; // Timeout for OpenAI requests (default: 10000ms)
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
    defaultVoice = 'onyx',
    onStart,
    onEnd,
    onError,
    mode = 'auto',
    timeout = 10000
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, _setSelectedVoice] = useState<VoiceId>(() => {
    try {
      const saved = localStorage.getItem(`tts_voice_${defaultVoice}`);
      if (saved && OPENAI_VOICES.some(v => v.id === saved)) return saved as VoiceId;
    } catch {}
    return defaultVoice;
  });
  const setSelectedVoice = useCallback((voice: VoiceId) => {
    _setSelectedVoice(voice);
    try { localStorage.setItem(`tts_voice_${defaultVoice}`, voice); } catch {}
  }, [defaultVoice]);
  const [wasCached, setWasCached] = useState(false);
  const [currentMode, setCurrentMode] = useState<'openai' | 'browser'>('openai');
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'slow'>('online');
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedBrowserVoice, setSelectedBrowserVoice] = useState<SpeechSynthesisVoice | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keepAliveIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Preloaded audio cache: text hash → audio URL
  const preloadedAudioRef = useRef<Map<string, string>>(new Map());
  
  // Use refs for callbacks to avoid stale closures in event handlers
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);
  const onStartRef = useRef(onStart);
  
  // Keep refs updated
  useEffect(() => {
    onEndRef.current = onEnd;
    onErrorRef.current = onError;
    onStartRef.current = onStart;
  }, [onEnd, onError, onStart]);

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
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }

    // Stop browser TTS
    speechSynthesis.cancel();

    setIsPlaying(false);
    updateMediaSessionPlaybackState('none');
    // NOTE: Do NOT call onEndRef here - onEnd should only fire when audio
    // naturally completes, not when manually stopped. Calling it here causes
    // infinite loops when speak() calls stop() to clear previous audio.
  }, []);

  // Browser TTS fallback with chunking for long texts
  const speakWithBrowser = useCallback(async (text: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        speechSynthesis.cancel();

        // Capture voice at start to ensure consistency throughout playback
        const voiceToUse = selectedBrowserVoice;
        
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
            console.log('[TTS] All chunks completed');
            setIsPlaying(false);
            onEndRef.current?.();
            resolve();
            return;
          }

          const utterance = new SpeechSynthesisUtterance(chunks[currentChunkIndex]);
          
          // Set consistent voice settings for all chunks
          utterance.rate = 1;
          utterance.pitch = 1;
          utterance.volume = 1;
          utterance.lang = 'en-US'; // Force English to prevent Hebrew detection
          
          // Use the captured voice to ensure consistency across all chunks
          if (voiceToUse) {
            utterance.voice = voiceToUse;
          }

          utterance.onstart = () => {
            if (currentChunkIndex === 0) {
              setCurrentMode('browser');
              setIsPlaying(true);
              onStartRef.current?.();
            }
            console.log(`[TTS] Playing chunk ${currentChunkIndex + 1}/${chunks.length} with voice: ${voiceToUse?.name || 'default'}`);
          };

          utterance.onend = () => {
            currentChunkIndex++;
            // Small delay between chunks for natural pacing
            setTimeout(speakChunk, 150);
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
  }, [selectedBrowserVoice]);

  // OpenAI TTS with timeout
  const speakWithElevenLabs = useCallback(async (text: string, speakOptions?: SpeakOptions) => {
    const opts: SpeakOptions = speakOptions || {};
    const voiceForCache = (opts.voice || selectedVoice) as string;

    // Check preloaded cache first — instant playback for preloaded sections
    const cacheKey = `${voiceForCache}:${text.slice(0, 120)}`;
    const preloadedUrl = preloadedAudioRef.current.get(cacheKey);
    if (preloadedUrl) {
      console.log('[TTS] Using preloaded audio — zero gap!');
      preloadedAudioRef.current.delete(cacheKey);

      if (!audioRef.current) audioRef.current = new Audio();
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const audio = audioRef.current;
      const isBlobUrl = preloadedUrl.startsWith('blob:');
      audio.onended = () => {
        setIsPlaying(false);
        if (isBlobUrl) URL.revokeObjectURL(preloadedUrl);
        updateMediaSessionPlaybackState('none');
        onEndRef.current?.();
      };
      audio.onerror = (e) => {
        console.error('[TTS] Preloaded audio error:', e);
        setIsPlaying(false);
        if (isBlobUrl) URL.revokeObjectURL(preloadedUrl);
        onErrorRef.current?.('Audio playback failed');
      };
      audio.src = preloadedUrl;
      audio.load();
      await audio.play();
      setCurrentMode('openai');
      setIsPlaying(true);
      setWasCached(true);
      onStartRef.current?.();
      return;
    }

    // MOBILE FIX: Create and resume AudioContext + prime Audio element immediately
    // within the user gesture context, BEFORE the async network call.
    // If we wait until after fetch, the gesture context expires and play() fails.
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    // Prime the audio element with a silent source so mobile browsers "unlock" it
    // within the gesture context. This prevents NotAllowedError on play() later.
    const silentPrime = audioRef.current;
    try {
      silentPrime.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
      silentPrime.load();
      await silentPrime.play().catch(() => {});
      silentPrime.pause();
    } catch {}

    // Calculate dynamic timeout based on text length (longer texts need more time)
    const baseTimeout = Math.max(timeout, 15000); // At least 15 seconds
    const textLengthBonus = Math.min(text.length * 10, 30000); // Up to 30 extra seconds for long texts
    const dynamicTimeout = baseTimeout + textLengthBonus;
    
    console.log(`[TTS] Starting with ${dynamicTimeout}ms timeout for ${text.length} chars`);

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let timedOut = false;
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        timedOut = true;
        setNetworkStatus('slow');
        reject(new Error('Network timeout - connection too slow'));
      }, dynamicTimeout);
    });

    try {
      const requestedVoice = (opts.voice || selectedVoice) as unknown as string;
      const normalizedVoice = (requestedVoice === 'ballad'
        ? 'sage'
        : requestedVoice === 'verse'
          ? 'fable'
          : requestedVoice) as VoiceId;

      const clientCacheKey = await buildCacheKey(text.trim(), normalizedVoice, 'openai');
      const cachedBlob = await getCachedAudio(clientCacheKey);

      let audioUrl: string;

      if (cachedBlob) {
        if (timeoutId) clearTimeout(timeoutId);
        audioUrl = URL.createObjectURL(cachedBlob);
        setWasCached(true);
        console.log('[TTS Enhanced] Client cache hit, no edge function call');
      } else {
        const invokePromise = supabase.functions.invoke('text-to-speech', {
          body: {
            text: text.trim(),
            voice: normalizedVoice,
            provider: 'openai',
            book: opts.book,
            chapter: opts.chapter,
            verse: opts.verse,
            useCache: opts.useCache !== false
          }
        });

        // Race between invoke and timeout
        const { data, error } = await Promise.race([invokePromise, timeoutPromise]) as Awaited<typeof invokePromise>;

        if (timeoutId) clearTimeout(timeoutId);
        
        if (timedOut) {
          throw new Error('Network timeout - connection too slow');
        }

        if (error) {
          throw new Error(error.message || 'Failed to generate speech');
        }

        // Check if we got a cached URL or need to decode base64
        if (data?.audioUrl) {
          try {
            const resp = await fetch(data.audioUrl);
            if (resp.ok) {
              const blob = await resp.blob();
              setCachedAudio(clientCacheKey, blob);
              audioUrl = URL.createObjectURL(blob);
            } else {
              audioUrl = data.audioUrl;
            }
          } catch {
            audioUrl = data.audioUrl;
          }
          setWasCached(data.cached === true);
          console.log(`[TTS] Using ${data.cached ? 'cached' : 'newly cached'} audio`);
        } else if (data?.audioContent) {
          const audioBlob = new Blob(
            [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
            { type: 'audio/mpeg' }
          );
          setCachedAudio(clientCacheKey, audioBlob);
          audioUrl = URL.createObjectURL(audioBlob);
          setWasCached(false);
        } else {
          throw new Error('No audio content received');
        }
      }

      // Audio element and AudioContext already primed above — reuse them
      const audio = audioRef.current!;
      const isBlobUrl = audioUrl.startsWith('blob:');
      
      // Set up event handlers BEFORE setting src for reliability
      audio.onended = () => {
        console.log('[TTS Enhanced] Audio ended naturally');
        setIsPlaying(false);
        updateMediaSessionPlaybackState('none');
        if (isBlobUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        onEndRef.current?.();
      };
      
      audio.onerror = (e) => {
        console.error('[TTS Enhanced] Audio playback error:', e);
        setIsPlaying(false);
        if (isBlobUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        onErrorRef.current?.('Audio playback failed');
      };

      audio.onpause = () => {
        console.log('[TTS Enhanced] Audio paused (possibly by system)');
      };

      audio.src = audioUrl;
      audio.load();

      await audio.play();
      setCurrentMode('openai');
      setIsPlaying(true);
      onStartRef.current?.();

      // Register MediaSession for lock-screen / background playback on mobile
      setupMediaSession({
        title: 'Phototheology Audio',
        artist: 'Phototheology Palace',
        album: 'PT Audio',
        onPlay: () => { audio.play(); updateMediaSessionPlaybackState('playing'); },
        onPause: () => { audio.pause(); updateMediaSessionPlaybackState('paused'); },
      });
      updateMediaSessionPlaybackState('playing');

    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);

      // Clean up audio element to prevent ghost playback after fallback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.onpause = null;
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }

      throw error;
    }
  }, [selectedVoice, timeout]);

  // Sanitize text for TTS - expand abbreviations and remove patterns that would be read literally
  const sanitizeTextForTTS = (text: string): string => {
    return text
      // REMOVE UNWANTED PHRASES - banned expressions that AI might still generate
      .replace(/\bmy dear friend,?\s*/gi, '')
      .replace(/\bdear friend,?\s*/gi, '')
      .replace(/\bmy dear student,?\s*/gi, '')
      .replace(/\bdear student,?\s*/gi, '')
      .replace(/\bmy friend,?\s*/gi, '')
      // EXPAND ABBREVIATIONS - prevent "dot" being spoken
      .replace(/\bRev\.\s*/gi, 'Revelation ')
      .replace(/\bGen\.\s*/gi, 'Genesis ')
      .replace(/\bExod\.\s*/gi, 'Exodus ')
      .replace(/\bLev\.\s*/gi, 'Leviticus ')
      .replace(/\bDeut\.\s*/gi, 'Deuteronomy ')
      .replace(/\bDan\.\s*/gi, 'Daniel ')
      .replace(/\bIsa\.\s*/gi, 'Isaiah ')
      .replace(/\bJer\.\s*/gi, 'Jeremiah ')
      .replace(/\bEzek\.\s*/gi, 'Ezekiel ')
      .replace(/\bMatt\.\s*/gi, 'Matthew ')
      .replace(/\bRom\.\s*/gi, 'Romans ')
      .replace(/\bCor\.\s*/gi, 'Corinthians ')
      .replace(/\bHeb\.\s*/gi, 'Hebrews ')
      .replace(/\bv\.\s*(\d)/gi, 'verse $1')
      .replace(/\bvv\.\s*/gi, 'verses ')
      .replace(/\bch\.\s*/gi, 'chapter ')
      .replace(/\bcf\.\s*/gi, 'compare ')
      .replace(/\be\.g\.\s*/gi, 'for example ')
      .replace(/\bi\.e\.\s*/gi, 'that is ')
      .replace(/\bA\.D\.\s*/gi, 'A D ')
      .replace(/\bB\.C\.\s*/gi, 'B C ')
      // Remove ellipsis (... or …) - don't read as "dot dot dot"
      .replace(/\.{2,}/g, ' ')
      .replace(/…/g, ' ')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Preload audio for a text without playing — eliminates gaps between sections
  const preload = useCallback(async (text: string, speakOptions?: SpeakOptions) => {
    if (!text.trim()) return;
    const cleanText = sanitizeTextForTTS(text);
    const opts: SpeakOptions = speakOptions || {};
    const requestedVoice = (opts.voice || selectedVoice) as unknown as string;
    const cacheKey = `${requestedVoice}:${cleanText.slice(0, 120)}`;
    if (preloadedAudioRef.current.has(cacheKey)) return; // already preloaded

    try {
      const normalizedVoice = (requestedVoice === 'ballad'
        ? 'sage'
        : requestedVoice === 'verse'
          ? 'fable'
          : requestedVoice) as VoiceId;

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: cleanText,
          voice: normalizedVoice,
          provider: 'openai',
          book: opts.book,
          chapter: opts.chapter,
          verse: opts.verse,
          useCache: opts.useCache !== false
        }
      });

      if (error || (!data?.audioUrl && !data?.audioContent)) return;

      let audioUrl: string;
      if (data.audioUrl) {
        audioUrl = data.audioUrl;
      } else {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        audioUrl = URL.createObjectURL(audioBlob);
      }
      preloadedAudioRef.current.set(cacheKey, audioUrl);
      console.log('[TTS] Preloaded audio for next section');
    } catch {
      // Preload failures are silent — speak() will fetch normally
    }
  }, [selectedVoice]);

  const speak = useCallback(async (text: string, speakOptions?: SpeakOptions | VoiceId) => {
    if (!text.trim()) {
      toast.error('No text to speak');
      return;
    }

    // Sanitize text before speaking
    const cleanText = sanitizeTextForTTS(text);

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
      } else if (mode === 'openai') {
        shouldUseBrowser = false;
      } else {
        // Auto mode: decide based on network
        shouldUseBrowser = networkStatus === 'offline';
      }

      if (shouldUseBrowser || networkStatus === 'offline') {
        // Use browser TTS only when explicitly requested or offline
        console.log('[TTS] Using browser TTS (offline or requested)');
        await speakWithBrowser(cleanText);
      } else {
        // Use OpenAI TTS with one retry — never silently fall back to robotic browser voice
        let lastError: unknown;
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            console.log(`[TTS] Attempting OpenAI TTS (attempt ${attempt + 1})`);
            await speakWithElevenLabs(cleanText, opts);
            lastError = null;
            break;
          } catch (openaiError) {
            lastError = openaiError;
            console.warn(`[TTS] OpenAI TTS attempt ${attempt + 1} failed:`, openaiError);
            if (attempt === 0) {
              // Clean up before retry
              stop();
              await new Promise(r => setTimeout(r, 1000));
            }
          }
        }
        if (lastError) {
          stop();
          const msg = lastError instanceof Error ? lastError.message : 'Audio generation failed';
          toast.error(`Voice generation failed: ${msg}`);
          throw lastError;
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
    preload,
    isLoading,
    isPlaying,
    selectedVoice,
    setSelectedVoice,
    voices: OPENAI_VOICES,
    wasCached,
    currentMode, // 'openai' or 'browser'
    networkStatus, // 'online', 'offline', or 'slow'
    browserVoices,
    selectedBrowserVoice,
    setSelectedBrowserVoice,
  };
}
