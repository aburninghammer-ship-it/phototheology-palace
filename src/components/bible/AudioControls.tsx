import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  Settings,
  Loader2,
} from "lucide-react";
import { Verse } from "@/types/bible";
import { ELEVENLABS_VOICES, VoiceId } from "@/hooks/useTextToSpeech";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AudioControlsProps {
  verses: Verse[];
  onVerseHighlight?: (verseNumber: number) => void;
  className?: string;
}

export const AudioControls = ({ verses, onVerseHighlight, className }: AudioControlsProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>("daniel");
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Use a persistent audio element to avoid iOS autoplay restrictions
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const isPlayingRef = useRef(false);
  const currentIndexRef = useRef(0);
  const versesRef = useRef(verses);
  const playbackRateRef = useRef(playbackRate);
  const selectedVoiceRef = useRef(selectedVoice);
  const playVerseAtIndexRef = useRef<((index: number) => Promise<void>) | null>(null);

  // Keep refs in sync
  versesRef.current = verses;
  playbackRateRef.current = playbackRate;
  selectedVoiceRef.current = selectedVoice;

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Initialize persistent audio element once
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.onended = () => {
        if (!isPlayingRef.current) return;
        
        const nextIndex = currentIndexRef.current + 1;
        if (nextIndex < versesRef.current.length) {
          playVerseAtIndexRef.current?.(nextIndex);
        } else {
          setIsPlaying(false);
          isPlayingRef.current = false;
          toast.success("Finished reading chapter");
        }
      };
      
      audio.onerror = () => {
        console.error("Audio playback error");
        toast.error("Audio playback failed");
        setIsPlaying(false);
        isPlayingRef.current = false;
      };
      
      audioRef.current = audio;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  const generateTTS = useCallback(async (text: string, voice: VoiceId) => {
    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text, voice },
      });

      if (error) throw error;

      if (data?.audioContent) {
        const byteCharacters = atob(data.audioContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/mpeg" });
        return URL.createObjectURL(blob);
      }
      return null;
    } catch (e) {
      console.error("Error generating TTS:", e);
      return null;
    }
  }, []);

  const playVerseAtIndex = useCallback(async (verseIndex: number) => {
    const currentVerses = versesRef.current;
    const audio = audioRef.current;
    
    if (verseIndex < 0 || verseIndex >= currentVerses.length || !audio) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    currentIndexRef.current = verseIndex;
    const verse = currentVerses[verseIndex];
    setCurrentVerse(verse.verse);
    onVerseHighlight?.(verse.verse);
    
    setIsLoading(true);
    const url = await generateTTS(verse.text, selectedVoiceRef.current);
    setIsLoading(false);

    if (!url) {
      toast.error("Failed to generate audio");
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    // Revoke old URL
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
    }
    audioUrlRef.current = url;

    // Update existing audio element instead of creating new one
    audio.src = url;
    audio.playbackRate = playbackRateRef.current;
    
    try {
      await audio.play();
    } catch (err) {
      console.error("Play error:", err);
      toast.error("Could not play audio. Please try again.");
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  }, [generateTTS, onVerseHighlight]);

  // Keep the ref updated
  // Keep the ref updated
  playVerseAtIndexRef.current = playVerseAtIndex;

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  const play = useCallback((startVerseIndex?: number) => {
    const index = startVerseIndex ?? verses.findIndex(v => v.verse === currentVerse);
    setIsPlaying(true);
    isPlayingRef.current = true;
    playVerseAtIndex(index >= 0 ? index : 0);
  }, [currentVerse, verses, playVerseAtIndex]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  const stop = useCallback(() => {
    cleanupAudio();
    setIsPlaying(false);
    isPlayingRef.current = false;
    setCurrentVerse(1);
    onVerseHighlight?.(1);
  }, [cleanupAudio, onVerseHighlight]);

  const nextVerse = useCallback(() => {
    const currentIndex = verses.findIndex(v => v.verse === currentVerse);
    if (currentIndex < verses.length - 1) {
      cleanupAudio();
      if (isPlaying) {
        playVerseAtIndex(currentIndex + 1);
      } else {
        setCurrentVerse(verses[currentIndex + 1].verse);
        onVerseHighlight?.(verses[currentIndex + 1].verse);
      }
    }
  }, [verses, currentVerse, isPlaying, cleanupAudio, playVerseAtIndex, onVerseHighlight]);

  const previousVerse = useCallback(() => {
    const currentIndex = verses.findIndex(v => v.verse === currentVerse);
    if (currentIndex > 0) {
      cleanupAudio();
      if (isPlaying) {
        playVerseAtIndex(currentIndex - 1);
      } else {
        setCurrentVerse(verses[currentIndex - 1].verse);
        onVerseHighlight?.(verses[currentIndex - 1].verse);
      }
    }
  }, [verses, currentVerse, isPlaying, cleanupAudio, playVerseAtIndex, onVerseHighlight]);

  const changePlaybackRate = useCallback((rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  if (verses.length === 0) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-lg bg-accent/30 border border-accent/20",
      className
    )}>
      {/* Main Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={previousVerse}
          disabled={currentVerse <= 1 || isLoading}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          variant="default"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={() => isPlaying ? pause() : play()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={nextVerse}
          disabled={currentVerse >= verses.length || isLoading}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={stop}
        >
          <Square className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Verse Indicator */}
      <div className="flex items-center gap-2 px-2 min-w-[80px]">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">
          v.{currentVerse}/{verses.length}
        </span>
      </div>

      {/* Speed Control */}
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Speed:</span>
        <Select
          value={playbackRate.toString()}
          onValueChange={(value) => changePlaybackRate(parseFloat(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {playbackRates.map((rate) => (
              <SelectItem key={rate} value={rate.toString()}>
                {rate}x
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Settings Popover */}
      <Popover open={showSettings} onOpenChange={setShowSettings}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="end">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Voice</h4>
              <Select
                value={selectedVoice}
                onValueChange={(value) => setSelectedVoice(value as VoiceId)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {ELEVENLABS_VOICES.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {ELEVENLABS_VOICES.find(v => v.id === selectedVoice)?.description}
              </p>
            </div>
            
            <div className="sm:hidden">
              <h4 className="font-medium mb-2">Playback Speed</h4>
              <Select
                value={playbackRate.toString()}
                onValueChange={(value) => changePlaybackRate(parseFloat(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {playbackRates.map((rate) => (
                    <SelectItem key={rate} value={rate.toString()}>
                      {rate}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-muted-foreground">
              Tip: Click any verse while playing to jump to it.
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
