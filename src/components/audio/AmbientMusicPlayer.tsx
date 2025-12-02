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

// Phototheology Sacred Orchestral Music
// Rich orchestral, movie soundtrack style (The Chosen, Zimmer, Tyler)
// BPM 55-70, no lyrics, no synthesizers, pure orchestra
const AMBIENT_TRACKS: Array<{
  id: string;
  name: string;
  description: string;
  category: string;
  floor: number;
  mood: string;
  url: string;
  bpm: number;
}> = [
  {
    id: "eternal-echoes",
    name: "Eternal Echoes",
    description: "Cinematic orchestral christian music - instrumental",
    category: "floor-4",
    floor: 4,
    mood: "cinematic, orchestral, reverent",
    url: "https://cdn1.suno.ai/ea711d82-cd6a-4ebd-a960-b73cb72c39f0.mp3",
    bpm: 65,
  },
  {
    id: "amazing-grace-epic",
    name: "Amazing Grace (Epic Meditative Remix)",
    description: "Cinematic christian music - epic meditative instrumental",
    category: "floor-7",
    floor: 7,
    mood: "cinematic, epic, meditative",
    url: "https://cdn1.suno.ai/a362b171-5a6f-4264-8946-ae76b09a6aa7.mp3",
    bpm: 70,
  },
  {
    id: "when-he-cometh",
    name: "When He Cometh Reimagined",
    description: "Orchestral choral ambient - instrumental",
    category: "floor-7",
    floor: 7,
    mood: "orchestral, choral, ambient",
    url: "https://cdn1.suno.ai/617f1da9-1bfb-4a93-8485-08f432623d2e.mp3",
    bpm: 68,
  },
  {
    id: "flight",
    name: "Flight",
    description: "Soaring orchestral, uplifting, ethereal",
    category: "floor-2",
    floor: 2,
    mood: "soaring, orchestral, uplifting",
    url: "https://cdn1.suno.ai/qWAdsQQdcbYPv9kC.mp3",
    bpm: 65,
  },
  {
    id: "whispers-inner-mind",
    name: "Whispers of the Inner Mind",
    description: "Ambient instrumental meditation - peaceful and meditative",
    category: "floor-2",
    floor: 2,
    mood: "ambient, peaceful, meditative",
    url: "https://cdn1.suno.ai/E8qISnskB0iJ5bnz.mp3",
    bpm: 55,
  },
];

