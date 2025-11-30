import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
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
  Upload,
  Trash2,
  Heart,
  Loader2,
  Check,
  Square
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

// Phototheology Sacred Orchestral Music
// Rich orchestral, movie soundtrack style (The Chosen, Zimmer, Tyler)
// BPM 55-70, no lyrics, no synthesizers, pure orchestra
const AMBIENT_TRACKS = [
  // Floor 1 - Story Floor: warm strings, gentle narrative
  {
    id: "story-warmth",
    name: "Story Warmth",
    description: "Gentle meditative piano for peaceful narrative immersion",
    category: "floor-1",
    floor: 1,
    mood: "warm, meditative, peaceful",
    url: "https://www.bensound.com/bensound-music/bensound-relaxing.mp3",
    bpm: 55,
  },
  // Floor 2 - Pattern Floor: structured strings, reflective
  {
    id: "patterns-kingdom",
    name: "Patterns of the Kingdom",
    description: "Measured orchestral strings with thoughtful progression",
    category: "floor-2",
    floor: 2,
    mood: "structured, reflective",
    url: "https://www.bensound.com/bensound-music/bensound-tenderness.mp3",
    bpm: 65,
  },
  // Floor 3 - Sanctuary Floor: reverent strings, harp
  {
    id: "sanctuary-stillness",
    name: "Sanctuary Stillness",
    description: "Sacred strings with soft harp and gentle brass",
    category: "floor-3",
    floor: 3,
    mood: "holy, reverent, awe",
    url: "https://www.bensound.com/bensound-music/bensound-birthofahero.mp3",
    bpm: 58,
  },
  // Floor 4 - Christ Floor: bright, hopeful orchestra
  {
    id: "christ-the-center",
    name: "Christ the Center",
    description: "Hopeful strings with radiant orchestral swells",
    category: "floor-4",
    floor: 4,
    mood: "bright, hopeful, radiant",
    url: "https://www.bensound.com/bensound-music/bensound-onceagain.mp3",
    bpm: 65,
  },
  // Floor 5 - Prophecy Floor: cinematic tension, deep strings
  {
    id: "prophecy-watch",
    name: "Prophecy Watch",
    description: "Cinematic strings with reverent tension",
    category: "floor-5",
    floor: 5,
    mood: "cinematic, tense, respectful",
    url: "https://www.bensound.com/bensound-music/bensound-evolution.mp3",
    bpm: 60,
  },
  // Floor 6 - Freestyle Floor: natural, flowing strings
  {
    id: "wisdom-quiet",
    name: "Wisdom in Quiet Places",
    description: "Flowing strings with gentle woodwinds",
    category: "floor-6",
    floor: 6,
    mood: "open, natural, free",
    url: "https://www.bensound.com/bensound-music/bensound-betterdays.mp3",
    bpm: 58,
  },
  // Floor 7 - Wisdom Floor: solemn cello, ancient feel
  {
    id: "chamber-light",
    name: "Chamber of Light",
    description: "Deep cello with ancient orchestral textures",
    category: "floor-7",
    floor: 7,
    mood: "solemn, calm, ancient",
    url: "https://www.bensound.com/bensound-music/bensound-pianomoment.mp3",
    bpm: 60,
  },
  // Special: Blue Room - Typology
  {
    id: "blue-room-ambient",
    name: "Blue Room - Typology",
    description: "Reverent orchestral ambience with deep strings",
    category: "blue-room",
    floor: 3,
    mood: "reverent, typological",
    url: "https://www.bensound.com/bensound-music/bensound-onceagain.mp3",
    bpm: 55,
  },
  // Additional Cinematic/Orchestral Tracks - Last of the Mohicans style
  {
    id: "november-reflection",
    name: "Autumn Reflection",
    description: "Sweeping orchestral strings with contemplative depth",
    category: "cinematic",
    floor: 7,
    mood: "reflective, solemn, autumnal",
    url: "https://www.bensound.com/bensound-music/bensound-slowmotion.mp3",
    bpm: 58,
  },
  {
    id: "tomorrow-hope",
    name: "Tomorrow's Hope",
    description: "Uplifting orchestral crescendo with triumphant brass",
    category: "cinematic",
    floor: 4,
    mood: "hopeful, triumphant, dawn",
    url: "https://www.bensound.com/bensound-music/bensound-tomorrow.mp3",
    bpm: 62,
  },
  {
    id: "adventure-quest",
    name: "Adventure Quest",
    description: "Epic cinematic journey with soaring strings",
    category: "cinematic",
    floor: 5,
    mood: "adventurous, epic, majestic",
    url: "https://www.bensound.com/bensound-music/bensound-adventure.mp3",
    bpm: 65,
  },
  {
    id: "deep-ocean",
    name: "Depths of Mystery",
    description: "Epic cinematic strings with sweeping orchestral grandeur",
    category: "cinematic",
    floor: 7,
    mood: "epic, mysterious, majestic",
    url: "https://www.bensound.com/bensound-music/bensound-epic.mp3",
    bpm: 55,
  },
  {
    id: "discovery-wonder",
    name: "Discovery & Wonder",
    description: "Cinematic exploration with orchestral grandeur",
    category: "cinematic",
    floor: 5,
    mood: "wonder, discovery, awe",
    url: "https://www.bensound.com/bensound-music/bensound-adventure.mp3",
    bpm: 60,
  },
  {
    id: "photo-memories",
    name: "Sacred Memories",
    description: "Gentle piano with nostalgic string arrangements",
    category: "meditation",
    floor: 1,
    mood: "nostalgic, tender, sacred",
    url: "https://www.bensound.com/bensound-music/bensound-sadday.mp3",
    bpm: 55,
  },
  {
    id: "love-eternal",
    name: "Love Eternal",
    description: "Romantic strings with heavenly harp undertones",
    category: "meditation",
    floor: 4,
    mood: "loving, eternal, devotional",
    url: "https://www.bensound.com/bensound-music/bensound-ofeliasdream.mp3",
    bpm: 58,
  },
  {
    id: "sad-beauty",
    name: "Sorrowful Beauty",
    description: "Emotional cello with orchestral lament",
    category: "cinematic",
    floor: 7,
    mood: "sorrowful, beautiful, contemplative",
    url: "https://www.bensound.com/bensound-music/bensound-november.mp3",
    bpm: 55,
  },
  // Cinematic Instrumental Hymn Remixes - Epic Orchestral Style
  {
    id: "hymn-amazing-grace",
    name: "Redeemer's Hope",
    description: "Sweeping orchestral arrangement with soaring strings and brass",
    category: "hymn-cinematic",
    floor: 4,
    mood: "redemptive, majestic, grace",
    url: "https://www.bensound.com/bensound-music/bensound-hope.mp3",
    bpm: 58,
  },
  {
    id: "hymn-how-great-thou-art",
    name: "Majesty Unveiled",
    description: "Triumphant orchestral crescendo with thundering timpani",
    category: "hymn-cinematic",
    floor: 3,
    mood: "awe, majesty, worship",
    url: "https://www.bensound.com/bensound-music/bensound-birthofahero.mp3",
    bpm: 62,
  },
  {
    id: "hymn-be-thou-my-vision",
    name: "Vision of Light",
    description: "Celtic strings with cinematic orchestral swells",
    category: "hymn-cinematic",
    floor: 4,
    mood: "devotion, vision, celtic",
    url: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
    bpm: 55,
  },
  {
    id: "hymn-it-is-well",
    name: "Peace Beyond Storm",
    description: "Peaceful strings building to triumphant resolution",
    category: "hymn-cinematic",
    floor: 7,
    mood: "peace, surrender, triumph",
    url: "https://www.bensound.com/bensound-music/bensound-slowmotion.mp3",
    bpm: 55,
  },
  {
    id: "hymn-great-is-thy-faithfulness",
    name: "Faithful Dawn",
    description: "Dawn-breaking orchestration with hopeful brass fanfare",
    category: "hymn-cinematic",
    floor: 1,
    mood: "faithfulness, morning, hope",
    url: "https://www.bensound.com/bensound-music/bensound-betterdays.mp3",
    bpm: 60,
  },
  {
    id: "hymn-mighty-fortress",
    name: "Fortress Strong",
    description: "Powerful brass and percussion with fortress-like strength",
    category: "hymn-cinematic",
    floor: 5,
    mood: "strength, fortress, victory",
    url: "https://www.bensound.com/bensound-music/bensound-inspire.mp3",
    bpm: 65,
  },
  {
    id: "hymn-what-a-friend",
    name: "Faithful Companion",
    description: "Gentle piano with warm string accompaniment",
    category: "hymn-cinematic",
    floor: 6,
    mood: "friendship, comfort, intimate",
    url: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
    bpm: 55,
  },
  {
    id: "hymn-nearer-my-god",
    name: "Ascending Heights",
    description: "Ascending orchestral journey with ethereal heights",
    category: "hymn-cinematic",
    floor: 7,
    mood: "ascending, longing, nearness",
    url: "https://www.bensound.com/bensound-music/bensound-tomorrow.mp3",
    bpm: 60,
  },
  {
    id: "hymn-come-thou-fount",
    name: "Living Waters",
    description: "Flowing strings like living water with grateful heart",
    category: "hymn-cinematic",
    floor: 4,
    mood: "gratitude, fountain, flowing",
    url: "https://www.bensound.com/bensound-music/bensound-tenderness.mp3",
    bpm: 58,
  },
  {
    id: "amazing-grace-epic",
    name: "Amazing Grace (Epic Meditative)",
    description: "Epic cinematic meditative remix with sweeping orchestration",
    category: "hymn-cinematic",
    floor: 4,
    mood: "meditative, epic, cinematic, grace",
    url: "https://cdn1.suno.ai/a362b171-5a6f-4264-8946-ae76b09a6aa7.mp3",
    bpm: 60,
  },
  {
    id: "echoes-of-eternity",
    name: "Echoes of Eternity",
    description: "Cinematic orchestral Christian instrumental with eternal themes",
    category: "hymn-cinematic",
    floor: 7,
    mood: "cinematic, orchestral, eternal, worship",
    url: "https://cdn1.suno.ai/87b87bf9-3f8f-4e49-ab69-1834e0db7119.mp3",
    bpm: 60,
  },
  {
    id: "eternal-grace",
    name: "Eternal Grace",
    description: "Christian orchestral cinematic instrumental with graceful themes",
    category: "hymn-cinematic",
    floor: 4,
    mood: "christian, orchestral, cinematic, grace",
    url: "https://cdn1.suno.ai/5a7d94e9-13f6-4dae-9c16-b3dd559849b3.mp3",
    bpm: 60,
  },
];

