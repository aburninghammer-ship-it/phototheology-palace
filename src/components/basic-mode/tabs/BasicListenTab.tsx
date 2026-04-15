/**
 * BasicListenTab — Listening Experience tab for Level 1 & Level 2
 * Shows playlist hub inline within the shell.
 */
import { useState, useCallback, useRef, useEffect } from "react";

import { usePlaylist } from "@/hooks/usePlaylist";
import { useAuth } from "@/hooks/useAuth";
import { useImmersiveMode } from "@/hooks/useImmersiveMode";
import { ImmersiveAudioPlayer } from "@/components/audio/ImmersiveAudioPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ListMusic, Play, Pause, SkipForward, SkipBack, Trash2, Plus, Sun,
  Moon, BookOpen, Headphones, Swords, Compass, Maximize2, GripVertical,
  Volume2, VolumeX, Check, X, Pencil, Loader2,
  BookOpenCheck, Mic, Sparkles, ExternalLink,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
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
import { PODCAST_EPISODES } from "@/data/podcastData";

/* ── Sortable item (compact) ── */
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
      className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-colors ${isCurrent ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50 border border-transparent"}`}
      onClick={onPlay}
    >
      <button className="flex-shrink-0 touch-none text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        {...attributes} {...listeners} onClick={(e) => e.stopPropagation()}>
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <div className={`flex-shrink-0 w-5 text-center ${isCurrent ? "text-primary" : "text-muted-foreground/50"}`}>
        {isCurrent && isPlaying ? <Volume2 className="h-3.5 w-3.5 animate-pulse" /> : <span className="text-[10px]">{idx + 1}</span>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{item.title}</p>
      </div>
      <Badge variant="outline" className="text-[9px] flex-shrink-0">{item.audio_type}</Badge>
      <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0 text-muted-foreground hover:text-destructive"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}>
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

/* ── Quick add sources (inline — no navigation) ── */
interface QuickSource {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  expandable?: boolean;
}

const VOICE_STYLES = [
  { id: "epic", label: "Epic Narrator", emoji: "🎬" },
  { id: "urban", label: "Modern Preacher", emoji: "🎤" },
  { id: "counselor", label: "Counselor", emoji: "💬" },
  { id: "ancient", label: "Ancient Voice", emoji: "📜" },
  { id: "preacher", label: "Preacher", emoji: "🔥" },
  { id: "scholar", label: "Scholar", emoji: "🎓" },
  { id: "kids", label: "Kids Adventure", emoji: "🧒" },
  { id: "mirror", label: "Mirror", emoji: "🪞" },
];

const MORNING_OPTIONS = [
  { id: "activation", label: "Mental Activation", emoji: "⚡" },
  { id: "scripture", label: "Scripture Focus", emoji: "📖" },
  { id: "prayer", label: "Prayer & Praise", emoji: "🙏" },
];

const NIGHT_OPTIONS = [
  { id: "reflection", label: "Day Reflection", emoji: "🌙" },
  { id: "meditation", label: "Scripture Meditation", emoji: "🧘" },
  { id: "rest", label: "Rest & Surrender", emoji: "😴" },
];

const APOLOGETICS_OPTIONS = [
  { id: "cota", label: "COTA Deep Dive", emoji: "📚" },
  { id: "aats", label: "AATS Defense", emoji: "🛡️" },
  { id: "prophecy", label: "Prophetic Evidence", emoji: "🔮" },
  { id: "general", label: "General Apologetics", emoji: "⚔️" },
];

const QUICK_SOURCES: QuickSource[] = [
  { id: "morning", title: "Morning Watch", icon: <Sun className="h-4 w-4" />, color: "text-amber-400", expandable: true },
  { id: "night", title: "Night Watch", icon: <Moon className="h-4 w-4" />, color: "text-indigo-400", expandable: true },
  { id: "devotional", title: "Daily Devotional", icon: <Sparkles className="h-4 w-4" />, color: "text-purple-400" },
  { id: "commentary", title: "Commentary", icon: <BookOpen className="h-4 w-4" />, color: "text-emerald-400", expandable: true },
  { id: "reading", title: "Bible Reading", icon: <BookOpenCheck className="h-4 w-4" />, color: "text-blue-400", expandable: true },
  { id: "podcast", title: "Podcast", icon: <Mic className="h-4 w-4" />, color: "text-orange-400", expandable: true },
  { id: "apologetics", title: "Apologetics", icon: <Swords className="h-4 w-4" />, color: "text-red-400", expandable: true },
  { id: "tour", title: "Palace Tour", icon: <Compass className="h-4 w-4" />, color: "text-cyan-400" },
];

const BIBLE_BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
  "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra",
  "Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon",
  "Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah",
  "Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians",
  "2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians",
  "2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James",
  "1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation",
];

export default function BasicListenTab() {
  
  const { user } = useAuth();
  const {
    items, loading, removeItem, clearPlaylist, count, maxItems,
    currentIndex, setCurrentIndex, isPlaying, setIsPlaying, reorderItems,
    playlists, activePlaylistId, selectPlaylist, createPlaylist, renamePlaylist, deletePlaylist,
    addItem,
  } = usePlaylist();
  const immersive = useImmersiveMode();

  const [showAddPanel, setShowAddPanel] = useState(false);
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVoiceStyle, setSelectedVoiceStyle] = useState("epic");

  // Audio playback
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

  // Auto-create playlist
  const autoCreatedRef = useRef(false);
  useEffect(() => {
    if (user && !loading && playlists.length === 0 && !autoCreatedRef.current) {
      autoCreatedRef.current = true;
      createPlaylist("My Playlist");
    }
  }, [user, loading, playlists.length, createPlaylist]);

  // Store playItem in a ref so event listeners always have the latest version
  const playItemRef = useRef<(index: number) => Promise<void>>();

  // Audio setup
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    const onEnded = () => {
      notifyTTSStopped();
      const ci = currentIndexRef.current;
      const len = itemsLenRef.current;
      if (ci !== null && ci < len - 1) {
        playItemRef.current?.(ci + 1);
      } else {
        setIsPlaying(false); setCurrentIndex(null); setProgress(0);
      }
    };
    const onLoadedMetadata = () => { setDuration(audio.duration || 0); setAudioLoading(false); };
    const onError = () => {
      setAudioLoading(false);
      // Auto-skip to next track on error instead of stopping
      const ci = currentIndexRef.current;
      const len = itemsLenRef.current;
      if (ci !== null && ci < len - 1) {
        toast.error("Track failed, skipping to next...");
        playItemRef.current?.(ci + 1);
      } else {
        setIsPlaying(false);
        toast.error("Playback failed");
      }
    };
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("error", onError);
    };
  }, []);

  // Keep refs in sync for stable event listener callbacks
  const currentIndexRef = useRef(currentIndex);
  const itemsLenRef = useRef(items.length);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { itemsLenRef.current = items.length; }, [items.length]);

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

    // If there's already a direct URL (e.g. podcast), return it
    if (url && !url.includes('/storage/v1/object/sign/')) return url;

    const meta = (item.audio_meta || {}) as Record<string, any>;
    const genType = meta.generationType;

    if (!url && genType) {
      try {
        // Commentary (epic, modern, etc.) — call generate-epic-commentary
        if (genType === "chapter-commentary" || genType === "verse-commentary") {
          const voiceMode = meta.voiceStyle || "epic";
          // First try epic_commentaries table (voice-styled)
          const { data: epic } = await (supabase as any).from("epic_commentaries")
            .select("audio_storage_path, commentary_text")
            .eq("book", meta.book).eq("chapter", meta.chapter)
            .eq("commentary_mode", voiceMode).eq("status", "ready")
            .order("version", { ascending: false }).limit(1).maybeSingle();
          if (epic?.audio_storage_path) {
            const { data: signed } = await supabase.storage.from("epic-audio").createSignedUrl(epic.audio_storage_path, 3600);
            if (signed?.signedUrl) url = signed.signedUrl;
          }
          // Fallback to chapter_commentary_cache
          if (!url) {
            const { data: cached } = await supabase.from("chapter_commentary_cache")
              .select("audio_storage_path").eq("book", meta.book).eq("chapter", meta.chapter)
              .eq("voice_id", voiceMode).maybeSingle();
            if (cached?.audio_storage_path) {
              const { data: signed } = await supabase.storage.from("audio-cache").createSignedUrl(cached.audio_storage_path, 3600);
              if (signed?.signedUrl) url = signed.signedUrl;
            }
          }
          // If still no cached audio, generate it via edge function
          if (!url && meta.book && meta.chapter) {
            toast.info("Generating commentary audio... this may take a moment");
            const { data: resp } = await supabase.functions.invoke("generate-epic-commentary", {
              body: { book: meta.book, chapter: meta.chapter, mode: meta.voiceStyle || "epic" },
            });
            if (resp?.audioUrl) url = resp.audioUrl;
          }
        }

        // Morning / Night Watch — generate via edge function
        if (genType === "morning-watch" || genType === "night-watch") {
          const watchType = genType === "morning-watch" ? "morning" : "night";
          toast.info(`Generating ${watchType} watch audio...`);
          const { data: resp } = await supabase.functions.invoke("generate-chapter-commentary", {
            body: { book: "Psalms", chapter: 23, watchType, mode: meta.mode || "reflection" },
          });
          if (resp?.audioUrl) url = resp.audioUrl;
          // Fallback: try generating a simple TTS of watch content
          if (!url) {
            const watchText = `${watchType === "morning" ? "Good morning" : "Good evening"}. This is your ${watchType} watch ${meta.mode || ""} session. Take a moment to center your mind on Christ.`;
            const { data: ttsResp } = await supabase.functions.invoke("watch-tts", {
              body: { text: watchText, watchType },
            });
            if (ttsResp?.audioUrl) url = ttsResp.audioUrl;
          }
        }

        // Daily devotional
        if (genType === "daily-devotional") {
          const { data: devs } = await (supabase as any).from("daily_audio_devotionals")
            .select("audio_url, audio_storage_path")
            .eq("status", "ready")
            .order("day_number", { ascending: false }).limit(1).maybeSingle();
          if (devs?.audio_url) url = devs.audio_url;
          else if (devs?.audio_storage_path) {
            const { data: signed } = await supabase.storage.from("audio-cache").createSignedUrl(devs.audio_storage_path, 3600);
            if (signed?.signedUrl) url = signed.signedUrl;
          }
        }

        // Palace tour
        if (genType === "palace-tour") {
          const { data: resp } = await supabase.functions.invoke("generate-palace-tour-audio", {
            body: { script: "Welcome to the Phototheology Palace. Let me guide you through the eight floors of biblical discovery.", voice: "reginald", guide: "reginald", segmentId: "playlist-tour" },
          });
          if (resp?.audioUrl) url = resp.audioUrl;
        }

        // Apologetics
        if (genType === "apologetics") {
          toast.info("Generating apologetics audio...");
          const { data: resp } = await supabase.functions.invoke("generate-epic-commentary", {
            body: { book: "Daniel", chapter: 2, mode: "scholar" },
          });
          if (resp?.audioUrl) url = resp.audioUrl;
        }

        // Bible Reading — generate chapter commentary as fallback
        if (genType === "bible-reading" || genType === "chapter-reading") {
          toast.info("Loading Bible reading...");
          const { data: resp } = await supabase.functions.invoke("generate-chapter-commentary", {
            body: { book: meta.book || "Genesis", chapter: meta.chapter || 1 },
          });
          if (resp?.audioUrl) url = resp.audioUrl;
        }
      } catch (err) {
        console.error("[resolveAudioUrl] Error resolving audio:", err);
      }
    }

    // Re-sign expired signed URLs
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

  const handleCreatePlaylist = async () => {
    const name = newPlaylistName.trim();
    if (!name) return;
    await createPlaylist(name);
    setNewPlaylistName("");
    setShowCreateInput(false);
  };

  const addPodcastToPlaylist = async (ep: typeof PODCAST_EPISODES[0]) => {
    await addItem({
      title: `Podcast Ep. ${ep.episodeNumber}: ${ep.title}`,
      description: ep.description.slice(0, 80),
      audio_type: "podcast",
      audio_url: `/audio/podcast/${ep.audioFile}`,
      audio_meta: { generationType: "podcast", episodeNumber: ep.episodeNumber },
    });
  };

  const handleQuickAdd = async (sourceId: string) => {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    switch (sourceId) {
      case "morning":
      case "night":
      case "apologetics":
      case "commentary":
      case "reading":
      case "podcast":
        setExpandedSource(expandedSource === sourceId ? null : sourceId);
        break;
      case "devotional":
        await addItem({
          title: `Daily Devotional — ${today}`,
          description: "Today's audio devotional",
          audio_type: "devotional",
          audio_url: null,
          audio_meta: { generationType: "daily-devotional", date: today },
        });
        toast.success("Devotional added");
        break;
      case "tour":
        await addItem({
          title: "Palace Tour",
          description: "Guided Phototheology Palace walkthrough",
          audio_type: "palace-tour",
          audio_url: null,
          audio_meta: { generationType: "palace-tour" },
        });
        toast.success("Palace Tour added");
        break;
    }
  };

  const addMorningWatch = async (option: typeof MORNING_OPTIONS[0]) => {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    await addItem({
      title: `Morning Watch: ${option.label} — ${today}`,
      description: `Morning ${option.label.toLowerCase()} session`,
      audio_type: "morning-watch",
      audio_url: null,
      audio_meta: { generationType: "morning-watch", mode: option.id, date: today },
    });
    toast.success(`Morning Watch (${option.label}) added`);
  };

  const addNightWatch = async (option: typeof NIGHT_OPTIONS[0]) => {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    await addItem({
      title: `Night Watch: ${option.label} — ${today}`,
      description: `Night ${option.label.toLowerCase()} session`,
      audio_type: "night-watch",
      audio_url: null,
      audio_meta: { generationType: "night-watch", mode: option.id, date: today },
    });
    toast.success(`Night Watch (${option.label}) added`);
  };

  const addApologetics = async (option: typeof APOLOGETICS_OPTIONS[0]) => {
    await addItem({
      title: `Apologetics: ${option.label}`,
      description: `${option.label} apologetics session`,
      audio_type: "apologetics",
      audio_url: null,
      audio_meta: { generationType: "apologetics", mode: option.id },
    });
    toast.success(`Apologetics (${option.label}) added`);
  };

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
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

  return (
    <ScrollArea className="h-full">
      <div className="px-3 py-4 space-y-3 max-w-2xl mx-auto">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Listening Experience</h2>
          </div>
          <Badge variant="outline" className="text-xs">{count}/{maxItems}</Badge>
        </div>

        {/* Playlist tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {playlists.map(pl => (
            editingId === pl.id ? (
              <div key={pl.id} className="flex items-center gap-1 flex-shrink-0">
                <Input value={editName} onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name..." className="h-7 w-28 text-xs" autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editName.trim()) { renamePlaylist(pl.id, editName); setEditingId(null); }
                    if (e.key === "Escape") setEditingId(null);
                  }} />
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { if (editName.trim()) { renamePlaylist(pl.id, editName); setEditingId(null); } }}><Check className="h-3 w-3" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingId(null)}><X className="h-3 w-3" /></Button>
              </div>
            ) : (
              <Button
                key={pl.id}
                variant={pl.id === activePlaylistId ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0 h-7 text-xs gap-1 group"
                onClick={() => selectPlaylist(pl.id)}
                onDoubleClick={(e) => { e.stopPropagation(); setEditingId(pl.id); setEditName(pl.name); }}
              >
                <ListMusic className="h-3 w-3" />
                <span className="truncate max-w-[100px]">{pl.name}</span>
                <Pencil className="h-2.5 w-2.5 opacity-0 group-hover:opacity-60 transition-opacity ml-0.5"
                  onClick={(e) => { e.stopPropagation(); setEditingId(pl.id); setEditName(pl.name); }} />
              </Button>
            )
          ))}
          {showCreateInput ? (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Input value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Name..." className="h-7 w-28 text-xs" autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreatePlaylist();
                  if (e.key === "Escape") { setShowCreateInput(false); setNewPlaylistName(""); }
                }} />
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCreatePlaylist}><Check className="h-3 w-3" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setShowCreateInput(false); setNewPlaylistName(""); }}><X className="h-3 w-3" /></Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" className="flex-shrink-0 h-7 text-xs gap-1 text-muted-foreground"
              onClick={() => setShowCreateInput(true)}>
              <Plus className="h-3 w-3" /> New
            </Button>
          )}
        </div>

        {/* Now Playing */}
        {currentItem && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                {audioLoading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Headphones className="h-4 w-4 text-primary" />}
                <p className="text-sm font-medium truncate flex-1">{currentItem.title}</p>
              </div>
              <Progress value={progress} className="h-1" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{formatTime((progress / 100) * duration)}</span>
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipPrev} disabled={currentIndex === 0}>
                    <SkipBack className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="default" size="icon" className="h-9 w-9 rounded-full" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipNext} disabled={currentIndex === items.length - 1}>
                    <SkipForward className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <span className="text-[10px] text-muted-foreground">{formatTime(duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </Button>
                <Slider value={[isMuted ? 0 : volume]} min={0} max={1} step={0.01}
                  onValueChange={(v) => { setVolume(v[0]); if (v[0] > 0 && isMuted) setIsMuted(false); }}
                  className="flex-1" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Queue */}
        {loading ? (
          <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <Headphones className="h-10 w-10 mx-auto text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">Your playlist is empty</p>
            <p className="text-xs text-muted-foreground/60">Add content below to start your listening experience</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-0.5">
                {items.map((item, idx) => (
                  <SortableItem key={item.id} item={item} idx={idx}
                    isCurrent={currentIndex === idx} isPlaying={isPlaying}
                    onPlay={() => playItem(idx)} onRemove={() => handleRemove(item.id)} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Actions */}
        {items.length > 0 && (
          <div className="flex items-center justify-between pt-1">
            <Button variant="ghost" size="sm" className="text-destructive text-xs h-7 gap-1" onClick={clearPlaylist}>
              <Trash2 className="h-3 w-3" /> Clear
            </Button>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => openImmersive(currentIndex ?? 0)}>
                <Maximize2 className="h-3 w-3" /> Immerse
              </Button>
              {!isPlaying && (
                <Button size="sm" className="text-xs h-7 gap-1" onClick={() => playItem(0)}>
                  <Play className="h-3 w-3" /> Play All
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ── Add Content Section (all inline) ── */}
        <div className="border-t pt-3 space-y-3">
          <h3 className="text-sm font-semibold">Add Content</h3>

          {/* Quick source buttons */}
          <div className="grid grid-cols-4 gap-2">
            {QUICK_SOURCES.map(src => (
              <button
                key={src.id}
                onClick={() => {
                  if (src.expandable) {
                    setExpandedSource(expandedSource === src.id ? null : src.id);
                  } else {
                    // Direct add for non-expandable sources
                    handleQuickAdd(src.id);
                  }
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all group ${
                  expandedSource === src.id ? "border-primary/40 bg-primary/5" : "border-transparent hover:border-border hover:bg-muted/50"
                }`}
              >
                <div className={`${src.color} group-hover:scale-110 transition-transform`}>{src.icon}</div>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">{src.title}</span>
              </button>
            ))}
          </div>

          {/* Expanded: Morning Watch */}
          {expandedSource === "morning" && (
            <Card className="border-primary/20">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-400" />
                  <h4 className="text-xs font-semibold">Morning Watch Style</h4>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {MORNING_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addMorningWatch(opt)}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all">
                      <span className="text-lg">{opt.emoji}</span>
                      <span className="text-[10px] text-muted-foreground text-center leading-tight">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expanded: Night Watch */}
          {expandedSource === "night" && (
            <Card className="border-primary/20">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-indigo-400" />
                  <h4 className="text-xs font-semibold">Night Watch Style</h4>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {NIGHT_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addNightWatch(opt)}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all">
                      <span className="text-lg">{opt.emoji}</span>
                      <span className="text-[10px] text-muted-foreground text-center leading-tight">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expanded: Apologetics */}
          {expandedSource === "apologetics" && (
            <Card className="border-primary/20">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Swords className="h-4 w-4 text-red-400" />
                  <h4 className="text-xs font-semibold">Apologetics Type</h4>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {APOLOGETICS_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addApologetics(opt)}
                      className="flex items-center gap-2 p-2.5 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all text-left">
                      <span className="text-lg">{opt.emoji}</span>
                      <span className="text-xs text-muted-foreground">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expanded: Commentary / Bible Reading with voice selection */}
          {(expandedSource === "commentary" || expandedSource === "reading") && (
            <Card className="border-primary/20">
              <CardContent className="p-3 space-y-2">
                <p className="text-xs font-semibold">
                  {expandedSource === "commentary" ? "Add Commentary" : "Add Bible Reading"}
                </p>
                {expandedSource === "commentary" && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground font-medium">Voice Style</p>
                    <div className="grid grid-cols-4 gap-1">
                      {VOICE_STYLES.map(v => (
                        <button key={v.id} onClick={() => setSelectedVoiceStyle(v.id)}
                          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg border transition-all text-center ${
                            selectedVoiceStyle === v.id
                              ? "border-primary/50 bg-primary/10"
                              : "border-transparent hover:border-border hover:bg-muted/50"
                          }`}>
                          <span className="text-sm">{v.emoji}</span>
                          <span className="text-[9px] text-muted-foreground leading-tight">{v.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <select
                    value={selectedBook}
                    onChange={(e) => { setSelectedBook(e.target.value); setSelectedChapter(1); }}
                    className="flex-1 h-8 text-xs rounded-md border bg-background px-2"
                  >
                    {BIBLE_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <Input
                    type="number" min={1} max={150} value={selectedChapter}
                    onChange={(e) => setSelectedChapter(parseInt(e.target.value) || 1)}
                    className="w-16 h-8 text-xs"
                    placeholder="Ch"
                  />
                  <Button size="sm" className="h-8 text-xs gap-1" onClick={() => {
                    const type = expandedSource === "commentary" ? "commentary" : "reading";
                    const voiceLabel = expandedSource === "commentary"
                      ? VOICE_STYLES.find(v => v.id === selectedVoiceStyle)?.label || "Epic Narrator"
                      : "";
                    addItem({
                      title: `${selectedBook} ${selectedChapter}${type === "commentary" ? ` (${voiceLabel})` : " (Reading)"}`,
                      description: `${type === "commentary" ? `${voiceLabel} commentary for` : "Bible reading of"} ${selectedBook} ${selectedChapter}`,
                      audio_type: type,
                      audio_url: null,
                      audio_meta: {
                        generationType: type === "commentary" ? "chapter-commentary" : "chapter-reading",
                        book: selectedBook,
                        chapter: selectedChapter,
                        ...(type === "commentary" ? { voiceStyle: selectedVoiceStyle } : {}),
                      },
                    });
                    toast.success(`Added ${selectedBook} ${selectedChapter}`);
                  }}>
                    <Plus className="h-3 w-3" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Podcast quick-add */}
          {expandedSource === "podcast" && (
            <Card className="border-primary/20">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-orange-400" />
                  <h4 className="text-xs font-semibold">Podcast Episodes</h4>
                  <Badge variant="outline" className="text-[9px]">{PODCAST_EPISODES.length} episodes</Badge>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {PODCAST_EPISODES.map(ep => {
                    const alreadyAdded = items.some(i => 
                      i.audio_meta && (i.audio_meta as any).episodeNumber === ep.episodeNumber && i.audio_type === "podcast"
                    );
                    return (
                      <div key={ep.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                          alreadyAdded ? "border-primary/20 bg-primary/5 opacity-60" : "border-transparent hover:border-border hover:bg-muted/30"
                        }`}>
                        <span className="text-[10px] text-muted-foreground w-5 text-center shrink-0">{ep.episodeNumber}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{ep.title}</p>
                          <p className="text-[10px] text-muted-foreground">{ep.duration}</p>
                        </div>
                        <Button variant={alreadyAdded ? "ghost" : "outline"} size="sm"
                          className="h-6 text-[10px] px-2 shrink-0" disabled={alreadyAdded}
                          onClick={() => addPodcastToPlaylist(ep)}>
                          {alreadyAdded ? <Check className="h-3 w-3" /> : <><Plus className="h-3 w-3 mr-0.5" /> Add</>}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
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
    </ScrollArea>
  );
}
