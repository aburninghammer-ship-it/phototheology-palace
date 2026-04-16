import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { buildCacheKey, getCachedAudio, setCachedAudio } from "@/lib/ttsAudioCache";
import { getGlobalMusicVolume, subscribeToMusicVolume } from "@/hooks/useMusicVolumeControl";
import { globalAudioManager } from "@/lib/globalAudioManager";
import { VoiceQualitySelector } from "./VoiceQualitySelector";
import { useVoiceQuality, VoiceQualityTier } from "@/hooks/useVoiceQuality";

// Longer silent audio that works more reliably on iOS
const SILENT_AUDIO = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

// Detect if we're on mobile/Capacitor
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window as any).Capacitor?.isNativePlatform?.();
};

interface QuickAudioButtonProps {
  text: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showLabel?: boolean;
  /** Hide the voice quality selector badge */
  hideQualitySelector?: boolean;
}

export function QuickAudioButton({ 
  text, 
  variant = "ghost", 
  size = "icon",
  className,
  showLabel = false,
  hideQualitySelector = false,
}: QuickAudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(getGlobalMusicVolume);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);
  const volumeRef = useRef(volume);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { selectedTier, getConfig, canUseTier } = useVoiceQuality();

  // Keep volumeRef in sync and apply to current audio
  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Subscribe to global volume changes
  useEffect(() => {
    const unsubscribe = subscribeToMusicVolume((newVolume) => {
      setVolume(newVolume);
    });
    return unsubscribe;
  }, []);

  // Cleanup: unregister audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        globalAudioManager.unregister(audioRef.current);
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Unlock audio for mobile before async work
  const unlockAudio = useCallback(() => {
    if (audioUnlockedRef.current) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;
    audio.src = SILENT_AUDIO;
    audio.volume = 0.01;
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audioUnlockedRef.current = true;
      console.log('[QuickAudio] Audio unlocked for mobile');
    }).catch(() => {});
  }, []);

  /** Play using browser SpeechSynthesis (Standard tier - free) */
  const playBrowserTTS = useCallback((textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Browser speech not supported. Try HD quality.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak.substring(0, 4000));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = volumeRef.current / 100;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsLoading(false);
      notifyTTSStarted();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      notifyTTSStopped();
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
      notifyTTSStopped();
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    setIsLoading(true);
    speechSynthesis.speak(utterance);
  }, []);

  /** Play using cloud TTS (HD = OpenAI, Premium = ElevenLabs) */
  const playCloudTTS = useCallback(async (textToSpeak: string, tier: VoiceQualityTier) => {
    unlockAudio();
    setIsLoading(true);

    try {
      const truncatedText = textToSpeak.length > 12000 
        ? textToSpeak.slice(0, 12000).replace(/\s\S*$/, '') + '...' 
        : textToSpeak;

      const voiceKey = tier === 'premium' ? 'pFZP5JQG7iQjIQuC4Bku' : 'nova';
      const cacheKey = await buildCacheKey(truncatedText, voiceKey, tier);

      // Check client-side cache first (no credits used)
      const cachedBlob = await getCachedAudio(cacheKey);
      if (cachedBlob) {
        const audioSrc = URL.createObjectURL(cachedBlob);
        if (!audioRef.current) audioRef.current = new Audio();
        const audio = audioRef.current;
        audio.src = audioSrc;
        audio.volume = volumeRef.current / 100;
        audio.onended = () => {
          globalAudioManager.unregister(audio);
          setIsPlaying(false);
          notifyTTSStopped();
        };
        audio.onerror = () => {
          globalAudioManager.unregister(audio);
          setIsPlaying(false);
          notifyTTSStopped();
        };
        await audio.play();
        globalAudioManager.register(audio);
        setIsPlaying(true);
        setIsLoading(false);
        notifyTTSStarted();
        return;
      }

      // Check credits first
      const allowed = await canUseTier(tier);
      if (!allowed) {
        toast.error(
          tier === 'premium'
            ? 'Not enough credits for Premium HD. Try HD or Standard.'
            : 'Not enough credits for HD. Try Standard (free).'
        );
        setIsLoading(false);
        return;
      }

      let data: any;
      let error: any;

      if (tier === 'premium') {
        const result = await supabase.functions.invoke("text-to-speech-elevenlabs", {
          body: { text: truncatedText, voiceId: "pFZP5JQG7iQjIQuC4Bku", returnType: "url" }
        });
        data = result.data;
        error = result.error;
      } else {
        const result = await supabase.functions.invoke("text-to-speech", {
          body: { text: truncatedText, voice: "nova", returnType: "url" }
        });
        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      if (!data?.audioUrl && !data?.audioContent) {
        throw new Error("No audio content returned");
      }

      let audioBlob: Blob | null = null;
      let audioSrc: string;

      if (data?.audioUrl) {
        try {
          const response = await fetch(data.audioUrl);
          if (response.ok) {
            audioBlob = await response.blob();
            audioSrc = URL.createObjectURL(audioBlob);
          } else {
            audioSrc = data.audioUrl;
          }
        } catch {
          audioSrc = data.audioUrl;
        }
      } else {
        audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        audioSrc = URL.createObjectURL(audioBlob);
      }

      // Cache the blob for future replay
      if (audioBlob) {
        setCachedAudio(cacheKey, audioBlob);
      }

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const audio = audioRef.current;
      audio.src = audioSrc;
      audio.volume = volumeRef.current / 100;

      audio.onended = () => {
        globalAudioManager.unregister(audio);
        setIsPlaying(false);
        notifyTTSStopped();
      };

      audio.onerror = () => {
        globalAudioManager.unregister(audio);
        setIsPlaying(false);
        notifyTTSStopped();
        toast.error("Audio playback failed. Please try again.");
      };

      await audio.play();
      globalAudioManager.register(audio);
      setIsPlaying(true);
      notifyTTSStarted();
    } catch (err) {
      console.error("TTS error:", err);
      toast.error("Audio generation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [unlockAudio, canUseTier]);

  const handleClick = async () => {
    // Stop if currently playing
    if (isPlaying) {
      if (selectedTier === 'standard') {
        speechSynthesis.cancel();
        utteranceRef.current = null;
      } else if (audioRef.current) {
        audioRef.current.pause();
        globalAudioManager.unregister(audioRef.current);
      }
      setIsPlaying(false);
      notifyTTSStopped();
      return;
    }

    // Stop all other audio
    globalAudioManager.stopAll();
    if ('speechSynthesis' in window) speechSynthesis.cancel();

    if (!text.trim()) {
      toast.error("No text to read");
      return;
    }

    if (selectedTier === 'standard') {
      playBrowserTTS(text);
    } else {
      await playCloudTTS(text, selectedTier);
    }
  };

  return (
    <div className="inline-flex items-center gap-1">
      <Button
        variant={variant}
        size={showLabel ? size : "icon"}
        onClick={handleClick}
        disabled={isLoading}
        className={className}
        title={isPlaying ? "Stop" : "Listen"}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {showLabel && <span className="ml-2">Loading...</span>}
          </>
        ) : isPlaying ? (
          <>
            <VolumeX className="h-4 w-4" />
            {showLabel && <span className="ml-2">Stop</span>}
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" />
            {showLabel && <span className="ml-2">Listen</span>}
          </>
        )}
      </Button>
      {!hideQualitySelector && <VoiceQualitySelector compact />}
    </div>
  );
}
