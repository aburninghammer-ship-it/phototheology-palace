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
  Smartphone,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReadingSequenceBlock, SequenceItem } from "@/types/readingSequence";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isPlayingCommentary, setIsPlayingCommentary] = useState(false);
  const [commentaryText, setCommentaryText] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isGeneratingRef = useRef(false); // Prevent concurrent TTS requests
  const isFetchingChapterRef = useRef(false); // Prevent concurrent chapter fetches
  const lastFetchedRef = useRef<string | null>(null); // Track last fetched chapter
  const shouldPlayNextRef = useRef(false); // Signal to play next chapter
  const continuePlayingRef = useRef(false); // Signal to continue playing verses
  const pendingVerseRef = useRef<{ verseIdx: number; content: ChapterContent; voice: string } | null>(null);
  const ttsCache = useRef<Map<string, string>>(new Map()); // Cache for prefetched TTS URLs
  const prefetchingRef = useRef<Set<string>>(new Set()); // Track verses being prefetched
  const playingCommentaryRef = useRef(false); // Track if we're in commentary playback
  const chapterCache = useRef<Map<string, { verse: number; text: string }[]>>(new Map()); // Cache for prefetched chapters
  
  const isMobile = useIsMobile();
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
    playingCommentaryRef.current = false;
    ttsCache.current.clear();
    prefetchingRef.current.clear();
    console.log("SequencePlayer mounted, refs reset. Active sequences:", activeSequences.length, "Total items:", totalItems);
  }, []);

  // Generate chapter commentary using Jeeves
  const generateCommentary = useCallback(async (book: string, chapter: number, chapterText?: string, depth: string = "surface") => {
    try {
      console.log("[Commentary] Generating", depth, "commentary for", book, chapter);
      const { data, error } = await supabase.functions.invoke("generate-chapter-commentary", {
        body: { book, chapter, chapterText, depth },
      });

      if (error) {
        console.error("[Commentary] Edge function error:", error);
        throw error;
      }
      console.log("[Commentary] Generated commentary length:", data?.commentary?.length || 0);
      return data?.commentary as string | null;
    } catch (e) {
      console.error("[Commentary] Error generating commentary:", e);
      return null;
    }
  }, []);

  // Move to next chapter
  const moveToNextChapter = useCallback(() => {
    console.log("[Audio] moveToNextChapter called");
    shouldPlayNextRef.current = true;
    setCurrentItemIdx((prev) => {
      const nextIdx = prev + 1;
      if (nextIdx >= totalItems) {
        console.log("[Audio] All chapters complete!");
        setIsPlaying(false);
        continuePlayingRef.current = false;
        toast.success("Reading sequence complete!");
        return prev;
      }
      console.log("[Audio] Moving to chapter:", nextIdx + 1, "of", totalItems);
      setCurrentVerseIdx(0);
      // Clear chapter content to trigger reload
      setChapterContent(null);
      // Reset lastFetchedRef so the new chapter can load
      lastFetchedRef.current = "";
      return nextIdx;
    });
  }, [totalItems]);

  // Fetch chapter content (with caching)
  const fetchChapter = useCallback(async (book: string, chapter: number) => {
    const cacheKey = `${book}-${chapter}`;
    
    // Check cache first
    if (chapterCache.current.has(cacheKey)) {
      console.log("[Chapter] Using cached:", cacheKey);
      return chapterCache.current.get(cacheKey)!;
    }
    
    try {
      console.log("[Chapter] Fetching:", cacheKey);
      const { data, error } = await supabase.functions.invoke("bible-api", {
        body: { book, chapter, version: "kjv" },
      });

      if (error) throw error;
      const verses = data.verses as { verse: number; text: string }[];
      chapterCache.current.set(cacheKey, verses);
      return verses;
    } catch (e) {
      console.error("Error fetching chapter:", e);
      return null;
    }
  }, []);

  // Prefetch next chapter in background
  const prefetchNextChapter = useCallback((currentIdx: number) => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= allItems.length) return;
    
    const nextItem = allItems[nextIdx];
    if (!nextItem) return;
    
    const cacheKey = `${nextItem.book}-${nextItem.chapter}`;
    if (chapterCache.current.has(cacheKey)) return;
    
    console.log("[Prefetch] Starting chapter prefetch:", cacheKey);
    fetchChapter(nextItem.book, nextItem.chapter);
  }, [allItems, fetchChapter]);

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

  // Play commentary audio
  const playCommentary = useCallback(async (text: string, voice: string, onComplete: () => void) => {
    console.log("[Commentary] Playing commentary...");
    setIsPlayingCommentary(true);
    setCommentaryText(text);
    playingCommentaryRef.current = true;
    setIsLoading(true);

    const url = await generateTTS(text, voice);
    setIsLoading(false);

    if (!url) {
      console.error("[Commentary] Failed to generate TTS");
      setIsPlayingCommentary(false);
      playingCommentaryRef.current = false;
      setCommentaryText(null);
      onComplete();
      return;
    }

    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current = null;
    }

    const audio = new Audio(url);
    audio.volume = isMuted ? 0 : volume / 100;
    audioRef.current = audio;
    setAudioUrl(url);

    audio.onended = () => {
      console.log("[Commentary] Finished playing");
      audioRef.current = null;
      setIsPlayingCommentary(false);
      playingCommentaryRef.current = false;
      setCommentaryText(null);
      URL.revokeObjectURL(url);
      onComplete();
    };

    audio.onerror = () => {
      console.error("[Commentary] Audio error");
      audioRef.current = null;
      setIsPlayingCommentary(false);
      playingCommentaryRef.current = false;
      setCommentaryText(null);
      onComplete();
    };

    try {
      await audio.play();
    } catch (e) {
      console.error("[Commentary] Play failed:", e);
      setIsPlayingCommentary(false);
      playingCommentaryRef.current = false;
      setCommentaryText(null);
      onComplete();
    }
  }, [generateTTS, isMuted, volume]);

  // Prefetch TTS for upcoming verses
  const prefetchVerse = useCallback(async (verseIdx: number, content: ChapterContent, voice: string) => {
    if (!content?.verses || verseIdx >= content.verses.length) return;
    
    const cacheKey = `${content.book}-${content.chapter}-${verseIdx}-${voice}`;
    
    // Skip if already cached or being prefetched
    if (ttsCache.current.has(cacheKey) || prefetchingRef.current.has(cacheKey)) {
      return;
    }
    
    prefetchingRef.current.add(cacheKey);
    console.log("[Prefetch] Starting for verse:", verseIdx + 1);
    
    const verse = content.verses[verseIdx];
    const url = await generateTTS(verse.text, voice);
    
    prefetchingRef.current.delete(cacheKey);
    
    if (url) {
      ttsCache.current.set(cacheKey, url);
      console.log("[Prefetch] Cached verse:", verseIdx + 1);
    }
  }, [generateTTS]);

  // Play a specific verse by index - using a stable ref to avoid stale closures
  const playVerseAtIndex = useCallback(async (verseIdx: number, content: ChapterContent, voice: string) => {
    console.log("[PlayVerse] Called with:", { verseIdx, versesCount: content?.verses?.length, voice });
    
    if (isGeneratingRef.current) {
      console.log("[PlayVerse] Already generating TTS, skipping verse:", verseIdx + 1);
      return;
    }
    if (!content || !content.verses || verseIdx >= content.verses.length) {
      console.log("[PlayVerse] Invalid verse index or content:", { hasContent: !!content, verseIdx });
      return;
    }

    const verse = content.verses[verseIdx];
    const cacheKey = `${content.book}-${content.chapter}-${verseIdx}-${voice}`;
    
    setCurrentVerseIdx(verseIdx);
    
    // Check cache first
    let url = ttsCache.current.get(cacheKey);
    
    if (url) {
      console.log("[PlayVerse] Using cached TTS for verse:", verseIdx + 1);
    } else {
      // Generate TTS
      isGeneratingRef.current = true;
      console.log("[PlayVerse] Generating TTS for verse:", verseIdx + 1, "text:", verse.text.substring(0, 50));
      setIsLoading(true);
      
      url = await generateTTS(verse.text, voice);
      
      isGeneratingRef.current = false;
      setIsLoading(false);
      
      if (url) {
        ttsCache.current.set(cacheKey, url);
      }
    }
    
    console.log("[PlayVerse] TTS result:", url ? "URL ready" : "FAILED");

    if (!url) {
      console.error("[PlayVerse] Failed to generate TTS URL");
      toast.error("Failed to generate audio");
      continuePlayingRef.current = false;
      setIsPlaying(false);
      return;
    }

    // Prefetch next 2 verses while this one plays
    for (let i = 1; i <= 2; i++) {
      const nextIdx = verseIdx + i;
      if (nextIdx < content.verses.length) {
        prefetchVerse(nextIdx, content, voice);
      }
    }
    
    // Prefetch next chapter when we're past halfway through current chapter
    if (verseIdx > content.verses.length / 2) {
      prefetchNextChapter(currentItemIdx);
    }

    // Stop any existing audio BEFORE setting up new one
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    
    // Clean up previous audio URL (but not if it's cached)
    if (audioUrl && !Array.from(ttsCache.current.values()).includes(audioUrl)) {
      URL.revokeObjectURL(audioUrl);
    }

    // Create and configure audio element FIRST
    console.log("[PlayVerse] Creating Audio element with volume:", isMuted ? 0 : volume / 100);
    const audio = new Audio(url);
    audio.volume = isMuted ? 0 : volume / 100;
    
    // Store reference BEFORE any async operations
    audioRef.current = audio;
    
    // Set URL state AFTER audio is ready (don't trigger cleanup re-render during setup)
    setAudioUrl(url);

    audio.onloadstart = () => {
      console.log("[Audio] Load started for verse:", verseIdx + 1);
    };
    
    audio.oncanplaythrough = () => {
      console.log("[Audio] Can play through for verse:", verseIdx + 1);
    };

    audio.onplay = () => {
      console.log("[Audio] >>> Playing verse:", verseIdx + 1);
      // Don't call notifyTTSStarted here - we do it when sequence starts
    };
    
    audio.onended = () => {
      console.log("[Audio] <<< Ended verse:", verseIdx + 1, "| continue:", continuePlayingRef.current);
      // Don't call notifyTTSStopped here - keep music ducked between verses
      
      // Clear the audio ref immediately
      audioRef.current = null;
      
      if (!continuePlayingRef.current) {
        console.log("[Audio] Not continuing - flag is false");
        return;
      }
      
      const nextVerseIdx = verseIdx + 1;
      
      if (nextVerseIdx < content.verses.length) {
        console.log("[Audio] Playing next verse:", nextVerseIdx + 1);
        // Immediate transition - no delay needed since next verse should be prefetched
        if (continuePlayingRef.current) {
          playVerseAtIndex(nextVerseIdx, content, voice);
        }
      } else {
        // Chapter complete - check for commentary before moving on
        console.log("[Audio] Chapter complete, checking for commentary...");
        
        // Find current sequence to check if commentary is enabled
        const currentSeq = activeSequences.find((seq, idx) => {
          const itemsBefore = activeSequences.slice(0, idx).reduce((acc, s) => acc + s.items.length, 0);
          return currentItemIdx >= itemsBefore && currentItemIdx < itemsBefore + seq.items.length;
        });
        
        const includeCommentary = currentSeq?.includeJeevesCommentary || false;
        console.log("[Audio] Commentary enabled:", includeCommentary, "| Voice:", currentSeq?.commentaryVoice);
        
        if (includeCommentary && content && continuePlayingRef.current) {
          // Generate and play commentary before moving to next chapter
          const commentaryVoice = currentSeq?.commentaryVoice || "daniel";
          const commentaryDepth = currentSeq?.commentaryDepth || "surface";
          console.log("[Commentary] Generating", commentaryDepth, "commentary with voice:", commentaryVoice);
          setIsLoading(true);
          const chapterText = content.verses.map(v => `${v.verse}. ${v.text}`).join(" ");
          
          // Generate commentary and play it
          generateCommentary(content.book, content.chapter, chapterText, commentaryDepth)
            .then(commentary => {
              console.log("[Commentary] Result:", commentary ? `${commentary.length} chars` : "null");
              if (commentary && continuePlayingRef.current) {
                console.log("[Commentary] Starting playback...");
                playCommentary(commentary, commentaryVoice, () => {
                  console.log("[Commentary] Playback complete, moving to next chapter");
                  moveToNextChapter();
                });
              } else {
                console.log("[Commentary] No commentary or stopped, moving on");
                setIsLoading(false);
                moveToNextChapter();
              }
            })
            .catch((err) => {
              console.error("[Commentary] Error:", err);
              setIsLoading(false);
              moveToNextChapter();
            });
        } else {
          // No commentary - move to next chapter immediately
          console.log("[Audio] No commentary, moving to next chapter immediately");
          moveToNextChapter();
        }
      }
    };

    audio.onerror = (e) => {
      const error = audio.error;
      console.error("[Audio] Error:", {
        code: error?.code,
        message: error?.message,
        verseIdx: verseIdx + 1
      });
      // Don't call notifyTTSStopped here - keep music ducked during errors
      audioRef.current = null;
      isGeneratingRef.current = false;
      continuePlayingRef.current = false;
      setIsPlaying(false);
    };

    // Start playback
    try {
      console.log("[Audio] Calling play()...");
      await audio.play();
      console.log("[Audio] play() succeeded for verse:", verseIdx + 1);
      setIsPlaying(true);
      setIsPaused(false);
    } catch (e) {
      console.error("[Audio] play() failed:", e);
      audioRef.current = null;
      isGeneratingRef.current = false;
      continuePlayingRef.current = false;
      setIsPlaying(false);
      toast.error("Failed to play audio - try clicking play manually");
    }
  }, [volume, isMuted, totalItems, generateTTS, prefetchVerse, activeSequences, currentItemIdx, generateCommentary, playCommentary, moveToNextChapter, prefetchNextChapter]);

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
      console.log("[AutoStart] Checking:", {
        hasContent: !!chapterContent,
        versesCount: chapterContent?.verses?.length,
        isLoading,
        isGenerating: isGeneratingRef.current,
        hasAudio: !!audioRef.current
      });
      
      if (chapterContent && chapterContent.verses && chapterContent.verses.length > 0 && !isLoading && !isGeneratingRef.current && !audioRef.current) {
        console.log("[AutoStart] Starting playback with", chapterContent.verses.length, "verses");
        setHasStarted(true);
        const voice = currentSequence?.voice || "daniel";
        continuePlayingRef.current = true;
        // Don't set isPlaying here - let playVerseAtIndex do it after audio actually starts
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
    }, 300);
    
    // Clean up after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.log("[AutoStart] Timeout - content never became ready");
    }, 10000);
    
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
      notifyTTSStarted(); // Duck music when resuming
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
      notifyTTSStopped(); // Restore music when paused
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
    notifyTTSStopped(); // Restore music when stopped
  };

  const handleSkipNext = () => {
    pendingVerseRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    // Don't call notifyTTSStopped - keep music ducked while navigating
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
    // Don't call notifyTTSStopped - keep music ducked while navigating
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

  // Auto-scroll to current verse
  useEffect(() => {
    if (chapterContent && currentVerseIdx >= 0) {
      const verseNum = chapterContent.verses[currentVerseIdx]?.verse;
      if (verseNum) {
        const el = document.getElementById(`verse-${verseNum}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentVerseIdx, chapterContent]);

  // Cleanup on unmount only - not on audioUrl change (that was causing the race condition)
  useEffect(() => {
    return () => {
      continuePlayingRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      notifyTTSStopped(); // Restore music on unmount
    };
  }, []);

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
        {/* Commentary Display - shown when Jeeves is commenting */}
        {isPlayingCommentary && commentaryText && (
          <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎩</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">Jeeves Commentary</span>
              <Badge variant="secondary" className="ml-auto animate-pulse">Speaking</Badge>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground italic">
              {commentaryText}
            </p>
          </div>
        )}

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
          {chapterContent && !isPlayingCommentary && (
            <p className="text-sm text-muted-foreground mt-2">
              Verse {currentVerseIdx + 1} of {chapterContent.verses.length}
            </p>
          )}
          {isPlayingCommentary && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
              🎩 Jeeves is sharing insights...
            </p>
          )}
        </div>

        {/* All Verses Display - scrollable with current verse highlighted */}
        {chapterContent && chapterContent.verses.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto rounded-lg border border-border/50 bg-muted/20">
            <div className="p-4 space-y-3">
              {chapterContent.verses.map((verse, idx) => (
                <p
                  key={verse.verse}
                  id={`verse-${verse.verse}`}
                  className={`text-base leading-relaxed transition-all duration-300 rounded-md p-2 ${
                    idx === currentVerseIdx
                      ? "bg-primary/20 border-l-4 border-primary scale-[1.01]"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <span className={`font-bold mr-2 ${idx === currentVerseIdx ? "text-primary" : "text-muted-foreground"}`}>
                    {verse.verse}
                  </span>
                  {verse.text}
                </p>
              ))}
            </div>
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

        {/* Volume - hidden on mobile since programmatic volume doesn't work */}
        {!isMobile ? (
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
        ) : (
          <div className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted-foreground">
            <Smartphone className="h-4 w-4" />
            <span>Use device volume buttons</span>
          </div>
        )}

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
