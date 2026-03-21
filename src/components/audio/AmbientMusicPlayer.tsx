import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  Settings,
  X,
  Repeat,
  Repeat1,
  Shuffle,
  Upload,
  Trash2,
  Heart,
  Loader2,
  ChevronDown,
  Smartphone,
  ListMusic,
  GripVertical,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserMusic } from "@/hooks/useUserMusic";
import { useLocalMusic } from "@/hooks/useLocalMusic";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAudioDucking } from "@/hooks/useAudioDucking";
import { useIsMobile } from "@/hooks/use-mobile";
import { subscribeToMusicVolume } from "@/hooks/useMusicVolumeControl";
import { subscribeToMusicRequests, getAutoMusicEnabled } from "@/hooks/useCommentaryMusicSync";

// Study Music Playlist - 10 tracks for Bible study and meditation
const AMBIENT_TRACKS: Array<{
  id: string;
  name: string;
  description: string;
  category: string;
  mood: string;
  url: string;
}> = [
  {
    id: "flight",
    name: "Flight",
    description: "Uplifting ambient journey",
    category: "study-music",
    mood: "uplifting, ambient, peaceful",
    url: "/audio/flight.mp3",
  },
  {
    id: "wings-of-stillness",
    name: "Wings of Stillness",
    description: "Gentle meditative atmosphere",
    category: "study-music",
    mood: "gentle, meditative, still",
    url: "/audio/wings-of-stillness.mp3",
  },
  {
    id: "dreams-of-joseph",
    name: "Dreams of Joseph",
    description: "Biblical narrative ambient",
    category: "study-music",
    mood: "orchestral, narrative, contemplative",
    url: "/audio/dreams-of-joseph.mp3",
  },
  {
    id: "the-ride",
    name: "The Ride",
    description: "Uplifting journey music",
    category: "study-music",
    mood: "uplifting, journey, inspiring",
    url: "/audio/the-ride.mp3",
  },
  {
    id: "fly",
    name: "Fly",
    description: "Soaring ambient meditation",
    category: "study-music",
    mood: "soaring, ambient, peaceful",
    url: "/audio/fly.mp3",
  },
  {
    id: "follow",
    name: "Follow",
    description: "Gentle guiding atmosphere",
    category: "study-music",
    mood: "gentle, guiding, reflective",
    url: "/audio/follow.mp3",
  },
  {
    id: "amazing-grace-epic",
    name: "Amazing Grace (Epic Remix)",
    description: "Epic meditative remix of the classic hymn",
    category: "study-music",
    mood: "epic, meditative, hymn",
    url: "/audio/amazing-grace-epic.mp3",
  },
  {
    id: "when-he-cometh",
    name: "When He Cometh",
    description: "Reimagined classic hymn",
    category: "study-music",
    mood: "hopeful, gentle, hymn",
    url: "/audio/when-he-cometh.mp3",
  },
  {
    id: "white-horse",
    name: "White Horse",
    description: "Triumphant prophetic atmosphere",
    category: "study-music",
    mood: "triumphant, prophetic, epic",
    url: "/audio/white-horse.mp3",
  },
  {
    id: "eternal-echoes",
    name: "Eternal Echoes",
    description: "Deep contemplative ambient",
    category: "study-music",
    mood: "contemplative, ambient, eternal",
    url: "/audio/eternal-echoes.mp3",
  },
  {
    id: "moon-of-the-still-waters",
    name: "Moon Of The Still Waters",
    description: "Calm lunar meditation soundscape",
    category: "study-music",
    mood: "calm, meditative, serene",
    url: "/music/Moon_Of_The_Still_Waters.mp3",
  },
];

interface AmbientMusicPlayerProps {
  roomId?: string;
  className?: string;
  minimal?: boolean;
}

