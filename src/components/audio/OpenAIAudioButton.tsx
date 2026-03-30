import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Loader2, Square } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { globalAudioManager } from "@/lib/globalAudioManager";

interface OpenAIAudioButtonProps {
  text: string;
  voice?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showLabel?: boolean;
}

export function OpenAIAudioButton({
  text,
  voice = "nova",
  variant = "ghost",
  size = "icon",
  className,
  showLabel = false,
}: OpenAIAudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    notifyTTSStopped();
  }, []);

  const handleClick = useCallback(async () => {
    if (isPlaying) {
      stop();
      return;
    }

    if (!text.trim()) {
      toast.error("No text to read");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text, voice, returnType: "url" },
      });

      if (error) throw error;

      let audioUrl: string;
      let shouldRevoke = false;

      if (data?.audioUrl) {
        audioUrl = data.audioUrl;
      } else if (data?.audioContent) {
        const audioBlob = base64ToBlob(data.audioContent, "audio/mpeg");
        audioUrl = URL.createObjectURL(audioBlob);
        shouldRevoke = true;
      } else {
        throw new Error("No audio returned");
      }

      const audio = new Audio(audioUrl);

      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
        notifyTTSStarted();
      };

      audio.onended = () => {
        setIsPlaying(false);
        notifyTTSStopped();
        if (shouldRevoke) URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        notifyTTSStopped();
        if (shouldRevoke) URL.revokeObjectURL(audioUrl);
        toast.error("Audio playback failed");
      };

      audioRef.current = audio;
      await audio.play();
    } catch (err) {
      console.error("[OpenAIAudio] Error:", err);
      setIsLoading(false);
      toast.error("Failed to generate audio");
    }
  }, [text, voice, isPlaying, stop]);

  const label = isLoading ? "Loading..." : isPlaying ? "Stop" : "Listen";
  const Icon = isLoading ? Loader2 : isPlaying ? Square : Volume2;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      title={label}
    >
      <Icon className={`h-4 w-4 ${isLoading ? "animate-spin" : ""} ${showLabel ? "mr-2" : ""}`} />
      {showLabel && label}
    </Button>
  );
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
}
