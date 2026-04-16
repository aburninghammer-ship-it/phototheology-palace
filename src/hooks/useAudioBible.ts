/**
 * useAudioBible - React hook for Audio Bible playback
 * Manages playback state, voice selection, and chapter/verse navigation
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { audioEngine, AudioState } from "@/lib/AudioEngine";
import {
  generateTTSAudio,
  generateCommentary,
  generatePreacherMentorCommentary,
  generateStoryModeCommentary,
  generateCounselorCommentary,
  generateChapterCommentary,
  generatePassageCommentary,
  prefetchUpcomingCommentary,
  fetchChapterVerses,
  CommentaryTier,
  CommentarySource,
  OpenAIVoice,
  OPENAI_VOICES,
} from "@/services/audioBibleService";



interface Verse {
  verse: number;
  text: string;
}

interface PlaybackItem {
  book: string;
  chapter: number;
  verses: Verse[];
}

interface UseAudioBibleOptions {
  defaultVoice?: OpenAIVoice;
  defaultCommentaryVoice?: OpenAIVoice;
  defaultSpeed?: number;
  defaultVolume?: number;
  defaultTier?: CommentaryTier;
  onVerseChange?: (book: string, chapter: number, verse: number) => void;
  onChapterComplete?: (book: string, chapter: number) => void;
}

export function useAudioBible(options: UseAudioBibleOptions = {}) {
  const {
    defaultVoice = "onyx",
    defaultSpeed = 1.0,
    defaultVolume = 1.0,
    defaultTier = "surface",
    onVerseChange,
    onChapterComplete,
  } = options;

  // State
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [voice, setVoice] = useState<OpenAIVoice>(defaultVoice);
  const [commentaryVoice, setCommentaryVoice] = useState<OpenAIVoice>(options.defaultCommentaryVoice || "nova");
  const [speed, setSpeed] = useState(defaultSpeed);
  const [volume, setVolumeState] = useState(defaultVolume);
  const [commentaryTier, setCommentaryTier] = useState<CommentaryTier>(defaultTier);
  const [includeCommentary, setIncludeCommentary] = useState(true);
  const [commentaryOnly, setCommentaryOnly] = useState(false);
  const [commentaryMode, setCommentaryMode] = useState<"verse" | "chapter" | "passage">("verse");
  const [commentarySource, setCommentarySource] = useState<CommentarySource>("standard");

  // Playback tracking
  const [currentBook, setCurrentBook] = useState<string>("");
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number>(0);
  const [totalVerses, setTotalVerses] = useState<number>(0);
  const [isPlayingCommentary, setIsPlayingCommentary] = useState(false);
  const [currentCommentary, setCurrentCommentary] = useState<string>("");

  // Refs for async operations and avoiding stale closures
  const playbackQueueRef = useRef<PlaybackItem[]>([]);
  const currentItemRef = useRef<PlaybackItem | null>(null);
  const isStoppedRef = useRef(false);
  const loadingRef = useRef(false);

  // Ref for playVerseAtIndex to avoid circular dependencies
  const playVerseAtIndexRef = useRef<((item: PlaybackItem, index: number) => Promise<void>) | null>(null);

  // Refs to store current values for callbacks (avoid stale closures)
  const currentVerseIndexRef = useRef(currentVerseIndex);
  const isPlayingCommentaryRef = useRef(isPlayingCommentary);
  const includeCommentaryRef = useRef(includeCommentary);
  const commentaryOnlyRef = useRef(commentaryOnly);
  const commentaryTierRef = useRef(commentaryTier);
  const commentaryModeRef = useRef(commentaryMode);
  const commentarySourceRef = useRef(commentarySource);
  const voiceRef = useRef(voice);
  const commentaryVoiceRef = useRef(commentaryVoice);
  const onChapterCompleteRef = useRef(onChapterComplete);
  const onVerseChangeRef = useRef(onVerseChange);

  // Keep refs in sync with state - update synchronously for critical playback state
  useEffect(() => { currentVerseIndexRef.current = currentVerseIndex; }, [currentVerseIndex]);

  // Also update ref synchronously when setCurrentVerseIndex is called
  const setCurrentVerseIndexSync = useCallback((index: number) => {
    currentVerseIndexRef.current = index; // Sync update
    setCurrentVerseIndex(index); // Async state update
  }, []);
  useEffect(() => { isPlayingCommentaryRef.current = isPlayingCommentary; }, [isPlayingCommentary]);
  useEffect(() => { includeCommentaryRef.current = includeCommentary; }, [includeCommentary]);
  useEffect(() => { commentaryOnlyRef.current = commentaryOnly; }, [commentaryOnly]);
  useEffect(() => { commentaryTierRef.current = commentaryTier; }, [commentaryTier]);
  useEffect(() => { commentaryModeRef.current = commentaryMode; }, [commentaryMode]);
  useEffect(() => { commentarySourceRef.current = commentarySource; }, [commentarySource]);
  useEffect(() => { voiceRef.current = voice; }, [voice]);
  useEffect(() => { commentaryVoiceRef.current = commentaryVoice; }, [commentaryVoice]);
  useEffect(() => { onChapterCompleteRef.current = onChapterComplete; }, [onChapterComplete]);
  useEffect(() => { onVerseChangeRef.current = onVerseChange; }, [onVerseChange]);

  // Update playback rate when speed changes
  useEffect(() => {
    audioEngine.setPlaybackRate(speed);
  }, [speed]);

  // Update volume when it changes
  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume]);

  // Volume setter
  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    audioEngine.setVolume(vol);
  }, []);

  /**
   * Unlock iOS audio - call on first user interaction
   */
  const unlock = useCallback(async () => {
    const success = await audioEngine.unlock();
    setIsUnlocked(success);
    return success;
  }, []);

  // Cache for pre-fetched commentary to avoid delay on mobile
  const prefetchedCommentaryRef = useRef<{
    book: string;
    chapter: number;
    verse: number;
    source: CommentarySource;
    result: { commentary: string; audioUrl: string | null } | null;
  } | null>(null);

  /**
   * Pre-fetch commentary for current verse while verse audio is playing
   * This helps mobile by having the data ready when needed
   * Respects the current commentary source (standard, story-mode, preacher-mentor)
   */
  const prefetchCurrentCommentary = useCallback(async () => {
    const item = currentItemRef.current;
    if (!item || isStoppedRef.current) return;

    const verseIdx = currentVerseIndexRef.current;
    const verse = item.verses[verseIdx];
    if (!verse) return;

    const source = commentarySourceRef.current;

    // Don't prefetch if we already have it for the same source
    if (prefetchedCommentaryRef.current?.book === item.book &&
        prefetchedCommentaryRef.current?.chapter === item.chapter &&
        prefetchedCommentaryRef.current?.verse === verse.verse &&
        prefetchedCommentaryRef.current?.source === source) {
      return;
    }

    console.log(`[useAudioBible] Pre-fetching ${source} commentary for ${item.book} ${item.chapter}:${verse.verse}`);

    try {
      const opts = {
        book: item.book,
        chapter: item.chapter,
        verse: verse.verse,
        verseText: verse.text,
        tier: commentaryTierRef.current,
        generateAudio: true,
        voice: commentaryVoiceRef.current,
      };

      const result = source === "preacher-mentor"
        ? await generatePreacherMentorCommentary(opts)
        : source === "story-mode"
        ? await generateStoryModeCommentary(opts)
        : source === "counselor"
        ? await generateCounselorCommentary(opts)
        : await generateCommentary(opts);

      if (result && !isStoppedRef.current) {
        prefetchedCommentaryRef.current = {
          book: item.book,
          chapter: item.chapter,
          verse: verse.verse,
          source,
          result: { commentary: result.commentary, audioUrl: result.audioUrl },
        };
        console.log(`[useAudioBible] Pre-fetched ${source} commentary ready for ${item.book} ${item.chapter}:${verse.verse}`);
      }
    } catch (error) {
      console.error("[useAudioBible] Pre-fetch error:", error);
    }
  }, []);

  /**
   * Play commentary for current verse
   */
  const playCurrentVerseCommentary = useCallback(async () => {
    const item = currentItemRef.current;
    if (!item || isStoppedRef.current) return;

    const verseIdx = currentVerseIndexRef.current;
    const verse = item.verses[verseIdx];
    if (!verse) return;

    setIsPlayingCommentary(true);
    loadingRef.current = true;

    try {
      console.log(`[useAudioBible] Playing commentary for ${item.book} ${item.chapter}:${verse.verse}`);

      // Check if we have pre-fetched commentary matching the current source
      let result: { commentary: string; audioUrl: string | null } | null = null;

      if (prefetchedCommentaryRef.current?.book === item.book &&
          prefetchedCommentaryRef.current?.chapter === item.chapter &&
          prefetchedCommentaryRef.current?.verse === verse.verse &&
          prefetchedCommentaryRef.current?.source === commentarySourceRef.current &&
          prefetchedCommentaryRef.current?.result) {
        console.log("[useAudioBible] Using pre-fetched commentary");
        result = prefetchedCommentaryRef.current.result;
        prefetchedCommentaryRef.current = null; // Clear after use
      } else {
        // Clear stale prefetch from wrong source
        prefetchedCommentaryRef.current = null;
        // Fetch if not pre-fetched (with timeout)
        console.log(`[useAudioBible] Fetching commentary (source: ${commentarySourceRef.current})`);
        const timeoutPromise = new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error("Commentary generation timed out")), 45000);
        });

        const source = commentarySourceRef.current;
        const commentaryPromise = source === "preacher-mentor"
          ? generatePreacherMentorCommentary({
              book: item.book,
              chapter: item.chapter,
              verse: verse.verse,
              verseText: verse.text,
              generateAudio: true,
              voice: commentaryVoiceRef.current,
            })
          : source === "story-mode"
          ? generateStoryModeCommentary({
              book: item.book,
              chapter: item.chapter,
              verse: verse.verse,
              verseText: verse.text,
              generateAudio: true,
              voice: commentaryVoiceRef.current,
            })
          : source === "counselor"
          ? generateCounselorCommentary({
              book: item.book,
              chapter: item.chapter,
              verse: verse.verse,
              verseText: verse.text,
              generateAudio: true,
              voice: commentaryVoiceRef.current,
            })
          : generateCommentary({
              book: item.book,
              chapter: item.chapter,
              verse: verse.verse,
              verseText: verse.text,
              tier: commentaryTierRef.current,
              generateAudio: true,
              voice: commentaryVoiceRef.current,
            });

        result = await Promise.race([commentaryPromise, timeoutPromise]);
      }

      if (isStoppedRef.current) {
        console.log("[useAudioBible] Stopped");
        loadingRef.current = false;
        setIsPlayingCommentary(false);
        return;
      }

      // If no result (commentary failed to generate), skip to next verse
      if (!result || !result.commentary) {
        console.log("[useAudioBible] No commentary result - skipping to next verse");
        loadingRef.current = false;
        setIsPlayingCommentary(false);
        setCurrentCommentary("");
        
        // Trigger move to next verse by simulating playback end
        const nextIndex = currentVerseIndexRef.current + 1;
        if (nextIndex < item.verses.length) {
          setCurrentVerseIndexSync(nextIndex);
          playVerseAtIndexRef.current?.(item, nextIndex);
        } else {
          // Chapter complete
          onChapterCompleteRef.current?.(item.book, item.chapter);
          if (playbackQueueRef.current.length > 0) {
            const nextItem = playbackQueueRef.current.shift()!;
            currentItemRef.current = nextItem;
            setCurrentBook(nextItem.book);
            setCurrentChapter(nextItem.chapter);
            setCurrentVerseIndexSync(0);
            setTotalVerses(nextItem.verses.length);
            playVerseAtIndexRef.current?.(nextItem, 0);
          } else {
            currentItemRef.current = null;
            setAudioState("idle");
          }
        }
        return;
      }

      console.log(`[useAudioBible] Commentary received: ${result.commentary?.substring(0, 100)}...`);
      setCurrentCommentary(result.commentary);

      if (result.audioUrl) {
        console.log("[useAudioBible] Playing commentary audio URL");
        await audioEngine.play(result.audioUrl);
      } else if (result.commentary) {
        // Generate TTS for commentary text
        console.log("[useAudioBible] Generating TTS for commentary");
        const audioUrl = await generateTTSAudio({ text: result.commentary, voice: commentaryVoiceRef.current });
        if (audioUrl && !isStoppedRef.current) {
          await audioEngine.play(audioUrl);
        } else {
          // If TTS fails, just show text and auto-advance after delay
          console.log("[useAudioBible] TTS failed, showing text only");
          await new Promise(resolve => setTimeout(resolve, 5000));
          if (!isStoppedRef.current) {
            audioEngine.stop(); // Trigger "ended" event
          }
        }
      }
    } catch (error) {
      console.error("[useAudioBible] Commentary error:", error);
      setCurrentCommentary("Commentary unavailable. Moving to next verse...");
      // Auto-advance after showing error message
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!isStoppedRef.current) {
        setIsPlayingCommentary(false);
        setCurrentCommentary("");
        // Move to next verse
        const nextIndex = currentVerseIndexRef.current + 1;
        if (nextIndex < item.verses.length) {
          setCurrentVerseIndexSync(nextIndex);
          playVerseAtIndexRef.current?.(item, nextIndex);
        }
      }
    } finally {
      loadingRef.current = false;
    }
  }, [setCurrentVerseIndexSync]);

  /**
   * Play chapter-level commentary (summary for entire chapter)
   */
  const playChapterCommentary = useCallback(async () => {
    const item = currentItemRef.current;
    if (!item || isStoppedRef.current) return;

    setIsPlayingCommentary(true);
    loadingRef.current = true;

    try {
      console.log(`[useAudioBible] Playing chapter commentary for ${item.book} ${item.chapter}`);

      // Build chapter text from all verses
      const chapterText = item.verses.map(v => `${v.verse}. ${v.text}`).join('\n');

      // Map tier to depth parameter
      const depthMap: Record<CommentaryTier, "surface" | "intermediate" | "depth"> = {
        surface: "surface",
        intermediate: "intermediate", 
        scholarly: "depth"
      };

      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Chapter commentary generation timed out")), 60000);
      });

      const commentaryPromise = generateChapterCommentary({
        book: item.book,
        chapter: item.chapter,
        chapterText,
        depth: depthMap[commentaryTierRef.current],
        generateAudio: true,
        voice: commentaryVoiceRef.current,
      });

      const result = await Promise.race([commentaryPromise, timeoutPromise]);

      if (isStoppedRef.current || !result) {
        console.log("[useAudioBible] Stopped or no chapter commentary result");
        loadingRef.current = false;
        setIsPlayingCommentary(false);
        return;
      }

      console.log(`[useAudioBible] Chapter commentary received: ${result.commentary?.substring(0, 100)}...`);
      setCurrentCommentary(result.commentary);

      if (result.audioUrl) {
        console.log("[useAudioBible] Playing chapter commentary audio URL");
        await audioEngine.play(result.audioUrl);
      } else if (result.commentary) {
        // Generate TTS for chapter commentary text
        console.log("[useAudioBible] Generating TTS for chapter commentary");
        const audioUrl = await generateTTSAudio({ text: result.commentary, voice: commentaryVoiceRef.current });
        if (audioUrl && !isStoppedRef.current) {
          await audioEngine.play(audioUrl);
        } else {
          // If TTS fails, just show text and auto-advance after delay
          console.log("[useAudioBible] TTS failed, showing chapter commentary text only");
          await new Promise(resolve => setTimeout(resolve, 10000));
          if (!isStoppedRef.current) {
            audioEngine.stop(); // Trigger "ended" event
          }
        }
      }
    } catch (error) {
      console.error("[useAudioBible] Chapter commentary error:", error);
      setCurrentCommentary("Chapter commentary unavailable.");
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!isStoppedRef.current) {
        setIsPlayingCommentary(false);
        setCurrentCommentary("");
        audioEngine.stop(); // Trigger "ended" event to continue
      }
    } finally {
      loadingRef.current = false;
    }
  }, []);

  /**
   * Play passage-level commentary (one cohesive commentary for a verse range)
   */
  const playPassageCommentary = useCallback(async () => {
    const item = currentItemRef.current;
    if (!item || isStoppedRef.current) return;

    setIsPlayingCommentary(true);
    loadingRef.current = true;

    try {
      const firstVerse = item.verses[0]?.verse || 1;
      const lastVerse = item.verses[item.verses.length - 1]?.verse || firstVerse;
      console.log(`[useAudioBible] Playing passage commentary for ${item.book} ${item.chapter}:${firstVerse}-${lastVerse}`);

      const passageText = item.verses.map(v => `${v.verse}. ${v.text}`).join('\n');

      const depthMap: Record<CommentaryTier, "surface" | "intermediate" | "depth"> = {
        surface: "surface",
        intermediate: "intermediate",
        scholarly: "depth"
      };

      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Passage commentary generation timed out")), 60000);
      });

      const commentaryPromise = generatePassageCommentary({
        book: item.book,
        chapter: item.chapter,
        startVerse: firstVerse,
        endVerse: lastVerse,
        passageText,
        depth: depthMap[commentaryTierRef.current],
        generateAudio: true,
        voice: commentaryVoiceRef.current,
        commentarySource: commentarySourceRef.current,
      });

      const result = await Promise.race([commentaryPromise, timeoutPromise]);

      if (isStoppedRef.current || !result) {
        console.log("[useAudioBible] Stopped or no passage commentary result");
        loadingRef.current = false;
        setIsPlayingCommentary(false);
        return;
      }

      console.log(`[useAudioBible] Passage commentary received: ${result.commentary?.substring(0, 100)}...`);
      setCurrentCommentary(result.commentary);

      if (result.audioUrl) {
        console.log("[useAudioBible] Playing passage commentary audio URL");
        await audioEngine.play(result.audioUrl);
      } else if (result.commentary) {
        console.log("[useAudioBible] Generating TTS for passage commentary");
        const audioUrl = await generateTTSAudio({ text: result.commentary, voice: commentaryVoiceRef.current });
        if (audioUrl && !isStoppedRef.current) {
          await audioEngine.play(audioUrl);
        } else {
          console.log("[useAudioBible] TTS failed, showing passage commentary text only");
          await new Promise(resolve => setTimeout(resolve, 10000));
          if (!isStoppedRef.current) {
            audioEngine.stop();
          }
        }
      }
    } catch (error) {
      console.error("[useAudioBible] Passage commentary error:", error);
      setCurrentCommentary("Passage commentary unavailable.");
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!isStoppedRef.current) {
        setIsPlayingCommentary(false);
        setCurrentCommentary("");
        audioEngine.stop();
      }
    } finally {
      loadingRef.current = false;
    }
  }, []);

  /**
   * Play a specific verse
   */
  const playVerseAtIndex = useCallback(async (item: PlaybackItem, index: number) => {
    if (isStoppedRef.current) return;

    const verse = item.verses[index];
    if (!verse) return;

    onVerseChangeRef.current?.(item.book, item.chapter, verse.verse);

    // If commentary only, skip verse reading
    if (commentaryOnlyRef.current) {
      setIsPlayingCommentary(true);
      await playCurrentVerseCommentary();
      return;
    }

    loadingRef.current = true;

    try {
      // Generate TTS for verse text
      const verseWithRef = `${item.book} chapter ${item.chapter}, verse ${verse.verse}. ${verse.text}`;
      const audioUrl = await generateTTSAudio({ text: verseWithRef, voice: voiceRef.current });

      if (isStoppedRef.current) return;

      if (audioUrl) {
        // Start playing verse audio
        await audioEngine.play(audioUrl);

        // Pre-fetch commentary while verse plays (for mobile performance, not for passage mode)
        if (includeCommentaryRef.current && !commentaryOnlyRef.current && commentaryModeRef.current !== "passage") {
          prefetchCurrentCommentary().catch(console.error);
        }
      } else {
        // TTS failed for this verse - log and advance to next verse instead of silently stopping
        console.warn(`[useAudioBible] TTS failed for ${item.book} ${item.chapter}:${verse.verse}, advancing...`);
        loadingRef.current = false;
        const nextIndex = index + 1;
        if (nextIndex < item.verses.length) {
          setCurrentVerseIndexSync(nextIndex);
          playVerseAtIndexRef.current?.(item, nextIndex);
        } else {
          onChapterCompleteRef.current?.(item.book, item.chapter);
          if (playbackQueueRef.current.length > 0) {
            const nextItem = playbackQueueRef.current.shift()!;
            startPlayback(nextItem);
          } else {
            currentItemRef.current = null;
            setAudioState("idle");
          }
        }
        return;
      }
    } catch (error) {
      console.error("[useAudioBible] Verse playback error:", error);
      // On error, advance to next verse instead of stopping
      loadingRef.current = false;
      const nextIndex = index + 1;
      if (!isStoppedRef.current && nextIndex < item.verses.length) {
        setCurrentVerseIndexSync(nextIndex);
        playVerseAtIndexRef.current?.(item, nextIndex);
      }
      return;
    } finally {
      loadingRef.current = false;
    }
  }, [playCurrentVerseCommentary, prefetchCurrentCommentary]);

  // Keep playVerseAtIndex ref updated
  useEffect(() => { playVerseAtIndexRef.current = playVerseAtIndex; }, [playVerseAtIndex]);

  /**
   * Start playback for an item
   */
  const startPlayback = useCallback(async (item: PlaybackItem) => {
    currentItemRef.current = item;
    isStoppedRef.current = false;

    setCurrentBook(item.book);
    setCurrentChapter(item.chapter);
    setIsPlayingCommentary(false);
    setCurrentCommentary("");

    // If verses are empty (queued item), fetch them on demand
    if (item.verses.length === 0) {
      setAudioState("loading");
      try {
        const verses = await fetchChapterVerses(item.book, item.chapter);
        if (isStoppedRef.current) return;
        if (verses.length === 0) {
          console.warn(`[useAudioBible] No verses found for ${item.book} ${item.chapter}, skipping`);
          // Skip to next queued item
          if (playbackQueueRef.current.length > 0) {
            const nextItem = playbackQueueRef.current.shift()!;
            startPlayback(nextItem);
          } else {
            setAudioState("idle");
          }
          return;
        }
        item.verses = verses;
      } catch (err) {
        console.error("[useAudioBible] Failed to fetch verses for queued chapter:", err);
        if (playbackQueueRef.current.length > 0) {
          const nextItem = playbackQueueRef.current.shift()!;
          startPlayback(nextItem);
        } else {
          setAudioState("idle");
        }
        return;
      }
    }

    setCurrentVerseIndexSync(0);
    setTotalVerses(item.verses.length);

    // Prefetch commentary for upcoming verses in the background (not for passage mode)
    if (includeCommentaryRef.current && commentaryModeRef.current !== "passage" && item.verses.length > 1) {
      prefetchUpcomingCommentary(
        item.book,
        item.chapter,
        0,
        item.verses,
        commentaryTierRef.current,
        3
      ).catch(console.error);
    }

    playVerseAtIndex(item, 0);
  }, [playVerseAtIndex, setCurrentVerseIndexSync]);

  /**
   * Handle when current audio ends - uses refs to avoid stale closures
   */
  const handlePlaybackEnded = useCallback(() => {
    if (isStoppedRef.current) return;

    const item = currentItemRef.current;
    if (!item) return;

    console.log(`[useAudioBible] Playback ended. isPlayingCommentary: ${isPlayingCommentaryRef.current}, includeCommentary: ${includeCommentaryRef.current}, commentaryMode: ${commentaryModeRef.current}`);

    // If we just played a verse and verse-by-verse commentary is enabled, play verse commentary next
    // Skip this if commentaryMode is "chapter" or "passage" - we'll play summary at the end instead
    if (!isPlayingCommentaryRef.current && includeCommentaryRef.current && !commentaryOnlyRef.current && commentaryModeRef.current === "verse") {
      console.log("[useAudioBible] Starting verse commentary playback");
      playCurrentVerseCommentary();
      return;
    }

    // Move to next verse
    setIsPlayingCommentary(false);
    setCurrentCommentary("");

    const nextIndex = currentVerseIndexRef.current + 1;
    console.log(`[useAudioBible] Moving to verse index ${nextIndex} of ${item.verses.length}`);

    if (nextIndex < item.verses.length) {
      setCurrentVerseIndexSync(nextIndex);

      // Prefetch more commentary ahead when advancing verses (not for passage mode)
      if (includeCommentaryRef.current && commentaryModeRef.current !== "passage" && nextIndex + 2 < item.verses.length) {
        prefetchUpcomingCommentary(
          item.book,
          item.chapter,
          nextIndex,
          item.verses,
          commentaryTierRef.current,
          3 // Keep 3 verses ahead prefetched
        ).catch(console.error);
      }

      playVerseAtIndex(item, nextIndex);
    } else {
      // Chapter complete - check if we need to play chapter/passage summary commentary
      if (includeCommentaryRef.current && commentaryModeRef.current === "chapter" && !isPlayingCommentaryRef.current) {
        console.log("[useAudioBible] Playing chapter summary commentary");
        playChapterCommentary();
        return;
      }
      if (includeCommentaryRef.current && commentaryModeRef.current === "passage" && !isPlayingCommentaryRef.current) {
        console.log("[useAudioBible] Playing passage commentary");
        playPassageCommentary();
        return;
      }
      
      onChapterCompleteRef.current?.(item.book, item.chapter);

      // Check for more items in queue
      if (playbackQueueRef.current.length > 0) {
        const nextItem = playbackQueueRef.current.shift()!;
        startPlayback(nextItem);
      } else {
        // All done
        currentItemRef.current = null;
        setAudioState("idle");
      }
    }
  }, [playCurrentVerseCommentary, playPassageCommentary, playVerseAtIndex, startPlayback, setCurrentVerseIndexSync]);

  // Subscribe to audio engine events - use ref to always get latest handler
  const handlePlaybackEndedRef = useRef(handlePlaybackEnded);
  useEffect(() => { handlePlaybackEndedRef.current = handlePlaybackEnded; }, [handlePlaybackEnded]);

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      setAudioState(state);

      if (state === "ended") {
        handlePlaybackEndedRef.current();
      }
    });

    return unsubscribe;
  }, []);

  /**
   * Play a chapter
   */
  const playChapter = useCallback(async (book: string, chapter: number, verses: Verse[]) => {
    if (!isUnlocked) {
      await unlock();
    }

    isStoppedRef.current = false;
    playbackQueueRef.current = [];

    const item: PlaybackItem = { book, chapter, verses };
    startPlayback(item);
  }, [isUnlocked, unlock, startPlayback]);

  /**
   * Add chapters to queue
   */
  const queueChapters = useCallback((items: PlaybackItem[]) => {
    playbackQueueRef.current.push(...items);
  }, []);

  /**
   * Play a single verse
   */
  const playSingleVerse = useCallback(async (book: string, chapter: number, verse: number, text: string) => {
    if (!isUnlocked) {
      await unlock();
    }

    isStoppedRef.current = false;
    playbackQueueRef.current = [];

    const item: PlaybackItem = {
      book,
      chapter,
      verses: [{ verse, text }],
    };
    startPlayback(item);
  }, [isUnlocked, unlock, startPlayback]);

  /**
   * Pause playback
   */
  const pause = useCallback(() => {
    audioEngine.pause();
  }, []);

  /**
   * Resume playback
   */
  const resume = useCallback(() => {
    audioEngine.resume();
  }, []);

  /**
   * Stop playback completely
   */
  const stop = useCallback(() => {
    isStoppedRef.current = true;
    playbackQueueRef.current = [];
    currentItemRef.current = null;
    audioEngine.stop();
    setCurrentBook("");
    setCurrentChapter(0);
    setCurrentVerseIndex(0);
    setTotalVerses(0);
    setIsPlayingCommentary(false);
    setCurrentCommentary("");
  }, []);

  /**
   * Skip to next verse
   */
  const skipNext = useCallback(() => {
    const item = currentItemRef.current;
    if (!item) return;

    audioEngine.stop();

    const nextIndex = currentVerseIndexRef.current + 1;
    if (nextIndex < item.verses.length) {
      setCurrentVerseIndexSync(nextIndex);
      setIsPlayingCommentary(false);
      playVerseAtIndex(item, nextIndex);
    }
  }, [playVerseAtIndex, setCurrentVerseIndexSync]);

  /**
   * Skip to previous verse
   */
  const skipPrevious = useCallback(() => {
    const item = currentItemRef.current;
    if (!item) return;

    audioEngine.stop();

    const prevIndex = Math.max(0, currentVerseIndexRef.current - 1);
    setCurrentVerseIndexSync(prevIndex);
    setIsPlayingCommentary(false);
    playVerseAtIndex(item, prevIndex);
  }, [playVerseAtIndex, setCurrentVerseIndexSync]);

  // Computed states
  const isPlaying = audioState === "playing";
  const isPaused = audioState === "paused";
  const isLoading = audioState === "loading" || loadingRef.current;
  const isIdle = audioState === "idle";
  const currentVerse = currentItemRef.current?.verses[currentVerseIndex];

  return {
    // State
    isPlaying,
    isPaused,
    isLoading,
    isIdle,
    isUnlocked,
    audioState,

    // Playback info
    currentBook,
    currentChapter,
    currentVerse: currentVerse?.verse || 0,
    currentVerseText: currentVerse?.text || "",
    currentVerseIndex,
    totalVerses,
    isPlayingCommentary,
    currentCommentary,

    // Settings
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

    // Actions
    unlock,
    playChapter,
    playSingleVerse,
    queueChapters,
    pause,
    resume,
    stop,
    skipNext,
    skipPrevious,

    // Constants
    voices: OPENAI_VOICES,
  };
}
