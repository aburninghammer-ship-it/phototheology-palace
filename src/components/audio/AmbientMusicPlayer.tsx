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

// Phototheology Sacred Orchestral Music
// Rich orchestral, movie soundtrack style (The Chosen, Zimmer, Tyler)
// BPM 55-70, no lyrics, no synthesizers, pure orchestra
const AMBIENT_TRACKS = [
  // Floor 1 - Story Floor: warm strings, gentle narrative
  {
    id: "story-warmth",
    name: "Story Warmth",
    description: "Warm strings and gentle cello for narrative immersion",
    category: "floor-1",
    floor: 1,
    mood: "warm, human, welcoming",
    url: "https://www.bensound.com/bensound-music/bensound-slowmotion.mp3",
    bpm: 60,
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
    url: "https://www.bensound.com/bensound-music/bensound-memories.mp3",
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
    name: "November Reflection",
    description: "Melancholic piano with sweeping orchestral strings",
    category: "cinematic",
    floor: 7,
    mood: "reflective, solemn, autumnal",
    url: "https://www.bensound.com/bensound-music/bensound-november.mp3",
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
    name: "Deep Ocean Meditation",
    description: "Atmospheric depths with ethereal pads and soft strings",
    category: "meditation",
    floor: 7,
    mood: "deep, mysterious, peaceful",
    url: "https://www.bensound.com/bensound-music/bensound-deepblue.mp3",
    bpm: 55,
  },
  {
    id: "discovery-wonder",
    name: "Discovery & Wonder",
    description: "Cinematic exploration with orchestral grandeur",
    category: "cinematic",
    floor: 5,
    mood: "wonder, discovery, awe",
    url: "https://www.bensound.com/bensound-music/bensound-discovery.mp3",
    bpm: 60,
  },
  {
    id: "photo-memories",
    name: "Sacred Memories",
    description: "Gentle piano with nostalgic string arrangements",
    category: "meditation",
    floor: 1,
    mood: "nostalgic, tender, sacred",
    url: "https://www.bensound.com/bensound-music/bensound-photoalbum.mp3",
    bpm: 55,
  },
  {
    id: "love-eternal",
    name: "Love Eternal",
    description: "Romantic strings with heavenly harp undertones",
    category: "meditation",
    floor: 4,
    mood: "loving, eternal, devotional",
    url: "https://www.bensound.com/bensound-music/bensound-love.mp3",
    bpm: 58,
  },
  {
    id: "sad-beauty",
    name: "Sorrowful Beauty",
    description: "Emotional cello with orchestral lament",
    category: "cinematic",
    floor: 7,
    mood: "sorrowful, beautiful, contemplative",
    url: "https://www.bensound.com/bensound-music/bensound-sadday.mp3",
    bpm: 55,
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
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : volume;
    }
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
