import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { getGlobalMusicVolume, subscribeToMusicVolume } from "@/hooks/useMusicVolumeControl";
import { globalAudioManager } from "@/lib/globalAudioManager";

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
}

export function QuickAudioButton({ 
  text, 
  variant = "ghost", 
  size = "icon",
  className 
}: QuickAudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(getGlobalMusicVolume);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);
  const volumeRef = useRef(volume);

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
    }).catch(() => {
      // Expected to fail if not in user gesture context
    });
  }, []);

  const handleClick = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      globalAudioManager.unregister(audioRef.current);
      setIsPlaying(false);
      notifyTTSStopped();
      return;
    }

    // Also stop any browser speech synthesis
    if (isPlaying && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      notifyTTSStopped();
      return;
    }

    // CRITICAL: Stop all other audio before starting this one
    globalAudioManager.stopAll();

    if (!text.trim()) {
      toast.error("No text to read");
      return;
    }

    // On mobile, use cloud TTS directly (browser speechSynthesis is unreliable on iOS/Android)
    console.log('[QuickAudio] Using cloud TTS, mobile:', isMobile());

    // CRITICAL: Unlock audio BEFORE async work to preserve user gesture on mobile
    unlockAudio();

    setIsLoading(true);

    try {
      console.log('[QuickAudio] Calling text-to-speech, mobile:', isMobile());

      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text, voice: "daniel", returnType: "url" }
      });

      if (error) throw error;

      if (!data?.audioUrl && !data?.audioContent) {
        throw new Error("No audio content returned");
      }

      let audioSrc: string;

      // Fetch as blob for reliable mobile playback
      if (data?.audioUrl) {
        console.log('[QuickAudio] Got audio URL, fetching as blob for reliable mobile playback...');
        try {
          const response = await fetch(data.audioUrl);
          if (response.ok) {
            const blob = await response.blob();
            audioSrc = URL.createObjectURL(blob);
            console.log('[QuickAudio] Created blob URL for playback');
          } else {
            console.warn('[QuickAudio] Failed to fetch blob, using URL directly');
            audioSrc = data.audioUrl;
          }
        } catch (fetchErr) {
          console.warn('[QuickAudio] Blob fetch failed, using URL directly:', fetchErr);
          audioSrc = data.audioUrl;
        }
      } else {
        console.log('[QuickAudio] Using base64 fallback');
        audioSrc = `data:audio/mpeg;base64,${data.audioContent}`;
      }

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const audio = audioRef.current;
      audio.src = audioSrc;
      audio.volume = volumeRef.current / 100;
      console.log('[QuickAudio] Volume set to:', volumeRef.current, '%');

      audio.onended = () => {
        globalAudioManager.unregister(audio);
        setIsPlaying(false);
        notifyTTSStopped();
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        globalAudioManager.unregister(audio);
        setIsPlaying(false);
        notifyTTSStopped();
        // Fallback to browser TTS on error
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'en-US'; // Force English
          utterance.onend = () => {
            setIsPlaying(false);
            notifyTTSStopped();
          };
          speechSynthesis.speak(utterance);
          setIsPlaying(true);
          notifyTTSStarted();
        } else {
          toast.error("Audio playback failed");
        }
      };

      try {
        console.log('[QuickAudio] Attempting to play audio...');
        await audio.play();
        console.log('[QuickAudio] Audio playing successfully');
        globalAudioManager.register(audio);
        setIsPlaying(true);
        notifyTTSStarted();
      } catch (playErr: any) {
        console.warn("[QuickAudio] Play error:", playErr?.name, playErr?.message);

        // Handle autoplay blocked specifically
        if (playErr?.name === 'NotAllowedError') {
          toast.info('Tap the play button again to start audio');
          setIsPlaying(false);
          return;
        }

        // For other errors, try browser TTS as fallback
        if ('speechSynthesis' in window) {
          console.log('[QuickAudio] Falling back to browser TTS');
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'en-US'; // Force English
          utterance.onend = () => {
            setIsPlaying(false);
            notifyTTSStopped();
          };
          speechSynthesis.speak(utterance);
          setIsPlaying(true);
          notifyTTSStarted();
        } else {
          toast.error('Audio playback failed');
        }
      }
    } catch (err) {
      console.error("TTS error:", err);
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Force English
        utterance.onend = () => {
          setIsPlaying(false);
          notifyTTSStopped();
        };
        speechSynthesis.speak(utterance);
        setIsPlaying(true);
        notifyTTSStarted();
      } else {
        toast.error("Audio not available");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      title={isPlaying ? "Stop" : "Listen"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
}
