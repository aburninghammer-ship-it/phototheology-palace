import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Loader2, RotateCcw, CheckCircle2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ProfessorAvatar } from "./ProfessorAvatar";
import { supabase } from "@/integrations/supabase/client";
import type { MasterClassDef } from "@/data/masterClassData";

interface MasterClassPlayerProps {
  classDef: MasterClassDef;
  isCompleted: boolean;
  onComplete: (classId: string) => void;
  onClose?: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function cleanScriptForTTS(script: string): string {
  return script
    .replace(/\[long pause\]/gi, " ... ... ")
    .replace(/\[pause\]/gi, " ... ")
    .trim();
}

// Convert script to display paragraphs (strip [pause] markers, keep structure)
function scriptToTranscript(script: string): string {
  return script
    .replace(/\[long pause\]/gi, "\n---\n")
    .replace(/\[pause\]/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function MasterClassPlayer({ classDef, isCompleted, onComplete, onClose }: MasterClassPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showReflect, setShowReflect] = useState(false);
  const [completionTriggered, setCompletionTriggered] = useState(false);

  const { professor } = classDef;
  const displayText = classDef.transcript || scriptToTranscript(classDef.script);

  // Track 90% completion
  useEffect(() => {
    if (
      !completionTriggered &&
      !isCompleted &&
      duration > 0 &&
      currentTime > 0 &&
      currentTime / duration >= 0.9
    ) {
      setCompletionTriggered(true);
      onComplete(classDef.id);
      setShowReflect(true);
    }
  }, [currentTime, duration, completionTriggered, isCompleted, classDef.id, onComplete]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const generateAudio = useCallback(async () => {
    if (audioUrl) return audioUrl;
    setIsGenerating(true);
    setError(null);

    try {
      const cleanText = cleanScriptForTTS(classDef.script);
      const { data, error: fnError } = await supabase.functions.invoke("text-to-speech", {
        body: {
          text: cleanText,
          voice: professor.voiceId,
          returnType: "url",
          useCache: true,
        },
      });

      if (fnError) throw new Error(fnError.message || "TTS generation failed");

      let url: string;
      if (data?.audioUrl) {
        url = data.audioUrl;
      } else if (data?.audioContent) {
        const binary = atob(data.audioContent);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: "audio/mpeg" });
        url = URL.createObjectURL(blob);
      } else {
        throw new Error("No audio data received");
      }

      setAudioUrl(url);
      return url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate audio");
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [audioUrl, classDef.script, professor.voiceId]);

  const handlePlayPause = useCallback(async () => {
    if (isGenerating) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    let url = audioUrl;
    if (!url) {
      url = await generateAudio();
      if (!url) return;
    }

    if (!audioRef.current) {
      const audio = new Audio(url);
      audio.playbackRate = playbackRate;
      audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
      audio.addEventListener("durationchange", () => setDuration(audio.duration));
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        if (!completionTriggered && !isCompleted) {
          setCompletionTriggered(true);
          onComplete(classDef.id);
          setShowReflect(true);
        }
      });
      audio.addEventListener("error", () => {
        setError("Audio playback error");
        setIsPlaying(false);
      });
      audioRef.current = audio;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setError("Could not start playback");
    }
  }, [isGenerating, isPlaying, audioUrl, generateAudio, playbackRate, completionTriggered, isCompleted, classDef.id, onComplete]);

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

  // Manual mark complete (for read-along users)
  const handleManualComplete = useCallback(() => {
    if (!isCompleted) {
      setCompletionTriggered(true);
      onComplete(classDef.id);
      setShowReflect(true);
    }
  }, [isCompleted, classDef.id, onComplete]);

  const speedOptions = [0.75, 1, 1.25, 1.5];

  const paragraphs = displayText
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="w-full rounded-xl border border-amber-500/20 bg-gradient-to-b from-background to-amber-950/5 overflow-hidden">
      {/* Reflect prompt overlay */}
      {showReflect && (
        <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-emerald-500/20">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-700 dark:text-emerald-400">
                Class Complete!
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Take a moment to reflect on what you just learned. Consider writing down one key
                insight or practicing the training exercise {professor.name} described. Let this
                class settle before moving to the next one.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => setShowReflect(false)}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-4 flex items-center gap-4">
        <ProfessorAvatar name={professor.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">{professor.name}</h3>
            {(isCompleted || completionTriggered) && (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{professor.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">Class {classDef.classNumber}</Badge>
            <span className="text-xs text-muted-foreground">{classDef.duration}</span>
            {classDef.floorNumber && (
              <Badge variant="secondary" className="text-xs">Floor {classDef.floorNumber}</Badge>
            )}
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground">
            Close
          </Button>
        )}
      </div>

      {/* Class info */}
      <div className="px-6 pb-4">
        <h2 className="text-xl font-bold">{classDef.title}</h2>
        <p className="text-sm text-muted-foreground">{classDef.subtitle}</p>
      </div>

      {/* Audio controls */}
      <div className="px-6 pb-4 space-y-3">
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePlayPause}
            disabled={isGenerating}
            size="icon"
            className="h-12 w-12 rounded-full bg-amber-600 hover:bg-amber-500 text-white shrink-0"
          >
            {isGenerating ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
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
              <span>{duration > 0 ? formatTime(duration) : classDef.duration}</span>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={handleRestart} className="h-8 w-8 shrink-0" disabled={!audioUrl}>
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        {isGenerating && (
          <p className="text-sm text-muted-foreground animate-pulse">
            Generating audio with {professor.name}'s voice...
          </p>
        )}

        {/* Manual complete button (for read-along) */}
        {!isCompleted && !completionTriggered && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualComplete}
            className="text-xs"
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Mark as Read
          </Button>
        )}
      </div>

      {/* Transcript panel */}
      <div className="border-t border-border/50">
        <div className="px-6 py-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Transcript
          </h4>
        </div>
        <ScrollArea className="h-[400px] px-6 pb-6">
          <div className="space-y-4 pr-4">
            {paragraphs.map((para, i) => {
              if (para === "---") {
                return (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-border/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                    <div className="flex-1 h-px bg-border/50" />
                  </div>
                );
              }
              if (/^FLOOR \d/.test(para)) {
                const [title, ...rest] = para.split("\n");
                return (
                  <div key={i}>
                    <h5 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">{title}</h5>
                    {rest.length > 0 && <p className="text-sm text-foreground/80 leading-relaxed">{rest.join("\n")}</p>}
                  </div>
                );
              }
              if (/^\d+\.\s/.test(para)) {
                return <p key={i} className="text-sm text-foreground/80 leading-relaxed pl-4">{para}</p>;
              }
              return <p key={i} className="text-sm text-foreground/80 leading-relaxed">{para}</p>;
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