// Room to track mapping based on Phototheology floors
const ROOM_TRACK_MAP: Record<string, string> = {
  // Floor 1 - Story Floor (Furnishing): warm, welcoming, narrative
  "story-room": "sanctuary-stillness",
  "imagination-room": "sanctuary-stillness",
  "24fps-room": "chamber-light", // cinematic storytelling
  "bible-rendered": "sanctuary-stillness",
  "translation-room": "sanctuary-stillness",
  "gems-room": "sanctuary-stillness",
  
  // Floor 2 - Pattern Floor (Investigation): structured, rhythmic
  "observation-room": "chamber-light",
  "def-com-room": "chamber-light",
  "symbols-types": "blue-room-ambient", // typology connection
  "questions-room": "chamber-light",
  "qa-chains": "chamber-light",
  
  // Floor 3 - Sanctuary Floor: holy, reverent
  "blue-room": "blue-room-ambient",
  "sanctuary-room": "sanctuary-stillness",
  
  // Floor 4 - Christ Floor (Next Level): bright, hopeful
  "concentration-room": "christ-the-center",
  "dimensions-room": "christ-the-center",
  "connect-6": "chamber-light",
  "theme-room": "christ-the-center",
  "time-zone": "prophecy-watch",
  "patterns-room": "chamber-light",
  "parallels-room": "chamber-light",
  "fruit-room": "christ-the-center",
  
  // Floor 5 - Prophecy Floor (Vision): cinematic, atmospheric
  "prophecy-room": "prophecy-watch",
  "three-angels": "prophecy-watch",
  
  // Floor 6 - Freestyle Floor: natural, open
  "nature-freestyle": "wisdom-quiet",
  "personal-freestyle": "wisdom-quiet",
  "bible-freestyle": "wisdom-quiet",
  "history-freestyle": "prophecy-watch",
  "listening-room": "wisdom-quiet",
  
  // Floor 7 - Wisdom Floor: solemn, calm, ancient
  "wisdom-room": "chamber-light",
  "meditation-room": "chamber-light",
  
  // Default
  "default": "story-warmth",
};

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuth();
  const { userTracks, uploading, uploadMusic, deleteMusic, toggleFavorite } = useUserMusic();
  const isMobile = useIsMobile();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    // Read from new key (0-100 scale) and convert to 0-1
    const saved = localStorage.getItem("pt-music-volume-pct");
    if (saved) {
      return Math.min(parseInt(saved, 10), 100) / 100;
    }
    return 0.80; // Default 80%
  });
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(() => {
    const saved = localStorage.getItem("pt-ambient-track");
    return saved || "devotion";
  });
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem("pt-ambient-enabled");
    return saved === "true";
  });
  const [showControls, setShowControls] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  // Loop mode: "none" | "one" | "all"
  const [loopMode, setLoopMode] = useState<"none" | "one" | "all">(() => {
    const saved = localStorage.getItem("pt-ambient-loop-mode");
    return (saved as "none" | "one" | "all") || "all";
  });
  const [shuffleMode, setShuffleMode] = useState(() => {
    const saved = localStorage.getItem("pt-ambient-shuffle");
    return saved === "true";
  });
  const [duckMultiplier, setDuckMultiplier] = useState(1);
  const effectiveVolumeRef = useRef(0.80); // Ref to track current effective volume for callbacks
  // Selected tracks for playlist
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("pt-ambient-selected-tracks");
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch {
        return new Set(AMBIENT_TRACKS.map(t => t.id));
      }
    }
    return new Set(AMBIENT_TRACKS.map(t => t.id)); // All tracks selected by default
  });
  const [showPlaylist, setShowPlaylist] = useState(false);

  // Audio ducking - reduce volume when TTS is playing
  // Works on both desktop and mobile to ensure voice reader is dominant
  const handleDuckChange = useCallback((ducked: boolean, duckRatio: number) => {
    console.log(`[AmbientMusic] Duck event: ducked=${ducked}, ratio=${duckRatio}`);
    setDuckMultiplier(duckRatio);
  }, []);

  useAudioDucking(handleDuckChange);

  // Single effect to manage volume - uses GainNode for iOS compatibility
  useEffect(() => {
    const effectiveVolume = isMuted ? 0 : volume * duckMultiplier;
    effectiveVolumeRef.current = effectiveVolume;
    
    // Use GainNode if available (iOS compatible)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = effectiveVolume;
      console.log(`[AmbientMusic] GainNode volume: ${effectiveVolume}`);
    }
    // Fallback to audio.volume for non-Web Audio path
    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume;
    }
    console.log(`[AmbientMusic] Volume updated: base=${volume}, duck=${duckMultiplier}, effective=${effectiveVolume}`);
  }, [volume, isMuted, duckMultiplier]);

  // Combine preset and user tracks - memoized to prevent unnecessary re-renders
  const allTracks = useMemo(() => [
    ...AMBIENT_TRACKS.map(t => ({ ...t, isUser: false })),
    ...userTracks.map(t => ({ 
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
  ], [userTracks]);

  const currentTrack = useMemo(() => 
    allTracks.find(t => t.id === currentTrackId) || allTracks[0],
    [allTracks, currentTrackId]
  );

  // Auto-select track based on room
  useEffect(() => {
    if (roomId && ROOM_TRACK_MAP[roomId]) {
      const suggestedTrack = ROOM_TRACK_MAP[roomId];
      if (suggestedTrack !== currentTrackId) {
        setCurrentTrackId(suggestedTrack);
      }
    }
  }, [roomId]);

  // Initialize audio element with Web Audio API for iOS volume control
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
      audioRef.current.loop = loopMode === "one";
      
      // Handle track ended for "all" loop mode
      audioRef.current.onended = () => {
        if (loopMode === "all") {
          nextTrack();
          // Auto-play next track
          setTimeout(() => {
            audioRef.current?.play().catch(console.error);
          }, 100);
        } else if (loopMode === "none") {
          setIsPlaying(false);
        }
      };
    }
    
    return () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current = null;
      }
    };
  }, [loopMode]);

  // Setup Web Audio API context and gain node (for iOS volume control)
  const setupWebAudio = useCallback(async () => {
    if (!audioRef.current || audioContextRef.current) return;
    
    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context (required for iOS)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      // Create gain node for volume control
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = effectiveVolumeRef.current;
      
      // Connect audio element to gain node
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceNodeRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      console.log('[AmbientMusic] Web Audio API setup complete, gain:', gainNodeRef.current.gain.value);
    } catch (error) {
      console.error('[AmbientMusic] Web Audio API setup failed:', error);
    }
  }, []);

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

  // Update loop setting
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = loopMode === "one";
      
      // Update onended handler
      audioRef.current.onended = () => {
        if (loopMode === "all") {
          nextTrack();
          setTimeout(() => {
            audioRef.current?.play().catch(console.error);
          }, 100);
        } else if (loopMode === "none") {
          setIsPlaying(false);
        }
      };
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
        // Setup Web Audio API on first play (requires user gesture on iOS)
        if (!audioContextRef.current) {
          await setupWebAudio();
        } else if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        // Ensure source is set
        if (!audioRef.current.src || audioRef.current.src === "") {
          audioRef.current.src = currentTrack.url;
        }
        
        // Set volume via GainNode if available
        const effectiveVolume = isMuted ? 0 : volume * duckMultiplier;
        if (gainNodeRef.current) {
          gainNodeRef.current.gain.value = effectiveVolume;
        }
        audioRef.current.volume = effectiveVolume;
        
        console.log("Attempting to play:", currentTrack.url);
        await audioRef.current.play();
        console.log("Audio playing successfully");
        setIsPlaying(true);
        
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
            setCurrentTrackId(playableTracks[prevIndex].id);
          });
        }
        setIsEnabled(true);
      } catch (error) {
        console.error("Audio playback failed:", error);
        // Try loading a different track if this one fails
        const currentIndex = allTracks.findIndex(t => t.id === currentTrackId);
        const nextIndex = (currentIndex + 1) % allTracks.length;
        if (nextIndex !== currentIndex) {
          console.log("Trying next track...");
          setCurrentTrackId(allTracks[nextIndex].id);
        }
      }
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    const effectiveVolume = newMuted ? 0 : volume * duckMultiplier;
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = effectiveVolume;
    }
    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume;
    }
  };

  const nextTrack = () => {
    // Filter to only selected tracks
    const playableTracks = allTracks.filter(t => selectedTracks.has(t.id));
    if (playableTracks.length === 0) return;
    
    if (shuffleMode) {
      // Random track (different from current)
      const otherTracks = playableTracks.filter(t => t.id !== currentTrackId);
      if (otherTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherTracks.length);
        setCurrentTrackId(otherTracks[randomIndex].id);
      }
    } else {
      const currentIndex = playableTracks.findIndex(t => t.id === currentTrackId);
      const nextIndex = (currentIndex + 1) % playableTracks.length;
      setCurrentTrackId(playableTracks[nextIndex].id);
    }
  };

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

  // Direct volume preset function - uses GainNode for iOS compatibility
  const setVolumePreset = (preset: 'off' | 'low' | 'med' | 'high') => {
    const presetValues = {
      off: 0,
      low: 0.25,
      med: 0.50,
      high: 1.0
    };
    const newVolume = presetValues[preset];
    const effectiveVolume = newVolume * duckMultiplier;
    console.log('[AmbientMusic] setVolumePreset:', preset, newVolume, 'effective:', effectiveVolume);
    
    // Apply via GainNode (iOS compatible)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = effectiveVolume;
      console.log('[AmbientMusic] GainNode set to:', effectiveVolume);
    }
    
    // Also set on audio element as fallback
    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume;
    }
    
    // Update state
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    localStorage.setItem("pt-music-volume-pct", Math.round(newVolume * 100).toString());
  };

  // Get current preset level
  const getCurrentPreset = (): 'off' | 'low' | 'med' | 'high' => {
    if (isMuted || volume === 0) return 'off';
    if (volume <= 0.30) return 'low';
    if (volume <= 0.70) return 'med';
    return 'high';
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
                  {currentTrack.bpm} BPM • {currentTrack.category}
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
