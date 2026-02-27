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
  const [speed, setSpeed] = useState(1.0); // 0.5 = slower/deeper, 1.5 = faster/higher
  
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

  // Reset audio when voice or speed changes
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

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    // Clear existing audio so it regenerates with new speed
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
      // Use fetch instead of supabase.functions.invoke to handle both JSON and binary responses properly
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/text-to-speech`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, voice: selectedVoice, speed, returnType: "url" }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`TTS request failed: ${response.status} - ${errText}`);
      }

      const data = await response.json();

      let url: string;
      if (data.audioUrl) {
        url = data.audioUrl;
      } else if (data.audioContent) {
        // Use data URI instead of atob() to avoid binary corruption
        url = `data:audio/mpeg;base64,${data.audioContent}`;
      } else {
        throw new Error("No audio data returned");
      }

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

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        toast.error("Audio failed to load. Try again.");
        setIsPlaying(false);
        setIsLoading(false);
      };

      audio.volume = volume / 100;
        
      // Auto-play after generation
      audio.play();
      setIsPlaying(true);
      notifyTTSStarted();
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
        <div className="flex items-center justify-between flex-wrap gap-2">
          {title && (
            <div className="flex items-center gap-2 text-sm font-medium">
              <Headphones className="h-4 w-4 text-primary" />
              {title}
            </div>
          )}
          
          {showVoiceSelector && (
            <div className="flex items-center gap-3 flex-wrap">
              {/* Voice Selector */}
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedVoice} onValueChange={(v) => handleVoiceChange(v as VoiceId)}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-background border-border">
                    {OPENAI_VOICES.map((voice) => (
                      <SelectItem 
                        key={voice.id} 
                        value={voice.id} 
                        className="text-xs py-2.5 px-3 cursor-pointer data-[state=checked]:bg-amber-500 data-[state=checked]:text-amber-950 focus:bg-amber-500/80 focus:text-amber-950"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{voice.name}</span>
                          <span className="text-muted-foreground text-[10px]">{voice.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Speed Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Speed:</span>
                <Select value={speed.toString()} onValueChange={(v) => handleSpeedChange(parseFloat(v))}>
                  <SelectTrigger className="w-[90px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5" className="text-xs">0.5x (Deep)</SelectItem>
                    <SelectItem value="0.75" className="text-xs">0.75x</SelectItem>
                    <SelectItem value="1.0" className="text-xs">1.0x (Normal)</SelectItem>
                    <SelectItem value="1.25" className="text-xs">1.25x</SelectItem>
                    <SelectItem value="1.5" className="text-xs">1.5x (Fast)</SelectItem>
                    <SelectItem value="2.0" className="text-xs">2.0x (Very Fast)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
