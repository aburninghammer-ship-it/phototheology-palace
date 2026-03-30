/**
 * ImmersiveAudioPlayer
 * Full-screen cinematic audio experience with:
 * - Dimmed fullscreen UI with ambient visuals
 * - Verse/text display synced to playback
 * - Continuous autoplay through queue
 * - Layered ambient background music
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  Music, ListMusic, Maximize2, Settings, Loader2, ChevronUp, ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { fetchChapterVerses } from "@/services/audioBibleService";
import { globalAudioManager } from "@/lib/globalAudioManager";
import { cn } from "@/lib/utils";
import type { ImmersiveTrack } from "@/hooks/useImmersiveMode";

// Ambient tracks for background layering
const AMBIENT_BG_TRACKS = [
  { id: "flight", name: "Flight", url: "/audio/flight.mp3" },
  { id: "wings-of-stillness", name: "Wings of Stillness", url: "/audio/wings-of-stillness.mp3" },
  { id: "eternal-echoes", name: "Eternal Echoes", url: "/audio/eternal-echoes.mp3" },
  { id: "dreams-of-joseph", name: "Dreams of Joseph", url: "/audio/dreams-of-joseph.mp3" },
  { id: "follow", name: "Follow", url: "/audio/follow.mp3" },
];

interface ImmersiveAudioPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: ImmersiveTrack[];
  currentIndex: number;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  ambientMusicEnabled: boolean;
  ambientVolume: number;
  continuousPlay: boolean;
  onSetAmbientMusic: (enabled: boolean) => void;
  onSetAmbientVolume: (vol: number) => void;
  onSetContinuousPlay: (enabled: boolean) => void;
}

interface Verse {
  verse: number;
  text: string;
}

export function ImmersiveAudioPlayer({
  isOpen,
  onClose,
  tracks,
  currentIndex,
  onNextTrack,
  onPrevTrack,
  hasNext,
  hasPrev,
  ambientMusicEnabled,
  ambientVolume,
  continuousPlay,
  onSetAmbientMusic,
  onSetAmbientVolume,
  onSetContinuousPlay,
}: ImmersiveAudioPlayerProps) {
  const track = tracks[currentIndex] || null;
  
  // Playback state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mainVolume, setMainVolume] = useState(1);
  const [mainMuted, setMainMuted] = useState(false);
  
  // Ambient music
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const [ambientTrackIdx, setAmbientTrackIdx] = useState(0);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  
  // Verse display
  const [verses, setVerses] = useState<Verse[]>([]);
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  const activeVerseRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  
  // Settings panel
  const [showSettings, setShowSettings] = useState(false);
  
  // Visual effects
  const [pulseIntensity, setPulseIntensity] = useState(0);
  
  // Initialize main audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
    }
    if (!ambientRef.current) {
      ambientRef.current = new Audio();
      ambientRef.current.preload = "auto";
      ambientRef.current.loop = false;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (ambientRef.current) {
        ambientRef.current.pause();
        ambientRef.current.src = "";
      }
    };
  }, []);

  // Load and play current track
  useEffect(() => {
    if (!isOpen || !track) return;
    let cancelled = false;

    const loadTrack = async () => {
      setIsLoading(true);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      
      try {
        let url = track.audioUrl;
        
        // If no URL but has generator, call it
        if (!url && track.generateAudio) {
          url = await track.generateAudio();
        }
        
        if (cancelled || !url || !audioRef.current) return;
        
        globalAudioManager.stopAllExcept(audioRef.current);
        
        const audio = audioRef.current;
        audio.src = url;
        audio.volume = mainMuted ? 0 : mainVolume;
        
        audio.onloadedmetadata = () => {
          if (!cancelled) {
            setDuration(audio.duration || 0);
            setIsLoading(false);
          }
        };
        
        audio.onended = () => {
          if (!cancelled) {
            setIsPlaying(false);
            if (continuousPlay && hasNext) {
              // Auto-advance after short pause
              setTimeout(() => {
                if (!cancelled) onNextTrack();
              }, 1500);
            }
          }
        };
        
        audio.onerror = () => {
          if (!cancelled) {
            setIsLoading(false);
            console.error("[Immersive] Audio error for track:", track.title);
          }
        };
        
        await audio.play();
        if (!cancelled) setIsPlaying(true);
      } catch (err) {
        if (!cancelled) {
          console.error("[Immersive] Failed to load track:", err);
          setIsLoading(false);
        }
      }
    };

    loadTrack();
    return () => { cancelled = true; };
  }, [isOpen, track, currentIndex]);

  // Load verses for commentary tracks
  useEffect(() => {
    if (!isOpen || !track?.book || !track?.chapter) {
      setVerses([]);
      return;
    }
    let cancelled = false;
    fetchChapterVerses(track.book, track.chapter).then(v => {
      if (!cancelled) setVerses(v || []);
    });
    return () => { cancelled = true; };
  }, [isOpen, track?.book, track?.chapter]);

  // Time tracking with RAF
  const updateTime = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime || 0);
    
    // Pulse effect based on time
    setPulseIntensity(Math.sin(Date.now() / 2000) * 0.3 + 0.7);
    
    // Map time to verse
    if (verses.length > 0 && audio.duration > 0) {
      const verseLen = audio.duration / verses.length;
      const idx = Math.min(Math.floor(audio.currentTime / verseLen), verses.length - 1);
      setActiveVerseIndex(idx);
    }
    
    rafRef.current = requestAnimationFrame(updateTime);
  }, [verses]);

  useEffect(() => {
    if (isOpen && isPlaying) {
      rafRef.current = requestAnimationFrame(updateTime);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isOpen, isPlaying, updateTime]);

  // Auto-scroll to active verse
  useEffect(() => {
    if (activeVerseRef.current) {
      activeVerseRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeVerseIndex]);

  // Ambient music management
  useEffect(() => {
    if (!ambientRef.current) return;
    
    if (isOpen && ambientMusicEnabled && isPlaying) {
      const ambient = ambientRef.current;
      const bgTrack = AMBIENT_BG_TRACKS[ambientTrackIdx % AMBIENT_BG_TRACKS.length];
      
      if (!ambient.src.includes(bgTrack.url)) {
        ambient.src = bgTrack.url;
        ambient.load();
      }
      ambient.volume = ambientVolume;
      ambient.play().then(() => setAmbientPlaying(true)).catch(() => {});
      
      // When ambient track ends, play next
      ambient.onended = () => {
        setAmbientTrackIdx(i => (i + 1) % AMBIENT_BG_TRACKS.length);
      };
    } else {
      ambientRef.current.pause();
      setAmbientPlaying(false);
    }
  }, [isOpen, ambientMusicEnabled, isPlaying, ambientTrackIdx, ambientVolume]);

  // Update ambient volume live
  useEffect(() => {
    if (ambientRef.current) {
      ambientRef.current.volume = ambientMusicEnabled ? ambientVolume : 0;
    }
  }, [ambientVolume, ambientMusicEnabled]);

  // Update main volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = mainMuted ? 0 : mainVolume;
    }
  }, [mainVolume, mainMuted]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") { e.preventDefault(); togglePlayPause(); }
      if (e.key === "ArrowRight" && hasNext) onNextTrack();
      if (e.key === "ArrowLeft" && hasPrev) onPrevTrack();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, hasNext, hasPrev, onNextTrack, onPrevTrack]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) { audioRef.current.pause(); }
      if (ambientRef.current) { ambientRef.current.pause(); }
      setIsPlaying(false);
      setAmbientPlaying(false);
    }
  }, [isOpen]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const seekTo = useCallback((pct: number) => {
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = (pct / 100) * duration;
    }
  }, [duration]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const typeIcon = track?.icon || (
    track?.type === "commentary" ? "📖" :
    track?.type === "apologetics" ? "⚔️" :
    track?.type === "tour" ? "🏛️" :
    track?.type === "devotional" ? "💜" : "🎧"
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[200] flex flex-col overflow-hidden"
      >
        {/* Cinematic background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
          {/* Animated ambient glow */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(ellipse at 30% 40%, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
                "radial-gradient(ellipse at 70% 60%, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
                "radial-gradient(ellipse at 40% 70%, hsl(var(--primary) / 0.12) 0%, transparent 70%)",
                "radial-gradient(ellipse at 30% 40%, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
              ],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          {/* Subtle particle dots */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{typeIcon}</span>
            <div>
              <h2 className="text-lg font-bold text-foreground">{track?.title || "Immerse Mode"}</h2>
              <p className="text-xs text-muted-foreground">
                {track?.subtitle || track?.modeName || "Cinematic Audio Experience"}
                {tracks.length > 1 && ` — ${currentIndex + 1} of ${tracks.length}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Ambient music indicator */}
            {ambientPlaying && (
              <Badge variant="secondary" className="text-xs gap-1 animate-pulse">
                <Music className="h-3 w-3" /> Ambient
              </Badge>
            )}
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="relative z-10 border-b border-border/30 overflow-hidden"
            >
              <div className="px-6 py-4 space-y-4 max-w-lg mx-auto">
                {/* Ambient music toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Ambient Background Music</span>
                  </div>
                  <Switch
                    checked={ambientMusicEnabled}
                    onCheckedChange={onSetAmbientMusic}
                  />
                </div>
                {/* Ambient volume */}
                {ambientMusicEnabled && (
                  <div className="flex items-center gap-3 pl-6">
                    <span className="text-xs text-muted-foreground w-20">Music Volume</span>
                    <Slider
                      value={[ambientVolume * 100]}
                      onValueChange={([v]) => onSetAmbientVolume(v / 100)}
                      max={50}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-8">{Math.round(ambientVolume * 100)}%</span>
                  </div>
                )}
                {/* Continuous play */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListMusic className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Continuous Autoplay</span>
                  </div>
                  <Switch
                    checked={continuousPlay}
                    onCheckedChange={onSetContinuousPlay}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content area */}
        <div className="relative flex-1 overflow-hidden z-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-10 w-10 text-primary" />
              </motion.div>
              <p className="text-muted-foreground text-sm">Preparing your immersive experience...</p>
            </div>
          ) : verses.length > 0 ? (
            /* Verse-synced display for commentary */
            <ScrollArea className="h-full">
              <div className="max-w-2xl mx-auto px-6 py-12 space-y-1">
                {verses.map((v, idx) => {
                  const isActive = idx === activeVerseIndex;
                  const isPast = idx < activeVerseIndex;
                  return (
                    <motion.div
                      key={v.verse}
                      ref={isActive ? activeVerseRef : undefined}
                      animate={isActive ? { scale: 1.01 } : { scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        "py-4 px-5 rounded-xl transition-all duration-700 cursor-pointer",
                        isActive
                          ? "bg-primary/10 border border-primary/25 shadow-xl shadow-primary/5"
                          : isPast
                            ? "opacity-40"
                            : "opacity-30"
                      )}
                      onClick={() => {
                        if (audioRef.current && duration > 0) {
                          audioRef.current.currentTime = (idx / verses.length) * duration;
                        }
                      }}
                    >
                      <span className={cn(
                        "inline-block w-8 text-right mr-4 text-xs font-mono",
                        isActive ? "text-primary font-bold" : "text-muted-foreground"
                      )}>
                        {v.verse}
                      </span>
                      <span className={cn(
                        "text-lg leading-relaxed",
                        isActive ? "text-foreground font-medium" : "text-foreground/50"
                      )}>
                        {v.text}
                      </span>
                    </motion.div>
                  );
                })}
                <div className="h-40" />
              </div>
            </ScrollArea>
          ) : track?.displayText ? (
            /* Text display for apologetics/tours */
            <ScrollArea className="h-full">
              <div className="max-w-2xl mx-auto px-6 py-12">
                <div className="text-lg leading-relaxed text-foreground/80 whitespace-pre-wrap">
                  {track.displayText}
                </div>
              </div>
            </ScrollArea>
          ) : (
            /* Ambient visual mode (no text) */
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <motion.div
                className="text-8xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {typeIcon}
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground/80">{track?.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{track?.subtitle || track?.modeName}</p>
              </div>
              {/* Audio waveform visualization */}
              <div className="flex items-end gap-1 h-16">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-primary/40 rounded-full"
                    animate={isPlaying ? {
                      height: [
                        `${10 + Math.random() * 40}px`,
                        `${10 + Math.random() * 50}px`,
                        `${10 + Math.random() * 30}px`,
                      ],
                    } : { height: "8px" }}
                    transition={{
                      duration: 0.6 + Math.random() * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Queue indicator */}
        {tracks.length > 1 && (
          <div className="relative z-10 px-6 py-2 flex items-center justify-center gap-1">
            {tracks.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === currentIndex
                    ? "w-8 bg-primary"
                    : idx < currentIndex
                      ? "w-2 bg-primary/40"
                      : "w-2 bg-muted-foreground/20"
                )}
              />
            ))}
          </div>
        )}

        {/* Bottom controls */}
        <div className="relative z-10 border-t border-border/30 px-6 py-5 backdrop-blur-sm bg-background/50">
          {/* Progress bar */}
          <div
            className="w-full h-2 bg-muted/50 rounded-full mb-5 overflow-hidden cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              seekTo(pct);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full transition-[width] duration-150 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-primary shadow-lg shadow-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Time */}
            <span className="text-xs text-muted-foreground font-mono w-16">
              {formatTime(currentTime)}
            </span>

            {/* Center controls */}
            <div className="flex items-center gap-4">
              {/* Volume */}
              <Button
                variant="ghost" size="icon"
                onClick={() => setMainMuted(!mainMuted)}
                className="h-9 w-9"
              >
                {mainMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              {/* Previous */}
              <Button
                variant="ghost" size="icon"
                onClick={onPrevTrack}
                disabled={!hasPrev}
                className="h-10 w-10"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              {/* Play/Pause */}
              <Button
                variant="default"
                size="lg"
                onClick={togglePlayPause}
                className="h-14 w-14 rounded-full shadow-lg shadow-primary/30"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </Button>

              {/* Next */}
              <Button
                variant="ghost" size="icon"
                onClick={onNextTrack}
                disabled={!hasNext}
                className="h-10 w-10"
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              {/* Main volume slider */}
              <div className="w-20 hidden sm:block">
                <Slider
                  value={[mainVolume * 100]}
                  onValueChange={([v]) => setMainVolume(v / 100)}
                  max={100}
                  step={1}
                />
              </div>
            </div>

            {/* Duration */}
            <span className="text-xs text-muted-foreground font-mono w-16 text-right">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
