/**
 * ImmersiveAudioPlayer
 * Full-screen cinematic audio experience with:
 * - Dimmed fullscreen UI with ambient visuals
 * - Verse/text display synced to playback
 * - Continuous autoplay through queue
 * - Layered ambient background music
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { VoiceQualitySelector } from "./VoiceQualitySelector";
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
import { ImmersiveParticles } from "./immersive/ImmersiveParticles";
import { ImmersiveKaraokeVerse } from "./immersive/ImmersiveKaraokeVerse";
import { ImmersiveSleepTimer } from "./immersive/ImmersiveSleepTimer";

// Cinematic music tracks for background layering
const AMBIENT_BG_TRACKS = [
  { id: "flight", name: "Flight", url: "/audio/flight.mp3" },
  { id: "wings-of-stillness", name: "Wings of Stillness", url: "/audio/wings-of-stillness.mp3" },
  { id: "eternal-echoes", name: "Eternal Echoes", url: "/audio/eternal-echoes.mp3" },
  { id: "dreams-of-joseph", name: "Dreams of Joseph", url: "/audio/dreams-of-joseph.mp3" },
  { id: "follow", name: "Follow", url: "/audio/follow.mp3" },
];

// Meditation ambient tracks — calming, gentle, designed to sit under voice
const AMBIENT_SOUND_TRACKS = [
  { id: "still-water-mind", name: "Still Water Mind", url: "/audio/still-water-mind.mp3" },
  { id: "still-water-mind-2", name: "Still Water Mind II", url: "/audio/still-water-mind-2.mp3" },
  { id: "still-waters-gentle-word", name: "Still Waters Gentle Word", url: "/audio/still-waters-gentle-word.mp3" },
  { id: "still-waters-gentle-word-2", name: "Still Waters Gentle Word II", url: "/audio/still-waters-gentle-word-2.mp3" },
  { id: "breath-of-your-presence", name: "Breath of Your Presence", url: "/audio/breath-of-your-presence.mp3" },
  { id: "breath-of-your-presence-2", name: "Breath of Your Presence II", url: "/audio/breath-of-your-presence-2.mp3" },
  { id: "still-waters-quiet-soul", name: "Still Waters Quiet Soul", url: "/audio/still-waters-quiet-soul.mp3" },
  { id: "still-waters-quiet-soul-2", name: "Still Waters Quiet Soul II", url: "/audio/still-waters-quiet-soul-2.mp3" },
  { id: "weightless-river", name: "Weightless River", url: "/audio/weightless-river.mp3" },
  { id: "weightless-river-2", name: "Weightless River II", url: "/audio/weightless-river-2.mp3" },
];

// Crossfade duration in ms
const CROSSFADE_DURATION = 4000;
// Voice ducking: music volume multiplier when voice is playing (higher = less ducking)
const VOICE_DUCK_RATIO = 0.55;

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
  
  // Ambient music — two audio elements for crossfade
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const ambientNextRef = useRef<HTMLAudioElement | null>(null);
  const crossfadeTimerRef = useRef<number>();
  const [ambientTrackIdx, setAmbientTrackIdx] = useState(() => Math.floor(Math.random() * AMBIENT_BG_TRACKS.length));
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
  
  // Sleep timer
  const [sleepFadeMultiplier, setSleepFadeMultiplier] = useState(1);
  
  // Verse progress (for karaoke word-level sync)
  const [verseProgress, setVerseProgress] = useState(0);

  // ── 15-minute Watch session timer ──
  const WATCH_SESSION_DURATION = 15 * 60; // 15 minutes in seconds
  const WATCH_FADE_OUT_DURATION = 10; // fade out music over last 10 seconds
  const isWatchSession = track?.type === "devotional" && (track?.modeName?.includes("Watch") ?? false);
  const sessionStartRef = useRef<number | null>(null);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [inMeditationPhase, setInMeditationPhase] = useState(false);
  const sessionFadeTimerRef = useRef<number>();
  const narrationEndedRef = useRef(false);

  // Ambient mode — declared early so timer effect can reference it
  const currentTrackObj = tracks[currentIndex];
  const defaultAmbientMode = currentTrackObj?.ambientMode ?? "music";
  const [ambientModeOverride, setAmbientModeOverride] = useState<"music" | "ambient-sounds" | null>(null);
  const ambientMode = ambientModeOverride ?? defaultAmbientMode;

  // Compute ducked ambient volume — lower when voice is playing
  const getAmbientTargetVolume = useCallback((modeMultiplier: number) => {
    const base = ambientVolume * modeMultiplier * sleepFadeMultiplier;
    // When voice is playing, duck the music significantly
    return isPlaying ? base * VOICE_DUCK_RATIO : base;
  }, [ambientVolume, sleepFadeMultiplier, isPlaying]);
  
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
    if (!ambientNextRef.current) {
      ambientNextRef.current = new Audio();
      ambientNextRef.current.preload = "auto";
      ambientNextRef.current.loop = false;
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
      if (ambientNextRef.current) {
        ambientNextRef.current.pause();
        ambientNextRef.current.src = "";
      }
      if (crossfadeTimerRef.current) {
        clearInterval(crossfadeTimerRef.current);
      }
    };
  }, []);

  // Reset watch session state on track change
  useEffect(() => {
    sessionStartRef.current = null;
    setSessionElapsed(0);
    setInMeditationPhase(false);
    narrationEndedRef.current = false;
  }, [currentIndex]);

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
            narrationEndedRef.current = true;
            
            // For Watch sessions: enter meditation phase, don't auto-advance
            if (isWatchSession) {
              setInMeditationPhase(true);
              // Un-duck ambient music to full volume (narration is done)
              return;
            }
            
            if (continuousPlay && hasNext) {
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
        
        // Start session timer for Watch sessions
        if (isWatchSession && !sessionStartRef.current) {
          sessionStartRef.current = Date.now();
        }
        
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

  // ── Watch session 15-minute timer ──
  useEffect(() => {
    if (!isOpen || !isWatchSession || !sessionStartRef.current) return;
    
    const interval = window.setInterval(() => {
      if (!sessionStartRef.current) return;
      const elapsed = (Date.now() - sessionStartRef.current) / 1000;
      setSessionElapsed(elapsed);
      
      // Fade out music in the last 10 seconds
      const remaining = WATCH_SESSION_DURATION - elapsed;
      if (remaining <= WATCH_FADE_OUT_DURATION && remaining > 0) {
        const fadeProgress = remaining / WATCH_FADE_OUT_DURATION;
        // Gradually reduce ambient volume
        if (ambientRef.current) {
          const modeMultiplier = ambientMode === "ambient-sounds" ? 0.35 : 1;
          ambientRef.current.volume = Math.max(0, ambientVolume * modeMultiplier * sleepFadeMultiplier * fadeProgress);
        }
        if (ambientNextRef.current && ambientNextRef.current.src) {
          ambientNextRef.current.volume = 0;
        }
      }
      
      // Session complete at 15 minutes
      if (elapsed >= WATCH_SESSION_DURATION) {
        clearInterval(interval);
        // Stop all audio
        if (ambientRef.current) { ambientRef.current.pause(); }
        if (ambientNextRef.current) { ambientNextRef.current.pause(); }
        if (audioRef.current) { audioRef.current.pause(); }
        setIsPlaying(false);
        setAmbientPlaying(false);
        // Auto-close after a brief moment
        setTimeout(() => onClose(), 1500);
      }
    }, 250);
    
    return () => clearInterval(interval);
  }, [isOpen, isWatchSession, ambientVolume, ambientMode, sleepFadeMultiplier, onClose]);

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
    
    // Map time to verse + compute word-level progress within verse
    if (verses.length > 0 && audio.duration > 0) {
      const verseLen = audio.duration / verses.length;
      const idx = Math.min(Math.floor(audio.currentTime / verseLen), verses.length - 1);
      setActiveVerseIndex(idx);
      
      // Progress within current verse (0-1) for karaoke word sync
      const verseStart = idx * verseLen;
      const progressInVerse = (audio.currentTime - verseStart) / verseLen;
      setVerseProgress(Math.max(0, Math.min(1, progressInVerse)));
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

  // Ambient music/sound management — picks track list based on current track's ambientMode

  // Reset override when track changes
  useEffect(() => {
    setAmbientModeOverride(null);
  }, [currentIndex]);

  // Crossfade helper: fade out old ambient, fade in new one
  const crossfadeToNext = useCallback((trackList: typeof AMBIENT_SOUND_TRACKS, nextIdx: number) => {
    const outgoing = ambientRef.current;
    const incoming = ambientNextRef.current;
    if (!outgoing || !incoming) return;

    const nextTrack = trackList[nextIdx % trackList.length];
    const modeMultiplier = ambientMode === "ambient-sounds" ? 0.35 : 1;
    const targetVol = getAmbientTargetVolume(modeMultiplier);

    incoming.src = nextTrack.url;
    incoming.volume = 0;
    incoming.load();
    incoming.play().catch(() => {});

    const steps = 40;
    const stepMs = CROSSFADE_DURATION / steps;
    let step = 0;
    
    if (crossfadeTimerRef.current) clearInterval(crossfadeTimerRef.current);
    crossfadeTimerRef.current = window.setInterval(() => {
      step++;
      const progress = step / steps;
      if (outgoing) outgoing.volume = Math.max(0, targetVol * (1 - progress));
      if (incoming) incoming.volume = targetVol * progress;
      if (step >= steps) {
        clearInterval(crossfadeTimerRef.current);
        outgoing.pause();
        outgoing.src = "";
        // Swap refs
        const temp = ambientRef.current;
        ambientRef.current = ambientNextRef.current;
        ambientNextRef.current = temp;
      }
    }, stepMs);
  }, [ambientMode, getAmbientTargetVolume]);

  useEffect(() => {
    if (!ambientRef.current) return;

    // If track requests no background audio, stay silent
    if (ambientMode === "none") {
      ambientRef.current.pause();
      if (ambientNextRef.current) ambientNextRef.current.pause();
      setAmbientPlaying(false);
      return;
    }

    const trackList = ambientMode === "ambient-sounds" ? AMBIENT_SOUND_TRACKS : AMBIENT_BG_TRACKS;

    if (isOpen && ambientMusicEnabled) {
      const ambient = ambientRef.current;
      const bgTrack = trackList[ambientTrackIdx % trackList.length];

      if (!ambient.src.includes(bgTrack.url)) {
        ambient.src = bgTrack.url;
        ambient.load();
      }

      const modeMultiplier = ambientMode === "ambient-sounds" ? 0.35 : 1;
      const targetVol = getAmbientTargetVolume(modeMultiplier);
      ambient.volume = Math.max(0, targetVol);
      ambient.play().then(() => setAmbientPlaying(true)).catch(() => {});

      // When ambient track ends, crossfade to next
      ambient.onended = () => {
        const nextIdx = (ambientTrackIdx + 1) % trackList.length;
        setAmbientTrackIdx(nextIdx);
        crossfadeToNext(trackList, nextIdx);
      };
    } else if (!isOpen) {
      ambientRef.current.pause();
      if (ambientNextRef.current) ambientNextRef.current.pause();
      setAmbientPlaying(false);
    }
  }, [isOpen, ambientMusicEnabled, ambientTrackIdx, ambientVolume, ambientMode, crossfadeToNext, getAmbientTargetVolume]);

  // Duck ambient volume when voice is playing, restore when paused
  useEffect(() => {
    if (!ambientRef.current || !ambientMusicEnabled) return;
    const modeMultiplier = ambientMode === "ambient-sounds" ? 0.35 : 1;
    const targetVol = getAmbientTargetVolume(modeMultiplier);
    
    // Smooth volume transition for ducking
    const current = ambientRef.current.volume;
    if (Math.abs(current - targetVol) < 0.01) {
      ambientRef.current.volume = Math.max(0, targetVol);
      return;
    }
    const steps = 20;
    const stepMs = 50;
    let step = 0;
    const startVol = current;
    const timer = setInterval(() => {
      step++;
      const p = step / steps;
      if (ambientRef.current) {
        ambientRef.current.volume = Math.max(0, startVol + (targetVol - startVol) * p);
      }
      if (step >= steps) clearInterval(timer);
    }, stepMs);
    return () => clearInterval(timer);
  }, [isPlaying, ambientVolume, ambientMusicEnabled, sleepFadeMultiplier, ambientMode, getAmbientTargetVolume]);

  // Update ambient volume live (with sleep fade + ducking)
  useEffect(() => {
    if (ambientRef.current && !ambientMusicEnabled) {
      ambientRef.current.volume = 0;
    }
  }, [ambientMusicEnabled]);

  // Update main volume (with sleep fade)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = mainMuted ? 0 : mainVolume * sleepFadeMultiplier;
    }
  }, [mainVolume, mainMuted, sleepFadeMultiplier]);

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
      if (ambientNextRef.current) { ambientNextRef.current.pause(); }
      if (crossfadeTimerRef.current) { clearInterval(crossfadeTimerRef.current); }
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
          {/* Canvas particle field */}
          <ImmersiveParticles
            isPlaying={isPlaying}
            mood={track?.type || "commentary"}
            intensity={sleepFadeMultiplier * 0.6}
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
            <ImmersiveSleepTimer
              isOpen={isOpen}
              onSleepTrigger={() => {
                if (audioRef.current) audioRef.current.pause();
                if (ambientRef.current) ambientRef.current.pause();
                setIsPlaying(false);
              }}
              onVolumeFade={setSleepFadeMultiplier}
            />
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
                    <span className="text-sm">{ambientMode === "ambient-sounds" ? "Ambient Sounds" : "Ambient Background Music"}</span>
                  </div>
                  <Switch
                    checked={ambientMusicEnabled}
                    onCheckedChange={onSetAmbientMusic}
                  />
                </div>
                {/* Ambient mode toggle — switch between sounds and music */}
                {ambientMusicEnabled && (
                  <div className="flex items-center justify-between pl-6">
                    <span className="text-xs text-muted-foreground">Background type</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setAmbientModeOverride("ambient-sounds"); setAmbientTrackIdx(Math.floor(Math.random() * AMBIENT_SOUND_TRACKS.length)); }}
                        className={`text-xs px-3 py-1 rounded-full transition-colors ${
                          ambientMode === "ambient-sounds"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        Sounds
                      </button>
                      <button
                        onClick={() => { setAmbientModeOverride("music"); setAmbientTrackIdx(Math.floor(Math.random() * AMBIENT_BG_TRACKS.length)); }}
                        className={`text-xs px-3 py-1 rounded-full transition-colors ${
                          ambientMode === "music"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        Music
                      </button>
                    </div>
                  </div>
                )}
                {/* Ambient volume */}
                {ambientMusicEnabled && (
                  <div className="flex items-center gap-3 pl-6">
                    <span className="text-xs text-muted-foreground w-20">{ambientMode === "ambient-sounds" ? "Sound Vol" : "Music Volume"}</span>
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
                {/* Voice quality selector */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Voice Quality</span>
                  </div>
                  <VoiceQualitySelector compact />
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
            /* Karaoke verse-synced display for commentary */
            <ScrollArea className="h-full">
              <div className="max-w-2xl mx-auto px-6 py-12 space-y-1">
                {verses.map((v, idx) => {
                  const isActive = idx === activeVerseIndex;
                  const isPast = idx < activeVerseIndex;
                  return (
                    <ImmersiveKaraokeVerse
                      key={v.verse}
                      verse={v}
                      isActive={isActive}
                      isPast={isPast}
                      verseProgress={isActive ? verseProgress : 0}
                      innerRef={isActive ? activeVerseRef : undefined}
                      onClick={() => {
                        if (audioRef.current && duration > 0) {
                          audioRef.current.currentTime = (idx / verses.length) * duration;
                        }
                      }}
                    />
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
            /* Ambient visual mode (no text) — includes Watch meditation phase */
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {inMeditationPhase ? (
                /* Meditation phase: narration ended, music continues */
                <>
                  <motion.div
                    className="text-6xl"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    🕊️
                  </motion.div>
                  <div className="text-center max-w-md px-4 space-y-3">
                    <h3 className="text-xl font-semibold text-foreground/80">
                      Meditation Time
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The narration has ended. Take the remaining time to meditate on the thoughts and feelings you've received. Ask the Spirit to make them your own.
                    </p>
                    <p className="text-xs text-muted-foreground/60 font-mono">
                      {formatTime(Math.max(0, WATCH_SESSION_DURATION - sessionElapsed))} remaining
                    </p>
                  </div>
                  {/* Gentle pulsing waveform for meditation */}
                  <div className="flex items-end gap-1 h-12">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-primary/25 rounded-full"
                        animate={{
                          height: [
                            `${6 + Math.sin(i * 0.5) * 8}px`,
                            `${10 + Math.sin(i * 0.5 + 1) * 12}px`,
                            `${6 + Math.sin(i * 0.5) * 8}px`,
                          ],
                        }}
                        transition={{
                          duration: 3 + Math.random(),
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
              {/* Watch session timer */}
              {isWatchSession && sessionStartRef.current && !inMeditationPhase && (
                <p className="text-xs text-muted-foreground/50 font-mono">
                  Session: {formatTime(sessionElapsed)} / {formatTime(WATCH_SESSION_DURATION)}
                </p>
              )}
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
