import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Headphones, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PODCAST_EPISODES } from "@/data/podcastData";
import { useNavigate } from "react-router-dom";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function FrontPagePodcastPreview() {
  const navigate = useNavigate();
  const episode = PODCAST_EPISODES[0];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    try {
      const audio = new Audio(`/audio/podcast/${episode.audioFile}`);
      audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
      audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
      audio.addEventListener("ended", () => setIsPlaying(false));
      audio.addEventListener("error", () => console.warn("Podcast audio failed to load"));
      audioRef.current = audio;
      return () => {
        audio.pause();
        audio.src = "";
      };
    } catch (e) {
      console.warn("Failed to create audio element", e);
    }
  }, [episode.audioFile]);

  const handlePlayPause = useCallback(async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleSeek = useCallback((value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  }, []);

  return (
    <div className="rounded-2xl border border-primary/20 bg-card/30 backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start gap-4">
        <div
          className="shrink-0 h-14 w-14 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, hsl(271 76% 53%), hsl(271 76% 40%))" }}
        >
          <Headphones className="h-7 w-7 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-1">
            🎧 Phototheology Podcast Episode 1
          </p>
          <h3 className="text-lg font-bold text-foreground leading-snug">
            {episode.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {episode.description}
          </p>
        </div>
      </div>

      {/* Player controls */}
      <div className="px-5 pb-4 space-y-3">
        <div className="flex items-center gap-3">
          <Button
            onClick={handlePlayPause}
            size="icon"
            className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>

          <div className="flex-1 space-y-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : episode.duration}</span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/podcast")}
        >
          View all episodes →
        </Button>
      </div>
    </div>
  );
}
