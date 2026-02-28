// ─── Audio Training Playlist ────────────────────────────────────────────────
// Lets users build a custom playlist from unlocked War College days and play them sequentially.

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListMusic, Plus, Trash2, Play, Pause, SkipForward, SkipBack,
  Loader2, GripVertical, ChevronDown, ChevronUp, Headphones, X, Check, Shuffle, ArrowDownAZ, MousePointerClick,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OPENAI_VOICES, VoiceId } from "@/hooks/useTextToSpeech";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { getRankForDay, RANK_CONFIG } from "@/data/aats/warCollegeTypes";
import type { WarCollegeDay } from "@/data/aats/warCollegeTypes";
import { setupMediaSession, updateMediaSessionPlaybackState, clearMediaSession } from "@/lib/mediaSessionHelper";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PlaylistItem {
  dayNumber: number;
  avatarId: string;
  avatarName: string;
  trackTitle: string;
  title?: string;
  manuscript?: string; // loaded on demand
  loaded: boolean;
}

interface CrossTrackInfo {
  avatarId: string;
  avatarName: string;
  trackTitle: string;
  emoji: string;
}

/** Sortable queue item */
function SortableQueueItem({
  item, idx, isCurrent, isPlaying, isLoading, avatarId,
  onPlay, onRemove,
}: {
  item: PlaylistItem; idx: number; isCurrent: boolean; isPlaying: boolean;
  isLoading: boolean; avatarId: string;
  onPlay: (idx: number) => void; onRemove: (idx: number) => void;
}) {
  const sortableId = `${item.avatarId}-${item.dayNumber}-${idx}`;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sortableId });
  const rank = getRankForDay(item.dayNumber);
  const ri = RANK_CONFIG[rank];
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => { if (!isCurrent && !isLoading) onPlay(idx); }}
      className={`
        flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all cursor-pointer
        ${isCurrent ? "bg-amber-500/15 border border-amber-500/30" : "hover:bg-muted/30"}
      `}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <span className="w-5 text-center font-mono text-muted-foreground">
        {isCurrent && isPlaying ? "▶" : idx + 1}
      </span>
      <span className="font-medium flex-1 truncate">
        {item.avatarId !== avatarId && (
          <span className="text-primary/70 mr-1">[{item.avatarName}]</span>
        )}
        Day {item.dayNumber}
        {item.title && <span className="text-muted-foreground ml-1">— {item.title}</span>}
      </span>
      <Badge variant="outline" className={`${ri.color} border-current/20 text-[9px] h-4 px-1`}>
        {ri.emoji}
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
        onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

interface AudioTrainingPlaylistProps {
  trackTitle: string;
  avatarId: string;
  avatarName: string;
  /** The highest unlocked day (nextDay from track view) */
  maxUnlockedDay: number;
  totalDays: number;
  completedDays: Set<number>;
  onLoadDay: (dayNumber: number) => Promise<WarCollegeDay | null>;
  /** All available tracks for cross-track "Add Day X of All Avatars" */
  allTracks?: CrossTrackInfo[];
  /** Loader that works across tracks */
  onLoadDayCrossTrack?: (avatarId: string, dayNumber: number) => Promise<WarCollegeDay | null>;
}