export function AmbientMusicPlayer({ 
  roomId, 
  className,
  minimal = false 
}: AmbientMusicPlayerProps) {
  // Simple audio ref plus optional Web Audio graph for better mobile volume control
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const { user } = useAuth();
  const { userTracks } = useUserMusic();
  const { localTracks, uploading: localUploading, uploadLocalMusic, removeLocalTrack, toggleFavorite: toggleLocalFavorite } = useLocalMusic();
  const isMobile = useIsMobile();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const userPausedRef = useRef(false); // Track intentional user pauses to prevent auto-resume fighting
  // Keep ref in sync for use in event handlers (avoids stale closures)
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("pt-music-volume-pct");
    if (saved) {
      return Math.min(parseInt(saved, 10), 100) / 100;
    }
    return 0.80;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(() => {
    const saved = localStorage.getItem("pt-ambient-track");
    return saved || "eternal-echoes";
  });
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem("pt-ambient-enabled");
    return saved === "true";
  });
  const [showControls, setShowControls] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [loopMode, setLoopMode] = useState<"none" | "one" | "all">(() => {
    const saved = localStorage.getItem("pt-ambient-loop-mode");
    return (saved as "none" | "one" | "all") || "all";
  });
  const [shuffleMode, setShuffleMode] = useState(() => {
    const saved = localStorage.getItem("pt-ambient-shuffle");
    return saved === "true";
  });
  const [duckMultiplier, setDuckMultiplier] = useState(1);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("pt-ambient-selected-tracks");
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch {
        return new Set(AMBIENT_TRACKS.map(t => t.id));
      }
    }
    return new Set(AMBIENT_TRACKS.map(t => t.id));
  });
  const [trackOrder, setTrackOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem("pt-ambient-track-order");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return AMBIENT_TRACKS.map(t => t.id);
      }
    }
    return AMBIENT_TRACKS.map(t => t.id);
  });
  const [showPlaylist, setShowPlaylist] = useState(false);

  // Audio ducking - reduce volume when TTS is playing
  const handleDuckChange = useCallback((ducked: boolean, duckRatio: number) => {
    setDuckMultiplier(duckRatio);
  }, []);

  useAudioDucking(handleDuckChange);

  // Ensure we have a Web Audio graph for reliable volume control on mobile when supported
  const getOrCreateAudioGraph = useCallback(async () => {
    if (typeof window === "undefined") return null;
    if (!audioRef.current) return null;

    if (!audioContextRef.current) {
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext);
      if (!Ctx) return null;
      audioContextRef.current = new Ctx();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch (err) {
        // Failed to resume AudioContext
      }
    }

    if (!sourceNodeRef.current && audioRef.current) {
      const source = ctx.createMediaElementSource(audioRef.current);
      const gain = ctx.createGain();
      source.connect(gain);
      gain.connect(ctx.destination);
      sourceNodeRef.current = source;
      gainNodeRef.current = gain;
    }

    return { ctx, gain: gainNodeRef.current };
  }, []);

  // Volume control - prefer Web Audio gain when available, fallback to element volume
  useEffect(() => {
    const effectiveVolume = isMuted ? 0 : volume * duckMultiplier;
    
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = effectiveVolume;
    } else if (audioRef.current) {
      audioRef.current.volume = effectiveVolume;
    }
    
  }, [volume, isMuted, duckMultiplier]);

  // Track failed URLs to avoid retrying them
  const failedUrlsRef = useRef<Set<string>>(new Set());
  const retryCountRef = useRef<number>(0);
  const maxRetries = 3;

  // Helper to check if URL is likely a valid audio file
  const isValidAudioUrl = useCallback((url: string): boolean => {
    if (!url) return false;
    // Reject page URLs (not direct audio files)
    if (url.includes('suno.com/s/') && !url.includes('.mp3')) return false;
    // Accept common audio file extensions or CDN patterns
    const isAudioFile = /\.(mp3|wav|ogg|m4a|aac|webm)(\?|$)/i.test(url);
    const isCdnUrl = url.includes('cdn1.suno.ai') || url.includes('supabase.co/storage');
    return isAudioFile || isCdnUrl;
  }, []);

  // Combine preset tracks, cloud study music, and local device tracks
  const allTracks = useMemo(() => [
    ...AMBIENT_TRACKS.map(t => ({ ...t, isUser: false, isLocal: false })),
    ...userTracks.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description || t.mood || "Your uploaded study music",
      url: t.file_url,
      category: t.category || "custom",
      floor: 0,
      mood: t.mood || "custom",
      bpm: 60,
      isUser: true,
      isLocal: false,
      userTrackData: t,
    })),
    ...localTracks.map(t => ({
      id: t.id,
      name: t.name,
      description: t.mood || "Private local track",
      url: t.blobUrl || "",
      category: "local",
      floor: 0,
      mood: t.mood || "private",
      bpm: 60,
      isUser: false,
      isLocal: true,
      localTrackData: t
    }))
  ], [userTracks, localTracks]);

  useEffect(() => {
    setSelectedTracks((prev) => {
      const next = new Set(prev);
      let changed = false;

      for (const track of allTracks) {
        if (!next.has(track.id)) {
          next.add(track.id);
          changed = true;
        }
      }

      if (changed) {
        localStorage.setItem("pt-ambient-selected-tracks", JSON.stringify([...next]));
      }

      return changed ? next : prev;
    });

    setTrackOrder((prev) => {
      const existing = new Set(prev);
      const missing = allTracks
        .map((track) => track.id)
        .filter((id) => !existing.has(id));

      if (missing.length === 0) return prev;

      const next = [...prev, ...missing];
      localStorage.setItem("pt-ambient-track-order", JSON.stringify(next));
      return next;
    });
  }, [allTracks]);

  const currentTrack = useMemo(() => 
    allTracks.find(t => t.id === currentTrackId) || allTracks[0],
    [allTracks, currentTrackId]
  );

  // Ref for stable callback access in event handlers (fixes stale closure in onended)
  const playbackStateRef = useRef<{
    allTracks: typeof allTracks;
    selectedTracks: Set<string>;
    trackOrder: string[];
    currentTrackId: string;
    shuffleMode: boolean;
    loopMode: "none" | "one" | "all";
  }>({
    allTracks,
    selectedTracks,
    trackOrder,
    currentTrackId,
    shuffleMode,
    loopMode
  });

  // Keep ref updated with latest values
  useEffect(() => {
    playbackStateRef.current = {
      allTracks,
      selectedTracks,
      trackOrder,
      currentTrackId,
      shuffleMode,
      loopMode
    };
  }, [allTracks, selectedTracks, trackOrder, currentTrackId, shuffleMode, loopMode]);

  // Function to play next track - extracted for reuse
  const playNextTrackFromState = useCallback(() => {
    const state = playbackStateRef.current;
    // Get playable tracks in custom order
    const selectedList = state.allTracks.filter(t => state.selectedTracks.has(t.id));
    const playableTracks = selectedList.sort((a, b) => {
      const aIdx = state.trackOrder.indexOf(a.id);
      const bIdx = state.trackOrder.indexOf(b.id);
      const aOrder = aIdx === -1 ? Infinity : aIdx;
      const bOrder = bIdx === -1 ? Infinity : bIdx;
      return aOrder - bOrder;
    });

    if (playableTracks.length === 0) {
      setIsPlaying(false);
      return;
    }

    let nextTrackToPlay;
    if (state.shuffleMode) {
      const otherTracks = playableTracks.filter(t => t.id !== state.currentTrackId);
      if (otherTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherTracks.length);
        nextTrackToPlay = otherTracks[randomIndex];
      } else {
        // Only one track, replay it
        nextTrackToPlay = playableTracks[0];
      }
    } else {
      const currentIndex = playableTracks.findIndex(t => t.id === state.currentTrackId);
      const nextIndex = (currentIndex + 1) % playableTracks.length;
      nextTrackToPlay = playableTracks[nextIndex];
    }
    
    if (nextTrackToPlay && audioRef.current) {
      // CRITICAL: Update the ref SYNCHRONOUSLY before React state update
      // This prevents race conditions where onended fires before ref is updated
      playbackStateRef.current = {
        ...playbackStateRef.current,
        currentTrackId: nextTrackToPlay.id
      };
      
      // Then update React state (async)
      setCurrentTrackId(nextTrackToPlay.id);
      
      const audio = audioRef.current;
      
      // For same-track replay (single track in "all" mode), reset currentTime
      // instead of just setting src, to ensure proper restart
      const isSameTrack = audio.src.endsWith(nextTrackToPlay.url) || audio.src === nextTrackToPlay.url;
      
      if (isSameTrack) {
        // Same track - just restart from beginning
        audio.currentTime = 0;
        audio.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.error('[AmbientMusic] Failed to restart track:', err);
          });
      } else {
        // Different track - load new source
        audio.src = nextTrackToPlay.url;
        audio.load();
        
        // Play after a short delay to ensure src is set
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch((err) => {
                console.error('[AmbientMusic] Failed to play next track:', err);
                // Try again with next track after a delay
                setTimeout(() => playNextTrackFromState(), 500);
              });
          }
        }, 150);
      }
    }
  }, []);

  // Initialize audio element once - simple HTML5 audio for independence
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
      
      // Handle track ended - use ref for latest state to avoid stale closures
      audioRef.current.onended = () => {
        const state = playbackStateRef.current;
        // If loop is set on the audio element (loopMode === "one"), it will auto-repeat
        // We only need to handle "all" and "none" modes here
        if (state.loopMode === "all") {
          playNextTrackFromState();
        } else if (state.loopMode === "none") {
          setIsPlaying(false);
        }
        // loopMode === "one" is handled by audio.loop = true (browser handles it)
      };
      
      // Handle unexpected pauses (browser/system interruptions)
      // This fires when the browser pauses audio due to resource competition,
      // tab switching, or mobile OS audio session changes
      audioRef.current.onpause = () => {
        const audio = audioRef.current;
        if (!audio) return;
        
        // Only try to resume if we think we should still be playing
        // and the track hasn't naturally ended
        if (isPlayingRef.current && !userPausedRef.current && !audio.ended && audio.currentTime > 0) {
          // Small delay to avoid fighting with the browser
          setTimeout(() => {
            if (audioRef.current && isPlayingRef.current && !userPausedRef.current && audioRef.current.paused && !audioRef.current.ended) {
              audioRef.current.play().catch(() => {
              });
            }
          }, 300);
        }
      };
      
      // Handle errors
      audioRef.current.onerror = (e) => {
        console.error('[AmbientMusic] Audio error:', e);
        // On error, try next track if in loop all mode
        const state = playbackStateRef.current;
        if (state.loopMode === "all") {
          setTimeout(() => playNextTrackFromState(), 500);
        }
      };
    }
    
    // Cleanup only on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.onpause = null;
        audioRef.current.onerror = null;
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
        gainNodeRef.current = null;
        sourceNodeRef.current = null;
      }
    };
  }, [playNextTrackFromState]); // Include the callback dependency

  // Keep music playing when app goes to background (mobile)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;

      if (document.hidden && isPlaying && !userPausedRef.current) {
        // App went to background - try to keep music playing
        if (audioRef.current.paused) {
          audioRef.current.play().catch(() => {});
        }
      } else if (!document.hidden && isPlaying && !userPausedRef.current) {
        // App came back to foreground - ensure music is still playing
        if (audioRef.current.paused) {
          audioRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying]);

  // Keep-alive interval for background playback
  useEffect(() => {
    if (!isPlaying) return;

    const keepAlive = () => {
      if (audioRef.current && isPlaying && !userPausedRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    };

    const interval = setInterval(keepAlive, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Update audio source when track changes - only reset src if URL actually changed
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      // Compare using resolved URLs to prevent unnecessary reloads
      // audioRef.current.src is always absolute, currentTrack.url may be relative
      const currentSrc = audioRef.current.src;
      const trackUrl = currentTrack.url;
      const isSameSrc = currentSrc.endsWith(trackUrl) || currentSrc === trackUrl;
      
      if (!isSameSrc) {
        const wasPlaying = isPlaying;
        audioRef.current.src = currentTrack.url;
        audioRef.current.volume = isMuted ? 0 : volume * duckMultiplier;
        
        if (wasPlaying && isEnabled) {
          audioRef.current.play().catch(console.error);
        }
      }
      
      // Update Media Session metadata when track changes
      if ('mediaSession' in navigator && isPlaying) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentTrack.name,
          artist: 'Phototheology Palace',
          album: 'Sacred Ambient Music',
        });
      }
      
      localStorage.setItem("pt-ambient-track", currentTrackId);
    }
  }, [currentTrackId, currentTrack, isPlaying]);

  // Save volume to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("pt-music-volume-pct", Math.round(volume * 100).toString());
  }, [volume]);

  // Save enabled state
  useEffect(() => {
    localStorage.setItem("pt-ambient-enabled", isEnabled.toString());
  }, [isEnabled]);

  // Listen for global volume control changes (allows other components like SequencePlayer to control music volume)
  // SequencePlayer sends 0-100 scale, so we convert to 0-1.0 (capped at 100%)
  const isInitialMount = useRef(true);
  useEffect(() => {
    const unsubscribe = subscribeToMusicVolume((newVolume) => {
      // Skip the immediate callback on initial subscription
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      // Convert from 0-100 scale to 0-0.5 (capped to match slider max)
      const normalizedVolume = Math.min(newVolume, 50) / 100;
      setVolume(normalizedVolume);
    });
    return unsubscribe;
  }, []);

  // Listen for commentary music requests — only acts when user has explicitly enabled auto-music
  useEffect(() => {
    const unsubscribe = subscribeToMusicRequests((action) => {
      if (action === 'start' && !isPlaying && audioRef.current && getAutoMusicEnabled()) {
        setIsEnabled(true);
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          // Could not auto-start music for commentary
        });
      }
    });
    return unsubscribe;
  }, [isPlaying]);

  // Update loop setting - only update the loop property, onended is set once at init
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = loopMode === "one";
    }
    localStorage.setItem("pt-ambient-loop-mode", loopMode);
  }, [loopMode]);

  const cycleLoopMode = () => {
    setLoopMode(prev => {
      if (prev === "none") return "one";
      if (prev === "one") return "all";
      return "none";
    });
  };

  const togglePlay = async () => {
    if (!audioRef.current) {
      console.error("Audio element not initialized");
      return;
    }

    if (isPlaying) {
      userPausedRef.current = true;
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        // Note: iOS ignores programmatic volume control - users must use device volume
        
        // Check if current track URL is valid and not previously failed
        if (!isValidAudioUrl(currentTrack.url) || failedUrlsRef.current.has(currentTrack.url)) {
          findNextWorkingTrack();
          return;
        }
        
        // Ensure source is set
        if (!audioRef.current.src || audioRef.current.src === "" || !audioRef.current.src.includes(currentTrack.url.split('?')[0])) {
          audioRef.current.src = currentTrack.url;
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Load timeout')), 10000);
            audioRef.current!.oncanplaythrough = () => {
              clearTimeout(timeout);
              resolve();
            };
            audioRef.current!.onerror = () => {
              clearTimeout(timeout);
              reject(new Error('Failed to load audio'));
            };
            audioRef.current!.load();
          });
        }
        
        await getOrCreateAudioGraph();

        // Set volume (gain node on supported browsers, fallback to element volume)
        const effectiveVolume = isMuted ? 0 : volume * duckMultiplier;
        if (gainNodeRef.current) {
          gainNodeRef.current.gain.value = effectiveVolume;
        } else {
          audioRef.current.volume = effectiveVolume;
        }
        
        userPausedRef.current = false;
        await audioRef.current.play();
        setIsPlaying(true);
        retryCountRef.current = 0; // Reset retry count on success
        
        // Setup Media Session for lock screen controls and background playback
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: currentTrack.name,
            artist: 'Phototheology Palace',
            album: 'Sacred Ambient Music',
          });
          
          navigator.mediaSession.setActionHandler('play', () => {
            userPausedRef.current = false;
            audioRef.current?.play();
            setIsPlaying(true);
          });
          navigator.mediaSession.setActionHandler('pause', () => {
            userPausedRef.current = true;
            audioRef.current?.pause();
            setIsPlaying(false);
          });
          navigator.mediaSession.setActionHandler('nexttrack', () => {
            nextTrack();
          });
          navigator.mediaSession.setActionHandler('previoustrack', () => {
            // Go to previous track
            const playableTracks = allTracks.filter(t => selectedTracks.has(t.id));
            const currentIndex = playableTracks.findIndex(t => t.id === currentTrackId);
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : playableTracks.length - 1;
            const prevTrack = playableTracks[prevIndex];
            if (prevTrack && audioRef.current) {
              audioRef.current.src = prevTrack.url;
              audioRef.current.play().catch(console.error);
              setCurrentTrackId(prevTrack.id);
            }
          });
        }
        setIsEnabled(true);
      } catch (error) {
        console.error("Audio playback failed:", error);
        // Mark this URL as failed
        failedUrlsRef.current.add(currentTrack.url);
        findNextWorkingTrack();
      }
    }
  };

  // Find the next track that hasn't failed
  const findNextWorkingTrack = useCallback(() => {
    retryCountRef.current++;
    if (retryCountRef.current > maxRetries) {
      console.error("[Music] Max retries reached, stopping auto-retry");
      retryCountRef.current = 0;
      return;
    }
    
    const playableTracks = allTracks.filter(t => 
      selectedTracks.has(t.id) && 
      !failedUrlsRef.current.has(t.url) &&
      isValidAudioUrl(t.url)
    );
    
    if (playableTracks.length === 0) {
      console.error("[Music] No valid tracks available");
      retryCountRef.current = 0;
      return;
    }
    
    const currentIndex = playableTracks.findIndex(t => t.id === currentTrackId);
    const nextIndex = (currentIndex + 1) % playableTracks.length;
    setCurrentTrackId(playableTracks[nextIndex].id);
  }, [allTracks, selectedTracks, currentTrackId, isValidAudioUrl]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    const effectiveVolume = newMuted ? 0 : volume * duckMultiplier;
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = effectiveVolume;
    } else if (audioRef.current) {
      audioRef.current.volume = effectiveVolume;
    }
  };

  // Get ordered tracks (only selected ones, in user-defined order)
  const orderedPlayableTracks = useMemo(() => {
    // First, get all tracks that are selected
    const selected = allTracks.filter(t => selectedTracks.has(t.id));
    // Sort by trackOrder, putting tracks not in order at the end
    return selected.sort((a, b) => {
      const aIdx = trackOrder.indexOf(a.id);
      const bIdx = trackOrder.indexOf(b.id);
      // If not in order, put at end
      const aOrder = aIdx === -1 ? Infinity : aIdx;
      const bOrder = bIdx === -1 ? Infinity : bIdx;
      return aOrder - bOrder;
    });
  }, [allTracks, selectedTracks, trackOrder]);

  const nextTrack = useCallback(() => {
    // Use orderedPlayableTracks for custom order
    if (orderedPlayableTracks.length === 0) return;

    let nextTrackToPlay;
    if (shuffleMode) {
      // Random track (different from current)
      const otherTracks = orderedPlayableTracks.filter(t => t.id !== currentTrackId);
      if (otherTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherTracks.length);
        nextTrackToPlay = otherTracks[randomIndex];
      } else {
        nextTrackToPlay = orderedPlayableTracks[0];
      }
    } else {
      const currentIndex = orderedPlayableTracks.findIndex(t => t.id === currentTrackId);
      const nextIndex = (currentIndex + 1) % orderedPlayableTracks.length;
      nextTrackToPlay = orderedPlayableTracks[nextIndex];
    }

    if (nextTrackToPlay && audioRef.current) {
      // Directly set src and play to avoid state timing issues
      audioRef.current.src = nextTrackToPlay.url;
      const wasPlaying = isPlaying;
      if (wasPlaying) {
        audioRef.current.play().catch(console.error);
      }
      setCurrentTrackId(nextTrackToPlay.id);
    }
  }, [orderedPlayableTracks, currentTrackId, shuffleMode, isPlaying]);

  const toggleShuffle = () => {
    setShuffleMode(prev => {
      const newVal = !prev;
      localStorage.setItem("pt-ambient-shuffle", newVal.toString());
      return newVal;
    });
  };

  const toggleTrackSelection = (trackId: string) => {
    setSelectedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        // Don't allow deselecting the last track
        if (newSet.size > 1) {
          newSet.delete(trackId);
        }
      } else {
        newSet.add(trackId);
      }
      localStorage.setItem("pt-ambient-selected-tracks", JSON.stringify([...newSet]));
      return newSet;
    });
  };

  // Move track up in the playlist order
  const moveTrackUp = (trackId: string) => {
    setTrackOrder(prev => {
      const idx = prev.indexOf(trackId);
      if (idx <= 0) return prev;
      const newOrder = [...prev];
      [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
      localStorage.setItem("pt-ambient-track-order", JSON.stringify(newOrder));
      return newOrder;
    });
  };

  // Move track down in the playlist order
  const moveTrackDown = (trackId: string) => {
    setTrackOrder(prev => {
      const idx = prev.indexOf(trackId);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const newOrder = [...prev];
      [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
      localStorage.setItem("pt-ambient-track-order", JSON.stringify(newOrder));
      return newOrder;
    });
  };

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    // Apply volume directly to audio element
    const effectiveVolume = newVolume * duckMultiplier;
    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume;
    }
  }, [isMuted, duckMultiplier]);

  // Direct volume preset function - values match displayed labels (5%, 15%, 30%)
  const setVolumePreset = (preset: 'off' | 'low' | 'med' | 'high') => {
    const presetValues = {
      off: 0,
      low: 0.05,   // 5%
      med: 0.15,   // 15%
      high: 0.30   // 30%
    };
    const newVolume = presetValues[preset];
    const effectiveVolume = newVolume * duckMultiplier;
    // Apply volume directly to audio element
    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume;
    }
    
    // Update state
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    localStorage.setItem("pt-music-volume-pct", Math.round(newVolume * 100).toString());
  };

  // Get current preset level - match to displayed labels
  const getCurrentPreset = (): 'off' | 'low' | 'med' | 'high' => {
    if (isMuted || volume === 0) return 'off';
    if (volume <= 0.08) return 'low';    // ~5%
    if (volume <= 0.20) return 'med';    // ~15%
    return 'high';                        // ~30%+
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadName(file.name.replace(/\.[^/.]+$/, ""));
      setShowUpload(true);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    // Store locally on device - completely private
    const result = await uploadLocalMusic(uploadFile, uploadName);
    if (result) {
      setShowUpload(false);
      setUploadFile(null);
      setUploadName("");
      // Switch to the new track
      setCurrentTrackId(result.id);
    }
  };

  const handleDeleteTrack = (track: any) => {
    if (track.isLocal && track.localTrackData) {
      removeLocalTrack(track.localTrackData.id);
      // If currently playing this track, switch to first preset
      if (currentTrackId === track.id) {
        setCurrentTrackId(AMBIENT_TRACKS[0].id);
      }
    }
  };

  // Minimal floating button version
  if (minimal) {
    return (
      <Popover open={showControls} onOpenChange={setShowControls}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "relative h-11 w-11 rounded-full border-2 border-primary/50 bg-primary/15 hover:bg-primary/25 text-primary shadow-lg shadow-primary/25 transition-all duration-300",
              isPlaying && "border-primary bg-primary/25 shadow-xl shadow-primary/40 ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
              !isPlaying && "animate-[pulse_3s_ease-in-out_infinite]",
              className
            )}
          >
            <Music className="h-6 w-6" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-ping" />
            )}
            {!isPlaying && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-primary/70 rounded-full" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-background z-50" align="end" side="top" sideOffset={8} collisionPadding={16}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Study Music</h4>
              <div className="flex items-center gap-1">
                {/* Local upload - works without sign in, stored privately on device */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="audio/*"
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={localUploading}
                  title="Add music (stored privately on your device)"
                >
                  {localUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowControls(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {showUpload && uploadFile && (
              <div className="space-y-2 p-3 border rounded-md bg-primary/10">
                <div className="flex items-center gap-2 pb-1">
                  <Upload className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Add Private Music</span>
                </div>
                <Label className="text-xs">Track Name</Label>
                <Input 
                  value={uploadName} 
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="Enter track name"
                  className="h-8 text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  🔒 Stored privately on your device only - no one else can access
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleUpload} disabled={localUploading} className="flex-1">
                    {localUploading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Upload className="h-3 w-3 mr-1" />}
                    Save to Device
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setShowUpload(false); setUploadFile(null); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            <Select value={currentTrackId} onValueChange={setCurrentTrackId}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {(userTracks.length > 0 || localTracks.length > 0) && (
                  <>
                    {userTracks.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">☁️ Your Uploaded Study Music</div>
                        {allTracks.filter(t => t.isUser).map(track => (
                          <SelectItem key={track.id} value={track.id}>
                            <div className="flex items-center gap-2">
                              <Music className="h-3 w-3 text-primary" />
                              <span>{track.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">🔒 Your Private Music</div>
                    {allTracks.filter(t => t.isLocal).map(track => (
                      <SelectItem key={track.id} value={track.id}>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-3 w-3 text-primary" />
                          <span>{track.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-1">Preset Tracks</div>
                  </>
                )}
                {AMBIENT_TRACKS.map(track => (
                  <SelectItem key={track.id} value={track.id}>
                    <div className="flex flex-col">
                      <span>{track.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {track.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Playlist Selection - More Prominent */}
            <div className="border rounded-md p-2 bg-muted/30">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-between text-xs mb-2"
                onClick={() => setShowPlaylist(!showPlaylist)}
              >
                <span className="flex items-center gap-2">
                  <ListMusic className="h-4 w-4 text-primary" />
                  <span className="font-medium">Playlist</span>
                  <span className="text-muted-foreground">({selectedTracks.size} songs)</span>
                </span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", showPlaylist && "rotate-180")} />
              </Button>
              
              {showPlaylist && (
                <div className="space-y-1 max-h-48 overflow-y-auto border-t pt-2">
                  <div className="flex items-center justify-between px-1 pb-1">
                    <span className="text-xs text-muted-foreground">Select & reorder songs:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => {
                        const allIds = new Set(allTracks.map(t => t.id));
                        setSelectedTracks(allIds);
                        localStorage.setItem("pt-ambient-selected-tracks", JSON.stringify([...allIds]));
                      }}
                    >
                      Select All
                    </Button>
                  </div>
                  {/* Show tracks in custom order with reorder controls */}
                  {orderedPlayableTracks.length > 0 && (
                    <div className="text-xs font-medium text-primary px-1 flex items-center gap-1">
                      <ListMusic className="h-3 w-3" />
                      Your Playlist Order ({orderedPlayableTracks.length} songs)
                    </div>
                  )}
                  {orderedPlayableTracks.map((track, idx) => (
                    <div key={track.id} className="flex items-center gap-1 px-1 py-1 hover:bg-muted/50 rounded group">
                      <GripVertical className="h-3 w-3 text-muted-foreground" />
                      <Checkbox
                        checked={selectedTracks.has(track.id)}
                        onCheckedChange={() => toggleTrackSelection(track.id)}
                      />
                      {track.isLocal && <Heart className="h-3 w-3 text-primary" />}
                      <span className={cn(
                        "text-xs truncate flex-1",
                        currentTrackId === track.id && "text-primary font-medium"
                      )}>
                        {track.name}
                      </span>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={(e) => { e.stopPropagation(); moveTrackUp(track.id); }}
                          disabled={idx === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={(e) => { e.stopPropagation(); moveTrackDown(track.id); }}
                          disabled={idx === orderedPlayableTracks.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {/* Unselected tracks */}
                  {allTracks.filter(t => !selectedTracks.has(t.id)).length > 0 && (
                    <>
                      <div className="text-xs font-medium text-muted-foreground px-1 pt-2 border-t mt-2">Available to Add</div>
                      {allTracks.filter(t => !selectedTracks.has(t.id)).map(track => (
                        <label key={track.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 rounded cursor-pointer opacity-60">
                          <Checkbox
                            checked={false}
                            onCheckedChange={() => toggleTrackSelection(track.id)}
                          />
                          {track.isLocal && <Heart className="h-3 w-3 text-primary" />}
                          <span className="text-xs truncate flex-1">{track.name}</span>
                        </label>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlay}
                className="h-10 w-10"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTrack}
                className="h-8 w-8"
                title="Next track"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleShuffle}
                  className={cn("h-8 w-8", shuffleMode && "text-primary")}
                  title={shuffleMode ? "Shuffle on" : "Shuffle off"}
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
                <span className="text-[10px] text-muted-foreground">
                  {shuffleMode ? "On" : "Off"}
                </span>
              </div>
              
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cycleLoopMode}
                  className={cn("h-8 w-8", loopMode !== "none" && "text-primary")}
                  title={loopMode === "none" ? "No repeat" : loopMode === "one" ? "Repeat current song" : "Repeat playlist"}
                >
                  {loopMode === "one" ? (
                    <Repeat1 className="h-4 w-4" />
                  ) : (
                    <Repeat className="h-4 w-4" />
                  )}
                </Button>
                <span className="text-[10px] text-muted-foreground">
                  {loopMode === "none" ? "Off" : loopMode === "one" ? "Song" : "All"}
                </span>
              </div>
              
            </div>

            {/* Volume Control */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Volume</Label>
                <span className="text-xs font-medium">{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="h-8 w-8 shrink-0"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  onValueCommit={handleVolumeChange}
                  max={0.30}
                  step={0.01}
                  className="flex-1 touch-pan-x"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Full card version
  return (
    <Card variant="glass" className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlay}
            className="h-12 w-12 rounded-full shrink-0"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          {/* Track Info & Controls */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Music className="h-4 w-4 text-primary shrink-0" />
              <span className="font-medium text-sm truncate">
                {currentTrack.name}
              </span>
              {isPlaying && (
                <span className="h-2 w-2 bg-primary rounded-full animate-pulse shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {currentTrack.description}
            </p>
          </div>

          {/* Skip Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={nextTrack}
            className="h-8 w-8 shrink-0"
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          {/* Shuffle Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleShuffle}
            className={cn("h-8 w-8 shrink-0", shuffleMode && "text-primary")}
            title={shuffleMode ? "Shuffle on" : "Shuffle off"}
          >
            <Shuffle className="h-4 w-4" />
          </Button>

          {/* Loop Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleLoopMode}
            className={cn("h-8 w-8 shrink-0", loopMode !== "none" && "text-primary")}
            title={loopMode === "none" ? "No repeat" : loopMode === "one" ? "Repeat current song" : "Repeat playlist"}
          >
            {loopMode === "one" ? (
              <Repeat1 className="h-4 w-4" />
            ) : (
              <Repeat className="h-4 w-4" />
            )}
          </Button>

          {/* Volume Control - always shown */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            {/* Show inline slider on desktop, mobile gets it in popover */}
            {!isMobile && (
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                onValueCommit={handleVolumeChange}
                className="w-20 touch-pan-x"
              />
            )}
          </div>

          {/* Settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end" side="top" sideOffset={8} collisionPadding={16}>
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Music Settings</h4>
                
                {/* Track Selection */}
                <Select value={currentTrackId} onValueChange={setCurrentTrackId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {localTracks.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">🔒 Your Private Music</div>
                        {allTracks.filter(t => t.isLocal).map(track => (
                          <SelectItem key={track.id} value={track.id}>
                            <div className="flex items-center gap-2">
                              <Heart className="h-3 w-3 text-primary" />
                              <span>{track.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-1">Preset Tracks</div>
                      </>
                    )}
                    {AMBIENT_TRACKS.map(track => (
                      <SelectItem key={track.id} value={track.id}>
                        <div className="flex flex-col">
                          <span>{track.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {track.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>


                {/* Playlist Selection */}
                <div className="border rounded-md p-2 bg-muted/30">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between text-xs mb-2"
                    onClick={() => setShowPlaylist(!showPlaylist)}
                  >
                    <span className="flex items-center gap-2">
                      <ListMusic className="h-4 w-4 text-primary" />
                      <span className="font-medium">Preset Tracks</span>
                      <span className="text-muted-foreground">({selectedTracks.size} selected)</span>
                    </span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", showPlaylist && "rotate-180")} />
                  </Button>
                  
                  {showPlaylist && (
                    <div className="space-y-1 max-h-40 overflow-y-auto border-t pt-2">
                      <div className="flex items-center justify-between px-1 pb-1">
                        <span className="text-xs text-muted-foreground">Select preset tracks:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => {
                            const allIds = new Set(allTracks.map(t => t.id));
                            setSelectedTracks(allIds);
                            localStorage.setItem("pt-ambient-selected-tracks", JSON.stringify([...allIds]));
                          }}
                        >
                          Select All
                        </Button>
                      </div>
                      {userTracks.length > 0 && (
                        <>
                          <div className="text-xs font-medium text-primary px-1">☁️ Your Uploaded Study Music</div>
                          {allTracks.filter(t => t.isUser).map(track => (
                            <label key={track.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 rounded cursor-pointer">
                              <Checkbox
                                checked={selectedTracks.has(track.id)}
                                onCheckedChange={() => toggleTrackSelection(track.id)}
                              />
                              <Music className="h-3 w-3 text-primary" />
                              <span className="text-xs truncate flex-1">{track.name}</span>
                            </label>
                          ))}
                        </>
                      )}
                      {localTracks.length > 0 && (
                        <>
                          <div className="text-xs font-medium text-primary px-1">🔒 Your Private Music</div>
                          {allTracks.filter(t => t.isLocal).map(track => (
                            <label key={track.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 rounded cursor-pointer">
                              <Checkbox
                                checked={selectedTracks.has(track.id)}
                                onCheckedChange={() => toggleTrackSelection(track.id)}
                              />
                              <Heart className="h-3 w-3 text-primary" />
                              <span className="text-xs truncate flex-1">{track.name}</span>
                            </label>
                          ))}
                        </>
                      )}
                      <div className="text-xs font-medium text-muted-foreground px-1 pt-1">Preset Tracks</div>
                      {AMBIENT_TRACKS.map(track => (
                        <label key={track.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 rounded cursor-pointer">
                          <Checkbox
                            checked={selectedTracks.has(track.id)}
                            onCheckedChange={() => toggleTrackSelection(track.id)}
                          />
                          <span className="text-xs truncate flex-1">{track.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Shuffle and Loop Controls for Mobile */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleShuffle}
                      className={cn("h-8", shuffleMode && "text-primary bg-primary/10")}
                    >
                      <Shuffle className="h-4 w-4 mr-1" />
                      <span className="text-xs">{shuffleMode ? "On" : "Off"}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cycleLoopMode}
                      className={cn("h-8", loopMode !== "none" && "text-primary bg-primary/10")}
                    >
                      {loopMode === "one" ? (
                        <Repeat1 className="h-4 w-4 mr-1" />
                      ) : (
                        <Repeat className="h-4 w-4 mr-1" />
                      )}
                      <span className="text-xs">
                        {loopMode === "none" ? "Off" : loopMode === "one" ? "Song" : "All"}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Mobile Volume Control - Slider + Presets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Volume
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={0.5}
                    step={0.01}
                    onValueChange={(value) => {
                      const newVolume = value[0];
                      setVolume(newVolume);
                      if (newVolume > 0 && isMuted) setIsMuted(false);
                      if (newVolume === 0) setIsMuted(true);
                      const effectiveVolume = newVolume * duckMultiplier;
                      if (gainNodeRef.current) {
                        gainNodeRef.current.gain.value = effectiveVolume;
                      } else if (audioRef.current) {
                        audioRef.current.volume = effectiveVolume;
                      }
                      localStorage.setItem("pt-music-volume-pct", Math.round(newVolume * 100).toString());
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="w-full touch-manipulation [&_[role=slider]]:h-6 [&_[role=slider]]:w-6"
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      variant={getCurrentPreset() === 'off' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVolumePreset('off')}
                      className="h-7 flex-1 text-xs"
                    >
                      <VolumeX className="h-3 w-3 mr-1" />
                      Off
                    </Button>
                    <Button
                      variant={getCurrentPreset() === 'low' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVolumePreset('low')}
                      className="h-7 flex-1 text-xs"
                    >
                      5%
                    </Button>
                    <Button
                      variant={getCurrentPreset() === 'med' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVolumePreset('med')}
                      className="h-7 flex-1 text-xs"
                    >
                      15%
                    </Button>
                    <Button
                      variant={getCurrentPreset() === 'high' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVolumePreset('high')}
                      className="h-7 flex-1 text-xs"
                    >
                      30%
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Study Music • {currentTrack.mood}
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
