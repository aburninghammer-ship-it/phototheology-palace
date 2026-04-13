import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { usePlaylist, type PlaylistItem } from "@/hooks/usePlaylist";
import { useImmersiveMode, type ImmersiveTrack } from "@/hooks/useImmersiveMode";
import { ImmersiveAudioPlayer } from "@/components/audio/ImmersiveAudioPlayer";
import { AddToPlaylistButton } from "@/components/audio/AddToPlaylistButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { PODCAST_EPISODES } from "@/data/podcastData";
import { BIBLE_BOOKS } from "@/types/bible";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  ListMusic, Play, Pause, SkipForward, SkipBack, Trash2,
  Volume2, VolumeX, X, Loader2, Headphones, BookOpen, Shield,
  GripVertical, Maximize2, Plus, Pencil, Check, Music,
  Mic, Flame, Sun, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ── Chapter counts per book ──
const CHAPTER_COUNTS: Record<string, number> = {
  Genesis: 50, Exodus: 40, Leviticus: 27, Numbers: 36, Deuteronomy: 34,
  Joshua: 24, Judges: 21, Ruth: 4, "1 Samuel": 31, "2 Samuel": 24,
  "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36,
  Ezra: 10, Nehemiah: 13, Esther: 10, Job: 42, Psalms: 150, Proverbs: 31,
  Ecclesiastes: 12, "Song of Solomon": 8, Isaiah: 66, Jeremiah: 52, Lamentations: 5,
  Ezekiel: 48, Daniel: 12, Hosea: 14, Joel: 3, Amos: 9,
  Obadiah: 1, Jonah: 4, Micah: 7, Nahum: 3, Habakkuk: 3,
  Zephaniah: 3, Haggai: 2, Zechariah: 14, Malachi: 4,
  Matthew: 28, Mark: 16, Luke: 24, John: 21, Acts: 28,
  Romans: 16, "1 Corinthians": 16, "2 Corinthians": 13, Galatians: 6, Ephesians: 6,
  Philippians: 4, Colossians: 4, "1 Thessalonians": 5, "2 Thessalonians": 3,
  "1 Timothy": 6, "2 Timothy": 4, Titus: 3, Philemon: 1,
  Hebrews: 13, James: 5, "1 Peter": 5, "2 Peter": 3,
  "1 John": 5, "2 John": 1, "3 John": 1, Jude: 1, Revelation: 22,
};

const VOICE_STYLES = [
  { id: "epic", label: "Epic Narrator", voice: "6v8IsT0UP1aaVwjGhVPn", description: "Cinematic, sweeping narration" },
  { id: "urban", label: "Modern Preacher", voice: "cgSgspJ2msm6clMCkdW9", description: "Raw, real-talk energy" },
  { id: "counselor", label: "Counselor", voice: "XrExE9yKIg1WjnnlVkGX", description: "Warm, empathetic guidance" },
  { id: "ancient", label: "Ancient Voice", voice: "onyx", description: "Authoritative, solemn tone" },
  { id: "preacher", label: "Preacher", voice: "shimmer", description: "Pulpit-ready conviction" },
  { id: "scholar", label: "Scholar", voice: "echo", description: "Analytical, scholarly depth" },
  { id: "kids", label: "Kids Adventure", voice: "pFZP5JQG7iQjIQuC4Bku", description: "Wonder-filled for ages 8-12" },
  { id: "mirror", label: "Mirror", voice: "SAz9YHcvj6GT2YYXdXww", description: "Personal application" },
  { id: "verse-by-verse", label: "Verse-by-Verse", voice: "nPczCjzI2devNBz1zQrb", description: "Detailed verse commentary" },
];

