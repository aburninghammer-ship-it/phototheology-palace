import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PODCAST_EPISODES } from "@/data/podcastData";
import { WATCH_TRACTS } from "@/data/watchSeries";
import { AUDIO_LIBRARY } from "@/data/audioLibraryData";
import { usePlaylist } from "@/hooks/usePlaylist";
import { useAuth } from "@/hooks/useAuth";
import { useImmersiveMode } from "@/hooks/useImmersiveMode";
import { ImmersiveAudioPlayer } from "@/components/audio/ImmersiveAudioPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ListMusic, Play, Pause, SkipForward, SkipBack, Trash2, Plus, Sun,
  Moon, BookOpen, Headphones, Swords, Compass, Maximize2, GripVertical,
  Volume2, VolumeX, Check, X, Pencil, ChevronDown, ArrowLeft, Loader2,
  BookOpenCheck, Mic, Sparkles, ExternalLink, FolderPlus, Shield,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { PlaylistItem } from "@/hooks/usePlaylist";
import { supabase } from "@/integrations/supabase/client";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { useRef, useEffect, useMemo } from "react";

/* ── Audio source catalog ── */
interface AudioSource {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "devotional" | "study" | "training" | "reading";
  audioType: string;
  color: string;
  navigateTo?: string;
}

