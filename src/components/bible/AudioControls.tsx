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
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";

interface AudioControlsProps {
  verses: Verse[];
  onVerseHighlight?: (verseNumber: number) => void;
  className?: string;
}

// Tiny silent WAV as data URI to unlock iOS audio
const SILENT_AUDIO = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

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
  const audioUnlockedRef = useRef(false);
  
  // Prefetch cache for smoother playback
  const prefetchCacheRef = useRef<Map<number, string>>(new Map());
  const prefetchingRef = useRef<Set<number>>(new Set());

  // Keep refs in sync
  versesRef.current = verses;
  playbackRateRef.current = playbackRate;
  selectedVoiceRef.current = selectedVoice;

  // Clear prefetch cache when voice changes
  useEffect(() => {
    prefetchCacheRef.current.forEach(url => URL.revokeObjectURL(url));
    prefetchCacheRef.current.clear();
  }, [selectedVoice]);

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
          notifyTTSStopped();
          toast.success("Finished reading chapter");
        }
      };
      
      audio.onerror = () => {
        const mediaError = audio?.error;
        console.error("[Audio] Playback error:", {
          code: mediaError?.code,
          message: mediaError?.message,
          src: audio?.src?.substring(0, 100),
        });
        // Don't show error for silent audio unlock
        if (audio.src !== SILENT_AUDIO) {
          toast.error("Audio playback failed");
          setIsPlaying(false);
          isPlayingRef.current = false;
        }
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
      // Clear prefetch cache on unmount
      prefetchCacheRef.current.forEach(url => URL.revokeObjectURL(url));
      prefetchCacheRef.current.clear();
    };
  }, []);

  // Unlock audio on iOS by playing silent audio on first user interaction
  const unlockAudio = useCallback(async () => {
    if (audioUnlockedRef.current || !audioRef.current) return;
    
    try {
      const audio = audioRef.current;
      audio.src = SILENT_AUDIO;
      audio.volume = 0;
      await audio.play();
      audio.pause();
      audio.volume = 1;
      audioUnlockedRef.current = true;
      console.log("Audio unlocked for iOS");
    } catch (e) {
      console.log("Audio unlock attempt:", e);
    }
  }, []);

  const generateTTS = useCallback(async (text: string, voice: VoiceId): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text, voice },
      });

      if (error) {
        console.error("[TTS] Supabase function error:", error);
        throw error;
      }

      if (!data?.audioContent) {
        console.error("[TTS] No audio content in response:", data);
        return null;
      }
      
      // Decode base64 in chunks to avoid stack overflow on large audio
      const binaryString = atob(data.audioContent);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: "audio/mpeg" });
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error("[TTS] Error generating TTS:", e);
      return null;
    }
  }, []);

  // Prefetch audio for a verse index
  const prefetchVerse = useCallback(async (verseIndex: number) => {
    const currentVerses = versesRef.current;
    if (verseIndex < 0 || verseIndex >= currentVerses.length) return;
    if (prefetchCacheRef.current.has(verseIndex)) return;
    if (prefetchingRef.current.has(verseIndex)) return;
    
    prefetchingRef.current.add(verseIndex);
    const verse = currentVerses[verseIndex];
    const url = await generateTTS(verse.text, selectedVoiceRef.current);
    prefetchingRef.current.delete(verseIndex);
    
    if (url) {
      prefetchCacheRef.current.set(verseIndex, url);
    }
  }, [generateTTS]);

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
    
    // Check if we have prefetched audio
    let url = prefetchCacheRef.current.get(verseIndex);
    
    if (!url) {
      setIsLoading(true);
      url = await generateTTS(verse.text, selectedVoiceRef.current);
      setIsLoading(false);
    } else {
      // Remove from cache since we're using it
      prefetchCacheRef.current.delete(verseIndex);
    }

    if (!url) {
      toast.error("Failed to generate audio");
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    // Prefetch next 2 verses in the background for smooth playback
    prefetchVerse(verseIndex + 1);
    prefetchVerse(verseIndex + 2);

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
      notifyTTSStarted();
    } catch (err) {
      console.error("Play error:", err);
      toast.error("Could not play audio. Please try again.");
      setIsPlaying(false);
      isPlayingRef.current = false;
      notifyTTSStopped();
    }
  }, [generateTTS, onVerseHighlight, prefetchVerse]);

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

  // Clear prefetch cache when voice changes
  const clearPrefetchCache = useCallback(() => {
    prefetchCacheRef.current.forEach(url => URL.revokeObjectURL(url));
    prefetchCacheRef.current.clear();
  }, []);

  const play = useCallback(async (startVerseIndex?: number) => {
    // Unlock audio on iOS first
    await unlockAudio();
    
    const index = startVerseIndex ?? verses.findIndex(v => v.verse === currentVerse);
    setIsPlaying(true);
    isPlayingRef.current = true;
    playVerseAtIndex(index >= 0 ? index : 0);
  }, [currentVerse, verses, playVerseAtIndex, unlockAudio]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
    notifyTTSStopped();
  }, []);

  const stop = useCallback(() => {
    cleanupAudio();
    clearPrefetchCache();
    setIsPlaying(false);
    isPlayingRef.current = false;
    notifyTTSStopped();
    setCurrentVerse(1);
    onVerseHighlight?.(1);
  }, [cleanupAudio, clearPrefetchCache, onVerseHighlight]);

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