const AATS_AVATARS = [
  { id: "muslim", name: "Muslim", emoji: "☪️", totalDays: 56 },
  { id: "atheist", name: "Atheist", emoji: "🧪", totalDays: 56 },
  { id: "catholic", name: "Catholic", emoji: "⛪", totalDays: 56 },
  { id: "jw", name: "Jehovah's Witness", emoji: "📖", totalDays: 56 },
  { id: "mormon", name: "Mormon", emoji: "🏔️", totalDays: 56 },
  { id: "former-sda", name: "Former SDA", emoji: "🔍", totalDays: 56 },
  { id: "skeptical-exsda", name: "Skeptical Ex-SDA", emoji: "🔍", totalDays: 56 },
  { id: "progressive-christian", name: "Progressive Christian", emoji: "🌈", totalDays: 56 },
  { id: "pentecostal", name: "Pentecostal", emoji: "🔥", totalDays: 56 },
  { id: "evangelical", name: "Evangelical", emoji: "✝️", totalDays: 56 },
  { id: "scientist", name: "Scientist", emoji: "🔬", totalDays: 56 },
  { id: "agnostic", name: "Agnostic", emoji: "❓", totalDays: 56 },
  { id: "new-age", name: "New Ager", emoji: "🔮", totalDays: 56 },
  { id: "bhi", name: "Black Hebrew Israelite", emoji: "✊", totalDays: 56 },
  { id: "internet-skeptic", name: "Internet Skeptic", emoji: "💻", totalDays: 56 },
  { id: "philosopher", name: "Philosopher", emoji: "🏛️", totalDays: 56 },
  { id: "jewish", name: "Jewish Scholar", emoji: "✡️", totalDays: 56 },
  { id: "secular-scholar", name: "Secular Scholar", emoji: "🎓", totalDays: 56 },
  { id: "offshoot-sda", name: "Offshoot SDA", emoji: "🌿", totalDays: 56 },
  { id: "futurist", name: "Futurist", emoji: "🔮", totalDays: 56 },
  { id: "preterist", name: "Preterist", emoji: "📜", totalDays: 56 },
  { id: "anti-prophet", name: "Anti-Prophet Critic", emoji: "⚔️", totalDays: 56 },
];

// ── Audio type icons/labels ──
const AUDIO_TYPE_ICONS: Record<string, React.ReactNode> = {
  commentary: <BookOpen className="h-4 w-4" />,
  podcast: <Mic className="h-4 w-4" />,
  devotional: <Flame className="h-4 w-4" />,
  "morning-watch": <Sun className="h-4 w-4" />,
  training: <Shield className="h-4 w-4" />,
  "bible-reading": <BookOpen className="h-4 w-4" />,
  default: <Headphones className="h-4 w-4" />,
};

function getTypeIcon(type: string) {
  return AUDIO_TYPE_ICONS[type] || AUDIO_TYPE_ICONS.default;
}

