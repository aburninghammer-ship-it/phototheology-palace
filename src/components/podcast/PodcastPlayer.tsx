import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { PodcastEpisode } from "@/data/podcastData";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface PodcastPlayerProps {
  episode: PodcastEpisode;
  onClose?: () => void;
}

export function PodcastPlayer({ episode, onClose }: PodcastPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Create / swap audio element when episode changes
  useEffect(() => {
    const audio = new Audio(`/audio/podcast/${episode.audioFile}`);
    audio.playbackRate = playbackRate;
    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("ended", () => setIsPlaying(false));
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode.id]);

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

  const handleSpeedChange = useCallback((rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, []);

  const handleRestart = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  }, []);

  const speedOptions = [0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="w-full rounded-xl border border-violet-500/20 bg-gradient-to-b from-background to-violet-950/5 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs text-violet-500 font-medium mb-1">
            Episode {episode.episodeNumber}{episode.floor ? ` · Floor ${episode.floor}` : ""}
          </p>
          <h3 className="text-lg font-bold text-foreground">{episode.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{episode.description}</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground shrink-0 ml-4">
            Close
          </Button>
        )}
      </div>

      {/* Audio controls */}
      <div className="px-6 pb-6 space-y-3">
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePlayPause}
            size="icon"
            className="h-12 w-12 rounded-full bg-violet-600 hover:bg-violet-500 text-white shrink-0"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
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

          <Button variant="ghost" size="icon" onClick={handleRestart} className="h-8 w-8 shrink-0">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed:</span>
          {speedOptions.map((rate) => (
            <Button
              key={rate}
              variant={playbackRate === rate ? "default" : "outline"}
              size="sm"
              onClick={() => handleSpeedChange(rate)}
              className="h-7 px-2 text-xs"
            >
              {rate}x
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
