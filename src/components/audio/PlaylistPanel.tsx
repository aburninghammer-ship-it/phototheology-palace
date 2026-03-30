import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ListMusic,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Trash2,
  Volume2,
  X,
  Loader2,
  Headphones,
  BookOpen,
  Compass,
  Swords,
} from "lucide-react";
import { usePlaylist, PlaylistItem } from "@/hooks/usePlaylist";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";

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
  } = usePlaylist();

  const [audioLoading, setAudioLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval>>();

  // Create persistent audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const onEnded = () => {
      notifyTTSStopped();
      // Auto-advance
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

  const playItem = useCallback(async (index: number) => {
    const item = items[index];
    if (!item) return;

    setCurrentIndex(index);
    setAudioLoading(true);
    setProgress(0);

    const audio = audioRef.current;
    if (!audio) return;

    try {
      let url = item.audio_url;

      // Handle structured audio_meta types
      if (!url && item.audio_meta) {
        const meta = item.audio_meta as Record<string, any>;
        const genType = meta.generationType;

        if (genType === "chapter-commentary" || genType === "verse-commentary") {
          const voiceMode = meta.voiceStyle || "epic";
          
          // First check database cache for existing audio
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

              // If queued/processing, poll the cache table
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
                    if (s?.signedUrl) { url = s.signedUrl; break; }
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
                    if (s?.signedUrl) { url = s.signedUrl; break; }
                  }
                }
                if (!url) throw new Error("Commentary generation timed out. Try again later.");
              } else {
                throw e;
              }
            }
          }
        } else if (genType === "aats-training") {
          // Generate apologetics training audio via TTS with a contextual prompt
          const trainingText = `Apologetics training session: Day ${meta.day} with ${meta.avatarName}. This is an interactive training exercise designed to sharpen your ability to defend biblical truth against common objections.`;
          const { data, error } = await supabase.functions.invoke("text-to-speech", {
            body: { text: trainingText, voice: "nPczCjzI2devNBz1zQrb" },
          });
          if (error || !data) throw new Error("TTS generation failed");
          const blob = new Blob([data], { type: "audio/mpeg" });
          url = URL.createObjectURL(blob);
        } else if (meta.text) {
          // Fallback: raw text TTS
          const { data, error } = await supabase.functions.invoke("text-to-speech", {
            body: { text: meta.text.substring(0, 12000), voice: meta.voice || "nPczCjzI2devNBz1zQrb" },
          });
          if (error || !data) throw new Error("TTS generation failed");
          const blob = new Blob([data], { type: "audio/mpeg" });
          url = URL.createObjectURL(blob);
        }
      }

      if (!url) {
        toast.error("No audio available for this item");
        setAudioLoading(false);
        return;
      }

      audio.src = url;
      notifyTTSStarted();
      await audio.play();
      setIsPlaying(true);
      setAudioLoading(false);
    } catch (err) {
      console.error("Playlist playback error:", err);
      setAudioLoading(false);
      toast.error("Playback failed — try again in a moment");
    }
  }, [items, setCurrentIndex, setIsPlaying]);

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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          title="My Playlist"
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
      <SheetContent side="right" className="w-[380px] sm:w-[420px] flex flex-col p-0">
        <SheetHeader className="p-4 pb-2 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ListMusic className="h-5 w-5 text-primary" />
            My Playlist
            <Badge variant="outline" className="ml-auto text-xs">
              {count}/{maxItems}
            </Badge>
          </SheetTitle>
        </SheetHeader>

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
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
              <ListMusic className="h-12 w-12 text-muted-foreground/30" />
              <div>
                <p className="font-medium text-muted-foreground">Your playlist is empty</p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Add commentaries, audio tours, or training sessions using the
                  <ListMusic className="h-3.5 w-3.5 inline mx-1" />
                  button throughout the app.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {items.map((item, idx) => {
                const isCurrent = currentIndex === idx;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isCurrent
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => playItem(idx)}
                  >
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
                      className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.id);
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-3 border-t flex items-center justify-between">
            <Button variant="ghost" size="sm" className="text-destructive" onClick={clearPlaylist}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear All
            </Button>
            {!isPlaying && items.length > 0 && (
              <Button size="sm" onClick={() => playItem(0)} className="gap-1">
                <Play className="h-3.5 w-3.5" />
                Play All
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