// ── Sortable Playlist Item ──
function SortablePlaylistItem({
  item, idx, isCurrent, isPlaying, onPlay, onRemove, onImmerse,
}: {
  item: PlaylistItem; idx: number; isCurrent: boolean; isPlaying: boolean;
  onPlay: () => void; onRemove: () => void; onImmerse: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style}
      className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${isCurrent ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50"}`}
      onClick={onPlay}
    >
      <button className="flex-shrink-0 touch-none text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        {...attributes} {...listeners} onClick={(e) => e.stopPropagation()}>
        <GripVertical className="h-4 w-4" />
      </button>
      <div className={`flex-shrink-0 ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
        {isCurrent && isPlaying ? <Volume2 className="h-4 w-4 animate-pulse" /> : getTypeIcon(item.audio_type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isCurrent ? "text-primary" : ""}`}>{item.title}</p>
        {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 text-primary hover:bg-primary/10"
        onClick={(e) => { e.stopPropagation(); onImmerse(); }} title="Immerse Mode">
        <Maximize2 className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}>
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── Main Playlist Page ──
// ══════════════════════════════════════════════════════════════════════════════
export default function PlaylistPage() {
  const {
    items, loading, removeItem, clearPlaylist, count, maxItems,
    currentIndex, setCurrentIndex, isPlaying, setIsPlaying, reorderItems,
    playlists, activePlaylistId, selectPlaylist, createPlaylist, renamePlaylist, deletePlaylist, addItem,
  } = usePlaylist();

  const immersive = useImmersiveMode();

  // ── Playback state ──
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

  // ── UI state ──
  const [expandedPlaylistId, setExpandedPlaylistId] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ── Audio engine (same as PlaylistPanel) ──
  const resolveAudioUrl = useCallback(async (item: PlaylistItem): Promise<string | null> => {
    let url = item.audio_url ?? null;
    if (!url && item.audio_meta) {
      const meta = item.audio_meta as Record<string, any>;
      const genType = meta.generationType;

      if (genType === "chapter-commentary" || genType === "verse-commentary") {
        const voiceMode = meta.voiceStyle || "epic";
        const { data: cached } = await supabase
          .from("chapter_commentary_cache")
          .select("audio_storage_path")
          .eq("book", meta.book).eq("chapter", meta.chapter).eq("voice_id", voiceMode)
          .maybeSingle();
        if (cached?.audio_storage_path) {
          const { data: signed } = await supabase.storage
            .from("audio-cache").createSignedUrl(cached.audio_storage_path, 3600);
          if (signed?.signedUrl) url = signed.signedUrl;
        }
        if (!url) {
          toast.info("Generating commentary audio — this may take a moment...");
          try {
            const resp = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-epic-commentary`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
                body: JSON.stringify({ book: meta.book, chapter: meta.chapter, mode: voiceMode }),
              }
            );
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
                  .eq("book", meta.book).eq("chapter", meta.chapter).eq("voice_id", voiceMode)
                  .maybeSingle();
                if (poll?.audio_storage_path) {
                  const { data: s } = await supabase.storage.from("audio-cache").createSignedUrl(poll.audio_storage_path, 3600);
                  if (s?.signedUrl) { url = s.signedUrl; break; }
                }
              }
            }
          } catch (e: any) {
            if (e.name !== "AbortError") throw e;
          }
        }
      } else if (genType === "aats-training") {
        const text = `Apologetics training session: Day ${meta.day} with ${meta.avatarName}.`;
        const { data, error } = await supabase.functions.invoke("text-to-speech", { body: { text, voice: "nPczCjzI2devNBz1zQrb" } });
        if (error || !data) throw new Error("TTS generation failed");
        url = URL.createObjectURL(new Blob([data], { type: "audio/mpeg" }));
      } else if (meta.text) {
        const { data, error } = await supabase.functions.invoke("text-to-speech", {
          body: { text: meta.text.substring(0, 12000), voice: meta.voice || "nPczCjzI2devNBz1zQrb" },
        });
        if (error || !data) throw new Error("TTS generation failed");
        url = URL.createObjectURL(new Blob([data], { type: "audio/mpeg" }));
      }
    }
    return url;
  }, []);

  // ── Audio element setup ──
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    const onEnded = () => {
      notifyTTSStopped();
      if (currentIndex !== null && currentIndex < items.length - 1) playItem(currentIndex + 1);
      else { setIsPlaying(false); setCurrentIndex(null); setProgress(0); }
    };
    const onMeta = () => { setDuration(audio.duration || 0); setAudioLoading(false); };
    const onErr = () => { setAudioLoading(false); setIsPlaying(false); toast.error("Failed to play audio"); };
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("error", onErr);
    return () => { audio.removeEventListener("ended", onEnded); audio.removeEventListener("loadedmetadata", onMeta); audio.removeEventListener("error", onErr); };
  }, [currentIndex, items.length]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume; }, [volume, isMuted]);
  useEffect(() => { localStorage.setItem("pt-playlist-volume", volume.toString()); }, [volume]);
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      progressIntervalRef.current = setInterval(() => {
        const a = audioRef.current;
        if (a && a.duration) setProgress((a.currentTime / a.duration) * 100);
      }, 500);
    } else { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); }
    return () => { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); };
  }, [isPlaying]);

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
      if (!url) { toast.error("No audio available for this item"); setAudioLoading(false); return; }
      if (url === item.audio_url && url.includes('/storage/v1/object/sign/')) {
        try {
          const m = url.match(/\/storage\/v1\/object\/sign\/([^?]+)/);
          if (m) {
            const bp = m[1]; const si = bp.indexOf('/');
            const { data: r } = await supabase.storage.from(bp.substring(0, si)).createSignedUrl(bp.substring(si + 1), 3600);
            if (r?.signedUrl) url = r.signedUrl;
          }
        } catch { /* fallback */ }
      }
      audio.src = url;
      await new Promise<void>((resolve, reject) => {
        const ok = () => { cl(); resolve(); };
        const fail = () => { cl(); reject(new Error("Audio failed to load")); };
        const cl = () => { audio.removeEventListener("canplay", ok); audio.removeEventListener("error", fail); };
        audio.addEventListener("canplay", ok, { once: true });
        audio.addEventListener("error", fail, { once: true });
        audio.load();
      });
      audio.volume = isMuted ? 0 : volume;
      notifyTTSStarted();
      await audio.play();
      setIsPlaying(true);
      setAudioLoading(false);
    } catch { setAudioLoading(false); toast.error("Playback failed — try again in a moment"); }
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

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex(i => i.id === active.id);
    const newIdx = items.findIndex(i => i.id === over.id);
    if (oldIdx !== -1 && newIdx !== -1) reorderItems(oldIdx, newIdx);
  }, [items, reorderItems]);

  const buildImmersiveQueue = useCallback((): ImmersiveTrack[] => {
    return items.map((item) => {
      const meta = item.audio_meta as Record<string, any> | null;
      return {
        id: item.id, title: item.title, subtitle: item.description || undefined,
        type: (item.audio_type as ImmersiveTrack["type"]) || "commentary",
        displayText: meta?.text, book: meta?.book, chapter: meta?.chapter,
        modeName: meta?.voiceStyle || meta?.generationType,
        audioUrl: item.audio_url || undefined,
        generateAudio: item.audio_url ? undefined : () => resolveAudioUrl(item),
      };
    });
  }, [items, resolveAudioUrl]);

  const openImmersive = useCallback((startIndex: number) => {
    if (items.length === 0) { toast.error("Playlist is empty"); return; }
    immersive.openImmersive(buildImmersiveQueue(), Math.max(0, Math.min(startIndex, items.length - 1)));
  }, [buildImmersiveQueue, immersive, items.length]);

  // ── Select and expand a playlist ──
  const handleSelectPlaylist = (id: string) => {
    selectPlaylist(id);
    setExpandedPlaylistId(prev => prev === id ? null : id);
  };

  const handleCreatePlaylist = async () => {
    const name = newPlaylistName.trim();
    if (!name) return;
    const pl = await createPlaylist(name);
    if (pl) {
      setNewPlaylistName("");
      setExpandedPlaylistId(pl.id);
    }
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    await renamePlaylist(id, editName);
    setEditingId(null);
  };

  const currentItem = currentIndex !== null ? items[currentIndex] : null;
  const activePlaylist = playlists.find(p => p.id === activePlaylistId);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6 pb-24 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
              <ListMusic className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                My Playlists
              </h1>
              <p className="text-sm text-muted-foreground">Mix commentary, podcasts, devotionals & more</p>
            </div>
          </div>
        </div>

        {/* ── Playlist Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {playlists.map(pl => (
            <Card key={pl.id}
              className={`cursor-pointer transition-all hover:shadow-md ${activePlaylistId === pl.id && expandedPlaylistId === pl.id ? "ring-2 ring-violet-500/50 bg-violet-500/5" : "hover:bg-muted/50"}`}
              onClick={() => handleSelectPlaylist(pl.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-2">
                    <Music className="h-4 w-4 text-violet-500" />
                  </div>
                  {activePlaylistId === pl.id && expandedPlaylistId === pl.id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                {editingId === pl.id ? (
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-7 text-xs"
                      autoFocus onKeyDown={e => { if (e.key === "Enter") handleRename(pl.id); if (e.key === "Escape") setEditingId(null); }} />
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleRename(pl.id)}><Check className="h-3 w-3" /></Button>
                  </div>
                ) : (
                  <p className="font-medium text-sm truncate">{pl.name}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {activePlaylistId === pl.id && (
                    <Badge variant="outline" className="text-[10px]">{count} items</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Playlist Card */}
          <Card className="cursor-pointer border-dashed hover:bg-muted/50 transition-all">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center mb-1">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)}
                  placeholder="New playlist..." className="h-7 text-xs"
                  onKeyDown={e => { if (e.key === "Enter") handleCreatePlaylist(); }}
                  onClick={e => e.stopPropagation()} />
                <Button size="sm" variant="secondary" className="h-7 text-xs w-full" onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}>
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Now Playing Bar ── */}
        {currentItem && (
          <Card className="bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 border-violet-500/20">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 text-violet-500">
                  {audioLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : getTypeIcon(currentItem.audio_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{currentItem.title}</p>
                  <p className="text-xs text-muted-foreground">{activePlaylist?.name}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => openImmersive(currentIndex ?? 0)} className="gap-1 hidden sm:flex">
                  <Maximize2 className="h-3.5 w-3.5" /> Immerse
                </Button>
              </div>
              <Progress value={progress} className="h-1.5" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{formatTime((progress / 100) * duration)}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipPrev} disabled={currentIndex === 0}>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="icon" className="h-10 w-10 rounded-full" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipNext} disabled={currentIndex === items.length - 1}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted || volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </Button>
                <Slider value={[isMuted ? 0 : volume]} min={0} max={1} step={0.01}
                  onValueChange={v => { setVolume(v[0]); if (v[0] > 0 && isMuted) setIsMuted(false); }}
                  className="flex-1 max-w-[200px]" />
                <span className="text-xs text-muted-foreground w-8 text-right">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Expanded Playlist Items ── */}
        {expandedPlaylistId && activePlaylistId === expandedPlaylistId && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ListMusic className="h-4 w-4 text-violet-500" />
                  {activePlaylist?.name}
                  <Badge variant="outline" className="text-xs">{count}/{maxItems}</Badge>
                </CardTitle>
                <div className="flex gap-1">
                  {activePlaylist && (
                    <Button variant="ghost" size="icon" className="h-7 w-7"
                      onClick={() => { setEditingId(activePlaylist.id); setEditName(activePlaylist.name); }} title="Rename">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {items.length > 0 && (
                    <>
                      <Button variant="outline" size="sm" className="h-7 gap-1" onClick={() => openImmersive(currentIndex ?? 0)}>
                        <Maximize2 className="h-3 w-3" /> Immerse
                      </Button>
                      <Button size="sm" className="h-7 gap-1" onClick={() => playItem(0)}>
                        <Play className="h-3 w-3" /> Play All
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ListMusic className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">This playlist is empty. Add content from the browser below.</p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-1">
                      {items.map((item, idx) => (
                        <SortablePlaylistItem key={item.id} item={item} idx={idx}
                          isCurrent={currentIndex === idx} isPlaying={isPlaying}
                          onPlay={() => playItem(idx)} onRemove={() => handleRemove(item.id)}
                          onImmerse={() => openImmersive(idx)} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
              {items.length > 0 && (
                <div className="flex justify-end mt-3">
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={clearPlaylist}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ── Add Content Browser ── */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Plus className="h-5 w-5 text-violet-500" /> Add Content
          </h2>
          <Tabs defaultValue="commentary" className="w-full">
            <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
              <TabsTrigger value="commentary" className="flex-1 min-w-[100px] text-xs gap-1"><BookOpen className="h-3 w-3" />Commentary</TabsTrigger>
              <TabsTrigger value="podcast" className="flex-1 min-w-[80px] text-xs gap-1"><Mic className="h-3 w-3" />Podcast</TabsTrigger>
              <TabsTrigger value="devotional" className="flex-1 min-w-[90px] text-xs gap-1"><Flame className="h-3 w-3" />Devotional</TabsTrigger>
              <TabsTrigger value="manna" className="flex-1 min-w-[80px] text-xs gap-1"><Sun className="h-3 w-3" />Manna</TabsTrigger>
              <TabsTrigger value="apologetics" className="flex-1 min-w-[100px] text-xs gap-1"><Shield className="h-3 w-3" />Apologetics</TabsTrigger>
              <TabsTrigger value="bible-reading" className="flex-1 min-w-[100px] text-xs gap-1"><BookOpen className="h-3 w-3" />Bible Reading</TabsTrigger>
            </TabsList>

            {/* ── Commentary Tab ── */}
            <TabsContent value="commentary"><CommentaryBrowser /></TabsContent>

            {/* ── Podcast Tab ── */}
            <TabsContent value="podcast"><PodcastBrowser /></TabsContent>

            {/* ── Devotional Tab ── */}
            <TabsContent value="devotional"><DevotionalBrowser /></TabsContent>

            {/* ── Morning Manna Tab ── */}
            <TabsContent value="manna"><MannaBrowser /></TabsContent>

            {/* ── Apologetics Tab ── */}
            <TabsContent value="apologetics"><ApologeticsBrowser /></TabsContent>

            {/* ── Bible Reading Tab ── */}
            <TabsContent value="bible-reading"><BibleReadingBrowser /></TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Immersive overlay */}
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

// ══════════════════════════════════════════════════════════════════════════════
// ── Tab Content: Commentary Browser ──
// ══════════════════════════════════════════════════════════════════════════════
function CommentaryBrowser() {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [voice, setVoice] = useState("");
  const { addItem, isFull, items } = usePlaylist();

  const chapters = useMemo(() => {
    if (!book) return [];
    return Array.from({ length: CHAPTER_COUNTS[book] || 1 }, (_, i) => i + 1);
  }, [book]);

  const voiceInfo = VOICE_STYLES.find(v => v.id === voice);
  const title = book && chapter && voiceInfo ? `${book} ${chapter} — ${voiceInfo.label} Commentary` : "";
  const alreadyAdded = title && items.some(i => i.title === title);

  const handleAdd = async () => {
    if (!book || !chapter || !voice) { toast.error("Select book, chapter, and voice"); return; }
    const v = VOICE_STYLES.find(s => s.id === voice)!;
    await addItem({
      title: `${book} ${chapter} — ${v.label} Commentary`,
      description: `${v.description} commentary on ${book} chapter ${chapter}`,
      audio_type: "commentary",
      audio_meta: { book, chapter: parseInt(chapter), voiceStyle: voice, voice: v.voice, generationType: voice === "verse-by-verse" ? "verse-commentary" : "chapter-commentary" },
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" /> Bible Audio Commentary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Select value={book} onValueChange={v => { setBook(v); setChapter(""); }}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Book..." /></SelectTrigger>
            <SelectContent className="max-h-[300px] z-[200]">{BIBLE_BOOKS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={chapter} onValueChange={setChapter} disabled={!book}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Chapter..." /></SelectTrigger>
            <SelectContent className="max-h-[300px] z-[200]" position="popper">{chapters.map(c => <SelectItem key={c} value={String(c)}>Ch. {c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={voice} onValueChange={setVoice}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Voice..." /></SelectTrigger>
            <SelectContent className="z-[200]" position="popper">{VOICE_STYLES.map(v => <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Button className="w-full gap-2" size="sm" onClick={handleAdd}
          disabled={!book || !chapter || !voice || isFull || !!alreadyAdded}>
          {alreadyAdded ? <><Check className="h-4 w-4" /> In Playlist</> : <><Plus className="h-4 w-4" /> Add to Playlist</>}
        </Button>
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── Tab Content: Podcast Browser ──
// ══════════════════════════════════════════════════════════════════════════════
function PodcastBrowser() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {PODCAST_EPISODES.map(ep => (
        <Card key={ep.id} className="flex items-center gap-3 p-3">
          <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
            <Mic className="h-5 w-5 text-violet-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Ep. {ep.episodeNumber}: {ep.title}</p>
            <p className="text-xs text-muted-foreground truncate">{ep.duration} — {ep.description}</p>
          </div>
          <AddToPlaylistButton
            title={`Ep. ${ep.episodeNumber}: ${ep.title}`}
            description={ep.description}
            audioType="podcast"
            audioUrl={`/audio/podcast/${ep.audioFile}`}
            size="icon"
            showLabel={false}
          />
        </Card>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── Tab Content: Devotional Browser ──
// ══════════════════════════════════════════════════════════════════════════════
function DevotionalBrowser() {
  const [devotionals, setDevotionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("daily_audio_devotionals")
        .select("id, title, description, audio_url, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      setDevotionals(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (devotionals.length === 0) return <p className="text-center text-sm text-muted-foreground py-8">No devotionals available yet.</p>;

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {devotionals.map(d => (
        <Card key={d.id} className="flex items-center gap-3 p-3">
          <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{d.title}</p>
            {d.description && <p className="text-xs text-muted-foreground truncate">{d.description}</p>}
          </div>
          <AddToPlaylistButton
            title={d.title}
            description={d.description}
            audioType="devotional"
            audioUrl={d.audio_url}
            size="icon"
            showLabel={false}
          />
        </Card>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── Tab Content: Morning Manna ──
// ══════════════════════════════════════════════════════════════════════════════
function MannaBrowser() {
  return (
    <Card>
      <CardContent className="p-6 text-center space-y-3">
        <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto">
          <Sun className="h-6 w-6 text-amber-500" />
        </div>
        <h3 className="font-medium">Morning Manna</h3>
        <p className="text-sm text-muted-foreground">
          Browse your morning watch devotionals and add them to any playlist.
        </p>
        <Button variant="outline" asChild>
          <a href="/morning-watches">Open Morning Watches</a>
        </Button>
        <p className="text-xs text-muted-foreground">
          Use the "+ Playlist" button on each watch to add it here.
        </p>
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── Tab Content: Apologetics Browser ──
// ══════════════════════════════════════════════════════════════════════════════
function ApologeticsBrowser() {
  const [avatar, setAvatar] = useState("");
  const [day, setDay] = useState("");
  const { addItem, isFull, items } = usePlaylist();

  const avatarInfo = AATS_AVATARS.find(a => a.id === avatar);
  const title = avatarInfo && day ? `Day ${day} — ${avatarInfo.name} AATS Training` : "";
  const alreadyAdded = title && items.some(i => i.title === title);

  const handleAdd = async () => {
    if (!avatar || !day) { toast.error("Select avatar and day"); return; }
    const a = AATS_AVATARS.find(x => x.id === avatar)!;
    await addItem({
      title: `Day ${day} — ${a.name} AATS Training`,
      description: `${a.emoji} Apologetics training day ${day} against ${a.name} arguments`,
      audio_type: "training",
      audio_meta: { avatarId: avatar, avatarName: a.name, day: parseInt(day), generationType: "aats-training" },
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="h-4 w-4 text-destructive" /> AATS Apologetics Training
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Select value={avatar} onValueChange={v => { setAvatar(v); setDay(""); }}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Avatar..." /></SelectTrigger>
            <SelectContent className="max-h-[300px] z-[200]" position="popper">
              {AATS_AVATARS.map(a => <SelectItem key={a.id} value={a.id}>{a.emoji} {a.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={day} onValueChange={setDay} disabled={!avatar}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select Day..." /></SelectTrigger>
            <SelectContent className="max-h-[300px] z-[200]" position="popper">
              {avatarInfo && Array.from({ length: avatarInfo.totalDays }, (_, i) => i + 1).map(d => (
                <SelectItem key={d} value={String(d)}>Day {d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full gap-2" size="sm" variant="destructive" onClick={handleAdd}
          disabled={!avatar || !day || isFull || !!alreadyAdded}>
          {alreadyAdded ? <><Check className="h-4 w-4" /> In Playlist</> : <><Plus className="h-4 w-4" /> Add to Playlist</>}
        </Button>
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── Tab Content: Bible Reading Browser ──
// ══════════════════════════════════════════════════════════════════════════════
function BibleReadingBrowser() {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const { addItem, isFull, items } = usePlaylist();

  const chapters = useMemo(() => {
    if (!book) return [];
    return Array.from({ length: CHAPTER_COUNTS[book] || 1 }, (_, i) => i + 1);
  }, [book]);

  const title = book && chapter ? `${book} ${chapter} — Bible Reading` : "";
  const alreadyAdded = title && items.some(i => i.title === title);

  const handleAdd = async () => {
    if (!book || !chapter) { toast.error("Select book and chapter"); return; }
    await addItem({
      title: `${book} ${chapter} — Bible Reading`,
      description: `Plain reading of ${book} chapter ${chapter}`,
      audio_type: "bible-reading",
      audio_meta: {
        book, chapter: parseInt(chapter),
        text: `Please read ${book} chapter ${chapter} from the Bible clearly and reverently.`,
        voice: "nPczCjzI2devNBz1zQrb",
        generationType: "bible-reading",
      },
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-500" /> Bible Chapter Reading (TTS)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Select value={book} onValueChange={v => { setBook(v); setChapter(""); }}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Book..." /></SelectTrigger>
            <SelectContent className="max-h-[300px] z-[200]">{BIBLE_BOOKS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={chapter} onValueChange={setChapter} disabled={!book}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Chapter..." /></SelectTrigger>
            <SelectContent className="max-h-[300px] z-[200]" position="popper">{chapters.map(c => <SelectItem key={c} value={String(c)}>Chapter {c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Button className="w-full gap-2" size="sm" onClick={handleAdd}
          disabled={!book || !chapter || isFull || !!alreadyAdded}>
          {alreadyAdded ? <><Check className="h-4 w-4" /> In Playlist</> : <><Plus className="h-4 w-4" /> Add to Playlist</>}
        </Button>
      </CardContent>
    </Card>
  );
}
