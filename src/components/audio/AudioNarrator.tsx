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
import { VoiceQualitySelector } from "./VoiceQualitySelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { setupMediaSession, updateMediaSessionPlaybackState, clearMediaSession } from "@/lib/mediaSessionHelper";

interface AudioNarratorProps {
  text: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  voice?: VoiceId;
  showVoiceSelector?: boolean;
  onEnded?: () => void;
}

export const AudioNarrator = ({ 
  text, 
  title,
  className,
  autoPlay = false,
  voice: initialVoice = "onyx",
  showVoiceSelector = true,
  onEnded,
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
  const objectUrlRef = useRef<string | null>(null);
  const isMobile = useIsMobile();

  const resetAudioState = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setAudioUrl(null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.ontimeupdate = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }

    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    notifyTTSStopped();
  };

  useEffect(() => {
    return () => {
      // Cleanup audio only on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.ontimeupdate = null;
        audioRef.current.onerror = null;
        audioRef.current = null;
      }
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  // Reset audio when voice or speed changes
  const handleVoiceChange = (voice: VoiceId) => {
    setSelectedVoice(voice);
    // Clear existing audio so it regenerates with new voice
    resetAudioState();
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    // Clear existing audio so it regenerates with new speed
    resetAudioState();
  };

  // Tiny silent MP3 for priming audio element in user gesture context
  const SILENT_MP3 = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRwBHAAAAAAD/+1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

  const generateAudio = async () => {
    if (audioUrl && audioRef.current) {
      void playAudio();
      return;
    }

    // Stop any existing audio BEFORE creating a new one to prevent echo
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.ontimeupdate = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }

    // Create and prime audio element SYNCHRONOUSLY in user gesture context
    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = volume / 100;
    audioRef.current = audio;

    // Prime with silent audio to unlock playback on mobile
    try {
      audio.src = SILENT_MP3;
      await audio.play();
      audio.pause();
    } catch {
      // Best effort - some browsers still allow later play
    }

    setIsLoading(true);
    try {
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
        // Fetch the audio URL as a blob to avoid CORS/redirect issues on mobile
        try {
          const audioResponse = await fetch(data.audioUrl);
          if (!audioResponse.ok) throw new Error(`Audio fetch failed: ${audioResponse.status}`);
          const blob = await audioResponse.blob();
          const blobUrl = URL.createObjectURL(blob);
          objectUrlRef.current = blobUrl;
          url = blobUrl;
        } catch {
          // Fallback to direct URL if blob fetch fails
          objectUrlRef.current = null;
          url = data.audioUrl;
        }
      } else if (data.audioContent) {
        objectUrlRef.current = null;
        url = `data:audio/mpeg;base64,${data.audioContent}`;
      } else {
        throw new Error("No audio data returned");
      }

      setAudioUrl(url);
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
        clearMediaSession();
        onEnded?.();
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        toast.error("Audio failed to load. Try again.");
        resetAudioState();
        setIsLoading(false);
      };

      audio.src = url;
      audio.load();
      await audio.play();
      setIsPlaying(true);
      notifyTTSStarted();

      // Register with Media Session for lock-screen / background playback
      setupMediaSession({
        title: title || 'PT Commentary',
        artist: 'Phototheology Palace',
        album: 'Commentary',
        onPlay: () => {
          audio.play();
          setIsPlaying(true);
          notifyTTSStarted();
          updateMediaSessionPlaybackState('playing');
        },
        onPause: () => {
          audio.pause();
          setIsPlaying(false);
          notifyTTSStopped();
          updateMediaSessionPlaybackState('paused');
        },
        onSeekBackward: () => skip(-15),
        onSeekForward: () => skip(15),
      });
      updateMediaSessionPlaybackState('playing');
    } catch (error) {
      console.error("Error generating audio:", error);
      resetAudioState();
      const aborted = error instanceof DOMException && error.name === "AbortError";
      if (!aborted) {
        toast.error("Failed to generate audio. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      notifyTTSStarted();
    } catch (error) {
      const notAllowed = error instanceof DOMException && error.name === "NotAllowedError";
      if (notAllowed) {
        toast.error("Playback was blocked by your browser. Tap play again.");
        return;
      }

      console.error("Error playing audio:", error);
      resetAudioState();
      toast.error("Playback failed. Regenerating may be required.");
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      notifyTTSStopped();
      updateMediaSessionPlaybackState('paused');
    }
  };

  const togglePlayPause = () => {
    if (!audioUrl) {
      void generateAudio();
      return;
    }

    if (isPlaying) {
      pauseAudio();
    } else {
      void playAudio();
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
          <div className="flex items-center gap-2">
            {title && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <Headphones className="h-4 w-4 text-primary" />
                {title}
              </div>
            )}
            <VoiceQualitySelector compact />
          </div>
          
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
            onClick={() => skip(-15)}
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
            onClick={() => skip(15)}
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
