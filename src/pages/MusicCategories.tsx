import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Building2,
  Sparkles,
  BookOpen,
  Cross,
  Eye,
  Wind,
  Lightbulb
} from "lucide-react";

// Floor-based music categories following Phototheology guideline
const MUSIC_FLOORS = [
  {
    floor: 1,
    name: "Story Floor",
    subtitle: "Furnishing",
    icon: BookOpen,
    mood: "Warm, welcoming, narrative focus",
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    tracks: [
      {
        id: "story-warmth",
        name: "Story Warmth",
        description: "Gentle felt piano for narrative immersion",
        bpm: 60,
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
      }
    ]
  },
  {
    floor: 2,
    name: "Pattern Floor",
    subtitle: "Investigation",
    icon: Sparkles,
    mood: "Structured, rhythmic, reflective",
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    tracks: [
      {
        id: "patterns-kingdom",
        name: "Patterns of the Kingdom",
        description: "Measured, thoughtful light pulses",
        bpm: 65,
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kai_Engel/Satin/Kai_Engel_-_04_-_Moonlight_Reprise.mp3",
      }
    ]
  },
  {
    floor: 3,
    name: "Sanctuary Floor",
    subtitle: "Holy Space",
    icon: Building2,
    mood: "Holy, reverent, awe-inducing",
    color: "from-purple-500/20 to-violet-500/20",
    borderColor: "border-purple-500/30",
    tracks: [
      {
        id: "sanctuary-stillness",
        name: "Sanctuary Stillness",
        description: "Sacred stillness with soft harp and wind",
        bpm: 58,
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_07_-_Interception.mp3",
      },
      {
        id: "blue-room-ambient",
        name: "Blue Room - Typology",
        description: "Deep reverent ambience with slow drones",
        bpm: 55,
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kai_Engel/Satin/Kai_Engel_-_04_-_Moonlight_Reprise.mp3",
      }
    ]
  },
  {
    floor: 4,
    name: "Christ Floor",
    subtitle: "Next Level",
    icon: Cross,
    mood: "Bright, hopeful, radiant",
    color: "from-yellow-500/20 to-amber-500/20",
    borderColor: "border-yellow-500/30",
    tracks: [
      {
        id: "christ-the-center",
        name: "Christ the Center",
        description: "Gentle hope and radiant glory",
        bpm: 65,
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Algorithms.mp3",
      }
    ]
  },
  {
    floor: 5,
    name: "Prophecy Floor",
    subtitle: "Vision",
    icon: Eye,
    mood: "Cinematic, atmospheric tension",
    color: "from-red-500/20 to-rose-500/20",
    borderColor: "border-red-500/30",
    tracks: [
      {
        id: "prophecy-watch",
        name: "Prophecy Watch",
        description: "Atmospheric tension with reverent undertones",
        bpm: 60,
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Drifting.mp3",
      }
    ]
  },
  {
    floor: 6,
    name: "Freestyle Floor",
    subtitle: "Creative Space",
    icon: Wind,
    mood: "Natural, open, reflective",
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    tracks: [
      {
        id: "wisdom-quiet",
        name: "Wisdom in Quiet Places",
        description: "Freedom, nature, clarity with soft pads",
        bpm: 58,
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
      }
    ]
  },
  {
    floor: 7,
    name: "Wisdom Floor",
    subtitle: "Mastery",
    icon: Lightbulb,
    mood: "Solemn, calm, ancient",
    color: "from-indigo-500/20 to-purple-500/20",
    borderColor: "border-indigo-500/30",
    tracks: [
      {
        id: "chamber-light",
        name: "Chamber of Light",
        description: "Deep reflection with ancient textures",
        bpm: 60,
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_07_-_Interception.mp3",
      }
    ]
  }
];

export default function MusicCategories() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playTrack = async (trackId: string, url: string) => {
    if (!audioRef.current) return;

    if (playingTrackId === trackId) {
      audioRef.current.pause();
      setPlayingTrackId(null);
    } else {
      audioRef.current.src = url;
      audioRef.current.volume = isMuted ? 0 : volume;
      try {
        await audioRef.current.play();
        setPlayingTrackId(trackId);
      } catch (error) {
        console.error("Playback failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Music className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Phototheology Music</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sacred, cinematic instrumental tracks designed for focused Bible study. 
            Each floor has its own atmosphere—warm narrative tones, reverent sanctuary ambience, 
            or prophetic tension. BPM 55-70 for optimal memory and reflection.
          </p>
        </div>

        {/* Volume Control */}
        <Card variant="glass" className="max-w-md mx-auto">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={(v) => {
                  setVolume(v[0]);
                  if (v[0] > 0 && isMuted) setIsMuted(false);
                }}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Floor Categories */}
        <div className="grid gap-6 md:grid-cols-2">
          {MUSIC_FLOORS.map((floor) => {
            const Icon = floor.icon;
            return (
              <Card 
                key={floor.floor} 
                variant="glass" 
                className={`overflow-hidden border ${floor.borderColor} relative`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${floor.color} opacity-50`} />
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background/50">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Floor {floor.floor}: {floor.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{floor.subtitle}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit mt-2">
                    {floor.mood}
                  </Badge>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  {floor.tracks.map((track) => (
                    <div 
                      key={track.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
                    >
                      <Button
                        variant={playingTrackId === track.id ? "default" : "outline"}
                        size="icon"
                        className="h-10 w-10 rounded-full shrink-0"
                        onClick={() => playTrack(track.id, track.url)}
                      >
                        {playingTrackId === track.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4 ml-0.5" />
                        )}
                      </Button>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{track.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {track.description}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {track.bpm} BPM
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Guidelines Info */}
        <Card variant="glass" className="max-w-2xl mx-auto">
          <CardContent className="p-6 text-center space-y-3">
            <h3 className="font-semibold">Music Guidelines</h3>
            <p className="text-sm text-muted-foreground">
              All tracks follow the Phototheology Music Standard: no lyrics, sacred cinematic tone, 
              55-70 BPM for memory optimization, warm pads, soft strings, gentle harp, and 
              reverent atmospheres. Designed to support Scripture study without distraction.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
