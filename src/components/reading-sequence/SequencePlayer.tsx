import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Download,
  WifiOff,
  RotateCcw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReadingSequenceBlock, SequenceItem } from "@/types/readingSequence";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { useIsMobile } from "@/hooks/use-mobile";
import { setGlobalMusicVolume, getGlobalMusicVolume } from "@/hooks/useMusicVolumeControl";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { DownloadSequenceDialog } from "./DownloadSequenceDialog";
import { OfflineModeToggle } from "./OfflineModeToggle";
import { isOnline, getCachedMusicTrack } from "@/services/offlineAudioCache";
import { 
  getCachedChapterCommentary, 
  cacheChapterCommentary,
  getCachedVerseCommentary,
  cacheVerseCommentary 
} from "@/services/offlineCommentaryCache";

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
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(() => {
    // Check if any sequence has background music enabled
    const hasMusicEnabled = sequences.some(s => s.backgroundMusic);
    return hasMusicEnabled ? Math.min(getGlobalMusicVolume(), 25) : 0;
  });
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlayingCommentary, setIsPlayingCommentary] = useState(false);
  const [offlineMode, setOfflineMode] = useState(!isOnline());
  const [commentaryText, setCommentaryText] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null); // Background music audio
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
  const commentaryCache = useRef<Map<string, { text: string; audioUrl?: string }>>(new Map()); // Cache for pre-generated commentary
  const prefetchingCommentaryRef = useRef<Set<string>>(new Set()); // Track commentary being prefetched
  const browserUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null); // For pause/resume with browser TTS
  const retryCountRef = useRef(0); // Track retry attempts for resilience
  const pausedVerseRef = useRef<{ verseIdx: number; content: ChapterContent; voice: string } | null>(null); // Track paused position
  const keepAliveIntervalRef = useRef<number | null>(null); // Keep speech alive on mobile
  
  const isMobile = useIsMobile();
  const activeSequences = sequences.filter((s) => s.enabled && s.items.length > 0);

  // Keep speech synthesis alive on mobile browsers
  useEffect(() => {
    const keepAlive = () => {
      if (isPlaying && !isPaused && speechSynthesis.speaking) {
        if (speechSynthesis.paused) {
          console.log('[SequencePlayer] Resuming suspended speech');
          speechSynthesis.resume();
        }
      }
    };

    if (isPlaying && !isPaused) {
      keepAliveIntervalRef.current = window.setInterval(keepAlive, 5000);
    }

    return () => {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
    };
  }, [isPlaying, isPaused]);

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
    commentaryCache.current.clear();
    prefetchingCommentaryRef.current.clear();
    
    // Set music volume based on whether music is enabled in sequences
    const hasMusicEnabled = sequences.some(s => s.backgroundMusic);
    const defaultMusic = hasMusicEnabled ? Math.min(getGlobalMusicVolume(), 25) : 0;
    setMusicVolume(defaultMusic);
    setGlobalMusicVolume(defaultMusic);
    console.log("[SequencePlayer] Music volume initialized to:", defaultMusic, "enabled:", hasMusicEnabled);
    
    console.log("SequencePlayer mounted, refs reset. Active sequences:", activeSequences.length, "Total items:", totalItems);
  }, []);

  // Callback ref for music audio - ensures volume is set when element mounts
  const setMusicAudioRef = useCallback((node: HTMLAudioElement | null) => {
    if (node) {
      musicAudioRef.current = node;
      // Apply current volume immediately
      node.volume = musicVolume / 100;
      console.log('[SequencePlayer] Music audio ref set, volume:', musicVolume / 100);
    }
  }, [musicVolume]);

  // Update music volume directly on ref - critical for mobile
  useEffect(() => {
    if (musicAudioRef.current) {
      const vol = musicVolume / 100;
      musicAudioRef.current.volume = vol;
      console.log('[SequencePlayer] Music volume effect applied:', vol);
    }
  }, [musicVolume]);

  // Start/pause music based on playback
  useEffect(() => {
    const hasMusicEnabled = sequences.some(s => s.backgroundMusic);
    if (musicAudioRef.current && isPlaying && !isPaused && musicVolume > 0 && hasMusicEnabled) {
      console.log("[Music] Starting background music, volume:", musicVolume);
      musicAudioRef.current.play().catch((err) => {
        console.error("[Music] Failed to start:", err);
      });
    } else if (musicAudioRef.current && (!isPlaying || isPaused || !hasMusicEnabled)) {
      musicAudioRef.current.pause();
    }
  }, [isPlaying, isPaused, musicVolume, sequences]);

  // Generate chapter commentary using Jeeves (with offline cache)
  const generateCommentary = useCallback(async (book: string, chapter: number, chapterText?: string, depth: string = "surface") => {
    try {
      // Check offline cache first
      const cached = getCachedChapterCommentary(book, chapter, depth);
      if (cached) {
        console.log("[Commentary] Using cached chapter commentary for", book, chapter);
        return cached;
      }

      // If offline and no cache, return null
      if (!isOnline()) {
        console.log("[Commentary] Offline and no cache for", book, chapter);
        return null;
      }

      console.log("[Commentary] Generating", depth, "chapter commentary for", book, chapter);
      
      // Add timeout to edge function call
      const timeoutMs = 20000; // 20 second timeout for chapter commentary
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      try {
        const { data, error } = await supabase.functions.invoke("generate-chapter-commentary", {
          body: { book, chapter, chapterText, depth },
        });
        
        clearTimeout(timeoutId);

        if (error) {
          console.error("[Commentary] Edge function error:", error);
          throw error;
        }
        
        const commentary = data?.commentary as string | null;
        
        // Cache the commentary for offline use
        if (commentary) {
          cacheChapterCommentary(book, chapter, depth, commentary);
        }
        
        console.log("[Commentary] Generated chapter commentary length:", commentary?.length || 0);
        return commentary;
      } catch (invokeError) {
        clearTimeout(timeoutId);
        throw invokeError;
      }
    } catch (e) {
      console.error("[Commentary] Error generating chapter commentary:", e);
      return null;
    }
  }, []);

  // Generate verse commentary using Jeeves (with offline cache)
  const generateVerseCommentary = useCallback(async (book: string, chapter: number, verse: number, verseText: string, depth: string = "surface") => {
    try {
      // Check offline cache first
      const cached = getCachedVerseCommentary(book, chapter, verse, depth);
      if (cached) {
        console.log("[Verse Commentary] Using cached commentary for", book, chapter + ":" + verse);
        return cached;
      }

      // If offline and no cache, return null
      if (!isOnline()) {
        console.log("[Verse Commentary] Offline and no cache for", book, chapter + ":" + verse);
        return null;
      }

      console.log("[Verse Commentary] Generating", depth, "commentary for", book, chapter + ":" + verse);
      
      // Add timeout to edge function call
      const timeoutMs = 10000; // 10 second timeout for verse commentary
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      try {
        const { data, error } = await supabase.functions.invoke("generate-verse-commentary", {
          body: { book, chapter, verse, verseText, depth },
        });
        
        clearTimeout(timeoutId);

        if (error) {
          console.error("[Verse Commentary] Edge function error:", error);
          throw error;
        }
        
        const commentary = data?.commentary as string | null;
        
        // Cache the commentary for offline use
        if (commentary) {
          cacheVerseCommentary(book, chapter, verse, depth, commentary);
        }
        
        console.log("[Verse Commentary] Generated length:", commentary?.length || 0);
        return commentary;
      } catch (invokeError) {
        clearTimeout(timeoutId);
        throw invokeError;
      }
    } catch (e) {
      console.error("[Verse Commentary] Error:", e);
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

  // Generate TTS for text - with offline fallback
  const generateTTS = useCallback(async (text: string, voice: string): Promise<string | null> => {
    // If offline mode, use browser speech synthesis
    if (offlineMode || !isOnline()) {
      console.log("[TTS] Using offline browser speech synthesis");
      return null; // Signal to use speech synthesis
    }
    
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
      // Fallback to offline mode if API fails
      return null;
    }
  }, [offlineMode]);

  // Browser speech synthesis for offline mode - with pause/resume support and chunking
  const speakWithBrowserTTS = useCallback((text: string, onEnd: () => void): void => {
    speechSynthesis.cancel();
    
    // Split long texts into chunks to prevent timeout
    const MAX_CHUNK_LENGTH = 200;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > MAX_CHUNK_LENGTH && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    if (currentChunk) chunks.push(currentChunk.trim());

    console.log(`[SequencePlayer] Split into ${chunks.length} chunks`);

    let currentChunkIndex = 0;

    const speakChunk = () => {
      if (currentChunkIndex >= chunks.length) {
        browserUtteranceRef.current = null;
        onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[currentChunkIndex]);
      utterance.rate = 1;
      utterance.pitch = 1;
      
      const voices = speechSynthesis.getVoices();
      const englishVoice = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Daniel'))
      ) || voices.find(v => v.lang.startsWith('en'));
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      utterance.onend = () => {
        currentChunkIndex++;
        setTimeout(speakChunk, 100);
      };
      
      utterance.onerror = (e) => {
        console.error("[BrowserTTS] Error on chunk:", currentChunkIndex, e);
        if (e.error !== 'interrupted') {
          currentChunkIndex++;
          if (currentChunkIndex < chunks.length) {
            setTimeout(speakChunk, 500);
          } else {
            browserUtteranceRef.current = null;
            onEnd();
          }
        }
      };
      
      browserUtteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    };

    speakChunk();
  }, []);

  // Play commentary audio
  const playCommentary = useCallback(async (text: string, voice: string, onComplete: () => void) => {
    console.log("[Commentary] Playing commentary...");
    setIsPlayingCommentary(true);
    setCommentaryText(text);
    playingCommentaryRef.current = true;
    setIsLoading(true);

    // Add timeout to TTS generation
    const timeoutMs = 30000; // 30 seconds for longer commentary
    const timeoutPromise = new Promise<string | null>((_, reject) => 
      setTimeout(() => reject(new Error('TTS generation timeout')), timeoutMs)
    );

    let url: string | null = null;
    
    try {
      url = await Promise.race([
        generateTTS(text, voice),
        timeoutPromise
      ]);
    } catch (error) {
      console.error("[Commentary] TTS generation failed or timed out:", error);
      setIsLoading(false);
      setIsPlayingCommentary(false);
      playingCommentaryRef.current = false;
      setCommentaryText(null);
      toast.error("Commentary audio unavailable, continuing", { duration: 2000 });
      onComplete();
      return;
    }
    
    setIsLoading(false);

    if (!url) {
      console.error("[Commentary] Failed to generate TTS");
      setIsPlayingCommentary(false);
      playingCommentaryRef.current = false;
      setCommentaryText(null);
      toast.error("Commentary audio unavailable, continuing", { duration: 2000 });
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
    // Apply playback speed from current sequence
    const playbackSpeed = currentSequence?.playbackSpeed || 1;
    audio.playbackRate = playbackSpeed;
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

    audio.onerror = (e) => {
      console.error("[Commentary] Audio error:", e);
      audioRef.current = null;
      setIsPlayingCommentary(false);
      playingCommentaryRef.current = false;
      setCommentaryText(null);
      toast.error("Commentary playback error, continuing", { duration: 2000 });
      onComplete();
    };

    try {
      await audio.play();
    } catch (e) {
      console.error("[Commentary] Play failed:", e);
      setIsPlayingCommentary(false);
      playingCommentaryRef.current = false;
      setCommentaryText(null);
      toast.error("Commentary playback failed, continuing", { duration: 2000 });
      onComplete();
    }
  }, [generateTTS, isMuted, volume, currentSequence]);

  // Handle chapter completion with commentary check (for browser TTS and fallback paths)
  const handleChapterCompleteWithCommentary = useCallback((content: ChapterContent) => {
    // Find current sequence to check commentary settings
    const currentSeq = activeSequences.find((seq, idx) => {
      const itemsBefore = activeSequences.slice(0, idx).reduce((acc, s) => acc + s.items.length, 0);
      return currentItemIdx >= itemsBefore && currentItemIdx < itemsBefore + seq.items.length;
    });
    
    const includeCommentary = currentSeq?.includeJeevesCommentary || false;
    const commentaryMode = currentSeq?.commentaryMode || "chapter";
    const commentaryVoice = currentSeq?.commentaryVoice || "daniel";
    const commentaryDepth = currentSeq?.commentaryDepth || "surface";
    
    console.log("[ChapterComplete] Commentary settings:", { includeCommentary, commentaryMode });
    
    if (includeCommentary && commentaryMode === "chapter" && content && continuePlayingRef.current) {
      const cacheKey = `chapter-${content.book}-${content.chapter}-${commentaryVoice}`;
      const cached = commentaryCache.current.get(cacheKey);
      
      if (cached?.audioUrl) {
        console.log("[ChapterComplete] Using cached chapter commentary audio");
        setCommentaryText(cached.text);
        setIsPlayingCommentary(true);
        playingCommentaryRef.current = true;
        
        const audio = new Audio(cached.audioUrl);
        audio.volume = isMuted ? 0 : volume / 100;
        // Apply playback speed from sequence
        const playbackSpeed = currentSeq?.playbackSpeed || 1;
        audio.playbackRate = playbackSpeed;
        audioRef.current = audio;
        
        audio.onended = () => {
          audioRef.current = null;
          setIsPlayingCommentary(false);
          playingCommentaryRef.current = false;
          setCommentaryText(null);
          moveToNextChapter();
        };
        
        audio.onerror = () => {
          audioRef.current = null;
          setIsPlayingCommentary(false);
          playingCommentaryRef.current = false;
          setCommentaryText(null);
          moveToNextChapter();
        };
        
        audio.play().catch(() => {
          setIsPlayingCommentary(false);
          playingCommentaryRef.current = false;
          setCommentaryText(null);
          moveToNextChapter();
        });
      } else if (cached?.text) {
        console.log("[ChapterComplete] Using cached chapter commentary text");
        playCommentary(cached.text, commentaryVoice, moveToNextChapter);
      } else {
        // Generate commentary
        console.log("[ChapterComplete] Generating chapter commentary");
        setIsLoading(true);
        const chapterText = content.verses.map(v => `${v.verse}. ${v.text}`).join(" ");
        
        generateCommentary(content.book, content.chapter, chapterText, commentaryDepth)
          .then(commentary => {
            if (commentary && continuePlayingRef.current) {
              playCommentary(commentary, commentaryVoice, moveToNextChapter);
            } else {
              setIsLoading(false);
              moveToNextChapter();
            }
          })
          .catch(() => {
            setIsLoading(false);
            moveToNextChapter();
          });
      }
    } else {
      console.log("[ChapterComplete] No commentary, moving to next chapter");
      moveToNextChapter();
    }
  }, [activeSequences, currentItemIdx, isMuted, volume, generateCommentary, playCommentary, moveToNextChapter]);

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

  // Prefetch verse commentary (text + TTS) while verse is playing
  const prefetchVerseCommentary = useCallback(async (
    book: string, 
    chapter: number, 
    verse: number, 
    verseText: string, 
    commentaryVoice: string,
    depth: string = "surface"
  ) => {
    const cacheKey = `verse-${book}-${chapter}-${verse}-${commentaryVoice}`;
    
    // Skip if already cached or being prefetched
    if (commentaryCache.current.has(cacheKey) || prefetchingCommentaryRef.current.has(cacheKey)) {
      return;
    }
    
    prefetchingCommentaryRef.current.add(cacheKey);
    console.log("[Prefetch Commentary] Starting for", book, chapter + ":" + verse);
    
    try {
      // Generate commentary text
      const commentary = await generateVerseCommentary(book, chapter, verse, verseText, depth);
      
      if (commentary) {
        // Generate TTS for commentary
        const audioUrl = await generateTTS(commentary, commentaryVoice);
        commentaryCache.current.set(cacheKey, { text: commentary, audioUrl: audioUrl || undefined });
        console.log("[Prefetch Commentary] Cached for", book, chapter + ":" + verse);
      }
    } catch (e) {
      console.error("[Prefetch Commentary] Error:", e);
    } finally {
      prefetchingCommentaryRef.current.delete(cacheKey);
    }
  }, [generateVerseCommentary, generateTTS]);

  // Prefetch chapter commentary while chapter is playing
  const prefetchChapterCommentary = useCallback(async (
    book: string, 
    chapter: number, 
    chapterText: string,
    commentaryVoice: string,
    depth: string = "surface"
  ) => {
    const cacheKey = `chapter-${book}-${chapter}-${commentaryVoice}`;
    
    if (commentaryCache.current.has(cacheKey) || prefetchingCommentaryRef.current.has(cacheKey)) {
      return;
    }
    
    prefetchingCommentaryRef.current.add(cacheKey);
    console.log("[Prefetch Chapter Commentary] Starting for", book, chapter);
    
    try {
      const commentary = await generateCommentary(book, chapter, chapterText, depth);
      
      if (commentary) {
        const audioUrl = await generateTTS(commentary, commentaryVoice);
        commentaryCache.current.set(cacheKey, { text: commentary, audioUrl: audioUrl || undefined });
        console.log("[Prefetch Chapter Commentary] Cached for", book, chapter);
      }
    } catch (e) {
      console.error("[Prefetch Chapter Commentary] Error:", e);
    } finally {
      prefetchingCommentaryRef.current.delete(cacheKey);
    }
  }, [generateCommentary, generateTTS]);

  // Play commentary only (skip verse reading)
  const playCommentaryOnlyChapter = useCallback(async (content: ChapterContent, sequence: ReadingSequenceBlock) => {
    if (!content || !sequence.includeJeevesCommentary) return;
    
    console.log("[Commentary Only] Starting commentary-only playback");
    setIsLoading(true);
    setIsPlaying(true);
    setIsPaused(false);
    // Don't duck music in commentary-only mode - let it play alongside
    if (!sequence.commentaryOnly) {
      notifyTTSStarted();
    }
    
    const commentaryMode = sequence.commentaryMode || "chapter";
    const commentaryVoice = sequence.commentaryVoice || "daniel";
    const commentaryDepth = sequence.commentaryDepth || "surface";
    
    try {
      if (commentaryMode === "chapter") {
        // Play chapter commentary
        const chapterText = content.verses.map(v => `${v.verse}. ${v.text}`).join(" ");
        const commentary = await generateCommentary(content.book, content.chapter, chapterText, commentaryDepth);
        
        setIsLoading(false);
        
        if (commentary && continuePlayingRef.current) {
          playCommentary(commentary, commentaryVoice, () => {
            // Move to next chapter after commentary
            if (continuePlayingRef.current) {
              moveToNextChapter();
            } else {
              setIsPlaying(false);
            }
          });
        } else {
          // No commentary available or stopped, clean up and move to next
          if (continuePlayingRef.current) {
            moveToNextChapter();
          } else {
            setIsPlaying(false);
          }
        }
      } else {
        // Play verse-by-verse commentary
        setIsLoading(false);
        playCommentaryOnlyVerse(0, content, sequence);
      }
    } catch (error) {
      console.error("[Commentary Only] Error generating commentary:", error);
      setIsLoading(false);
      setIsPlaying(false);
      toast.error("Failed to generate commentary");
    }
  }, [generateCommentary, playCommentary, moveToNextChapter]);
  
  // Play commentary for a single verse (commentary-only mode)
  const playCommentaryOnlyVerse = useCallback(async (verseIdx: number, content: ChapterContent, sequence: ReadingSequenceBlock) => {
    if (verseIdx >= content.verses.length) {
      // All verses done, move to next chapter
      if (continuePlayingRef.current) {
        moveToNextChapter();
      } else {
        setIsPlaying(false);
      }
      return;
    }
    
    const verse = content.verses[verseIdx];
    const commentaryVoice = sequence.commentaryVoice || "daniel";
    const commentaryDepth = sequence.commentaryDepth || "surface";
    
    console.log("[Commentary Only] Playing verse", verseIdx + 1, "commentary");
    setCurrentVerseIdx(verseIdx);
    
    try {
      const commentary = await generateVerseCommentary(content.book, content.chapter, verse.verse, verse.text, commentaryDepth);
      
      if (commentary && continuePlayingRef.current) {
        playCommentary(commentary, commentaryVoice, () => {
          // Move to next verse commentary
          if (continuePlayingRef.current) {
            playCommentaryOnlyVerse(verseIdx + 1, content, sequence);
          } else {
            setIsPlaying(false);
          }
        });
      } else {
        // No commentary or stopped, skip to next verse or stop
        if (continuePlayingRef.current) {
          playCommentaryOnlyVerse(verseIdx + 1, content, sequence);
        } else {
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error("[Commentary Only] Error generating verse commentary:", error);
      // Try to continue with next verse
      if (continuePlayingRef.current) {
        playCommentaryOnlyVerse(verseIdx + 1, content, sequence);
      } else {
        setIsPlaying(false);
      }
    }
  }, [generateVerseCommentary, playCommentary, moveToNextChapter]);

  // Play a specific verse by index - using a stable ref to avoid stale closures
  const playVerseAtIndex = useCallback(async (verseIdx: number, content: ChapterContent, voice: string) => {
    console.log("[PlayVerse] Called with:", { verseIdx, versesCount: content?.verses?.length, voice, offlineMode });
    
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
    
    // Check cache first (only for online mode)
    let url = !offlineMode ? ttsCache.current.get(cacheKey) : null;
    
    if (url) {
      console.log("[PlayVerse] Using cached TTS for verse:", verseIdx + 1);
    } else if (!offlineMode && isOnline()) {
      // Generate TTS via API (online mode)
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
    
    // OFFLINE MODE: Use browser speech synthesis
    if (!url && (offlineMode || !isOnline())) {
      console.log("[PlayVerse] Using browser speech synthesis (offline mode)");
      notifyTTSStarted();
      
      speakWithBrowserTTS(verse.text, () => {
        // On speech end, continue to next verse or chapter
        if (continuePlayingRef.current && verseIdx < content.verses.length - 1) {
          setTimeout(() => {
            if (continuePlayingRef.current) {
              playVerseAtIndex(verseIdx + 1, content, voice);
            }
          }, 300);
        } else if (verseIdx >= content.verses.length - 1) {
          notifyTTSStopped();
          handleChapterCompleteWithCommentary(content);
        }
      });
      return;
    }
    
    console.log("[PlayVerse] TTS result:", url ? "URL ready" : "FAILED");

    if (!url) {
      console.error("[PlayVerse] Failed to generate TTS URL - falling back to browser TTS");
      // Fallback to browser TTS even if online mode failed
      speakWithBrowserTTS(verse.text, () => {
        if (continuePlayingRef.current && verseIdx < content.verses.length - 1) {
          setTimeout(() => playVerseAtIndex(verseIdx + 1, content, voice), 300);
        } else if (verseIdx >= content.verses.length - 1) {
          handleChapterCompleteWithCommentary(content);
        }
      });
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
    
    // Find current sequence for commentary settings
    const currentSeq = activeSequences.find((seq, idx) => {
      const itemsBefore = activeSequences.slice(0, idx).reduce((acc, s) => acc + s.items.length, 0);
      return currentItemIdx >= itemsBefore && currentItemIdx < itemsBefore + seq.items.length;
    });
    
    const includeCommentary = currentSeq?.includeJeevesCommentary || false;
    const commentaryMode = currentSeq?.commentaryMode || "chapter";
    const commentaryVoice = currentSeq?.commentaryVoice || "daniel";
    const commentaryDepth = currentSeq?.commentaryDepth || "surface";
    
    // Prefetch commentary while verse plays
    if (includeCommentary) {
      if (commentaryMode === "verse") {
        // Prefetch verse commentary for current verse
        prefetchVerseCommentary(content.book, content.chapter, verse.verse, verse.text, commentaryVoice, commentaryDepth);
      } else if (commentaryMode === "chapter" && verseIdx >= content.verses.length - 3) {
        // Prefetch chapter commentary when near end of chapter
        const chapterText = content.verses.map(v => `${v.verse}. ${v.text}`).join(" ");
        prefetchChapterCommentary(content.book, content.chapter, chapterText, commentaryVoice, commentaryDepth);
      }
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
    
    // Apply playback speed from sequence settings
    const playbackSpeed = currentSeq?.playbackSpeed || 1;
    audio.playbackRate = playbackSpeed;
    console.log("[PlayVerse] Setting playback rate to:", playbackSpeed);
    
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
      
      // Find current sequence to check commentary settings
      const currentSeq = activeSequences.find((seq, idx) => {
        const itemsBefore = activeSequences.slice(0, idx).reduce((acc, s) => acc + s.items.length, 0);
        return currentItemIdx >= itemsBefore && currentItemIdx < itemsBefore + seq.items.length;
      });
      
      const includeCommentary = currentSeq?.includeJeevesCommentary || false;
      const commentaryMode = currentSeq?.commentaryMode || "chapter";
      const commentaryVoice = currentSeq?.commentaryVoice || "daniel";
      const commentaryDepth = currentSeq?.commentaryDepth || "surface";
      
      const nextVerseIdx = verseIdx + 1;
      const isLastVerse = nextVerseIdx >= content.verses.length;
      
      // Handle verse-by-verse commentary mode
      if (includeCommentary && commentaryMode === "verse" && content && continuePlayingRef.current) {
        const currentVerse = content.verses[verseIdx];
        const cacheKey = `verse-${content.book}-${content.chapter}-${currentVerse.verse}-${commentaryVoice}`;
        const cached = commentaryCache.current.get(cacheKey);
        
        const proceedAfterCommentary = () => {
          // Always check continuePlayingRef before proceeding
          if (!continuePlayingRef.current) {
            console.log("[Verse Commentary] Stopped by user, not continuing");
            return;
          }
          
          if (isLastVerse) {
            console.log("[Audio] Chapter complete, moving to next");
            moveToNextChapter();
          } else {
            console.log("[Audio] Playing next verse after commentary:", nextVerseIdx + 1);
            playVerseAtIndex(nextVerseIdx, content, voice);
          }
        };
        
        if (cached?.audioUrl) {
          // Use cached commentary with pre-generated audio - instant playback!
          console.log("[Verse Commentary] Using cached audio for verse", verseIdx + 1);
          setCommentaryText(cached.text);
          setIsPlayingCommentary(true);
          playingCommentaryRef.current = true;
          
          const audio = new Audio(cached.audioUrl);
          audio.volume = isMuted ? 0 : volume / 100;
          // Apply playback speed from sequence
          const playbackSpeed = currentSeq?.playbackSpeed || 1;
          audio.playbackRate = playbackSpeed;
          audioRef.current = audio;
          
          audio.onended = () => {
            console.log("[Verse Commentary] Cached audio ended");
            audioRef.current = null;
            setIsPlayingCommentary(false);
            playingCommentaryRef.current = false;
            setCommentaryText(null);
            proceedAfterCommentary();
          };
          
          audio.onerror = (e) => {
            console.error("[Verse Commentary] Cached audio error:", e);
            audioRef.current = null;
            setIsPlayingCommentary(false);
            playingCommentaryRef.current = false;
            setCommentaryText(null);
            proceedAfterCommentary();
          };
          
          audio.play().catch((e) => {
            console.error("[Verse Commentary] Cached audio play failed:", e);
            setIsPlayingCommentary(false);
            playingCommentaryRef.current = false;
            setCommentaryText(null);
            proceedAfterCommentary();
          });
          return;
        } else if (cached?.text) {
          // Have text but no audio - generate TTS only
          console.log("[Verse Commentary] Using cached text, generating audio");
          playCommentary(cached.text, commentaryVoice, proceedAfterCommentary);
          return;
        }
        
        // Fallback: generate everything with timeout protection
        console.log("[Verse Commentary] No cache, generating for verse", verseIdx + 1);
        setIsLoading(true);
        
        // Add timeout to prevent hanging on commentary generation
        const timeoutMs = 15000; // 15 second timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Commentary generation timeout')), timeoutMs)
        );
        
        Promise.race([
          generateVerseCommentary(content.book, content.chapter, currentVerse.verse, currentVerse.text, commentaryDepth),
          timeoutPromise
        ])
          .then((commentary) => {
            setIsLoading(false);
            if (commentary && continuePlayingRef.current) {
              console.log("[Verse Commentary] Generated successfully, playing");
              playCommentary(commentary as string, commentaryVoice, proceedAfterCommentary);
            } else {
              console.log("[Verse Commentary] No commentary or stopped, proceeding");
              proceedAfterCommentary();
            }
          })
          .catch((error) => {
            console.error("[Verse Commentary] Generation failed:", error);
            setIsLoading(false);
            // Still continue playback even if commentary fails
            toast.error("Commentary unavailable, continuing playback", { duration: 2000 });
            proceedAfterCommentary();
          });
        return;
      }
      
      // Handle chapter-by-chapter commentary mode (default)
      if (!isLastVerse) {
        console.log("[Audio] Playing next verse:", nextVerseIdx + 1);
        if (continuePlayingRef.current) {
          playVerseAtIndex(nextVerseIdx, content, voice);
        }
      } else {
        // Chapter complete - check for chapter commentary before moving on
        console.log("[Audio] Chapter complete, checking for chapter commentary...");
        
        if (includeCommentary && commentaryMode === "chapter" && content && continuePlayingRef.current) {
          const cacheKey = `chapter-${content.book}-${content.chapter}-${commentaryVoice}`;
          const cached = commentaryCache.current.get(cacheKey);
          
          if (cached?.audioUrl) {
            // Use cached chapter commentary with pre-generated audio - instant playback!
            console.log("[Chapter Commentary] Using cached audio");
            setCommentaryText(cached.text);
            setIsPlayingCommentary(true);
            playingCommentaryRef.current = true;
            
            const audio = new Audio(cached.audioUrl);
            audio.volume = isMuted ? 0 : volume / 100;
            // Apply playback speed from sequence
            const playbackSpeed = currentSeq?.playbackSpeed || 1;
            audio.playbackRate = playbackSpeed;
            audioRef.current = audio;
            
            audio.onended = () => {
              audioRef.current = null;
              setIsPlayingCommentary(false);
              playingCommentaryRef.current = false;
              setCommentaryText(null);
              moveToNextChapter();
            };
            
            audio.onerror = () => {
              audioRef.current = null;
              setIsPlayingCommentary(false);
              playingCommentaryRef.current = false;
              setCommentaryText(null);
              moveToNextChapter();
            };
            
            audio.play().catch(() => {
              setIsPlayingCommentary(false);
              playingCommentaryRef.current = false;
              setCommentaryText(null);
              moveToNextChapter();
            });
          } else if (cached?.text) {
            // Have text but no audio
            console.log("[Chapter Commentary] Using cached text, generating audio");
            playCommentary(cached.text, commentaryVoice, moveToNextChapter);
          } else {
            // Fallback: generate everything
            console.log("[Chapter Commentary] No cache, generating", commentaryDepth);
            setIsLoading(true);
            const chapterText = content.verses.map(v => `${v.verse}. ${v.text}`).join(" ");
            
            generateCommentary(content.book, content.chapter, chapterText, commentaryDepth)
              .then(commentary => {
                if (commentary && continuePlayingRef.current) {
                  playCommentary(commentary, commentaryVoice, moveToNextChapter);
                } else {
                  setIsLoading(false);
                  moveToNextChapter();
                }
              })
              .catch(() => {
                setIsLoading(false);
                moveToNextChapter();
              });
          }
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
      audioRef.current = null;
      isGeneratingRef.current = false;
      
      // Retry logic - try up to 2 times, then fall back to browser TTS
      if (retryCountRef.current < 2 && continuePlayingRef.current) {
        retryCountRef.current++;
        console.log(`[Audio] Retrying verse ${verseIdx + 1} (attempt ${retryCountRef.current})`);
        setTimeout(() => {
          if (continuePlayingRef.current) {
            playVerseAtIndex(verseIdx, content, voice);
          }
        }, 500);
      } else if (continuePlayingRef.current) {
        // Fall back to browser TTS after retries exhausted
        console.log("[Audio] Falling back to browser TTS after errors");
        retryCountRef.current = 0;
        speakWithBrowserTTS(verse.text, () => {
          if (continuePlayingRef.current && verseIdx < content.verses.length - 1) {
            setTimeout(() => playVerseAtIndex(verseIdx + 1, content, voice), 300);
          } else if (verseIdx >= content.verses.length - 1) {
            handleChapterCompleteWithCommentary(content);
          }
        });
      } else {
        setIsPlaying(false);
      }
    };

    // Start playback
    try {
      console.log("[Audio] Calling play()...");
      await audio.play();
      console.log("[Audio] play() succeeded for verse:", verseIdx + 1);
      retryCountRef.current = 0; // Reset retry count on success
      setIsPlaying(true);
      setIsPaused(false);
      // Store current position for potential resume
      pausedVerseRef.current = { verseIdx, content, voice };
    } catch (e) {
      console.error("[Audio] play() failed:", e);
      audioRef.current = null;
      isGeneratingRef.current = false;
      
      // Try browser TTS fallback instead of giving up
      if (continuePlayingRef.current) {
        console.log("[Audio] play() failed, falling back to browser TTS");
        speakWithBrowserTTS(verse.text, () => {
          if (continuePlayingRef.current && verseIdx < content.verses.length - 1) {
            setTimeout(() => playVerseAtIndex(verseIdx + 1, content, voice), 300);
          } else if (verseIdx >= content.verses.length - 1) {
            handleChapterCompleteWithCommentary(content);
          }
        });
      } else {
        setIsPlaying(false);
      }
    }
  }, [volume, isMuted, totalItems, generateTTS, prefetchVerse, activeSequences, currentItemIdx, generateCommentary, playCommentary, moveToNextChapter, handleChapterCompleteWithCommentary, prefetchNextChapter, offlineMode, speakWithBrowserTTS]);

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
      
      // Check for commentary-only mode
      if (currentSequence?.commentaryOnly && currentSequence?.includeJeevesCommentary) {
        console.log("[Commentary Only] Skipping verse reading, playing commentary only");
        playCommentaryOnlyChapter(chapterContent, currentSequence);
      } else {
        // Notify music ducking for regular Bible reading
        notifyTTSStarted();
        playVerseAtIndex(0, chapterContent, voice);
      }
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
        
        // Check for commentary-only mode
        if (currentSequence?.commentaryOnly && currentSequence?.includeJeevesCommentary) {
          console.log("[Commentary Only] Auto-starting with commentary only");
          playCommentaryOnlyChapter(chapterContent, currentSequence);
        } else {
          // Notify music ducking for regular Bible reading
          notifyTTSStarted();
          // Don't set isPlaying here - let playVerseAtIndex do it after audio actually starts
          playVerseAtIndex(0, chapterContent, voice);
        }
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
    console.log("handlePlay called - isPaused:", isPaused, "hasAudio:", !!audioRef.current, "speechPaused:", speechSynthesis.paused);
    
    // Resume paused HTML Audio
    if (isPaused && audioRef.current) {
      continuePlayingRef.current = true;
      audioRef.current.play().catch((e) => {
        console.error("[Resume] Audio play failed:", e);
        // If resume fails, restart from current verse
        if (pausedVerseRef.current) {
          playVerseAtIndex(pausedVerseRef.current.verseIdx, pausedVerseRef.current.content, pausedVerseRef.current.voice);
        }
      });
      setIsPaused(false);
      setIsPlaying(true);
      // Don't duck music in commentary-only mode
      if (!currentSequence?.commentaryOnly) {
        notifyTTSStarted();
      }
      return;
    }
    
    // Resume paused browser speech synthesis
    if (isPaused && speechSynthesis.paused) {
      continuePlayingRef.current = true;
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      // Don't duck music in commentary-only mode
      if (!currentSequence?.commentaryOnly) {
        notifyTTSStarted();
      }
      return;
    }
    
    // Start fresh playback (or resume from stored position)
    if (chapterContent) {
      console.log("Starting playback from verse:", currentVerseIdx + 1);
      const voice = currentSequence?.voice || "daniel";
      continuePlayingRef.current = true;
      setIsPlaying(true);
      setIsPaused(false);
      
      // Check for commentary-only mode
      if (currentSequence?.commentaryOnly && currentSequence?.includeJeevesCommentary) {
        console.log("[Commentary Only] Starting with commentary only");
        playCommentaryOnlyChapter(chapterContent, currentSequence);
      } else {
        // Notify music ducking for regular Bible reading
        notifyTTSStarted();
        playVerseAtIndex(currentVerseIdx, chapterContent, voice);
      }
    }
  };

  const handlePause = () => {
    continuePlayingRef.current = false;
    
    // Handle HTML Audio element pause
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
      // Don't stop music ducking in commentary-only mode (music should keep playing)
      if (!currentSequence?.commentaryOnly) {
        notifyTTSStopped();
      }
    }
    
    // Handle browser speech synthesis pause
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      setIsPaused(true);
      // Don't stop music ducking in commentary-only mode (music should keep playing)
      if (!currentSequence?.commentaryOnly) {
        notifyTTSStopped();
      }
    }
    
    // Store current position for resume
    if (chapterContent) {
      const voice = currentSequence?.voice || "daniel";
      pausedVerseRef.current = { verseIdx: currentVerseIdx, content: chapterContent, voice };
    }
  };

  const handleStop = () => {
    continuePlayingRef.current = false;
    pendingVerseRef.current = null;
    pausedVerseRef.current = null;
    
    // Stop HTML Audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Stop browser speech synthesis
    speechSynthesis.cancel();
    browserUtteranceRef.current = null;
    
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentItemIdx(0);
    setCurrentVerseIdx(0);
    setChapterContent(null);
    lastFetchedRef.current = null;
    shouldPlayNextRef.current = false;
    retryCountRef.current = 0;
    // Always stop music ducking when stopping playback
    notifyTTSStopped();
  };

  const handleSkipNext = () => {
    pendingVerseRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    speechSynthesis.cancel();
    browserUtteranceRef.current = null;
    
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
    speechSynthesis.cancel();
    browserUtteranceRef.current = null;
    
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
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
      continuePlayingRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Cancel browser speech synthesis on unmount
      speechSynthesis.cancel();
      browserUtteranceRef.current = null;
      notifyTTSStopped();
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

  // Music URL - use cached version when offline
  // Using peaceful ambient track without bells/chimes
  const [musicUrl, setMusicUrl] = useState("https://cdn.pixabay.com/download/audio/2022/03/15/audio_8e5e3b4b5a.mp3");
  
  useEffect(() => {
    const loadMusicUrl = async () => {
      const defaultUrl = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8e5e3b4b5a.mp3";
      if (offlineMode || !isOnline()) {
        const cached = await getCachedMusicTrack(defaultUrl);
        if (cached) {
          console.log("[Music] Using cached music track");
          setMusicUrl(cached);
        }
      } else {
        setMusicUrl(defaultUrl);
      }
    };
    loadMusicUrl();
  }, [offlineMode]);

  return (
    <>
      {/* Hidden background music audio element */}
      <audio
        ref={setMusicAudioRef}
        src={musicUrl}
        loop
        preload="auto"
        onLoadedData={(e) => {
          const audio = e.currentTarget;
          audio.volume = musicVolume / 100;
        }}
      />
      <Card className="overflow-hidden glass-card border-white/10 bg-card/50 backdrop-blur-xl">
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Now Playing
          </CardTitle>
          <div className="flex items-center gap-2">
            <DownloadSequenceDialog 
              sequences={sequences}
              trigger={
                <Button variant="ghost" size="icon" title="Download Audio">
                  <Download className="h-4 w-4" />
                </Button>
              }
            />
            <Badge variant="outline">
              {currentItemIdx + 1} / {totalItems} chapters
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Commentary Display - shown when Jeeves is commenting */}
        {isPlayingCommentary && commentaryText && (
          <div className="rounded-xl border-2 border-amber-500/30 overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 shadow-lg shadow-amber-500/10">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-b border-amber-500/20 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span className="text-xl">🎩</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-600 dark:text-amber-400">Jeeves Commentary</h3>
                <p className="text-xs text-muted-foreground">Phototheological Insights</p>
              </div>
              <Badge variant="secondary" className="animate-pulse bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30">
                <span className="mr-1">🔊</span> Speaking
              </Badge>
            </div>
            {/* Commentary Content */}
            <ScrollArea className="max-h-[350px]">
              <div className="p-5 prose prose-sm dark:prose-invert max-w-none">
                {formatJeevesResponse(commentaryText)}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Offline Mode Toggle */}
        <OfflineModeToggle
          offlineMode={offlineMode}
          onOfflineModeChange={setOfflineMode}
          className="mb-2"
        />

        {/* Current Chapter Display */}
        <div className="text-center py-4 bg-muted/30 rounded-lg">
          <p className="text-2xl font-bold flex items-center justify-center gap-2">
            {offlineMode && <WifiOff className="h-4 w-4 text-amber-500" />}
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
            title="Previous verse"
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // Rewind 10 seconds in current audio
              if (audioRef.current && audioRef.current.currentTime > 0) {
                audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                console.log('[SequencePlayer] Rewound 10 seconds');
              } else if (window.speechSynthesis?.speaking) {
                // For browser TTS, skip to previous verse instead
                handleSkipPrev();
              }
            }}
            disabled={isLoading || (!isPlaying && !isPaused)}
            title="Rewind 10 seconds"
          >
            <RotateCcw className="h-4 w-4" />
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

        {/* Volume Controls */}
        <div className="space-y-3 px-4">
          {/* TTS Volume (Desktop only) */}
          {!isMobile && (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <span className="text-xs text-muted-foreground w-12">Reader</span>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
            </div>
          )}
          
          {/* Background Music Volume Slider - Always visible on all devices */}
          <div className="flex items-center gap-3 touch-none bg-muted/30 p-3 rounded-lg">
            <ListMusic className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0" />
            <span className="text-sm font-medium text-foreground w-20 flex-shrink-0">Background Music</span>
            <Slider
              value={[musicVolume]}
              min={0}
              max={30}
              step={1}
              onValueChange={(v) => {
                const newVolume = v[0];
                console.log("[SequencePlayer] Music slider changed to:", newVolume);
                setMusicVolume(newVolume);
                setGlobalMusicVolume(newVolume);
                // Direct apply for responsive feedback
                if (musicAudioRef.current) {
                  musicAudioRef.current.volume = newVolume / 100;
                }
              }}
              onValueCommit={(v) => {
                // Ensure final value is committed on interaction release
                const newVolume = v[0];
                console.log("[SequencePlayer] Music slider committed:", newVolume);
                setMusicVolume(newVolume);
                setGlobalMusicVolume(newVolume);
                if (musicAudioRef.current) {
                  musicAudioRef.current.volume = newVolume / 100;
                }
              }}
              className="flex-1 min-w-[100px]"
            />
            <span className="text-sm font-semibold text-foreground w-10 flex-shrink-0">{musicVolume}%</span>
          </div>
          
          {isMobile && (
            <div className="flex items-center justify-center gap-2 py-1 text-xs text-muted-foreground">
              <Smartphone className="h-3 w-3" />
              <span>Use device volume for reader</span>
            </div>
          )}
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
    </>
  );
};
