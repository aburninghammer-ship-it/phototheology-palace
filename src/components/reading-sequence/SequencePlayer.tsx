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
  RefreshCw,
  Mic,
  MessageSquare,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReadingSequenceBlock, SequenceItem } from "@/types/readingSequence";
import { notifyTTSStarted, notifyTTSStopped, useAudioDucking, getDuckedVolume } from "@/hooks/useAudioDucking";
import { useIsMobile } from "@/hooks/use-mobile";
import { getGlobalMusicVolume } from "@/hooks/useMusicVolumeControl";
import { OPENAI_VOICES, VoiceId } from "@/hooks/useTextToSpeech";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
// ElevenLabs removed - using OpenAI TTS only
import { useBrowserSpeech } from "@/hooks/useBrowserSpeech";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useProcessTracking } from "@/contexts/ProcessTrackingContext";

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
  const { trackProcess } = useProcessTracking();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSeqIdx, setCurrentSeqIdx] = useState(0);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [currentVerseIdx, setCurrentVerseIdx] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(() => {
    const stored = getGlobalMusicVolume();
    const initial = typeof stored === "number" && !Number.isNaN(stored as any) ? (stored as number) : 90;
    const clamped = Math.max(0, Math.min(initial, 100));
    console.log('[SequencePlayer] Initial music volume:', clamped);
    return clamped;
  });
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlayingCommentary, setIsPlayingCommentary] = useState(false);
  const [offlineMode, setOfflineMode] = useState(!isOnline());
  const [commentaryText, setCommentaryText] = useState<string | null>(null);
  const [currentVoice, setCurrentVoice] = useState<VoiceId>(() => {
    // Safely get voice from first active sequence without referencing undeclared currentSequence
    const firstSequence = sequences.filter((s) => s.enabled && s.items.length > 0)[0];
    return (firstSequence?.voice as VoiceId) || 'onyx';
  });

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
  const playingVerseRef = useRef<{ book: string; chapter: number; verse: number } | null>(null); // Track currently playing verse to prevent duplicates
  const chapterCache = useRef<Map<string, { verse: number; text: string }[]>>(new Map()); // Cache for prefetched chapters
  const commentaryCache = useRef<Map<string, { text: string; audioUrl?: string }>>(new Map()); // Cache for pre-generated commentary
  const prefetchingCommentaryRef = useRef<Set<string>>(new Set()); // Track commentary being prefetched
  const browserUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null); // For pause/resume with browser TTS
  const retryCountRef = useRef(0); // Track retry attempts for resilience
  const pausedVerseRef = useRef<{ verseIdx: number; content: ChapterContent; voice: string } | null>(null); // Track paused position
  const keepAliveIntervalRef = useRef<number | null>(null); // Keep speech alive on mobile
  
  const isMobile = useIsMobile();
  const activeSequences = sequences.filter((s) => s.enabled && s.items.length > 0);
  const { speak: speakVerse, stop: stopVerse } = useBrowserSpeech();
  
  // Track when audio playback completes
  const audioCompletionCallbackRef = useRef<(() => void) | null>(null);
  
  const { speak: openaiSpeak, stop: openaiStop, isPlaying: openaiPlaying, isLoading: openaiLoading } = useTextToSpeech({
    onEnd: () => {
      console.log("[TTS] Audio playback completed");
      // Call the stored completion callback if exists
      if (audioCompletionCallbackRef.current) {
        const callback = audioCompletionCallbackRef.current;
        audioCompletionCallbackRef.current = null;
        callback();
      }
    }
  });

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
    seq.items.map((item) => ({ ...item, seqIdx, voice: currentVoice }))
  );

  const currentItem = allItems[currentItemIdx] || null;
  const currentSequence = activeSequences[currentSeqIdx];
  const totalItems = allItems.length;
  const isActive = isPlaying && !isPaused;

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
    
    console.log("SequencePlayer mounted, refs reset. Active sequences:", activeSequences.length, "Total items:", totalItems);
  }, []);

  // Subscribe to audio ducking - music lowers when TTS plays
  useAudioDucking((ducked, duckRatio) => {
    if (musicAudioRef.current) {
      const baseVolume = musicVolume / 100;
      const finalVolume = getDuckedVolume(baseVolume);
      musicAudioRef.current.volume = finalVolume;
      console.log('[SequencePlayer] Audio ducking:', ducked ? 'active' : 'inactive', 'volume:', finalVolume);
    }
  });

  // Callback ref for music audio - ensures volume is set when element mounts
  const setMusicAudioRef = useCallback((node: HTMLAudioElement | null) => {
    if (node) {
      musicAudioRef.current = node;
      // Apply current volume with ducking
      const baseVolume = musicVolume / 100;
      const finalVolume = getDuckedVolume(baseVolume);
      node.volume = finalVolume;
      console.log('[SequencePlayer] Music audio ref set, volume:', finalVolume);
    }
  }, [musicVolume]);

  // Update music volume when user changes it - apply ducking
  useEffect(() => {
    if (musicAudioRef.current) {
      const baseVolume = musicVolume / 100;
      const finalVolume = getDuckedVolume(baseVolume);
      musicAudioRef.current.volume = finalVolume;
      console.log('[SequencePlayer] Music volume updated:', finalVolume);
    }
  }, [musicVolume]);

  // Start/pause music based on playback - always play at ducked volume
  useEffect(() => {
    if (!musicAudioRef.current) return;

    if (isPlaying && !isPaused && musicVolume > 0) {
      const baseVolume = musicVolume / 100;
      const finalVolume = getDuckedVolume(baseVolume);
      musicAudioRef.current.volume = finalVolume;
      console.log("[Music] Starting background music, volume:", finalVolume);
      musicAudioRef.current.play().catch((err) => {
        console.error("[Music] Failed to start:", err);
      });
    } else {
      musicAudioRef.current.pause();
    }
  }, [isPlaying, isPaused, musicVolume]);

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

  // Generate verse commentary using Jeeves (with offline cache AND database cache)
  const generateVerseCommentary = useCallback(async (book: string, chapter: number, verse: number, verseText: string, depth: string = "surface") => {
    try {
      // Check offline cache first
      const offlineCached = getCachedVerseCommentary(book, chapter, verse, depth);
      if (offlineCached) {
        console.log("[Verse Commentary] Using offline cached commentary for", book, chapter + ":" + verse);
        return offlineCached;
      }

      // Check database cache (pre-generated)
      const { data: dbCached, error: cacheError } = await supabase
        .from('verse_commentary_cache')
        .select('commentary_text')
        .eq('book', book)
        .eq('chapter', chapter)
        .eq('verse', verse)
        .eq('depth', depth)
        .maybeSingle();

      if (!cacheError && dbCached?.commentary_text) {
        console.log("[Verse Commentary] Using pre-generated database cache for", book, chapter + ":" + verse);
        // Also cache offline for next time
        cacheVerseCommentary(book, chapter, verse, depth, dbCached.commentary_text);
        return dbCached.commentary_text;
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
          
          // Also cache in database for future use (fire and forget)
          (async () => {
            try {
              await supabase
                .from('verse_commentary_cache')
                .insert({
                  book,
                  chapter,
                  verse,
                  commentary_text: commentary,
                  depth,
                });
              console.log("[Verse Commentary] Cached in database");
            } catch (err) {
              console.error("[Verse Commentary] Failed to cache in DB:", err);
            }
          })();
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
        trackProcess({
          process: "Audio Reading Complete",
          step: totalItems,
          totalSteps: totalItems,
          taskType: "audio_reading",
          notes: "Completed reading sequence",
        });
        return prev;
      }
      console.log("[Audio] Moving to chapter:", nextIdx + 1, "of", totalItems);
      setCurrentVerseIdx(0);
      // Clear chapter content to trigger reload
      setChapterContent(null);
      // Reset lastFetchedRef so the new chapter can load
      lastFetchedRef.current = "";
      
      // Track progress
      trackProcess({
        process: "Audio Reading",
        step: nextIdx + 1,
        totalSteps: totalItems,
        taskType: "audio_reading",
        notes: `Reading chapter ${nextIdx + 1} of ${totalItems}`,
      });
      
      return nextIdx;
    });
  }, [totalItems, trackProcess]);


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

  // Generate TTS for text using OpenAI
  const generateTTS = useCallback(async (text: string, voice: string, book?: string, chapter?: number, verse?: number): Promise<string | null> => {
    // If offline mode, use browser speech synthesis
    if (offlineMode || !isOnline()) {
      console.log("[TTS] Using offline browser speech synthesis");
      return null; // Signal to use speech synthesis
    }
    
    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { 
          text, 
          voice: voice as VoiceId,
          book,
          chapter,
          verse,
          useCache: true
        },
      });

      if (error) throw error;

      // Check if we got a cached URL or need to decode base64
      if (data?.audioUrl) {
        // Cached audio - use URL directly
        console.log(`[TTS] Using ${data.cached ? 'cached' : 'newly cached'} audio`);
        return data.audioUrl;
      } else if (data?.audioContent) {
        // Base64 audio - create blob URL
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
  const speakWithBrowserTTS = useCallback((text: string, playbackSpeed: number, onEnd: () => void): void => {
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

    console.log(`[SequencePlayer] Split into ${chunks.length} chunks, playback speed:`, playbackSpeed);

    let currentChunkIndex = 0;

    const speakChunk = () => {
      if (currentChunkIndex >= chunks.length) {
        browserUtteranceRef.current = null;
        onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[currentChunkIndex]);
      utterance.rate = playbackSpeed;
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

  // Play commentary audio with OpenAI TTS only - properly waits for completion
  const playCommentary = useCallback(async (
    text: string, 
    book: string,
    chapter: number,
    verse: number,
    onComplete: () => void
  ) => {
    // DOUBLE CHECK: Exit immediately if commentary is playing
    if (playingCommentaryRef.current) {
      console.log(`[Commentary] ⚠️ REJECTED: Already playing, calling onComplete immediately`);
      setTimeout(onComplete, 100);
      return;
    }

    // Set flag IMMEDIATELY to block concurrent attempts
    playingCommentaryRef.current = true;
    console.log(`[Commentary] ✓ Starting NEW commentary for ${book} ${chapter}:${verse}`);
    setIsPlayingCommentary(true);
    setCommentaryText(text);
    setIsLoading(true);

    try {
      setIsLoading(false);
      
      // Store the completion callback - will be called by useTextToSpeech's onEnd
      audioCompletionCallbackRef.current = () => {
        console.log("[Commentary] ✓ Playback completed, calling onComplete");
        // Only complete if we're still the active commentary
        if (playingCommentaryRef.current) {
          setIsPlayingCommentary(false);
          playingCommentaryRef.current = false;
          setCommentaryText(null);
          audioCompletionCallbackRef.current = null;
          // Small delay before next action
          setTimeout(onComplete, 200);
        } else {
          console.log("[Commentary] ⚠️ Already cleared, skipping onComplete");
        }
      };
      
      // Start playback - the completion will be handled by the onEnd callback
      console.log("[Commentary] Calling openaiSpeak...");
      await openaiSpeak(text, {
        voice: 'shimmer', // Use shimmer voice for commentary
        book,
        chapter,
        verse,
        useCache: true
      });
      
      console.log("[Commentary] openaiSpeak returned, audio should be playing...");
    } catch (e) {
      console.error("[Commentary] ❌ OpenAI TTS error:", e);
      setIsLoading(false);
      setIsPlayingCommentary(false);
      playingCommentaryRef.current = false;
      setCommentaryText(null);
      audioCompletionCallbackRef.current = null;
      toast.error("Commentary unavailable, continuing", { duration: 2000 });
      setTimeout(onComplete, 200);
    }
  }, [openaiSpeak, openaiStop]);

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
      // DOUBLE GUARD: Exit early if commentary is active
      if (playingCommentaryRef.current) {
        console.log("[ChapterComplete] ⚠️ BLOCKED - Commentary active, moving to next chapter");
        setTimeout(moveToNextChapter, 100);
        return;
      }
      
      // Set flag immediately
      playingCommentaryRef.current = true;
      console.log("[ChapterComplete] 🔒 Flag set, starting chapter commentary");
      
      // Always generate fresh commentary - no cached audio
      console.log("[ChapterComplete] Generating chapter commentary");
      // Reset flag temporarily so playCommentary can control it
      playingCommentaryRef.current = false;
      setIsLoading(true);
      const chapterText = content.verses.map(v => `${v.verse}. ${v.text}`).join(" ");
      
      generateCommentary(content.book, content.chapter, chapterText, commentaryDepth)
        .then(commentary => {
          if (commentary && continuePlayingRef.current) {
            playCommentary(commentary, content.book, content.chapter, 0, moveToNextChapter);
          } else {
            setIsLoading(false);
            moveToNextChapter();
          }
        })
        .catch(() => {
          setIsLoading(false);
          moveToNextChapter();
        });
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
    if (!content || !sequence.includeJeevesCommentary) {
      console.log("[Commentary Only] Skipping - no content or commentary disabled");
      moveToNextChapter();
      return;
    }

    // Prevent starting if already playing commentary
    if (playingCommentaryRef.current) {
      console.log("[Commentary Only] Already playing commentary, skipping duplicate call");
      return;
    }
    
    console.log(`[Commentary Only] ===== STARTING CHAPTER ${content.book} ${content.chapter} =====`);
    console.log(`[Commentary Only] Content has ${content.verses.length} verses`);
    console.log(`[Commentary Only] Sequence settings:`, {
      commentaryMode: sequence.commentaryMode,
      commentaryDepth: sequence.commentaryDepth,
      includeJeevesCommentary: sequence.includeJeevesCommentary
    });
    
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
        console.log("[Commentary Only] Generating chapter commentary with depth:", commentaryDepth);
        const chapterText = content.verses.map(v => `${v.verse}. ${v.text}`).join(" ");
        console.log("[Commentary Only] Chapter text length:", chapterText.length);
        
        const commentary = await generateCommentary(content.book, content.chapter, chapterText, commentaryDepth);
        
        setIsLoading(false);
        
        if (!commentary) {
          console.error(`[Commentary Only] ❌ NO COMMENTARY RETURNED for ${content.book} ${content.chapter}`);
          toast.error(`No commentary available for ${content.book} ${content.chapter}`, { duration: 3000 });
          // Move to next chapter after showing error
          if (continuePlayingRef.current) {
            console.log("[Commentary Only] Moving to next chapter after empty commentary");
            moveToNextChapter();
          } else {
            setIsPlaying(false);
          }
          return;
        }
        
        console.log(`[Commentary Only] ✓ Got commentary (${commentary.length} chars), now playing audio...`);
        
        if (continuePlayingRef.current) {
          playCommentary(commentary, content.book, content.chapter, 0, () => {
            // Move to next chapter after commentary
            console.log(`[Commentary Only] ===== FINISHED ${content.book} ${content.chapter} ===== Moving to next`);
            if (continuePlayingRef.current) {
              moveToNextChapter();
            } else {
              setIsPlaying(false);
            }
          });
        } else {
          setIsPlaying(false);
        }
      } else {
        // Play verse-by-verse commentary
        console.log("[Commentary Only] Starting verse-by-verse mode");
        setIsLoading(false);
        playCommentaryOnlyVerse(0, content, sequence);
      }
    } catch (error) {
      console.error("[Commentary Only] ⚠️ ERROR generating commentary:", error);
      console.error("[Commentary Only] Error details:", {
        message: error instanceof Error ? error.message : String(error),
        book: content.book,
        chapter: content.chapter
      });
      setIsLoading(false);
      toast.error(`Commentary failed for ${content.book} ${content.chapter}: ${error instanceof Error ? error.message : 'Unknown error'}`, { duration: 4000 });
      // Try to continue with next chapter
      if (continuePlayingRef.current) {
        console.log("[Commentary Only] Moving to next chapter after error");
        moveToNextChapter();
      } else {
        setIsPlaying(false);
      }
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
        playCommentary(commentary, content.book, content.chapter, verse.verse, () => {
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
    
    // CRITICAL: Prevent duplicate verse playback
    const verseKey = `${content.book}-${content.chapter}-${verse.verse}`;
    const currentKey = playingVerseRef.current 
      ? `${playingVerseRef.current.book}-${playingVerseRef.current.chapter}-${playingVerseRef.current.verse}`
      : null;
    
    if (currentKey === verseKey && audioRef.current && !audioRef.current.paused) {
      console.log("[PlayVerse] ⚠️ BLOCKED - Already playing this exact verse:", verseKey);
      return;
    }
    
    // Set the currently playing verse
    playingVerseRef.current = { book: content.book, chapter: content.chapter, verse: verse.verse };
    console.log("[PlayVerse] 🎯 Starting verse:", verseIdx + 1, "of", content.verses.length, "| Key:", verseKey);
    
    const cacheKey = `${content.book}-${content.chapter}-${verseIdx}-${voice}`;
    
    setCurrentVerseIdx(verseIdx);
    
    // Find current sequence for settings (needed early for offline mode)
    const currentSeq = activeSequences.find((seq, idx) => {
      const itemsBefore = activeSequences.slice(0, idx).reduce((acc, s) => acc + s.items.length, 0);
      return currentItemIdx >= itemsBefore && currentItemIdx < itemsBefore + seq.items.length;
    });
    const playbackSpeed = currentSeq?.playbackSpeed || 1;
    
    // Check cache first (only for online mode)
    let url = !offlineMode ? ttsCache.current.get(cacheKey) : null;
    
    if (url) {
      console.log("[PlayVerse] Using cached TTS for verse:", verseIdx + 1);
    } else if (!offlineMode && isOnline()) {
      // Generate TTS via API (online mode)
      isGeneratingRef.current = true;
      console.log("[PlayVerse] Generating TTS for verse:", verseIdx + 1, "text:", verse.text.substring(0, 50));
      setIsLoading(true);
      
      url = await generateTTS(verse.text, voice, content.book, content.chapter, verse.verse);
      
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
      
      speakWithBrowserTTS(verse.text, playbackSpeed, () => {
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
      speakWithBrowserTTS(verse.text, playbackSpeed, () => {
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
    
    // Use already-found currentSeq for commentary settings
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
    
    // Apply playback speed from sequence settings (already found above)
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
    
    audio.onended = async () => {
      console.log("[Audio] <<< Ended verse:", verseIdx + 1, "| continue:", continuePlayingRef.current, "| isPlaying:", isPlaying, "| isPaused:", isPaused);
      // Clear the currently playing verse
      playingVerseRef.current = null;
      // Don't call notifyTTSStopped here - keep music ducked between verses
      
      // Clear the audio ref immediately
      audioRef.current = null;
      
      // Add small delay to ensure verse audio is fully complete before starting commentary
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!continuePlayingRef.current) {
        console.error("[Audio] ❌ UNEXPECTED STOP - continuePlayingRef is false but audio ended naturally!");
        console.error("[Audio] State:", { isPlaying, isPaused, currentItemIdx, verseIdx, totalItems });
        // Try to recover - if we were playing and not paused, continue anyway
        if (isPlaying && !isPaused) {
          console.log("[Audio] 🔄 RECOVERING - forcing continue because isPlaying=true and isPaused=false");
          continuePlayingRef.current = true;
        } else {
          console.log("[Audio] Not continuing - confirmed stop");
          return;
        }
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
        // DOUBLE GUARD: Exit early if commentary is already active
        if (playingCommentaryRef.current) {
          console.log("[Verse Commentary] ⚠️ BLOCKED - Commentary active, moving to next");
          // Skip commentary and proceed
          if (!isLastVerse) {
            setTimeout(() => playVerseAtIndex(nextVerseIdx, content, voice), 100);
          } else {
            setTimeout(moveToNextChapter, 100);
          }
          return;
        }
        
        // Set flag immediately to prevent race conditions
        playingCommentaryRef.current = true;
        console.log("[Verse Commentary] 🔒 Flag set, starting commentary generation");
        
        const currentVerse = content.verses[verseIdx];
        
        const proceedAfterCommentary = () => {
          // Always check continuePlayingRef before proceeding
          if (!continuePlayingRef.current) {
            console.log("[Verse Commentary] ❌ Stopped - continuePlayingRef is false | isPlaying:", isPlaying, "| isPaused:", isPaused);
            // Try to recover if we're still in playing state
            if (isPlaying && !isPaused) {
              console.log("[Verse Commentary] 🔄 RECOVERING - forcing continue");
              continuePlayingRef.current = true;
            } else {
              return;
            }
          }
          
          if (isLastVerse) {
            console.log("[Audio] Chapter complete, moving to next");
            moveToNextChapter();
          } else {
            console.log("[Audio] Playing next verse after commentary:", nextVerseIdx + 1);
            playVerseAtIndex(nextVerseIdx, content, voice);
          }
        };
        
        // Always generate fresh commentary - no cached audio
        console.log("[Verse Commentary] Generating for verse", verseIdx + 1);
        // Reset flag temporarily so playCommentary can control it
        playingCommentaryRef.current = false;
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
              playCommentary(commentary as string, content.book, content.chapter, currentVerse.verse, proceedAfterCommentary);
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
          // CRITICAL: Guard against multiple commentaries playing
          if (playingCommentaryRef.current) {
            console.log("[Chapter Commentary] ⚠️ BLOCKED - Commentary already playing, skipping");
            moveToNextChapter();
            return;
          }
          
          const cacheKey = `chapter-${content.book}-${content.chapter}-${commentaryVoice}`;
          const cached = commentaryCache.current.get(cacheKey);
          
          if (cached?.audioUrl) {
            // Use cached chapter commentary with pre-generated audio - instant playback!
            console.log("[Chapter Commentary] Using cached audio");
            
            // Set the flag immediately to prevent other commentaries from starting
            playingCommentaryRef.current = true;
            setCommentaryText(cached.text);
            setIsPlayingCommentary(true);
            
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
              // Small delay before next chapter
              setTimeout(moveToNextChapter, 200);
            };
            
            audio.onerror = () => {
              audioRef.current = null;
              setIsPlayingCommentary(false);
              playingCommentaryRef.current = false;
              setCommentaryText(null);
              setTimeout(moveToNextChapter, 200);
            };
            
            audio.play().catch(() => {
              setIsPlayingCommentary(false);
              playingCommentaryRef.current = false;
              setCommentaryText(null);
              setTimeout(moveToNextChapter, 200);
            });
          } else if (cached?.text) {
            // Have text but no audio
            console.log("[Chapter Commentary] Using cached text, generating audio");
            playCommentary(cached.text, content.book, content.chapter, 0, moveToNextChapter);
          } else {
            // Fallback: generate everything
            console.log("[Chapter Commentary] No cache, generating", commentaryDepth);
            setIsLoading(true);
            const chapterText = content.verses.map(v => `${v.verse}. ${v.text}`).join(" ");
            
            generateCommentary(content.book, content.chapter, chapterText, commentaryDepth)
              .then(commentary => {
                if (commentary && continuePlayingRef.current) {
                  playCommentary(commentary, content.book, content.chapter, 0, moveToNextChapter);
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
        speakWithBrowserTTS(verse.text, playbackSpeed, () => {
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
        speakWithBrowserTTS(verse.text, playbackSpeed, () => {
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

  // Auto-play when new chapter content loads (initial chapter + transitions)
  useEffect(() => {
    const canAutoPlayFirst =
      autoPlay &&
      !hasStarted &&
      !!chapterContent &&
      !!chapterContent.verses &&
      chapterContent.verses.length > 0;

    if (
      (shouldPlayNextRef.current || canAutoPlayFirst) &&
      chapterContent &&
      !isLoading &&
      !isGeneratingRef.current &&
      !audioRef.current
    ) {
      if (canAutoPlayFirst) {
        console.log("[AutoStart] Starting playback with", chapterContent.verses.length, "verses");
        setHasStarted(true);
      } else {
        console.log("Auto-playing next chapter after transition");
      }

      // Always clear the flag once we act on it
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
  }, [autoPlay, hasStarted, chapterContent, isLoading, currentSequence, playVerseAtIndex, playCommentaryOnlyChapter]);

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
    console.log("[Player] ⏸️ PAUSE CALLED - setting continuePlayingRef to false");
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
    console.log("[Player] ⏹️ STOP CALLED - setting continuePlayingRef to false");
    continuePlayingRef.current = false;
    playingVerseRef.current = null;
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

  const handleMusicVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setMusicVolume(newVolume);
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = newVolume / 100;
    }
  };

  // Handle voice change - clear cache and regenerate current audio
  // Handle on-demand verse commentary request
  const handleVerseCommentaryRequest = useCallback(async (verseNum: number, verseText: string) => {
    if (!chapterContent || !currentItem) return;
    
    // Pause current playback
    const wasPlaying = isPlaying && !isPaused;
    if (wasPlaying) {
      handlePause();
    }
    
    console.log(`[On-Demand Commentary] Requesting for verse ${verseNum}`);
    
    const commentaryDepth = currentSequence?.commentaryDepth || "surface";
    
    setIsLoading(true);
    try {
      const commentary = await generateVerseCommentary(
        currentItem.book,
        currentItem.chapter,
        verseNum,
        verseText,
        commentaryDepth
      );
      
      if (commentary) {
        // Play the commentary
        await playCommentary(commentary, currentItem.book, currentItem.chapter, verseNum, () => {
          setIsLoading(false);
          // Resume if was playing
          if (wasPlaying) {
            handlePlay();
          }
        });
      } else {
        setIsLoading(false);
        toast.error("Could not generate commentary", { duration: 2000 });
        if (wasPlaying) {
          handlePlay();
        }
      }
    } catch (error) {
      console.error("[On-Demand Commentary] Error:", error);
      setIsLoading(false);
      toast.error("Commentary failed", { duration: 2000 });
      if (wasPlaying) {
        handlePlay();
      }
    }
  }, [chapterContent, currentItem, isPlaying, isPaused, currentSequence, generateVerseCommentary, playCommentary, handlePause, handlePlay]);

  const handleVoiceChange = useCallback((newVoice: VoiceId) => {
    console.log("[Voice] Changing voice from", currentVoice, "to", newVoice);
    setCurrentVoice(newVoice);
    
    // Clear TTS cache to force regeneration with new voice
    ttsCache.current.clear();
    prefetchingRef.current.clear();
    commentaryCache.current.clear();
    prefetchingCommentaryRef.current.clear();
    
    // If currently playing, regenerate current verse/commentary
    if (isPlaying && !isPaused && chapterContent && currentItem) {
      const wasPlayingCommentary = isPlayingCommentary;
      
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (browserUtteranceRef.current) {
        speechSynthesis.cancel();
        browserUtteranceRef.current = null;
      }
      
      // Regenerate and continue from current position
      if (wasPlayingCommentary && commentaryText && chapterContent) {
        console.log("[Voice] Re-generating commentary with new voice");
        playCommentary(commentaryText, chapterContent.book, chapterContent.chapter, currentVerseIdx, () => {
          if (continuePlayingRef.current) {
            playVerseAtIndex(currentVerseIdx + 1, chapterContent, newVoice);
          }
        });
      } else {
        console.log("[Voice] Re-generating verse with new voice");
        playVerseAtIndex(currentVerseIdx, chapterContent, newVoice);
      }
    }
    
    toast.success(`Voice changed to ${OPENAI_VOICES.find(v => v.id === newVoice)?.name}`);
  }, [currentVoice, isPlaying, isPaused, chapterContent, currentItem, isPlayingCommentary, commentaryText, currentVerseIdx]);

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
            {onClose && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onClose}
                title="Start over with new selections"
                className="glass-card-subtle"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                <span className="hidden sm:inline">Start Over</span>
              </Button>
            )}
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
                <div
                  key={verse.verse}
                  id={`verse-${verse.verse}`}
                  className={`group text-base leading-relaxed transition-all duration-300 rounded-md p-2 ${
                    idx === currentVerseIdx
                      ? "bg-primary/20 border-l-4 border-primary scale-[1.01]"
                      : "opacity-70 hover:opacity-100 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex-1">
                      <span className={`font-bold mr-2 ${idx === currentVerseIdx ? "text-primary" : "text-muted-foreground"}`}>
                        {verse.verse}
                      </span>
                      {verse.text}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-8 w-8 p-0"
                      onClick={() => handleVerseCommentaryRequest(verse.verse, verse.text)}
                      title="Get commentary for this verse"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress */}
        <Progress value={progressPercent} className="h-2" />

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 relative z-10">
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
            size="icon"
            aria-label={isActive ? "Pause" : "Play"}
            className="h-12 w-12 rounded-full gradient-palace shadow-lg relative z-50 pointer-events-auto flex items-center justify-center"
            onClick={isActive ? handlePause : handlePlay}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : isActive ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 ml-0.5 text-white" />
            )}
          </Button>

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

        {/* Voice Selector */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-3">
            <Mic className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground w-12">Voice</span>
            <Select value={currentVoice} onValueChange={handleVoiceChange}>
              <SelectTrigger className="flex-1 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
        </div>

        {/* Commentary Voice Info */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-amber-600 dark:text-amber-400">🎩</span>
            <span className="text-xs text-muted-foreground">Commentary: OpenAI (Shimmer voice)</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="space-y-3 px-4">
          {/* TTS Volume (Desktop only - mobile can't control TTS volume) */}
          {!isMobile && (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <span className="text-xs text-muted-foreground w-16">Reader</span>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8">{isMuted ? 0 : volume}%</span>
            </div>
          )}

          {/* Music volume slider - ALWAYS SHOWN on all devices */}
          <div className="flex items-center gap-3">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground w-16">Music</span>
            <Slider
              value={[musicVolume]}
              max={100}
              step={1}
              onValueChange={handleMusicVolumeChange}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8">{musicVolume}%</span>
          </div>
          
          {isMobile && (
            <div className="flex flex-col gap-1 py-1 text-xs text-muted-foreground items-center">
              <div className="flex items-center gap-2">
                <Smartphone className="h-3 w-3" />
                <span>Use device volume for reader</span>
              </div>
              <div className="flex items-center gap-2 w-full max-w-xs">
                <span className="w-12 text-right">Music</span>
                <Slider
                  value={[musicVolume]}
                  max={100}
                  step={1}
                  onValueChange={handleMusicVolumeChange}
                  className="flex-1"
                />
              </div>
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
