import { useState, useRef, useEffect, useCallback } from "react";
import { useAudioDucking } from "@/hooks/useAudioDucking";
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
  Lightbulb,
} from "lucide-react";

// Floor-based music categories - Rich orchestral, movie soundtrack style
// The Chosen, Hans Zimmer, Bryan Tyler - No synthesizers, pure orchestra
const MUSIC_FLOORS = [
  {
    floor: 1,
    name: "Story Floor",
    subtitle: "Furnishing",
    icon: BookOpen,
    mood: "Warm strings, gentle narrative",
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    tracks: []
  },
  {
    floor: 2,
    name: "Pattern Floor",
    subtitle: "Investigation",
    icon: Sparkles,
    mood: "Structured strings, reflective",
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    tracks: [
      {
        id: "whispers-of-eternity-study",
        name: "Whispers of Eternity",
        description: "Orchestral with lush strings, epic meditative - perfect for deep study",
        url: "https://cdn1.suno.ai/37b77ba0-4272-4220-a392-16645e9aa9b2.mp3",
        bpm: 60
      }
    ]
  },
  {
    floor: 3,
    name: "Sanctuary Floor",
    subtitle: "Holy Space",
    icon: Building2,
    mood: "Reverent strings, harp",
    color: "from-purple-500/20 to-violet-500/20",
    borderColor: "border-purple-500/30",
    tracks: []
  },
  {
    floor: 4,
    name: "Christ Floor",
    subtitle: "Next Level",
    icon: Cross,
    mood: "Bright, hopeful orchestra",
    color: "from-yellow-500/20 to-amber-500/20",
    borderColor: "border-yellow-500/30",
    tracks: []
  },
  {
    floor: 5,
    name: "Prophecy Floor",
    subtitle: "Vision",
    icon: Eye,
    mood: "Cinematic tension, deep strings",
    color: "from-red-500/20 to-rose-500/20",
    borderColor: "border-red-500/30",
    tracks: []
  },
  {
    floor: 6,
    name: "Freestyle Floor",
    subtitle: "Creative Space",
    icon: Wind,
    mood: "Flowing strings, woodwinds",
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    tracks: []
  },
  {
    floor: 7,
    name: "Wisdom Floor",
    subtitle: "Mastery",
    icon: Lightbulb,
    mood: "Solemn cello, ancient feel",
    color: "from-indigo-500/20 to-purple-500/20",
    borderColor: "border-indigo-500/30",
    tracks: []
  }
];

export default function MusicCategories() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.08);
  const [isMuted, setIsMuted] = useState(false);
  const [duckMultiplier, setDuckMultiplier] = useState(1);

  // Listen for audio ducking events (when TTS is playing)
  useAudioDucking(useCallback((ducked: boolean, duckRatio: number) => {
    setDuckMultiplier(ducked ? duckRatio : 1);
  }, []));

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

  // Apply volume with ducking
  useEffect(() => {
    if (audioRef.current) {
      const effectiveVolume = isMuted ? 0 : volume * duckMultiplier;
      audioRef.current.volume = effectiveVolume;
    }
  }, [volume, isMuted, duckMultiplier]);

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
            Rich orchestral soundscapes for focused Bible study. Inspired by The Chosen, 
            Hans Zimmer, and Bryan Tyler. Pure strings, cello, harp, and gentle brass—no synthesizers. 
            BPM 55-70 for optimal memory and reflection.
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
              Rich orchestral soundscapes inspired by The Chosen, Hans Zimmer, and Bryan Tyler. 
              Pure orchestra: warm strings, cello, harp, gentle brass, woodwinds. 
              No synthesizers. BPM 55-70 for optimal focus and memory retention.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
