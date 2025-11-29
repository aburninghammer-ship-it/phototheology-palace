import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleClick = async () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (!text.trim()) {
      toast.error("No text to read");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text, voice: "alloy" }
      });

      if (error) throw error;

      if (data?.audioContent) {
        const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
        const newAudio = new Audio(audioUrl);
        
        newAudio.onended = () => {
          setIsPlaying(false);
          setAudio(null);
        };

        newAudio.onerror = () => {
          setIsPlaying(false);
          setAudio(null);
          toast.error("Audio playback failed");
        };

        setAudio(newAudio);
        newAudio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("TTS error:", err);
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsPlaying(false);
        speechSynthesis.speak(utterance);
        setIsPlaying(true);
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
