import { useState, useRef, useCallback } from "react";
import { Play, Pause, Loader2, RotateCcw, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ProfessorAvatar } from "@/components/master-class/ProfessorAvatar";
import { MASTER_CLASSES } from "@/data/masterClassData";
import { supabase } from "@/integrations/supabase/client";

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

function scriptToTranscript(script: string): string {
  return script
    .replace(/\[long pause\]/gi, "\n---\n")
    .replace(/\[pause\]/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function MasterClassPreview() {
  const navigate = useNavigate();
  const classDef = MASTER_CLASSES[0]; // Class 1 — Introduction
  const { professor } = classDef;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const displayText = scriptToTranscript(classDef.script);
  const paragraphs = displayText.split("\n\n").map(p => p.trim()).filter(Boolean);

  const generateAudio = useCallback(async () => {
    if (audioUrl) return audioUrl;
    setIsGenerating(true);
    setError(null);
    try {
      const cleanText = cleanScriptForTTS(classDef.script);
      const { data, error: fnError } = await supabase.functions.invoke("text-to-speech", {
        body: { text: cleanText, voice: professor.voiceId, returnType: "url", useCache: true },
      });
      if (fnError) throw new Error(fnError.message || "TTS failed");
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
        throw new Error("No audio data");
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
      audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
      audio.addEventListener("durationchange", () => setDuration(audio.duration));
      audio.addEventListener("ended", () => setIsPlaying(false));
      audio.addEventListener("error", () => { setError("Playback error"); setIsPlaying(false); });
      audioRef.current = audio;
    }
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setError("Could not start playback");
    }
  }, [isGenerating, isPlaying, audioUrl, generateAudio]);

  const handleSeek = useCallback((value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 pt-12 pb-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-4">
            <GraduationCap className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Free Preview</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
            Phototheology Master Class
          </h1>
          <p className="text-muted-foreground">
            Listen to the full Introduction — no account required.
          </p>
        </div>
      </div>

      {/* Player */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        <div className="rounded-xl border border-amber-500/20 bg-gradient-to-b from-background to-amber-950/5 overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4 flex items-center gap-4">
            <ProfessorAvatar name={professor.name} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground">{professor.name}</h3>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/70 font-medium">Master Phototheologist</p>
              <p className="text-sm text-muted-foreground">{professor.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">Class 1</Badge>
                <span className="text-xs text-muted-foreground">{classDef.duration}</span>
              </div>
            </div>
          </div>

          <div className="px-6 pb-4">
            <h2 className="text-xl font-bold">{classDef.title}</h2>
            <p className="text-sm text-muted-foreground">{classDef.subtitle}</p>
          </div>

          {/* Controls */}
          <div className="px-6 pb-4 space-y-3">
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePlayPause}
                disabled={isGenerating}
                size="icon"
                className="h-12 w-12 rounded-full bg-amber-600 hover:bg-amber-500 text-white shrink-0"
              >
                {isGenerating ? <Loader2 className="h-6 w-6 animate-spin" /> : isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
              </Button>
              <div className="flex-1 space-y-1">
                <Slider value={[currentTime]} max={duration || 100} step={1} onValueChange={handleSeek} className="cursor-pointer" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{duration > 0 ? formatTime(duration) : classDef.duration}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { if (audioRef.current) { audioRef.current.currentTime = 0; setCurrentTime(0); } }} className="h-8 w-8 shrink-0" disabled={!audioUrl}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {isGenerating && <p className="text-sm text-muted-foreground animate-pulse">Generating audio with {professor.name}'s voice...</p>}
          </div>

          {/* Transcript */}
          <div className="border-t border-border/50">
            <div className="px-6 py-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Transcript</h4>
            </div>
            <ScrollArea className="h-[350px] px-6 pb-6">
              <div className="space-y-4 pr-4">
                {paragraphs.map((para, i) =>
                  para === "---" ? (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <div className="flex-1 h-px bg-border/50" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                      <div className="flex-1 h-px bg-border/50" />
                    </div>
                  ) : (
                    <p key={i} className="text-sm text-foreground/80 leading-relaxed">{para}</p>
                  )
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            This is just Class 1 of 41. Subscribe to unlock the full Master Class — one new class every day.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => navigate("/master-class")} className="bg-amber-600 hover:bg-amber-500 text-white">
              Explore All Classes
            </Button>
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Sign Up Free
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
