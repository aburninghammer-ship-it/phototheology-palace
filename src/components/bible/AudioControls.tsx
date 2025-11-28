import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  Settings,
} from "lucide-react";
import { Verse } from "@/types/bible";
import { useBibleAudio } from "@/hooks/useBibleAudio";
import { cn } from "@/lib/utils";

interface AudioControlsProps {
  verses: Verse[];
  onVerseHighlight?: (verseNumber: number) => void;
  className?: string;
}

export const AudioControls = ({ verses, onVerseHighlight, className }: AudioControlsProps) => {
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    isPlaying,
    currentVerse,
    playbackRate,
    availableVoices,
    selectedVoice,
    play,
    pause,
    stop,
    nextVerse,
    previousVerse,
    changePlaybackRate,
    changeVoice,
  } = useBibleAudio(verses, {
    onVerseChange: onVerseHighlight,
  });

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  if (verses.length === 0) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-lg bg-accent/30 border border-accent/20",
      className
    )}>
      {/* Main Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={previousVerse}
          disabled={currentVerse <= 1}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          variant="default"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={() => isPlaying ? pause() : play()}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={nextVerse}
          disabled={currentVerse >= verses.length}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={stop}
        >
          <Square className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Verse Indicator */}
      <div className="flex items-center gap-2 px-2 min-w-[80px]">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">
          v.{currentVerse}/{verses.length}
        </span>
      </div>

      {/* Speed Control */}
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Speed:</span>
        <Select
          value={playbackRate.toString()}
          onValueChange={(value) => changePlaybackRate(parseFloat(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {playbackRates.map((rate) => (
              <SelectItem key={rate} value={rate.toString()}>
                {rate}x
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Settings Popover */}
      <Popover open={showSettings} onOpenChange={setShowSettings}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="end">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Voice</h4>
              <Select
                value={selectedVoice?.name || ""}
                onValueChange={(name) => {
                  const voice = availableVoices.find(v => v.name === name);
                  if (voice) changeVoice(voice);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name.replace(/Microsoft|Google/gi, '').trim()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:hidden">
              <h4 className="font-medium mb-2">Playback Speed</h4>
              <Select
                value={playbackRate.toString()}
                onValueChange={(value) => changePlaybackRate(parseFloat(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {playbackRates.map((rate) => (
                    <SelectItem key={rate} value={rate.toString()}>
                      {rate}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-muted-foreground">
              Tip: Click any verse while playing to jump to it.
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
