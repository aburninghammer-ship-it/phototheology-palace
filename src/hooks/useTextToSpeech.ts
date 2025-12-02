import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Available OpenAI voices
export const OPENAI_VOICES = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced voice' },
  { id: 'echo', name: 'Echo', description: 'Clear and articulate male voice' },
  { id: 'fable', name: 'Fable', description: 'Warm British male voice' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative male voice' },
  { id: 'nova', name: 'Nova', description: 'Friendly and energetic female voice' },
  { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle female voice' },
] as const;

export type VoiceId = typeof OPENAI_VOICES[number]['id'];

interface UseTextToSpeechOptions {
  defaultVoice?: VoiceId;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

interface SpeakOptions {
  voice?: VoiceId;
  book?: string;
  chapter?: number;
  verse?: number;
  useCache?: boolean;
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const { defaultVoice = 'onyx', onStart, onEnd, onError } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>(defaultVoice);
  const [wasCached, setWasCached] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      onEnd?.();
    }
  }, [onEnd]);

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
    onStart?.();

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: text.trim(),
          voice: opts.voice || selectedVoice,
          book: opts.book,
          chapter: opts.chapter,
          verse: opts.verse,
          useCache: opts.useCache !== false // default to true
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate speech');
      }

      let audioUrl: string;

      // Check if we got a cached URL or need to decode base64
      if (data?.audioUrl) {
        // Cached audio - use URL directly
        audioUrl = data.audioUrl;
        setWasCached(data.cached === true);
        console.log(`[TTS] Using ${data.cached ? 'cached' : 'newly cached'} audio`);
      } else if (data?.audioContent) {
        // Base64 audio - create blob URL
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        audioUrl = URL.createObjectURL(audioBlob);
        setWasCached(false);
      } else {
        throw new Error('No audio content received');
      }

      // Create and play audio
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      audioRef.current.src = audioUrl;
      audioRef.current.onended = () => {
        setIsPlaying(false);
        // Only revoke if it's a blob URL (not a storage URL)
        if (audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl);
        }
        onEnd?.();
      };
      audioRef.current.onerror = () => {
        setIsPlaying(false);
        if (audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl);
        }
        onError?.('Audio playback failed');
      };

      await audioRef.current.play();
      setIsPlaying(true);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate speech';
      console.error('TTS error:', error);
      toast.error(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedVoice, stop, onStart, onEnd, onError]);

  return {
    speak,
    stop,
    isLoading,
    isPlaying,
    selectedVoice,
    setSelectedVoice,
    voices: OPENAI_VOICES,
    wasCached, // New: indicates if last audio was from cache
  };
}
