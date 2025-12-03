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
  ListMusic
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
import { useUserMusic, UserTrack } from "@/hooks/useUserMusic";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAudioDucking } from "@/hooks/useAudioDucking";
import { useIsMobile } from "@/hooks/use-mobile";
import { subscribeToMusicVolume } from "@/hooks/useMusicVolumeControl";

// Study Music Playlist - 8 tracks for Bible study and meditation
const AMBIENT_TRACKS: Array<{
  id: string;
  name: string;
  description: string;
  category: string;
  mood: string;
  url: string;
}> = [
  {
    id: "eternal-echoes",
    name: "Eternal Echoes",
    description: "Cinematic orchestral - reverent",
    category: "study-music",
    mood: "cinematic, orchestral, reverent",
    url: "https://cdn1.suno.ai/ea711d82-cd6a-4ebd-a960-b73cb72c39f0.mp3",
  },
  {
    id: "amazing-grace-epic",
    name: "Amazing Grace (Epic Remix)",
    description: "Epic meditative instrumental",
    category: "study-music",
    mood: "cinematic, epic, meditative",
    url: "https://cdn1.suno.ai/a362b171-5a6f-4264-8946-ae76b09a6aa7.mp3",
  },
  {
    id: "when-he-cometh",
    name: "When He Cometh",
    description: "Orchestral choral ambient",
    category: "study-music",
    mood: "orchestral, choral, ambient",
    url: "https://cdn1.suno.ai/617f1da9-1bfb-4a93-8485-08f432623d2e.mp3",
  },
  {
    id: "peaceful-waters",
    name: "Peaceful Waters",
    description: "Calm piano and strings",
    category: "study-music",
    mood: "peaceful, calm, reflective",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
  },
  {
    id: "morning-light",
    name: "Morning Light",
    description: "Gentle ambient meditation",
    category: "study-music",
    mood: "gentle, ambient, hopeful",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8e5e3b4b5a.mp3",
  },
  {
    id: "sanctuary-peace",
    name: "Sanctuary Peace",
    description: "Soft orchestral atmosphere",
    category: "study-music",
    mood: "soft, orchestral, peaceful",
    url: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_cb4fe5bfed.mp3",
  },
  {
    id: "quiet-reflection",
    name: "Quiet Reflection",
    description: "Ambient piano meditation",
    category: "study-music",
    mood: "quiet, reflective, piano",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
  },
  {
    id: "heavenly-strings",
    name: "Heavenly Strings",
    description: "Beautiful string arrangement",
    category: "study-music",
    mood: "beautiful, strings, uplifting",
    url: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946cc8ad49.mp3",
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
  // Use simple HTML5 Audio for independence from other audio on the page
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuth();
  const { userTracks, uploading, uploadMusic, deleteMusic, toggleFavorite } = useUserMusic();
  const isMobile = useIsMobile();
  
  const [isPlaying, setIsPlaying] = useState(false);
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
  const [showPlaylist, setShowPlaylist] = useState(false);

  // Audio ducking - reduce volume when TTS is playing
  const handleDuckChange = useCallback((ducked: boolean, duckRatio: number) => {
    console.log(`[AmbientMusic] Duck event: ducked=${ducked}, ratio=${duckRatio}`);
    setDuckMultiplier(duckRatio);
  }, []);

  useAudioDucking(handleDuckChange);

  // Simple volume management - direct HTML5 audio volume control
  useEffect(() => {
    const effectiveVolume = isMuted ? 0 : volume * duckMultiplier;
    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume;
    }
    console.log(`[AmbientMusic] Volume: base=${volume}, duck=${duckMultiplier}, effective=${effectiveVolume}`);
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

  // Combine preset and user tracks - memoized to prevent unnecessary re-renders
  const allTracks = useMemo(() => [
    ...AMBIENT_TRACKS.map(t => ({ ...t, isUser: false })),
    ...userTracks
      .filter(t => isValidAudioUrl(t.file_url)) // Filter out invalid URLs
      .map(t => ({ 
        id: `user-${t.id}`, 
        name: t.name, 
        description: t.mood || "Your uploaded track",
        url: t.file_url,
        category: "custom",
        floor: 0,
        mood: t.mood || "custom",
        bpm: 60,
        isUser: true,
        userTrackData: t
      }))
  ], [userTracks, isValidAudioUrl]);

  const currentTrack = useMemo(() => 
    allTracks.find(t => t.id === currentTrackId) || allTracks[0],
    [allTracks, currentTrackId]
  );

  // Ref for stable callback access in event handlers (fixes stale closure in onended)
  const playbackStateRef = useRef<{
    allTracks: typeof allTracks;
    selectedTracks: Set<string>;
    currentTrackId: string;
    shuffleMode: boolean;
    loopMode: "none" | "one" | "all";
  }>({
    allTracks,
    selectedTracks,
    currentTrackId,
    shuffleMode,
    loopMode
  });
  
  // Keep ref updated with latest values
  useEffect(() => {
    playbackStateRef.current = {
      allTracks,
      selectedTracks,
      currentTrackId,
      shuffleMode,
      loopMode
    };
  }, [allTracks, selectedTracks, currentTrackId, shuffleMode, loopMode]);

  // Initialize audio element once - simple HTML5 audio for independence
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
      
      // Handle track ended - use ref for latest state to avoid stale closures
      audioRef.current.onended = () => {
        const state = playbackStateRef.current;
        console.log('[AmbientMusic] Track ended, loopMode:', state.loopMode);
        
        if (state.loopMode === "all") {
          // Get next track using latest state from ref
          const playableTracks = state.allTracks.filter(t => state.selectedTracks.has(t.id));
          if (playableTracks.length === 0) {
            console.log('[AmbientMusic] No playable tracks');
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
              nextTrackToPlay = playableTracks[0];
            }
          } else {
            const currentIndex = playableTracks.findIndex(t => t.id === state.currentTrackId);
            const nextIndex = (currentIndex + 1) % playableTracks.length;
            nextTrackToPlay = playableTracks[nextIndex];
          }
          
          if (nextTrackToPlay && audioRef.current) {
            console.log('[AmbientMusic] Auto-playing next track:', nextTrackToPlay.name, nextTrackToPlay.url);
            // Directly set src and play - don't rely on React state update timing
            audioRef.current.src = nextTrackToPlay.url;
            audioRef.current.load(); // Explicitly load the new source
            audioRef.current.play()
              .then(() => {
                console.log('[AmbientMusic] Next track started successfully');
                setIsPlaying(true); // Ensure playing state is updated
              })
              .catch((err) => {
                console.error('[AmbientMusic] Failed to play next track:', err);
                setIsPlaying(false);
              });
            setCurrentTrackId(nextTrackToPlay.id);
          }
        } else if (state.loopMode === "none") {
          console.log('[AmbientMusic] Loop mode none, stopping');
          setIsPlaying(false);
        }
        // loopMode === "one" is handled by audio.loop = true
      };
      
      // Handle errors
      audioRef.current.onerror = (e) => {
        console.error('[AmbientMusic] Audio error:', e);
      };
    }
    
    // Cleanup only on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current = null;
      }
    };
  }, []); // Empty deps - only run once on mount

  // Update audio source when track changes - only reset src if URL actually changed
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      // Only change src if it's actually different to prevent restart
      if (audioRef.current.src !== currentTrack.url) {
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
      // Convert from 0-100 scale to 0-1.0 (no cap, full range)
      const normalizedVolume = Math.min(newVolume, 100) / 100;
      console.log('[AmbientMusic] Global volume update:', newVolume, '-> normalized:', normalizedVolume);
      setVolume(normalizedVolume);
    });
    return unsubscribe;
  }, []);

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
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        // Check if current track URL is valid and not previously failed
        if (!isValidAudioUrl(currentTrack.url) || failedUrlsRef.current.has(currentTrack.url)) {
          console.log("[Music] Skipping invalid/failed URL:", currentTrack.url);
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
        
        // Set volume directly on audio element
        const effectiveVolume = isMuted ? 0 : volume * duckMultiplier;
        audioRef.current.volume = effectiveVolume;
        
        console.log("Attempting to play:", currentTrack.url);
        await audioRef.current.play();
        console.log("Audio playing successfully");
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
            audioRef.current?.play();
            setIsPlaying(true);
          });
          navigator.mediaSession.setActionHandler('pause', () => {
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
    console.log("[Music] Trying next working track:", playableTracks[nextIndex].name);
    setCurrentTrackId(playableTracks[nextIndex].id);
  }, [allTracks, selectedTracks, currentTrackId, isValidAudioUrl]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    const effectiveVolume = newMuted ? 0 : volume * duckMultiplier;
    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume;
    }
  };

  const nextTrack = useCallback(() => {
    // Filter to only selected tracks
    const playableTracks = allTracks.filter(t => selectedTracks.has(t.id));
    if (playableTracks.length === 0) return;
    
    let nextTrackToPlay;
    if (shuffleMode) {
      // Random track (different from current)
      const otherTracks = playableTracks.filter(t => t.id !== currentTrackId);
      if (otherTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherTracks.length);
        nextTrackToPlay = otherTracks[randomIndex];
      } else {
        nextTrackToPlay = playableTracks[0];
      }
    } else {
      const currentIndex = playableTracks.findIndex(t => t.id === currentTrackId);
      const nextIndex = (currentIndex + 1) % playableTracks.length;
      nextTrackToPlay = playableTracks[nextIndex];
    }
    
    if (nextTrackToPlay && audioRef.current) {
      console.log('[AmbientMusic] Skipping to track:', nextTrackToPlay.name);
      // Directly set src and play to avoid state timing issues
      audioRef.current.src = nextTrackToPlay.url;
      const wasPlaying = isPlaying;
      if (wasPlaying) {
        audioRef.current.play().catch(console.error);
      }
      setCurrentTrackId(nextTrackToPlay.id);
    }
  }, [allTracks, selectedTracks, currentTrackId, shuffleMode, isPlaying]);

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

  const handleVolumeChange = (value: number[]) => {
    console.log('[AmbientMusic] handleVolumeChange called:', value[0]);
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

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
    console.log('[AmbientMusic] setVolumePreset:', preset, newVolume, 'effective:', effectiveVolume);
    
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
    const result = await uploadMusic(uploadFile, uploadName);
    if (result) {
      setShowUpload(false);
      setUploadFile(null);
      setUploadName("");
      // Switch to the new track
      setCurrentTrackId(`user-${result.id}`);
    }
  };

  const handleDeleteTrack = (track: any) => {
    if (track.isUser && track.userTrackData) {
      deleteMusic(track.userTrackData);
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
            variant="ghost"
            size="icon"
            className={cn(
              "relative",
              isPlaying && "text-primary",
              className
            )}
          >
            <Music className="h-5 w-5" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-background z-50" align="end" side="top" sideOffset={8} collisionPadding={16}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Study Music</h4>
              <div className="flex items-center gap-1">
                {user && (
                  <>
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
                      disabled={uploading}
                      title="Upload your music"
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    </Button>
                  </>
                )}
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
                  <span className="text-sm font-medium">Upload Your Music</span>
                </div>
                <Label className="text-xs">Track Name</Label>
                <Input 
                  value={uploadName} 
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="Enter track name"
                  className="h-8 text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  💡 This will add "{uploadName}" to your custom music collection
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleUpload} disabled={uploading} className="flex-1">
                    {uploading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Upload className="h-3 w-3 mr-1" />}
                    Upload Now
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
                {userTracks.length > 0 && (
                  <>
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Your Music</div>
                    {allTracks.filter(t => t.isUser).map(track => (
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
                    <span className="text-xs text-muted-foreground">Select songs to include:</span>
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
                      <div className="text-xs font-medium text-primary px-1">Your Music</div>
                      {allTracks.filter(t => t.isUser).map(track => (
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
                  max={0.30}
                  step={0.01}
                  className="flex-1"
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
                className="w-20"
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
                    {userTracks.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Your Music</div>
                        {allTracks.filter(t => t.isUser).map(track => (
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
                          <div className="text-xs font-medium text-primary px-1">Your Music</div>
                          {allTracks.filter(t => t.isUser).map(track => (
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

                {/* Mobile Volume Control - Preset Buttons */}
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
                  <div className="flex items-center gap-1">
                    <Button
                      variant={getCurrentPreset() === 'off' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVolumePreset('off')}
                      className="h-8 flex-1 text-xs"
                    >
                      <VolumeX className="h-3 w-3 mr-1" />
                      Off
                    </Button>
                    <Button
                      variant={getCurrentPreset() === 'low' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVolumePreset('low')}
                      className="h-8 flex-1 text-xs"
                    >
                      5%
                    </Button>
                    <Button
                      variant={getCurrentPreset() === 'med' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVolumePreset('med')}
                      className="h-8 flex-1 text-xs"
                    >
                      15%
                    </Button>
                    <Button
                      variant={getCurrentPreset() === 'high' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVolumePreset('high')}
                      className="h-8 flex-1 text-xs"
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
