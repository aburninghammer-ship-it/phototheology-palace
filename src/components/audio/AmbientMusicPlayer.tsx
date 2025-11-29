import { useState, useEffect, useRef } from "react";
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
  X
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

// Epic cinematic orchestral tracks - Hans Zimmer style
// Using reliable CDN sources for ambient music
const AMBIENT_TRACKS = [
  {
    id: "devotion",
    name: "Devotion",
    description: "Sweeping emotional strings for reflection",
    category: "devotion",
    // Chosic free ambient
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
    bpm: 65,
  },
  {
    id: "deep-study",
    name: "Deep Study",
    description: "Majestic orchestral for focused learning",
    category: "study",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kai_Engel/Satin/Kai_Engel_-_04_-_Moonlight_Reprise.mp3",
    bpm: 70,
  },
  {
    id: "sanctuary",
    name: "Sanctuary",
    description: "Reverent cinematic soundscape",
    category: "sanctuary",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_07_-_Interception.mp3",
    bpm: 60,
  },
  {
    id: "memorization",
    name: "Memorization",
    description: "Gentle cinematic waves for memory",
    category: "memory",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kai_Engel/Satin/Kai_Engel_-_01_-_Contention.mp3",
    bpm: 62,
  },
  {
    id: "prophecy",
    name: "Prophecy",
    description: "Grand orchestral for prophetic study",
    category: "prophecy",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_09_-_Anxiety.mp3",
    bpm: 55,
  },
];

// Room to track mapping
const ROOM_TRACK_MAP: Record<string, string> = {
  // Floor 1 - Furnishing
  "story-room": "devotion",
  "imagination-room": "sanctuary",
  "24fps-room": "deep-study",
  "bible-rendered": "deep-study",
  "translation-room": "memorization",
  "gems-room": "devotion",
  
  // Floor 2 - Investigation
  "observation-room": "deep-study",
  "def-com-room": "deep-study",
  "symbols-types": "sanctuary",
  "questions-room": "memorization",
  "qa-chains": "memorization",
  
  // Floor 3 - Freestyle
  "nature-freestyle": "sanctuary",
  "personal-freestyle": "devotion",
  "bible-freestyle": "deep-study",
  "history-freestyle": "prophecy",
  "listening-room": "devotion",
  
  // Floor 4 - Next Level
  "concentration-room": "memorization",
  "dimensions-room": "deep-study",
  "connect-6": "deep-study",
  "theme-room": "sanctuary",
  "time-zone": "prophecy",
  "patterns-room": "deep-study",
  "parallels-room": "deep-study",
  "fruit-room": "devotion",
  
  // Floor 5 - Vision
  "blue-room": "sanctuary",
  "prophecy-room": "prophecy",
  "three-angels": "prophecy",
  
  // Default
  "default": "devotion",
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

  const currentTrack = AMBIENT_TRACKS.find(t => t.id === currentTrackId) || AMBIENT_TRACKS[0];

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
      audioRef.current.loop = true;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.url;
      audioRef.current.volume = isMuted ? 0 : volume;
      
      if (wasPlaying && isEnabled) {
        audioRef.current.play().catch(console.error);
      }
      
      localStorage.setItem("pt-ambient-track", currentTrackId);
    }
  }, [currentTrackId, currentTrack]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      localStorage.setItem("pt-ambient-volume", volume.toString());
    }
  }, [volume, isMuted]);

  // Save enabled state
  useEffect(() => {
    localStorage.setItem("pt-ambient-enabled", isEnabled.toString());
  }, [isEnabled]);

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
        audioRef.current.volume = isMuted ? 0 : volume;
        
        console.log("Attempting to play:", currentTrack.url);
        await audioRef.current.play();
        console.log("Audio playing successfully");
        setIsPlaying(true);
        setIsEnabled(true);
      } catch (error) {
        console.error("Audio playback failed:", error);
        // Try loading a different track if this one fails
        const currentIndex = AMBIENT_TRACKS.findIndex(t => t.id === currentTrackId);
        const nextIndex = (currentIndex + 1) % AMBIENT_TRACKS.length;
        if (nextIndex !== currentIndex) {
          console.log("Trying next track...");
          setCurrentTrackId(AMBIENT_TRACKS[nextIndex].id);
        }
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    const currentIndex = AMBIENT_TRACKS.findIndex(t => t.id === currentTrackId);
    const nextIndex = (currentIndex + 1) % AMBIENT_TRACKS.length;
    setCurrentTrackId(AMBIENT_TRACKS[nextIndex].id);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
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
        <PopoverContent className="w-72" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Study Music</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowControls(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Select value={currentTrackId} onValueChange={setCurrentTrackId}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