export function AudioTrainingPlaylist({
  trackTitle,
  avatarId,
  avatarName,
  maxUnlockedDay,
  totalDays,
  completedDays,
  onLoadDay,
  allTracks,
  onLoadDayCrossTrack,
}: AudioTrainingPlaylistProps) {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatarPickerDay, setAvatarPickerDay] = useState<number | null>(null);
  const [selectedAvatars, setSelectedAvatars] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>("onyx");
  const [expanded, setExpanded] = useState(true);
  const [playOrder, setPlayOrder] = useState<"listed" | "random" | "manual">("listed");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadingRef = useRef(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const sortableIds = useMemo(
    () => playlist.map((item, idx) => `${item.avatarId}-${item.dayNumber}-${idx}`),
    [playlist],
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sortableIds.indexOf(active.id as string);
    const newIndex = sortableIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    setPlaylist((prev) => arrayMove(prev, oldIndex, newIndex));
    setCurrentIndex((prev) => {
      if (prev === oldIndex) return newIndex;
      if (oldIndex < prev && newIndex >= prev) return prev - 1;
      if (oldIndex > prev && newIndex <= prev) return prev + 1;
      return prev;
    });
  }, [sortableIds]);

  // Helper to resolve the correct loader for a playlist item
  const resolveLoader = useCallback((item: PlaylistItem) => {
    if (item.avatarId === avatarId) {
      return onLoadDay(item.dayNumber);
    }
    if (onLoadDayCrossTrack) {
      return onLoadDayCrossTrack(item.avatarId, item.dayNumber);
    }
    return onLoadDay(item.dayNumber);
  }, [avatarId, onLoadDay, onLoadDayCrossTrack]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const availableDays = Array.from({ length: maxUnlockedDay }, (_, i) => i + 1);

  const makeItem = (dayNumber: number, aId?: string, aName?: string, tTitle?: string): PlaylistItem => ({
    dayNumber,
    avatarId: aId || avatarId,
    avatarName: aName || avatarName,
    trackTitle: tTitle || trackTitle,
    loaded: false,
  });

  const addToPlaylist = (dayNumber: number) => {
    if (playlist.some((p) => p.dayNumber === dayNumber && p.avatarId === avatarId)) {
      toast.info(`Day ${dayNumber} is already in the playlist.`);
      return;
    }
    setPlaylist((prev) => [...prev, makeItem(dayNumber)]);
  };

  const addAllUnlockedToPlaylist = () => {
    const existing = new Set(playlist.map((p) => `${p.avatarId}-${p.dayNumber}`));
    const toAdd = availableDays
      .filter((d) => !existing.has(`${avatarId}-${d}`))
      .map((dayNumber) => makeItem(dayNumber));

    if (toAdd.length === 0) {
      toast.info("All unlocked days are already in the playlist.");
      return;
    }

    setPlaylist((prev) => [...prev, ...toAdd]);
  };

  const addCurrentWeekToPlaylist = () => {
    const week = Math.ceil(maxUnlockedDay / 7);
    const start = (week - 1) * 7 + 1;
    const currentWeekDays = Array.from(
      { length: maxUnlockedDay - start + 1 },
      (_, index) => start + index,
    );

    const existing = new Set(playlist.map((p) => `${p.avatarId}-${p.dayNumber}`));
    const toAdd = currentWeekDays
      .filter((d) => !existing.has(`${avatarId}-${d}`))
      .map((dayNumber) => makeItem(dayNumber));

    if (toAdd.length === 0) {
      toast.info("Current week is already in your playlist.");
      return;
    }

    setPlaylist((prev) => [...prev, ...toAdd]);
  };

  /** Add a specific day from selected avatar tracks */
  const addDaySelectedAvatars = (dayNumber: number, avatarIds: Set<string>) => {
    console.log("[Playlist] addDaySelectedAvatars:", { dayNumber, avatarCount: avatarIds.size, allTracksCount: allTracks?.length, avatarIds: [...avatarIds] });
    if (!allTracks || allTracks.length === 0 || avatarIds.size === 0) return;
    const existing = new Set(playlist.map((p) => `${p.avatarId}-${p.dayNumber}`));
    const toAdd = allTracks
      .filter((t) => avatarIds.has(t.avatarId) && !existing.has(`${t.avatarId}-${dayNumber}`))
      .map((t) => makeItem(dayNumber, t.avatarId, t.avatarName, t.trackTitle));

    if (toAdd.length === 0) {
      toast.info(`Day ${dayNumber} from selected avatars is already queued.`);
      return;
    }

    setPlaylist((prev) => [...prev, ...toAdd]);
    toast.success(`Added Day ${dayNumber} from ${toAdd.length} avatar${toAdd.length > 1 ? 's' : ''}!`);
  };

  /** Open the avatar picker for a specific day */
  const openAvatarPicker = (dayNumber: number) => {
    setAvatarPickerDay(dayNumber);
    // Pre-select all avatars by default
    if (allTracks) {
      setSelectedAvatars(new Set(allTracks.map(t => t.avatarId)));
    }
    setShowAvatarPicker(true);
  };

  const toggleAvatarSelection = (avatarId: string) => {
    setSelectedAvatars(prev => {
      const next = new Set(prev);
      if (next.has(avatarId)) {
        next.delete(avatarId);
      } else {
        next.add(avatarId);
      }
      return next;
    });
  };

  const confirmAvatarSelection = () => {
    if (avatarPickerDay !== null && selectedAvatars.size > 0) {
      addDaySelectedAvatars(avatarPickerDay, selectedAvatars);
    }
    setShowAvatarPicker(false);
    setAvatarPickerDay(null);
  };

  const removeFromPlaylist = (idx: number) => {
    if (idx === currentIndex) {
      stopPlayback();
    } else if (idx < currentIndex) {
      setCurrentIndex((prev) => prev - 1);
    }
    setPlaylist((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearPlaylist = () => {
    stopPlayback();
    setPlaylist([]);
    setCurrentIndex(-1);
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    notifyTTSStopped();
    clearMediaSession();
  };

  // Tiny silent MP3 for priming audio element in user gesture context
  const SILENT_MP3 = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRwBHAAAAAAD/+1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

  const playItem = useCallback(async (index: number, userInitiated = false) => {
    if (index < 0 || index >= playlist.length) {
      stopPlayback();
      setCurrentIndex(-1);
      toast.success("Playlist complete! 🎧");
      return;
    }
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);
    setCurrentIndex(index);

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

    if (userInitiated) {
      try {
        audio.src = SILENT_MP3;
        await audio.play();
        audio.pause();
      } catch {
        // Best effort
      }
    }

    try {
      let item = playlist[index];

      // Load manuscript if not cached
      if (!item.manuscript) {
        const study = await resolveLoader(item);
        if (!study) throw new Error("Failed to load manuscript");
        item = { ...item, manuscript: study.manuscript, title: study.title, loaded: true };
        setPlaylist((prev) => prev.map((p, i) => (i === index ? item : p)));
      }

      // Generate TTS
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/text-to-speech`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            text: item.manuscript,
            voice: selectedVoice,
            speed: 1.0,
            returnType: "url",
          }),
        }
      );

      if (!response.ok) throw new Error(`TTS failed: ${response.status}`);
      const data = await response.json();

      let url: string;
      if (data.audioUrl) {
        // Fetch as blob to avoid CORS/redirect issues on mobile
        try {
          const audioResponse = await fetch(data.audioUrl);
          const blob = await audioResponse.blob();
          url = URL.createObjectURL(blob);
        } catch {
          url = data.audioUrl;
        }
      } else if (data.audioContent) {
        url = `data:audio/mpeg;base64,${data.audioContent}`;
      } else {
        throw new Error("No audio data");
      }

      // Audio element already cleaned up at the top of playItem

      audio.src = url;
      audioRef.current = audio;

      audio.onloadedmetadata = () => setDuration(audio.duration);
      audio.ontimeupdate = () => {
        if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
      };
      audio.onended = () => {
        notifyTTSStopped();
        loadingRef.current = false;
        if (playOrder === "manual") {
          // In manual mode, stop and let user pick next
          setIsPlaying(false);
          toast.info("Track finished. Pick the next one from the queue.");
        } else {
          void playItem(index + 1, false);
        }
      };
      audio.onerror = () => {
        toast.error(`Audio error on Day ${item.dayNumber}. Skipping...`);
        loadingRef.current = false;
        if (playOrder === "manual") {
          setIsPlaying(false);
        } else {
          void playItem(index + 1, false);
        }
      };

      audio.load();
      await audio.play();
      setIsPlaying(true);
      notifyTTSStarted();

      // Register with Media Session for lock-screen / background playback
      setupMediaSession({
        title: `Day ${item.dayNumber}${item.title ? ' — ' + item.title : ''}`,
        artist: 'Phototheology Palace',
        album: trackTitle || 'War College',
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
        onNextTrack: () => skipNext(),
        onPreviousTrack: () => skipPrev(),
      });
      updateMediaSessionPlaybackState('playing');
    } catch (err: any) {
      console.error("Playlist playback error:", err);
      toast.error(err.message || "Playback failed");
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [playlist, selectedVoice, onLoadDay, resolveLoader, playOrder]);

  const shufflePlaylist = () => {
    setPlaylist(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  };

  const togglePlayPause = () => {
    if (playlist.length === 0) {
      toast.info("Add days to the playlist first.");
      return;
    }
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      notifyTTSStopped();
    } else if (!isPlaying && audioRef.current && currentIndex >= 0) {
      void audioRef.current.play().then(() => {
        setIsPlaying(true);
        notifyTTSStarted();
      }).catch((error) => {
        console.error("Resume play failed:", error);
        toast.error("Playback blocked. Tap Play again.");
      });
    } else {
      // Shuffle if random mode and starting fresh
      if (playOrder === "random" && currentIndex < 0) {
        shufflePlaylist();
      }
      // Start from beginning or current
      void playItem(currentIndex >= 0 ? currentIndex : 0, true);
    }
  };

  const skipNext = () => {
    if (currentIndex < playlist.length - 1) {
      stopPlayback();
      void playItem(currentIndex + 1, true);
    }
  };

  const skipPrev = () => {
    if (currentIndex > 0) {
      stopPlayback();
      void playItem(currentIndex - 1, true);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (value[0] / 100) * duration;
      setProgress(value[0]);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const currentItem = currentIndex >= 0 ? playlist[currentIndex] : null;

  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ListMusic className="h-4 w-4" />
            Audio Training Playlist
            {playlist.length > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                {playlist.length}
              </Badge>
            )}
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {playlist.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearPlaylist} className="text-xs h-7 text-muted-foreground">
              <Trash2 className="h-3 w-3 mr-1" /> Clear
            </Button>
          )}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 overflow-hidden"
            >
              {/* Voice Selector + CTA */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Voice:</span>
                  <Select value={selectedVoice} onValueChange={(v) => setSelectedVoice(v as VoiceId)}>
                    <SelectTrigger className="w-[110px] h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      {OPENAI_VOICES.map((v) => (
                        <SelectItem key={v.id} value={v.id} className="text-xs">
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground">Order:</span>
                  <Select value={playOrder} onValueChange={(v) => setPlayOrder(v as "listed" | "random" | "manual")}>
                    <SelectTrigger className="w-[110px] h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="listed" className="text-xs">
                        <span className="flex items-center gap-1"><ArrowDownAZ className="h-3 w-3" /> In Order</span>
                      </SelectItem>
                      <SelectItem value="random" className="text-xs">
                        <span className="flex items-center gap-1"><Shuffle className="h-3 w-3" /> Random</span>
                      </SelectItem>
                      <SelectItem value="manual" className="text-xs">
                        <span className="flex items-center gap-1"><MousePointerClick className="h-3 w-3" /> Manual</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => setShowPicker(!showPicker)}
                  >
                    <Plus className="h-3 w-3" />
                    Add Days
                  </Button>
                </div>

                <div className="rounded-md border border-border/60 bg-muted/20 p-2.5">
                  <p className="text-[11px] font-medium">Start here</p>
                  <p className="text-[11px] text-muted-foreground">
                    Build your playlist fast with quick-add, then tap Play.
                  </p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <Button variant="secondary" size="sm" className="h-6 text-[10px]" onClick={addCurrentWeekToPlaylist}>
                      Add Current Week
                    </Button>
                    <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={addAllUnlockedToPlaylist}>
                      Add All Unlocked
                    </Button>
                    {allTracks && allTracks.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-[10px] border-primary/30 text-primary gap-1 px-2"
                        onClick={() => {
                          if (showAvatarPicker) {
                            setShowAvatarPicker(false);
                          } else {
                            setShowAvatarPicker(true);
                            setAvatarPickerDay(null);
                            setSelectedAvatars(new Set(allTracks.map(t => t.avatarId)));
                          }
                        }}
                      >
                        🌐 Add Day — Choose Avatars {showAvatarPicker ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Day Picker */}
              <AnimatePresence>
                {showPicker && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <Card className="border-border/50">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            Select days to add (up to Day {maxUnlockedDay})
                          </p>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowPicker(false)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto">
                          {availableDays.map((d) => {
                            const inPlaylist = playlist.some((p) => p.dayNumber === d && p.avatarId === avatarId);
                            const done = completedDays.has(d);
                            const rank = getRankForDay(d);
                            const ri = RANK_CONFIG[rank];
                            return (
                              <button
                                key={d}
                                onClick={() => inPlaylist ? undefined : addToPlaylist(d)}
                                className={`
                                  relative h-9 w-9 rounded-md text-xs font-bold border transition-all
                                  ${inPlaylist
                                    ? "bg-amber-500/20 border-amber-500/50 text-amber-400 ring-1 ring-amber-500/30"
                                    : done
                                      ? "bg-green-500/10 border-green-500/30 text-green-400 hover:border-amber-500/50"
                                      : "bg-muted/30 border-border/50 text-muted-foreground hover:border-amber-500/50"
                                  }
                                `}
                              >
                                {inPlaylist && (
                                  <Check className="absolute top-0 right-0 h-2.5 w-2.5 text-amber-400" />
                                )}
                                {d}
                              </button>
                            );
                          })}
                        </div>
                        {/* Quick-add buttons */}
                        <div className="flex gap-2 flex-wrap pt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-[10px]"
                            onClick={addAllUnlockedToPlaylist}
                          >
                            Add All Unlocked
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-[10px]"
                            onClick={addCurrentWeekToPlaylist}
                          >
                            Add Current Week
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Avatar Picker for cross-track day add */}
              <AnimatePresence>
                {showAvatarPicker && allTracks && allTracks.length > 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <Card className="border-primary/30">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium">
                            Add Day — Choose Avatars
                          </p>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowAvatarPicker(false)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Day selector */}
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground">Pick a day:</p>
                          <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto">
                            {availableDays.map((d) => (
                              <button
                                key={d}
                                onClick={() => setAvatarPickerDay(d)}
                                className={`
                                  h-7 w-7 rounded-md text-[10px] font-bold border transition-all
                                  ${avatarPickerDay === d
                                    ? "bg-primary/20 border-primary/50 text-primary ring-1 ring-primary/30"
                                    : "bg-muted/30 border-border/50 text-muted-foreground hover:border-primary/40"
                                  }
                                `}
                              >
                                {d}
                              </button>
                            ))}
                          </div>
                        </div>

                        {avatarPickerDay !== null && (
                          <>
                            {/* Avatar selection */}
                            <div className="flex gap-1.5 flex-wrap">
                              <Button
                                variant={selectedAvatars.size === allTracks.length ? "default" : "outline"}
                                size="sm"
                                className="h-6 text-[10px]"
                                onClick={() => setSelectedAvatars(new Set(allTracks.map(t => t.avatarId)))}
                              >
                                Select All ({allTracks.length})
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-[10px]"
                                onClick={() => setSelectedAvatars(new Set())}
                              >
                                Clear
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto">
                              {allTracks.map((t) => {
                                const isSelected = selectedAvatars.has(t.avatarId);
                                return (
                                  <button
                                    key={t.avatarId}
                                    onClick={() => toggleAvatarSelection(t.avatarId)}
                                    className={`
                                      relative px-2 py-1 rounded-md text-[10px] font-medium border transition-all
                                      ${isSelected
                                        ? "bg-primary/15 border-primary/50 text-primary ring-1 ring-primary/30"
                                        : "bg-muted/30 border-border/50 text-muted-foreground hover:border-primary/40"
                                      }
                                    `}
                                  >
                                    {isSelected && <Check className="inline h-2.5 w-2.5 mr-0.5" />}
                                    {t.emoji} {t.avatarName}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                              <Button
                                size="sm"
                                className="h-6 text-[10px]"
                                disabled={selectedAvatars.size === 0}
                                onClick={confirmAvatarSelection}
                              >
                                Add Day {avatarPickerDay} × {selectedAvatars.size} Avatar{selectedAvatars.size !== 1 ? 's' : ''}
                              </Button>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Playlist Queue — drag to reorder */}
              {playlist.length > 0 && (
              <div>
                <p className="text-[10px] text-muted-foreground px-1 mb-1">
                  Queue: {playlist.length} item{playlist.length !== 1 ? 's' : ''} · drag to reorder
                </p>
                <ScrollArea className="max-h-[400px]">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                      <div className="space-y-1">
                        {playlist.map((item, idx) => (
                          <SortableQueueItem
                            key={`${item.avatarId}-${item.dayNumber}-${idx}`}
                            item={item}
                            idx={idx}
                            isCurrent={idx === currentIndex}
                            isPlaying={isPlaying}
                            isLoading={isLoading}
                            avatarId={avatarId}
                            onPlay={(i) => { stopPlayback(); void playItem(i, true); }}
                            onRemove={removeFromPlaylist}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </ScrollArea>
              </div>
              )}

              {/* Playback Controls */}
              {playlist.length > 0 && (
                <div className="space-y-2">
                  <Separator />
                  {/* Now playing label */}
                  {currentItem && (
                    <p className="text-[10px] text-center text-muted-foreground">
                      {isLoading ? "Loading..." : `Now Playing: Day ${currentItem.dayNumber}`}
                      {currentItem.title && ` — ${currentItem.title}`}
                      <span className="ml-2">({currentIndex + 1}/{playlist.length})</span>
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipPrev} disabled={currentIndex <= 0 || isLoading}>
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={togglePlayPause}
                      disabled={isLoading}
                      size="icon"
                      className="h-10 w-10 rounded-full bg-amber-500 hover:bg-amber-600 text-amber-950"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipNext} disabled={currentIndex >= playlist.length - 1 || isLoading}>
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 space-y-0.5">
                      <Slider
                        value={[progress]}
                        max={100}
                        step={0.1}
                        onValueChange={handleProgressChange}
                        disabled={!audioRef.current}
                        className="cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>{formatTime((progress / 100) * duration)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {playlist.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Headphones className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium">No days in playlist yet.</p>
                  <p className="text-[10px]">Tap “Add Current Week” to start instantly.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