// Room to track mapping based on Phototheology floors
const ROOM_TRACK_MAP: Record<string, string> = {
  // Floor 1 - Story Floor (Furnishing): warm, welcoming, narrative
  "story-room": "story-warmth",
  "imagination-room": "story-warmth",
  "24fps-room": "patterns-kingdom", // cinematic storytelling
  "bible-rendered": "story-warmth",
  "translation-room": "story-warmth",
  "gems-room": "story-warmth",
  
  // Floor 2 - Pattern Floor (Investigation): structured, rhythmic
  "observation-room": "patterns-kingdom",
  "def-com-room": "patterns-kingdom",
  "symbols-types": "blue-room-ambient", // typology connection
  "questions-room": "patterns-kingdom",
  "qa-chains": "patterns-kingdom",
  
  // Floor 3 - Sanctuary Floor: holy, reverent
  "blue-room": "blue-room-ambient",
  "sanctuary-room": "sanctuary-stillness",
  
  // Floor 4 - Christ Floor (Next Level): bright, hopeful
  "concentration-room": "christ-the-center",
  "dimensions-room": "christ-the-center",
  "connect-6": "patterns-kingdom",
  "theme-room": "christ-the-center",
  "time-zone": "prophecy-watch",
  "patterns-room": "patterns-kingdom",
  "parallels-room": "patterns-kingdom",
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuth();
  const { userTracks, uploading, uploadMusic, deleteMusic, toggleFavorite } = useUserMusic();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("pt-ambient-volume");
    return saved ? parseFloat(saved) : 0.3;
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
  const [duckMultiplier, setDuckMultiplier] = useState(1);
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

  // Audio ducking - reduce volume when TTS is playing
  const handleDuckChange = useCallback((ducked: boolean, duckRatio: number) => {
    setDuckMultiplier(duckRatio);
    if (audioRef.current) {
      const effectiveVolume = isMuted ? 0 : volume * duckRatio;
      audioRef.current.volume = effectiveVolume;
      console.log(`[AmbientMusic] ${ducked ? 'Ducking' : 'Restoring'} volume to ${effectiveVolume}`);
    }
  }, [volume, isMuted]);

  useAudioDucking(handleDuckChange);

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

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
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
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current = null;
      }
    };
  }, [loopMode]);

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
      
      localStorage.setItem("pt-ambient-track", currentTrackId);
    }
  }, [currentTrackId, currentTrack]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume * duckMultiplier;
      localStorage.setItem("pt-ambient-volume", volume.toString());
    }
  }, [volume, isMuted, duckMultiplier]);

  // Save enabled state
  useEffect(() => {
    localStorage.setItem("pt-ambient-enabled", isEnabled.toString());
  }, [isEnabled]);

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
        // Ensure source is set
        if (!audioRef.current.src || audioRef.current.src === "") {
          audioRef.current.src = currentTrack.url;
        }
        audioRef.current.volume = isMuted ? 0 : volume * duckMultiplier;
        
        console.log("Attempting to play:", currentTrack.url);
        await audioRef.current.play();
        console.log("Audio playing successfully");
        setIsPlaying(true);
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
    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : volume * duckMultiplier;
    }
  };

  const nextTrack = () => {
    // Filter to only selected tracks
    const playableTracks = allTracks.filter(t => selectedTracks.has(t.id));
    if (playableTracks.length === 0) return;
    
    const currentIndex = playableTracks.findIndex(t => t.id === currentTrackId);
    const nextIndex = (currentIndex + 1) % playableTracks.length;
    setCurrentTrackId(playableTracks[nextIndex].id);
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
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
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
        <PopoverContent className="w-80" align="end">
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
              <div className="space-y-2 p-2 border rounded-md bg-muted/50">
                <Label className="text-xs">Track Name</Label>
                <Input 
                  value={uploadName} 
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="Enter track name"
                  className="h-8 text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleUpload} disabled={uploading} className="flex-1">
                    {uploading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                    Upload
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
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTrackSelection(track.id);
                            }}
                            className="flex-shrink-0"
                          >
                            {selectedTracks.has(track.id) ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <Square className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
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
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTrackSelection(track.id);
                        }}
                        className="flex-shrink-0"
                      >
                        {selectedTracks.has(track.id) ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Square className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex flex-col">
                        <span>{track.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {track.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-xs text-muted-foreground text-center">
              {selectedTracks.size} of {AMBIENT_TRACKS.length + userTracks.length} tracks in playlist
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
                onClick={cycleLoopMode}
                className={cn("h-8 w-8", loopMode !== "none" && "text-primary")}
                title={loopMode === "none" ? "Loop off" : loopMode === "one" ? "Loop one" : "Loop all"}
              >
                {loopMode === "one" ? (
                  <Repeat1 className="h-4 w-4" />
                ) : (
                  <Repeat className="h-4 w-4" />
                )}
              </Button>
              
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
              
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
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

          {/* Loop Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleLoopMode}
            className={cn("h-8 w-8 shrink-0", loopMode !== "none" && "text-primary")}
            title={loopMode === "none" ? "Loop off" : loopMode === "one" ? "Loop one" : "Loop all"}
          >
            {loopMode === "one" ? (
              <Repeat1 className="h-4 w-4" />
            ) : (
              <Repeat className="h-4 w-4" />
            )}
          </Button>

          {/* Volume */}
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
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>

          {/* Settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Select Track</h4>
                <Select value={currentTrackId} onValueChange={setCurrentTrackId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AMBIENT_TRACKS.map(track => (
                      <SelectItem key={track.id} value={track.id}>
                        {track.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
