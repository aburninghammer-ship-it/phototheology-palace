import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Square,
  Volume2,
  VolumeX,
  Loader2,
  BookOpen,
  ListMusic,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReadingSequenceBlock, SequenceItem } from "@/types/readingSequence";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";

interface SequencePlayerProps {
  sequences: ReadingSequenceBlock[];
  onClose?: () => void;
  autoPlay?: boolean;
}

interface ChapterContent {
  book: string;
  chapter: number;
  verses: { verse: number; text: string }[];
}

export const SequencePlayer = ({ sequences, onClose, autoPlay = false }: SequencePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSeqIdx, setCurrentSeqIdx] = useState(0);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [currentVerseIdx, setCurrentVerseIdx] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isGeneratingRef = useRef(false); // Prevent concurrent TTS requests
  const isFetchingChapterRef = useRef(false); // Prevent concurrent chapter fetches
  const lastFetchedRef = useRef<string | null>(null); // Track last fetched chapter
  const shouldPlayNextRef = useRef(false); // Signal to play next chapter
  const continuePlayingRef = useRef(false); // Signal to continue playing verses
  const pendingVerseRef = useRef<{ verseIdx: number; content: ChapterContent; voice: string } | null>(null);
  
  const activeSequences = sequences.filter((s) => s.enabled && s.items.length > 0);

  // Flatten all items across sequences for navigation
  const allItems = activeSequences.flatMap((seq, seqIdx) =>
    seq.items.map((item) => ({ ...item, seqIdx, voice: seq.voice }))
  );

  const currentItem = allItems[currentItemIdx] || null;
  const currentSequence = activeSequences[currentSeqIdx];
  const totalItems = allItems.length;

  // Reset refs on mount to ensure fresh start
  useEffect(() => {
    isFetchingChapterRef.current = false;
    lastFetchedRef.current = null;
    isGeneratingRef.current = false;
    shouldPlayNextRef.current = false;
    continuePlayingRef.current = false;
    pendingVerseRef.current = null;
    console.log("SequencePlayer mounted, refs reset. Active sequences:", activeSequences.length, "Total items:", totalItems);
  }, []);

  // Fetch chapter content
  const fetchChapter = useCallback(async (book: string, chapter: number) => {
    const cacheKey = `${book}-${chapter}`;
    
    try {
      console.log("Fetching chapter:", cacheKey);
      const { data, error } = await supabase.functions.invoke("bible-api", {
        body: { book, chapter, version: "kjv" },
      });

      if (error) throw error;
      return data.verses as { verse: number; text: string }[];
    } catch (e) {
      console.error("Error fetching chapter:", e);
      return null;
    }
  }, []);

  // Generate TTS for text
  const generateTTS = useCallback(async (text: string, voice: string) => {
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

  // Play a specific verse by index - using a stable ref to avoid stale closures
  const playVerseAtIndex = useCallback(async (verseIdx: number, content: ChapterContent, voice: string) => {
    if (isGeneratingRef.current) {
      console.log("Already generating TTS, skipping verse:", verseIdx + 1);
      return;
    }
    if (!content || verseIdx >= content.verses.length) {
      console.log("Invalid verse index or content");
      return;
    }

    isGeneratingRef.current = true;
    const verse = content.verses[verseIdx];

    console.log("=== Starting TTS for verse:", verseIdx + 1, "of", content.verses.length);

    setIsLoading(true);
    setCurrentVerseIdx(verseIdx);
    
    const url = await generateTTS(verse.text, voice);
    
    isGeneratingRef.current = false;
    setIsLoading(false);

    if (!url) {
      console.error("Failed to generate TTS URL");
      toast.error("Failed to generate audio");
      continuePlayingRef.current = false;
      return;
    }

    // Clean up previous audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(url);

    // Create and configure audio element
    const audio = new Audio(url);
    audio.volume = isMuted ? 0 : volume / 100;
    
    // Store reference before setting handlers
    audioRef.current = audio;

    audio.onplay = () => {
      console.log(">>> Audio playing verse:", verseIdx + 1);
      notifyTTSStarted();
    };
    
    audio.onended = () => {
      console.log("<<< Audio ended verse:", verseIdx + 1, "| continue:", continuePlayingRef.current);
      notifyTTSStopped();
      
      // Clear the audio ref immediately
      audioRef.current = null;
      
      if (!continuePlayingRef.current) {
        console.log("Not continuing - flag is false");
        return;
      }
      
      const nextVerseIdx = verseIdx + 1;
      
      if (nextVerseIdx < content.verses.length) {
        console.log("Scheduling next verse:", nextVerseIdx + 1);
        // Use setTimeout to ensure clean state transition
        setTimeout(() => {
          if (continuePlayingRef.current) {
            playVerseAtIndex(nextVerseIdx, content, voice);
          }
        }, 100);
      } else {
        // Move to next chapter
        console.log("Chapter complete, checking for next...");
        shouldPlayNextRef.current = true;
        setCurrentItemIdx((prev) => {
          const nextIdx = prev + 1;
          if (nextIdx >= totalItems) {
            console.log("All chapters complete!");
            setIsPlaying(false);
            continuePlayingRef.current = false;
            toast.success("Reading sequence complete!");
            return prev;
          }
          console.log("Moving to chapter:", nextIdx + 1);
          setCurrentVerseIdx(0);
          setChapterContent(null);
          return nextIdx;
        });
      }
    };

    audio.onerror = (e) => {
      console.error("Audio error:", e);
      notifyTTSStopped();
      audioRef.current = null;
      isGeneratingRef.current = false;
      continuePlayingRef.current = false;
    };

    // Start playback
    try {
      await audio.play();
      console.log("Audio play() called successfully");
      setIsPlaying(true);
      setIsPaused(false);
    } catch (e) {
      console.error("Failed to play audio:", e);
      audioRef.current = null;
      isGeneratingRef.current = false;
    }
  }, [volume, isMuted, totalItems, generateTTS]);

  // Play current verse (wrapper for playVerseAtIndex)
  const playCurrentVerse = useCallback(() => {
    if (!chapterContent) return;
    const voice = currentSequence?.voice || "daniel";
    continuePlayingRef.current = true;
    playVerseAtIndex(currentVerseIdx, chapterContent, voice);
  }, [chapterContent, currentVerseIdx, currentSequence, playVerseAtIndex]);

  // Load chapter when item changes
  useEffect(() => {
    if (!currentItem) {
      console.log("No current item, skipping chapter load");
      return;
    }
    
    const cacheKey = `${currentItem.book}-${currentItem.chapter}`;
    
    // Skip if already fetching
    if (isFetchingChapterRef.current) {
      console.log("Already fetching, skipping load for:", cacheKey);
      return;
    }
    
    // Skip if we already have this exact content
    if (chapterContent && chapterContent.book === currentItem.book && chapterContent.chapter === currentItem.chapter) {
      console.log("Already have content for:", cacheKey);
      return;
    }
    
    // Skip if we already fetched this
    if (lastFetchedRef.current === cacheKey) {
      console.log("Already fetched:", cacheKey);
      return;
    }

    const loadChapter = async () => {
      console.log("Starting chapter load for:", cacheKey);
      isFetchingChapterRef.current = true;
      setIsLoading(true);
      
      const verses = await fetchChapter(currentItem.book, currentItem.chapter);
      console.log("Fetch result:", verses ? `${verses.length} verses` : "null");
      
      isFetchingChapterRef.current = false;
      
      if (verses) {
        // Filter verses if start/end specified
        let filteredVerses = verses;
        if (currentItem.startVerse) {
          filteredVerses = verses.filter(
            (v) =>
              v.verse >= (currentItem.startVerse || 1) &&
              v.verse <= (currentItem.endVerse || verses.length)
          );
        }
        lastFetchedRef.current = cacheKey;
        setChapterContent({
          book: currentItem.book,
          chapter: currentItem.chapter,
          verses: filteredVerses,
        });
        console.log("Chapter content set:", filteredVerses.length, "verses");
      } else {
        console.error("Failed to load chapter:", cacheKey);
        toast.error("Failed to load chapter. Please try again.");
      }
      setIsLoading(false);
    };

    loadChapter();
  }, [currentItem?.book, currentItem?.chapter, currentItem?.startVerse, currentItem?.endVerse, fetchChapter]);

  // Auto-play when new chapter content loads (for chapter transitions)
  useEffect(() => {
    if (shouldPlayNextRef.current && chapterContent && !isLoading && !isGeneratingRef.current && !audioRef.current) {
      console.log("Auto-playing next chapter after transition");
      shouldPlayNextRef.current = false;
      const voice = currentSequence?.voice || "daniel";
      continuePlayingRef.current = true;
      playVerseAtIndex(0, chapterContent, voice);
    }
  }, [chapterContent, isLoading, currentSequence, playVerseAtIndex]);

  // Auto-start on mount - runs once when autoPlay is true
  useEffect(() => {
    if (!autoPlay || hasStarted) return;
    
    // Wait for content to be ready, then start
    const checkAndStart = () => {
      if (chapterContent && !isLoading && !isGeneratingRef.current && !audioRef.current) {
        console.log("Auto-starting playback, verses:", chapterContent.verses.length);
        setHasStarted(true);
        const voice = currentSequence?.voice || "daniel";
        continuePlayingRef.current = true;
        setIsPlaying(true);
        playVerseAtIndex(0, chapterContent, voice);
        return true;
      }
      return false;
    };
    
    // Try immediately
    if (checkAndStart()) return;
    
    // If not ready, poll briefly
    const interval = setInterval(() => {
      if (checkAndStart()) {
        clearInterval(interval);
      }
    }, 200);
    
    // Clean up after 5 seconds
    const timeout = setTimeout(() => clearInterval(interval), 5000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [autoPlay, hasStarted, chapterContent, isLoading, currentSequence, playVerseAtIndex]);

  const handlePlay = () => {
    console.log("handlePlay called - isPaused:", isPaused, "hasAudio:", !!audioRef.current);
    if (isPaused && audioRef.current) {
      // Resume paused audio
      continuePlayingRef.current = true;
      audioRef.current.play();
      setIsPaused(false);
      setIsPlaying(true);
      notifyTTSStarted();
    } else if (chapterContent) {
      // Start fresh playback
      console.log("Starting fresh playback from verse:", currentVerseIdx + 1);
      const voice = currentSequence?.voice || "daniel";
      continuePlayingRef.current = true;
      setIsPlaying(true);
      playVerseAtIndex(currentVerseIdx, chapterContent, voice);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      continuePlayingRef.current = false;
      audioRef.current.pause();
      setIsPaused(true);
      notifyTTSStopped();
    }
  };

  const handleStop = () => {
    continuePlayingRef.current = false;
    pendingVerseRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentItemIdx(0);
    setCurrentVerseIdx(0);
    setChapterContent(null);
    lastFetchedRef.current = null;
    shouldPlayNextRef.current = false;
    notifyTTSStopped();
  };

  const handleSkipNext = () => {
    pendingVerseRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    notifyTTSStopped();
    if (currentItemIdx < totalItems - 1) {
      shouldPlayNextRef.current = isPlaying && continuePlayingRef.current;
      setCurrentItemIdx((prev) => prev + 1);
      setCurrentVerseIdx(0);
      setChapterContent(null);
      lastFetchedRef.current = null;
    }
  };

  const handleSkipPrev = () => {
    pendingVerseRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    notifyTTSStopped();
    if (currentItemIdx > 0) {
      shouldPlayNextRef.current = isPlaying && continuePlayingRef.current;
      setCurrentItemIdx((prev) => prev - 1);
      setCurrentVerseIdx(0);
      setChapterContent(null);
      lastFetchedRef.current = null;
    } else {
      shouldPlayNextRef.current = isPlaying && continuePlayingRef.current;
      setCurrentVerseIdx(0);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume / 100 : 0;
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      notifyTTSStopped();
    };
  }, [audioUrl]);

  if (activeSequences.length === 0) {
    return (
      <Card className="border-dashed glass-card bg-card/30 backdrop-blur-xl">
        <CardContent className="py-8 text-center text-muted-foreground">
          <ListMusic className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No chapters added to your sequence yet.</p>
          <p className="text-sm mt-2">Add books and chapters above to start listening.</p>
        </CardContent>
      </Card>
    );
  }

  const progressPercent = chapterContent
    ? ((currentVerseIdx + 1) / chapterContent.verses.length) * 100
    : 0;

  return (
    <Card className="overflow-hidden glass-card border-white/10 bg-card/50 backdrop-blur-xl">
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Now Playing
          </CardTitle>
          <Badge variant="outline">
            {currentItemIdx + 1} / {totalItems} chapters
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Chapter Display */}
        <div className="text-center py-4 bg-muted/30 rounded-lg">
          <p className="text-2xl font-bold">
            {currentItem?.book} {currentItem?.chapter}
          </p>
          {currentItem?.startVerse && (
            <p className="text-sm text-muted-foreground">
              Verses {currentItem.startVerse}-{currentItem.endVerse || "end"}
            </p>
          )}
          {chapterContent && (
            <p className="text-sm text-muted-foreground mt-2">
              Verse {currentVerseIdx + 1} of {chapterContent.verses.length}
            </p>
          )}
        </div>

        {/* Current Verse Text */}
        {chapterContent && chapterContent.verses[currentVerseIdx] && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-lg leading-relaxed">
              <span className="text-primary font-bold mr-2">
                {chapterContent.verses[currentVerseIdx].verse}
              </span>
              {chapterContent.verses[currentVerseIdx].text}
            </p>
          </div>
        )}

        {/* Progress */}
        <Progress value={progressPercent} className="h-2" />

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkipPrev}
            disabled={isLoading}
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          {isPlaying && !isPaused ? (
            <Button
              size="lg"
              className="h-14 w-14 rounded-full"
              onClick={handlePause}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Pause className="h-6 w-6" />
              )}
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-14 w-14 rounded-full gradient-palace"
              onClick={handlePlay}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkipNext}
            disabled={isLoading || currentItemIdx >= totalItems - 1}
          >
            <SkipForward className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
          >
            <Square className="h-5 w-5" />
          </Button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 px-4">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
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
            className="flex-1"
          />
        </div>

        {/* Sequence Overview */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Up Next:</p>
          <div className="flex flex-wrap gap-1">
            {allItems.slice(currentItemIdx + 1, currentItemIdx + 6).map((item, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {item.book} {item.chapter}
              </Badge>
            ))}
            {allItems.length > currentItemIdx + 6 && (
              <Badge variant="outline" className="text-xs">
                +{allItems.length - currentItemIdx - 6} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
