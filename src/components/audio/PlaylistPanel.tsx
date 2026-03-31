import { useState, useRef, useEffect, useCallback } from "react";
import { useImmersiveMode, type ImmersiveTrack } from "@/hooks/useImmersiveMode";
import { ImmersiveAudioPlayer } from "@/components/audio/ImmersiveAudioPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ListMusic,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Trash2,
  Volume2,
  VolumeX,
  X,
  Loader2,
  Headphones,
  BookOpen,
  Compass,
  Swords,
  GripVertical,
  Maximize2,
  Plus,
  ChevronDown,
  Pencil,
  Check,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { usePlaylist, PlaylistItem } from "@/hooks/usePlaylist";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const AUDIO_TYPE_ICONS: Record<string, React.ReactNode> = {
  commentary: <BookOpen className="h-4 w-4" />,
  tour: <Compass className="h-4 w-4" />,
  apologetics: <Swords className="h-4 w-4" />,
  default: <Headphones className="h-4 w-4" />,
};

const AUDIO_TYPE_LABELS: Record<string, string> = {
  commentary: "Commentary",
  tour: "Audio Tour",
  apologetics: "Apologetics",
  devotional: "Devotional",
  study: "Study",
  music: "Music",
};

function getTypeIcon(type: string) {
  return AUDIO_TYPE_ICONS[type] || AUDIO_TYPE_ICONS.default;
}

