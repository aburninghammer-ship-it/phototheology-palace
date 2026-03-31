/**
 * Audio Bible Page
 * Listen to Bible chapters with optional Phototheology Commentary
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Navigation } from "@/components/Navigation";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useAudioBible } from "@/hooks/useAudioBible";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { READING_SERIES, getThemes, CommentaryTier, fetchChapterVerses } from "@/services/audioBibleService";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  BookOpen,
  MessageSquare,
  Loader2,
  Headphones,
  Sparkles,
  ListMusic,
  Plus,
  X,
  BookText,
  Layers,
  Crown,
  BookHeart,
  Film,
  Download,
  Zap,
  RefreshCw,
  Heart,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useFreeTier } from "@/hooks/useFreeTier";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { toast } from "sonner";
import { ExportEpicAudioDialog } from "@/components/audio/ExportEpicAudioDialog";
import { ImmersiveAudioPlayer } from "@/components/audio/ImmersiveAudioPlayer";
import { useImmersiveMode, type ImmersiveTrack } from "@/hooks/useImmersiveMode";
import { Maximize2, Music, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { requestMusicForCommentary, getAutoMusicEnabled, setAutoMusicEnabled, subscribeToAutoMusicToggle } from "@/hooks/useCommentaryMusicSync";

interface Theme {
  id: string;
  name: string;
  display_name: string;
  description: string;
  icon: string;
  category: string;
  verse_count: number;
}

type EpicModeType = "epic" | "urban" | "ancient" | "preacher" | "scholar" | "counselor" | "kids" | "mirror";

const KIDS_VOICE_ID = "elevenlabs:pFZP5JQG7iQjIQuC4Bku";

interface ChapterSelection {
  book: string;
  chapter: number;
  mode?: EpicModeType;
  storyId?: string;
  storyTitle?: string;
}

type SelectionMode = "chapter" | "book" | "custom" | "stories";

import { CURATED_STORIES, STORY_CATEGORIES, type BiblicalStory } from '@/data/curatedStories';
type CommentaryMode = "verse" | "chapter" | "passage";

export default function AudioBible() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { preferences } = useUserPreferences();
  const freeTier = useFreeTier();
  const { isAdmin } = useIsAdmin();

  // Epic mode state
  const [isEpicPlaying, setIsEpicPlaying] = useState(false);
  const [isEpicPaused, setIsEpicPaused] = useState(false);
  const [isEpicLoading, setIsEpicLoading] = useState(false);
  const [epicAudioRef] = useState<{ current: HTMLAudioElement | null }>({ current: null });
  const [epicAudioUrl, setEpicAudioUrl] = useState("");
  const [showEpicExport, setShowEpicExport] = useState(false);
  const [epicNowPlayingBook, setEpicNowPlayingBook] = useState("");
  const [epicNowPlayingChapter, setEpicNowPlayingChapter] = useState(0);
  const epicQueueRef = useRef<ChapterSelection[]>([]);
  const epicQueueIndexRef = useRef(0);
  const playEpicRef = useRef<(book: string, chapter: number, mode?: EpicModeType) => Promise<void>>();
  const playEpicStoryRef = useRef<(storyTitle: string, storyId: string, mode?: EpicModeType) => Promise<void>>();
  const [commentaryMusicEnabled, setCommentaryMusicEnabled] = useState(getAutoMusicEnabled);

  // Sync toggle state with global setting
  useEffect(() => {
    const unsub = subscribeToAutoMusicToggle((enabled) => setCommentaryMusicEnabled(enabled));
    return unsub;
  }, []);
  // Commentary mode within Epic suite (urban, ancient, preacher, epic, scholar)
  const [epicMode, setEpicMode] = useState<EpicModeType>("epic");

  const COMMENTARY_MODES = [
    { id: "urban" as const, label: "Modern", subtitle: "Human condition", icon: Zap, color: "blue" },
    { id: "ancient" as const, label: "Ancient", subtitle: "Covenant-historical", icon: BookText, color: "amber" },
    { id: "preacher" as const, label: "Preacher", subtitle: "Redemptive-proclamation", icon: Crown, color: "purple" },
    { id: "epic" as const, label: "Epic", subtitle: "Cosmic conflict", icon: Film, color: "orange" },
    { id: "scholar" as const, label: "Scholar", subtitle: "Canonical-theological", icon: Layers, color: "emerald" },
    { id: "counselor" as const, label: "Counselor", subtitle: "Soul care", icon: Heart, color: "rose" },
    { id: "kids" as const, label: "Kids", subtitle: "Ages 8-12", icon: Sparkles, color: "cyan" },
    { id: "mirror" as const, label: "3D Audio", subtitle: "Personal application", icon: Eye, color: "indigo" },
  ] as const;

  const activeModeMeta = COMMENTARY_MODES.find(m => m.id === epicMode) || COMMENTARY_MODES[3];

  // Audio Bible hook
  const {
    isPlaying,
    isPaused,
    isLoading,
    isIdle,
    currentBook,
    currentChapter,
    currentVerse,
    currentVerseText,
    currentVerseIndex,
    totalVerses,
    isPlayingCommentary,
    currentCommentary,
    voice,
    setVoice,
    commentaryVoice,
    setCommentaryVoice,
    speed,
    setSpeed,
    volume,
    setVolume,
    commentaryTier,
    setCommentaryTier,
    includeCommentary,
    setIncludeCommentary,
    commentaryOnly,
    setCommentaryOnly,
    commentaryMode,
    setCommentaryMode,
    commentarySource,
    setCommentarySource,
    unlock,
    playChapter,
    queueChapters,
    pause,
    resume,
    stop,
    skipNext,
    skipPrevious,
    voices,
  } = useAudioBible({
    onVerseChange: (book, chapter, verse) => {
      console.log(`[AudioBible] Now playing ${book} ${chapter}:${verse}`);
    },
    onChapterComplete: (book, chapter) => {
      console.log(`[AudioBible] Completed ${book} ${chapter}`);
    },
  });

  // Selection state
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("chapter");
  // commentaryMode now comes from useAudioBible hook
  const [customChapters, setCustomChapters] = useState<ChapterSelection[]>([]);
  const [customBook, setCustomBook] = useState("Genesis");
  const [customChapter, setCustomChapter] = useState(1);
  const [themes, setThemes] = useState<Theme[]>([]);
  
  // Starting verse for chapter playback
  const [startVerse, setStartVerse] = useState(1);
  const [endVerse, setEndVerse] = useState<number | null>(null);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [storyCategory, setStoryCategory] = useState("all");
  const immersive = useImmersiveMode();

  // Custom playlist add mode state
  const [customAddMode, setCustomAddMode] = useState<"single" | "chapter-range" | "book-range">("single");
  const [rangeStartChapter, setRangeStartChapter] = useState(1);
  const [rangeEndChapter, setRangeEndChapter] = useState(5);
  const [rangeStartBook, setRangeStartBook] = useState("Genesis");
  const [rangeEndBook, setRangeEndBook] = useState("Genesis");

  // Load themes on mount
  useEffect(() => {
    loadThemes();
  }, []);

  // Handle URL params
  useEffect(() => {
    const book = searchParams.get("book");
    const chapter = searchParams.get("chapter");
    const verse = searchParams.get("verse");
    if (book) setSelectedBook(book);
    if (chapter) setSelectedChapter(parseInt(chapter, 10));
    if (verse) setStartVerse(parseInt(verse, 10));
  }, [searchParams]);

  // Reset start/end verse when book or chapter changes
  useEffect(() => {
    setStartVerse(1);
    setEndVerse(null);
  }, [selectedBook, selectedChapter]);

  const loadThemes = async () => {
    const data = await getThemes();
    setThemes(data);
  };

  // Get chapter count for selected book
  const getChapterCount = (bookName: string = selectedBook) => {
    const book = BIBLE_BOOK_METADATA.find((b) => b.name === bookName);
    return book?.chapters || 1;
  };

  // Handle play for single chapter (starting from selected verse, with optional end verse)
  const handlePlayChapter = async () => {
    await unlock();
    const allVerses = await fetchChapterVerses(selectedBook, selectedChapter);
    if (allVerses.length > 0) {
      let verses = allVerses;
      if (startVerse > 1) {
        verses = verses.filter(v => v.verse >= startVerse);
      }
      if (endVerse !== null) {
        verses = verses.filter(v => v.verse <= endVerse);
      }
      if (verses.length > 0) {
        playChapter(selectedBook, selectedChapter, verses);
      }
    }
  };

  // Handle play for whole book
  const handlePlayBook = async () => {
    await unlock();
    const totalChapters = getChapterCount(selectedBook);
    // Start with chapter 1
    const verses = await fetchChapterVerses(selectedBook, 1);
    if (verses.length > 0) {
      playChapter(selectedBook, 1, verses);
      // Queue remaining chapters - fetch verses lazily via onChapterComplete
      if (totalChapters > 1) {
        const remaining: Array<{ book: string; chapter: number; verses: Array<{ verse: number; text: string }> }> = [];
        for (let ch = 2; ch <= totalChapters; ch++) {
          // Use empty verses as placeholder — they'll be fetched when the item starts
          remaining.push({ book: selectedBook, chapter: ch, verses: [] });
        }
        queueChapters(remaining);
      }
    }
  };

  // Handle play for custom selection
  const handlePlayCustom = async () => {
    if (customChapters.length === 0) return;
    await unlock();
    const first = customChapters[0];
    const verses = await fetchChapterVerses(first.book, first.chapter);
    if (verses.length > 0) {
      playChapter(first.book, first.chapter, verses);
      // Queue remaining chapters with empty verses (fetched on demand)
      if (customChapters.length > 1) {
        const remaining = customChapters.slice(1).map(c => ({
          book: c.book,
          chapter: c.chapter,
          verses: [] as Array<{ verse: number; text: string }>,
        }));
        queueChapters(remaining);
      }
    }
  };

  // Add chapter to custom list (with current mode) — duplicates allowed for different modes
  const addCustomChapter = () => {
    const mode: EpicModeType | undefined = (commentarySource === "epic" || commentarySource === "counselor") ? epicMode : undefined;
    setCustomChapters([...customChapters, { book: customBook, chapter: customChapter, mode }]);
    // Auto-increment to next chapter for quick sequential adding
    const maxCh = getChapterCount(customBook);
    if (customChapter < maxCh) {
      setCustomChapter(customChapter + 1);
    }
  };

  // Add a story to the custom playlist
  const addStoryToPlaylist = (storyId: string) => {
    const story = CURATED_STORIES.find(s => s.id === storyId);
    if (!story) return;
    const mode: EpicModeType | undefined = (commentarySource === "epic" || commentarySource === "counselor") ? epicMode : undefined;
    // Allow up to 4 stories in a playlist
    const storyCount = customChapters.filter(c => c.storyId).length;
    if (storyCount >= 4) {
      toast.error("Maximum 4 stories per playlist");
      return;
    }
    const exists = customChapters.some(
      (c) => c.storyId === storyId && c.mode === mode
    );
    if (!exists) {
      setCustomChapters([...customChapters, {
        book: story.title,
        chapter: -1,
        mode,
        storyId: story.id,
        storyTitle: story.title,
      }]);
      toast.success(`Added "${story.title}" to playlist`);
    } else {
      toast.info(`"${story.title}" (${mode || 'epic'}) is already in playlist`);
    }
  };

  // Add chapter range to custom list (with current mode)
  const addChapterRange = () => {
    const newChapters: ChapterSelection[] = [];
    const mode: EpicModeType | undefined = (commentarySource === "epic" || commentarySource === "counselor") ? epicMode : undefined;
    for (let ch = rangeStartChapter; ch <= rangeEndChapter; ch++) {
      const exists = customChapters.some(
        (c) => c.book === customBook && c.chapter === ch && c.mode === mode
      );
      if (!exists) {
        newChapters.push({ book: customBook, chapter: ch, mode });
      }
    }
    setCustomChapters([...customChapters, ...newChapters]);
  };

  // Add book range to custom list (with current mode)
  const addBookRange = () => {
    const startIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeStartBook);
    const endIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeEndBook);
    const newChapters: ChapterSelection[] = [];
    const mode: EpicModeType | undefined = (commentarySource === "epic" || commentarySource === "counselor") ? epicMode : undefined;

    for (let bookIdx = startIdx; bookIdx <= endIdx; bookIdx++) {
      const book = BIBLE_BOOK_METADATA[bookIdx];
      for (let ch = 1; ch <= book.chapters; ch++) {
        const exists = customChapters.some(
          (c) => c.book === book.name && c.chapter === ch && c.mode === mode
        );
        if (!exists) {
          newChapters.push({ book: book.name, chapter: ch, mode });
        }
      }
    }
    setCustomChapters([...customChapters, ...newChapters]);
  };

  // Get book range chapter count
  const getBookRangeChapterCount = () => {
    const startIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeStartBook);
    const endIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeEndBook);
    let count = 0;
    for (let i = startIdx; i <= endIdx; i++) {
      count += BIBLE_BOOK_METADATA[i].chapters;
    }
    return count;
  };

  // Get book range book count
  const getBookRangeBookCount = () => {
    const startIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeStartBook);
    const endIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeEndBook);
    return endIdx - startIdx + 1;
  };

  // Remove chapter from custom list
  const removeCustomChapter = (index: number) => {
    setCustomChapters(customChapters.filter((_, i) => i !== index));
  };

  // Handle play/pause toggle
  const handlePlayPause = () => {
    if (isPaused) {
      resume();
    } else if (isPlaying) {
      pause();
    }
  };

  // Handle series play
  const handlePlaySeries = async (series: typeof READING_SERIES[0]) => {
    await unlock();
    const firstItem = series.items[0];
    const verses = await fetchChapterVerses(firstItem.book, firstItem.chapter);
    if (verses.length > 0) {
      playChapter(firstItem.book, firstItem.chapter, verses);
      // Queue remaining series items
      if (series.items.length > 1) {
        const remaining = series.items.slice(1).map(item => ({
          book: item.book,
          chapter: item.chapter,
          verses: [] as Array<{ verse: number; text: string }>,
        }));
        queueChapters(remaining);
      }
    }
  };

  // Epic Mode handler — selects a specific commentary mode
  const handleEpicModeSelect = useCallback((mode: EpicModeType = "epic") => {
    setEpicMode(mode);
    // Counselor mode uses its own source; all others use "epic"
    setCommentarySource(mode === "counselor" ? "counselor" : "epic");
    setIncludeCommentary(true);
  }, [setCommentarySource, setIncludeCommentary]);

  // Play Epic commentary for a chapter (optional mode override for per-item playlists)
  const handlePlayEpic = useCallback(async (book: string, chapter: number, modeOverride?: EpicModeType) => {
    const currentMode = modeOverride || epicMode;
    const modeName = COMMENTARY_MODES.find(m => m.id === currentMode)?.label || "Epic";
    setIsEpicLoading(true);
    setEpicNowPlayingBook(book);
    setEpicNowPlayingChapter(chapter);
    try {
      // Fetch cached commentary for this mode
      let { data, error } = await supabase
        .from("epic_commentaries")
        .select("id, book, chapter, commentary_mode, status, audio_storage_path, commentary_text, version, voice_id, created_at, updated_at")
        .eq("book", book)
        .eq("chapter", chapter)
        .eq("commentary_mode", currentMode)
        .eq("status", "ready")
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      const hasWrongKidsVoice = currentMode === "kids" && data?.voice_id !== KIDS_VOICE_ID;
      const hasWrongKidsPath = currentMode === "kids" && !!data?.audio_storage_path && !data.audio_storage_path.startsWith("kids/");

      // If not cached (or kids cache is mismatched), generate on demand
      if (!data || !data.audio_storage_path || hasWrongKidsVoice || hasWrongKidsPath) {
        if (hasWrongKidsVoice || hasWrongKidsPath) {
          console.warn("[AudioBible] Rejecting stale kids cache; forcing regeneration", {
            voice_id: data?.voice_id,
            audio_storage_path: data?.audio_storage_path,
          });
        }

        toast.info(`Generating ${modeName} commentary for ${book} ${chapter}... This may take a moment.`);

        const genResponse = await supabase.functions.invoke("generate-epic-commentary", {
          body: { book, chapter, mode: currentMode, regenerate: hasWrongKidsVoice || hasWrongKidsPath },
        });

        if (genResponse.error || genResponse.data?.error) {
          throw new Error(genResponse.data?.error || genResponse.error?.message || "Generation failed");
        }

        // Re-fetch the now-cached commentary
        const refetch = await supabase
          .from("epic_commentaries")
          .select("id, book, chapter, commentary_mode, status, audio_storage_path, commentary_text, version, voice_id, created_at, updated_at")
          .eq("book", book)
          .eq("chapter", chapter)
          .eq("commentary_mode", currentMode)
          .eq("status", "ready")
          .order("version", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (refetch.error) throw refetch.error;
        data = refetch.data;

        if (!data || !data.audio_storage_path) {
          toast.error(`${modeName} commentary generation completed but audio not found.`);
          setIsEpicLoading(false);
          return;
        }
      }

      // Try signed URL first, fall back to public URL
      let epicUrl: string;
      const { data: signedData, error: signedError } = await supabase.storage
        .from("epic-audio")
        .createSignedUrl(data.audio_storage_path, 3600);

      if (signedError || !signedData?.signedUrl) {
        // Fallback to public URL since bucket is public
        const { data: publicData } = supabase.storage
          .from("epic-audio")
          .getPublicUrl(data.audio_storage_path);
        epicUrl = publicData?.publicUrl;
        if (!epicUrl) {
          throw new Error(signedError?.message || "Could not get audio URL");
        }
      } else {
        epicUrl = signedData.signedUrl;
      }
      setEpicAudioUrl(epicUrl);

      // Stop any current playback
      stop();
      if (epicAudioRef.current) {
        epicAudioRef.current.pause();
        epicAudioRef.current = null;
      }

      // Play the audio
      const audio = new Audio(epicUrl);
      epicAudioRef.current = audio;
      audio.volume = volume;

      audio.onplay = () => {
        setIsEpicPlaying(true); setIsEpicPaused(false); setIsEpicLoading(false);
        // Music is now manually controlled by user, not auto-started with commentary
      };
      audio.onended = () => {
        // Auto-advance queue (with per-item mode switching and story support)
        const queue = epicQueueRef.current;
        const nextIdx = epicQueueIndexRef.current + 1;
        if (queue.length > 1 && nextIdx < queue.length) {
          epicQueueIndexRef.current = nextIdx;
          const nextItem = queue[nextIdx];
          if (nextItem.mode) setEpicMode(nextItem.mode);
          if (nextItem.storyId) {
            playEpicStoryRef.current?.(nextItem.storyTitle || nextItem.book, nextItem.storyId, nextItem.mode);
          } else {
            playEpicRef.current?.(nextItem.book, nextItem.chapter, nextItem.mode);
          }
        } else {
          setIsEpicPlaying(false);
          setIsEpicPaused(false);
          epicAudioRef.current = null;
          epicQueueRef.current = [];
          epicQueueIndexRef.current = 0;
        }
      };
      audio.onerror = () => {
        toast.error(`Failed to play ${modeName} commentary audio.`);
        setIsEpicPlaying(false);
        setIsEpicPaused(false);
        setIsEpicLoading(false);
        epicAudioRef.current = null;
      };

      await audio.play();
    } catch (err: any) {
      console.error(`[${modeName} Mode] Error:`, err);
      const msg = err?.message || err?.error_description || String(err);
      if (msg.includes("non-2xx") || msg.includes("500") || msg.includes("Generation failed")) {
        toast.error(`${modeName} commentary generation failed. The AI service may be temporarily busy — please try again in a moment.`);
      } else if (msg.includes("429") || msg.includes("rate")) {
        toast.error("Rate limited. Please wait a moment before trying again.");
      } else if (msg.includes("402") || msg.includes("credits")) {
        toast.error("AI credits exhausted. Commentary generation is temporarily unavailable.");
      } else {
        toast.error(`${modeName} commentary error: ${msg}`);
      }
      setIsEpicLoading(false);
    }
  }, [stop, volume, epicMode]);

  // Play a story from queue
  const handlePlayEpicStory = useCallback(async (storyTitle: string, storyId: string, modeOverride?: EpicModeType) => {
    const currentMode = modeOverride || epicMode;
    const modeName = COMMENTARY_MODES.find(m => m.id === currentMode)?.label || "Epic";
    setIsEpicLoading(true);
    setEpicNowPlayingBook(storyTitle);
    setEpicNowPlayingChapter(0);
    try {
      const story = CURATED_STORIES.find(s => s.id === storyId);
      if (!story) throw new Error("Story not found");

      // Check DB cache
      const { data: cached } = await (supabase as any)
        .from('epic_commentaries')
        .select('id, audio_storage_path, commentary_text, status')
        .eq('book', story.title)
        .eq('chapter', -1)
        .eq('mode', currentMode)
        .maybeSingle();

      const playStoryAudio = async (path: string) => {
        const { data: signed } = await supabase.storage
          .from('epic-audio')
          .createSignedUrl(path, 3600);
        if (!signed?.signedUrl) return false;

        stop();
        if (epicAudioRef.current) { epicAudioRef.current.pause(); epicAudioRef.current = null; }
        const audio = new Audio(signed.signedUrl);
        epicAudioRef.current = audio;
        audio.volume = volume;
        setEpicAudioUrl(signed.signedUrl);
        setIsEpicPlaying(true);
        setIsEpicPaused(false);
        setIsEpicLoading(false);
        // Music is now manually controlled by user, not auto-started with commentary
        audio.onended = () => {
          const queue = epicQueueRef.current;
          const nextIdx = epicQueueIndexRef.current + 1;
          if (queue.length > 1 && nextIdx < queue.length) {
            epicQueueIndexRef.current = nextIdx;
            const nextItem = queue[nextIdx];
            if (nextItem.mode) setEpicMode(nextItem.mode);
            if (nextItem.storyId) {
              playEpicStoryRef.current?.(nextItem.storyTitle || nextItem.book, nextItem.storyId, nextItem.mode);
            } else {
              playEpicRef.current?.(nextItem.book, nextItem.chapter, nextItem.mode);
            }
          } else {
            setIsEpicPlaying(false); setIsEpicPaused(false);
            epicAudioRef.current = null; epicQueueRef.current = []; epicQueueIndexRef.current = 0;
          }
        };
        audio.onerror = () => {
          toast.error(`Failed to play ${modeName} story audio.`);
          setIsEpicPlaying(false); setIsEpicPaused(false); setIsEpicLoading(false);
        };
        await audio.play();
        toast.success(`Now playing: ${storyTitle} (${modeName})`);
        return true;
      };

      if (cached?.audio_storage_path && cached?.status === 'ready') {
        const played = await playStoryAudio(cached.audio_storage_path);
        if (played) return;
      }

      // Generate
      toast.info(`Generating ${modeName} story for "${storyTitle}"... This may take 2-3 minutes.`);
      supabase.functions.invoke('generate-epic-commentary', {
        body: { scope: "story", storyTitle: story.title, book: story.book, mode: currentMode },
      }).catch(() => {});

      // Poll
      let attempts = 0;
      const poll = async () => {
        attempts++;
        const { data: row } = await (supabase as any)
          .from('epic_commentaries')
          .select('audio_storage_path, status')
          .eq('book', story.title)
          .eq('chapter', -1)
          .eq('mode', currentMode)
          .eq('status', 'ready')
          .maybeSingle();
        if (row?.audio_storage_path) {
          await playStoryAudio(row.audio_storage_path);
          return;
        }
        if (attempts < 20) setTimeout(poll, 15000);
        else { setIsEpicLoading(false); toast.error("Story still generating. Try again soon."); }
      };
      setTimeout(poll, 20000);
    } catch (err: any) {
      console.error('Story queue error:', err);
      toast.error("Failed to play story: " + (err.message || "Unknown"));
      setIsEpicLoading(false);
    }
  }, [stop, volume, epicMode]);

  // Keep refs in sync so onended/skip callbacks can call the latest version
  useEffect(() => {
    playEpicRef.current = handlePlayEpic;
    playEpicStoryRef.current = handlePlayEpicStory;
  }, [handlePlayEpic, handlePlayEpicStory]);

  // Regenerate commentary (admin only) — forces new script + audio
  const handleRegenerateEpic = useCallback(async (book: string, chapter: number, customInstructions?: string) => {
    const currentMode = epicMode;
    const modeName = COMMENTARY_MODES.find(m => m.id === currentMode)?.label || "Epic";
    // Check if already regenerated recently (within last 24h) — skip check if custom instructions provided
    if (!customInstructions) {
      const { data: existing } = await supabase
        .from("epic_commentaries")
        .select("updated_at, version")
        .eq("book", book)
        .eq("chapter", chapter)
        .eq("commentary_mode", currentMode)
        .eq("status", "ready")
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing?.updated_at) {
        const updatedAt = new Date(existing.updated_at);
        const hoursSince = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60);
        if (hoursSince < 24) {
          const timeAgo = hoursSince < 1
            ? `${Math.round(hoursSince * 60)} minutes ago`
            : `${Math.round(hoursSince)} hours ago`;
          toast.warning(`${book} ${chapter} [${modeName}] was already regenerated ${timeAgo} (v${existing.version}). No need to regenerate again.`, {
            duration: 6000,
          });
          return;
        }
      }
    }

    setIsEpicLoading(true);
    setEpicNowPlayingBook(book);
    setEpicNowPlayingChapter(chapter);
    try {
      toast.info(`Regenerating ${modeName} commentary for ${book} ${chapter}...${customInstructions ? ' (with custom instructions)' : ''} This may take 1-2 minutes.`);

      const genResponse = await supabase.functions.invoke("generate-epic-commentary", {
        body: { book, chapter, regenerate: true, mode: currentMode, ...(customInstructions ? { customInstructions } : {}) },
      });

      if (genResponse.error || genResponse.data?.error) {
        throw new Error(genResponse.data?.error || genResponse.error?.message || "Regeneration failed");
      }

      toast.success(`Regenerated ${modeName} ${book} ${chapter}! Now playing new version.`);

      // Play the freshly generated commentary
      epicQueueRef.current = [{ book, chapter }];
      epicQueueIndexRef.current = 0;
      await handlePlayEpic(book, chapter);
    } catch (err: any) {
      console.error(`[${modeName} Regenerate] Error:`, err);
      const msg = err?.message || String(err);
      toast.error(`Regeneration error: ${msg}`);
      setIsEpicLoading(false);
    }
  }, [handlePlayEpic, epicMode]);

  // Regenerate all chapters in a book (admin only)
  const handleRegenerateBook = useCallback(async (book: string) => {
    const bookMeta = BIBLE_BOOK_METADATA.find(b => b.name === book);
    if (!bookMeta) return;

    const totalChapters = bookMeta.chapters;

    // Check which chapters were already regenerated recently (within last 24h)
    const { data: recentlyDone } = await supabase
      .from("epic_commentaries")
      .select("chapter, updated_at")
      .eq("book", book)
      .eq("status", "ready");

    const skipped: number[] = [];
    const toRegen: number[] = [];
    for (let ch = 1; ch <= totalChapters; ch++) {
      const existing = recentlyDone?.find(r => r.chapter === ch);
      if (existing?.updated_at) {
        const hoursSince = (Date.now() - new Date(existing.updated_at).getTime()) / (1000 * 60 * 60);
        if (hoursSince < 24) { skipped.push(ch); continue; }
      }
      toRegen.push(ch);
    }

    if (toRegen.length === 0) {
      toast.warning(`All ${totalChapters} chapters of ${book} were already regenerated within the last 24 hours. No regeneration needed.`, { duration: 6000 });
      return;
    }

    if (skipped.length > 0) {
      toast.info(`Skipping ${skipped.length} recently regenerated chapter(s). Queuing ${toRegen.length} chapter(s) for ${book}...`, { duration: 5000 });
    } else {
      toast.info(`Queuing all ${toRegen.length} chapters of ${book} for regeneration...`, { duration: 4000 });
    }

    // Use batch-generate-epic edge function for efficiency
    const currentMode = epicMode || "epic";
    const { data, error } = await supabase.functions.invoke("batch-generate-epic", {
      body: {
        books: [{ book, chapters: toRegen }],
        batchSize: toRegen.length,
        regenerate: true,
        mode: currentMode,
      },
    });

    if (error) {
      toast.error(`Book regeneration error: ${error.message}`);
    } else {
      const queued = data?.queued || [];
      toast.success(`${book}: ${queued.length} chapters queued for ${epicMode || 'epic'} mode regeneration. They'll process in the background.`, { duration: 8000 });
    }
  }, [epicMode]);

  // Regenerate the whole Bible (admin only)
  const handleRegenerateWholeBible = useCallback(async () => {
    // Check all chapters for recent regeneration
    const { data: recentlyDone } = await supabase
      .from("epic_commentaries")
      .select("book, chapter, updated_at")
      .eq("status", "ready");

    const recentSet = new Set<string>();
    for (const row of recentlyDone || []) {
      if (row.updated_at) {
        const hoursSince = (Date.now() - new Date(row.updated_at).getTime()) / (1000 * 60 * 60);
        if (hoursSince < 24) recentSet.add(`${row.book}:${row.chapter}`);
      }
    }

    const toRegen: { book: string; chapters: number[] }[] = [];
    let totalSkipped = 0;
    let totalQueued = 0;

    for (const bookMeta of BIBLE_BOOK_METADATA) {
      const chapters: number[] = [];
      for (let ch = 1; ch <= bookMeta.chapters; ch++) {
        if (recentSet.has(`${bookMeta.name}:${ch}`)) { totalSkipped++; continue; }
        chapters.push(ch);
        totalQueued++;
      }
      if (chapters.length > 0) toRegen.push({ book: bookMeta.name, chapters });
    }

    if (totalQueued === 0) {
      toast.warning(`All 1,189 Bible chapters were already regenerated within the last 24 hours. Nothing to regenerate.`, { duration: 8000 });
      return;
    }

    toast.info(`Starting whole-Bible regeneration: ${totalQueued} chapters queued, ${totalSkipped} skipped (recently done). This will run in batches in the background.`, { duration: 8000 });

    // Fire in batches of 5 books at a time using batch-generate-epic
    const currentMode = epicMode || "epic";
    const { data, error } = await supabase.functions.invoke("batch-generate-epic", {
      body: {
        books: toRegen,
        batchSize: 10,
        regenerate: true,
        mode: currentMode,
      },
    });

    if (error) {
      toast.error(`Whole-Bible regeneration error: ${error.message}`);
    } else {
      const queued = data?.queued || [];
      toast.success(`${queued.length} chapters queued for ${currentMode} mode regeneration. Processing in the background.`, { duration: 10000 });
    }
  }, [epicMode]);

  // Play commentary for an entire book (overview)
  const handlePlayEpicBook = useCallback(async (book: string) => {
    const currentMode = epicMode;
    const modeName = COMMENTARY_MODES.find(m => m.id === currentMode)?.label || "Epic";
    setIsEpicLoading(true);
    setEpicNowPlayingBook(book);
    setEpicNowPlayingChapter(0);
    // Single-item queue for book overview
    epicQueueRef.current = [{ book, chapter: 0 }];
    epicQueueIndexRef.current = 0;
    try {
      // Book-level uses chapter=0 as sentinel
      let { data, error } = await supabase
        .from("epic_commentaries")
        .select("*")
        .eq("book", book)
        .eq("chapter", 0)
        .eq("commentary_mode", currentMode)
        .eq("status", "ready")
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (!data || !data.audio_storage_path) {
        toast.info(`Generating ${modeName} overview for ${book}... This may take a moment.`);

        const genResponse = await supabase.functions.invoke("generate-epic-commentary", {
          body: { book, scope: "book", mode: currentMode },
        });

        if (genResponse.error || genResponse.data?.error) {
          throw new Error(genResponse.data?.error || genResponse.error?.message || "Generation failed");
        }

        const refetch = await supabase
          .from("epic_commentaries")
          .select("*")
          .eq("book", book)
          .eq("chapter", 0)
          .eq("commentary_mode", currentMode)
          .eq("status", "ready")
          .order("version", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (refetch.error) throw refetch.error;
        data = refetch.data;

        if (!data || !data.audio_storage_path) {
          toast.error(`${modeName} overview generation completed but audio not found.`);
          setIsEpicLoading(false);
          return;
        }
      }

      // Use signed URL to bypass CDN caching and always fetch latest audio
      const { data: signedData, error: signedError } = await supabase.storage
        .from("epic-audio")
        .createSignedUrl(data.audio_storage_path, 3600);

      if (signedError || !signedData?.signedUrl) {
        throw new Error(signedError?.message || "Could not get audio URL");
      }

      const epicUrl = signedData.signedUrl;
      setEpicAudioUrl(epicUrl);

      stop();
      if (epicAudioRef.current) {
        epicAudioRef.current.pause();
        epicAudioRef.current = null;
      }

      const audio = new Audio(epicUrl);
      epicAudioRef.current = audio;
      audio.volume = volume;

      audio.onplay = () => {
        setIsEpicPlaying(true); setIsEpicPaused(false); setIsEpicLoading(false);
        // Music is now manually controlled by user, not auto-started with commentary
      };
      audio.onended = () => {
        setIsEpicPlaying(false); setIsEpicPaused(false); epicAudioRef.current = null;
      };
      audio.onerror = () => {
        toast.error(`Failed to play ${modeName} overview audio.`);
        setIsEpicPlaying(false);
        setIsEpicPaused(false);
        setIsEpicLoading(false);
        epicAudioRef.current = null;
      };

      await audio.play();
    } catch (err: any) {
      console.error(`[${modeName} Book Mode] Error:`, err);
      const msg = err?.message || err?.error_description || String(err);
      toast.error(`${modeName} overview error: ${msg}`);
      setIsEpicLoading(false);
    }
  }, [stop, volume, epicMode]);

  // Play epic commentary for a custom chapter/story queue (with per-item mode switching)
  const handlePlayEpicCustom = useCallback(async () => {
    if (customChapters.length === 0) return;
    epicQueueRef.current = customChapters;
    epicQueueIndexRef.current = 0;
    const first = customChapters[0];
    if (first.mode) setEpicMode(first.mode);
    if (first.storyId) {
      handlePlayEpicStory(first.storyTitle || first.book, first.storyId, first.mode);
    } else {
      handlePlayEpic(first.book, first.chapter, first.mode);
    }
  }, [customChapters, handlePlayEpic, handlePlayEpicStory]);

  // Play epic chapter-by-chapter for an entire book
  const handlePlayEpicBookChapters = useCallback(async (bookName: string) => {
    const chapterCount = BIBLE_BOOK_METADATA.find((b) => b.name === bookName)?.chapters || 1;
    const queue: ChapterSelection[] = Array.from({ length: chapterCount }, (_, i) => ({
      book: bookName,
      chapter: i + 1,
    }));
    epicQueueRef.current = queue;
    epicQueueIndexRef.current = 0;
    handlePlayEpic(queue[0].book, queue[0].chapter);
  }, [handlePlayEpic]);

  // Skip to next/previous in epic queue (with per-item mode switching)
  const handleEpicSkipNext = useCallback(() => {
    const queue = epicQueueRef.current;
    const nextIdx = epicQueueIndexRef.current + 1;
    if (queue.length > 1 && nextIdx < queue.length) {
      if (epicAudioRef.current) {
        epicAudioRef.current.pause();
        epicAudioRef.current = null;
      }
      epicQueueIndexRef.current = nextIdx;
      const nextItem = queue[nextIdx];
      if (nextItem.mode) setEpicMode(nextItem.mode);
      if (nextItem.storyId) {
        playEpicStoryRef.current?.(nextItem.storyTitle || nextItem.book, nextItem.storyId, nextItem.mode);
      } else {
        playEpicRef.current?.(nextItem.book, nextItem.chapter, nextItem.mode);
      }
    }
  }, []);

  const handleEpicSkipPrevious = useCallback(() => {
    const queue = epicQueueRef.current;
    const prevIdx = epicQueueIndexRef.current - 1;
    if (queue.length > 1 && prevIdx >= 0) {
      if (epicAudioRef.current) {
        epicAudioRef.current.pause();
        epicAudioRef.current = null;
      }
      epicQueueIndexRef.current = prevIdx;
      const prevItem = queue[prevIdx];
      if (prevItem.mode) setEpicMode(prevItem.mode);
      if (prevItem.storyId) {
        playEpicStoryRef.current?.(prevItem.storyTitle || prevItem.book, prevItem.storyId, prevItem.mode);
      } else {
        playEpicRef.current?.(prevItem.book, prevItem.chapter, prevItem.mode);
      }
    }
  }, []);

  const progress = totalVerses > 0 ? ((currentVerseIndex + 1) / totalVerses) * 100 : 0;

  return (
    <div className="min-h-screen gradient-subtle">
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}

      <div className="pt-24 pb-32 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="glass-card mb-8 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <img
                src="/pwa-192x192.png"
                alt="Phototheology"
                className="h-14 w-14 rounded-xl shadow-lg shadow-primary/20"
              />
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-1 bg-gradient-palace bg-clip-text text-transparent">
                  {t('audioBible.title')}
                </h1>
                <p className="text-muted-foreground">
                  {t('audioBible.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Commentary Mode Now Playing Card */}
          {(isEpicPlaying || isEpicPaused || isEpicLoading) && (
            <Card className="mb-8 border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-amber-400/80">
                      {(() => { const Icon = activeModeMeta.icon; return <Icon className="h-4 w-4 inline mr-1" />; })()}
                      {activeModeMeta.label} Commentary
                      {epicQueueRef.current.length > 1 && (
                        <span className="ml-2 opacity-70">
                          ({epicQueueIndexRef.current + 1} of {epicQueueRef.current.length})
                        </span>
                      )}
                    </p>
                    <h2 className="text-2xl font-bold">
                      {epicNowPlayingBook || selectedBook} {epicNowPlayingChapter === 0 ? "(Overview)" : epicNowPlayingChapter || selectedChapter}
                    </h2>
                  </div>
                  <Badge variant="outline" className="text-xs px-2 py-0.5 border-amber-500/50 bg-amber-500/10 text-amber-300">
                    {isEpicLoading ? "Generating..." : isEpicPaused ? "Paused" : "Playing"}
                  </Badge>
                </div>
                {isEpicLoading ? (
                  <div className="flex items-center gap-3 text-muted-foreground py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
                    <span>Generating cinematic commentary... This may take a moment.</span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {epicQueueRef.current.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-amber-500/30 hover:bg-amber-500/10 h-10 w-10 rounded-full"
                          onClick={handleEpicSkipPrevious}
                          disabled={epicQueueIndexRef.current === 0}
                        >
                          <SkipBack className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-amber-500/30 hover:bg-amber-500/10 min-w-[120px]"
                        onClick={() => {
                          if (epicAudioRef.current) {
                            if (isEpicPaused) {
                              epicAudioRef.current.play();
                              setIsEpicPaused(false);
                              setIsEpicPlaying(true);
                            } else {
                              epicAudioRef.current.pause();
                              setIsEpicPaused(true);
                              setIsEpicPlaying(false);
                            }
                          }
                        }}
                      >
                        {isEpicPaused ? (
                          <><Play className="h-5 w-5 mr-2" /> Play</>
                        ) : (
                          <><Pause className="h-5 w-5 mr-2" /> Pause</>
                        )}
                      </Button>
                      {epicQueueRef.current.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-amber-500/30 hover:bg-amber-500/10 h-10 w-10 rounded-full"
                          onClick={handleEpicSkipNext}
                          disabled={epicQueueIndexRef.current >= epicQueueRef.current.length - 1}
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-red-500/30 hover:bg-red-500/10 text-red-400 min-w-[120px]"
                        onClick={() => {
                          if (epicAudioRef.current) {
                            epicAudioRef.current.pause();
                            epicAudioRef.current = null;
                          }
                          setIsEpicPlaying(false);
                          setIsEpicPaused(false);
                          epicQueueRef.current = [];
                          epicQueueIndexRef.current = 0;
                        }}
                      >
                        <Square className="h-5 w-5 mr-2" />
                        Stop
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-amber-500/30 hover:bg-amber-500/10 text-amber-400"
                        onClick={() => setShowEpicExport(true)}
                        disabled={!epicAudioUrl}
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Export
                      </Button>
                      {epicNowPlayingChapter > 0 && (
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-amber-500/30 hover:bg-amber-500/10 text-amber-400"
                          onClick={() => {
                            const track: ImmersiveTrack = {
                              id: `${epicNowPlayingBook}-${epicNowPlayingChapter}-${epicMode}`,
                              title: `${epicNowPlayingBook || selectedBook} ${epicNowPlayingChapter || selectedChapter}`,
                              subtitle: `${activeModeMeta.label} Commentary`,
                              type: "commentary",
                              audioUrl: epicAudioUrl,
                              book: epicNowPlayingBook || selectedBook,
                              chapter: epicNowPlayingChapter || selectedChapter,
                              modeName: activeModeMeta.label,
                              icon: "📖",
                            };
                            immersive.openImmersive([track]);
                          }}
                          disabled={!epicAudioUrl}
                        >
                          <Maximize2 className="h-5 w-5 mr-2" />
                          Immerse
                        </Button>
                      )}
                    </div>
                    {/* Music with commentary toggle */}
                    <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-border/30">
                      <Music className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="commentary-music" className="text-sm text-muted-foreground cursor-pointer">
                        Background Music
                      </Label>
                      <Switch
                        id="commentary-music"
                        checked={commentaryMusicEnabled}
                        onCheckedChange={(checked) => {
                          setCommentaryMusicEnabled(checked);
                          setAutoMusicEnabled(checked);
                          if (checked) requestMusicForCommentary('start');
                        }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Now Playing Card (when active and has data) */}
          {!isIdle && !(isEpicPlaying || isEpicLoading) && totalVerses > 0 && (
            <Card className="mb-8 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {isPlayingCommentary ? t('audioBible.phototheologyCommentary') : t('audioBible.nowPlaying')}
                    </p>
                    <h2 className="text-2xl font-bold">
                      {currentBook} {currentChapter}:{currentVerse}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {includeCommentary && commentarySource === "preacher-mentor" && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 border-amber-500/50 text-amber-400">
                        <Crown className="h-3 w-3 mr-1" />
                        Preach Mode
                      </Badge>
                    )}
                    {includeCommentary && commentarySource === "story-mode" && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 border-emerald-500/50 text-emerald-400">
                        <BookHeart className="h-3 w-3 mr-1" />
                        Story Mode
                      </Badge>
                    )}
                    {commentarySource === "epic" && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 border-amber-500/50 bg-amber-500/10 text-amber-300">
                        {(() => { const Icon = activeModeMeta.icon; return <Icon className="h-3 w-3 mr-1" />; })()}
                        {activeModeMeta.label} Mode
                      </Badge>
                    )}
                    {includeCommentary && commentarySource === "counselor" && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 border-rose-500/50 text-rose-400">
                        <Heart className="h-3 w-3 mr-1" />
                        Counselor
                      </Badge>
                    )}
                    {commentaryOnly && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 border-violet-500/50 text-violet-400">
                        Commentary Only
                      </Badge>
                    )}
                    <Badge variant={isPlayingCommentary ? "secondary" : "default"} className="text-sm px-3 py-1">
                      {isPlayingCommentary || commentaryOnly
                        ? commentarySource === "preacher-mentor"
                          ? "Preacher Mentor"
                          : commentarySource === "story-mode"
                          ? "Story Mode"
                          : commentarySource === "epic"
                          ? `${activeModeMeta.label} Commentary`
                          : commentarySource === "counselor"
                          ? "Counselor"
                          : t('audioBible.tierCommentary', { tier: commentaryTier })
                        : t('audioBible.scripture')}
                    </Badge>
                  </div>
                </div>

                {/* Current text - Always visible */}
                <div className="bg-background/80 rounded-xl p-4 mb-6 min-h-[100px] max-h-[200px] overflow-y-auto border">
                  {isPlayingCommentary ? (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                        {t('audioBible.phototheologyCommentary')}
                      </p>
                      {currentCommentary ? (
                        <p className="text-base leading-relaxed">
                          {currentCommentary}
                        </p>
                      ) : (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>{t('audioBible.generatingCommentary')}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                        {currentBook} {currentChapter}:{currentVerse}
                      </p>
                      <p className="text-lg leading-relaxed font-serif">
                        "{currentVerseText}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>{t('audioBible.verseProgress', { current: currentVerseIndex + 1, total: totalVerses })}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Button variant="outline" size="icon" onClick={skipPrevious} className="h-12 w-12 rounded-full">
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    className="rounded-full h-16 w-16 shadow-lg [&_svg]:!size-7"
                    onClick={handlePlayPause}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-7 w-7 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-7 w-7" />
                    ) : (
                      <Play className="h-7 w-7 ml-1 fill-current" />
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={skipNext} className="h-12 w-12 rounded-full">
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={stop} className="h-12 w-12 rounded-full">
                    <Square className="h-4 w-4" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3 max-w-xs mx-auto">
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                  <Slider
                    value={[volume]}
                    onValueChange={([v]) => setVolume(v)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-10 text-right">{Math.round(volume * 100)}%</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column - Selection */}
            <div className="space-y-6">
              {/* Selection Mode Tabs */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {t('audioBible.whatToListen')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectionMode} onValueChange={(v) => setSelectionMode(v as SelectionMode)}>
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                      <TabsTrigger value="chapter">
                        <BookText className="h-4 w-4 mr-1" />
                        {t('audioBible.chapter')}
                      </TabsTrigger>
                      <TabsTrigger value="book">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {t('audioBible.wholeBook')}
                      </TabsTrigger>
                      <TabsTrigger value="custom">
                        <Layers className="h-4 w-4 mr-1" />
                        {t('audioBible.custom')}
                      </TabsTrigger>
                      <TabsTrigger value="stories">
                        <Film className="h-4 w-4 mr-1" />
                        Stories
                      </TabsTrigger>
                    </TabsList>

                    {/* Single Chapter */}
                    <TabsContent value="chapter" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t('audioBible.book')}</Label>
                          <Select value={selectedBook} onValueChange={setSelectedBook}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className="h-64">
                                {BIBLE_BOOK_METADATA.map((book) => (
                                  <SelectItem key={book.name} value={book.name}>
                                    {book.name}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('audioBible.chapter')}</Label>
                          <Select
                            value={selectedChapter.toString()}
                            onValueChange={(v) => setSelectedChapter(parseInt(v, 10))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className="h-64">
                                {Array.from({ length: getChapterCount() }, (_, i) => i + 1).map((ch) => (
                                  <SelectItem key={ch} value={ch.toString()}>
                                    {t('audioBible.chapterNumber', { number: ch })}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Start from verse */}
                      <div className="space-y-2">
                        <Label>Start from verse</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            value={startVerse}
                            onChange={(e) => {
                              const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                              setStartVerse(val);
                              if (endVerse !== null && endVerse < val) setEndVerse(null);
                            }}
                            className="w-24"
                          />
                          {startVerse > 1 && endVerse === null && (
                            <span className="text-sm text-muted-foreground">
                              Playing from verse {startVerse} onward
                            </span>
                          )}
                        </div>
                      </div>

                      {/* End at verse (optional — creates a passage range) */}
                      <div className="space-y-2">
                        <Label>End at verse <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={startVerse}
                            value={endVerse ?? ""}
                            placeholder="—"
                            onChange={(e) => {
                              const raw = e.target.value;
                              if (!raw) { setEndVerse(null); return; }
                              const val = Math.max(startVerse, parseInt(raw, 10) || startVerse);
                              setEndVerse(val);
                              if (commentaryMode !== "passage") setCommentaryMode("passage");
                            }}
                            className="w-24"
                          />
                          {endVerse !== null && (
                            <>
                              <span className="text-sm text-muted-foreground">
                                Playing verses {startVerse}–{endVerse}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => setEndVerse(null)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {(commentarySource === "epic" || commentarySource === "counselor") ? (
                        <div className="space-y-2 w-full">
                          <Button size="lg" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700" onClick={() => {
                            epicQueueRef.current = [{ book: selectedBook, chapter: selectedChapter }];
                            epicQueueIndexRef.current = 0;
                            handlePlayEpic(selectedBook, selectedChapter);
                          }} disabled={isEpicLoading}>
                            {isEpicLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : (() => { const Icon = activeModeMeta.icon; return <Icon className="h-5 w-5 mr-2" />; })()}
                            {activeModeMeta.label}: {selectedBook} {selectedChapter}
                          </Button>
                          {isAdmin && (
                            <div className="space-y-1.5 w-full">
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full border-amber-500/30 hover:bg-amber-500/10 text-amber-400"
                                onClick={() => handleRegenerateEpic(selectedBook, selectedChapter)}
                                disabled={isEpicLoading}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Regenerate Script & Audio
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full border-amber-500/30 hover:bg-amber-500/10 text-amber-400"
                                onClick={() => handleRegenerateBook(selectedBook)}
                                disabled={isEpicLoading}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Regenerate Book ({selectedBook})
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full border-red-500/30 hover:bg-red-500/10 text-red-400"
                                onClick={handleRegenerateWholeBible}
                                disabled={isEpicLoading}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Regenerate Whole Bible
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Button size="lg" className="w-full" onClick={handlePlayChapter} disabled={isLoading}>
                          {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Play className="h-5 w-5 mr-2" />}
                          {endVerse !== null
                            ? `Play ${selectedBook} ${selectedChapter}:${startVerse}-${endVerse}`
                            : startVerse > 1
                            ? `Play ${selectedBook} ${selectedChapter} from verse ${startVerse}`
                            : t('audioBible.playBookChapter', { book: selectedBook, chapter: selectedChapter })}
                        </Button>
                      )}
                    </TabsContent>

                    {/* Whole Book */}
                    <TabsContent value="book" className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t('audioBible.book')}</Label>
                        <Select value={selectedBook} onValueChange={setSelectedBook}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <ScrollArea className="h-64">
                              {BIBLE_BOOK_METADATA.map((book) => (
                                <SelectItem key={book.name} value={book.name}>
                                  {book.name} ({t('audioBible.chaptersCount', { count: book.chapters })})
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t('audioBible.listenToAllChapters', { count: getChapterCount(), book: selectedBook })}
                      </p>
                      {(commentarySource === "epic" || commentarySource === "counselor") ? (
                        <div className="space-y-2 w-full">
                          <Button size="lg" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700" onClick={() => handlePlayEpicBookChapters(selectedBook)} disabled={isEpicLoading}>
                            {isEpicLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : (() => { const Icon = activeModeMeta.icon; return <Icon className="h-5 w-5 mr-2" />; })()}
                            {activeModeMeta.label} All Chapters: {selectedBook}
                          </Button>
                          <Button size="lg" variant="outline" className="w-full border-amber-500/30 hover:bg-amber-500/10 text-amber-400" onClick={() => handlePlayEpicBook(selectedBook)} disabled={isEpicLoading}>
                            {isEpicLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : (() => { const Icon = activeModeMeta.icon; return <Icon className="h-5 w-5 mr-2" />; })()}
                            {activeModeMeta.label} Overview: {selectedBook}
                          </Button>
                        </div>
                      ) : (
                        <Button size="lg" className="w-full" onClick={handlePlayBook} disabled={isLoading}>
                          {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Play className="h-5 w-5 mr-2" />}
                          {t('audioBible.playEntireBook', { book: selectedBook })}
                        </Button>
                      )}
                    </TabsContent>

                    {/* Custom Selection */}
                    <TabsContent value="custom" className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {t('audioBible.customPlaylistDescription')}
                      </p>
                      
                      {/* Add Mode Selector */}
                      <Tabs value={customAddMode} onValueChange={(v) => setCustomAddMode(v as any)} className="w-full">
                        <TabsList className="grid w-full grid-cols-4 h-auto">
                          <TabsTrigger value="single" className="text-xs py-2">
                            {t('audioBible.singleChapter')}
                          </TabsTrigger>
                          <TabsTrigger value="chapter-range" className="text-xs py-2">
                            {t('audioBible.chapterRange')}
                          </TabsTrigger>
                          <TabsTrigger value="book-range" className="text-xs py-2">
                            {t('audioBible.bookRange')}
                          </TabsTrigger>
                          <TabsTrigger value="add-story" className="text-xs py-2">
                            📖 Story
                          </TabsTrigger>
                        </TabsList>
                        
                        {/* Single Chapter Mode */}
                        <TabsContent value="single" className="mt-3">
                          <div className="flex gap-2">
                            <Select value={customBook} onValueChange={setCustomBook}>
                              <SelectTrigger className="flex-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <ScrollArea className="h-64">
                                  {BIBLE_BOOK_METADATA.map((book) => (
                                    <SelectItem key={book.name} value={book.name}>
                                      {book.name}
                                    </SelectItem>
                                  ))}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                            <Select
                              value={customChapter.toString()}
                              onValueChange={(v) => setCustomChapter(parseInt(v, 10))}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <ScrollArea className="h-64">
                                  {Array.from({ length: getChapterCount(customBook) }, (_, i) => i + 1).map((ch) => (
                                    <SelectItem key={ch} value={ch.toString()}>
                                      {ch}
                                    </SelectItem>
                                  ))}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" onClick={addCustomChapter}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TabsContent>

                        {/* Chapter Range Mode */}
                        <TabsContent value="chapter-range" className="mt-3 space-y-2">
                          <Select value={customBook} onValueChange={(v) => {
                            setCustomBook(v);
                            setRangeStartChapter(1);
                            const maxCh = BIBLE_BOOK_METADATA.find(b => b.name === v)?.chapters || 1;
                            setRangeEndChapter(Math.min(5, maxCh));
                          }}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-64 overflow-y-auto">
                                {BIBLE_BOOK_METADATA.map((book) => (
                                  <SelectItem key={book.name} value={book.name}>
                                    {book.name} ({t('audioBible.chAbbrev', { count: book.chapters })})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2 items-center">
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">{t('audioBible.fromChapter')}</Label>
                              <Select
                                value={rangeStartChapter.toString()}
                                onValueChange={(v) => {
                                  const start = parseInt(v, 10);
                                  setRangeStartChapter(start);
                                  if (rangeEndChapter < start) setRangeEndChapter(start);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-48 overflow-y-auto">
                                    {Array.from({ length: getChapterCount(customBook) }, (_, i) => i + 1).map((ch) => (
                                      <SelectItem key={ch} value={ch.toString()}>
                                        {ch}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <span className="mt-5 text-muted-foreground">→</span>
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">{t('audioBible.toChapter')}</Label>
                              <Select
                                value={rangeEndChapter.toString()}
                                onValueChange={(v) => setRangeEndChapter(parseInt(v, 10))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-48 overflow-y-auto">
                                    {Array.from({ length: getChapterCount(customBook) - rangeStartChapter + 1 }, (_, i) => i + rangeStartChapter).map((ch) => (
                                      <SelectItem key={ch} value={ch.toString()}>
                                        {ch}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button variant="outline" size="icon" className="mt-5" onClick={addChapterRange}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {t('audioBible.chaptersWillBeAdded', { count: rangeEndChapter - rangeStartChapter + 1 })}
                          </p>
                        </TabsContent>

                        {/* Book Range Mode */}
                        <TabsContent value="book-range" className="mt-3 space-y-2">
                          <div className="flex gap-2 items-center">
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">{t('audioBible.fromBook')}</Label>
                              <Select
                                value={rangeStartBook}
                                onValueChange={(v) => {
                                  setRangeStartBook(v);
                                  const startIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === v);
                                  const endIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeEndBook);
                                  if (endIdx < startIdx) setRangeEndBook(v);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-64 overflow-y-auto">
                                    {BIBLE_BOOK_METADATA.map((book) => (
                                      <SelectItem key={book.name} value={book.name}>
                                        {book.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <span className="mt-5 text-muted-foreground">→</span>
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">{t('audioBible.toBook')}</Label>
                              <Select
                                value={rangeEndBook}
                                onValueChange={(v) => setRangeEndBook(v)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-64 overflow-y-auto">
                                    {BIBLE_BOOK_METADATA.filter((_, idx) => idx >= BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeStartBook)).map((book) => (
                                      <SelectItem key={book.name} value={book.name}>
                                        {book.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button variant="outline" size="icon" className="mt-5" onClick={addBookRange}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {t('audioBible.chaptersAcrossBooks', { chapters: getBookRangeChapterCount(), books: getBookRangeBookCount() })}
                          </p>
                        </TabsContent>
                        {/* Story Add Mode */}
                        <TabsContent value="add-story" className="mt-3 space-y-2">
                          <p className="text-xs text-muted-foreground">Add up to 4 stories to your playlist (mix with chapters!)</p>
                          <div className="flex flex-wrap gap-1">
                            {STORY_CATEGORIES.map((cat) => (
                              <Badge
                                key={cat.id}
                                variant={storyCategory === cat.id ? "default" : "outline"}
                                className="cursor-pointer text-[10px] px-1.5 py-0"
                                onClick={() => setStoryCategory(cat.id)}
                              >
                                {cat.label}
                              </Badge>
                            ))}
                          </div>
                          <ScrollArea className="h-40">
                            <div className="space-y-1">
                              {CURATED_STORIES
                                .filter(s => storyCategory === "all" || s.category === storyCategory)
                                .map((story) => {
                                  const alreadyAdded = customChapters.some(c => c.storyId === story.id);
                                  return (
                                    <div
                                      key={story.id}
                                      className={`flex items-center gap-2 p-1.5 rounded border text-xs cursor-pointer transition-colors ${
                                        alreadyAdded ? "opacity-50 border-primary/30" : "hover:bg-accent/50"
                                      }`}
                                      onClick={() => !alreadyAdded && addStoryToPlaylist(story.id)}
                                    >
                                      <span>{story.icon}</span>
                                      <span className="flex-1 truncate font-medium">{story.title}</span>
                                      {alreadyAdded ? (
                                        <Badge variant="secondary" className="text-[9px] px-1">Added</Badge>
                                      ) : (
                                        <Plus className="h-3 w-3 text-muted-foreground" />
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>

                      {/* Custom chapters list with per-item mode */}
                      {customChapters.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <Label>{t('audioBible.yourPlaylist', { count: customChapters.length })}</Label>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-muted-foreground h-6"
                              onClick={() => setCustomChapters([])}
                            >
                              {t('audioBible.clearAll')}
                            </Button>
                          </div>
                          <ScrollArea className="max-h-48">
                            <div className="space-y-1">
                              {customChapters.map((ch, i) => {
                                const itemMode = ch.mode || epicMode;
                                const modeMeta = COMMENTARY_MODES.find(m => m.id === itemMode);
                                const modeColorMap: Record<string, string> = {
                                  urban: "border-blue-500/30 text-blue-400",
                                  ancient: "border-amber-500/30 text-amber-400",
                                  preacher: "border-purple-500/30 text-purple-400",
                                  epic: "border-orange-500/30 text-orange-400",
                                  scholar: "border-emerald-500/30 text-emerald-400",
                                  counselor: "border-rose-500/30 text-rose-400",
                                };
                                return (
                                  <div key={i} className="flex items-center gap-1.5 text-xs">
                                    <span className="font-medium min-w-[100px] truncate">
                                      {ch.storyId ? `📖 ${ch.storyTitle || ch.book}` : `${ch.book} ${ch.chapter}`}
                                    </span>
                                    {(commentarySource === "epic" || commentarySource === "counselor") && (
                                      <Select
                                        value={ch.mode || epicMode}
                                        onValueChange={(v) => {
                                          const updated = [...customChapters];
                                          updated[i] = { ...updated[i], mode: v as EpicModeType };
                                          setCustomChapters(updated);
                                        }}
                                      >
                                        <SelectTrigger className={`h-6 w-[90px] text-[10px] px-1.5 ${modeColorMap[itemMode] || ""}`}>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {COMMENTARY_MODES.map((m) => (
                                            <SelectItem key={m.id} value={m.id} className="text-xs">
                                              {m.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 w-5 p-0 ml-auto hover:bg-destructive/20"
                                      onClick={() => removeCustomChapter(i)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </ScrollArea>
                        </div>
                      )}

                      {(commentarySource === "epic" || commentarySource === "counselor") ? (
                        <Button
                          size="lg"
                          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                          onClick={handlePlayEpicCustom}
                          disabled={isEpicLoading || customChapters.length === 0}
                        >
                          {isEpicLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : (() => { const Icon = activeModeMeta.icon; return <Icon className="h-5 w-5 mr-2" />; })()}
                          {activeModeMeta.label}: {customChapters.length} Item{customChapters.length !== 1 ? "s" : ""}
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          className="w-full"
                          onClick={handlePlayCustom}
                          disabled={isLoading || customChapters.length === 0}
                        >
                          {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Play className="h-5 w-5 mr-2" />}
                          {t('audioBible.playChapters', { count: customChapters.length })}
                        </Button>
                      )}
                    </TabsContent>

                    {/* Stories */}
                    <TabsContent value="stories" className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        100 immersive biblical stories told through Phototheology — choose a story and a voice.
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {STORY_CATEGORIES.map((cat) => (
                          <Badge
                            key={cat.id}
                            variant={storyCategory === cat.id ? "default" : "outline"}
                            className="cursor-pointer text-[10px] px-2 py-0.5"
                            onClick={() => setStoryCategory(cat.id)}
                          >
                            {cat.label}
                          </Badge>
                        ))}
                      </div>
                      <ScrollArea className="h-[60vh]">
                        <div className="space-y-2">
                          {CURATED_STORIES
                            .filter(s => storyCategory === "all" || s.category === storyCategory)
                            .map((story) => (
                            <div
                              key={story.id}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedStory === story.id
                                  ? "border-primary bg-primary/10"
                                  : "hover:bg-accent/50"
                              }`}
                              onClick={() => setSelectedStory(story.id)}
                            >
                              <span className="text-2xl">{story.icon}</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm">{story.title}</h4>
                                <p className="text-xs text-muted-foreground truncate">{story.description}</p>
                                <p className="text-[10px] text-muted-foreground/70">{story.reference}</p>
                              </div>
                              {selectedStory === story.id && (
                                <Badge variant="secondary" className="text-[10px]">Selected</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                        onClick={async () => {
                          if (!selectedStory) return;
                          const story = CURATED_STORIES.find(s => s.id === selectedStory);
                          if (!story) return;
                          setIsEpicLoading(true);
                          try {
                            // 1) Check DB cache first
                            const { data: cached } = await (supabase as any)
                              .from('epic_commentaries')
                              .select('id, audio_storage_path, commentary_text, status')
                              .eq('book', story.title)
                              .eq('chapter', -1)
                              .eq('mode', epicMode)
                              .maybeSingle();

                            const playAudioFromPath = async (path: string) => {
                              const { data: signed } = await supabase.storage
                                .from('epic-audio')
                                .createSignedUrl(path, 3600);
                              if (signed?.signedUrl) {
                                if (epicAudioRef.current) epicAudioRef.current.pause();
                                const audio = new Audio(signed.signedUrl);
                                epicAudioRef.current = audio;
                                setEpicAudioUrl(signed.signedUrl);
                                setEpicNowPlayingBook(story.title);
                                setEpicNowPlayingChapter(0);
                                setIsEpicPlaying(true);
                                setIsEpicPaused(false);
                                audio.play();
                                audio.onended = () => { setIsEpicPlaying(false); setIsEpicPaused(false); };
                                toast.success(`Now playing: ${story.title} (${activeModeMeta.label})`);
                                return true;
                              }
                              return false;
                            };

                            // If cached with audio, play immediately
                            if (cached?.audio_storage_path && cached?.status === 'ready') {
                              const played = await playAudioFromPath(cached.audio_storage_path);
                              if (played) { setIsEpicLoading(false); return; }
                            }

                            // 2) Trigger generation (fire-and-forget — may timeout, that's OK)
                            toast.info(`Generating ${activeModeMeta.label} story for "${story.title}"... This may take 2-3 minutes.`);
                            supabase.functions.invoke('generate-epic-commentary', {
                              body: {
                                scope: "story",
                                storyTitle: story.title,
                                book: story.book,
                                mode: epicMode,
                              }
                            }).then(({ data }) => {
                              // If we get a response with audioUrl, great — but we also poll below
                              if (data?.audioUrl) {
                                if (epicAudioRef.current) epicAudioRef.current.pause();
                                const audio = new Audio(data.audioUrl);
                                epicAudioRef.current = audio;
                                setEpicAudioUrl(data.audioUrl);
                                setEpicNowPlayingBook(story.title);
                                setEpicNowPlayingChapter(0);
                                setIsEpicPlaying(true);
                                setIsEpicPaused(false);
                                setIsEpicLoading(false);
                                audio.play();
                                audio.onended = () => { setIsEpicPlaying(false); setIsEpicPaused(false); };
                                toast.success(`Now playing: ${story.title} (${activeModeMeta.label})`);
                              }
                            }).catch(() => { /* timeout is expected, polling handles it */ });

                            // 3) Poll DB every 15s for up to 5 min
                            let attempts = 0;
                            const maxAttempts = 20;
                            const pollInterval = 15000;
                            const poll = async () => {
                              attempts++;
                              const { data: row } = await (supabase as any)
                                .from('epic_commentaries')
                                .select('audio_storage_path, status')
                                .eq('book', story.title)
                                .eq('chapter', -1)
                                .eq('mode', epicMode)
                                .eq('status', 'ready')
                                .maybeSingle();

                              if (row?.audio_storage_path) {
                                const played = await playAudioFromPath(row.audio_storage_path);
                                if (played) { setIsEpicLoading(false); return; }
                              }

                              if (attempts < maxAttempts) {
                                setTimeout(poll, pollInterval);
                              } else {
                                setIsEpicLoading(false);
                                toast.error("Story is still generating. Please try again in a minute.");
                              }
                            };
                            // Start polling after a short initial delay
                            setTimeout(poll, 20000);

                          } catch (err: any) {
                            console.error('Story generation error:', err);
                            toast.error("Failed to generate story: " + (err.message || "Unknown error"));
                            setIsEpicLoading(false);
                          }
                        }}
                        disabled={isEpicLoading || !selectedStory}
                      >
                        {isEpicLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : (() => { const Icon = activeModeMeta.icon; return <Icon className="h-5 w-5 mr-2" />; })()}
                        {selectedStory
                          ? `${activeModeMeta.label}: ${CURATED_STORIES.find(s => s.id === selectedStory)?.title}`
                          : "Select a Story"}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Reading Series */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListMusic className="h-5 w-5 text-primary" />
                    {t('audioBible.preBuiltSeries')}
                  </CardTitle>
                  <CardDescription>{t('audioBible.curatedJourneys')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {READING_SERIES.map((series) => (
                      <div
                        key={series.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => handlePlaySeries(series)}
                      >
                        <div>
                          <h3 className="font-medium text-sm">{series.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {series.description} • {t('audioBible.chaptersCount', { count: series.items.length })}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6">
              {/* Listening Mode */}
              <Card className="glass-card border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-primary" />
                    {t('audioBible.listeningMode')}
                  </CardTitle>
                  <CardDescription>{t('audioBible.chooseHowToListen')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Listening Mode Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={!includeCommentary && commentarySource !== "epic" && commentarySource !== "counselor" ? "default" : "outline"}
                      className="h-auto py-3 px-2 flex-col gap-1 text-center"
                      onClick={() => {
                        setIncludeCommentary(false);
                        setCommentarySource("standard");
                      }}
                    >
                      <BookOpen className="h-5 w-5 mb-0.5" />
                      <span className="font-semibold text-sm leading-tight">{t('audioBible.bibleOnly')}</span>
                      <span className="text-[10px] opacity-80 leading-tight">{t('audioBible.justScripture')}</span>
                    </Button>
                    <Button
                      variant={includeCommentary && commentarySource === "story-mode" ? "default" : "outline"}
                      className="h-auto py-3 px-2 flex-col gap-1 text-center"
                      onClick={() => {
                        setIncludeCommentary(true);
                        setCommentarySource("story-mode");
                      }}
                    >
                      <BookHeart className="h-5 w-5 mb-0.5" />
                      <span className="font-semibold text-sm leading-tight">Story Mode</span>
                      <span className="text-[10px] opacity-80 leading-tight">Simple explainer</span>
                    </Button>
                    <Button
                      variant={includeCommentary && commentarySource === "standard" ? "default" : "outline"}
                      className="h-auto py-3 px-2 flex-col gap-1 text-center"
                      onClick={() => {
                        setIncludeCommentary(true);
                        setCommentarySource("standard");
                      }}
                    >
                      <MessageSquare className="h-5 w-5 mb-0.5" />
                      <span className="font-semibold text-sm leading-tight">Commentary</span>
                      <span className="text-[10px] opacity-80 leading-tight">PT insights</span>
                    </Button>
                    <Button
                      variant={includeCommentary && commentarySource === "preacher-mentor" ? "default" : "outline"}
                      className="h-auto py-3 px-2 flex-col gap-1 text-center"
                      onClick={() => {
                        setIncludeCommentary(true);
                        setCommentarySource("preacher-mentor");
                      }}
                    >
                      <Crown className="h-5 w-5 mb-0.5" />
                      <span className="font-semibold text-sm leading-tight">Mentor</span>
                      <span className="text-[10px] opacity-80 leading-tight">Preacher mode</span>
                    </Button>
                  </div>

                  {/* Commentary Suite — 6 Modes */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Commentary Suite</span>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-amber-500/20 border-amber-500/30 text-amber-300">
                        <Crown className="h-2.5 w-2.5 mr-0.5" />
                        Premium
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {COMMENTARY_MODES.map((m) => {
                        const Icon = m.icon;
                        const isActive = m.id === "counselor"
                          ? commentarySource === "counselor"
                          : commentarySource === "epic" && epicMode === m.id;
                        const colorMap: Record<string, string> = {
                          blue: isActive ? "bg-blue-600 hover:bg-blue-700 border-blue-500/50 text-white" : "border-blue-500/30 hover:border-blue-500/50 text-blue-400",
                          amber: isActive ? "bg-amber-600 hover:bg-amber-700 border-amber-500/50 text-white" : "border-amber-500/30 hover:border-amber-500/50 text-amber-400",
                          purple: isActive ? "bg-purple-600 hover:bg-purple-700 border-purple-500/50 text-white" : "border-purple-500/30 hover:border-purple-500/50 text-purple-400",
                          orange: isActive ? "bg-gradient-to-b from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 border-amber-500/50 text-white" : "border-orange-500/30 hover:border-orange-500/50 text-orange-400",
                          emerald: isActive ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-500/50 text-white" : "border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400",
                          rose: isActive ? "bg-rose-600 hover:bg-rose-700 border-rose-500/50 text-white" : "border-rose-500/30 hover:border-rose-500/50 text-rose-400",
                          cyan: isActive ? "bg-cyan-600 hover:bg-cyan-700 border-cyan-500/50 text-white" : "border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400",
                          indigo: isActive ? "bg-indigo-600 hover:bg-indigo-700 border-indigo-500/50 text-white" : "border-indigo-500/30 hover:border-indigo-500/50 text-indigo-400",
                        };
                        return (
                          <Button
                            key={m.id}
                            variant="outline"
                            className={`h-auto py-2 px-1 flex-col gap-0.5 text-center ${colorMap[m.color]}`}
                            onClick={() => handleEpicModeSelect(m.id)}
                          >
                            <Icon className={`h-4 w-4 ${isActive ? "text-white" : ""}`} />
                            <span className={`text-[10px] font-semibold leading-tight ${isActive ? "text-white" : ""}`}>{m.label}</span>
                            <span className={`text-[8px] leading-tight ${isActive ? "text-white/70" : "opacity-60"}`}>{m.subtitle}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Commentary Options (only show if enabled) */}
                  {includeCommentary && (
                    <>
                      {/* Reading Style: Scripture + Commentary or Commentary Only */}
                      <div className="space-y-2 pt-2">
                        <Label>Reading Style</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={!commentaryOnly ? "default" : "outline"}
                            size="sm"
                            className="h-auto py-2 flex-col"
                            onClick={() => setCommentaryOnly(false)}
                          >
                            <span className="font-medium">Scripture + Commentary</span>
                            <span className="text-xs opacity-80">Read verse, then explain</span>
                          </Button>
                          <Button
                            variant={commentaryOnly ? "default" : "outline"}
                            size="sm"
                            className="h-auto py-2 flex-col"
                            onClick={() => setCommentaryOnly(true)}
                          >
                            <span className="font-medium">Commentary Only</span>
                            <span className="text-xs opacity-80">Skip verse audio</span>
                          </Button>
                        </div>
                      </div>

                      {/* Commentary Mode: Verse by Verse, Chapter Summary, or Passage */}
                      <div className="space-y-2">
                        <Label>{t('audioBible.commentaryStyle')}</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={commentaryMode === "verse" ? "default" : "outline"}
                            size="sm"
                            className="h-auto py-2 flex-col"
                            onClick={() => setCommentaryMode("verse")}
                          >
                            <span className="font-medium">{t('audioBible.verseByVerse')}</span>
                            <span className="text-xs opacity-80">{t('audioBible.afterEachVerse')}</span>
                          </Button>
                          <Button
                            variant={commentaryMode === "chapter" ? "default" : "outline"}
                            size="sm"
                            className="h-auto py-2 flex-col"
                            onClick={() => setCommentaryMode("chapter")}
                          >
                            <span className="font-medium">{t('audioBible.chapterSummary')}</span>
                            <span className="text-xs opacity-80">{t('audioBible.afterWholeChapter')}</span>
                          </Button>
                          <Button
                            variant={commentaryMode === "passage" ? "default" : "outline"}
                            size="sm"
                            className="h-auto py-2 flex-col"
                            onClick={() => setCommentaryMode("passage")}
                          >
                            <span className="font-medium">Passage</span>
                            <span className="text-xs opacity-80">One for range</span>
                          </Button>
                        </div>
                      </div>

                      {/* Commentary Depth */}
                      <div className="space-y-2">
                        <Label>{t('audioBible.commentaryDepth')}</Label>
                        <Select
                          value={commentaryTier}
                          onValueChange={(v) => setCommentaryTier(v as CommentaryTier)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="surface">{t('audioBible.surface')}</SelectItem>
                            <SelectItem value="intermediate">{t('audioBible.intermediate')}</SelectItem>
                            <SelectItem value="scholarly">{t('audioBible.scholarly')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Audio Settings */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-primary" />
                    {t('audioBible.audioSettings')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Bible Voice Selection */}
                  <div className="space-y-2">
                    <Label>{t('audioBible.bibleVoice')}</Label>
                    <Select value={voice} onValueChange={(v) => setVoice(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name} - {v.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Commentary Voice Selection */}
                  {includeCommentary && (
                    <div className="space-y-2">
                      <Label>{t('audioBible.commentaryVoice')}</Label>
                      <Select value={commentaryVoice} onValueChange={(v) => setCommentaryVoice(v as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {voices.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.name} - {v.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Speed Control */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>{t('audioBible.playbackSpeed')}</Label>
                      <span className="text-sm font-medium">{speed}x</span>
                    </div>
                    <Slider
                      value={[speed]}
                      onValueChange={([v]) => setSpeed(v)}
                      min={0.5}
                      max={2}
                      step={0.25}
                    />
                  </div>

                  {/* Volume Control */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>{t('audioBible.volume')}</Label>
                      <span className="text-sm font-medium">{Math.round(volume * 100)}%</span>
                    </div>
                    <Slider
                      value={[volume]}
                      onValueChange={([v]) => setVolume(v)}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Themes (if available) */}
              {themes.length > 0 && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>{t('audioBible.themes')}</CardTitle>
                    <CardDescription>{t('audioBible.versesByTopic')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                      {themes.slice(0, 8).map((theme) => (
                        <div
                          key={theme.id}
                          className="p-2 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer text-center"
                        >
                          <span className="text-xl block">{theme.icon}</span>
                          <span className="text-xs">{theme.display_name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <ExportEpicAudioDialog
        open={showEpicExport}
        onOpenChange={setShowEpicExport}
        epicAudioUrl={epicAudioUrl}
        book={epicNowPlayingBook || selectedBook}
        chapter={epicNowPlayingChapter || selectedChapter}
        queue={epicQueueRef.current.map((q) => ({ book: q.book, chapter: q.chapter }))}
        modeName={activeModeMeta.label}
      />
      <ImmersiveAudioPlayer
        isOpen={immersive.isOpen}
        onClose={immersive.closeImmersive}
        tracks={immersive.queue.tracks}
        currentIndex={immersive.queue.currentIndex}
        onNextTrack={immersive.nextTrack}
        onPrevTrack={immersive.prevTrack}
        hasNext={immersive.hasNext}
        hasPrev={immersive.hasPrev}
        ambientMusicEnabled={immersive.ambientMusicEnabled}
        ambientVolume={immersive.ambientVolume}
        continuousPlay={immersive.continuousPlay}
        onSetAmbientMusic={immersive.setAmbientMusic}
        onSetAmbientVolume={immersive.setAmbientVolume}
        onSetContinuousPlay={immersive.setContinuousPlay}
      />
    </div>
  );
}