const AUDIO_SOURCES: AudioSource[] = [
  {
    id: "morning-watch",
    title: "Morning Watch",
    description: "Start your day downloading the mind of Christ",
    icon: <Sun className="h-5 w-5" />,
    category: "devotional",
    audioType: "devotional",
    color: "text-amber-400",
    navigateTo: "/morning-watches",
  },
  {
    id: "night-watch",
    title: "Night Watch",
    description: "Seal your day with Christ's emotional posture",
    icon: <Moon className="h-5 w-5" />,
    category: "devotional",
    audioType: "devotional",
    color: "text-indigo-400",
    navigateTo: "/night-watches",
  },
  {
    id: "daily-devotional",
    title: "Daily Audio Devotional",
    description: "Fresh devotional content generated daily",
    icon: <Sparkles className="h-5 w-5" />,
    category: "devotional",
    audioType: "devotional",
    color: "text-purple-400",
    navigateTo: "/daily-audio-devotional",
  },
  {
    id: "chapter-commentary",
    title: "Commentary Suite",
    description: "Rich audio commentary on any Bible chapter",
    icon: <BookOpen className="h-5 w-5" />,
    category: "study",
    audioType: "commentary",
    color: "text-emerald-400",
    navigateTo: "/bible",
  },
  {
    id: "chapter-reading",
    title: "Chapter Reading",
    description: "Listen to Bible chapters read aloud",
    icon: <BookOpenCheck className="h-5 w-5" />,
    category: "reading",
    audioType: "reading",
    color: "text-blue-400",
    navigateTo: "/bible",
  },
  {
    id: "aats-training",
    title: "Apologetics Audio Training",
    description: "Sharpen your defense of biblical truth",
    icon: <Swords className="h-5 w-5" />,
    category: "training",
    audioType: "apologetics",
    color: "text-red-400",
    navigateTo: "/cota-series?tab=aats",
  },
  {
    id: "palace-tour",
    title: "Palace Audio Tour",
    description: "Walk through the Palace with guided narration",
    icon: <Compass className="h-5 w-5" />,
    category: "study",
    audioType: "tour",
    color: "text-cyan-400",
    navigateTo: "/palace",
  },
  {
    id: "podcast",
    title: "Podcast Episodes",
    description: "Listen to Phototheology podcast episodes",
    icon: <Mic className="h-5 w-5" />,
    category: "study",
    audioType: "podcast",
    color: "text-orange-400",
    navigateTo: "/podcast",
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  devotional: "Devotional",
  study: "Study & Commentary",
  training: "Training",
  reading: "Bible Reading",
};

/* ── Sortable item ── */
function SortableItem({
  item, idx, isCurrent, isPlaying, onPlay, onRemove,
}: {
  item: PlaylistItem; idx: number; isCurrent: boolean; isPlaying: boolean;
  onPlay: () => void; onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style}
      className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${isCurrent ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50 border border-transparent"}`}
      onClick={onPlay}
    >
      <button className="flex-shrink-0 touch-none text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        {...attributes} {...listeners} onClick={(e) => e.stopPropagation()}>
        <GripVertical className="h-4 w-4" />
      </button>
      <div className={`flex-shrink-0 w-6 text-center ${isCurrent ? "text-primary" : "text-muted-foreground/50"}`}>
        {isCurrent && isPlaying ? <Volume2 className="h-4 w-4 animate-pulse" /> : <span className="text-xs">{idx + 1}</span>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.title}</p>
        {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
      </div>
      <Badge variant="outline" className="text-[10px] flex-shrink-0">{item.audio_type}</Badge>
      <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

/* ── Main Page ── */
export default function PlaylistHub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    items, loading, removeItem, clearPlaylist, count, maxItems,
    currentIndex, setCurrentIndex, isPlaying, setIsPlaying, reorderItems,
    playlists, activePlaylistId, selectPlaylist, createPlaylist, renamePlaylist, deletePlaylist,
    addItem,
  } = usePlaylist();
  const immersive = useImmersiveMode();

  const [activeTab, setActiveTab] = useState("queue");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Audio playback state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("pt-playlist-volume");
    return saved ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(false);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval>>();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Auto-create a default playlist if user has none
  const autoCreatedRef = useRef(false);
  useEffect(() => {
    if (user && !loading && playlists.length === 0 && !autoCreatedRef.current) {
      autoCreatedRef.current = true;
      createPlaylist("My Playlist");
    }
  }, [user, loading, playlists.length, createPlaylist]);

  // Audio element setup
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    const onEnded = () => {
      notifyTTSStopped();
      if (currentIndex !== null && currentIndex < items.length - 1) playItem(currentIndex + 1);
      else { setIsPlaying(false); setCurrentIndex(null); setProgress(0); }
    };
    const onLoadedMetadata = () => { setDuration(audio.duration || 0); setAudioLoading(false); };
    const onError = () => { setAudioLoading(false); setIsPlaying(false); toast.error("Failed to play audio"); };
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("error", onError);
    };
  }, [currentIndex, items.length]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume; }, [volume, isMuted]);
  useEffect(() => { localStorage.setItem("pt-playlist-volume", volume.toString()); }, [volume]);
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      progressIntervalRef.current = setInterval(() => {
        const a = audioRef.current;
        if (a?.duration) setProgress((a.currentTime / a.duration) * 100);
      }, 500);
    } else if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    return () => { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); };
  }, [isPlaying]);

  const resolveAudioUrl = useCallback(async (item: PlaylistItem): Promise<string | null> => {
    let url = item.audio_url ?? null;
    if (!url && item.audio_meta) {
      const meta = item.audio_meta as Record<string, any>;
      if (meta.generationType === "chapter-commentary" || meta.generationType === "verse-commentary") {
        const voiceMode = meta.voiceStyle || "epic";
        const { data: cached } = await supabase.from("chapter_commentary_cache")
          .select("audio_storage_path").eq("book", meta.book).eq("chapter", meta.chapter)
          .eq("voice_id", voiceMode).maybeSingle();
        if (cached?.audio_storage_path) {
          const { data: signed } = await supabase.storage.from("audio-cache").createSignedUrl(cached.audio_storage_path, 3600);
          if (signed?.signedUrl) url = signed.signedUrl;
        }
      }
    }
    if (url && url.includes('/storage/v1/object/sign/')) {
      try {
        const m = url.match(/\/storage\/v1\/object\/sign\/([^?]+)/);
        if (m) {
          const idx = m[1].indexOf('/');
          const { data: r } = await supabase.storage.from(m[1].substring(0, idx)).createSignedUrl(m[1].substring(idx + 1), 3600);
          if (r?.signedUrl) url = r.signedUrl;
        }
      } catch {}
    }
    return url;
  }, []);

  const playItem = useCallback(async (index: number) => {
    const item = items[index];
    if (!item) return;
    setCurrentIndex(index);
    setAudioLoading(true);
    setProgress(0);
    const audio = audioRef.current;
    if (!audio) return;
    try {
      const url = await resolveAudioUrl(item);
      if (!url) { toast.error("No audio available"); setAudioLoading(false); return; }
      audio.src = url;
      await new Promise<void>((res, rej) => {
        const ok = () => { off(); res(); };
        const fail = () => { off(); rej(new Error("Load failed")); };
        const off = () => { audio.removeEventListener("canplay", ok); audio.removeEventListener("error", fail); };
        audio.addEventListener("canplay", ok, { once: true });
        audio.addEventListener("error", fail, { once: true });
        audio.load();
      });
      audio.volume = isMuted ? 0 : volume;
      notifyTTSStarted();
      await audio.play();
      setIsPlaying(true);
      setAudioLoading(false);
    } catch {
      setAudioLoading(false);
      toast.error("Playback failed");
    }
  }, [items, resolveAudioUrl, setCurrentIndex, setIsPlaying, isMuted, volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); notifyTTSStopped(); setIsPlaying(false); }
    else if (currentIndex !== null) { audio.play(); notifyTTSStarted(); setIsPlaying(true); }
    else if (items.length > 0) playItem(0);
  };

  const skipNext = () => { if (currentIndex !== null && currentIndex < items.length - 1) playItem(currentIndex + 1); };
  const skipPrev = () => { if (currentIndex !== null && currentIndex > 0) playItem(currentIndex - 1); };

  const handleRemove = async (id: string) => {
    const audio = audioRef.current;
    if (audio && items[currentIndex ?? -1]?.id === id) {
      audio.pause(); audio.src = ""; notifyTTSStopped(); setIsPlaying(false); setCurrentIndex(null);
    }
    await removeItem(id);
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex(i => i.id === active.id);
    const newIdx = items.findIndex(i => i.id === over.id);
    if (oldIdx !== -1 && newIdx !== -1) reorderItems(oldIdx, newIdx);
  }, [items, reorderItems]);

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const handleCreatePlaylist = async () => {
    const name = newPlaylistName.trim();
    if (!name) return;
    await createPlaylist(name);
    setNewPlaylistName("");
    setShowCreateInput(false);
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    await renamePlaylist(id, editName);
    setEditingId(null);
  };

  const currentItem = currentIndex !== null ? items[currentIndex] : null;
  const activePlaylist = playlists.find(p => p.id === activePlaylistId);

  const buildImmersiveQueue = useCallback(() => {
    return items.map((item) => {
      const meta = item.audio_meta as Record<string, any> | null;
      return {
        id: item.id, title: item.title, subtitle: item.description || undefined,
        type: (item.audio_type as any) || "commentary",
        displayText: meta?.text, book: meta?.book, chapter: meta?.chapter,
        modeName: meta?.voiceStyle || meta?.generationType,
        audioUrl: item.audio_url || undefined,
        generateAudio: item.audio_url ? undefined : () => resolveAudioUrl(item),
      };
    });
  }, [items, resolveAudioUrl]);

  const openImmersive = useCallback((startIdx: number) => {
    if (items.length === 0) { toast.error("Playlist is empty"); return; }
    immersive.openImmersive(buildImmersiveQueue(), Math.max(0, Math.min(startIdx, items.length - 1)));
  }, [buildImmersiveQueue, immersive, items.length]);

  const groupedSources = AUDIO_SOURCES.reduce((acc, src) => {
    if (!acc[src.category]) acc[src.category] = [];
    acc[src.category].push(src);
    return acc;
  }, {} as Record<string, AudioSource[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <ListMusic className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold">Playlist Hub</h1>
          </div>
          {items.length > 0 && (
            <Badge variant="outline" className="text-xs">{count}/{maxItems}</Badge>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* ── Playlist Selector — always visible, prominent ── */}
        <Card>
          <CardContent className="p-3 space-y-2">
            {/* Playlist tabs row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {playlists.map(pl => (
                <Button
                  key={pl.id}
                  variant={pl.id === activePlaylistId ? "default" : "outline"}
                  size="sm"
                  className="flex-shrink-0 gap-1.5 h-8"
                  onClick={() => selectPlaylist(pl.id)}
                >
                  <ListMusic className="h-3.5 w-3.5" />
                  {editingId === pl.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-6 w-28 text-xs px-1"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === "Enter") handleRename(pl.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      onBlur={() => handleRename(pl.id)}
                    />
                  ) : (
                    <span className="truncate max-w-[120px]">{pl.name}</span>
                  )}
                </Button>
              ))}

              {/* Inline new playlist */}
              {showCreateInput ? (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Input
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Playlist name..."
                    className="h-8 w-36 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreatePlaylist();
                      if (e.key === "Escape") { setShowCreateInput(false); setNewPlaylistName(""); }
                    }}
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCreatePlaylist}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setShowCreateInput(false); setNewPlaylistName(""); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" className="flex-shrink-0 gap-1 h-8 text-muted-foreground"
                  onClick={() => setShowCreateInput(true)}>
                  <Plus className="h-3.5 w-3.5" /> New
                </Button>
              )}
            </div>

            {/* Active playlist actions */}
            {activePlaylist && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="flex-1">
                  {count} item{count !== 1 ? "s" : ""} in <span className="font-medium text-foreground">{activePlaylist.name}</span>
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7"
                  onClick={() => { setEditingId(activePlaylist.id); setEditName(activePlaylist.name); }}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive"
                  onClick={() => deletePlaylist(activePlaylist.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Now Playing Bar */}
        {currentItem && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 text-primary">
                  {audioLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Headphones className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{currentItem.title}</p>
                  <p className="text-xs text-muted-foreground">{currentItem.audio_type}</p>
                </div>
              </div>
              <Progress value={progress} className="h-1.5" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{formatTime((progress / 100) * duration)}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={skipPrev} disabled={currentIndex === 0}>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="icon" className="h-10 w-10 rounded-full" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={skipNext} disabled={currentIndex === items.length - 1}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </Button>
                <Slider value={[isMuted ? 0 : volume]} min={0} max={1} step={0.01}
                  onValueChange={(v) => { setVolume(v[0]); if (v[0] > 0 && isMuted) setIsMuted(false); }}
                  className="flex-1" />
                <span className="text-xs text-muted-foreground w-8 text-right">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs: Queue / Add Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="queue" className="gap-2">
              <ListMusic className="h-4 w-4" />
              Queue
              {count > 0 && <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{count}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="add" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Content
            </TabsTrigger>
          </TabsList>

          {/* Queue Tab */}
          <TabsContent value="queue" className="mt-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-center gap-3">
                <Headphones className="h-12 w-12 text-muted-foreground/20" />
                <p className="text-muted-foreground">
                  {activePlaylist ? `"${activePlaylist.name}" is empty` : "No playlist selected"}
                </p>
                <p className="text-sm text-muted-foreground/60 max-w-xs">
                  Tap <span className="font-medium text-foreground">"Add Content"</span> above to browse audio sources, or add items from anywhere in the app.
                </p>
                <Button variant="default" size="sm" className="gap-2 mt-1" onClick={() => setActiveTab("add")}>
                  <Plus className="h-4 w-4" /> Add Your First Item
                </Button>
              </div>
            ) : (
              <>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-1">
                      {items.map((item, idx) => (
                        <SortableItem key={item.id} item={item} idx={idx}
                          isCurrent={currentIndex === idx} isPlaying={isPlaying}
                          onPlay={() => playItem(idx)} onRemove={() => handleRemove(item.id)} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                <div className="flex items-center justify-between pt-2 border-t">
                  <Button variant="ghost" size="sm" className="text-destructive gap-1" onClick={clearPlaylist}>
                    <Trash2 className="h-3.5 w-3.5" /> Clear All
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setActiveTab("add")}>
                      <Plus className="h-3.5 w-3.5" /> Add More
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => openImmersive(currentIndex ?? 0)}>
                      <Maximize2 className="h-3.5 w-3.5" /> Immerse
                    </Button>
                    {!isPlaying && items.length > 0 && (
                      <Button size="sm" className="gap-1" onClick={() => playItem(0)}>
                        <Play className="h-3.5 w-3.5" /> Play All
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Add Content Tab */}
          <TabsContent value="add" className="mt-4 space-y-5">
            <p className="text-sm text-muted-foreground">
              Add audio to <span className="font-medium text-foreground">{activePlaylist?.name || "your playlist"}</span> using the selectors below, or add items from any page in the app.
            </p>

            {/* Morning Watch Selector */}
            <MorningWatchSelector addItem={addItem} isFull={count >= maxItems} items={items} />

            {/* Night Watch Selector */}
            <NightWatchSelector addItem={addItem} isFull={count >= maxItems} items={items} />

            {/* Apologetics Selector */}
            <ApologeticsSelector addItem={addItem} isFull={count >= maxItems} items={items} />

            {/* Other sources — navigation cards */}
            {Object.entries(groupedSources)
              .filter(([_, sources]) => sources.some(s => !["morning-watch", "night-watch", "aats-training"].includes(s.id)))
              .map(([category, sources]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {CATEGORY_LABELS[category] || category}
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {sources.filter(s => !["morning-watch", "night-watch", "aats-training"].includes(s.id)).map((source) => (
                    <Card
                      key={source.id}
                      className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-sm group"
                      onClick={() => source.navigateTo && navigate(source.navigateTo)}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className={`flex-shrink-0 ${source.color} group-hover:scale-110 transition-transform`}>
                          {source.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{source.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{source.description}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary flex-shrink-0 transition-colors" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {/* Podcast quick-add */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-orange-400" />
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Podcast Episodes</h3>
                <Badge variant="outline" className="text-[9px]">{PODCAST_EPISODES.length} episodes</Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {PODCAST_EPISODES.map(ep => {
                  const alreadyAdded = items.some(i =>
                    i.audio_meta && (i.audio_meta as any).episodeNumber === ep.episodeNumber && i.audio_type === "podcast"
                  );
                  return (
                    <Card key={ep.id} className={`transition-all ${alreadyAdded ? "opacity-60 border-primary/20" : "hover:border-primary/50 hover:shadow-sm"}`}>
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className="text-orange-400 flex-shrink-0">
                          <Mic className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">Ep. {ep.episodeNumber}: {ep.title}</p>
                          <p className="text-xs text-muted-foreground">{ep.duration}</p>
                        </div>
                        <Button
                          variant={alreadyAdded ? "ghost" : "outline"}
                          size="sm"
                          className="h-7 text-xs shrink-0"
                          disabled={alreadyAdded}
                          onClick={() => addItem({
                            title: `Podcast Ep. ${ep.episodeNumber}: ${ep.title}`,
                            description: ep.description.slice(0, 80),
                            audio_type: "podcast",
                            audio_url: `/audio/podcast/${ep.audioFile}`,
                            audio_meta: { generationType: "podcast", episodeNumber: ep.episodeNumber },
                          })}
                        >
                          {alreadyAdded ? <Check className="h-3.5 w-3.5" /> : <><Plus className="h-3.5 w-3.5 mr-1" /> Add</>}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Immersive Player */}
      <ImmersiveAudioPlayer
        isOpen={immersive.isOpen} onClose={immersive.closeImmersive}
        tracks={immersive.queue.tracks} currentIndex={immersive.queue.currentIndex}
        onNextTrack={immersive.nextTrack} onPrevTrack={immersive.prevTrack}
        hasNext={immersive.hasNext} hasPrev={immersive.hasPrev}
        ambientMusicEnabled={immersive.ambientMusicEnabled} ambientVolume={immersive.ambientVolume}
        continuousPlay={immersive.continuousPlay}
        onSetAmbientMusic={immersive.setAmbientMusic} onSetAmbientVolume={immersive.setAmbientVolume}
        onSetContinuousPlay={immersive.setContinuousPlay}
      />
    </div>
  );
}

/* ── Inline Selector: Morning Watch ── */
type SelectorProps = {
  addItem: (item: { title: string; description?: string; audio_type: string; audio_meta?: Record<string, any> }) => Promise<any>;
  isFull: boolean;
  items: PlaylistItem[];
};

function MorningWatchSelector({ addItem, isFull, items }: SelectorProps) {
  const [tractId, setTractId] = useState("");
  const [sessionIdx, setSessionIdx] = useState("");

  const tract = WATCH_TRACTS.find(t => t.id === tractId);
  const sessions = tract?.mornings ?? [];
  const session = sessionIdx ? sessions[parseInt(sessionIdx)] : null;

  const title = tract && session ? `Day ${session.dayNumber} — ${session.title} (${tract.name})` : "";
  const alreadyAdded = title && items.some(i => i.title === title);

  const handleAdd = async () => {
    if (!tract || !session) { toast.error("Select a tract and session"); return; }
    await addItem({
      title,
      description: `${tract.icon} Morning Watch: ${tract.name} — ${session.title}`,
      audio_type: "morning-watch",
      audio_meta: {
        tractId: tract.id, tractName: tract.name, dayNumber: session.dayNumber,
        sessionTitle: session.title, morningScripture: session.morningScripture,
        activationPrinciple: session.activationPrinciple, generationType: "morning-watch",
      },
    });
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold">Morning Watch</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Select value={tractId} onValueChange={v => { setTractId(v); setSessionIdx(""); }}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Tract..." /></SelectTrigger>
            <SelectContent className="max-h-[300px] z-[200]" position="popper">
              {WATCH_TRACTS.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.icon} {t.name} ({t.totalSessions} days)</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sessionIdx} onValueChange={setSessionIdx} disabled={!tract || sessions.length === 0}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Session..." /></SelectTrigger>
            <SelectContent className="max-h-[300px] z-[200]" position="popper">
              {sessions.map((s, i) => (
                <SelectItem key={i} value={String(i)}>Day {s.dayNumber} — {s.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full gap-2" size="sm" onClick={handleAdd}
          disabled={!tract || !session || isFull || !!alreadyAdded}>
          {alreadyAdded ? <><Check className="h-3.5 w-3.5" /> In Playlist</> : <><Plus className="h-3.5 w-3.5" /> Add to Playlist</>}
        </Button>
      </CardContent>
    </Card>
  );
}

/* ── Inline Selector: Night Watch ── */
function NightWatchSelector({ addItem, isFull, items }: SelectorProps) {
  const [tractId, setTractId] = useState("");
  const [sessionIdx, setSessionIdx] = useState("");

  const tract = WATCH_TRACTS.find(t => t.id === tractId);
  const sessions = tract?.sessions ?? [];
  const session = sessionIdx ? sessions[parseInt(sessionIdx)] : null;

  const title = tract && session ? `Night Watch: Day ${session.dayNumber} — ${session.title} (${tract.name})` : "";
  const alreadyAdded = title && items.some(i => i.title === title);

  const handleAdd = async () => {
    if (!tract || !session) { toast.error("Select a tract and session"); return; }
    await addItem({
      title,
      description: `${tract.icon} Night Watch: ${tract.name} — ${session.title}`,
      audio_type: "night-watch",
      audio_meta: {
        tractId: tract.id, tractName: tract.name, dayNumber: session.dayNumber,
        sessionTitle: session.title, scripture: session.scripture,
        scene: session.scene, mood: session.mood, generationType: "night-watch",
      },
    });
  };

  // Only show tracts that have night watch sessions
  const nightTracts = useMemo(() => WATCH_TRACTS.filter(t => t.sessions && t.sessions.length > 0), []);

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-semibold">Night Watch</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Select value={tractId} onValueChange={v => { setTractId(v); setSessionIdx(""); }}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Tract..." /></SelectTrigger>
            <SelectContent className="max-h-[300px] z-[200]" position="popper">
              {nightTracts.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.icon} {t.name} ({t.sessions.length} nights)</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sessionIdx} onValueChange={setSessionIdx} disabled={!tract || sessions.length === 0}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Session..." /></SelectTrigger>
            <SelectContent className="max-h-[300px] z-[200]" position="popper">
              {sessions.map((s, i) => (
                <SelectItem key={i} value={String(i)}>Day {s.dayNumber} — {s.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full gap-2" size="sm" onClick={handleAdd}
          disabled={!tract || !session || isFull || !!alreadyAdded}>
          {alreadyAdded ? <><Check className="h-3.5 w-3.5" /> In Playlist</> : <><Plus className="h-3.5 w-3.5" /> Add to Playlist</>}
        </Button>
      </CardContent>
    </Card>
  );
}

/* ── Inline Selector: Apologetics ── */
function ApologeticsSelector({ addItem, isFull, items }: SelectorProps) {
  const [apologeticId, setApologeticId] = useState("");

  const apologeticsItems = useMemo(
    () => AUDIO_LIBRARY.filter(e => e.category === "apologetics"), []
  );
  const selected = apologeticsItems.find(e => e.id === apologeticId);
  const alreadyAdded = selected && items.some(i => i.title === selected.title);

  const handleAdd = async () => {
    if (!selected) { toast.error("Select an apologetics topic"); return; }
    await addItem({
      title: selected.title,
      description: selected.description,
      audio_type: "apologetics",
      audio_meta: selected.audioMeta,
    });
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-red-400" />
          <h3 className="text-sm font-semibold">Apologetics</h3>
          <Badge variant="outline" className="text-[9px]">{apologeticsItems.length} topics</Badge>
        </div>
        <Select value={apologeticId} onValueChange={setApologeticId}>
          <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Topic..." /></SelectTrigger>
          <SelectContent className="max-h-[300px] z-[200]" position="popper">
            {apologeticsItems.map(e => (
              <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selected && <p className="text-xs text-muted-foreground">{selected.description}</p>}
        <Button className="w-full gap-2" size="sm" variant="destructive" onClick={handleAdd}
          disabled={!selected || isFull || !!alreadyAdded}>
          {alreadyAdded ? <><Check className="h-3.5 w-3.5" /> In Playlist</> : <><Plus className="h-3.5 w-3.5" /> Add to Playlist</>}
        </Button>
      </CardContent>
    </Card>
  );
}