function getTypeLabel(type: string) {
  return AUDIO_TYPE_LABELS[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

// Sortable playlist item component
function SortablePlaylistItem({
  item,
  idx,
  isCurrent,
  isPlaying,
  onPlay,
  onRemove,
  onImmerse,
}: {
  item: PlaylistItem;
  idx: number;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onRemove: () => void;
  onImmerse: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

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
      className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
        isCurrent
          ? "bg-primary/10 border border-primary/30"
          : "hover:bg-muted/50"
      }`}
      onClick={onPlay}
    >
      <button
        className="flex-shrink-0 touch-none text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className={`flex-shrink-0 ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
        {isCurrent && isPlaying ? (
          <Volume2 className="h-4 w-4 animate-pulse" />
        ) : (
          getTypeIcon(item.audio_type)
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isCurrent ? "text-primary" : ""}`}>
          {item.title}
        </p>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
        )}
        <Badge variant="outline" className="mt-1 text-[10px] px-1.5 py-0">
          {getTypeLabel(item.audio_type)}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 flex-shrink-0 text-primary hover:bg-primary/10"
        onClick={(e) => {
          e.stopPropagation();
          onImmerse();
        }}
        title="Immerse Mode"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// Playlist selector/creator component
function PlaylistSelector({
  playlists,
  activePlaylistId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: {
  playlists: { id: string; name: string }[];
  activePlaylistId: string | null;
  onSelect: (id: string | null) => void;
  onCreate: (name: string) => Promise<any>;
  onRename: (id: string, name: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const activePlaylist = playlists.find(p => p.id === activePlaylistId);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await onCreate(newName);
    setNewName("");
    setIsCreating(false);
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    await onRename(id, editName);
    setEditingId(null);
  };

  if (isCreating) {
    return (
      <div className="flex items-center gap-1.5 px-4 py-2 border-b">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Playlist name..."
          className="h-8 text-sm"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
            if (e.key === "Escape") setIsCreating(false);
          }}
        />
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCreate}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsCreating(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-4 py-2 border-b">
      {editingId ? (
        <div className="flex items-center gap-1.5 flex-1">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="h-8 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename(editingId);
              if (e.key === "Escape") setEditingId(null);
            }}
          />
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleRename(editingId)}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 justify-between h-8 text-sm">
                <span className="truncate">{activePlaylist?.name || "No Playlist"}</span>
                <ChevronDown className="h-3.5 w-3.5 ml-1 flex-shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {playlists.map(pl => (
                <DropdownMenuItem
                  key={pl.id}
                  className="flex items-center justify-between"
                  onClick={() => onSelect(pl.id)}
                >
                  <span className="truncate">{pl.name}</span>
                  {pl.id === activePlaylistId && (
                    <Check className="h-3.5 w-3.5 text-primary ml-2 flex-shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
              {playlists.length === 0 && (
                <DropdownMenuItem disabled>No playlists yet</DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsCreating(true)}>
                <Plus className="h-3.5 w-3.5 mr-2" />
                New Playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {activePlaylist && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => {
                  setEditingId(activePlaylist.id);
                  setEditName(activePlaylist.name);
                }}
                title="Rename playlist"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0 text-destructive hover:text-destructive"
                onClick={() => onDelete(activePlaylist.id)}
                title="Delete playlist"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}

          {!activePlaylist && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 flex-shrink-0"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              New
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export function PlaylistPanel() {
  const {
    items,
    loading,
    removeItem,
    clearPlaylist,
    count,
    maxItems,
    currentIndex,
    setCurrentIndex,
    isPlaying,
    setIsPlaying,
    reorderItems,
    playlists,
    activePlaylistId,
    selectPlaylist,
    createPlaylist,
    renamePlaylist,
    deletePlaylist,
  } = usePlaylist();

  const immersive = useImmersiveMode();
  const [audioLoading, setAudioLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("pt-playlist-volume");
    return saved ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval>>();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderItems(oldIndex, newIndex);
    }
  }, [items, reorderItems]);

  // Create persistent audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const onEnded = () => {
      notifyTTSStopped();
      if (currentIndex !== null && currentIndex < items.length - 1) {
        playItem(currentIndex + 1);
      } else {
        setIsPlaying(false);
        setCurrentIndex(null);
        setProgress(0);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioLoading(false);
    };

    const onError = () => {
      setAudioLoading(false);
      setIsPlaying(false);
      toast.error("Failed to play audio");
    };

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("error", onError);
    };
  }, [currentIndex, items.length]);

  // Progress tracker
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      progressIntervalRef.current = setInterval(() => {
        const audio = audioRef.current;
        if (audio && audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 500);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying]);

  const resolveAudioUrl = useCallback(async (item: PlaylistItem): Promise<string | null> => {
    let url = item.audio_url ?? null;

    // Handle structured audio_meta types
    if (!url && item.audio_meta) {
      const meta = item.audio_meta as Record<string, any>;
      const genType = meta.generationType;

      if (genType === "chapter-commentary" || genType === "verse-commentary") {
        const voiceMode = meta.voiceStyle || "epic";

        const { data: cached } = await supabase
          .from("chapter_commentary_cache")
          .select("audio_storage_path")
          .eq("book", meta.book)
          .eq("chapter", meta.chapter)
          .eq("voice_id", voiceMode)
          .maybeSingle();

        if (cached?.audio_storage_path) {
          const { data: signed } = await supabase.storage
            .from("audio-cache")
            .createSignedUrl(cached.audio_storage_path, 3600);
          if (signed?.signedUrl) {
            url = signed.signedUrl;
          }
        }

        if (!url) {
          toast.info("Generating commentary audio — this may take a moment...");
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 120000);

          try {
            const resp = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-epic-commentary`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                },
                body: JSON.stringify({
                  book: meta.book,
                  chapter: meta.chapter,
                  mode: voiceMode,
                }),
                signal: controller.signal,
              }
            );
            clearTimeout(timeout);
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || "Commentary generation failed");
            url = data.audioUrl || null;

            if (!url && (data.status === "queued" || data.status === "ready")) {
              toast.info("Audio is being prepared...");
              for (let i = 0; i < 30; i++) {
                await new Promise(r => setTimeout(r, 4000));
                const { data: poll } = await supabase
                  .from("chapter_commentary_cache")
                  .select("audio_storage_path")
                  .eq("book", meta.book)
                  .eq("chapter", meta.chapter)
                  .eq("voice_id", voiceMode)
                  .maybeSingle();
                if (poll?.audio_storage_path) {
                  const { data: s } = await supabase.storage
                    .from("audio-cache")
                    .createSignedUrl(poll.audio_storage_path, 3600);
                  if (s?.signedUrl) {
                    url = s.signedUrl;
                    break;
                  }
                }
              }
            }
          } catch (e: any) {
            clearTimeout(timeout);
            if (e.name === "AbortError") {
              toast.info("Still generating... checking for result");
              for (let i = 0; i < 15; i++) {
                await new Promise(r => setTimeout(r, 5000));
                const { data: poll } = await supabase
                  .from("chapter_commentary_cache")
                  .select("audio_storage_path")
                  .eq("book", meta.book)
                  .eq("chapter", meta.chapter)
                  .eq("voice_id", voiceMode)
                  .maybeSingle();
                if (poll?.audio_storage_path) {
                  const { data: s } = await supabase.storage
                    .from("audio-cache")
                    .createSignedUrl(poll.audio_storage_path, 3600);
                  if (s?.signedUrl) {
                    url = s.signedUrl;
                    break;
                  }
                }
              }
              if (!url) throw new Error("Commentary generation timed out. Try again later.");
            } else {
              throw e;
            }
          }
        }
      } else if (genType === "aats-training") {
        const trainingText = `Apologetics training session: Day ${meta.day} with ${meta.avatarName}. This is an interactive training exercise designed to sharpen your ability to defend biblical truth against common objections.`;
        const { data, error } = await supabase.functions.invoke("text-to-speech", {
          body: { text: trainingText, voice: "nPczCjzI2devNBz1zQrb" },
        });
        if (error || !data) throw new Error("TTS generation failed");
        const blob = new Blob([data], { type: "audio/mpeg" });
        url = URL.createObjectURL(blob);
      } else if (meta.text) {
        const { data, error } = await supabase.functions.invoke("text-to-speech", {
          body: { text: meta.text.substring(0, 12000), voice: meta.voice || "nPczCjzI2devNBz1zQrb" },
        });
        if (error || !data) throw new Error("TTS generation failed");
        const blob = new Blob([data], { type: "audio/mpeg" });
        url = URL.createObjectURL(blob);
      }
    }

    return url;
  }, []);

  const buildImmersiveQueue = useCallback((): ImmersiveTrack[] => {
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.description || undefined,
      type: (item.audio_type as ImmersiveTrack["type"]) || "commentary",
      displayText: (item.audio_meta as Record<string, any> | null)?.text,
      audioUrl: item.audio_url || undefined,
      generateAudio: item.audio_url ? undefined : () => resolveAudioUrl(item),
    }));
  }, [items, resolveAudioUrl]);

  const openPlaylistImmersive = useCallback((startIndex: number) => {
    if (items.length === 0) {
      toast.error("Playlist is empty");
      return;
    }
    immersive.openImmersive(buildImmersiveQueue(), Math.max(0, Math.min(startIndex, items.length - 1)));
  }, [buildImmersiveQueue, immersive, items.length]);

  const playItem = useCallback(async (index: number) => {
    const item = items[index];
    if (!item) return;

    setCurrentIndex(index);
    setAudioLoading(true);
    setProgress(0);

    const audio = audioRef.current;
    if (!audio) return;

    try {
      let url = await resolveAudioUrl(item);

      if (!url) {
        toast.error("No audio available for this item");
        setAudioLoading(false);
        return;
      }

      // If stored audio_url is a signed URL that may have expired, re-sign it
      if (url === item.audio_url && url.includes('/storage/v1/object/sign/')) {
        try {
          const pathMatch = url.match(/\/storage\/v1\/object\/sign\/([^?]+)/);
          if (pathMatch) {
            const bucketAndPath = pathMatch[1];
            const slashIdx = bucketAndPath.indexOf('/');
            const bucket = bucketAndPath.substring(0, slashIdx);
            const filePath = bucketAndPath.substring(slashIdx + 1);
            const { data: resigned } = await supabase.storage
              .from(bucket)
              .createSignedUrl(filePath, 3600);
            if (resigned?.signedUrl) url = resigned.signedUrl;
          }
        } catch {
          // Use original URL as fallback
        }
      }

      audio.src = url;

      // Wait for audio to be loadable before playing
      await new Promise<void>((resolve, reject) => {
        const onCanPlay = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); reject(new Error("Audio failed to load")); };
        const cleanup = () => {
          audio.removeEventListener("canplay", onCanPlay);
          audio.removeEventListener("error", onError);
        };
        audio.addEventListener("canplay", onCanPlay, { once: true });
        audio.addEventListener("error", onError, { once: true });
        audio.load();
      });

      notifyTTSStarted();
      await audio.play();
      setIsPlaying(true);
      setAudioLoading(false);
    } catch (err) {
      console.error("Playlist playback error:", err);
      setAudioLoading(false);
      toast.error("Playback failed — try again in a moment");
    }
  }, [items, resolveAudioUrl, setCurrentIndex, setIsPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      notifyTTSStopped();
      setIsPlaying(false);
    } else if (currentIndex !== null) {
      audio.play();
      notifyTTSStarted();
      setIsPlaying(true);
    } else if (items.length > 0) {
      playItem(0);
    }
  };

  const skipNext = () => {
    if (currentIndex !== null && currentIndex < items.length - 1) {
      playItem(currentIndex + 1);
    }
  };

  const skipPrev = () => {
    if (currentIndex !== null && currentIndex > 0) {
      playItem(currentIndex - 1);
    }
  };

  const handleRemove = async (id: string) => {
    const audio = audioRef.current;
    if (audio && items[currentIndex ?? -1]?.id === id) {
      audio.pause();
      audio.src = "";
      notifyTTSStopped();
      setIsPlaying(false);
      setCurrentIndex(null);
    }
    await removeItem(id);
  };

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const currentItem = currentIndex !== null ? items[currentIndex] : null;
  const activePlaylist = playlists.find(p => p.id === activePlaylistId);

  return (
    <>
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          title="My Playlists"
        >
          <ListMusic className="h-5 w-5" />
          {count > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground"
            >
              {count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="z-[120] w-[calc(100vw-0.75rem)] max-w-[420px] sm:w-[420px] flex flex-col p-0">
        <SheetHeader className="p-4 pb-2 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ListMusic className="h-5 w-5 text-primary" />
            My Playlists
            <Badge variant="outline" className="ml-auto text-xs">
              {count}/{maxItems}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        {/* Playlist Selector */}
        <PlaylistSelector
          playlists={playlists}
          activePlaylistId={activePlaylistId}
          onSelect={selectPlaylist}
          onCreate={createPlaylist}
          onRename={renamePlaylist}
          onDelete={deletePlaylist}
        />

        {/* Now-Playing Bar */}
        {currentItem && (
          <div className="px-4 py-3 bg-primary/5 border-b space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 text-primary">
                {audioLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : getTypeIcon(currentItem.audio_type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentItem.title}</p>
                <p className="text-xs text-muted-foreground">{getTypeLabel(currentItem.audio_type)}</p>
              </div>
            </div>
            <Progress value={progress} className="h-1" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                {formatTime((progress / 100) * duration)}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipPrev} disabled={currentIndex === 0}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipNext} disabled={currentIndex === items.length - 1}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        )}

        {/* Playlist Items */}
        <ScrollArea className="flex-1">
          {!activePlaylistId && playlists.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
              <ListMusic className="h-12 w-12 text-muted-foreground/30" />
              <div>
                <p className="font-medium text-muted-foreground">No playlists yet</p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Create your first playlist to start organizing your audio content.
                </p>
              </div>
              <Button size="sm" onClick={() => createPlaylist("My Playlist")} className="gap-1 mt-2">
                <Plus className="h-3.5 w-3.5" />
                Create Playlist
              </Button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
              <ListMusic className="h-12 w-12 text-muted-foreground/30" />
              <div>
                <p className="font-medium text-muted-foreground">
                  {activePlaylist ? `"${activePlaylist.name}" is empty` : "Your playlist is empty"}
                </p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Add commentaries, audio tours, or training sessions using the
                  <ListMusic className="h-3.5 w-3.5 inline mx-1" />
                  button throughout the app.
                </p>
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="p-2 space-y-1">
                  {items.map((item, idx) => (
                    <SortablePlaylistItem
                      key={item.id}
                      item={item}
                      idx={idx}
                      isCurrent={currentIndex === idx}
                      isPlaying={isPlaying}
                      onPlay={() => playItem(idx)}
                      onRemove={() => handleRemove(item.id)}
                      onImmerse={() => openPlaylistImmersive(idx)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </ScrollArea>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-3 border-t flex items-center justify-between gap-2">
            <Button variant="ghost" size="sm" className="text-destructive" onClick={clearPlaylist}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear All
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => openPlaylistImmersive(currentIndex ?? 0)} className="gap-1">
                <Maximize2 className="h-3.5 w-3.5" />
                Immerse
              </Button>
              {!isPlaying && items.length > 0 && (
                <Button size="sm" onClick={() => playItem(0)} className="gap-1">
                  <Play className="h-3.5 w-3.5" />
                  Play All
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>

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
    </>
  );
}
