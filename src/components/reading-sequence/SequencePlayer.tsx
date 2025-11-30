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
  
  const activeSequences = sequences.filter((s) => s.enabled && s.items.length > 0);

  // Flatten all items across sequences for navigation
  const allItems = activeSequences.flatMap((seq, seqIdx) =>
    seq.items.map((item) => ({ ...item, seqIdx, voice: seq.voice }))
  );

  const currentItem = allItems[currentItemIdx] || null;
  const currentSequence = activeSequences[currentSeqIdx];
  const totalItems = allItems.length;

  // Fetch chapter content with deduplication
  const fetchChapter = useCallback(async (book: string, chapter: number) => {
    const cacheKey = `${book}-${chapter}`;
    
    // Prevent duplicate fetches
    if (isFetchingChapterRef.current || lastFetchedRef.current === cacheKey) {
      console.log("Skipping duplicate fetch for:", cacheKey);
      return null;
    }
    
    isFetchingChapterRef.current = true;
    
    try {
      console.log("Fetching chapter:", cacheKey);
      const { data, error } = await supabase.functions.invoke("bible-api", {
        body: { book, chapter, version: "kjv" },
      });

      if (error) throw error;
      lastFetchedRef.current = cacheKey;
      return data.verses as { verse: number; text: string }[];
    } catch (e) {
      console.error("Error fetching chapter:", e);
      return null;
    } finally {
      isFetchingChapterRef.current = false;
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

  // Play current verse
  const playCurrentVerse = useCallback(async () => {
    // Prevent concurrent TTS requests
    if (isGeneratingRef.current) {
      console.log("Already generating TTS, skipping...");
      return;
    }
    if (!chapterContent || currentVerseIdx >= chapterContent.verses.length) return;

    isGeneratingRef.current = true;
    const verse = chapterContent.verses[currentVerseIdx];
    const voice = currentSequence?.voice || "daniel";

    setIsLoading(true);
    const url = await generateTTS(verse.text, voice);
    setIsLoading(false);
    isGeneratingRef.current = false;

    if (!url) {
      toast.error("Failed to generate audio");
      return;
    }

    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(url);

    const audio = new Audio(url);
    audio.volume = isMuted ? 0 : volume / 100;
    audioRef.current = audio;

    audio.onplay = () => notifyTTSStarted();
    audio.onended = () => {
      notifyTTSStopped();
      // Move to next verse
      if (currentVerseIdx < chapterContent.verses.length - 1) {
        setCurrentVerseIdx((prev) => prev + 1);
      } else {
        // Move to next chapter/item
        if (currentItemIdx < totalItems - 1) {
          setCurrentItemIdx((prev) => prev + 1);
          setCurrentVerseIdx(0);
          setChapterContent(null);
        } else {
          // Finished all
          setIsPlaying(false);
          toast.success("Reading sequence complete!");
        }
      }
    };

    audio.play();
    setIsPlaying(true);
    setIsPaused(false);
  }, [chapterContent, currentVerseIdx, currentSequence, audioUrl, volume, isMuted, currentItemIdx, totalItems, generateTTS]);

  // Load chapter when item changes
  useEffect(() => {
    if (!currentItem) return;
    
    const cacheKey = `${currentItem.book}-${currentItem.chapter}`;
    
    // Skip if already fetching or already have this content
    if (isFetchingChapterRef.current) {
      console.log("Already fetching, skipping load for:", cacheKey);
      return;
    }
    
    if (chapterContent && chapterContent.book === currentItem.book && chapterContent.chapter === currentItem.chapter) {
      console.log("Already have content for:", cacheKey);
      return;
    }

    const loadChapter = async () => {
      setIsLoading(true);
      const verses = await fetchChapter(currentItem.book, currentItem.chapter);
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
        setChapterContent({
          book: currentItem.book,
          chapter: currentItem.chapter,
          verses: filteredVerses,
        });
      }
      setIsLoading(false);
    };

    loadChapter();
  }, [currentItem?.book, currentItem?.chapter, currentItem?.startVerse, currentItem?.endVerse, fetchChapter]);

  // Auto-play next verse when content loads and playing
  useEffect(() => {
    if (isPlaying && !isPaused && chapterContent && !isLoading && !isGeneratingRef.current) {
      playCurrentVerse();
    }
  }, [chapterContent, isPlaying, isPaused, isLoading]);

  // Auto-start (only once)
  useEffect(() => {
    if (autoPlay && chapterContent && !hasStarted) {
      setHasStarted(true);
      handlePlay();
    }
  }, [autoPlay, chapterContent, hasStarted]);

  const handlePlay = () => {
    if (isPaused && audioRef.current) {
      audioRef.current.play();
      setIsPaused(false);
      notifyTTSStarted();
    } else {
      setIsPlaying(true);
      playCurrentVerse();
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
      notifyTTSStopped();
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentItemIdx(0);
    setCurrentVerseIdx(0);
    setChapterContent(null);
    lastFetchedRef.current = null; // Reset to allow fresh fetch
    notifyTTSStopped();
  };

  const handleSkipNext = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (currentItemIdx < totalItems - 1) {
      setCurrentItemIdx((prev) => prev + 1);
      setCurrentVerseIdx(0);
      setChapterContent(null);
      lastFetchedRef.current = null; // Reset to allow fresh fetch
    }
  };

  const handleSkipPrev = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (currentItemIdx > 0) {
      setCurrentItemIdx((prev) => prev - 1);
      setCurrentVerseIdx(0);
      setChapterContent(null);
      lastFetchedRef.current = null; // Reset to allow fresh fetch
    } else {
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
