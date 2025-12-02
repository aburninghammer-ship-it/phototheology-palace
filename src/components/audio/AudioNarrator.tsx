import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  SkipBack,
  Loader2,
  Headphones,
  Mic,
  Smartphone
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { OPENAI_VOICES, VoiceId } from "@/hooks/useTextToSpeech";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { useIsMobile } from "@/hooks/use-mobile";

interface AudioNarratorProps {
  text: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  voice?: VoiceId;
  showVoiceSelector?: boolean;
}

export const AudioNarrator = ({ 
  text, 
  title,
  className,
  autoPlay = false,
  voice: initialVoice = "onyx",
  showVoiceSelector = true
}: AudioNarratorProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>(initialVoice);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    return () => {
      // Cleanup audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Reset audio when voice changes
  const handleVoiceChange = (voice: VoiceId) => {
    setSelectedVoice(voice);
    // Clear existing audio so it regenerates with new voice
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
  };

  const generateAudio = async () => {
    if (audioUrl) {
      // Already have audio, just play it
      playAudio();
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text, voice: selectedVoice }
      });

      if (error) throw error;

      if (data?.audioContent) {
        // Convert base64 to blob
        const audioBlob = base64ToBlob(data.audioContent, "audio/mpeg");
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Create audio element
        const audio = new Audio(url);
        audioRef.current = audio;
        
        audio.onloadedmetadata = () => {
          setDuration(audio.duration);
        };
        
        audio.ontimeupdate = () => {
          setProgress((audio.currentTime / audio.duration) * 100);
        };
        
        audio.onended = () => {
          setIsPlaying(false);
          setProgress(0);
          notifyTTSStopped();
        };

        audio.volume = volume / 100;
        
        // Auto-play after generation
        audio.play();
        setIsPlaying(true);
        notifyTTSStarted();
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      toast.error("Failed to generate audio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      notifyTTSStarted();
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      notifyTTSStopped();
    }
  };

  const togglePlayPause = () => {
    if (!audioUrl) {
      generateAudio();
      return;
    }
    
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    setProgress(newProgress);
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (newProgress / 100) * duration;
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(audioRef.current.currentTime + seconds, duration)
      );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const selectedVoiceInfo = OPENAI_VOICES.find(v => v.id === selectedVoice);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          {title && (
            <div className="flex items-center gap-2 text-sm font-medium">
              <Headphones className="h-4 w-4 text-primary" />
              {title}
            </div>
          )}
          
          {showVoiceSelector && (
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedVoice} onValueChange={(v) => handleVoiceChange(v as VoiceId)}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {OPENAI_VOICES.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id} className="text-xs">
                      <div className="flex flex-col">
                        <span className="font-medium">{voice.name}</span>
                        <span className="text-muted-foreground text-[10px]">{voice.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Skip Back */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(-10)}
            disabled={!audioUrl || isLoading}
            className="h-8 w-8"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          {/* Play/Pause */}
          <Button
            onClick={togglePlayPause}
            disabled={isLoading}
            size="icon"
            className="h-12 w-12 rounded-full gradient-palace"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          {/* Skip Forward */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(10)}
            disabled={!audioUrl || isLoading}
            className="h-8 w-8"
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          {/* Progress */}
          <div className="flex-1 space-y-1">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={handleProgressChange}
              disabled={!audioUrl}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime((progress / 100) * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume - hidden on mobile since programmatic volume doesn't work */}
          {!isMobile ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-8 w-8"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Smartphone className="h-3 w-3" />
              <span>System vol</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to convert base64 to Blob
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
