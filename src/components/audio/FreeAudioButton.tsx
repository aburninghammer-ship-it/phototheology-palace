import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2, Square } from "lucide-react";
import { toast } from "sonner";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";

interface FreeAudioButtonProps {
  text: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showLabel?: boolean;
}

// Get the best available voice (prioritize natural sounding voices)
const getBestVoice = (): SpeechSynthesisVoice | null => {
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Priority order for natural-sounding voices
  const preferredVoices = [
    'Google US English',
    'Google UK English Female',
    'Google UK English Male',
    'Microsoft David',
    'Microsoft Zira',
    'Samantha',
    'Daniel',
    'Karen',
    'Alex',
  ];

  // Try to find a preferred voice
  for (const preferred of preferredVoices) {
    const found = voices.find(v => v.name.includes(preferred));
    if (found) return found;
  }

  // Fallback: find any English voice
  const englishVoice = voices.find(v => v.lang.startsWith('en'));
  if (englishVoice) return englishVoice;

  // Last resort: first available voice
  return voices[0];
};

export function FreeAudioButton({ 
  text, 
  variant = "ghost", 
  size = "icon",
  className,
  showLabel = false
}: FreeAudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      speechSynthesis.cancel();
    };
  }, []);

  // Keep speech synthesis alive on mobile
  useEffect(() => {
    if (!isPlaying) return;
    
    const keepAlive = setInterval(() => {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        speechSynthesis.resume();
      }
    }, 5000);

    return () => clearInterval(keepAlive);
  }, [isPlaying]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    notifyTTSStopped();
  }, []);

  const handleClick = useCallback(() => {
    if (isPlaying) {
      stop();
      return;
    }

    if (!text.trim()) {
      toast.error("No text to read");
      return;
    }

    if (!('speechSynthesis' in window)) {
      toast.error("Text-to-speech not supported in this browser");
      return;
    }

    setIsLoading(true);

    // Small delay to ensure voices are loaded
    setTimeout(() => {
      try {
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95; // Slightly slower for comprehension
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.lang = 'en-US'; // Force English to prevent Hebrew detection

        const voice = getBestVoice();
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onstart = () => {
          setIsPlaying(true);
          setIsLoading(false);
          notifyTTSStarted();
        };

        utterance.onend = () => {
          setIsPlaying(false);
          notifyTTSStopped();
        };

        utterance.onerror = (event) => {
          console.error('[FreeAudio] Speech error:', event);
          setIsPlaying(false);
          setIsLoading(false);
          notifyTTSStopped();
          if (event.error !== 'canceled') {
            toast.error("Audio playback failed");
          }
        };

        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('[FreeAudio] Error:', error);
        setIsLoading(false);
        toast.error("Failed to start audio");
      }
    }, 100);
  }, [text, isPlaying, stop]);

  if (showLabel) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading...
          </>
        ) : isPlaying ? (
          <>
            <Square className="h-4 w-4 mr-2" />
            Stop
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4 mr-2" />
            Listen
          </>
        )}
      </Button>
    );
  }

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
        <Square className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
}

